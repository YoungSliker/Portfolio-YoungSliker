function setupLengths() {
    document.querySelectorAll('#bg11-2026-layer .num-line').forEach((path) => {
        const length = path.getTotalLength();
        path.style.setProperty('--len', length);
    });
}

function replay() {
    

    document.body.classList.remove('home2026-finished');
    document.body.classList.add('home2026-replay');

    requestAnimationFrame(() => {
        document.body.classList.remove('home2026-replay');
    });
}

window.addEventListener('DOMContentLoaded', () => {
    setupLengths();

    setTimeout(() => {
        document.body.classList.add('home2026-finished');
    }, 4200);
});





// v273：鼠标划到「2026」上方时，重新进入线条进场动画状态
(function () {
    function initHome2026HoverReplay() {
        const layer = document.getElementById('bg11-2026-layer');
        if (!layer || typeof replay !== 'function') return;

        let replayLock = false;

        layer.addEventListener('mouseenter', function () {
            if (replayLock) return;
            replayLock = true;

            // 重新进入初始绘制状态
            document.body.classList.remove('home2026-finished');
            document.body.classList.add('home2026-replay');

            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    document.body.classList.remove('home2026-replay');
                    replay();
                });
            });

            setTimeout(function () {
                replayLock = false;
            }, 350);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHome2026HoverReplay);
    } else {
        initHome2026HoverReplay();
    }
})();
