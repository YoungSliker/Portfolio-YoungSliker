/* Mobile foreground composites. Video, scenes, scrolling and project handlers
   remain in their original DOM; only the selected artwork is rasterized. */
(() => {
    'use strict';
    const media = matchMedia('(max-height: 500px) and (orientation: landscape)');
    const assets = new URL('../主界面/mobile-static/901/', document.currentScript.src);
    const root = document.documentElement;
    let manifest, loading, frame = 0;

    function hotspot(source, bounds) {
        const hit = document.createElement(source.tagName === 'A' ? 'a' : 'button');
        hit.className = 'static-ui-hotspot';
        hit.setAttribute('aria-label', bounds.label);
        hit.style.cssText = `left:${bounds.x * 100}%;top:${bounds.y * 100}%;width:${bounds.width * 100}%;height:${bounds.height * 100}%;`;
        if (source.tagName === 'A') {
            for (const attribute of ['href', 'target', 'rel']) {
                if (source.hasAttribute(attribute)) hit.setAttribute(attribute, source.getAttribute(attribute));
            }
        } else {
            hit.type = 'button';
            hit.addEventListener('click', event => {
                event.stopPropagation();
                source.click();
            });
        }
        return hit;
    }

    function mount(selector, key, kind, hitSelector = '') {
        const host = document.querySelector(selector);
        if (!host || host.dataset.staticUi) return;
        const asset = manifest[key];
        if (!asset) return;
        host.dataset.staticUi = kind;
        host.style.setProperty('--static-ui-height', `${asset.box.height}px`);
        const sources = hitSelector ? [...host.querySelectorAll(hitSelector)] : [];
        const artwork = document.createElement('img');
        artwork.className = 'static-ui-image';
        artwork.alt = kind === 'heading' || kind === 'signature' ? host.textContent.trim().replace(/\s+/g, ' ') : '';
        if (!artwork.alt) artwork.setAttribute('aria-hidden', 'true');
        artwork.draggable = false;
        const inset = asset.inset;
        artwork.style.cssText = `left:${inset.left * 100}%;top:${inset.top * 100}%;width:${inset.width * 100}%;height:${inset.height * 100}%;`;
        artwork.onload = () => {
            for (const bounds of asset.hits) {
                if (sources[bounds.index]) host.append(hotspot(sources[bounds.index], bounds));
            }
            host.dataset.staticReady = 'true';
        };
        artwork.onerror = () => {
            // Keep the original artwork usable if a file cannot be loaded.
            artwork.remove();
            host.dataset.staticReady = 'false';
        };
        artwork.src = new URL(asset.file, assets).href;
        host.append(artwork);
    }

    function render() {
        frame = 0;
        root.classList.toggle('mobile-ui-active', media.matches);
        if (!media.matches || !manifest) return;
        mount('#bg12-content', 'home-foreground', 'home');
        mount('#bg13-img', 'profile-art', 'profile');
        mount('#home > .bottom-10', 'profile-signature', 'signature');
        mount('#imagesDiv', 'profile-tools', 'tools', '.logoloop__list:first-child a');
        mount('.young-nav577__intro', 'works-heading', 'heading');
        document.querySelectorAll('.young-nav577__card').forEach((card, i) => {
            mount(`.young-nav577__card:nth-child(${i + 1})`, `works-card-${i}`, 'menu-card', 'button[data-nav-page]');
        });
        for (const category of ['aigc', 'creative']) {
            mount(`#${category} .category-stack-heading`, `${category}-heading`, 'heading');
            document.querySelectorAll(`#${category} .card-base`).forEach((card, i) => {
                card.dataset.staticCard = String(i);
                if (!card.hasAttribute('aria-label')) card.setAttribute('aria-label', card.querySelector('h3')?.textContent || '查看作品');
                if (!card.hasAttribute('role')) {
                    card.setAttribute('role', 'button');
                    card.tabIndex = 0;
                    card.addEventListener('keydown', event => {
                        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); card.click(); }
                    });
                }
                mount(`#${category} .card-base[data-static-card="${i}"]`, `${category}-card-${i}`, category + '-card');
            });
        }
    }

    function schedule() {
        if (!frame) frame = requestAnimationFrame(render);
    }

    async function activate() {
        schedule();
        if (!media.matches || manifest || loading) return;
        loading = true;
        try {
            const response = await fetch(new URL('manifest.json', assets));
            if (!response.ok) throw new Error('Static artwork unavailable');
            manifest = await response.json();
            schedule();
        } catch (_) {
            root.classList.remove('mobile-ui-active');
        } finally { loading = false; }
    }

    const gutters = document.createElement('div');
    gutters.id = 'mobile-ui-gutters';
    gutters.setAttribute('aria-hidden', 'true');
    gutters.innerHTML = '<i></i><i></i>';
    document.getElementById('main-wrapper').append(gutters);
    new MutationObserver(schedule).observe(document.getElementById('main-wrapper'), { childList: true, subtree: true });
    media.addEventListener('change', activate);
    window.addEventListener('load', activate, { once: true });
    activate();
})();
