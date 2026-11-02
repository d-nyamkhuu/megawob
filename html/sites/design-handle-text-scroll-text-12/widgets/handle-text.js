// Preserve this site's fixed printed rows, scroll settling, and external preview layout.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-scroll-text-12',
  name: 'design',
  split: 'train',
  scenarios: ['scroll-text'],
  scrollable: (spec) => spec.scenario === 'find' && spec.mode === 'page',
  template: 'handle-text/editor',
  design: {
    printMin: 29,
    printMax: 29,
    parts: {
      documentAfter: (base, S) => (ctx, sb) => {
        sb.list.style.paddingBottom = Math.max(0, sb.list.clientHeight - ctx.spec.rows * 29 - 5) + 'px';
        sb.lbx.set({ scroll: ctx.model.scroll });
      },
      rendered: (base, S) => (ctx, view, look, box) => {
        base(ctx, view, look, box);
        if (ctx.spec.scenario !== 'scroll-text') return;
        const slot = document.querySelector('.fieldslot');
        const row = view.card.querySelector('.ut-fieldrow');
        if (slot && row) {
          const original = row.parentElement;
          slot.appendChild(row);
          original.remove();
        }
        const preview = document.querySelector('.preview-content');
        if (preview) {
          ctx.spec.lines.slice(-4).forEach((line, i) => {
            const r = ctx.util.el('div', 'preview-line', preview);
            ctx.util.el('span', 'preview-num', r, String(ctx.spec.lines.length - 4 + i + 1));
            ctx.util.el('span', '', r, line);
          });
        }
      },
    },
  },
});
