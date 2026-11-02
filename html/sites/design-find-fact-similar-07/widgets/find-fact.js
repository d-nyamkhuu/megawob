// Adds a Clear All control, a custom source briefing, and emphasis in the instruction text.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-similar-07',
  name: 'design',
  split: 'train',
  scenarios: ['similar'],
  template: 'find-fact/similar',
  design: {
    briefText: 'Select the words that mean the same or a very similar meaning as the source words.',
    parts: {
      briefing: (base, S) => (ctx) => {
        const brief = S.D.briefSelector && document.querySelector(S.D.briefSelector);
        if (!brief) return;
        ctx.util.el('b', 'ds-source-label', brief, 'Source words:');
        ctx.util.el('div', 'ds-words', brief, ctx.spec.given.join('\n'));
        ctx.util.el('hr', 'ds-rule', brief);
        ctx.util.el('h3', 'ds-help-title', brief, 'Instructions:');
        ctx.util.el('p', 'ds-note', brief, S.D.briefText);
      },
      rendered: (base, S) => (ctx, frame, up) => {
        for (const note of document.querySelectorAll('.ds-instruction')) {
          const text = note.textContent;
          const terms = [...ctx.spec.given, 'Submit', 'Select words'];
          const hits = [];
          for (const term of terms) {
            let at = text.indexOf(term);
            while (at !== -1) {
              hits.push({ at, term });
              at = text.indexOf(term, at + term.length);
            }
          }
          hits.sort((a, b) => a.at - b.at);
          note.textContent = '';
          let cursor = 0;
          for (const hit of hits) {
            if (hit.at < cursor) continue;
            note.append(document.createTextNode(text.slice(cursor, hit.at)));
            ctx.util.el('strong', '', note, hit.term);
            cursor = hit.at + hit.term.length;
          }
          note.append(document.createTextNode(text.slice(cursor)));
        }
      },
      ready: (base, S) => (ctx, B) => {
        base(ctx, B);
        const { ch, up, mark } = B;
        const clear = ctx.util.el('button', 'ds-clear', document.querySelector('.ds-footer'), 'Clear All');
        clear.type = 'button';
        clear.addEventListener('click', () => {
          ch.set([]);
          up({ values: [] });
          mark(ctx.model);
        });
      },
    },
  },
});
