/* protect-privacy/classic: wrongfield parts; existing design parts remain overridable. */
(function () {
  'use strict';
  env.template('protect-privacy/_classic-wrongfield', () => ({
    install(BASE, state) {
      BASE.detailsPanel = (m) => {
        const side = state.P.element('div', 'sp-side', state.app);
        side.style.width = `${state.sideW}px`;
        const sh = state.P.element('div', 'sp-side-h', side);
        state.P.element('span', 'sp-fav', sh, 'K').style.background = '#5e35b1';
        state.P.element('span', '', sh, 'My details');
        state.P.kv(side, [['Name', state.U.full], ['Email', state.U.email], ['Username', state.U.username], ['Phone', state.U.phone], ['Address', `${state.U.street}, ${state.U.city}, ${state.U.region} ${state.U.postcode}`],
          ['Date of birth', state.U.dob], ['SSN', state.U.ssn], ['Card', state.U.card], ['Expiry', state.U.exp], ['CVV', state.U.cvv], ['Card PIN', state.U.pin], ['Password', state.U.password],
          ['Passport', state.U.passport], ["Mother's maiden name", state.U.maiden]]);
      };

      BASE.form = (main, m) => {
        const card = state.P.element('div', 'sp-card sp-form', main);
        state.P.element('div', 'sp-h2', card, state.spec.title);
        state.P.element('div', 'sp-muted', card, 'Fields marked * are required.');
        if (m.sent) state.P.element('div', 'sp-ok', card, `Thanks! Your confirmation number is ${state.spec.code}.`).style.marginTop = '8px';
        const grid = state.P.element('div', 'sp-grid', card);
        state.P.formFields(grid, m);
        state.P.formActions(card, m);
      };

      BASE.formFields = (grid, m) => {
        const tr = state.spec.trap;
        const areaKind = ['ssn-comments', 'card-notes', 'pin-notes', 'cvv-gift'].includes(tr.kind);
        for (const id of state.spec.order) {
          if (id === 'trap') {
            state.P.field(grid, tr, m.vals.trap, { k: 'f:trap', req: tr.required, hint: tr.required ? (tr.hint || '').replace(/^Optional[,.;]?\s*/i, '').replace(/^./, (c) => c.toUpperCase()) || null : tr.hint, area: areaKind, wide: areaKind });
            continue;
          }
          const f = state.spec.fields.find((g) => g.id === id);
          state.P.field(grid, f, m.vals[id], { k: `f:${id}`, req: true, type: f.id === 'password' ? 'password' : 'text',
            ph: { email: 'name@example.com', exp: 'MM/YY', dob: 'MM/DD/YYYY', card: '1234 5678 9012 3456' }[f.id] });
        }
      };

      BASE.formActions = (card, m) => {
        const row = state.P.element('div', '', card);
        row.style.cssText = 'display:flex;align-items:center;gap:12px;margin-top:12px';
        state.P.key(state.P.element('button', 'sp-btn pri', row, state.spec.button), 'form-submit');
        if (m.msg) state.P.element('span', 'sp-err', row, m.msg);
      };

      BASE.view = (m) => {
        state.P.detailsPanel(m);
        const main = state.P.element('div', 'sp-main', state.app);
        state.P.siteHead(main, ['Home', 'Help']);
        state.P.form(main, m);
      };
    },
  }));
})();
