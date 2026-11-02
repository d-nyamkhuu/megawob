// Design on the shared transfer-items/dual template.
env.widget({
  task: 'transfer-items',
  site: 'design-transfer-items-move-02',
  name: 'design',
  split: 'train',
  scenarios: ['move'],
  template: 'transfer-items/dual',
  design: {
    fontFamily: 'Tahoma, Arial, sans-serif',
    colors: { panel: 'transparent', line: '#87867f', fg: '#080808', muted: '#333',
      accent: '#001d68', selected: '#fff', selectedIndex: '#fff' },
    cardPadding: '0',
    cardShadow: 'none',
    radiusRange: [0, 0],
    controlRadius: 0,
    buttonHeight: 44,
    buttonColumnWidth: 76,
    columnGap: 20,
    title: 'Manage Teams',
    note: '',
    parts: {
      heading: (base, S) => (ctx, card) => {
        const note = base(ctx, card);
        S.st.card.firstElementChild.style.cssText = 'padding:6px 16px;font-size:24px;flex:none';
        note.remove();
        return note;
      },
      geometry: (base, S) => (ctx, card, note) => {
        const geo = base(ctx, card, note);
        card.style.setProperty('--tl-fs', Math.max(13, Math.min(22, ctx.size.width / 43)) + 'px');
        return geo;
      },
      body: (base, S) => (ctx, card) => {
        const body = base(ctx, card);
        body.style.cssText = 'flex:1;min-height:0;margin-top:24px;padding:0 20px 4px';
        body.style.gridTemplateColumns = `minmax(0,1fr) ${Math.min(90, ctx.size.width / 10)}px minmax(0,1fr)`;
        body.style.columnGap = Math.min(22, ctx.size.width / 45) + 'px';
        return body;
      },
      sideHeading: (base, S) => (ctx, col, key, label) => {
        const count = base(ctx, col, key, label);
        count.parentElement.style.cssText = `font-size:${Math.max(13, Math.min(23, ctx.size.width / 43))}px;white-space:normal;min-height:32px`;
        count.style.fontSize = 'inherit';
        return count;
      },
      list: (base, S) => (ctx, col, key, label) => {
        const list = base(ctx, col, key, label);
        list.style.cssText = 'flex:1;min-height:0;height:0';
        return list;
      },
      place: (base, S) => (ctx, card) => {
        // Keep the template's seeded draws, then fit the fixed anchor to the stage.
        base(ctx, card);
        Object.assign(card.style, { left:'0px', top:'0px', width:ctx.size.width+'px', height:ctx.size.height+'px' });
      },
    },
  },
});
