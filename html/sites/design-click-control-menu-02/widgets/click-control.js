// Design of this site on click-control/controls: retain its academic toolbar and menu panel sizing.
(function () {
  'use strict';

  env.widget({
    task: 'click-control',
    site: 'design-click-control-menu-02',
    name: 'design',
    split: 'train',
    scenarios: ['menu'],
    traits: { menuOpen: ['hover', 'click'] },
    template: 'click-control/controls',
    design: {
      icons: {
        gear: '<path fill="currentColor" stroke="none" fill-rule="evenodd" d="M6.8 1h2.4l.5 1.9 1.2.5 1.7-1 1.7 1.7-1 1.7.5 1.2 1.9.5v2.4l-1.9.5-.5 1.2 1 1.7-1.7 1.7-1.7-1-1.2.5-.5 1.9H6.8l-.5-1.9-1.2-.5-1.7 1-1.7-1.7 1-1.7-.5-1.2L.3 9.9V7.5l1.9-.5.5-1.2-1-1.7 1.7-1.7 1.7 1 1.2-.5z M11 8.7a3 3 0 1 0-6 0 3 3 0 1 0 6 0"/>',
        lock: '<path d="M4.6 7V4.5a3.4 3.4 0 0 1 6.8 0V7"/><rect x="2.5" y="6.5" width="11" height="8.5" rx=".5" fill="currentColor" stroke="none"/><path d="M8 10v2.7" stroke="white" stroke-width="1.2"/><circle cx="8" cy="10" r="1.2" fill="white" stroke="none"/>',
      },
      menuLabel: 'Menu',
      decoysAfter: ['Help', 'Log Out'],
      parts: {
        menuTrigger: (base) => () => `${base()}<i class="tri">&#9660;</i>`,
        menuHead: () => (ctx, wrap, trigger) => {
          const { util } = ctx;
          if (!trigger) {
            const label = util.el('span', 'uc-menubtn acad-static-trigger', wrap);
            label.innerHTML = '<span>Menu</span><i class="tri">&#9660;</i>';
            label.setAttribute('aria-hidden', 'true');
          }
          ['New', 'Reply', 'Forward', 'Delete'].forEach((text) => {
            const button = util.el('span', 'acad-tb', wrap, text);
            button.setAttribute('aria-hidden', 'true');
          });
        },
        menuPanel: (base) => (panel, nodes) => {
          base(panel, nodes);
          panel.style.setProperty('--menu-rows', nodes.length);
        },
      },
    },
  });
})();
