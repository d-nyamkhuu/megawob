// Site design on find-fact/find-word; shared widget code lives in templates/find-fact/find-word.js.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-find-word-06',
  name: 'design',
  split: 'train',
  scenarios: ['find-word'],
  template: 'find-fact/find-word',
  design: {
    preserveNote: true,
    parts: {
      answers: (base, S) => (ctx, B) => {
        const { work } = B;
        // Arrange the existing task note and episode end control within the reading form.
        // This happens before anchors are returned and does not change task state.
        const form = work.querySelector('.rl-form');
        const headerNote = document.querySelector('.ds-header-note');
        if (headerNote) form.insertBefore(headerNote, form.firstChild);
        const end = document.querySelector('.ds-footer > .ds-submit');
        if (end) form.querySelector('.rl-card-b').appendChild(end);
        const answer = form.querySelector('input');
        if (answer) answer.placeholder = '';
      },
    },
  },
});
