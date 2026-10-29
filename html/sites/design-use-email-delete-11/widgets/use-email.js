// NeXT mail with compact rows, a Mark Read toolbar button, and message inspector fields.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-delete-11',
    name: 'design',
    split: 'train',
    scenarios: ['delete'],
    template: 'use-email/mail',
    design: {
      style: 'next',
      rowHeight: 33,
      folderList: ['inbox', 'starred', 'important', 'archive', 'trash'],
      toolbarAfter: [['Mark Read', 'move']],
      parts: {
        contactsStart: (base, S) => () => {
          const inspector = S.el('div', 'inspector-fields', S.els.contact);
          inspector.innerHTML =
            '<p>From: ' +
            S.spec.emails[0].name +
            '</p><p>Email: ' +
            S.spec.emails[0].addr +
            '</p><hr>Flags:<label><input type=checkbox> Important</label><label><input type=checkbox> Work</label><label><input type=checkbox> Personal</label><label><input type=checkbox> Follow Up</label><hr>Tags:<input type=text value=None><p>Notes:</p><textarea></textarea>';
        },
      },
    },
  });
})();
