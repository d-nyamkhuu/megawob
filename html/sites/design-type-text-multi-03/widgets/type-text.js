env.widget({
  task: 'type-text',
  site: 'design-type-text-multi-03',
  name: 'design',
  split: 'train',
  scenarios: ['multi'],
  template: 'type-text/fields',
  design: {
    labelSuffix: ':',
    errIn: 'box',
    parts: {
      fieldDone: () => (ctx, e) => {
        if (/zip|postal/i.test(e.f.label)) e.wrap.classList.add('ft-postal');
      },
      // Unscored address controls fill out the shipping board without changing the seeded fields.
      afterFields: () => (ctx, grid) => {
        const { spec, util } = ctx;
        for (let i = spec.fields.length; i < 5; i++) {
          const row = util.el('div', 'ft-field ft-extra', grid);
          const postal = grid.querySelector('.ft-postal');
          if (postal) grid.insertBefore(row, postal);
          const label = util.el('label', 'ft-label', row, i === spec.fields.length ? 'Address line 2 (optional):' : 'Delivery note (optional):');
          const box = util.el('div', 'ft-inwrap', row);
          const input = util.el('input', 'ft-input', box);
          input.type = 'text';
          input.tabIndex = -1;
          input.id = 'shipping-extra-' + i;
          label.htmlFor = input.id;
        }
        const countryRow = util.el('div', 'ft-field ft-country', grid);
        util.el('span', 'ft-label', countryRow, 'Country:');
        const countryBox = util.el('div', 'ft-inwrap', countryRow);
        const country = util.el('button', 'ft-input ft-country-control', countryBox, 'United Kingdom');
        country.type = 'button';
        country.tabIndex = -1;
        country.setAttribute('aria-label', 'Country');
        country.setAttribute('aria-expanded', 'false');
        const menu = util.el('div', 'ft-country-menu', countryBox);
        menu.hidden = true;
        ['United Kingdom', 'United States', 'Canada'].forEach((name) => {
          const option = util.el('button', '', menu, name);
          option.type = 'button';
          option.addEventListener('click', () => {
            country.firstChild.textContent = name;
            menu.hidden = true;
            country.setAttribute('aria-expanded', 'false');
          });
        });
        country.addEventListener('click', () => {
          menu.hidden = !menu.hidden;
          country.setAttribute('aria-expanded', String(!menu.hidden));
        });
      },
      clear: (base, S) => () => {
        base();
        S.st.card.querySelectorAll('.ft-extra input').forEach((el) => { el.value = ''; });
      },
      fit: (base, S) => (ctx, card) => {
        const { st } = S;
        const grid = card.querySelector('.ft-grid');
        const controls = ctx.stage.parentElement.querySelector('.ds-btns');
        const bottom = controls ? parseFloat(getComputedStyle(controls).bottom) || 0 : 16;
        const controlHeight = Math.max(controls ? controls.getBoundingClientRect().height : 0, st.save ? st.save.getBoundingClientRect().height : 0);
        const available = Math.max(1, ctx.size.height - controlHeight - bottom - 12);
        if (card.offsetHeight > available) {
          // Absolutely positioned Save was excluded from the old overflow measurement.
          // Dock it outside the scaled card, retaining its native form submission.
          if (st.save) {
            card.id = 'shipping-task-form';
            st.save.setAttribute('form', card.id);
            const actions = st.save.parentElement;
            actions.classList.add('ft-actions-docked');
            ctx.stage.append(actions);
          }
          grid.classList.remove('inline');
          grid.classList.add('columns');
          grid.style.setProperty('grid-template-columns', '1fr 1fr', 'important');
          const cr = card.getBoundingClientRect();
          const ratio = Math.min(1, available / cr.height);
          if (ratio < 1) {
            card.style.setProperty('transform', `scale(${ratio})`, 'important');
            card.style.transformOrigin = 'top center';
          }
        }
      },
    },
  },
});
