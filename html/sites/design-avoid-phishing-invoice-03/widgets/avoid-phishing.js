// Design on the shared avoid-phishing/classic widget.
env.widget({
  task: 'avoid-phishing',
  site: 'design-avoid-phishing-invoice-03',
  name: 'design',
  split: 'train',
  scenarios: ['invoice'],
  template: 'avoid-phishing/classic',
  design: {
    rowHeight: 42,
    parts: {
      list: (base, S) => (ctx) => {
        base(ctx);
        // Keep the title-band layout, with the vertical pane the task uses.
        Object.assign(S.els.pane.style, {
          display: 'flex', flexDirection: 'column', alignItems: 'stretch',
          gap: '0', width: '100%', minWidth: '0', maxWidth: 'none',
          height: ctx.size.width <= 1100 ? '44px' : '52px',
          flex: 'none', overflow: 'auto',
        });
      },
      row: (base, S) => (ctx, record) => {
        const row = base(ctx, record);
        Object.assign(row.style, {
          flex: `0 0 ${S.D.rowHeight}px`, width: '100%', minWidth: '0',
          height: `${S.D.rowHeight}px`, display: 'flex',
          flexDirection: 'column', justifyContent: 'center',
          padding: ctx.size.width <= 1100 ? '2px 8px' : '4px 16px',
        });
        return row;
      },
      empty: (_base, S) => (ctx) => {
        const first = ctx.spec.records[0];
        if (first) S.P.ledger(ctx, first);
      },
      ledger: (base, S) => (ctx, record) => {
        base(ctx, record);
        const reading = S.els.reading;
        const nodes = Array.from(reading.children);
        const heading = nodes.find((n) => n.tagName === 'H2');
        const meta = nodes.find((n) => n.classList.contains('sp-meta'));
        const accounts = nodes.find((n) => n.classList.contains('sp-pair'));
        const notes = nodes.filter((n) => n.tagName === 'P');
        const invoice = ctx.util.el('section', 'invoice-detail-block');
        const vendor = ctx.util.el('section', 'vendor-detail-block');
        const invoiceHead = ctx.util.el('div', 'invoice-block-heading', invoice);
        ctx.util.el('span', '', invoiceHead, '▤');
        ctx.util.el('strong', '', invoiceHead, 'INVOICE');
        if (heading) invoiceHead.append(heading);
        const invoiceBody = ctx.util.el('div', 'invoice-block-body', invoice);
        if (meta) invoiceBody.append(meta);
        const requested = accounts && accounts.children[0];
        const master = accounts && accounts.children[1];
        if (requested) invoiceBody.append(requested);
        const vendorHead = ctx.util.el('div', 'invoice-block-heading', vendor);
        ctx.util.el('span', '', vendorHead, '♟');
        ctx.util.el('strong', '', vendorHead, 'VENDOR MASTER RECORD');
        const vendorBody = ctx.util.el('div', 'vendor-block-body', vendor);
        if (meta) {
          const name = meta.querySelector('dd');
          if (name) vendorBody.append(name.cloneNode(true));
        }
        if (master) vendorBody.append(master);
        if (accounts) accounts.remove();
        for (const note of notes) (note.classList.contains('sp-badge') ? invoiceBody : vendorBody).append(note);
        reading.replaceChildren(invoice, vendor);
      },
    },
  },
});
