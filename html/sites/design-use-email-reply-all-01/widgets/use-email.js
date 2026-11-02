// Design on templates/use-email/base.js: the base site's use-email widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'use-email',
  site: 'design-use-email-reply-all-01',
  name: 'design',
  split: 'train',
  scenarios: ['reply-all'],
  template: 'use-email/base',
  design: {
    parts: {
      'mailSidebar': (base, S) => function mailSidebar(ctx, side) {
        const { util } = ctx;
        const inspector = util.el('section', 'am-inspector', side);
        util.el('div', 'am-inspector-head', inspector, 'Message Details');
        const inspectorRows = {};
        for (const key of ['From', 'To', 'Cc', 'Subject', 'Date', 'Size', 'Attachments']) {
          const row = util.el('div', 'am-inspector-row', inspector);
          util.el('span', '', row, key + ':');
          inspectorRows[key] = util.el('span', 'value', row, '—');
        }

        return inspectorRows;
      },
      'mailPaintSidebar': (base, S) => function mailPaintSidebar(ctx, inspectorRows, m) {
        const { spec } = ctx;
        const selected = m.open !== null && m.open !== undefined ? spec.emails[m.open] : null;
        const values = selected ? {
          From: `${selected.name}${selected.addr ? ` <${selected.addr}>` : ''}`,
          To: (selected.to || []).map((x) => typeof x === 'string' ? x : (x.name || x.addr || '')).filter(Boolean).join(', ') || '—',
          Cc: (selected.cc || []).map((x) => typeof x === 'string' ? x : (x.name || x.addr || '')).filter(Boolean).join(', ') || '—',
          Subject: selected.subject || '—', Date: selected.time || '—',
          Size: selected.size || '—', Attachments: (selected.att || []).map((x) => x.file).filter(Boolean).join(', ') || '—',
        } : null;
        for (const [key, el] of Object.entries(inspectorRows)) el.textContent = values ? (values[key] || '—') : '—';

      },
      'mailSized': () => (ctx, listbox) => { if (listbox) listbox.refresh(); },
    },
  },
});
