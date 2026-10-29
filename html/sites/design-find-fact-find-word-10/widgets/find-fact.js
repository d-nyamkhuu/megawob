// Site design on find-fact/find-word; shared widget code lives in templates/find-fact/find-word.js.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-find-word-10',
  name: 'design',
  split: 'train',
  scenarios: ['find-word'],
  template: 'find-fact/find-word',
  design: {
    parts: {
      answers: (base, S) => (ctx, B) => {
        const { util } = ctx;
        const { work, rc } = B;
        work.querySelector('.rl-form > h3').textContent = 'Your answer:';
        const bar = work.previousElementSibling;
        const tabs = util.el('div', 'tm-tabs', bar);
        const textTab = util.el('button', 'active', tabs, 'Text');
        const answerTab = util.el('button', '', tabs, 'Answer');
        textTab.type = answerTab.type = 'button';
        rc.tabIndex = -1;
        textTab.addEventListener('click', () => {
          textTab.classList.add('active'); answerTab.classList.remove('active');
          rc.focus({ preventScroll: true });
        });
        answerTab.addEventListener('click', () => {
          answerTab.classList.add('active'); textTab.classList.remove('active');
          work.querySelector('.rl-input').focus({ preventScroll: true });
        });
      },
      dropAnswer: (base, S) => (ctx, app) => {
        base(ctx, app);
        if (ctx.episode.answer === 'reply') app.querySelectorAll('.tm-tabs').forEach((el) => el.remove());
      },
    },
  },
});
