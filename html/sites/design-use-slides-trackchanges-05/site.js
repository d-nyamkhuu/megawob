// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  const TITLES = ['Corporate Deck - Product Launch Plan'];

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { content, display, label, local, nav, rng, util } = _c;
      const { K } = S;
      const header = util.el('header', 'ref-task', document.body);
      const title = rng.pick(TITLES);
      const brand = util.el('div', 'ref-brand', header, '▣  ' + title);
      brand.dataset.role = 'brand';
      const side = util.el('aside', 'legacy-help', document.body);
      const sections = [
        ['Reviewing Revisions', 'This deck is being reviewed with tracked changes. Proposed insertions are shown underlined in red and deletions are shown with a red strikethrough. Use the revisions list below the slide to accept or reject each change.'],
        ['Legend', 'Inserted text|Deleted text'],
        ['Tips', 'Select a change in the list to see it in the slide.|Use Accept to keep the proposed text.|Use Reject to keep the original text.|Other changes will remain pending.']
      ];
      for (const [heading, copy] of sections) {
        const panel = util.el('section', 'legacy-help-section', side);
        util.el('strong', 'legacy-help-title', panel, heading);
        for (const line of copy.split('|')) util.el('div', 'legacy-help-copy', panel, line);
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        const navItems = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        const labels = ['Home', 'Documents', 'Presentations', 'Spreadsheets', 'Contacts', 'Calendar'];
        for (const [i, item] of navItems.entries()) {
          const label = labels[i] || item;
          const a = util.el('a', 'ref-navlink', n, label);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label }); });
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
      const windowControls = util.el('div', 'legacy-window-controls', header);
      for (const [mark, name] of [['_', 'Minimize'], ['□', 'Maximize'], ['×', 'Close']]) {
        const control = util.el('span', 'legacy-window-control', windowControls, mark);
        control.setAttribute('aria-label', name);
      }
      Object.assign(_c, { headerTools, submit });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-slides-trackchanges-05',
    template: 'site/base',
    design: { TITLES, parts },
  });
})();
