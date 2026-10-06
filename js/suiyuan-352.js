(function () {
    function getAnime() {
        var lib = window.anime || {};
        return typeof lib.animate === 'function' ? lib : null;
    }

    function onReady(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    function isVisibleInDetail(el, offset) {
        if (!el) return false;
        var rect = el.getBoundingClientRect();
        var viewHeight = window.innerHeight || document.documentElement.clientHeight;
        return rect.top < viewHeight * (offset || 0.82) && rect.bottom > viewHeight * 0.1;
    }

    function observeOnce(target, callback, options) {
        if (!target) return;
        if (!('IntersectionObserver' in window)) {
            callback();
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            if (entries.some(function (entry) { return entry.isIntersecting; })) {
                observer.disconnect();
                callback();
            }
        }, options || { threshold: 0.2 });

        observer.observe(target);
    }

    function animateHeader() {
        var anime = getAnime();
        var header = document.querySelector('.detail-header');
        if (!header || header.dataset.suiyuan351HeaderPlayed === 'true') return;
        header.dataset.suiyuan351HeaderPlayed = 'true';

        var eyebrow = header.querySelector('p');
        var title = header.querySelector('h1');
        var line = header.querySelector('.w-64');
        var hint = header.querySelector('.detail-scroll-hint');
        var targets = [eyebrow, title, line, hint].filter(Boolean);

        targets.forEach(function (el) {
            el.dataset.suiyuan351Anim = 'true';
        });

        if (!anime) {
            targets.forEach(function (el) { el.style.opacity = '1'; });
            return;
        }

        anime.animate(eyebrow, {
            opacity: [0, 1],
            y: [18, 0],
            filter: ['blur(8px)', 'blur(0px)'],
            duration: 720,
            ease: 'outCubic'
        });

        anime.animate(title, {
            opacity: [0, 1],
            y: [32, 0],
            scale: [0.965, 1],
            filter: ['blur(12px)', 'blur(0px)'],
            duration: 980,
            delay: 120,
            ease: 'outCubic'
        });

        anime.animate(line, {
            opacity: [0, 0.3],
            scaleX: [0, 1],
            duration: 980,
            delay: 430,
            ease: 'inOutCubic'
        });

        anime.animate(hint, {
            opacity: [0, 1],
            y: [18, 0],
            duration: 760,
            delay: 680,
            ease: 'outCubic'
        });
    }

    function animateProcessCards() {
        var anime = getAnime();
        var section = document.querySelector('.design-process-section');
        var cards = document.querySelectorAll('.process-stage-card');
        if (!section || !cards.length || section.dataset.suiyuan351ProcessPlayed === 'true') return;
        section.dataset.suiyuan351ProcessPlayed = 'true';

        cards.forEach(function (card) {
            card.dataset.suiyuan351Anim = 'true';
            card.style.opacity = '0';
            card.style.transform = 'translateY(62px) scale(0.9)';
            card.style.filter = 'blur(14px) saturate(0.82)';
        });

        if (!anime) return;

        anime.animate(cards, {
            opacity: [0, 1],
            y: [62, 0],
            scale: [0.88, 1],
            rotate: [-2.2, 0],
            filter: ['blur(14px) saturate(0.82)', 'blur(0px) saturate(1)'],
            duration: 1080,
            delay: anime.stagger(150),
            ease: 'outBack'
        });
    }

    function typeDescription() {
        var text = document.querySelector('.description-typewriter-text');
        if (!text || text.dataset.suiyuan351Typed === 'true') return;
        text.dataset.suiyuan351Typed = 'true';

        var fullText = text.dataset.fullText || (text.textContent || '').trim();
        text.dataset.fullText = fullText;
        text.innerHTML = '<span class="text-type__content"></span><span class="text-type__cursor">|</span>';

        var content = text.querySelector('.text-type__content');
        var cursor = text.querySelector('.text-type__cursor');
        var index = 0;
        var punctuation = '。；：，、！？,.!?;:';

        text.classList.add('is-typewriting');
        if (cursor) cursor.setAttribute('aria-hidden', 'true');

        function getDelay(char) {
            if (punctuation.indexOf(char) >= 0) return 120;
            return 30 + Math.round(Math.random() * 28);
        }

        function step() {
            index += 1;
            if (content) content.textContent = fullText.slice(0, index);

            if (index < fullText.length) {
                window.setTimeout(step, getDelay(fullText.charAt(index - 1)));
            } else {
                text.classList.remove('is-typewriting');
            }
        }

        window.setTimeout(step, 320);
    }

    function bindDetailScrollChecks() {
        var detail = document.getElementById('project-detail');
        if (!detail || detail.dataset.suiyuan351ScrollBound === 'true') return;
        detail.dataset.suiyuan351ScrollBound = 'true';

        function check() {
            var processSection = document.querySelector('.design-process-section');
            var descriptionSection = document.querySelector('.description-anime-section');
            if (isVisibleInDetail(processSection, 0.78)) animateProcessCards();
            if (isVisibleInDetail(descriptionSection, 0.82)) typeDescription();
        }

        detail.addEventListener('scroll', check, { passive: true });
        document.addEventListener('click', function () {
            window.setTimeout(check, 260);
            window.setTimeout(check, 900);
        }, true);
        window.setTimeout(check, 600);
    }

    function init() {
        var header = document.querySelector('.detail-header');
        var processSection = document.querySelector('.design-process-section');
        var descriptionSection = document.querySelector('.description-anime-section');

        observeOnce(header, animateHeader, { threshold: 0.35 });
        observeOnce(processSection, animateProcessCards, { threshold: 0.22, rootMargin: '0px 0px -10% 0px' });
        observeOnce(descriptionSection, typeDescription, { threshold: 0.28 });
        bindDetailScrollChecks();
    }

    onReady(init);
    window.addEventListener('load', init);
})();
