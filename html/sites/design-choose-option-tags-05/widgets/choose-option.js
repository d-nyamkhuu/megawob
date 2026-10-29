// Design on templates/choose-option/base.js: the base site's choose-option widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-tags-05',
  name: 'design',
  split: 'train',
  scenarios: ['tags'],
  template: 'choose-option/base',
  design: {
    parts: {
      place: (base) => (card, ctx, popup) => {
        base(card, ctx, popup);
        const row = ctx.stage.parentElement.querySelector('.hz-title-row');
        const pad = row ? row.getBoundingClientRect().left - ctx.stage.getBoundingClientRect().left : Math.max(24, Math.min(40, ctx.size.width * .034));
        Object.assign(card.style, {
          left: pad + 'px', top: Math.round(ctx.size.height * .346) + 'px',
          width: Math.max(250, ctx.size.width - pad * 2) + 'px',
          height: Math.min(210, Math.round(ctx.size.height * .29)) + 'px'
        });
      },
      renderCard: (base) => (ctx, options) => {
        const result = base(ctx, options);
        const input = ctx.stage.querySelector('.fp-chipin');
        if (input) { input.placeholder = ''; input.focus({ preventScroll: true }); }
        return result;
      }
    }
  },
});
