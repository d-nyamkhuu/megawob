/* type-text/scenarios/validation-fix.js: validation-fix scenario sampling. */
(function () {
  'use strict';

  const { makeField, phone, corrupt, KINDS, SAVE_LABELS, kindWords } = env.taskOf('type-text').lib;

  env.scenario('type-text', {
    name: 'validation-fix',
    sample(g, spec) {
      const r = g.rng;
      const fixable = ['email', 'first', 'last', 'username', 'dob', 'order', 'zip', 'phoneDigits'];
      let inv = null;
      let bad = null;
      for (let k = 0; k < 20 && !bad; k++) {
        const pick = r.pick(fixable);
        inv = pick === 'phoneDigits' ? null : makeField(g, pick, pick);
        if (pick === 'phoneDigits') {
          const raw = phone(g);
          inv = makeField(g, 'phone', 'phone');
          Object.assign(inv, { target: raw.replace(/\D/g, ''), say: raw, check: 'digits', placeholder: 'Digits only', mask: undefined });
          delete inv.mask;
          if (!/\(digits only\)$/.test(inv.label) && r.bool(0.5)) inv.label += ' (digits only)';
        }
        if (inv.check === 'upper' && !/[A-Z]/.test(inv.target)) continue;
        bad = corrupt(g, inv);
      }
      const n = g.level === 'easy' ? 2 : g.level === 'medium' ? 3 : g.ood ? r.int(5, 7) : r.int(3, 5);
      const others = r.sample(Object.keys(KINDS).filter((k) => k !== inv.kind && k !== 'card'), n - 1).map((k) => makeField(g, k, k));
      // The other fields must pass validation as they are.
      spec.fields = r.shuffle([inv, ...others]);
      spec.invalid = { id: inv.id, how: bad.how, message: bad.message, bad: bad.bad };
      spec.ask = [inv.id];
      spec.title = r.pick([
        'Edit profile', 'Account settings', 'Shipping details', 'Your information', 'Update contact details',
        'Profile management', 'Contact overview', 'Account overview', 'Personal data', 'Manage your account'
      ]);
      spec.save = true;
      spec.saveLabel = r.pick(SAVE_LABELS);
      spec.enter = r.bool(0.4);
      spec.route = 'click';
      spec.long = spec.fields.length >= 7;
      // How the instruction refers to the field: not at all (the visible error tells which), or by its kind.
      const nr = r.fork('name');
      const says = kindWords(inv, spec.fields);
      spec.nameBy = says.length && nr.bool(0.5) ? 'kind' : 'error';
      if (spec.nameBy === 'kind') spec.invalid.say = nr.pick(says);
    },
  });
})();
