// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) =>
      function overlay(ctx) {
        const { K } = S;
        const { rng, util, kind } = ctx;
        const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
        const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
        const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
        el.dataset.role = 'overlay';
        const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
        util.el(
          'div',
          'ref-ov-text',
          box,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
        const row = util.el('div', 'ref-ov-row', box);
        const btn = (label, how, primary) => {
          if (word && K.button[label]) label = word(K.button[label]);
          const b = util.el('button', primary ? 'ref-ov-btn ref-ov-primary' : 'ref-ov-btn', row, label);
          b.type = 'button';
          b.addEventListener('click', () => (how ? ctx.dismiss(how) : env.log('overlay-click', { label })));
          return b;
        };
        let dismiss;
        if (kind === 'cookie') {
          if (rng.bool(0.5)) btn('Settings', null, false);
          btn(rng.pick(['Reject all', 'Necessary only']), 'reject', false);
          dismiss = btn(rng.pick(['Accept all', 'Accept', 'Got it']), 'accept', true);
        } else if (kind === 'promo') {
          dismiss = btn(rng.pick(['No thanks', 'Maybe later', 'Close']), 'close', false);
          btn(rng.pick(['Upgrade now', 'Start trial', 'Learn more']), null, true);
        } else if (kind === 'banner') {
          dismiss = btn('Dismiss', 'close', false);
        } else {
          dismiss = btn('×', 'close', false);
          dismiss.setAttribute('aria-label', word ? word('close') : 'Close');
        }
        if (kind === 'promo') {
          const title = util.el('div', 'motif-dialog-title', box, 'Stay in the loop');
          box.prepend(title);
          const close = util.el('button', 'motif-dialog-close', title, '×');
          close.type = 'button';
          close.setAttribute('aria-label', word ? word('close') : 'Close');
          close.addEventListener('click', () => ctx.dismiss('close'));
          const fields = util.el('label', 'motif-promo-field', box);
          util.el('span', '', fields, 'Email address:');
          const input = util.el('input', '', fields);
          input.type = 'text';
          box.insertBefore(fields, row);
        }
        if (kind === 'cookie' || kind === 'chat') {
          const end = document.querySelector('[data-role="submit"]');
          const er = end?.getBoundingClientRect();
          const pageHeight = document.body.getBoundingClientRect().height;
          if (er && er.top > pageHeight / 2) el.style.bottom = pageHeight - er.top + 12 + 'px';
        }
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.lang': (base, S) =>
      function (_c) {
        const { ctx, rng, util } = _c;
        // Localized frame: same layout draws as English, texts from UI_WORDS (own stream).
        const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
        const lr = rng.fork('chrome/lang');
        const local = (list, keys) => (word ? lr.sample(keys, list.length).map(word) : list);
        const closeLabel = word ? word('close') : 'Close';
        const drawIcon = (parent, kind) => {
          const svg = util.svg('svg', { viewBox: '0 0 48 52', width: 44, height: 48, 'aria-hidden': 'true' }, parent);
          const path = (d, fill = '#d7d9d6', stroke = '#111', sw = 2) =>
            util.svg('path', { d, fill, stroke, 'stroke-width': sw, 'stroke-linejoin': 'miter' }, svg);
          if (kind === 'Logic') {
            path('M16 3h18v14H16zM23 17v10M7 27h34M7 27v8M24 27v8M41 27v8', '#c3cdda');
            path('M1 35h13v13H1zM18 35h13v13H18zM35 35h13v13H35z', '#d3dbe4');
          } else if (kind === 'Design') {
            path('M23 3C9 3 2 14 3 27c1 14 14 23 22 18 7-5-3-9 1-13 4-5 13 0 17-7C49 14 36 2 23 3Z', '#cbd5df');
            for (const [cx, cy] of [
              [13, 15],
              [23, 10],
              [34, 16],
              [12, 28],
            ])
              util.svg('circle', { cx, cy, r: 3, fill: '#5680ae', stroke: '#172633', 'stroke-width': 1.5 }, svg);
          } else if (kind === 'Settings') {
            path(
              'M20 2h8l1 7 5 2 5-4 6 6-4 6 2 4 7 1v8l-7 1-2 4 4 6-6 6-6-4-4 2-1 7h-8l-1-7-5-2-6 4-5-6 4-6-2-4-7-1v-8l7-1 2-4-4-6 6-6 6 4 4-2Z',
              '#bdc9d5',
            );
            util.svg('circle', { cx: 24, cy: 28, r: 9, fill: '#c3c1b8', stroke: '#111', 'stroke-width': 2 }, svg);
          } else {
            path(kind === 'Questions' ? 'M8 3h34v46H8Z' : 'M8 3h25l9 9v37H8Z', '#ededeb');
            if (kind !== 'Questions') path('M33 3v10h9', '#b8c5d2');
            for (const y of [21, 30, 39]) {
              if (kind === 'Questions') {
                path(`M13 ${y - 2}h4v4h-4Z`, '#517eaa', 'none');
                path(`M21 ${y}h15`, 'none', '#517eaa', 3);
              } else path(`M14 ${y}h21`, 'none', '#517eaa', 3);
            }
            path('M10 5v42h30', 'none', '#fff', 1);
          }
        };
        Object.assign(_c, { closeLabel, drawIcon, local, lr, word });
      },
    'frame.layout': (base, S) =>
      function (_c) {
        const { ctx, drawIcon, util } = _c;
        const W = window.innerWidth;
        const H = window.innerHeight;
        const roomy = W >= 1260;
        const tall = H >= 700;
        let display = ctx.display || 'header';
        if (display === 'panel' && !roomy) display = 'header';
        if (display === 'toast' && !tall) display = 'header';
        // reset() reuses the body: a previous toast must not shrink later episodes.
        document.body.classList.toggle('ref-has-note', display === 'toast');

        // Motif desktop frame: native title bar and the classic application menu row.
        const winbar = util.el('div', 'motif-titlebar', document.body);
        drawIcon(util.el('span', 'motif-appicon', winbar), 'Surveys');
        util.el('strong', '', winbar, 'Ninebark Landscaping · Workshop survey');
        const wincontrols = util.el('span', 'motif-wincontrols', winbar);
        for (const mark of ['—', '□', '×']) util.el('i', '', wincontrols, mark);
        const menubar = util.el('div', 'motif-menubar', document.body);
        for (const item of ['File', 'Edit', 'View', 'Insert', 'Format', 'Tools', 'Help'])
          util.el('span', '', menubar, item);
        Object.assign(_c, { H, W, display, menubar, roomy, tall, winbar, wincontrols });
      },
    'frame.tools': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, header, label, menubar, placement, util, wantFooter } = _c;
        let submit = null;
        const headerTools = util.el('div', 'ref-tools', header);
        for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
        if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
        if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
        if (placement === 'icon') {
          submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
        }
        menubar.appendChild(headerTools);
        Object.assign(_c, { headerTools, submit });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { drawIcon, util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const rail = util.el('aside', 'motif-rail', body);
        for (const title of ['Surveys', 'Questions', 'Logic', 'Design', 'Settings']) {
          const item = util.el('div', 'motif-rail-item', rail);
          drawIcon(util.el('span', 'motif-rail-icon', item), title);
          util.el('span', '', item, title);
        }
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, rail });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, display, drawIcon, header, util } = _c;
        const contentArea = util.el('div', 'motif-content', body);
        const record = util.el('section', 'motif-record', contentArea);
        drawIcon(util.el('div', 'motif-record-icon', record), 'Surveys');
        const summary = util.el('div', 'motif-record-summary', record);
        util.el('strong', '', summary, 'Ninebark Landscaping · Workshop survey');
        if (display === 'header') summary.appendChild(header.querySelector('.ref-instruction'));
        const facts = util.el('div', 'motif-record-facts', summary);
        for (const [labelText, value] of [
          ['Status:', 'Draft'],
          ['Created:', 'Mar 12, 1991'],
          ['Last modified:', 'Mar 14, 1991'],
          ['Owner:', 'Alex Rivera'],
        ]) {
          const pair = util.el('div', '', facts);
          util.el('span', '', pair, labelText);
          util.el('span', '', pair, value);
        }
        util.el(
          'div',
          'motif-record-description',
          record,
          'Survey to plan upcoming workshop sessions for Ninebark Landscaping staff.',
        );
        if (display === 'panel') record.appendChild(body.querySelector('.ref-panel'));
        const stage = util.el('main', 'ref-stage', contentArea);
        S.frameAlign(_c, stage);
        const records = util.el('aside', 'motif-records', body);
        util.el('strong', 'motif-records-title', records, 'Surveys');
        const columns = util.el('div', 'motif-record-columns', records);
        util.el('span', '', columns, 'Title');
        util.el('span', '', columns, 'Modified');
        for (const [title, date] of [
          ['Ninebark Landscaping · Workshop survey', 'Mar 14, 1991'],
          ['Customer feedback', 'Feb 28, 1991'],
          ['Partner event survey', 'Feb 10, 1991'],
          ['Website usability study', 'Jan 22, 1991'],
          ['Training needs survey', 'Jan 08, 1991'],
          ['Facilities suggestions', 'Dec 18, 1990'],
        ]) {
          const row = util.el('div', 'motif-record-row', records);
          drawIcon(util.el('span', 'motif-record-row-icon', row), 'Surveys');
          util.el('span', 'motif-record-row-name', row, title);
          util.el('span', 'motif-record-row-date', row, date);
        }
        util.el('div', 'motif-index-empty', records);
        const scroll = util.el('div', 'motif-index-scroll', records);
        util.el('span', '', scroll, '◀');
        util.el('i', '', scroll);
        util.el('span', '', scroll, '▶');
        Object.assign(_c, { columns, contentArea, facts, record, records, scroll, stage, summary });
      },
  };

  env.site({
    name: 'design-use-form-builder-addq-01',
    template: 'site/base',
    design: { parts },
  });
})();
