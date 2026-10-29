/*
 * click-control / widget: click-widget.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('click-control');
  const { cap, quote: q } = env.util;
  const C = env.content;
  const { keepIdxOf, T, WIDGET_NAMES } = fam.lib;

  const WIDGETS = ['radio', 'checkbox', 'text', 'textarea', 'button'];

  const WIDGET_WORDS = ['Express', 'Standard', 'Remember me', 'Newsletter', 'Berlin', 'Notes', 'Gift wrap', 'Monthly',
    'Yearly', 'Agree', 'Morning', 'Evening', 'Public', 'Private', 'Draft', 'Urgent', 'Pickup', 'Delivery', 'Weekly',
    'Dark mode', 'Email me', 'SMS', 'Large', 'Small', 'Medium', 'Blue', 'Green', 'Comment', 'Apply', 'Reset', 'Save',
    'Lisbon', 'Kyoto', 'Oslo', 'Notify', 'Auto', 'Manual', 'Yes', 'No', 'Maybe', 'Basic', 'Custom', 'Other', 'None',
    'All', 'Classic', 'Flexible', 'Local', 'Remote', 'Indoor', 'Outdoor', 'Personal', 'Shared', 'Home', 'Work',
    'Today', 'Tomorrow', 'Weekend', 'Address', 'Open', 'Closed', 'Active', 'Paused', 'Pending', 'Complete', 'Optional',
    'Required', 'Enabled', 'Disabled', 'Red', 'Yellow', 'Purple', 'Gray', 'Orange', 'Black', 'White', 'Name',
    'Subject', 'Message', 'Category', 'Continue', 'Cancel', 'Search', 'Upload', 'Download', 'Refresh', 'Preview',
    'Edit', 'Delete', 'Username', 'Phone', 'City', 'Language', 'Timezone', 'Website', 'Company', 'First name',
    'Last name', 'Theme', 'Font', 'Compact', 'Spacious', 'Single', 'Breakfast', 'Lunch', 'Dinner', 'Coffee', 'Tea',
    'Water', 'Vanilla', 'Chocolate', 'North', 'South', 'East', 'West', 'Province', 'Street', 'Apartment', 'Floor',
    'Bookmark', 'Schedule', 'Purpose', 'Occasion', 'Method', 'Profile', 'Account', 'Region', 'Country', 'District',
    'Building', 'Suite', 'Entrance', 'Reference', 'Feedback', 'Rating', 'Quantity', 'Material', 'Format', 'Layout',
    'Portrait', 'Landscape', 'Hourly', 'Seasonal', 'Courier', 'On site', 'English', 'Spanish', 'French', 'Japanese',
    'Current', 'Default', 'Available', 'Featured', 'Popular', 'Recent', 'Archived', 'Queued', 'Visible'];

  function sampleWidget(rng, ctx) {
    const n = ctx.ood ? rng.int(7, 8) : 5;
    for (;;) {
      const widgets = [];
      for (let i = 0; i < n; i++) {
        const type = rng.pick(WIDGETS);
        const text = rng.bool(0.25) ? [...Array(rng.int(1, 6))].map(() => rng.pick('abcdefghijklmnopqrstuvwxyz'.split(''))).join('')
          : C.pick(rng, WIDGET_WORDS, ctx.o);
        widgets.push({ type, text });
      }
      if (new Set(widgets.map((w) => w.type)).size < 2) continue;
      return { widgets, target: rng.pick(widgets).type };
    }
  }

  env.scenario('click-control', {
    name: 'widget',
    sample: sampleWidget,
    correct: (spec, key) => !!spec.widgets[key] && spec.widgets[key].type === spec.target,
    result: (spec, key) => `${cap(WIDGET_NAMES[spec.widgets[key].type][0])} selected`,
    wrongFinal(spec, rng) {
      const ks = spec.widgets.map((w, i) => (w.type !== spec.target ? i : -1)).filter((i) => i >= 0);
      return ks.length ? { key: rng.pick(ks) } : null;
    },
    planStep(model, spec) {
      return { click: { widget: spec.widgets.findIndex((w) => w.type === spec.target) } };
    },
    level(spec, lv, r) {
      const easy = lv >= 1;
      const k = (e, m) => (easy ? e : m);
      const keep = keepIdxOf(r, spec.widgets, (w, i) => i === spec.widgets.findIndex((x) => x.type === spec.target), k(2, 3));
      const ws = keep.map((i) => spec.widgets[i]);
      if (new Set(ws.map((w) => w.type)).size >= 2) spec.widgets = ws;
    },
    phrase(spec, rng, P) {
      let core, terse, steps;
      const names = WIDGET_NAMES[spec.target];
      const name = rng.pick(names);
      core = P(T.widget, { q: q(spec.target), name, names: `${name}${name.endsWith('x') ? 'es' : 's'}` });
      return { core, terse, steps };
    },
    phKind: () => 'widget',
    retarget: (spec, model, rng, out, other) => other([...new Set(spec.widgets.map((w) => w.type))], spec.target),
  });
})();
