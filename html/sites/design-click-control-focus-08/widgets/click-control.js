// Design of this site on click-control/controls: moves the read-only event details into the inspector.
env.widget({
  task: 'click-control',
  site: 'design-click-control-focus-08',
  name: 'design',
  split: 'train',
  scenarios: ['focus'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    parts: {
      rendered: (base) => (ctx, page, content) => {
        base(ctx, page, content);
        const inspector = document.querySelector('.details');
        if (inspector) {
          inspector.querySelector('.field-count').textContent = String(ctx.spec.fields.length);
          const extra = ctx.util.el('section', 'record-extra', inspector);
          ctx.util.el('h3', '', extra, 'Additional Information');
          content.querySelectorAll('.date-field,.attendees-field,.comments-field').forEach((row) => extra.appendChild(row));
        }
      },
    },
  },
});
