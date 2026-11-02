/* type-text/scenarios/sections.js: sections scenario sampling. */
(function () {
  'use strict';

  const { GROUPS, person, addressOf, makeField, oldValue, SAVE_LABELS } = env.taskOf('type-text').lib;

  env.scenario('type-text', {
    name: 'sections',
    sample(g, spec) {
      const r = g.rng;
      const nSec = g.level === 'easy' ? 2 : g.level === 'medium' ? 3 : g.ood ? r.int(4, 5) : r.int(2, 4); // GROUPS has 7
      const groups = r.sample(GROUPS, nSec);
      // Older values for the fields that change: another person and address of the same locale.
      const old = { ...g, person: person(g), addr: addressOf(g) };
      spec.fields = [];
      spec.sections = groups.map((grp, k) => {
        const kinds = r.sample(grp.kinds, Math.min(grp.kinds.length, g.level === 'easy' ? 2 : r.int(2, 3)));
        const fs = kinds.map((kind) => makeField(g, kind, kind, { section: k }));
        spec.fields.push(...fs);
        return { title: r.pick(grp.titles), ids: fs.map((f) => f.id) };
      });
      // 1-3 fields change (3-4 with ood); the first always sits on a non-default tab/section.
      const later = spec.fields.filter((f) => f.section > 0);
      const nAsk = Math.min(spec.fields.length - 1, g.level === 'easy' ? 1 : g.level === 'medium' ? 2 : g.ood ? r.int(3, 4) : r.int(1, 3));
      const first = r.pick(later);
      const rest = r.sample(spec.fields.filter((f) => f !== first && (r.bool(0.5) || f.section > 0)), nAsk - 1);
      const asked = new Set([first, ...rest]);
      for (const f of spec.fields) {
        f.from = asked.has(f) ? (r.bool(0.2) ? '' : oldValue(old, f)) : f.target;
      }
      const askOrder = spec.fields.filter((f) => asked.has(f)).map((f) => f.id);
      let ask = askOrder;
      for (let k = 0; k < 6 && ask.length > 1 && ask.join() === askOrder.join(); k++) ask = r.shuffle(askOrder);
      spec.ask = ask;
      spec.panes = r.pick(['tabs', 'tabs', 'accordion']);
      spec.title = r.pick([
        'Account settings', 'Edit profile', 'Your account', 'Profile settings', 'Member details', 'Preferences',
        'Account overview', 'Your information', 'Account center', 'Personal area', 'Personal profile'
      ]);
      spec.save = r.bool(0.65);
      if (spec.save) spec.saveLabel = r.pick(SAVE_LABELS);
      spec.route = r.bool(0.25) ? 'tab' : 'click';
      spec.enter = spec.save && r.bool(0.4);
      spec.tellSection = r.bool(0.3);
    },
  });
})();
