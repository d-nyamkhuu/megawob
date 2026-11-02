/* sort-into-bins/hooks.js: judging, reporting and episode changes. Shared internals live on the task lib. */
(function () {
  'use strict';
  const lib = env.taskOf('sort-into-bins').lib;

  // ---------------------------------------------------------------- round 2: judge modes, facts, silent, retarget

  const ORD3 = ['second', 'third', 'fifth'];
  const boxName = (c) => (c.label ? `${c.label} box` : c.side ? `${lib.cap(lib.sideName(c))} box` : 'Box');

  function judgeOf(jr, spec) {
    const mode = 'impossible';
    const v = spec.scenario;
    if (v === 'single') {
      const ord = jr.pick(['second', 'third', 'fourth']);
      return { mode, what: [`${ord} box`, ord], message: "I can't do that: there is only one box on the board.",
        templates: ['Drag the {it} into the {ord} box.', 'Put the {it} inside the {ord} box, completely.'], vars: { it: lib.describe(spec.items[0]), ord } };
    }
    if (v === 'desk') {
      const have = new Set(spec.folders.map((d) => d.label.toLowerCase()));
      const folder = jr.pick(Object.values(lib.KIND_FOLDERS).flat().filter((l) => !have.has(l.toLowerCase())));
      const kw = jr.pick(lib.KIND_WORDS[spec.rule.kind]);
      return { mode, what: [folder], message: `I can't do that: there is no "${folder}" folder on the desktop.`,
        templates: [
          'Move all the {kw} into the "{folder}" folder.', 'Drag every {kw} file onto the "{folder}" folder.',
          'File the {kw} under "{folder}".', 'The "{folder}" folder should hold all {kw}.',
          'Have all the {kw} end up in "{folder}".', 'Gather the full set of {kw} in "{folder}".',
          'Use "{folder}" as the folder for all {kw}.', 'No {kw} should stay outside "{folder}".',
          'All {kw} need filing in "{folder}".'
        ], vars: { kw, folder } };
    }
    if (v === 'palette') {
      const have = new Set(spec.templates.map((t) => t.shape));
      const shape = jr.pick(lib.SHAPES.filter((sh) => !have.has(sh)));
      const k = jr.int(1, 3);
      return { mode, what: [shape, lib.plural(shape)], message: `I can't do that: the palette has no ${shape}.`,
        templates: ['Add {list} to the frame.', 'Drag {list} from the palette into the frame.'], vars: { list: `${lib.NUM[k]} ${k === 1 ? shape : lib.plural(shape)}` } };
    }
    const r = spec.rule;
    const many = lib.whatOf(jr, spec, false);
    if (spec.containers.some((c) => c.label) && r.mode === 'each') {
      const pool = r.kind === 'color' ? lib.COLOR_NAMES : lib.SHAPES;
      const absent = jr.pick(pool.filter((x) => !r.values.includes(x)));
      const box = r.kind === 'color' ? lib.cap(absent) : lib.cap(lib.plural(absent));
      const what = r.kind === 'color' ? `${absent} shapes` : lib.plural(absent);
      return { mode, what: [box, absent, lib.plural(absent)], message: `I can't do that: there is no "${box}" box.`,
        templates: ['Put the {what} into the "{box}" box.', 'Drag every {what} into the "{box}" box.'], vars: { what, box } };
    }
    const ord = ORD3[Math.min(2, spec.containers.length - 1)];
    return { mode, what: [`${ord} box`, ord], message: `I can't do that: there is no ${ord} box, only ${spec.containers.length === 1 ? 'one' : 'two'}.`,
      templates: ['Put the {many} into the {ord} box.', 'Drag every one of the {many} into the {ord} box.'], vars: { many, ord } };
  }

  function judgeInstruction(spec, rng) {
    const j = spec.judge;
    const core = lib.I.ucFirst(lib.I.phrase(rng, j.templates, j.vars, spec.isplit));
    return lib.I.say(rng, core, { isplit: spec.isplit, terse: lib.I.fill(j.templates[0], j.vars) });
  }

  function factsOf(model, spec) {
    if (spec.judge) return [];
    const v = spec.scenario;
    if (v === 'desk') {
      const n = (id) => spec.files.filter((f) => model.loc[f.id] === id).length;
      const out = spec.folders.slice(0, 3).map((d) => ({ label: d.trash ? 'Files in the Trash' : `Files in ${d.label}`, value: String(n(d.id)),
        labels: [d.trash ? 'Trash' : d.label, d.trash ? 'Trashed files' : `${d.label} count`] }));
      out.push({ label: 'Files left on the desktop', value: String(n('desk')), labels: ['Files on the desk', 'Desktop files'] });
      return out;
    }
    if (v === 'palette') {
      const { counts } = lib.frameCounts(model, spec);
      const total = Object.values(counts).reduce((a, b) => a + b, 0);
      const out = [{ label: 'Shapes in the frame', value: String(total), labels: ['Frame count', 'Shapes placed'] }];
      for (const t of Object.keys(spec.want).slice(0, 2)) {
        const tp = spec.templates[t];
        out.push({ label: `${lib.C.cap(tp.color)} ${lib.plural(tp.shape)}`, value: String(counts[t] || 0), labels: [`${lib.C.cap(lib.plural(tp.shape))} in the frame`, `${tp.color} ${tp.shape} count`] });
      }
      return out;
    }
    const inBox = (cid) => spec.items.filter((it) => lib.where(spec, model.pos[it.id]) === cid).length;
    const out = spec.containers.slice(0, 3).map((c) => ({ label: `Items in ${boxName(c)}`, value: String(inBox(c.id)), labels: [boxName(c), `${boxName(c)} count`] }));
    out.push({ label: 'Items outside the boxes', value: String(spec.items.length - spec.containers.reduce((a, c) => a + inBox(c.id), 0)), labels: ['Items left outside', 'Outside'] });
    return out;
  }

  // preempt=cancel: the page's items by the name it shows, each with where it is. Shapes that look alike share a name
  // (their value lists every one's place); desk files are named by file name; palette shapes by their count in the frame.
  function partsOf(model, spec) {
    if (spec.scenario === 'desk') return spec.files.map((f) => ({ name: f.name, value: model.loc[f.id] }));
    if (spec.scenario === 'palette') {
      const { counts } = lib.frameCounts(model, spec);
      return spec.templates.map((t, i) => ({ name: `${lib.C.cap(t.color)} ${t.shape}`, value: counts[i] || 0 }));
    }
    const groups = new Map();
    for (const it of spec.items) {
      const name = lib.describe(it);
      if (!groups.has(name)) groups.set(name, []);
      groups.get(name).push(lib.where(spec, model.pos[it.id]));
    }
    return [...groups].map(([name, v]) => ({ name, value: v.sort() }));
  }

  // The item the last drop moved did not stay: see the header.
  function silentOf(next, prev, spec, rng) {
    if (spec.judge) return null;
    const bad = (m) => lib.errorOf(m, spec) > 0;
    const v = spec.scenario;
    if (v === 'desk') {
      const ids = spec.files.filter((f) => next.loc[f.id] !== prev.loc[f.id]).map((f) => f.id);
      if (!ids.length) return null;
      const id = rng.pick(ids);
      const out = { ...next, loc: { ...next.loc, [id]: prev.loc[id] }, pos: { ...next.pos } };
      if (prev.loc[id] === 'desk') out.pos[id] = prev.pos[id];
      return bad(out) ? out : null;
    }
    if (v === 'palette') {
      const old = new Set(prev.placed.map((p) => p.id));
      const fresh = next.placed.filter((p) => !old.has(p.id));
      if (!fresh.length) return null;
      const gone = fresh[fresh.length - 1];
      const out = { ...next, placed: next.placed.filter((p) => p.id !== gone.id) };
      return bad(out) ? out : null;
    }
    const moved = spec.items.filter((it) => next.pos[it.id][0] !== prev.pos[it.id][0] || next.pos[it.id][1] !== prev.pos[it.id][1]).map((it) => it.id);
    if (!moved.length) return null;
    const id = rng.pick(moved);
    const back = { ...next, pos: { ...next.pos, [id]: prev.pos[id] } };
    if (bad(back)) return back;
    // it was already home: it ends straddling the right edge of its box instead
    const c = spec.containers.find((b) => b.id === lib.where(spec, next.pos[id]));
    if (c) {
      const p = [c.x + c.w - spec.item.w * 0.15, next.pos[id][1]];
      const out = { ...next, pos: { ...next.pos, [id]: p } };
      if (bad(out)) return out;
    }
    return null;
  }

  // Another goal over the same items and boxes: see the header.
  function retargetOf(spec, model, rng) {
    if (spec.judge) return null;
    const v = spec.scenario;
    const out = [];
    const cloneSpec = () => env.util.clone(spec);
    if (v === 'collect' || (v === 'sort' && spec.rule.mode === 'spatial')) {
      if (spec.palette) return null;
      const r = spec.rule;
      const vals = [...new Set(spec.items.map((it) => it[r.kind]))].filter((x) => x !== r.value);
      const goalFor = (ns, value, target) => {
        const n = ns.items.filter((it) => it[r.kind] === value).length;
        if (n < 1 || n >= ns.items.length) return null;
        ns.rule.value = value;
        ns.rule.target = target;
        ns.items.forEach((it) => {
          const hit = it[r.kind] === value;
          const tgt = `c${target}`;
          if (r.mode === 'sort' || v === 'sort') ns.goal[it.id] = hit ? tgt : `c${1 - target}`;
          else if (r.mode === 'in') ns.goal[it.id] = hit ? tgt : 'out';
          else if (r.mode === 'remove') ns.goal[it.id] = hit ? 'out' : 'c0';
          else ns.goal[it.id] = hit ? 'any' : 'out';
        });
        if (r.mode === 'count') {
          if (n < 2) return null;
          ns.rule.k = rng.int(1, n - 1);
        }
        return ns;
      };
      for (const value of vals) { const ns = goalFor(cloneSpec(), value, r.target || 0); if (ns) out.push(ns); }
      if (spec.containers.length === 2 && r.mode !== 'count') { const ns = goalFor(cloneSpec(), r.value, 1 - (r.target || 0)); if (ns) out.push(ns); }
    } else if (v === 'desk') {
      const r = spec.rule;
      const kinds = [...new Set(spec.files.map((f) => f.kind))];
      const pairs = [];
      for (const k of kinds) pairs.push(['trash', k]);
      for (const k of kinds) if (spec.folders.some((d) => d.kind === k && !d.trash)) pairs.push(['into', k]);
      for (const [mode, k] of pairs) {
        if (r.mode === mode && r.kind === k) continue;
        const ns = cloneSpec();
        const f = spec.folders.find((d) => d.kind === k && !d.trash);
        ns.rule = { mode, kind: k, kinds: [k], labels: mode === 'into' ? { [k]: f.label } : {} };
        for (const file of ns.files) ns.goal[file.id] = file.kind === k ? (mode === 'trash' ? 'trash' : f.id) : 'desk';
        out.push(ns);
      }
    } else if (v === 'palette') {
      const total = Object.values(spec.want).reduce((a, b) => a + b, 0);
      for (let k = 0; k < 12; k++) {
        const nT = Math.min(spec.templates.length, rng.int(1, Math.min(3, total)));
        const ts = rng.sample(spec.templates.map((_, i) => i), nT);
        const want = {};
        let left = total;
        ts.forEach((t, i) => {
          const n = i === ts.length - 1 ? left : rng.int(1, left - (ts.length - 1 - i));
          want[t] = n;
          left -= n;
        });
        if (JSON.stringify(want) !== JSON.stringify(spec.want)) out.push({ ...cloneSpec(), want });
      }
    }
    const ok = out.filter((ns) => lib.errorOf(model, ns) > 0 && Number.isFinite(lib.errorOf(model, ns)));
    return ok.length ? rng.pick(ok) : null;
  }

  Object.assign(lib, { factsOf, judgeInstruction, judgeOf, partsOf, retargetOf, silentOf });
})();
