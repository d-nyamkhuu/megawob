/* OS/2 Workplace Shell: Display Properties notebook window beside a Preview window, desktop icons, taskbar. */
(function () {
  'use strict';
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('aside', 'os2-dialog overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const title = {
      chat: 'System Message',
      cookie: 'Privacy',
      toast: 'System Notice',
      promo: 'Workplace Shell',
      banner: 'System Notice',
    }[ctx.kind];
    const bar = u.el('div', 'os2-dialog-bar', el);
    u.el('span', '', bar, title);
    const x = u.el('button', 'survey-x', bar, '×');
    x.type = 'button';
    x.setAttribute('aria-label', 'Close notice');
    x.onclick = () => ctx.dismiss('close');
    const body = u.el('div', 'os2-dialog-body', el);
    u.el(
      'p',
      '',
      body,
      {
        chat: 'Please rate this session.',
        cookie: 'This system can remember your display preferences.',
        toast: 'The settings are ready for editing.',
        promo: 'Discover more of the Workplace Shell.',
        banner: 'Display settings are available offline.',
      }[ctx.kind],
    );
    const dismiss = u.el('button', 'os2-btn survey-close', body, ctx.kind === 'cookie' ? 'Reject optional' : 'Dismiss');
    dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('dismiss');
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  function icon(parent, u, kind, cls) {
    const s = u.el('span', 'ico ico-' + kind + (cls ? ' ' + cls : ''), parent);
    const monitor =
      '<path d="M7 7h39v29H7z" fill="#dedede"/><path d="M11 11h31v21H11z" fill="#007bcc"/><path d="M13 13h27v17H13z" fill="#215b9b" stroke="#eee"/><path d="M22 36v7l-9 3v3h29v-3l-9-3v-7M9 38l4 3h6" fill="#ddd"/>';
    const window =
      '<path d="M7 6h39v36H7z" fill="#eee"/><path d="M8 8h37v8H8z" fill="#1748a9"/><path d="M14 20h35v32H14z" fill="#d9d9d9"/><path d="M15 21h33v7H15z" fill="#008fc2"/>';
    const shapes = {
      mon: monitor,
      win: window,
      folder:
        '<path d="M9 10V5h11l3 3 20-2v26L9 36z" fill="#eee"/><path d="M12 15l8-2 3 3 16-3v25L12 43z" fill="#fff"/><path d="M4 31l15-3 7-7 25-3-3 28L4 53z" fill="#ddd"/><path d="M8 28v-8l8-2M10 7l6-2M26 12h9M30 25l9-2" fill="none"/>',
      prog: '<path d="M19 5h31v34H19z" fill="#eee"/><path d="M12 16h32v34H12z" fill="#ddd"/><path d="M4 28h34v27H4z" fill="#eee"/><path d="M7 31h28v5H7z" fill="#aaa"/><path d="M23 9h23M16 20h24M10 41h4m6 0h9M9 48h7m9 0h6" fill="none"/>',
      conn: '<path d="M20 14v28M11 25h33M29 25v23" fill="none" stroke-width="4"/><path d="M5 4h24v17H5zM29 42h24v17H29z" fill="#1139dd"/><path d="M8 7h17l-13 9zM32 45h17l-13 9z" fill="#fff" stroke="none"/><path d="M31 21h20v15H31zM4 42h18v13H4z" fill="#ddd"/><path d="M37 37v6m-6 0h16M10 56v3" fill="none"/>',
      help: '<path d="M29 3C12 3 3 15 4 28c0 10 6 17 14 21l5 5h9l4-8c10-4 15-10 15-21C51 12 42 3 29 3z" fill="#ddd"/><path d="M28 8C15 8 9 17 9 27s7 17 17 18c12 0 20-9 20-19S39 8 28 8z" fill="#0027a6" stroke="#fff"/><path d="M20 21c0-12 19-11 19-1 0 7-10 8-10 14m0 4v3" stroke="#fff" stroke-width="5" fill="none"/><circle cx="28" cy="55" r="5" fill="#1756ce"/>',
      shred:
        '<path d="M7 20l24-9 22 11v29L32 61 7 48z" fill="#ddd"/><path d="M7 20l25 12 21-10M32 32v29M38 33v23M44 30v24M49 27v25" fill="none"/><path d="M13 23V9l8-5 17 7v17l-8 3z" fill="#eee"/><path d="M16 9l14 7v13M21 4v17M24 6v17" fill="none"/>',
      'eff-shadow': '<path d="M6 6h39v40H6z" fill="#d0d0d0"/><path d="M18 18h36v37H18z" fill="#b5b5b5"/>',
      'eff-fade':
        '<path d="M9 8h41v43H9z" fill="#bbb"/><path d="M12 11h35v16H12z" fill="#ddd" stroke="none"/><path d="M12 29h18v19H12z" fill="#333" stroke="none"/><path d="M31 29h16v19H31z" fill="#999" stroke="none"/>',
      'eff-opacity': window,
      'eff-anim': '<path d="M7 7h38v40H7zM18 19h36v38H18z" fill="#ddd" stroke-dasharray="6 3"/>',
      cube: '<path d="M8 14l20-10 23 11v30L30 58 8 44z" fill="#eee"/><path d="M8 14l22 11 21-10M30 25v33" fill="none"/><path d="M16 21l8 4v9l-8-4zM35 31l9-5v10l-9 5z" fill="#777"/><path d="M20 12l8-4 8 4-8 4zM16 38l7 4m15 3 6-4" fill="#999"/>',
      phone:
        '<path d="M12 5l10 10-5 8c3 9 10 15 17 17l7-6 11 10-5 10C25 56 2 32 5 13z" fill="#ddd"/><path d="M13 9l5 7M42 38l7 7M28 4l8 5-3 7m7-10 9 7-4 8" fill="none"/>',
    };
    if (shapes[kind])
      s.innerHTML =
        '<svg viewBox="0 0 62 64" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><g stroke="#171717" stroke-width="2.2" stroke-linejoin="miter">' +
        shapes[kind] +
        '</g></svg>';
    return s;
  }
  function titlebar(parent, u, text, buttons, cls) {
    const bar = u.el('div', 'tbar ' + (cls || ''), parent);
    icon(bar, u, 'mon');
    u.el('span', 'tbar-title', bar, text);
    const b = u.el('span', 'tbar-btns', bar);
    for (const g of buttons) u.el('span', 'tbtn tbtn-' + g, b);
    return bar;
  }
  function fitNote(note, text) {
    if (!note || !text) return;
    const ns = getComputedStyle(note);
    const room = note.clientHeight - parseFloat(ns.paddingTop) - parseFloat(ns.paddingBottom);
    let font = parseFloat(getComputedStyle(text).fontSize);
    while (text.scrollHeight > room && font > 10) {
      font *= 0.95;
      text.style.fontSize = font + 'px';
    }
  }
  const palette = { bg: '#c8c8c8', panel: '#d4d4d4', fg: '#111111', muted: '#222222', line: '#6e6e6e' };
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
      const u = _c.util;
      document.body.className = `os2 instruction-${_c.display}`;
      const desk = u.el('div', 'desk-icons', document.body);
      for (const [k, l] of [
        ['folder', 'Workplace\nShell'], ['prog', 'Programs'], ['conn', 'Connections'],
        ['help', 'Assistance\nCenter'], ['shred', 'Shredder'],
      ]) {
        const it = u.el('div', 'desk-icon', desk);
        icon(it, u, k);
        u.el('span', '', it, l);
      }
      const win = u.el('div', 'win main-win', document.body);
      titlebar(win, u, 'Display Properties - OS/2 Workplace Shell', ['min', 'close']);
      const tabs = u.el('div', 'tabs', win);
      ['Background', 'Colors', 'Screen Saver', 'Appearance', 'Effects'].forEach((t) =>
        u.el('span', 'tab' + (t === 'Effects' ? ' on' : ''), tabs, t));
      u.el('div', 'page', win);
      Object.assign(_c, { win, header: win });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.win.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('task-note');
        const text = _c.util.el('div', 'instruction', note);
        text.textContent = note.firstChild.textContent;
        note.firstChild.remove();
        fitNote(note, text);
      }
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.headerTools.classList.add('notebook-tools');
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const eff = u.el('div', 'grp effects', _c.win);
      u.el('span', 'legend', eff, 'Window Effects');
      const list = u.el('div', 'eff-list', eff);
      [['shadow', 'Shadow'], ['fade', 'Fade'], ['opacity', 'Opacity'], ['anim', 'Animation']].forEach(([k, l]) => {
        const r = u.el('div', 'eff-row' + (k === 'opacity' ? ' sel' : ''), list);
        icon(r, u, 'eff-' + k);
        u.el('span', '', r, l);
      });
      const op = u.el('div', 'grp opacity', _c.win);
      u.el('span', 'legend', op, 'Opacity');
      u.el('span', 'end-top', op, 'More Opaque');
      u.el('span', 'end-bot', op, 'More Transparent');
      u.el('div', 'hint', op, 'Adjust the window opacity level.');
      Object.assign(_c, { body: _c.win, op });
      const pw = u.el('div', 'win preview-win', document.body);
      titlebar(pw, u, 'Preview', ['min', 'max', 'close']);
      const pin = u.el('div', 'pv-inner', pw);
      const inact = u.el('div', 'pv-inactive', pin);
      const ib = u.el('div', 'pv-ibar', inact);
      icon(ib, u, 'mon');
      u.el('span', '', ib, 'Inactive Window');
      const act = u.el('div', 'pv-active', pin);
      const ab = u.el('div', 'pv-abar', act);
      u.el('span', '', ab, 'Active Window');
      const abt = u.el('span', 'tbar-btns', ab);
      ['min', 'max', 'close'].forEach((g) => u.el('span', 'tbtn tbtn-' + g, abt));
      const ac = u.el('div', 'pv-body', act);
      u.el('div', '', ac, 'Sample Window');
      u.el('div', 'pv-text', ac, 'This is a preview of the opacity setting.');
      const scroll = u.el('span', 'pv-scroll', ac);
      u.el('span', 'pv-arrow up', scroll, '▲');
      u.el('span', 'pv-arrow down', scroll, '▼');
      u.el('span', 'os2-btn pv-close', pw, 'Close');
      _c.pw = pw;
      const tb = u.el('div', 'taskbar', document.body);
      const os = u.el('div', 'tb-item tb-os2', tb);
      icon(os, u, 'cube');
      u.el('b', '', os, 'OS/2');
      const t1 = u.el('div', 'tb-item tb-task on', tb);
      icon(t1, u, 'mon');
      u.el('span', '', t1, 'Display Properties');
      const t2 = u.el('div', 'tb-item tb-task', tb);
      icon(t2, u, 'win');
      u.el('span', '', t2, 'Preview');
      const tray = u.el('div', 'tb-tray', tb);
      icon(tray, u, 'mon');
      icon(tray, u, 'phone');
      u.el('span', '', tray, '10:24 AM');
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.win.querySelector('.ref-panel');
      if (note) {
        note.classList.add('task-note');
        const text = note.querySelector('.ref-panel-text');
        text.classList.add('instruction');
        fitNote(note, text);
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'record-stage', _c.op);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note');
        _c.win.appendChild(note);
        const text = note.querySelector('.ref-note-text');
        text.classList.add('instruction');
        const close = note.querySelector('.ref-note-x');
        close.classList.add('instruction-close');
        close.textContent = 'Close';
        fitNote(note, text);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.win.appendChild(foot);
      foot.classList.add('btn-row');
      for (const button of _c.headerTools.querySelectorAll('.ref-xtra')) foot.prepend(button);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.pw.appendChild(dock);
    },
    overlay: () => drawOverlay,
  };
  env.site({
    name: 'design-set-slider-vertical-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-set-slider-vertical-09': palette }, LOW_THEME: palette,
      ACCENTS: ['#6e6e6e'], LOW_ACCENTS: ['#6e6e6e'], parts,
    },
  });
})();
