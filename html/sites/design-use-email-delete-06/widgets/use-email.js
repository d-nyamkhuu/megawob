// Plain mail design with tall rows and a custom trash can.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-delete-06',
    name: 'design',
    split: 'train',
    scenarios: ['delete'],
    template: 'use-email/mail',
    design: {
      rowHeight: 72,
      rowBasis: 'root',
      newLabel: 'Compose',
      parts: {
        icon: (base) => (k) =>
          k === 'delete'
            ? '<svg class="trash-can" viewBox="0 0 32 44" aria-hidden="true"><path d="M5 12h22l-2 28H7z" fill="#999"/><path d="M3 7h26v5H3z M11 7V2h10v5" fill="#eee"/><path d="M10 16l1 20 M16 16v20 M22 16l-1 20" stroke="#eee" stroke-width="1.6"/></svg>'
            : base(k),
        listStart: (base, S) => (m, order) => {
          base(m, order);
          S.els.root.classList.toggle('scroll-needed', order.length > S.spec.rows);
        },
      },
    },
  });
})();
