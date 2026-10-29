// Design override: shrink long passages until they fit above the answer row.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-find-word-09',
  name: 'design',
  split: 'train',
  scenarios: ['find-word'],
  template: 'find-fact/find-word',
  design: {
    parts: {
      fitted: (base, S) => (ctx, B) => {
        const { work, rc, body } = B;
        const paragraph = body.querySelector('p');
        const answer = work.querySelector('.rl-form');
        if (paragraph && answer) {
          const base = parseFloat(getComputedStyle(paragraph).fontSize);
          const gap = parseFloat(getComputedStyle(work.parentElement.parentElement).marginTop) || 12;
          for (let font = base; font >= base * 0.6; font -= 0.5) {
            rc.style.setProperty('--reading-font', font + 'px');
            if (rc.getBoundingClientRect().bottom <= answer.getBoundingClientRect().top - gap) break;
          }
        }
      },
    },
  },
});
