(function () {
  'use strict';
  const D = {
    site: 'design-use-shop-flight-11',
    brand: 'SkyWays Travel',
    nav: 'NeXT    File    Edit    View    Go    Bookmarks    Tools    Help',
    obstruction: ['Welcome to SkyWays Travel!', 'Take a quick tour to learn about finding and booking flights.', 'Skip tour'],
  };
  const palette = { bg: '#292b2c', panel: '#c9c9c9', fg: '#080808', muted: '#5f6a78', line: '#c8cdd5' };
  function titleBar(u, p, text) {
    const tb = u.el('div', 'nx-title', p);
    u.el('i', 'nx-ticon', tb);
    u.el('span', 'nx-ttext', tb, text);
    u.el('i', 'nx-close', tb);
    return tb;
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original inspector supports its task card even at narrow widths.
      _c.display = _c.ctx.display === 'toast' && _c.H < 740 ? 'header' : (_c.ctx.display || 'header');
      document.body.className = 'side-left instruction-' + _c.display;
      _c.root.style.setProperty('--font', 'Arial,sans-serif');
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
      const top = u.el('header', 'design-header', shell);
      u.el('span', 'nx-logo', top);
      D.nav.split(/\s+/).filter(Boolean).forEach((t) => u.el('span', 'nx-menu' + (t === 'NeXT' ? ' first' : ''), top, t));
      u.el('span', 'nx-clock', top, 'Mon Nov 2 1998    10:24 AM');
      const body = u.el('div', 'design-body', shell);
      const left = u.el('section', 'nx-left', body);
      titleBar(u, left, 'Task Briefing');
      const noteHost = u.el('div', 'nx-note-host', left);
      const extra = u.el('div', 'nx-extra', left);
      u.el('p', '', extra, 'Use the flight search and booking controls on the right to browse available one-way flights.');
      u.el('h3', '', extra, 'Important:');
      const l1 = u.el('ul', '', extra);
      ['This is a one-way flight (not round trip).', 'Review the available flights before booking.'].forEach((t) => u.el('li', '', l1, t));
      u.el('h3', '', extra, 'Notes:');
      const l2 = u.el('ul', '', extra);
      ['A help tour may appear. You can click Skip tour to continue.', 'Use the mouse, keyboard, or scroll wheel as needed.', 'Do not leave this application.'].forEach((t) => u.el('li', '', l2, t));
      for (const li of extra.querySelectorAll('li')) {
        const text = li.textContent;
        li.replaceChildren();
        for (const p of text.split(/(Skip tour|Book|Submit|Do not)/g)) u.el(/^(Skip tour|Book|Submit|Do not)$/.test(p) ? 'b' : 'span', '', li, p);
      }
      const win = u.el('section', 'nx-win', body);
      const toolbar = titleBar(u, win, D.brand);
      Object.assign(_c, { shell, body, left, win, toolbar, header: noteHost });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        const text = note.textContent;
        note.replaceChildren();
        note.classList.add('task-note');
        _c.util.el('h2', '', note, 'Your Task');
        _c.util.el('p', '', note, text);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      _c.toolbar.insertBefore(_c.headerTools, _c.toolbar.querySelector('.nx-close'));
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.header });
      const panel = _c.header.querySelector('.ref-panel');
      if (panel) panel.classList.add('task-note');
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('main', 'stage', _c.win); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note');
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('design-footer');
      foot.querySelector('.ref-foot-text').remove();
      _c.win.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const named = ctx.initial ? D.obstruction : null;
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
      const el = u.el(
        'section',
        'reference-overlay ' + ctx.kind + (ctx.initial ? ' nx-initial-tour' : ' nx-notification'),
        document.body,
      );
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', title);
      u.el('i', 'nx-ticon', el);
      const close = u.el('button', 'nx-tour-close', el, '×');
      close.type = 'button';
      close.setAttribute('aria-label', 'Close tour');
      close.addEventListener('click', () => ctx.dismiss());
      u.el('h2', '', el, title);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      if (named) {
        const accept = u.el('button', '', actions, 'Start tour');
        accept.addEventListener('click', () => ctx.dismiss());
      }
      if (/Tip/.test(title)) {
        const c = u.el('label', '', el);
        c.style.cssText = 'display:block;padding:0 22px 14px';
        const ch = u.el('input', '', c);
        ch.type = 'checkbox';
        c.append(' Do not show again');
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
    initialOverlay: { kind: 'promo' },
    design: { THEMES: { site: palette }, LOW_THEME: palette, ACCENTS: ['#3c3c3c'], LOW_ACCENTS: ['#3c3c3c'], parts },
  });
})();
