        (function () {
            const shell = document.querySelector('[data-hardware328-shell]');
            if (!shell) return;

            const tabs = Array.from(shell.querySelectorAll('[data-shell-tab]'));
            const panels = Array.from(shell.querySelectorAll('[data-shell-panel]'));
            const kicker = shell.querySelector('[data-shell-kicker]');
            const title = shell.querySelector('[data-shell-title]');
            const desc = shell.querySelector('[data-shell-desc]');
            const stage = shell.querySelector('.hardware328-shell-stage');
            const magnifier = shell.querySelector('.hardware328-magnifier');
            const industrialImage = shell.querySelector('[data-shell-magnify]');
            const modelSlides = Array.from(shell.querySelectorAll('.hardware328-model-carousel img'));
            let activePanel = 'sketch';
            let modelIndex = 0;

            function activateShellPanel(name, source) {
                activePanel = name;
                panels.forEach(panel => {
                    panel.classList.toggle('is-active', panel.dataset.shellPanel === name);
                });
                stage?.classList.remove('is-magnifying');

                tabs.forEach(tab => {
                    const active = tab.dataset.shellTab === name;
                    tab.classList.toggle('is-active', active);
                    tab.setAttribute('aria-selected', active ? 'true' : 'false');
                });

                if (source) {
                    kicker.textContent = source.dataset.kicker || '';
                    title.textContent = source.dataset.title || '';
                    desc.textContent = source.dataset.desc || '';
                }
            }

            tabs.forEach(tab => {
                tab.addEventListener('click', () => activateShellPanel(tab.dataset.shellTab, tab));
            });

            if (modelSlides.length > 1) {
                setInterval(() => {
                    modelSlides[modelIndex]?.classList.remove('is-current');
                    modelIndex = (modelIndex + 1) % modelSlides.length;
                    modelSlides[modelIndex]?.classList.add('is-current');
                }, 3000);
            }

            if (stage && magnifier && industrialImage) {
                const lensImage = magnifier.querySelector('img');

                stage.addEventListener('mousemove', event => {
                    if (activePanel !== 'industrial') {
                        stage.classList.remove('is-magnifying');
                        return;
                    }

                    const rect = stage.getBoundingClientRect();
                    const cardRect = shell.getBoundingClientRect();
                    const imgNaturalW = industrialImage.naturalWidth || 2983;
                    const imgNaturalH = industrialImage.naturalHeight || 1814;
                    const imgRatio = imgNaturalW / imgNaturalH;
                    const stageRatio = rect.width / rect.height;
                    let drawnW = rect.width;
                    let drawnH = rect.height;
                    let offsetX = 0;
                    let offsetY = 0;

                    if (imgRatio > stageRatio) {
                        drawnH = rect.height;
                        drawnW = rect.height * imgRatio;
                        offsetX = (rect.width - drawnW) / 2;
                    } else {
                        drawnW = rect.width;
                        drawnH = rect.width / imgRatio;
                        offsetY = (rect.height - drawnH) / 2;
                    }

                    const x = event.clientX - rect.left;
                    const y = event.clientY - rect.top;
                    const xPct = Math.max(0, Math.min(100, ((x - offsetX) / drawnW) * 100));
                    const yPct = Math.max(0, Math.min(100, ((y - offsetY) / drawnH) * 100));
                    const lensPad = Math.min(145, Math.max(112, cardRect.width * 0.23));
                    const lensX = Math.max(lensPad, Math.min(cardRect.width - lensPad, event.clientX - cardRect.left));
                    const lensY = Math.max(lensPad, Math.min(cardRect.height - lensPad, event.clientY - cardRect.top));
                    const zoom = 2.85;
                    const lensRect = magnifier.getBoundingClientRect();
                    const lensW = lensRect.width || 220;
                    const lensH = lensRect.height || 220;
                    const renderW = drawnW * zoom;
                    const renderH = drawnH * zoom;
                    const imageX = (xPct / 100) * renderW;
                    const imageY = (yPct / 100) * renderH;
                    const translateX = (lensW / 2) - imageX;
                    const translateY = (lensH / 2) - imageY;

                    magnifier.style.setProperty('--lens-x-px', `${lensX}px`);
                    magnifier.style.setProperty('--lens-y-px', `${lensY}px`);
                    if (lensImage) {
                        lensImage.style.width = `${renderW}px`;
                        lensImage.style.height = `${renderH}px`;
                        lensImage.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
                    }
                    stage.classList.add('is-magnifying');
                });

                stage.addEventListener('mouseleave', () => {
                    stage.classList.remove('is-magnifying');
                });
            }
        })();

        let currentActivePage = 'home', isExpanded = false;
        let currentX = 0, currentY = 0, targetX = 0, targetY = 0;   
        const lerpFactor = 0.05;
        const bg13EnterLerp = 0.08;
        const bg13ExitLerp = 0.10;
        const bg13StrengthLerp = 0.065;         

        // --- 逻辑整合：处理导航按钮颜色 ---
        function updateNavActiveState(pageId) {
            document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
            if (pageId === 'home') return;
            const activeBtn = document.getElementById(`nav-${pageId}`);
            if (activeBtn) activeBtn.classList.add('active');
        }

        document.addEventListener('dragstart', (e) => {
            if (e.target instanceof HTMLImageElement || e.target.closest('img')) {
                e.preventDefault();
            }
        }, true);

        function showPage(pageId) {
            currentActivePage = pageId;
            updateNavActiveState(pageId); // 调用导航状态更新
            document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
            document.getElementById(pageId).classList.add('active');
            document.getElementById('nav').style.display = (pageId === 'home' && !isExpanded) ? 'none' : 'flex';
            if (pageId === 'home' && !isExpanded) {
                document.getElementById('imagesDiv')?.classList.remove('visible');
            }
            window.dispatchEvent(new CustomEvent('portfolio-page-change',{detail:pageId}));
        }

        const wrapper3D = document.getElementById('bg-3d-wrapper'), content3D = document.getElementById('bg12-content'), bg12Img = document.getElementById('bg12-img');
        
        function renderLoop() {
            if (isExpanded && currentActivePage==='home' && !document.hidden && !wrapper3D.classList.contains('expanded-bg13')) {
                currentX += (targetX - currentX) * lerpFactor;
                currentY += (targetY - currentY) * lerpFactor;
                content3D.style.setProperty(
                    'transform',
                    `rotateX(${currentX}deg) rotateY(${currentY}deg)`,
                    'important'
                );
            }
            requestAnimationFrame(renderLoop);
        }
        renderLoop();

        function handleBg12Click() {
            isExpanded = true;
            document.getElementById('bg1').src = '主界面/背景1.4.png';
            document.getElementById('bg11').style.display = 'none';
            const bg13Img = document.getElementById('bg13-img');
            if (bg13Img) bg13Img.style.setProperty('display', 'block', 'important');

            const bg12Video = document.getElementById('bg12-video');
            const bg12VideoMask = document.getElementById('bg12-video-mask');
            if (bg12Video) {
                bg12Video.pause();
                bg12Video.style.setProperty('display', 'none', 'important');
                bg12Video.classList.remove('hover-scale');
            }
            if (bg12VideoMask) {
                bg12VideoMask.style.setProperty('display', 'none', 'important');
            }

            if (bg12Img) {
                bg12Img.style.cursor = 'default';
                bg12Img.classList.remove('hover-scale');
            }
            wrapper3D.classList.add('expanded-bg13');
            wrapper3D.style.cssText = '';
            document.getElementById('imagesDiv')?.classList.add('visible');
            document.getElementById('textDiv').classList.remove('hidden');
            document.getElementById('mainText').classList.add('animate-text');
            document.getElementById('nav').style.display = 'flex';
            // 进入 1.3 视图时清除所有导航激活色
            document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        }

                function openProject(id) {
            if (id !== 'suiyuan') return;

            const detail = document.getElementById('project-detail');
            if (!detail) return;

            document.body.classList.add('is-project-open');
            detail.style.display = 'block';
            detail.scrollTop = 0;
            document.body.style.overflow = 'hidden';
        }

        function closeProject() {
            const detail = document.getElementById('project-detail');
            if (!detail) return;

            detail.style.display = 'none';
            document.body.classList.remove('is-project-open');
            document.body.style.overflow = 'hidden';
        }

        // 绥远方志：设计内容四篇章原地展开详情（只展示对应 -1 大图）
        const PROCESS_DETAIL_DATA = {
    "筹备篇": {
        mode: "showcase",
        title: "筹备篇：阿拉坦汗",
        titleImage: "AIGC/绥远方志/筹备篇/筹备篇-文字卡.png",
        textCardImage: "AIGC/绥远方志/筹备篇/筹备篇-文字卡.png",
        introBg: "AIGC/绥远方志/筹备篇/筹备篇.png",
        summary: "这里是万历三年的归化城复原场景，由城墙，钟鼓楼，接官厅构成，为了让每一位来访者都能直观触摸城市千年风云，才打造了数字沙盘与可触摸微缩建筑，让城墙、接官厅的故事“活”在眼前。在这里游览你可以和阿拉坦汗一起了解归化城建城之始和因何而建，接官厅内有进入到驻军篇的镇边金符，拾取即可进入下个篇章。",
        summaryLines: [
            "这里是万历三年的归化城复原场景，由城墙、钟鼓楼、接官厅构成，为了让每一位来访者都能直观触摸城市千年风云，",
            "才打造了数字沙盘与可触摸微缩建筑，让城墙、接官厅的故事“活”在眼前。在这里游览你可以和阿拉坦汗一起了解归化城建城之始和因何而建，",
            "接官厅内有进入到驻军篇的镇边金符，拾取即可进入下个篇章。"
        ],
        images: {
            hero: "AIGC/绥远方志/筹备篇/筹备篇-开场1.jpg",
            town: "AIGC/绥远方志/筹备篇/筹备篇-4.png",
            market: "AIGC/绥远方志/筹备篇/筹备篇-接官厅1.jpg",
            closeup: "AIGC/绥远方志/筹备篇/筹备篇-商贩1.jpg",
            character: "AIGC/绥远方志/筹备篇/筹备篇-阿拉坦汗.png",
            motion: "AIGC/绥远方志/筹备篇/筹备篇-viggle.jpg"
        },
        fullImages: {
            hero: [
                "AIGC/绥远方志/筹备篇/筹备篇-开场1.jpg",
                "AIGC/绥远方志/筹备篇/筹备篇-开场2.jpg",
                "AIGC/绥远方志/筹备篇/筹备篇-开场3.jpg",
                "AIGC/绥远方志/筹备篇/筹备篇-开场4.jpg",
                "AIGC/绥远方志/筹备篇/筹备篇-入口.jpg",
                "AIGC/绥远方志/筹备篇/筹备篇-7.png",
                "AIGC/绥远方志/筹备篇/筹备篇-沙盘1.jpg",
                "AIGC/绥远方志/筹备篇/筹备篇-沙盘2.jpg",
                "AIGC/绥远方志/筹备篇/筹备篇-沙盘3.jpg",
                "AIGC/绥远方志/筹备篇/筹备篇-沙盘4.jpg",
                "AIGC/绥远方志/筹备篇/筹备篇-沙盘5.jpg"
            ],
            town: [
                "AIGC/绥远方志/筹备篇/筹备篇-4.png",
                "AIGC/绥远方志/筹备篇/筹备篇-城墙1.jpg",
                "AIGC/绥远方志/筹备篇/筹备篇-城墙2.jpg",
                "AIGC/绥远方志/筹备篇/筹备篇-城墙3.jpg",
                "AIGC/绥远方志/筹备篇/筹备篇-城墙4.jpg",
                "AIGC/绥远方志/筹备篇/筹备篇-城墙5.jpg",
                "AIGC/绥远方志/筹备篇/筹备篇-城墙6.jpg"
            ],
            market: [
                "AIGC/绥远方志/筹备篇/筹备篇-接官厅1.jpg",
                "AIGC/绥远方志/筹备篇/筹备篇-5.png",
                "AIGC/绥远方志/筹备篇/筹备篇-接官厅2.jpg",
                "AIGC/绥远方志/筹备篇/筹备篇-接官厅3.jpg",
                "AIGC/绥远方志/筹备篇/筹备篇-6.png",
                "AIGC/绥远方志/筹备篇/筹备篇-接官厅4.jpg",
                "AIGC/绥远方志/筹备篇/筹备篇-接官厅5.jpg",
                "AIGC/绥远方志/筹备篇/筹备篇-接官厅6.jpg"
            ],
            closeup: [
                "AIGC/绥远方志/筹备篇/筹备篇-商贩1.jpg",
                "AIGC/绥远方志/筹备篇/筹备篇-8.png",
                "AIGC/绥远方志/筹备篇/筹备篇-商贩2.jpg",
                "AIGC/绥远方志/筹备篇/筹备篇-商贩3.jpg"
            ],
            character: [
                "AIGC/绥远方志/筹备篇/筹备篇-阿拉坦汗.png",
                "AIGC/绥远方志/筹备篇/筹备篇-2.png"
            ],
            motion: [
                "AIGC/绥远方志/筹备篇/筹备篇-viggle.jpg",
                "AIGC/绥远方志/筹备篇/筹备篇-3.png"
            ]
        },
        captions: {
            hero: { title: "主场景 · 古展馆沙盘", desc: "通过数字沙盘呈现归化城初期城市规划与发展。", extraTitle: "主场景 · 古展馆沙盘" },
            town: { title: "副场景 · 城墙与钟鼓楼", desc: "展示建城初期的防御体系与城市空间轮廓。", extraTitle: "副场景 · 城墙与钟鼓楼" },
            market: { title: "副场景 · 接官厅", desc: "用厅内陈设与人物叙事表现接待来使与政务往来的空间。", extraTitle: "副场景 · 接官厅组图" },
            closeup: { title: "副场景 · 商贩摊位", desc: "通过沿墙摊位与器物细节展现草原丝路雏形的市井生活。", extraTitle: "副场景 · 商贩摊位" },
            character: { title: "角色设定 · 阿拉坦汗", desc: "从历史参考、版本迭代到最终低模角色设定的整理展示。", extraTitle: "角色设定 · 阿拉坦汗组图" },
            motion: { title: "角色建模与展示", desc: "展示阿拉坦汗角色在建模与动态展示中的呈现效果。", copy: "结合角色设定对阿拉坦汗进行建模与动态展示，呈现角色形象、视图输出与动作效果。", extraTitle: "角色建模与展示组图" }
        }
    },
    "融合篇": {
        mode: "showcase",
        title: "融合篇：王昭君",
        titleImage: "AIGC/绥远方志/融合篇/融合篇-7.png",
        textCardImage: "AIGC/绥远方志/融合篇/融合篇-7.png",
        introBg: "AIGC/绥远方志/融合篇/融合篇-6.png",
        summary: "这里是乾隆六年的走西口复原场景，在这里游览你可以和王昭君一起了解走西口和草原丝路发展顶峰时期的交汇融合，客栈桌子上有进入到建成篇的贸路金凭，拾取即可进入下个篇章。",
        summaryLines: [
            "这里是乾隆六年的走西口复原场景，在这里游览你可以和王昭君一起了解走西口和草原丝路发展顶峰时期的交汇融合，",
            "客栈桌子上有进入到建成篇的贸路金凭，拾取即可进入下个篇章。"
        ],
        images: {
            hero: "AIGC/绥远方志/融合篇/融合篇-市井1.jpg",
            town: "AIGC/绥远方志/融合篇/融合篇-商队1.jpg",
            market: "AIGC/绥远方志/融合篇/融合篇-4.png",
            closeup: "AIGC/绥远方志/融合篇/融合篇-4.png",
            character: "AIGC/绥远方志/融合篇/融合篇-王昭君.png",
            motion: "AIGC/绥远方志/融合篇/融合篇-viggle.jpg"
        },
        fullImages: {
            hero: [
                "AIGC/绥远方志/融合篇/融合篇-市井1.jpg",
                "AIGC/绥远方志/融合篇/融合篇-3.png",
                "AIGC/绥远方志/融合篇/融合篇-市井2.jpg",
                "AIGC/绥远方志/融合篇/融合篇-市井3.jpg",
                "AIGC/绥远方志/融合篇/融合篇-市井4.jpg",
                "AIGC/绥远方志/融合篇/融合篇-市井5.jpg",
                "AIGC/绥远方志/融合篇/融合篇-市井6.jpg",
                "AIGC/绥远方志/融合篇/融合篇-市井7.jpg"
            ],
            town: [
                "AIGC/绥远方志/融合篇/融合篇-商队1.jpg",
                "AIGC/绥远方志/融合篇/融合篇-商队2.jpg",
                "AIGC/绥远方志/融合篇/融合篇-商队3.jpg",
                "AIGC/绥远方志/融合篇/融合篇-商队4.jpg",
                "AIGC/绥远方志/融合篇/融合篇-商队5.jpg",
                "AIGC/绥远方志/融合篇/融合篇-商队6.jpg"
            ],
            market: [
                "AIGC/绥远方志/融合篇/融合篇-4.png",
                "AIGC/绥远方志/融合篇/融合篇-5.png",
                "AIGC/绥远方志/融合篇/融合篇-6.png"
            ],
            character: [
                "AIGC/绥远方志/融合篇/融合篇-王昭君.png",
                "AIGC/绥远方志/融合篇/融合篇-2.png"
            ]
        },
        captions: {
            hero: { title: "主场景 · 市井聚落", desc: "描绘市井聚落中的商贸往来与生活场景。", extraTitle: "主场景 · 市井聚落组图" },
            town: { title: "副场景 · 草原丝路鼎盛时期的运输场景", desc: "展现商队运输、驼队行进与草原丝路商贸流动。", extraTitle: "副场景 · 草原丝路鼎盛时期的运输场景组图" },
            market: { title: "副场景 · 走西口驼队", desc: "以走西口驼队为核心，表现迁徙、运输与商贸联结。", extraTitle: "副场景 · 走西口驼队组图" },
            closeup: { title: "细节展示 · 人物与驼运", desc: "人物服饰与驼运细节刻画，增强历史代入感。" },
            character: { title: "角色设定 · 王昭君", desc: "从史料参考、生成过程到最终角色设定。" },
            motion: { title: "动作设计与合成展示", desc: "结合角色设定进行动作设计，并通过 Viggle 合成动态效果。", copy: "结合角色设定进行动作设计，并通过 Viggle 合成动态效果。" }
        }
    },
    "驻军篇": {
        mode: "showcase",
        title: "驻军篇：王昌",
        titleImage: "AIGC/绥远方志/驻军篇/驻军篇-文字卡.png",
        textCardImage: "AIGC/绥远方志/驻军篇/驻军篇-文字卡.png",
        introBg: "AIGC/绥远方志/驻军篇/驻军篇-4.png",
        summary: "这里是乾隆二年的绥远城复原场景，由将军衙署、巡检司、驻军营地构成，在这里游览你可以和王昌一起了解建于归化城东北的绥远城是驻防之所，以及升迁至此的建威将军王昌，巡检司内有进入到融合篇的草原金哨，拾取即可进入下个篇章。",
        summaryLines: [
            "这里是乾隆二年的绥远城复原场景，由将军衙署、巡检司、驻军营地构成；在这里游览，你可以和王昌一起了解建于归化城东北的绥远城是驻防之所，",
            "以及升迁至此的建威将军王昌；巡检司内有进入到融合篇的草原金哨，拾取即可进入下个篇章。"
        ],
        images: {
            hero: "AIGC/绥远方志/驻军篇/驻军篇-将军衙署1.jpg",
            town: "AIGC/绥远方志/驻军篇/驻军篇-巡检司1.jpg",
            market: "AIGC/绥远方志/驻军篇/驻军篇-12.png",
            closeup: "AIGC/绥远方志/驻军篇/驻军篇-13.png",
            character: "AIGC/绥远方志/驻军篇/驻军篇-王昌.png",
            motion: "AIGC/绥远方志/驻军篇/驻军篇-viggle.jpg"
        },
        fullImages: {
            hero: [
                "AIGC/绥远方志/驻军篇/驻军篇-将军衙署1.jpg",
                "AIGC/绥远方志/驻军篇/驻军篇-10.png",
                "AIGC/绥远方志/驻军篇/驻军篇-将军衙署2.jpg",
                "AIGC/绥远方志/驻军篇/驻军篇-将军衙署3.jpg",
                "AIGC/绥远方志/驻军篇/驻军篇-将军衙署4.jpg",
                "AIGC/绥远方志/驻军篇/驻军篇-将军衙署5.jpg",
                "AIGC/绥远方志/驻军篇/驻军篇-将军衙署6.jpg",
                "AIGC/绥远方志/驻军篇/驻军篇-将军衙署7.jpg",
                "AIGC/绥远方志/驻军篇/驻军篇-将军衙署8.jpg",
                "AIGC/绥远方志/驻军篇/驻军篇-将军衙署9.jpg",
                "AIGC/绥远方志/驻军篇/驻军篇-将军衙署10.jpg",
                "AIGC/绥远方志/驻军篇/驻军篇-将军衙署11.jpg",
                "AIGC/绥远方志/驻军篇/驻军篇-将军衙署12.jpg",
                "AIGC/绥远方志/驻军篇/驻军篇-4.png",
                "AIGC/绥远方志/驻军篇/驻军篇-6.png",
                "AIGC/绥远方志/驻军篇/驻军篇-7.png",
                "AIGC/绥远方志/驻军篇/驻军篇-8.png",
                "AIGC/绥远方志/驻军篇/驻军篇-9.png"
            ],
            town: [
                "AIGC/绥远方志/驻军篇/驻军篇-巡检司1.jpg",
                "AIGC/绥远方志/驻军篇/驻军篇-巡检司2.jpg",
                "AIGC/绥远方志/驻军篇/驻军篇-巡检司3.jpg",
                "AIGC/绥远方志/驻军篇/驻军篇-巡检司4.jpg",
                "AIGC/绥远方志/驻军篇/驻军篇-巡检司5.jpg",
                "AIGC/绥远方志/驻军篇/驻军篇-巡检司6.jpg",
                "AIGC/绥远方志/驻军篇/驻军篇-巡检司7.jpg"
            ],
            market: [
                "AIGC/绥远方志/驻军篇/驻军篇-12.png",
                "AIGC/绥远方志/驻军篇/驻军篇-营地1.jpg",
                "AIGC/绥远方志/驻军篇/驻军篇-营地2.jpg",
                "AIGC/绥远方志/驻军篇/驻军篇-营地3.jpg",
                "AIGC/绥远方志/驻军篇/驻军篇-营地4.jpg",
                "AIGC/绥远方志/驻军篇/驻军篇-营地5.jpg",
                "AIGC/绥远方志/驻军篇/驻军篇-营地6.jpg",
                "AIGC/绥远方志/驻军篇/驻军篇-营地7.jpg",
                "AIGC/绥远方志/驻军篇/驻军篇-营地8.jpg",
                "AIGC/绥远方志/驻军篇/驻军篇-营地9.jpg"
            ],
            closeup: [
                "AIGC/绥远方志/驻军篇/驻军篇-13.png",
                "AIGC/绥远方志/驻军篇/驻军篇-摊位1.jpg",
                "AIGC/绥远方志/驻军篇/驻军篇-摊位2.jpg",
                "AIGC/绥远方志/驻军篇/驻军篇-摊位3.jpg",
                "AIGC/绥远方志/驻军篇/驻军篇-摊位4.jpg"
            ],
            character: [
                "AIGC/绥远方志/驻军篇/驻军篇-王昌.png",
                "AIGC/绥远方志/驻军篇/驻军篇-2.png"
            ],
            motion: [
                "AIGC/绥远方志/驻军篇/驻军篇-viggle.jpg",
                "AIGC/绥远方志/驻军篇/驻军篇-3.png"
            ]
        },
        captions: {
            hero: { title: "主场景 · 将军衙署", desc: "将军衙署作为王昌决策与指挥中心，展示军事管理、政务调度与防卫部署。", extraTitle: "主场景 · 将军衙署组图" },
            town: { title: "副场景 · 巡检司衙门", desc: "通过巡检司衙门表现巡检、治安与边务管理。", extraTitle: "副场景 · 巡检司衙门组图" },
            market: { title: "副场景 · 驻军营地", desc: "以营地、军械与军马场表现驻防体系和军事秩序。", extraTitle: "副场景 · 驻军营地" },
            closeup: { title: "副场景 · 周边商贩集群摊位", desc: "通过商贩、车马与摊位，表现草原丝路初具规模的商贸景象。", extraTitle: "副场景 · 商贩集群摊位组图" },
            character: { title: "角色设定 · 王昌", desc: "从历史参考、形象迭代到最终低模角色设定的整理展示。", extraTitle: "角色设定 · 王昌组图" },
            motion: { title: "角色建模与展示", desc: "展示王昌低模角色在建模与动态展示中的呈现效果。", copy: "结合角色设定对王昌进行低模建模与动态展示，呈现角色形象、视图输出与动作效果。", extraTitle: "角色建模与展示组图" }
        }
    },
    "建成篇": {
        mode: "showcase",
        title: "建成篇：段履庄",
        titleImage: "AIGC/绥远方志/建成篇/建成篇-3.png",
        textCardImage: "AIGC/绥远方志/建成篇/建成篇-1.png",
        introBg: "AIGC/绥远方志/建成篇/建成篇-4.png",
        summary: "这里是民国十八年的大盛魁复原场景，由大盛魁和实业工厂构成，在这里游览你可以和段履庄一起了解大盛魁的经济转型与发展。",
        summaryLines: [
            "这里是民国十八年的大盛魁复原场景，由大盛魁和实业工厂构成，",
            "在这里游览你可以和段履庄一起了解大盛魁的经济转型与发展。"
        ],
        images: {
            hero: "AIGC/绥远方志/建成篇/建成篇-大盛魁1.jpg",
            town: "AIGC/绥远方志/建成篇/建成篇-4.png",
            market: "AIGC/绥远方志/建成篇/建成篇-二十二1.jpg",
            closeup: "AIGC/绥远方志/建成篇/建成篇-5.png",
            character: "AIGC/绥远方志/建成篇/建成篇-段履庄.png",
            motion: "AIGC/绥远方志/建成篇/建成篇-viggle.jpg"
        },
        fullImages: {
            hero: [
                "AIGC/绥远方志/建成篇/建成篇-大盛魁1.jpg",
                "AIGC/绥远方志/建成篇/建成篇-大盛魁2.jpg",
                "AIGC/绥远方志/建成篇/建成篇-大盛魁3.jpg",
                "AIGC/绥远方志/建成篇/建成篇-大盛魁4.jpg"
            ],
            town: [
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
            ],
            market: [
                "AIGC/绥远方志/建成篇/建成篇-二十二1.jpg",
                "AIGC/绥远方志/建成篇/建成篇-二十二2.jpg",
                "AIGC/绥远方志/建成篇/建成篇-二十二3.jpg",
                "AIGC/绥远方志/建成篇/建成篇-二十二4.jpg",
                "AIGC/绥远方志/建成篇/建成篇-二十二5.jpg",
                "AIGC/绥远方志/建成篇/建成篇-二十二6.jpg",
                "AIGC/绥远方志/建成篇/建成篇-二十二7.jpg",
                "AIGC/绥远方志/建成篇/建成篇-二十二8.jpg"
            ],
            closeup: [],
            character: [
                "AIGC/绥远方志/建成篇/建成篇-段履庄.png",
                "AIGC/绥远方志/建成篇/建成篇-2.png"
            ],
            motion: [
                "AIGC/绥远方志/建成篇/建成篇-viggle.jpg"
            ]
        },
        captions: {
            hero: { title: "主场景 · 大盛魁", desc: "以大盛魁为核心，展示商帮经营与经济转型的关键空间。", extraTitle: "主场景 · 大盛魁组图" },
            town: { title: "副场景 · 实业厂群", desc: "展示草原丝路的影响力以及实业厂的兴办。", extraTitle: "副场景 · 实业厂群" },
            market: { title: "副场景 · 集二十二省之奇货", desc: "进入大盛魁靠近段履庄了解大盛魁巅峰时期的繁荣与兴盛", extraTitle: "副场景 · 集二十二省之奇货组图" },
            closeup: { title: "细节展示 · 发电厂与商贸器物", desc: "", extraTitle: "" },
            character: { title: "角色设定 · 段履庄", desc: "从历史参考、形象迭代到最终低模角色设定的整理展示。", extraTitle: "角色设定 · 段履庄组图" },
            motion: { title: "角色建模与展示", desc: "展示段履庄低模角色在建模与动态展示中的呈现效果。", copy: "结合角色设定对段履庄进行低模建模与动态展示，呈现角色形象、视图输出与动作效果。", extraTitle: "角色建模与展示" }
        }
    }

};

