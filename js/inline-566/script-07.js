        (function () {
            const lib = window.anime || {};
            if (typeof lib.animate !== 'function') return;

            const section = document.querySelector('.hardware328-section');
            if (!section) return;

            const title = section.querySelector('.section-title-gold');
            const blocks = section.querySelectorAll('.hardware328-copy, .hardware328-main, .hardware347-process-line, .hardware347-chain-line, .hardware328-circuit, .hardware328-shell, .hardware328-build');
            const tags = section.querySelectorAll('.hardware328-tags span, .hardware328-shell-tabs button, .hardware347-process-line li, .hardware347-chain-line li');

            function playHardwareAnime() {
                if (section.dataset.hardwareAnimePlayed === 'true') return;
                section.dataset.hardwareAnimePlayed = 'true';

                lib.animate(title, {
                    opacity: [0, 1],
                    x: [-28, 0],
                    filter: ['blur(8px)', 'blur(0px)'],
                    duration: 820,
                    ease: 'outCubic'
                });

                lib.animate(blocks, {
                    opacity: [0, 1],
                    y: [36, 0],
                    scale: [0.985, 1],
                    filter: ['blur(10px)', 'blur(0px)'],
                    duration: 980,
                    delay: lib.stagger(105),
                    ease: 'outCubic'
                });

                lib.animate(tags, {
                    opacity: [0, 1],
                    y: [12, 0],
                    duration: 760,
                    delay: lib.stagger(46, { start: 360 }),
                    ease: 'outCubic'
                });
            }

            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver(entries => {
                    if (entries.some(entry => entry.isIntersecting)) {
                        playHardwareAnime();
                        observer.disconnect();
                    }
                }, { threshold: 0.18 });
                observer.observe(section);
            } else {
                playHardwareAnime();
            }
        })();
    







