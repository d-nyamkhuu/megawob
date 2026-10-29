// Keeps the login card stacked and fits/clamps it inside the stage when needed.
env.widget({
  task: 'type-text',
  site: 'design-type-text-login-08',
  name: 'design',
  split: 'train',
  scenarios: ['login'],
  template: 'type-text/fields',
  design: {
    parts: {
      finish: (base) => (ctx, card) => {
        base(ctx, card);
        const cr = card.getBoundingClientRect();
        const ratio = Math.min(
          1,
          Math.max(1, ctx.size.height - 8) / cr.height,
          Math.max(1, ctx.size.width - 8) / cr.width,
        );
        if (ratio < 1) {
          card.style.setProperty('transform', `scale(${ratio})`, 'important');
          card.style.transformOrigin = 'center center';
        }
        // Preserve the reference offset where it fits; clamp it only in constrained stages.
        const bounds = ctx.stage.getBoundingClientRect();
        const rect = card.getBoundingClientRect();
        const dx = rect.left < bounds.left ? bounds.left - rect.left
          : rect.right > bounds.right ? bounds.right - rect.right : 0;
        const dy = rect.top < bounds.top ? bounds.top - rect.top
          : rect.bottom > bounds.bottom ? bounds.bottom - rect.bottom : 0;
        const style = getComputedStyle(card);
        if (dx) card.style.setProperty('left', `${parseFloat(style.left) + dx}px`, 'important');
        if (dy) card.style.setProperty('top', `${parseFloat(style.top) + dy}px`, 'important');
      },
    },
  },
});
