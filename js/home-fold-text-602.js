(function () {
    const title = document.querySelector('.home-design-title');
    const face = title && title.querySelector('.home-depth-text__face');
    if (!title || !face) return;

    const text = (face.textContent || '').trim();
    if (!text) return;

    face.setAttribute('aria-label', text);
    face.innerHTML = Array.from(text).map(function (char, index) {
        const safeChar = char === ' ' ? '&nbsp;' : char;
        return '<span class="fold-text-segment" aria-hidden="true">' +
            '<span class="fold-text-piece" data-fold-hinge="top" style="--fold-delay:' + (index * 45) + 'ms">' +
            safeChar +
            '</span></span>';
    }).join('');

    const pieces = Array.from(face.querySelectorAll('.fold-text-piece'));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let activeAnimations = [];
    let finishTimer = 0;
    let runAlternate = false;

    function playHomeFoldText() {
        activeAnimations.forEach(function (animation) {
            animation.cancel();
        });
        activeAnimations = [];
        window.clearTimeout(finishTimer);

        runAlternate = !runAlternate;
        title.classList.remove('fold-run-a', 'fold-run-b');
        title.classList.add('is-folding', runAlternate ? 'fold-run-a' : 'fold-run-b');

        const duration = reducedMotion ? 220 : 650;
        const stagger = reducedMotion ? 20 : 45;
        const startRotation = reducedMotion ? 0 : -92;

        pieces.forEach(function (piece, index) {
            piece.style.setProperty('--fold-delay', (index * stagger) + 'ms');
            const animation = piece.animate([
                {
                    opacity: 0,
                    transform: 'rotateX(' + startRotation + 'deg)',
                    filter: reducedMotion ? 'none' : 'brightness(0.48)',
                    offset: 0
                },
                {
                    opacity: 1,
                    transform: 'rotateX(0deg)',
                    filter: 'brightness(1)',
                    offset: 1
                }
            ], {
                duration: duration,
                delay: index * stagger,
                easing: reducedMotion ? 'cubic-bezier(.25, .46, .45, .94)' : 'cubic-bezier(.22, 1, .36, 1)',
                fill: 'both'
            });
            activeAnimations.push(animation);
        });

        const totalDuration = duration + Math.max(0, pieces.length - 1) * stagger;
        finishTimer = window.setTimeout(function () {
            title.classList.remove('is-folding');
        }, totalDuration - 80);
    }

    window.playHomeFoldText = playHomeFoldText;
})();