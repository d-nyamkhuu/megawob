/* choose-option/scenarios/dependent.js: dependent sampling and start states. */
(function () {
  'use strict';
  const { C, CITY_ROWS, alpha } = env.taskOf('choose-option').lib;

  function sampleDependent(rng, spec, opts) {
    const by = {};
    for (const c of C.split(CITY_ROWS, spec.csplit)) (by[c.country] ||= []).includes(c.city) || by[c.country].push(c.city);
    let names = Object.keys(by).filter((k) => by[k].length >= 3);
    if (names.length < 5) {
      for (const c of CITY_ROWS) (by[c.country] ||= []).includes(c.city) || by[c.country].push(c.city);
      names = Object.keys(by).filter((k) => by[k].length >= 3);
    }
    const nC = Math.min(names.length, opts.ood ? rng.int(12, 16) : rng.int(5, 9));
    const countries = rng.sample(names, nC).sort(alpha);
    const cities = {};
    for (const k of countries) cities[k] = rng.sample(by[k], Math.min(by[k].length, opts.ood ? 12 : rng.int(3, 8))).sort(alpha);
    const country = rng.pick(countries);
    const city = rng.pick(cities[country]);
    return Object.assign(spec, { options: countries, cities, target: { country, city }, label: 'Country', label2: rng.pick([
      'City', 'Town / city', 'Nearest city', 'Locality', 'Settlement'
    ]),
      labelAliases: ['country', 'country selector'], noun: 'city', plural: 'cities',
      title: rng.pick([
        'Shipping address', 'Where are you based?', 'Event location', 'Store finder', 'Office address',
        'Location details', 'Where you are', 'Country and city', 'Location selection'
      ]),
      note: rng.pick([
        'Pick the country first; the city list depends on it.', 'Cities load after you choose a country.',
        'Changing the country clears the city.', 'This city selector is disabled without a country.',
        'Each country has its own set of cities.', 'No city carries over to another country.'
      ]) });
  }

  env.scenario('choose-option', {
    name: 'dependent',
    sample(rng, spec, opts) {
      const scenario = spec.scenario;return sampleDependent(rng, spec, opts);
    },
    init(spec, rng, { mode }) {
      const others = spec.options.filter((c) => c !== spec.target.country);
      const m = { country: '', city: '', open: '' };
      if (mode === 'partial') return { ...m, country: spec.target.country };
      if (mode === 'wrong' || rng.bool(0.3)) {
        const w = rng.pick(others);
        return { ...m, country: w, city: mode === 'wrong' || rng.bool(0.5) ? rng.pick(spec.cities[w]) : '' };
      }
      return m;
    },
  });
})();
