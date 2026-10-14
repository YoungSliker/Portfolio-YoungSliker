(() => {
    'use strict';
    const home = document.getElementById('home');
    const card = document.getElementById('bg-3d-wrapper');
    const year = document.getElementById('bg11');
    const nav = document.getElementById('nav');
    const menu = document.getElementById('youngNavPanel');
    if (!home || !card || !year || !menu) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const enterProfile = window.handleBg12Click;
    const reset = window.resetHome;
    // 0: portfolio cover, 1: interactive profile, 2: selected-work categories.
    let stage = card.classList.contains('expanded-bg13') ? 1 : 0;
    let moving = false, wheelSum = 0, wheelDirection = 0, lastWheel = 0, cooldown = 0;

    const orbit = document.createElement('div');
    orbit.id = 'home-year-orbit';
    year.before(orbit);
    orbit.append(year);
    card.parentElement.classList.add('home-flip-background');
    document.body.classList.add('home-flip-enabled');

    // Reuse authored cards and routing attributes without duplicating their IDs.
    const works = document.createElement('section');
    works.className = 'home-works-stage';
    works.setAttribute('aria-labelledby', 'homeWorksTitle');
    works.hidden = true;
    works.inert = true;
    const worksPanel = document.createElement('div');
    worksPanel.className = 'home-works-panel';
    const heading = menu.querySelector('.young-nav577__intro').cloneNode(true);
    heading.querySelector('h2').id = 'homeWorksTitle';
    heading.querySelector('h2').tabIndex = -1;
    const cards = menu.querySelector('.young-nav577__cards').cloneNode(true);
    cards.querySelectorAll('[id]').forEach(node => { node.id = 'homeWorks-' + node.id; });
    cards.querySelectorAll('[aria-labelledby]').forEach(node => {
        node.setAttribute('aria-labelledby', 'homeWorks-' + node.getAttribute('aria-labelledby'));
    });
    cards.querySelectorAll('canvas').forEach(node => node.remove());
    const workCards = [...cards.querySelectorAll('.young-nav577__card')];
    const back = document.createElement('button');
    back.type = 'button';
    back.className = 'home-works-return cursor-target';
    back.textContent = '↑ 向上滚动 · 返回我的信息';
    worksPanel.append(heading, cards, back);
    works.append(worksPanel);
    home.append(works);

    const cue = document.createElement('button');
    cue.type = 'button';
    cue.className = 'home-scroll-cue cursor-target';
    cue.innerHTML = '<span class="home-scroll-cue__mouse" aria-hidden="true"></span><span class="home-scroll-cue__label"></span><span aria-hidden="true">↓</span>';
    home.append(cue);

    function positionCue() {
        if (moving || !home.classList.contains('active')) return;
        cue.hidden = stage === 2;
        cue.inert = stage === 2;
        cue.querySelector('.home-scroll-cue__label').textContent = stage === 0 ? '向下滚动 · 认识我' : '继续向下 · 看作品';
        cue.setAttribute('aria-label', stage === 0 ? '向下滚动，翻转查看我的信息' : '继续向下滚动，翻转查看我主要的一些作品');
        if (stage === 2) return;
        const surface = card.querySelector(stage === 0 ? '#bg12-video-mask' : '.profile-bg13-layer--frame');
        const rect = surface.getBoundingClientRect(), homeRect = home.getBoundingClientRect();
        const footerSpace = stage === 1 ? (innerHeight < 500 ? 90 : 150) : 104;
        cue.style.setProperty('--home-cue-top', Math.min(rect.bottom - homeRect.top + 22, homeRect.height - footerSpace) + 'px');
    }

    function canFlip() {
        return home.classList.contains('active') && !document.hidden &&
            !document.body.classList.contains('young-nav577-menu-open') &&
            !document.body.classList.contains('is-project-open') &&
            !document.querySelector('dialog[open]');
    }

    function setPivot() {
        const surface = card.querySelector(stage === 0 ? '#bg12-video-mask' : '.profile-bg13-layer--frame');
        const bounds = card.getBoundingClientRect(), face = surface.getBoundingClientRect();
        card.style.transformOrigin = `${face.left + face.width / 2 - bounds.left}px ${face.top + face.height / 2 - bounds.top}px`;
    }

    function commit(next) {
        if (next === 0) window.collapseHomeCard();
        else if (stage === 0) enterProfile();
        stage = next;
        home.dataset.flipStage = String(stage);
        document.body.classList.toggle('home-flip-profile', stage > 0);
        document.body.classList.toggle('home-flip-works', stage === 2);
        works.hidden = stage !== 2;
        card.inert = stage === 2;
        card.setAttribute('aria-hidden', String(stage === 2));
        year.style.removeProperty('display');
        window.syncHomeDotLayerVisibility?.();
        if (stage !== 2) setPivot();
    }

    function play(node, keyframes, options, animations) {
        const animation = node.animate(keyframes, { fill: 'forwards', ...options });
        animations.push(animation);
        return animation.finished;
    }

    async function flip(next, focusAfter = false) {
        if (moving || next < 0 || next > 2 || next === stage || !canFlip()) return;
        const from = stage, forward = next > from, withYear = from === 0 || next === 0;
        moving = true;
        wheelSum = 0;
        cue.inert = true;
        works.inert = true;
        document.body.classList.add('home-flip-moving');
        document.body.classList.toggle('home-flip-year-moving', withYear);
        document.body.classList.toggle('home-flip-work-moving', !withYear);
        card.setAttribute('aria-busy', 'true');
        window.dispatchEvent(new CustomEvent('portfolio-home-flip-start'));
        const animations = [];
        try {
            if (reduced.matches) {
                commit(next);
            } else {
                const yearMotion = withYear ? play(orbit, [
                    { transform: `rotate(${forward ? 0 : -110}deg)` },
                    { transform: `rotate(${forward ? -110 : 0}deg)` }
                ], { duration: 1120, easing: 'cubic-bezier(.4,0,.2,1)' }, animations) : Promise.resolve();
                if (from === 2) {
                    await Promise.all(workCards.map((item, index) => play(item, [
                        { rotate: 'x 0deg', translate: '0px 0px', opacity: 1 },
                        { rotate: 'x -90deg', translate: `${(1 - index) * 70}px 0px`, opacity: .3 }
                    ], { duration: 410, delay: index * 30, easing: 'cubic-bezier(.55,0,1,.6)' }, animations)));
                } else {
                    setPivot();
                    await play(card, [
                        { rotate: 'x 0deg' }, { rotate: `x ${forward ? -90 : 90}deg` }
                    ], { duration: 480, easing: 'cubic-bezier(.55,0,1,.6)' }, animations);
                }
                commit(next);
                // The profile changes faces at the edge; three cards unfold from the center.
                const arrival = next === 2 ? Promise.all(workCards.map((item, index) => play(item, [
                    { rotate: 'x 90deg', translate: `${(1 - index) * 95}px 16px`, opacity: .3 },
                    { rotate: 'x 0deg', translate: '0px 0px', opacity: 1 }
                ], { duration: 600, delay: index * 65, easing: 'cubic-bezier(.15,.65,.25,1)' }, animations))) : play(card, [
                    { rotate: `x ${forward ? 90 : -90}deg` }, { rotate: 'x 0deg' }
                ], { duration: 640, easing: 'cubic-bezier(.15,.65,.25,1)' }, animations);
                await Promise.all([arrival, yearMotion]);
            }
        } finally {
            orbit.style.transform = `rotate(${stage > 0 ? -110 : 0}deg)`;
            animations.forEach(animation => animation.cancel());
            card.style.removeProperty('transform-origin');
            card.removeAttribute('aria-busy');
            document.body.classList.remove('home-flip-moving', 'home-flip-year-moving', 'home-flip-work-moving');
            moving = false;
            cooldown = performance.now() + 450;
            works.inert = stage !== 2;
            positionCue();
            window.dispatchEvent(new CustomEvent('portfolio-home-flip-settled', { detail: { profile: stage === 1, stage } }));
            if (from === 0 && stage === 1 && !reduced.matches) nav.animate([
                { opacity: 0, transform: 'translateY(-14px)' }, { opacity: 1, transform: 'translateY(0)' }
            ], { duration: 380, easing: 'ease-out' });
            if (focusAfter) (stage === 2 ? heading.querySelector('h2') : stage === 1 ? document.getElementById('youngNavHome') : cue).focus({ preventScroll: true });
            window.refreshTargetCursor?.();
        }
    }

    window.handleBg12Click = () => flip(1);
    window.resetHome = () => {
        if (home.classList.contains('active')) {
            if (stage > 0) return flip(stage - 1, true);
            return;
        }
        if (stage === 2) { window.showPage('home'); positionCue(); return; }
        reset();
    };
    cue.addEventListener('click', event => flip(stage + 1, event.detail === 0));
    back.addEventListener('click', () => flip(1, true));
    works.addEventListener('click', event => {
        const action = event.target.closest('[data-nav-page]');
        if (action && !moving) window.followPortfolioNavAction(action);
    });
    window.addEventListener('mousemove', event => {
        const target = event.target.closest('.home-scroll-cue, .home-works-return, .home-works-stage [data-nav-page]');
        const tooltip = document.getElementById('tooltip');
        if (!target || !tooltip) return;
        tooltip.textContent = target === cue ? (stage === 0 ? '认识我' : '查看作品') : target === back ? '返回我的信息' : '查看作品';
    }, { passive: true });

    window.addEventListener('wheel', event => {
        if (!canFlip() || event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
        const now = performance.now();
        // Trackpad momentum must not skip the profile and land two screens ahead.
        if (moving || now < cooldown) {
            event.preventDefault(); lastWheel = now;
            cooldown = Math.max(cooldown, now + 180);
            return;
        }
        if (!event.deltaY) return;
        const direction = Math.sign(event.deltaY), next = stage + direction;
        if (next < 0 || next > 2) return;
        event.preventDefault();
        if (now - lastWheel > 220 || direction !== wheelDirection) wheelSum = 0;
        wheelSum += Math.abs(event.deltaY) * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
        wheelDirection = direction;
        lastWheel = now;
        if (wheelSum >= 65) flip(next);
    }, { passive: false, capture: true });

    document.addEventListener('keydown', event => {
        if (!canFlip() || event.defaultPrevented || event.target.closest('input,textarea,select,[contenteditable="true"],button,a')) return;
        const direction = ['ArrowDown', 'PageDown', ' '].includes(event.key) ? 1 : ['ArrowUp', 'PageUp'].includes(event.key) ? -1 : 0;
        if (direction && stage + direction >= 0 && stage + direction <= 2) {
            event.preventDefault(); flip(stage + direction, true);
        }
    });
    let touchY = null;
    home.addEventListener('touchstart', event => { touchY = event.touches.length === 1 ? event.touches[0].clientY : null; }, { passive: true });
    home.addEventListener('touchend', event => {
        if (touchY === null || !canFlip() || !event.changedTouches.length) return;
        const delta = touchY - event.changedTouches[0].clientY;
        touchY = null;
        if (Math.abs(delta) > 60) flip(stage + Math.sign(delta));
    }, { passive: true });
    new ResizeObserver(positionCue).observe(home);
    window.addEventListener('load', positionCue);
    window.addEventListener('portfolio-page-change', positionCue);
    home.dataset.flipStage = String(stage);
    positionCue();
})();
