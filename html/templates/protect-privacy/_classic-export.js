/* protect-privacy/classic: export parts; existing design parts remain overridable. */
(function () {
  'use strict';
  env.template('protect-privacy/_classic-export', () => ({
    install(BASE, state) {
      BASE.navigation = (crm) => {
        const nav = state.P.element('div', 'sp-crm-nav', crm);
        const hd = state.P.element('div', '', nav, state.orgName); hd.style.cssText = 'font-weight:700;color:var(--fg);padding:4px 8px 10px';
        for (const x of ['Dashboard', state.spec.table, 'Segments', 'Reports', 'Settings']) state.P.element('div', x === state.spec.table ? 'cur' : '', nav, x);
      };

      BASE.table = (main, m) => {
        const top = state.P.element('div', '', main);
        top.style.cssText = 'display:flex;align-items:center;gap:10px;margin-bottom:10px';
        state.P.element('div', 'sp-h2', top, state.spec.table).style.margin = '0';
        state.P.element('span', 'sp-muted', top, `${state.spec.total.toLocaleString('en-US')} records`);
        const sp = state.P.element('span', '', top); sp.style.flex = '1';
        state.P.element('button', 'sp-btn sm', top, 'Filter');
        state.P.key(state.P.element('button', 'sp-btn sm', top, '⤓ Export'), 'exp-open');
        const card = state.P.element('div', 'sp-card', main);
        card.style.overflow = 'hidden';
        const tbl = state.P.element('table', 'sp-tbl', card);
        const tr = state.P.element('tr', '', state.P.element('thead', '', tbl));
        for (const c of state.spec.cols) state.P.element('th', '', tr, c.label);
        const tbd = state.P.element('tbody', '', tbl);
        for (const r of state.spec.rows) state.P.record(tbd, r);
        if (m.exported) {
          const n = state.spec.cols.filter((c) => m.cols[c.id]).length;
          const db = state.P.element('div', 'sp-dlbar', main);
          state.P.element('span', '', db, '#doc');
          state.P.element('b', '', db, `${state.spec.table.toLowerCase()}_export.${m.fmt}`);
          state.P.element('span', 'sp-muted', db, `${n} columns · ${state.spec.total.toLocaleString('en-US')} rows · Export complete`);
        }
      };

      BASE.dialog = (m) => {
        const scrim = state.P.element('div', 'sp-scrim', state.app);
        const dlg = state.P.element('div', 'sp-dlg', scrim);
        dlg.style.width = 'min(460px, 94%)';
        state.P.element('div', 'sp-h2', dlg, `Export ${state.spec.table.toLowerCase()}`);
        state.P.columns(dlg, m);
        state.P.format(dlg, m);
        state.P.dialogActions(dlg, m);
      };

      BASE.columns = (dlg, m) => {
        const anonSet = state.spec.cols.filter((c) => !c.personal).map((c) => c.id);
        const isAll = state.spec.cols.every((c) => m.cols[c.id]);
        const isAnon = state.spec.cols.every((c) => !!m.cols[c.id] === anonSet.includes(c.id));
        state.P.element('div', 'sp-sec', dlg, 'Columns').style.marginTop = '8px';
        state.P.preset(dlg, 'preset:all', 'All columns', isAll);
        state.P.preset(dlg, 'preset:anon', 'Without personal data (names, contact details, birth dates)', isAnon && !isAll, state.spec.locked ? 'Business' : null);
        const cust = state.P.element('div', 'sp-cb', dlg); state.P.element('span', `sp-radio${!isAll && !isAnon ? ' on' : ''}`, cust); state.P.element('span', '', cust, 'Custom');
        if (state.spec.locked) cust.classList.add('dis');
        const grid = state.P.element('div', '', dlg);
        grid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:0 16px;margin:2px 0 0 24px';
        for (const c of state.spec.cols) { state.P.column(grid, c, m); }
        if (state.spec.locked) state.P.element('div', 'sp-warn', dlg, 'Choosing columns is available on the Business plan.').style.marginTop = '6px';
      };

      BASE.format = (dlg, m) => {
        state.P.element('div', 'sp-sec', dlg, 'Format');
        const seg = state.P.element('div', 'sp-seg', dlg);
        seg.style.marginTop = '6px';
        for (const f of ['csv', 'xlsx', 'pdf']) state.P.key(state.P.element('span', m.fmt === f ? 'on' : '', seg, state.fam.FMT_LABEL[f]), `fmt:${f}`);
      };

      BASE.dialogActions = (dlg, m) => {
        const row = state.P.element('div', '', dlg);
        row.style.cssText = 'display:flex;justify-content:flex-end;gap:8px;margin-top:14px';
        state.P.key(state.P.element('button', 'sp-btn', row, 'Cancel'), 'exp-cancel');
        state.P.key(state.P.element('button', 'sp-btn pri', row, 'Export'), 'exp-go');
      };

      BASE.preset = (dlg, k, label, on, badge) => {
        const r = state.P.key(state.P.element('div', `sp-cb${badge ? ' dis' : ''}`, dlg), k);
        state.P.element('span', `sp-radio${on ? ' on' : ''}`, r);
        state.P.element('span', '', r, label);
        if (badge) state.P.element('span', 'sp-badge', r, badge);
      };

      BASE.column = (grid, c, m) => {
        const r = state.P.key(state.P.element('div', `sp-cb${state.spec.locked ? ' dis' : ''}`, grid), `col:${c.id}`);
        state.P.element('span', `sp-box${m.cols[c.id] ? ' on' : ''}${state.spec.locked ? ' dis' : ''}`, r, m.cols[c.id] ? '✓' : '');
        state.P.element('span', '', r, c.label);
      };

      BASE.record = (tbd, r) => {
        const row = state.P.element('tr', '', tbd);
        for (const c of state.spec.cols) state.P.element('td', '', row, r[c.id]);
      };

      BASE.view = (m) => {
        const crm = state.P.element('div', 'sp-crm', state.app);
        state.P.navigation(crm);
        const main = state.P.element('div', 'sp-main', crm);
        main.style.padding = '12px 14px';
        state.P.table(main, m);
        if (!m.dlg) return;
        state.P.dialog(m);
      };
    },
  }));
})();
