// Design on recall-info/classic; defaults preserve the scaffolded base widget.
env.widget({
  task: 'recall-info',
  site: 'design-recall-info-count-03',
  name: 'design',
  split: 'train',
  scenarios: ['count'],
  template: 'recall-info/classic',
  design: {
    title: 'Orders',
    rowHeight: 41,
    columns: { orders: '8% 15% 21% 23% 13% 20%' },
    parts: {
      build: (base) => (ctx, work, app) => {
        // Painting the first rows is not an action. Keep the task's initial
        // progress until the scroll pane reports a later, interactive refresh.
        let building = true;
        const viewCtx = Object.create(ctx);
        viewCtx.patch = (change) => {
          if (building && Object.keys(change).length === 1 && 'reached' in change) return;
          return ctx.patch(change);
        };
        const view = base(viewCtx, work, app);
        building = false;
        return view;
      },
      heading: (base) => (ctx, work) => {
        const status = base(ctx, work);
        const app = work.closest('.ur-app');
        if (app) Object.assign(app.style, { left: '0', top: '0', width: `${ctx.size.width}px`, height: `${ctx.size.height}px`, margin: '0', border: '0', borderRadius: '0', boxShadow: 'none' });
        work.classList.add('chronicle-work');
        Object.assign(work.style, { display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '0', minHeight: '0', padding: '12px 0 0' });
        const rules = ctx.util.el('style', 'chronicle-widget-rules', work);
        rules.textContent = `
          .chronicle-work .ur-grid { display:grid; grid-template-columns:6% 18% 40% 17% 19%; column-gap:0; align-items:center; }
          .chronicle-work .ur-grid:has(> :nth-child(6)) { grid-template-columns:8% 15% 21% 23% 13% 20%; }
          .chronicle-work .ur-h { flex:1; }
          .chronicle-work .ur-ans { order:1; flex:none; min-height:64px; gap:14px; padding:0 4px; flex-wrap:nowrap; }
          .chronicle-work .ur-label { flex:1; min-width:0; }
          .chronicle-work .ur-input { width:${Math.min(166, ctx.size.width * .2)}px; height:40px; }
          .chronicle-work .ur-btn.primary { padding:8px 18px; }
          .chronicle-work .ur-colhead { order:2; flex:none; min-height:40px; padding:0 20px; }
          .chronicle-work .ur-panewrap { order:3; flex:1 1 0; min-height:0; }
          .chronicle-work .ur-row { padding:0 20px; }
        `;
        const heading = work.querySelector('.ur-h');
        if (heading) {
          heading.textContent = 'Orders';
          Object.assign(heading.parentElement.style, { width: '100%', borderBottom: '2px solid #68635f', marginBottom: '8px' });
          Object.assign(heading.style, { flex: '1', border: '0', margin: '0', padding: '0 4px 12px' });
        }
        return status;
      },
      answer: (base) => (ctx, work) => {
        const answer = base(ctx, work);
        const label = work.querySelector('.ur-label');
        if (label) {
          label.textContent = 'Answer';
          Object.assign(label.style, { flex: '1', minWidth: '0' });
        }
        const form = work.querySelector('.ur-ans');
        const columns = work.querySelector('.ur-colhead');
        const pane = work.querySelector('.ur-panewrap');
        if (form) {
          Object.assign(form.style, { order: '1', flex: 'none', minHeight: '64px', gap: '14px', padding: '0 4px', flexWrap: 'nowrap' });
          const input = form.querySelector('.ur-input');
          if (input) Object.assign(input.style, { width: `${Math.min(166, ctx.size.width * .2)}px`, height: '40px' });
        }
        if (columns) columns.style.order = '2';
        if (pane) {
          Object.assign(pane.style, { order: '3', flex: '1 1 0', minHeight: '0' });
        }
        return answer;
      },
    },
  },
});
