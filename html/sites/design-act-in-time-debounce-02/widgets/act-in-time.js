// Design on templates/act-in-time/base.js: the base site's act-in-time widget for this scenario, unchanged (it was
// scaffolded from it and restyled through site.css).
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-debounce-02',
  name: 'design',
  split: 'train',
  scenarios: ['debounce'],
  template: 'act-in-time/base',
  design: {
    parts: {
      buildDebounce: (base) => function(ctx, frame) {
        const view = base(ctx, frame);
        const card = frame.body.querySelector('.ut-trip');
        const heading = card.querySelector('h3');
        const input = card.querySelector('input');
        const suggestions = card.querySelector('.ut-sug');
        if (ctx.stage.classList.contains('wf-stage-footer') && ctx.size.height < 400) {
          heading.style.marginBottom = Math.max(24, parseFloat(getComputedStyle(heading).marginBottom) - 32) + 'px';
          card.style.setProperty('--wf-radio-top', (heading.getBoundingClientRect().bottom - card.getBoundingClientRect().top + 8) + 'px');
          card.style.setProperty('--wf-radio-height', '20px');
        }
        suggestions.style.top = (input.getBoundingClientRect().height + 6) + 'px';
        return {
          ...view,
          sync(model) {
            view.sync(model);
            if (suggestions.hidden || !suggestions.children.length) return;
            const available = ctx.stage.getBoundingClientRect().bottom - suggestions.getBoundingClientRect().top - 8;
            const rowHeight = Math.max(22, Math.min(38, Math.floor((available - 2) / suggestions.children.length)));
            let changed = false;
            for (const row of suggestions.children) {
              if (Math.abs(row.getBoundingClientRect().height - rowHeight) > 0.5) {
                row.style.height = rowHeight + 'px';
                changed = true;
              }
            }
            if (changed) ctx.reanchor();
          },
        };
      },
    },
  },
});
