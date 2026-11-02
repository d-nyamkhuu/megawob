/* Northbridge Supply Extranet (1999): navy masthead, rust tabs, toolbar, bordered table panels. */
(function () {
  'use strict';
  const ICONS = {
    doc: '<path d="M7 3h13l6 6v23H7z" fill="#fafafa" stroke="#174c82" stroke-width="2"/><path d="M20 3v7h6M11 14h11M11 18h11M11 22h11M11 26h11" fill="none" stroke="#245f99" stroke-width="1.6"/>',
    folder:
      '<path d="M3 8h9l2 3h14v18H3z" fill="#e0d2a0" stroke="#1b4c79" stroke-width="1.8"/><path d="M3 30l5-17h24l-5 17z" fill="#dde2e3" stroke="#1b4c79" stroke-width="1.8"/><path d="M9 15h20" stroke="#fff"/>',
    save: '<path d="M3 2h27l2 3v27H3z" fill="#92958f" stroke="#c4c5c0"/><path d="M8 2h18v14H8z" fill="#ecece8"/><path d="M20 3h4v11h-4z" fill="#91948e"/><path d="M8 22q0-4 4-4h11q4 0 4 4v10H8z" fill="#e2e2dc"/><path d="M11 22h12v10H11z" fill="#a4a79f"/><path d="M4 4v25m2-25h23" stroke="#b5b7b0"/>',
    gear: '<path d="M14 2h6l1 4 4 2 4-1 3 5-3 3v4l3 3-3 5-4-1-4 2-1 4h-6l-1-4-4-2-4 1-3-5 3-3v-4l-3-3 3-5 4 1 4-2z" fill="#91b8d9" stroke="#174c7b" stroke-width="1.8"/><circle cx="17" cy="17" r="6" fill="#deebf5" stroke="#174c7b" stroke-width="1.8"/>',
    chart:
      '<path d="M3 3v29h29" fill="none" stroke="#245778" stroke-width="2"/><path d="M7 29V18h4v11m3 0V15h4v14m3 0V20h4v9m3 0V9h3v20" fill="#9bb7cd" stroke="#edf3f6" stroke-width=".7"/><path d="M7 24l7-11 7 6 9-13m-6 2 6-2-1 6" fill="none" stroke="#1f557a" stroke-width="2"/>',
    people:
      '<circle cx="12" cy="8" r="6" fill="#1c5485"/><circle cx="26" cy="11" r="5" fill="#1c5485"/><path d="M2 31V24q0-10 10-10t10 10v7M19 31V25q0-9 8-9t7 9v6z" fill="#1c5485" stroke="#edf4f7" stroke-width="1"/><path d="M7 21v10m10-10v10m7-8v8m6-8v8" stroke="#94b5ce" stroke-width="1.5"/>',
    wrench:
      '<path d="M24 1a8 8 0 0 0-8 10L3 25a4 4 0 0 0 6 6l12-15a8 8 0 0 0 11-12l-4 5-5-1-1-4z" fill="#1c5483" stroke="#184b75" stroke-width=".6"/><circle cx="6" cy="28" r="1.7" fill="#e9eeee"/><path d="M8 25l11-13" stroke="#608aab" stroke-width="1"/>',
    help: '<circle cx="17" cy="17" r="15" fill="#205685"/><circle cx="17" cy="17" r="14" fill="none" stroke="#326795"/><text x="17" y="26" font-size="25" font-weight="bold" fill="#fff" text-anchor="middle" font-family="Arial">?</text>',
  };
  function icon(parent, name, u) {
    const s = u.svg('svg', { viewBox: '0 0 34 34', class: 'tb-icon', 'aria-hidden': 'true' }, parent);
    const id = 'toolbar-shade-' + name;
    const light = name === 'save' ? '#b3b4af' : name === 'gear' ? '#bad3e8' : '#306c9c';
    const dark = name === 'save' ? '#898c86' : name === 'gear' ? '#73a5d0' : '#134779';
    s.innerHTML =
      '<defs><linearGradient id="' +
      id +
      '" x1="0" y1="0" x2="1" y2="1"><stop stop-color="' +
      light +
      '"/><stop offset="1" stop-color="' +
      dark +
      '"/></linearGradient></defs>' +
      ICONS[name].replace(/fill="#(?:1c5485|1c5483|205685|91b8d9|92958f)"/g, 'fill="url(#' + id + ')"');
  }
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('aside', 'ext-overlay overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const title = {
      chat: 'Partner Feedback',
      cookie: 'Cookie Notice',
      toast: 'System Notice',
      promo: 'Extranet Announcement',
      banner: 'Service Notice',
    }[ctx.kind];
    const bar = u.el('div', 'ov-title', el, title);
    const x = u.el('button', 'ov-x', bar, '×');
    x.type = 'button';
    x.setAttribute('aria-label', 'Close notice');
    x.onclick = () => ctx.dismiss('close');
    u.el(
      'p',
      '',
      el,
      {
        chat: 'Please rate your extranet experience.',
        cookie: 'This extranet stores session preferences on your computer.',
        toast: 'Batch data has been refreshed.',
        promo: 'New: Quality Check reports are now online.',
        banner: 'Scheduled maintenance this weekend.',
      }[ctx.kind],
    );
    const dismiss = u.el('button', 'ext-btn', el, ctx.kind === 'cookie' ? 'Reject optional' : 'Dismiss');
    dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('dismiss');
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  function infoPanel(parent, u, title, rows) {
    const p = u.el('section', 'info-panel', parent);
    u.el('h3', '', p, title);
    const t = u.el('div', 'info-rows', p);
    for (const [a, b] of rows) {
      u.el('span', 'k', t, a);
      u.el('span', 'v', t, b);
    }
    return p;
  }
  // Keep the two-line instruction treatment while the template owns display behavior.
  function instructionText(el, u) {
    const raw = el.textContent;
    const m = raw.match(/^(.*?)\s+((?:Drag|Use|Only drag) the handle.*)$/i);
    el.textContent = '';
    u.el('div', 'i1', el, m ? m[1] : raw);
    if (m) u.el('div', 'i2', el, m[2]);
  }
  const theme = { bg: '#edf4f7', panel: '#eaf2f6', fg: '#080f43', muted: '#53637a', line: '#a4bdd4' };

  env.site({
    name: 'design-set-slider-horizontal-01',
    template: 'site/base',
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { extranet: theme }, LOW_THEME: theme,
      ACCENTS: ['#164a82'], LOW_ACCENTS: ['#164a82'], LANGS: ['en'],
      parts: {
        'frame.layout': (base) => (_c) => {
          document.body.className = 'ext';
          base(_c);
          document.body.classList.add('instruction-' + _c.display);
        },
        'frame.header': () => (_c) => {
          const u = _c.util;
          const head = u.el('header', 'ext-head', document.body);
          const logo = u.svg('svg', { viewBox: '0 0 80 64', class: 'logo', 'aria-hidden': 'true' }, head);
          logo.innerHTML =
            '<defs><linearGradient id="stone" x2="0" y2="1"><stop stop-color="#d3e7f0"/><stop offset="1" stop-color="#84adc9"/></linearGradient><pattern id="masonry" width="22" height="16" patternUnits="userSpaceOnUse"><path d="M0 0h22v16H0zM0 8h22M11 0v8M5 8v8M19 8v8" fill="url(#stone)" stroke="#245374" stroke-width="1"/></pattern></defs><path d="M1 3h78v9H1z" fill="none" stroke="#a3c7de"/><path d="M3 4l14 7L37 4l21 7 18-7M17 3v8M37 3v8M58 3v8M2 15h77" stroke="#a3c7de" fill="none"/><path d="M1 20h78v44H64V48a24 24 0 0 0-48 0v16H1z" fill="url(#masonry)" stroke="#a6c7db"/><path d="M17 47a23 23 0 0 1 46 0M18 38l-9-5m15-2-6-9m14 5-3-9m11 8v-8m8 10 4-10m4 15 7-8m-3 16 12-5" stroke="#275576" fill="none"/><path d="M1 62h15m48 0h15" stroke="#c2dfeb" stroke-width="3"/>';
          const brand = u.el('div', 'brand', head);
          const h1 = u.el('h1', '', brand, 'Northbridge Supply ');
          u.el('span', '', h1, 'Extranet');
          u.el('div', 'sub', brand, 'PARTNER ACCESS   |   ORDERS   |   <b>RESOURCES</b>').innerHTML =
            'PARTNER ACCESS &nbsp;&nbsp;|&nbsp;&nbsp; ORDERS &nbsp;&nbsp;|&nbsp;&nbsp; <b>RESOURCES</b>';
          const right = u.el('div', 'head-right', head);
          u.el(
            'div',
            'welcome',
            right,
            'Welcome, jsmith  &nbsp;|&nbsp;  Acme Parts Co.  &nbsp;|&nbsp;  May 12, 1999',
          ).innerHTML = 'Welcome, jsmith &nbsp;&nbsp;|&nbsp;&nbsp; Acme Parts Co. &nbsp;&nbsp;|&nbsp;&nbsp; May 12, 1999';
          u.el('div', 'links', right, '').innerHTML =
            '<u>Help</u> &nbsp;&nbsp;|&nbsp;&nbsp; <u>Contact Us</u> &nbsp;&nbsp;|&nbsp;&nbsp; <u>Sign Out</u>';

          const tabs = u.el('nav', 'ext-tabs', document.body);
          for (const t of ['Home', 'Operations', 'Inventory', 'Reports', 'Administration']) {
            u.el('span', 'tab' + (t === 'Operations' ? ' on' : ''), tabs, t === 'Inventory' ? 'Inventory' : t);
          }
          const tabFill = u.el('span', 'tab-fill', tabs);
          const bar = u.el('div', 'ext-toolbar', document.body);
          const items = [
            ['doc', 'New Batch'],
            ['folder', 'Open Batch'],
            ['save', 'Save', 'dis'],
            null,
            ['gear', 'Machine Settings', 'on'],
            ['chart', 'View Logs'],
            null,
            ['doc', 'Quality Check'],
            ['people', 'User Management'],
            null,
            ['wrench', 'System Tools'],
            ['help', 'Help Topics'],
          ];
          for (const it of items) {
            if (!it) {
              u.el('i', 'tb-sep', bar);
              continue;
            }
            const b = u.el('div', 'tb-btn' + (it[2] ? ' ' + it[2] : ''), bar);
            icon(b, it[0], u);
            u.el('span', '', b, it[1]);
          }

          const panel = u.el('div', 'ext-panel', document.body);
          const ph = u.el('div', 'panel-head', panel);
          u.el('span', 'ph-title', ph, 'Machine Settings');
          u.el('span', 'ph-meta', ph, '').innerHTML =
            'Line 3 &nbsp;&nbsp;|&nbsp;&nbsp; Model ZX-200 &nbsp;&nbsp;|&nbsp;&nbsp; Status: <b>Ready</b>';
          const body = u.el('div', 'panel-body', panel);
          Object.assign(_c, { header: body, instructionHost: body, tabFill });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => (_c) => {
          base(_c);
          const note = _c.header.querySelector('.ref-instruction');
          if (note) {
            note.classList.add('instruction');
            instructionText(note, _c.util);
          }
        },
        'frame.tools': (base) => (_c) => {
          const ribbon = { ..._c, header: _c.tabFill };
          base(ribbon);
          _c.submit = ribbon.submit;
          ribbon.headerTools.classList.add('ribbon-tools');
          for (const b of ribbon.headerTools.querySelectorAll('.ref-xtra')) b.classList.add('chrome-xtra');
          if (_c.submit) _c.submit.classList.add('ribbon-end');
        },
        'frame.body': () => (_c) => {
          const body = _c.util.el('div', 'cols ref-body', _c.instructionHost);
          const side = _c.util.el('aside', 'side', body);
          Object.assign(_c, { body, side });
        },
        'frame.panel': (base) => (_c) => {
          base(_c);
          const note = _c.body.querySelector('.ref-panel');
          if (note) {
            note.classList.add('instruction', 'instruction-panel');
            instructionText(note.querySelector('.ref-panel-text'), _c.util);
            _c.side.appendChild(note);
          }
        },
        'frame.stage': () => (_c) => {
          const u = _c.util, side = _c.side;
          const stage = u.el('main', 'stage', _c.body);
          stage.dataset.role = 'stage';
          _c.body.prepend(stage);
          infoPanel(side, u, 'Batch Information', [
            ['Batch ID', 'B19990512-01'],
            ['Product', 'Gear Housing'],
            ['Quantity', '500'],
            ['Scheduled Start', 'May 12, 1999 10:00'],
            ['Status', 'Not Started'],
          ]);
          infoPanel(side, u, 'Control Information', [
            ['Input', 'Drag handle'],
            ['Readout', 'Current value'],
            ['Units', '—'],
          ]);
          const notes = u.el('section', 'info-panel notes', side);
          u.el('h3', '', notes, 'Notes');
          u.el('p', '', notes, 'Drag the handle to set the value.');

          _c.stage = stage;
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          if (_c.display === 'toast') {
            const note = document.querySelector('.ref-note');
            note.classList.add('instruction', 'instruction-toast');
            instructionText(note.querySelector('.ref-note-text'), _c.util);
            note.querySelector('.ref-note-x').classList.add('ext-btn', 'instruction-close');
            _c.instructionHost.prepend(note);
          }
        },
        'frame.footer': (base) => (_c) => {
          // The status bar is always present in this extranet design.
          const chrome = { ..._c, wantFooter: true };
          base(chrome);
          _c.submit = chrome.submit;
          const u = _c.util, footer = document.querySelector('.ref-foot');
          footer.classList.add('ext-foot');
          footer.querySelector('.ref-foot-text').remove();
          const status = u.el('div', 'footer-status');
          u.el('span', 'led', status);
          u.el('span', 'f-ready', status, 'System Ready');
          u.el(
            'span',
            'f-info',
            status,
            'User: jsmith &nbsp;&nbsp;|&nbsp;&nbsp; Role: Partner &nbsp;&nbsp;|&nbsp;&nbsp; Site: East Region',
          ).innerHTML = 'User: jsmith &nbsp;&nbsp;|&nbsp;&nbsp; Role: Partner &nbsp;&nbsp;|&nbsp;&nbsp; Site: East Region';
          footer.prepend(...status.childNodes);
          const actions = footer.querySelector('.ref-tools');
          actions.classList.add('f-actions');
          _c.decoyBtn(actions, 'Reset');
          const reset = actions.lastElementChild;
          reset.classList.add('reset');
          reset.dataset.action = 'reset';
          actions.prepend(reset);
          for (const b of actions.querySelectorAll('.ref-xtra:not(.reset)')) b.classList.add('chrome-xtra');
          if (_c.placement === 'footer') _c.submit.classList.add('primary');
          if (_c.placement === 'link') _c.submit.classList.add('footer-endlink');
          _c.actions = actions;
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          if (_c.placement === 'floating') {
            const dock = _c.submit.parentElement;
            _c.submit.classList.add('primary');
            _c.actions.appendChild(dock);
          }
        },
        overlay: () => drawOverlay,
      },
    },
  });
})();
