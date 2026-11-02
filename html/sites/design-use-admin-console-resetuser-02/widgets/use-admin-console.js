// Design on use-admin-console/console; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'use-admin-console',
  site: 'design-use-admin-console-resetuser-02',
  name: 'design',
  split: 'train',
  scenarios: ['resetuser'],
  template: 'use-admin-console/console',
  design: {
    inset: 0, sidebarWidth: 0, narrowSidebarWidth: 0, contextAt: 9999, compactAt: 0,
    fontSize: 16, fontFamily: 'Arial, sans-serif', radius: 0,
    parts: {
      topbar: () => () => {},
      tabs: () => () => {},
      toolbar: () => () => {},
      frame: (base, S) => () => {
        const frame = S.ctx.util.el('div', 'aa-frame', S.shell);
        S.workspace = S.ctx.util.el('div', 'aa-workspace', frame);
        return frame;
      },
      heading: (base, S) => m => S.P.resetControls(m, S.spec.users.find(u => u.id === m.selected)),
      resetControls: (base, S) => (m, active) => {
        const el = S.ctx.util.el;
        const box = el('section', 'ns-resets', S.workspace);
        el('h2', 'ns-section-title', box, 'Account Resets');
        const controls = el('div', 'ns-reset-options', box);
        const type = el('div', 'ns-reset-type', controls);
        el('b', '', type, 'Reset type:');
        const choices = el('div', 'ns-reset-choices', type);
        const trigger = el('div', 'ns-action-trigger', choices);
        const actionToChoose = S.spec.options.action.find(value => value !== m.action);
        for (const value of S.spec.options.action) {
          const label = el('label', 'ns-radio-label', trigger);
          const radio = S.put({set:['action', value]}, el('input', '', label));
          if (value === actionToChoose) S.put({pick:'action'}, radio);
          radio.type = 'radio'; radio.name = 'reset-action'; radio.checked = m.action === value;
          radio.value = value;
          radio.addEventListener('click', e => { e.stopPropagation(); S.P.act({set:['action', value]}); });
          el('span', '', label, value);
        }
        const notification = el('div', 'ns-notification', controls);
        el('b', '', notification, 'Email notification:');
        const body = el('div', '', notification), label = el('label', '', body);
        const check = S.put({field:'notify'}, el('input', '', label)); check.type = 'checkbox'; check.checked = m.notify;
        check.addEventListener('change', () => S.P.act({set:['notify',check.checked]}));
        el('span', '', label, 'Notify user by email');
        el('p', '', body, 'An email will be sent to the user with next steps.');
        if (active) {
          const tools = el('div', 'ns-review', box);
          S.P.button(tools, 'Review reset', {nav:'reset'}, {nav:'reset'}, 'primary');
        }
      },
      content: (base, S) => () => {
        const row = S.ctx.util.el('section', 'aa-content-row ns-accounts', S.workspace);
        const head = S.ctx.util.el('div', 'ns-section-title ns-account-heading', row);
        S.ctx.util.el('span', '', head, 'User Accounts');
        const search = S.ctx.util.el('div', 'ns-account-search', head);
        S.ctx.util.el('span', '', search, 'Search accounts...');
        S.ctx.util.el('span', 'ns-search-glyph', search).innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></svg>';
        return row;
      },
      directory: (base, S) => m => {
        const labels = [['','ns-checkcol'],['Display name','ns-namecol'],['Email address','ns-emailcol'],['Team','ns-teamcol'],['Status','ns-statuscol'],['MFA status','ns-mfacol'],['Last sign-in','ns-signincol']];
        const body = S.P.table(S.main, labels, 'aa-directory ns-directory');
        S.ctx.util.el('i', 'ns-all-check', S.main.querySelector('th'));
        S.ctx.util.el('span', 'ns-sort-arrow', S.main.querySelector('th:last-child'), '▲');
        for (const u of S.spec.users.slice(m.page*m.pageSize,(m.page+1)*m.pageSize)) S.P.directoryRow(body,u,m);
        S.P.pager(S.spec.users,m);
      },
      directoryRow: (base, S) => (body,u,m) => {
        const el = S.ctx.util.el, row = el('tr', m.selected === u.id ? 'selected' : '', body);
        const index = S.spec.users.indexOf(u);
        const check = el('td','ns-checkcell',row), button = S.P.button(check, m.selected === u.id ? '✓' : '',null,{row:u.id},'ns-row-check');
        button.setAttribute('aria-label', 'Select ' + u.name);
        S.P.button(el('td','',row),u.name,{row:u.id},{row:u.id},'aa-link');
        el('td','ns-email',row,u.email); el('td','',row,u.team);
        el('td','',row,m.resets[u.id] ? 'Updated' : 'Active');
        el('td','',row,index % 5 === 4 ? 'Disabled' : 'Enabled');
        el('td','ns-signin',row,['Apr 21, 2025 10:14 AM','Apr 21, 2025 8:27 AM','Apr 20, 2025 4:11 PM','Apr 19, 2025 9:03 AM','Apr 18, 2025 6:42 PM','Apr 18, 2025 1:17 PM','Apr 17, 2025 11:09 AM','Apr 16, 2025 3:56 PM','Apr 15, 2025 2:24 PM','Apr 15, 2025 9:08 AM'][index % 10]);
      },
      pager: (base, S) => (records,m) => {
        const el = S.ctx.util.el, bar = el('div','aa-pager ns-pagination',S.workspace);
        const pages = Math.ceil(records.length/m.pageSize), buttons = el('div','ns-page-buttons',bar);
        const prev = S.P.button(buttons,'‹ Previous',null,{page:Math.max(0,m.page-1)}); prev.disabled = m.page === 0;
        for(let i=0;i<pages;i++) S.P.button(buttons,String(i+1),{page:i},{page:i},m.page===i?'current':'');
        const next = S.P.button(buttons,'Next ›',null,{page:Math.min(pages-1,m.page+1)}); next.disabled = m.page===pages-1;
        el('span','ns-page-count',bar,`Showing ${m.page*m.pageSize+1} – ${Math.min(records.length,(m.page+1)*m.pageSize)} of ${records.length} accounts`);
      },
      facts: (base, S) => m => {
        const el = S.ctx.util.el, box = el('section','ns-reset-activity',S.workspace);
        el('h2','ns-section-title',box,'Reset Activity');
        S.P.miniTable(box,['Date & time','Admin','User','Action','Notification','Status','Audit reference'],[
          ['Apr 14, 2025 2:18 PM','jessica-park','oliver-nguyen@northstar.example','Reset MFA','Yes','Success','AUD-88421'],
          ['Apr 12, 2025 11:03 AM','michael-chen','linda-patel@northstar.example','Reset password','Yes','Success','AUD-88317'],
          ['Apr 10, 2025 4:26 PM','michael-chen','carlos-ruiz@northstar.example','Reset MFA','No','Success','AUD-88203']
        ]);
        base(m); box.append(S.workspace.querySelector('.aa-facts'));
      },
      decorated: (base,S) => (ctx,m) => {
        const user = S.spec.users.find(u => u.id===m.selected), inspector = document.querySelector('.ns-inspector');
        inspector.querySelector('.ns-profile-name').textContent = user ? user.name : 'No user selected';
        inspector.querySelector('.ns-profile-description').textContent = user ? user.email : 'Select a user from the list to view details.';
        const values = user ? {...user,username:user.email.split('@')[0],status:m.resets[user.id]?'Updated':'Active',mfa:S.spec.users.indexOf(user)%5===4?'Disabled':'Enabled'} : {};
        for(const node of inspector.querySelectorAll('[data-property]')) node.textContent = values[node.dataset.property] || '—';
      },
    },
  },
});
