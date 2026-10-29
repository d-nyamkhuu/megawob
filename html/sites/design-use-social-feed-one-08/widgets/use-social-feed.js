// This design keeps the original red/orange progress colors in the task detail panel.
(function () {
  'use strict';

  env.widget({
    task: 'use-social-feed',
    site: 'design-use-social-feed-one-08',
    name: 'design',
    split: 'train',
    scenarios: ['one'],
    template: 'use-social-feed/feed',
    design: {
      css: '',
      inlineActs: false,
      icons: {
        reply: '<path d="M2 10.5C2 5.5 6.4 2 12 2s10 3.5 10 8.5S17.6 19 12 19c-1.2 0-2.4-.2-3.5-.5L3 22l1.3-5C2.8 15.3 2 13.1 2 10.5z"/>',
        retweet: '<path d="M10 4h8a2 2 0 0 1 2 2v13M16 15l4 4 3-4M14 20H6a2 2 0 0 1-2-2V5M1 9l3-4 4 4"/>',
        like: '<path d="M12 22S2 15.5 2 8A5.5 5.5 0 0 1 12 4.8 5.5 5.5 0 0 1 22 8c0 7.5-10 14-10 14z"/>',
      },
      parts: {
        headed: () => (R) => {
          if (R.live) document.querySelector('.design-header').append(R.head);
        },
        actLabel: (base) => (R, btn, b, p, post, parts) => {
          if (!R.spec.targets.includes(p)) return base(R, btn, b, p, post, parts);
          btn.classList.add('has-label');
          R.util.el('span', '', btn, R.F.helpers.LABELS[b]);
        },
        hover: () => (R, row, p) => {
          const currentRow = () => row.isConnected && R.fd && R.fd.rows.get(p) === row;
          row.addEventListener('pointermove', () => {
            if (!currentRow()) return;
            if (R.ctx.model.hover !== p) R.up({ hover: p });
            R.markHover();
          });
          row.addEventListener('pointerleave', () => {
            if (currentRow() && R.ctx.model.hover === p) R.up({ hover: null });
            if (currentRow()) R.markHover();
          });
        },
        restoreScroll: () => (R, B, m, keep, first) => {
          const range = Math.max(0, B.feed.scrollHeight - B.feed.clientHeight);
          const initial = Math.max(0, Math.min(1, Number(m.scroll) || 0));
          B.feed.scrollTop = first ? initial * range : keep;
          B.lbx.set({});
        },
        scrollOf: () => (R) => {
          const range = Math.max(0, R.fd.feed.scrollHeight - R.fd.feed.clientHeight);
          return range ? Math.round(Math.max(0, Math.min(1, R.fd.feed.scrollTop / range)) * 1000) / 1000 : 0;
        },
        paintStart: (base) => (R, m) => {
          base(R, m);
          const ds = document.querySelector('.detail-status');
          const ok = m.on.length !== R.spec.start.length || m.on.some((k) => !R.spec.start.includes(k));
          ds.style.color = ok ? '#b36b00' : '#d00000';
        },
      },
    },
  });
})();
