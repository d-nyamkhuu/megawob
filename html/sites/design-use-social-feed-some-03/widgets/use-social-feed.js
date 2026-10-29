// Preserve this site's operational tabs, fixed Reply control, and row-based start scroll.
(function () {
  'use strict';
  env.widget({
    task: 'use-social-feed',
    site: 'design-use-social-feed-some-03',
    name: 'design',
    split: 'train',
    scenarios: ['some'],
    template: 'use-social-feed/feed',
    design: {
      scenarioDecor: false,
      parts: {
        header: (base) => (R) => {
          base(R);
          R.head.classList.toggle('operational', R.live);
        },
        actions: (base) => (R, main, post, p, parts, row) => {
          const acts = base(R, main, post, p, parts, row);
          // The checkbox is always Reply, regardless of the episode's goal.
          for (const [b, btn] of Object.entries(parts.acts)) btn.classList.toggle('primary-action', b === 'reply');
          return acts;
        },
        scrollbar: (base) => (R) => {
          const { util, box } = R;
          const track = util.el('div', 'as-track', box);
          track.dataset.role = 'scrollbar';
          const range = util.el('div', 'as-scroll-range', track);
          const thumb = util.el('div', 'as-thumb', range);
          thumb.dataset.role = 'thumb';
          for (const [direction, label] of [[-1, 'Scroll up'], [1, 'Scroll down']]) {
            const arrow = util.el('button', `as-scroll-arrow ${direction < 0 ? 'up' : 'down'}`, track);
            arrow.type = 'button';
            arrow.setAttribute('aria-label', label);
            arrow.addEventListener('pointerdown', (event) => event.stopPropagation());
            arrow.addEventListener('click', (event) => {
              event.stopPropagation();
              R.fd.feed.scrollTop += direction * Math.max(40, R.fd.feed.clientHeight / 8);
              R.fd.lbx.set({});
              R.report();
            });
          }
          return { track, thumb, host: range, pad: 2 };
        },
        restoreScroll: (base) => (R, B, m, keep, first) => {
          B.feed.scrollTop = keep;
          if (first && m.scroll > 0) {
            const items = [...B.rows.values()];
            if (items.length) {
              const index = Math.min(Math.floor(m.scroll), items.length - 1);
              const row = items[index];
              const height = items[index + 1] ? items[index + 1].offsetTop - row.offsetTop : row.offsetHeight;
              B.feed.scrollTop = row.offsetTop - items[0].offsetTop + (m.scroll - index) * height;
            }
          }
          B.lbx.set({});
        },
      },
    },
  });
})();
