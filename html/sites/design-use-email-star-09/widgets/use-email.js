// QuickMail design: adds the header treatment and workspace links to the shared star mailbox.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-star-09',
    name: 'design',
    split: 'train',
    scenarios: ['star'],
    template: 'use-email/mail',
    design: {
      rowHeight: 91,
      folderLabels: {
        inbox: 'Mail',
        sent: 'Sent',
        drafts: 'Drafts',
        junk: 'Junk',
        spam: 'Spam',
        templates: 'Templates',
        compose: 'Compose',
      },
      paths: {
        mail: 'M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z M3 5l9 7 9-7',
        search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z M20 20l-4-4',
        pencil: 'M4 20l1-4L16 5l3 3L8 19z M14 7l3 3',
        calendar: 'M5 5h14a2 2 0 0 1 2 2v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a2 2 0 0 1 2-2z M3 10h18 M8 2v6 M16 2v6',
        notes: 'M6 3h12a2 2 0 0 1 2 2v10l-6 6H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z M8 8h8 M8 12h5 M14 21v-5a1 1 0 0 1 1-1h5',
        settings: 'M9 3.5 10 2h4l1 1.5v2l2 1 1.7-.9 1.8.8 1.5 2.6-.4 1.9-1.7 1v2l1.7 1 .4 1.9-1.5 2.6-1.8.8-1.7-.9-2 1v2L14 22h-4l-1-1.5v-2l-2-1-1.7.9-1.8-.8L2 15l.4-1.9 1.7-1v-2l-1.7-1L2 7.2l1.5-2.6 1.8-.8L7 4.7l2-1z M15.5 12a3.5 3.5 0 1 0-7 0 3.5 3.5 0 0 0 7 0',
      },
      parts: {
        toolbarMade: (base, S) => () => {
          const title = S.els.ledger.querySelector('.window-title');
          S.el('span', 'h-mail', title, 'Mail');
          const search = S.el('span', 'h-search', title);
          search.innerHTML = S.P.icon('search') + '<i>Search mail</i>';
          const compose = S.el('span', 'h-compose', title);
          compose.innerHTML = S.P.icon('pencil');
          S.el('span', 'h-compose-label', title, 'Compose');
          ['Inbox', 'Sent', 'Drafts', 'Archive'].forEach((label, i) =>
            S.el('span', 'h-tab h-tab' + i, title, label),
          );
          S.el('span', 'h-tab-line', title);
        },
        folderMade: (base, S) => (v, button) => {
          if (v === 'inbox') button.querySelector('svg').outerHTML = S.P.icon('mail');
        },
        foldersMade: (base, S) => () => {
          const nav = S.el('div', 'workspace-nav', S.els.folders);
          for (const [label, icon] of [
            ['Calendar', 'calendar'],
            ['Notes', 'notes'],
            ['Settings', 'settings'],
          ]) {
            const button = S.button(nav, label, null, null, icon, 'folder');
            button.addEventListener('click', () => env.log('decoy', { label }));
          }
          S.els.folderButtons.get('inbox').after(nav);
        },
      },
    },
  });
})();
