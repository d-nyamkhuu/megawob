/* use-admin-console/_workflows: The five workflow views, using the console parts.
 * Installs the console's existing parts; W is its private live state.
 */
(function () {
  'use strict';
  env.template('use-admin-console/_workflows', () => ({
    install(BASE, W) {
      BASE.vm = (m) => {
        if (m.step < 7) {
          const steps = W.el('div', 'aa-steps', W.main);
          [...W.s.fields.map(x => x.id === 'region' ? 'Basics' : x.id[0].toUpperCase() + x.id.slice(1)), 'Review'].forEach((label, i) => {
            const item = W.el('span', `aa-step${m.step === i ? ' current' : ''}`, steps);
            const n = W.el('b', '', item); if (i < m.step) W.P.icon(n, 'check'); else n.textContent = String(i + 1); W.el('span', '', item, label);
          });
        }
        if (m.step < 6) {
          const field = W.s.fields[m.step]; const card = W.P.section(W.main, field.label, { region: 'compute', image: 'document', size: 'compute', disk: 'disk', network: 'network', tag: 'folder' }[field.id]);
          W.el('p', '', card, field.hint); W.el('label', 'aa-label', card, `${field.label} *`); W.P.picker(card, field.id, m.values[field.id]);
          const meta = {
            region: [['Subscription', 'Production / NS-PROD-01'], ['Resource group', 'shared-infrastructure'], ['Availability zone', 'Zone 1 (automatic)'], ['Resource naming', 'Generated on deployment']],
            image: [['Publisher', 'Northstar verified images'], ['Architecture', 'x86_64'], ['Generation', 'Gen 2 / Secure Boot'], ['Update policy', 'Automatic security patches']],
            size: [['Workload profile', 'General purpose'], ['CPU family', 'Shared compute / C2'], ['Billing model', 'On demand'], ['Reservation', 'No commitment']],
            disk: [['Storage class', 'Balanced SSD'], ['Encryption policy', 'Platform-managed keys'], ['Backup schedule', 'Daily at 02:00 UTC'], ['Delete with VM', 'Enabled']],
            network: [['Subnet', 'default / 10.42.0.0/24'], ['Public IPv4', 'Disabled'], ['Firewall policy', 'Production baseline'], ['Private DNS', 'Registration enabled']],
            tag: [['Tag policy', 'Environment tag required'], ['Owner', 'Infrastructure team'], ['Cost centre', 'IT-204'], ['Inherited tags', 'organization=northstar']],
          };
          W.P.readonly(W.P.section(W.main, 'Configuration defaults', 'settings'), meta[field.id]);
          W.P.banner(W.main, 'Managed by organization policy', m.step === 4 ? 'Public endpoints are blocked on this subscription. Private access is provided by the shared gateway.' : 'Encryption, monitoring and standard audit logging are applied automatically.');
        } else {
          if (m.created) W.P.banner(W.main, 'Deployment complete', 'The instance is running. Guest health and platform checks are available in Monitoring.');
          const summary = W.P.section(W.main, m.created ? 'Essentials' : 'Review deployment', 'compute');
          const dl = W.el('dl', 'aa-review', summary);
          for (const field of W.s.fields) { W.el('dt', '', dl, field.label); W.el('dd', '', dl, (m.created ? m.saved : m.values)[field.id]); }
          if (m.created) { W.el('dt', '', dl, 'Resource ID'); W.el('dd', 'aa-mono', dl, W.s.resourceId); }
          if (!m.created) W.P.banner(W.main, 'Deployment policy', 'This instance will be billed to Production. Network egress and snapshots are charged separately.');
          else W.P.readonly(W.P.section(W.main, 'Platform health', 'shield'), [['Provisioning', 'Succeeded'], ['Guest agent', 'Ready'], ['Boot diagnostics', 'Enabled'], ['Security policy', 'Baseline applied']]);
        }
        if (!W.withContext) {
          const box = W.P.section(W.main, 'Cost estimate / monthly', 'document'); const price = W.el('div', 'aa-price', box, W.f.helpers.cost(m, W.s)); W.el('small', '', price, ' USD');
          W.el('div', 'aa-sub', box, '730 compute hours + encrypted SSD. Taxes, snapshots and network traffic are excluded.');
        }
        W.P.related(W.main, 'vm');
        const bar = W.P.actions(); if (m.step > 0 && m.step < 7) W.P.button(bar, 'Back', { nav: 'back' }, { nav: 'back' }, '', 'back');
        W.el('span', 'aa-grow aa-muted', bar, m.created ? 'Provisioning: Succeeded' : 'Draft configuration');
        const name = m.created ? 'edit' : m.step === 6 ? 'create' : 'next';
        W.P.button(bar, m.created ? 'Edit configuration' : m.step === 6 ? 'Create virtual machine' : 'Next', { nav: name }, { nav: name }, 'primary', m.created ? 'settings' : m.step === 6 ? 'plus' : 'chevron');
      };

      BASE.directory = (m) => {
        const meta = W.el('div', 'aa-list-meta', W.main); W.P.icon(meta, 'filter'); W.el('span', '', meta, 'Directory: northstar.example');
        W.el('span', 'aa-chip', meta, 'Account type: Member'); W.el('span', 'aa-grow', meta); W.el('span', '', meta, 'Sort: Object ID');
        const labels = [['', 'aa-checkcell'], ['User / principal name', 'aa-usercol']];
        if (!W.compact) labels.push(['Department', '']); labels.push(['Role / licence', 'aa-accesscol'], ['Status', 'aa-statuscol']);
        const body = W.P.table(W.main, labels, 'aa-directory');
        for (const u of W.s.users.slice(m.page * m.pageSize, (m.page + 1) * m.pageSize)) {
          W.P.directoryRow(body, u, m);
        }
        // Related audit entries are not additional accounts to change.
        const log = W.el('div', '', W.main); log.style.padding = '10px';
        const active = m.selected && W.s.users.find(u => u.id === m.selected);
        W.P.history(log, active ? [[`Account ${active.id}`, `${active.team} / Member / synced from Northstar Directory`],
          ['Access review', 'Standard membership policy / reviewed 3 days ago']]
          : [['Directory sync completed', 'Source: Northstar Directory / no sync errors'], ['Access review scheduled', 'Operations pilot / quarterly review / policy AP-17']]);
        W.P.pager(W.s.users, m);
        if (W.s.scenario === 'resetuser') W.P.resetControls(m, active);
      };

      BASE.tickets = (m) => {
        const meta = W.el('div', 'aa-list-meta', W.main); W.P.icon(meta, 'filter'); W.el('span', 'aa-chip', meta, 'State: Open'); W.el('span', 'aa-chip', meta, 'Project: IT operations');
        W.el('span', 'aa-grow', meta); W.el('span', '', meta, 'Sort: Ticket ID');
        const labels = [['', 'aa-checkcell'], ['Number / short description', 'aa-titlecol'], ['Category / priority', ''], ['Assignment group', 'aa-queuecol']];
        if (!W.compact) labels.splice(3, 0, ['SLA / state', '']);
        const body = W.P.table(W.main, labels, 'aa-ticket-table');
        for (const t of W.s.tickets.slice(m.page * m.pageSize, (m.page + 1) * m.pageSize)) {
          W.P.ticketRow(body, t, m);
        }
        const log = W.el('div', '', W.main); log.style.padding = '10px';
        W.P.history(log, [['Queue synchronization complete', 'All open IT operations tickets are included in this workset.'], ['Routing policy', 'Manual assignment / category-based routing / audit enabled']]);
        W.P.pager(W.s.tickets, m);
        if (W.s.judge?.mode === 'confirm') W.P.button(W.P.actions(), 'Apply routing proposals', { nav: 'applyRoutes' }, { nav: 'applyRoutes' }, 'primary');
      };

      BASE.quota = (m) => {
        const crumbs = W.el('div', 'aa-breadcrumbs', W.main);
        ['Console', ...W.s.path.slice(0, m.depth)].forEach((label, i) => { if (i) W.P.icon(crumbs, 'chevron'); W.el('span', '', crumbs, label); });
        crumbs.style.marginBottom = '10px';
        if (m.depth < W.s.path.length) {
          const title = m.depth ? W.s.path[m.depth - 1] : 'Organization settings';
          W.el('h3', '', W.main, title); W.el('p', 'aa-sub', W.main, 'Production subscription / Configuration and service limits');
          const folders = [W.s.path[m.depth], ...['Activity log', 'Billing profiles', 'Policy assignments'].filter(x => x !== W.s.path[m.depth])];
          const box = W.el('div', 'aa-section', W.main);
          folders.forEach((name, i) => W.P.folder(box, name, i, m));
          W.P.readonly(W.P.section(W.main, 'Subscription details', 'document'), [['Subscription ID', 'NS-PROD-01'], ['Billing status', 'Active / Pay as you go'], ['Directory', 'northstar.example'], ['Policy assignments', '6 inherited / 2 local']]);
        } else {
          W.el('h3', '', W.main, `${W.s.quotaName} / ${W.s.quotaRegion}`);
          W.el('div', 'aa-sub', W.main, 'Provider: Northstar.Compute / Scope: Production / Regional quota');
          const stats = W.el('div', 'aa-quota-stats', W.main);
          for (const [label, value] of [['Current usage', W.s.usage], ['Saved limit', m.savedLimit], ['Available headroom', Number(m.savedLimit) - W.s.usage]]) {
            const stat = W.el('div', '', stats); W.el('span', '', stat, label); W.el('b', '', stat, String(value));
          }
          const card = W.P.section(W.main, 'Quota configuration', 'quota');
          const label = W.el('label', 'aa-label', card, 'New limit'); const input = W.put({ field: 'limit' }, W.el('input', 'aa-input', card)); input.id = 'aa-quota-limit'; label.htmlFor = input.id;
          input.type = 'text'; input.inputMode = 'numeric'; input.value = m.limit; input.setAttribute('aria-describedby', 'aa-limit-hint');
          input.addEventListener('input', () => W.P.act({ set: ['limit', input.value] }, false));
          W.el('div', 'aa-sub', card, `Whole numbers only. Current usage of ${W.s.usage} must remain available.`).id = 'aa-limit-hint';
          W.P.banner(W.main, 'Changes take effect immediately', 'Quota increases do not reserve capacity or create resources. Existing usage is not changed.');
          W.P.miniTable(W.P.section(W.main, 'Other regional limits', 'quota'), ['Quota', 'Region', 'Usage', 'Limit'],
            [['Snapshot count', 'East Harbor', '24', '200'], ['Private endpoints', 'West Ridge', '12', '100'], ['Load balancers', 'North Vale', '4', '40']]);
        }
        const bar = W.P.actions(); if (m.depth) W.P.button(bar, 'Parent settings', { nav: 'up' }, { nav: 'up' }, '', 'back'); W.el('span', 'aa-grow', bar);
        if (m.depth === W.s.path.length) W.P.button(bar, 'Save limit', { nav: 'saveQuota' }, { nav: 'saveQuota' }, 'primary');
      };
    },
  }));
})();
