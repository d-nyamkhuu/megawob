// Work Mail with compact rows, folder links, tabular message metadata and a forwarded-message header.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-forward-08',
    name: 'design',
    split: 'train',
    scenarios: ['forward'],
    template: 'use-email/mail',
    design: {
      rowHeight: 34.5,
      folderList: ['inbox', 'sent', 'drafts', 'trash'],
      foldersTitle: 'Mail Folders',
      contactsTitle: 'Address Book',
      forwardTitle: 'Forward Message',
      fieldLabels: [['to', 'To:'], ['cc', 'Cc:'], ['subject', 'Subject:']],
      parts: {
        contactsMade: (base, S) => () => {
          base();
          const { el } = S;
          const { contact } = S.els;
          el('div', 'fsep', contact);
          el('span', 'flink', contact, 'Add Contact');
          el('div', 'window-title ptitle', contact, 'Quick Links');
          for (const t of ['Weather', 'News', 'Sports', 'Stocks', 'Maps', 'Horoscopes'])
            el('span', 'flink', contact, t);
        },
        paintFolders: (base, S) => (m) => {
          base(m);
          const inbox = S.els.folderButtons.get('inbox');
          inbox.querySelector('span').textContent = 'Inbox (' + m.box.filter(x => x === 'inbox').length + ')';
        },
        foldersMade: (base, S) => () => {
          base();
          const { el } = S;
          const { folders } = S.els;
          el('div', 'fsep', folders);
          for (const t of ['Address Book', 'Options', 'Sign Out']) el('span', 'flink', folders, t);
          el('div', 'window-title ptitle', folders, 'People Search');
          const pf = el('div', 'pform', folders);
          el('input', '', pf).type = 'text';
          el('span', '', pf, 'Go');
          for (const t of ['Find People', 'Classmates', 'Business']) el('span', 'flink', folders, t);
        },
        docMeta: (base, S) => (meta, e) => {
          const mrow = (l, v) => {
            const d = S.el('div', 'mrow', meta);
            S.el('b', '', d, l);
            S.el('span', '', d, v);
          };
          mrow('From:', e.name + ' <' + e.addr + '>');
          mrow('To:', S.spec.me.name + S.cc(e));
          mrow('Date:', e.time);
          mrow('Subject:', e.subject);
        },
        editorRowMade: (base, S) => (row, k, inp, shown) => {
          base(row, k, inp, shown);
          if (k === 'to') S.el('span', 'abook', row, 'Add from Address Book');
        },
        editorBody: (base, S) => (shown) => {
          const bodyBox = S.el('div', 'forward-content', S.els.editor);
          if (shown.mode === 'forward') {
            const original = S.spec.emails[shown.of ?? 0];
            S.el(
              'div',
              'forward-header',
              bodyBox,
              '-------- Forwarded message --------\nFrom: ' + original.name + ' <' + original.addr +
                '>\nDate: ' + original.time + '\nSubject: ' + original.subject,
            );
          }
          const area = S.el('textarea', '', bodyBox);
          area.placeholder = shown.mode === 'forward' ? 'Forwarded message' : 'Write your reply…';
          area.spellcheck = false;
          S.els.fields.body = env.ui.textField(area, {
            value: shown.body || '',
            label: 'body',
            onInput: v => S.field('body', v),
          });
          S.els.reg.set('field:body', area);
          return area;
        },
        cancelMade: (base, S) => (acts, shown) => {
          base(acts, shown);
          S.button(acts, 'Save Draft', null, null, null, 'draft');
        },
      },
    },
  });
})();
