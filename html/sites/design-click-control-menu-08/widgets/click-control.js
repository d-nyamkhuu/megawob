// Design of this site on the click-control/controls template (templates/click-control/controls.js): the menu sits in a toolbar slot of an organizer page (bar mode shows a static "Menu" heading); popups are kept inside the paper.
(function () {
  'use strict';
  let fitMenus = null;
  env.widget({
    task: 'click-control',
    site: 'design-click-control-menu-08',
    name: 'design',
    split: 'train',
    scenarios: ['menu'],
    traits: { menuOpen: ['hover', 'click'] },
    template: 'click-control/controls',
    design: {
      parts: {
        // The page title is the paper's heading.
        frame: (base) => (ctx) => {
          const f = base(ctx);
          f.h1 = f.content.closest('.o-page').querySelector('.o-paper h1') || f.h1;
          return f;
        },
        // Reserve a toolbar slot, keeping the interactive menu inside the task stage.
        menuWrapMade: () => (ctx, wrap, content) => {
          const toolbar = content.closest('.o-page').querySelector('.o-bar');
          const slot = ctx.util.el('span', 'o-menureserve', toolbar);
          toolbar.insertBefore(slot, toolbar.querySelector('.o-tool'));
          wrap.classList.add('o-menutool');
          const slotRect = slot.getBoundingClientRect();
          const origin = content.getBoundingClientRect();
          Object.assign(wrap.style, {
            left: `${slotRect.left - origin.left}px`,
            top: `${slotRect.top - origin.top}px`,
            width: `${slotRect.width}px`,
            height: `${slotRect.height}px`,
          });
        },
        menuTrigger: (base) => () => base() + '<span class="o-caret">▾</span>',
      menuHead: () => (ctx, wrap, trigger) => {
          if (trigger) return;
          const heading = ctx.util.el('div', 'uc-btn o-menuheading', wrap);
          heading.innerHTML = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 4h12M2 8h12M2 12h12"/></svg><span>Menu</span><span class="o-caret">▾</span>';
        },
        // Deep branches must remain clickable inside the organizer's clipped paper.
        // Only popup geometry changes; the anchored page and all seeded draws stay fixed.
        menuBuilt: () => (ctx, content, wrap, root) => {
          const panels = [root, ...root.querySelectorAll('.uc-mpanel')];
          fitMenus = () => {
            const paper = content.closest('.o-page');
            if (!paper) return;
            const bounds = paper.getBoundingClientRect();
            panels.forEach((panel) => { panel.style.transform = ''; });
            panels.forEach((panel) => {
              if (!panel.getClientRects().length) return;
              const r = panel.getBoundingClientRect();
              const dx = Math.max(bounds.left + 4 - r.left, Math.min(0, bounds.right - 4 - r.right));
              const dy = Math.max(bounds.top + 4 - r.top, Math.min(0, bounds.bottom - 4 - r.bottom));
              if (dx || dy) panel.style.transform = `translate(${dx}px,${dy}px)`;
            });
          };
        },
        menuSynced: () => () => { if (fitMenus) fitMenus(); },
      },
    },
  });
})();
