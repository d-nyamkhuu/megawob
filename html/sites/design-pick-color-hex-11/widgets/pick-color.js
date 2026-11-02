// Design on templates/pick-color/picker.js.
env.widget({
  task: 'pick-color',
  site: 'design-pick-color-hex-11',
  name: 'design',
  split: 'train',
  scenarios: ['hex'],
  traits: { controls: 'sv+hue' },
  template: 'pick-color/picker',
  design: {
    css: '', unitHeight: null, resetEvent: null,
    sampleSize: false, sidePlacement: 'none', place: false, measured: false,
    svStyle: null, hueStyle: null, knobStyle: null,
    sideRows: 'values', editableRows: false, prependCurrent: true, clear: true,
    currentClass: '', forceTarget: true, targetSwatch: true, targetCode: 'hex',
    targetLabel: 'Target Color', drawCurrentLabel: false, reverseHue: false,
    targetClass: 'organizer-target', targetParent: '.head', toleranceText: ['(ΔE00 ≤ ', ')'],
    parts: {
      fit: (base, S) => (ctx, card, maxH) => {
        const g = base(ctx, card, maxH);
        const H = Math.max(S.task.helpers.MIN_TRACK_PX, Math.min(ctx.size.width * .46, ctx.size.height * .72));
        return { ...g, W: Math.max(S.task.helpers.MIN_TRACK_PX, ctx.size.width * .485), H, hueH: H };
      },
    },
  },
});
