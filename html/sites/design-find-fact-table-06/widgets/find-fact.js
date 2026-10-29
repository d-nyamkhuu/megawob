// Adds personnel and answer headings plus fitted grid sizing and the site form footer.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-table-06',
  name: 'design',
  split: 'train',
  scenarios: ['table'],
  template: 'find-fact/table',
  design: {
    emptyLabel: 'Answer:',
    recordHeader: ['Field', 'Value'],
    parts: {
      source: (base, S) => (ctx, card, body) => {
        base(ctx, card, body);
        if (ctx.spec.kind === 'record') card.querySelector('h3').firstChild.textContent = 'Personnel Information';
      },
      answerTitle: (base, S) => (ctx, labels) => {
        base(ctx, labels);
        return 'Your Answer';
      },
      fit: (base, S) => (ctx, B) => {
        const { spec } = ctx;
        const { body, form, t, work } = B;
        const footer = document.querySelector('.ds-form-footer');
        if (footer) form.querySelector('.rl-card-b').appendChild(footer);
        base(ctx, B);
        if (spec.kind === 'grid') {
          let font = parseFloat(getComputedStyle(work).fontSize);
          let pad = font * 0.48;
          const available = () => work.getBoundingClientRect().bottom - 16 - t.getBoundingClientRect().top;
          for (let i = 0; i < 24; i++) {
            t.style.setProperty('--lookup-font', font + 'px');
            t.style.setProperty('--lookup-pad', pad + 'px');
            if (t.scrollWidth <= body.clientWidth + 1 && t.getBoundingClientRect().height <= available()) break;
            font *= 0.95;
            pad *= 0.88;
          }
        }
      },
    },
  },
});
