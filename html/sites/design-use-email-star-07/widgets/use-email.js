// QuickMail keeps the star layout and adds its pen icon and two working toolbar actions.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-star-07',
    name: 'design',
    split: 'train',
    scenarios: ['star'],
    template: 'use-email/mail',
    design: {
      rowHeight: 61,
      newLabel: 'Compose',
      parts: {
        icon: (base) => (k) =>
          k === 'new'
            ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 16 11-12 5 5-11 12-6 2z M13 6l5 5 M4 16l5 5" fill="currentColor" stroke-width="1"/></svg>'
            : base(k),
        toolbarMade: (base, S) => () => {
          base();
          const { toolbar } = S.els;
          S.button(toolbar, 'Archive', 'toolbar:archive', () => S.action('archive', S.ctx.model.open ?? 0), 'archive');
          S.button(toolbar, 'Mark as read', 'toolbar:read', () => ({ mark: [[S.ctx.model.open ?? 0], false] }), 'mail');
        },
      },
    },
  });
})();
