// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.stage': (base, S) => function (_c) {
      const { body, ctx, display, header, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);

      // Lisa-era inventory window. Keep the generated stage and all task controls intact;
      // only replace the sibling dashboard's presentation frame.
      const oldControls = [...document.querySelectorAll('.ref-tools button, .ref-tools a')];
      header.replaceChildren();
      header.className = 'ref-task window-title';
      const appIcon = util.el('span', 'app-paper-icon', header, '▤');
      appIcon.setAttribute('aria-hidden', 'true');
      util.el('strong', 'app-title', header, 'Northwind Traders - Inventory');
      const winControls = util.el('div', 'window-controls', header);
      for (const mark of ['−', '□', '×']) util.el('span', 'window-control', winControls, mark);
      const modulebar = util.el('nav', 'modulebar', header);
      for (const label of ['File', 'Edit', 'View', 'Records', 'Tools', 'Help'])
        util.el('span', 'menu-item', modulebar, label);
      if (display === 'header') util.el('div', 'ref-instruction app-header-note', header, ctx.instruction);

      // Discard randomized dashboard navigation and provide the target app's stable rails.
      for (const child of [...body.children]) if (child !== stage) child.remove();
      body.classList.add('inventory-layout');
      const leftRail = util.el('aside', 'inventory-rail', body);
      for (const [icon, label, active] of [['⌂','Home'],['▣','Inventory',true],['▤','Orders'],['▦','Customers'],['▥','Reports'],['⚙','Settings']]) {
        const a = util.el('div', `rail-item${active ? ' selected' : ''}`, leftRail);
        util.el('span', 'rail-icon', a, icon); util.el('span', '', a, label);
      }
      const tips = util.el('aside', 'tips-panel', body);
      util.el('h2', '', tips, 'Categories');
      for (const title of ['All Categories','Apparel','Bags','Garden','Home Decor','Kitchenware','Office Supplies','Outdoors'])
        util.el('div', `category-index${title === 'All Categories' ? ' active' : ''}`, tips, title);
      if (display === 'panel') {
        const note = util.el('aside', 'inventory-task-note', body);
        util.el('strong', '', note, 'Your task'); util.el('div', '', note, ctx.instruction);
        body.insertBefore(note, stage);
      }
      Object.assign(_c, { appIcon, leftRail, modulebar, oldControls, stage, tips, winControls });
    },
    'frame.floating': (base, S) => function (_c) {
      const { endBtn, label, modulebar, oldControls, placement, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      // The end control remains separate from any instruction note and always reachable.
      let appFooter = document.querySelector('.ref-foot');
      if (!appFooter) appFooter = util.el('footer', 'ref-foot', document.body);
      appFooter.replaceChildren();
      util.el('span', 'ref-foot-text', appFooter, 'Inventory  •  All changes saved');
      const appFooterTools = util.el('div', 'ref-tools app-footer-tools', appFooter);
      const allControls = new Set([...oldControls, ...document.querySelectorAll('.ref-tools button, .ref-tools a')]);
      for (const control of allControls) {
        if (control === submit && (placement === 'header' || placement === 'icon')) modulebar.appendChild(control);
        else appFooterTools.appendChild(control);
      }
      // Header replacement above detaches the original toolbar controls; keep the selected end control live.
      if (submit && !submit.isConnected) (placement === 'header' || placement === 'icon' ? modulebar : appFooterTools).appendChild(submit);
      Object.assign(_c, { allControls, appFooter, appFooterTools, submit });
    },
  };

  env.site({
    name: 'design-use-data-grid-multirow-02',
    template: 'site/base',
    design: { parts },
  });
})();
