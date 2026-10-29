// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.floating': (base, S) => function (_c) {
      const { body, display, endBtn, header, label, placement, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }

      // WorldExplorer shell: keep the existing episode controls and task stage, but
      // place them inside the reference's app frame.
      document.body.classList.add('world-explorer');
      header.classList.add('we-masthead');
      const logo = util.el('div', 'we-logo', header);
      util.el('span', 'we-globe', logo, '🌎');
      const wordmark = util.el('div', 'we-wordmark', logo);
      util.el('strong', '', wordmark, 'WorldExplorer');
      util.el('div', 'we-sections', wordmark, 'People　 Places　 Data');
      const utility = util.el('div', 'we-utility', header, 'Help　 |　 Preferences　 |　 Sign Out');
      utility.dataset.role = 'utility';
      const rail = util.el('nav', 'we-rail', body);
      for (const [icon, label] of [['⌂','Home'], ['◎','Countries'], ['▦','Cities'], ['▥','Statistics'], ['▤','Reports'], ['⚙','Administration']]) {
        const a = util.el('a', `we-rail-item${label === 'Countries' ? ' active' : ''}`, rail);
        a.href = '#';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label }); });
        util.el('span', 'we-rail-icon', a, icon);
        util.el('span', '', a, label);
      }
      if (display === 'header') header.classList.add('has-instruction');
      Object.assign(_c, { logo, rail, submit, utility, wordmark });
    },
  };

  env.site({
    name: 'design-transfer-items-multi-01',
    template: 'site/base',
    design: { parts },
  });
})();
