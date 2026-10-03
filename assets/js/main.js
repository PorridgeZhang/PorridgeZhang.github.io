document.addEventListener('DOMContentLoaded', () => {
    setupNavigationHighlight();
    setupLazyVideos();
});

function setupNavigationHighlight() {
    const navLinks = [...document.querySelectorAll('.primary-nav a')];
    const sections = navLinks
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
        const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        navLinks.forEach((link) => {
            const isActive = link.getAttribute('href') === `#${visible.target.id}`;
            link.classList.toggle('is-active', isActive);
            if (isActive) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
    }, {
        rootMargin: '-18% 0px -64% 0px',
        threshold: [0, 0.2, 0.5]
    });

    sections.forEach((section) => observer.observe(section));
}

function setupLazyVideos() {
    const videos = [...document.querySelectorAll('.gallery-item video')];
    if (!videos.length) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const saveData = navigator.connection && navigator.connection.saveData;

    const prepareVideo = (video) => {
        if (video.dataset.loaded === 'true') return;

        video.dataset.loaded = 'true';
        video.preload = saveData ? 'metadata' : 'auto';
        video.load();
    };

    const playVideo = (video) => {
        if (reducedMotion.matches || document.hidden) {
            video.pause();
            return;
        }

        prepareVideo(video);
        const playAttempt = video.play();

        if (playAttempt) {
            playAttempt.catch(() => {
                video.pause();
            });
        }
    };

    if (!('IntersectionObserver' in window)) {
        videos.forEach(playVideo);
        return;
    }

    const loadObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            prepareVideo(entry.target);
            observer.unobserve(entry.target);
        });
    }, {
        rootMargin: '1200px 320px',
        threshold: 0
    });

    const playbackObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const video = entry.target;
            video.dataset.inViewport = entry.isIntersecting ? 'true' : 'false';

            if (entry.isIntersecting) playVideo(video);
            else video.pause();
        });
    }, {
        rootMargin: '160px 0px',
        threshold: 0.01
    });

    videos.forEach((video) => {
        video.controls = false;
        video.dataset.loaded = 'false';
        video.dataset.inViewport = 'false';
        loadObserver.observe(video);
        playbackObserver.observe(video);
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            videos.forEach((video) => video.pause());
            return;
        }

        videos
            .filter((video) => video.dataset.inViewport === 'true')
            .forEach(playVideo);
    });

    const handleMotionPreference = (event) => {
        videos.forEach((video) => {
            if (event.matches) {
                video.pause();
            } else if (video.dataset.inViewport === 'true') {
                playVideo(video);
            }
        });
    };

    if (reducedMotion.addEventListener) {
        reducedMotion.addEventListener('change', handleMotionPreference);
    } else {
        reducedMotion.addListener(handleMotionPreference);
    }
}
