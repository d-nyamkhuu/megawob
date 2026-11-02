(function () {
  'use strict';
  const C = {
    'site': 'design-choose-option-radio-05',
    'title': 'Subscription',
    'note': 'Note',
    'clock': '10:24 AM',
    'menus': ['File', 'Edit', 'View', 'Special', 'Help'],
  };
  const ICONS = {
    disk: '<svg viewBox="0 0 60 64" width="60" height="64"><path d="M3 3h54v58H3z" fill="#fff" stroke="#000" stroke-width="3"/><rect x="14" y="3" width="32" height="18" fill="#fff" stroke="#000" stroke-width="3"/><rect x="36" y="7" width="5" height="10" fill="#000"/><rect x="10" y="30" width="40" height="26" fill="#fff" stroke="#000" stroke-width="3"/><path d="M15 38h30M15 44h30M15 50h30" stroke="#000" stroke-width="2.5"/></svg>',
    folder:
      '<svg viewBox="0 0 66 58" width="66" height="58"><path d="M5 13V7h7l5-5h14l7 11" fill="#fff" stroke="#000" stroke-width="3"/><path d="M3 12h60v43H3z" fill="#fff" stroke="#000" stroke-width="3"/><path d="M59 13v41h4V13" fill="#000"/></svg>',
    trash:
      '<svg viewBox="0 0 48 70" width="48" height="70"><defs><pattern id="trash-dots" width="3" height="3" patternUnits="userSpaceOnUse"><rect width="1" height="1" fill="#000"/></pattern></defs><path d="M17 8V3h12l4 5" fill="#fff" stroke="#000" stroke-width="2"/><path d="M4 9h41v7H4zM7 17h36v48l-4 3H10l-3-3z" fill="#fff" stroke="#000" stroke-width="2.5"/><path d="M34 17h9v48l-4 3h-5z" fill="url(#trash-dots)" stroke="#000" stroke-width="1"/><path d="M13 22v40M20 22v40M27 22v40M4 12h41" stroke="#000" stroke-width="2"/></svg>',
    apple:
      '<svg viewBox="0 0 20 24" width="20" height="24"><path d="M10 7c-3-2-8 0-8 7 0 5 3 9 5 9 1 0 2-1 3-1s2 1 3 1c2 0 5-4 5-6-3-1-4-6 0-8-2-3-6-3-8-2zM11 5c0-3 2-4 4-5 0 3-1 5-4 5z" fill="#000"/></svg>',
  };
  const palette = { bg: '#ffffff', panel: '#ffffff', fg: '#000000', muted: '#000000', line: '#000000' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const shell = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', shell);
      const bar = u.el('nav', 'mac-menubar', content);
      u.el('span', 'mac-apple', bar).innerHTML = ICONS.apple;
      C.menus.forEach((m) => u.el('span', 'mac-menu', bar, m));
      const ck = u.el('span', 'mac-clock', bar);
      ck.innerHTML =
        '<svg viewBox="0 0 22 22" width="22" height="22" style="vertical-align:middle;margin-right:1.2vw"><rect x="1.5" y="1.5" width="19" height="19" rx="3" fill="#fff" stroke="#000" stroke-width="3"/><circle cx="11" cy="10" r="4" fill="#000"/><rect x="3" y="15" width="16" height="3" fill="#000"/></svg>' + C.clock;
      const mk = (cls, svg, label) => {
        const d = u.el('div', 'mac-icon ' + cls, content);
        u.el('div', 'mac-glyph', d).innerHTML = svg;
        u.el('div', 'mac-cap', d, label);
      };
      mk('hd', ICONS.disk, 'Macintosh HD');
      mk('docs', ICONS.folder, 'Documents');
      mk('trash', ICONS.trash, 'Trash');
      Object.assign(_c, { content, bar, header: bar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.content;
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => { base(_c); },
    'frame.body': () => (_c) => {
      const win = _c.util.el('div', 'mac-win', _c.content);
      const tb = _c.util.el('div', 'mac-title', win);
      _c.util.el('span', 'mac-close', tb);
      _c.util.el('span', 'mac-title-text', tb, C.title);
      Object.assign(_c, { body: _c.content, win });
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.content.querySelector('.ref-panel');
      if (note) {
        note.classList.add('mac-note');
        const title = note.querySelector('.ref-panel-title');
        title.classList.add('mac-note-title');
        title.textContent = '';
        _c.util.el('span', 'mac-close', title);
        _c.util.el('span', 'mac-title-text', title, C.note);
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.win);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('mac-note', 'mac-note-toast');
        _c.content.appendChild(note);
        const title = _c.util.el('div', 'mac-note-title', note);
        note.prepend(title);
        _c.util.el('span', 'mac-title-text', title, 'Message');
        title.appendChild(note.querySelector('.ref-note-x'));
      }
    },
    'frame.footer': (base) => (_c) => {
      const foot = _c.util.el('footer', 'ds-footer', _c.win);
      const reset = _c.util.el('button', 'ds-reset', foot, 'Cancel');
      reset.type = 'button';
      reset.addEventListener('click', () => {
        _c.stage.querySelectorAll('input[type=radio]').forEach((el) => (el.checked = false));
      });
      base(_c);
      const controls = document.body.querySelector('.ref-foot');
      foot.appendChild(controls);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.content.appendChild(dock);
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
    name: C.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#000000'], LOW_ACCENTS: ['#000000'], parts,
    },
  });
})();
