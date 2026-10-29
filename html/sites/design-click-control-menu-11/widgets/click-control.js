// Design of this site on click-control/controls: keep the Menu label and add its dropdown caret.
env.widget({
  task: 'click-control',
  site: 'design-click-control-menu-11',
  name: 'design',
  split: 'train',
  scenarios: ['menu'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    menuLabel: 'Menu',
    parts: {
      menuTrigger: (base) => () => `${base()}<i class="caret"></i>`,
    },
  },
});
