// Design on use-admin-console/console; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'use-admin-console',
  site: 'design-use-admin-console-quota-02',
  name: 'design',
  split: 'train',
  scenarios: ['quota'],
  template: 'use-admin-console/console',
  design: {
    inset: 0, fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 17, radius: 0,
    parts: {
      topbar: (base, S) => () => {
        const el = S.ctx.util.el;
        const bar = el('div', 'quota-title', S.shell);
        el('strong', '', bar, 'Manage Quotas');
        const note = document.querySelector('.ref-task .ref-instruction');
        if (note) el('span', 'quota-title-note', bar, note.textContent);
        const controls = el('span', 'quota-window-controls', bar);
        for (const name of ['minimize', 'maximize', 'close']) el('i', `window-mark ${name}`, controls);
      },
      sidebar: () => () => {},
      heading: () => () => {},
      tabs: () => () => {},
      toolbar: () => () => {},
      context: () => () => {},
      icon: (base, S) => (parent, name, cls = '') => {
        const drawings = {
          compute: '<path fill="#59788f" d="M4 3h29v34H4z"/><path fill="#9bdcff" d="M5 4h27v9H5zm0 12h27v8H5zm0 11h27v9H5z"/><path fill="#3288bc" d="M6 5h4v7H6zm0 12h4v6H6zm0 11h4v7H6z"/><path d="M13 9h5m-5 11h5m-5 12h5m9-23h1m-1 11h1m-1 12h1"/>',
          network: '<path d="M18 9 8 28m10-19 11 19M8 28h21"/><g fill="#31b9f2"><circle cx="18" cy="8" r="5"/><circle cx="7" cy="29" r="5"/><circle cx="30" cy="29" r="5"/></g>',
          storage: '<path fill="#2baff1" d="M4 9v22c0 8 29 8 29 0V9z"/><ellipse fill="#78d4ff" cx="18.5" cy="9" rx="14.5" ry="6"/><path d="M4 20c0 8 29 8 29 0"/>',
          database: '<path fill="#2774ac" d="M6 9v22c0 7 25 7 25 0V9z"/><ellipse fill="#6daee0" cx="18.5" cy="9" rx="12.5" ry="6"/><path d="M6 20c0 7 25 7 25 0"/>',
          chip: '<path d="M8 2v7m7-7v7m7-7v7m7-7v7M8 30v7m7-7v7m7-7v7m7-7v7M1 9h7m-7 7h7m-7 7h7m-7 7h7m22-21h7m-7 7h7m-7 7h7m-7 7h7"/><path fill="#72b8e7" d="M7 7h24v24H7z"/><path fill="#14649b" d="M12 12h14v14H12z"/>',
          folder: '<path fill="#ffd44c" d="M3 10V5h12l4 5m-16 0h31v24H3z"/><path fill="#ffe789" d="M4 11h29v7H4z"/><path fill="#345c98" stroke="none" d="M14 22h11v4h-4v7h-4v-7h-3z"/>',
        };
        if (!drawings[name]) return base(parent, name, cls);
        const node = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        node.setAttribute('viewBox', '0 0 38 40'); node.setAttribute('class', `aa-icon quota-resource-icon ${cls}`);
        node.setAttribute('aria-hidden', 'true');
        node.innerHTML = `<g stroke="#07112e" stroke-width="1.8" stroke-linejoin="round" fill="none">${drawings[name]}</g>`;
        parent.append(node); return node;
      },
      quota: (base, S) => (m) => {
        base(m);
        const { P, spec: s, ctx, main } = S, el = ctx.util.el;
        const actions = S.workspace.querySelector('.aa-actions');
        actions.classList.add('quota-navigation');
        const back = P.button(actions, '←', null, m.depth ? { nav: 'up' } : null, 'quota-arrow');
        back.title = 'Back'; actions.prepend(back);
        const forward = P.button(actions, '➜', null, null, 'quota-arrow'); forward.disabled = true; back.after(forward);
        const up = actions.querySelector('button:not(.quota-arrow)');
        if (up && m.depth) { up.classList.add('quota-arrow'); up.title = 'Parent settings'; up.setAttribute('aria-label', 'Parent settings'); up.replaceChildren(document.createTextNode('↑')); forward.after(up); }
        else { const disabled = P.button(actions, '↑', null, null, 'quota-arrow'); disabled.disabled = true; forward.after(disabled); }
        [...actions.querySelectorAll('.quota-arrow')].forEach((button, i) => {
          button.setAttribute('aria-label', ['Back', 'Forward', 'Parent settings'][i]);
          button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" style="transform:rotate(${[0, 180, 90][i]}deg)"><path d="M13 3 4 12l9 9 3-3-4-4h9v-4h-9l4-4z" fill="currentColor"/></svg>`;
        });
        if (m.depth > 1) { main.classList.add('quota-editor'); return; }
        const folders = [...main.querySelectorAll('.aa-folder')];
        const first = folders.shift();
        main.replaceChildren(); main.classList.add('quota-browser');
        const crumbs = el('div', 'quota-path', main, `Quotas  ›  ${s.path.slice(0, Math.max(1, m.depth)).join('  ›  ')}`);
        const browser = el('div', 'quota-browser-body', main);
        const tree = el('div', 'quota-tree', browser);
        const subscription = m.depth === 0 ? first : P.button(tree, s.path[0], null, { nav: 'up' }, '', 'folder');
        tree.append(subscription); subscription.className = 'quota-tree-item selected';
        if (m.depth === 0) {
          subscription.replaceChildren(); P.icon(subscription, 'folder'); el('span', '', subscription, s.path[0]);
        }
        const categories = [['Compute', 'compute', 'Virtual machines, public addresses, disks and other compute resources.'], ['Networking', 'network', 'Virtual networks, load balancers and network-related quotas.'], ['Storage', 'storage', 'Block and object storage quotas.'], ['Database', 'database', 'Managed database instances and related resources.'], ['AI Services', 'chip', 'Compute and model deployment quotas.']];
        const pane = el('div', 'quota-category-pane', browser);
        const intro = el('div', 'quota-intro', pane); P.icon(intro, 'compute');
        const introText = el('div', '', intro); el('h2', '', introText, 'Subscription'); el('p', '', introText, 'Manage quotas for compute and other services.');
        const rows = el('div', 'quota-category-rows', pane);
        categories.forEach(([name, glyph, description], i) => {
          const action = i === 0 ? { depth: m.depth + 1 } : null;
          const side = P.button(tree, name, null, action, 'quota-tree-item', glyph);
          const row = m.depth === 1 && i === 0 ? first : P.button(rows, '', null, action, '');
          rows.append(row); row.className = 'quota-category'; row.replaceChildren(); P.icon(row, glyph);
          const text = el('span', '', row); el('strong', '', text, name); el('small', '', text, description); P.icon(row, 'chevron');
          if (i > 0) {
            const preview = () => { S.ui.preview = name; P.draw(ctx.model); };
            side.addEventListener('click', preview); row.addEventListener('click', preview);
          }
        });
        const extras = el('div', 'quota-utilities', actions);
        folders.forEach(button => {
          const name = button.querySelector('span')?.firstChild?.textContent || button.textContent;
          button.replaceChildren(document.createTextNode(name)); button.className = 'quota-utility'; extras.append(button);
        });
      },
      facts: (base, S) => (m) => {
        base(m);
        const runtimeFacts = S.workspace.querySelector('.aa-facts');
        if (runtimeFacts) {
          const navigation = S.workspace.querySelector('.quota-navigation') || S.workspace;
          const extras = navigation.querySelector('.quota-utilities');
          const details = S.ctx.util.el('details', 'quota-live-facts', navigation);
          const summary = S.ctx.util.el('summary', '', details, '⋯');
          summary.title = 'Administration tools and resource status'; summary.setAttribute('aria-label', summary.title);
          const popup = S.ctx.util.el('div', 'quota-tools-popup', details);
          if (extras) popup.append(extras);
          popup.append(runtimeFacts);
        }
        const el = S.ctx.util.el, panel = el('section', 'quota-summary', S.workspace);
        el('strong', 'quota-summary-title', panel, 'Quota Summary');
        const body = el('div', 'quota-summary-body', panel);
        S.P.miniTable(body, ['Resource', 'Used', 'Limit', 'Headroom'], [['VM Instances', '118', '200', '82'], ['Public Addresses', '410', '600', '190'], ['Disks', '256', '500', '244'], ['Load Balancers', '24', '100', '76']]);
        const audit = el('div', 'quota-audit', body);
        for (const [label, text] of [['Last Updated', 'Apr 25, 1999  10:24 AM'], ['Audit Reference', 'Q-19990425-1024'], ['Scope', 'All Subscriptions']]) { el('strong', '', audit, label); el('span', '', audit, text); }
      },
    },
  },
});
