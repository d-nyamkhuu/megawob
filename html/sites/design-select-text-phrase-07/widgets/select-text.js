// Adds the calm-afternoon heading, wider type, fitted room, and pane scroll behavior.
env.widget({
  task: 'select-text',
  site: 'design-select-text-phrase-07',
  name: 'design',
  split: 'train',
  scenarios: ['phrase'],
  traits: { pane: true, marks: true },
  template: 'select-text/paragraphs',
  design: {
    clearSelection: true,
    parts: {
      font: () => (ctx) => Math.min(25, ctx.size.width / 32),
      begin: () => (ctx) => {
        ctx.util.el('h1', 'document-heading', ctx.stage, 'A Calm Afternoon');
      },
      room: (base, S) => (ctx) => {
        const stageStyle = getComputedStyle(ctx.stage);
        const stageBox = ctx.stage.getBoundingClientRect();
        const cardBox = S.card.getBoundingClientRect();
        return Math.max(1, stageBox.bottom - parseFloat(stageStyle.paddingBottom) - cardBox.top - ctx.size.width * 0.035);
      },
      preparePane: (base, S) => () => {
        // The scrolling card measures its frame at its natural height.
        S.card.style.setProperty('height', 'auto', 'important');
      },
      sync: (base, S) => (m) => {
        if (S.scroller && m.pane) S.scroller.to(m.pane.scroll);
        S.sel.set(m);
      },
    },
  },
});
