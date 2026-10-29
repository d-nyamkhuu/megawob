// Designs on templates/type-text/base.js: the base site's type-text widgets, unchanged; this composite site embeds
// them by name (it carried a verbatim copy of sites/base/widgets/type-text.js).
for (const name of ['fields']) {
  env.widget({ task: 'type-text', name, template: 'type-text/base', design: { widget: name } });
}
