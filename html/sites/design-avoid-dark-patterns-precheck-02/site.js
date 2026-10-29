// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const storeHead = util.el('div', 'bf-head', header);
      const iconbar = util.el('div', 'ris-iconbar', storeHead);
      const icons = [
        ['Applications','<path fill="#19a33b" stroke="#111" stroke-width="2" d="M23 7 16 2l-5 4-5-2 2 7-4 5 6 3 1 9 7 2 6-5 1-9 5-5-7-2Z"/><circle cx="18" cy="17" r="2" fill="#d22"/><circle cx="23" cy="21" r="2" fill="#d22"/><circle cx="14" cy="22" r="2" fill="#d22"/>'],
        ['Files','<path fill="#f5d94c" stroke="#111" stroke-width="2" d="M3 9h11l3 3h12v16H3z"/><path fill="#fff28a" stroke="#111" stroke-width="2" d="M4 8h10l3 3H4z"/>'],
        ['Save','<path fill="#1765c0" stroke="#111" stroke-width="2" d="M4 3h22l3 3v22H3V4z"/><path fill="#ddd" stroke="#111" stroke-width="2" d="M9 4h12v9H9zM8 19h16v9H8z"/><path fill="#fff" d="M12 5h6v6h-6z"/>'],
        ['Internet','<circle cx="16" cy="16" r="14" fill="#2586cd" stroke="#111" stroke-width="2"/><path fill="none" stroke="#69b747" stroke-width="4" d="M7 8 12 6l2 4-3 3 2 4-3 4-4-2-2-7zM19 4l5 3-1 4-4 2-1 4 4 2-2 5-6 2"/><path fill="none" stroke="#d9eefb" d="M3 15h26M6 8h20M7 23h18"/>'],
        ['Print','<path fill="#ddd" stroke="#111" stroke-width="2" d="M9 3h14v8H9zM6 12h20l3 4v9h-5v4H8v-4H3v-9z"/><path fill="#fff" stroke="#111" stroke-width="2" d="M8 21h16v9H8z"/><path stroke="#111" d="M11 24h10M11 27h10"/>'],
        ['Help','<path fill="#fff" stroke="#111" stroke-width="2" d="M7 2h18v28H7z"/><path stroke="#111" stroke-width="2" d="M11 8h10M11 13h10M11 18h10M11 23h10"/>'],
      ];
      for (let i = 0; i < icons.length; i++) {
        const [label, artwork] = icons[i];
        const item = util.el('span', 'ris-icon', iconbar);
        item.title = label;
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 32 32');
        svg.setAttribute('aria-hidden', 'true');
        svg.innerHTML = artwork;
        item.appendChild(svg);
      }
      util.el('div', 'bf-logo', storeHead, 'Larkspur Goods - Checkout');
      const controls = util.el('div', 'ris-window-controls', storeHead);
      util.el('span', 'ris-min', controls, '−');
      util.el('span', 'ris-max', controls, '□');
      util.el('span', 'ris-close', controls, '×');
      S.frameBrand(_c, header);
      Object.assign(_c, { controls, header, iconbar, icons, storeHead });
    },
  };

  env.site({
    name: 'design-avoid-dark-patterns-precheck-02',
    template: 'site/base',
    design: { parts },
  });
})();
