// Community noticeboard design with handle-first metadata, topic tags, and all post actions.
(function () {
  'use strict';
  env.widget({
    task: 'use-social-feed',
    site: 'design-use-social-feed-some-09',
    name: 'design',
    split: 'train',
    scenarios: ['some'],
    template: 'use-social-feed/feed',
    design: {
      parts: {
        titled: (base) => (R) => {
          base(R);
          R.x.counter = R.util.el('span', 'as-counter', R.head);
        },
        metaText: () => (R, meta, post) => {
          const author = R.util.el('span', 'as-name', meta, post.handle);
          author.title = post.name;
          const age = parseInt(post.time, 10) || 0;
          const minutes = /h/.test(post.time) ? age * 60 : /d/.test(post.time) ? age * 1440 : age;
          const clock = (((12 * 60 - minutes) % 1440) + 1440) % 1440;
          const hour = Math.floor(clock / 60);
          R.util.el('span', 'as-time', meta,
            `Apr 27, 1996  ${hour % 12 || 12}:${String(clock % 60).padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`);
        },
        afterText: (base) => (R, main, post, p, parts, row, m) => {
          base(R, main, post, p, parts, row, m);
          const tagList = post.text.match(/#\w+/g) || [];
          const topics = [
            ['Books & Reading', /\b(book|read|poetry|novel)/i],
            ['Gardening', /garden|plant|tomato/i],
            ['Outdoors', /hik|trail|park|walk/i],
            ['Cooking', /cook|food|bread|bake|lunch|coffee/i],
            ['Technology', /build|code|tech|software/i],
            ['Movies', /movie|film|cinema/i],
            ['Community', /./],
          ];
          const tags = R.util.el('div', 'as-tags', main);
          R.util.el('div', 'as-category', tags, topics.find(([, pattern]) => pattern.test(post.text))[0]);
          R.util.el('div', '', tags, tagList.join('  '));
        },
        actsMade: (base) => (R, acts, post, p, parts, row) => {
          base(R, acts, post, p, parts, row);
          // Keep the same complete action set on every post, independently of the goal.
          acts.classList.add('multiple');
        },
        paintPost: (base) => (R, p, parts, m) => {
          base(R, p, parts, m);
          if (parts.acts) R.fd.rows.get(p).classList.toggle('selected',
            R.F.helpers.BUTTONS.some((b) => m.on.includes(R.F.helpers.keyOf(p, b))));
        },
        painted: (base) => (R, m) => {
          base(R, m);
          R.x.counter.textContent = `Showing ${R.fd.rows.size} posts`;
          R.fd.track.classList.toggle('needed', R.fd.feed.scrollHeight > R.fd.feed.clientHeight + 1);
        },
        restoreScroll: (base) => (R, B, m, keep, first) => {
          base(R, B, m, keep, first);
          if (first && m.scroll > 0 && B.rows.size) {
            const entries = [...B.rows.values()];
            const index = Math.min(m.scroll, entries.length - 1);
            const i = Math.floor(index);
            const firstTop = entries[0].getBoundingClientRect().top;
            const top = entries[i].getBoundingClientRect().top - firstTop;
            const next = entries[Math.min(i + 1, entries.length - 1)].getBoundingClientRect().top - firstTop;
            B.feed.scrollTop = top + (next - top) * (index - i);
            B.lbx.set({});
          }
        },
      },
    },
  });
})();
