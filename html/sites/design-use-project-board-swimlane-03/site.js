// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { content, local, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      {
        rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Release Planner');
        brand.dataset.role = 'brand';
      }
      {
        const n = util.el('nav', 'ref-nav', header);
        const sampledNav = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        const navLabels = ['Board', 'Timeline', 'Calendar', 'Reports', 'Teams', 'Settings'];
        for (const [index, item] of navLabels.entries()) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          if (index === 1) a.style.textDecoration = 'underline';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: sampledNav[index % sampledNav.length] || item }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      const release = util.el('button', 'ref-release', headerTools, 'Q2 2025 Release');
      release.type = 'button';
      release.setAttribute('aria-label', 'Release selector');
      util.el('span', 'ref-release-arrow', release, '⌄');
      release.addEventListener('click', () => env.log('decoy', { label: 'Release selector' }));
      const utilityIcons = [
        ['Calendar', '<rect x="4" y="5" width="16" height="16"/><path d="M8 3v5M16 3v5M4 10h16M8 13h2M14 13h2M8 17h2M14 17h2"/>'],
        ['Reports', '<path d="M4 20V4M4 20h17"/><path d="M7 15h3v4H7zM12 10h3v9h-3zM17 6h3v13h-3z"/>'],
        ['Settings', '<path d="M10 2h4l1 3 3 1 3-1 2 4-2 2v3l2 2-2 4-3-1-3 1-1 3h-4l-1-3-3-1-3 1-2-4 2-2v-3L1 9l2-4 3 1 3-1z" transform="translate(1 1) scale(.92)"/><circle cx="12" cy="12" r="3"/>'],
      ];
      for (const [labelText, shape] of utilityIcons) {
        const tool = util.el('button', 'ref-tool-icon', headerTools);
        tool.type = 'button'; tool.setAttribute('aria-label', labelText); tool.title = labelText;
        const icon = document.createElementNS('http://www.w3.org/2000/svg','svg');
        icon.setAttribute('viewBox','0 0 24 24'); icon.setAttribute('aria-hidden','true'); icon.innerHTML = shape; tool.appendChild(icon);
        tool.dataset.role = 'xtra';
        tool.addEventListener('click', () => env.log('decoy', { label: labelText }));
      }
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      Object.assign(_c, { headerTools, release, submit, utilityIcons });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-project-board-swimlane-03',
    template: 'site/base',
    design: { parts },
  });
})();
