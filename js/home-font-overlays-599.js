// v218：首页覆盖层最终清理版
// 负责：字体加载、首页覆盖层动画重播、背景1.1真实可见宽度测量。

(function () {
    function replayHomeOverlayAnimations() {
        const animNodes = document.querySelectorAll(
            '.bg12-left-decor-square, .bg12-line-mask, .bg12-three-squares .bg12-square-unit, .bg12-art-text, #bg12-img-02'
        );
        if (!animNodes.length) return;

        animNodes.forEach(function (node) {
            node.style.animation = 'none';
        });

        requestAnimationFrame(function () {
            animNodes.forEach(function (node) {
                node.style.animation = '';
            });
        });
    }

    function updateBg11RealWidth() {
        const bg11 = document.getElementById('bg11');
        if (!bg11) return;

        const img = bg11.querySelector('img');
        if (!img) return;

        const box = bg11.getBoundingClientRect();
        if (!box.width || !box.height) return;

        let realWidth = box.width;

        if (img.naturalWidth && img.naturalHeight) {
            const naturalRatio = img.naturalWidth / img.naturalHeight;
            const boxRatio = box.width / box.height;

            if (naturalRatio > boxRatio) {
                realWidth = box.width;
            } else {
                realWidth = box.height * naturalRatio;
            }
        }

        document.documentElement.style.setProperty('--bg11-real-width', `${realWidth}px`);
    }

    function initHomeOverlays() {
        const overlay = document.querySelector('.bg12-font-overlays');
        if (overlay) overlay.dataset.ready = 'true';

        const whiteStrip = document.querySelector('.bg12-white-strip');
        if (whiteStrip) whiteStrip.dataset.ready = 'true';

        if (document.fonts && document.fonts.load) {
            document.fonts.load('18px "ZiZhiQuXiMaiTi"').catch(function () {});
        }

        updateBg11RealWidth();
        replayHomeOverlayAnimations();
    }

    window.updateBg11RealWidth = updateBg11RealWidth;
    window.replayBg12ThreeSquaresAnimation = replayHomeOverlayAnimations;

    window.addEventListener('load', function () {
        updateBg11RealWidth();
        replayHomeOverlayAnimations();
    });

    window.addEventListener('resize', updateBg11RealWidth);

    document.addEventListener('DOMContentLoaded', initHomeOverlays);

    if (document.readyState !== 'loading') {
        initHomeOverlays();
    }

    const bg11Img = document.querySelector('#bg11 img');
    if (bg11Img) {
        if (bg11Img.complete) {
            updateBg11RealWidth();
        } else {
            bg11Img.addEventListener('load', updateBg11RealWidth, { once: true });
        }
    }

    document.addEventListener('click', function (e) {
        const target = e.target;
        if (!target || !target.closest) return;

        const clickedHome =
            target.closest('#logo') ||
            target.closest('[onclick*="resetHome"]');

        if (clickedHome) {
            setTimeout(function () {
                updateBg11RealWidth();
                replayHomeOverlayAnimations();
            }, 80);
        }
    }, true);

    requestAnimationFrame(updateBg11RealWidth);
    setTimeout(updateBg11RealWidth, 300);
})();

// v234：视频后方点阵图层动画重播
(function () {
    function replayHomeDotMatrixAnimation() {
        const dots = document.querySelectorAll('#bg12-dot-layer .home-dot-matrix');
        if (!dots.length) return;

        dots.forEach(function (node) {
            node.style.animation = 'none';
        });

        requestAnimationFrame(function () {
            dots.forEach(function (node) {
                node.style.animation = '';
            });
        });
    }

    function syncHomeDotLayerVisibility() {
        const layer = document.getElementById('bg12-dot-layer');
        const wrapper = document.getElementById('bg-3d-wrapper');
        if (!layer || !wrapper) return;

        layer.style.display = wrapper.classList.contains('expanded-bg13') ? 'none' : '';
    }

    window.replayHomeDotMatrixAnimation = replayHomeDotMatrixAnimation;
    window.syncHomeDotLayerVisibility = syncHomeDotLayerVisibility;

    window.addEventListener('load', function () {
        syncHomeDotLayerVisibility();
        replayHomeDotMatrixAnimation();
    });

    document.addEventListener('click', function (e) {
        const target = e.target;
        if (!target || !target.closest) return;

        if (target.closest('#logo') || target.closest('[onclick*="resetHome"]')) {
            setTimeout(function () {
                syncHomeDotLayerVisibility();
                replayHomeDotMatrixAnimation();
            }, 100);
        }

        if (target.closest('#bg12-video-mask')) {
            setTimeout(syncHomeDotLayerVisibility, 120);
        }
    }, true);
})();

