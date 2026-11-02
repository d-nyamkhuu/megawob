// Adds the quarterly plan backdrop and People button, and keeps menu flyouts inside the viewport.
(function () {
  'use strict';

  env.widget({
    task: 'click-control',
    site: 'design-click-control-menu-07',
    name: 'design',
    split: 'train',
    scenarios: ['menu'],
    traits: { menuOpen: ['hover', 'click'] },
    template: 'click-control/controls',
    design: {
      menuLabel: 'People',
      parts: {
        menuPrelude: () => (ctx, content) => {
          const list = ctx.util.el('div', 'doc', content);
          list.innerHTML =
            '<h3>Quarterly Plan</h3><p>Our team will focus on product quality, customer growth, and operational excellence in the next quarter. This document outlines key initiatives, milestones, and owners.</p><h4>Key Initiatives</h4><ul><li>Improve onboarding experience</li><li>Expand into new markets</li><li>Increase customer satisfaction</li><li>Streamline internal processes</li></ul>';
        },
        menuTrigger: () => () =>
          '<svg width="24" height="24" viewBox="0 0 24 24"><g fill="#41668f" stroke="#eef5ff" stroke-width=".7"><circle cx="8" cy="7" r="3"/><path d="M3 12q5-5 10 0v10H3z"/><circle cx="17" cy="6" r="3"/><path d="M13 11q4-4 8 0v11h-8z"/></g></svg><span>People</span>',
        menuBuilt: (base, S) => (ctx, content, wrap, root, items) => {
          base(ctx, content, wrap, root, items);
          // Keep the existing origin and rightward flyouts when they fit. At narrow
          // sizes a cascade opens toward the document instead of beyond the desktop.
          // Measure before menu() hides panels, so this also covers a closed start.
          const desktop = document.body.getBoundingClientRect();
          const rootRect = root.getBoundingClientRect();
          if (rootRect.right > desktop.right - 8) {
            root.style.left = (parseFloat(getComputedStyle(root).left) || 0) - (rootRect.right - desktop.right + 8) + 'px';
          }
          function fitFlyouts(nodes, direction) {
            nodes.forEach((item) => {
              if (!item.panel) return;
              const rowRect = item.el.getBoundingClientRect();
              const panelRect = item.panel.getBoundingClientRect();
              let next = direction;
              if (next > 0 && rowRect.right + 2 + panelRect.width > desktop.right - 8) next = -1;
              if (next < 0 && rowRect.left - 2 - panelRect.width < desktop.left + 8) next = 1;
              item.panel.style.left = next > 0 ? 'calc(100% + 2px)' : 'auto';
              item.panel.style.right = next < 0 ? 'calc(100% + 2px)' : 'auto';
              item.panel.style.top = Math.min(-3, desktop.bottom - 8 - rowRect.top - panelRect.height) + 'px';
              fitFlyouts(item.children, next);
            });
          }
          fitFlyouts(items, 1);
        },
      },
    },
  });
})();
