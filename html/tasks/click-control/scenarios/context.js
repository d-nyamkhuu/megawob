/*
 * click-control / context: right-click context menu.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('click-control');
  const { cap, quote: q } = env.util;
  const { fileItems, pickIn, rowKey, T, VERB } = fam.lib;

  const CONTEXT_ACTIONS = ['Open', 'Open with…', 'Preview', 'Rename', 'Duplicate', 'Copy', 'Copy link', 'Download',
    'Move to…', 'Move to trash', 'Add to favorites', 'Share', 'Compress', 'Get info', 'Make a copy', 'Print', 'Edit',
    'Cut', 'Restore', 'Pin', 'Unpin', 'Lock', 'Unlock', 'Hide', 'Unhide', 'Encrypt', 'Decrypt', 'Extract', 'Select',
    'Deselect', 'Flag', 'Unflag', 'Sync', 'Pause syncing', 'Resume syncing', 'Back up', 'Version history',
    'Copy name of', 'Mount', 'Unmount', 'Quarantine', 'Run', 'Upload', 'Publish', 'Unpublish', 'Repair', 'Read aloud',
    'Summarize', 'Rasterize', 'Reindex', 'Count words in'];

  function sampleContext(rng, ctx) {
    const { o, ood } = ctx;
    const items = fileItems(rng, ood ? rng.int(10, 12) : rng.int(5, 8), o);
    const labels = rng.sample(CONTEXT_ACTIONS, ood ? rng.int(8, 10) : rng.int(5, 7));
    const actions = labels.map((label) => ({ key: label, label }));
    actions.forEach((a, i) => { if (i > 0 && rng.bool(0.2)) a.sep = true; });
    const enabled = actions.slice();
    if (rng.bool(0.5)) {
      const d = rng.pick(actions);
      d.disabled = true;
    }
    const target = { item: rng.pick(items).key, action: rng.pick(enabled.filter((a) => !a.disabled)).key };
    return { layout: rng.pick(['grid', 'list']), items, actions, target };
  }

  env.scenario('click-control', {
    name: 'context',
    sample: sampleContext,
    baseModel(spec, c) {
      return { menuFor: null, ...c };
    },
    progress: (model, spec) => model.menuFor === spec.target.item ? 0.5 : 1,
    correct: (spec, key) => key === rowKey(spec.target.item, spec.target.action),
    result(spec, key) {
      const [i, a] = key.split('|');
      const it = spec.items.find((x) => x.key === i);
      return `${a.replace(/…$/, '')}: ${it ? it.name : i}`;
    },
    wrongFinal(spec, rng) {
      const ks = [];
      for (const it of spec.items) {
        for (const a of spec.actions) {
          if (a.disabled || (it.key === spec.target.item && a.key === spec.target.action)) continue;
          if (it.key === spec.target.item || a.key === spec.target.action) ks.push(rowKey(it.key, a.key));
        }
      }
      return ks.length ? { key: rng.pick(ks) } : null;
    },
    wrongNav(spec, rng) {
      const ks = spec.items.map((x) => x.key).filter((k) => k !== spec.target.item);
      return { menuFor: rng.pick(ks) };
    },
    partial(spec) {
      return { menuFor: spec.target.item };
    },
    planStep(model, spec) {
      // A menu open on another file may cover the target: close it first (click on empty space).
      if (model.menuFor !== null && model.menuFor !== spec.target.item) return { click: { blank: true } };
      if (model.menuFor !== spec.target.item) return { rightclick: { item2: spec.target.item } };
      return { click: { centry: spec.target.action } };
    },
    level(spec, lv, r) {
      const easy = lv >= 1;
      const k = (e, m) => (easy ? e : m);
      spec.items = pickIn(r, spec.items, (x) => x.key === spec.target.item, k(2, 4));
      spec.actions = pickIn(r, spec.actions, (a) => a.key === spec.target.action, k(2, 4));
    },
    phrase(spec, rng, P) {
      let core, terse, steps;
      const it = spec.items.find((x) => x.key === spec.target.item);
      const a = spec.target.action;
      const verb = (VERB[a] || [a.replace(/…$/, '').toLowerCase()])[0];
      core = P(T.context, { qname: q(it.name), qa: q(a), A: cap(verb), a: verb });
      terse = `${q(it.name)} → ${a}`;
      steps = [`right-click ${q(it.name)}`, `choose ${q(a)}`];
      return { core, terse, steps };
    },
    phKind: () => 'file',
    retarget(spec, model, rng, out, other) {
      const r = other(spec.items.map((x) => x.key), spec.target.item);
      return r === null ? null : { item: r, action: spec.target.action };
    },
  });
})();
