// Design on templates/site/click-point-bisect-03.js: only what this site changed.
(function () {
  'use strict';
  function atariFrame(ctx) {
    const u = ctx.util,
      body = document.body;
    body.className = 'design atari';
    const root = document.documentElement;
    for (const [k, v] of Object.entries({
      bg: '#d8d8d8',
      panel: '#e3e3e3',
      fg: '#000',
      muted: '#222',
      line: '#000',
      accent: '#000',
    }))
      root.style.setProperty('--' + k, v);
    root.style.setProperty('--font', '"Courier New",Courier,monospace');
    const desk = u.el('div', 'desk', body),
      bar = u.el('div', 'menubar', desk);
    const logo = u.svg(
      'svg',
      { class: 'logo', viewBox: '0 0 36 30', fill: 'none', stroke: '#000', 'stroke-width': 4 },
      bar,
    );
    u.svg('path', { d: 'M2 27C11 27 13 16 13 2M18 2V28M34 27C25 27 23 16 23 2' }, logo);
    for (const t of ['Desk', 'File', 'Edit', 'View', 'Options', 'Help']) u.el('span', 'm', bar, t);
    u.el('span', 'clock', bar, 'Mon Mar 10  1986  10:24');
    const win = u.el('div', 'win', desk),
      wt = u.el('div', 'wtitle', win);
    u.el('span', 'gadget close', wt);
    u.el('span', 't', wt, 'Window Trainer');
    u.el('span', 'gadget min', wt);
    const hd = u.el('div', 'hdr', win),
      l = u.el('div', 'l', hd);
    const ic = u.svg('svg', { viewBox: '0 0 44 52', fill: '#e3e3e3', stroke: '#000', 'stroke-width': 3 }, l);
    u.svg(
      'path',
      { d: 'M3 4H29L41 16V49H3ZM29 4V16H41M8 1H32L43 12M8 49V51H42M10 13H24M10 21H33M10 27H33M10 33H33M10 39H26' },
      ic,
    );
    const lt = u.el('div', '', l);
    u.el('b', '', lt, 'Window Trainer');
    u.el('span', '', lt, 'Practice resizing a panel to match the target outline.');
    const r = u.el('div', 'r', hd);
    u.el('b', '', r, 'Step 1 of 1');
    u.el('span', '', r, 'Use the mouse to drag the panel’s bottom-right corner.');
    win.dataset.display = ctx.display;
    const note = u.el('section', 'task-note', win);
    u.el('div', 'note-label', note, '');
    u.el('div', 'instruction', note, ctx.instruction);
    if (ctx.display === 'hidden') note.hidden = true;
    else if (ctx.display === 'toast') {
      note.classList.add('instruction-toast');
      const x = u.el('button', 'note-close', note, '×');
      x.onclick = () => (note.style.visibility = 'hidden');
    } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
    const stage = u.el('main', 'stage', win);
    stage.dataset.role = 'stage';
    const ft = u.el('div', 'wfoot', win);
    const ins = u.el('button', 'btn ins', ft);
    ins.type = 'button';
    u.el('i', '', ins, '?');
    u.el('span', '', ins, 'Instructions');
    ins.onclick = () => env.log('instructions');
    let submit = null;
    const er = ctx.rng.fork('chrome/end'),
      cr = ctx.rng.fork('chrome/collide');
    const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
    const endWords = ctx.content.END_LABELS.map(labelOf);
    const usual = er.bool(0.5),
      placement = usual ? 'footer' : er.pick(['toolbar', 'link']);
    const endLabel = usual ? 'Submit' : er.pick(endWords);
    ft.dataset.end = ctx.finish ? 'finish' : placement;
    const rs = u.el('button', 'btn reset', ft, 'Reset');
    rs.type = 'button';
    rs.onclick = () => env.widgetDef.clear?.();
    if (!ctx.finish) {
      submit = u.el(
        placement === 'link' ? 'a' : 'button',
        'submit end-' + placement,
        placement === 'toolbar' ? wt : ft,
        endLabel,
      );
      if (submit.tagName === 'BUTTON') submit.type = 'button';
      else submit.href = '#';
      submit.title = endLabel;
      submit.setAttribute('aria-label', endLabel);
      submit.dataset.role = 'submit';
      submit.onclick = (e) => {
        e.preventDefault();
        ctx.submit();
      };
    }
    if (cr.bool(0.3)) {
      const alternatives = endWords.filter((t) => t.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      if (alternatives.length) {
        const label = cr.pick(alternatives),
          b = u.el('button', 'btn end-xtra', ft, label);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.onclick = () => env.log('decoy', { label, collide: true });
      }
    }
    // Reserve enough room for wrapped instructions before the kit measures the stage.
    const noteStyle = getComputedStyle(note);
    if (ctx.display !== 'hidden' && !(ctx.display === 'panel' && noteStyle.textAlign === 'left')) {
      const top = Math.max(win.clientHeight * 0.306, note.offsetTop + note.offsetHeight + 8);
      stage.style.top = top + 'px';
      stage.style.height = Math.max(100, ft.offsetTop - top - 12) + 'px';
    }
    const dock = u.el('div', 'dock', desk);
    const item = (top, name, shape) => {
      const d = u.el('div', '', dock);
      d.style.top = top + '%';
      const s = u.svg('svg', { viewBox: '0 0 50 50', fill: '#d9dada', stroke: '#000', 'stroke-width': 2.5 }, d);
      const frame = name === 'A:' ? [7, 3, 37, 40] : name === 'TRASH' ? [14, 17, 23, 26] : [4, 12, 41, 31];
      u.svg('rect', { x: frame[0], y: frame[1], width: frame[2], height: frame[3] }, s);
      u.svg('path', { d: shape, fill: 'none' }, s);
      u.el('span', '', d, name);
    };
    item(1, 'A:', 'M7 3H39L44 8V43H7ZM7 3V21H44M17 3V17H34V3M28 6V14M18 29H33M18 34H33M10 43H46V9');
    item(16, 'APPS', 'M4 12V8H20V12M4 12H45V43H4ZM7 43H45V14');
    item(30.3, 'DOCS', 'M4 12V8H20V12M4 12H45V43H4ZM7 43H45V14');
    item(
      49.3,
      'TRASH',
      'M10 12H40V17H10ZM18 12V7H21V4H29V7H32V12M14 17V43L18 46H33L37 43V17M20 21V40M26 21V40M32 21V40',
    );
    return { stage, submit };
  }
  env.site({
    name: 'design-resize-element-ghost-04',
    styles: ['site.css', 'atari.css'],
    scripts: [],
    template: 'site/click-point-bisect-03',
    design: {
      C: {
        'layout': 'ledger',
        'theme': 'aero',
        'title': 'ClearWork',
        'menu': 'Home       Ledger       Files       Contacts       Tools',
        'foot': 'ClearWork',
        'accent': '#54a636',
        'bg': '#eefaff',
        'surface': '#fff',
        'font': 'Arial, sans-serif',
      },
      parts: {
        frame: (base, S) =>
          function (ctx) {
            return atariFrame(ctx);
          },
        'frameOld.10': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (C.menu) {
              const nav = u.el('nav', 'menu', head);
              for (const label of ['Home', 'Ledger', 'Files', 'Contacts', 'Tools'])
                u.el('span', label === 'Ledger' ? 'selected' : '', nav, label);
            }
            const search = u.el('div', 'header-search', head);
            u.el('span', 'search-icon', search);
            u.el('span', '', search, 'Search');
            const account = u.el('div', 'header-account', head);
            u.el('span', 'account-icon', account);
            u.el('span', '', account, 'Alex Chen');
            u.el('span', '', account, '▾');
            if (C.ribbon) {
              const rib = u.el('div', 'ribbon', head);
              const tool = (parent, name, path) => {
                const bt = u.el('button', 'tool', parent);
                bt.type = 'button';
                const icon = u.svg(
                  'svg',
                  {
                    width: 32,
                    height: 34,
                    viewBox: '0 0 32 32',
                    fill: 'none',
                    stroke: 'currentColor',
                    'stroke-width': 1.8,
                  },
                  bt,
                );
                u.svg('path', { d: path }, icon);
                u.el('span', '', bt, name);
                bt.onclick = () => {
                  rib.querySelectorAll('.tool').forEach((x) => x.classList.remove('selected'));
                  bt.classList.add('selected');
                };
                return bt;
              };
              const groups =
                C.theme === 'eink'
                  ? ['Tools', 'View', 'Style', 'Help']
                  : C.theme === 'office'
                    ? ['Navigate', 'Draw', 'Edit', 'Options']
                    : ['Navigation', 'Draw', 'Options', 'Support'];
              for (const [j, name] of groups.entries()) {
                const gr = u.el('div', 'tool-group', rib);
                if (j === 0) {
                  for (const t of [
                    'Select',
                    'Pan',
                    'Zoom In',
                    'Zoom Out',
                    C.theme === 'office' ? 'Fit to Window' : 'Reset View',
                  ]) {
                    const path =
                      t === 'Select'
                        ? 'M4 2V28L12 20L18 30L23 27L17 18H29Z'
                        : t === 'Pan'
                          ? 'M9 28L3 16Q2 12 6 13L11 18V5Q13 1 15 5V15V3Q18 0 19 4V15V6Q22 3 23 7V17V11Q27 7 28 12V23L23 30Z'
                          : t === 'Reset View'
                            ? 'M6 9A13 13 0 1 1 4 22M6 2V10H15'
                            : 'M22 22L30 30M25 14A11 11 0 1 1 3 14A11 11 0 1 1 25 14M8 14H20' +
                              (t === 'Zoom In' ? 'M14 8V20' : '');
                    tool(gr, t, path);
                  }
                } else if ((C.theme === 'eink' && j === 1) || (C.theme === 'vista' && j === 2)) {
                  for (const label of C.theme === 'eink'
                    ? ['Show Labels', 'Show Dotted Circle', 'Show Grid']
                    : ['Show Grid', 'Snap to Grid', 'Show Measurements']) {
                    const l = u.el('label', 'check-tool', gr);
                    const input = u.el('input', '', l);
                    input.type = 'checkbox';
                    input.checked =
                      label === 'Show Labels' ||
                      label === 'Show Dotted Circle' ||
                      (label === 'Show Grid' && C.theme === 'vista');
                    u.el('span', '', l, label);
                  }
                } else if (C.theme === 'eink' && j === 2) {
                  for (const [title, values] of [
                    ['Line Thickness', ['2', '1', '3']],
                    ['Dashed Style', ['Dotted', 'Dashed', 'Solid']],
                  ]) {
                    const l = u.el('label', 'style-tool', gr, title);
                    const select = u.el('select', '', l);
                    for (const v of values) u.el('option', '', select, v);
                  }
                } else {
                  let names =
                    C.theme === 'eink'
                      ? ['Instructions', 'Example']
                      : C.theme === 'office'
                        ? j === 1
                          ? ['Add Point', 'Add Circle', 'Add Line', 'Erase']
                          : j === 2
                            ? ['Undo', 'Redo']
                            : ['Settings']
                        : j === 1
                          ? ['Line', 'Circle', 'Rectangle', 'Point']
                          : ['Help', 'About'];
                  for (const t of names)
                    tool(
                      gr,
                      t,
                      t.includes('Circle')
                        ? 'M29 16A13 13 0 1 1 3 16A13 13 0 1 1 29 16'
                        : t.includes('Line')
                          ? 'M3 29L29 3'
                          : t === 'Point'
                            ? 'M19 16A3 3 0 1 1 13 16A3 3 0 1 1 19 16'
                            : t === 'Instructions' || t === 'Help'
                              ? 'M29 16A13 13 0 1 1 3 16A13 13 0 1 1 29 16M12 10Q12 5 17 6Q23 8 17 14L16 19M16 23V25'
                              : 'M5 5H27V27H5ZM10 16L14 20L23 10',
                    );
                }
                u.el('small', '', gr, name);
              }
            }
            Object.assign(_c, { account, search });
          },
        'frameOld.11': () => () => {},
        'frameOld.18': (base, S) =>
          function (_c) {
            const { content, u } = _c;
            const ledger = u.el('section', 'resize-ledger', content);
            const ledgerHead = u.el('div', 'ledger-head', ledger);
            const ledgerTitle = u.el('h2', '', ledgerHead);
            const chart = u.el('span', 'ledger-chart', ledgerTitle);
            for (let i = 0; i < 4; i++) u.el('i', '', chart);
            u.el('span', '', ledgerTitle, 'Ledger');
            const period = u.el('button', 'ledger-period', ledgerHead, 'This Month');
            const add = u.el('button', 'ledger-add', ledgerHead, 'Add Transaction');
            add.onclick = () => env.log('ledger-add');
            const table = u.el('table', '', ledger);
            const tr = u.el('tr', '', table);
            for (const v of ['Date', 'Description', 'Category', 'Amount', 'Status']) u.el('th', '', tr, v);
            for (const [i, values] of [
              ['Office Supplies', 'Business', '-$48.20'],
              ['Client Payment - Rivera', 'Income', '$1,250.00'],
              ['Cloud Hosting', 'Software', '-$32.00'],
              ['Travel - Train', 'Travel', '-$86.50'],
              ['Design Contract', 'Income', '$980.00'],
              ['Team Lunch', 'Meals', '-$54.30'],
              ['Domain Renewal', 'Software', '-$18.00'],
              ['Client Payment - Park', 'Income', '$640.00'],
            ].entries()) {
              const row = u.el('tr', '', table);
              for (const [j, v] of [
                'Jun ' + String(i + 1).padStart(2, '0') + ', 2025',
                ...values,
                'Posted',
              ].entries()) {
                const td = u.el('td', '', row, v);
                if (j === 4) td.className = 'posted';
                if (j === 3) td.style.color = v.startsWith('-') ? '#d90042' : '#008020';
              }
            }
            const stage = u.el('main', 'stage', content);
            Object.assign(_c, { add, chart, ledger, ledgerHead, ledgerTitle, period, stage, table, tr });
          },
        'frameOld.21': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, u } = _c;
            if (['three', 'windows', 'offset', 'sheet', 'notebook', 'rail', 'palette', 'ledger'].includes(C.layout)) {
              _c.aside = u.el('aside', 'aside', content);
              if (C.tabs) {
                _c.aside.classList.add('tabs');
                for (const text of C.tabs) {
                  const bt = u.el('button', 'tab', _c.aside, text);
                  bt.type = 'button';
                  bt.onclick = () => {
                    _c.aside.querySelectorAll('.tab').forEach((x) => x.classList.remove('active'));
                    bt.classList.add('active');
                  };
                }
              } else if (C.layout === 'sheet') {
                for (let i = 1; i <= 20; i++) u.el('div', 'index-number', _c.aside, String(i));
              } else if (C.layout === 'offset') {
                for (const text of ['Select', 'Zoom In', 'Zoom Out', 'Pan']) u.el('button', 'map-tool', _c.aside, text);
              } else {
                const previewHead = u.el('h3', '', _c.aside);
                const miniFile = u.svg(
                  'svg',
                  { class: 'mini-file', viewBox: '0 0 24 28', fill: 'none', stroke: '#d8f4ff', 'stroke-width': 1.5 },
                  previewHead,
                );
                u.svg('path', { d: 'M3 2H14L21 9V26H3ZM14 2V10H21M7 15H17M7 18H17M7 21H14' }, miniFile);
                u.el('span', '', previewHead, 'Document Preview');
                u.el('span', 'preview-controls', previewHead, '−　□　×');
                const previewBody = u.el('div', 'preview-body', _c.aside);
                const file = u.svg(
                  'svg',
                  { class: 'file-icon', viewBox: '0 0 50 60', fill: 'none', stroke: '#7194bc', 'stroke-width': 3.5 },
                  previewBody,
                );
                u.svg('path', { d: 'M7 3H31L45 17V56H7ZM31 3V18H45M15 29H37M15 36H37M15 43H31' }, file);
                const details = u.el('div', 'preview-details', previewBody);
                u.el('strong', '', details, 'Project Plan.pdf');
                u.el('p', '', details, '2.4 MB • Modified Jun 6, 2025');
                u.el('button', '', previewBody, 'Open');
                if (C.aside === 'Your Answer') {
                  u.el('p', '', _c.aside, 'No point selected yet.');
                  u.el('hr', '', _c.aside);
                  u.el('p', '', _c.aside, 'X:    —');
                  u.el('p', '', _c.aside, 'Y:    —');
                } else if (C.aside === 'Progress') {
                  u.el('p', '', _c.aside, 'Problem 1 of 5');
                  u.el('progress', '', _c.aside).value = 0.2;
                  u.el('h3', '', _c.aside, 'Tips');
                  u.el('p', '', _c.aside, 'Click outside the dotted circle.');
                } else if (C.layout === 'windows') u.el('p', '', _c.aside, ctx.instruction);
                else if (C.theme === 'crop-minimal')
                  u.el('p', '', _c.aside, 'Drag the handles to resize the crop box.');
                else if (C.layout === 'palette') {
                  const ol = u.el('ol', 'guide', _c.aside);
                  for (const t of [
                    'Drag each handle to the target value.',
                    'Keep the lower value on the left and the higher value on the right.',
                    'Do not click on the track.',
                  ])
                    u.el('li', '', ol, t);
                }
              }
            }
          },
      },
    },
  });
})();
