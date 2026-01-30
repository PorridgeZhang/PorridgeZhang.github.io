// Basic script to justify images in a row with equal heights
function justifyGalleries() {
    const rows = document.querySelectorAll('.gallery-row');
    const containerWidth = document.querySelector('.container').clientWidth; // Or closest parent
    const targetHeight = 200; // Target height for rows

    rows.forEach(row => {
        const items = Array.from(row.children);
        if (items.length === 0) return;

        // Reset
        items.forEach(item => {
            item.style.width = '';
            item.style.flex = '';
        });

        // We can use a simple flex-grow strategy with aspect ratios.
        // Each item needs 'flex-grow: aspect_ratio'

        items.forEach(item => {
            const img = item.querySelector('img, video');
            if (img) {
                // Wait for load if not ready? For now assume dimensions available or handle load
                if (img.tagName === 'VIDEO') {
                    // Videos might need metadata loaded
                    // For now set a default aspect ratio if unknown or rely on CSS
                }
            }
        });

        // Actually, the CSS flex-grow trick:
        // wrapper { display: flex; flex-wrap: wrap; }
        // item { height: 15rem; flex-grow: 1; }
        // item img { height: 100%; width: auto; min-width: 100%; object-fit: cover; }
        // This crops. User wants NO CROP.

        // "Natural" Justified Layout (Flickr style) algorithm:
        // 1. Get aspect ratios of all images.
        // 2. Add images to a row until total width > container width.
        // 3. Calculate exact height needed to make them fit perfectly.

        // Since we are in the browser, we can let Flexbox do the heavy lifting IF we set flex-grow proportional to aspect ratio.
        // item { flex-grow: [ASPECT RATIO]; flex-basis: [ASPECT RATIO * BASE_HEIGHT]px; }

        // Let's implement that.
    });

    // REVISED SIMPLE APPROACH: Flexbox with aspect-ratio based flex-grow.
    // We need to calculate aspect ratio for each image.

    document.querySelectorAll('.gallery-item').forEach(item => {
        const media = item.querySelector('img, video');

        const setFlex = () => {
            let w = media.videoWidth || media.naturalWidth;
            let h = media.videoHeight || media.naturalHeight;

            if (w && h) {
                const ar = w / h;
                item.style.flexGrow = ar;
                item.style.flexBasis = (ar * 150) + 'px'; // 150px base height
            }
        };

        if (media.tagName === 'IMG') {
            if (media.complete) setFlex();
            else media.onload = setFlex;
        } else if (media.tagName === 'VIDEO') {
            if (media.readyState >= 1) setFlex();
            else media.onloadedmetadata = setFlex;
        }
    });
}

window.addEventListener('load', justifyGalleries);
window.addEventListener('resize', justifyGalleries);
