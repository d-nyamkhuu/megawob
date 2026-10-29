// This design uses its own navigation icons, reference-scene media, and menu-site feed details.
(function () {
  'use strict';

  env.widget({
    task: 'use-social-feed',
    site: 'design-use-social-feed-menu-05',
    name: 'design',
    split: 'train',
    scenarios: ['menu'],
    template: 'use-social-feed/feed',
    design: {
      nav: [
        ['home', 'Home'],
        ['explore', 'Explore'],
        ['bell', 'Notifications'],
        ['mail', 'Messages'],
        ['bookmark', 'Bookmarks'],
        ['lists', 'Lists'],
        ['settings', 'Settings'],
      ],
      timeFormat: 'plain',
      scrollSet: 'first',
      menuPlace: 'always',
      icons: {
        like: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
        home: '<path d="M2 10L12 1l10 9h-3v12h-5v-8h-4v8H5V10z" fill="currentColor" stroke-width=".6"/>',
        bell: '<path d="M5 17v-7a7 7 0 0 1 14 0v7l2 2H3zM10 22h4M11 2V1h2v1" fill="currentColor" stroke-width=".8"/>',
        mail: '<circle cx="12" cy="6" r="5" fill="currentColor" stroke-width=".6"/><path d="M3 22v-2c0-9 18-9 18 0v2z" fill="currentColor" stroke-width=".6"/>',
        bookmark: '<path d="M5 2h14v21l-7-5-7 5z" fill="currentColor" stroke-width=".6"/>',
        lists: '<circle cx="4" cy="5" r="1.7" fill="currentColor"/><circle cx="4" cy="12" r="1.7" fill="currentColor"/><circle cx="4" cy="19" r="1.7" fill="currentColor"/><path d="M9 5h12M9 12h12M9 19h12"/>',
        settings: '<path d="M9 1h6l1 3 3 1 3 4-2 3 2 3-3 4-3 1-1 3H9l-1-3-3-1-3-4 2-3-2-3 3-4 3-1z" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="4" fill="#32231a" stroke="none"/>',
      },
      parts: {
        avatar: (base, S) => (R, row, post, p) => {
          const av = R.util.el('div', 'as-av', row, S.initials(post.name));
          av.style.background = R.colorOf(post.handle);
          av.classList.add('as-photo-avatar');
          av.style.setProperty('--avatar-x', p % 2 ? '100%' : '0%');
          av.setAttribute('aria-label', post.name);
          av.title = post.name;
          av.innerHTML = `<svg viewBox="479 ${p % 2 ? 684 : 186} 68 68"><image href="sites/design-use-social-feed-menu-05/assets/reference-scene.webp" width="1672" height="941"/></svg>`;
          return av;
        },
        metaText: () => (R, meta, post) => {
          const authorName = R.util.el('span', 'as-name', meta, post.name);
          authorName.title = post.name;
          R.util.el('span', 'as-handle', meta, post.handle);
          R.util.el('span', 'as-time', meta, post.time);
        },
        photoSvg: () => (hue, k, count = 1) => {
          const columns = count > 1 ? 2 : 1;
          const x = 479 + (k % columns) * 484 / columns;
          const y = 309 + (count > 2 && k > 1 ? 138 : 0);
          const h = count > 2 && k > 0 ? 138 : 276;
          return `<svg viewBox="${x} ${y} ${484 / columns} ${h}" preserveAspectRatio="none"><image href="sites/design-use-social-feed-menu-05/assets/reference-scene.webp" width="1672" height="941"/></svg>`;
        },
        inView: (base) => (R, p, row, r, top0, h) => {
          const parts = R.fd.parts.get(p);
          if (!parts.more) return base(R, p, row, r, top0, h);
          // Menu tasks need the trigger and the text expansion control in view.
          // A photograph may continue below the pane without blocking either.
          return [parts.more, parts.showmore].filter(Boolean).every((control) => {
            const box = control.getBoundingClientRect();
            return box.top >= top0 - 0.5 && box.bottom <= top0 + h + 0.5;
          });
        },
      },
    },
  });
})();
