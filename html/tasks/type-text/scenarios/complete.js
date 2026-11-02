/* type-text/scenarios/complete.js: complete scenario sampling. */
(function () {
  'use strict';

  const { COMPLETE_KINDS, makeField, EXTRAS, plainField, SAVE_LABELS } = env.taskOf('type-text').lib;

  env.scenario('type-text', {
    name: 'complete',
    sample(g, spec) {
      const r = g.rng;
      const n = g.level === 'easy' ? 3 : g.level === 'medium' ? 4 : g.ood ? r.int(6, 7) : r.int(4, 5);
      const kinds = r.sample(COMPLETE_KINDS, n).sort((a, b) => COMPLETE_KINDS.indexOf(a) - COMPLETE_KINDS.indexOf(b));
      const fields = kinds.map((k) => makeField(g, k, k, { required: true }));
      // Optional fields: no value for them anywhere on the page or in the instruction, so they stay empty.
      const nOpt = g.level === 'easy' ? 0 : r.bool(0.75) ? r.int(1, 2) : 0;
      for (const id of r.sample(Object.keys(EXTRAS), nOpt)) {
        const k = EXTRAS[id];
        fields.splice(r.int(1, fields.length), 0, plainField(id, r.pick(k.labels), r.pick(k.ph), '', 'text', true));
      }
      spec.fields = fields;
      const req = fields.filter((f) => !f.blank);
      const nMiss = Math.min(req.length - 1, g.level === 'easy' ? 1 : g.level === 'medium' ? 2 : g.ood ? r.int(3, 4) : r.int(2, 3));
      const missing = new Set(r.sample(req, nMiss).map((f) => f.id));
      spec.missing = req.filter((f) => missing.has(f.id)).map((f) => f.id);
      spec.ask = spec.missing.slice();
      spec.source = r.bool(0.65) ? 'card' : 'instruction';
      // The record: every required field (label or an alias, the value as people write it) plus 0-2 facts
      // that have no form field; in an order of its own.
      // (Rows are built in profileRows() once the aliases are final.)
      spec.profile = { title: r.pick([
        'Your profile', 'Account summary', 'Saved details', 'Customer on file', 'Contact card', 'Reference sheet',
        'Member dossier', 'Client snapshot', 'Record digest', 'Source data'
      ]), rows: [] };
      spec.title = r.pick([
        'Checkout', 'Registration', 'Delivery details', 'Contact form', 'Account setup', 'Application form',
        'Personal record', 'Details page', 'Request details', 'Member file', 'Visitor form', 'Service file'
      ]);
      spec.save = r.bool(0.7);
      if (spec.save) spec.saveLabel = r.pick(SAVE_LABELS);
      spec.route = r.bool(0.25) ? 'tab' : 'click';
      spec.enter = spec.save && r.bool(0.4);
      spec.long = fields.length >= 8;
    },
  });
})();
