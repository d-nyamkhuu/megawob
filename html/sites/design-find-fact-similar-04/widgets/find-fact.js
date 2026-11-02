// Keeps the site's two-column option flow, briefing copy, Clear All action, and emphasized instruction words.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-similar-04',
  name: 'design',
  split: 'train',
  scenarios: ['similar'],
  template: 'find-fact/similar',
  design: {
    briefText: 'Choose all the words that are similar in meaning to the given words.',
    wordRows: 2,
    parts: {
      rendered: (base, S) => (ctx) => {
        const clear = document.querySelector('.ds-clear');
        if (clear) clear.addEventListener('click', () => {
          ctx.update({ ...ctx.model, values: [] });
          S.view.sync(ctx.model);
        });
        const note = document.querySelector('.ds-instruction');
        if (note && ctx.spec.given) {
          const words = [...ctx.spec.given, 'Submit'];
          const text = note.textContent;
          note.textContent = '';
          let cursor = 0;
          while (cursor < text.length) {
            let at = text.length;
            let match = '';
            words.forEach((word) => {
              const pos = text.toLowerCase().indexOf(word.toLowerCase(), cursor);
              if (pos >= 0 && pos < at) {
                at = pos;
                match = word;
              }
            });
            note.append(document.createTextNode(text.slice(cursor, at)));
            if (!match) break;
            ctx.util.el('strong', '', note, text.slice(at, at + match.length));
            cursor = at + match.length;
          }
        }
      },
    },
  },
});
