(function () {
    const groups = Array.from(document.querySelectorAll('[data-dev417-block-switch]'));
    if (!groups.length) return;

    const meta = {
        hardware: {
            kicker: 'HARDWARE FLOW',
            title: '硬件开发顺序',
            glow: '20%'
        },
        software: {
            kicker: 'SOFTWARE FLOW',
            title: '软件开发顺序',
            glow: '82%'
        }
    };

    function setStageHeight(stage, panel) {
        if (!stage || !panel) return;
        stage.style.minHeight = `${panel.offsetHeight}px`;
    }

    function syncHeights(group) {
        const key = group.dataset.dev417Active || 'hardware';
        const cardStage = group.querySelector('[data-dev417-card-stage]');
        const flowStage = group.querySelector('.dev417-flow-stage');
        setStageHeight(cardStage, group.querySelector(`[data-dev417-card-panel="${key}"]`));
        setStageHeight(flowStage, group.querySelector(`[data-dev417-panel="${key}"]`));
    }

    function activate(group, nextKey) {
        const currentKey = group.dataset.dev417Active || 'hardware';
        if (currentKey === nextKey) return;

        const directionFromLeft = nextKey === 'hardware';
        const nextCardPanel = group.querySelector(`[data-dev417-card-panel="${nextKey}"]`);
        const nextFlowPanel = group.querySelector(`[data-dev417-panel="${nextKey}"]`);
        if (!nextCardPanel || !nextFlowPanel) return;

        group.querySelectorAll('[data-dev417-card-panel], [data-dev417-panel]').forEach(panel => {
            const isNext = panel === nextCardPanel || panel === nextFlowPanel;
            panel.classList.remove('is-from-left');
            panel.classList.toggle('is-active', isNext);
            if (!isNext && directionFromLeft) panel.classList.add('is-from-left');
        });

        group.querySelectorAll('[data-dev417-tab]').forEach(tab => {
            const selected = tab.dataset.dev417Tab === nextKey;
            tab.classList.toggle('is-active', selected);
            tab.setAttribute('aria-selected', selected ? 'true' : 'false');
        });

        const flow = group.querySelector('[data-dev417-flow-switch]');
        const kicker = group.querySelector('[data-dev417-kicker]');
        const title = group.querySelector('[data-dev417-title]');
        if (kicker) kicker.textContent = meta[nextKey].kicker;
        if (title) title.textContent = meta[nextKey].title;
        if (flow) {
            flow.classList.toggle('is-hardware', nextKey === 'hardware');
            flow.classList.toggle('is-software', nextKey === 'software');
            flow.style.setProperty('--dev417-glow-x', meta[nextKey].glow);
            flow.dataset.dev417Active = nextKey;
        }

        group.dataset.dev417Active = nextKey;
        requestAnimationFrame(() => syncHeights(group));
    }

    groups.forEach(group => {
        const activeKey = group.dataset.dev417Active || 'hardware';
        const flow = group.querySelector('[data-dev417-flow-switch]');
        if (flow) {
            flow.style.setProperty('--dev417-glow-x', meta[activeKey].glow);
            flow.dataset.dev417Active = activeKey;
        }

        group.querySelectorAll('[data-dev417-tab]').forEach(tab => {
            tab.addEventListener('click', () => activate(group, tab.dataset.dev417Tab));
        });

        requestAnimationFrame(() => syncHeights(group));
    });

    window.addEventListener('resize', () => {
        groups.forEach(syncHeights);
    });
})();
