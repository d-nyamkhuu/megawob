// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const windowControls = util.el('div', 'rm-window-controls', header);
      for (const [symbol, title] of [['_', 'Minimize'], ['□', 'Maximize'], ['×', 'Close']]) {
        const control = util.el('button', 'rm-window-control', windowControls, symbol);
        control.type = 'button';
        control.title = title;
        control.setAttribute('aria-label', title);
        control.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + (title === 'Minimize' ? '<path d="M5 19h14"/>' : title === 'Maximize' ? '<path d="M4 4h17v17H4zM4 8h17"/>' : '<path d="M5 5l14 14M19 5L5 19"/>') + '</svg>';
      }
      S.frameBrand(_c, header);
      const title = util.el('div', 'rm-title', header);
      title.innerHTML = '<span class="rm-app-icon"><svg viewBox="0 0 28 28" aria-hidden="true"><path d="M14 2l5 3 4 1v6l2 4-4 4v5H7v-4l-4-4 2-5V6l5-1zM14 7a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM10 22h9M14 9v5h4"/></svg></span><span>City Map</span>';
      const menu = util.el('nav', 'rm-menu', header);
      for (const name of ['File', 'Edit', 'View', 'Tools', 'Places', 'Help']) {
        const item = util.el('span', 'rm-menu-item', menu);
        util.el('u', '', item, name[0]);
        item.append(document.createTextNode(name.slice(1)));
      }
      Object.assign(_c, { header, windowControls });
    },
    'frameSidebar': (base, S) => function (_c, body) {
      const side = base(_c, body);
      if (side) side.remove();
      return null;
    },
    'frame.stage': (base, S) => function (_c) {
      base(_c);
      const dock = _c.util.el('nav', 'rm-dock', _c.body);
      const paths = [
        '<circle cx="16" cy="16" r="12"/><ellipse cx="16" cy="16" rx="6" ry="12"/><path d="M4 16h24M7 9h18M7 23h18"/>',
        '<path d="M12 7h17M12 16h17M12 25h17"/><circle cx="5" cy="7" r="1"/><circle cx="5" cy="16" r="1"/><circle cx="5" cy="25" r="1"/>',
        '<path d="M6 25L25 6"/><circle cx="6" cy="25" r="3"/><circle cx="25" cy="6" r="3"/><path d="M6 28v3"/>',
        '<rect x="4" y="4" width="24" height="24" stroke-dasharray="4 2"/>',
        '<path d="M13 3h6l1 5 4 2 5-1 2 5-4 3-1 4 2 5-5 3-4-4h-4l-4 4-5-3 2-5-1-4-4-3 2-5 5 1 4-2z" fill="currentColor"/><circle cx="16" cy="17" r="5" fill="#d0d0d0"/>'
      ];
      ['Map','Places','Routes','Zones','Settings'].forEach((name, i) => {
        const tab = _c.util.el('div', 'rm-dock-tab' + (i === 0 ? ' selected' : ''), dock);
        tab.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true">' + paths[i] + '</svg><span>' + name + '</span>';
      });
    },
    overlay: (base, S) => function (ctx) {
      const out = base(ctx);
      if (ctx.kind === 'banner' || ctx.kind === 'promo') {
        out.el.style.top = document.querySelector('.ref-task').getBoundingClientRect().bottom + 3 + 'px';
      }
      return out;
    },
  };

  env.site({
    name: 'design-pan-map-zoomto-05',
    template: 'site/base',
    design: { parts },
  });
})();
