// IRIX mail with a card background, root-level search, empty-message art and taller rows.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-nl-09',
    name: 'design',
    split: 'train',
    scenarios: ['nl'],
    template: 'use-email/mail',
    design: {
      rowHeight: 88,
      rowBasis: 'root',
      searchIn: 'root',
      searchPlaceholder: 'Search mail',
      parts: {
        rootDecor: (base, S) => (...args) => {
          S.el('div', 'card-bg', S.els.root);
          base(...args);
        },
        searchInput: (base, S) => (searchline) => {
          const search = base(searchline);
          const sortPill = S.el('div', 'sort-pill', S.els.root, 'Newest first');
          sortPill.insertAdjacentHTML(
            'beforeend',
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 9 4-4 4 4M8 15l4 4 4-4"/></svg>',
          );
          return search;
        },
        panel: (base, S) => (cls, title) => {
          const panel = base(cls, title);
          if (cls === 'document') {
            const emptyState = S.el('div', 'empty-state', panel);
            S.el('div', 'empty-circle', emptyState).innerHTML =
              '<svg viewBox="0 0 60 48" aria-hidden="true"><defs><linearGradient id="empty-envelope" x2="0" y2="1"><stop stop-color="#bfbfd2"/><stop offset="1" stop-color="#a9a9c1"/></linearGradient></defs><rect x="2" y="3" width="56" height="42" rx="7" fill="url(#empty-envelope)" stroke="none"/><path d="m7 11 19 14q4 3 8 0l19-14" fill="none" stroke="#f8f8ff" stroke-width="4"/></svg>';
            S.el('strong', '', emptyState, 'No message selected');
            S.el('span', '', emptyState, 'Choose a message from the list to read it here.');
          }
          return panel;
        },
        listSized: (base, S) => (m, order, rowH, avail) => {
          base(m, order, rowH, avail);
          S.els.track.style.opacity = order.length > S.spec.rows ? '1' : '0';
        },
      },
    },
  });
})();
