// Design on templates/select-text/base.js with the mail window's card sizing.
env.widget({
  task: 'select-text',
  site: 'design-select-text-field-02',
  name: 'design',
  split: 'train',
  scenarios: ['field'],
  template: 'select-text/base',
  design: {
    parts: {
      ensureStyle: (base, S) => () => {
        S.env.util.css('hl-style', S.CSS);
        S.env.util.css('greenleaf-highlight-layout', `
          /* Measure the card naturally while the template zeroes its scroll pane. */
          .mailui .stage .hl-card { height: 100%; }
          .mailui .stage .hl-card:has(.hl-panerow) { height: auto; align-self: flex-start; }
        `);
      },
    },
  },
});
