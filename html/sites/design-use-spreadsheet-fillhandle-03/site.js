// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { content, ctx, display, label, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      // Keep legacy frame draws stable; the visible frame is this design's GEM desktop.
      if (display !== 'header' || nav) rng.pick(TITLES);
      if (nav) local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
      const menu = util.el('div', 'ref-menubar', header);
      util.el('span', 'ref-apple', menu, '◆');
      for (const item of ['Desk', 'File', 'Edit', 'View', 'Workbook', 'Format', 'Data', 'Window', 'Help']) util.el('span', 'ref-menuitem', menu, item);
      util.el('span', 'ref-clock', menu, 'Mon  Mar 17 1986  10:24 AM');
      const body = util.el('div', 'ref-body', document.body);
      const frame = util.el('div', 'ref-frame', body);
      const tabs = util.el('nav', 'ref-nav', frame);
      const navItems = [['▤', 'Workbook'], ['▥', 'Reports'], ['▱', 'Data'], ['▣', 'Print'], ['⚙', 'Settings']];
      for (const [i, [icon, item]] of navItems.entries()) {
        const a = util.el('a', `ref-navlink${i === 0 ? ' is-active' : ''}`, tabs);
        util.el('span', 'ref-navicon', a, icon);
        util.el('span', 'ref-navlabel', a, item);
        a.dataset.role = 'nav';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
      }
      const work = util.el('div', 'ref-work', frame);
      const titlebar = util.el('div', 'ref-titlebar', work);
      util.el('span', 'ref-window-glyph', titlebar, '▣');
      util.el('span', 'ref-window-title', titlebar, 'Workbook  -  Project Budget');
      const hero = util.el('div', 'ref-title-note', titlebar);
      if (display === 'header') util.el('div', 'ref-instruction', hero, ctx.instruction);
      const decoyBtn = (parent, text, collides) => {
        const b = util.el('button', 'ref-xtra', parent, text);
        b.type = 'button'; b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', collides ? { label: text, collide: true } : { label: text }));
      };
      const endBtn = (parent, cls, text) => {
        const b = util.el(cls === 'ref-endlink' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button'; else b.href = '#';
        b.dataset.role = 'submit'; b.setAttribute('aria-label', label); b.title = label;
        b.addEventListener('click', (e) => { e.preventDefault(); ctx.submit(); });
        return b;
      };
      const headerTools = util.el('div', 'ref-tools', titlebar);
      Object.assign(_c, { body, decoyBtn, endBtn, frame, header, headerTools, hero, menu, navItems, tabs, titlebar, work });
    },
    'frame.tools': (base, S) => function (_c) {
      const { body, collide, content, ctx, decoyBtn, decoys, display, endBtn, headerTools, label, local, lr, placement, rng, sidebar, titlebar, util, wantFooter, word, work } = _c;
      const { K } = S;
      let submit = null;
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      util.el('button', 'ref-window-close', titlebar, '×');
      const contentArea = util.el('div', 'ref-content', work);
      const stage = util.el('main', 'ref-stage', contentArea);
      const summary = util.el('aside', 'ref-summary', contentArea);
      util.el('div', 'ref-summary-head', summary, 'Summary');
      if (sidebar) local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
      if (display === 'panel') {
        const panel = util.el('div', 'ref-panel', summary);
        const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
        if (rng.bool(0.5)) body.classList.add('ref-panel-right');
      }
      Object.assign(_c, { contentArea, stage, submit, summary });
    },
    'frame.stage': (base, S) => function (_c) {
      const { stage, summary, util } = _c;
      S.frameAlign(_c, stage);
      const statsSection = (title, rows) => {
        const section = util.el('section', 'ref-summary-section', summary);
        util.el('div', 'ref-summary-label', section, title);
        for (const [k, v] of rows) { const row = util.el('div', 'ref-summary-row', section); util.el('span', '', row, k); util.el('span', '', row, v); }
      };
      statsSection('Items', [['Total rows:', '36'], ['Visible rows:', '36'], ['Selected cells:', '2'], ['Filled cells:', '141'], ['Blank cells:', '3']]);
      statsSection('Forecast', [['Total:', '5,024.00'], ['Average:', '139.56'], ['Minimum:', '10.00'], ['Maximum:', '750.00']]);
      statsSection('Notes', [['Site A:', '6'], ['Site B:', '10'], ['Site C:', '10'], ['Office:', '7'], ['Lab:', '3']]);
      Object.assign(_c, { statsSection });
    },
    'frame.nav': (base, S) => function (_c) {
    },
    'frame.instruction': (base, S) => function (_c) {
    },
    'frame.controls': (base, S) => function (_c) {
    },
    'frame.body': (base, S) => function (_c) {
    },
    'frame.panel': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-spreadsheet-fillhandle-03',
    template: 'site/base',
    design: { parts },
  });
})();
