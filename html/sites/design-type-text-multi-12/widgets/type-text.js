// This design adds colon labels and narrow postal/ZIP wrappers.
env.widget({
  task: 'type-text',
  site: 'design-type-text-multi-12',
  name: 'design',
  split: 'train',
  scenarios: ['multi'],
  template: 'type-text/fields',
  design: {
    parts: {
      labelText: () => (f) => `${f.label}:`,
      makeBox: (base, S) => (e) => {
        const box = base(e);
        if (/postal|zip/i.test(e.f.label)) box.classList.add('ft-short');
        return box;
      },
    },
  },
});
