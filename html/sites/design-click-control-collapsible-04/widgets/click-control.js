// Design of this site on click-control/controls: custom accordion headers with per-section link counts.
env.widget({
  task: 'click-control',
  site: 'design-click-control-collapsible-04',
  name: 'design',
  split: 'train',
  scenarios: ['collapsible'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    parts: {
      colHeader: () => (ctx, sec, h, s) => {
        h.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 2.5L10.5 8L5 13.5"/></svg><i class="pc-ico"></i>';
        ctx.util.el('span', 'pc-t', h, s.title);
      },
      colBody: (base) => (ctx, bd, s, i, links, h) => {
        const before = links.length;
        base(ctx, bd, s, i, links, h);
        ctx.util.el('span', 'pc-cnt', h, String(links.length - before));
      },
    },
  },
});
