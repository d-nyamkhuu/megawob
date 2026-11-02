(function () {
  'use strict';
  const palette = { bg: '#211b28', panel: '#fffefd', fg: '#151727', muted: '#70727d', line: '#dedde0' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The tips pane has room for every instruction display at every viewport.
      _c.display = _c.ctx.display || 'header';
      document.body.className = 'shop-window instruction-' + _c.display;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const shell = u.el('div', 'site-shell', document.body);
      const toolbar = u.el('header', 'design-header', shell);
      u.el('div', 'pine-mark', toolbar, '❧');
      u.el('div', 'design-brand', toolbar, 'Pine & Loom  |  Shop');
      const controls = u.el('div', 'window-controls', toolbar);
      u.el('span', '', controls, '—');
      u.el('span', '', controls, '□');
      u.el('span', '', controls, '×');
      const note = u.el('aside', 'task-note');
      u.el('h2', '', note, 'Shopping Tips');
      const header = u.el('div', 'instruction-slot', note);
      Object.assign(_c, { shell, toolbar, note, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => { base(_c); },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'design-body', _c.shell);
      body.appendChild(_c.note);
      Object.assign(_c, { body });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const u = _c.util;
      const note = _c.note;
      const tip = (icon, title, copy, cls) => {
        const row = u.el('div', 'tip-row ' + cls, note);
        u.el('span', 'tip-icon', row, icon);
        const text = u.el('div', '', row);
        u.el('b', '', text, title);
        u.el('span', '', text, copy);
      };
      tip('♧', 'Sustainable materials', 'Look for the leaf icon', 'green');
      tip('♧', 'Free shipping', 'On orders over $50', '');
      tip('⬡', 'Easy returns', '30 days, no hassle', '');
      const legend = u.el('section', 'option-legend', note);
      u.el('h3', '', legend, 'Product Options');
      [
        ['available', 'Available choice', 'Click to select'],
        ['selected', 'Selected choice', 'Currently chosen'],
        ['disabled', 'Unavailable choice', 'Not available for this product'],
      ].forEach(([cls, title, copy]) => {
        const row = u.el('div', 'legend-row', legend);
        u.el('span', 'legend-swatch ' + cls, row);
        const t = u.el('div', '', row);
        u.el('b', '', t, title);
        u.el('span', '', t, copy);
      });
      const help = u.el('section', 'help-block', note);
      u.el('h3', '', help, 'Need Help?');
      const helpRow = u.el('div', 'tip-row', help);
      u.el('span', 'tip-icon', helpRow, '☏');
      const ht = u.el('div', '', helpRow);
      u.el('b', '', ht, 'Contact support');
      u.el('span', '', ht, "We're here to help");
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.header.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('design-footer');
      _c.shell.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const copy = {
        cookie: ['Privacy preferences', 'We use essential cookies to keep your shopping session working.', 'Accept'],
        toast: ['Saved', 'Your preferences are up to date.', 'Dismiss'],
        chat: ['Contact support', 'How can we help with your order?', 'Close'],
        promo: ['A little something extra', 'Explore the latest pieces from Pine & Loom.', 'Close'],
        banner: ['Store update', 'Free standard shipping on orders over $50.', 'Dismiss'],
      }[ctx.kind];
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', copy[0]);
      u.el('h2', '', el, copy[0]);
      u.el('div', 'overlay-copy', el, copy[1]);
      const actions = u.el('div', 'overlay-actions', el);
      const dismiss = u.el('button', 'primary', actions, copy[2]);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-use-shop-variantpick-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-use-shop-variantpick-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#f35b4c'],
      LOW_ACCENTS: ['#f35b4c'],
      parts,
    },
  });
})();
