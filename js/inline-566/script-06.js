        (function () {
            const lib = window.anime || {};
            if (typeof lib.animate !== 'function') return;

            const section = document.querySelector('.description-anime-section');
            if (!section) return;

            const box = section.querySelector('.description-anime-box');
            const title = section.querySelector('.section-title-gold');
            const text = section.querySelector('.detail-light');
            if (!box || !title || !text) return;

            function playDescriptionAnime() {
                if (section.dataset.descriptionAnimePlayed === 'true') return;
                section.dataset.descriptionAnimePlayed = 'true';

                box.classList.add('is-description-sweeping');

                lib.animate(box, {
                    opacity: [0, 1],
                    y: [34, 0],
                    scale: [0.985, 1],
                    filter: ['blur(12px) saturate(0.86)', 'blur(0px) saturate(1)'],
                    duration: 980,
                    ease: 'outCubic'
                });

                lib.animate(title, {
                    opacity: [0, 1],
                    y: [18, 0],
                    letterSpacing: ['0.18em', '0.06em'],
                    filter: ['blur(8px)', 'blur(0px)'],
                    duration: 820,
                    delay: 150,
                    ease: 'outCubic'
                });

                lib.animate(text, {
                    opacity: [0, 1],
                    y: [24, 0],
                    filter: ['blur(7px)', 'blur(0px)'],
                    duration: 900,
                    delay: 340,
                    ease: 'outCubic'
                });
            }

            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver(entries => {
                    if (entries.some(entry => entry.isIntersecting)) {
                        playDescriptionAnime();
                        observer.disconnect();
                    }
                }, { threshold: 0.26 });
                observer.observe(section);
            } else {
                playDescriptionAnime();
            }
        })();
    







