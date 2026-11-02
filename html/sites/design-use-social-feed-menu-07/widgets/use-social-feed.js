// This design uses the site's sprite avatars, utility-header tabs, and legacy feed scroll behavior.
(function () {
  'use strict';

  env.widget({
    task: 'use-social-feed',
    site: 'design-use-social-feed-menu-07',
    name: 'design',
    split: 'train',
    scenarios: ['menu'],
    template: 'use-social-feed/feed',
    design: {
      timeFormat: 'plain',
      icons: {
        reply: '<path d="M2.5 10.5c0-4.5 4-8 9.5-8s9.5 3.5 9.5 8-4 8-9.5 8l-5 3 .5-4C4.3 16 2.5 14 2.5 10.5z"/>',
        retweet: '<path d="M3 19V5l-3 3M3 5l3 3M3 19h9l-3-3M12 19l-3 3M9 5h11v14l-3-3M20 19l3-3"/>',
        like: '<path d="M12 22S2 15.5 2 8.5A5.5 5.5 0 0 1 12 5 5.5 5.5 0 0 1 22 8.5C22 15.5 12 22 12 22z"/>',
        mute: '<path d="M3 8h5l5-5v18l-5-5H3z"/><path d="M2 22L22 2M18 6l3 3M17 12v5"/>',
      },
      parts: {
        headed: () => (R) => {
          const header = R.ctx.stage.closest('.os-book').querySelector('.os-bookhead');
          // This header survives when the kit rebuilds only the stage.
          header.querySelectorAll('.as-head').forEach((head) => head.remove());
          if (R.live) header.append(R.head);
        },
        avatar: (base, S) => (R, row, post, p, m) => {
          const util = R.util;
          const av = util.el('div', 'as-av', row);
          av.setAttribute('aria-label', post.name);
          const portrait = util.el('span', 'as-portrait', av);
          const positions = ['3.0856% 37.6896%', '3.0856% 56.1260%', '3.0856% 75.0292%', '3.0856% 90.7818%'];
          const visibleHandles = [...new Set(R.F.helpers.feedOf(R.spec, m).map((q) => R.spec.posts[q].handle))];
          portrait.style.backgroundPosition = positions[visibleHandles.indexOf(post.handle) % positions.length];
          av.style.background = R.colorOf(post.handle);
          return av;
        },
        scrollbar: (base) => (R) => ({ ...base(R), pad: 30 }),
        onScroll: () => (R, feed) => {
          if (feed.isConnected && R.fd && R.fd.feed === feed) R.report();
        },
        restoreScroll: () => (R, B, m, keep, first) => {
          B.feed.scrollTop = keep;
          if (first && m.scroll) B.lbx.set({ scroll: m.scroll });
          else B.lbx.set({});
        },
        menuSynced: (base, S) => (R, pt, want) => {
          if (want !== null) S.P.placeMenu(R, pt.panel, pt.more);
        },
        placeMenu: (base) => (R, panel, trigger) => {
          base(R, panel, trigger);
          const actions = R.ctx.stage.closest('.os-book').querySelector('.office-final-actions');
          if (!actions || !actions.children.length) return;
          const menu = panel.getBoundingClientRect();
          const end = actions.getBoundingClientRect();
          if (menu.right <= end.left || menu.left >= end.right || menu.bottom <= end.top || menu.top >= end.bottom) return;
          // The corner end control floats over the feed; treat it as the lower
          // menu boundary whenever the menu would otherwise land behind it.
          const top = Math.max(R.box.getBoundingClientRect().top + 4,
            Math.min(trigger.getBoundingClientRect().top - 4 - menu.height, end.top - menu.height - 4));
          panel.style.top = Math.round(top - R.col.getBoundingClientRect().top) + 'px';
        },
      },
    },
  });
})();
