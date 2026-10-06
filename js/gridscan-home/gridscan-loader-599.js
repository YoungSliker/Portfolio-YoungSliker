(function () {
    let loaded = false;

    function loadGridScan() {
        if (loaded || !document.getElementById('home-gridscan-root')) return;
        loaded = true;
        const script = document.createElement('script');
        script.src = 'js/gridscan-home/gridscan-home-566.js';
        script.async = true;
        document.body.appendChild(script);
    }

    function scheduleGridScan() {
        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(loadGridScan, { timeout: 1800 });
        } else {
            window.setTimeout(loadGridScan, 650);
        }
    }

    if (document.readyState === 'complete') {
        scheduleGridScan();
    } else {
        window.addEventListener('load', scheduleGridScan, { once: true });
    }
})();
