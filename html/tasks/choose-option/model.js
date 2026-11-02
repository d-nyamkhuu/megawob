/* choose-option/model.js: model state, grading and oracle. */
(function () {
  'use strict';
  const lib = env.taskOf('choose-option').lib;
  const { suggest, pre2, matrixAsked, visible, clamp, layOf, rowY, listHeight, comboFilter, tagSuggest } = lib;

  function misspell(spec, rng) {
    const t = spec.target;
    for (let k = 0; k < 20; k++) {
      const i = rng.int(1, t.length - 1);
      const s = rng.bool(0.5) ? t.slice(0, i) + t.slice(i + 1) : t.slice(0, i) + t[i - 1] + t.slice(i);
      const typo = s.length > 2 ? s : t + 'x';
      if (!suggest(spec, typo).length) return typo;
    }
    return t.slice(0, 1) + 'zq';
  }

  function initModel(spec, rng) {
    const v = spec.scenario;
    const mode = spec.startMode || 'off';
    const tset = spec.targets || (typeof spec.target === 'string' ? [spec.target] : []);
    const wrongs = (spec.options || []).filter((o) => !tset.includes(o));
    const near = (t) => {
      const nb = wrongs.filter((o) => pre2(o) === pre2(t));
      return rng.pick(nb.length && rng.bool(0.6) ? nb : wrongs);
    };
    return env.scenariosOf('choose-option')[v].init(spec, rng, { v, mode, tset, wrongs, near });
  }

  function jaccard(values, targets) {
    const a = new Set(values || []);
    const t = new Set(targets);
    let inter = 0;
    for (const x of a) if (t.has(x)) inter++;
    const union = a.size + t.size - inter;
    return union ? 1 - inter / union : 0;
  }

  function errorOf(model, spec) {
    const v = spec.scenario;
    if (v === 'checkbox' || v === 'listbox' || v === 'chips' || v === 'tags') return jaccard(model.values, spec.targets);
    if (v === 'toggles') return spec.want.reduce((a, w, i) => a + (!!model.on[i] !== w ? 1 : 0), 0);
    if (v === 'tree') {
      const vals = new Set(model.values || []);
      const T = new Set(spec.targets);
      return spec.options.reduce((a, o) => a + (vals.has(o) !== T.has(o) ? 1 : 0), 0) / spec.options.length;
    }
    if (v === 'dependent') return (model.country === spec.target.country ? 0 : 0.5) + (model.city === spec.target.city ? 0 : 0.5);
    if (v === 'matrix') {
      const asked = matrixAsked(spec);
      return asked.filter((i) => model.values[i] !== spec.goals[i]).length / asked.length;
    }
    return model.value === spec.target ? 0 : 1;
  }

  function treeStep(model, spec) {
    const vals = new Set(model.values);
    for (let g = 0; g < spec.groups.length; g++) {
      const A = spec.groups[g].options;
      const T = A.filter((o) => spec.targets.includes(o));
      const Cn = A.filter((o) => vals.has(o));
      const diff = A.filter((o) => vals.has(o) !== T.includes(o));
      if (!diff.length) continue;
      const all = Cn.length === A.length;
      const none = Cn.length === 0;
      const extraAfterAll = A.length - T.length;
      let toAll;
      let toNone;
      if (spec.links) {
        toAll = (all ? 0 : 1) + extraAfterAll;
        toNone = (none ? 0 : 1) + T.length;
      } else {
        toAll = (all ? 0 : 1) + extraAfterAll;
        toNone = (none ? 0 : all ? 1 : 2) + T.length;
      }
      const best = Math.min(diff.length, toAll, toNone);
      if (best === diff.length) return { click: { option: diff[0] } };
      if (best === toAll) {
        if (!all) return { click: spec.links ? { link: [g, 'all'] } : { parent: g } };
        return { click: { option: A.find((o) => !T.includes(o)) } };
      }
      if (!none) return { click: spec.links ? { link: [g, 'none'] } : { parent: g } };
      return { click: { option: T[0] } };
    }
    return null;
  }

  function planOf(model, spec) {
    const v = spec.scenario;
    if (errorOf(model, spec) === 0) return null;
    if (v === 'dropdown') return model.open ? { click: { option: spec.target } } : { click: { open: 'dropdown' } };
    if (v === 'radio') return { click: { option: spec.target } };
    if (v === 'checkbox') {
      const on = new Set(model.values);
      const t = new Set(spec.targets);
      const x = spec.options.find((o) => on.has(o) !== t.has(o));
      return x === undefined ? null : { click: { option: x } };
    }
    if (v === 'autocomplete') {
      if (model.loading) return { wait: true };
      const sg = model.open ? suggest(spec, model.text) : [];
      const i = sg.indexOf(spec.target);
      if (i >= 0) {
        if (!spec.keys) return { click: { suggestion: spec.target } };
        const a = model.active ?? -1;
        if (a === i) return { key: 'Enter' };
        return { key: a < i ? 'ArrowDown' : 'ArrowUp' };
      }
      return { type: [{ field: 'search' }, spec.typed] };
    }
    if (v === 'listbox') {
      const on = new Set(model.values);
      const t = new Set(spec.targets);
      const todo = spec.multi
        ? spec.options.map((o, i) => i).filter((i) => on.has(spec.options[i]) !== t.has(spec.options[i]))
        : [spec.options.indexOf(spec.target)];
      const scroll = model.scroll || 0;
      const seen = todo.find((i) => visible(spec, scroll, i));
      if (seen !== undefined) return { click: { option: spec.options[seen] } };
      const mid = scroll + spec.rows / 2;
      const i = todo.slice().sort((a, b) => Math.abs(a + 0.5 - mid) - Math.abs(b + 0.5 - mid) || a - b)[0];
      const s = i - (spec.rows - 1) / 2;
      if (spec.route === 'wheel') {
        const sc = clamp(s, 0, spec.options.length - spec.rows);
        return { wheel: [{ list: 'list' }, Math.round((sc - scroll) * (model.px || 32))] };
      }
      return { drag: [{ thumb: 'list' }, { scroll: s }] };
    }
    if (v === 'grouped') {
      if (!model.open) return { click: { open: 'grouped' } };
      const L = layOf(spec, model);
      const i = spec.options.indexOf(spec.target);
      const y = rowY(spec, L, i);
      const top = model.top || 0;
      if (y >= top - 1 && y + L.row <= top + L.view + 1) return { click: { option: spec.target } };
      const want = clamp(Math.round(y + L.row / 2 - L.view / 2), 0, Math.max(0, listHeight(spec, L) - L.view));
      if (spec.route === 'wheel') return { wheel: [{ list: 'popup' }, want - top] };
      return { drag: [{ thumb: 'popup' }, { scrollTop: want }] };
    }
    if (v === 'combobox') {
      if (!model.open) return { click: { open: 'combobox' } };
      if (model.query !== spec.query) return { type: [{ field: 'query' }, spec.query] };
      const f = comboFilter(spec, model.query);
      const i = f.indexOf(spec.target);
      if (!spec.keys) return { click: { option: spec.target } };
      const a = model.active ?? -1;
      if (a === i) return { key: 'Enter' };
      return { key: a < i ? 'ArrowDown' : 'ArrowUp' };
    }
    if (v === 'chips') {
      const extra = model.values.find((x) => !spec.targets.includes(x));
      if (extra !== undefined) return { click: { remove: extra } };
      const miss = spec.targets.find((t) => !model.values.includes(t));
      if (!model.open) return { click: { field: 'chips' } };
      return { click: { option: miss } };
    }
    if (v === 'tags') {
      const T = spec.targets;
      const shown = model.expanded ? model.values : model.values.slice(0, spec.maxShow);
      const seen = shown.find((x) => !T.includes(x));
      if (seen !== undefined) return { click: { remove: seen } };
      if (model.values.some((x) => !T.includes(x))) return { click: { more: true } };
      const miss = T.find((t) => !model.values.includes(t));
      // Only while the list is open: dismissing an overlay mid-task closes it with the query still typed.
      const sg = model.open ? tagSuggest(spec, model) : [];
      const i = sg.indexOf(miss);
      if (i >= 0) {
        if (!spec.keys) return { click: { suggestion: miss } };
        const a = model.active ?? -1;
        if (a === i) return { key: 'Enter' };
        return { key: a < i ? 'ArrowDown' : 'ArrowUp' };
      }
      return { type: [{ field: 'tags' }, spec.queries[miss]] };
    }
    if (v === 'toggles') {
      const i = spec.want.findIndex((w, k) => !!model.on[k] !== w);
      return i < 0 ? null : { click: { toggle: i } };
    }
    if (v === 'tree') return treeStep(model, spec);
    if (v === 'matrix') {
      const i = matrixAsked(spec).find((k) => model.values[k] !== spec.goals[k]);
      return i === undefined ? null : { click: { cell: [spec.rows[i], spec.goals[i]] } };
    }
    if (v === 'dependent') {
      const T = spec.target;
      if (model.country !== T.country) return model.open === 'country' ? { click: { option: T.country, of: 'country' } } : { click: { open: 'country' } };
      return model.open === 'city' ? { click: { option: T.city, of: 'city' } } : { click: { open: 'city' } };
    }
    return null;
  }

  function solveOf(spec, model) {
    const v = spec.scenario;
    if (v === 'dropdown' || v === 'grouped') return { ...model, value: spec.target, open: false };
    if (v === 'radio') return { ...model, value: spec.target };
    if (v === 'autocomplete') return { ...model, value: spec.target, text: spec.target, open: false, loading: false, active: -1 };
    if (v === 'combobox') return { ...model, value: spec.target, open: false };
    if (v === 'checkbox' || v === 'listbox' || v === 'tree') return { ...model, values: spec.targets.slice() };
    if (v === 'chips') return { ...model, values: spec.targets.slice(), open: false };
    if (v === 'tags') return { ...model, values: spec.targets.slice(), text: '', open: false, active: -1 };
    if (v === 'toggles') return { ...model, on: spec.want.slice() };
    if (v === 'matrix') return { ...model, values: model.values.map((x, i) => (spec.goals[i] !== null ? spec.goals[i] : x)) };
    return { ...model, country: spec.target.country, city: spec.target.city, open: '' };
  }

  Object.assign(lib, { misspell, initModel, errorOf, planOf, solveOf });
})();
