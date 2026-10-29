/*
 * find-fact / chart: a bar or line chart with a value axis.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('find-fact');
  const C = env.content;
  const { keepIdx } = env.util;
  const { MON3, parseNum, say, textErr, wrongOf } = fam.lib;

  const CHART_SETS = [
    { title: 'Monthly sales', unit: 'units', cats: () => MON3.slice() },
    { title: 'Visitors per day', unit: 'visitors', cats: () => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    { title: 'Revenue by quarter', unit: 'k$', cats: () => ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025'] },
    { title: 'Tickets by team', unit: 'tickets', cats: (rng, spec) => C.sample(rng, C.DEPARTMENTS, 12, C.csplitOf(spec)) },
    { title: 'Orders by city', unit: 'orders', cats: (rng, spec) => C.sample(rng, C.CITIES, 12, C.csplitOf(spec)).map((c) => c.city) },
  ];

  function sampleChart(rng, spec) {
    const mode = rng.pick(['value', 'value', 'max', 'min', 'hover']);
    const set = rng.pick(CHART_SETS);
    const all = set.cats(rng, spec);
    const n = Math.min(all.length, spec.ood ? rng.int(9, 12) : rng.int(4, 7));
    const start = set.title === 'Monthly sales' || set.title.startsWith('Revenue') ? rng.int(0, all.length - n) : 0;
    const cats = all.slice(start, start + n);
    const step = rng.pick([5, 10, 20, 25, 50, 100]);
    const ticks = rng.int(5, 8);
    const max = step * ticks;
    for (;;) {
      const values = cats.map(() => (mode === 'hover' ? rng.int(Math.round(step * 0.6), max - 1) : step * rng.int(1, ticks - 1) + (step % 2 === 0 && rng.bool(0.25) ? step / 2 : 0)));
      const target = rng.int(0, n - 1);
      const hi = Math.max(...values);
      const lo = Math.min(...values);
      if (values.filter((v) => v === hi).length > 1 || values.filter((v) => v === lo).length > 1) continue;
      const tgt = mode === 'max' ? values.indexOf(hi) : mode === 'min' ? values.indexOf(lo) : target;
      const labels = mode === 'value' && rng.bool(0.3);
      const answer = mode === 'max' || mode === 'min' ? cats[tgt] : String(values[tgt]);
      return { kind: rng.pick(['bar', 'bar', 'line']), mode, title: set.title, unit: set.unit, cats, values, step, max, labels, target: tgt, answer };
    }
  }

  const PH_CATS = {
    'Monthly sales': MON3,
    'Visitors per day': ['Holiday'],
    'Revenue by quarter': [
      'Q4 2023', 'Q1 2026', 'Q2 2026', 'Q1 2023', 'Q2 2023', 'Q3 2023', 'Q3 2026', 'Q4 2026', 'Q1 2022', 'Q2 2022',
      'Q3 2022', 'Q4 2022'
    ],
  };

  env.scenario('find-fact', {
    name: 'chart',
    sample: sampleChart,
    baseModel() {
      return { answers: [''], hover: null };
    },
    level(spec, lv, r) {
      const easy = lv >= 1;
      const k = (e, m) => (easy ? e : m);
      const keep = keepIdx(r, spec.cats.length, [spec.target], k(2, 3));
      if (keep.length < spec.cats.length) {
        spec.cats = keep.map((i) => spec.cats[i]);
        spec.values = keep.map((i) => spec.values[i]);
        spec.target = keep.indexOf(spec.target);
      }
    },
    wrongAnswers(spec, rng) {
      return [wrongOf(rng, spec.answer, spec.mode === 'max' || spec.mode === 'min' ? spec.cats : spec.values.map(String))];
    },
    error(model, spec) {
      if (spec.mode === 'max' || spec.mode === 'min') return textErr(model.answers[0], spec.answer);
      const v = parseNum(model.answers[0]);
      return v === null ? 1 : Math.min(1, Math.abs(v - Number(spec.answer)) / (2 * spec.step));
    },
    plan(model, spec) {
      if (spec.mode === 'hover' && model.hover !== spec.target && parseNum(model.answers[0]) !== Number(spec.answer)) return { move: { bar: spec.target } };
      return { type: [{ field: 0 }, spec.answer] };
    },
    answers(spec, one) {
      return spec.mode === 'max' || spec.mode === 'min' ? one('category', spec.answer, ['label', 'name'])
      : one('value', spec.answer, [spec.unit]);
    },
    instruction(spec, rng) {
      const cat = spec.cats[spec.target];
      if (spec.mode === 'max' || spec.mode === 'min') {
        const sup = spec.mode === 'max' ? rng.pick(['highest', 'largest']) : rng.pick(['lowest', 'smallest']);
        return say(rng, spec, [
          'Which category has the {sup} value in the chart? Type its name.',
          'Type the label of the {kind} with the {sup} value.',
          'Find the {sup} value in the {title} chart and enter its label.',
          'Enter the name of the category with the {sup} {unit}.',
          'Read the chart and type which label has the {sup} value.',
          'Look at the chart: which one is {sup}? Type its label.',
          'Use the {sup} chart value to find and type its category.',
        ], { sup, kind: spec.kind === 'bar' ? 'bar' : 'point', title: spec.title.toLowerCase(), unit: spec.unit }, { terse: `${sup} in chart?` });
      }
      return say(rng, spec, [
        'Read the value for {cat} off the chart and type it.',
        'What value does the chart show for {cat}? Enter the number.',
        'Type the number of {unit} shown for {cat}.',
        'Check the {title} chart and enter the value for {cat}.',
        'Enter the chart’s value for {cat}.',
        'How many {unit} for {cat}? Type the number from the chart.',
        '{cat} is the category to find. Type its value.',
        'Type the chart reading in {unit} for {cat}.',
        'Find {cat} on the chart. Copy its value into the field.',
        'Answer for {cat} by typing its value from the chart.',
      ], { cat, unit: spec.unit, title: spec.title.toLowerCase() }, { terse: `${cat} value?` });
    },
    replyInstruction(spec, rng) {
      const cat = spec.cats[spec.target];
      if (spec.mode === 'max' || spec.mode === 'min') {
        const sup = spec.mode === 'max' ? rng.pick(['highest', 'largest']) : rng.pick(['lowest', 'smallest']);
        return say(rng, spec, [
          'Which category has the {sup} value in the chart?',
          'Find the {sup} value in the {title} chart and read its label.',
          'Which {kind} in the chart is the {sup}?',
          'Look at the chart: which one is {sup}?',
          'Check the chart for the category with the {sup} {unit}.',
          'Compare values. Which label belongs to the {sup}?',
          'Match the {sup} {unit} value with its category.',
        ], { sup, kind: spec.kind === 'bar' ? 'bar' : 'point', title: spec.title.toLowerCase(), unit: spec.unit }, { terse: `${sup} in chart?` });
      }
      return say(rng, spec, [
        'What value does the chart show for {cat}?',
        'Read the value for {cat} off the chart.',
        'How many {unit} for {cat}, according to the chart?',
        'Check the {title} chart for the value of {cat}.',
        'Look up the chart’s value for {cat}.',
        'For {cat}, what value do you read on the chart?',
        'The chart gives {cat} a value. What is it?',
        'In {title}, what number goes with {cat}?',
        'For the category {cat}, report its chart value.',
      ], { cat, unit: spec.unit, title: spec.title.toLowerCase() }, { terse: `${cat} value?` });
    },
    judgeAsk(jr, spec, page, pick) {
      let x = null, templates, vars = {}, message;
      x = pick((PH_CATS[spec.title] || []).filter((c) => !spec.cats.includes(c))) || pick(PH_CATS['Revenue by quarter']);
      if (!x) return null;
      templates = [
        'Enter the chart’s value for {x}.', 'What value does the chart show for {x}? Enter the number.',
        'Read the value for {x} off the chart and type it.', 'Use {x} as the chart category and type its value.',
        'The chart gives what value for {x}? Type it.'
      ];
      vars = { x };
      message = `I can't do that: the chart has no ${x}.`;
      return { x, templates, vars, message };
    },
    factRows(model, spec, out) {
      if (spec.labels) {
        spec.cats.forEach((c, i) => { if (i !== spec.target && out.length < 2) out.push({ label: c, value: String(spec.values[i]), aliases: [`${spec.values[i]} ${spec.unit}`], labels: [`${c} ${spec.unit}`] }); });
      }
    },
    retargetTries(spec, model, rng, tries) {
      if (spec.mode === 'max' || spec.mode === 'min') {
        const want = spec.mode === 'max' ? Math.min(...spec.values) : Math.max(...spec.values);
        const t = spec.values.indexOf(want);
        tries.push({ ...spec, mode: spec.mode === 'max' ? 'min' : 'max', target: t, answer: spec.cats[t] });
      } else {
        spec.cats.forEach((c, i) => { if (i !== spec.target && spec.values[i] !== Number(spec.answer)) tries.push({ ...spec, target: i, answer: String(spec.values[i]) }); });
      }
    },
  });
})();
