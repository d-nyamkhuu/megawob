// Design of this site on the use-social-feed/feed template (templates/use-social-feed/feed.js): the reference app (rail,
// timeline column, sidebar) with its own rail (tagline, "All Posts" highlighted, communities, settings), portrait
// avatars cut from a materials sheet and a task progress panel in the site's frame.
(function () {
  'use strict';
  env.widget({
    task: 'use-social-feed',
    site: 'design-use-social-feed-all-06',
    name: 'design',
    split: 'train',
    scenarios: ['all'],
    template: 'use-social-feed/feed',
    design: {
      scenarioDecor: false,
      icons: {
        reply: '<path d="M10 4L2 12l8 7v-5c5-1 8 1 12 6-1-8-5-11-12-11z" fill="currentColor"/>',
        chat: '<path d="M3.5 11.5c0-4 3.6-7 8.5-7s8.5 3 8.5 7-3.6 7-8.5 7c-1 0-2-.1-2.9-.4L5 20l1-3.6c-1.6-1.3-2.5-3-2.5-4.9z"/>',
        people: '<circle cx="12" cy="6" r="3"/><circle cx="4" cy="9" r="2.5"/><circle cx="20" cy="9" r="2.5"/><path d="M7 21v-5a5 5 0 0 1 10 0v5zM2 19v-4a3 3 0 0 1 4-3M22 19v-4a3 3 0 0 0-4-3"/>',
        settings: '<path d="M9 2h6l1 4 4 1 2 5-3 3 1 4-5 3-3-3-4 1-3-5 3-3-1-4 4-1z"/><circle cx="12" cy="12" r="3" fill="var(--panel)"/>',
        leaf: '<path d="M12 23V5M12 13C4 12 4 6 4 6c7 0 8 7 8 7zM12 17c8-1 8-7 8-7-7 0-8 7-8 7zM12 9C6 5 12 0 12 0s6 5 0 9z"/>',
      },
      nav: [['home', 'Home'], ['explore', 'All Posts', 'chat'], ['bell', 'Mentions'], ['mail', 'Messages'], ['bookmark', 'Saved'],
        ['communities', 'Communities', 'people'], ['user', 'Profile'], ['settings', 'Settings']],
      navOn: 1,
      parts: {
        logo: (base, S) => (R, r) => {
          R.util.el('div', 'as-logo', r).innerHTML = S.svg(S.ICON.leaf).replace('<svg ', '<svg preserveAspectRatio="none" ');
          R.util.el('div', 'as-tagline', r, 'People. Places. Conversations.');
        },
        // The mentions entry shows an @ sign where the notification bell would be (its badge is still sampled).
        navItem: (base) => (R, r, entry, i) => {
          base(R, r, entry, i);
          if (entry[0] === 'bell') r.lastElementChild.querySelector('i').innerHTML = '<span class="mention-icon">@</span>';
        },
        headed: () => (R) => {
          if (!R.live) R.util.el('div', 'as-sort', R.head, 'Most Recent  ▾');
        },
        avatar: (base) => (R, row, post, p, m) => {
          const av = base(R, row, post, p, m);
          av.classList.add('portrait');
          const photos = [[349, 109], [349, 249], [349, 389], [349, 530], [349, 672], [349, 809]];
          const photo = photos[p % photos.length];
          av.style.backgroundImage = 'url(sites/design-use-social-feed-all-06/assets/materials.webp)';
          av.style.backgroundSize = '2171.43% 1222.08%';
          av.style.backgroundPosition = (photo[0] / 1595 * 100) + '% ' + (photo[1] / 864 * 100) + '%';
          return av;
        },
        actLabel: (base) => (R, btn, b, p, post, parts) => {
          base(R, btn, b, p, post, parts);
          btn.dataset.caption = b === 'retweet' ? 'Repost' : R.F.helpers.LABELS[b];
        },
        actsMade: () => (R, acts, post, p, parts) => acts.append(parts.more),
        // The first build must reflect scene / partial / wrong starts, too. Scroll is a fractional row index,
        // matching listbox.scrollIndex(), not a pixel offset.
        restoreScroll: () => (R, B, m, keep, first) => {
          const { feed, rows, lbx } = B;
          if (first && m.scroll > 0 && rows.size) {
            const elements = [...rows.values()];
            const index = Math.min(Math.floor(m.scroll), elements.length - 1);
            const top = elements[0].getBoundingClientRect();
            const row = elements[index].getBoundingClientRect();
            const next = elements[index + 1]?.getBoundingClientRect();
            feed.scrollTop = row.top - top.top + (m.scroll - index) * (next ? next.top - row.top : row.height);
          } else feed.scrollTop = keep;
          lbx.set({});
        },
        // Show current button state across the whole feed, independent of the goal.
        paintStart: () => (R, m) => {
          const progress = document.querySelector('.progress-value');
          if (progress) progress.textContent = `${m.on.length} active`;
          const total = R.spec.posts.length * R.F.helpers.BUTTONS.length;
          const bar = document.querySelector('.progress-fill');
          if (bar) bar.style.width = (total ? m.on.length / total * 100 : 0) + '%';
        },
      },
    },
  });
})();
