// Portrait avatars, compact post text, fixed action labels, and feed activity statistics.
(function () {
  'use strict';

  env.widget({
    task: 'use-social-feed',
    site: 'design-use-social-feed-all-08',
    name: 'design',
    split: 'train',
    scenarios: ['all'],
    template: 'use-social-feed/feed',
    design: {
      icons: {
        reply: '<path d="M2 11c0-5 4-9 10-9s10 4 10 9-4 9-10 9c-1.5 0-3-.2-4-.7L2 22l1.8-6C2.6 14.6 2 13 2 11z"/>',
        retweet: '<path d="M10 4h8a3 3 0 0 1 3 3v13m-4-4 4 4 3-4M14 20H6a3 3 0 0 1-3-3V4m-3 4 3-4 4 4"/>',
        like: '<path d="M12 22S1 15.7 1 8.5A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 11 2.5C23 15.7 12 22 12 22z"/>',
      },
      scenarioDecor: false,
      parts: {
        avatar: (base) => (R, row, post, ...args) => {
          const av = base(R, row, post, ...args);
          av.classList.add('portrait');
          av.style.backgroundPosition = '3.254% ' + ['37.255%', '51.096%', '79.123%'][R.handles.indexOf(post.handle) % 3];
          return av;
        },
        text: (base, S) => (R, main, post, p, m, parts) => {
          const tx = R.util.el('div', 'as-text', main);
          parts.text = tx;
          const copy = R.util.el('span', 'as-copy', tx);
          tx.classList.toggle('expanded', m.expanded.includes(p));
          if (post.short && !m.expanded.includes(p)) {
            S.richText(R.util, copy, post.short);
            const sm = R.util.el('span', 'as-showmore', tx, 'Show more');
            sm.dataset.role = 'showmore';
            sm.addEventListener('click', () => { R.up({ expand: p }); R.paint(); });
            parts.showmore = sm;
          } else S.richText(R.util, copy, post.text);
        },
        actLabel: () => (R, btn, b, p, post, parts) => {
          if (b === 'retweet' || b === 'share') R.util.el('span', 'lbl', btn, R.F.helpers.LABELS[b]);
          if (b !== 'share') parts.counts[b] = R.util.el('span', 'cnt', btn);
        },
        restoreScroll: () => (R, B, m, keep, first) => {
          const initialScroll = first ? Math.max(0, Math.min(1, Number(m.scroll) || 0)) : 0;
          B.feed.scrollTop = first ? initialScroll * Math.max(0, B.feed.scrollHeight - B.feed.clientHeight) : keep;
          B.lbx.set({});
        },
        synced: () => (R, m) => {
          const side = document.querySelector('.bz-side');
          if (side) {
            side.querySelector('.bz-prog span').textContent = m.on.length;
            const fields = side.querySelectorAll('.bz-field');
            fields[1].querySelector('strong').textContent = R.spec.posts.length;
            fields[2].querySelector('strong').textContent = m.on.length;
            const activePosts = R.spec.posts.filter((p, i) =>
              R.F.helpers.BUTTONS.some((b) => m.on.includes(R.F.helpers.keyOf(i, b))),
            ).length;
            side.querySelector('.bz-bar').style.setProperty('--progress', `${R.spec.posts.length ? (activePosts / R.spec.posts.length) * 100 : 0}%`);
          }
          R.head.classList.toggle('required-tabs', R.live);
          R.fd.track.classList.toggle('required-scroll', R.fd.feed.scrollHeight > R.fd.feed.clientHeight + 1);
        },
      },
    },
  });
})();
