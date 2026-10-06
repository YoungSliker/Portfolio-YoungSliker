/* v280：建成篇「主场景·大盛魁」改为与「副场景·实业厂群」同款缩略图 wide-carousel 展示 */
(function () {
    const dsImages = [
        'AIGC/绥远方志/建成篇/建成篇-大盛魁1.jpg',
        'AIGC/绥远方志/建成篇/建成篇-大盛魁2.jpg',
        'AIGC/绥远方志/建成篇/建成篇-大盛魁3.jpg',
        'AIGC/绥远方志/建成篇/建成篇-大盛魁4.jpg'
    ];

    const dsLabels = [
        '01 导航UI',
        '02 大盛魁主街视角',
        '03 大盛魁正门',
        '04 大盛魁整体鸟瞰'
    ];

    function isDashengkuiTitle(text) {
        const t = (text || '').replace(/\s+/g, '');
        return t.includes('主场景·大盛魁') || t.includes('大盛魁');
    }

    function parseImages(card) {
        if (!card) return dsImages.slice();
        const raw = card.dataset ? card.dataset.fusionFullImages : '';
        if (!raw) return dsImages.slice();
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length) return parsed.filter(Boolean);
        } catch (err) {}
        return dsImages.slice();
    }

    function applyDsLabelsOnce() {
        const title = document.getElementById('wide-carousel-title');
        if (!title || !isDashengkuiTitle(title.textContent)) return;

        const thumbs = document.getElementById('wide-carousel-thumbs');
        if (!thumbs) return;

        Array.from(thumbs.children).forEach(function (thumb, index) {
            const labelText = dsLabels[index] || (String(index + 1).padStart(2, '0') + ' 大盛魁展示图');
            const label =
                thumb.querySelector('.wide-carousel-thumb-title') ||
                thumb.querySelector('.thumb-title') ||
                thumb.querySelector('span:last-child');

            if (label) label.textContent = labelText;
            thumb.setAttribute('aria-label', labelText);
            thumb.setAttribute('title', labelText);

            const img = thumb.querySelector('img');
            if (img) img.alt = labelText;
        });

        const mainImg = document.getElementById('wide-carousel-main-img');
        const active = thumbs.querySelector('.wide-carousel-thumb.is-active');
        if (mainImg && active) {
            const activeLabel = active.getAttribute('title') || active.getAttribute('aria-label');
            if (activeLabel) mainImg.alt = activeLabel;
        }
    }

    document.addEventListener('click', function (event) {
        const card = event.target.closest && event.target.closest('.process-fusion-hero.process-fusion-clickable');
        if (!card) return;

        const showcase = document.getElementById('process-inline-copy-card');
        const title = (
            (card.dataset.fusionFullTitle || '') + ' ' +
            (card.textContent || '') + ' ' +
            (document.getElementById('fusion-hero-title')?.textContent || '')
        ).replace(/\s+/g, '');

        const isJiancheng = showcase && showcase.classList.contains('is-jiancheng-showcase');
        const isDs = title.includes('大盛魁');

        if (!isJiancheng || !isDs || typeof window.openWideCarousel !== 'function') return;

        event.preventDefault();
        event.stopPropagation();
        if (event.stopImmediatePropagation) event.stopImmediatePropagation();

        const oldLightbox = document.getElementById('fusion-image-lightbox');
        if (oldLightbox) {
            oldLightbox.classList.remove('is-open', 'is-dual', 'is-multi', 'is-stack-swapping');
            oldLightbox.setAttribute('aria-hidden', 'true');
            oldLightbox.style.display = 'none';
            oldLightbox.style.visibility = 'hidden';
            oldLightbox.style.pointerEvents = 'none';
        }

        window.openWideCarousel({
            chapter: '建成篇',
            title: '主场景 · 大盛魁',
            desc: '以大盛魁为核心，展示商帮经营与经济转型的关键空间。',
            images: parseImages(card)
        });

        requestAnimationFrame(function () {
            applyDsLabelsOnce();
            setTimeout(applyDsLabelsOnce, 80);
            setTimeout(applyDsLabelsOnce, 180);
        });
    }, true);
})();







