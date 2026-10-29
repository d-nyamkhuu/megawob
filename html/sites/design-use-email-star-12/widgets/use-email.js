// Ribbon mail design: add its numbered index and inert Preview command to the shared star widget.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-star-12',
    name: 'design',
    split: 'train',
    scenarios: ['star'],
    template: 'use-email/mail',
    design: {
      style: 'ribbon',
      rowHeight: 51,
      parts: {
        snapped: (base, S) => () => {
          base();
          const index = S.el('div', 'ribbon-index', S.els.root);
          index.textContent = '1\n2\n3\n4\n5\n6\n7\n8\n9';
        },
        toolbarMade: (base, S) => () => {
          base();
          const preview = S.button(S.els.toolbar, 'Preview', null, null, 'mail', 'preview-xtra');
          preview.addEventListener('click', () => env.log('decoy', { label: 'Preview' }));
        },
      },
    },
  });
})();
