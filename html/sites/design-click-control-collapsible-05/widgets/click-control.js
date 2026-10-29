// This design gives accordion sections the site's file-list chevron and separates their copy from links.
env.widget({
  task: 'click-control',
  site: 'design-click-control-collapsible-05',
  name: 'design',
  split: 'train',
  scenarios: ['collapsible'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    chevron: '<svg viewBox="0 0 16 21" aria-hidden="true"><path d="M2 1L15 10.5L2 20Z"/></svg>',
    parts: {
      colBody: (base) => (ctx, bd, s, i, links, h) => {
        base(ctx, bd, s, i, links, h);
        const list = bd.firstElementChild;
        const copy = ctx.util.el('div', 'uc-section-copy', bd);
        Array.from(list.childNodes).forEach((node) => {
          if (node.nodeType === 3) copy.appendChild(node);
        });
      },
    },
  },
});
