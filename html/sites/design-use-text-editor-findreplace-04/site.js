// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { content, local, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (true) {
        rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Studio');
        brand.dataset.role = 'brand';
      }
      if (true) {
        const n = util.el('nav', 'ref-nav', header);
        local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        for (const label of ['Files', 'Edit', 'View', 'Run', 'Tools', 'Help']) {
          const a = util.el('a', 'ref-navlink', n, label);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      const actions = util.el('div', 'studio-actions', header);
      util.el('span', 'studio-search', actions, '⌕');
      util.el('i', '', actions);
      util.el('span', 'studio-avatar', actions, 'JD');
      Object.assign(_c, { actions, headerTools, submit });
    },
    'frame.panel': (base, S) => function (_c) {
      const { body, ctx, display, lr, rng, util, word } = _c;
      const { K } = S;
      if (display === 'panel') {
        const panel = util.el('aside', 'ref-panel', body);
        const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
        if (rng.bool(0.5)) body.classList.add('ref-panel-right');
      }
      const rail = util.el('aside', 'app-rail', body);
      for (const [icon, label] of [['▤','Documents'],['▰','Projects'],['◷','Recent'],['☆','Bookmarks'],['⌕','Search'],['⚙','Settings']]) {
        const item = util.el('div', 'app-rail-item', rail);
        util.el('span', '', item, icon);
        util.el('small', '', item, label);
      }
      Object.assign(_c, { rail });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const doc = util.el('section', 'doc-preview', body);
      const tabs = util.el('div', 'doc-tabs', doc);
      util.el('span', 'doc-tab', tabs, '▣  Notes.doc');
      util.el('span', 'doc-plus', tabs, '+');
      const toolbar = util.el('div', 'doc-toolbar', doc);
      for (const label of ['Normal Text⌄', 'B', 'I', 'U', '☷', '☰', '☷', '☷', '↗', '▧', 'Editing⌄']) util.el('span', '', toolbar, label);
      const paper = util.el('article', 'doc-paper', doc);
      util.el('h1', '', paper, 'Project Overview');
      util.el('p', '', paper, 'This document outlines the layout and content structure for the new website.');
      util.el('p', '', paper, 'The page uses a centered container with a fixed width. The margin around the container ensures the content is visually balanced on a range of screen sizes.');
      util.el('h2', '', paper, 'Layout Details');
      util.el('p', '', paper, 'The header has a light background and a small margin to separate it from the rest of the page. Each section in the content area uses consistent margin values to maintain rhythm and spacing.');
      util.el('p', '', paper, 'Navigation items are displayed inline with a right margin. The sidebar sits to the right of the main content with a left margin.');
      util.el('h2', '', paper, 'Additional Notes');
      util.el('p', '', paper, 'When adjusting the design, keep the margin values consistent across breakpoints. Larger margin values can help improve readability, but the margin should not be so large that it creates excessive empty space.');
      Object.assign(_c, { doc, paper, stage, tabs, toolbar });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-text-editor-findreplace-04',
    template: 'site/base',
    design: { parts },
  });
})();
