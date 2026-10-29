// Thunderbird design: taller rows, custom folder icons, and an explicit list overflow state.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-important-08',
    name: 'design',
    split: 'train',
    scenarios: ['important'],
    template: 'use-email/mail',
    design: {
      rowHeight: 71,
      folderList: ['inbox', 'sent', 'drafts', 'templates', 'junk', 'trash'],
      paths: {
        starred: 'm12 2 3 6.2 7 .9-5 4.8 1.2 7-6.2-3.3-6.2 3.3 1.2-7-5-4.8 7-.9z',
        sent: 'M3 3l18 9-18 9 3-9z M6 12h15',
        drafts: 'M5 2h9l5 5v15H5z M14 2v6h5 M8 13h8 M8 17h8',
        trash: 'M4 6h16 M9 6V3h6v3 M6 6l1 15h10l1-15 M10 10v7 M14 10v7',
        inbox: 'M3 12l5-9h8l5 9v9H3z M5 12l4-7h6l4 7-4 4H9z',
      },
      parts: {
        listStart: (base, S) => (m, order) => {
          base(m, order);
          S.els.track.hidden = order.length <= S.spec.rows;
          S.els.listWrap.classList.toggle('overflowing', order.length > S.spec.rows);
        },
      },
    },
  });
})();
