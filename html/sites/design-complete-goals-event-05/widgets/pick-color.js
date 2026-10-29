// Designs on templates/pick-color/base.js: the base site's pick-color widgets, unchanged; this composite site embeds
// them by name (it carried a verbatim copy of sites/base/widgets/pick-color.js).
const registryColorParts = {
    buildPicker: (base, S) => (ctx, card, maxH) => base(ctx, card, Math.min(maxH, Math.max(S.F().helpers.MIN_TRACK_PX, Math.min(150, ctx.size.width - 70)))),
};
for (const name of ['picker', 'wheel', 'rgb', 'hsl', 'vanilla', 'popover']) {
  env.widget({ task: 'pick-color', name, template: 'pick-color/base', design: { widget: name, parts: registryColorParts } });
}
