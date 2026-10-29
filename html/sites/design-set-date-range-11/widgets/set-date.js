// Opens the range picker at render and scales the card to the stage height.
env.widget({
  task: 'set-date',
  site: 'design-set-date-range-11',
  name: 'design',
  split: 'train',
  scenarios: ['range'],
  template: 'set-date/calendar',
  design: {
    inlineRange: false,
    bothNav: false,
    openOnPick: false,
    rangeLayout: null,
    adjacentDays: false,
    trimWeeks: false,
    trimWithOutside: false,
    openInitial: true,
    fit: 'height',
  },
});
