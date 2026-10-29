/*
 * act-in-time / countdown:
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('act-in-time');
  const C = env.content;
  const I = env.instruct;
  const { clone } = env.util;
  const { expired, holdLeft, limit, Q, round3 } = fam.lib;

  const HOLDS = [
    { item: (r, c) => `Concert: ${c}`, confirm: 'Reserve seats', groups: [['section', 'Section', ['Floor', 'Lower bowl', 'Upper bowl', 'Balcony']], ['qty', 'Tickets', ['1', '2', '3', '4']], ['delivery', 'Delivery', ['Mobile ticket', 'Print at home', 'Will call']]] },
    { item: (r, c, p) => p, confirm: 'Add to cart', groups: [['size', 'Size', ['XS', 'S', 'M', 'L', 'XL']], ['color', 'Color', ['Black', 'Navy', 'Olive', 'Sand', 'Grey']], ['fit', 'Fit', ['Regular', 'Slim', 'Relaxed']]] },
    { item: () => 'Grocery delivery slot', confirm: 'Book slot', groups: [['day', 'Day', ['Today', 'Tomorrow', 'Friday', 'Saturday']], ['slot', 'Time', ['8-10', '10-12', '12-14', '16-18', '18-20']], ['bags', 'Bags', ['Paper', 'No bags', 'Reusable']]] },
    { item: (r, c) => `Table at ${c}`, confirm: 'Confirm booking', groups: [['party', 'Guests', ['2', '3', '4', '5', '6']], ['time', 'Time', ['18:00', '18:30', '19:00', '19:30', '20:00']], ['area', 'Seating', ['Inside', 'Terrace', 'Bar']]] },
    { item: () => 'Flight seat', confirm: 'Hold seat', groups: [['cabin', 'Cabin', ['Economy', 'Premium', 'Business']], ['seat', 'Seat', ['Window', 'Middle', 'Aisle']], ['bag', 'Checked bag', ['None', '1 bag', '2 bags']]] },
  ];

  function sampleCountdown(rng, beat, o) {
    const h = rng.pick(HOLDS);
    const company = C.pick(rng, C.COMPANIES, { csplit: o.csplit });
    const product = C.pick(rng, C.PRODUCTS.filter((p) => p.category === 'clothing'), { csplit: o.csplit }).name;
    const ng = o.ood ? 3 : rng.int(2, 3);
    const groups = h.groups.slice(0, ng).map(([key, label, options]) => {
      const opts = options.length > 4 && rng.bool(0.4) ? options.slice(0, 4) : options.slice();
      return { key, label, options: opts, want: rng.pick(opts) };
    });
    const extra = o.startMode === 'wrong' ? 1 : 0;
    const slack = o.ood ? 2 : rng.int(3, 5);
    let hold = (ng + 1 + extra + slack) * beat;
    // traits.countdown { hold: ms }: the reference's exact timer (never below what the oracle needs + 2 beats).
    const fixed = o.traits && o.traits.countdown && o.traits.countdown.hold;
    if (fixed) hold = Math.max(fixed, (ng + 3 + extra) * beat);
    return { item: h.item(rng, company, product), groups, hold, confirm: h.confirm };
  }

  const cdWrong = (spec, m) => spec.groups.filter((g) => m.sel[g.key] !== g.want).length;

  const T_COUNT = ['Before the hold expires, choose {sel} and press {confirm}.', 'Pick {sel}, then click {confirm} before the timer runs out.',
    'You only have a few seconds: select {sel} and {confirmLc}.', 'Set {sel} and confirm with {confirm} while the hold lasts.',
    'Quickly choose {sel}, then press {confirm}.', 'Lock in {sel} with {confirm} before time is up.',
    'Use the time left to select {sel} and press {confirm}.',
    '{sel} must be selected, then {confirm} pressed in time.',
    'Once {sel} is set, press {confirm} before time runs out.', 'Beat the timer: select {sel}, then {confirmLc}.',
    'While the hold is active, select {sel} and {confirmLc}.'];

  const ABSENT_OPTS = { section: ['VIP box', 'Mezzanine'], qty: ['9', '12'], delivery: ['Courier', 'Postal mail'], size: ['XXL', 'XXS'], color: ['Teal', 'Pink'],
    fit: ['Oversized', 'Tailored'], day: ['Sunday', 'Monday'], slot: ['6-8', '22-24'], bags: ['Cardboard', 'Cloth'], party: ['12', '15'], time: ['17:00', '21:30'],
    area: ['Rooftop', 'Patio'], cabin: ['First class', 'Basic'], seat: ['Exit row', 'Bulkhead'], bag: ['3 bags', '5 bags'] };

  env.scenario('act-in-time', {
    name: 'countdown',
    sample: sampleCountdown,
    level(spec, lv) {
      const beat = spec.beat;
      if (lv >= 1) spec.groups = spec.groups.slice(0, 2);
      spec.hold += Math.ceil(3 * lv) * beat;
    },
    start(spec) {
      const mode = spec.startMode;
      const m = { t: 0, sel: {}, confirmed: false, strikes: 0 };
      const g = spec.groups[0];
      if (mode === 'partial') m.sel[g.key] = g.want;
      if (mode === 'wrong') m.sel[g.key] = g.options.find((x) => x !== g.want);
      return m;
    },
    error(model, spec) {
      const w = cdWrong(spec, model);
      if (model.confirmed && w) return 1;
      return round3((w + (model.confirmed ? 0 : 1)) / (spec.groups.length + 1));
    },
    endedBy(model, spec) {
      if (model.strikes >= limit(spec)) return 'wrong-choice';
      return expired(spec, model) ? 'expired' : null;
    },
    tolerance() {
      return { tau: 0, sigma: 0.4, minInitialError: 0.3 };
    },
    act(model, spec, ev, m) {
      if (ev.cancel) { if (m.confirmed) m.confirmed = false; return; }
      if (m.confirmed || expired(spec, m)) return;
      if (ev.opt) m.sel[ev.opt[0]] = ev.opt[1];
      else if (ev.confirm && spec.groups.every((g) => m.sel[g.key] !== undefined)) {
        m.confirmed = true;
        if (cdWrong(spec, m)) m.strikes += 1;
      }
    },
    plan(model, spec) {
      if (model.confirmed) return cdWrong(spec, model) ? { click: { cancel: true } } : null;
      const g = spec.groups.find((x) => model.sel[x.key] !== x.want);
      if (g) return { click: { opt: [g.key, g.want] } };
      return { click: { confirm: true } };
    },
    solveBy(spec, model, m) {
      return { ...m, sel: Object.fromEntries(spec.groups.map((g) => [g.key, g.want])), confirmed: true, strikes: 0 };
    },
    phrase(spec, rng, pick, say) {
      const sel = spec.groups.map((g) => (rng.bool(0.5) ? `${g.label.toLowerCase()} ${Q(g.want)}` : `${Q(g.want)} for ${g.label.toLowerCase()}`));
      const list = sel.length === 2 ? `${sel[0]} and ${sel[1]}` : `${sel.slice(0, -1).join(', ')} and ${sel[sel.length - 1]}`;
      const core = I.ucFirst(I.fill(pick(T_COUNT), { sel: list, confirm: Q(spec.confirm), confirmLc: I.lcFirst(spec.confirm) }));
      return say(core, { steps: sel.map((s) => `choose ${s}`).concat([`press ${Q(spec.confirm)}`]) });
    },
    judgeAsk(jr, spec, mk, cant) {
      const gi = jr.int(0, spec.groups.length - 1);
      const bad = ABSENT_OPTS[spec.groups[gi].key].filter((o) => !spec.groups[gi].options.includes(o));
      const opt = jr.pick(bad);
      const sel = spec.groups.map((g, i) => {
        const w = i === gi ? opt : g.want;
        return jr.bool(0.5) ? `${g.label.toLowerCase()} ${Q(w)}` : `${Q(w)} for ${g.label.toLowerCase()}`;
      });
      const list = sel.length === 2 ? `${sel[0]} and ${sel[1]}` : `${sel.slice(0, -1).join(', ')} and ${sel[sel.length - 1]}`;
      return mk(opt, T_COUNT, { sel: list, confirm: Q(spec.confirm), confirmLc: I.lcFirst(spec.confirm) },
        cant(`there is no "${opt}" option for ${spec.groups[gi].label.toLowerCase()}`));
    },
    factRows(model, spec, f) {
      return !model.confirmed ? [] : [f('Status', 'Reserved', ['State', 'Confirmed']), f('Item', spec.item, ['Booking', 'Reservation']),
      f('Selection', spec.groups.map((g) => model.sel[g.key]).join(' · '), ['Chosen options', 'Done', 'Options'])];
    },
    silentEdit(next, prev, spec, rng, m, out) {
      const beat = spec.beat;
      // The confirm press or the option choice did not stick (only with the hold time left to repeat it).
      if (next.confirmed && !prev.confirmed) {
        if (cdWrong(spec, next) || holdLeft(spec, next) < 3 * beat) return null;
        m.confirmed = false;
        return out(m);
      }
      const g = spec.groups.find((x) => next.sel[x.key] !== prev.sel[x.key]);
      if (!g || next.sel[g.key] !== g.want) return null;
      m.sel = clone(prev.sel);
      const steps = cdWrong(spec, m) + 1;
      return holdLeft(spec, next) >= (steps + 2) * beat ? out(m) : null;
    },
    retargetEdit(spec, model, rng, base, good) {
      const beat = spec.beat;
      if ((model.confirmed && !spec.recoverable) || expired(spec, model)) return null;
      const pairs = [];
      spec.groups.forEach((g, gi) => g.options.filter((o) => o !== g.want).forEach((o) => pairs.push([gi, o])));
      for (const [gi, o] of rng.shuffle(pairs)) {
        const ns = clone(base);
        ns.groups[gi].want = o;
        const steps = cdWrong(ns, model) + 1 + (model.confirmed ? 1 : 0);
        if (holdLeft(spec, model) < (steps + 2) * beat) continue;
        const r = good(ns);
        if (r) return r;
      }
      return null;
    },
  });
})();
