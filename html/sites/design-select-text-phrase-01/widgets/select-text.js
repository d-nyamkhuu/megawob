// This phrase design reads keyboard selection changes and adapts type and fit to the stage panel.
env.widget({
  task: 'select-text',
  site: 'design-select-text-phrase-01',
  name: 'design',
  split: 'train',
  scenarios: ['phrase'],
  traits: { pane: true, marks: true },
  template: 'select-text/paragraphs',
  design: {
    readKeyup: true,
    parts: {
      font: (base, S) => (ctx, width) => ctx.stage.closest('.with-panel')
        ? base(ctx, width)
        : Math.min(S.D.fontMax, Math.round(ctx.size.width / 59)),
      fitPane: (base, S) => (ctx) => {
        S.pane.parentElement.style.flex = 'none';
        S.pane.style.flexShrink = '0';
        S.pane.style.height = '0px';
        const cardStyle = getComputedStyle(S.card);
        const avail = Math.max(1, S.card.clientHeight - parseFloat(cardStyle.paddingTop) - parseFloat(cardStyle.paddingBottom));
        const full = () => S.textEl.getBoundingClientRect().height;
        while (S.font > 13 && 0.45 * full() > avail) {
          S.font--;
          S.P.fit(ctx);
        }
        const view = Math.floor(Math.min(avail, Math.max(160, full() * ctx.rng.float(0.4, 0.62))));
        S.pane.style.height = view + 'px';
      },
      prepareFull: (base, S) => (ctx, room) => {
        const cardStyle = getComputedStyle(S.card);
        const textRoom = room - parseFloat(cardStyle.paddingTop) - parseFloat(cardStyle.paddingBottom) - 2;
        S.textEl.style.height = Math.max(1, textRoom) + 'px';
      },
    },
  },
});
