// CityMail: compact mailbox rows, labeled message metadata and a reply editor with title-bar Cancel.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-reply-10',
    name: 'design',
    split: 'train',
    scenarios: ['reply'],
    template: 'use-email/mail',
    design: {
      rowHeight: 41,
      replyTitle: 'Reply',
      replyNamed: false,
      parts: {
        listStart: (base, S) => (m, order) => {
          base(m, order);
          S.els.listWrap.classList.toggle('mailbox-scrollable', order.length > S.spec.rows);
        },
        docMeta: (base, S) => (meta, e) => {
          for (const [lab, val] of [
            ['From:', e.name + ' <' + e.addr + '>'],
            ['To:', S.spec.me.name + S.cc(e)],
            ['Subject:', e.subject],
            ['Date:', e.time],
          ]) {
            const r = S.el('div', 'meta-row', meta);
            S.el('span', 'meta-lab', r, lab);
            S.el('span', 'meta-val', r, val);
          }
        },
        editorFields: (base, S) => (group, shown) => {
          base(group, shown);
          S.button(S.els.editor.querySelector('.window-title'), 'Cancel', 'compose:discard', { discard: true }, null, 'cancel-compose');
        },
        cancelButton: (base, S) => (acts) => {
          S.el('button', '', acts, 'Attach...').type = 'button';
          S.el('button', '', acts, 'Save Draft').type = 'button';
        },
      },
    },
  });
})();
