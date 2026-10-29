/* protect-privacy/classic: autofill parts; existing design parts remain overridable. */
(function () {
  'use strict';
  env.template('protect-privacy/_classic-autofill', () => ({
    install(BASE, state) {
      BASE.summary = (co) => {
        const sum = state.P.element('div', 'sp-card', co);
        sum.style.width = state.narrow ? '200px' : '240px';
        state.P.element('div', 'sp-sec', sum, 'Order summary').style.marginTop = '0';
        const items = [['Wireless earbuds', '$59.00'], ['Charging case', '$19.00'], ['Shipping', '$4.99']];
        for (const [a, b] of items) { const r = state.P.element('div', '', sum); r.style.cssText = 'display:flex;justify-content:space-between;padding:4px 0'; state.P.element('span', '', r, a); state.P.element('span', '', r, b); }
        const t = state.P.element('div', '', sum); t.style.cssText = 'display:flex;justify-content:space-between;padding:6px 0;border-top:1px solid var(--line);font-weight:700';
        state.P.element('span', '', t, 'Total'); state.P.element('span', '', t, '$82.99');
      };

      BASE.form = (co, m) => {
        const card = state.P.element('div', 'sp-card', co);
        card.style.flex = '1';
        state.P.element('div', 'sp-h2', card, 'Shipping address');
        if (state.spec.locked) state.P.element('div', 'sp-muted', card, '#shield For your security, use your saved browser profile to fill this form.').style.fontSize = '12px';
        const grid = state.P.element('div', 'sp-grid', card);
        state.P.fields(grid, m);
        state.P.hiddenInputs(card, m);
        state.P.formActions(card, m);
      };

      BASE.fields = (grid, m) => {
        for (const f of state.spec.fields) { state.P.fieldRow(grid, f, m); }
      };

      BASE.hiddenInputs = (card, m) => {
        // Hidden inputs the saved profile would also fill.
        for (const x of state.spec.hidden) {
          const hp = state.P.element('div', 'sp-hp', card);
          const i = state.P.element('input', '', hp, undefined, { name: x.id, autocomplete: 'on', tabindex: '-1', 'aria-hidden': 'true' });
          i.value = m.used ? '•' : '';
        }
      };

      BASE.formActions = (card, m) => {
        const row = state.P.element('div', '', card);
        row.style.cssText = 'display:flex;align-items:center;gap:12px;margin-top:14px';
        state.P.key(state.P.element('button', 'sp-btn pri', row, state.spec.button), 'af-submit');
        if (m.sent) state.P.element('span', 'sp-ok', row, 'Address saved. Continue with payment.');
      };

      BASE.fieldRow = (grid, f, m) => {
        const box = state.P.field(grid, f, m.vals[f.id], { k: `af:${f.id}`, req: true, ro: state.spec.locked, wide: f.id === 'street' || f.id === 'name' });
        box.classList.add('sp-rel');
        if (m.dd === f.id) state.P.autofillMenu(box, m);
      };

      BASE.autofillMenu = (box, m) => {
        const dd = state.P.element('div', 'sp-dd', box);
        const o = state.P.key(state.P.element('div', 'opt', dd), 'af-pick');
        state.P.element('b', '', o, state.U.full);
        state.P.element('small', '', o, `${state.U.street}, ${state.U.city}`);
        const what = state.spec.fields.map((x) => x.label).concat(state.spec.hidden.map((x) => x.label));
        state.P.element('small', '', o, `Fills ${what.length} fields: ${what.join(', ')}`);
        state.P.element('div', 'foot', dd, 'Manage addresses…');
      };

      BASE.view = (m) => {
        const main = state.P.element('div', 'sp-main', state.app);
        state.P.siteHead(main, ['Cart › ', 'Shipping › ', 'Payment']);
        const co = state.P.element('div', 'sp-co', main);
        state.P.form(co, m);
        state.P.summary(co);
      };
    },
  }));
})();
