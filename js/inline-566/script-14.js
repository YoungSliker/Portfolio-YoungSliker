/* v284：根据当前 wide-carousel 标题，只给运输场景加宽标题框 */
(function () {
    function isTransportTitle(text) {
        return (text || "").replace(/\s+/g, "").includes("草原丝路鼎盛时期的运输场景");
    }

    function syncTransportTitleClass(options) {
        const overlay = document.getElementById("wide-carousel-overlay");
        if (!overlay) return;

        const titleFromOption = options && options.title;
        const titleFromDom = document.getElementById("wide-carousel-title")?.textContent || "";
        overlay.classList.toggle("is-transport-title", isTransportTitle(titleFromOption || titleFromDom));
    }

    function patchOpenWideCarousel() {
        if (typeof window.openWideCarousel !== "function" || window.openWideCarousel.__transportTitlePatched) return;

        const originalOpenWideCarousel = window.openWideCarousel;
        const patched = function (options) {
            syncTransportTitleClass(options);
            originalOpenWideCarousel.call(this, options);
            requestAnimationFrame(function () {
                syncTransportTitleClass(options);
            });
        };

        patched.__transportTitlePatched = true;
        window.openWideCarousel = patched;
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", patchOpenWideCarousel);
    } else {
        patchOpenWideCarousel();
    }
})();







