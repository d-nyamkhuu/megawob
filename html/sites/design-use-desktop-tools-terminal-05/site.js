// RISC OS desktop chrome on the shared site frame.
(function () {
  'use strict';
  const icons = {
    brand: `<path d="M21 23C9 19 5 31 8 43s16 11 22-1c5-12 1-18-9-19z" fill="#e52b39" stroke="#632329"/><path d="M25 24c5-12 19-10 18 3l-3 18-7-6-4-10z" fill="#25ad42" stroke="#267027"/><path d="M22 24l-8-6 9 1-3-9 7 7 7-7-1 10 10-2-11 9z" fill="#20a233" stroke="#276d22"/><path d="M26 17l-4-8 4-5 4 7-1 7" fill="#f5d531" stroke="#778a27"/><path d="M11 33l3-3m4 1 2-3m-8 12 3-3m5 1 3-3m-9 12 3-3m6 0 2-3" stroke="#ffca9b" stroke-width="2"/><path d="M10 48l6 3m-5-24 4-3" stroke="#fff"/>`,
    Apps: `<path d="M9 27h18v18H9zM28 9h18v18H28z" fill="#eee" stroke="#333" stroke-width="2"/><path d="M11 29h14v14H11zM30 11h14v14H30z" fill="#43b354"/><path d="M12 41l12-11m7-6 11-12" stroke="#cf2927" stroke-width="4"/><path d="M19 32l16-16" stroke="#eee63b" stroke-width="3"/>`,
    Files: `<path d="M9 9h18l5 5h9v27H9z" fill="#aec3f4" stroke="#293344" stroke-width="2"/><path d="M13 6h17v9H13z" fill="#f9fcff" stroke="#394258"/><path d="M14 17h29v29H14z" fill="#eee" stroke="#293344" stroke-width="2"/><path d="M16 19h25v24H16z" fill="#d3d9e4"/><path d="M16 20h24" stroke="#fff" stroke-width="3"/>`,
    Terminal: `<path d="M5 7h44v38H5z" fill="#e8e8e8" stroke="#242424" stroke-width="2"/><path d="M9 11h36v29H9z" fill="#262a2b" stroke="#777" stroke-width="2"/><path d="M12 14h5v5h-5z" fill="#77bd4b"/><path d="M14 16l3 3m3 0h4" stroke="#c7d7ff"/><path d="M12 42h31" stroke="#fff"/>`,
    TextEd: `<path d="M10 12h29v33H10z" fill="#fafafa" stroke="#333" stroke-width="2"/><path d="M14 17h21m-21 5h21m-21 5h17m-17 5h21m-21 5h17" stroke="#8b8b8b"/><path d="M13 40l5-11 22-24 5 5-23 25z" fill="#e4b83e" stroke="#333"/><path d="M18 29l4 5M39 6l5 5" stroke="#4679b2" stroke-width="4"/><path d="M13 40l3-7 4 4z" fill="#333"/>`,
    Draw: `<path d="M25 7L8 42l32-7z" fill="#e2d274" stroke="#323c37" stroke-width="2"/><path d="M25 17l-9 19 18-4z" fill="#b9cdbb" stroke="#466355"/><path d="M11 38L38 9" stroke="#447ead" stroke-width="4"/><path d="M12 36L44 45" stroke="#d33028" stroke-width="3"/><path d="M15 22l27 16" stroke="#39a43a" stroke-width="3"/><path d="M8 42l5-2M39 35l-1-5" stroke="#333" stroke-width="2"/>`,
    Calc: `<path d="M11 7h29v40H11z" fill="#ddd" stroke="#333" stroke-width="2"/><path d="M15 10h21v10H15z" fill="#92c0d4" stroke="#666"/><path d="M16 14h17" stroke="#e8f9fa"/><path d="M15 25h5m3 0h5m3 0h5m-21 6h5m3 0h5m3 0h5m-21 6h5m3 0h5m3 0h5m-21 6h5m3 0h5m3 0h5" stroke="#414a5a" stroke-width="3"/>`,
    document: `<path d="M7 4h37v42l-8 9H7z" fill="#eee" stroke="#333" stroke-width="2"/><path d="M11 8h29v10H11z" fill="#5598bb" stroke="#555"/><path d="M13 10h10v5H13z" fill="#80dc73"/><path d="M26 11h11" stroke="#ddd" stroke-width="2"/><path d="M11 23h6m4 0h17m-27 5h13m4 0h10m-27 5h6m4 0h17m-27 5h13m4 0h10m-27 5h6m4 0h12m-22 5h13" stroke="#344150" stroke-width="2"/><path d="M36 46h8l-8 9z" fill="#8bacc7" stroke="#333"/>`,
  };
  const icon = (el, name) => {
    el.innerHTML = `<svg viewBox="0 0 54 58" aria-hidden="true">${icons[name]}</svg>`;
  };
  // The template owns the instruction contents and controls; the palette supplies their native chrome.
  function paletteNote(_c, node) {
    node.classList.add('task-note');
    node.dataset.role = 'instruction';
    _c.header.insertBefore(node, _c.headerTools || null);
  }

  const theme = { bg: '#aaa', panel: '#d4d4d4', fg: '#111', muted: '#555', line: '#777' };
  const parts = {
    'frame.layout': () => (_c) => {
      const W = window.innerWidth, H = window.innerHeight;
      const display = _c.ctx.display;
      document.body.className = 'instruction-' + display;
      Object.assign(_c, { W, H, display, roomy: W >= 1260, tall: H >= 700 });
    },
    'frame.header': () => (_c) => {
      const { util } = _c;
      const shell = util.el('div', 'site-shell', document.body);
      const palette = util.el('section', 'palette', shell);
      const title = util.el('div', 'pal-title', palette, 'Task');
      util.el('i', '', title, '✕');
      const header = util.el('header', 'pal-body', palette);
      const documentIcon = util.el('div', 'pal-icon', header);
      icon(documentIcon, 'document');
      Object.assign(_c, { shell, palette, header, documentIcon });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) paletteNote(_c, note);
    },
    'frame.body': () => (_c) => { _c.body = _c.shell; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) paletteNote(_c, note);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.shell);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (note) {
        paletteNote(_c, note);
        _c.palette.querySelector('.pal-title i').replaceWith(note.querySelector('.ref-note-x'));
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      // Keep template footer actions in the floating task window, above the desktop icon bar.
      const foot = document.querySelector('.ref-foot');
      if (foot) _c.header.appendChild(foot);
      const { shell, util } = _c;
      const bar = util.el('footer', 'iconbar', shell);
      const brand = util.el('div', 'ib-brand', bar);
      icon(util.el('i', '', brand), 'brand');
      util.el('span', '', brand, 'RISC OS');
      for (const name of ['Apps', 'Files', 'Terminal', 'TextEd', 'Draw', 'Calc']) {
        const item = util.el('div', 'ib-item' + (name === 'Terminal' ? ' on' : ''), bar);
        icon(util.el('i', '', item), name);
        util.el('span', '', item, name);
      }
      util.el('div', 'ib-clock', bar, 'Tue 12 Aug 1989  14:28');
    },
    'frame.end': (base) => (_c) => {
      const { ctx, display, documentIcon, header, palette, shell, submit } = _c;
      // Retain existing CSS hooks while the template owns the end control and inert buttons.
      if (submit) submit.classList.add('end-control');
      for (const decoy of header.querySelectorAll('.ref-xtra')) decoy.classList.add('palette-xtra');
      if (display === 'hidden') {
        documentIcon.hidden = true;
        if (!header.querySelector('button, a[data-role="submit"]')) palette.hidden = true;
      }
      if (display === 'panel' || display === 'toast') {
        const h = shell.clientHeight, ph = palette.offsetHeight;
        const top = display === 'panel' ? h * 0.24 : h * 0.79 - ph;
        if (top >= h * 0.045 && top + ph < h * 0.83) palette.style.top = top + 'px';
      }
      return base(_c);
    },
    overlay: () => function (ctx) {
      const u = ctx.util;
      const named = ['Desktop notice', 'The terminal workspace is ready. You can continue working.', 'Close'];
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
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', title);
      u.el('h2', '', el, title);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      if (ctx.kind === 'cookie') {
        const accept = u.el('button', '', actions, 'Accept all');
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
    name: 'design-use-desktop-tools-terminal-05',
    template: 'site/base',
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    langs: ['en'],
    design: {
      THEMES: { risc: theme }, LOW_THEME: theme, ACCENTS: ['#555'], LOW_ACCENTS: ['#555'],
      parts,
    },
  });
})();
