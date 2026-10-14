(() => {
    'use strict';
    const home = document.getElementById('home');
    const card = document.getElementById('bg-3d-wrapper');
    const year = document.getElementById('bg11');
    const nav = document.getElementById('nav');
    if (!home || !card || !year) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const enterProfile = window.handleBg12Click;
    const reset = window.resetHome;
    let moving = false, profile = card.classList.contains('expanded-bg13');
    let wheelSum = 0, lastWheel = 0, cooldown = 0;

    const orbit = document.createElement('div');
    orbit.id = 'home-year-orbit';
    year.before(orbit);
    orbit.append(year);
    card.parentElement.classList.add('home-flip-background');
    document.body.classList.add('home-flip-enabled');

    const cue = document.createElement('button');
    cue.type = 'button';
    cue.className = 'home-scroll-cue cursor-target';
    cue.setAttribute('aria-label', '向下滚动，翻转查看我的信息');
    cue.innerHTML = '<span class="home-scroll-cue__mouse" aria-hidden="true"></span><span>向下滚动 · 认识我</span><span aria-hidden="true">↓</span>';
    home.append(cue);

    function positionCue() {
        if (profile || moving || !home.classList.contains('active')) return;
        const rect = document.getElementById('bg12-video-mask').getBoundingClientRect();
        const homeRect = home.getBoundingClientRect();
        cue.style.setProperty('--home-cue-top', Math.min(rect.bottom - homeRect.top + 26, homeRect.height - 95) + 'px');
    }

    function canFlip() {
        return home.classList.contains('active') && !document.hidden &&
            !document.body.classList.contains('young-nav577-menu-open') &&
            !document.body.classList.contains('is-project-open') &&
            !document.querySelector('dialog[open]');
    }

    function setPivot() {
        const surface = card.querySelector(profile ? '.profile-bg13-layer--frame' : '#bg12-video-mask');
        const bounds = card.getBoundingClientRect(), face = surface.getBoundingClientRect();
        card.style.transformOrigin = `${face.left + face.width / 2 - bounds.left}px ${face.top + face.height / 2 - bounds.top}px`;
    }

    function commit(next) {
        if (next) enterProfile();
        else window.collapseHomeCard();
        profile = next;
        document.body.classList.toggle('home-flip-profile', profile);
        // Legacy entry hides the year. Its orbital parent now owns visibility.
        year.style.removeProperty('display');
        window.syncHomeDotLayerVisibility?.();
        setPivot();
    }

    async function flip(next, focusAfter = false) {
        if (moving || next === profile || !canFlip()) return;
        moving = true;
        wheelSum = 0;
        cue.inert = true;
        document.body.classList.add('home-flip-moving');
        card.setAttribute('aria-busy', 'true');
        window.dispatchEvent(new CustomEvent('portfolio-home-flip-start'));
        const animations = [];
        try {
            if (reduced.matches) {
                commit(next);
            } else {
                setPivot();
                const yearMotion = orbit.animate([
                    { transform: `rotate(${next ? 0 : -110}deg)` },
                    { transform: `rotate(${next ? -110 : 0}deg)` }
                ], { duration: 1120, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' });
                animations.push(yearMotion);
                const first = card.animate([
                    { rotate: 'x 0deg' }, { rotate: `x ${next ? -90 : 90}deg` }
                ], { duration: 480, easing: 'cubic-bezier(.55,0,1,.6)', fill: 'forwards' });
                animations.push(first);
                await first.finished;
                commit(next);
                // Change faces only at the edge; no duplicate video or interactive elements.
                first.cancel();
                const second = card.animate([
                    { rotate: `x ${next ? 90 : -90}deg` }, { rotate: 'x 0deg' }
                ], { duration: 640, easing: 'cubic-bezier(.15,.65,.25,1)', fill: 'forwards' });
                animations.push(second);
                await Promise.all([second.finished, yearMotion.finished]);
            }
        } finally {
            orbit.style.transform = `rotate(${profile ? -110 : 0}deg)`;
            animations.forEach(animation => animation.cancel());
            card.style.removeProperty('transform-origin');
            card.removeAttribute('aria-busy');
            document.body.classList.remove('home-flip-moving');
            moving = false;
            cooldown = performance.now() + 450;
            cue.inert = profile;
            positionCue();
            window.dispatchEvent(new CustomEvent('portfolio-home-flip-settled', { detail: { profile } }));
            if (profile && !reduced.matches) nav.animate([
                { opacity: 0, transform: 'translateY(-14px)' }, { opacity: 1, transform: 'translateY(0)' }
            ], { duration: 380, easing: 'ease-out' });
            if (focusAfter) (profile ? document.getElementById('youngNavHome') : cue).focus({ preventScroll: true });
            window.refreshTargetCursor?.();
        }
    }

    window.handleBg12Click = () => flip(true);
    window.resetHome = () => {
        if (home.classList.contains('active')) {
            if (profile) return flip(false, true);
            return;
        }
        reset();
    };
    cue.addEventListener('click', event => flip(true, event.detail === 0));

    window.addEventListener('wheel', event => {
        if (!canFlip() || event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
        const now = performance.now();
        if (moving || now < cooldown) { event.preventDefault(); lastWheel = now; return; }
        if ((event.deltaY > 0) === profile || !event.deltaY) return;
        event.preventDefault();
        if (now - lastWheel > 220) wheelSum = 0;
        wheelSum += Math.abs(event.deltaY) * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
        lastWheel = now;
        if (wheelSum >= 65) flip(!profile);
    }, { passive: false, capture: true });

    document.addEventListener('keydown', event => {
        if (!canFlip() || event.defaultPrevented || event.target.closest('input,textarea,select,[contenteditable="true"],button,a')) return;
        if ((!profile && ['ArrowDown', 'PageDown', ' '].includes(event.key)) || (profile && ['ArrowUp', 'PageUp'].includes(event.key))) {
            event.preventDefault(); flip(!profile, true);
        }
    });
    let touchY = null;
    home.addEventListener('touchstart', event => { touchY = event.touches.length === 1 ? event.touches[0].clientY : null; }, { passive: true });
    home.addEventListener('touchend', event => {
        if (touchY === null || !canFlip() || !event.changedTouches.length) return;
        const delta = touchY - event.changedTouches[0].clientY;
        touchY = null;
        if (Math.abs(delta) > 60 && (delta > 0) !== profile) flip(!profile);
    }, { passive: true });
    new ResizeObserver(positionCue).observe(home);
    window.addEventListener('load', positionCue);
    window.addEventListener('portfolio-page-change', positionCue);
    positionCue();
})();
