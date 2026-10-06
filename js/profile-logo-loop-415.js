(function () {
    function initLogoLoop(loop) {
        const track = loop.querySelector('.logoloop__track');
        const sourceList = track?.querySelector('.logoloop__list');
        if (!track || !sourceList) return;

        const speed = Number(loop.dataset.speed || 82);

        function rebuild() {
            track.querySelectorAll('.logoloop__list[aria-hidden="true"]').forEach(list => list.remove());

            const sequenceWidth = Math.ceil(sourceList.getBoundingClientRect().width);
            const viewportWidth = Math.ceil(loop.getBoundingClientRect().width);
            if (!sequenceWidth || !viewportWidth) return;

            const copiesNeeded = Math.max(2, Math.ceil(viewportWidth / sequenceWidth) + 3);
            for (let i = 1; i < copiesNeeded; i += 1) {
                const clone = sourceList.cloneNode(true);
                clone.setAttribute('aria-hidden', 'true');
                clone.querySelectorAll('a').forEach(link => {
                    link.setAttribute('tabindex', '-1');
                    link.classList.add('cursor-target');
                });
                track.appendChild(clone);
            }

            loop.style.setProperty('--logoloop-distance', `${sequenceWidth}px`);
            loop.style.setProperty('--logoloop-duration', `${Math.max(10, sequenceWidth / speed)}s`);
        }

        const images = sourceList.querySelectorAll('img');
        let pending = images.length;
        const imageReady = () => {
            pending -= 1;
            if (pending <= 0) rebuild();
        };

        if (!pending) {
            rebuild();
        } else {
            images.forEach(img => {
                if (img.complete) {
                    imageReady();
                } else {
                    img.addEventListener('load', imageReady, { once: true });
                    img.addEventListener('error', imageReady, { once: true });
                }
            });
        }

        if ('ResizeObserver' in window) {
            const observer = new ResizeObserver(rebuild);
            observer.observe(loop);
            observer.observe(sourceList);
        } else {
            window.addEventListener('resize', rebuild);
        }
    }

    function init() {
        const shell = document.getElementById('imagesDiv');
        const wrapper = document.getElementById('bg-3d-wrapper');
        if (shell && (!wrapper || !wrapper.classList.contains('expanded-bg13'))) {
            shell.classList.remove('visible');
        }
        document.querySelectorAll('[data-logo-loop]').forEach(initLogoLoop);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
