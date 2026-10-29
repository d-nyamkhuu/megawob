// Design on use-admin-console/console; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'use-admin-console',
  site: 'design-use-admin-console-iam-05',
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
        el('h1', '', title, 'User accounts');
        el('div', 'iam-subtitle', title, `${S.spec.users.length} accounts`);
        const search = el('label', 'iam-search', head);
        S.P.icon(search, 'search');
        const input = el('input', '', search);
        input.type = 'search'; input.placeholder = 'Search accounts...';
        input.setAttribute('aria-label', input.placeholder); input.value = S.ui.search;
        input.addEventListener('input', () => { S.ui.search = input.value; });
        input.addEventListener('keydown', e => {
          if (e.key === 'Enter') { S.ui.preview = 'Search results'; S.P.draw(S.ctx.model); }
        });
      },
      toolbar: () => () => {},
      directory: (base, S) => (m) => {
        const el = S.ctx.util.el, users = S.spec.users;
        const panel = el('div', 'iam-directory', S.main);
        const pages = Math.ceil(users.length / m.pageSize);
        const rows = el('div', 'iam-accounts', panel);
        const header = el('div', 'iam-table-head', rows);
        for (const text of ['', 'Email address', 'Name', 'Role', 'Licence', 'Status', 'Last sign in']) el('span', '', header, text);
        for (const u of users.slice(m.page * m.pageSize, (m.page + 1) * m.pageSize)) S.P.directoryRow(rows, u, m);
        if (pages > 1) {
          const pager = el('div', 'iam-pagination', panel);
          const back = S.P.button(pager, '‹', null, null, 'iam-page-arrow', 'back');
          back.disabled = m.page === 0;
          back.addEventListener('click', () => S.P.act({ page: m.page - 1 }));
          for (let i = 0; i < pages; i++) S.P.button(pager, String(i + 1), { page: i }, { page: i }, m.page === i ? 'iam-page current' : 'iam-page');
          const next = S.P.button(pager, '›', null, null, 'iam-page-arrow', 'chevron');
          next.disabled = m.page + 1 >= pages;
          next.addEventListener('click', () => S.P.act({ page: m.page + 1 }));
        }
      },
      directoryRow: (base, S) => (parent, u, m) => {
        const el = S.ctx.util.el, access = m.access[u.id];
        const date = ['2024-05-14 09:21','2024-05-13 16:02','2024-05-12 11:45','2024-05-11 09:18','2024-05-10 14:33','2024-05-10 08:27','2024-05-09 17:10','2024-05-09 12:01','2024-05-08 15:44','2024-04-28 10:12','2024-05-07 09:36','2024-05-06 13:21'][(parent.children.length - 1) % 12];
        const row = el('div', `iam-account${m.selected === u.id ? ' is-selected' : ''}`, parent);
        const check = el('span', 'iam-check', row);
        S.P.button(check, '', { row: u.id }, { row: u.id }, 'iam-checkbox');
        S.P.button(row, u.email, { row: u.id }, { row: u.id }, 'iam-email');
        S.P.button(row, u.name, { row: u.id }, { row: u.id }, 'iam-name');
        el('span', 'iam-role', row, access.role);
        el('span', 'iam-licence', row, access.licence);
        const status = el('span', 'iam-status', row);
        el('i', '', status); el('span', '', status, 'Active');
        el('span', 'iam-date', row, date);
      },
      facts: () => () => {},
    },
  },
});
