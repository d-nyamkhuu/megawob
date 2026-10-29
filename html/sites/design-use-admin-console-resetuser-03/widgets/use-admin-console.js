// Design on use-admin-console/console; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'use-admin-console',
  site: 'design-use-admin-console-resetuser-03',
  name: 'design',
  split: 'train',
  scenarios: ['resetuser'],
  template: 'use-admin-console/console',
  design: {
    inset: 0,
    contextAt: 10000,
    fontFamily: '"Times New Roman",Georgia,serif',
    fontSize: 16,
    parts: {
      icon: (base, S) => (parent, name, cls = '') => {
        const single = parent.classList.contains('desktop-user-icon') || parent.classList.contains('on');
        const map = { users: 'groups', document: 'licenses', compute: 'devices', quota: 'reports', email: 'email' };
        const source = map[name] && document.querySelector(`.desktop-glyph-${map[name]}`);
        if (name === 'users' && single) {
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('viewBox', '0 0 24 28'); svg.setAttribute('class', `aa-icon ${cls}`); svg.setAttribute('aria-hidden', 'true');
          svg.innerHTML = '<circle cx="12" cy="7" r="5"/><path d="M2 27v-6c0-11 20-11 20 0v6Z"/>';
          parent.append(svg); return svg;
        }
        if (!source) return base(parent, name, cls);
        const svg = source.cloneNode(true); svg.classList.add('aa-icon');
        if (cls) svg.classList.add(...cls.split(' ').filter(Boolean));
        parent.append(svg); return svg;
      },
      topbar: () => () => {},
      heading: () => () => {},
      tabs: () => () => {},
      toolbar: () => () => {},
      main: (base, S) => (parent) => {
        const panel = S.ctx.util.el('div', 'desktop-directory-panel', parent);
        return base(panel);
      },
      sidebar: (base, S) => (frame) => {
        const el = S.ctx.util.el;
        const rail = el('div', 'aa-desktop-rail', frame);
        for (const [label, icon] of [['User Management', 'users'], ['Groups', 'users'], ['Licenses', 'document'], ['Devices', 'compute'], ['Service Desk', 'shield'], ['Audit Log', 'document'], ['Reports', 'quota']]) {
          const b = S.P.preview(rail, label, icon, label, `desktop-nav-item${label === 'User Management' ? ' on' : ''}`);
          b.title = label;
        }
      },
      directory: (base, S) => (m) => {
        const el = S.ctx.util.el, P = S.P;
        const heading = el('div', 'desktop-list-heading', S.main);
        S.main.before(heading);
        el('h3', '', heading, 'User Accounts');
        const searchRow = el('div', 'desktop-search-row', heading);
        const search = el('label', 'desktop-search', searchRow);
        P.icon(search, 'search');
        const input = el('input', '', search);
        input.type = 'search'; input.placeholder = 'Search by name, email or team...';
        input.setAttribute('aria-label', input.placeholder); input.value = S.ui.directorySearch || '';
        input.addEventListener('input', () => {
          S.ui.directorySearch = input.value;
          const term = input.value.toLowerCase();
          for (const row of S.main.querySelectorAll('tbody tr')) row.hidden = !row.textContent.toLowerCase().includes(term);
          P.mirrorClipped();
        });
        P.preview(searchRow, 'All Teams', 'down', 'View filters', 'desktop-team-filter');
        const tableBox = el('div', 'desktop-account-table', S.main);
        const body = P.table(tableBox, [['', 'desktop-avatar-column'], ['Name ▴', 'desktop-name-column'], ['Email Address', 'desktop-email-column'], ['Team', 'desktop-team-column'], ['Status', 'desktop-status-column']], 'aa-directory');
        for (const user of S.spec.users.slice(m.page * m.pageSize, (m.page + 1) * m.pageSize)) P.directoryRow(body, user, m);
        P.pager(S.spec.users, m);
        const active = m.selected && S.spec.users.find(u => u.id === m.selected);
        P.resetControls(m, active);
      },
      directoryRow: (base, S) => (body, u, m) => {
        const el = S.ctx.util.el, P = S.P;
        const tr = el('tr', m.selected === u.id ? 'selected' : '', body);
        P.icon(el('td', 'desktop-user-icon', tr), 'users');
        P.button(el('td', '', tr), u.name, { row: u.id }, { row: u.id }, 'aa-link');
        el('td', 'desktop-email', tr, u.email);
        el('td', '', tr, u.team);
        el('td', '', tr, m.resets[u.id] ? 'Updated' : 'Active');
      },
      pager: (base, S) => (records, m) => {
        const el = S.ctx.util.el, P = S.P;
        const p = el('div', 'aa-pager desktop-pager', S.main.parentElement);
        const pages = Math.ceil(records.length / m.pageSize);
        P.button(p, '‹', null, { page: 0 }).setAttribute('aria-label', 'First page');
        P.button(p, '‹', null, { page: Math.max(0, m.page - 1) }).setAttribute('aria-label', 'Previous page');
        el('span', 'desktop-page-label', p, `Page ${m.page + 1} of ${pages}`);
        for (let i = 0; i < pages; i++) {
          const b = P.button(p, i === m.page ? '›' : String(i + 1), { page: i }, { page: i }, i === m.page ? 'current' : '');
          b.setAttribute('aria-label', `Page ${i + 1}`);
        }
        el('span', 'aa-grow', p);
        el('span', 'desktop-page-count', p, `${m.page * m.pageSize + 1} – ${Math.min(records.length, (m.page + 1) * m.pageSize)} of ${records.length} users`);
      },
      resetControls: (base, S) => (m, active) => {
        const el = S.ctx.util.el, P = S.P;
        const panel = el('section', 'desktop-action-panel', S.main.closest('.aa-content-row'));
        el('h3', '', panel, 'Account Actions');
        el('p', 'desktop-account-help', panel, active ? `${active.name} · ${active.email}` : 'Select an account from the list to manage access and security settings.');
        const legend = P.button(panel, 'Reset Options', { pick: 'action' }, { pick: 'action' }, 'desktop-section-title');
        legend.title = 'Choose reset action';
        for (const action of S.spec.options.action) {
          const row = el('label', 'desktop-radio-option', panel);
          const radio = el('input', '', row); radio.type = 'radio'; radio.name = 'reset-action'; radio.checked = m.action === action;
          radio.addEventListener('change', () => P.act({ set: ['action', action] }));
          const text = el('span', '', row, action);
          el('small', '', text, action === 'Reset MFA' ? "Remove the user's multi-factor authentication settings." : 'Generate a new password and require sign-in change.');
        }
        const email = el('div', 'desktop-email-options', panel);
        el('h4', 'desktop-section-title', email, 'Notify User by Email');
        const label = el('label', 'desktop-notify', email);
        const check = S.put({ field: 'notify' }, el('input', '', label)); check.type = 'checkbox'; check.checked = m.notify;
        check.addEventListener('change', () => P.act({ set: ['notify', check.checked] }));
        el('span', '', label, 'Send notification email to user');
        el('div', 'desktop-template-label', email, 'Email template');
        P.preview(email, m.action === 'Reset MFA' ? 'MFA reset notification' : 'Password reset notification', 'down', 'Email template', 'desktop-template');
        const actions = el('div', 'desktop-reset-actions', email);
        P.preview(actions, 'Send Email', 'email', 'Email notification', 'desktop-send-email');
        const reset = P.button(actions, 'Review reset', { nav: 'reset' }, { nav: 'reset' }, 'desktop-review-reset'); reset.disabled = !active;
      },
      facts: (base, S) => (m) => {
        const el = S.ctx.util.el;
        const recent = el('section', 'desktop-recent-actions', S.workspace);
        const head = el('div', 'desktop-recent-heading', recent);
        el('h3', '', head, 'Recent Account Actions');
        base(m);
        head.append(S.workspace.querySelector('.aa-facts'));
        const table = el('table', 'desktop-history-table', recent);
        const tr = el('tr', '', el('thead', '', table));
        for (const label of ['Date & Time', 'User', 'Action', 'Performed By', 'Status', 'Reference']) el('th', '', tr, label);
        const body = el('tbody', '', table);
        const entries = [
          ['2024-05-10 14:32', 'marcus.ng@northstar.example', 'Reset MFA', 'jordan.lee', 'Success', 'AUD-88491'],
          ['2024-05-10 11:27', 'priya.sharma@northstar.example', 'Reset password', 'taylor.brown', 'Success', 'AUD-88472'],
          ['2024-05-09 16:18', 'kevin.chen@northstar.example', 'Reset MFA', 'alex.morgan', 'Success', 'AUD-88311'],
          ['2024-05-09 09:41', 'nina.kovalenko@northstar.example', 'Reset password', 'jordan.lee', 'Success', 'AUD-88277'],
          ['2024-05-08 13:05', 'samuel.green@northstar.example', 'Reset MFA', 'casey.nguyen', 'Success', 'AUD-88154'],
        ];
        for (const entry of entries) { const row = el('tr', '', body); entry.forEach((value, i) => el('td', i === 4 ? 'desktop-success' : '', row, value)); }
      },
    },
  },
});
