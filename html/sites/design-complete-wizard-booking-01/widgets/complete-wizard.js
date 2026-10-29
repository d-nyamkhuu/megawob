// Design on wizard/stepper; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'complete-wizard',
  site: 'design-complete-wizard-booking-01',
  name: 'design',
  split: 'train',
  scenarios: ['booking'],
  template: 'complete-wizard/stepper',
  design: {
    look: { ind: 'circles', title: false, stepHead: false, cols: 2, inline: false, foot: 'right', pad: 0, r: 0, stars: false },
    font: '19px "Courier New", monospace',
    requiredMark: '',
    parts: {
      // Layout is installed before the template measures all wizard steps.
      style: (base) => () => {
        base();
        if (document.getElementById('booking-layout')) return;
        const style = document.createElement('style');
        style.id = 'booking-layout';
        style.textContent = `
          .booking-wizard { gap: var(--booking-gap); }
          .booking-wizard .wz-ind { flex: none; gap: 0; min-height: var(--booking-strip); margin: 0 0 var(--booking-ind-gap); }
          .booking-wizard .wz-ind li { flex: 1 1 25%; min-width: 0; justify-content: center; gap: 6px; padding: 4px 16px; background: #bcbcbc; clip-path: polygon(0 0, calc(100% - 18px) 0, 100% 50%, calc(100% - 18px) 100%, 0 100%, 18px 50%); }
          .booking-wizard .wz-ind li:first-child { clip-path: polygon(0 0, calc(100% - 18px) 0, 100% 50%, calc(100% - 18px) 100%, 0 100%); }
          .booking-wizard .wz-ind .wz-dot { width: var(--booking-dot); height: var(--booking-dot); }
          .booking-wizard .wz-ind-t { white-space: normal; text-align: center; overflow-wrap: anywhere; }
          .booking-wizard .wz-ind .wz-sep { display: none; }
          .booking-wizard .wz-body, .booking-wizard .wz-foot { flex: none; }
          .booking-wizard .wz-grid { column-gap: 30px; }
          .booking-wizard .wz-field { gap: 5px; }
          .booking-wizard .wz-input { padding: 0 12px; }
          .booking-wizard .booking-nights .wz-input { width: min(172px, 100%); }
          .booking-date-control { display: flex; gap: 4px; }
          .booking-date-control .wz-input { flex: 1 1 0; min-width: 0; width: 0; }
          .booking-calendar { flex: none; width: 52px; height: var(--wz-h); display: flex; align-items: center; justify-content: center; border: 3px outset #eee; background: #bcbcbc; color: #080808; font: bold 38px/1 Arial, sans-serif; }
          .booking-wizard .wz-trigger { padding: 0 52px 0 12px; }
          .booking-wizard .wz-trigger::after { top: 0; right: 0; transform: none; width: 48px; height: 100%; display: flex; align-items: center; justify-content: center; border-left: 2px outset #eee; background: #bcbcbc; color: #080808; content: "▼"; }
          .booking-wizard .wz-foot { margin-top: var(--booking-foot-gap); padding-top: var(--booking-foot-gap); }
          .booking-wizard .wz-btn { min-height: 44px; padding: 6px 20px; }
          .booking-wizard .wz-btn.primary { min-width: min(240px, 60%); min-height: var(--booking-button); padding: 8px 30px; }
          .booking-wizard .cur { background: #ff8500; }
        `;
        document.head.append(style);
      },
      card: (base) => (ctx, s, look) => {
        const card = base(ctx, s, look);
        card.classList.add('booking-wizard');
        return card;
      },
      fieldWrap: (base) => (ctx, s, grid, field, look) => {
        const wrap = base(ctx, s, grid, field, look);
        if (field.id === 'guests') wrap.classList.remove('wide');
        if (field.id === 'nights') wrap.classList.add('booking-nights');
        return wrap;
      },
      textInput: (base) => (ctx, wrap, field) => {
        if (field.id !== 'checkin') return base(ctx, wrap, field);
        const control = ctx.util.el('div', 'booking-date-control', wrap);
        const input = base(ctx, control, field);
        const calendar = ctx.util.el('span', 'booking-calendar', control, '▦');
        calendar.setAttribute('aria-hidden', 'true');
        return input;
      },
      place: (base) => (ctx, fitted, _px, _py) => {
        // Keep the full-bleed form at the top; the template still draws its seeded offsets.
        base(ctx, fitted, 0, 0);
      },
      paint: (base, S) => (model) => {
        base(model);
        S.ctx.stage.dispatchEvent(new CustomEvent('booking-values', {
          detail: S.spec.fields.map((field) => [
            field.label.toLowerCase().replace(/[^a-z]/g, ''),
            env.taskDef.helpers.display(field, model.values[field.id]),
          ]),
        }));
      },
      fit: (base) => (ctx, sampled, attempt, maxFields) => {
        const look = base(ctx, sampled, attempt, maxFields);
        const height = ctx.size.height;
        const compact = height < 580 || attempt.squeeze >= 2;
        const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
        return {
          ...look, ind: 'circles', width: ctx.size.width - 16, cols: 2, inline: false,
          vars: {
            ...look.vars,
            '--wz-pad': '0px', '--wz-cols': '2',
            '--wz-h': `${compact ? 40 : 56}px`,
            '--wz-gap': `${compact ? 12 : clamp((height - 450) * .4, 12, 154)}px`,
            '--wz-gap2': `${compact ? 12 : 24}px`,
            '--booking-gap': `${compact ? 12 : 24}px`,
            '--booking-strip': `${compact ? 52 : 64}px`,
            '--booking-dot': `${ctx.size.width < 700 ? 28 : 40}px`,
            '--booking-ind-font': `${ctx.size.width < 600 ? 12 : ctx.size.width < 900 ? 14 : 19}px`,
            '--booking-ind-gap': `${compact ? 12 : clamp((height - 500) * .3, 12, 127)}px`,
            '--booking-foot-gap': `${compact ? 6 : 30}px`,
            '--booking-button': `${compact ? 44 : 62}px`,
          },
        };
      },
    },
  },
});
