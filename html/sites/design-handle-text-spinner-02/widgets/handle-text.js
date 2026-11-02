// Site design on templates/handle-text/editor.js; shared behavior and part signatures are documented there.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-spinner-02',
  name: 'design',
  split: 'train',
  scenarios: ['spinner'],
  template: 'handle-text/editor',
  design: {
    previewTitle: 'About This Setting', previewSubtitle: '',
    previewText: 'The volume controls how loud the audio is played through your device. You can use the arrows, your keyboard, or your mouse wheel to adjust the value.',
    spinnerDescription: 'Sets the output volume for audio playback.',
    parts: {
      spinnerPreview: (base, S) => (ctx, view) => {
        base(ctx, view);
        const rw = view.card.querySelector('.ut-fieldrow');
        if (rw) {

          const visual=ctx.util.el('div','volume-slider',rw);
          const low=ctx.util.el('span','speaker low',visual);low.innerHTML='<svg viewBox="0 0 24 32" aria-hidden="true"><path d="M2 12h6l9-8v32l-9-8H2z"/></svg>';
          const track=ctx.util.el('span','slider-track',visual);ctx.util.el('span','slider-fill',track);ctx.util.el('span','slider-knob',track);
          const high=ctx.util.el('span','speaker high',visual);high.innerHTML='<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M2 12h6l9-8v32l-9-8H2z"/><path d="M21 10c5 4 5 8 0 12M24 5c9 7 9 15 0 22" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
        }
      },
      renderResult: (base, S) => (ctx, view) => {
        const result = base(ctx, view);
        const sliderRow = view.card.querySelector('.ut-fieldrow');
        const sync = (m) => {
          result.sync(m);
          if (sliderRow) {
            const lo = ctx.spec.min ?? 0, hi = ctx.spec.max ?? 100;
            const pct = hi > lo ? Math.max(0, Math.min(100, (m.value - lo) / (hi - lo) * 100)) : 0;
            sliderRow.style.setProperty('--slider-pct', pct + '%');
          }
        };
        sync(ctx.model);
        return { anchors: result.anchors, sync };
      },
    },
  },
});
