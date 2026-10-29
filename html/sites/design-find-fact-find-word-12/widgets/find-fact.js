// This design uses a generic answer placeholder and tightens long reading cards.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-find-word-12',
  name: 'design',
  split: 'train',
  scenarios: ['find-word'],
  template: 'find-fact/find-word',
  design: {
    parts: {
      answers: (base, S) => (ctx, B) => {
        const { work, rc, body } = B;
        work.querySelector('input').placeholder = 'Type your answer here...';
        let readingSize = parseFloat(getComputedStyle(body.querySelector('p')).fontSize);
        while (rc.scrollHeight > rc.clientHeight + 1 && readingSize > 16) {
          rc.style.setProperty('--reading-size', `${--readingSize}px`);
        }
      },
    },
  },
});
