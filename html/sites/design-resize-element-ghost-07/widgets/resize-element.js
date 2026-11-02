// Chat panel design with this site's messages, title treatment, and workspace fit.
env.widget({
  task: 'resize-element',
  site: 'design-resize-element-ghost-07',
  name: 'design',
  split: 'train',
  scenarios: ['ghost'],
  traits: { grips: ['se'] },
  template: 'resize-element/panel',
  design: {
    messages: [
      ['Alex', 'Hey! Are you available for a quick sync?'],
      ['You', 'Yes, I can do 15 minutes.'],
      ['Alex', 'Great! I’ll share a few notes in here.'],
    ],
    titleClass: 'rz-name',
    titleControls: '–   □   ✕',
    zoomMax: 2.4,
    chromeWidth: 1200,
    fitPadX: 22,
    fitPadY: 22,
    extraScaleVar: '--render-scale',
    topFraction: 0,
    parts: {
      drawn: (base, S) => (ctx, size) => {
        const current = document.querySelector('[data-role="cur-size"]');
        if (current) current.textContent = `${size.w} × ${size.h} px`;
        const target = document.querySelector('[data-role="tgt-size"]');
        if (target && ctx.spec.target) target.textContent = `${ctx.spec.target.w} × ${ctx.spec.target.h} px`;
      },
    },
  },
});
