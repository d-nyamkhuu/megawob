// Design of this site on the composition/sections template (templates/complete-goals/sections.js).
env.widget({
  task: 'complete-goals',
  site: 'design-complete-goals-appearance-02',
  name: 'design',
  split: 'train',
  scenarios: ['appearance'],
  template: 'complete-goals/sections',
  design: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    wrapPadding: '0', headingGap: '0', titleSize: '0px', subtitleSize: '0px',
    labelSize: '18px', numberFontSize: '12px', muted: '#111', line: '#111', accent: '#111',
    cardBackground: 'transparent', cardRadius: '8px', cardPadding: '20px 24px',
    styles: ['cards'], subtitles: [''], gapRange: [10, 10],
    cardInset: 26, minBoxHeight: 340, contentMargin: 16, growMargin: 12,
  },
});