function setTextById(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value || "";
}

function setImgById(id, src, alt) {
    const img = document.getElementById(id);
    if (!img) return;
    img.src = src || "";
    img.alt = alt || "";
}

function setProcessCardMeta(cardSelector, titleId, descId, title, desc) {
    const card = document.querySelector(cardSelector);
    if (card) {
        card.dataset.fusionFullTitle = title || '';
    }
    setTextById(titleId, title || '');
    setTextById(descId, desc || '');
}

function setProcessCardLightboxExtra(cardSelector, extraSrc, extraTitle) {
    const card = document.querySelector(cardSelector);
    if (!card) return;

    if (extraSrc) {
        card.dataset.fusionFullExtra = extraSrc;
        card.dataset.fusionFullExtraTitle = extraTitle || '';
    } else {
        delete card.dataset.fusionFullExtra;
        delete card.dataset.fusionFullExtraTitle;
    }
}

function setProcessCardFullImages(cardSelector, images, title) {
    const card = document.querySelector(cardSelector);
    if (!card) return;

    if (Array.isArray(images) && images.length) {
        card.dataset.fusionFullImages = JSON.stringify(images);
        card.dataset.fusionFullTitle = title || card.dataset.fusionFullTitle || '';
    } else {
        delete card.dataset.fusionFullImages;
    }
}

