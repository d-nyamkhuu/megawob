/* protect-privacy/classic: retention parts; existing design parts remain overridable. */
(function () {
  'use strict';
  const list = (xs) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);
  env.template('protect-privacy/_classic-retention', () => ({
    install(BASE, state) {
      BASE.navigation = (acct) => {
        const nav = state.P.element('div', 'sp-crm-nav', acct);
        const hd = state.P.element('div', '', nav, state.orgName); hd.style.cssText = 'font-weight:700;color:var(--fg);padding:4px 8px 10px';
        for (const x of ['Account', 'Security', 'Data & privacy', 'Notifications', 'Billing']) state.P.element('div', x === 'Data & privacy' ? 'cur' : '', nav, x);
      };

      BASE.request = (main, m, label) => {
        if (state.spec.via === 'request') {
          const rq = state.P.element('div', 'sp-card sp-req', main);
          const t = state.P.element('div', '', rq); t.style.cssText = 'display:flex;gap:8px;align-items:baseline';
          state.P.element('b', '', t, `Data request ${state.spec.reqId}`);
          state.P.element('span', 'sp-muted', t, `from ${state.spec.requester.name} <${state.spec.requester.email}>`).style.fontSize = '12px';
          const cats = list(state.spec.want.map(label));
          const r = state.spec.requester;
          const text = r.self
            ? `Hi, this is ${state.U.full}, the account holder. Please ${state.spec.mode === 'download' ? `send me a copy of my ${cats}` : `delete my ${cats}`}. Thanks!`
            : `Hi, I'm ${state.U.first}'s ${r.rel}, ${r.name}. Please ${state.spec.mode === 'download' ? `send a copy of ${state.U.first}'s ${cats} to ${r.email}` : `delete ${state.U.first}'s ${cats}`}; they asked me to take care of it.`;
          state.P.element('div', '', rq, text).style.marginTop = '4px';
          if (m.req === 'pending') {
            const row = state.P.element('div', 'row', rq);
            state.P.key(state.P.element('button', 'sp-btn sm pri', row, 'Approve'), 'req-approve');
            state.P.key(state.P.element('button', 'sp-btn sm', row, 'Decline'), 'req-decline');
          } else state.P.element('div', 'sp-muted', rq, m.req === 'approved' ? 'Approved' : 'Declined').style.marginTop = '6px';
        }
      };

      BASE.download = (cols, m, label) => {
        const dl = state.P.element('div', 'sp-card', cols);
        state.P.element('div', 'sp-sec', dl, 'Download your data').style.marginTop = '0';
        state.P.element('div', 'sp-muted', dl, 'Get a copy of what you shared with us.').style.cssText = 'font-size:12px;margin-bottom:4px';
        for (const c of state.spec.cats) { state.P.downloadRow(dl, c, m); }
        const to = state.P.element('div', 'sp-rel', dl);
        to.style.margin = '6px 0 8px';
        state.P.element('div', 'sp-muted', to, 'Deliver to').style.fontSize = '11.5px';
        state.P.key(state.P.element('span', 'sp-rolebtn', to, `✉ ${m.to} ▾`), 'to-btn').style.cssText = 'border:1px solid var(--line);max-width:100%;overflow:hidden';
        if (m.toMenu) {
          const mn = state.P.menu(to, [{ k: `to:${state.U.email}`, label: state.U.email, sub: 'Primary · verified', v: state.U.email },
            { k: `to:${state.spec.alt}`, label: state.spec.alt, sub: 'Added 3 days ago · not verified', v: state.spec.alt }], m.to);
          mn.style.left = '0'; mn.style.top = '100%';
        }
        state.P.key(state.P.element('button', 'sp-btn sm pri', dl, 'Request download'), 'dl-go');
        if (m.requested) state.P.element('div', 'sp-ok', dl, `Export of ${list(m.requested.map(label))} requested. We'll email the link to ${m.to}.`).style.marginTop = '8px';
      };

      BASE.deletion = (cols, m, label) => {
        const del = state.P.element('div', 'sp-card', cols);
        const dh = state.P.element('div', '', del); dh.style.cssText = 'display:flex;align-items:baseline;justify-content:space-between';
        state.P.element('div', 'sp-sec', dh, 'Delete data').style.marginTop = '0';
        state.P.key(state.P.element('span', 'sp-link', dh, 'Select all'), 'del-all').style.fontSize = '12px';
        state.P.element('div', 'sp-muted', del, 'Deleted data cannot be recovered.').style.cssText = 'font-size:12px;margin-bottom:4px';
        for (const c of state.spec.cats) { state.P.deletionRow(del, c, m); }
        const db = state.P.key(state.P.element('button', 'sp-btn sm danger', del, 'Delete selected'), 'del-ask');
        db.style.marginTop = '8px';
        if (m.deleted.length) state.P.element('div', 'sp-ok', del, `Deleted: ${list(m.deleted.map(label))}.`).style.marginTop = '8px';
      };

      BASE.confirmation = (m) => {
        if (m.confirm) {
          const scrim = state.P.element('div', 'sp-scrim', state.app);
          const dlg = state.P.element('div', 'sp-dlg', scrim);
          dlg.style.width = 'min(400px, 92%)';
          const sel = state.spec.cats.filter((c) => m.del[c.id]);
          state.P.element('div', 'sp-h2', dlg, `Delete ${sel.length} ${sel.length === 1 ? 'category' : 'categories'}?`);
          state.P.element('div', '', dlg, `${list(sel.map((c) => c.label))} will be permanently deleted. This can't be undone.`);
          const row = state.P.element('div', '', dlg); row.style.cssText = 'display:flex;justify-content:flex-end;gap:8px;margin-top:14px';
          state.P.key(state.P.element('button', 'sp-btn', row, 'Cancel'), 'del-cancel');
          state.P.key(state.P.element('button', 'sp-btn danger', row, 'Delete'), 'del-go');
        }
      };

      BASE.downloadRow = (dl, c, m) => {
        const r = state.P.key(state.P.element('div', 'sp-cb', dl), `dl:${c.id}`);
        state.P.element('span', `sp-box${m.dl[c.id] ? ' on' : ''}`, r, m.dl[c.id] ? '✓' : '');
        state.P.element('span', '', r, c.label);
      };

      BASE.deletionRow = (del, c, m) => {
        const gone = m.deleted.includes(c.id);
        const r = state.P.key(state.P.element('div', `sp-cb${gone ? ' dis' : ''}`, del), `del:${c.id}`);
        state.P.element('span', `sp-box${m.del[c.id] ? ' on' : ''}`, r, m.del[c.id] ? '✓' : '');
        state.P.element('span', gone ? 'sp-muted' : '', r, gone ? `${c.label} (deleted)` : c.label);
      };

      BASE.view = (m) => {
        const acct = state.P.element('div', 'sp-acct', state.app);
        state.P.navigation(acct);
        const main = state.P.element('div', 'sp-acct-main', acct);
        const top = state.P.element('div', '', main); top.style.cssText = 'display:flex;align-items:baseline;gap:10px';
        state.P.element('div', 'sp-h2', top, 'Data & privacy').style.margin = '0';
        state.P.element('span', 'sp-muted', top, `Signed in as ${state.U.email}`).style.fontSize = '12px';
        const label = (id) => state.spec.cats.find((c) => c.id === id).label.toLowerCase();
        state.P.request(main, m, label);
        const cols = state.P.element('div', 'sp-cols', main);
        state.P.download(cols, m, label);
        state.P.deletion(cols, m, label);
        state.P.confirmation(m);
      };
    },
  }));
})();
