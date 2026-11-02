// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) => function (ctx) {
      const result = base(ctx);
      if (ctx.kind !== 'chat') return result;
      const { util } = ctx;
      const header = util.el('div', 'acme-chat-head', result.el, 'Chat with support');
      header.append(result.dismiss);
      result.el.prepend(header);
      const message = result.el.querySelector('.ref-ov-text');
      const body = util.el('div', 'acme-chat-body', result.el);
      util.el('span', 'acme-chat-avatar', body, 'JD');
      body.append(message);
      const compose = util.el('div', 'acme-chat-compose', result.el);
      const input = util.el('input', '', compose);
      input.type = 'text';
      input.placeholder = 'Type a message...';
      input.setAttribute('aria-label', 'Message support');
      const send = util.el('button', '', compose, '➜');
      send.type = 'button';
      send.setAttribute('aria-label', 'Send message');
      send.addEventListener('click', () => env.log('overlay-click', { label: 'Send message' }));
      return result;
    },
    'frame.tools': (base, S) => function (_c) {
      base(_c);
      if (_c.headerTools.childElementCount) _c.osTitle.style.paddingRight = `${_c.headerTools.offsetWidth + 38}px`;
    },
    'frame.body': (base, S) => function (_c) {
      base(_c);
      const { util } = _c;
      const dash = util.el('div', 'acme-dashboard', _c.body);
      const stats = util.el('div', 'dash-stats', dash);
      for (const [title, value, icon, tone] of [
        ['Total Orders', '1,482', '▥', 'blue'], ['Pending', '312', '◷', 'blue'],
        ['Shipped', '892', '▰', 'blue'], ['Cancelled', '72', '⊗', 'red'],
      ]) {
        const card = util.el('section', 'dash-stat', stats);
        util.el('span', 'dash-label', card, title);
        util.el('strong', 'dash-value', card, value);
        const symbol = util.el('b', `dash-icon ${tone}`, card, icon);
        const paths = {
          'Total Orders': '<path d="M3 22V14M9 22V11M15 22V7M21 22V2" fill="none" stroke="currentColor" stroke-width="3"/>',
          'Pending': '<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 5v7l5 3" fill="none" stroke="currentColor" stroke-width="2"/>',
          'Shipped': '<path d="M2 5h13v13H2zM15 10h5l3 5v3h-8z" fill="currentColor"/><circle cx="6" cy="19" r="3" fill="currentColor" stroke="#eff5fa"/><circle cx="19" cy="19" r="3" fill="currentColor" stroke="#eff5fa"/><path d="M17 11h3l2 4h-5z" fill="#eff5fa"/>',
          'Cancelled': '<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="m8 8 8 8m0-8-8 8" fill="none" stroke="currentColor" stroke-width="2"/>',
        };
        symbol.innerHTML = `<svg width="27" height="27" viewBox="0 0 24 24" aria-hidden="true">${paths[title]}</svg>`;
      }
      const revenue = util.el('section', 'dash-panel dash-revenue', dash);
      util.el('strong', 'dash-heading', revenue, 'Revenue (YTD)');
      util.el('b', 'dash-amount', revenue, '$284,320');
      const chart = util.el('div', 'dash-chart', revenue);
      chart.innerHTML = '<svg viewBox="0 0 340 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 84 L24 67 L55 75 L83 48 L110 43 L142 52 L160 39 L176 41 L198 23 L223 29 L248 16 L277 21 L310 6 L340 12 L340 100 L0 100Z" fill="#3a86f414"/><path d="M0 84 L24 67 L55 75 L83 48 L110 43 L142 52 L160 39 L176 41 L198 23 L223 29 L248 16 L277 21 L310 6 L340 12" fill="none" stroke="#3b86f5" stroke-width="2"/></svg>';
      const products = util.el('section', 'dash-panel dash-products', dash);
      util.el('strong', 'dash-heading', products, 'Top Products');
      for (const [name, pct] of [['Wireless Mouse', 88], ['Mechanical Keyboard', 78], ['HD Monitor', 62], ['USB-C Hub', 58], ['Ergonomic Chair', 42]]) {
        const row = util.el('div', 'dash-product', products);
        util.el('span', '', row, name);
        const bar = util.el('i', '', row); bar.style.width = `${pct}%`;
      }
      const activity = util.el('section', 'dash-panel dash-activity', dash);
      util.el('strong', 'dash-heading', activity, 'Recent Activity');
      for (const [title, time] of [['Order #10492 created', '2 minutes ago'], ['Order #10491 shipped', '18 minutes ago'], ['Inventory updated', '1 hour ago'], ['Order #10490 created', '2 hours ago']]) {
        const row = util.el('div', 'dash-activity-row', activity);
        util.el('b', '', row, '•');
        const copy = util.el('div', '', row); util.el('span', '', copy, title); util.el('small', '', copy, time);
      }
      const map = util.el('section', 'dash-panel dash-map', dash);
      util.el('strong', 'dash-heading', map, 'Order Locations');
      const world = util.el('div', 'dash-world', map);
      world.innerHTML = '<svg viewBox="0 0 420 190" preserveAspectRatio="none" aria-hidden="true"><path d="m25 42 23-16 36-4 18 8 24-6 16 10-10 14-23 4-2 15-15 4-6 16-15-8-6-18-16-2-6-9-15 4zm87 47 22 5 14 16-3 24-10 14-3 18-14 10-10-21-2-22-12-14 7-12zm42-72 18-9 20 4-4 17-18 5zm49 37 12-15 25-7 20 8 8-9 27 4 17-8 27 7 10 13 32 7 20 17-10 10-24-4-12 13-15-5-9 20-15-6-10-19-16 1-8-17-17 6-7-13-18 6-9-5zm12 34 25-4 18 13 12 26-15 28-17 10-11-18-3-19-13-13zm114 53 25-9 18 7 14 20-13 10-23-2-17-11zm55-37 8 2 4 14-7 5-5-7z" fill="#a9bfd4" opacity=".53"/></svg>';
      for (let i = 0; i < 7; i++) util.el('i', `map-dot dot-${i}`, map);
      const customers = util.el('section', 'dash-panel dash-customers', dash);
      util.el('strong', 'dash-heading', customers, 'Top Customers');
      util.el('span', 'dash-view-all', customers, 'View All');
      for (const [name, value] of [['TechFlow Inc.', '$12,480'], ['GreenLeaf Traders', '$8,320'], ['Horizon Retail', '$6,780'], ['Summit Electronics', '$5,230'], ['Maple Works', '$4,900']]) {
        const line = util.el('div', 'dash-customer', customers);
        util.el('span', '', line, name); util.el('span', '', line, value);
      }
      util.el('section', 'dash-panel dash-bottom', dash);
      const inspector = util.el('aside', 'acme-inspector', _c.body);
      util.el('span', 'inspector-close', inspector, '×');
      const inspectorHead = util.el('div', 'inspector-head', inspector);
      util.el('strong', '', inspectorHead, 'Order #10492');
      util.el('span', 'inspector-status', inspectorHead, 'Pending');
      const facts = util.el('div', 'inspector-facts', inspector);
      for (const [label, value] of [['Customer', 'TechFlow Inc.'], ['Order Date', 'Apr 28, 2025'], ['Status', 'Pending'], ['Total', '$1,240.00'], ['Payment Method', 'Net 30'], ['Shipping Method', 'Standard Ground'], ['Tracking #', '—']]) {
        const line = util.el('div', 'inspector-fact', facts);
        util.el('span', '', line, label); util.el('b', '', line, value);
      }
      const itemTitle = util.el('strong', 'inspector-items-title', inspector, 'Items (3)');
      const itemGrid = util.el('div', 'inspector-items', inspector);
      const itemHeader = util.el('div', 'inspector-item inspector-item-header', itemGrid);
      for (const value of ['Product', 'Qty', 'Unit Price', 'Total']) util.el('span', '', itemHeader, value);
      for (const [product, qty, price, total] of [['HD Monitor 27”', '2', '$300.00', '$600.00'], ['Wireless Mouse', '5', '$25.00', '$125.00'], ['USB-C Hub', '3', '$50.00', '$150.00']]) {
        const line = util.el('div', 'inspector-item', itemGrid);
        for (const value of [product, qty, price, total]) util.el('span', '', line, value);
      }
      const sums = util.el('div', 'inspector-sums', inspector);
      for (const [label, value] of [['Subtotal', '$875.00'], ['Shipping', '$45.00'], ['Tax', '$320.00'], ['Total', '$1,240.00']]) {
        const line = util.el('div', 'inspector-sum', sums);
        util.el('span', '', line, label); util.el('b', '', line, value);
      }
      if (!document.body.dataset.acmeInspectorBound) {
        document.body.dataset.acmeInspectorBound = '1';
        document.addEventListener('click', (event) => {
          const row = event.target.closest('.to-row');
          if (!row) return;
          const heads = [...document.querySelectorAll('.to-hrow .to-h')].map((el) => el.textContent.trim()).filter(Boolean);
          const cells = [...row.querySelectorAll('.to-c')].map((el) => el.textContent.trim());
          if (!cells.length) return;
          inspectorHead.replaceChildren();
          util.el('strong', '', inspectorHead, cells[0] || 'Selected record');
          util.el('span', 'inspector-status', inspectorHead, 'Selected');
          facts.replaceChildren();
          cells.slice(0, 7).forEach((value, i) => {
            const line = util.el('div', 'inspector-fact', facts);
            util.el('span', '', line, heads[i] || `Field ${i + 1}`); util.el('b', '', line, value || '—');
          });
          itemTitle.textContent = 'Record details';
          itemGrid.replaceChildren(); sums.hidden = true;
        });
      }
      return _c.body;
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const osTitle = util.el('div', 'os-title', header);
      const appicon = util.el('span', 'os-appicon', osTitle);
      appicon.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9Z" stroke="white" stroke-width="1.5" fill="none"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9" stroke="white" stroke-width="1.5" fill="none"/><path d="m12 3 8 4.5-8 4.5-8-4.5Z" fill="white"/></svg>';
      util.el('strong', 'os-apptitle', osTitle, 'Acme Supply Co.');
      util.el('span', 'os-date', osTitle, 'Mon, Apr 28, 2025');
      const bell = util.el('span', 'os-bell', osTitle);
      bell.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M5 17h14l-2-3V9a5 5 0 0 0-10 0v5l-2 3Zm5 3h4M12 2v2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>';
      util.el('span', 'os-user', osTitle, 'JD');
      const osMenu = null, osBar = null, summary = null, boxes = null, totals = null, filters = null, meta = null;
      S.frameBrand(_c, header);
      Object.assign(_c, { boxes, filters, header, meta, osBar, osMenu, osTitle, summary, totals });
    },
  };

  env.site({
    name: 'design-use-data-grid-filter-05',
    template: 'site/base',
    design: { parts },
  });
})();
