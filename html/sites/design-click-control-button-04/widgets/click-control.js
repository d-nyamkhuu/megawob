// Design of this site on click-control/controls: button labels use a dedicated span for the site styling.
env.widget({
  task: 'click-control',
  site: 'design-click-control-button-04',
  name: 'design',
  split: 'train',
  scenarios: ['button'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    parts: {
      buttonEl: () => (ctx, host, e) => {
        const b = ctx.util.el('button', 'uc-btn', host);
        ctx.util.el('span', 'kbutton-label', b, e.label);
        return b;
      },
    },
  },
});
