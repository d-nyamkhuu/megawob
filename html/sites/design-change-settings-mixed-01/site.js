// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { ACCENTS, LOW_ACCENTS, LOW_THEME, THEMES } = S;
      const { rng, util, content } = ctx;
      let name = rng.pick(Object.keys(THEMES));
      const root = document.documentElement;
      let accent = rng.pick(ACCENTS);
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name])) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', accent);
      root.style.setProperty('--accent', '#1683e8');
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.layout': (base, S) => function (_c) {
      const { ctx, util } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      // OfficeSuite 2008 window frame and document index.
      const titlebar = util.el('div', 'office-titlebar', document.body);
      util.el('span', 'office-appmark', titlebar, '▣');
      util.el('span', 'office-apptitle', titlebar, 'OfficeSuite');
      const windowButtons = util.el('div', 'office-window-buttons', titlebar);
      for (const glyph of ['−', '□', '×']) util.el('span', 'office-window-button', windowButtons, glyph);
      const menubar = util.el('nav', 'office-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Tools', 'Help']) util.el('span', 'office-menu-item', menubar, item);
      const toolbar = util.el('div', 'office-toolbar', document.body);
      [['▤','New'], ['📂','Open'], ['▣','Print'], ['✂','Cut'], ['▧','Copy'], ['▤','Paste'], ['↶','Undo'], ['↷','Redo']].forEach(([icon, label]) => {
        const item = util.el('div', 'office-tool', toolbar);
        util.el('span', 'office-tool-icon', item, icon);
        util.el('span', '', item, label);
      });
      const roomy = W >= 1260;
      const tall = H >= 800;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      Object.assign(_c, { H, W, display, menubar, roomy, tall, titlebar, toolbar, windowButtons });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      document.body.classList.toggle('office-no-instruction', display === 'hidden');
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, display, endBtn, header, label, placement, toolbar, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      if (display === 'hidden') toolbar.appendChild(headerTools);
      Object.assign(_c, { headerTools, submit });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, name, rng, sidebar, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      // Keep the sibling's random draws consumed, while this design has its persistent record index.
      if (sidebar) rng.sample(content.NAV_ITEMS, rng.int(4, 7));
      const side = util.el('aside', 'office-documents', body);
      util.el('div', 'office-documents-heading', side, 'Documents');
      const records = [
        ['▤','Project Plan.doc','Apr 14, 2008'], ['▤','Meeting Notes.doc','Apr 11, 2008'], ['▤','Research Summary.doc','Apr 9, 2008'],
        ['▥','Budget Overview.xls','Apr 8, 2008'], ['▤','Marketing Brief.doc','Apr 6, 2008'], ['▤','Product Roadmap.doc','Apr 4, 2008'],
        ['▧','Design Mockup.ppt','Apr 2, 2008'], ['▤','Team Update.doc','Mar 28, 2008'], ['▤','Customer Feedback.doc','Mar 26, 2008'],
        ['▥','Launch Checklist.xls','Mar 24, 2008'], ['▤','Website Content.doc','Mar 20, 2008'], ['▤','Press Release.doc','Mar 18, 2008']
      ];
      records.forEach(([icon, name, date], i) => {
        const row = util.el('div', `office-record${i === 0 ? ' selected' : ''}`, side);
        util.el('span', 'office-record-icon', row, icon);
        const copy = util.el('div', 'office-record-copy', row);
        util.el('div', 'office-record-name', copy, name);
        util.el('div', 'office-record-date', copy, date);
      });
      Object.assign(_c, { body, records, side });
    },
    'frame.stage': (base) => function (_c) {
      base(_c);
      _c.stage.style.justifyContent = 'center';
      _c.stage.style.alignItems = 'flex-start';
    },
  };

  env.site({
    name: 'design-change-settings-mixed-01',
    template: 'site/base',
    design: { parts },
  });
})();
