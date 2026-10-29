// Design on templates/act-in-time/base.js: the base site's act-in-time widget for this scenario, unchanged (it was
// scaffolded from it and restyled through site.css).
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-debounce-01',
  name: 'design',
  split: 'train',
  scenarios: ['debounce'],
  template: 'act-in-time/base',
  design: {
    parts: {
      frame: (base) => (ctx) => {
        const frame = base(ctx);
        // The inline city field has a popup that extends below its form row.
        frame.arena.style.overflow = 'visible';
        return frame;
      },
      buildDebounce: (base) => (ctx, frame) => {
        const view = base(ctx, frame);
        const popup = frame.body.querySelector('.ut-sug');
        const field = frame.body.querySelector('.ut-ac');
        return {
          ...view,
          sync(model) {
            view.sync(model);
            if (popup.hidden) return;
            const room = ctx.stage.parentElement.getBoundingClientRect().bottom - field.getBoundingClientRect().bottom;
            const above = popup.offsetHeight + 4 > room;
            const offset = field.offsetHeight + 4 + 'px';
            popup.style.top = above ? 'auto' : offset;
            popup.style.bottom = above ? offset : 'auto';
          },
        };
      },
    },
  },
});
