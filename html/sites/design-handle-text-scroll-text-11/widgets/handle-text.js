// Site design on templates/handle-text/editor.js; shared behavior and part signatures are documented there.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-scroll-text-11',
  name: 'design',
  split: 'train',
  scenarios: ['scroll-text'],
  template: 'handle-text/editor',
  design: {
    parts: {
      linesCreated: (base, S) => (ctx, box, list, els, opts) => {
        if (opts.printLh && els.length) {
          // Match the task's line-index range without changing the printed line
          // height. CSS formerly discarded this reading space, making the last
          // requested scroll positions unreachable when more rows fitted on screen.
          const rowHeight = els[0][1].getBoundingClientRect().height;
          list.style.setProperty('padding-top', '0px', 'important');
          list.style.setProperty('padding-bottom', Math.max(0, list.clientHeight - opts.rows * rowHeight) + 'px', 'important');
        }
      },
      lineApi: (base, S) => (ctx, box, list, els, opts, scrollbar) => {
        let lbx = null;
        let snapping = false;
        lbx = env.ui.listbox(list, { label: 'text', options: els, scrollbar,
          onScroll(i) {
            if (snapping) return;
            // This printed document scrolls in whole numbered lines. At small
            // sizes a thumb pixel represents several content pixels; fractional
            // drag endpoints otherwise leave a requested line just outside the
            // task's read window and repeat the same drag indefinitely.
            const index = opts.printLh ? Math.round(i) : i;
            if (opts.printLh && lbx && Math.abs(index - i) > .04) {
              snapping = true;
              lbx.set({ scroll: index });
              snapping = false;
            }
            opts.onScroll(index);
          },
        });
        return { box, list, lbx };
      },
    },
  },
});
