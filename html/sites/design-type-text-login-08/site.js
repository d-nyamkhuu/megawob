(function () {
  'use strict';
  const C = {
    site: 'design-type-text-login-08',
    brand: 'DeskTool - Access Manager',
    instruction: 'top',
    menu: 'File|Edit|View|Tools|Options|Help',
    briefTitle: 'Instructions',
  };
  const S = 'fill="#fff" stroke="#000" stroke-width="2" stroke-linejoin="miter" stroke-linecap="square"';
  const ICONS = {
    New: `<path ${S} d="M7 3h12l7 7v19H7z M19 3v7h7"/>`,
    Open: `<path ${S} d="M2 11V8l3-3h8l4 4h10l2 2v15q0 2-2 2H4q-2 0-2-2z M2 11h27"/>`,
    Save: `<path fill="#000" d="M3 3h23l4 4v23H3z"/><rect x="9" y="3" width="14" height="9" fill="#fff"/><rect x="17" y="3" width="4" height="7" fill="#000"/><rect x="8" y="19" width="17" height="9" fill="#fff"/>`,
    Cut: `<path fill="none" stroke="#000" stroke-width="2.8" d="M9 3L20 24 M23 3L11 24"/><circle ${S} cx="10" cy="26" r="2.7"/><circle ${S} cx="21" cy="26" r="2.7"/>`,
    Copy: `<path ${S} d="M4 3h13v18H4z"/><path fill="#fff" stroke="#000" stroke-width="2" d="M12 9h9l5 5v15H12z M21 9v5h5"/>`,
    Paste: `<path ${S} d="M6 6h20v23H6z"/><path fill="#000" d="M11 3h3a2 2 0 0 1 4 0h3v6H11z"/><circle cx="16" cy="3" r="1" fill="#fff"/>`,
    Settings: `<g fill="#000"><circle cx="16" cy="16" r="11"/><rect x="13" y="1" width="6" height="8"/><rect x="13" y="1" width="6" height="8" transform="rotate(45 16 16)"/><rect x="13" y="1" width="6" height="8" transform="rotate(90 16 16)"/><rect x="13" y="1" width="6" height="8" transform="rotate(135 16 16)"/><rect x="13" y="1" width="6" height="8" transform="rotate(180 16 16)"/><rect x="13" y="1" width="6" height="8" transform="rotate(225 16 16)"/><rect x="13" y="1" width="6" height="8" transform="rotate(270 16 16)"/><rect x="13" y="1" width="6" height="8" transform="rotate(315 16 16)"/></g><circle cx="16" cy="16" r="4.5" fill="#fff"/>`,
    Preferences: `<rect ${S} x="3" y="4" width="26" height="24" rx="2"/><path ${S} d="M9 11h14M9 16h14M9 21h14"/>`,
    Help: `<path fill="none" stroke="#000" stroke-width="5" d="M10 10c0-6 12-6 12 0 0 5-6 5-6 10"/><rect x="13.5" y="24" width="5" height="5" fill="#000"/>`,
    About: `<path ${S} d="M2 6l4-3h8l2 3 2-3h8l4 3v22H2z M16 6v22"/>`,
  };
  const GROUPS = [
    ['Session', ['New', 'Open', 'Save']],
    ['Edit', ['Cut', 'Copy', 'Paste']],
    ['Options', ['Settings', 'Preferences']],
    ['Help', ['Help', 'About']],
  ];
  const palette = { bg: '#fff', panel: '#fff', fg: '#000', muted: '#333', line: '#000' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.classList.remove('ref-has-note');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const top = u.el('header', 'ds-top', document.body);
      const logo = u.el('span', 'ds-logo', top);
      logo.innerHTML = '<svg viewBox="0 0 24 24"><path fill="#000" d="M3 2h6l3 7 3-7h6l-3 4v12l3 4h-7l2-4v-8l-4 8-4-8v8l2 4H3l3-4V6z"/></svg>';
      u.el('span', 'ds-brand', top, C.brand);
      const wc = u.el('span', 'ds-wc', top);
      u.el('i', '', wc, '_');
      u.el('i', '', wc, '□');
      u.el('i', '', wc, '×');
      const menu = u.el('nav', 'ds-menu', document.body);
      C.menu.split('|').forEach((t) => u.el('span', '', menu, t));
      const rib = u.el('div', 'ds-ribbon', document.body);
      GROUPS.forEach(([g, items]) => {
        const grp = u.el('div', 'ds-group', rib);
        grp.style.flexGrow = String(items.length);
        u.el('div', 'ds-gtitle', grp, g).dataset.g = g;
        const row = u.el('div', 'ds-gitems', grp);
        items.forEach((n) => {
          const b = u.el('div', 'ds-tool ds-tool-' + n.toLowerCase(), row);
          b.addEventListener('click', () => env.log('decoy', { label: n }));
          b.innerHTML = `<svg viewBox="0 0 32 32" width="34" height="34">${ICONS[n]}</svg>`;
          u.el('span', '', b, n);
        });
      });
      const body = u.el('div', 'ds-body');
      const content = u.el('div', 'ds-content', body);
      const dlg = u.el('div', 'ds-dlg', content);
      u.el('div', 'ds-dtitle', dlg, 'User Login');
      const main = u.el('div', 'ds-main', dlg);
      const btns = u.el('div', 'ds-btns', dlg);
      Object.assign(_c, { body, dlg, main, btns, header: dlg });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        const box = _c.util.el('aside', 'ds-header-note');
        note.classList.add('ds-instruction');
        _c.dlg.insertBefore(box, _c.main);
        box.appendChild(note);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.btns;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { document.body.appendChild(_c.body); },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.main;
      base(_c);
      _c.body = body;
      const panel = _c.main.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-title').textContent = C.briefTitle;
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-header-note');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.dlg.insertBefore(note, _c.main);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      const text = foot.querySelector('.ref-foot-text');
      text.classList.add('ds-ready');
      text.textContent = 'Ready.';
      const clock = _c.util.el('span', 'ds-clock', foot);
      _c.util.el('span', 'ds-date', clock, 'Apr 26, 1987');
      _c.util.el('span', 'ds-time', clock, '10:14 AM');
    },
    'frame.floating': (base) => (_c) => { base(_c); },
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
    name: C.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#000'], LOW_ACCENTS: ['#000'], parts,
    },
  });
})();
