/*
 * act-in-time / carousel: an auto-advancing carousel (a slide every spec.period ms, with dots and arrows.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('act-in-time');
  const C = env.content;
  const I = env.instruct;
  const { absentFrom, endedWrongChoice, fmt$, PRODUCT_NAMES, Q, slideAt, snap, toleranceOpen } = fam.lib;

  function sampleCarousel(rng, beat, o) {
    const n = o.ood ? rng.int(7, 9) : rng.int(4, 6);
    const period = snap(beat * rng.pick([1, 1.5, 2, 2.5]));
    let titles;
    const kind = rng.pick(['shop', 'shop', 'news']);
    if (kind === 'news') titles = C.sample(rng, C.HEADLINES, n, { csplit: o.csplit }).map((t) => ({ title: t, sub: rng.pick([
      'Read the story', 'Live updates', 'Analysis', 'Photo report', 'More details', 'At a glance', 'Story context',
      'Quick take'
    ]), cta: 'Read more' }));
    else {
      const prods = C.sample(rng, C.PRODUCTS.filter((p) => !/"/.test(p.name) && p.name.length <= 40), n, { csplit: o.csplit });
      titles = prods.map((p) => ({ title: p.name, sub: rng.pick([`From ${fmt$(Math.round(p.priceMin) - 0.01)}`, `Save ${rng.pick([10, 15, 20, 25, 30, 40])}% this week`, 'New arrival', 'Back in stock']), cta: rng.pick(['Shop now', 'See deal', 'View']) }));
    }
    while (titles.length < n) titles.push({ title: `Featured item ${titles.length + 1}`, sub: 'New arrival', cta: 'View' });
    const slides = titles.slice(0, n).map((s) => ({ ...s, hue: rng.int(0, 359) }));
    const first = rng.int(0, n - 1);
    let target = rng.int(0, n - 1);
    if (target === first && rng.bool(0.8)) target = (first + rng.int(1, n - 1)) % n;
    const ahead = ((target - first + n) % n) * period / beat;
    let route = rng.pick(['wait', 'dots', 'arrows']);
    if (route === 'wait' && (ahead > 7 || o.startMode === 'wrong')) route = rng.pick(['dots', 'arrows']);
    return { slides, period, first, target, route, kind };
  }

  // Deterministic "other slide" offset for the wrong start (no rng in init).
  const rng0 = (n) => (n > 3 ? 1 : 0);

  const T_CAROUSEL = ['Open the slide about {title}.', 'Click the banner for {title} in the carousel.', 'When {title} is showing, click it.',
    'Find {title} in the rotating banner and open it.', 'Open the {title} promotion from the slideshow.', 'Click the carousel slide titled {title}.',
    'Use the carousel to visit {title}.', 'Open the page linked to the {title} banner.',
    'Please bring up {title} from the slideshow.', 'Select {title} in the banner to open its page.',
    'Locate the slide labeled {title}, then open it.'];

  env.scenario('act-in-time', {
    name: 'carousel',
    sample: sampleCarousel,
    level(spec, lv, r, keep) {
      const k = keep(3, 4);
      if (spec.slides.length > k) {
        const must = [...new Set([spec.target, spec.first])];
        const rest = r.sample(spec.slides.map((_, i) => i).filter((i) => !must.includes(i)), k - must.length);
        const kept = must.concat(rest).sort((a, b) => a - b);
        spec.slides = kept.map((i) => spec.slides[i]);
        spec.target = kept.indexOf(spec.target);
        spec.first = kept.indexOf(spec.first);
      }
    },
    start(spec) {
      const mode = spec.startMode;
      const n = spec.slides.length;
      const m = { t: 0, at: 0, base: spec.first, paused: false, opened: null, strikes: 0 };
      if (mode === 'partial') Object.assign(m, { base: (spec.target + 1) % n, paused: true });
      if (mode === 'wrong') Object.assign(m, { opened: (spec.target + 1 + rng0(n)) % n, strikes: 1, paused: true, base: (spec.target + 1 + rng0(n)) % n });
      return m;
    },
    error(model, spec) {
      if (model.opened === null) return 0.7;
      return model.opened === spec.target ? 0 : 1;
    },
    endedBy: endedWrongChoice,
    tolerance: toleranceOpen,
    act(model, spec, ev, m, t) {
      const n = spec.slides.length;
      if (ev.back) { m.opened = null; return; }
      if (m.opened !== null) return;
      if (ev.slide) {
        m.opened = slideAt(spec, m);
        if (m.opened !== spec.target) m.strikes += 1;
      } else if (ev.dot !== undefined) Object.assign(m, { base: ev.dot, at: t, paused: true });
      else if (ev.arrow) Object.assign(m, { base: (slideAt(spec, m) + (ev.arrow === 'next' ? 1 : n - 1)) % n, at: t, paused: true });
    },
    plan(model, spec) {
      if (model.opened !== null) return model.opened === spec.target ? null : { click: { back: true } };
      const cur = slideAt(spec, model);
      if (cur === spec.target) return { click: { slide: true } };
      if (spec.route === 'dots') return { click: { dot: spec.target } };
      if (spec.route === 'arrows' || model.paused) {
        const n = spec.slides.length;
        const fwd = (spec.target - cur + n) % n;
        return { click: { arrow: fwd <= n - fwd ? 'next' : 'prev' } };
      }
      return { wait: true };
    },
    solveBy(spec, model, m) {
      return { ...m, opened: spec.target, base: spec.target, paused: true, strikes: 0 };
    },
    phrase(spec, rng, pick, say) {
      return say(I.fill(pick(T_CAROUSEL), { title: Q(spec.slides[spec.target].title) }), { terse: `open ${Q(spec.slides[spec.target].title)}` });
    },
    judgeAsk(jr, spec, mk, cant) {
      const pool = spec.kind === 'news' ? C.HEADLINES : PRODUCT_NAMES;
      const title = absentFrom(jr, pool, spec.csplit, spec.slides.map((s) => s.title));
      return mk(title, T_CAROUSEL, { title: Q(title) }, cant(`there is no slide about ${title}`));
    },
    factRows(model, spec, f) {
      if (model.opened === null) return [];
      const s = spec.slides[model.opened];
      return [f('Opened page', s.title, ['Page', 'Title']), f('Details', s.sub, ['Subtitle'])];
    },
    silentEdit(next, prev, spec, rng, m, out) {
      // The click on the slide did not open it (a paused carousel holds the slide, so repeating it works).
      if (!(next.opened === spec.target && prev.opened !== spec.target && next.paused)) return null;
      m.opened = null;
      return out(m);
    },
    retargetEdit(spec, model, rng, base, good, others) {
      const beat = spec.beat;
      const n = spec.slides.length;
      const t = others(n, spec.target, model.opened === null ? -1 : model.opened);
      if (!t.length) return null;
      const ns = { ...base, target: rng.pick(t) };
      const ahead = ((ns.target - slideAt(spec, model) + n) % n) * spec.period / beat;
      if (ns.route === 'wait' && (ahead > 7 || model.opened !== null)) ns.route = rng.pick(['dots', 'arrows']);
      return good(ns);
    },
  });
})();
