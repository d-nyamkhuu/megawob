(function () {
  'use strict';
  const C = {
    'site': 'design-type-text-multi-07',
    'instruction': 'top',
    'menu': 'File|Edit|Record|Format|Specials|Window|Help',
    'clock': 'Mon Apr 22   10:24 AM',
    'winTitle': 'New Contact',
    'rail': 'Contacts|Notes|Calendar|Files|Prefs',
  };
  const ICONS = {
    Contacts:
      '<svg viewBox="0 0 40 44"><path d="M7 3h19l8 8v30H7z M26 3v8h8" fill="#f6f2e4" stroke="#111" stroke-width="2.4"/></svg>',
    Notes:
      '<svg viewBox="0 0 40 44"><path d="M8 5h25v15H8z M6 11h29v12H6z M4 20h32v20H4z" fill="#f1eddf" stroke="#111" stroke-width="2.2"/><path d="M10 9h20 M10 15h20 M16 25h9 M17 34h8" stroke="#111" stroke-width="2"/></svg>',
    Calendar:
      '<svg viewBox="0 0 40 44"><path d="M5 6h30v32H5z M5 14h30" fill="#f6f2e4" stroke="#111" stroke-width="2.4"/><path d="M10 19h4v4h-4z M18 19h4v4h-4z M26 19h4v4h-4z M10 26h4v4h-4z M18 26h4v4h-4z M26 26h4v4h-4z M10 32h4v3h-4z M18 32h4v3h-4z M26 32h4v3h-4z" fill="none" stroke="#111" stroke-width="1.6"/></svg>',
    Files:
      '<svg viewBox="0 0 40 44"><path d="M3 10h13l3 4h18v24H3z M19 18h18" fill="#f1eddf" stroke="#111" stroke-width="2.4"/></svg>',
    Prefs:
      '<svg viewBox="0 0 40 44"><path d="M17 4h6l1 5 4 2 4-2 4 5-3 4 1 4 4 2-2 6-5-1-3 3v5h-6l-2-4-4-1-4 3-4-5 2-4-1-4-5-2 2-6 5 1 3-3z" fill="#f1eddf" stroke="#111" stroke-width="2.2"/><circle cx="20" cy="22" r="6" fill="none" stroke="#111" stroke-width="2.2"/></svg>',
  };
  const DOC =
    '<svg viewBox="0 0 40 44"><path d="M7 3h19l8 8v30H7z M26 3v8h8 M12 15h17 M12 20h17 M12 25h17 M12 29h17" fill="none" stroke="#111" stroke-width="1.4"/></svg>';
  const palette = { bg: '#ede8d8', panel: '#f1ecdc', fg: '#111', muted: '#444', line: '#111' };
  const addDoc = (u, parent) => {
    const icon = u.el('span', 'ds-bicon', parent);
    icon.innerHTML = DOC;
    return icon;
  };
  const styleControls = (parent, top) => {
    parent.querySelectorAll('.ref-submit, .ref-xtra').forEach((b) => {
      b.classList.add('ds-btn');
      if (b.classList.contains('ref-xtra')) b.classList.add('ds-xtra');
      else b.classList.add(top ? 'ds-top-submit' : 'ds-submit');
    });
    parent.querySelectorAll('.ref-endlink').forEach((b) => b.classList.add('ds-endlink'));
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const top = u.el('header', 'ds-top', document.body);
      const apple = u.el('span', 'ds-apple', top);
      apple.innerHTML = '<svg viewBox="0 0 24 28" width="22" height="26"><path d="M12 8c-3-3-9-1-9 6 0 6 4 12 7 12 1 0 1.500-.600 2-.600s1 .600 2 .600c3 0 7-5 7-9-4-2-4-7 0-9-2-3-6-3-9 0z M13 6c0-3 2-5 4-5 0 3-1 5-4 5z" fill="#111"/></svg>';
      C.menu.split('|').forEach((t) => u.el('span', 'ds-mi', top, t));
      u.el('span', 'ds-clock', top, C.clock);
      const ci = u.el('span', 'ds-cicon', top);
      ci.innerHTML = '<svg viewBox="0 0 28 28" width="26" height="26"><path d="M3 2h22v25H3z M10 5l1 4 M19 5l-1 4 M14 8l-1 5h4 M8 15q6 7 13-1 M8 23h11" fill="none" stroke="#111" stroke-width="2"/></svg>';
      const shell = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', shell);
      C.rail.split('|').forEach((t) => {
        const it = u.el('div', 'ds-ritem', rail);
        const ic = u.el('span', 'ds-ricon', it);
        ic.innerHTML = ICONS[t];
        u.el('span', '', it, t);
      });
      const content = u.el('div', 'ds-content', shell);
      const bar = u.el('div', 'ds-titlebar', content);
      const ti = u.el('span', 'ds-ticon', bar);
      ti.innerHTML = DOC;
      u.el('span', 'ds-ttl', bar, C.winTitle);
      const titleTools = u.el('span', 'ds-title-tools', bar);
      const wc = u.el('span', 'ds-wctl', bar);
      ['−', '□', '×'].forEach((t) => u.el('i', '', wc, t));
      const header = u.el('div', '', content);
      if (_c.display === 'header') {
        header.className = 'ds-header-note';
        addDoc(u, header);
      } else header.hidden = true;
      Object.assign(_c, { shell, content, header, titleTools });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.titleTools;
      base(_c);
      _c.header = header;
      styleControls(_c.headerTools, true);
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-title').textContent = 'Instructions';
        const icon = addDoc(_c.util, panel);
        panel.insertBefore(icon, panel.querySelector('.ref-panel-text'));
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        const icon = addDoc(_c.util, note);
        note.insertBefore(icon, note.firstChild);
        _c.content.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.content.appendChild(foot);
      foot.querySelector('.ref-foot-text').remove();
      styleControls(foot, false);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.foot.classList.add('ds-footer-floating');
        _c.foot.appendChild(dock);
        styleControls(dock, false);
      }
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
      THEMES: { 'design-type-text-multi-07': palette },
      LOW_THEME: palette,
      ACCENTS: ['#111'],
      LOW_ACCENTS: ['#111'],
      parts,
    },
  });
})();
