(function () {
    function isWideCarouselOpen() {
        const wide = document.getElementById('wide-carousel-overlay');
        return wide && wide.classList.contains('is-open');
    }

    document.addEventListener('click', function (event) {
        const card = event.target.closest && event.target.closest('.process-stage-card');
        if (!card) return;

        // 放大图打开时，不让底层篇章卡误触发。
        if (isWideCarouselOpen()) return;

        const title = (card.dataset && card.dataset.processTitle) || '';
        if (!['筹备篇', '驻军篇', '融合篇', '建成篇'].includes(title)) return;

        // 阻止后面的全局“外部点击关闭/大图拦截”逻辑抢事件。
        event.preventDefault();
        event.stopPropagation();
        if (event.stopImmediatePropagation) event.stopImmediatePropagation();

        // 先关闭旧层叠图，避免遮住二级页。
        const oldLightbox = document.getElementById('fusion-image-lightbox');
        if (oldLightbox) {
            oldLightbox.classList.remove('is-open', 'is-dual', 'is-stack-swapping', 'is-multi');
            oldLightbox.setAttribute('aria-hidden', 'true');
            oldLightbox.style.display = 'none';
            oldLightbox.style.visibility = 'hidden';
            oldLightbox.style.pointerEvents = 'none';
        }

        // 直接走原来的二级页打开函数。
        if (typeof window.openProcessDetail === 'function') {
            window.openProcessDetail(card);
            return;
        }

        // 兜底：如果原函数没暴露，至少触发卡片原本 click，不让完全没反应。
        setTimeout(function () {
            card.dispatchEvent(new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            }));
        }, 0);
    }, true);
})();







