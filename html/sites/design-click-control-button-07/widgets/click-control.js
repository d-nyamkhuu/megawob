// Design of this site on the click-control/controls template: preserve its compact surface and reclaim unused ledger space when controls overflow.
env.widget({
  task: 'click-control',
  site: 'design-click-control-button-07',
  name: 'design',
  split: 'train',
  scenarios: ['button'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    parts: {
      rendered: () => (ctx, page) => {
        const surface = page.querySelector('.uc-surface');
        const ledger = ctx.stage.parentElement.querySelector('.rb-ledger');
        if (surface && ledger) {
          const children = Array.from(surface.children).filter((el) => el.getClientRects().length);
          const lastBottom = Math.max(
            ctx.stage.getBoundingClientRect().top,
            ...children.map((el) => el.getBoundingClientRect().bottom),
          );
          const overflow = Math.ceil(lastBottom + 8 - ctx.stage.getBoundingClientRect().bottom);
          if (overflow > 0) {
            const minimum =
              ledger.querySelector('.rb-ph').getBoundingClientRect().height +
              ledger.querySelector('table').getBoundingClientRect().height +
              2;
            ledger.style.height = Math.max(minimum, ledger.getBoundingClientRect().height - overflow) + 'px';
          }
        }
      },
    },
  },
});
