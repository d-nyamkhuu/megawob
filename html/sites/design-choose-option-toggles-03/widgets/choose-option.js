// Keep the classic settings layout within the space assigned to the form.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-toggles-03',
  name: 'design',
  split: 'train',
  scenarios: ['toggles'],
  template: 'choose-option/base',
  design: {
    parts: {
      CSS3: () => `
        .ds-stage .fp-card { height: 100%; }
        .ds-stage .ds-toggle-card { position: absolute; display: flex; flex-direction: column; min-height: 0; padding: 10px 10px 8px; box-sizing: border-box; }
        .ds-stage .ds-toggle-card.compact .fp-td { display: none; }
        .ds-stage .fp-title, .ds-stage .fp-note { display: none; }
        .ds-stage .fp-field { margin: 0; flex: 1; min-height: 0; }
        .ds-stage .fp-trows { display: flex; flex-direction: column; height: 100%; gap: 0; }
        .ds-stage .fp-trow { flex: 1 1 0; min-height: 0; gap: 18px; padding: 0 10px; }
        .ds-stage .fp-td { margin-top: 3px; white-space: normal; }
        .ds-stage .fp-switch { width: 82px; height: min(47px, calc(var(--ds-row-height) - 6px)); margin: 0 55px 0 0; }
        .ds-stage .fp-switch::after { width: 34px; height: calc(100% - 8px); }
        .ds-stage .fp-onoff { width: 0; overflow: hidden; }
        @media (max-width: 1250px) {
          .ds-stage .fp-switch { width: 68px; height: min(40px, calc(var(--ds-row-height) - 6px)); margin-right: 48px; }
          .ds-stage .fp-switch::after { width: 29px; }
        }
        @media (max-height: 720px) {
          .ds-stage .fp-trow { padding: 0 8px; }
          .ds-stage .fp-switch { height: min(34px, calc(var(--ds-row-height) - 6px)); }
        }
      `,
      renderCard: (base) => (ctx, options) => {
        // Build with the template, preserving its random draws and task wiring.
        const result = base(ctx, options);
        const card = result.anchors[0];
        // The imported frame stylesheet offsets .fp-card by 3% with !important.
        // Use this design's own frame class so it cannot displace the form.
        card.classList.replace('fp-card', 'ds-toggle-card');
        Object.assign(card.style, {
          left: '0px', top: '0px',
          width: ctx.size.width + 'px', height: ctx.size.height + 'px',
        });
        card.style.setProperty('--ds-row-height',
          Math.max(1, (ctx.size.height - 22) / ctx.spec.items.length) + 'px');
        return result;
      },
    },
  },
});
