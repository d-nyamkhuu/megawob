// CD-ROM WorldView design: overrides the mail palette, list density and tabs.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-star-reply-02',
    name: 'design',
    split: 'train',
    scenarios: ['star-reply'],
    template: 'use-email/mail',
    design: {
      style: 'cdrom',
      rowHeight: 51,
      stack: false,
      parts: {
        snapped: (base, S) => () => {
          base();
          const tabs = S.el('div', 'mail-tabs', S.els.root);
          for (const label of ['Mail', 'Address Book', 'Calendar', 'Preferences']) S.el('span', '', tabs, label);
        },
      },
    },
  });
})();
