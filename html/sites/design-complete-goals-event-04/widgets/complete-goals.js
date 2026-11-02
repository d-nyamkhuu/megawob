// Design of this site on the composition/sections template (templates/complete-goals/sections.js).
env.widget({
  task: 'complete-goals',
  site: 'design-complete-goals-event-04',
  name: 'design',
  split: 'train',
  scenarios: ['event'],
  template: 'complete-goals/sections',
  design: {
    fontFamily: 'Arial, "Liberation Sans", sans-serif', wrapPadding: '0', headingGap: '0',
    titleSize: '22px', labelSize: '21px', numberFontSize: '0px', muted: '#171411', line: '#cfc8bd',
    accent: '#ff8c3d', cardBackground: '#f8f6f2', cardRadius: '8px', cardPadding: '10px 22px 14px',
    styles: ['cards'], gapRange: [14, 14], heightRange: [110, 210], heightInset: 0,
    cardInset: 0, minBoxHeight: 80, contentMargin: 18, growMargin: 16,
    parts: {
      frame: (base, S) => (ctx, look, at, W) => {
        const host = ctx.util.el('div', 'cp-wrap', ctx.stage);
        host.style.width = `${Math.floor(W * 0.745)}px`;
        host.style.margin = '0'; host.style.padding = '0'; host.style.gap = '14px';
        host.style.display = 'flex'; host.style.flexDirection = 'column'; host.style.alignItems = 'stretch';
        host.style.fontFamily = 'Arial, "Liberation Sans", sans-serif';
        return host;
      },
      heading: (base, S) => () => {},
      label: (base, S) => (ctx, card, part) => {
        const label = ctx.util.el('div', 'cp-label', card);
        ctx.util.el('span', '', label, part.label);
        return label;
      },
      boxWidth: (base, S) => (ctx) => Math.floor(ctx.size.width * 0.745 - 44),
    },
  },
});
