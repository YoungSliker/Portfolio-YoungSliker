(function () {
    const config = {
        targetSelector: '.cursor-target',
        spinDuration: 2,
        hideDefaultCursor: true,
        hoverDuration: 200,
        parallaxOn: true,
        borderWidth: 4,
        cornerSize: 16
    };

    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const isSmallScreen = window.innerWidth <= 768;
    if (isCoarsePointer || isSmallScreen) return;

    const interactiveSelector = [
        'a[href]',
        'button',
        '[onclick]',
        '[role="button"]',
        '.nav-btn',
        '.card-base',
        '.project-card',
        '.process-stage-card',
        '.process-card-gallery',
        '.wide-carousel-thumb',
        '.wide-carousel-card',
        '.cursor-target',
        '#logo',
        '#bg12-video-mask'
    ].join(',');

    const wrapper = document.createElement('div');
    wrapper.className = 'target-cursor-wrapper';
    wrapper.style.setProperty('--target-cursor-spin-duration', `${config.spinDuration}s`);
    wrapper.innerHTML = [
        '<div class="target-cursor-spin-layer is-spinning">',
        '  <div class="target-cursor-dot"></div>',
        '  <div class="target-cursor-corner corner-tl"></div>',
        '  <div class="target-cursor-corner corner-tr"></div>',
        '  <div class="target-cursor-corner corner-br"></div>',
        '  <div class="target-cursor-corner corner-bl"></div>',
        '</div>'
    ].join('');
    const spinLayer = wrapper.querySelector('.target-cursor-spin-layer');
    let isPaused = false, targetQuad=null;
    window.setTargetCursorQuad=quad=>{if(!quad&&!targetQuad)return;targetQuad=quad;if(!quad)clearTarget();refreshCursorAtPoint()};
    function updateQuad(){const unit=(a,b)=>{const dx=b.x-a.x,dy=b.y-a.y,n=Math.hypot(dx,dy)||1;return {x:dx/n,y:dy/n}};const q=targetQuad,size=config.cornerSize;
      wrapper.querySelectorAll('.target-cursor-corner').forEach((corner,i)=>{const right=i===1||i===2,bottom=i>=2,p=q[i],u=unit(bottom?q[3]:q[0],bottom?q[2]:q[1]),v=unit(right?q[1]:q[0],right?q[2]:q[3]);const x=p.x-mouseX-(right?size*u.x:0)-(bottom?size*v.x:0),y=p.y-mouseY-(right?size*u.y:0)-(bottom?size*v.y:0);corner.style.transform='matrix('+[u.x,u.y,v.x,v.y,x,y].join(',')+')';});
    }

    window.setTargetCursorPaused = setPaused;
    window.refreshTargetCursor = refreshCursorAtPoint;
    window.addEventListener('target-cursor:pause', event => {
        setPaused(Boolean(event.detail && event.detail.paused));
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }

    function init() {
        document.body.appendChild(wrapper);
        if (config.hideDefaultCursor) {
            document.documentElement.classList.add('target-cursor-enabled');
        }
        syncCursorTheme();

        markTargets();

        const observer = new MutationObserver(records => {
            for(const record of records)for(const node of record.addedNodes){
                if(node.nodeType!==1||node.closest('.target-cursor-wrapper'))continue;
                if(node.matches(interactiveSelector))node.classList.add('cursor-target');
                node.querySelectorAll(interactiveSelector).forEach(el=>el.classList.add('cursor-target'));
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        window.addEventListener('mousemove', onMove, { passive: true });
        window.addEventListener('mouseover', onOver, { passive: true });
        window.addEventListener('mouseout', onOut, { passive: true });
        window.addEventListener('mousedown', () => {
            if (!isPaused) wrapper.classList.add('is-pressing');
        });
        window.addEventListener('mouseup', () => wrapper.classList.remove('is-pressing'));
        window.addEventListener('blur', clearTarget);
        window.addEventListener('scroll', refreshActiveTarget, { passive: true });
        window.addEventListener('resize', refreshActiveTarget);
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let activeTarget = null;
    let candidateTarget = null, candidateAt = 0, settleUntil = 0;

    function setPaused(paused) {
        isPaused = Boolean(paused);
        document.documentElement.classList.toggle('target-cursor-paused', isPaused);
        wrapper.classList.toggle('is-paused', isPaused);
        wrapper.classList.remove('is-pressing');

        if (isPaused) {
            wrapper.classList.remove('is-visible');
            clearTarget();
        }
    }

    function markTargets() {
        document.querySelectorAll(interactiveSelector).forEach(el => {
            if (el.closest('.target-cursor-wrapper')) return;
            el.classList.add('cursor-target');
        });
    }

    let moveFrame=0;
    function scheduleCursor(){if(!moveFrame)moveFrame=requestAnimationFrame(()=>{moveFrame=0;wrapper.style.transform=`translate3d(${mouseX}px, ${mouseY}px, 0)`;refreshCursorAtPoint()})}
    function onMove(event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
        scheduleCursor();
    }

    function onOver() {
        scheduleCursor();
    }

    function onOut() {
        scheduleCursor();
    }

    function refreshActiveTarget() {
        refreshCursorAtPoint();
    }

    function refreshCursorAtPoint() {
        if (isPaused) {
            wrapper.classList.remove('is-visible');
            document.documentElement.classList.remove('target-cursor-scoped-gap');
            clearTarget();
            return;
        }

        if(targetQuad){activeTarget=null;candidateTarget=null;settleUntil=0;document.documentElement.classList.remove('target-cursor-scoped-gap');wrapper.classList.add('is-visible');spinLayer.classList.add('is-targeting');spinLayer.classList.remove('is-spinning');syncCursorTheme();updateQuad();return;}
        const elementUnderMouse = document.elementFromPoint(mouseX, mouseY);
        let target = resolveTarget(elementUnderMouse);
        const now = performance.now();
        if (target !== activeTarget) {
            if (candidateTarget !== target) { candidateTarget = target; candidateAt = now; }
            if (now - candidateAt < 80) { target = activeTarget; scheduleCursor(); }
            else { settleUntil = now + 500; }
        } else { candidateTarget = target; candidateAt = now; }
        if (now < settleUntil) scheduleCursor();
        const scopedArea = elementUnderMouse && elementUnderMouse.closest('[data-target-cursor-scope]');

        const isScopedGap = Boolean(scopedArea && !target);
        document.documentElement.classList.toggle('target-cursor-scoped-gap', isScopedGap);
        wrapper.classList.toggle('is-visible', !isScopedGap);
        syncCursorTheme();

        if (target !== activeTarget) {
            activeTarget = target;
            spinLayer.classList.toggle('is-targeting', Boolean(target));
            spinLayer.classList.toggle('is-spinning', !target);
        }

        if (activeTarget) updateTargetCorners(activeTarget);
        else resetCorners();
    }

    function resolveTarget(element) {
        if (!element || wrapper.contains(element)) return null;

        const scopedArea = element.closest('[data-target-cursor-scope]');
        const navCard = element.closest('.young-nav577__card');
        let target;

        if (navCard) {
            // 分类卡默认整卡框选；项目小选项继续保留自己的独立框选。
            target = element.closest('.young-nav577__link') || navCard;
        } else {
            target = element.closest(config.targetSelector);
        }

        if (!scopedArea) return target;
        return target && scopedArea.contains(target) ? target : null;
    }

    function clearTarget() {
        activeTarget = null;
        spinLayer.classList.remove('is-targeting');
        spinLayer.classList.add('is-spinning');
        resetCorners();
    }

    function syncCursorTheme() {
        const detail = document.getElementById('project-detail');
        const isSuiyuanOpen = detail && getComputedStyle(detail).display !== 'none';
        wrapper.classList.toggle('is-suiyuan-style', Boolean(isSuiyuanOpen));
    }

    function updateTargetCorners(target) {
        const rect = (target.querySelector('.drift-wall__inner') || target).getBoundingClientRect();
        const offset = getParallaxOffset(rect);
        const metrics = getCursorMetrics();
        const positions = [
            {
                x: rect.left - metrics.borderWidth - mouseX + offset.x,
                y: rect.top - metrics.borderWidth - mouseY + offset.y
            },
            {
                x: rect.right + metrics.borderWidth - metrics.cornerSize - mouseX + offset.x,
                y: rect.top - metrics.borderWidth - mouseY - offset.y
            },
            {
                x: rect.right + metrics.borderWidth - metrics.cornerSize - mouseX - offset.x,
                y: rect.bottom + metrics.borderWidth - metrics.cornerSize - mouseY - offset.y
            },
            {
                x: rect.left - metrics.borderWidth - mouseX - offset.x,
                y: rect.bottom + metrics.borderWidth - metrics.cornerSize - mouseY + offset.y
            }
        ];

        wrapper.querySelectorAll('.target-cursor-corner').forEach((corner, index) => {
            corner.style.transform = `translate3d(${positions[index].x}px, ${positions[index].y}px, 0)`;
        });
    }

    function getParallaxOffset(rect) {
        if (!config.parallaxOn) return { x: 0, y: 0 };
        const relX = (mouseX - rect.left) / Math.max(rect.width, 1) - 0.5;
        const relY = (mouseY - rect.top) / Math.max(rect.height, 1) - 0.5;
        return {
            x: relX * 6,
            y: relY * 6
        };
    }

    function getCursorMetrics() {
        if (wrapper.classList.contains('is-suiyuan-style')) {
            return { borderWidth: 3, cornerSize: 18 };
        }

        return {
            borderWidth: config.borderWidth,
            cornerSize: config.cornerSize
        };
    }

    function resetCorners() {
        const positions = [
            { x: -config.cornerSize * 1.5, y: -config.cornerSize * 1.5 },
            { x: config.cornerSize * 0.5, y: -config.cornerSize * 1.5 },
            { x: config.cornerSize * 0.5, y: config.cornerSize * 0.5 },
            { x: -config.cornerSize * 1.5, y: config.cornerSize * 0.5 }
        ];

        wrapper.querySelectorAll('.target-cursor-corner').forEach((corner, index) => {
            corner.style.transform = `translate3d(${positions[index].x}px, ${positions[index].y}px, 0)`;
        });
    }
})();
