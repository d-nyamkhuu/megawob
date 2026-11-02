(function () {
  'use strict';
  const C = {
    site: 'design-find-fact-table-04',
    menu: 'Desk|File|Edit|Window|Options',
    title: 'Staff Information Lookup',
  };
  const ICONS = [
    '<svg viewBox="0 0 40 48"><path d="M4 2h23l10 11v33H4z" fill="#fff" stroke="#000" stroke-width="3"/><path d="M27 2v12h10M10 20h20M10 26h20M10 32h20M10 38h20" fill="none" stroke="#000" stroke-width="2.5"/></svg>',
    '<svg viewBox="0 0 40 40"><circle cx="16" cy="16" r="13" fill="#fff" stroke="#000" stroke-width="3"/><path d="M25 25l13 13" stroke="#000" stroke-width="4"/></svg>',
    '<svg viewBox="0 0 40 40"><rect x="3" y="5" width="34" height="30" fill="#fff" stroke="#000" stroke-width="3"/><path d="M3 11h34M3 19h34M3 27h34M14 11v24M26 11v24" stroke="#000" stroke-width="1.8"/></svg>',
    '<svg viewBox="0 0 40 40"><path d="M11 16V2h15l6 6v8z" fill="#fff" stroke="#000" stroke-width="2.5"/><path d="M25 2v7h7M16 6v7" fill="none" stroke="#000" stroke-width="2"/><path d="M6 15h29l3 5v13H2V20z" fill="#fff" stroke="#000" stroke-width="3"/><rect x="8" y="26" width="24" height="12" fill="#fff" stroke="#000" stroke-width="3"/><path d="M11 21h4M29 21h3M12 31h16" stroke="#000" stroke-width="2"/></svg>',
  ];
  const palette = { bg: '#1b7038', panel: '#e8e8e8', fg: '#000000', muted: '#222222', line: '#000000' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
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
      const bar = u.el('header', 'ga-menu', document.body);
      const logo = u.el('span', 'ga-logo', bar);
      logo.innerHTML =
        '<svg viewBox="0 0 36 36"><path d="M17 2v29M12 2v15q0 12-10 12M22 2v15q0 12 10 12" fill="none" stroke="#000" stroke-width="4"/><path d="M0 35h36" stroke="#000" stroke-width="2"/></svg>';
      C.menu.split('|').forEach((t) => u.el('span', 'ga-mi', bar, t));
      u.el('span', 'ga-sp', bar);
      const menuTools = u.el('div', 'ga-menu-tools', bar);
      u.el('span', 'ga-clock', bar, 'Mon 27 Jan 2025');
      u.el('span', 'ga-clock ga-time', bar, '10:14');
      const desk = u.el('div', 'ga-desk', document.body);
      const note = u.el('aside', 'ga-note ga-note--' + _c.display, desk);
      note.hidden = _c.display === 'hidden';
      const trash = u.el('div', 'ga-trash', desk);
      trash.innerHTML =
        '<svg viewBox="0 0 48 64"><path d="M8 15v40q16 10 32 0V15" fill="#fff" stroke="#000" stroke-width="3"/><ellipse cx="24" cy="13" rx="22" ry="6" fill="#fff" stroke="#000" stroke-width="3"/><path d="M14 13V6l10-4 10 4v7M18 7h12M15 23v30M23 23v34M32 23v30" fill="none" stroke="#000" stroke-width="3"/><path d="M5 8v10M43 8v10" stroke="#000" stroke-width="3"/></svg>';
      u.el('span', '', trash, 'TRASH');
      const win = u.el('section', 'ga-win', desk);
      const tb = u.el('div', 'ga-title', win);
      u.el('i', 'ga-gadget', tb).innerHTML = '<b></b>';
      u.el('span', 'ga-ttext', tb, C.title);
      u.el('i', 'ga-gadget ga-g2', tb).innerHTML =
        '<svg viewBox="0 0 32 32"><rect x="5" y="4" width="22" height="24" fill="white" stroke="black" stroke-width="2"/><path d="M8 9h16M8 14h16M8 19h16M8 24h16M16 9v15" stroke="black" stroke-width="2"/></svg>';
      u.el('i', 'ga-gadget ga-g3', tb).innerHTML =
        '<svg viewBox="0 0 32 32"><rect x="5" y="8" width="22" height="19" fill="black"/><path d="M11 20v-6h9v8h-9z" fill="white"/><path d="M15 17h5v5h-5z" fill="black"/></svg>';
      const wb = u.el('div', 'ga-wbody', win);
      const tools = u.el('div', 'ga-tools', wb);
      ICONS.forEach((s) => { u.el('div', 'ga-tool', tools).innerHTML = s; });
      const hatch = u.el('div', 'ga-hatch', win);
      Object.assign(_c, { desk, note, win, wb, hatch, menuTools, header: note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const text = _c.note.querySelector('.ref-instruction');
      if (text) text.classList.add('ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.wb;
      base(_c);
      _c.header = header;
      for (const button of _c.headerTools.querySelectorAll('.ref-xtra')) _c.menuTools.appendChild(button);
      if (_c.submit) _c.submit.classList.add('ga-submit');
      if (_c.placement === 'icon') _c.menuTools.appendChild(_c.submit);
    },
    'frame.body': () => (_c) => { _c.body = _c.desk; },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.note });
      const panel = _c.note.querySelector('.ref-panel');
      if (panel) {
        panel.querySelector('.ref-panel-title').textContent = 'Task note';
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage ga-stage', _c.wb);
      _c.wb.insertBefore(_c.stage, _c.wb.firstChild);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        _c.util.el('div', 'ga-note-title', note, 'Desk message');
        note.insertBefore(note.lastChild, note.firstChild);
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.note.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.hatch.appendChild(foot);
      if (_c.placement === 'footer' || _c.placement === 'link') _c.hatch.classList.add('ga-hatch--end');
      for (const button of foot.querySelectorAll('.ref-xtra')) _c.menuTools.appendChild(button);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.hatch.classList.add('ga-hatch--end');
        _c.desk.appendChild(dock);
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
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#000000'],
      LOW_ACCENTS: ['#000000'],
      parts,
    },
  });
})();
