// Workstation feed controls use a fixed Reply shortcut and current activity counts.
(function () {
  'use strict';

  env.widget({
    task: 'use-social-feed',
    site: 'design-use-social-feed-some-06',
    name: 'design',
    split: 'train',
    scenarios: ['some'],
    template: 'use-social-feed/feed',
    design: {
      icons: {
        like: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
      },
      parts: {
        header: (_base, S) => (R) => {
          const { util, rng, spec } = R;
          const lists = Object.keys(spec.lists);
          R.live = lists.length > 1;
          R.head = util.el('div', 'as-head' + (R.live && rng.bool(0.5) ? ' split' : ''), R.col);
          util.el('b', '', R.head, S.D.title);
          S.P.titled(R);
          util.el('span', 'as-show', R.head, 'Show:');
          if (R.live) {
            for (const k of rng.bool(0.7) ? ['foryou', 'following'] : ['following', 'foryou'])
              R.tabEls[k] = S.P.liveTab(R, k);
          } else {
            rng.bool(0.4);
            ['All Posts', '#books', '#travel', '#food', '#music', '#movies'].forEach((n, i) =>
              util.el('div', 'as-tab' + (i === 0 ? ' on' : ''), R.head, n),
            );
          }
          const sort = util.el('div', 'as-sort', R.head, 'Sort by:');
          util.el('span', '', sort, 'Newest first');
          S.P.headed(R);
        },
        postRow: (base) => (R, feed, p, post, m) => {
          const row = base(R, feed, p, post, m);
          const cb = R.util.el('button', 'as-cb', row);
          cb.type = 'button';
          cb.setAttribute('aria-label', 'Toggle reply');
          row.insertBefore(cb, row.firstChild);
          cb.addEventListener('click', () => {
            const button = row.querySelector('.as-act.reply');
            if (button) button.click();
          });
          return row;
        },
        actions: (base) => (R, main, post, p, parts, row) => {
          const acts = base(R, main, post, p, parts, row);
          parts.cb = row.querySelector('.as-cb');
          return acts;
        },
        paintPost: (base) => (R, p, parts, m) => {
          base(R, p, parts, m);
          if (parts.acts) {
            const selected = m.on.includes(R.F.helpers.keyOf(p, 'reply'));
            if (parts.cb) parts.cb.classList.toggle('on', selected);
          }
          const count = document.querySelector('.sel-count');
          if (count) {
            count.textContent = `${m.on.length} active actions`;
          }
        },
      },
    },
  });
})();
