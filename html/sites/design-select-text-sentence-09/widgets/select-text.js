// Uses the shared paragraphs template with this site's type scale and overflow fallback.
env.widget({
  task: 'select-text',
  site: 'design-select-text-sentence-09',
  name: 'design',
  split: 'train',
  scenarios: ['sentence'],
  traits: { pane: true, marks: true },
  template: 'select-text/paragraphs',
  design: {
    fontMax: 26,
    fontDivisor: 38,
    parts: {
      fitFull: (base, S) => (ctx, room) => {
        while (S.card.getBoundingClientRect().height > room && S.font > 10) {
          S.font--;
          S.P.fit(ctx);
        }
        if (S.card.getBoundingClientRect().height > room) {
          S.textEl.style.setProperty('padding-top', '8px', 'important');
          S.textEl.style.setProperty('padding-bottom', '8px', 'important');
          S.textEl.style.setProperty('line-height', '1.4', 'important');
          S.textEl.querySelectorAll('p + p').forEach((p) => p.style.setProperty('margin-top', '4px', 'important'));
          while (S.card.getBoundingClientRect().height > room && S.font > 8) {
            S.font -= 0.5;
            S.P.fit(ctx);
          }
        }
      },
    },
  },
});
