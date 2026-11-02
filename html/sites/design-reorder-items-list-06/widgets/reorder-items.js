// This design uses taller Memphis rows with wider gaps and larger type.
env.widget({
  task: 'reorder-items',
  site: 'design-reorder-items-list-06',
  name: 'design',
  split: 'train',
  scenarios: ['list'],
  traits: { dragScroll: true },
  template: 'reorder-items/cards',
  design: {
    listGap: .014,
    listHeight: .126,
    listFontMax: 40,
    listFont: .615,
  },
});
