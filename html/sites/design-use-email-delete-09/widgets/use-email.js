// Mac mail with taller rows, outline reply arrows, and search inside the message panel.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-delete-09',
    name: 'design',
    split: 'train',
    scenarios: ['delete'],
    traits: { fullDate: true },
    template: 'use-email/mail',
    design: {
      rowHeight: 74,
      paths: {
        reply: 'M11 5 4 12l7 7 M4 12h7c6 0 9 2 9 8',
        replyall: 'M8 5 1 12l7 7 M14 5 7 12l7 7 M7 12h7c6 0 9 2 9 8',
        forward: 'M3 12h18 M14 5l7 7-7 7',
      },
      parts: {
        docMade: (base, S) => () => {
          base();
          const { doc, docInside, searchline, search } = S.els;
          doc.insertBefore(searchline, docInside);
          searchline.classList.add('document-search');
          search.placeholder = '';
          const searchIcon = S.el('span', 'search-icon', searchline);
          searchIcon.innerHTML =
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 16l-7 7 M21 9a7 7 0 1 1-14 0 7 7 0 0 1 14 0"/></svg>';
        },
        docMeta: (base, S) => (meta, e, ...args) => {
          base(meta, e, ...args);
          meta.children[1].textContent = e.name;
        },
      },
    },
  });
})();
