// Keeps the notebook's printed-line sizing and exact logical scroll range.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-scroll-text-09',
  name: 'design',
  split: 'train',
  scenarios: ['scroll-text'],
  template: 'handle-text/editor',
  design: {
    parts: {
      lineHeight: (base, S) => (spec, box) => spec.rows ? (box.h - 40) / spec.rows : 28,
      lineApi: (base, S) => (ctx, box, list, els, opts, scrollbar) => {
        // Keep the compact printed rows' logical scroll range equal to the original line-index range.
        const fitScrollRange = () => {
          if (!opts.printLh || !els.length) return;
          const rowHeight = els[0][1].getBoundingClientRect().height;
          list.style.setProperty(
            'padding-bottom',
            Math.max(0, Math.ceil(list.clientHeight - opts.rows * rowHeight)) + 1 + 'px',
            'important',
          );
        };
        fitScrollRange();
        const lbx = env.ui.listbox(list, { label: 'text', options: els, onScroll: opts.onScroll, scrollbar });
        return { box, list, lbx, fitScrollRange };
      },
      documentAfter: (base, S) => (ctx, sb) => {
        if (S.st.field) {
          const area = S.st.field.row.parentElement;
          const reserve = area.getBoundingClientRect().height + parseFloat(getComputedStyle(area).marginTop) + 4;
          const available = ctx.stage.clientHeight - reserve;
          const current = parseFloat(sb.list.style.height);
          sb.list.style.setProperty('height', Math.max(60, Math.min(current, available)) + 'px', 'important');
        }
        sb.fitScrollRange();
        sb.lbx.set({ scroll: ctx.model.scroll });
      },
    },
  },
});
