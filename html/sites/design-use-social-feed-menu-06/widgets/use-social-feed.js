// Adds editorial imagery, a Latest tab, and the original menu and scene-scroll behavior.
env.widget({
  task: 'use-social-feed',
  site: 'design-use-social-feed-menu-06',
  name: 'design',
  split: 'train',
  scenarios: ['menu'],
  template: 'use-social-feed/feed',
  design: {
    icons: {
      like: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
    },
    timeFormat: 'plain',
    menuPlace: 'always',
    parts: {
      headed: () => (R) => {
        R.util.el('div', 'as-tab as-latest', R.head, 'Latest');
      },
      avatar: (base) => (R, row, post, p, m) => {
        const av = base(R, row, post, p, m);
        const visualIndex = R.F.helpers.feedOf(R.spec, m).indexOf(p);
        row.dataset.visual = String(visualIndex % 3);
        av.style.backgroundImage = `url(sites/design-use-social-feed-menu-06/assets/portrait-${visualIndex % 3}.webp)`;
        return av;
      },
      afterMedia: () => (R, main, post, p, parts, row, m) => {
        const visualIndex = R.F.helpers.feedOf(R.spec, m).indexOf(p);
        const visual = R.util.el('div', 'as-editorial-photo', main);
        visual.setAttribute('aria-hidden', 'true');
        visual.style.backgroundImage = `url(sites/design-use-social-feed-menu-06/assets/${['mountains', 'coffee', 'autumn'][visualIndex % 3]}.webp)`;
      },
      menuKeys: () => (R) => {
        const menuSequence = ['report', 'hide', 'mute', 'block', 'copy', 'dm', 'embed'];
        return R.order.slice().sort((a, b) => menuSequence.indexOf(a) - menuSequence.indexOf(b));
      },
      rowsBuilt: (base) => (R, B, m) => {
        base(R, B, m);
        const { feed, rows } = B;
        for (const row of rows.values()) {
          const photo = row.querySelector('.as-editorial-photo');
          if (!photo) continue;
          const limit = Math.floor(feed.clientHeight * 0.75) - 8;
          const excess = row.getBoundingClientRect().height - limit;
          if (excess > 0) photo.style.height = Math.max(0, photo.offsetHeight - Math.ceil(excess)) + 'px';
          const linkImage = row.querySelector('.as-link-img');
          const remaining = row.getBoundingClientRect().height - limit;
          if (linkImage && remaining > 0) {
            linkImage.style.minHeight = '0';
            linkImage.style.height = Math.max(0, linkImage.offsetHeight - Math.ceil(remaining)) + 'px';
          }
        }
      },
      restoreScroll: () => (R, B, m, keep, first) => {
        B.feed.scrollTop = keep;
        B.lbx.set(first ? { scroll: m.scroll } : {});
      },
    },
  },
});
