
// v319：通用页面动效增强：使用 anime-4.4.1/dist/bundles/anime.umd.min.js
(function () {
    let animeEffectsInitialized = false;
    function getAnimeAPI() {
        const lib = window.anime || {};
        if (typeof lib.animate !== 'function') return null;
        return lib;
    }

    function splitDesignTitle() {
        const title = document.querySelector('.home-design-title');
        if (!title || title.dataset.animeSplit === 'true') return;

        const text = (title.textContent || '').trim();
        if (!text) return;

        title.innerHTML = Array.from(text).map(function (char) {
            return '<span class="home-design-title-char">' + char + '</span>';
        }).join('');

        title.dataset.animeSplit = 'true';
    }

    function playDesignTitleEntrance() {
        if (typeof window.playHomeFoldText === 'function') {
            window.playHomeFoldText();
            return;
        }

        const anime = getAnimeAPI();
        if (!anime) return;

        splitDesignTitle();

        const title = document.querySelector('.home-design-title');
        const chars = document.querySelectorAll('.home-design-title-char');
        if (!title || !chars.length) return;

        title.classList.add('is-anime-ready');

        anime.animate(title, {
            opacity: [0, 1],
            filter: ['blur(8px)', 'blur(0px)'],
            duration: 520,
            ease: 'outCubic'
        });

        anime.animate(chars, {
            opacity: [0, 1],
            y: ['0.62em', '0em'],
            rotate: [-5, 0],
            scale: [0.86, 1],
            duration: 880,
            delay: anime.stagger(72, { from: 'center' }),
            ease: 'outBack'
        });
    }

    function replayDesignTitleEntrance() {
        if (typeof window.playHomeFoldText === 'function') {
            window.playHomeFoldText();
            return;
        }

        const title = document.querySelector('.home-design-title');
        const chars = document.querySelectorAll('.home-design-title-char');

        if (title) {
            title.classList.remove('is-anime-ready');
            title.style.opacity = '';
            title.style.filter = '';
        }

        chars.forEach(function (char) {
            char.style.opacity = '';
            char.style.transform = '';
        });

        requestAnimationFrame(playDesignTitleEntrance);
    }

    function animateCardsEntrance() {
        const anime = getAnimeAPI();
        if (!anime) return;

        const cards = document.querySelectorAll('.card-base, .process-stage-card');
        if (!cards.length) return;

        anime.animate(cards, {
            opacity: [0, 1],
            y: [42, 0],
            scale: [0.92, 1],
            duration: 900,
            delay: anime.stagger(65, { from: 'center' }),
            ease: 'outBack'
        });
    }

    function bindElasticCardHover() {
        const anime = getAnimeAPI();
        if (!anime) return;

        const selector = '.card-base, .process-stage-card, .process-fusion-img-card';
        document.querySelectorAll(selector).forEach(function (card) {
            if (card.dataset.animeElasticBound === 'true') return;
            card.dataset.animeElasticBound = 'true';

            card.addEventListener('mouseenter', function () {
                anime.animate(card, {
                    scale: 1.035,
                    y: -7,
                    duration: 420,
                    ease: 'outBack'
                });
            });

            card.addEventListener('mouseleave', function () {
                anime.animate(card, {
                    scale: 1,
                    y: 0,
                    duration: 520,
                    ease: 'outElastic'
                });
            });

            card.addEventListener('click', function () {
                anime.animate(card, {
                    scale: [1.035, 0.985, 1],
                    duration: 520,
                    ease: 'outBack'
                });
            });
        });
    }

    function animateExpandedPanels() {
        const anime = getAnimeAPI();
        if (!anime) return;

        const panels = document.querySelectorAll(
            '.process-inline-detail.is-open .process-fusion-showcase, ' +
            '.process-inline-detail.is-open .process-inline-card, ' +
            '#wide-carousel-overlay.is-open .wide-carousel-panel, ' +
            '#fusion-image-lightbox.is-open .fusion-lightbox-content'
        );

        panels.forEach(function (panel) {
            if (panel.dataset.animePanelPlayed === 'true') return;
            panel.dataset.animePanelPlayed = 'true';

            anime.animate(panel, {
                opacity: [0, 1],
                scale: [0.88, 1],
                y: [34, 0],
                duration: 720,
                ease: 'outBack'
            });
        });
    }

    function prepareSvgLines(forceReset) {
        const paths = document.querySelectorAll(
            '.process-timeline-svg path, .process-timeline-svg line, .process-timeline-svg polyline, ' +
            '#home svg path, #home svg line, #home svg polyline, ' +
            '.num-line'
        );

        paths.forEach(function (path) {
            if (path.dataset.animeLinePrepared === 'true' && !forceReset) return;
            if (typeof path.getTotalLength !== 'function') return;

            let length = 0;
            try {
                length = path.getTotalLength();
            } catch (err) {
                return;
            }

            if (!length || !isFinite(length)) return;

            path.dataset.animeLinePrepared = 'true';
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
            path.style.opacity = 1;

            // 时间轴线条如果没有显式 stroke，强制给一个可见描边，避免“动画跑了但看不到”
            if (path.closest && path.closest('.process-timeline-svg')) {
                const computedStroke = window.getComputedStyle(path).stroke;
                if (!computedStroke || computedStroke === 'none' || computedStroke === 'rgba(0, 0, 0, 0)') {
                    path.style.stroke = 'rgba(255, 226, 156, 0.9)';
                }
                path.style.strokeLinecap = 'round';
                path.style.strokeLinejoin = 'round';
            }
        });
    }

    function playSvgLineGrowth(scope) {
        const anime = getAnimeAPI();
        if (!anime) return;

        const root = scope || document;

        // 每次播放前把目标范围内的线条收回，再播放，保证滚动到「设计过程」时能看到生长过程
        prepareSvgLines(true);

        const lines = root.querySelectorAll
            ? root.querySelectorAll('[data-anime-line-prepared="true"]')
            : document.querySelectorAll('[data-anime-line-prepared="true"]');

        if (lines.length) {
            anime.animate(lines, {
                strokeDashoffset: [function (el) {
                    try {
                        return el.getTotalLength ? el.getTotalLength() : 0;
                    } catch (err) {
                        return 0;
                    }
                }, 0],
                duration: 2100,
                delay: anime.stagger(90),
                ease: 'inOutCubic'
            });
        }
    }



    function prepareProcessTimelineRects(svg) {
        if (!svg) return;

        const rects = svg.querySelectorAll('rect');
        rects.forEach(function (rect) {
            if (!rect.dataset.originalWidth) {
                rect.dataset.originalWidth = rect.getAttribute('width') || '0';
            }
            if (!rect.dataset.originalX) {
                rect.dataset.originalX = rect.getAttribute('x') || '0';
            }

            rect.setAttribute('width', '0');
            rect.setAttribute('x', rect.dataset.originalX);
            rect.style.opacity = rect.getAttribute('opacity') || '1';
        });

        const circles = svg.querySelectorAll('.process-timeline-node circle');
        circles.forEach(function (circle) {
            if (!circle.dataset.originalR) {
                circle.dataset.originalR = circle.getAttribute('r') || '0';
            }
            circle.setAttribute('r', '0');
            circle.style.opacity = '0';
        });
    }

    function playProcessTimelineRects(svg) {
        const anime = getAnimeAPI();
        if (!anime || !svg) return;

        const rects = svg.querySelectorAll('rect');
        const circles = svg.querySelectorAll('.process-timeline-node circle');

        if (rects.length) {
            anime.animate(rects, {
                width: [0, function (el) {
                    return Number(el.dataset.originalWidth || el.getAttribute('width') || 0);
                }],
                duration: 1650,
                delay: anime.stagger(110),
                ease: 'inOutCubic'
            });
        }

        if (circles.length) {
            anime.animate(circles, {
                r: [0, function (el) {
                    return Number(el.dataset.originalR || el.getAttribute('r') || 0);
                }],
                opacity: [0, function (el) {
                    return Number(el.getAttribute('opacity') || 1);
                }],
                duration: 720,
                delay: anime.stagger(42, { from: 'center', start: 760 }),
                ease: 'outBack'
            });
        }
    }

    function observeProcessTimelineSvg() {
        const timelineSvgs = document.querySelectorAll('.process-timeline-svg');
        if (!timelineSvgs.length) return;

        timelineSvgs.forEach(function (svg) {
            if (svg.dataset.animeTimelineObserved === 'true') return;
            svg.dataset.animeTimelineObserved = 'true';
            svg.dataset.animeTimelinePlayed = 'false';

            // 先预设为收起状态，等用户真正滑到这里再播放
            prepareSvgLines(true);
            prepareProcessTimelineRects(svg);

            if (!('IntersectionObserver' in window)) {
                svg.addEventListener('mouseenter', function () {
                    playSvgLineGrowth(svg);
                });
                return;
            }

            const observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.28) {
                        if (svg.dataset.animeTimelinePlayed !== 'true') {
                            svg.dataset.animeTimelinePlayed = 'true';
                            setTimeout(function () {
                                prepareProcessTimelineRects(svg);
                                playProcessTimelineRects(svg);
                                playSvgLineGrowth(svg);
                            }, 180);
                        }
                    } else if (!entry.isIntersecting) {
                        // 滑走后重置，下次回到「设计过程」还能再看到线条生长
                        svg.dataset.animeTimelinePlayed = 'false';
                        prepareSvgLines(true);
                        prepareProcessTimelineRects(svg);
                    }
                });
            }, {
                root: null,
                threshold: [0, 0.28, 0.55],
                rootMargin: '0px 0px -12% 0px'
            });

            observer.observe(svg);
        });
    }

    function bindClickReplays() {
        document.addEventListener('click', function (event) {
            const target = event.target;
            if (!target || !target.closest) return;

            const isHomeNavigation =
                target.closest('#logo') ||
                target.closest('[onclick*="resetHome"]');

            if (isHomeNavigation) {
                setTimeout(replayDesignTitleEntrance, 120);
                return;
            }

            if (
                target.closest('#bg12-video-mask') ||
                target.closest('.process-stage-card') ||
                target.closest('.card-base')
            ) {
                setTimeout(function () {
                    bindElasticCardHover();
                    observeProcessTimelineSvg();
                    animateExpandedPanels();
                }, 120);

                setTimeout(animateExpandedPanels, 420);
            }
        }, true);
    }

    function initAnimeEffects() {
        if (animeEffectsInitialized || !getAnimeAPI()) return;
        animeEffectsInitialized = true;

        splitDesignTitle();
        playDesignTitleEntrance();
        animateCardsEntrance();
        bindElasticCardHover();
        observeProcessTimelineSvg();
        bindClickReplays();

        setTimeout(bindElasticCardHover, 600);
        setTimeout(animateExpandedPanels, 600);
    }

    window.initAnimeEffects = initAnimeEffects;
    window.replayAnimeDesignTitle = replayDesignTitleEntrance;
    window.playAnimeSvgLineGrowth = playSvgLineGrowth;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAnimeEffects);
    } else {
        initAnimeEffects();
    }

    window.addEventListener('load', function () {
        initAnimeEffects();
        setTimeout(observeProcessTimelineSvg, 260);
    });
})();


// v318：已排除 scheme-stack-card，避免影响「方案设计」原有卡片堆叠/拖拽逻辑
window.animeSchemeStackCardExcluded = true;


// v320：设计过程时间轴改为进入视口后再播放
// 解决用户滑到「设计过程」时，SVG 线条生长动画已经提前播完的问题。
window.animeTimelineSvgObserverEnabled = true;


// v321：设计过程时间轴主线是 rect，不是 path/line。
// 已改为进入视口后动画 rect.width，并同步弹出节点圆点。
window.animeTimelineRectGrowthEnabled = true;
