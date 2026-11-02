/* Fluent 2021 desktop: Image Adjuster window with a View Presets window beside it; seeded instruction in an unobscured note. */
(function () {
  'use strict';
  const NAV = [
    ['Adjust', 'M3 5h5m4 0h9M3 12h11m4 0h3M3 19h3m4 0h11M8 3v4m6 3v4M6 17v4'],
    ['Crop', 'M7 3v14h14M3 7h14v14M4 20L20 4'],
    ['Filters', 'M12 3a9 9 0 100 18 9 9 0 000-18zM6 5l4 5-2 4 2 6m9-14-4 4 3 4-2 6'],
    ['Markup', 'M4 20l4-1 11-11-3-3L5 16zM13 8l3 3'],
    ['Export', 'M8 4H5v17h15V4h-4M12 15V2m-4 4 4-4 4 4'],
  ];
  const PRESETS = [
    ['Natural', 'a'],
    ['Vivid', 'b'],
    ['Muted', 'c'],
    ['Warm', 'd'],
  ];
  function icon(parent, d, cls) {
    const s = env.util.svg(
      'svg',
      {
        viewBox: '0 0 24 24',
        class: cls || 'ico',
        'aria-hidden': 'true',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': 1.7,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
      },
      parent,
    );
    env.util.svg('path', { d }, s);
    return s;
  }
  function titlebar(u, parent, title, cls) {
    const tb = u.el('div', 'tb ' + (cls || ''), parent);
    const app = u.el('span', 'app-ico', tb);
    icon(app, 'M3 17l5-6 4 4 3-3 6 6M15 6h.01', 'app-glyph');
    u.el('span', 'tb-title', tb, title);
    const c = u.el('div', 'tb-ctl', tb);
    u.el('span', '', c, '—');
    u.el('span', 'sq', c);
    u.el('span', '', c, '✕');
    return tb;
  }
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('aside', 'dlg overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const title = {
      chat: 'Quick feedback',
      cookie: 'Your privacy matters',
      toast: 'Notice',
      promo: 'Try Image Adjuster Plus',
      banner: 'Service notice',
    }[ctx.kind];
    u.el('h2', '', el, title);
    const x = u.el('button', 'dlg-x', el, '✕');
    x.type = 'button';
    x.setAttribute('aria-label', 'Close notice');
    x.onclick = () => ctx.dismiss('close');
    u.el(
      'p',
      '',
      el,
      {
        chat: 'Help us improve the adjuster.',
        cookie: 'This app can remember your display preferences.',
        toast: 'Your image is ready for editing.',
        promo: 'Discover more adjustments.',
        banner: 'Presets are available offline.',
      }[ctx.kind],
    );
    const dismiss = u.el('button', 'primary dlg-close', el, ctx.kind === 'cookie' ? 'Reject optional' : 'Dismiss');
    dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('dismiss');
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  const palette = { bg: '#f5f7fb', panel: '#fff', fg: '#1a1c20', muted: '#505660', line: '#b9bcc2' };
  function markNote(el, display) {
    if (!el) return;
    el.classList.add('instruction');
    el.dataset.display = display;
    if (el.textContent.length > 65) el.classList.add('long-note');
  }
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('fluent', `instruction-${_c.display}`);
      u.el('div', 'desk', document.body);
      const win = u.el('section', 'win main-win', document.body);
      const toolbar = titlebar(u, win, 'Image Adjuster');
      const body = u.el('div', 'wbody', win);
      const side = u.el('nav', 'side', body);
      NAV.forEach(([label, d], i) => {
        const it = u.el('div', 'nav-item' + (i === 0 ? ' on' : ''), side);
        icon(it, d);
        u.el('span', '', it, label);
      });
      u.el('div', 'grow', side);
      const set = u.el('div', 'nav-item', side);
      icon(set, 'M9 3l1-2h4l1 2 3 1 2 3-1 2v4l1 2-2 3-3 1-1 2h-4l-1-2-3-1-2-3 1-2V9L4 7l2-3zM12 8a4 4 0 100 8 4 4 0 000-8z');
      u.el('span', '', set, 'Settings');
      const content = u.el('div', 'content', body);
      const pw = u.el('section', 'win pres-win', document.body);
      titlebar(u, pw, 'View Presets');
      const pb = u.el('div', 'pbody', pw);
      u.el('h2', '', pb, 'View Presets');
      const p = u.el('p', 'psub', pb, 'Save and manage your display preferences');
      u.el('p', 'psub', pb).innerHTML = '(This <b>only</b> saves presentation settings.)';
      p.classList.add('first');
      Object.assign(_c, { win, toolbar, content, pb, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('note');
      markNote(note, _c.display);
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      _c.toolbar.insertBefore(_c.headerTools, _c.toolbar.querySelector('.tb-ctl'));
    },
    'frame.body': () => (_c) => {
      _c.body = _c.content;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.pb;
      base(_c);
      _c.body = body;
      const panel = _c.pb.querySelector('.ref-panel');
      if (panel) panel.classList.add('task-panel');
      markNote(panel && panel.querySelector('.ref-panel-text'), _c.display);
      const u = _c.util;
      const list = u.el('div', 'plist', _c.pb);
      const radios = [];
      PRESETS.forEach(([name, k], i) => {
        const r = u.el('div', 'prow', list);
        u.el('span', 'pth th-' + k, r);
        u.el('span', 'pname', r, name);
        const rd = u.el('span', 'radio' + (i === 0 ? ' on' : ''), r);
        radios.push(rd);
        r.onclick = () => radios.forEach((x, j) => x.classList.toggle('on', j === i));
      });
      const actions = u.el('div', 'preset-actions', _c.pb);
      const sv = u.el('button', 'btn savev big', actions, 'Save View');
      sv.type = 'button';
      icon(sv, 'M4 3h14l3 3v15H3V3zM7 3v7h10V3M7 21v-8h10v8M13 5v3', 'save-icon');
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const row = u.el('div', 'crow', _c.content);
      const prev = u.el('div', 'preview', row);
      u.el('div', 'pv-sky', prev);
      u.el('div', 'pv-mtn', prev);
      u.el('div', 'pv-forest', prev);
      u.el('div', 'pv-lake', prev);
      u.el('div', 'pv-cap', prev, 'Sample Preview (opacity applied)');
      const stage = u.el('main', 'record-stage', row);
      stage.dataset.role = 'stage';
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('note', 'instruction', 'toast-note');
        markNote(note.querySelector('.ref-note-text'), _c.display);
        if (note.querySelector('.long-note')) note.classList.add('long-note');
        note.querySelector('.ref-note-x').classList.add('instruction-close');
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const foot = u.el('div', 'cfoot', _c.content);
      const reset = u.el('button', 'btn reset', foot, 'Reset All');
      reset.type = 'button';
      reset.dataset.action = 'reset';
      u.el('div', 'grow', foot);
      const sv = u.el('button', 'btn savev', foot, 'Save View');
      sv.type = 'button';
      icon(sv, 'M4 3h14l3 3v15H3V3zM7 3v7h10V3M7 21v-8h10v8M13 5v3', 'save-icon');
      base(_c);
      foot.appendChild(document.body.querySelector('.ref-foot'));
      _c.foot = foot;
      const tk = u.el('div', 'taskbar', document.body);
      u.el('span', 'wlogo', tk);
      u.el('span', 'tsearch', tk, 'Search');
      u.el('span', 'tapp a1', tk);
      u.el('span', 'tapp a2', tk);
      u.el('span', 'tapp a3', tk);
      const tray = u.el('div', 'tray', tk);
      icon(tray, 'M4 14l8-8 8 8');
      icon(tray, 'M2 8q10-9 20 0M5 12q7-6 14 0M9 16q3-3 6 0M12 20h.01');
      icon(tray, 'M3 9h4l5-5v16l-5-5H3zM16 8q6 4 0 8');
      icon(tray, 'M2 6h18v12H2zM22 10v4M5 9h11v6H5z');
      const clk = u.el('div', 'tclock', tk);
      u.el('div', '', clk, '10:24 AM');
      u.el('div', '', clk, 'Mar 4, 2025');
    },
    overlay: () => drawOverlay,
  };
  env.site({
    name: 'design-set-slider-log-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-set-slider-log-12': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0b5fd8'],
      LOW_ACCENTS: ['#0b5fd8'],
      parts,
    },
  });
})();
