// Design on templates/site/click-point-bisect-03.js: only what this site changed.
(function () {
  'use strict';
  function newFrame(ctx) {
    const u = ctx.util,
      body = document.body;
    body.className = 'design eink08' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
    const root = document.documentElement;
    for (const [k, v] of Object.entries({
      bg: '#ecebe7',
      panel: '#f8f8f5',
      fg: '#111',
      muted: '#555',
      line: '#111',
      accent: '#111',
    }))
      root.style.setProperty('--' + k, v);
    root.style.setProperty('--font', 'Georgia, "Times New Roman", serif');
    const win = u.el('div', 'e8-window', body);
    const tb = u.el('div', 'e8-titlebar', win);
    const doc = u.svg(
      'svg',
      {
        class: 'e8-doc',
        width: 22,
        height: 24,
        viewBox: '0 0 22 24',
        fill: 'none',
        stroke: '#111',
        'stroke-width': 1.7,
      },
      tb,
    );
    u.svg('path', { d: 'M2 1H14L20 7V23H2ZM14 1V7H20M5 10H17M5 14H17M5 18H17M5 21H17' }, doc);
    u.el('span', 'e8-title', tb, 'Project Notes');
    const wc = u.el('div', 'e8-wc', tb);
    for (const [lab, d] of [
      ['min', 'M3 12H17'],
      ['max', 'M3 3H17V17H3Z'],
      ['close', 'M3 3L17 17M17 3L3 17'],
    ]) {
      const b = u.el('button', '', wc);
      b.type = 'button';
      const s = u.svg(
        'svg',
        { width: 20, height: 20, viewBox: '0 0 20 20', fill: 'none', stroke: '#111', 'stroke-width': 2 },
        b,
      );
      u.svg('path', { d }, s);
      b.onclick = () => env.log('window-control', { label: lab });
    }
    const menu = u.el('nav', 'e8-menu', win);
    for (const t of ['File', 'Edit', 'View', 'Note', 'Window', 'Help']) u.el('span', '', menu, t);
    const content = u.el('div', 'e8-content', win);
    const head = u.el('div', 'e8-head', content);
    const hl = u.el('div', 'e8-headl', head);
    u.el('h1', '', hl, 'Website Redesign');
    const cr = u.el('div', 'e8-crumbs', hl);
    for (const [i, t] of ['Plan', 'Content', 'Feedback'].entries()) {
      if (i) u.el('i', '', cr, '/');
      u.el('span', '', cr, t);
    }
    const note = u.el('section', 'task-note e8-note', head);
    u.el('div', 'note-label', note, '');
    u.el('div', 'instruction', note, ctx.instruction);
    if (ctx.display === 'hidden') note.hidden = true;
    else if (ctx.display === 'toast') {
      note.classList.add('instruction-toast');
      const x = u.el('button', 'note-close', note, '×');
      x.onclick = () => (note.style.visibility = 'hidden');
    } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
    const work = u.el('div', 'e8-work', content);
    const notes = u.el('section', 'e8-notes', work);
    u.el('h2', '', notes, 'Design Notes');
    const nb = u.el('div', 'e8-notes-body', notes);
    const ul = u.el('ul', '', nb);
    for (const t of [
      'Simplify the navigation structure.',
      'Use clearer headings on the homepage.',
      'Improve contrast for accessibility.',
      'Keep the content focused and scannable.',
      'Align visuals with the updated brand.',
    ])
      u.el('li', '', ul, t);
    u.el('div', 'e8-scroll', nb);
    const stage = u.el('main', 'stage e8-stage', work);
    stage.dataset.role = 'stage';
    const footer = u.el('footer', 'footer e8-footer', win);
    const lab = u.el('label', 'e8-check', footer);
    const cb = u.el('input', '', lab);
    cb.type = 'checkbox';
    u.el('span', '', lab, 'Show resolved comments');
    const reset = u.el('button', 'clear e8-reset', footer, 'Reset Panel');
    reset.type = 'button';
    reset.onclick = () => env.widgetDef.clear?.();
    const labels =
      ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
        ? ctx.content.END_LABELS
        : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', '✓'];
    const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
    const endRng = ctx.rng.fork('chrome/end');
    const placement = ctx.finish ? null : endRng.pick(['footer', 'footer', 'footer', 'menu', 'title']);
    const submitOptions = labels.map(labelOf).filter((x) => x.trim().toLowerCase() === 'submit');
    const alternateOptions = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== 'submit');
    const endLabel = ctx.finish
      ? 'Submit'
      : endRng.bool(0.5)
        ? submitOptions[0] || 'Submit'
        : alternateOptions.length
          ? endRng.pick(alternateOptions)
          : submitOptions[0] || 'Submit';
    let submit = null;
    if (!ctx.finish) {
      const parent = placement === 'title' ? tb : placement === 'menu' ? menu : footer;
      submit = u.el('button', 'submit e8-submit e8-submit-' + placement, parent, endLabel);
      submit.type = 'button';
      submit.dataset.role = 'submit';
      submit.onclick = () => ctx.submit();
    }
    const collideRng = ctx.rng.fork('chrome/collide');
    if (!ctx.finish && collideRng.bool(0.3)) {
      const options = [...new Set(labels.map(labelOf))].filter(
        (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
      );
      if (options.length) {
        const b = u.el('button', 'e8-xtra', menu, collideRng.pick(options));
        b.type = 'button';
        b.onclick = () => env.log('decoy', { label: b.textContent, collide: true });
      }
    }
    const pal = u.el('aside', 'e8-palette', body);
    const ph = u.el('div', 'e8-palhead', pal);
    u.el('span', '', ph, 'Tools');
    const px = u.svg(
      'svg',
      { width: 18, height: 18, viewBox: '0 0 20 20', fill: 'none', stroke: '#111', 'stroke-width': 2 },
      ph,
    );
    u.svg('path', { d: 'M3 3L17 17M17 3L3 17' }, px);
    const icons = {
      Select: 'M4 2V24L10 18L14 27L18 25L14 16H22Z',
      Rectangle: 'M3 3H25V25H3Z',
      Ellipse: 'M14 3A11 11 0 1 1 14 25A11 11 0 1 1 14 3Z',
      Text: 'M3 2H25V8H23V4H16V24H20V26H8V24H12V4H5V8H3Z',
      Zoom: 'M11 2A9 9 0 1 1 11 20A9 9 0 1 1 11 2ZM18 18L27 27',
    };
    for (const n of ['Select', 'Rectangle', 'Ellipse', 'Text', 'Zoom']) {
      const b = u.el('button', 'e8-tool' + (n === 'Select' ? ' selected' : ''), pal);
      b.type = 'button';
      const s = u.svg(
        'svg',
        {
          width: 30,
          height: 30,
          viewBox: '0 0 28 28',
          fill: n === 'Select' || n === 'Text' ? '#111' : 'none',
          stroke: '#111',
          'stroke-width': n === 'Text' ? 0 : 2.2,
          'stroke-dasharray': n === 'Rectangle' ? '6 3' : '0',
        },
        b,
      );
      u.svg('path', { d: icons[n] }, s);
      u.el('span', '', b, n);
      b.onclick = () => {
        pal.querySelectorAll('.e8-tool').forEach((x) => x.classList.remove('selected'));
        b.classList.add('selected');
      };
    }
    return { stage, submit };
  }
  env.site({
    name: 'design-resize-element-ghost-08',
    styles: ['site.css', 'theme.css'],
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
            return newFrame(ctx);
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
