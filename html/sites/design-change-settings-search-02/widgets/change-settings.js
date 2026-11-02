// Design on the change-settings/preferences template; defaults reproduce the reference scaffold.
env.widget({
  task: 'change-settings',
  site: 'design-change-settings-search-02',
  name: 'design',
  split: 'train',
  scenarios: ['search'],
  template: 'change-settings/preferences',
  design: {
    widthMax: 980,
    longWidthMin: 1200,
    indexAt: 700,
    sideTabsAt: 0,
    titleSize: '21px',
    labelSize: '15px',
    detailSize: '13px',
    rowHeight: 68,
    widthInset: 0,
    minWidth: 0,
    parts: {
      wrap: (base, S) => ctx => {
        const wrap = base(ctx);
        Object.assign(wrap.style, { margin: '0', width: '100%', height: S.geo.long ? 'auto' : '100%', alignSelf: 'stretch' });
        return wrap;
      },
      card: (base, S) => (ctx, wrap) => {
        const card = base(ctx, wrap);
        card.style.width = '100%';
        card.style.height = S.geo.long ? 'auto' : '100%';
        card.style.minHeight = '0';
        return card;
      },
      header: (base, S) => (ctx, card) => {
        const result = base(ctx, card);
        Object.assign(result.head.style, { padding: '20px 24px 16px', gap: '16px', minHeight: '90px' });
        return result;
      },
      navigation: (base, S) => (ctx, body) => {
        base(ctx, body);
        const tabs = Object.values(S.els.tabEls)[0]?.parentElement;
        if (tabs) Object.assign(tabs.style, { width: Math.min(260, Math.max(156, S.geo.cardW * .285)) + 'px', padding: '12px 8px', overflow: 'auto' });
      },
      tab: (base, S) => (ctx, tabs, section) => {
        const tab = base(ctx, tabs, section);
        tab.style.padding = ctx.size.height < 570 ? '8px 10px' : '12px 18px';
        return tab;
      },
      panel: (base, S) => (ctx, body) => {
        const panel = base(ctx, body);
        if (!S.geo.long) Object.assign(panel.style, { height: 'auto', minHeight: '0', overflow: 'auto' });
        return panel;
      },
      place: (base, S) => ctx => {
        base(ctx);
        S.els.wrap.style.marginTop = '0';
      },
    },
  },
});
