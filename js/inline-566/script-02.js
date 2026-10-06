(function () {
    const overlay = document.getElementById('wide-carousel-overlay');
    if (!overlay) return;

    const bg = document.getElementById('wide-carousel-bg');
    const mainImg = document.getElementById('wide-carousel-main-img');
    const thumbs = document.getElementById('wide-carousel-thumbs');
    const titleEl = document.getElementById('wide-carousel-title');
    const descEl = document.getElementById('wide-carousel-desc');
    const chapterEl = document.getElementById('wide-carousel-chapter');
    const counterEl = document.getElementById('wide-carousel-counter');

    const prevBtn = overlay.querySelector('.wide-carousel-prev');
    const nextBtn = overlay.querySelector('.wide-carousel-next');
    const thumbPrev = overlay.querySelector('.wide-carousel-thumb-prev');
    const thumbNext = overlay.querySelector('.wide-carousel-thumb-next');

    let currentImages = [];
    let currentIndex = 0;

    function fitMainImageToRatio() {
        const stage = overlay.querySelector('.wide-carousel-stage');
        const wrap = overlay.querySelector('.wide-carousel-main-wrap');
        const thumbsShell = overlay.querySelector('.wide-carousel-thumbs-shell');
        if (!stage || !wrap || !mainImg) return;

        const naturalW = mainImg.naturalWidth || 16;
        const naturalH = mainImg.naturalHeight || 9;
        const ratio = naturalW / naturalH;

        // 3号：主图宽度跟缩略图卡片组背景外框宽度一致
        const shellRect = thumbsShell ? thumbsShell.getBoundingClientRect() : null;
        const panelRect = overlay.querySelector('.wide-carousel-panel')?.getBoundingClientRect();
        const maxW = shellRect?.width || (panelRect ? panelRect.width * 0.92 : stage.clientWidth);
        if (!maxW) return;

        const displayW = maxW;
        const displayH = displayW / ratio;

        wrap.style.setProperty('--wide-main-w', Math.round(displayW) + 'px');
        wrap.style.setProperty('--wide-main-h', Math.round(displayH) + 'px');
        wrap.style.setProperty('--wide-main-ratio', ratio);
    }

    if (mainImg) {
        mainImg.addEventListener('load', fitMainImageToRatio);
    }

    window.addEventListener('resize', function () {
        if (overlay.classList.contains('is-open')) {
            fitMainImageToRatio();
        }
    });


    const fallbackIndustryImages = [
        "AIGC/绥远方志/建成篇/建成篇-4.png",
        "AIGC/绥远方志/建成篇/建成篇-3.png",
        "AIGC/绥远方志/建成篇/建成篇-实业1.jpg",
        "AIGC/绥远方志/建成篇/建成篇-实业2.jpg",
        "AIGC/绥远方志/建成篇/建成篇-实业3.jpg",
        "AIGC/绥远方志/建成篇/建成篇-实业4.jpg",
        "AIGC/绥远方志/建成篇/建成篇-实业5.jpg",
        "AIGC/绥远方志/建成篇/建成篇-实业6.jpg",
        "AIGC/绥远方志/建成篇/建成篇-实业7.jpg",
        "AIGC/绥远方志/建成篇/建成篇-实业8.jpg"
    ];

    const thumbTitles = [
        '01 工厂全景鸟瞰',
        '02 工业街道景象',
        '03 实业厂区入口',
        '04 机械设备展示',
        '05 织布车间内部',
        '06 发电厂建筑',
        '07 实业厂房外观',
        '08 工业设施细节',
        '09 厂区道路',
        '10 实业厂群远景'
    ];

    function pad(num) {
        return String(num).padStart(2, '0');
    }

    function parseImagesFromCard(card) {
        const raw = card && card.dataset ? card.dataset.fusionFullImages : '';
        if (!raw) return [];
        try {
            const arr = JSON.parse(raw);
            return Array.isArray(arr) ? arr.filter(Boolean) : [];
        } catch (err) {
            return [];
        }
    }

    function renderThumbs() {
        thumbs.innerHTML = '';
        currentImages.forEach((src, index) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'wide-carousel-thumb' + (index === currentIndex ? ' is-active' : '');
            btn.innerHTML = `
                <span class="wide-carousel-thumb-img">
                    <span class="wide-carousel-thumb-img-inner">
                        <img draggable="false" src="${src}" alt="${thumbTitles[index] || `第${index + 1}张`}">
                    </span>
                </span>
                <span class="wide-carousel-thumb-title">${thumbTitles[index] || `${pad(index + 1)} 展示图`}</span>
            `;

            const img = btn.querySelector('img');
            img.addEventListener('load', function () {
                const ratio = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1.78;
                const h = img.getBoundingClientRect().height || parseFloat(window.getComputedStyle(img).height) || 82;
                const w = Math.max(72, Math.min(320, Math.round(h * ratio)));
                btn.style.setProperty('--thumb-w', w + 'px');
                if (btn.classList.contains('is-active')) {
                    window.setTimeout(function () {
                        const edgeGap = 10;
                        const maxScroll = Math.max(0, thumbs.scrollWidth - thumbs.clientWidth);
                        const targetLeft = Math.min(
                            maxScroll,
                            Math.max(0, btn.offsetLeft - edgeGap)
                        );
                        thumbs.scrollTo({
                            left: targetLeft,
                            behavior: 'auto'
                        });
                    }, 0);
                }
            });

            btn.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                setImage(index);
            });
            thumbs.appendChild(btn);
        });
    }

    function setImage(index) {
        if (!currentImages.length) return;
        currentIndex = (index + currentImages.length) % currentImages.length;

        const src = currentImages[currentIndex];
        mainImg.classList.add('is-switching');

        window.setTimeout(() => {
            mainImg.src = src;
            mainImg.alt = thumbTitles[currentIndex] || '实业厂群展示图';
            bg.style.backgroundImage = `url("${src}")`;
            const mainWrap = overlay.querySelector('.wide-carousel-main-wrap');
            if (mainWrap) mainWrap.style.backgroundImage = `url("${src}")`;
            counterEl.textContent = `${pad(currentIndex + 1)} / ${pad(currentImages.length)}`;

            Array.from(thumbs.children).forEach((el, i) => {
                el.classList.toggle('is-active', i === currentIndex);
            });

            const active = thumbs.children[currentIndex];
            if (active) {
                const edgeGap = 8;
                const maxScroll = Math.max(0, thumbs.scrollWidth - thumbs.clientWidth);
                const activeLeft = active.offsetLeft;
                const activeRight = activeLeft + active.offsetWidth;
                const viewLeft = thumbs.scrollLeft;
                const viewRight = viewLeft + thumbs.clientWidth;

                let targetLeft = viewLeft;
                if (activeLeft - edgeGap < viewLeft) {
                    targetLeft = activeLeft - edgeGap;
                } else if (activeRight + edgeGap > viewRight) {
                    targetLeft = activeRight + edgeGap - thumbs.clientWidth;
                }

                thumbs.scrollTo({
                    left: Math.max(0, Math.min(maxScroll, targetLeft)),
                    behavior: 'smooth'
                });
            }

            fitMainImageToRatio();
            mainImg.classList.remove('is-switching');
        }, 110);
    }

    function openWideCarousel(options) {
        // 关闭旧的层叠大图逻辑，避免方案3弹层打开后背后还残留堆叠卡片。
        document.querySelectorAll('.fusion-image-lightbox').forEach(function (oldLightbox) {
            oldLightbox.classList.remove('is-open', 'is-dual', 'is-stack-swapping', 'is-multi');
            oldLightbox.classList.add('is-force-hidden-after-wide');
            oldLightbox.setAttribute('aria-hidden', 'true');
            oldLightbox.style.display = 'none';
            oldLightbox.style.visibility = 'hidden';
            oldLightbox.style.pointerEvents = 'none';
        });

        currentImages = Array.isArray(options.images) && options.images.length
            ? options.images.filter(Boolean)
            : fallbackIndustryImages;

        currentIndex = 0;
        titleEl.textContent = options.title || '副场景 · 实业厂群';
        descEl.textContent = options.desc || '展示草原丝路的影响力以及实业厂的兴办。';
        chapterEl.textContent = options.chapter || '建成篇';

        renderThumbs();
        setImage(0);

        overlay.classList.add('is-open');
        overlay.setAttribute('aria-hidden', 'false');
        document.documentElement.classList.add('wide-carousel-lock');
        document.body.classList.add('wide-carousel-lock');

        window.setTimeout(fitMainImageToRatio, 0);
    }

    function closeWideCarousel() {
        overlay.classList.remove('is-open');
        overlay.setAttribute('aria-hidden', 'true');
        document.documentElement.classList.remove('wide-carousel-lock');
        document.body.classList.remove('wide-carousel-lock');

        document.querySelectorAll('.fusion-image-lightbox').forEach(function (box) {
            box.classList.remove('is-open', 'is-dual', 'is-stack-swapping', 'is-multi');
            box.setAttribute('aria-hidden', 'true');
            box.style.display = 'none';
            box.style.visibility = 'hidden';
            box.style.pointerEvents = 'none';
        });

        const panel = document.getElementById('process-inline-copy-card');
        if (panel) {
            panel.style.display = '';
            panel.style.visibility = '';
            panel.style.opacity = '';
            panel.style.pointerEvents = 'auto';
        }
    }

    prevBtn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        setImage(currentIndex - 1);
    });

    nextBtn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        setImage(currentIndex + 1);
    });

    thumbPrev.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        thumbs.scrollBy({ left: -Math.max(260, thumbs.clientWidth * 0.65), behavior: 'smooth' });
    });

    thumbNext.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        thumbs.scrollBy({ left: Math.max(260, thumbs.clientWidth * 0.65), behavior: 'smooth' });
    });

    overlay.querySelectorAll('[data-wide-close]').forEach(el => {
        el.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            closeWideCarousel();
        });
    });

    document.addEventListener('keydown', function (e) {
        if (!overlay.classList.contains('is-open')) return;
        if (e.key === 'Escape') closeWideCarousel();
        if (e.key === 'ArrowLeft') setImage(currentIndex - 1);
        if (e.key === 'ArrowRight') setImage(currentIndex + 1);
    });

    window.openWideCarousel = openWideCarousel;
    window.setWideCarouselImage = setImage;

    // 关键修复：捕获阶段拦截「建成篇」里的「副场景·实业厂群」卡。
    // 这样不会再走原来的层叠大图 lightbox。
    document.addEventListener('click', function (event) {
        const card = event.target.closest('.process-fusion-town.process-fusion-clickable');
        if (!card) return;

        const showcase = card.closest('#process-inline-copy-card');
        const titleText = (document.getElementById('fusion-town-title')?.textContent || card.dataset.fusionFullTitle || '').trim();

        const cardText = ((card.textContent || '') + ' ' + (card.dataset.fusionFullTitle || '') + ' ' + (card.dataset.wideCarouselTitle || '')).replace(/\s+/g, '');
        const isIndustryCard =
            cardText.includes('实业厂群') ||
            cardText.includes('实业工厂') ||
            titleText.includes('实业厂群') ||
            titleText.includes('实业工厂');

        if (!isIndustryCard) return;

        const images = parseImagesFromCard(card);
        const finalImages = images.length ? images : fallbackIndustryImages;

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        openWideCarousel({
            chapter: '建成篇',
            title: '副场景 · 实业厂群',
            desc: '展示草原丝路的影响力以及实业厂的兴办。',
            images: finalImages
        });
    }, true);
})();







