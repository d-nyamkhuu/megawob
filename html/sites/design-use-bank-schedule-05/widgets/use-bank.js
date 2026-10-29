// Design on the shared use-bank/classic workspace; defaults reproduce this scaffold.
env.widget({
  task: 'use-bank',
  site: 'design-use-bank-schedule-05',
  name: 'design',
  split: 'train',
  scenarios: ['schedule'],
  template: 'use-bank/classic',
  design: {
    brand: 'Harborview Bank',
    titles: { schedule: 'Set Up a Recurring Transfer' },
    font: '18px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif',
    controlHeight: '50px',
    parts: {
      icon: base => (E, util, parent, name, cls) => {
        const svg = base(E, util, parent, name, cls);
        if (name === 'chevron') svg.querySelector('path').setAttribute('d', 'm5 8 7 7 7-7');
        if (name === 'calendar') svg.setAttribute('viewBox', '2 2 20 20');
        return svg;
      },
      shell: (base, S) => E => {
        const main = E.u.el('main', 'bk-main', E.root);
        const heading = E.u.el('div', 'bank-form-heading', main);
        E.crumb = E.u.el('span', 'bank-internal', heading);
        E.title = E.u.el('h2', '', heading);
        E.u.el('p', 'bank-form-description', heading, 'Move money between your Rivermark accounts on a repeating schedule.');
        E.stateBadge = E.u.el('span', 'bank-internal', heading);
        E.pane = E.u.el('div', 'bk-scroll', main);
        E.footer = E.u.el('div', 'bk-footer', main);
        E.pane.addEventListener('scroll', () => S.P.mirror(E));
      },
      form: (base, S) => E => S.P.fields(E),
      history: () => () => {},
      choiceControl: (base, S) => (E, field, box) => {
        base(E, field, box);
        if (!E.ctx.model.values[field.id]) {
          box.querySelector('.bk-choice span').textContent = field.id === 'frequency'
            ? 'Select a frequency' : 'Select an account';
        }
      },
      textControl: base => (E, field, box) => {
        base(E, field, box);
        if (field.kind === 'amount') box.querySelector('input').placeholder = '0.00';
      },
      fieldDrawn: () => (E, field, box) => {
        box.querySelector('.bk-hint')?.remove();
        if (field.kind === 'date') box.querySelector('.bk-label').textContent =
          /end|last/i.test(field.id) ? 'Last transfer date' : 'First transfer date';
      },
    },
  },
});
