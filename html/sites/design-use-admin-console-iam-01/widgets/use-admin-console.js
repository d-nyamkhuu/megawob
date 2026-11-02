// Design on use-admin-console/console; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'use-admin-console',
  site: 'design-use-admin-console-iam-01',
  name: 'design',
  split: 'train',
  scenarios: ['iam'],
  template: 'use-admin-console/console',
  design: {
    inset: 0, contextAt: 10000, sidebarWidth: 0, narrowSidebarWidth: 0,
    fontFamily: '"Segoe UI",Tahoma,Arial,sans-serif', fontSize: 15, radius: 8,
    parts: {
      icon: (base, S) => (parent, name, cls = '') => {
        const paths = {
          person: 'M12 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10ZM3 23v-3c0-8 18-8 18 0v3Z',
          users: 'M9 3a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9ZM1 22v-3c0-7 16-7 16 0v3ZM18 3a4 4 0 1 1 0 8h-2a6 6 0 0 0 0-8ZM19 14c4 0 5 2 5 5v3h-5v-3a8 8 0 0 0-2-5Z',
          shield: 'M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6l-9-4Z',
        };
        if (!paths[name]) return base(parent, name, cls);
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('class', `aa-icon ${name !== 'shield' ? 'iam-glyph-solid' : ''} ${cls}`);
        svg.setAttribute('aria-hidden', 'true');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', paths[name]); svg.append(path); parent.append(svg); return svg;
      },
      topbar: () => () => {},
      sidebar: () => () => {},
      tabs: () => () => {},
      heading: (base, S) => (m) => {
        const el = S.ctx.util.el;
        const head = el('div', 'iam-heading', S.workspace);
        const title = el('div', '', head);
        el('h1', '', title, 'Users');
        el('div', 'iam-subtitle', title, 'Manage directory accounts, roles and licences');
        const search = el('label', 'iam-search', head);
        S.P.icon(search, 'search');
        const input = el('input', '', search);
        input.type = 'search'; input.placeholder = 'Search users, teams or email addresses...';
        input.setAttribute('aria-label', input.placeholder); input.value = S.ui.search;
        input.addEventListener('input', () => { S.ui.search = input.value; });
        input.addEventListener('keydown', e => {
          if (e.key === 'Enter') { S.ui.preview = 'Search results'; S.P.draw(S.ctx.model); }
        });
      },
      toolbar: (base, S) => (m) => {
        const el = S.ctx.util.el, values = Object.values(m.access);
        const n = S.spec.users.length, admins = values.filter(a => a.role === 'Administrator').length;
        const operators = values.filter(a => a.role === 'Operator').length;
        const licensed = values.filter(a => a.licence !== 'None').length;
        const stats = el('div', 'iam-stats', S.workspace);
        for (const [label, count, detail, icon, tone] of [
          ['Total users', n, 'Across all teams', 'users', 'users'],
          ['Administrators', admins, `${Math.round(admins / n * 100)}% of users`, 'shield', 'admin'],
          ['Operators', operators, `${Math.round(operators / n * 100)}% of users`, 'person', 'operator'],
          ['Licence assignments', licensed, `${Math.round(licensed / n * 100)}% of users`, 'document', 'licence'],
        ]) {
          const card = el('div', `iam-stat iam-tone-${tone}`, stats);
          const badge = el('div', 'iam-stat-icon', card); S.P.icon(badge, icon);
          const copy = el('div', '', card); el('div', 'iam-stat-label', copy, label);
          el('b', 'iam-stat-value', copy, String(count)); el('div', 'iam-stat-detail', copy, detail);
        }
      },
      directory: (base, S) => (m) => {
        const el = S.ctx.util.el, users = S.spec.users;
        const panel = el('div', 'iam-directory', S.main);
        const pager = el('div', 'iam-pagination', panel);
        const pages = Math.ceil(users.length / m.pageSize);
        el('span', 'iam-page-label', pager, `Page ${m.page + 1} of ${pages}`);
        const back = S.P.button(pager, '', null, null, 'iam-page-arrow', 'back');
        back.disabled = m.page === 0;
        back.addEventListener('click', () => S.P.act({ page: m.page - 1 }));
        for (let i = 0; i < pages; i++) S.P.button(pager, String(i + 1), { page: i }, { page: i }, m.page === i ? 'iam-page current' : 'iam-page');
        const next = S.P.button(pager, '', null, null, 'iam-page-arrow', 'chevron');
        next.disabled = m.page + 1 >= pages;
        next.addEventListener('click', () => S.P.act({ page: m.page + 1 }));
        el('span', 'aa-grow', pager);
        el('span', 'iam-result-count', pager, `Showing ${m.page * m.pageSize + 1} – ${Math.min(users.length, (m.page + 1) * m.pageSize)} of ${users.length} users`);
        el('span', 'iam-sort-label', pager, 'Sort by');
        S.P.preview(pager, 'Name (A – Z)', 'down', 'Directory sort', 'iam-sort');
        const rows = el('div', 'iam-accounts', panel);
        for (const u of users.slice(m.page * m.pageSize, (m.page + 1) * m.pageSize)) S.P.directoryRow(rows, u, m);
      },
      directoryRow: (base, S) => (parent, u, m) => {
        const el = S.ctx.util.el, access = m.access[u.id];
        const row = el('div', `iam-account${m.selected === u.id ? ' is-selected' : ''}`, parent);
        const avatar = S.P.button(row, u.name.split(' ').map(x => x[0]).slice(0, 2).join('').toUpperCase(), null, { row: u.id }, 'iam-avatar');
        avatar.setAttribute('aria-label', `Edit ${u.name}`);
        const identity = el('div', 'iam-identity', row);
        S.P.button(identity, u.name, { row: u.id }, { row: u.id }, 'iam-name');
        const role = el('div', `iam-access iam-role${access.role === 'Administrator' ? ' is-admin' : ''}`, identity);
        S.P.icon(role, access.role === 'Administrator' ? 'shield' : 'person');
        el('span', '', role, access.role);
        el('div', 'iam-email', row, u.email);
        const department = el('div', 'iam-department', row);
        el('div', 'iam-team', department, u.team);
        const licence = el('div', `iam-access iam-product${access.licence === 'Workspace Plus' ? ' is-plus' : ''}`, department);
        S.P.icon(licence, access.licence === 'Workspace Plus' ? 'folder' : 'document');
        el('span', '', licence, access.licence);
      },
      facts: (base, S) => (m) => {
        const el = S.ctx.util.el, values = Object.values(m.access);
        const summary = el('div', 'iam-summary', S.workspace);
        const heading = el('div', 'iam-summary-heading', summary);
        el('b', '', heading, 'Access summary'); el('span', '', heading, ' (all users)');
        const counts = el('div', 'iam-summary-counts', summary);
        for (const [label, key, value, icon, tone] of [
          ['Administrators', 'role', 'Administrator', 'shield', 'admin'],
          ['Operators', 'role', 'Operator', 'person', 'users'],
          ['Workspace Plus', 'licence', 'Workspace Plus', 'folder', 'plus'],
          ['Workspace Basic', 'licence', 'Workspace Basic', 'document', 'basic'],
        ]) {
          const item = el('div', `iam-summary-item iam-tone-${tone}`, counts);
          S.P.icon(item, icon); const copy = el('div', '', item);
          el('span', '', copy, label); el('b', '', copy, String(values.filter(a => a[key] === value).length));
        }
        // Preserve task-owned report facts in the summary's quiet metadata line.
        base(m);
        summary.append(S.workspace.lastElementChild);
      },
    },
  },
});
