// Design for the source labels and word/character counts used by this find-word page.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-find-word-07',
  name: 'design',
  split: 'train',
  scenarios: ['find-word'],
  template: 'find-fact/find-word',
  design: {
    parts: {
      readingCard: (base, S) => (ctx, rc) => {
        rc.querySelector('h3').textContent = 'Text to search:';
      },
      answers: (base, S) => (ctx, B) => {
        B.work.querySelector('.rl-form > h3').textContent = 'Your answer:';
        B.work.querySelector('.rl-input').placeholder = '';
      },
      counters: (base, S) => (ctx) => {
        const source = ctx.spec.paragraphs.join(' ');
        const wordCount = document.querySelector('.ds-word-count');
        const charCount = document.querySelector('.ds-char-count');
        if (wordCount) wordCount.textContent = 'Words: ' + source.trim().split(/\s+/).length;
        if (charCount) charCount.textContent = 'Characters: ' + source.length;
      },
    },
  },
  answerReply: true,
});
