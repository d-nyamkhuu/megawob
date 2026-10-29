// This design further fits long reading cards above the notebook's floating footer.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-find-word-08',
  name: 'design',
  split: 'train',
  scenarios: ['find-word'],
  template: 'find-fact/find-word',
  design: {
    parts: {
      fitted: (base, S) => (ctx, B) => {
        const { work, rc } = B;
        const footer = document.querySelector('.ds-footer');
        const bottom = Math.min(ctx.stage.getBoundingClientRect().bottom,
          footer ? footer.getBoundingClientRect().top - 12 : Infinity);
        const answerCard = work.querySelector('.rl-form');
        if (answerCard.getBoundingClientRect().bottom > bottom) {
          rc.classList.add('rl-fitted');
          for (const fs of [16, 15, 14, 13]) {
            rc.style.setProperty('--rl-fit-fs', fs + 'px');
            if (answerCard.getBoundingClientRect().bottom <= bottom) break;
          }
        }
      },
    },
  },
});
