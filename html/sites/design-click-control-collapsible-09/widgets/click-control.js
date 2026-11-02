// Design for numbered module headers with category subtitles and number badges.
env.widget({
  task: 'click-control',
  site: 'design-click-control-collapsible-09',
  name: 'design',
  split: 'train',
  scenarios: ['collapsible'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    parts: {
      colHeader: () => (ctx, sec, h, s, i) => {
        h.innerHTML = '<svg viewBox="0 0 16 21" aria-hidden="true"><path d="M2 1L15 10.5L2 20Z"/></svg>';
        const nm = /#?(\d+)/.exec(s.title);
        const tx = ctx.util.el('span', 'nm-tx', h);
        ctx.util.el('b', '', tx, s.title);
        ctx.util.el('small', '', tx, ['General information', 'Configuration settings', 'User permissions', 'Integration options'][i % 4]);
        if (nm) ctx.util.el('em', 'nm-badge', h, nm[1]);
      },
    },
  },
});
