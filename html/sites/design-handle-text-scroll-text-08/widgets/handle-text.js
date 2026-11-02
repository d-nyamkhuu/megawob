// Keeps the brass document's printed row metrics aligned with its logical scroll range.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-scroll-text-08',
  name: 'design',
  split: 'train',
  scenarios: ['scroll-text'],
  scrollable: (spec) => spec.scenario === 'find' && spec.mode === 'page',
  template: 'handle-text/editor',
  design: {
    parts: {
      documentAfter: (base, S) => (ctx, sb, range) => {
        // Match the brass document's actual printed rows when preserving its line-index range.
        const row = sb.list.querySelector('.ut-ln');
        const lineHeight = row.getBoundingClientRect().height;
        const paddingTop = parseFloat(getComputedStyle(sb.list).paddingTop) || 0;
        sb.list.style.setProperty(
          'padding-bottom',
          Math.max(0, sb.list.clientHeight - paddingTop - ctx.spec.rows * lineHeight) + 'px',
          'important',
        );
        sb.lbx.set({ scroll: ctx.model.scroll });
      },
    },
  },
});
