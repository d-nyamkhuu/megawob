// Restores this site's custom navigation, portraits, timestamps, action captions and scroll behavior.
(function () {
  'use strict';

  env.widget({
    task: 'use-social-feed',
    site: 'design-use-social-feed-menu-09',
    name: 'design',
    split: 'train',
    scenarios: ['menu'],
    template: 'use-social-feed/feed',
    design: {
      icons: {
        retweet: '<path d="M3 8l4-4 4 4M7 4v13h7M21 16l-4 4-4-4M17 20V7h-7"/>',
        like: '<path d="M12 3l2.7 5.7 6.3.9-4.5 4.5 1 6.3-5.5-3-5.5 3 1-6.3L3 9.6l6.3-.9z"/>',
        mentions: '<text x="2" y="20" font-size="25" font-family="Arial" fill="currentColor" stroke="none">@</text>',
        lists: '<path d="M8 5h13M8 12h13M8 19h13" stroke-width="3"/><rect x="2" y="3" width="3" height="4" fill="currentColor" stroke="none"/><rect x="2" y="10" width="3" height="4" fill="currentColor" stroke="none"/><rect x="2" y="17" width="3" height="4" fill="currentColor" stroke="none"/>',
        settings: '<path d="M9 2h6l1 3 3 1 3 3-2 3 1 3-3 3-3-1-3 3-3-1-1-3-3-1-1-4 3-2V6l3-1z" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="3" fill="var(--panel)" stroke="none"/>',
        mail: '<rect x="2" y="4" width="20" height="16" rx="1" fill="currentColor" stroke="none"/><path d="M2 5l10 8L22 5" stroke="#eeece6" stroke-width="1.3"/>',
      },
      nav: [
        ['home', 'Home'],
        ['explore', 'Mentions', 'mentions'],
        ['bell', 'Messages', 'mail'],
        ['bookmark', 'Saved'],
        ['bookmark', 'Lists', 'lists'],
        ['user', 'Profile'],
      ],
      scrollSet: 'model',
      menuPlace: 'always',
      parts: {
        rail: (base, S) => (R, slim) => {
          const { util, rng } = R;
          const r = util.el('nav', 'as-rail' + (slim ? ' slim' : ''), R.page);
          util.el('div', 'as-logo', r).innerHTML = S.svg(S.ICON.logo);
          S.D.nav.forEach(([ic, label, shown], i) => {
            const d = util.el('div', 'as-nav' + (i === S.D.navOn ? ' on' : ''), r);
            const wrap = util.el('i', '', d);
            wrap.innerHTML = S.svg(S.ICON[shown || ic]);
            if (ic === 'bell' && rng.bool(0.7)) util.el('b', 'badge', wrap, String(rng.int(1, 12)));
            util.el('span', '', d, label);
          });
          const settings = util.el('div', 'as-nav', r);
          util.el('i', '', settings).innerHTML = S.svg(S.ICON.settings);
          util.el('span', '', settings, 'Settings');
          util.el('span', '', util.el('div', 'as-postbtn', r), 'Post');
          return slim ? 78 : 230;
        },
        avatar: (base) => (R, row, post, ...args) => {
          const av = base(R, row, post, ...args);
          av.dataset.portrait = String(R.handles.indexOf(post.handle) % 3);
          return av;
        },
        timeText: () => (R, post) => post.time,
        actLabel: (base) => (R, btn, b, p, post, parts) => {
          base(R, btn, b, p, post, parts);
          R.util.el('span', 'as-action-caption', btn, { reply: 'Reply', retweet: 'Retweet', like: 'Favorite', share: 'Share' }[b]);
        },
      },
    },
  });
})();
