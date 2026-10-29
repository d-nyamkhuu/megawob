// This design adds illustrated avatars and current activity, and keeps scene scrolling aligned to whole posts.
(function () {
  'use strict';

  const portraits = [
    '<circle cx="36" cy="25" r="13"/><path d="M13 65c1-16 10-24 23-24s22 8 23 24z"/>',
    '<path d="M18 30l1-16 13 9h9l13-9 1 17c10 20-2 32-19 32S9 50 18 30z"/><g fill="#ddd"><ellipse cx="28" cy="38" rx="3" ry="4"/><ellipse cx="45" cy="38" rx="3" ry="4"/></g><path d="M32 47l4 4 4-4M23 46l-12-3m12 8-12 2m38-7 12-3m-12 8 12 2" stroke="#ddd" stroke-width="1.5" fill="none"/>',
    '<path d="M4 58l20-30 11 13 10-24 24 41z"/><path d="M24 28l17 24" fill="none" stroke="#ddd" stroke-width="2"/>',
    '<path d="M16 23l20 7 13-15c8-8 14-5 9 4L45 37l6 22-6 2-11-17-10 9-1 9-5-1-3-13-10-5 2-5 13 2 9-10-17-10z"/>',
    '<path d="M14 20q12-3 21 4v33q-9-7-21-4zm44 0q-12-3-21 4v33q9-7 21-4z"/>',
    '<path d="M20 51C10 29 33 23 57 16c1 24-8 47-32 39z"/><path d="M17 61l26-29" stroke="#292929" stroke-width="3"/>',
  ];

  env.widget({
    task: 'use-social-feed',
    site: 'design-use-social-feed-all-03',
    name: 'design',
    split: 'train',
    scenarios: ['all'],
    template: 'use-social-feed/feed',
    design: {
      scenarioDecor: false,
      icons: {
        like: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
      },
      parts: {
        avatar: (base) => (R, row, post, p, m) => {
          const av = base(R, row, post, p, m);
          av.innerHTML = '<svg viewBox="0 0 72 72" fill="#292929">' + portraits[p % portraits.length] + '</svg>';
          return av;
        },
        actLabel: (base) => (R, btn, b, p, post, parts) => {
          base(R, btn, b, p, post, parts);
          // Reply is always prominent, regardless of the episode's requested action.
          btn.classList.toggle('primary-action', b === 'reply');
        },
        restoreScroll: () => (R, B, m, keep, first) => {
          if (!R.fd && m.scroll > 0 && B.rows.size) {
            const els = [...B.rows.values()];
            const index = Math.min(els.length - 1, Math.max(0, m.scroll));
            const i = Math.floor(index);
            const origin = B.feed.getBoundingClientRect().top + B.feed.clientTop;
            const top = els[i].getBoundingClientRect().top - origin;
            const next = i + 1 < els.length ? els[i + 1].getBoundingClientRect().top - origin : top;
            B.feed.scrollTop = top + (next - top) * (index - i);
          } else B.feed.scrollTop = keep;
          B.lbx.set({});
        },
        layoutOf: (base) => (R) => {
          const { fd } = R;
          const fr = fd.feed.getBoundingClientRect();
          const top0 = fr.top + fd.feed.clientTop;
          const h = fd.feed.clientHeight;
          const view = [];
          const offs = [];
          for (const [p, row] of fd.rows) {
            const r = row.getBoundingClientRect();
            offs.push(Math.round(r.top - top0 + fd.feed.scrollTop));
            const style = getComputedStyle(row);
            const contentTop = r.top + parseFloat(style.paddingTop);
            const contentBottom = r.bottom - parseFloat(style.paddingBottom);
            const actions = Object.values(fd.parts.get(p).acts || {});
            const actionsVisible = actions.every((action) => {
              const a = action.getBoundingClientRect();
              return a.top >= top0 - 0.5 && a.bottom <= top0 + h + 0.5;
            });
            if (contentTop >= top0 - 0.5 && contentBottom <= top0 + h + 0.5 && actionsVisible) view.push(p);
          }
          const sr = fd.sentinel.getBoundingClientRect();
          return {
            scroll: Math.round(fd.lbx.scrollIndex() * 1000) / 1000,
            view,
            atEnd: R.F.helpers.moreToLoad(R.spec, R.ctx.model) && sr.top <= fr.bottom + 1,
            px: { top: Math.round(fd.feed.scrollTop), h, offs },
          };
        },
        paintStart: () => (R, m) => {
          const { spec, F } = R;
          const progress = document.querySelector('.task-progress-count');
          const selected = spec.posts.filter((post, p) => F.helpers.BUTTONS.some((b) => m.on.includes(F.helpers.keyOf(p, b)))).length;
          if (progress) progress.textContent = selected + ' posts acted on';
          const bar = document.querySelector('.prog-bar');
          const percent = selected / Math.max(1, spec.posts.length) * 100;
          if (bar) bar.style.background = `linear-gradient(to right,#333 ${percent}%,#cfceca ${percent}%)`;
        },
      },
    },
  });
})();
