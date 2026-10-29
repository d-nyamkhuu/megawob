// Design on the shared avoid-phishing/classic widget.
env.widget({
  task: 'avoid-phishing',
  site: 'design-avoid-phishing-wire-02',
  name: 'design',
  split: 'train',
  scenarios: ['wire'],
  template: 'avoid-phishing/classic',
  design: {
    widthInset: 0,
    heightInset: 0,
    radius: '0px',
    fontSize: 14,
    parts: {
      layout: (base, S) => (ctx) => {
        base(ctx);
        S.els.app.classList.add('wire-app');
        for (const node of S.els.app.querySelectorAll('.sp-browser,.sp-top,.sp-nav,.sp-toolbar')) node.remove();
        const title = ctx.util.el('h1', 'wire-page-title', S.els.app, 'Invoice Payment Queue');
        S.els.app.prepend(title);
      },
      list: (base, S) => (ctx) => {
        base(ctx);
        const queue = ctx.util.el('div', 'wire-queue', S.els.content);
        S.els.content.insertBefore(queue, S.els.pane);
        const tabs = ctx.util.el('div', 'wire-tabs wire-queue-tabs', queue);
        for (const label of [`Pending (${ctx.spec.records.length})`, 'All Invoices', 'Exceptions', 'Vendor Messages']) ctx.util.el('span', '', tabs, label);
        const heads = ctx.util.el('div', 'wire-columns', queue);
        for (const label of ['Vendor', 'Invoice #', 'Amount', 'Requested Bank Details', 'Invoice Date']) ctx.util.el('span', '', heads, label);
        queue.append(S.els.pane);
      },
      row: (base, S) => (ctx, x) => {
        const row = base(ctx, x);
        row.replaceChildren();
        for (const value of [x.name, x.subject.replace(/^Invoice\s*/i, ''), env.taskDef.helpers.money(x.amount), x.bank, 'Apr 2, 2012']) ctx.util.el('span', 'wire-cell', row, value);
        return row;
      },
      detail: (base, S) => (ctx) => {
        base(ctx);
        S.els.inspector = ctx.util.el('div', 'wire-inspector', S.els.content);
      },
      empty: (base, S) => (ctx) => {
        const first = ctx.spec.records[0];
        if (!first) return base(ctx);
        S.P.ledger(ctx, first);
        for (const button of S.els.actions.querySelectorAll('button')) {
          button.disabled = true;
          button.title = 'Select an invoice to act on this request';
        }
      },
      ledger: (base, S) => (ctx, x) => {
        base(ctx, x);
        const { el } = ctx.util;
        const { reading, actions, inspector } = S.els;
        const money = env.taskDef.helpers.money;
        const number = x.subject.replace(/^Invoice\s*/i, '');
        const warning = [...reading.querySelectorAll('p')].filter(n => !n.classList.contains('sp-badge')).map(n => n.textContent);
        const status = reading.querySelector('.sp-badge')?.textContent || 'Pending approval';
        reading.replaceChildren();
        el('h2', 'wire-vendor-title', reading, x.name);
        el('div', 'wire-vendor-id', reading, `Vendor ID  ${String(x.id).padStart(5, '0')}`);
        const tabs = el('div', 'wire-tabs wire-vendor-tabs', reading);
        for (const label of ['Vendor Master', 'Invoice Details', 'History']) el('span', '', tabs, label);
        const info = el('div', 'wire-master', reading);
        const fields = (parent, entries) => {
          const dl = el('dl', 'wire-fields', parent);
          for (const [key, value] of entries) { el('dt', '', dl, key); el('dd', '', dl, value); }
        };
        fields(info, [['Vendor Name', x.name], ['Vendor ID', String(x.id).padStart(5, '0')], ['Address', '742 Market St.\nPortland, OR 97204'], ['Contact', ctx.spec.person.full], ['Phone', '(503) 555-0199'], ['Email', `billing@${x.domain}`]]);
        el('h3', '', info, 'Master Bank Account');
        fields(info, [['Approved IBAN', x.master], ['Account Name', `${x.name} LLC`], ['Payment Method', 'Bank transfer'], ['Currency', 'USD']]);
        el('h3', '', info, 'Requested Payment');
        fields(info, [['Invoice Number', number], ['Invoice Date', 'Apr 2, 2012'], ['Amount', money(x.amount)]]);
        el('h4', '', info, 'Requested Bank Details');
        fields(info, [['Bank Account', x.bank], ['Account Name', `${x.name} LLC`]]);
        for (const text of warning) el('p', 'wire-request-note', info, text);
        if (ctx.model.open !== null) el('div', 'wire-request-status', info, status);
        S.rows.forEach((row, id) => row.classList.toggle('wire-preview-row', ctx.model.open === null && id === x.id));
        actions.classList.add('wire-decision-controls');
        inspector.replaceChildren();
        const documentTabs = el('div', 'wire-tabs wire-document-tabs', inspector);
        for (const label of ['Invoice Document', 'Email', 'Comments (0)']) el('span', '', documentTabs, label);
        const viewer = el('div', 'wire-viewer', inspector);
        const tools = el('div', 'wire-pdf-tools', viewer);
        for (const label of ['▣', '−', '+', 'Automatic Zoom  ⌃', '1', 'of 1', '⛶']) el('span', '', tools, label);
        tools.children[0].innerHTML = '<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.7" d="M4 3h14l3 3v15H3V3h1zm3 0v7h10V3M7 21V13h10v8M14 4v4"/></svg>';
        tools.children[1].innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" stroke-width="2"/><path d="m14 14 7 7M5 9h8" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
        tools.children[6].innerHTML = '<svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true"><path fill="currentColor" d="M14 2h8v8l-3-3-5 5-2-2 5-5zM10 22H2v-8l3 3 5-5 2 2-5 5z"/></svg>';
        const paper = el('div', 'wire-paper', viewer);
        const paperTop = el('div', 'wire-paper-top', paper);
        const brand = el('div', 'wire-document-brand', paperTop);
        const gear = el('span', 'wire-gear', brand);
        gear.innerHTML = '<svg viewBox="0 0 64 64" aria-hidden="true"><g fill="#0b4473"><circle cx="32" cy="32" r="25"/><rect x="26" y="1" width="12" height="62"/><rect x="26" y="1" width="12" height="62" transform="rotate(45 32 32)"/><rect x="26" y="1" width="12" height="62" transform="rotate(90 32 32)"/><rect x="26" y="1" width="12" height="62" transform="rotate(135 32 32)"/></g><circle cx="32" cy="32" r="16" fill="white"/></svg>';
        el('span', '', brand, x.name.toUpperCase());
        const invoice = el('div', 'wire-invoice-caption', paperTop);
        el('b', '', invoice, 'INVOICE');
        fields(invoice, [['Invoice #:', number], ['Invoice Date:', 'Apr 2, 2012'], ['Due Date:', 'Apr 30, 2012']]);
        el('div', 'wire-paper-address', paper, `${x.name}\n742 Market St.\nPortland, OR 97204`);
        el('div', 'wire-paper-address', paper, `Bill To:\n${ctx.spec.org.name}\n1000 Commerce Ave.\nSeattle, WA 98101`);
        const table = el('table', 'wire-invoice-table', paper);
        const head = el('tr', '', table);
        for (const label of ['Description', 'Qty', 'Unit Price', 'Amount']) el('th', '', head, label);
        for (const cells of [['Goods and services', '1', money(x.amount), money(x.amount)], ['Freight', '1', 'Included', '—'], ['Sales Tax', '1', 'Included', '—'], ['', '', 'Total', money(x.amount)]]) {
          const row = el('tr', '', table);
          for (const value of cells) el('td', '', row, value);
        }
        const properties = el('div', 'wire-document-properties', inspector);
        el('h3', '', properties, 'Properties');
        fields(properties, [['Document Type', 'Invoice'], ['File Name', `${number}.pdf`], ['File Size', '246 KB'], ['Received', 'Apr 2, 2012 10:14 AM'], ['From', `billing@${x.domain}`], ['To', `ap@${ctx.spec.org.domain}`]]);
      },
    },
  },
});
