(function () {
    const overlay = document.getElementById('wide-carousel-overlay');
    const thumbs = document.getElementById('wide-carousel-thumbs');
    if (!overlay || !thumbs) return;

    function hardCleanThumbStyles() {
        overlay.querySelectorAll('.wide-carousel-active-frame').forEach(el => el.remove());
        overlay.querySelectorAll(
            '.wide-carousel-thumb, .wide-carousel-thumb-img, .wide-carousel-thumb-img-inner, .wide-carousel-thumb img'
        ).forEach(el => {
            el.style.border = '0';
            el.style.outline = '0';
            el.style.outlineOffset = '0';
            el.style.boxShadow = 'none';
        });
    }

    function scrollActiveIntoView(index) {
        const item = thumbs.children[index];
        if (!item) return;

        const maxScroll = Math.max(0, thumbs.scrollWidth - thumbs.clientWidth);
        const viewLeft = thumbs.scrollLeft;
        const viewRight = viewLeft + thumbs.clientWidth;
        const itemLeft = item.offsetLeft;
        const itemRight = itemLeft + item.offsetWidth;
        const gap = 24;

        let target = viewLeft;
        if (itemLeft - gap < viewLeft) {
            target = itemLeft - gap;
        } else if (itemRight + gap > viewRight) {
            target = itemRight + gap - thumbs.clientWidth;
        }

        thumbs.scrollTo({
            left: Math.max(0, Math.min(maxScroll, target)),
            behavior: 'smooth'
        });
    }

    thumbs.addEventListener('click', function (event) {
        const thumb = event.target.closest('.wide-carousel-thumb');
        if (!thumb || !thumbs.contains(thumb)) return;

        const index = Array.from(thumbs.children).indexOf(thumb);
        if (index < 0 || typeof window.setWideCarouselImage !== 'function') return;

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation?.();

        window.setWideCarouselImage(index);
        requestAnimationFrame(() => {
            hardCleanThumbStyles();
            scrollActiveIntoView(index);
        });
        setTimeout(hardCleanThumbStyles, 160);
    }, true);

    const shell = overlay.querySelector('.wide-carousel-thumbs-shell');
    if (shell) {
        let locked = false;
        shell.addEventListener('wheel', function (event) {
            const d = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
            if (Math.abs(d) < 6) return;

            event.preventDefault();
            event.stopPropagation();

            if (locked) return;
            locked = true;

            const step = Math.max(260, thumbs.clientWidth * .65);
            thumbs.scrollBy({
                left: d > 0 ? step : -step,
                behavior: 'smooth'
            });

            setTimeout(() => { locked = false; }, 180);
        }, { passive: false, capture: true });
    }

    new MutationObserver(hardCleanThumbStyles).observe(thumbs, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'aria-current', 'style']
    });

    hardCleanThumbStyles();
})();







