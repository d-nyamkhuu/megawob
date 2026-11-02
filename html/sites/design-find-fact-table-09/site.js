(function () {
  'use strict';
  const C = {
    'site': 'design-find-fact-table-09',
    'icons': 'Discs|Apps|Documents|Internet|Settings|Help',
    'menu': 'File|Edit|View|Record|Help',
  };
  const ICON = {
    Discs:
      '<svg viewBox="0 0 24 24" width="26" height="26"><path d="M3 3h15l3 3v15H3z" fill="#2c4f9a" stroke="#111"/><rect x="7" y="3" width="9" height="6" fill="#ddd" stroke="#111"/><rect x="6" y="13" width="12" height="8" fill="#eee" stroke="#111"/></svg>',
    Apps: '<svg viewBox="0 0 24 24" width="28" height="26"><path d="M2 6h8l2 2h10v12H2z" fill="#f0c040" stroke="#111"/></svg>',
    Documents:
      '<svg viewBox="0 0 24 24" width="24" height="26"><path d="M5 2h10l5 5v15H5z" fill="#fff" stroke="#111"/><path d="M8 11h9M8 14h9M8 17h9" stroke="#444"/></svg>',
    Internet:
      '<svg viewBox="0 0 24 24" width="26" height="26"><circle cx="12" cy="12" r="10" fill="#1d4fb0" stroke="#111"/><path d="M2 12h20M12 2c5 5 5 15 0 20M12 2c-5 5-5 15 0 20" stroke="#bcd" fill="none"/></svg>',
    Settings:
      '<svg viewBox="0 0 24 24" width="26" height="26"><path d="M4 20L14 10M14 4a5 5 0 1 1 6 6l-3-1-3-3z" fill="#bbb" stroke="#111" stroke-width="2"/></svg>',
    Help: '<svg viewBox="0 0 24 24" width="26" height="26"><rect x="2" y="2" width="20" height="20" fill="#fff"/><text x="12" y="19" font-size="20" font-weight="700" text-anchor="middle" fill="#222" font-family="Arial">?</text></svg>',
  };
  const DOC =
    '<svg viewBox="0 0 26 28" width="26" height="28"><g stroke="#161616" stroke-width="1"><path d="M3 3h16l4 4v18H3z" fill="#eee"/><path d="M7 2h14v20H7z" fill="#2449c4"/><path d="M10 5h6v17h-6z" fill="#6b9fff"/><path d="M14 1h6v21h-6z" fill="#ddd"/><path d="M18 6h5v14l3 5h-6l-2-6z" fill="#fff"/><path d="M5 7h3v14H5z" fill="#7db6ff"/><path d="M10 2h9M10 4h9" fill="none"/></g></svg>';
  ICON.Settings =
    '<svg viewBox="0 0 28 28" width="28" height="28"><path d="M18 2Q11 3 13 11L2 22Q0 26 5 26L17 14Q25 16 26 8L20 10L17 7L20 2Z" fill="#eee" stroke="#111" stroke-width="1.5"/><path d="M5 23L14 14" stroke="#888" stroke-width="1.5"/></svg>';
  ICON.Help =
    '<svg viewBox="0 0 24 26" width="26" height="28"><path d="M2 1h20v24H2z" fill="#f8f8ee"/><text x="12" y="23" font-size="27" font-weight="700" text-anchor="middle" fill="#ffed00" stroke="#111" stroke-width="1" font-family="Arial">?</text></svg>';
  const palette = { bg: '#81848b', panel: '#dcdcdc', fg: '#111', muted: '#333', line: '#777' };
  const styleNote = (_c, note) => {
    if (!note) return;
    note.classList.add('ds-instruction');
    note.style.fontSize = `clamp(13px, ${Math.min(1.9, 120 / Math.max(1, note.textContent.length))}vw, 32px)`;
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast' && _c.W < 1260) _c.display = 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      const br = u.el('span', 'ds-brand', top);
      const flower = u.el('i', 'ds-flower', br);
      flower.innerHTML =
        '<svg viewBox="0 0 40 40" width="38" height="38"><g stroke="#111" stroke-width="1.2"><path d="M18 17Q6 1 12 2Q22 0 22 15M22 17Q22 0 30 3Q35 8 26 20M25 20Q40 10 38 20L29 26M15 20Q0 9 2 20L12 26" fill="#75d728"/><path d="M17 19L8 12L5 21L13 26L8 34L18 32L21 39L26 31L35 33L30 24L35 17L25 17L21 10Z" fill="#f43355"/><path d="M11 24L2 28L10 33M28 27L34 37L36 28" fill="#487af6"/><path d="M17 18L24 18L28 24L23 29L16 27L13 22Z" fill="#fff22a"/><circle cx="21" cy="23" r="3" fill="#d22"/></g></svg>';
      u.el('b', '', br, 'RISC OS');
      C.icons.split('|').forEach((t) => {
        const it = u.el('span', 'ds-icon', top);
        const g = u.el('i', '', it);
        g.innerHTML = ICON[t];
        u.el('b', '', it, t);
      });
      u.el('span', 'ds-clock', top, 'Mon 12 Feb 1989   10:24');
      const desk = u.el('div', 'ds-desk', document.body);
      const win = u.el('div', 'ds-win', desk);
      const tb = u.el('div', 'ds-titlebar', win);
      const ti = u.el('i', '', tb);
      ti.innerHTML = DOC;
      u.el('b', '', tb, 'Staff Records');
      u.el('span', 'ds-close', tb, '✕');
      const header = u.el('aside', `ds-header-note ds-note-${_c.display}`);
      if (_c.display === 'header') u.el('div', 'ds-legend', header, 'Find Information');
      Object.assign(_c, { desk, win, header });
    },
    'frame.nav': () => (_c) => {
      const menu = _c.util.el('nav', 'ds-menu', _c.win);
      C.menu.split('|').forEach((t) => _c.util.el('span', '', menu, t));
      _c.menu = menu;
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      styleNote(_c, _c.header.querySelector('.ref-instruction'));
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = h;
      _c.headerTools.classList.add('ds-menu-tools');
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ds-body', _c.win);
      const content = u.el('div', 'ds-content', body);
      const main = u.el('div', 'ds-main' + (_c.display === 'hidden' ? ' ds-hidden' : ''), content);
      Object.assign(_c, { body, main });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const title = _c.header.querySelector('.ref-panel-title');
      if (title) {
        title.classList.add('ds-legend');
        title.textContent = 'Find Information';
      }
      styleNote(_c, _c.header.querySelector('.ref-panel-text'));
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
      if (_c.display === 'header' || _c.display === 'panel') _c.main.appendChild(_c.header);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-header-note', 'ds-note-toast');
        const legend = _c.util.el('div', 'ds-legend', note, 'Find Information');
        note.prepend(legend);
        styleNote(_c, note.querySelector('.ref-note-text'));
        _c.desk.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      foot.querySelector('.ref-foot-text').remove();
      _c.main.appendChild(foot);
      // Keep the original button area for footer endings; utility buttons belong in the menu.
      foot.querySelectorAll('.ref-xtra').forEach((b) => _c.headerTools.appendChild(b));
      const clear = u.el('button', 'ds-clear', foot, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => {
        _c.stage.querySelectorAll('input[data-role="field"]').forEach((inp) => {
          inp.value = '';
          inp.dispatchEvent(new Event('input', { bubbles: true }));
        });
      });
      const pv = u.el('div', 'ds-preview', _c.desk);
      const pt = u.el('div', 'ds-titlebar', pv);
      const pi = u.el('i', '', pt);
      pi.innerHTML = DOC;
      u.el('b', '', pt, 'Preview');
      u.el('span', 'ds-close', pt, '✕');
      const pb = u.el('div', 'ds-pvbody', pv);
      u.el('i', 'ds-pvdoc', pb);
      u.el('div', '', pb, 'No record selected');
      const wb = u.el('div', 'ds-waste', _c.desk);
      u.el('i', '', wb);
      u.el('div', '', wb, 'Wastebasket');
      const task = u.el('footer', 'ds-taskbar', document.body);
      const tk = u.el('span', '', task);
      u.el('i', '', tk);
      u.el('b', '', tk, 'Staff Records');
      if (_c.placement === 'link') {
        const linkTools = u.el('span', 'ds-task-tools', task);
        linkTools.appendChild(foot.querySelector('.ref-endlink'));
      }
      Object.assign(_c, { foot, task });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.task.appendChild(dock);
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
      THEMES: { 'design-find-fact-table-09': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2060d0'],
      LOW_ACCENTS: ['#2060d0'],
      parts,
    },
  });
})();
