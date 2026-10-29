// Design on the shared avoid-phishing/classic widget.
env.widget({
  task: 'avoid-phishing',
  site: 'design-avoid-phishing-attachment-01',
  name: 'design',
  split: 'train',
  scenarios: ['attachment'],
  template: 'avoid-phishing/classic',
  design: {
    parts: {
      empty(base, S) { return (ctx) => { const record = ctx.spec.records[0]; if (record) S.P.attachment(ctx, record); else base(ctx); }; },
      attachment(base, S) {
        return (ctx, record) => {
          const { util, spec, model } = ctx;
          const { reading, actions } = S.els;
          const P = S.P;
          const entries = [
            ['From:', `${record.name} <documents@${record.domain}>`],
            ['To:', spec.username],
            ['Cc:', ''],
            ['Subject:', `Documents · ${spec.reference}`],
            ['Date:', 'Mar 12, 1999  10:24 AM'],
          ];
          const meta = util.el('div', 'beos-message-fields', reading);
          for (const [label, value] of entries) {
            util.el('strong', '', meta, label);
            util.el('span', '', meta, value);
          }
          const message = util.el('div', 'beos-message-body', reading);
          util.el('p', '', message, 'Hello,');
          util.el('p', '', message, `Please find attached ${record.file}. Let me know if you need any additional information.`);
          util.el('p', '', message, 'Thank you,');
          util.el('p', '', message, `${record.name}\n${spec.org.name}`);
          actions.classList.add('beos-attachments');
          const heading = util.el('div', 'beos-attachments-heading', actions, 'Attachments (1)');
          const row = util.el('div', 'beos-attachment-row', actions);
          util.el('span', 'beos-file-icon', row, '▤');
          const name = util.el('strong', '', row, record.file);
          util.el('span', 'beos-file-size', row, '1.2 MB');
          util.el('span', 'beos-file-type', row, 'Document file');
          P.cardDecorated(ctx, name, 'attachment', record);
          P.button(ctx, row, 'Open', 'open-file');
          util.el('button', 'sp-btn', row, 'Save As…').type = 'button';
          util.el('button', 'sp-btn', row, 'View Info…').type = 'button';
          if (model.done.includes(record.id)) row.classList.add('opened');
        };
      },
    },
  },
});