// bg11 日期提示：鼠标划到「背景1.1.png」时显示当前日期和随机吉祥话
(function () {
    function getTodayText() {
        const now = new Date();
        return (now.getMonth() + 1) + '月' + now.getDate() + '号';
    }

    function getBlessingText() {
        const lines = [
            '祝你今天也元气满满！',
            '愿今天灵感顺顺利利！',
            '今天也要闪闪发光！',
            '愿好运轻轻落在你身边！',
            '祝你今天一路顺风！',
            '愿今天的努力都有回响！',
            '保持好心情，万事皆可期！',
            '愿今天的小事都很顺心！',
            '愿今天的灵感像星光一样冒出来！',
            '祝你今天效率加倍，心情加糖！',
            '愿每一步都刚好走在好运上！',
            '今天也要被温柔和幸运包围！',
            '祝你创作顺利，灵感不断！',
            '愿今天的小惊喜准时出现！',
            '保持热爱，好事正在靠近！',
            '祝你今天一路开挂，顺顺当当！',
            '愿所有卡住的地方都突然通了！',
            '今天也要轻松一点，快乐一点！',
        ];

        return lines[Math.floor(Math.random() * lines.length)];
    }

    function getWhiteStripStartPoint() {
        const strip =
            document.querySelector('.bg12-white-strip') ||
            document.getElementById('主页文字组') ||
            document.getElementById('bg12-content');

        if (!strip) {
            return { x: window.innerWidth / 2, y: window.innerHeight * 0.28 };
        }

        const rect = strip.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }

    function initBg11CursorDate() {
        const tooltip = document.getElementById('bg11-cursor-date');
        const wrapper = document.getElementById('bg11');

        if (!tooltip || !wrapper) return;

        let visible = false;
        let enterTimer = null;

        function targetTransform(e) {
            const offsetX = 14;
            const offsetY = 22;
            return 'translate3d(' + (e.clientX + offsetX) + 'px, ' + (e.clientY + offsetY) + 'px, 0) scale(1)';
        }

        function setTooltipContent() {
            tooltip.innerHTML =
                '<span class="bg11-date-main">' + getTodayText() + '</span>' +
                '<span class="bg11-date-blessing">' + getBlessingText() + '</span>';
        }

        function move(e) {
            if (!visible) return;
            tooltip.style.transform = targetTransform(e);
        }

        function show(e) {
            clearTimeout(enterTimer);

            const start = getWhiteStripStartPoint();

            setTooltipContent();
            tooltip.classList.remove('is-following');
            tooltip.classList.add('is-visible');
            visible = true;

            tooltip.style.transform =
                'translate3d(' + start.x + 'px, ' + start.y + 'px, 0) scale(0.82)';

            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    if (!visible) return;
                    tooltip.style.transform = targetTransform(e);
                });
            });

            enterTimer = setTimeout(function () {
                if (!visible) return;
                tooltip.classList.add('is-following');
            }, 270);
        }

        function hide() {
            clearTimeout(enterTimer);
            visible = false;
            tooltip.classList.remove('is-visible');
            tooltip.classList.remove('is-following');
            tooltip.style.transform = 'translate3d(-9999px, -9999px, 0) scale(0.82)';
        }

        wrapper.addEventListener('mouseenter', show);
        wrapper.addEventListener('mousemove', move);
        wrapper.addEventListener('mouseleave', hide);
        wrapper.addEventListener('click', hide);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBg11CursorDate);
    } else {
        initBg11CursorDate();
    }
})();



