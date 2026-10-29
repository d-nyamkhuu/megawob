// Keep the template's selection and scrolling, with a compact portal reading pane.
env.widget({
  task: 'select-text',
  site: 'design-select-text-word-03',
  name: 'design',
  split: 'train',
  scenarios: ['word'],
  template: 'select-text/base',
  design: {
    parts: {
      ensureStyle: (_base, S) => () => {
        env.util.css('hl-style', S.CSS);
        env.util.css('portal-highlight', `
          .hl-card { border-radius: 0; box-shadow: none; }
          .hl-head, .hl-foot { display: none; }
          .hl-text { padding: 12px 30px; font-family: Arial, Helvetica, sans-serif; }
        `);
      },
      // The portal leaves a compact reading area: retain the template's scroll
      // controls even when the whole document would not fit above the dock.
      'paragraphs.traits': (base) => ({ ...base, pane: 'always' }),
    },
  },
});
