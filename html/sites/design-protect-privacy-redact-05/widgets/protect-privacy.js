// Design on the protect-privacy/classic template.
env.widget({
  task: 'protect-privacy',
  site: 'design-protect-privacy-redact-05',
  name: 'design',
  split: 'train',
  scenarios: ['redact'],
  template: 'protect-privacy/classic',
  design: {
    parts: {
      view: (base, S) => (m) => {
        const P = S.P;
        const main = P.element('div', 'sp-main sp-redact-main', S.app);
        const area = P.element('div', 'sp-redact-area', main);
        const rail = P.element('aside', 'sp-redact-rail', area);
        P.element('h3', '', rail, 'Tools');
        P.tool(rail, 'tool:select', '↖  Select', m.tool === 'select');
        const tr = P.tool(rail, 'tool:redact', 'Redact', m.tool === 'redact' || m.tool === 'locked', S.spec.noRedact ? 'PRO' : null);
        const th = P.tool(rail, 'tool:highlight', 'Highlighter', m.tool === 'highlight');
        if (tr && tr.classList) tr.classList.add('sp-t-redact');
        const ic = (b, d) => { if (b && b.insertAdjacentHTML) b.insertAdjacentHTML('afterbegin', `<svg class="sp-ico" viewBox="0 0 24 24" width="30" height="30"><path fill="currentColor" d="${d}"/></svg>`); };
        ic(tr, 'M6 2h8l5 5v9h-2V9h-4V4H6v16h6v2H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm2 9h8v2H8zm0 4h5v2H8zm11 1l3 3-5 2z');
        ic(th, 'M16.5 3l4.5 4.500-9.500 9.500-6 1.500 1.500-6zM4 20h16v2H4z');
        const thumbs = P.element('div', 'sp-thumbs', rail);
        [1, 2, 3].forEach((n) => {
          const t = P.element('div', 'sp-thumb' + (n === 1 ? ' on' : ''), thumbs);
          t.innerHTML = `<svg viewBox="0 0 80 110" aria-hidden="true"><rect width="80" height="110" fill="white"/><g fill="#a5b1bb"><path d="M9 10h18v2H9zm0 4h30v1H9zm0 3h22v1H9zm42-7h20v2H51zm4 4h16v1H55z"/><path d="M9 25h62v2H9zm0 5h12v1H9zm0 3h12v1H9zm0 3h12v1H9zm17-6h34v1H26zm0 3h38v1H26zm0 3h31v1H26zm0 3h35v1H26z"/></g><g stroke="#d1d6da" stroke-width=".7"><path fill="#e9ecef" d="M9 47h62v5H9z"/><path fill="none" d="M9 47h62v24H9zM9 57h62M9 62h62M9 67h62M25 47v24M48 47v24M63 47v24"/></g><g fill="#b9c0c5"><path d="M9 77h30v2H9zM9 82h62v1H9zm0 3h62v1H9zm0 3h62v1H9zm0 3h62v1H9zm0 3h58v1H9zm0 3h60v1H9z"/></g></svg>`;
          if (n === 2) t.querySelector('svg').insertAdjacentHTML('beforeend', '<path fill="white" d="M8 8h65v12H8zM8 77h65v23H8z"/><path fill="#9ba9b4" d="M9 10h29v2H9zM9 77h28v2H9z"/><path fill="#e8ecef" stroke="#c8d0d7" stroke-width=".6" d="M9 82h62v17H9zM9 87h62M9 92h62M28 82v17M49 82v17"/>');
          if (n === 3) t.querySelector('svg').insertAdjacentHTML('beforeend', '<path fill="white" d="M8 8h65v12H8zM8 46h65v26H8z"/><path fill="#9ba9b4" d="M9 10h25v2H9zM9 47h16v1H9zm0 4h20v1H9zm0 4h17v1H9zm0 4h18v1H9zm0 4h13v1H9zm34-16h20v1H43zm0 4h25v1H43zm0 4h24v1H43zm0 4h22v1H43zm0 4h24v1H43z"/>');
          P.element('span', '', thumbs, String(n));
        });
        P.element('div', 'sp-redact-divider', rail);
        P.element('h3', 'sp-zoom-label', rail, 'Zoom');
        const zoom = P.element('div', 'sp-redact-zoom', rail);
        P.element('button', '', zoom, '−'); P.element('b', '', zoom, '100%'); P.element('button', '', zoom, '+');

        const content = P.element('div', 'sp-redact-content', area);
        const head = P.element('div', 'sp-doc-h sp-redact-head', content);
        P.element('div', 't sp-redact-title', head, S.spec.file || S.spec.title);
        P.element('span', 'sp-redact-count', head, '1 / 3');
        const zm = P.element('div', 'sp-hzoom', head);
        P.element('span', '', zm, '−'); P.element('b', '', zm, '100%  ▾'); P.element('span', '', zm, '+');
        const dl = P.element('span', 'sp-hico', head);
        dl.innerHTML = '<svg viewBox="0 0 24 24" width="26" height="26"><path fill="#3b5368" d="M7 3h10v4H7zM5 8h14a2 2 0 0 1 2 2v6h-4v4H7v-4H3v-6a2 2 0 0 1 2-2zm4 7v4h6v-4z"/></svg>';
        const actions = P.element('div', 'sp-redact-actions', head);
        P.key(P.element('button', `sp-btn sp-apply${m.marks.length ? ' pri' : ''}`, actions, `✓  Apply${m.marks.length ? ` (${m.marks.length})` : ''}`), 'apply');
        const revert = P.key(P.element('button', 'sp-btn sp-revert', actions, '↶'), 'revert');
        revert.title = 'Revert'; revert.setAttribute('aria-label', 'Revert');
        const exportWrap = P.element('div', 'sp-redact-export', actions);
        const exp = P.key(P.element('button', 'sp-btn sp-export-button', exportWrap), 'export');
        exp.title = 'Export'; exp.setAttribute('aria-label', 'Export');
        exp.innerHTML = '<svg viewBox="0 0 24 24" width="27" height="27"><path fill="currentColor" d="M10 2h4v10h4l-6 6-6-6h4zM3 17h4v3h10v-3h4v6H3z"/></svg>';
        if (m.tool === 'locked') P.element('div', 'sp-banner', content, `Redaction is part of ${S.spec.org.name} Pro. Upgrade to permanently remove text and images.`);
        else if (m.tool === 'redact' && !m.marks.length && !m.burned.length) P.element('div', 'sp-banner', content, 'Click text to mark it for redaction, then Apply.');
        const pdf = P.element('div', 'sp-pdf sp-redact-pdf', content);
        const page = P.element('div', 'sp-page sp-redact-page', pdf);
        const letterhead = P.element('div', 'sp-letterhead', page);
        const org = P.element('div', 'sp-report-org', letterhead);
        const brand = P.element('div', 'sp-report-headline', org);
        brand.innerHTML = '<svg viewBox="0 0 70 62" aria-hidden="true"><path fill="#1266bf" d="M38 0 69 60H34L51 43 40 22 27 46 12 60H0l22-33 8 17 7-12-9-14z"/><path fill="#3886ca" d="m39 4 9 18-8 14-9-17zm7 28 6 12-15 16H23z"/></svg>';
        P.element('span', '', brand, 'Acme ');
        P.element('strong', '', brand, 'Financial');
        P.element('div', 'sp-org-address', org, '400 Market Street');
        P.element('div', 'sp-org-address', org, 'San Francisco, CA 94105');
        const report = P.element('div', 'sp-report-summary', letterhead);
        P.element('div', 'sp-report-code', report, S.spec.title);
        const metadata = P.element('div', 'sp-report-facts', report);
        [['Report Date:', 'Apr 15, 2016'], ['Case Number:', (S.spec.title.match(/CR-\d+/) || ['—'])[0]], ['Prepared For:', S.spec.recipient]].forEach(([k,v]) => {
          P.element('b', '', metadata, k); P.element('span', '', metadata, v);
        });
        const body = P.element('div', 'sp-report-body', page);
        const pieces = [];
        let text = '';
        S.spec.tokens.forEach((t, i) => {
          const holder = document.createElement('span');
          P.token(holder, t, i, m);
          const raw = holder.textContent.trim();
          if (text) text += ' ';
          pieces.push({holder, raw, start:text.length, end:text.length + raw.length});
          text += raw;
        });
        const fields = [];
        const extract = (pattern, category, all) => {
          for (const match of text.matchAll(pattern)) {
            const value = match[1];
            const start = match.index + match[0].indexOf(value);
            const end = start + value.length;
            const selected = pieces.filter(p => p.end > start && p.start < end && !p.field);
            if (!selected.length) continue;
            const field = {category, holder:document.createElement('span'), pieces:selected};
            fields.push(field);
            selected.forEach(p => { p.field = field; field.holder.appendChild(p.holder); field.holder.appendChild(document.createTextNode(' ')); });
            if (!all) break;
          }
        };
        extract(/On\s+\S+\s+(.+?)\s+\(born/g, 'name');
        extract(/born\s+(\d{2}\/\d{2}\/\d{4})/g, 'dob');
        extract(/((?:\+?1[ -]?)?(?:\(\d{3}\)|\d{3})[ .-]?\d{3}[ .-]\d{4})/g, 'phone', true);
        extract(/([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g, 'email', true);
        extract(/(\d{3}-\d{2}-\d{4})/g, 'ssn');
        extract(/(?:lives at|Shipping went to)\s+(.+?)(?=\s+(?:and asked|two days)|\.(?:\s|$))/g, 'address', true);
        pieces.filter(p => !p.field && /^\d+\s+[A-Z]/.test(p.raw)).forEach(p => {
          const field = {category:'address', holder:document.createElement('span'), pieces:[p]};
          p.field = field; field.holder.appendChild(p.holder); fields.push(field);
        });
        extract(/(\d{4}[ -]\d{4}[ -]\d{4}[ -]\d{4})/g, 'card', true);
        fields.forEach(field => {
          const last = field.pieces[field.pieces.length - 1];
          field.punctuation = (last.raw.match(/[.,)]+$/) || [''])[0];
          if (!field.punctuation) return;
          const walker = document.createTreeWalker(last.holder, NodeFilter.SHOW_TEXT);
          let node, tail;
          while ((node = walker.nextNode())) if (node.nodeValue.trim()) tail = node;
          if (tail) tail.nodeValue = tail.nodeValue.replace(/[.,)]+(\s*)$/, '$1');
        });
        P.element('h2', 'sp-report-section', body, 'Customer Information');
        const info = P.element('div', 'sp-customer-grid', body);
        const labels = {name:'Name:',address:'Address:',phone:'Phone:',email:'Email:',dob:'Date of Birth:',ssn:'SSN:',other:'Reference:'};
        const ordered = ['name','address','phone','email','dob','ssn'];
        ordered.forEach(cat => {
          const values = fields.filter(f => f.category === cat);
          if (!values.length) return;
          P.element('b', '', info, labels[cat]);
          const value = P.element('div', 'sp-field-value', info);
          values.forEach((f, n) => {
            if (n) P.element('span', 'sp-value-separator', value, ' · ');
            value.appendChild(f.holder);
          });
        });
        P.element('h2', 'sp-report-section', body, 'Disputed Transactions');
        const table = P.element('table', 'sp-transactions', body);
        const thead = P.element('tr', '', P.element('thead', '', table));
        ['Date', 'Description', 'Card Number', 'Amount'].forEach(label => P.element('th', '', thead, label));
        const tbody = P.element('tbody', '', table);
        const cards = fields.filter(f => f.category === 'card');
        const count = Math.max(cards.length, 4);
        for (let i = 0; i < count; i++) {
          const row = P.element('tr', '', tbody);
          P.element('td', '', row, ['Mar 02, 2016', 'Mar 04, 2016', 'Mar 10, 2016', 'Mar 12, 2016'][i % 4]);
          P.element('td', '', row, ['Riverside Hotel', 'Blue Stone Airlines', 'Green Leaf Cafe', 'City Taxicab Co.'][i % 4]);
          const number = P.element('td', '', row);
          if (cards[i]) number.appendChild(cards[i].holder); else number.textContent = '—';
          P.element('td', '', row, ['$489.20', '$312.00', '$58.45', '$27.30'][i % 4]);
        }
        P.element('h2', 'sp-report-section', body, 'Customer Statement');
        const statement = P.element('p', 'sp-customer-statement', body);
        const replacements = {name:'the customer',dob:'date on file',phone:'the number above',email:'the address above',ssn:'on file',address:'the address above',card:'the card listed above'};
        pieces.forEach(p => {
          if (!p.field) statement.appendChild(p.holder);
          else if (p === p.field.pieces[0]) statement.appendChild(document.createTextNode(replacements[p.field.category] + p.field.punctuation));
          statement.appendChild(document.createTextNode(' '));
        });
        if (m.exported) P.element('div', 'sp-toast', main, `Exported ${S.spec.file}`);
      },
    },
  },
});
