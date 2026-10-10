(() => {
    'use strict';

    const ASSET_ROOT = '主界面/mobile-static/';
    const STATES = {
        home: 'home-ui.webp',
        profile: 'profile-ui.webp',
        works: 'works-ui.webp',
        aigc: 'aigc-ui.webp',
        creative: 'creative-ui.webp'
    };
    const captureState = new URLSearchParams(location.search).get('capture');
    const phoneMedia = matchMedia('(max-height: 500px) and (orientation: landscape)');

    function showPage(id) {
        if (typeof window.showPage === 'function') window.showPage(id);
    }

    function closeNativeMenu() {
        const toggle = document.getElementById('youngNavToggle');
        if (toggle?.getAttribute('aria-expanded') === 'true') toggle.click();
    }

    function captureSetup(state) {
        document.documentElement.classList.add('mobile-static-capture');
        const activate = () => {
            if (state === 'profile') {
                window.handleBg12Click?.();
                const signature = document.getElementById('textDiv');
                const signatureHost = signature?.parentElement;
                const portfolioMark = signatureHost?.querySelector('.animate-pulse');
                if (signature) {
                    // Replace the deferred live particle string with the
                    // deterministic export-only signature below.
                    signature.style.setProperty('display', 'none', 'important');
                }
                if (portfolioMark) {
                    portfolioMark.style.setProperty('display', 'none', 'important');
                }
                // The live particle copy is intentionally deferred by the
                // original profile animation.  It is unreliable in a
                // headless still export, so place an identical readable
                // signature in the capture document itself.
                const exportSignature = document.createElement('div');
                exportSignature.className = 'mobile-static-export-signature';
                exportSignature.innerHTML = '<span>探索AI、创意与交互的边界；我是 <b>[翟杨阳]</b></span><small>PORTFOLIO 2026</small>';
                document.body.append(exportSignature);
            } else if (state === 'works') {
                const nav = document.getElementById('nav');
                const toggle = document.getElementById('youngNavToggle');
                if (nav) nav.style.display = 'flex';
                if (toggle?.getAttribute('aria-expanded') !== 'true') toggle?.click();
            } else if (STATES[state] && state !== 'home') {
                showPage(state);
            }
            document.documentElement.dataset.mobileStaticCapture = state;
            window.__mobileStaticCaptureReady = true;
        };

        if (document.readyState === 'complete') setTimeout(activate, 0);
        else window.addEventListener('load', () => setTimeout(activate, 0), { once: true });
    }

    if (captureState && STATES[captureState]) {
        captureSetup(captureState);
        return;
    }

    let layer;
    let lastState = '';

    function activeState() {
        if (!phoneMedia.matches || document.body.classList.contains('is-project-open')) return '';
        if (!document.getElementById('weiyuan-detail')?.hidden) return '';
        if (document.getElementById('youngNavToggle')?.getAttribute('aria-expanded') === 'true') return 'works';
        // A profile can remain expanded in the DOM after a category is opened.
        // The live category must win over that retained home state.
        const activePage = document.querySelector('.page-content.active')?.id;
        if (activePage && activePage !== 'home') return activePage;
        if (document.getElementById('bg-3d-wrapper')?.classList.contains('expanded-bg13')) return 'profile';
        return activePage || 'home';
    }

    function goTo(page, card) {
        closeNativeMenu();
        window.setTimeout(() => {
            showPage(page);
            if (!Number.isInteger(card)) return;
            const cards = document.querySelectorAll(`#${page} .card-base`);
            cards[card]?.click();
        }, 0);
    }

    function enterProfile() {
        if (typeof window.handleBg12Click === 'function') {
            window.handleBg12Click();
            return;
        }
        document.getElementById('bg12-video-mask')?.click();
    }

    function makeHit(label, left, top, width, height, action) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'mobile-static-hit';
        button.setAttribute('aria-label', label);
        button.style.cssText = `left:${left}%;top:${top}%;width:${width}%;height:${height}%;`;
        button.addEventListener('click', action);
        return button;
    }

    function appendHotspots(stage, state) {
        if (state === 'home') {
            stage.append(makeHit('进入我的信息', 16, 22, 68, 54, enterProfile));
            return;
        }

        if (state === 'works') {
            stage.append(
                makeHit('进入AIGC设计', 25, 42, 16, 36, () => goTo('aigc')),
                makeHit('进入数字体验设计', 42, 42, 16, 36, () => goTo('creative')),
                makeHit('进入视觉传达设计', 59, 42, 16, 36, () => goTo('ui')),
                makeHit('查看绥远方志', 26, 50, 14, 9, () => goTo('aigc', 0)),
                makeHit('查看新媒体艺术设计', 43, 50, 14, 12, () => goTo('creative', 0))
            );
            return;
        }

        if (state === 'aigc') {
            stage.append(
                makeHit('查看绥远方志', 30, 39, 40, 19, () => goTo('aigc', 0)),
                makeHit('查看矿山生态', 30, 59, 40, 19, () => goTo('aigc', 1)),
                makeHit('查看微元灵溯', 30, 79, 40, 19, () => goTo('aigc', 2))
            );
            return;
        }

        if (state === 'creative') {
            stage.append(
                makeHit('进入TouchDesigner音画与生成艺术展厅', 30, 38, 40, 22, () => goTo('creative', 0)),
                makeHit('探索应用设计', 30, 62, 40, 22, () => goTo('creative', 1))
            );
        }
    }

    function ensureLayer() {
        if (layer) return layer;
        layer = document.createElement('section');
        layer.id = 'mobile-static-layer';
        layer.setAttribute('aria-live', 'polite');
        document.body.append(layer);
        return layer;
    }

    function render() {
        const state = activeState();
        const root = ensureLayer();

        if (!state || !STATES[state]) {
            document.documentElement.classList.remove('mobile-static-active');
            root.hidden = true;
            lastState = '';
            return;
        }

        document.documentElement.classList.add('mobile-static-active');
        root.hidden = false;
        if (state === lastState) return;
        lastState = state;

        const source = `${ASSET_ROOT}${STATES[state]}`;
        root.dataset.state = state;
        root.style.setProperty('--mobile-static-image', `url("${source}")`);
        root.innerHTML = '';

        const backdrop = document.createElement('div');
        backdrop.className = 'mobile-static-backdrop';
        backdrop.setAttribute('aria-hidden', 'true');
        const stage = document.createElement('div');
        stage.className = 'mobile-static-stage';
        const image = document.createElement('img');
        image.src = source;
        image.alt = '';
        image.draggable = false;
        stage.append(image);
        appendHotspots(stage, state);
        root.append(backdrop, stage);
    }

    function scheduleRender() {
        requestAnimationFrame(render);
    }

    window.addEventListener('load', scheduleRender, { once: true });
    window.addEventListener('resize', scheduleRender, { passive: true });
    window.visualViewport?.addEventListener('resize', scheduleRender, { passive: true });
    phoneMedia.addEventListener?.('change', scheduleRender);

    new MutationObserver(scheduleRender).observe(document.body, {
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style', 'hidden', 'aria-expanded']
    });
})();
