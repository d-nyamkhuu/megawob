// Design of this site on the use-social-feed/feed template (templates/use-social-feed/feed.js): a forum thread. Posts show
// the poster's name, member info and a fixed compact Like control, counts in parentheses.
(function () {
  'use strict';
  env.widget({
    task: 'use-social-feed',
    site: 'design-use-social-feed-some-05',
    name: 'design',
    split: 'train',
    scenarios: ['some'],
    traits: { simpleFeed: true },
    template: 'use-social-feed/feed',
    design: {
      scenarioDecor: false,
      scrollSet: 'first',
      timeFormat: 'plain',
      parts: {
        // Like is always the compact row control, independent of the goal. Other actions appear on hover.
        titled: () => (R) => {
          R.x.postCount = R.util.el('span', 'forum-post-count', R.head);
        },
        buildStart: () => (R, m) => {
          R.x.postCount.textContent = R.F.helpers.feedOf(R.spec, m).length + ' posts';
        },
        metaText: () => (R, meta, post) => {
          const { util } = R;
          util.el('span', 'as-name', meta, post.handle.replace(/^@/, ''));
          const member = util.el('span', 'as-handle', meta);
          util.el('span', '', member, 'Member');
          util.el('span', '', member, 'Posts: ' + (post.counts.like || 0));
          util.el('span', 'as-time', meta, post.time);
        },
        text: (base) => (R, main, post, p, m, parts, row) => {
          base(R, main, post, p, m, parts, row);
          if (m.expanded.includes(p)) parts.text.classList.add('forum-expanded');
        },
        body: (base) => (R, tx, text, post, short) => base(R, short ? R.util.el('span', 'forum-copy', tx) : tx, text, post, short),
        actLabel: () => (R, btn, b, p, post, parts) => {
          btn.classList.add(b === 'like' ? 'forum-primary' : 'forum-secondary');
          R.util.el('span', 'forum-action-label', btn, b === 'retweet' ? 'Retweet' : R.F.helpers.LABELS[b]);
          parts.counts[b] = R.util.el('span', 'forum-action-count', btn);
        },
        countText: () => (R, n) => '(' + R.F.helpers.formatCount(n) + ')',
        // Preserve the reference's eight-row rhythm: larger threads stay fully loaded and use the pane scrollbar.
        restoreScroll: (base) => (R, B, m, keep, first) => {
          const weights = 8.16;
          B.feed.style.setProperty('--forum-row-height', Math.max(60, (B.feed.clientHeight - 2) / weights) + 'px');
          base(R, B, m, keep, first);
        },
        // An action is reachable even when the edge of its row is clipped: requiring the whole row could leave a
        // visible last action unreported at the native scroll limit.
        inView: () => (R, p, row, r, top0, h) => {
          const pt = R.fd.parts.get(p);
          const action = pt.acts ? pt.acts.like : pt.undo;
          const ar = action ? action.getBoundingClientRect() : r;
          return ar.top >= top0 - 0.5 && ar.bottom <= top0 + h + 0.5;
        },
      },
    },
  });
})();
