// This design adds compact field sizing and a separate email metadata block.
env.widget({
  task: 'fill-form',
  site: 'design-fill-form-email-08',
  name: 'design',
  split: 'train',
  scenarios: ['email'],
  template: 'fill-form/document',
  design: {
    tabsGrid: '1fr',
    parts: {
      grid: (base) => (grid, form, pane, spec) => {
        base(grid, form, pane, spec);
        grid.style.setProperty('--field-count', spec.fields.length);
        grid.style.setProperty(
          '--field-rows',
          spec.fields.map((f) => (f.kind === 'radio' ? 'minmax(0,1.6fr)' : 'minmax(0,1fr)')).join(' '),
        );
      },
      renderEmail: (base) => (util, pane, d, rng) => {
        const meta = util.el('div', 'ff-mailmeta', pane);
        for (const [label, value] of [
          ['From:', d.from.addr],
          ['To:', d.to],
          ['Subject:', d.subject],
          ['Date:', d.date],
        ]) {
          util.el('b', '', meta, label);
          util.el('span', '', meta, value);
        }
        return base(util, pane, d, rng);
      },
    },
  },
});
