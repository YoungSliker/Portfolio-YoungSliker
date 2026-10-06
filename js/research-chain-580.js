(function () {
  const routeSections = Array.from(document.querySelectorAll("[data-route496-section]"));
  const hotTargets = [
    ".route496-wallet:hover",
    ".route496-pocket:hover",
    ".route496-card-head:hover",
    ".route496-card-body:hover",
    ".route496-step-hit:hover",
    ".route496-step-circle:hover",
    ".route496-step-kicker:hover",
    ".route496-step-title:hover",
    ".route496-step-status:hover",
    ".route496-step-desc:hover",
    ".route496-card-head:focus-visible",
    ".route496-card-body:focus-visible",
    ".route496-step-hit:focus-visible",
    ".route496-step-circle:focus-visible",
    ".route496-step-kicker:focus-visible",
    ".route496-step-title:focus-visible",
    ".route496-step-status:focus-visible",
    ".route496-step-desc:focus-visible"
  ].join(",");

  const resetTimers = new WeakMap();

  function clearReset(section) {
    const timer = resetTimers.get(section);
    if (timer) {
      window.clearTimeout(timer);
      resetTimers.delete(section);
    }
  }

  function setOpen(section) {
    clearReset(section);
    section.classList.add("is-wallet-open");
    section.classList.remove("is-card-active");
    section.dataset.routeActive = "";
    section.querySelectorAll(".route496-card.is-active").forEach((card) => card.classList.remove("is-active"));
    section.querySelectorAll(".route496-step.is-route-step-active").forEach((step) => step.classList.remove("is-route-step-active"));
  }

  function setActive(section, key) {
    if (!key) return;
    clearReset(section);
    section.classList.add("is-wallet-open", "is-card-active");
    section.dataset.routeActive = key;

    section.querySelectorAll(".route496-card[data-route-card]").forEach((card) => {
      card.classList.toggle("is-active", card.dataset.routeCard === key);
    });

    section.querySelectorAll(".route496-step[data-route-card]").forEach((step) => {
      step.classList.toggle("is-route-step-active", step.dataset.routeCard === key);
    });
  }

  function reset(section) {
    section.classList.remove("is-wallet-open", "is-card-active");
    section.dataset.routeActive = "";
    section.querySelectorAll(".route496-card.is-active").forEach((card) => card.classList.remove("is-active"));
    section.querySelectorAll(".route496-step.is-route-step-active").forEach((step) => step.classList.remove("is-route-step-active"));
  }

  function scheduleReset(section) {
    clearReset(section);
    resetTimers.set(section, window.setTimeout(() => {
      if (!section.querySelector(hotTargets)) reset(section);
    }, 120));
  }

  function bindHotNode(node, onEnter, onLeave) {
    if (!node) return;
    node.addEventListener("pointerenter", onEnter);
    node.addEventListener("pointerleave", onLeave);
    node.addEventListener("focus", onEnter);
    node.addEventListener("blur", onLeave);
    node.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      onEnter();
    });
  }

  function getCardHeadHit(section, event) {
    const hits = Array.from(section.querySelectorAll(".route496-card[data-route-card]")).map((card) => {
      const head = card.querySelector(".route496-card-head");
      if (!head) return null;
      const rect = head.getBoundingClientRect();
      const inside = event.clientX >= rect.left - 8 &&
        event.clientX <= rect.right + 8 &&
        event.clientY >= rect.top - 8 &&
        event.clientY <= rect.bottom + 8;
      if (!inside) return null;

      return {
        key: card.dataset.routeCard,
        zIndex: Number.parseInt(window.getComputedStyle(card).zIndex, 10) || 0,
        distance: Math.abs(event.clientY - (rect.top + rect.height / 2))
      };
    }).filter(Boolean);

    hits.sort((a, b) => a.distance - b.distance || b.zIndex - a.zIndex);
    return hits[0] ? hits[0].key : "";
  }

  function initRouteSection(section) {
    const wallet = section.querySelector(".route496-wallet");
    const pocket = section.querySelector(".route496-pocket");
    const cards = Array.from(section.querySelectorAll(".route496-card[data-route-card]"));
    const steps = Array.from(section.querySelectorAll(".route496-step[data-route-card]"));

    reset(section);

    [wallet, pocket].forEach((node) => {
      if (!node) return;
      node.addEventListener("pointerenter", () => setOpen(section));
      node.addEventListener("pointerleave", () => scheduleReset(section));
      node.addEventListener("focusin", () => setOpen(section));
      node.addEventListener("focusout", () => scheduleReset(section));
    });

    section.addEventListener("pointermove", (event) => {
      const key = getCardHeadHit(section, event);
      if (key && key !== section.dataset.routeActive) setActive(section, key);
    });

    cards.forEach((card) => {
      const key = card.dataset.routeCard;
      const head = card.querySelector(".route496-card-head");
      const body = card.querySelector(".route496-card-body");
      if (head && !head.hasAttribute("tabindex")) head.tabIndex = 0;
      bindHotNode(head, () => setActive(section, key), () => scheduleReset(section));
      bindHotNode(body, () => setActive(section, key), () => scheduleReset(section));
    });

    steps.forEach((step) => {
      const key = step.dataset.routeCard;
      const hit = step.querySelector(".route496-step-hit");
      const nodes = [
        hit,
        step.querySelector(".route496-step-circle"),
        step.querySelector(".route496-step-kicker"),
        step.querySelector(".route496-step-title"),
        step.querySelector(".route496-step-status"),
        step.querySelector(".route496-step-desc")
      ].filter(Boolean);

      nodes.forEach((node) => {
        if (!node.hasAttribute("tabindex")) node.tabIndex = 0;
        bindHotNode(node, () => setActive(section, key), () => scheduleReset(section));
      });
    });
  }

  function initHomeVideoMask() {
    const mask = document.getElementById("bg12-video-mask");
    const video = document.getElementById("bg12-video");
    const content = document.getElementById("bg12-content");
    if (!mask || !video) return;

    [mask, video, content].filter(Boolean).forEach((node) => {
      node.classList.remove("hover-scale");
      node.style.transform = "";
    });

    const hot = () => video.classList.add("is-bg12-video-hot");
    const cold = () => video.classList.remove("is-bg12-video-hot");
    mask.addEventListener("pointerenter", hot);
    mask.addEventListener("pointerleave", cold);
    mask.addEventListener("focusin", hot);
    mask.addEventListener("focusout", cold);
  }

  function initHardwareMagnifierCursorPause() {
    const stages = Array.from(document.querySelectorAll(".hardware328-shell-stage"));
    if (!stages.length) return;

    const add = () => document.body.classList.add("hardware328-magnifier-cursor-paused");
    const remove = () => document.body.classList.remove("hardware328-magnifier-cursor-paused");

    stages.forEach((stage) => {
      stage.addEventListener("pointermove", () => {
        if (stage.classList.contains("is-magnifying")) add();
        else remove();
      });
      stage.addEventListener("pointerleave", remove);
      stage.addEventListener("focusout", remove);
    });
  }

  function initSuiyuanCursorTargets() {
    const selectors = [
      ".detail-close-btn",
      ".scheme-stack-card",
      ".route496-step-hit",
      ".hardware328-shell-tabs button",
      ".dev417-flow-tabs button",
      ".process-stage-card",
      ".process-fusion-clickable",
      ".process-fusion-img-card",
      ".wide-carousel-thumb",
      ".wide-carousel-card",
      ".wide-carousel-nav",
      ".wide-carousel-close",
      ".wide-carousel-main-wrap",
      ".presentation-showcase-566__card--video",
      ".presentation-showcase-566__card--exhibition",
      ".presentation-showcase-566__card--exhibition .presentation-showcase-566__media",
      ".presentation-showcase-566__collage-stack",
      ".presentation-showcase-566__collage-preview",
      ".presentation-showcase-566__collage-thumb"
    ];

    document.querySelectorAll(selectors.join(",")).forEach((node) => {
      if (node.closest(".target-cursor-wrapper")) return;
      node.classList.add("cursor-target");
      if (!node.hasAttribute("tabindex") && !/^(A|BUTTON|INPUT|TEXTAREA|SELECT)$/i.test(node.tagName)) {
        node.tabIndex = 0;
      }
    });
  }
  function initPresentationVideoPoster() {
    const card = document.querySelector(".presentation-showcase-566__card--video");
    if (!card) return;

    const poster = card.querySelector(".presentation-showcase-566__video-poster");
    const iframe = card.querySelector("iframe[data-src]");
    if (!poster || !iframe) return;

    poster.addEventListener("click", () => {
      card.classList.add("is-video-playing");
      poster.hidden = true;
      poster.setAttribute("aria-hidden", "true");
      iframe.hidden = false;
      iframe.removeAttribute("hidden");
      if (!iframe.src) iframe.src = iframe.dataset.src;
    }, { once: true });
  }

  function initPresentationExhibitionClick() {
    const card = document.querySelector(".presentation-showcase-566__card--exhibition");
    if (!card) return;

    const collage = card.querySelector(".presentation-showcase-566__hover-collage");
    const preview = card.querySelector(".presentation-showcase-566__collage-preview");
    const stack = card.querySelector(".presentation-showcase-566__collage-stack");
    const previewImg = card.querySelector(".presentation-showcase-566__collage-preview-img");
    const previewVideo = card.querySelector(".presentation-showcase-566__collage-preview-video");
    const thumbs = Array.from(card.querySelectorAll(".presentation-showcase-566__collage-thumb"));

    const preserveCollageScroll = (update) => {
      if (!collage) {
        update();
        return;
      }
      const scrollTop = collage.scrollTop;
      update();
      collage.scrollTop = scrollTop;
      window.requestAnimationFrame(() => {
        collage.scrollTop = scrollTop;
      });
    };

    const resetPreview = () => {
      preserveCollageScroll(() => {
        if (previewImg) {
          previewImg.hidden = false;
          previewImg.removeAttribute("src");
        }
        if (previewVideo) {
          previewVideo.pause();
          previewVideo.hidden = true;
          previewVideo.removeAttribute("src");
          previewVideo.load();
        }
        if (preview) {
          preview.classList.remove("is-portrait-video", "has-blurred-fill");
          preview.setAttribute("aria-hidden", "true");
        }
        collage.classList.remove("is-previewing-thumb");
      });
    };

    const setOpen = (open) => {
      card.classList.toggle("is-exhibition-collage-open", open);
      card.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("is-presentation-collage-open", open);
      if (collage) collage.setAttribute("aria-hidden", open ? "false" : "true");
      requestAnimationFrame(() => {
        if (typeof window.refreshTargetCursor === "function") window.refreshTargetCursor();
      });
      if (!open) {
        resetPreview();
      } else if (collage) {
        requestAnimationFrame(() => { collage.scrollTop = 0; });
      }
    };

    const showPreview = (thumb) => {
      if (!collage || !preview || !previewImg || !thumb) return;
      const src = thumb.dataset.previewSrc || thumb.currentSrc || thumb.src;
      if (!src) return;
      const enteringPreview = !collage.classList.contains("is-previewing-thumb");
      const isVideo = /\.mp4(?:$|[?#])/i.test(src);
      const backgroundSrc = thumb.currentSrc || thumb.src || src;
      preview.classList.toggle("is-portrait-video", thumb.dataset.previewLayout === "portrait");
      preview.classList.add("has-blurred-fill");
      preview.style.setProperty("--collage-preview-image", `url("${backgroundSrc.replace(/"/g, '\\"')}")`);
      preserveCollageScroll(() => {
        if (isVideo && previewVideo) {
          previewImg.hidden = true;
          previewImg.removeAttribute("src");
          previewVideo.pause();
          previewVideo.src = src;
          previewVideo.currentTime = 0;
          previewVideo.hidden = false;
          previewVideo.play().catch(() => {});
        } else {
          if (previewVideo) {
            previewVideo.pause();
            previewVideo.hidden = true;
            previewVideo.removeAttribute("src");
            previewVideo.load();
          }
          previewImg.hidden = false;
          previewImg.src = src;
        }
        preview.setAttribute("aria-hidden", "false");
        collage.classList.add("is-previewing-thumb");
      });
      if (enteringPreview) {
        collage.scrollTop = 0;
        requestAnimationFrame(() => { collage.scrollTop = 0; });
      }
    };

    const toggleFromCard = (event) => {
      if (collage && collage.contains(event.target)) return;
      setOpen(!card.classList.contains("is-exhibition-collage-open"));
    };

    card.addEventListener("click", toggleFromCard);
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      setOpen(!card.classList.contains("is-exhibition-collage-open"));
    });

    if (collage) {
      collage.addEventListener("click", (event) => event.stopPropagation());
    }

    thumbs.forEach((thumb) => {
      thumb.setAttribute("tabindex", "0");
      thumb.addEventListener("pointerenter", () => {
        showPreview(thumb);
      });
      thumb.addEventListener("focus", () => showPreview(thumb));
    });

    document.addEventListener("click", (event) => {
      if (!card.classList.contains("is-exhibition-collage-open")) return;
      if (card.contains(event.target)) return;
      setOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      setOpen(false);
    });
  }
  routeSections.forEach(initRouteSection);
  initHomeVideoMask();
  initHardwareMagnifierCursorPause();
  initSuiyuanCursorTargets();
  initPresentationVideoPoster();
  initPresentationExhibitionClick();
})();
























