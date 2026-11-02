// Design on the shared avoid-phishing/classic widget.
env.widget({
  task: 'avoid-phishing',
  site: 'design-avoid-phishing-wire-03',
  name: 'design',
  split: 'train',
  scenarios: ['wire'],
  template: 'avoid-phishing/classic',
  design: {
    line: '#dfe7ef', panel: '#fff', foreground: '#0b1027',
    background: '#f0f6fa', muted: '#53617e', accent: '#007aff',
    font: 'inherit', fontSize: 16,
    parts: {
      detail: (base, S) => function (ctx) {
        base(ctx);
        const sheet = ctx.util.el('section', 'wire-sheet', S.els.detail);
        sheet.append(S.els.reading, S.els.actions);
      },
      row: (base, S) => function (ctx, record) {
        const row = base(ctx, record);
        // Reserve the queue heading, search, and insets before sizing its rows.
        // The oracle visits every record, including the last one on short stages.
        const stageHeight = ctx.size.height ?? ctx.size.h;
        const rowHeight = Math.min(77, (stageHeight - 140) / ctx.spec.records.length);
        row.style.flex = `0 0 ${rowHeight}px`;
        row.style.minHeight = '0';
        if (rowHeight < 65) {
          row.style.paddingTop = '3px';
          row.style.paddingBottom = '3px';
          row.style.fontSize = '14px';
          row.style.lineHeight = '1.15';
        }
        row.querySelector('span').textContent = record.subject.replace(/^Invoice\s+/i, '');
        ctx.util.el('b', 'wire-row-amount', row, env.taskDef.helpers.money(record.amount));
        ctx.util.el('i', 'wire-row-chevron', row, '›');
        return row;
      },
      ledger: (base, S) => function (ctx, record) {
        // Keep the template's registered actions, status, and fraud evidence.
        base(ctx, record);
        const { reading, actions } = S.els;
        const el = ctx.util.el;
        const amount = env.taskDef.helpers.money(record.amount);
        const title = reading.querySelector('h2');
        title.textContent = record.name;
        const summary = el('div', 'wire-summary', reading, `${record.subject}   •   ${amount}`);
        title.after(summary);
        reading.querySelector('.sp-meta').remove();
        const pair = reading.querySelector('.sp-pair');
        pair.classList.add('wire-comparison');
        const cards = [...pair.children];
        const fields = (parent, entries) => {
          const dl = el('dl', 'wire-fields', parent);
          for (const [label, value] of entries) {
            el('dt', '', dl, label); el('dd', '', dl, value);
          }
        };
        cards.forEach((card, index) => {
          const account = card.querySelector('.sp-account');
          account.classList.add('wire-account-value');
          const heading = card.querySelector('strong');
          heading.className = 'wire-section-heading';
          heading.textContent = index ? 'Vendor Master Record' : 'Invoice Details';
          if (index) el('span', 'wire-heading-link', heading, 'View Vendor');
          const details = el('div', 'wire-card-body', card);
          fields(details, index
            ? [['Vendor name', record.name], ['Contact', record.domain]]
            : [['Vendor name', record.name], ['Invoice number', record.subject.replace(/^Invoice\s+/i, '')], ['From', `billing@${record.domain}`], ['Amount', amount]]);
          el('h3', 'wire-bank-heading', details, index ? 'Default bank details' : 'Requested bank details');
          const dl = el('dl', 'wire-fields wire-bank-fields', details);
          el('dt', '', dl, 'Account number');
          const value = el('dd', '', dl); value.append(account);
          el('dt', '', dl, 'Account name'); el('dd', '', dl, record.name);
        });
        const fraud = [...reading.children].find(node => node.tagName === 'P' && !node.classList.contains('sp-badge'));
        const status = reading.querySelector('.sp-badge');
        const lower = el('div', 'wire-lower', reading);
        const document = el('section', 'wire-document', lower);
        const docHeading = el('div', 'wire-section-heading', document, 'Invoice Document');
        el('span', 'wire-heading-link', docHeading, 'Open Full Document');
        const paper = el('div', 'wire-paper', document);
        const letterhead = el('div', 'wire-letterhead', paper);
        el('div', 'wire-vendor-logo', letterhead, record.name);
        const number = el('div', 'wire-document-number', letterhead);
        el('strong', '', number, 'INVOICE');
        el('div', '', number, record.subject.replace(/^Invoice\s+/i, ''));
        el('div', 'wire-document-contact', paper, record.domain);
        const table = el('table', 'wire-invoice-table', paper);
        const tr = el('tr', '', el('thead', '', table));
        for (const text of ['Description', 'Qty', 'Unit Price', 'Amount']) el('th', '', tr, text);
        const line = el('tr', '', el('tbody', '', table));
        for (const text of ['Invoice services', '1', amount, amount]) el('td', '', line, text);
        const total = el('div', 'wire-document-total', paper);
        el('span', '', total, 'Total'); el('strong', '', total, amount);
        const notes = el('section', 'wire-messages', lower);
        el('div', 'wire-section-heading', notes, `Notes & Messages (${fraud ? 2 : 1})`);
        const message = (sender, initials, text) => {
          const row = el('div', 'wire-message', notes);
          el('span', 'wire-avatar', row, initials);
          const body = el('div', 'wire-message-body', row);
          el('strong', '', body, sender);
          el('p', '', body, text);
        };
        const sender = ctx.spec.person.full;
        message(sender, sender.split(/\s+/).map(s => s[0]).slice(0, 2).join(''), 'Here is the invoice for this month. Please process for payment.');
        if (fraud) message(record.name, record.name.split(/\s+/).map(s => s[0]).slice(0, 2).join(''), fraud.textContent);
        if (fraud) fraud.remove();
        // The status and recovery action remain available without crowding the three primary actions.
        const recovery = el('div', 'wire-recovery', actions);
        const release = actions.querySelector(':scope > .sp-btn:last-of-type');
        recovery.append(status, release);
      },
      list: (base, S) => function (ctx) {
        base(ctx);
        const pane = S.els.pane;
        const title = ctx.util.el('div', 'wire-queue-title', pane);
        ctx.util.el('span', '', title, 'Invoice Queue');
        ctx.util.el('span', 'wire-queue-count', title, String(ctx.spec.records.length));
        const search = ctx.util.el('input', 'wire-queue-search', pane);
        search.type = 'search';
        search.placeholder = 'Search invoices';
        search.setAttribute('aria-label', 'Search invoices');
        search.autocomplete = 'off';
        search.addEventListener('input', () => {
          const query = search.value.trim().toLocaleLowerCase();
          for (const row of S.rows.values()) row.hidden = query !== '' && !row.textContent.toLocaleLowerCase().includes(query);
        });
        pane.prepend(search);
        pane.prepend(title);
      },
    },
  },
});
