// Keeps this site's read-only preview, inspector values, fit, and placement.
env.widget({
  task: 'resize-element',
  site: 'design-resize-element-numeric-04',
  name: 'design',
  split: 'train',
  scenarios: ['numeric'],
  traits: { grips: ['se'] },
  template: 'resize-element/panel',
  design: {
    messages: [
      ['Alex', 'Hello!', '10:24'],
      ['Jamie', 'Hi there! ?', '10:25'],
      ['Taylor', 'Ready for the meeting?', '10:26'],
    ],
    currentFormat: 'plain',
    targetFormat: 'detailed',
    targetTolerance: true,
    parts: {
      body: (base, S) => (ctx) => {
        const body = base(ctx);
        ctx.util.el('div', 'rz-preview', S.frame.box, 'This is a read-only preview.');
        const selected = document.querySelectorAll('.selp .selected-value');
        if (selected.length === 4) {
          selected[0].textContent = ctx.spec.title;
          selected[2].textContent = `${ctx.spec.min.w} px × ${ctx.spec.min.h} px`;
          selected[3].textContent = `${ctx.spec.max.w} px × ${ctx.spec.max.h} px`;
        }
        return body;
      },
      briefing: (base, S) => (ctx) => {
        const gripNames = {
          se: 'bottom-right corner', sw: 'bottom-left corner', ne: 'top-right corner', nw: 'top-left corner',
          e: 'right edge', w: 'left edge', n: 'top edge', s: 'bottom edge',
        };
        const grip = gripNames[ctx.spec.grip];
        const sub = document.querySelector('.instruction-sub');
        if (sub) sub.textContent = `Drag the ${grip.replace(' corner', '').replace(' edge', '')} handle to resize the panel. Match the target size shown on the right.`;
        const firstStep = document.querySelector('.n-body li');
        if (firstStep) firstStep.textContent = `Drag the ${grip} of the ${ctx.spec.title} panel.`;
      },
      sizeText: (base) => (size, format) => format === 'detailed'
        ? base(size, format)
        : `${size.w} px × ${size.h} px`,
      fit: (base, S) => (ctx) => {
        const F = S.frame;
        return Math.min(1, (ctx.size.width - 24) / F.W, (ctx.size.height - F.well.offsetHeight - 52) / F.H);
      },
      decorate: (base, S) => (ctx, size) => {
        const box = S.frame.box;
        box.style.setProperty('--title-height', Math.min(52, Math.max(28, size.h * 0.17)) + 'px');
        box.style.setProperty('--preview-height', Math.min(44, Math.max(23, size.h * 0.145)) + 'px');
      },
      positionWell: (base, S) => (ctx, size) => {
        base(ctx, size);
        if (S.frame.well) S.frame.well.style.left = '18px';
      },
      place: (base, S) => (ctx) => {
        base(ctx);
        const F = S.frame;
        F.wrap.style.left = Math.max(2, 18 - F.o.x * F.zoom) + 'px';
        F.wrap.style.top = Math.max(2, 18 - F.o.y * F.zoom) + 'px';
      },
      anchors: (base, S) => () => {
        const F = S.frame;
        return F.refEl ? [F.area, F.refEl] : [F.area];
      },
    },
  },
});