function toProcessAssetUrl(src) {
    if (!src) return '';
    try {
        return new URL(src, document.baseURI).href;
    } catch (error) {
        return src;
    }
}

function setProcessIntroBackground(src) {
    const intro = document.querySelector('.process-fusion-intro.process-fusion-panel');
    if (!intro) return;
    if (src) {
        intro.style.setProperty('--process-intro-bg', `url("${toProcessAssetUrl(src)}")`);
    } else {
        intro.style.removeProperty('--process-intro-bg');
    }
}

function setProcessTextCardBackground(src) {
    const card = document.querySelector('.process-fusion-text-image-wrap');
    if (!card) return;
    if (src) {
        card.style.setProperty('--process-text-card-bg', `url("${toProcessAssetUrl(src)}")`);
    } else {
        card.style.removeProperty('--process-text-card-bg');
    }
}

const PROCESS_DEFAULT_SUMMARY = "本设计围绕四个篇章、一个展馆、四个角色及四个故事线展开，涵盖历史、文化与经济转型的深刻叙述。每个篇章通过场景展示角色的故事线，反映了草原丝路、军事、文化融合和经济变革的过程。";

function renderProcessSummaryLines(lines) {
    const summary = document.getElementById('process-summary-text') || document.querySelector('.process-summary-text');
    if (!summary) return;

    const safeLines = Array.isArray(lines) ? lines : [lines || PROCESS_DEFAULT_SUMMARY];

    summary.innerHTML = safeLines.map(line => `
        <span class="process-summary-line">
            <span class="process-summary-mark" aria-hidden="true"></span>
            <span class="process-summary-line-text">${line}</span>
            <span class="process-summary-mark" aria-hidden="true"></span>
        </span>
    `).join('');
}

