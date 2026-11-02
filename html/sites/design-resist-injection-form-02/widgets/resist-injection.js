// Design on the shared resist-injection workspace.
env.widget({
  task: 'resist-injection',
  site: 'design-resist-injection-form-02',
  name: 'design',
  split: 'train',
  scenarios: ['form'],
  template: 'resist-injection/classic',
  design: {
    parts: {
      header: (_base, _S) => (_ctx) => {},
      toolbar: (_base, S) => (ctx) => {
        const compact = ctx.size.height < 800;
        const short = ctx.size.height < 650;
        const el = (tag, cls, parent, text) => ctx.util.el(tag, cls, parent, text);
        const bar = el('div', 'si-toolbar editorial-heading', S.app);
        Object.assign(bar.style, { display: 'block', position: 'relative', flex: 'none', minHeight: '0', padding: compact ? (short ? '10px 18px' : '18px 28px 16px') : '26px 32px 24px' });
        S.toolbar = bar;
        const heading = el('div', 'editorial-title', bar);
        const title = el('h1', '', heading, S.spec.reference);
        const vendor = el('div', 'editorial-vendor', heading, S.spec.org.name);
        if (compact) { title.style.fontSize = short ? '28px' : '42px'; vendor.style.fontSize = short ? '16px' : '20px'; }
        const stamp = el('div', 'editorial-stamp', bar);
        if (compact) Object.assign(stamp.style, { top: short ? '12px' : '22px', right: short ? '18px' : '28px', fontSize: short ? '13px' : '16px', gap: '3px' });
        el('span', '', stamp, 'Apr 14, 2016');
        el('span', 'editorial-open', stamp, 'Open');
        const rule = el('div', 'editorial-rule', bar);
        const files = el('div', 'editorial-files', bar);
        if (compact) { rule.style.marginTop = short ? '6px' : '12px'; files.style.marginTop = short ? '6px' : '16px'; }
        for (const [name, kind, date, size] of [
          ['W-9.pdf', 'Tax form (W-9)', 'Apr 14, 2016', '142 KB'],
          ['Vendor_Application.pdf', 'Vendor application', 'Apr 14, 2016', '318 KB'],
          ['Insurance_Certificate.pdf', 'Insurance certificate', 'Apr 14, 2016', '276 KB'],
        ]) {
          const row = el('div', 'editorial-file', files);
          if (compact) Object.assign(row.style, { minHeight: short ? '24px' : '36px', fontSize: short ? '11px' : '14px', gridTemplateColumns: short ? '24px minmax(120px,1fr) minmax(95px,1fr) 92px 50px' : '32px minmax(180px,1fr) minmax(120px,1fr) 120px 64px' });
          const icon = el('span', 'editorial-file-icon', row, '▤');
          if (compact) Object.assign(icon.style, { fontSize: '18px', lineHeight: '1' });
          el('span', 'editorial-file-name', row, name);
          el('span', 'editorial-file-kind', row, kind);
          const fileDate = el('span', 'editorial-file-date', row, date);
          const fileSize = el('span', 'editorial-file-size', row, size);
          if (compact) for (const cell of [fileDate, fileSize]) Object.assign(cell.style, { paddingRight: '8px', whiteSpace: 'nowrap' });
        }
      },
      sourceForm: (base, S) => (ctx) => {
        S.fields.querySelectorAll('.editorial-email').forEach((node) => node.remove());
        base(ctx);
        const title = S.source.querySelector('h2');
        if (title) title.remove();
        const intro = S.source.querySelector('p');
        if (intro) intro.remove();
        const heads = S.source.querySelectorAll('h3');
        if (heads[0]) heads[0].textContent = 'Account email';
        if (heads[1]) heads[1].textContent = 'Form help';
        if (heads[0]) {
          const copy = heads[0].nextElementSibling;
          const email = copy && copy.nextElementSibling;
          heads[0].classList.add('editorial-email');
          S.fields.append(heads[0]);
          if (copy && copy.tagName === 'P') { copy.classList.add('editorial-email'); S.fields.append(copy); }
          if (email && email.matches('label')) { email.classList.add('editorial-email'); S.fields.append(email); }
        }
        // Keep the entire editor visible; the source pane retains its own scrolling.
        const compact = ctx.size.height < 800;
        const cramped = ctx.size.height < 650;
        Object.assign(S.app.style, { boxSizing: 'border-box', width: `${ctx.size.width}px`, height: `${ctx.size.height}px` });
        const body = S.source.parentElement;
        Object.assign(body.style, { display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(220px,.88fr)', gridTemplateRows: 'minmax(0,1fr)', minHeight: '0', gap: '0', padding: compact ? (cramped ? '4px 18px 6px' : '10px 18px 12px') : '20px 32px 30px' });
        Object.assign(S.source.style, { gridColumn: '1', minWidth: '0', minHeight: '0', padding: compact ? '4px 15px 4px 4px' : '13px 24px 12px 4px', overflow: 'auto' });
        const editor = S.fields.parentElement;
        Object.assign(editor.style, { gridColumn: '2', gridRow: '1', width: 'auto', minWidth: '0', minHeight: '0' });
        Object.assign(S.fields.style, { padding: compact ? '0 0 0 15px' : '12px 0 12px 30px', minHeight: '0' });
        const fieldTitle = S.fields.firstElementChild;
        if (fieldTitle && fieldTitle.tagName === 'H3' && !fieldTitle.classList.contains('editorial-email')) fieldTitle.remove();
        for (const child of S.fields.children) {
          if (child.tagName === 'LABEL') Object.assign(child.style, { margin: compact ? (cramped ? '0 0 3px' : '0 0 7px') : '0 0 12px' });
          if (child.tagName === 'H3') Object.assign(child.style, { margin: compact ? (cramped ? '4px 0 3px' : '8px 0 5px') : '20px 0 8px', paddingTop: compact ? (cramped ? '4px' : '8px') : '18px', fontSize: compact ? '17px' : '24px', borderTop: '1px solid #d9dde2' });
          if (child.tagName === 'P') Object.assign(child.style, { margin: '0 0 5px', fontSize: compact ? '12px' : '18px', lineHeight: '1.35' });
        }
        for (const input of S.fields.querySelectorAll('input')) Object.assign(input.style, { boxSizing: 'border-box', marginTop: '4px', minHeight: '0', height: compact ? (cramped ? '28px' : '30px') : '42px', padding: compact ? '4px 8px' : '8px 12px', font: `${compact ? 14 : 18}px/1.3 Arial,Helvetica,sans-serif` });
        const savebar = editor.querySelector('.si-savebar');
        if (savebar) {
          Object.assign(savebar.style, { padding: compact ? '6px 0 0 15px' : '10px 0 0 30px', border: '0' });
          for (const button of savebar.querySelectorAll('button')) Object.assign(button.style, { width: 'auto', minWidth: '0', minHeight: compact ? '32px' : '42px', fontSize: compact ? '14px' : '18px' });
        }
      },
    },
  },
});
