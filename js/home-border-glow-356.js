(function () {
    function easeOutCubic(x) {
        return 1 - Math.pow(1 - x, 3);
    }

    function easeInCubic(x) {
        return x * x * x;
    }

    function animateValue({ start = 0, end = 100, duration = 1000, delay = 0, ease = easeOutCubic, onUpdate, onEnd }) {
        const t0 = performance.now() + delay;

        function tick() {
            const elapsed = performance.now() - t0;
            const t = Math.min(elapsed / duration, 1);
            onUpdate(start + (end - start) * ease(t));
            if (t < 1) requestAnimationFrame(tick);
            else if (onEnd) onEnd();
        }

        setTimeout(() => requestAnimationFrame(tick), delay);
    }

    function getCenterOfElement(el) {
        const { width, height } = el.getBoundingClientRect();
        return [width / 2, height / 2];
    }

    function getEdgeProximity(el, x, y) {
        const [cx, cy] = getCenterOfElement(el);
        const dx = x - cx;
        const dy = y - cy;
        let kx = Infinity;
        let ky = Infinity;

        if (dx !== 0) kx = cx / Math.abs(dx);
        if (dy !== 0) ky = cy / Math.abs(dy);

        return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
    }

    function getCursorAngle(el, x, y) {
        const [cx, cy] = getCenterOfElement(el);
        const dx = x - cx;
        const dy = y - cy;
        if (dx === 0 && dy === 0) return 0;

        let degrees = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        if (degrees < 0) degrees += 360;
        return degrees;
    }

    function playIntroSweep(card) {
        const angleStart = 110;
        const angleEnd = 465;

        card.classList.add('sweep-active');
        card.style.setProperty('--cursor-angle', `${angleStart}deg`);

        animateValue({
            duration: 500,
            onUpdate: (value) => card.style.setProperty('--edge-proximity', value.toFixed(3))
        });

        animateValue({
            ease: easeInCubic,
            duration: 1500,
            end: 50,
            onUpdate: (value) => {
                card.style.setProperty('--cursor-angle', `${((angleEnd - angleStart) * (value / 100) + angleStart).toFixed(3)}deg`);
            }
        });

        animateValue({
            ease: easeOutCubic,
            delay: 1500,
            duration: 2250,
            start: 50,
            end: 100,
            onUpdate: (value) => {
                card.style.setProperty('--cursor-angle', `${((angleEnd - angleStart) * (value / 100) + angleStart).toFixed(3)}deg`);
            }
        });

        animateValue({
            ease: easeInCubic,
            delay: 2500,
            duration: 1500,
            start: 100,
            end: 0,
            onUpdate: (value) => card.style.setProperty('--edge-proximity', value.toFixed(3)),
            onEnd: () => card.classList.remove('sweep-active')
        });
    }

    function initHomeBorderGlow() {
        const card = document.getElementById('bg12-video-mask');
        if (!card || card.dataset.borderGlowReady === 'true') return;

        card.dataset.borderGlowReady = 'true';

        if (!card.querySelector(':scope > .edge-light')) {
            const edge = document.createElement('span');
            edge.className = 'edge-light';
            edge.setAttribute('aria-hidden', 'true');
            card.insertBefore(edge, card.firstChild);
        }

        card.addEventListener('pointermove', (event) => {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const edge = getEdgeProximity(card, x, y);
            const angle = getCursorAngle(card, x, y);

            card.style.setProperty('--edge-proximity', `${(edge * 100).toFixed(3)}`);
            card.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`);
        });

        playIntroSweep(card);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHomeBorderGlow, { once: true });
    } else {
        initHomeBorderGlow();
    }
})();
