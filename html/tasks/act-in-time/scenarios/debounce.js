/*
 * act-in-time / debounce: an autocomplete field whose suggestions appear only after typing has paused for spec.debounce
 * ms plus a fetch of spec.latency ms ("Searching…").
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('act-in-time');
  const C = env.content;
  const I = env.instruct;
  const { act, fold, Q, snap, suggestions, suggestState } = fam.lib;

  function sampleDebounce(rng, beat, o) {
    let cities = C.CITIES.map((c) => ({ city: c.city, country: c.country, iata: c.iata }));
    // Unique city names only (the goal may name the city alone).
    const seen = new Map();
    for (const c of cities) seen.set(fold(c.city), (seen.get(fold(c.city)) || 0) + 1);
    cities = cities.filter((c) => seen.get(fold(c.city)) === 1 && /^[A-Za-zÀ-ž' .-]+$/.test(c.city));
    const spec = { pool: cities, max: 6 };
    const label = rng.pick([
      'Destination', 'City', 'Departure city', 'Arrival city', 'Ship to city', 'Where to?', 'Location', 'Hometown',
      'Birthplace', 'Work city', 'Pickup city', 'Meeting city', 'Stopover', 'Service city', 'Base city', 'Study city',
      'Return city', 'Tour start', 'Hotel city'
    ]);
    const train = C.split(cities, o.csplit);
    for (let tries = 0; tries < 200; tries++) {
      const t = cities.indexOf(rng.pick(train));
      const name = fold(cities[t].city).replace(/[^a-z]/g, '');
      for (let L = 2; L <= Math.min(5, name.length); L++) {
        const prefix = cities[t].city.slice(0, L);
        if (/[^A-Za-z]/.test(prefix)) break;
        const all = cities.filter((c) => fold(c.city).startsWith(fold(prefix)));
        const want = o.ood ? [4, 6] : [2, 6];
        if (all.length >= want[0] && all.length <= want[1]) {
          return { label, pool: cities, target: t, prefix, max: 6,
            debounce: snap(rng.float(0.3, 0.9) * beat), latency: snap(rng.float(0.3, o.ood ? 2.2 : 1.5) * beat),
            route: rng.bool(0.3) ? 'keys' : 'click' };
        }
        if (all.length < 2) break;
      }
    }
    throw new Error(`act-in-time debounce: no city with a good prefix (${spec.pool.length} cities)`);
  }

  const T_DEBOUNCE = ['Set {label} to {city}, {country}.', 'Choose {city} ({iata}) in the {label} field.', 'Type into {label} and pick {city}, {country} from the suggestions.',
    'Fill in {label}: {city}.', 'Pick {city} as the {lcLabel}.', 'The {lcLabel} should be {city} in {country}.',
    'For {label}, make a selection: {city}.', 'Use {label} to choose {city}, {country}.',
    'Within {label}, find and select {city} ({iata}).', '{city}, {country}: the {lcLabel} selection.',
    'For the {lcLabel}, go with {city}.'];

  const ABSENT_CITIES = [{ city: 'Brightwater', country: 'Northland', iata: 'BWT' }, { city: 'Stonehollow', country: 'Eastmark', iata: 'SHO' },
    { city: 'Larkspur', country: 'Westmere', iata: 'LKP' }, { city: 'Ashgrove', country: 'Southfell', iata: 'AGV' }, { city: 'Meadowbrook', country: 'Highvale', iata: 'MDB' },
    { city: 'Veldenwick', country: 'Cloudmere', iata: 'VDW' },
    { city: 'Orrenstead', country: 'Redmarch', iata: 'ORS' }, { city: 'Quillhaven', country: 'Mistvale', iata: 'QLH' },
    { city: 'Thistlefen', country: 'Pinehaven', iata: 'TSF' },
    { city: 'Brindlecove', country: 'Goldreach', iata: 'BDC' },
    { city: 'Marnesford', country: 'Duskland', iata: 'MNF' }, { city: 'Tessalund', country: 'Wyndfell', iata: 'TSL' },
    { city: 'Pelverton', country: 'Oakshire', iata: 'PVT' }, { city: 'Ivercombe', country: 'Elderwyn', iata: 'IVC' },
    { city: 'Dunleridge', country: 'Crestmark', iata: 'DLR' },
    { city: 'Zelverholt', country: 'Vannorath', iata: 'ZVH' },
    { city: 'Nimbravale', country: 'Eslareth', iata: 'NBV' }, { city: 'Feskelmoor', country: 'Ordelune', iata: 'FKM' },
    { city: 'Taldrivick', country: 'Kelvaria', iata: 'TDV' }, { city: 'Ostrenbay', country: 'Thornmere', iata: 'OSB' }];

  env.scenario('act-in-time', {
    name: 'debounce',
    sample: sampleDebounce,
    level(spec, lv) {
      spec.debounce = Math.max(50, snap(spec.debounce * (1 - 0.4 * lv)));
      spec.latency = Math.max(50, snap(spec.latency * (1 - 0.4 * lv)));
      if (lv >= 1) spec.route = 'click';
    },
    start(spec) {
      const mode = spec.startMode;
      const m = { t: 0, q: '', qAt: null, value: null, active: null, focus: false };
      if (mode === 'partial') Object.assign(m, { q: spec.prefix, qAt: 0 });
      if (mode === 'wrong') {
        const alt = suggestions(spec, spec.prefix).find((i) => i !== spec.target);
        if (alt !== undefined) Object.assign(m, { value: alt, q: spec.pool[alt].city });
      }
      return m;
    },
    error(model, spec) {
      if (model.value !== null) return model.value === spec.target ? 0 : 1;
      if (!suggestions(spec, model.q).includes(spec.target)) return 1;
      return suggestState(spec, model) === 'shown' ? 0.4 : 0.6;
    },
    act(model, spec, ev, m, t) {
      if (ev.input !== undefined) Object.assign(m, { q: ev.input, qAt: t, value: null, active: null });
      else if (ev.pick !== undefined) Object.assign(m, { value: ev.pick, q: spec.pool[ev.pick].city, qAt: null, active: null });
      else if (ev.active !== undefined) m.active = ev.active;
      else if (ev.focus !== undefined) m.focus = ev.focus;
    },
    simulate(m, spec, step, c) {
      if (step.type) m = act(act(m, spec, { focus: true }), spec, { input: step.type[1] });
      else if (c.field) m = act(m, spec, { focus: true });
      else if (c.suggestion !== undefined) m = act(m, spec, { pick: c.suggestion });
      else if (step.key === 'Enter') { if (m.active !== null) m = act(m, spec, { pick: m.active }); }
      else if (step.key) {
        const list = suggestions(spec, m.q);
        const at = m.active === null ? -1 : list.indexOf(m.active);
        const k = step.key === 'ArrowDown' ? Math.min(list.length - 1, at + 1) : Math.max(0, at - 1);
        m = act(m, spec, { active: list[k] });
      }
      return m;
    },
    plan(model, spec) {
      if (model.value === spec.target) return null;
      if (model.value !== null || !suggestions(spec, model.q).includes(spec.target)) return { type: [{ field: 'city' }, spec.prefix] };
      if (suggestState(spec, model) !== 'shown') return { wait: true };
      if (spec.route === 'keys') {
        // Arrow keys only reach a focused field (an overlay click or a fresh page blurs it).
        if (!model.focus) return { click: { field: 'city' } };
        const list = suggestions(spec, model.q);
        if (model.active === spec.target) return { key: 'Enter' };
        const at = model.active === null ? -1 : list.indexOf(model.active);
        return { key: at > list.indexOf(spec.target) ? 'ArrowUp' : 'ArrowDown' };
      }
      return { click: { suggestion: spec.target } };
    },
    solveBy(spec, model, m) {
      return { ...m, value: spec.target, q: spec.pool[spec.target].city, qAt: null };
    },
    phrase(spec, rng, pick, say) {
      const c = spec.pool[spec.target];
      return say(I.fill(pick(T_DEBOUNCE), { label: Q(spec.label.replace(/\?$/, '')), lcLabel: spec.label.replace(/\?$/, '').toLowerCase(), city: c.city, country: c.country, iata: c.iata }),
        { terse: `${spec.label.replace(/\?$/, '').toLowerCase()}: ${c.city}` });
    },
    judgeAsk(jr, spec, mk, cant) {
      const pool = new Set(spec.pool.map((c) => fold(c.city)));
      const c = jr.pick(ABSENT_CITIES.filter((x) => !pool.has(fold(x.city))));
      return mk(c.city, T_DEBOUNCE, { label: Q(spec.label.replace(/\?$/, '')), lcLabel: spec.label.replace(/\?$/, '').toLowerCase(), city: c.city, country: c.country, iata: c.iata },
        cant(`there is no city called ${c.city} in the suggestions`));
    },
    factRows(model, spec, f) {
      if (model.value === null) return [];
      const c = spec.pool[model.value];
      const out = [f(spec.label.replace(/\?$/, ''), c.city, ['Selected city', 'City']), f('Selected', `${c.city}, ${c.country}`, ['Selection'])];
      if (c.iata) out.push(f('Airport code', c.iata, ['IATA', 'Code']));
      return out;
    },
    silentEdit(next, prev, spec, rng, m, out) {
      // The pick did not take: the field and the list are as before it.
      if (!(next.value === spec.target && prev.value !== next.value)) return null;
      Object.assign(m, { value: prev.value, q: prev.q, qAt: prev.qAt, active: prev.active });
      return out(m);
    },
    retargetEdit(spec, model, rng, base, good) {
      const t = suggestions(spec, spec.prefix).filter((i) => i !== spec.target && i !== model.value);
      return t.length ? good({ ...base, target: rng.pick(t) }) : null;
    },
  });
})();
