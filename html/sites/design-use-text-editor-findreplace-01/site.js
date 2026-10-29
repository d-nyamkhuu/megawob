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
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const help = util.el('aside', 'studio-help', body);
      const panelNote = body.querySelector('.ref-panel');
      if (panelNote) help.appendChild(panelNote);
      util.el('h2', '', help, 'Help & Tips');
      const tabs = util.el('div', 'studio-help-tabs', help);
      util.el('span', 'active', tabs, 'Find and replace');
      util.el('span', '', tabs, 'Editor shortcuts');
      util.el('span', '', tabs, 'Code navigation');
      util.el('h3', '', help, 'Find and replace text');
      util.el('p', '', help, 'Use find and replace to quickly change specific text in your file. You can match case, whole words and use regular expressions when needed.');
      util.el('div', 'studio-rule', help);
      util.el('h4', '', help, 'Steps');
      const steps = util.el('ol', 'studio-steps', help);
      for (const [title, text] of [
        ['Open find and replace', 'Press Ctrl + F or click the search icon in the editor toolbar.'],
        ['Enter your search text', 'You can match case, whole words or use a regular expression.'],
        ['Enter the replacement text', 'Type the text you want to use instead.'],
        ['Review and replace', 'Use the arrows to move between matches and replace them one by one, or all at once.'],
      ]) {
        const li = util.el('li', '', steps);
        util.el('strong', '', li, title);
        util.el('span', '', li, text);
      }
      const options = util.el('div', 'studio-options', help);
      util.el('strong', '', options, 'Search options');
      for (const [title, detail] of [['Match case', 'Only match text with the same letter case.'], ['Whole words', 'Only match complete words.'], ['Use regular expression', 'Enable pattern matching with a regular expression.']]) {
        const row = util.el('div', 'studio-check', options);
        util.el('i', '', row);
        const copy = util.el('span', '', row);
        util.el('b', '', copy, title);
        util.el('small', '', copy, detail);
      }
      Object.assign(_c, { help, options, panelNote, stage, steps, tabs });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-text-editor-findreplace-01',
    template: 'site/base',
    design: { parts },
  });
})();
