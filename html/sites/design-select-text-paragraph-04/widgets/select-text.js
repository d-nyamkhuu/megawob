// This paragraph design keeps the original font and stage-fit sizing and selection feedback.
env.widget({
  task: 'select-text',
  site: 'design-select-text-paragraph-04',
  name: 'design',
  split: 'train',
  scenarios: ['paragraph'],
  traits: { pane: true, marks: true, triple: true },
  template: 'select-text/paragraphs',
  design: {
    fontMax: 28,
    fontDivisor: 43,
    clearSelection: true,
    parts: {
      room: () => (ctx) => ctx.stage.clientHeight - 4,
      show: () => (m) => {
        const selected = m.start !== m.end;
        const status = document.querySelector('.selection-status');
        const ring = document.querySelector('.ring');
        const clear = document.querySelector('.clear-selection');
        if (status) status.textContent = selected ? 'Text selected.' : 'No paragraph selected yet.';
        if (ring) ring.classList.toggle('selected', selected);
        if (clear) clear.hidden = !selected;
      },
      bound: (base, S) => (ctx) => {
        base(ctx);
        S.P.show(ctx.model);
      },
    },
  },
});
