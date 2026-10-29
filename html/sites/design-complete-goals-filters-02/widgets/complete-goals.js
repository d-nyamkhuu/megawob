// Design of this site on the composition/sections template (templates/complete-goals/sections.js).
env.widget({
  task: 'complete-goals',
  site: 'design-complete-goals-filters-02',
  name: 'design',
  split: 'train',
  scenarios: ['filters'],
  template: 'complete-goals/sections',
  design: {
    fontFamily: '"Segoe UI", Arial, sans-serif',
    wrapPadding: '10px 4px', headingGap: '8px', titleSize: '18px', subtitleSize: '12px',
    labelSize: '15px', numberFontSize: '11px', muted: '#17263b', line: '#cbd7e4', accent: '#287fce',
    cardBackground: '#fff', cardRadius: '4px', cardPadding: '10px 12px 12px',
    styles: ['cards'], subtitles: [''], gapRange: [16, 16], columnRange: [780, 780],
    gridMinWidth: 600, heightRange: [480, 560], heightInset: 25, cardInset: 24,
    minBoxHeight: 150, contentMargin: 30, growMargin: 16,
    parts: {
      look: (base, S) => (ctx, W) => {
        const look = base(ctx, W);
        look.grid = true;
        look.head = false;
        return look;
      },
    },
  },
});
