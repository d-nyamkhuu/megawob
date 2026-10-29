// Printed document rows and scroll extents retain this site's pixel and line-index behavior.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-scroll-text-05',
  name: 'design',
  split: 'train',
  scenarios: ['scroll-text'],
  template: 'handle-text/editor',
  design: {
    parts: {
      lineRow: (base, S) => (ctx, row, opts) => {
        if (opts.printLh) {
          const pitch = Math.round(parseFloat(getComputedStyle(row).height) || opts.printLh);
          row.style.setProperty('height', pitch + 'px', 'important');
          row.style.setProperty('min-height', pitch + 'px', 'important');
        }
      },
      lineApi: (base, S) => (ctx, box, list, els, opts, scrollbar) => {
        const onScroll = (index) => {
          if (ctx.spec.scenario === 'scroll-text') {
            const max = S.P.fam().helpers.maxScroll(ctx.spec);
            const extent = Math.max(0, list.scrollHeight - list.clientHeight);
            if (list.scrollTop <= 0) index = 0;
            else if (extent > 0 && list.scrollTop >= extent - 1) index = max;
            else index = Math.max(0, Math.min(max, index));
          }
          opts.onScroll(index);
        };
        return base(ctx, box, list, els, { ...opts, onScroll }, scrollbar);
      },
      documentAfter: (base, S) => (ctx, sb, range, look) => {
        sb.list.style.setProperty('height', '100%', 'important');
        const rows = sb.list.querySelectorAll('.ut-ln');
        const pitch = rows.length > 1
          ? rows[1].offsetTop - rows[0].offsetTop
          : rows[0].getBoundingClientRect().height;
        const top = parseFloat(getComputedStyle(sb.list).paddingTop) || 0;
        sb.list.style.paddingBottom = Math.max(0, sb.list.clientHeight - ctx.spec.rows * pitch - top + 1) + 'px';
        sb.lbx.set({ scroll: ctx.model.scroll });
      },
    },
  },
});
