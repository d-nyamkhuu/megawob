// Adds this design's portrait treatments, heart icon, scroll restoration, and open-menu positioning.
(function () {
  'use strict';
  env.widget({
    task: 'use-social-feed',
    site: 'design-use-social-feed-menu-10',
    name: 'design',
    split: 'train',
    scenarios: ['menu'],
    template: 'use-social-feed/feed',
    design: {
      icons: {
        like: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
      },
      scrollSet: 'model',
      menuPlace: 'always',
      parts: {
        avatar: (base) => (R, row, post, ...args) => {
          const av = base(R, row, post, ...args);
          av.classList.add('as-portrait');
          av.style.setProperty('--portrait-x', R.handles.indexOf(post.handle) % 2 ? '50%' : '0%');
          return av;
        },
        photoTile: (base) => (R, ph, post, k, n, ...args) => {
          base(R, ph, post, k, n, ...args);
          ph.classList.add('as-photograph');
          ph.style.setProperty('--photo-x', /coffee|book|tea/i.test(post.text) ? '50%' : /cat|pet/i.test(post.text) ? '100%' : '0%');
        },
      },
    },
  });
})();
