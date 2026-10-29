// This design uses photo avatars, dated timestamps, a repost metric, and reaction activity.
(function () {
  'use strict';

  env.widget({
    task: 'use-social-feed',
    site: 'design-use-social-feed-all-05',
    name: 'design',
    split: 'train',
    scenarios: ['all'],
    template: 'use-social-feed/feed',
    design: {
      scenarioDecor: false,
      countZero: true,
      icons: {
        reply: '<path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-9l-5 5v-5H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/>',
        like: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
      },
      parts: {
        ready: (base) => (R) => {
          base(R);
          R.head.classList.toggle('has-live-tabs', R.live);
        },
        avatar: (base) => (R, row, post, p, m) => {
          const av = base(R, row, post, p, m);
          av.textContent = '';
          av.classList.add('as-photo-avatar');
          av.style.setProperty('--avatar-y', [142, 292, 443, 593, 738][p % 5]);
          return av;
        },
        timeText: (base) => (R, post) => {
          const p = R.spec.posts.indexOf(post);
          const age = /^(\d+)([mhd])/.exec(post.time);
          const minutes = age ? Number(age[1]) * { m: 1, h: 60, d: 1440 }[age[2]] : p * 47;
          const clock = (((857 - minutes) % 1440) + 1440) % 1440;
          return `Mar 14, 1999   ${Math.floor(clock / 60) % 12 || 12}:${String(clock % 60).padStart(2, '0')} ${clock >= 720 ? 'PM' : 'AM'}`;
        },
        beforeAct: (base, S) => (R, acts, b, p, post, parts) => {
          base(R, acts, b, p, post, parts);
          if (b === 'retweet') {
            const metric = R.util.el('span', 'as-retweet-metric', acts);
            metric.innerHTML = S.svg('<path d="M3 10V4h14v13M1 6l2-3 3 3M21 14v6H7V7M18 17l3 4 2-4"/>');
            parts.retweetMetric = R.util.el('span', '', metric);
          }
        },
        actLabel: () => (R, btn, b, p, post, parts) => {
          if (b !== 'share') parts.counts[b] = R.util.el('span', '', btn);
        },
        paintAct: (base) => (R, p, parts, b, on) => {
          base(R, p, parts, b, on);
          if (b === 'retweet') {
            const n = (R.spec.posts[p].counts[b] || 0) + (on ? 1 : 0);
            parts.retweetMetric.textContent = R.F.helpers.formatCount(n);
          }
        },
        keepOf: (base) => (R, m) => {
          return R.fd && R.builtKey && JSON.parse(R.builtKey)[0] === m.tab ? R.fd.feed.scrollTop : null;
        },
        restoreScroll: () => (R, B, m, keep) => {
          B.lbx.set({});
          B.feed.scrollTop = keep === null
            ? Math.max(0, Math.min(1, Number(m.scroll || 0) / 1000)) * Math.max(0, B.feed.scrollHeight - B.feed.clientHeight)
            : keep;
        },
        painted: (base) => (R) => {
          base(R);
          const progress = document.querySelector('.bx-prog-t');
          if (progress) progress.textContent = `Active reactions (by you): ${R.ctx.model.on.length}`;
        },
      },
    },
  });
})();
