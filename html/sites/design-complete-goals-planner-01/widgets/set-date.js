// Designs on templates/set-date/base.js: the base site's set-date widgets, unchanged; this composite site embeds
// them by name (it carried a verbatim copy of sites/base/widgets/set-date.js).
for (const name of ['calendar', 'jqui', 'bootstrap', 'inline']) {
  env.widget({ task: 'set-date', name, template: 'set-date/base', design: { widget: name } });
}
