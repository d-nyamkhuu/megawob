(function () {
  'use strict';
  const palette = { bg: '#ffffff', panel: '#ffffff', fg: '#222a33', muted: '#6b7480', line: '#cfd5db' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      if ((_c.ctx.display === 'panel' || _c.ctx.display === 'toast') && (_c.W < 1260 || _c.H < 700)) _c.display = 'header';
      document.body.className = 'instruction-' + _c.display;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const shell = u.el('div', 'site-shell', document.body);
      const bar = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', bar, 'SkyFind');
      const nav = u.el('nav', 'design-nav', bar);
      for (const n of ['Flights', 'Hotels', 'Cars', 'My Trips']) u.el('span', '', nav, n);
      const toolbar = u.el('div', 'design-util', bar);
      u.el('span', '', toolbar, 'Help');
      u.el('i', '', toolbar);
      u.el('span', '', toolbar, 'Sign In');
      const note = u.el('section', 'task-note');
      note.hidden = _c.display !== 'header';
      Object.assign(_c, { shell, toolbar, header: note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'design-body', _c.shell);
      const wb = u.el('div', 'workbench', body);
      wb.appendChild(_c.header);
      const insp = u.el('aside', 'inspector', body);
      u.el('h3', 'insp-h', insp, 'Trip Details');
      Object.assign(_c, { body, wb, insp });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.insp;
      base(_c);
      _c.body = body;
      const title = _c.insp.querySelector('.ref-panel-title');
      if (title) title.textContent = 'Task instructions';
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.wb);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const u = _c.util, insp = _c.insp;
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        const title = u.el('b', 'note-title', null, 'Task');
        note.insertBefore(title, note.firstChild);
        insp.appendChild(note);
      }
      const kv = u.el('div', 'insp-kv', insp);
      for (const k of ['From', 'To', 'Date', 'Passengers']) {
        u.el('span', '', kv, k);
        u.el('span', '', kv, k === 'Passengers' ? '1 Adult' : '—');
      }
      u.el('hr', '', insp);
      const none = u.el('div', 'insp-none', insp);
      u.el('b', '', none, 'No flight selected');
      u.el('span', '', none, 'Choose a flight from the results on the left to see details here.');
      const ps = u.el('div', 'insp-sum', insp);
      u.el('h3', 'insp-h', ps, 'Price Summary');
      const rows = u.el('div', 'insp-rows', ps);
      for (const k of ['Fare', 'Taxes & Fees']) {
        u.el('span', '', rows, k);
        u.el('span', '', rows, '—');
      }
      u.el('hr', '', rows);
      u.el('b', '', rows, 'Total (USD)');
      u.el('span', '', rows, '—');
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.insp.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        texts = {
          cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
          toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
          chat: ['Help', 'Need help with this workspace?', 'Close'],
          promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
          banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
        };
      const [title, copy, label] = texts[ctx.kind],
        el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
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
    name: 'design-use-shop-flight-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { site: palette }, LOW_THEME: palette, ACCENTS: ['#2a78c2'], LOW_ACCENTS: ['#2a78c2'], parts },
  });
})();
