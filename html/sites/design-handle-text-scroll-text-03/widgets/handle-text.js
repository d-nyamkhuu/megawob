// Match the printed document's measured scroll range and visible line count.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-scroll-text-03',
  name: 'design',
  split: 'train',
  scenarios: ['scroll-text'],
  scrollable: (spec) => spec.scenario === 'find' && spec.mode === 'page',
  template: 'handle-text/editor',
  design: {
    forcePane: false,
    parts: {
      lineLayout: (base, S) => (ctx, box, list, opts) => {
        list.style.setProperty('height', '100%', 'important');
        box.style.flex = 'none';
        if (opts.printLh) {
          list.classList.add('printed-document');
          list.style.paddingBottom = Math.max(0, opts.rows * (opts.lh - opts.printLh)) + 'px';
          list.style.setProperty('--ut-print-lh', opts.printLh + 'px');
        }
      },
      lineApi: (base, S) => (ctx, box, list, els, opts, scrollbar) => {
        const result = base(ctx, box, list, els, opts, scrollbar);
        result.fit = () => {
          if (!opts.printLh || !els.length) return;
          const rowHeight = els[0][1].getBoundingClientRect().height;
          const inset = parseFloat(getComputedStyle(list).paddingTop) || 0;
          list.style.paddingBottom = Math.max(0, list.clientHeight - opts.rows * rowHeight - inset) + 'px';
        };
        return result;
      },
      documentAfter: (base, S) => (ctx, sb, range) => {
        sb.fit();
        range.visibleRows = sb.list.clientHeight / sb.list.querySelector('.ut-ln').getBoundingClientRect().height;
        sb.lbx.set({ scroll: ctx.model.scroll });
        range.show(ctx.model.scroll);
      },
    },
  },
});
