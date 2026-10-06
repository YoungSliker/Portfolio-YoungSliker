/* v150：真正的不卡顿乒乓循环。
   注意：这里不是让普通 背景.mp4 倒放，而是播放一个已经合成好的文件：
   主界面/背景_pingpong.mp4
   这个文件内容必须是：背景.mp4 正放 + 背景.mp4 倒放。
*/
(function () {
    const video = document.getElementById('bg12-video');
    if (!video) return;

    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.playbackRate = 1;

    function shouldPlay() {
        const wrapper = document.getElementById('bg-3d-wrapper');
        if (wrapper && wrapper.classList.contains('expanded-bg13')) return false;
        if (typeof currentActivePage !== 'undefined' && currentActivePage !== 'home') return false;
        return true;
    }

    function syncVideo() {
        if (!shouldPlay()) {
            try { video.pause(); } catch (e) {}
            return;
        }

        if (video.paused) {
            const p = video.play();
            if (p && typeof p.catch === 'function') p.catch(() => {});
        }
    }

    video.addEventListener('canplay', syncVideo);
    video.addEventListener('loadeddata', syncVideo);
    video.addEventListener('error', function () {
        console.warn('没有找到 主界面/背景_pingpong.mp4。这个文件必须先由 背景.mp4 正放+倒放 合成出来。');
    });

    setInterval(syncVideo, 1000);

    if (video.readyState >= 2) {
        syncVideo();
    }
})();







