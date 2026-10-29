// Design on recall-info/classic; defaults preserve the scaffolded base widget.
env.widget({
  task: 'recall-info',
  site: 'design-recall-info-code-02',
  name: 'design',
  split: 'train',
  scenarios: ['code'],
  template: 'recall-info/classic',
  design: {
    width: 990,
    frameRadius: '0px',
    fontSize: '18px',
    inputRadius: '2px',
    panel: '#fffefa',
    fg: '#171512',
    accent: '#a31f18',
    parts: {
      bar(base, S) {
        return (ctx, app, title) => {
          base(ctx, app, title);
          const heading = ctx.util.el('h1', 'courier-sheet-title', null, 'Redelivery Request');
          heading.style.fontSize = `${Math.min(46, Math.max(28, ctx.size.height / 13))}px`;
          app.querySelector('.ur-bar').replaceWith(heading);
        };
      },
      work(base, S) {
        return (ctx, app) => {
          const work = base(ctx, app);
          const compact = ctx.size.height < 500;
          work.style.padding = compact ? '8px 16px 12px' : '12px 26px 16px';
          work.style.gap = compact ? '6px' : '12px';
          return work;
        };
      },
      placeFrame(base, S) {
        return (ctx, app, width, height) => {
          base(ctx, app, width, height);
          Object.assign(app.style, {
            left: '0px', top: '0px',
            width: `${ctx.size.width}px`, height: `${ctx.size.height}px`,
          });
        };
      },
      build(base, S) {
        return (ctx, work, app) => {
          const view = base(ctx, work, app);
          const body = work.querySelector('.ur-body');
          Object.assign(body.style, { flex: '1 1 0', minHeight: '0', height: '0', overflow: 'auto' });
          return view;
        };
      },
      codeBox(base, S) {
        return (ctx, parent, state) => {
          base(ctx, parent, state);
          const form = document.createElement('div');
          form.className = 'courier-fields';
          form.style.height = `${Math.max(100, Math.min(260, ctx.size.height - 330))}px`;
          const rows = [
            ['Tracking number', 'LT438920615', 'text'],
            ['Service', 'Express', 'select'],
            ['Reason for redelivery', 'Addressee not available', 'select'],
            ['Additional information', '', 'area'],
          ];
          for (const [label, value, kind] of rows) {
            const row = document.createElement('div');
            row.className = `courier-field courier-${kind}`;
            const name = document.createElement('span');
            name.className = 'courier-field-label';
            name.textContent = label;
            const control = document.createElement('span');
            control.className = 'courier-field-value';
            control.textContent = value;
            if (kind === 'select') control.classList.add('has-arrow');
            row.append(name, control);
            form.append(row);
          }
          const code = parent.querySelector('.ur-codebox');
          Object.assign(code.style, {
            display: 'grid', gridTemplateColumns: 'minmax(0, 34%) minmax(0, 1fr)',
            alignItems: 'center', gap: '10px', width: '100%',
            padding: ctx.size.height < 500 ? '6px 0' : '12px 0',
            margin: '8px 0', boxSizing: 'border-box',
          });
          Object.assign(state.codeEl.style, { margin: '0', padding: '5px 12px' });
          parent.insertBefore(form, code);
        };
      },
    },
  },
});