function setProcessSummaryMode(mode) {
    const summary = document.getElementById('process-summary-text') || document.querySelector('.process-summary-text');
    if (!summary) return;

    summary.classList.toggle('is-fusion-summary', mode === 'detail');
    summary.classList.toggle('is-default-summary', mode !== 'detail');
}

function swapProcessSummaryWithTransition(mode, lines) {
    const summary = document.getElementById('process-summary-text') || document.querySelector('.process-summary-text');
    if (!summary) return;

    summary.classList.remove('is-summary-switching-in');
    summary.classList.add('is-summary-switching-out');

    window.setTimeout(() => {
        setProcessSummaryMode(mode);

        if (mode !== 'detail') {
            summary.style.removeProperty('--fusion-summary-y');
        }

        renderProcessSummaryLines(lines);

        if (mode === 'detail') {
            positionFusionSummaryUnderShowcase();
        }

        summary.classList.remove('is-summary-switching-out');
        summary.classList.add('is-summary-switching-in');

        window.setTimeout(() => {
            summary.classList.remove('is-summary-switching-in');
        }, 360);
    }, 170);
}

function setProcessSummaryText(summaryText, lines) {
    if (lines && lines.length) {
        swapProcessSummaryWithTransition('detail', lines);
        return;
    }

    if (summaryText && summaryText !== PROCESS_DEFAULT_SUMMARY) {
        swapProcessSummaryWithTransition('detail', [summaryText]);
        return;
    }

    swapProcessSummaryWithTransition('default', [
        "本设计围绕四个篇章、一个展馆、四个角色及四个故事线展开，涵盖历史、文化与经济转型的深刻叙述。",
        "每个篇章通过场景展示角色的故事线，反映了草原丝路、军事、文化融合和经济变革的过程。"
    ]);
}


function updateSuiyuanProcessRelativeSize() {
    const projectDetail = document.getElementById('project-detail');
    if (!projectDetail) return;

    const gallery = document.querySelector('.process-card-gallery');
    if (!gallery) return;

    const rect = gallery.getBoundingClientRect();
    if (!rect.width || !rect.height || rect.width < 100 || rect.height < 100) return;

    projectDetail.style.setProperty('--process-gallery-w', `${rect.width}px`);
    projectDetail.style.setProperty('--process-gallery-h', `${rect.height}px`);
}

function openProcessDetail(card) {
    resetProcessStageCards();

    const panel = document.getElementById('process-inline-detail');
    const showcase = document.getElementById('process-inline-copy-card');
    const simpleImg = document.getElementById('process-inline-copy-img');

    if (!panel || !card || !showcase || !simpleImg) return;

    updateSuiyuanProcessRelativeSize();

    const title = card.dataset.processTitle || "设计内容";
    const data = PROCESS_DETAIL_DATA[title];

    panel.classList.remove('is-open');
    showcase.classList.remove('is-simple');
    showcase.classList.toggle('is-fusion-transport-merged-showcase', title === '融合篇');
    showcase.classList.toggle('is-jiancheng-showcase', title === '建成篇');

    if (data && data.mode === "showcase") {
        showcase.classList.remove('is-simple');
        setProcessSummaryText(data.summary || PROCESS_DEFAULT_SUMMARY, data.summaryLines || null);

        setImgById("fusion-detail-title-img", data.titleImage || "", data.title);
        const textCardImage = data.textCardImage || data.titleImage || "";
        setImgById("fusion-detail-text-card-img", textCardImage, data.title + "文字卡片");
        setProcessIntroBackground(data.introBg || '');
        setProcessTextCardBackground(textCardImage || data.introBg || '');

        setImgById("fusion-hero-img", data.images.hero, (data.captions.hero && data.captions.hero.title) || "主场景");
        setImgById("fusion-town-img", data.images.town, (data.captions.town && data.captions.town.title) || "副场景");
        setImgById("fusion-market-img", data.images.market, (data.captions.market && data.captions.market.title) || "副场景");
        setImgById("fusion-closeup-img", data.images.closeup, (data.captions.closeup && data.captions.closeup.title) || "细节展示");
        setImgById("fusion-character-img", data.images.character, (data.captions.character && data.captions.character.title) || "角色设定");
        setImgById("fusion-motion-img", data.images.motion, (data.captions.motion && data.captions.motion.title) || "展示");

        setProcessCardMeta('.process-fusion-hero', 'fusion-hero-title', 'fusion-hero-desc', data.captions.hero.title, data.captions.hero.desc);
        setProcessCardLightboxExtra('.process-fusion-hero', data.lightboxExtra && data.lightboxExtra.hero, (data.captions.hero && data.captions.hero.extraTitle) || data.captions.hero.title || '');
        setProcessCardFullImages('.process-fusion-hero', data.fullImages && data.fullImages.hero, (data.captions.hero && data.captions.hero.extraTitle) || data.captions.hero.title || '');

        setProcessCardMeta('.process-fusion-town', 'fusion-town-title', 'fusion-town-desc', data.captions.town.title, data.captions.town.desc);
        setProcessCardLightboxExtra('.process-fusion-town', data.lightboxExtra && data.lightboxExtra.town, (data.captions.town && data.captions.town.extraTitle) || data.captions.town.title || '');
        setProcessCardFullImages('.process-fusion-town', data.fullImages && data.fullImages.town, (data.captions.town && data.captions.town.extraTitle) || data.captions.town.title || '');

        setProcessCardMeta('.process-fusion-market', 'fusion-market-title', 'fusion-market-desc', data.captions.market.title, data.captions.market.desc);
        setProcessCardLightboxExtra('.process-fusion-market', data.lightboxExtra && data.lightboxExtra.market, (data.captions.market && data.captions.market.extraTitle) || data.captions.market.title || '');
        setProcessCardFullImages('.process-fusion-market', data.fullImages && data.fullImages.market, (data.captions.market && data.captions.market.extraTitle) || data.captions.market.title || '');

        setProcessCardMeta('.process-fusion-closeup', 'fusion-closeup-title', 'fusion-closeup-desc', data.captions.closeup.title, data.captions.closeup.desc);
        setProcessCardLightboxExtra('.process-fusion-closeup', data.lightboxExtra && data.lightboxExtra.closeup, (data.captions.closeup && data.captions.closeup.extraTitle) || data.captions.closeup.title || '');
        setProcessCardFullImages('.process-fusion-closeup', data.fullImages && data.fullImages.closeup, (data.captions.closeup && data.captions.closeup.extraTitle) || data.captions.closeup.title || '');

        setProcessCardMeta('.process-fusion-character', 'fusion-character-title', 'fusion-character-desc', data.captions.character.title, data.captions.character.desc);
        setProcessCardLightboxExtra('.process-fusion-character', data.lightboxExtra && data.lightboxExtra.character, (data.captions.character && data.captions.character.extraTitle) || data.captions.character.title || '');
        setProcessCardFullImages('.process-fusion-character', data.fullImages && data.fullImages.character, (data.captions.character && data.captions.character.extraTitle) || data.captions.character.title || '');

        setProcessCardMeta('.process-fusion-motion', 'fusion-motion-heading', 'fusion-motion-copy', data.captions.motion.title, data.captions.motion.copy || data.captions.motion.desc);
        setProcessCardLightboxExtra('.process-fusion-motion', data.lightboxExtra && data.lightboxExtra.motion, (data.captions.motion && data.captions.motion.extraTitle) || data.captions.motion.title || '');
        setProcessCardFullImages('.process-fusion-motion', data.fullImages && data.fullImages.motion, (data.captions.motion && data.captions.motion.extraTitle) || data.captions.motion.title || '');

        simpleImg.src = "";
        simpleImg.alt = "";
    } else {
        // 其他篇章暂时保持原来的 -1 单图打开方式
        setProcessIntroBackground('');
        setProcessTextCardBackground('');
        setProcessSummaryText(PROCESS_DEFAULT_SUMMARY);
        showcase.classList.add('is-simple');
        simpleImg.src = card.dataset.processCopy || '';
        simpleImg.alt = `${title} 角色内容`;
    }

    positionProcessInlineDetail();
    positionFusionSummaryUnderShowcase();

    void panel.offsetWidth;
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
}


