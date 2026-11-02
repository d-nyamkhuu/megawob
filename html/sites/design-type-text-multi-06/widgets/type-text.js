env.widget({
  task: 'type-text',
  site: 'design-type-text-multi-06',
  name: 'design',
  split: 'train',
  scenarios: ['multi'],
  template: 'type-text/fields',
  design: {
    subtitle: 'Add a new address for this contact.',
    title: 'Company Address',
    fit: null,
    parts: {
      finish: (base, S) => (ctx, card) => {
        const { st } = S;
        const { spec } = ctx;
        card.style.setProperty('--field-count', spec.fields.length);
        // Keep long seeded forms inside the existing stage, above its action strip.
        card.style.height = Math.min(ctx.size.height, ctx.stage.clientHeight) + 'px';
        const grid = card.querySelector('.ft-grid');
        const footer = document.querySelector('.ds-footer');
        const actions = card.querySelector('.ft-actions');
        const actionSpace = actions ? actions.getBoundingClientRect().height + parseFloat(getComputedStyle(actions).marginTop) : 0;
        let room = footer.getBoundingClientRect().top - grid.getBoundingClientRect().top - 12 - actionSpace;
        const gridHeight = grid.getBoundingClientRect().height;
        if (gridHeight > room) {
          const n = spec.fields.length;
          const gap = Math.min(6, Math.max(2, room / (n * 12)));
          const errors = spec.save ? n * 12 : 0;
          let row = (room - errors - gap * ((spec.save ? 2 * n : n) - 1)) / n;
          card.classList.add('ft-compact');
          if (row < 18 && spec.save) {
            // Extreme OOD forms keep validation beside its input rather than consuming a second row.
            card.classList.add('ft-dense');
            for (const x of Object.values(st.inputs)) if (x.err) x.el.parentElement.appendChild(x.err);
            room = footer.getBoundingClientRect().top - grid.getBoundingClientRect().top - 12 - actionSpace;
            row = (room - gap * (n - 1)) / n;
          }
          row = Math.max(16, row);
          card.style.setProperty('--fit-row', row + 'px');
          card.style.setProperty('--fit-gap', gap + 'px');
        }
        const requirements = document.querySelectorAll('.ds-req');
        const side = document.querySelector('.ds-side');
        requirements.forEach((row) => row.remove());
        const divider = side.querySelectorAll('hr')[1];
        spec.fields.filter((f) => !f.blank).forEach((f) => {
          const row = ctx.util.el('div', 'ds-req', null);
          ctx.util.el('span', 'ds-circ', row);
          ctx.util.el('span', '', row, f.label);
          side.insertBefore(row, divider);
        });
        const sideEnd = side.querySelector('[data-role="submit"]');
        const sideLimit = sideEnd ? sideEnd.getBoundingClientRect().top - 12 : side.getBoundingClientRect().bottom - 16;
        if (side.querySelector('.ds-tip').getBoundingClientRect().bottom > sideLimit) side.classList.add('ds-side-compact');
        const first = spec.fields.find((f) => !f.blank && !f.disabled);
        if (first) st.inputs[first.id].el.focus({ preventScroll: true });
      },
    },
  },
});
