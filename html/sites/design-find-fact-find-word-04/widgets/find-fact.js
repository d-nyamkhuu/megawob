// This design places the answer card in the site slot and removes that slot in reply mode.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-find-word-04',
  name: 'design',
  split: 'train',
  scenarios: ['find-word'],
  template: 'find-fact/find-word',
  design: {
    parts: {
      answers: (base, S) => (ctx, B) => {
        const slot = document.querySelector('.ds-slot');
        if (slot && B.work.lastElementChild && B.work.lastElementChild !== B.rc) {
          slot.appendChild(B.work.lastElementChild);
        }
      },
      dropAnswer: (base, S) => (ctx, app) => {
        base(ctx, app);
        if (ctx.episode.answer === 'reply') {
          document.querySelectorAll('.rl-form, .ds-yours, .ds-slot').forEach((el) => el.remove());
        }
      },
    },
  },
});
