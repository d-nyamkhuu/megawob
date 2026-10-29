// Design on the shared transfer-items/dual template.
env.widget({
  task: 'transfer-items',
  site: 'design-transfer-items-range-01',
  name: 'design',
  split: 'train',
  scenarios: ['range'],
  template: 'transfer-items/dual',
  design: {
      colors: { panel: '#ffffff', line: '#d2d9e3', fg: '#0b1424', muted: '#566176', accent: '#ff5a16', selected: '#ffffff', selectedIndex: '#ffffff' },
      fontSizes: { title: 18, note: 13, head: 21, count: 20, filter: 16, index: 13, more: 14, button: 20, order: 14, status: 13, ghost: 15, row: 19, compact: 17 },
      cardPadding: '0', cardShadow: 'none', controlRadius: 5, buttonHeight: 50,
      buttonColumnWidth: 0, columnGap: 0, pitchRange: [41, 41],
      title: '', note: '', leftLabel: 'Available countries', rightLabel: 'Selected countries',
    parts: {
      begin: (base) => (ctx) => {
        base(ctx);
        ctx.stage.style.setProperty('top', '0px', 'important');
        ctx.stage.style.setProperty('bottom', '0px', 'important');
        ctx.stage.style.setProperty('height', 'auto', 'important');
      },
      geometry: (base) => (ctx, card, note) => {
        const geo = base(ctx, card, note);
        card.style.setProperty('--row-count', String(Math.max(12, ctx.spec.items.length)));
        return geo;
      },
      transferControls: (base, S) => (ctx, body) => {
        const btns = ctx.util.el('div', 'tl-btns', body);
        for (const key of ['RR', 'R', 'L', 'LL']) S.st.btns[key] = S.P.button(ctx, btns, key);
        return btns;
      },
      place: (base) => (ctx, card) => {
        base(ctx, card);
        card.style.left = '3.5%';
        card.style.top = '158px';
        card.style.width = '94.4%';
        card.style.height = 'auto';
        const list = card.querySelector('.tl-list');
        const listHeight = list.getBoundingClientRect().height;
        const overhead = card.getBoundingClientRect().height - listHeight;
        const visibleBottom = Math.min(ctx.stage.getBoundingClientRect().bottom, window.innerHeight);
        const room = visibleBottom - card.getBoundingClientRect().top - overhead - 12;
        card.style.setProperty('--list-height', Math.max(120, Math.floor(Math.min(listHeight, room))) + 'px');
      },
    },
  },
});
