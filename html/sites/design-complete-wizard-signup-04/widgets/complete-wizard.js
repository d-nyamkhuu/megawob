// Design on wizard/stepper; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'complete-wizard',
  site: 'design-complete-wizard-signup-04',
  name: 'design',
  split: 'train',
  scenarios: ['signup'],
  template: 'complete-wizard/stepper',
  design: {
    title: 'Create a new account',
    titleSize: '22px',
    bodySlack: 0,
    look: { ind: 'circles', flat: false, title: true, hints: false, stepHead: false, cols: 1, inline: false, width: 744, pad: 30, gap: 14, h: 43, r: 7 },
    parts: {
      selectField: (base, S) => (ctx, s, wrap, f) => {
        const { trigger, pop, opts } = S.P.selectControl(ctx, wrap, f);
        const dd = env.ui.dropdown(trigger, pop, {
          label: f.id,
          options: opts,
          value: ctx.model.values[f.id] || null,
          open: ctx.model.open === f.id,
          onChange: (v) => {
            if (ctx.model.values[f.id] !== v) s.apply({ set: [f.id, v] });
          },
          onOpenChange: (open) => {
            const want = open ? f.id : (ctx.model.open === f.id ? null : ctx.model.open);
            if (ctx.model.open !== want) s.apply({ open: want });
          },
          show: (popup, open) => {
            popup.hidden = !open;
            if (!open) return;
            // The sheet clips at the stage, so viewport room alone is insufficient.
            const stage = ctx.stage.getBoundingClientRect();
            const button = trigger.getBoundingClientRect();
            const field = wrap.getBoundingClientRect();
            const scale = button.height / trigger.offsetHeight;
            const height = popup.offsetHeight * scale;
            let top = button.bottom + 2 * scale;
            if (top + height > stage.bottom - 4) top = button.top - height - 2 * scale;
            top = Math.max(stage.top + 4, Math.min(top, stage.bottom - height - 4));
            popup.style.bottom = '';
            popup.style.top = `${(top - field.top) / scale}px`;
          },
        });
        s.fields[f.id] = { kind: 'select', dd, trigger, opts };
      },
      indicatorItem: (base, S) => (ctx, ol, name, i, look) => {
        const li = base(ctx, ol, name, i, look);
        if (look.ind === 'circles') {
          Object.assign(li.style, { flexDirection: 'column', alignItems: 'center', fontSize: '15px' });
          const dot = li.firstElementChild;
          Object.assign(dot.style, { width: '44px', height: '44px', fontSize: '18px', fontWeight: '500', borderWidth: '1px' });
        }
        return li;
      },
    },
  },
});
