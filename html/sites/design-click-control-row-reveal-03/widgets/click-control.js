// Design on templates/click-control/base.js: the base site's click-control widget for this scenario, unchanged (it was
// scaffolded from it and restyled through site.css).
env.widget({
  task: 'click-control',
  site: 'design-click-control-row-reveal-03',
  name: 'design',
  split: 'train',
  scenarios: ['row-reveal'],
  template: 'click-control/base',
  design: {
    parts: {
      buildRowReveal: (base) => (ctx, content, up, page) => {
        const view = base(ctx, content, up, page);
        const table = content.querySelector('.uc-rr');
        const headers = table.rows[0].cells;
        // Reserve the generated actions' full width, including cell padding.
        // A fixed percentage clipped the buttons into the preceding data cell.
        const actionsWidth = ctx.spec.quick.length * (ctx.spec.style === 'icons' ? 38 : 80) + 66;
        const available = table.getBoundingClientRect().width - actionsWidth;
        const weights = [40, 21, 15, 20].slice(0, ctx.spec.columns.length);
        const total = weights.reduce((sum, weight) => sum + weight, 0);
        weights.forEach((weight, i) => { headers[i].style.width = `${available * weight / total}px`; });
        headers[headers.length - 1].style.width = `${actionsWidth}px`;
        return view;
      },
    },
  },
});
