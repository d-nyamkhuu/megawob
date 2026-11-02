// Site design on templates/handle-text/editor.js; shared behavior and part signatures are documented there.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-scroll-text-10',
  name: 'design',
  split: 'train',
  scenarios: ['scroll-text'],
  template: 'handle-text/editor',
  design: {
    recordSeen: true,
    parts: {
      documentRange: (base, S) => (ctx, holder, look) => {
        const range = base(ctx, holder, look);
        range.read = (index) => {
          let s = Math.round(index * 1000) / 1000;
          const scrollPane = range.sb?.list;
          if (scrollPane) {
            const max = S.P.fam().helpers.maxScroll(ctx.spec);
            if (scrollPane.scrollTop <= 0) s = 0;
            else if (scrollPane.scrollHeight - scrollPane.clientHeight - scrollPane.scrollTop <= 1) s = max;
            else s = Math.min(max, s);
          }
          return s;
        };
        return range;
      },
      documentBound: (base, S) => (ctx, sb, range) => {
        sb.list.addEventListener('wheel', (e) => {
          if (!e.deltaY) return;
          e.preventDefault();
          const row = sb.list.querySelector('.ut-ln');
          const unit = e.deltaMode === 1 ? row.getBoundingClientRect().height : e.deltaMode === 2 ? sb.list.clientHeight : 1;
          sb.list.scrollTop += e.deltaY * unit;
          const s = range.read(sb.lbx.scrollIndex());
          range.show(s);
          const m = S.st.ctx.model;
          const next = S.P.fam().helpers.scrolled(m, ctx.spec, s);
          if (next.scroll !== m.scroll || next.seen !== m.seen) S.st.ctx.update(next);
        }, { passive: false });
      },
      documentAfter: (base, S) => (ctx, sb) => {
        const { spec } = ctx;

        // Match the task's line-index range even when the window shows more
        // than spec.rows lines. Use the displayed rows, not the sampled font.
        const rows = sb.list.querySelectorAll('.ut-ln');
        const lineHeight = rows.length > 1
          ? rows[1].getBoundingClientRect().top - rows[0].getBoundingClientRect().top
          : rows[0].getBoundingClientRect().height;
        const topPadding = parseFloat(getComputedStyle(sb.list).paddingTop) || 0;
        sb.list.style.paddingBottom = Math.max(0, sb.list.clientHeight - topPadding - spec.rows * lineHeight) + 'px';
        sb.lbx.set({ scroll: ctx.model.scroll });
      },
    },
  },
});