// v291：重播首页「设计作品集」入场动画
(function () {
    function replayHomeDesignTitle() {
        const title = document.querySelector('.home-design-title');
        if (!title) return;

        const animationTarget = title.querySelector('.home-depth-text__entrance') || title;
        animationTarget.style.animation = 'none';
        requestAnimationFrame(function () {
            animationTarget.style.animation = '';
        });
    }

    window.replayHomeDesignTitle = replayHomeDesignTitle;

    window.addEventListener('load', function () {
        replayHomeDesignTitle();
    });

    document.addEventListener('click', function (e) {
        const target = e.target;
        if (!target || !target.closest) return;

        if (target.closest('#logo') || target.closest('[onclick*="resetHome"]')) {
            setTimeout(replayHomeDesignTitle, 100);
        }
    }, true);
})();


// v296：设计作品集字间距已减小 10px
(function () {
    window.homeDesignTitleLetterSpacingAdjusted = true;
})();


// v299：设计作品集字间距继续缩减 15px
(function () {
    window.homeDesignTitleLetterSpacingMinus35 = true;
})();


// v316：背景01已移除，首页标题保留在主页文字组内
(function () {
    window.homeBg01Removed = true;
})();
// v585：首页「设计作品集」清晰前表面 + 克制纵深效果
(function () {
    const root = document.querySelector('[data-home-depth-text]');
    const stage = root?.querySelector('[data-home-depth-stage]');
    const face = stage?.querySelector('.home-depth-text__face');
    if (!root || !stage || !face) return;

    const layerCount = 13;
    const layerDepth = 2.4;
    const tilt = 7.5;
    const smoothing = 0.3;
    const orbitSpeed = 0.3;
    const faceColor = [248, 250, 252];
    const depthColor = [217, 61, 96];
    const baseRotation = { x: -tilt * 0.32, y: tilt * 0.42 };

    for (let layerIndex = 0; layerIndex < layerCount; layerIndex++) {
        const index = layerCount - layerIndex;
        const progress = index / layerCount;
        const eased = progress * progress;
        const faceMix = (1 - eased) * 0.72 + 0.04;
        const color = faceColor.map((channel, colorIndex) =>
            Math.round(channel * faceMix + depthColor[colorIndex] * (1 - faceMix))
        );
        const layer = document.createElement('span');
        layer.className = 'home-depth-text__layer';
        layer.setAttribute('aria-hidden', 'true');
        layer.textContent = face.textContent;
        layer.style.color = `rgb(${color.join(', ')})`;
        layer.style.transform = `translateZ(${-index * layerDepth}px)`;
        stage.insertBefore(layer, face);
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const current = { ...baseRotation };
    const target = { ...baseRotation };
    const startTime = performance.now();
    let activePointer = false;

    function applyTransform() {
        stage.style.transform = `rotateX(${current.x.toFixed(3)}deg) rotateY(${current.y.toFixed(3)}deg)`;
    }

    if (reducedMotion) {
        applyTransform();
        return;
    }

    function handlePointerMove(event) {
        const rect = root.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        activePointer = true;
        const x = Math.max(-1, Math.min(1, (event.clientX - (rect.left + rect.width / 2)) / (rect.width * 0.8)));
        const y = Math.max(-1, Math.min(1, (event.clientY - (rect.top + rect.height / 2)) / (rect.height * 0.8)));
        target.x = baseRotation.x - y * tilt;
        target.y = baseRotation.y + x * tilt;
    }

    function handlePointerLeave() {
        activePointer = false;
        target.x = baseRotation.x;
        target.y = baseRotation.y;
    }

    if (finePointer) {
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerleave', handlePointerLeave);
        window.addEventListener('blur', handlePointerLeave);
    }

    function tick(now) {
        if (!finePointer || !activePointer) {
            const orbit = ((now - startTime) / 1000) * orbitSpeed * Math.PI * 2;
            const orbitAmount = finePointer ? 0.18 : 0.55;
            target.x = baseRotation.x + Math.sin(orbit) * tilt * orbitAmount;
            target.y = baseRotation.y + Math.cos(orbit * 0.85) * tilt * orbitAmount;
        }

        current.x += (target.x - current.x) * smoothing;
        current.y += (target.y - current.y) * smoothing;
        applyTransform();
        window.requestAnimationFrame(tick);
    }

    applyTransform();
    window.requestAnimationFrame(tick);
})();
