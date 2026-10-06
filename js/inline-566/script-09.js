(function () {
    function hideBg13Img() {
        const bg13Img = document.getElementById('bg13-img');
        if (bg13Img) bg13Img.style.setProperty('display', 'none', 'important');
    }

    document.addEventListener('click', function (e) {
        const target = e.target;
        if (!target || !target.closest) return;

        if (target.closest('#logo') || target.closest('[onclick*="resetHome"]')) {
            setTimeout(hideBg13Img, 40);
        }
    }, true);

    window.addEventListener('load', function () {
        const wrapper = document.getElementById('bg-3d-wrapper');
        if (!wrapper || !wrapper.classList.contains('expanded-bg13')) {
            hideBg13Img();
        }
    });
})();







