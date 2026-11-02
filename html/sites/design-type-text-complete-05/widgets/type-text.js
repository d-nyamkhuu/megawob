// Swiss contact form: the profile card becomes the open record of the side panel.
env.widget({
  task: 'type-text',
  site: 'design-type-text-complete-05',
  name: 'design',
  split: 'train',
  scenarios: ['complete'],
  template: 'type-text/base',
  design: {
    parts: {
      'buildProfile': (base) => (ctx, look, parent) => {
        const p = base(ctx, look, parent);
        const slot = document.querySelector('.sw-slot');
        if (slot) slot.appendChild(p);
        return p;
      },
    },
  },
});
