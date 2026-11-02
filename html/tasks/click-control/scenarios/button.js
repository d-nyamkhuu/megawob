/*
 * click-control / button: kind 'labels' (click-button.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('click-control');
  const { quote: q } = env.util;
  const C = env.content;
  const { allLabels, buttonGroups, endish, fieldLabels, iconFor, norm, NUMBERS, pickIn, spread, T } = fam.lib;

  function sampleButton(rng, ctx) {
    const { o, ood } = ctx;
    const kind = rng.pick(['labels', 'labels', 'lookalike', 'lookalike', 'lookalike', 'test', 'pair']);
    if (kind === 'test') {
      const p = spread(rng, 1)[0];
      return { kind, elements: [{ type: 'button', key: 'b0', label: 'Click Me!', size: rng.int(35, 100), ...p }], target: 'Click Me!' };
    }
    if (kind === 'pair') {
      const pts = spread(rng, 2);
      const elements = NUMBERS.slice(0, 2).map((label, i) => ({ type: 'button', key: `b${i}`, label, ...pts[i] }));
      return { kind, elements, target: rng.bool(0.6) ? 'ONE' : 'TWO' };
    }
    if (kind === 'lookalike') {
      const groups = buttonGroups().filter((g) => g.labels.length >= 3);
      for (;;) {
        const g = C.pick(rng, groups, o);
        const fromGroup = rng.sample(g.labels, Math.min(g.labels.length, ood ? rng.int(4, 6) : rng.int(3, 4)));
        const others = rng.sample(allLabels().filter((l) => !g.labels.some((x) => norm(x) === norm(l))), ood ? rng.int(2, 3) : rng.int(1, 2));
        let labels = rng.shuffle(fromGroup.concat(others));
        if (new Set(labels.map(norm)).size !== labels.length) continue;
        const targets = fromGroup.filter((l) => !endish(l));
        if (!targets.length) continue;
        const target = rng.pick(targets);
        const looks = ['button', 'button', 'primary', 'link', 'ghost', 'icon'];
        const elements = labels.map((label, i) => ({ type: 'button', key: `b${i}`, label, look: rng.pick(looks), icon: iconFor(label) }));
        // Disabled decoys: a twin with the target label and/or a disabled sibling of the group.
        let nb = elements.length;
        if (rng.bool(0.5)) elements.splice(rng.int(0, elements.length), 0, { type: 'button', key: `b${nb++}`, label: target, look: rng.pick(looks), icon: iconFor(target), disabled: true });
        if (rng.bool(0.35)) {
          const sib = elements.find((e) => !e.disabled && norm(e.label) !== norm(target));
          if (sib) sib.disabled = true;
        }
        const t = elements.find((e) => !e.disabled && e.label === target);
        if (!t) continue;
        if (!elements.some((e) => !e.disabled && e.label !== target)) continue;
        return { kind, layout: rng.pick(['toolbar', 'card', 'footer']), elements, target };
      }
    }
    const style = rng.pick(['title', 'title', 'title', 'lower']);
    const labelsPool = allLabels().filter((l) => l.length <= 16);
    const n = ood ? rng.int(8, 10) : 6;
    for (;;) {
      const elements = [];
      let nb = 0;
      for (let i = 0; i < n; i++) {
        const u = rng.next();
        if (u < 0.28) elements.push({ type: 'text', text: C.pick(rng, C.SENTENCES.filter((s) => s.length <= 80), o) });
        else if (u < 0.55) elements.push({ type: 'input', label: rng.bool(0.7) ? C.pick(rng, fieldLabels(), o).label : '', width: rng.int(90, 220) });
        else {
          const l = C.pick(rng, labelsPool, o);
          elements.push({ type: 'button', key: `b${nb++}`, label: style === 'lower' ? l.toLowerCase() : l, br: rng.bool(0.5), look: rng.bool(0.15) ? 'link' : 'button' });
        }
      }
      const btns = elements.filter((e) => e.type === 'button');
      if (btns.length < 2 || new Set(btns.map((b) => b.label)).size < 2) continue;
      const cands = btns.filter((b) => !endish(b.label));
      if (!cands.length) continue;
      const target = rng.pick(cands).label;
      // A disabled decoy: one non-target button greyed out (clicks on it do nothing).
      if (rng.bool(0.3)) {
        const others = btns.filter((b) => b.label !== target);
        if (others.length > 1) rng.pick(others).disabled = true;
      }
      return { kind, elements, target };
    }
  }

  env.scenario('click-control', {
    name: 'button',
    sample: sampleButton,
    correct(spec, key) {
      const e = spec.elements.find((x) => x.key === key);
      return !!e && !e.disabled && e.label === spec.target;
    },
    result(spec, key) {
      const e = spec.elements.find((x) => x.key === key);
      return e ? `"${e.label}" done` : 'Done';
    },
    wrongFinal(spec, rng) {
      const ks = spec.elements.filter((e) => e.type === 'button' && !e.disabled && e.label !== spec.target).map((e) => e.key);
      return ks.length ? { key: rng.pick(ks) } : null;
    },
    planStep(model, spec) {
      return { click: { button: spec.elements.find((e) => e.type === 'button' && !e.disabled && e.label === spec.target).key } };
    },
    level(spec, lv, r) {
      const easy = lv >= 1;
      const k = (e, m) => (easy ? e : m);
      if (spec.kind === 'test') {
        const el = spec.elements[0];
        el.size = Math.max(el.size, Math.round(60 + 40 * lv));
      } else if (spec.kind === 'labels' || spec.kind === 'lookalike') {
        const isT = (e) => e.type === 'button' && !e.disabled && e.label === spec.target;
        let els = spec.elements;
        if (easy) els = els.filter((e) => !e.disabled);
        const others = els.filter((e) => e.type === 'button' && !isT(e));
        const keepB = new Set(pickIn(r, others, () => false, spec.kind === 'labels' ? k(2, 3) : k(2, 3)));
        const rest = els.filter((e) => e.type !== 'button');
        const keepR = new Set(pickIn(r, rest, () => false, k(1, 2)));
        spec.elements = els.filter((e) => isT(e) || keepB.has(e) || keepR.has(e));
      }
    },
    phrase(spec, rng, P) {
      let core, terse, steps;
      if (spec.kind === 'test') core = P(T.buttonTest, {});
      else if (spec.kind === 'pair') { core = P(T.buttonPair, { t: spec.target }); terse = spec.target; }
      else if (spec.kind === 'lookalike') { core = P(T.buttonLook, { q: q(spec.target) }); terse = q(spec.target); }
      else { core = P(T.buttonLabel, { q: q(spec.target) }); terse = q(spec.target); }
      return { core, terse, steps };
    },
    phKind: () => 'button',
    retarget(spec, model, rng, out, other) {
      if (spec.kind !== 'labels' && spec.kind !== 'lookalike') return null;
      const labels = [...new Set(spec.elements.filter((e) => e.type === 'button' && !e.disabled).map((e) => e.label))];
      return other(labels, spec.target);
    },
  });
})();
