// Streaming settings rows replace the task description panel and generic motif.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-dropdown-06',
  name: 'design',
  split: 'train',
  scenarios: ['dropdown'],
  template: 'choose-option/widgets',
  design: {
    details: false,
    fieldClass: 'fp-field fr',
    parts: {
      label: (base, S) => (ctx, field) =>
        ctx.util.el('div', 'fp-label fr-k', field, ctx.spec.label),
      heading: (base, S) => (ctx, card) => {
        const { util, spec } = ctx;
        const frow = (key, cls) => {
          const row = util.el('div', 'fr', card);
          util.el('div', 'fr-k', row, key);
          return util.el('div', 'fr-v' + (cls ? ' ' + cls : ''), row);
        };
        const fsel = (key, value, cls) => {
          const container = frow(key);
          const select = util.el('div', 'fake-sel ' + cls, container);
          util.el('span', '', select, value);
        };
        const title = util.el('input', 'fake-in', frow('Video title:'));
        title.type = 'text';
        title.value = 'Exploring the Baltic Region';
        fsel('Playback quality:', 'Auto (Recommended)', 'w2');
        util.el('div', 'fp-note', card, spec.note);
      },
      decorated: (base, S) => (ctx, card) => {
        const { util } = ctx;
        const frow = (key, cls) => {
          const row = util.el('div', 'fr', card);
          util.el('div', 'fr-k', row, key);
          return util.el('div', 'fr-v' + (cls ? ' ' + cls : ''), row);
        };
        const fsel = (key, value, cls) => {
          const container = frow(key);
          const select = util.el('div', 'fake-sel ' + cls, container);
          util.el('span', '', select, value);
        };
        fsel('Subtitle size:', 'Medium', 'w1');
        fsel('Audio language:', 'English', 'w1');
        frow('Autoplay:');
        const row = util.el('div', 'fr', card);
        util.el('div', 'fr-k', row, '');
        const value = util.el('div', 'fr-v', row);
        const checkbox = util.el('input', 'fake-cb', value);
        checkbox.type = 'checkbox';
        checkbox.setAttribute('aria-label', 'Play next video automatically');
        util.el('span', '', value, 'Play next video automatically');
      },
    },
  },
});
