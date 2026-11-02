(function () {
  'use strict';
  const C = {
    'site': 'design-type-text-password-12',
    'brand': 'Notebook',
    'menu': 'File|Edit|View|Note|Tools|Help',
    'heading': 'Set Notebook Password',
  };
  const ICON = {
    chev: '<svg viewBox="0 0 16 16" width="16" height="16"><path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
    bang: '<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="12" cy="12" r="12" fill="#f26a0f"/><rect x="10.7" y="5" width="2.6" height="9" rx="1.2" fill="#fff"/><circle cx="12" cy="18" r="1.6" fill="#fff"/></svg>',
    logo: '<svg viewBox="0 0 20 24" width="100%" height="100%"><rect x="1" y="1" width="18" height="22" rx="3" fill="#ff842a" stroke="#dc6312"/><path d="M4 3v17h12M6 4h7M6 6h5" fill="none" stroke="#fff2d9" stroke-width="1.2"/><path d="M15 3v3" stroke="#fff2d9"/></svg>',
    list: '<svg viewBox="0 0 24 24" width="100%" height="100%"><g fill="currentColor"><circle cx="4" cy="6" r="1.6"/><circle cx="4" cy="12" r="1.6"/><circle cx="4" cy="18" r="1.6"/></g><path d="M9 6h12M9 12h12M9 18h12" stroke="currentColor" stroke-width="1.8"/></svg>',
    link: '<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
    numbered:
      '<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M9 5h12M9 12h12M9 19h12" stroke="currentColor" stroke-width="1.8"/><g fill="currentColor" font-family="Arial" font-weight="bold" font-size="7"><text x="1" y="7">1</text><text x="1" y="14">2</text><text x="1" y="21">3</text></g></svg>',
    img: '<svg viewBox="0 0 24 24" width="100%" height="100%"><rect x="3" y="3" width="18" height="18" rx="1" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="16" cy="8" r="2" fill="currentColor"/><path d="M4 19l6-7 4 4 3-3 4 6z" fill="currentColor"/></svg>',
  };
  const palette = { bg: '#f8f6f3', panel: '#f8f6f3', fg: '#080f20', muted: '#5a5f66', line: '#d6d8dc' };

  function decorateNote(u, box, text) {
    const icon = u.el('span', 'nb-bang');
    icon.innerHTML = ICON.bang;
    box.prepend(icon);
    const inner = u.el('div', 'nb-ntext', box);
    text.classList.add('ds-instruction');
    inner.appendChild(text);
    u.el('div', 'nb-sub', inner, 'This will protect your notes with a master password.');
  }

  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The notebook keeps its inline notice even at short viewports.
      let display = _c.ctx.display || 'header';
      if (display === 'panel' && (!_c.roomy || !_c.tall)) display = 'header';
      _c.display = display;
      document.body.classList.toggle('ref-has-note', display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'nb-logo', top).innerHTML = ICON.logo;
      u.el('span', 'ds-brand', top, C.brand);
      u.el('span', 'nb-wc', top).innerHTML = '<i class="mn"></i><i class="mx"></i><i class="cl"></i>';
      const nav = u.el('nav', 'ds-menu', document.body);
      C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      const tb = u.el('div', 'nb-tool', document.body);
      const sel = u.el('div', 'nb-sel', tb);
      u.el('span', '', sel, 'Normal text');
      u.el('span', 'nb-ch', sel).innerHTML = ICON.chev;
      const sep = () => u.el('i', 'nb-sep', tb);
      sep();
      [['B', 'b'], ['I', 'i'], ['U', 'u'], ['S', 's']].forEach(([t, c]) => u.el('span', 'nb-ic nb-' + c, tb, t));
      sep();
      u.el('span', 'nb-ic nb-sv', tb).innerHTML = ICON.list;
      u.el('span', 'nb-ic nb-sv', tb).innerHTML = ICON.numbered;
      sep();
      u.el('span', 'nb-ic nb-sv', tb).innerHTML = ICON.link;
      u.el('span', 'nb-ic nb-sv', tb).innerHTML = ICON.img;
      const body = u.el('div', 'ds-body');
      const content = u.el('div', 'ds-content', body);
      u.el('h1', 'nb-h1', content, C.heading);
      const header = u.el('div', 'nb-note-slot', content);
      Object.assign(_c, { body, content, header, toolbar: tb });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const text = _c.header.querySelector('.ref-instruction');
      if (text) {
        const box = _c.util.el('aside', 'ds-header-note', _c.header);
        decorateNote(_c.util, box, text);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      document.body.appendChild(_c.body);
      const u = _c.util;
      const side = u.el('aside', 'nb-side', _c.body);
      u.el('h2', 'nb-sh', side, 'Note settings');
      _c.side = side;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.side;
      base(_c);
      _c.body = body;
      const panel = _c.side.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-panel-note', 'nb-panel-note');
        decorateNote(_c.util, panel, panel.querySelector('.ref-panel-text'));
      }
      const u = _c.util;
      const side = _c.side;
      u.el('div', 'nb-sec', side, 'Appearance');
      [['Theme:', 'Light'], ['Font size:', '14 px'], ['Editor font:', 'Consolas']].forEach(([l, v]) => {
        const row = u.el('div', 'nb-row', side);
        u.el('span', 'nb-rl', row, l);
        const select = u.el('div', 'nb-dd', row);
        u.el('span', '', select, v);
        u.el('span', 'nb-ch', select).innerHTML = ICON.chev;
      });
      const save = u.el('button', 'nb-save', side, 'Save view');
      save.type = 'button';
      const saved = u.el('div', 'nb-small', side, 'Saves only your current appearance preferences.');
      save.addEventListener('click', () => { saved.textContent = 'Appearance preferences saved.'; });
      u.el('hr', 'nb-hr', side);
      u.el('div', 'nb-sec nb-sec2', side, 'Security');
      u.el('div', 'nb-p', side, 'Set a password to keep your notes private.');
      u.el('div', 'nb-p', side, 'This does not encrypt existing files automatically.');
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const main = u.el('div', 'ds-main', _c.content);
      const stage = u.el('main', 'ds-stage', main);
      const check = u.el('label', 'nb-show', _c.content);
      const toggle = u.el('input', 'nb-box', check);
      toggle.type = 'checkbox';
      toggle.addEventListener('change', () => stage.querySelectorAll('input[data-role="field"]').forEach((input) => {
        input.type = toggle.checked ? 'text' : 'password';
      }));
      u.el('span', '', check, 'Show password');
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('ds-header-note', 'ds-toast');
        decorateNote(_c.util, note, note.querySelector('.ref-note-text'));
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('nb-status');
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      const u = _c.util;
      u.el('span', 'nb-sp', foot);
      u.el('span', '', foot, 'Ln 1, Col 1');
      u.el('i', 'nb-sep2', foot);
      u.el('span', '', foot, 'UTF-8');
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.insertBefore(dock, _c.foot.querySelector('.nb-sp'));
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
      THEMES: { 'design-type-text-password-12': palette },
      LOW_THEME: palette,
      ACCENTS: ['#f77712'],
      LOW_ACCENTS: ['#f77712'],
      parts,
    },
  });
})();
