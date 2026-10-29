// Designs on templates/set-slider/base.js: the base site's set-slider widgets, unchanged; this composite site embeds
// them by name (it carried a verbatim copy of sites/base/widgets/set-slider.js).
const plannerSliderParts = {
  makeSlider: (base) => (ctx, parent, index, spec, geometry) => base(ctx, parent, index, spec,
    geometry.vertical ? geometry : { ...geometry, rail: Math.max(10, geometry.rail), thumb: Math.max(24, geometry.thumb),
      thumbBox: [Math.max(22, geometry.thumb), Math.max(28, geometry.thumb)],
      length: Math.max(120, Math.min(geometry.length, ctx.size.width - 100)) }),
  makeNative: (base) => (ctx, parent, index, spec, geometry) => base(ctx, parent, index, spec,
    { ...geometry, rail: Math.max(10, geometry.rail), thumb: Math.max(24, geometry.thumb),
      length: Math.max(120, Math.min(geometry.length, ctx.size.width - 100)) }),
};
for (const name of ['classic', 'settings', 'arc', 'nouislider', 'rcslider', 'mui', 'video']) {
  env.widget({ task: 'set-slider', name, template: 'set-slider/base', design: { widget: name, parts: plannerSliderParts } });
}
