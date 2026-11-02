// Design on wizard/stepper; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'complete-wizard',
  site: 'design-complete-wizard-application-04',
  name: 'design',
  split: 'train',
  scenarios: ['application'],
  template: 'complete-wizard/stepper',
  design: {
    look: { ind: 'side', title: false, stepHead: true, cols: 2, inline: false, width: 1200, r: 0 },
    font: '18px Georgia, serif',
    cardRadius: '0',
    parts: {
      card: (base) => (ctx, s, look) => {
        const card = base(ctx, s, look);
        card.style.minHeight = `${Math.max(0, ctx.size.height - 12)}px`;
        return card;
      },
      body: (base) => (ctx, s, main) => {
        const body = base(ctx, s, main);
        body.style.flex = '1 0 auto';
        return body;
      },
      indicator: (base) => (ctx, s, look) => {
        const main = base(ctx, s, look);
        if (look.ind === 'side') {
          const list = s.ind[0].parentElement;
          list.style.width = `${Math.max(150, Math.min(225, ctx.size.width * 0.25))}px`;
          list.style.gap = `${Math.min(26, ctx.size.height * 0.035)}px`;
        }
        return main;
      },
      panel: () => (ctx, s, panel) => {
        const heading = panel.firstElementChild;
        if (heading && heading.tagName === 'H3') heading.classList.add('lisa-step-heading');
      },
    },
  },
});
