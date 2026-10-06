/* v279：修复「集二十二省之奇货」点击卡死；轻量设置缩略图标题，不再使用 MutationObserver */
(function () {
    const jiImages = [
        "AIGC/绥远方志/建成篇/建成篇-二十二1.jpg",
        "AIGC/绥远方志/建成篇/建成篇-二十二2.jpg",
        "AIGC/绥远方志/建成篇/建成篇-二十二3.jpg",
        "AIGC/绥远方志/建成篇/建成篇-二十二4.jpg",
        "AIGC/绥远方志/建成篇/建成篇-二十二5.jpg",
        "AIGC/绥远方志/建成篇/建成篇-二十二6.jpg",
        "AIGC/绥远方志/建成篇/建成篇-二十二7.jpg",
        "AIGC/绥远方志/建成篇/建成篇-二十二8.jpg"
    ];

    const jiLabels = [
        "01 大盛魁东侧鸟瞰",
        "02 奇物-蒙靴 皮艺",
        "03 奇物-蒙靴 皮艺 马具",
        "04 奇物-药材 玉器",
        "05 大盛魁西侧鸟瞰",
        "06 奇物-茶叶 烟 纺织",
        "07 奇物-铁器 木器 银器",
        "08 奇物-药制品 糕点"
    ];

    function isJiTitle(text) {
        const t = (text || "").replace(/\s+/g, "");
        return t.includes("集二十二省之奇货") || t.includes("二十二省") || t.includes("奇货");
    }

    function applyJiLabelsOnce() {
        const title = document.getElementById("wide-carousel-title");
        if (!title || !isJiTitle(title.textContent)) return;

        const thumbs = document.getElementById("wide-carousel-thumbs");
        if (!thumbs) return;

        Array.from(thumbs.children).forEach(function (thumb, index) {
            const labelText = jiLabels[index] || (String(index + 1).padStart(2, "0") + " 奇物展示");

            const label =
                thumb.querySelector(".wide-carousel-thumb-title") ||
                thumb.querySelector(".wide-carousel-thumb-label") ||
                thumb.querySelector(".wide-carousel-thumb-caption") ||
                thumb.querySelector(".wide-carousel-thumb-name") ||
                thumb.querySelector(".wide-carousel-thumb-text") ||
                thumb.querySelector(".thumb-title") ||
                thumb.querySelector(".thumb-caption") ||
                thumb.querySelector("span:last-child");

            if (label && label.textContent !== labelText) {
                label.textContent = labelText;
            }

            thumb.setAttribute("aria-label", labelText);
            thumb.setAttribute("title", labelText);
        });
    }

    function patchOpenWideCarousel() {
        const originalOpenWideCarousel = window.openWideCarousel;
        if (typeof originalOpenWideCarousel !== "function" || originalOpenWideCarousel.__jiSafePatched) return;

        const patched = function (options) {
            const isJi = options && isJiTitle(options.title);
            if (isJi) {
                options = Object.assign({}, options, { images: jiImages.slice() });
            }

            originalOpenWideCarousel.call(this, options);

            if (isJi) {
                requestAnimationFrame(function () {
                    applyJiLabelsOnce();
                    setTimeout(applyJiLabelsOnce, 80);
                });
            }
        };

        patched.__jiSafePatched = true;
        window.openWideCarousel = patched;
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", patchOpenWideCarousel);
    } else {
        patchOpenWideCarousel();
    }
})();







