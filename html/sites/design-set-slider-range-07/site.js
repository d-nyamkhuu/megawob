/* Motif "Data Filter" workstation: ledger table, filter panel with the slider, detached preview window. */
(function () {
  'use strict';
  const ROWS = [
    ['1001', '1991-04-01', 'RIV-01', '1.2', '12.4', 'Good', '—'],
    ['1002', '1991-04-02', 'RIV-01', '2.8', '12.0', 'Good', '—'],
    ['1002', '1991-04-03', 'RIV-02', '4.1', '11.8', 'Fair', '—'],
    ['1003', '1991-04-04', 'RIV-02', '3.6', '11.9', 'Good', '*'],
    ['1004', '1991-04-05', 'RIV-03', '5.9', '12.7', 'Fair', '—'],
    ['1005', '1991-04-06', 'RIV-03', '4.8', '12.1', 'Good', '—'],
    ['1009', '1991-04-07', 'RIV-01', '2.1', '11.6', 'Good', '—'],
    ['1010', '1991-04-08', 'RIV-02', '3.3', '12.3', 'Fair', '—'],
  ];
  const HEAD = ['', '', 'Date', 'Station', 'Flow (m³/s)', 'Temp (°C)', 'Quality', 'Flag'];
  const MENU = [['New...', 'Ctrl+N'], ['Open...', 'Ctrl+O'], null, ['Close', 'Ctrl+W'], ['Save', 'Ctrl+S'], ['Save As...', ''], null, ['Exit', 'Ctrl+Q']];

  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('aside', 'survey-drawer overlay-' + ctx.kind, document.body); el.setAttribute('role', 'dialog');
    const survey = ctx.kind === 'chat';
    const title = {chat: 'Feedback', cookie: 'Privacy', toast: 'Notice', promo: 'Support the lab', banner: 'Service notice'}[ctx.kind];
    u.el('h2', '', el, title);
    const x = u.el('button', 'survey-x', el, '×'); x.setAttribute('aria-label', 'Close notice'); x.onclick = () => ctx.dismiss('close');
    if (survey) {
      u.el('p', 'survey-intro', el, 'Quick survey (2 questions)');
      u.el('div', 'survey-question', el, '1. How easy was it to find what you needed today?');
      const choices = u.el('div', 'survey-choices', el);
      ['Very easy', 'Somewhat easy', 'Neither easy nor difficult', 'Somewhat difficult', 'Very difficult'].forEach((label) => {
        const row = u.el('label', '', choices); const radio = u.el('input', '', row); radio.type = 'radio'; radio.name = 'ease'; radio.value = label; u.el('span', '', row, label);
      });
      u.el('div', 'survey-question second', el, '2. What could we improve?');
      const dropdown = u.el('div', 'survey-dropdown', el);
      const toggle = u.el('button', 'survey-select', dropdown, 'Select an option…'); toggle.type = 'button'; toggle.setAttribute('aria-expanded', 'false');
      const options = u.el('div', 'survey-options', dropdown); options.hidden = true;
      for (const label of ['Finding records', 'Image quality', 'Help and guidance']) { const b = u.el('button', '', options, label); b.type = 'button'; b.onclick = () => { toggle.textContent = label; options.hidden = true; toggle.setAttribute('aria-expanded', 'false'); }; }
      toggle.onclick = () => { options.hidden = !options.hidden; toggle.setAttribute('aria-expanded', String(!options.hidden)); };
    } else {
      u.el('p', 'survey-intro', el, {cookie: 'This workstation can remember your display preferences.', toast: 'The data set is ready for filtering.', promo: 'Discover the lab’s growing archive.', banner: 'The data server is available offline.'}[ctx.kind]);
    }
    const dismiss = u.el('button', 'primary survey-close', el, survey ? 'Close survey' : ctx.kind === 'cookie' ? 'Reject optional' : 'Dismiss'); dismiss.type = 'button'; dismiss.onclick = () => ctx.dismiss('dismiss');
    return {el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0};
  }

  function chart(parent, u) {
    const svg = u.svg('svg', {viewBox: '0 0 420 245', class: 'pv-chart', preserveAspectRatio: 'none', 'aria-hidden': 'true'}, parent);
    const y = (v) => 188 - 14.3 * v;
    for (let v = 0; v <= 10; v += 2) {
      u.svg('line', {x1: 75, x2: 395, y1: y(v), y2: y(v), stroke: '#c8c8c8'}, svg);
      u.svg('line', {x1: 68, x2: 75, y1: y(v), y2: y(v), stroke: '#222'}, svg);
      u.svg('text', {x: 62, y: y(v) + 5, 'text-anchor': 'end', 'font-size': 18}, svg).textContent = String(v);
    }
    for (let i = 2; i <= 8; i += 2) { u.svg('line', {x1: 75 + i * 40, x2: 75 + i * 40, y1: 45, y2: 188, stroke: '#c8c8c8'}, svg); }
    u.svg('line', {x1: 75, x2: 75, y1: 45, y2: 188, stroke: '#222'}, svg);
    u.svg('line', {x1: 75, x2: 395, y1: 188, y2: 188, stroke: '#222'}, svg);
    ['Apr 01', 'Apr 03', 'Apr 05', 'Apr 07'].forEach((t, i) => {
      u.svg('line', {x1: 75 + i * 80, x2: 75 + i * 80, y1: 188, y2: 197, stroke: '#222'}, svg);
      u.svg('text', {x: 75 + i * 80, y: 216, 'text-anchor': 'middle', 'font-size': 18}, svg).textContent = t;
    });
    u.svg('line', {x1: 395, x2: 395, y1: 188, y2: 197, stroke: '#222'}, svg);
    const vals = [1.2, 1.6, 3.1, 3.6, 5.3, 3.9, 1.6, 2.2, 3.1];
    const pts = vals.map((v, i) => [75 + i * 40, y(v)]);
    u.svg('polyline', {points: pts.map((p) => p.join(',')).join(' '), fill: 'none', stroke: '#2057b5', 'stroke-width': 2.6}, svg);
    pts.forEach((p) => u.svg('circle', {cx: p[0], cy: p[1], r: 3.8, fill: '#2057b5'}, svg));
    u.svg('text', {x: 210, y: 30, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 'bold'}, svg).textContent = 'Flow Over Time';
    const yl = u.svg('text', {x: 21, y: 121, 'text-anchor': 'middle', 'font-size': 18, transform: 'rotate(-90 21 121)'}, svg);
    yl.textContent = 'Flow (m³/s)';
  }
  const palette = { bg: '#bfbcb5', panel: '#cfccc5', fg: '#1c1c1c', muted: '#222222', line: '#8e8b84' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.className = `motif instruction-${_c.display}${_c.ctx.finish ? ' finish-mode' : ''}`;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const title = u.el('header', 'm-title', document.body);
      u.el('span', 'm-icon', title);
      u.el('span', 'm-title-text', title, 'Data Filter — /projects/river/data.sv');
      const wb = u.el('span', 'm-winbtns', title);
      ['minimize', 'maximize', 'close'].forEach((g) => u.el('span', 'm-wb ' + g, wb));
      const menu = u.el('nav', 'm-menubar', document.body);
      ['File', 'Edit', 'View', 'Select', 'Tools'].forEach((t, i) => u.el('span', 'm-mi' + (i === 0 ? ' open' : ''), menu, t));
      u.el('span', 'm-help', menu, 'Help');
      const buttons = u.el('div', 'm-buttons', document.body);
      Object.assign(_c, { header: document.body, buttons });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-instruction');
      if (note) note.classList.add('m-note', 'instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.buttons;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const ledger = u.el('section', 'm-ledger', document.body);
      const tbl = u.el('div', 'm-table', ledger);
      const head = u.el('div', 'm-tr m-th', tbl);
      HEAD.forEach((h) => u.el('div', 'm-td', head, h));
      ROWS.forEach((r, i) => {
        const tr = u.el('div', 'm-tr' + (i === 2 ? ' sel' : ''), tbl);
        [r[0], '', ...r.slice(1)].forEach((c) => u.el('div', 'm-td', tr, c));
      });
      const vs = u.el('div', 'm-vscroll', ledger);
      u.el('div', 'm-arrow up', vs, '▲'); u.el('div', 'm-vthumb', vs); u.el('div', 'm-arrow down', vs, '▼');
      const hs = u.el('div', 'm-hscroll', ledger);
      u.el('div', 'm-arrow left', hs, '◀'); u.el('div', 'm-hthumb', hs); u.el('div', 'm-arrow right', hs, '▶');
      const lstat = u.el('div', 'm-lstatus', document.body);
      u.el('span', 'a', lstat, 'Rows: 1,240'); u.el('span', 'a sep', lstat, 'Filter: (none)'); u.el('span', 'a sep', lstat, 'Sorted by: Date');
      u.el('span', 'r', lstat, 'Row 3 of 1,240');
      const dd = u.el('div', 'm-dropdown', document.body);
      MENU.forEach((m) => {
        if (!m) { u.el('div', 'm-sep', dd); return; }
        const row = u.el('div', 'm-ddi', dd); u.el('span', '', row, m[0]); u.el('span', 'k', row, m[1]);
      });
      const panel = u.el('section', 'm-filter', document.body);
      u.el('div', 'm-ptitle', panel, 'Filter by Flow Range');
      const pv = u.el('section', 'm-preview', document.body);
      const pt = u.el('div', 'm-pv-title', pv);
      u.el('span', 'm-pv-icon', pt); u.el('span', 'm-pv-name', pt, 'Preview');
      u.el('span', 'm-pv-btn b1', pt); u.el('span', 'm-pv-btn b2', pt, '✕');
      const plot = u.el('div', 'm-pv-plot', pv);
      chart(plot, u);
      const pcap = u.el('div', 'm-pv-cap', pv);
      u.el('span', '', pcap, 'Station: All'); u.el('span', 'sep', pcap, 'Rows: 1,240');
      _c.body = document.body;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-panel');
      if (note) note.classList.add('m-note', 'instruction');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'record-stage', document.body);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('m-note', 'instruction');
        const close = note.querySelector('.ref-note-x');
        close.classList.add('instruction-close');
        close.textContent = 'Close';
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const sb = document.body.querySelector('.ref-foot');
      sb.classList.add('m-status');
      const ready = sb.querySelector('.ref-foot-text');
      ready.classList.add('ready');
      ready.textContent = 'Ready.';
      _c.util.el('span', 'cell', sb, 'Unix');
      _c.util.el('span', 'cell', sb, '10:24 AM');
      _c.util.el('span', 'cell', sb, 'Apr 08, 1991');
    },
    'frame.floating': (base) => (_c) => { base(_c); },
    overlay: () => drawOverlay,
  };
  env.site({
    name: 'design-set-slider-range-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-set-slider-range-07': palette },
      LOW_THEME: palette,
      ACCENTS: ['#6b6a66'],
      LOW_ACCENTS: ['#6b6a66'],
      parts,
    },
  });
})();
