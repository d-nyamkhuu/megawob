(function () {
  'use strict';
  const D = {
    site: 'design-use-shop-food-05',
    brand: 'RIVERDALE\nKITCHEN',
    tag: 'GOOD FOOD\nBRIGHT DAYS\nEST. 2016',
    obstruction: null,
  };
  const palette = { bg: '#ffffff', panel: '#ffffff', fg: '#111111', muted: '#555555', line: '#d9d9d9' };
  function sect(u, parent, cls, num, label) {
    const s = u.el('div', 'sect ' + cls, parent);
    u.el('span', 'mk', s, num);
    u.el('i', 'dash', s);
    u.el('span', 'lab', s, label);
    return s;
  }
  function styleNote(_c, selector) {
    const text = _c.note.querySelector(selector);
    if (!text) return;
    text.classList.add('food-task');
    if (_c.ctx.instruction.length > 65) text.classList.add('long-task');
    if (_c.ctx.instruction.length > 120) text.style.fontSize = 'min(2.7vh,1.52vw)';
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // All note modes fit in the restaurant's reserved task area.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('side-left', 'instruction-' + _c.display);
      const shell = u.el('div', 'site-shell', document.body);
      u.el('div', 'vline', shell);
      const brand = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', brand, D.brand);
      u.el('div', 'design-nav', brand, D.tag);
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.hidden = _c.display === 'hidden';
      sect(u, note, 's1', '01', 'YOUR TASK');
      const status = u.el('p', 'brief-status', note);
      u.el('span', 'basket-state', status);
      const toolbar = u.el('div', 'completion-toolbar', shell);
      const footer = u.el('footer', 'design-footer', shell);
      // The shop widget owns the behavior of this existing basket hook.
      const clear = u.el('button', 'clear-basket', footer, 'Clear basket');
      clear.type = 'button';
      u.el('div', 'order-slot', footer);
      const bottom = _c.placement === 'header' || _c.placement === 'icon';
      const marker = sect(u, shell, 's4', '04', 'COMPLETE TASK');
      const rule = u.el('div', 'rule r4', shell);
      marker.hidden = rule.hidden = !bottom;
      sect(u, shell, 's3', '03', 'YOUR ORDER');
      u.el('div', 'rule r3', shell);
      Object.assign(_c, { shell, body, note, toolbar, footer, header: note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      styleNote(_c, '.ref-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.note });
      styleNote(_c, '.ref-panel-text');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.note.appendChild(note);
        styleNote(_c, '.ref-note-text');
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        _c.footer.appendChild(foot);
        const status = foot.querySelector('.ref-foot-text');
        if (status) status.textContent = 'Ready';
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const named = D.obstruction;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
      };
      let [title, copy, label] = texts[ctx.kind];
      if (named && ['promo', 'toast', 'banner', 'cookie'].includes(ctx.kind)) {
        [title, copy, label] = named;
      }
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', title);
      u.el('h2', '', el, title);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      if (ctx.kind === 'cookie') {
        const accept = u.el('button', '', actions, 'Accept all');
        accept.addEventListener('click', () => ctx.dismiss());
      }
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  };
  env.site({
    name: D.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-use-shop-food-05': palette },
      LOW_THEME: palette,
      ACCENTS: ['#e2392b'],
      LOW_ACCENTS: ['#e2392b'],
      parts,
    },
  });
})();
