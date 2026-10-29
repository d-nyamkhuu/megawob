// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  function workspace(ctx) {
    const u = ctx.util,
      body = document.body;
    body.className = 'design notecraft layout-workspace';
    const root = document.documentElement;
    for (const [k, v] of Object.entries({
      bg: '#f7f4ea', panel: '#fff', fg: '#10143f', muted: '#596087', line: '#c9cce0', accent: '#1676d2',
    }))
      root.style.setProperty('--' + k, v);
    root.style.setProperty('--font', 'Arial, "Segoe UI", sans-serif');
    const shell = u.el('div', 'shell', body),
      head = u.el('header', 'head', shell),
      brandrow = u.el('div', 'brand-row', head);
    u.el('strong', 'brand', brandrow, 'NoteCraft');
    u.el('div', 'brand-mark', brandrow);
    const menu = u.el('nav', 'menu', head);
    for (const label of ['File','Edit','View','Note','Format','Tools','Help']) u.el('span', '', menu, label);
    const bar = u.el('div', 'toolbar', head);
    for (const [path,label] of [
      ['M5 2h10l6 6v14H5z M15 2v6h6 M9 13h8 M9 17h8','New Note'],
      ['M2 7h8l2 3h10v12H2z M2 10V4h8l3 3','Open'],
      ['M6 7h14l-1 16H7z M4 4h18 M9 4V2h8v2 M10 10v9 M16 10v9','Delete'],
      ['M3 12 13 2h9v9L12 21z M17 7h.1','Tag'],
      ['M3 5h9v5H3z M12 14h9v5h-9z M12 7l4 3-4 3 M12 12l-4 2','Move'],
    ]) {
      const b = u.el('button', 'tool', bar); b.type = 'button';
      const svg=u.svg('svg',{viewBox:'0 0 26 26',fill:'none',stroke:'#10143f','stroke-width':'2.2','stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true'},b);
      u.svg('path',{d:path},svg); u.el('span', '', b, label);
    }
    const search = u.el('div', 'header-search', bar);
    u.el('span', 'search-icon', search, '⌕'); u.el('span', '', search, 'Search notes...');
    const note = u.el('section', 'task-note', head);
    u.el('div', 'instruction', note, ctx.instruction);
    if (ctx.display === 'hidden') note.hidden = true;
    else if (ctx.display === 'toast') {
      note.classList.add('instruction-toast');
      const x = u.el('button', 'note-close', note, '×');
      x.onclick = () => (note.style.visibility = 'hidden');
    } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
    if (ctx.display === 'panel' || ctx.display === 'toast') {
      if (shell.clientWidth <= 1100) {
        note.className = 'task-note';
        body.classList.add('instruction-in-header');
      } else body.classList.add('instruction-in-' + ctx.display);
    } else if (ctx.display === 'header') body.classList.add('instruction-in-header');
    const main = u.el('div', 'content', shell), list = u.el('aside', 'channel-list', main);
    if (ctx.display === 'panel' && !body.classList.contains('instruction-in-header')) list.appendChild(note);
    const squiggle = u.svg('svg', {viewBox:'0 0 180 160', 'aria-hidden':'true', class:'sidebar-squiggle'}, list);
    u.svg('path', {d:'M4 152C22 100 59 140 71 104S125 97 134 57 149 26 172 4', fill:'none', stroke:'#10143f', 'stroke-width':'6'}, squiggle);
    for (const [path,label] of [
      ['M5 3h15v20H5z M8 7h9 M8 11h9 M8 15h7','All Notes'],
      ['M2 7h9l2 3h11v12H2z M2 10V5h8','Projects'],
      ['M13 2c-3 0-5 2-5 5 0 2 1 3 2 4v3h7v-3c1-1 2-2 2-4 0-3-2-5-6-5z M10 17h7 M11 20h5','Ideas'],
      ['M4 5h18v17H4z M8 5V2h10v3 M8 9h10','Archive'],
      ['M6 7h14l-1 16H7z M4 4h18 M9 4V2h8v2','Trash'],
    ]) {
      const row = u.el('div', 'channel-row' + (label === 'Projects' ? ' selected' : ''), list), icon=u.svg('svg',{viewBox:'0 0 26 26',fill:'none',stroke:'#10143f','stroke-width':'2','stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true'},row);
      u.svg('path',{d:path},icon); u.el('span','',row,label);
    }
    const desktop = u.el('div','desktop',main), stage = u.el('main', 'stage', desktop);
    stage.dataset.role = 'stage';
    const inspector = u.el('aside','inspector',main);
    u.el('div','geometry-dots',inspector);
    u.el('h2','',inspector,'Note Properties');
    for (const [label,value] of [['Title','Q3 Planning'],['Notebook','Projects'],['Tags','planning, q3, roadmap'],['Modified','Apr 12, 2017  10:24 AM'],['Created','Apr 01, 2017  9:15 AM'],['Size','4.8 KB']]) {
      const field=u.el('div','property',inspector); u.el('label','',field,label);
      if (label==='Size') u.el('div','property-value plain',field,value);
      else { const input=u.el(label==='Notebook'?'button':'div','property-value',field,value); if(label==='Notebook') input.type='button'; }
    }
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
    const actions = u.el('div', 'workspace-actions', bar);
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
    if (body.classList.contains('instruction-in-header')) main.style.top = head.getBoundingClientRect().height + 'px';
    return { stage, submit };
  }
  env.site({
    name: 'design-resize-element-split-05',
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
        'overlay': (base, S) => function (ctx) {
          const result = base(ctx);
          if (ctx.kind !== 'promo') return result;
          const u = ctx.util, box = result.el;
          box.className = 'nc-promo';
          const dismiss = result.dismiss;
          box.replaceChildren();
          u.el('div', 'newsletter-icon', box, '✉');
          const close = u.el('button', 'newsletter-close', box, '×');
          close.type = 'button'; close.setAttribute('aria-label', 'Close');
          close.onclick = () => ctx.dismiss('close');
          u.el('h2', '', box, 'Get the latest from NoteCraft');
          u.el('p', '', box, 'Tips, new features and productivity ideas delivered to your inbox.');
          const email = u.el('input', 'newsletter-email', box);
          email.placeholder = 'Your email address'; email.type = 'email';
          const row = u.el('div', 'newsletter-actions', box);
          const subscribe = u.el('button', 'newsletter-subscribe', row, 'Subscribe');
          subscribe.type = 'button'; subscribe.onclick = () => env.log('overlay-click', { label: 'Subscribe' });
          dismiss.textContent = 'Not now';
          row.appendChild(dismiss);
          return result;
        },
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
