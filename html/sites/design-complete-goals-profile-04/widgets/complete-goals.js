// Design of this site on the composition/sections template (templates/complete-goals/sections.js).
env.widget({
  task: 'complete-goals',
  site: 'design-complete-goals-profile-04',
  name: 'design',
  split: 'train',
  scenarios: ['profile'],
  template: 'complete-goals/sections',
  design: {
    // Keep the template's sampling and fitting work, but arrange a profile's three
    // widgets as two stacked fields beside the color controls.
    parts: {
      card() {
        return (ctx, host, part, i, look) => ctx.util.el('section', `cp-card ${look.style}`, host);
      },
      label(base) {
        return (ctx, card, part, i, look) => {
          const label = base(ctx, card, part, i, look);
          const legend = ctx.util.el('div', 'cp-label win95-group-label', card);
          if (label) {
            legend.append(...label.childNodes);
            label.remove();
          } else {
            ctx.util.el('span', '', legend, part.label);
          }
          card.prepend(legend);
          return legend;
        };
      },
      attempts(base) {
        return (ctx, look, W) => {
          const fallback = base(ctx, look, W);
          if (ctx.spec.parts.length !== 3 || W < 760) return fallback;
          look.grid = true;
          const gap = Math.max(10, Math.min(18, look.gap));
          return [{ grid: true, colW: Math.floor((W - gap - 28) / 2) }, ...fallback.slice(1)];
        };
      },
    },
  },
});
