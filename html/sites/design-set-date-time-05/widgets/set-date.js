// Keeps the date and preference rows, compact picker, and live reservation preview from this design.
env.widget({
  task: 'set-date',
  site: 'design-set-date-time-05',
  name: 'design',
  split: 'train',
  scenarios: ['time'],
  template: 'set-date/calendar',
  design: {
    parts: {
      fieldRow: (base) => (parent, label, help, util) => {
        const result = base(parent, label, help, util);
        result.row.classList.add('fd-task-row');
        return result;
      },
      sizePop: (base, S) => (w, h) => {
        const { card, control, pop } = S;
        const scale = Math.min(1, (card.clientWidth - control.offsetLeft) / w, card.clientHeight / h);
        const top = Math.min(control.offsetTop + control.offsetHeight + 6, Math.max(0, card.clientHeight - h * scale));
        Object.assign(pop.style, {
          left: control.offsetLeft + 'px',
          top: top + 'px',
          width: w + 'px',
          height: h + 'px',
          transformOrigin: 'top left',
          transform: `scale(${scale})`,
        });
        return top + h * scale + 18;
      },
      bodyStart: (base, S) => (ctx, extras) => {
        base(ctx, extras);
        const { util } = ctx;
        const row = util.el('div', 'fd-row fd-date-row', S.card);
        util.el('div', 'fd-label', row, 'Date');
        const value = util.el('div', 'fd-static fd-date-value', row);
        util.el('span', '', value, 'Apr 26, 2025');
        value.insertAdjacentHTML('beforeend', S.D.calendarIcon);
      },
      built: (base, S) => (ctx) => {
        base(ctx);
        const { util } = ctx;
        const row = util.el('div', 'fd-row fd-preference-row', S.card);
        util.el('div', 'fd-label', row, 'Table Preference (optional)');
        util.el('div', 'fd-static fd-preference-value', row, 'Any');
      },
      positioned: (base, S) => (ctx) => {
        const { util } = ctx;
        const summary = document.querySelector('.ds-reservation-values');
        if (!summary) return;
        const previewRow = (label, value) => {
          const row = util.el('div', 'ds-pv', summary);
          util.el('span', '', row, label);
          return util.el('b', '', row, value);
        };
        previewRow('Date', 'Apr 26, 2025');
        const time = previewRow(S.spec.scene.label, '');
        S.spec.scene.extra.forEach(([label, value]) => previewRow(label, value));
        previewRow('Table Preference', 'Any');
        S.paintFns.push((model) => {
          time.textContent = typeof model.value === 'number' && !isNaN(model.value)
            ? S.fam.helpers.fmt12(model.value)
            : (model.text || '—');
        });
      },
    },
  },
});
