// Design on the shared transfer-items/dual template.
env.widget({
  task: 'transfer-items',
  site: 'design-transfer-items-filter-05',
  name: 'design',
  split: 'train',
  scenarios: ['filter'],
  template: 'transfer-items/dual',
  design: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    cardPadding: '10px 12px 8px',
    cardShadow: 'none',
    controlRadius: 2,
    buttonHeight: 36,
    buttonColumnWidth: 84,
    columnGap: 18,
    radiusRange: [3, 3],
    pitchRange: [27, 30],
    minPitch: 20,
    compactPitch: 22,
    chromeHeight: 175,
    filterChrome: 43,
    horizontalInset: 8,
    verticalInset: 8,
    widthRange: [600, 720],
    fontSizes: { title: 20, note: 13, head: 20, count: 18, filter: 18, index: 14, more: 17,
      button: 22, order: 16, status: 14, ghost: 16, row: 20, compact: 17 },
    colors: { panel: '#eceae5', line: '#c1c0bd', fg: '#111', muted: '#555', accent: '#3898ed',
      selected: '#fff', selectedIndex: 'rgba(255,255,255,.8)' },
    parts: {
      status(base, S) {
        return (ctx, card) => {
          const frame = ctx.util.el('div', 'sgi-frame', card);
          card.insertBefore(frame, card.firstChild);
          ctx.util.el('div', 'sgi-frame-title', frame, 'Edit Bundle Items');
          const sum = ctx.util.el('div', 'sgi-sum', card);
          ctx.util.el('h3', '', sum, 'Bundle Summary');
          const n = ctx.spec.items.length;
          for (const [k, v] of [['Total Products', n], ['Available Items', ''], ['Bundle Items', '']]) {
            const r = ctx.util.el('div', 'sgi-sum-row', sum);
            ctx.util.el('span', '', r, k);
            ctx.util.el('span', '', r, String(v));
          }
          const vals = [...sum.querySelectorAll('.sgi-sum-row')].map((r) => r.lastChild);
          const refresh = () => {
            const ns = [...card.querySelectorAll('.tl-head .n')].map((e) => e.textContent.replace(/\D/g, ''));
            if (ns.length < 2) return;
            [String(+ns[0] + +ns[1]), ns[0], ns[1]].forEach((t, i) => { if (vals[i].textContent !== t) vals[i].textContent = t; });
          };
          refresh();
          new MutationObserver(refresh).observe(card, { subtree: true, childList: true, characterData: true });
          ctx.util.el('h3', '', sum, 'Product Details');
          ctx.util.el('div', 'sgi-sum-none', sum, 'No item selected');
          return ctx.util.el('div', 'tl-status city-status', card, '');
        };
      },
      place(base) {
        return (ctx, card) => {
          const { rng, size } = ctx;
          const range = ctx.spec.scenario === 'ordered' ? [640, 760] : [600, 720];
          rng.int(...range);
          rng.pick([0, 0.5, 0.5, 1, rng.float()]);
          rng.pick([0.5, 0.5, 0, 1, rng.float()]);
          card.style.left = '0px';
          card.style.top = '0px';
          card.style.width = `${size.width}px`;
          card.style.height = `${size.height}px`;
        };
      },
    },
  },
});
