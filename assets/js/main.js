document.addEventListener('DOMContentLoaded', () => {
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
});
