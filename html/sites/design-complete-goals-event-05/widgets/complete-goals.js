// Design of this site on the composition/sections template (templates/complete-goals/sections.js).
env.widget({
  task: 'complete-goals',
  site: 'design-complete-goals-event-05',
  name: 'design',
  split: 'train',
  scenarios: ['event'],
  template: 'complete-goals/sections',
  design: {
    fontFamily: '"Source Sans Pro", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
    wrapPadding: '0',
    headingGap: '12px',
    titleSize: '24px',
    subtitleSize: '13px',
    labelSize: '15px',
    muted: '#6b7785',
    line: '#e3eaec',
    accent: '#2f9c6e',
    cardBackground: '#ffffff',
    cardRadius: '3px',
    cardPadding: '18px 22px',
    ruleWidth: '1px',
    rulePadding: '12px',
    styles: ['cards'],
    gapRange: [18, 22],
    heightRange: [170, 230],
    heightInset: 80,
    cardInset: 0,
    minBoxHeight: 140,
    contentMargin: 28,
    growMargin: 18,
    parts: {
      // Columns are fixed up front (in the CSS card order), so each embedded widget is sized for its final share.
      frame: (base) => (ctx, look, at, W) => {
        const host = base(ctx, look, at, W);
        const rank = { 'type-text': 1, 'set-date': 2, 'pick-color': 3 };
        const cols = ctx.spec.parts.map((p) => p.task)
          .sort((a, b) => (rank[a] || 0) - (rank[b] || 0))
          .map((f) => (f === 'pick-color' ? 'minmax(0, 1.22fr)' : f === 'set-date' ? 'minmax(0, 1fr)' : 'minmax(0, 1.24fr)'));
        host.style.gridTemplateColumns = cols.join(' ');
        return host;
      },
      label: (base) => (ctx, card, part, i, look) => {
        const label = base(ctx, card, part, i, look);
        if (label) {
          const title = { 'type-text': 'Member Information', 'set-date': 'Adoption Date', 'pick-color': 'Favorite Color' }[part.task];
          const text = label.querySelector('span:not(.n)');
          if (text && title) text.textContent = title;
        }
        return label;
      },
    },
  },
});
