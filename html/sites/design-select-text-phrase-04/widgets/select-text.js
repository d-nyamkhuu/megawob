// Motif design adds full-document scroll arrows and paragraph selection on triple-click.
env.widget({
  task: 'select-text',
  site: 'design-select-text-phrase-04',
  name: 'design',
  split: 'train',
  scenarios: ['phrase'],
  traits: { pane: true, marks: true, triple: true },
  template: 'select-text/paragraphs',
  design: {
    tripleClick: 'exact',
    parts: {
      textCreated: (base, S) => (ctx) => {
        base(ctx);
        if (S.pane) return;
        S.card.classList.add('full-document');
        const rail = ctx.util.el('div', 'document-rail', S.card);
        const up = ctx.util.el('button', 'document-arrow', rail, '▲');
        ctx.util.el('div', 'document-track', rail);
        const down = ctx.util.el('button', 'document-arrow', rail, '▼');
        up.type = down.type = 'button';
        up.setAttribute('aria-label', 'Scroll document up');
        down.setAttribute('aria-label', 'Scroll document down');
        up.onclick = () => { S.textEl.scrollTop -= S.textEl.clientHeight * .8; };
        down.onclick = () => { S.textEl.scrollTop += S.textEl.clientHeight * .8; };
      },
    },
  },
});
