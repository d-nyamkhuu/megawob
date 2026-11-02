// Design on wizard/stepper; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'complete-wizard',
  site: 'design-complete-wizard-booking-05',
  name: 'design',
  split: 'train',
  scenarios: ['booking'],
  template: 'complete-wizard/stepper',
  design: {
    look: { ind: 'circles', title: true, stepHead: false, cols: 2, inline: false, foot: 'right', pad: 0, r: 0, stars: false },
    title: 'Book a stay',
    font: '16px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
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
          .booking-wizard .wz-ind li { flex: 1 1 25%; min-width: 0; justify-content: center; gap: 10px; padding: 4px 8px; background: transparent; }
          .booking-wizard .wz-ind li:first-child { clip-path: none; }
          .booking-wizard .wz-ind .wz-dot { width: var(--booking-dot); height: var(--booking-dot); }
          .booking-wizard .wz-ind-t { white-space: nowrap; text-align: left; overflow-wrap: normal; }
          .booking-wizard .wz-ind .wz-sep { display: block; }
          .booking-wizard .wz-body, .booking-wizard .wz-foot { flex: none; }
          .booking-wizard .wz-grid { column-gap: 0; }
          .booking-wizard .wz-field { gap: 5px; }
          .booking-wizard .wz-input { padding: 0 12px; }
          .booking-wizard .booking-nights .wz-input { width: 100%; }
          .booking-date-control { display: flex; gap: 4px; }
          .booking-date-control .wz-input { flex: 1 1 0; min-width: 0; width: 0; }
          .booking-calendar { flex: none; width: 28px; height: var(--wz-h); display: flex; align-items: center; justify-content: center; border: 0; background: transparent; color: #68758b; font: 20px/1 Arial, sans-serif; }
          .booking-wizard .wz-trigger { padding: 0 38px 0 12px; }
          .booking-wizard .wz-trigger::after { top: 0; right: 0; transform: none; width: 36px; height: 100%; display: flex; align-items: center; justify-content: center; border-left: 0; background: transparent; color: #4e5b70; content: "⌄"; }
          .booking-wizard .wz-foot { margin-top: var(--booking-foot-gap); padding-top: var(--booking-foot-gap); }
          .booking-wizard .wz-btn { min-height: 44px; padding: 6px 20px; }
          .booking-wizard .wz-btn.primary { min-width: 136px; min-height: 48px; padding: 8px 24px; }
          .booking-wizard .cur { background: #ff8500; }
        `;
        document.head.append(style);
      },
      card: (base) => (ctx, s, look) => {
        const card = base(ctx, s, look);
        card.classList.add('booking-wizard');
        return card;
      },
      title: (base) => (ctx, parent) => {
        const row = ctx.util.el('div', 'booking-dialog-heading', parent);
        const title = base(ctx, row);
        const close = ctx.util.el('button', 'booking-dialog-close', row, '×');
        close.type = 'button';
        close.setAttribute('aria-label', 'Close dialog');
        return title;
      },
      fieldWrap: (base) => (ctx, s, grid, field, look) => {
        const wrap = base(ctx, s, grid, field, look);
        wrap.classList.add(`booking-field-${field.id}`);
        if (field.id === 'guests') wrap.classList.remove('wide');
        if (field.id === 'nights') wrap.classList.add('booking-nights');
        return wrap;
      },
      textInput: (base) => (ctx, wrap, field) => {
        if (field.id !== 'checkin') return base(ctx, wrap, field);
        const control = ctx.util.el('div', 'booking-date-control', wrap);
        const input = base(ctx, control, field);
        input.placeholder = 'Select date';
        const calendar = ctx.util.el('span', 'booking-calendar', control, '▦');
        calendar.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><rect x="3" y="5" width="18" height="17" rx="2"/><path d="M7 2v6M17 2v6M3 11h18M7 15h2m3 0h2m3 0h1M7 18h2m3 0h2"/></svg>';
        calendar.setAttribute('aria-hidden', 'true');
        return input;
      },
      place: (base, S) => (ctx, fitted, _px, _py) => {
        // Center the framed form over the visible travel results.
        base(ctx, fitted, ctx.stage.parentElement.querySelector('.ref-panel') ? 0.98 : 0.42, 0.5);
        const card = S.st.card;
        const stage = ctx.stage.getBoundingClientRect();
        const scale = Number(card.style.getPropertyValue('--booking-scale')) || 1;
        const reserved = Math.max(66, 88 * scale);
        const initial = card.getBoundingClientRect();
        const extra = Math.min(1, (stage.height - reserved - 8) / initial.height);
        if (extra < 1) card.style.transform += ` scale(${extra})`;
        const rect = card.getBoundingClientRect();
        const shift = Math.max(0, stage.top + Math.max(reserved, (stage.height - rect.height) / 2) - rect.top);
        if (shift) card.style.transform = `translateY(${Math.round(shift)}px) ${card.style.transform}`;
      },
      paint: (base, S) => (model) => {
        base(model);
        const destination = S.st.fields.destination;
        if (destination && destination.trigger && !model.values.destination) destination.trigger.textContent = 'Where are you going?';
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
        const scale = clamp(ctx.size.width / (ctx.stage.parentElement.querySelector('.ref-panel') ? 1000 : 1420), 0.68, 1);
        return {
          ...look, ind: 'circles', width: Math.min(700 * scale, ctx.size.width - 24), cols: 1, inline: false,
          vars: {
            ...look.vars,
            '--booking-scale': String(scale),
            '--booking-min-height': `${Math.min(682 * scale, height - 90)}px`,
            '--wz-pad': '0px', '--wz-cols': '1',
            '--wz-h': `${(compact ? 42 : 50) * scale}px`,
            '--wz-gap': `${(compact ? 16 : 23) * scale}px`,
            '--wz-gap2': `${(compact ? 12 : 18) * scale}px`,
            '--booking-gap': `${16 * scale}px`,
            '--booking-strip': `${68 * scale}px`,
            '--booking-dot': `${34 * scale}px`,
            '--booking-ind-font': `${ctx.size.width < 600 ? 12 : ctx.size.width < 900 ? 14 : 19}px`,
            '--booking-ind-gap': `${12 * scale}px`,
            '--booking-foot-gap': `${(compact ? 8 : 18) * scale}px`,
            '--booking-button': `${48 * scale}px`,
          },
        };
      },
    },
  },
});
