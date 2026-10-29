// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const menu = util.el('nav', 'wire-menubar', header);
      for (const item of ['Home', 'Mail', 'Vendors', 'Accounts Payable', 'Reports']) {
        const link = util.el('a', 'wire-menu-item', menu, item);
        link.href = '#';
        link.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'menu', label: item }); });
      }
      const toolbar = util.el('div', 'wire-toolbar', header);
      for (const [icon, label] of [['▤','New'], ['📂','Open'], ['↻','Refresh'], ['▧','View Invoice'], ['♙','View Vendor'], ['🪙','Pay'], ['◉','Hold'], ['⚑','Report'], ['▣','Print']]) {
        const button = util.el('button', 'wire-tool', toolbar);
        button.type = 'button';
        util.el('span', 'wire-tool-icon', button, icon);
        util.el('span', '', button, label);
        button.addEventListener('click', () => env.log('decoy', { what: 'toolbar', label }));
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { header, menu, toolbar });
    },
    'frame.floating': (base, S) => function (_c) {
      const { endBtn, header, label, placement, root, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      root.style.setProperty('--wire-header-height', `${header.offsetHeight}px`);
      const lowerFrame = document.querySelector('.ref-foot, .ref-float-dock');
      root.style.setProperty('--wire-footer-height', `${lowerFrame ? lowerFrame.offsetHeight : 0}px`);
      Object.assign(_c, { lowerFrame, submit });
    },
  };

  env.site({
    name: 'design-avoid-phishing-wire-02',
    template: 'site/base',
    design: { parts },
  });
})();
