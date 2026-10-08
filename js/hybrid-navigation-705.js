(function () {
    'use strict';

    const nav = document.getElementById('nav');
    const toggle = document.getElementById('youngNavToggle');
    const overlay = document.getElementById('youngNavPanel');
    const emoji = document.getElementById('youngNavEmoji');
    const homeButton = document.getElementById('youngNavHome');

    if (!nav || !toggle || !overlay || !emoji) return;

    const emojiPool = [
        '📎', '🖇️', '🩻', '🔗', '🔖', '🛟', '♨️', '💫', '⚛️', '📛',
        '〽️', '⚜️', '➰', '〰️', '©️', '®️', '👁️‍🗨️', '🧿', '🪬', '🧩', '🫆'
    ];

    let isOpen = false;
    let emojiIndex = 0;
    let emojiTimer = 0;
    let previousFocus = null;

    function setOverlayInert(inert) {
        if ('inert' in overlay) {
            overlay.inert = inert;
            return;
        }

        overlay.querySelectorAll('button').forEach(button => {
            button.tabIndex = inert ? -1 : 0;
        });
    }

    function setMenu(nextOpen, returnFocus) {
        isOpen = Boolean(nextOpen);
        toggle.classList.toggle('is-open', isOpen);
        overlay.classList.toggle('is-open', isOpen);
        nav.classList.toggle('is-menu-open', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.setAttribute('aria-label', isOpen ? '收起作品导航' : '展开作品导航');
        overlay.setAttribute('aria-hidden', String(!isOpen));
        document.body.classList.toggle('young-nav577-menu-open', isOpen);
        setOverlayInert(!isOpen);

        if (isOpen) {
            previousFocus = document.activeElement;
            window.setTimeout(() => {
                if (isOpen) overlay.querySelector('.young-nav577__title')?.focus({ preventScroll: true });
            }, 360);
        } else if (returnFocus && previousFocus instanceof HTMLElement) {
            previousFocus.focus({ preventScroll: true });
        }
    }

    function changeEmoji() {
        if (emojiPool.length < 2) return;

        let nextIndex = emojiIndex;
        while (nextIndex === emojiIndex) {
            nextIndex = Math.floor(Math.random() * emojiPool.length);
        }

        emoji.classList.add('is-changing');
        window.setTimeout(() => {
            emojiIndex = nextIndex;
            emoji.textContent = emojiPool[emojiIndex];
            emoji.classList.remove('is-changing');
        }, 150);
    }

    function startEmojiRotation() {
        window.clearInterval(emojiTimer);
        emojiTimer = window.setInterval(changeEmoji, 2000);
    }

    function focusRequestedCard(pageId, cardIndex) {
        if (cardIndex === null || Number.isNaN(cardIndex)) return;

        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                const stack = document.querySelector(`#${pageId} .scroll-stack-scroller`);
                if (stack?.scrollStackTo) { stack.scrollStackTo(cardIndex); return; }
                const cards = document.querySelectorAll(`#${pageId} .card-base`);
                const card = cards[cardIndex];
                if (!card) return;
                card.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
            });
        });
    }

    function followNavAction(action) {
        const pageId = action.dataset.navPage;
        if (!pageId || typeof window.showPage !== 'function') return;

        const cardIndex = action.dataset.navCard === undefined
            ? null
            : Number.parseInt(action.dataset.navCard, 10);
        const projectId = action.dataset.navProject;

        setMenu(false, false);
        window.setTimeout(() => {
            window.showPage(pageId);

            if (projectId && typeof window.openProject === 'function') {
                window.setTimeout(() => window.openProject(projectId), 40);
                return;
            }

            focusRequestedCard(pageId, cardIndex);
        }, 180);
    }

    toggle.addEventListener('click', () => setMenu(!isOpen, true));

    overlay.addEventListener('click', event => {
        const action = event.target.closest('[data-nav-page]');
        if (action) {
            event.preventDefault();
            followNavAction(action);
            return;
        }

        if (event.target === overlay) setMenu(false, true);
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && isOpen) setMenu(false, true);
    });

    homeButton?.addEventListener('click', () => setMenu(false, false));

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            window.clearInterval(emojiTimer);
        } else {
            startEmojiRotation();
        }
    });

    // 旧页面会把普通按钮的鼠标尾巴统一写成“关闭”，这里按新导航语义覆盖。
    window.addEventListener('mousemove', event => {
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
        const tooltip = document.getElementById('tooltip');
        if (!tooltip) return;

        if (!(event.target instanceof Element)) return;
        const target = event.target.closest('#youngNavHome, #youngNavToggle, .young-nav577__card-hit');
        if (target === homeButton) {
            tooltip.textContent = '返回上层';
        } else if (target === toggle) {
            tooltip.textContent = isOpen ? '收起' : '展开';
        } else if (target?.classList.contains('young-nav577__card-hit')) {
            tooltip.textContent = `进入 ${target.dataset.navLabel || '设计分类'}`;
        }
    });

    function initParticleBrandText() {
        const root = homeButton?.querySelector('[data-brand-particle-text]');
        const canvas = root?.querySelector('.young-nav577__particle-canvas');
        const fallback = root?.querySelector('.young-nav577__particle-fallback');
        const context = canvas?.getContext('2d');
        if (!root || !canvas || !fallback || !context) return;

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        const particles = [];
        const pointer = { x: 0, y: 0, active: false };
        let width = 1;
        let height = 1;

        function buildParticles() {
            const rect = canvas.getBoundingClientRect();
            if (rect.width < 1 || rect.height < 1) return;

            const dpr = Math.min(window.devicePixelRatio || 1, 3);
            width = rect.width;
            height = rect.height;
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            context.setTransform(dpr, 0, 0, dpr, 0, 0);
            context.imageSmoothingEnabled = false;

            const sampleCanvas = document.createElement('canvas');
            sampleCanvas.width = Math.max(1, Math.round(width * dpr));
            sampleCanvas.height = Math.max(1, Math.round(height * dpr));
            const sampleContext = sampleCanvas.getContext('2d', { willReadFrequently: true });
            if (!sampleContext) return;
            sampleContext.setTransform(dpr, 0, 0, dpr, 0, 0);

            const fallbackStyle = getComputedStyle(fallback);
            sampleContext.clearRect(0, 0, width, height);
            sampleContext.fillStyle = '#fff';
            sampleContext.font = `${fallbackStyle.fontWeight} ${fallbackStyle.fontSize} ${fallbackStyle.fontFamily}`;
            sampleContext.textAlign = 'center';
            sampleContext.textBaseline = 'middle';
            sampleContext.fillText('YoungSliker', width / 2, height / 2 + 1);

            const pixels = sampleContext.getImageData(0, 0, sampleCanvas.width, sampleCanvas.height).data;
            const sampleStep = Math.max(2, Math.round(dpr));
            particles.length = 0;
            for (let y = Math.floor(sampleStep / 2); y < sampleCanvas.height; y += sampleStep) {
                for (let x = Math.floor(sampleStep / 2); x < sampleCanvas.width; x += sampleStep) {
                    const alpha = pixels[(y * sampleCanvas.width + x) * 4 + 3];
                    if (alpha < 72) continue;
                    particles.push({
                        x: x / dpr,
                        y: y / dpr,
                        targetX: x / dpr,
                        targetY: y / dpr,
                        velocityX: 0,
                        velocityY: 0,
                        size: 1.05 + Math.random() * 0.28,
                        phase: Math.random() * Math.PI * 2,
                        bright: Math.random() > 0.78
                    });
                }
            }

            if (particles.length) root.classList.add('is-ready');
        }

        function updatePointer(event) {
            const rect = canvas.getBoundingClientRect();
            pointer.x = event.clientX - rect.left;
            pointer.y = event.clientY - rect.top;
        }

        function scatterParticles() {
            particles.forEach(particle => {
                const dx = particle.x - pointer.x;
                const dy = particle.y - pointer.y;
                const distance = Math.hypot(dx, dy) || 1;
                const impulse = 0.8 + Math.random() * 2.2;
                particle.velocityX += (dx / distance) * impulse + (Math.random() - 0.5) * 1.5;
                particle.velocityY += (dy / distance) * impulse + (Math.random() - 0.5) * 1.5;
            });
        }

        function drawParticles() {
            context.clearRect(0, 0, width, height);
            particles.forEach(particle => {
                context.fillStyle = particle.bright ? 'rgb(245, 92, 132)' : 'rgb(217, 61, 96)';
                context.fillRect(
                    particle.x - particle.size / 2,
                    particle.y - particle.size / 2,
                    particle.size,
                    particle.size
                );
            });
        }

        homeButton.addEventListener('pointerenter', event => {
            updatePointer(event);
            pointer.active = finePointer && !reducedMotion;
            if (pointer.active) scatterParticles();
        });
        homeButton.addEventListener('pointermove', updatePointer);
        homeButton.addEventListener('pointerleave', () => {
            pointer.active = false;
        });
        window.addEventListener('blur', () => {
            pointer.active = false;
        });

        if ('ResizeObserver' in window) {
            const observer = new ResizeObserver(buildParticles);
            observer.observe(root);
        } else {
            window.addEventListener('resize', buildParticles);
        }

        buildParticles();
        if (reducedMotion) {
            drawParticles();
            return;
        }

        function frame(time) {
            const radius = Math.max(42, Math.min(width, height) * 1.45);
            particles.forEach(particle => {
                let accelerationX = (particle.targetX - particle.x) * (pointer.active ? 0.035 : 0.075);
                let accelerationY = (particle.targetY - particle.y) * (pointer.active ? 0.035 : 0.075);

                if (pointer.active) {
                    const dx = particle.x - pointer.x;
                    const dy = particle.y - pointer.y;
                    const distance = Math.hypot(dx, dy) || 1;
                    if (distance < radius) {
                        const force = Math.pow(1 - distance / radius, 2) * 1.75;
                        accelerationX += (dx / distance) * force;
                        accelerationY += (dy / distance) * force;
                    }
                    accelerationX += Math.sin(time * 0.008 + particle.phase) * 0.035;
                    accelerationY += Math.cos(time * 0.009 + particle.phase) * 0.035;
                }

                particle.velocityX = (particle.velocityX + accelerationX) * (pointer.active ? 0.9 : 0.84);
                particle.velocityY = (particle.velocityY + accelerationY) * (pointer.active ? 0.9 : 0.84);
                particle.x += particle.velocityX;
                particle.y += particle.velocityY;
            });

            drawParticles();
            window.requestAnimationFrame(frame);
        }

        window.requestAnimationFrame(frame);
    }

    function initElasticMeshCards() {
        const cards = Array.from(overlay.querySelectorAll('.young-nav577__card'));
        if (!cards.length) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const columns = 15;
        const rows = 12;

        const surfaces = cards.map(card => {
            const canvas = card.querySelector('.young-nav577__elastic-mesh');
            const context = canvas?.getContext('2d');
            if (!canvas || !context) return null;

            const surface = {
                card,
                canvas,
                context,
                width: 1,
                height: 1,
                pointerX: 0,
                pointerY: 0,
                pointerVelocityX: 0,
                pointerVelocityY: 0,
                lastPointerX: 0,
                lastPointerY: 0,
                hasPointer: false,
                active: false,
                strength: 0,
                tiltX: 0,
                tiltY: 0,
                nodes: []
            };

            function resizeSurface() {
                const cardWidth = card.clientWidth;
                const cardHeight = card.clientHeight;
                if (cardWidth < 1 || cardHeight < 1) return;

                const dpr = Math.min(window.devicePixelRatio || 1, 2);
                surface.width = cardWidth;
                surface.height = cardHeight;
                canvas.width = Math.round(cardWidth * dpr);
                canvas.height = Math.round(cardHeight * dpr);
                context.setTransform(dpr, 0, 0, dpr, 0, 0);

                surface.nodes = [];
                for (let row = 0; row < rows; row++) {
                    for (let column = 0; column < columns; column++) {
                        surface.nodes.push({
                            column,
                            row,
                            x: 4 + (column / (columns - 1)) * (surface.width - 8),
                            y: 4 + (row / (rows - 1)) * (surface.height - 8),
                            offsetX: 0,
                            offsetY: 0,
                            velocityX: 0,
                            velocityY: 0
                        });
                    }
                }
            }

            function updatePointer(event) {
                const rect = card.getBoundingClientRect();
                const scaleX = rect.width ? surface.width / rect.width : 1;
                const scaleY = rect.height ? surface.height / rect.height : 1;
                const nextX = (event.clientX - rect.left) * scaleX;
                const nextY = (event.clientY - rect.top) * scaleY;

                if (surface.hasPointer) {
                    surface.pointerVelocityX = Math.max(-18, Math.min(18, nextX - surface.lastPointerX));
                    surface.pointerVelocityY = Math.max(-18, Math.min(18, nextY - surface.lastPointerY));
                } else {
                    surface.pointerVelocityX = 0;
                    surface.pointerVelocityY = 0;
                }

                surface.pointerX = nextX;
                surface.pointerY = nextY;
                surface.lastPointerX = nextX;
                surface.lastPointerY = nextY;
                surface.hasPointer = true;
            }

            card.addEventListener('pointerenter', event => {
                updatePointer(event);
                surface.active = true;
            });
            card.addEventListener('pointermove', updatePointer);
            card.addEventListener('pointerleave', () => {
                surface.active = false;
                surface.hasPointer = false;
            });
            card.addEventListener('pointercancel', () => {
                surface.active = false;
            });

            if ('ResizeObserver' in window) {
                const observer = new ResizeObserver(resizeSurface);
                observer.observe(card);
            } else {
                window.addEventListener('resize', resizeSurface);
            }

            resizeSurface();
            return surface;
        }).filter(Boolean);

        function nodeAt(surface, column, row) {
            return surface.nodes[row * columns + column];
        }

        function clampValue(value, minimum, maximum) {
            return Math.max(minimum, Math.min(maximum, value));
        }

        function updateSurface(surface, delta) {
            const open = overlay.classList.contains('is-open');
            const active = surface.active && open && !reduceMotion;
            const targetStrength = active ? 1 : 0;
            surface.strength += (targetStrength - surface.strength) * Math.min(1, 0.14 * delta);

            const radius = Math.min(surface.width, surface.height) * 0.72;
            const damping = Math.pow(0.86, delta);

            if (!reduceMotion) {
                surface.nodes.forEach(node => {
                    const edge = node.column === 0 || node.column === columns - 1 || node.row === 0 || node.row === rows - 1;
                    let accelerationX = -node.offsetX * (edge ? 0.058 : 0.072);
                    let accelerationY = -node.offsetY * (edge ? 0.058 : 0.072);
                    let neighborX = 0;
                    let neighborY = 0;
                    let neighborCount = 0;

                    if (node.column > 0) {
                        const neighbor = nodeAt(surface, node.column - 1, node.row);
                        neighborX += neighbor.offsetX;
                        neighborY += neighbor.offsetY;
                        neighborCount++;
                    }
                    if (node.column < columns - 1) {
                        const neighbor = nodeAt(surface, node.column + 1, node.row);
                        neighborX += neighbor.offsetX;
                        neighborY += neighbor.offsetY;
                        neighborCount++;
                    }
                    if (node.row > 0) {
                        const neighbor = nodeAt(surface, node.column, node.row - 1);
                        neighborX += neighbor.offsetX;
                        neighborY += neighbor.offsetY;
                        neighborCount++;
                    }
                    if (node.row < rows - 1) {
                        const neighbor = nodeAt(surface, node.column, node.row + 1);
                        neighborX += neighbor.offsetX;
                        neighborY += neighbor.offsetY;
                        neighborCount++;
                    }

                    accelerationX += (neighborX - neighborCount * node.offsetX) * 0.072;
                    accelerationY += (neighborY - neighborCount * node.offsetY) * 0.072;

                    if (surface.strength > 0.001) {
                        const currentX = node.x + node.offsetX;
                        const currentY = node.y + node.offsetY;
                        const distanceX = surface.pointerX - currentX;
                        const distanceY = surface.pointerY - currentY;
                        const distance = Math.hypot(distanceX, distanceY);

                        if (distance < radius) {
                            const normalized = 1 - distance / radius;
                            const pull = normalized * normalized * surface.strength * (edge ? 1.18 : 1);
                            accelerationX += distanceX * pull * 0.017;
                            accelerationX += surface.pointerVelocityX * pull * 0.065;
                            accelerationY += distanceY * pull * 0.017;
                            accelerationY += surface.pointerVelocityY * pull * 0.065;
                        }
                    }

                    node.velocityX = (node.velocityX + accelerationX * delta) * damping;
                    node.velocityY = (node.velocityY + accelerationY * delta) * damping;
                    node.offsetX = Math.max(-38, Math.min(38, node.offsetX + node.velocityX * delta));
                    node.offsetY = Math.max(-38, Math.min(38, node.offsetY + node.velocityY * delta));
                });
            }

            surface.pointerVelocityX *= Math.pow(0.72, delta);
            surface.pointerVelocityY *= Math.pow(0.72, delta);

            const targetTiltX = active ? (0.5 - surface.pointerY / surface.height) * 6 : 0;
            const targetTiltY = active ? (surface.pointerX / surface.width - 0.5) * 7 : 0;
            surface.tiltX += (targetTiltX - surface.tiltX) * Math.min(1, 0.12 * delta);
            surface.tiltY += (targetTiltY - surface.tiltY) * Math.min(1, 0.12 * delta);
            surface.card.style.setProperty('--mesh-rx', `${surface.tiltX.toFixed(2)}deg`);
            surface.card.style.setProperty('--mesh-ry', `${surface.tiltY.toFixed(2)}deg`);
        }

        function drawSurface(surface) {
            const { context, width, height } = surface;
            context.clearRect(0, 0, width, height);

            const line = getComputedStyle(surface.card).getPropertyValue('--mesh-line').trim() || '255, 255, 255';
            const lineAlpha = 0.22 + surface.strength * 0.34;

            if (surface.strength > 0.01) {
                const glow = context.createRadialGradient(
                    surface.pointerX,
                    surface.pointerY,
                    0,
                    surface.pointerX,
                    surface.pointerY,
                    Math.min(width, height) * 0.68
                );
                glow.addColorStop(0, `rgba(255, 255, 255, ${0.2 * surface.strength})`);
                glow.addColorStop(0.36, `rgba(255, 255, 255, ${0.08 * surface.strength})`);
                glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
                context.fillStyle = glow;
                context.fillRect(0, 0, width, height);
            }

            context.lineWidth = 1.15;
            context.strokeStyle = `rgba(${line}, ${lineAlpha})`;

            for (let row = 0; row < rows; row++) {
                context.beginPath();
                for (let column = 0; column < columns; column++) {
                    const node = nodeAt(surface, column, row);
                    const x = node.x + node.offsetX;
                    const y = node.y + node.offsetY;
                    if (column === 0) context.moveTo(x, y);
                    else context.lineTo(x, y);
                }
                context.stroke();
            }

            for (let column = 0; column < columns; column++) {
                context.beginPath();
                for (let row = 0; row < rows; row++) {
                    const node = nodeAt(surface, column, row);
                    const x = node.x + node.offsetX;
                    const y = node.y + node.offsetY;
                    if (row === 0) context.moveTo(x, y);
                    else context.lineTo(x, y);
                }
                context.stroke();
            }
        }

        let previousTime = performance.now();
        function frame(time) {
            const delta = Math.min(2, Math.max(0.35, (time - previousTime) / 16.667));
            previousTime = time;

            surfaces.forEach(surface => {
                updateSurface(surface, delta);
                drawSurface(surface);
            });

            window.requestAnimationFrame(frame);
        }

        window.requestAnimationFrame(frame);
    }

    initParticleBrandText();
    initElasticMeshCards();
    setOverlayInert(true);
    startEmojiRotation();
})();
