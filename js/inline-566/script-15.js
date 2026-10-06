/* v285：驻军篇四组子界面图片更新，并统一改为实业厂群同款缩略图 wide-carousel 展示 */
(function () {
    const zhujunCarouselMap = {
        hero: {
            selector: '.process-fusion-hero.process-fusion-clickable',
            title: '主场景 · 将军衙署',
            desc: '将军衙署作为王昌决策与指挥中心，展示军事管理、政务调度与防卫部署。',
            images: [
                'AIGC/绥远方志/驻军篇/驻军篇-将军衙署1.jpg',
                'AIGC/绥远方志/驻军篇/驻军篇-10.png',
                'AIGC/绥远方志/驻军篇/驻军篇-将军衙署2.jpg',
                'AIGC/绥远方志/驻军篇/驻军篇-将军衙署3.jpg',
                'AIGC/绥远方志/驻军篇/驻军篇-将军衙署4.jpg',
                'AIGC/绥远方志/驻军篇/驻军篇-将军衙署5.jpg',
                'AIGC/绥远方志/驻军篇/驻军篇-将军衙署6.jpg',
                'AIGC/绥远方志/驻军篇/驻军篇-将军衙署7.jpg',
                'AIGC/绥远方志/驻军篇/驻军篇-将军衙署8.jpg',
                'AIGC/绥远方志/驻军篇/驻军篇-将军衙署9.jpg',
                'AIGC/绥远方志/驻军篇/驻军篇-将军衙署10.jpg',
                'AIGC/绥远方志/驻军篇/驻军篇-将军衙署11.jpg',
                'AIGC/绥远方志/驻军篇/驻军篇-将军衙署12.jpg',
                'AIGC/绥远方志/驻军篇/驻军篇-4.png',
                'AIGC/绥远方志/驻军篇/驻军篇-6.png',
                'AIGC/绥远方志/驻军篇/驻军篇-7.png',
                'AIGC/绥远方志/驻军篇/驻军篇-8.png',
                'AIGC/绥远方志/驻军篇/驻军篇-9.png'
            ],
            labels: ['01 导航UI','02 将军衙署入口鸟瞰','03 将军衙署入口','04 入口第一视角','05 将军衙署正门','06 王昌将军','07 将军衙署正路','08 将军衙署院落东','09 将军衙署院落西','10 东北角鸟瞰','11 东北角入口鸟瞰','12 绥远城将军府留影壁','13 西南角凉亭','14 西南赑屃负碑','15 西部教院','16 将军衙署正路鸟瞰','17 东部鸟瞰','18 东北角留影壁']
        },
        town: {
            selector: '.process-fusion-town.process-fusion-clickable',
            title: '副场景 · 巡检司衙门',
            desc: '通过巡检司衙门表现巡检、治安与边务管理。',
            images: [
                'AIGC/绥远方志/驻军篇/驻军篇-巡检司1.jpg',
                'AIGC/绥远方志/驻军篇/驻军篇-巡检司2.jpg',
                'AIGC/绥远方志/驻军篇/驻军篇-巡检司3.jpg',
                'AIGC/绥远方志/驻军篇/驻军篇-巡检司4.jpg',
                'AIGC/绥远方志/驻军篇/驻军篇-巡检司5.jpg',
                'AIGC/绥远方志/驻军篇/驻军篇-巡检司6.jpg',
                'AIGC/绥远方志/驻军篇/驻军篇-巡检司7.jpg'
            ],
            labels: ['01 巡检司衙门鸟瞰','02 巡检司衙门正门','03 登闻鼓','04 衙门内堂','05 衙门官员对话','06 虎头鎏金调兵符牌','07 草原金铃']
        },
        market: {
            selector: '.process-fusion-market.process-fusion-clickable',
            title: '副场景 · 驻军营地',
            desc: '以营地、军械与军马场表现驻防体系和军事秩序。',
            images: [
                'AIGC/绥远方志/驻军篇/驻军篇-12.png',
                'AIGC/绥远方志/驻军篇/驻军篇-营地1.jpg',
                'AIGC/绥远方志/驻军篇/驻军篇-营地2.jpg',
                'AIGC/绥远方志/驻军篇/驻军篇-营地3.jpg',
                'AIGC/绥远方志/驻军篇/驻军篇-营地4.jpg',
                'AIGC/绥远方志/驻军篇/驻军篇-营地5.jpg',
                'AIGC/绥远方志/驻军篇/驻军篇-营地6.jpg',
                'AIGC/绥远方志/驻军篇/驻军篇-营地7.jpg',
                'AIGC/绥远方志/驻军篇/驻军篇-营地8.jpg',
                'AIGC/绥远方志/驻军篇/驻军篇-营地9.jpg'
            ],
            labels: ['01 驻军营地','02 驻军营地入口','03 入口西侧','04 驻军大营入口','05 营地帐篷队列','06 驻军大营','07 营地士兵训练','08 营地马场遛马','09 营地士兵队列','10 驻军营地哨塔']
        },
        closeup: {
            selector: '.process-fusion-closeup.process-fusion-clickable',
            title: '副场景 · 周边商贩集群摊位',
            desc: '通过商贩、车马与摊位，表现草原丝路初具规模的商贸景象。',
            images: [
                'AIGC/绥远方志/驻军篇/驻军篇-13.png',
                'AIGC/绥远方志/驻军篇/驻军篇-摊位1.jpg',
                'AIGC/绥远方志/驻军篇/驻军篇-摊位2.jpg',
                'AIGC/绥远方志/驻军篇/驻军篇-摊位3.jpg',
                'AIGC/绥远方志/驻军篇/驻军篇-摊位4.jpg'
            ],
            labels: ['01 周边商贩集群摊位','02 集群摊位入口','03 集群摊位介绍','04 集群摊位胡商','05 集群摊位驮运商人']
        }
    };

    let currentZhujunLabels = null;

    function isZhujunShowcase() {
        const showcase = document.getElementById('process-inline-copy-card');
        return showcase && !showcase.classList.contains('is-fusion-transport-merged-showcase') && !showcase.classList.contains('is-jiancheng-showcase') &&
            (document.getElementById('fusion-detail-title-img')?.alt || '').includes('驻军篇');
    }

    function applyZhujunLabelsOnce() {
        if (!currentZhujunLabels) return;
        const thumbs = document.getElementById('wide-carousel-thumbs');
        if (!thumbs) return;

        Array.from(thumbs.children).forEach(function (thumb, index) {
            const labelText = currentZhujunLabels[index] || (String(index + 1).padStart(2, '0') + ' 展示图');
            const label = thumb.querySelector('.wide-carousel-thumb-title') || thumb.querySelector('.thumb-title') || thumb.querySelector('span:last-child');
            if (label) label.textContent = labelText;
            thumb.setAttribute('aria-label', labelText);
            thumb.setAttribute('title', labelText);
            const img = thumb.querySelector('img');
            if (img) img.alt = labelText;
        });
    }

    document.addEventListener('click', function (event) {
        if (!isZhujunShowcase() || typeof window.openWideCarousel !== 'function') return;

        let config = null;
        Object.keys(zhujunCarouselMap).some(function (key) {
            const item = zhujunCarouselMap[key];
            if (event.target.closest && event.target.closest(item.selector)) {
                config = item;
                return true;
            }
            return false;
        });

        if (!config) return;

        event.preventDefault();
        event.stopPropagation();
        if (event.stopImmediatePropagation) event.stopImmediatePropagation();

        currentZhujunLabels = config.labels.slice();

        const oldLightbox = document.getElementById('fusion-image-lightbox');
        if (oldLightbox) {
            oldLightbox.classList.remove('is-open', 'is-dual', 'is-multi', 'is-stack-swapping');
            oldLightbox.setAttribute('aria-hidden', 'true');
            oldLightbox.style.display = 'none';
            oldLightbox.style.visibility = 'hidden';
            oldLightbox.style.pointerEvents = 'none';
        }

        window.openWideCarousel({
            chapter: '驻军篇',
            title: config.title,
            desc: config.desc,
            images: config.images.slice()
        });

        requestAnimationFrame(function () {
            applyZhujunLabelsOnce();
            setTimeout(applyZhujunLabelsOnce, 80);
            setTimeout(applyZhujunLabelsOnce, 180);
        });
    }, true);
})();







