// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  const TITLES = ['Documents'];

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      base(_c);
      const rr = _c.rng.fork('aero/end');
      if (!_c.ctx.finish && rr.bool(0.68)) {
        _c.placement = 'footer';
        _c.wantFooter = true;
        const finishDraw = _c.rng.fork('aero/end/finish').bool(0.75);
        if (finishDraw && _c.ctx.instruction.length % 3 !== 2) _c.label = 'Finish';
        if (_c.collide?.text?.toLowerCase() === _c.label.toLowerCase()) _c.collide = null;
      }
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, sidebar, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      // This design uses the GNOME Files navigation rail on every episode. Keep the
      // reference frame's conditional random draw intact even though the rail is fixed.
      if (sidebar) local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
      Object.assign(_c, { body });
    },
    'frame.header': (base, S) => function (_c) {
      base(_c);
      const { header, util } = _c;
      header.classList.add('aero-titlebar');
      const icon = util.el('span', 'aero-app-icon', header);
      icon.innerHTML = '<svg width="24" height="23" viewBox="0 0 24 23" aria-hidden="true"><path d="M2 5h8l2 2h10v12H2z" fill="#e6b73d" stroke="#95721a"/><path d="M2 8h20l-2 12H4z" fill="#f7d963" stroke="#b38a1b"/><path d="M8 9h8v6H8z" fill="#9ac8e3" opacity=".75"/></svg>';
      header.insertBefore(icon, header.firstChild);
      if (!header.querySelector('.ref-brand')) {
        const brand = util.el('div', 'ref-brand', header, 'Documents');
        header.insertBefore(brand, icon.nextSibling);
      }
      const controls = util.el('div', 'aero-window-controls', header);
      for (const [symbol, label] of [['−', 'Minimize'], ['□', 'Maximize'], ['×', 'Close']]) {
        const b = util.el('span', 'aero-window-button', controls, symbol);
        b.setAttribute('aria-label', label);
      }
    },
    'frame.nav': (base, S) => function (_c) {
      base(_c);
      const { header, util } = _c;
      const menu = util.el('nav', 'aero-menu', document.body);
      for (const item of ['File', 'Edit', 'View', 'Tools', 'Help']) {
        const a = util.el('a', 'aero-menu-link', menu, item);
        a.href = '#';
        a.addEventListener('click', e => { e.preventDefault(); env.log('menu', { label: item }); });
      }
      const old = header.querySelector('.ref-nav');
      if (old) old.style.display = 'none';
    },
  };

  env.site({
    name: 'design-use-file-manager-copy-04',
    template: 'site/base',
    design: { TITLES, parts },
  });
})();
