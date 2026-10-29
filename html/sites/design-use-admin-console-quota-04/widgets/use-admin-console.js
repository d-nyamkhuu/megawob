// Design on use-admin-console/console; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'use-admin-console',
  site: 'design-use-admin-console-quota-04',
  name: 'design',
  split: 'train',
  scenarios: ['quota'],
  template: 'use-admin-console/console',
  design: {
      inset: 0, radius: 0, fontSize: 16,
      fontFamily: 'Arial, Helvetica, sans-serif',
      sidebarWidth: 0, narrowSidebarWidth: 0, contextAt: 0,
      contextWidth: 132,
    parts: {
      topbar: (base, S) => () => {
        const el = S.ctx.util.el;
        const summary = el('section', 'next-summary', S.shell);
        const crumb = el('div', 'next-path', summary);
        el('span', 'next-path-link', crumb, 'Subscriptions'); el('span', '', crumb, '›');
        el('span', 'next-path-link', crumb, 'Compute'); el('span', '', crumb, '›');
        el('strong', '', crumb, 'Quotas');
        if (!S.ui.taskNote) S.ui.taskNote = document.querySelector('.ref-instruction');
        if (S.ui.taskNote) summary.append(S.ui.taskNote);
        el('h1', '', summary, 'Compute');
        el('p', '', summary, 'Manage compute resources, regional quotas and related settings for your subscriptions.');
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
          const folders = main.querySelector('.aa-section');
          if (m.depth === 0 && folders) {
            folders.classList.add('next-choice-list');
            const extras = [
              ['Availability sets', 'Manage availability sets and placement rules.', '▦'],
              ['Dedicated hosts', 'Manage dedicated hosts for your subscriptions.', '▣']
            ];
            for (const [title, description, icon] of extras) {
              const row = el('button', 'aa-button aa-folder next-extra-folder', folders);
              row.type = 'button';
              el('span', 'next-static-icon', row, icon);
              const caption = el('span', '', row, title); el('small', '', caption, description);
              el('span', 'next-chevron', row, '›');
              row.addEventListener('click', () => env.log('decoy', { label: title }));
            }
            const pager = el('div', 'next-pages', main);
            for (const text of ['‹','1','2','3','›']) el('button', text === '1' ? 'active' : '', pager, text);
          }
          const actions = S.workspace.querySelector('.aa-actions');
          if (actions) {
            actions.classList.add('next-browser-navigation'); main.append(actions);
            const back = actions.querySelector('button');
            if (back) { back.title = 'Parent settings'; back.setAttribute('aria-label', 'Parent settings'); back.replaceChildren(); back.textContent = '‹'; }
            else { const b = el('button', 'aa-button', actions, '‹'); b.disabled = true; b.title = 'Back'; }
            const forward = el('button', 'aa-button', actions, '›'); forward.title = 'Forward';
            forward.disabled = true;
          }
        }
      },
      folder: (base, S) => (box, name, i, m) => {
        const captions = m.depth === 0 ? [name, 'VM sizes', 'Images', 'VM settings'] : [name, 'VM instances', 'Persistent disks', 'Networking'];
        base(box, captions[i], i, m);
        const row = box.lastElementChild;
        const descriptions = m.depth === 0 ? [
          'View and manage regional quotas for compute resources across your subscriptions.',
          'View available VM sizes and limits for your subscriptions.',
          'Manage custom images and platform images.',
          'Configure default settings for virtual machines.'
        ] : ['View and manage resource limits by region', 'Configure instance types and limits', 'Disk types and storage settings', 'IPs, load balancers and network quotas'];
        row.querySelector('small').textContent = descriptions[i];
        const paths = [
          'M3 22V10h4v12zm7 0V3h4v19zm7 0V13h4v9z',
          'M3 3h17v8H3zM3 13h19v8H3zM6 6h2m-2 10h2m9-10h1m-1 10h2',
          'M3 5c0-5 18-5 18 0v14c0 5-18 5-18 0zm0 0c0 5 18 5 18 0M3 12c0 5 18 5 18 0',
          'M12 2l2 2 3-1 1 3 3 2-1 3 1 3-3 2-1 3-3-1-2 2-2-2-3 1-1-3-3-2 1-3-1-3 3-2 1-3 3 1zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8'
        ];
        row.querySelector('svg path')?.setAttribute('d', paths[i]);
        if (m.depth === 0) row.classList.add('next-top-choice');
        if (m.depth === 0 && i === 0) row.classList.add('next-first-choice');
      },
      context: (base, S) => (parent, m) => {
        const el = S.ctx.util.el;
        const aside = el('aside', 'next-quota-summary', parent);
        const chart = el('div', 'next-inspector-icon', aside);
        chart.innerHTML = '<svg viewBox="0 0 48 50" aria-hidden="true"><path d="M3 49V20h9v29zm16 0V3h9v46zm16 0V25h9v24z" fill="#405d80"/></svg>';
        const field = (label, value) => { const item = el('div', 'next-inspector-field', aside); el('div', 'next-inspector-label', item, label); el('div', '', item, value); };
        field('Subscription', 'Acme Production');
        field('Service', 'Compute');
        field('Resource type', 'All compute resources');
        field('Scope', 'All regions');
        const status = el('div', 'next-inspector-status', aside);
        el('strong', '', status, 'Current quota status');
        for (const [label, value] of [['Total limit','1,240'], ['In use','892'], ['Headroom','348 (28%)']]) {
          const item = el('div', '', status); el('span', '', item, label); el('span', '', item, value);
        }
        const audit = el('div', 'next-inspector-audit', aside);
        el('div', '', audit, 'Last updated'); el('div', '', audit, 'Apr 12, 2018'); el('div', '', audit, '10:24 UTC');
        el('div', '', audit, 'Audit reference'); el('div', '', audit, 'AUD-78452');
      },
      decorated: (base, S) => (ctx, m) => {
        const facts = S.workspace.querySelector('.aa-facts');
        const summary = S.workspace.querySelector('.next-quota-summary');
        if (facts && summary) summary.append(facts);
        if (m.depth < S.spec.path.length) queueMicrotask(() => {
          S.main.getBoundingClientRect();
          S.main.scrollTop = 300;
        });
      },
    },
  },
});
