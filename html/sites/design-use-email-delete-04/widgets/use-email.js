// Classic Mac mail with a filled trash icon, read/unread buttons, and stage-scaled rows.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-delete-04',
    name: 'design',
    split: 'train',
    scenarios: ['delete'],
    template: 'use-email/mail',
    design: {
      rowHeight: 46,
      rowBasis: 'size',
      ledgerTitle: 'Mail',
      newLabel: 'Compose',
      toolbarAfter: [['Mark as Read', null], ['Mark as Unread', null]],
      searchPlaceholder: 'Search mail...',
      parts: {
        icon: (base) => (k) =>
          k === 'delete'
            ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" stroke="none" d="M9 2h6v2h5v3H4V4h5V2zm-3 6h12l-1 14H7L6 8z"/><path stroke="white" stroke-width="1" d="M9 10v9m3-9v9m3-9v9"/></svg>'
            : base(k),
        occupiedKeep: (base, S) => (v) => base(v) && v !== S.els.listStatus,
        availHeight: (base, S) => (occupied) => Math.max(40, S.els.ledger.clientHeight - occupied - 2),
      },
    },
  });
})();