function resetProcessStageCards() {
    const cards = document.querySelectorAll('.process-stage-card');
    const nodes = document.querySelectorAll('.process-timeline-node');

    cards.forEach((card) => {
        card.classList.remove('is-process-tilting');

        const inner = card.querySelector('.process-stage-inner');
        if (inner) {
            inner.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
        }
    });

    nodes.forEach((node) => {
        node.classList.remove('is-node-active');

        const circles = node.querySelectorAll('circle');
        const nodeDefaultR = [14.5, 9.2, 3.4];

        circles.forEach((circle, i) => {
            if (nodeDefaultR[i] !== undefined) {
                circle.setAttribute('r', nodeDefaultR[i]);
            }
        });
    });
}


        function closeProcessDetail() {
            const panel = document.getElementById('process-inline-detail');
            if (!panel) return;

            closeFusionImageLightbox();

            panel.classList.remove('is-open');
            panel.setAttribute('aria-hidden', 'true');

            setProcessSummaryText(PROCESS_DEFAULT_SUMMARY);
            resetProcessStageCards();

        }

        function positionProcessInlineDetail() {
            const panel = document.getElementById('process-inline-detail');
            const section = document.querySelector('.design-process-section');
            const gallery = document.querySelector('.process-card-gallery');
            if (!panel || !section || !gallery) return;

            const sectionRect = section.getBoundingClientRect();
            const galleryRect = gallery.getBoundingClientRect();

            // -1 大图中心点以四张篇章卡片组中心点为基准，并整体向左偏移 18px。
            const centerX = galleryRect.left + galleryRect.width / 2 - sectionRect.left - 18;
            const centerY = galleryRect.top + galleryRect.height / 2 - sectionRect.top;

            panel.style.setProperty('--process-detail-center-x', `${centerX}px`);
            panel.style.setProperty('--process-detail-center-y', `${centerY}px`);
        }

       function positionProcessFrontCard() {
    // 新版详情面板的关闭按钮已经固定在面板右上角，不再需要动态追踪图片右上角。
}

        function scheduleProcessFrontCardPosition() {
            requestAnimationFrame(() => {
                positionProcessFrontCard();
                requestAnimationFrame(() => {
                    positionProcessFrontCard();
                    window.setTimeout(positionProcessFrontCard, 180);
                    window.setTimeout(positionProcessFrontCard, 562);
                });
            });
        }

        // 绥远方志：设计内容卡片伪 3D hover + 时间线节点联动

        function getFusionLightboxImages(card, sourceImg) {
            if (!card) return [];

            if (card.dataset.fusionFullImages) {
                try {
                    const parsed = JSON.parse(card.dataset.fusionFullImages);
                    if (Array.isArray(parsed) && parsed.length) return parsed.filter(Boolean);
                } catch (err) {
                    console.warn('fusionFullImages 解析失败', err);
                }
            }

            const images = [];
            if (sourceImg && sourceImg.getAttribute('src')) {
                images.push(sourceImg.getAttribute('src'));
            }

            const extraSrc = card.dataset.fusionFullExtra || '';
            if (extraSrc) images.push(extraSrc);

            return images;
        }

        function renderFusionLightboxImages(images, title) {
            const media = document.querySelector('#fusion-image-lightbox .fusion-image-lightbox-media');
            if (!media) return;

            media.innerHTML = '';

            images.forEach((src, index) => {
                const img = document.createElement('img');
                img.draggable = false;
                img.className = 'fusion-image-lightbox-img fusion-image-stack-img';
                img.src = src;
                img.alt = title || `放大图 ${index + 1}`;
                img.dataset.stackIndex = String(index);

                if (index === 0) {
                    img.classList.add('is-front');
                } else {
                    img.classList.add('is-back');
                }

                media.appendChild(img);
            });
        }

        function swapFusionStackImages(clickedImg) {
            const lightbox = document.getElementById('fusion-image-lightbox');
            if (!lightbox || !lightbox.classList.contains('is-dual')) return;
            if (!clickedImg || clickedImg.classList.contains('is-front')) return;

            const media = lightbox.querySelector('.fusion-image-lightbox-media');
            if (!media) return;

            const images = Array.from(media.querySelectorAll('.fusion-image-stack-img'));
            const clickedIndex = images.indexOf(clickedImg);
            if (clickedIndex <= 0) return;

            lightbox.classList.remove('is-stack-swapping');
            void lightbox.offsetWidth;
            lightbox.classList.add('is-stack-swapping');

            images.forEach((img) => {
                img.classList.remove('is-front', 'is-back', 'is-flying-front', 'is-retreating-back');
            });

            const oldFront = images[0];
            clickedImg.classList.add('is-flying-front');
            oldFront.classList.add('is-retreating-back');

            window.setTimeout(() => {
                // 轮转顺序：点击第 N 张后，它变第一张；原来的第 N+1 张变第二张；
                // 原来的第一张撤到最后，避免“第二张上来后，原第一张还挡在第二层”的错位。
                const nextImages = images.slice(clickedIndex).concat(images.slice(0, clickedIndex));

                nextImages.forEach((img) => {
                    media.appendChild(img);
                });

                nextImages.forEach((img, index) => {
                    img.dataset.stackIndex = String(index);
                    img.classList.remove('is-front', 'is-back', 'is-flying-front', 'is-retreating-back');
                    img.classList.add(index === 0 ? 'is-front' : 'is-back');
                });

                lightbox.classList.remove('is-stack-swapping');
                scheduleFusionLightboxClosePosition();
            }, 230);
        }

        function updateFusionLightboxClosePosition() {
            const lightbox = document.getElementById('fusion-image-lightbox');
            const closeBtn = document.getElementById('fusion-image-lightbox-close');
            const card = lightbox ? lightbox.querySelector('.fusion-image-lightbox-card') : null;
            if (!lightbox || !closeBtn || !card || !lightbox.classList.contains('is-open')) return;

            const frontImg =
                lightbox.querySelector('.fusion-image-stack-img.is-front') ||
                lightbox.querySelector('.fusion-image-lightbox-img.is-front') ||
                lightbox.querySelector('.fusion-image-lightbox-img:not(.fusion-image-lightbox-img-extra)');

            if (!frontImg) return;

            const imgRect = frontImg.getBoundingClientRect();
            const cardRect = card.getBoundingClientRect();

            if (!imgRect.width || !imgRect.height || !cardRect.width || !cardRect.height) return;

            closeBtn.style.left = `${imgRect.right - cardRect.left + 30}px`;
            closeBtn.style.top = `${imgRect.top - cardRect.top - 30}px`;
            closeBtn.style.right = 'auto';
            closeBtn.style.bottom = 'auto';
            closeBtn.style.transform = 'translate(-50%, -50%)';
        }

        function scheduleFusionLightboxClosePosition() {
            requestAnimationFrame(() => {
                updateFusionLightboxClosePosition();
                requestAnimationFrame(updateFusionLightboxClosePosition);
                window.setTimeout(updateFusionLightboxClosePosition, 260);
                window.setTimeout(updateFusionLightboxClosePosition, 520);
            });
        }

        function openFusionImageLightbox(card) {
            const lightbox = document.getElementById('fusion-image-lightbox');
            const showcase = document.getElementById('process-inline-copy-card');
            if (!lightbox || !card) return;

            // 修复：之前为了关闭 wide carousel，把二级页大图层写进了 inline display:none
            // 并加了 is-force-hidden-after-wide。这里打开二级页大图前必须清掉，
            // 否则点击二级页图片会执行 openFusionImageLightbox，但视觉上永远不出现。
            lightbox.classList.remove('is-force-hidden-after-wide');
            lightbox.style.display = '';
            lightbox.style.visibility = '';
            lightbox.style.opacity = '';
            lightbox.style.pointerEvents = '';

            if (showcase) {
                const rect = showcase.getBoundingClientRect();
                if (rect.width && rect.height) {
                    lightbox.style.setProperty('--fusion-showcase-w', `${rect.width}px`);
                    lightbox.style.setProperty('--fusion-showcase-h', `${rect.height}px`);
                }
            }

            const targetId = card.dataset.fusionFullTarget;
            const sourceImg = targetId ? document.getElementById(targetId) : card.querySelector('img');
            if (!sourceImg || !sourceImg.getAttribute('src')) return;

            const title = card.dataset.fusionFullTitle || sourceImg.alt || '放大图';
            const images = getFusionLightboxImages(card, sourceImg);
            if (!images.length) return;

            renderFusionLightboxImages(images, title);

            lightbox.classList.toggle('is-dual', images.length > 1);
            lightbox.classList.toggle('is-multi', images.length > 2);

            lightbox.classList.add('is-open');
            lightbox.setAttribute('aria-hidden', 'false');
            scheduleFusionLightboxClosePosition();
        }

        function closeFusionImageLightbox() {
            const lightbox = document.getElementById('fusion-image-lightbox');
            const media = document.querySelector('#fusion-image-lightbox .fusion-image-lightbox-media');
            if (!lightbox) return;

            lightbox.classList.remove('is-open', 'is-dual', 'is-multi', 'is-stack-swapping');
            lightbox.setAttribute('aria-hidden', 'true');

            // 关闭普通二级大图时，不保留强隐藏状态，避免下一次无法打开。
            lightbox.classList.remove('is-force-hidden-after-wide');
            lightbox.style.display = '';
            lightbox.style.visibility = '';
            lightbox.style.opacity = '';
            lightbox.style.pointerEvents = '';

            if (media) media.innerHTML = '';
        }

        function positionFusionSummaryUnderShowcase() {
            const summary = document.getElementById('process-summary-text') || document.querySelector('.process-summary-text');
            const showcase = document.getElementById('process-inline-copy-card');
            const section = document.querySelector('.design-process-section');

            if (!summary || !showcase || !section || !summary.classList.contains('is-fusion-summary')) return;

            const showcaseRect = showcase.getBoundingClientRect();
            const sectionRect = section.getBoundingClientRect();

            if (!showcaseRect.width || !showcaseRect.height) return;

            const y = showcaseRect.bottom - sectionRect.top + 50;
            summary.style.setProperty('--fusion-summary-y', `${y}px`);
        }

        function initProcessFusionCardHover() {
            const cards = document.querySelectorAll('.process-fusion-clickable');
            cards.forEach((card) => {
                if (card.dataset.fusionHoverBound === '1') return;
                card.dataset.fusionHoverBound = '1';

                card.addEventListener('mouseenter', () => {
                    card.classList.add('is-fusion-card-hovering');
                });

                card.addEventListener('mouseleave', () => {
                    card.classList.remove('is-fusion-card-hovering');
                });
            });
        }

        function initProcessStageHover3D() {
            const cards = Array.from(document.querySelectorAll('.process-stage-card'));
            const nodes = Array.from(document.querySelectorAll('.process-timeline-node'));
            if (!cards.length) return;

            const nodeDefaultR = [14.5, 9.2, 3.4];
            const nodeActiveR = [18.5, 11.8, 4.3];

            function setNodeActive(node, active) {
                if (!node) return;
                const circles = node.querySelectorAll('circle');
                node.classList.toggle('is-node-active', active);
                circles.forEach((circle, i) => {
                    circle.setAttribute('r', active ? nodeActiveR[i] : nodeDefaultR[i]);
                });
            }

            cards.forEach((card, index) => {
                const node = nodes[index];

                card.addEventListener('click', () => {
                    openProcessDetail(card);
                });

                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const offsetX = e.clientX - rect.left - rect.width / 2;
                    const offsetY = e.clientY - rect.top - rect.height / 2;

                    const rotateAmplitude = 10;
                    const rotateX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
                    const rotateY = (offsetX / (rect.width / 2)) * rotateAmplitude;

                    const inner = card.querySelector('.process-stage-inner');
                    if (inner) {
                        inner.style.transform =
                            `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.1)`;
                    }

                    card.classList.add('is-process-tilting');
                    setNodeActive(node, true);
                });

                card.addEventListener('mouseleave', () => {
                    const inner = card.querySelector('.process-stage-inner');
                    if (inner) {
                        inner.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
                    }
                    card.classList.remove('is-process-tilting');
                    setNodeActive(node, false);
                });
            });
        }

        // 绥远方志：方案设计堆叠式卡片浏览
        let schemeStackState = {
            current: 0,
            cards: [],
            deck: null,
            currentLabel: null,
            totalLabel: null,
            dragStartX: 0,
            dragX: 0,
            isDragging: false
        };

        function formatSchemeIndex(num) {
            return String(num).padStart(2, '0');
        }

        function updateSchemeStack() {
            const state = schemeStackState;
            if (!state.cards.length) return;

            const total = state.cards.length;
            state.cards.forEach((card, index) => {
                const rawOffset = (index - state.current + total) % total;
                const signedOffset = rawOffset > total / 2 ? rawOffset - total : rawOffset;

                card.classList.remove('is-active', 'is-left-1', 'is-right-1', 'is-left-2', 'is-right-2', 'is-hidden');

                if (signedOffset === 0) {
                    card.classList.add('is-active');
                    card.style.pointerEvents = 'auto';
                } else if (signedOffset === -1) {
                    card.classList.add('is-left-1');
                    card.style.pointerEvents = 'none';
                } else if (signedOffset === 1) {
                    card.classList.add('is-right-1');
                    card.style.pointerEvents = 'none';
                } else if (signedOffset === -2) {
                    card.classList.add('is-left-2');
                    card.style.pointerEvents = 'none';
                } else if (signedOffset === 2) {
                    card.classList.add('is-right-2');
                    card.style.pointerEvents = 'none';
                } else {
                    card.classList.add('is-hidden');
                    card.style.pointerEvents = 'none';
                }

                card.style.removeProperty('transform');
                card.style.removeProperty('opacity');
            });

            if (state.currentLabel) state.currentLabel.textContent = formatSchemeIndex(state.current + 1);
            if (state.totalLabel) state.totalLabel.textContent = formatSchemeIndex(total);
        }

        function moveSchemeStack(direction) {
            const state = schemeStackState;
            if (!state.cards.length) return;
            const total = state.cards.length;
            state.current = (state.current + direction + total) % total;
            updateSchemeStack();
        }

        function initSchemeStack() {
            const deck = document.getElementById('schemeDeck');
            if (!deck) return;

            schemeStackState.deck = deck;
            schemeStackState.cards = Array.from(deck.querySelectorAll('.scheme-stack-card'));
            schemeStackState.currentLabel = document.getElementById('schemeStackCurrent');
            schemeStackState.totalLabel = document.getElementById('schemeStackTotal');

            updateSchemeStack();

            document.querySelectorAll('[data-scheme-dir]').forEach(btn => {
                btn.addEventListener('click', () => {
                    moveSchemeStack(btn.dataset.schemeDir === 'next' ? 1 : -1);
                });
            });

            deck.addEventListener('pointerdown', (e) => {
                const activeCard = deck.querySelector('.scheme-stack-card.is-active');
                if (!activeCard || !e.target.closest('.scheme-stack-card.is-active')) return;

                schemeStackState.isDragging = true;
                schemeStackState.dragStartX = e.clientX;
                schemeStackState.dragX = 0;
                activeCard.setPointerCapture(e.pointerId);
                activeCard.style.transition = 'none';
            });

            deck.addEventListener('pointermove', (e) => {
                if (!schemeStackState.isDragging) return;
                const activeCard = deck.querySelector('.scheme-stack-card.is-active');
                if (!activeCard) return;

                schemeStackState.dragX = e.clientX - schemeStackState.dragStartX;
                const rotate = Math.max(-14, Math.min(14, schemeStackState.dragX / 18));
                const fade = Math.max(0.55, 1 - Math.abs(schemeStackState.dragX) / 520);
                activeCard.style.transform = `translate3d(calc(-50% + ${schemeStackState.dragX}px), calc(-50% + ${Math.abs(schemeStackState.dragX) * 0.04}px), 170px) rotateZ(${rotate}deg) scale(1.06)`;
                activeCard.style.opacity = fade;
            });

            function endDrag(e) {
                if (!schemeStackState.isDragging) return;
                const activeCard = deck.querySelector('.scheme-stack-card.is-active');
                schemeStackState.isDragging = false;

                if (activeCard) {
                    activeCard.style.removeProperty('transition');
                    activeCard.style.removeProperty('transform');
                    activeCard.style.removeProperty('opacity');
                    try { activeCard.releasePointerCapture(e.pointerId); } catch (err) {}
                }

                if (schemeStackState.dragX > 90) {
                    moveSchemeStack(-1);
                } else if (schemeStackState.dragX < -90) {
                    moveSchemeStack(1);
                } else {
                    updateSchemeStack();
                }

                schemeStackState.dragX = 0;
            }

            deck.addEventListener('pointerup', endDrag);
            deck.addEventListener('pointercancel', endDrag);
            deck.addEventListener('pointerleave', endDrag);
        }

        function initDetailScrollJelly() {
            const detailRoot = document.getElementById('project-detail');
            if (!detailRoot) return;

            const popSections = detailRoot.querySelectorAll('.detail-pop-section, .scheme-pop-section');
            if (!popSections.length) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;

                    entry.target.classList.remove('is-jelly-active');
                    void entry.target.offsetWidth;
                    entry.target.classList.add('is-jelly-active');
                });
            }, {
                root: detailRoot,
                threshold: 0.42,
                rootMargin: '-8% 0px -18% 0px'
            });

            popSections.forEach(section => observer.observe(section));
        }

        initSchemeStack();
        initDetailScrollJelly();

        // 绥远方志详情页浮尘
        const dustCanvas = document.getElementById('dust-canvas');
        const dustCtx = dustCanvas ? dustCanvas.getContext('2d') : null;
        let dustParticles = [];

        function initDust() {
            if (!dustCanvas || !dustCtx) return;

            dustCanvas.width = window.innerWidth;
            dustCanvas.height = window.innerHeight;
            dustParticles = [];

            for (let i = 0; i < 80; i++) {
                dustParticles.push({
                    x: Math.random() * dustCanvas.width,
                    y: Math.random() * dustCanvas.height,
                    s: Math.random() * 2 + 1,
                    vx: Math.random() * 0.4 - 0.2,
                    vy: Math.random() * 0.4 - 0.2,
                    o: Math.random() * 0.6 + 0.2
                });
            }
        }

        let dustFrame=0;
        function drawDust() {
            dustFrame=0;
            if(document.hidden||document.getElementById('project-detail').style.display!=='block')return;
            if (!dustCanvas || !dustCtx) return;

            dustCtx.clearRect(0, 0, dustCanvas.width, dustCanvas.height);

            dustParticles.forEach(d => {
                dustCtx.fillStyle = `rgba(242, 224, 133, ${d.o})`;
                dustCtx.beginPath();
                dustCtx.arc(d.x, d.y, d.s, 0, Math.PI * 2);
                dustCtx.fill();

                d.x += d.vx;
                d.y += d.vy;

                if (d.x < 0) d.x = dustCanvas.width;
                if (d.x > dustCanvas.width) d.x = 0;
                if (d.y < 0) d.y = dustCanvas.height;
                if (d.y > dustCanvas.height) d.y = 0;
            });

            dustFrame=requestAnimationFrame(drawDust);
        }

        initDust();
        const syncDust=()=>{cancelAnimationFrame(dustFrame);dustFrame=0;drawDust()};
        new MutationObserver(syncDust).observe(document.getElementById('project-detail'),{attributes:true,attributeFilter:['style']});
        document.addEventListener('visibilitychange',syncDust);
        syncDust();

        window.addEventListener('resize', initDust);

        function resetHome() { location.reload(); }

                // --- 逻辑整合：增强版 Tooltip 监听 ---
        window.addEventListener('mousemove', (e) => {
            const t = document.getElementById('tooltip');
            if (!t) return;

            // 0. 首页 1.3 展开状态下：3D 倾斜只根据鼠标是否在背景图区域内计算
            if (isExpanded && currentActivePage === 'home') {
                const rect = wrapper3D.getBoundingClientRect();
                const isInsideBg13 =
                    e.clientX >= rect.left &&
                    e.clientX <= rect.right &&
                    e.clientY >= rect.top &&
                    e.clientY <= rect.bottom;

                if (isInsideBg13) {
                    targetX = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
                    targetY = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
                } else {
                    targetX = 0;
                    targetY = 0;
                }
            }

            // 1. 寻找最近的可交互目标
            const target = e.target.closest('.hover-scale, .card-base, .nav-btn, button, #logo, #bg12-video-mask, #bg12-video');
            
            // 2. 排除逻辑：详情页内部、装饰背景1.1、以及展开后的背景1.3
            const isBG11 = target && (target.id === 'bg11-img' || target.closest('#bg11'));
            const isBG13 = target && ((target.id === 'bg12-video-mask' || target.id === 'bg12-video') && isExpanded);

            if (target && !isBG11 && !isBG13 && !target.closest('#project-detail')) {
                t.style.display = 'block';
                t.style.left = (e.clientX + 15) + 'px';
                t.style.top = (e.clientY + 15) + 'px';

                // 3. 动态匹配提示文本
                if (target.id === 'logo') {
                    t.textContent = '返回首页';
                } else if (target.classList.contains('nav-btn')) {
                    t.textContent = `前往 ${target.textContent}`;
                } else if (target.id === 'bg12-video-mask' || target.id === 'bg12-video') {
                    t.textContent = '进入作品集';
                } else {
                    t.textContent = target.classList.contains('card-base') ? '查看项目详情' : '关闭';
                }
            } else {
                t.style.display = 'none';
            }
        });
    
        window.openProcessDetail = openProcessDetail;

        // 初始化设计内容单图详情：关闭、外部点击关闭、Esc 关闭、重算位置
        (function initProcessDetailInline() {
            document.addEventListener('click', (e) => {
                const panel = document.getElementById('process-inline-detail');

                // v275：wide carousel（建成篇 / 副场景·实业厂群）打开时，
                // 点击它自己的关闭按钮不能被这里当作“点击展开组外围”处理，
                // 否则会先执行 closeProcessDetail()，导致关闭 01/10 后直接退回“建成篇”。
                const wideCarousel = document.getElementById('wide-carousel-overlay');
                if (wideCarousel && wideCarousel.classList.contains('is-open') && e.target.closest('#wide-carousel-overlay')) {
                    return;
                }

                const inlineClose = e.target.closest('#process-inline-close');
                const copyCard = e.target.closest('.process-inline-copy');
                const stageCard = e.target.closest('.process-stage-card');

                const fusionImageClose = e.target.closest('#fusion-image-lightbox-close');
                const fusionImageLightbox = e.target.closest('#fusion-image-lightbox');
                const fusionImageCard = e.target.closest('.process-fusion-clickable');
                const fusionImageIsOpen = fusionImageLightbox && fusionImageLightbox.classList.contains('is-open');

                // 大图层已打开时：只处理大图自己的关闭；堆叠图可点击互换前后层级。
                if (fusionImageIsOpen) {
                    if (fusionImageClose || !e.target.closest('.fusion-image-lightbox-card')) {
                        e.preventDefault();
                        e.stopPropagation();
                        closeFusionImageLightbox();
                        return;
                    }

                    const clickedStackImg = e.target.closest('.fusion-image-stack-img');
                    if (clickedStackImg && fusionImageLightbox.classList.contains('is-dual')) {
                        e.preventDefault();
                        e.stopPropagation();
                        swapFusionStackImages(clickedStackImg);
                        return;
                    }

                    // 点在大图卡片内部空白处，不关闭外层卡片组。
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }

                if (fusionImageCard) {
                    const showcase = document.getElementById('process-inline-copy-card');
                    const isJianchengShowcase = showcase && showcase.classList.contains('is-jiancheng-showcase');
                    const isFusionShowcase = showcase && showcase.classList.contains('is-fusion-transport-merged-showcase');

                    function parseFullImagesFromFusionCard(card) {
                        let images = [];
                        if (card && card.dataset && card.dataset.fusionFullImages) {
                            try {
                                const parsed = JSON.parse(card.dataset.fusionFullImages);
                                if (Array.isArray(parsed)) images = parsed.filter(Boolean);
                            } catch (err) {
                                console.warn('fusionFullImages 解析失败', err);
                            }
                        }
                        return images;
                    }

                    function applyWideLabels(labels) {
                        if (!Array.isArray(labels) || !labels.length) return;
                        window.setTimeout(function () {
                            const thumbs = document.getElementById('wide-carousel-thumbs');
                            if (!thumbs) return;

                            Array.from(thumbs.children).forEach(function (thumb, index) {
                                const labelText = labels[index] || (String(index + 1).padStart(2, '0') + ' 展示图');
                                const label =
                                    thumb.querySelector('.wide-carousel-thumb-title') ||
                                    thumb.querySelector('.thumb-title') ||
                                    thumb.querySelector('span:last-child');

                                if (label) label.textContent = labelText;
                                thumb.setAttribute('aria-label', labelText);
                                thumb.setAttribute('title', labelText);

                                const img = thumb.querySelector('img');
                                if (img) img.alt = labelText;
                            });
                        }, 80);
                    }

                    const fusionTitleText = (
                        (fusionImageCard.dataset.fusionFullTitle || '') + ' ' +
                        (fusionImageCard.textContent || '') + ' ' +
                        (document.getElementById('fusion-hero-title')?.textContent || '') + ' ' +
                        (document.getElementById('fusion-town-title')?.textContent || '') + ' ' +
                        (document.getElementById('fusion-market-title')?.textContent || '') + ' ' +
                        (document.getElementById('fusion-closeup-title')?.textContent || '')
                    ).replace(/\s+/g, '');

                    const isJiTwentyTwoCard =
                        fusionImageCard.classList.contains('process-fusion-market') &&
                        (
                            fusionTitleText.includes('集二十二省之奇货') ||
                            fusionTitleText.includes('二十二省') ||
                            fusionTitleText.includes('奇货')
                        );

                    if (isJianchengShowcase && isJiTwentyTwoCard && typeof window.openWideCarousel === 'function') {
                        let images = parseFullImagesFromFusionCard(fusionImageCard);

                        if (!images.length) {
                            images = [
                                'AIGC/绥远方志/建成篇/建成篇-二十二1.jpg',
                                'AIGC/绥远方志/建成篇/建成篇-二十二2.jpg',
                                'AIGC/绥远方志/建成篇/建成篇-二十二3.jpg',
                                'AIGC/绥远方志/建成篇/建成篇-二十二4.jpg',
                                'AIGC/绥远方志/建成篇/建成篇-二十二5.jpg',
                                'AIGC/绥远方志/建成篇/建成篇-二十二6.jpg',
                                'AIGC/绥远方志/建成篇/建成篇-二十二7.jpg',
                                'AIGC/绥远方志/建成篇/建成篇-二十二8.jpg'
                            ];
                        }

                        e.preventDefault();
                        e.stopPropagation();
                        if (e.stopImmediatePropagation) e.stopImmediatePropagation();

                        window.openWideCarousel({
                            chapter: '建成篇',
                            title: '副场景 · 集二十二省之奇货',
                            desc: '进入大盛魁靠近段履庄了解大盛魁巅峰时期的繁荣与兴盛。',
                            images: images
                        });
                        return;
                    }

                    const isZhujunShowcase =
                        !isJianchengShowcase &&
                        !isFusionShowcase &&
                        (
                            fusionTitleText.includes('将军衙署') ||
                            fusionTitleText.includes('巡检司衙门') ||
                            fusionTitleText.includes('驻军营地') ||
                            fusionTitleText.includes('周边商贩集群摊位')
                        );

                    const zhujunMap = {
                        hero: {
                            className: 'process-fusion-hero',
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
                            className: 'process-fusion-town',
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
                            className: 'process-fusion-market',
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
                            className: 'process-fusion-closeup',
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

                    const zhujunConfig = Object.keys(zhujunMap).map(function (key) { return zhujunMap[key]; }).find(function (item) {
                        return fusionImageCard.classList.contains(item.className);
                    });

                    if (isZhujunShowcase && zhujunConfig && typeof window.openWideCarousel === 'function') {
                        e.preventDefault();
                        e.stopPropagation();
                        if (e.stopImmediatePropagation) e.stopImmediatePropagation();

                        window.openWideCarousel({
                            chapter: '驻军篇',
                            title: zhujunConfig.title,
                            desc: zhujunConfig.desc,
                            images: zhujunConfig.images.slice()
                        });
                        applyWideLabels(zhujunConfig.labels);
                        return;
                    }

                    const isChoubeiShowcase =
                        !isJianchengShowcase &&
                        !isFusionShowcase &&
                        !isZhujunShowcase &&
                        (
                            fusionTitleText.includes('古展馆沙盘') ||
                            fusionTitleText.includes('城墙与钟鼓楼') ||
                            fusionTitleText.includes('接官厅') ||
                            fusionTitleText.includes('商贩摊位')
                        );

                    const choubeiMap = {
                        hero: {
                            className: 'process-fusion-hero',
                            title: '主场景 · 古展馆沙盘',
                            desc: '通过数字沙盘呈现归化城初期城市规划与发展。',
                            images: [
                                'AIGC/绥远方志/筹备篇/筹备篇-开场1.jpg',
                                'AIGC/绥远方志/筹备篇/筹备篇-开场2.jpg',
                                'AIGC/绥远方志/筹备篇/筹备篇-开场3.jpg',
                                'AIGC/绥远方志/筹备篇/筹备篇-开场4.jpg',
                                'AIGC/绥远方志/筹备篇/筹备篇-入口.jpg',
                                'AIGC/绥远方志/筹备篇/筹备篇-7.png',
                                'AIGC/绥远方志/筹备篇/筹备篇-沙盘1.jpg',
                                'AIGC/绥远方志/筹备篇/筹备篇-沙盘2.jpg',
                                'AIGC/绥远方志/筹备篇/筹备篇-沙盘3.jpg',
                                'AIGC/绥远方志/筹备篇/筹备篇-沙盘4.jpg',
                                'AIGC/绥远方志/筹备篇/筹备篇-沙盘5.jpg'
                            ],
                            labels: ['01 古展馆','02 展馆导航UI','03 古展馆左侧','04 古展馆右侧','05 筹备篇导航UI','06 归化城沙盘','07 沙盘导航UI','08 沙盘钟鼓楼UI','09 沙盘各司衙门UI','10 沙盘城墙UI','11 沙盘接官厅UI']
                        },
                        town: {
                            className: 'process-fusion-town',
                            title: '副场景 · 城墙与钟鼓楼',
                            desc: '展示建城初期的防御体系与城市空间轮廓。',
                            images: [
                                'AIGC/绥远方志/筹备篇/筹备篇-4.png',
                                'AIGC/绥远方志/筹备篇/筹备篇-城墙1.jpg',
                                'AIGC/绥远方志/筹备篇/筹备篇-城墙2.jpg',
                                'AIGC/绥远方志/筹备篇/筹备篇-城墙3.jpg',
                                'AIGC/绥远方志/筹备篇/筹备篇-城墙4.jpg',
                                'AIGC/绥远方志/筹备篇/筹备篇-城墙5.jpg',
                                'AIGC/绥远方志/筹备篇/筹备篇-城墙6.jpg'
                            ],
                            labels: ['01 城墙鸟瞰','02 城墙东侧','03 城墙入口','04 城墙正门','05 城墙正门东侧','06 城墙正门西侧','07 城墙正门鸟瞰']
                        },
                        market: {
                            className: 'process-fusion-market',
                            title: '副场景 · 接官厅',
                            desc: '用厅内陈设与人物叙事表现接待来使与政务往来的空间。',
                            images: [
                                'AIGC/绥远方志/筹备篇/筹备篇-接官厅1.jpg',
                                'AIGC/绥远方志/筹备篇/筹备篇-5.png',
                                'AIGC/绥远方志/筹备篇/筹备篇-接官厅2.jpg',
                                'AIGC/绥远方志/筹备篇/筹备篇-接官厅3.jpg',
                                'AIGC/绥远方志/筹备篇/筹备篇-6.png',
                                'AIGC/绥远方志/筹备篇/筹备篇-接官厅4.jpg',
                                'AIGC/绥远方志/筹备篇/筹备篇-接官厅5.jpg',
                                'AIGC/绥远方志/筹备篇/筹备篇-接官厅6.jpg'
                            ],
                            labels: ['01 接官厅正门','02 接官厅鸟瞰','03 接官厅入口','04 接官厅正厅','05 正厅场景鸟瞰','06 正厅官员UI','07 接官厅待客餐食','08 接官厅官员近景']
                        },
                        closeup: {
                            className: 'process-fusion-closeup',
                            title: '副场景 · 商贩摊位',
                            desc: '通过沿墙摊位与器物细节展现草原丝路雏形的市井生活。',
                            images: [
                                'AIGC/绥远方志/筹备篇/筹备篇-商贩1.jpg',
                                'AIGC/绥远方志/筹备篇/筹备篇-8.png',
                                'AIGC/绥远方志/筹备篇/筹备篇-商贩2.jpg',
                                'AIGC/绥远方志/筹备篇/筹备篇-商贩3.jpg'
                            ],
                            labels: ['01 商贩摊位','02 商贩摊位近景','03 商贩摊位UI','04 摊位细节']
                        }
                    };

                    const choubeiConfig = Object.keys(choubeiMap).map(function (key) { return choubeiMap[key]; }).find(function (item) {
                        return fusionImageCard.classList.contains(item.className);
                    });

                    if (isChoubeiShowcase && choubeiConfig && typeof window.openWideCarousel === 'function') {
                        e.preventDefault();
                        e.stopPropagation();
                        if (e.stopImmediatePropagation) e.stopImmediatePropagation();

                        window.openWideCarousel({
                            chapter: '筹备篇',
                            title: choubeiConfig.title,
                            desc: choubeiConfig.desc,
                            images: choubeiConfig.images.slice()
                        });
                        applyWideLabels(choubeiConfig.labels);
                        return;
                    }

                    e.preventDefault();
                    e.stopPropagation();
                    openFusionImageLightbox(fusionImageCard);
                    return;
                }

                if (inlineClose) {
                    e.preventDefault();
                    e.stopPropagation();
                    closeProcessDetail();
                    return;
                }

                // 点击展开后的卡片组本身，不关闭；点击四张篇章卡则切换对应大图。
                if (copyCard || stageCard) return;

                // 没有大图层时，点击卡片组外围才关闭筹备篇/融合篇展开组。
                if (panel && panel.classList.contains('is-open')) {
                    closeProcessDetail();
                }
            }, true);

            window.addEventListener('keydown', (e) => {
                if (e.key !== 'Escape') return;

                // v275：wide carousel 自己处理 Esc，外层建成篇详情不要跟着关闭。
                const wideCarousel = document.getElementById('wide-carousel-overlay');
                if (wideCarousel && wideCarousel.classList.contains('is-open')) return;

                const fusionLightbox = document.getElementById('fusion-image-lightbox');
                if (fusionLightbox && fusionLightbox.classList.contains('is-open')) {
                    closeFusionImageLightbox();
                    return;
                }

                closeProcessDetail();
            });

            window.addEventListener('resize', () => {
                const panel = document.getElementById('process-inline-detail');
                const lightbox = document.getElementById('fusion-image-lightbox');
                const showcase = document.getElementById('process-inline-copy-card');

                updateSuiyuanProcessRelativeSize();

                if (panel && panel.classList.contains('is-open')) {
                    positionProcessInlineDetail();
                    scheduleProcessFrontCardPosition();

                    if (lightbox && lightbox.classList.contains('is-open') && showcase) {
                        const rect = showcase.getBoundingClientRect();
                        if (rect.width && rect.height) {
                            lightbox.style.setProperty('--fusion-showcase-w', `${rect.width}px`);
                            lightbox.style.setProperty('--fusion-showcase-h', `${rect.height}px`);
                        }
                    }
                }
            });

            const img = document.getElementById('process-inline-copy-img');
            if (img) img.addEventListener('load', scheduleProcessFrontCardPosition);

            const projectDetail = document.getElementById('project-detail');
            if (projectDetail) {
                projectDetail.addEventListener('scroll', () => {
                    const panel = document.getElementById('process-inline-detail');
                    updateSuiyuanProcessRelativeSize();

                    if (panel && panel.classList.contains('is-open')) {
                        positionProcessInlineDetail();
                        scheduleProcessFrontCardPosition();
                    }
                }, { passive: true });
            }
        })();

        // 初始化设计内容卡片 hover 动效
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initProcessStageHover3D);
        } else {
            initProcessStageHover3D();
            initProcessFusionCardHover();
        }

        
    










