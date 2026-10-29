// Adds the People heading above the always-visible menu while keeping the shared menu controls.
env.widget({
  task: 'click-control',
  site: 'design-click-control-menu-04',
  name: 'design',
  split: 'train',
  scenarios: ['menu'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    parts: {
      menuHead: (base) => (ctx, wrap, trigger) => {
        base(ctx, wrap, trigger);
        if (!trigger) ctx.util.el('div', 'uc-menuheading', wrap, 'People');
      },
    },
  },
});
