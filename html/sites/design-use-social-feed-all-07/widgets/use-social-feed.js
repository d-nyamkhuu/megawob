// This design uses noticeboard icons and labeled actions, with the expanded-post and scroll behavior from this site.
(function () {
  'use strict';
  env.widget({
    task: 'use-social-feed',
    site: 'design-use-social-feed-all-07',
    name: 'design',
    split: 'train',
    scenarios: ['all'],
    template: 'use-social-feed/feed',
    design: {
      scenarioDecor: false,
      labels: true,
      actLabels: { reply: 'Comment' },
      timeFormat: 'plain',
      icons: {
        reply: '<path d="M3 3h18v15H9l-6 5V3z"/>',
        like: '<path d="M12 21S1.5 14.3 1.5 7.8A5.6 5.6 0 0 1 12 5.4a5.6 5.6 0 0 1 10.5 2.4C22.5 14.3 12 21 12 21z"/>',
        share: '<path d="M13 6H3v15h18v-9"/><path d="M10 13c0-6 4-8 11-8M17 1l4 4-4 4"/>',
      },
      parts: {
        // Keep the original per-episode label draw in its original position before the other render draws.
        frame: (base) => (R) => {
          base(R);
          R.rng.bool(0.3);
        },
        postRow: (base) => (R, feed, p, post, m) => {
          const row = base(R, feed, p, post, m);
          row.classList.toggle('expanded', m.expanded.includes(p));
          return row;
        },
        text: (base) => (R, main, post, p, m, parts, row) => {
          base(R, main, post, p, m, parts, row);
          parts.text.title = post.text;
        },
      },
    },
  });
})();
