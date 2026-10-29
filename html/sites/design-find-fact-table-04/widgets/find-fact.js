// Keeps this design's table labels, record headings, row sizing, and scrollable source-card fit.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-table-04',
  name: 'design',
  split: 'train',
  scenarios: ['table'],
  template: 'find-fact/table',
  design: {
    parts: {
      answerTitle: (base, S) => (ctx, labels) => {
        base(ctx, labels); // Keep the original discarded single-field title draw.
        return 'Enter the matching details';
      },
      source: (base, S) => (ctx, tc, body) => {
        tc.firstElementChild.firstChild.nodeValue = 'Reference Table';
        body.style.padding = '0';
      },
      table: (base, S) => (ctx, t) => {
        const { spec } = ctx;
        t.style.setProperty('--table-rows', spec.rows.length + 1);
        if (spec.kind === 'record') {
          const tr = ctx.util.el('tr', '', ctx.util.el('thead', '', t));
          ['Field', 'Value'].forEach((label) => ctx.util.el('th', '', tr, label));
        }
      },
      answers: (base, S) => (ctx, B) => {
        const { work, form, tc, body } = B;
        const ws = getComputedStyle(work);
        const fs = getComputedStyle(form);
        const available = work.clientHeight - parseFloat(ws.paddingTop) - parseFloat(ws.paddingBottom)
          - parseFloat(ws.rowGap) - form.scrollHeight - parseFloat(fs.borderTopWidth) - parseFloat(fs.borderBottomWidth);
        if (form.getBoundingClientRect().bottom > work.getBoundingClientRect().bottom - 4
            || work.scrollHeight > work.clientHeight + 1) {
          tc.style.maxHeight = Math.max(64, available) + 'px';
          tc.style.display = 'flex';
          tc.style.flexDirection = 'column';
          body.style.minHeight = '0';
          body.style.flex = '1 1 auto';
        }
        body.style.overflow = 'auto';
      },
    },
  },
});
