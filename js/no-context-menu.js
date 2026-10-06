/* 禁止右键：全站屏蔽 contextmenu（右键菜单）
   - 捕获阶段拦截，优先级最高，任何元素上的右键菜单都不会弹出
   - 支持对个别元素加 data-allow-contextmenu="1" 放行（如需要） */
(function () {
  'use strict';

  function blockContextMenu(e) {
    var node = e.target;
    while (node && node.nodeType === 1) {
      if (node.getAttribute && node.getAttribute('data-allow-contextmenu') === '1') {
        return;
      }
      node = node.parentElement;
    }
    e.preventDefault();
    e.stopPropagation();
  }

  document.addEventListener('contextmenu', blockContextMenu, true);

  // 兜底：防止旧代码用 oncontextmenu = null 之类的方式覆盖（oncontextmenu 与监听互不影响，
  // 但显式置空可避免内联 oncontextmenu 菜单逻辑）
  document.oncontextmenu = function () { return false; };
})();
