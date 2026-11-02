// Keep the template's deadline behavior and fit its decorative middle row to the stage.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-deadline-01',
  name: 'design',
  split: 'train',
  scenarios: ['deadline'],
  template: 'act-in-time/base',
  design: {
    parts: {
      buildDeadline: (base) => (ctx, frame) => {
        const view = base(ctx, frame);
        const card = frame.body.lastElementChild.firstElementChild;
        const description = card.children[1];
        const state = card.children[2];
        card.style.gridTemplateRows = `auto minmax(0, 1fr) ${ctx.size.width < 700 ? 30 : 42}px auto`;
        description.classList.add('tp-offer-description');
        Object.assign(description.style, {display: 'flex', flexDirection: 'column', minHeight: '0'});
        state.classList.add('tp-offer-state');
        state.style.height = '100%';
        return view;
      },
    },
  },
});
