// Pixel styled mail design with its own layout tokens and footer action targeting.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-nl-12',
    name: 'design',
    split: 'train',
    scenarios: ['nl'],
    template: 'use-email/mail',
    design: {
      style: 'pixel',
      decor: null,
      stack: true,
      rowHeight: 74,
      folderList: ['inbox', 'sent', 'drafts', 'archive', 'spam', 'trash'],
      parts: {
        locateAction: (base, S) => (t) => {
          if (t.action && ['reply', 'forward', 'delete'].includes(t.action)) {
            return S.center(
              [...document.querySelectorAll('.footer-real-tools button')].find(
                (b) => b.textContent.toLowerCase() === t.action,
              ),
            );
          }
          return base(t);
        },
      },
    },
  });
})();
