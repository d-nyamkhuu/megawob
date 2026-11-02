// Designs on templates/choose-option/base.js: the base site's choose-option widgets, unchanged; this composite site embeds
// them by name (it carried a verbatim copy of sites/base/widgets/choose-option.js).
for (const name of ['widgets', 'segmented', 'select2', 'dense']) {
  env.widget({ task: 'choose-option', name, template: 'choose-option/base', design: { widget: name } });
}
