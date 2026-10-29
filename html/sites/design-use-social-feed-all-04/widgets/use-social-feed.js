// Noticeboard artwork, live filter tabs, and labeled repost controls.
(function () {
  'use strict';

  const ICONS = {
    like: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
    retweet: '<path d="M5 14V5h14M15 1l4 4-4 4M19 10v9H5M9 15l-4 4 4 4" stroke-width="2.2"/>',
  };

  env.widget({
    task: 'use-social-feed',
    site: 'design-use-social-feed-all-04',
    name: 'design',
    split: 'train',
    scenarios: ['all'],
    template: 'use-social-feed/feed',
    design: {
      scenarioDecor: false,
      title: 'Home',
      icons: ICONS,
      actLabels: { retweet: 'Repost' },
      timeFormat: 'plain',
      parts: {
        page: (base) => (R) => {
          const page = base(R);
          R.x.artworkOf = (handle) => R.util.hash32(handle) % 3;
          return page;
        },
        header: (base) => (R) => {
          base(R);
          if (R.live) {
            const filter = document.querySelector('.mw-sel span');
            if (filter) filter.replaceChildren(...Object.values(R.tabEls));
          }
        },
        rowMade: (base) => (R, row, post) => {
          base(R, row, post);
          row.classList.toggle('mountain-post', R.x.artworkOf(post.handle) === 2);
        },
        avatar: (base) => (R, row, post, ...args) => {
          const av = base(R, row, post, ...args);
          const tiles = [[27, 240], [27, 370], [27, 633]];
          const [x, y] = tiles[R.x.artworkOf(post.handle)];
          av.classList.add('motif-art');
          av.textContent = '';
          av.style.setProperty('--art-x', x);
          av.style.setProperty('--art-y', y);
          return av;
        },
        media: (base) => (R, host, post, p) => {
          const media = R.util.el('div', 'as-media', host);
          const illustration = R.util.el('div', 'as-illustration', media);
          const idx = R.x.artworkOf(post.handle) === 0 && p % 2 === 0 ? 3 : R.x.artworkOf(post.handle);
          const photos = [[109, 284], [109, 417], [109, 677], [109, 547]];
          const [x, y] = photos[idx];
          illustration.classList.add('motif-art');
          illustration.textContent = '';
          illustration.style.setProperty('--art-x', x);
          illustration.style.setProperty('--art-y', y);
          if (idx === 2) illustration.style.setProperty('--photo-height', '56px');
          else illustration.style.setProperty('--photo-height', '64px');
          illustration.setAttribute('aria-hidden', 'true');
          base(R, media, post, p);
        },
        actLabel: () => (R, btn, b) => {
          R.util.el('span', '', btn, b === 'retweet' ? 'Repost' : R.F.helpers.LABELS[b]);
        },
        restoreScroll: () => (R, B, m, keep) => {
          B.feed.scrollTop = keep;
          B.lbx.set({});
        },
        paintEnd: (base) => (R, m) => {
          base(R, m);
          const submit = document.querySelector('.end-control');
          if (submit) submit.classList.toggle('ready', m.on.length !== R.spec.start.length || m.on.some((k) => !R.spec.start.includes(k)));
          const status = document.querySelectorAll('.mw-status span');
          const visiblePosts = R.F.helpers.feedOf(R.spec, m);
          const authors = new Set(visiblePosts.map((p) => R.spec.posts[p].handle)).size;
          if (status.length === 3) {
            status[0].textContent = `${visiblePosts.length} posts shown`;
            status[1].textContent = `${authors} authors`;
            status[2].textContent = 'Latest first';
          }
        },
      },
    },
  });
})();
