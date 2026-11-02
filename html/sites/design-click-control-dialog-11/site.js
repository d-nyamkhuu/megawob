(function () {
  'use strict';
  const cfg = {
    'title': 'Documents - File Browser',
    'menus': ['File', 'Edit', 'View', 'Go', 'Bookmarks', 'Help'],
    'status': '“Report.txt” selected (482 bytes)',
  };
  const FOLDER =
    '<svg viewBox="0 0 42 38"><defs><linearGradient id="chrome-folder" x2=".7" y2="1"><stop stop-color="#fff5ce"/><stop offset=".45" stop-color="#f2cd79"/><stop offset="1" stop-color="#cb923f"/></linearGradient></defs><path d="M3 9V5q0-3 3-3h11l4 5h16v25H3z" fill="#f9e7bc" stroke="#85602c"/><path d="M3 12h36l-3 22H3z" fill="url(#chrome-folder)" stroke="#866330" stroke-width="1.3"/><path d="M5 14h31" stroke="#fff7dc" stroke-width="2"/><ellipse cx="31" cy="25" rx="4" ry="7" transform="rotate(-24 31 25)" fill="#a2afad" stroke="#5c6969"/><path d="m30 20 3 10" stroke="#edf1e9" stroke-width="1.7"/></svg>';
  const palette = { bg: '#f9f8f5', panel: '#eeeae2', fg: '#171714', muted: '#66625b', line: '#b9ac9c' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'gnome', 'mode-' + _c.display);
      const shell = u.el('main', 'shell', document.body);
      const top = u.el('header', 'topbar', shell);
      u.el('span', 'logo', top).innerHTML = FOLDER;
      if (_c.display !== 'header') {
        top.classList.add('compact');
        u.el('span', 'app-caption', top, 'File Browser');
      }
      const toastRow = _c.display === 'toast' ? u.el('div', 'instruction-toast-row', shell) : null;
      const win = u.el('section', 'win', shell);
      const tb = u.el('div', 'wtitle', win);
      u.el('span', 'wicon', tb).innerHTML = FOLDER;
      u.el('span', 'wcap', tb, cfg.title);
      u.el('span', 'wctl', tb).innerHTML =
        '<i><b class="mn"></b></i><i><b class="mx"></b></i><i class="cl"><svg viewBox="0 0 16 16"><path d="m4 4 8 8M12 4 4 12"/></svg></i>';
      const menu = u.el('div', 'menubar', win);
      cfg.menus.forEach((l) => {
        const m = u.el('span', '', menu);
        u.el('u', '', m, l[0]);
        u.el('span', '', m, l.slice(1));
      });
      Object.assign(_c, { shell, win, menu, toastRow, header: top });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      if (_c.display !== 'header') _c.header = _c.menu;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'workspace', _c.win);
      // Reserve the stage first so the instruction panel stays on its original right side.
      _c.stage = _c.util.el('div', 'stage', _c.body);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('instruction-panel');
        panel.dataset.display = _c.display;
      }
    },
    'frame.stage': () => () => {},
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.toastRow) {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('instruction-toast');
        note.dataset.display = _c.display;
        _c.toastRow.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('statusbar');
      foot.querySelector('.ref-foot-text').textContent = cfg.status;
      _c.win.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => function (ctx) {
      const u = ctx.util;
      const el = u.el('section', 'perturb ' + ctx.kind, document.body);
      const hd = u.el('div', 'nl-h', el);
      const ic = u.el('span', 'nl-ic', hd);
      ic.innerHTML =
        '<svg viewBox="0 0 48 52"><defs><linearGradient id="newsletter-mail" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#d2d4d4"/></linearGradient></defs><path d="m3 18 21-16 21 16v31H3z" fill="#e7edf0" stroke="#62686d" stroke-width="1.6"/><path d="M8 16V9h32v29H8z" fill="#fdfdfe" stroke="#727d87" stroke-width="1.3"/><path d="M12 15h24M12 20h24M12 25h24" stroke="#8da5b8" stroke-width="2.5"/><path d="m3 18 21 17 21-17v31H3z" fill="url(#newsletter-mail)" stroke="#62686d" stroke-width="1.6"/><path d="m4 47 15-16m25 16L29 31" stroke="#aeb3b4" fill="none"/><path d="m6 46 13-13m24 13L29 33" stroke="#fff" fill="none"/></svg>';
      const tx = u.el('div', 'nl-t', hd);
      u.el(
        'strong',
        '',
        tx,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'Get Our Newsletter',
          banner: 'Service notice',
        }[ctx.kind],
      );
      u.el(
        'p',
        '',
        tx,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Tips, news and updates, once a week.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = u.el('button', 'dismiss', hd, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      const ft = u.el('div', 'nl-f', el);
      const en = u.el('span', 'nl-env', ft);
      en.innerHTML =
        '<svg viewBox="0 0 64 52"><rect x="3" y="7" width="58" height="38" rx="1" fill="#fffcf3" stroke="#ecb13c" stroke-width="2.5"/><path d="m4 9 24 22q4 3 8 0L60 9" fill="none" stroke="#ecb13c" stroke-width="2.4"/><path d="m5 43 16-15m38 15L44 28" fill="none" stroke="#f9e8bd" stroke-width="1.5"/></svg>';
      const ft2 = u.el('div', 'nl-ft', ft);
      u.el('strong', '', ft2, 'Stay in the loop!');
      u.el('i', '', ft2);
      u.el('i', 's', ft2);
      const lf = u.el('span', 'nl-leaf', ft);
      lf.innerHTML =
        '<svg viewBox="0 0 76 82"><path d="M30 78C4 72-4 50 3 40c17-4 29 13 27 38z" fill="#c9bf9b"/><path d="M38 79C25 51 36 10 61 6c17-2 17 45-23 73z" fill="#cfc5a1"/><path d="M38 79C33 61 35 48 40 40l25 7C60 62 51 74 38 79z" fill="#efd681"/><path d="m38 79 17-45" stroke="#fff1ba" stroke-width="2" fill="none"/></svg>';
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-click-control-dialog-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'promo' },
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#d2631c'], LOW_ACCENTS: ['#d2631c'], parts,
    },
  });
})();
