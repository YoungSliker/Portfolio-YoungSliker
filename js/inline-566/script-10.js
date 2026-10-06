/* v277：建成篇「副场景·集二十二省之奇货」强制使用实业厂群同款缩略图 wide-carousel */
(function () {
    function parseImages(card) {
        if (!card) return [];
        if (card.dataset.fusionFullImages) {
            try {
                const parsed = JSON.parse(card.dataset.fusionFullImages);
                if (Array.isArray(parsed) && parsed.length) return parsed.filter(Boolean);
            } catch (err) {}
        }
        return [
            'AIGC/绥远方志/建成篇/建成篇-二十二1.jpg',
            'AIGC/绥远方志/建成篇/建成篇-二十二2.jpg',
            'AIGC/绥远方志/建成篇/建成篇-二十二3.jpg',
            'AIGC/绥远方志/建成篇/建成篇-二十二4.jpg',
            'AIGC/绥远方志/建成篇/建成篇-二十二5.jpg',
            'AIGC/绥远方志/建成篇/建成篇-二十二6.jpg',
            'AIGC/绥远方志/建成篇/建成篇-二十二7.jpg',
            'AIGC/绥远方志/建成篇/建成篇-二十二8.jpg'
        ];
    }

    document.addEventListener('click', function (event) {
        const card = event.target.closest && event.target.closest('.process-fusion-market.process-fusion-clickable');
        if (!card) return;

        const showcase = document.getElementById('process-inline-copy-card');
        const title = (
            (card.dataset.fusionFullTitle || '') + ' ' +
            (card.textContent || '') + ' ' +
            (document.getElementById('fusion-market-title')?.textContent || '')
        ).replace(/\s+/g, '');

        const isJiancheng = showcase && showcase.classList.contains('is-jiancheng-showcase');
        const isJiTwentyTwo = title.includes('集二十二省之奇货') || title.includes('二十二省') || title.includes('奇货');

        if (!isJiancheng || !isJiTwentyTwo || typeof window.openWideCarousel !== 'function') return;

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
            title: '副场景 · 集二十二省之奇货',
            desc: '进入大盛魁靠近段履庄了解大盛魁巅峰时期的繁荣与兴盛。',
            images: parseImages(card)
        });
    }, true);
})();







