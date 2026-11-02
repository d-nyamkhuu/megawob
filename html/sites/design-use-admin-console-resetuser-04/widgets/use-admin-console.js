// Design on use-admin-console/console; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'use-admin-console',
  site: 'design-use-admin-console-resetuser-04',
  name: 'design',
  split: 'train',
  scenarios: ['resetuser'],
  template: 'use-admin-console/console',
  design: {
    inset: 0, sidebarWidth: 0, narrowSidebarWidth: 0, contextAt: 10000,
    compactAt: 0, fontSize: 16, positive: '#00bd60',
    parts: {
      topbar: () => () => {}, sidebar: () => () => {}, heading: () => () => {},
      tabs: () => () => {}, toolbar: () => () => {},
      directory: (base, S) => (m) => {
        const { ctx, spec, P, main } = S, el = ctx.util.el;
        const body = P.table(main, [['', 'aa-checkcell'], ['Name ▴', 'ns-namecol'],
          ['Email address', 'ns-emailcol'], ['Team', 'ns-teamcol'], ['Status', 'ns-statuscol'],
          ['Last sign in', 'ns-signincol']], 'aa-directory');
        for (const user of spec.users.slice(m.page * m.pageSize, (m.page + 1) * m.pageSize)) P.directoryRow(body, user, m);
        P.pager(spec.users, m);
        const active = m.selected && spec.users.find(user => user.id === m.selected);
        P.resetControls(m, active);
        const history = el('section', 'ns-history', S.workspace);
        const head = el('div', 'ns-section-heading', history);
        el('h2', '', head, 'Recent resets');
        el('span', 'ns-section-caption', head, 'STATUS AND AUDIT HISTORY');
        P.preview(head, 'View all activity →', null, 'Sign-in activity', 'ns-activity-link');
        const rows = spec.users.slice(-2).map((user, i) => [
          i ? '2025-04-28 16:03' : '2025-04-29 09:14', user.email,
          i ? 'Reset MFA' : 'Reset password', 'Email sent', 'Completed', i ? 'AUD-20250428-7711' : 'AUD-20250429-1142']);
        const table = P.miniTable(history, ['Time (UTC)', 'User', 'Action', 'Notification', 'Status', 'Audit reference'], rows);
        for (const row of table.tBodies[0].rows) {
          const cell = row.cells[4]; cell.textContent = ''; P.status(cell, 'Completed');
        }
      },
      directoryRow: (base, S) => (body, user, m) => {
        const el = S.ctx.util.el, P = S.P;
        const row = el('tr', m.selected === user.id ? 'selected' : '', body);
        const check = el('td', 'aa-checkcell', row);
        const checkbox = P.button(check, '', null, { row: user.id }, 'ns-row-check');
        checkbox.setAttribute('aria-label', `Select ${user.name}`);
        checkbox.setAttribute('aria-pressed', String(m.selected === user.id));
        el('i', 'aa-checkmark', checkbox, m.selected === user.id ? '✓' : '');
        P.button(el('td', '', row), user.name, { row: user.id }, { row: user.id }, 'aa-link');
        el('td', 'ns-email', row, user.email);
        el('td', '', row, user.team);
        P.status(el('td', '', row), m.resets[user.id] ? 'Updated' : 'Active');
        const index = S.spec.users.indexOf(user);
        el('td', 'ns-signin', row, `2025-04-${29 - index % 6} ${['14:32', '09:11', '16:03', '11:20', '18:45', '08:17'][index % 6]}`);
      },
      pager: (base, S) => (records, m) => {
        base(records, m);
        const pager = S.workspace.lastElementChild;
        const count = pager.firstElementChild;
        count.className = 'ns-page-count';
        pager.append(count);
        const previous = S.P.button(pager, '‹', null, null, 'ns-page-arrow'); previous.disabled = m.page === 0;
        if (m.page > 0) previous.addEventListener('click', () => S.P.act({ page: m.page - 1 }));
        pager.prepend(previous);
        const next = S.P.button(pager, '›', null, null, 'ns-page-arrow');
        next.disabled = (m.page + 1) * m.pageSize >= records.length;
        if (!next.disabled) next.addEventListener('click', () => S.P.act({ page: m.page + 1 }));
        pager.insertBefore(next, count);
      },
      resetControls: (base, S) => (m, active) => {
        base(m, active);
        const el = S.ctx.util.el, detail = S.workspace.lastElementChild;
        const original = detail.querySelector('.aa-detail-row');
        const picker = original.querySelector('.aa-picker');
        const label = original.querySelector('label');
        const review = original.querySelector('.primary');
        const sub = detail.querySelector('.aa-sub');
        const heading = el('div', 'ns-section-heading');
        el('h2', '', heading, 'Account actions');
        el('span', 'ns-section-caption', heading, 'RESET PASSWORD OR MFA FOR A SELECTED USER');
        const row = el('div', 'ns-action-row');
        el('strong', 'ns-action-label', row, 'Action'); row.append(picker);
        el('strong', 'ns-notify-label', row, 'Email notification');
        label.className = 'ns-notify-toggle'; label.lastElementChild.textContent = 'Notify user by email';
        const note = el('span', 'ns-notify-copy', label);
        el('small', '', note, 'Send an email to the user with next steps.');
        row.append(label, review);
        detail.replaceChildren(heading, row);
        if (active) { sub.textContent = active.email; detail.append(sub); }
      },
      facts: (base, S) => (m) => {
        base(m);
        const facts = S.workspace.lastElementChild;
        const detail = S.workspace.querySelector('.aa-detail');
        if (detail) detail.append(facts);
      },
    },
  },
});
