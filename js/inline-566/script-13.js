/* v282：融合篇三组图片更新，并统一改为实业厂群同款缩略图 wide-carousel 展示 */
(function () {
    const fusionCarouselMap = {
        hero: {
            selector: '.process-fusion-hero.process-fusion-clickable',
            title: '主场景 · 市井聚落',
            desc: '描绘市井聚落中的商贸往来与生活场景。',
            images: [
                'AIGC/绥远方志/融合篇/融合篇-市井1.jpg',
                'AIGC/绥远方志/融合篇/融合篇-3.png',
                'AIGC/绥远方志/融合篇/融合篇-市井2.jpg',
                'AIGC/绥远方志/融合篇/融合篇-市井3.jpg',
                'AIGC/绥远方志/融合篇/融合篇-市井4.jpg',
                'AIGC/绥远方志/融合篇/融合篇-市井5.jpg',
                'AIGC/绥远方志/融合篇/融合篇-市井6.jpg',
                'AIGC/绥远方志/融合篇/融合篇-市井7.jpg'
            ],
            labels: ['01 市井聚落入口','02 市井聚落街景','03 市井聚落商铺','04 市井聚落摊位','05 市井聚落行旅','06 市井聚落人群','07 市井聚落街巷','08 市井聚落全景']
        },
        town: {
            selector: '.process-fusion-town.process-fusion-clickable',
            title: '副场景 · 草原丝路鼎盛时期的运输场景',
            desc: '展现商队运输、驼队行进与草原丝路商贸流动。',
            images: [
                'AIGC/绥远方志/融合篇/融合篇-商队1.jpg',
                'AIGC/绥远方志/融合篇/融合篇-商队2.jpg',
                'AIGC/绥远方志/融合篇/融合篇-商队3.jpg',
                'AIGC/绥远方志/融合篇/融合篇-商队4.jpg',
                'AIGC/绥远方志/融合篇/融合篇-商队5.jpg',
                'AIGC/绥远方志/融合篇/融合篇-商队6.jpg'
            ],
            labels: ['01 商队远景','02 商队行进','03 驼队运输','04 草原丝路','05 货运队列','06 商队全景']
        },
        market: {
            selector: '.process-fusion-market.process-fusion-clickable',
            title: '副场景 · 走西口驼队',
            desc: '以走西口驼队为核心，表现迁徙、运输与商贸联结。',
            images: [
                'AIGC/绥远方志/融合篇/融合篇-4.png',
                'AIGC/绥远方志/融合篇/融合篇-5.png',
                'AIGC/绥远方志/融合篇/融合篇-6.png'
            ],
            labels: ['01 走西口驼队','02 驼队行进','03 驼队全景']
        }
    };

    let currentFusionLabels = null;

    function isFusionShowcase() {
        const showcase = document.getElementById('process-inline-copy-card');
        return showcase && showcase.classList.contains('is-fusion-transport-merged-showcase');
    }

    function applyFusionLabelsOnce() {
        if (!currentFusionLabels) return;
        const thumbs = document.getElementById('wide-carousel-thumbs');
        if (!thumbs) return;

        Array.from(thumbs.children).forEach(function (thumb, index) {
            const labelText = currentFusionLabels[index] || (String(index + 1).padStart(2, '0') + ' 展示图');
            const label = thumb.querySelector('.wide-carousel-thumb-title') || thumb.querySelector('.thumb-title') || thumb.querySelector('span:last-child');
            if (label) label.textContent = labelText;
            thumb.setAttribute('aria-label', labelText);
            thumb.setAttribute('title', labelText);
            const img = thumb.querySelector('img');
            if (img) img.alt = labelText;
        });
    }

    document.addEventListener('click', function (event) {
        if (!isFusionShowcase() || typeof window.openWideCarousel !== 'function') return;

        let config = null;
        Object.keys(fusionCarouselMap).some(function (key) {
            const item = fusionCarouselMap[key];
            if (event.target.closest && event.target.closest(item.selector)) {
                config = item;
                return true;
            }
            return false;
        });

        if (!config) return;

        event.preventDefault();
        event.stopPropagation();
        if (event.stopImmediatePropagation) event.stopImmediatePropagation();

        currentFusionLabels = config.labels.slice();

        const oldLightbox = document.getElementById('fusion-image-lightbox');
        if (oldLightbox) {
            oldLightbox.classList.remove('is-open', 'is-dual', 'is-multi', 'is-stack-swapping');
            oldLightbox.setAttribute('aria-hidden', 'true');
            oldLightbox.style.display = 'none';
            oldLightbox.style.visibility = 'hidden';
            oldLightbox.style.pointerEvents = 'none';
        }

        window.openWideCarousel({
            chapter: '融合篇',
            title: config.title,
            desc: config.desc,
            images: config.images.slice()
        });

        requestAnimationFrame(function () {
            applyFusionLabelsOnce();
            setTimeout(applyFusionLabelsOnce, 80);
            setTimeout(applyFusionLabelsOnce, 180);
        });
    }, true);
})();







