// Design of this site on the use-email/mail template (templates/use-email/mail.js): a compact mailbox list with a
// Folders menu button that opens the folder popup, a Back button that is always shown, and an inbox icon of its own.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-star-03',
    name: 'design',
    split: 'train',
    scenarios: ['star'],
    template: 'use-email/mail',
    design: {
      rowHeight: 71,
      folderList: ['inbox', 'drafts', 'sent', 'trash', 'spam'],
      folderLabels: { inbox: 'Mail', trash: 'Trash' },
      folderBase: ['compose', 'inbox', 'starred', 'important', 'archive', 'trash'],
      searchPlaceholder: 'Search mail',
      paths: {
        sent: 'M2 10 22 2l-8 20-4-8z M10 14 22 2',
        trash: 'M4 6h16 M9 6V3h6v3 M6 6l1 15h10l1-15 M10 10v7 M14 10v7',
        spam: 'M3 3h9l9 9-9 9-9-9z M7 7h.01',
        star: 'M12 2.4 15.2 8.8 22.3 9.8 17.1 14.8 18.3 21.9 12 18.6 5.7 21.9 6.9 14.8 1.7 9.8 8.8 8.8Z',
        mail: 'M2 4h20v16H2z M2 4l10 8 10-8',
        drafts: 'M3 2h12l6 6v14H3z M15 2v6h6 M7 12h8 M7 16h5 M7 7h2',
      },
      parts: {
        rowHeightPx: (base, S) => (avail) =>
          Math.floor(Math.min(avail / S.spec.rows, Math.max(22, (S.D.rowHeight * S.ctx.size.height) / 941))),
        applyScroll: (base, S) => (m, order) => {
          base(m, order);
          S.els.track.hidden = order.length <= S.spec.rows;
        },
        folderIcon: (base, S) => (v) => (v === 'inbox' ? 'mail' : base(v)),
        foldersMade: (base, S) => () => {
          const { folders } = S.els;
          const folderMenu = S.button(folders, 'Folders', null, null, 'move', 'folder folder-menu');
          folders.insertBefore(folderMenu, folders.querySelector('.extra-folder'));
          folderMenu.addEventListener('click', () => S.navToggle());
          S.els.navTrigger = folderMenu;
        },
        docBack: (base, S) => (tools) => {
          S.button(tools, 'Back to mail', 'back', { back: true }, 'close', 'back-control');
        },
        locateRow: (base, S) => (t) => {
          if (t.row === undefined) return;
          const p = S.els.lbx.locateOption(t.row),
            row = S.els.rowEls.get(t.row)?.r,
            hit = document.elementFromPoint(...p);
          if (row && hit !== row && !row.contains(hit)) return S.center(row);
          return p;
        },
      },
    },
  });
})();
