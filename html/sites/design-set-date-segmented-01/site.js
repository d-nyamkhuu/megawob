(function () {
  'use strict';
  const palette = { bg: '#008080', panel: '#c0c0c0', fg: '#111111', muted: '#555555', line: '#888888' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original has dedicated positions for its notes, including on small screens.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ds-body', document.body);
      const win = u.el('div', 'ds-window', body);
      const title = u.el('header', 'ds-top', win);
      u.el('span', 'ds-appicon', title, '▦');
      u.el('span', 'ds-brand', title, 'Personal Organizer');
      const controls = u.el('div', 'ds-window-controls', title);
      ['—', '□', '×'].forEach((x) => u.el('span', '', controls, x));
      const menu = u.el('nav', 'ds-menu', win);
      ['File', 'Edit', 'View', 'Tools', 'Help'].forEach((x) => u.el('span', '', menu, x));
      const content = u.el('div', 'ds-content', win);
      Object.assign(_c, { win, menu, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        const box = _c.util.el('aside', 'ds-header-note', _c.header);
        note.classList.add('ds-instruction');
        box.appendChild(note);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const stage = u.el('main', 'ds-stage', _c.body);
      const rail = u.el('aside', 'ds-rail', _c.body);
      u.el('h2', '', rail, 'Appointment Properties');
      [
        ['Category:', 'Business'],
        ['Status:', 'Busy'],
        ['Reminder:', 'None'],
      ].forEach(([a, b]) => {
        u.el('label', 'ds-proplabel', rail, a);
        u.el('div', 'ds-select', rail, b + '　▾');
      });
      u.el('div', 'ds-separator', rail);
      u.el('div', 'ds-proptext', rail,
        'Created:\nTue 1 Oct 1996\n10:24 AM\n\nLast modified:\nTue 1 Oct 1996\n10:24 AM');
      const foot = u.el('footer', 'ds-footer', _c.win);
      const dock = u.el('nav', 'ds-dock', _c.win);
      [
        ['▦', 'Calendar'],
        ['♟', 'Contacts'],
        ['☑', 'Tasks'],
        ['▰', 'Notes'],
        ['■', 'Journal'],
      ].forEach(([i, t], n) => {
        const b = u.el('button', n === 0 ? 'active' : '', dock);
        u.el('span', 'ds-dockicon', b, i);
        u.el('span', '', b, t);
      });
      Object.assign(_c, { stage, foot });
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.foot.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.win.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-set-date-segmented-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-set-date-segmented-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#000080'],
      LOW_ACCENTS: ['#000080'],
      parts,
    },
  });
})();
