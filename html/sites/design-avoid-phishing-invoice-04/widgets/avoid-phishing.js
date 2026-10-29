// Design on the shared avoid-phishing/classic widget. The ledger window supplies its own title bar, menu and
// record list, so the template's browser strip, header and toolbar are not drawn.
env.widget({
  task: 'avoid-phishing',
  site: 'design-avoid-phishing-invoice-04',
  name: 'design',
  split: 'train',
  scenarios: ['invoice'],
  template: 'avoid-phishing/classic',
  design: {
    parts: {
      browser: () => () => {},
      header: () => () => {},
      toolbar: () => () => {},
    },
  },
});
