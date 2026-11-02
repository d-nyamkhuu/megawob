// Office ribbon scenario with photo-file avatars, fixed action labels, and 2008 post times.
(function () {
  'use strict';

  const PHOTO_URL = new URL('../assets/reference-photos.webp', document.currentScript.src).href;

  env.widget({
    task: 'use-social-feed',
    site: 'design-use-social-feed-one-07',
    name: 'design',
    split: 'train',
    scenarios: ['one'],
    traits: { simpleFeed: true },
    template: 'use-social-feed/feed',
    design: {
      labels: true,
      avatarSheet: null,
      scrollSet: 'first',
      icons: {
        reply: '<path d="M2 12L12 4v5c8 0 12 5 10 12-2-5-5-6-10-6v5z" fill="currentColor" stroke="none"/>',
        retweet: '<path d="M1 9l6-6 6 6H9v8h5v3H6V9zM10 4h8v11h5l-6 6-6-6h4V7h-5z" fill="currentColor" stroke="none"/>',
        like: '<path d="M12 22S1 15 1 8A6 6 0 0 1 12 5 6 6 0 0 1 23 8c0 7-11 14-11 14z" fill="currentColor" stroke="none"/>',
      },
      parts: {
        avatar: (base, S) => (R, row, post) => {
          const av = R.util.el('div', 'as-av', row, S.initials(post.name));
          av.textContent = '';
          const tile = R.handles.indexOf(post.handle) % 3;
          av.style.backgroundImage = `url(${new URL(`avatar-${tile}.webp`, PHOTO_URL).href})`;
          av.style.backgroundSize = 'cover';
          av.style.backgroundPosition = 'center';
          av.title = post.name;
          return av;
        },
        timeText: () => (R, post) => {
          const age = parseInt(post.time, 10) || 0;
          const minutes = 600 - age * (post.time.includes('h') ? 60 : 1);
          const hour = Math.floor(((minutes % 1440) + 1440) % 1440 / 60);
          return `Apr 14, 2008  ${hour % 12 || 12}:${String(((minutes % 60) + 60) % 60).padStart(2, '0')} ${hour < 12 ? 'AM' : 'PM'}`;
        },
      },
    },
  });
})();
