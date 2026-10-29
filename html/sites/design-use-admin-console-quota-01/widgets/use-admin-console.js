// Design on use-admin-console/console; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'use-admin-console',
  site: 'design-use-admin-console-quota-01',
  name: 'design',
  split: 'train',
  scenarios: ['quota'],
  template: 'use-admin-console/console',
  design: {
      inset: 0, radius: 0, fontSize: 16,
      fontFamily: 'Arial, Helvetica, sans-serif',
      sidebarWidth: 365, narrowSidebarWidth: 365, contextAt: 0,
      contextWidth: 700,
    parts: {
      topbar: (base, S) => () => {
        const el = S.ctx.util.el;
        const summary = el('section', 'next-summary', S.shell);
        const title = el('div', 'next-compute-title', summary);
        const icon = el('div', 'next-compute-icon', title);
        icon.innerHTML = '<svg viewBox="0 0 60 76" aria-hidden="true"><path d="M3 18 30 3l27 15v42L30 74 3 59z" fill="#aaa" stroke="#111" stroke-width="2.5"/><path d="m3 18 27 16 27-16L30 3z" fill="#eee" stroke="#111" stroke-width="2.5"/><path d="M30 34v40M3 39l27 16 27-15" fill="none" stroke="#111" stroke-width="2.5"/><path d="m36 37 15-8v9l-15 8zm0 21 15-8v9l-15 8z" fill="#333" stroke="#111" stroke-width="2"/><path d="m10 47 4 2m-4 13 4 2" stroke="#333" stroke-width="2"/></svg>';
        const text = el('div', 'next-compute-text', title);
        el('h1', '', text, 'Compute');
        el('div', '', text, 'Virtual machines, disks and regional resources');
        if (!S.ui.taskNote) S.ui.taskNote = document.querySelector('.ref-instruction, .ref-panel');
        if (S.ui.taskNote) summary.append(S.ui.taskNote);
        const metadata = el('div', 'next-metadata', summary);
        for (const [label, value] of [['Subscription', 'Acme Corporation'], ['Subscription ID', 'ACME-001234'], ['Status', 'Active'], ['Regions', '4']]) {
          const item = el('div', '', metadata); el('div', 'next-meta-label', item, label); el('div', '', item, value);
        }
        for (const [label, value, percentage] of [['Total vCPUs', '320 / 800', 40], ['Total Persistent Disks', '620 / 1,200', 52]]) {
          const item = el('div', 'next-total', metadata); el('div', 'next-meta-label', item, label);
          const line = el('div', 'next-total-line', item); el('span', '', line, value);
          const meter = el('div', 'next-total-meter', line); el('i', '', meter).style.width = percentage + '%';
          el('span', '', line, percentage + ' %');
        }
      },
      sidebar: (base, S) => frame => {
        const el = S.ctx.util.el;
        const list = el('aside', 'next-subscriptions', frame);
        el('h2', '', list, 'Subscriptions');
        const body = el('div', 'next-subscription-body', list);
        const table = el('table', '', body); const head = el('tr', '', el('thead', '', table));
        el('th', '', head, 'Name'); el('th', '', head, 'Status');
        const rows = el('tbody', '', table);
        for (const [i, name] of ['Acme Corporation', 'Global Research', 'Internal Tools', 'Marketing', 'Product Development', 'Western Division'].entries()) {
          const row = el('tr', i === 0 ? 'selected' : '', rows);
          const cell = el('td', '', row); S.P.icon(cell, 'document'); el('span', '', cell, name);
          el('td', '', row, i === 5 ? 'Suspended' : 'Active');
        }
        const scroll = el('div', 'next-list-scrollbar', body);
        el('span', '', scroll, '▲'); el('i', '', scroll); el('span', '', scroll, '▼');
      },
      heading: () => () => {},
      tabs: () => () => {},
      toolbar: () => () => {},
      quota: (base, S) => m => {
        base(m);
        if (m.depth < S.spec.path.length) {
          const main = S.main, el = S.ctx.util.el;
          main.classList.add('next-folder-browser');
          if (m.depth === 0) main.querySelector('.aa-breadcrumbs').textContent = 'Subscriptions  ›  Compute';
          const folders = main.querySelector('.aa-section');
          S.P.preview(folders, 'Compute settings', 'settings', 'Compute settings', 'aa-folder next-extra-folder');
          const extra = folders.lastElementChild;
          const caption = extra.querySelector('span');
          if (caption) el('small', '', caption, 'Service limits and defaults');
          const actions = S.workspace.querySelector('.aa-actions');
          if (actions) {
            actions.classList.add('next-browser-navigation'); main.append(actions);
            const back = actions.querySelector('button');
            if (back) { back.title = 'Parent settings'; back.setAttribute('aria-label', 'Parent settings'); back.replaceChildren(); back.textContent = '◀'; }
            else { const b = el('button', 'aa-button', actions, '◀'); b.disabled = true; b.title = 'Back'; }
            const forward = el('button', 'aa-button', actions, '▶'); forward.title = 'Forward';
            forward.disabled = true;
          }
        }
      },
      folder: (base, S) => (box, name, i, m) => {
        const captions = [name, 'VM instances', 'Persistent disks', 'Networking'];
        base(box, captions[i], i, m);
        const row = box.lastElementChild;
        const descriptions = ['View and manage resource limits by region', 'Configure instance types and limits', 'Disk types and storage settings', 'IPs, load balancers and network quotas'];
        row.querySelector('small').textContent = descriptions[i];
        const paths = [
          'M5 21a10 10 0 1 1 14 0M12 4v2M5 8l2 1m12-1-2 1M3 15h2m14 0h2M12 9v6l4 4',
          'M3 3h17v8H3zM3 13h19v8H3zM6 6h2m-2 10h2m9-10h1m-1 10h2',
          'M3 5c0-5 18-5 18 0v14c0 5-18 5-18 0zm0 0c0 5 18 5 18 0M3 12c0 5 18 5 18 0',
          'M11 8 6 17m7-9 5 9M8 20h8M15 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 20a3 3 0 1 1-6 0 3 3 0 0 1 6 0M22 20a3 3 0 1 1-6 0 3 3 0 0 1 6 0'
        ];
        row.querySelector('svg path')?.setAttribute('d', paths[i]);
      },
      context: (base, S) => (parent, m) => {
        const el = S.ctx.util.el, spec = S.spec;
        const aside = el('aside', 'next-quota-summary', parent);
        const section = (title, labels, rows) => {
          const panel = el('section', 'next-summary-table', aside); el('h3', '', panel, title);
          return S.P.miniTable(panel, labels, rows);
        };
        const regional = [
          ['East Harbor', 120, 200, 180, 250], ['North Ridge', 80, 200, 160, 300],
          ['South Vale', 60, 200, 120, 300], ['West Plains', 40, 200, 160, 350]
        ];
        let match = regional.find(row => row[0] === spec.quotaRegion);
        if (!match) { match = regional[0]; match[0] = spec.quotaRegion; }
        const disks = /disk/i.test(spec.quotaName), used = disks ? 3 : 1;
        match[used] = spec.usage; match[used + 1] = Number(m.savedLimit);
        const table = section('Regional quota summary', ['Region', 'Used / Limit', 'Headroom', 'Used / Limit', 'Headroom'], regional.map(r => [r[0], `${r[1]} / ${r[2]}`, r[2] - r[1], `${r[3]} / ${r[4]}`, r[4] - r[3]]));
        const group = el('tr', '', table.tHead); table.tHead.prepend(group);
        const region = el('th', '', group, 'Region'); region.rowSpan = 2;
        table.tHead.lastElementChild.firstElementChild.remove();
        for (const title of ['vCPUs', 'Persistent disks']) { const cell = el('th', '', group, title); cell.colSpan = 2; }
        section('Recent changes', ['Date', 'Region', 'Resource', 'Previous limit', 'New limit', 'Changed by'], [
          ['2024-04-10', 'West Plains', 'Persistent disks', '300', '350', 'jcarter'],
          ['2024-04-08', 'North Ridge', 'vCPUs', '150', '200', 'mchen'],
          ['2024-04-05', 'East Harbor', 'vCPUs', '100', '200', 'afernandez'],
          ['2024-04-02', 'South Vale', 'Persistent disks', '250', '300', 'jcarter']
        ]);
      },
      decorated: (base, S) => (ctx, m) => {
        const facts = S.workspace.querySelector('.aa-facts');
        const summary = S.workspace.querySelector('.next-quota-summary');
        if (facts && summary) summary.append(facts);
      },
    },
  },
});
