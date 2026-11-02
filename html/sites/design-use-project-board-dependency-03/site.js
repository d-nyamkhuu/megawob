// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  const TITLES = ['PRODUCT RELEASE PLANNER'];

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { display, lr, nav, rng, util, word } = _c;
      const { K } = S;
      const header = util.el('header', 'ref-task', document.body);
      // Native desktop menu and planner toolbar sit directly below the window title.
      const menu = util.el('nav', 'gtk-menubar', document.body);
      header.after(menu);
      for (const item of ['File', 'Edit', 'View', 'Project', 'Tasks', 'Help']) {
        const m = util.el('span', 'gtk-menu-item', menu, item);
        m.addEventListener('click', () => env.log('decoy', { what: 'menu', label: item }));
      }
      const appbar = util.el('div', 'gtk-toolbar', document.body);
      menu.after(appbar);
      const appActions = [
        ['✚', 'Add Task'], ['◆', 'Add Milestone'], ['🔗', 'Link Tasks'], ['↗', 'Unlink'],
        ['⊕', 'Zoom In'], ['⊖', 'Zoom Out'], ['▦', 'Today'],
      ];
      for (const [icon, labelText] of appActions) {
        const action = util.el('button', `gtk-tool${labelText === 'Unlink' ? ' is-disabled' : ''}`, appbar);
        action.type = 'button'; action.dataset.role = 'xtra';
        util.el('span', 'gtk-tool-icon', action, icon);
        util.el('span', '', action, labelText);
        action.addEventListener('click', () => env.log('decoy', { what: 'toolbar', label: labelText }));
      }
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
        brand.dataset.role = 'brand';
      }
      Object.assign(_c, { appActions, appbar, header, menu });
    },
    'frame.floating': (base, S) => function (_c) {
      const { endBtn, label, placement, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      const dockbar = util.el('nav', 'gtk-dock', document.body);
      for (const [icon, text] of [['▣', 'Timeline'], ['▦', 'Board'], ['♟', 'Teams'], ['⬟', 'Releases'], ['▥', 'Reports']]) {
        const tab = util.el('button', `gtk-dock-tab${text === 'Timeline' ? ' active' : ''}`, dockbar);
        tab.type = 'button'; tab.dataset.role = 'xtra';
        util.el('span', 'gtk-dock-icon', tab, icon);
        util.el('span', '', tab, text);
        tab.addEventListener('click', () => env.log('decoy', { what: 'navigation', label: text }));
      }
      Object.assign(_c, { dockbar, submit });
    },
  };

  env.site({
    name: 'design-use-project-board-dependency-03',
    template: 'site/base',
    design: { TITLES, parts },
  });
})();
