/* type-text/scenarios/multi.js: multi scenario sampling. */
(function () {
  'use strict';

  const { sampleMulti, KINDS, EXTRAS, plainField, DISABLED, SAVE_LABELS } = env.taskOf('type-text').lib;

  env.scenario('type-text', {
    name: 'multi',
    sample(g, spec) {
      const n = g.level === 'easy' ? 2 : g.level === 'medium' ? 3 : g.ood ? g.rng.int(7, 9) : g.rng.int(3, 5);
      let fill = sampleMulti(g, spec, Object.keys(KINDS), n);
      // The first/last name pair keeps related aliases apart (never "name" for both).
      const nExtra = g.level === 'easy' ? 0 : g.level === 'medium' ? (g.rng.bool(0.3) ? 1 : 0) : g.rng.bool(0.45) ? g.rng.int(1, 2) : 0;
      const extra = g.rng.sample(Object.keys(EXTRAS), nExtra).map((id) => {
        const k = EXTRAS[id];
        return plainField(id, g.rng.pick(k.labels), g.rng.pick(k.ph), '', 'text', true);
      });
      const nDis = g.level === 'easy' ? 0 : g.level === 'medium' ? (g.rng.bool(0.25) ? 1 : 0) : g.rng.bool(0.35) ? g.rng.int(1, 2) : 0;
      const dis = g.rng.sample(Object.keys(DISABLED), nDis).map((id) => {
        const k = DISABLED[id];
        const v = k.gen(g);
        return plainField(id, g.rng.pick(k.labels), '', v, 'text', false, { disabled: true });
      });
      fill = fill.concat(extra);
      spec.fields = g.rng.shuffle(fill);
      // Disabled decoys sit at the top or bottom of the form, like read-only account facts.
      for (const d of dis) spec.fields.splice(g.rng.bool(0.5) ? 0 : spec.fields.length, 0, d);
      const formOrder = spec.fields.filter((f) => !f.blank && !f.disabled).map((f) => f.id);
      let ask = formOrder;
      for (let k = 0; k < 10 && ask.join() === formOrder.join(); k++) ask = g.rng.shuffle(formOrder);
      spec.ask = ask;
      spec.title = g.rng.pick(['Contact details', 'Shipping information', 'Customer record', 'Registration',
        'Update your profile', 'Order lookup', 'Account details', 'Personal information', 'Billing details',
        'Member information', 'Directory entry', 'Guest details', 'Form information', 'Application record',
        'Service record', 'Request details', 'Visitor information']);
      spec.save = g.rng.bool(0.5);
      if (spec.save) spec.saveLabel = g.rng.pick(SAVE_LABELS);
      spec.route = g.rng.bool(0.25) ? 'tab' : 'click';
      spec.enter = spec.save && g.rng.bool(0.4);
      spec.long = spec.fields.length >= 8;
    },
  });
})();
