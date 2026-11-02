// Designs on templates/set-slider/base.js: the base site's set-slider widgets, unchanged; this composite site embeds
// them by name (it carried a verbatim copy of sites/base/widgets/set-slider.js).
for (const name of ['classic', 'settings', 'arc', 'nouislider', 'rcslider', 'mui', 'video']) {
  env.widget({ task: 'set-slider', name, template: 'set-slider/base', design: { widget: name } });
}
