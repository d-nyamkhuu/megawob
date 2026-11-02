// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  function workspace(ctx) {
    const u = ctx.util,
      body = document.body;
    body.className = 'design material layout-workspace';
    const root = document.documentElement;
    for (const [k, v] of Object.entries({
      bg: '#eaf2fc',
      panel: '#fff',
      fg: '#132344',
      muted: '#586c91',
      line: '#d8e3f2',
      accent: '#1769d2',
    }))
      root.style.setProperty('--' + k, v);
    root.style.setProperty('--font', 'Arial, sans-serif');
    const shell = u.el('div', 'shell', body),
      head = u.el('header', 'head', shell),
      nav = u.el('nav', 'menu', head);
    for (const [i, label] of ['Channels', 'Messages', 'Files', 'People', 'Settings'].entries()) {
      const b = u.el('button', 'workspace-tab' + (!i ? ' active' : ''), nav);
      b.type = 'button';
      u.el('span', 'tab-icon', b, ['●', '✉', '▣', '♟', '⚙'][i]);
      u.el('span', '', b, label);
    }
    const search = u.el('div', 'header-search', head);
    u.el('span', 'search-icon', search, '⌕');
    u.el('span', '', search, 'Search channels');
    u.el('div', 'header-account', head, 'JD');
    const band = u.el('section', 'team-band', shell),
      cover = u.el('div', 'team-cover', band, '🏔'),
      info = u.el('div', 'team-info', band);
    u.el('h1', '', info, 'Pinecrest Team');
    u.el('div', 'team-meta', info, '8 members　·　6 channels');
    u.el('div', 'team-desc', info, 'Planning, progress and resources for our 2024 mountain season.');
    const tags = u.el('div', 'team-tags', info);
    for (const t of ['Outdoors', 'Planning', 'Operations', 'Team']) u.el('span', '', tags, t);
    const note = u.el('section', 'task-note', band);
    u.el('div', 'instruction', note, ctx.instruction);
    if (ctx.display === 'hidden') note.hidden = true;
    else if (ctx.display === 'toast') {
      note.classList.add('instruction-toast');
      const x = u.el('button', 'note-close', note, '×');
      x.onclick = () => (note.style.visibility = 'hidden');
    } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
    const main = u.el('div', 'content', shell),
      list = u.el('aside', 'channel-list', main);
    u.el('div', 'list-title', list, 'Channels');
    for (const [i, row] of [
      ['General', 'Team update on trail work', '3', '10:14 AM'],
      ['Trail Plans', 'Map revisions ready', '1', '9:02 AM'],
      ['Equipment', 'New tents have arrived', '', '8:47 AM'],
      ['Safety', 'Review weather protocol', '2', 'Yesterday'],
      ['Volunteer Coord', 'April schedule draft', '', 'Yesterday'],
      ['Permits', 'Application submitted', '', 'Apr 22'],
      ['Finance', 'Q2 budget overview', '', 'Apr 21'],
      ['Social Media', 'Photos from last hike', '', 'Apr 20'],
    ].entries()) {
      const item = u.el('div', 'channel-row' + (!i ? ' selected' : ''), list);
      u.el('span', 'hash', item, '#');
      const tx = u.el('div', 'channel-text', item);
      u.el('strong', '', tx, row[0]);
      u.el('span', '', tx, row[1]);
      const meta = u.el('div', 'channel-meta', item);
      if (row[2]) u.el('b', '', meta, row[2]);
      u.el('span', '', meta, row[3]);
    }
    const stage = u.el('main', 'stage', main);
    stage.dataset.role = 'stage';
    const rng = ctx.rng.fork('chrome/end'),
      labels = (ctx.content && ctx.content.END_LABELS) || [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
      ],
      place = ctx.finish ? null : rng.pick(['toolbar', 'toolbar', 'toolbar', 'footer', 'footer-link']),
      label = rng.bool(0.5) ? 'Apply' : rng.pick(labels),
      cr = ctx.rng.fork('chrome/collide');
    let decoy = null;
    if (!ctx.finish && cr.bool(0.3)) {
      const opts = [...new Set(labels)].filter((x) => String(x).toLowerCase() !== String(label).toLowerCase());
      if (opts.length) decoy = cr.pick(opts);
    }
    const actions = u.el('div', 'workspace-actions', head);
    if (decoy) {
      const d = u.el('button', 'xtra-end', actions, decoy);
      d.type = 'button';
      d.onclick = () => env.log('decoy', { label: decoy, collide: true });
    }
    let submit = null;
    if (!ctx.finish && place === 'toolbar') {
      submit = u.el('button', 'submit submit-toolbar', actions, label);
      submit.type = 'button';
      submit.dataset.role = 'submit';
      submit.onclick = () => ctx.submit();
    }
    const footer = u.el('footer', 'footer', shell);
    if (!ctx.finish && place !== 'toolbar') {
      submit = u.el('button', 'submit ' + (place === 'footer-link' ? 'submit-link' : ''), footer, label);
      submit.type = 'button';
      submit.dataset.role = 'submit';
      submit.onclick = () => ctx.submit();
    }
    return { stage, submit };
  }
  env.site({
    name: 'design-resize-element-split-01',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'ledger',
        'theme': 'gtk',
        'title': 'Landscape.jpg – GIMP',
        'menu': 'File Edit Select View Image Layer Colors Tools Filters Windows Help',
        'foot': 'Landscape.jpg (1.2 MB)',
        'accent': '#4b78a8',
        'bg': '#e8e6e1',
        'surface': '#f5f4f0',
        'font': 'Arial, sans-serif',
      },
      parts: {
        'frame.1': (base, S) =>
          function (_c) {
            const { ctx } = _c;
            if ((ctx.spec || {}).scenario === 'split') return workspace(ctx);
            const u = ctx.util,
              body = document.body;
            Object.assign(_c, { body, u });
          },
        'frame.3': () => () => {},
        'frame.11': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (C.menu) {
              const nav = u.el('nav', 'menu', head);
              for (const label of [
                'File',
                'Edit',
                'Select',
                'View',
                'Image',
                'Layer',
                'Colors',
                'Tools',
                'Filters',
                'Windows',
                'Help',
              ])
                u.el('span', '', nav, label);
            }
            const search = u.el('div', 'header-search', head);
            u.el('span', 'search-icon', search);
            u.el('span', '', search, 'Search');
            const account = u.el('div', 'header-account', head);
            u.el('span', 'account-icon', account);
            u.el('span', '', account, 'Alex Chen');
            u.el('span', '', account, '▾');
            Object.assign(_c, { account, search });
          },
        'frame.19': (base, S) =>
          function (_c) {
            const { content, ctx, u } = _c;
            const endRng = ctx.rng.fork('chrome/end'),
              endLabels = (ctx.content && ctx.content.END_LABELS) || [
                'Submit',
                'Done',
                'Finish',
                'Continue',
                'Save',
                'OK',
                'Confirm',
                'Apply',
                'Complete',
                "I'm done",
              ];
            const endPlacement = ctx.finish ? null : endRng.pick(['footer', 'footer', 'toolbar', 'footer-link']);
            const endLabel = endRng.pick(endLabels);
            const collideRng = ctx.rng.fork('chrome/collide');
            _c.collide = null;
            if (!ctx.finish && collideRng.bool(0.3)) {
              const choices = [
                ...new Set(
                  endLabels.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x))),
                ),
              ].filter((x) => x.trim().toLowerCase() !== String(endLabel).trim().toLowerCase());
              if (choices.length)
                _c.collide = { label: collideRng.pick(choices), where: collideRng.pick(['toolbar', 'footer']) };
            }
            const decoyBtn = (parent, label, colliding) => {
              const b = u.el('button', 'xtra-end', parent, label);
              b.type = 'button';
              b.dataset.role = 'xtra';
              b.onclick = () => env.log('decoy', colliding ? { label, collide: true } : { label });
              return b;
            };
            const endBtn = (parent, cls) => {
              const b = u.el('button', 'submit ' + cls, parent, endLabel);
              b.type = 'button';
              b.dataset.role = 'submit';
              b.setAttribute('aria-label', endLabel);
              b.title = endLabel;
              b.onclick = () => ctx.submit();
              return b;
            };
            const ledger = u.el('section', 'resize-ledger', content);
            const ledgerHead = u.el('div', 'ledger-head', ledger);
            const ledgerTitle = u.el('h2', '', ledgerHead);
            const chart = u.el('span', 'ledger-chart', ledgerTitle);
            for (let i = 0; i < 4; i++) u.el('i', '', chart);
            u.el('span', '', ledgerTitle, 'Ledger');
            const period = u.el('button', 'ledger-period', ledgerHead, 'This Month');
            const add = u.el('button', 'ledger-add', ledgerHead, 'Add Transaction');
            add.onclick = () => env.log('ledger-add');
            if (_c.collide && _c.collide.where === 'toolbar') decoyBtn(ledgerHead, _c.collide.label, true);
            _c.submit = null;
            if (endPlacement === 'toolbar') _c.submit = endBtn(ledgerHead, 'submit-toolbar');
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
            Object.assign(_c, {
              add,
              chart,
              collideRng,
              decoyBtn,
              endBtn,
              endLabel,
              endLabels,
              endPlacement,
              endRng,
              ledger,
              ledgerHead,
              ledgerTitle,
              period,
              stage,
              table,
              tr,
            });
          },
        'frame.22': (base, S) =>
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
        'frame.23': () => () => {},
        'frame.26': (base, S) =>
          function (_c) {
            const { ctx, decoyBtn, endBtn, endPlacement, footer } = _c;
            if (_c.collide && _c.collide.where === 'footer') decoyBtn(footer, _c.collide.label, true);
            if (!ctx.finish && (endPlacement === 'footer' || endPlacement === 'footer-link'))
              _c.submit = endBtn(footer, endPlacement === 'footer-link' ? 'submit-link' : '');
          },
        'frame.27': () => () => {},
      },
    },
  });
})();
