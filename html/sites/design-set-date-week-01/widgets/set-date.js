// Keep the full calendar inside the stage when the report frame leaves
// too little room beneath the field. The closed form retains its geometry.
env.widget({
  task: 'set-date',
  site: 'design-set-date-week-01',
  name: 'design',
  split: 'train',
  scenarios: ['week'],
  template: 'set-date/base',
  design: {
    parts: {
      sizePop: (base, S) => (width, height) => {
        const cardHeight = base(width, height);
        const belowField = parseFloat(S.pop.style.top);
        const lastTop = S.ctxRef.size.height - height - 2;
        S.pop.style.top = Math.max(0, Math.min(belowField, lastTop)) + 'px';
        return cardHeight;
      },
    },
  },
});
