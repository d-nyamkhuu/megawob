// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) rng.pick(TITLES); // retain the scaffold's existing title draw
      const mark = util.el('span', 'brand-mark', header, '●');
      const brand = util.el('div', 'ref-brand', header, 'Relayboard');
      brand.dataset.role = 'brand';
      const links = util.el('nav', 'top-links', header);
      for (const [label, active] of [['Workflows', true], ['Runs', false], ['Connections', false], ['Library', false]]) {
        const a = util.el('span', `top-link${active ? ' active' : ''}`, links, label);
      }
      const search = util.el('div', 'top-search', header, '⌕　Search workflows...');
      util.el('span', 'bell', header, '♧');
      util.el('span', 'profile', header, 'JD');
      Object.assign(_c, { brand, header, mark });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const help = util.el('aside', 'help-card', body);
      const heading = util.el('div', 'help-heading', help, 'Build your workflow');
      const bulb = util.el('span', 'help-glyph bulb-glyph', heading);
      bulb.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 17c0-2-4-3.2-4-8a7 7 0 0 1 14 0c0 4.8-4 6-4 8M9 18h6M10 21h4"/></svg>';
      util.el('p', '', help, 'Drag components from the palette to add steps. Connect steps to define the flow.');
      const tipsTitle = util.el('div', 'help-section tips-title', help, 'Tips');
      const cap = util.el('span', 'help-glyph', tipsTitle);
      cap.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m2 9 10-5 10 5-10 5L2 9Zm4 3v5c4 3 8 3 12 0v-5M21 10v8"/></svg>';
      const tips = util.el('ul', '', help);
      for (const t of ['Click a step to edit its settings.', 'Use conditions and filters to control which steps run.', 'Drag from a step’s handle to connect it to another step.', 'You can rearrange steps at any time.']) util.el('li', '', tips, t);
      const patternsTitle = util.el('div', 'help-section patterns-title', help, 'Common patterns');
      const book = util.el('span', 'help-glyph', patternsTitle);
      book.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5c-3-2-7-2-10-1v16c4-1 7-1 10 1 3-2 6-2 10-1V4c-3-1-7-1-10 1Zm0 0v16"/></svg>';
      const patterns = util.el('ul', '', help);
      for (const t of ['Filter out unwanted responses', 'Add a tag when someone replies', 'Send a reminder if there’s no reply', 'Use a schedule to run follow-ups']) util.el('li', '', patterns, t);
      Object.assign(_c, { body, help });
    },
  };

  env.site({
    name: 'design-use-workflow-editor-place-05',
    template: 'site/base',
    design: { parts },
  });
})();
