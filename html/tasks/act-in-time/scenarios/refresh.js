/*
 * act-in-time / refresh: a busy list (M7).
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('act-in-time');
  const C = env.content;
  const I = env.instruct;
  const { act, limit, Q, refreshBusy, refreshEpoch, snap, toleranceOpen } = fam.lib;

  const REFRESH_KINDS = [
    { id: 'inbox', label: 'Inbox', what: 'the message from' },
    { id: 'tickets', label: 'Support queue', what: 'the ticket from' },
    { id: 'orders', label: 'Recent orders', what: 'the order placed by' },
    { id: 'contacts', label: 'Contacts', what: 'the contact card of' },
  ];
  const REFRESH_NOTES = ['Re: invoice', 'Meeting notes', 'Lunch on Friday?', 'Quick question', 'Your receipt', 'Welcome aboard',
    'Schedule change', 'Photos from the trip', 'Following up', 'Can you review this?', 'Thanks again', 'New address',
    'Weekend plans', 'A small favor', 'Updated details', 'The usual spot', 'Package question', 'Could we reschedule?',
    'A note for later', 'Room for one more', 'Return label', 'Second copy enclosed', 'A few more details',
    'The blue folder', 'Almost ready', 'One last thing', 'Shared photos', 'A quiet corner', 'For the front desk',
    'Table for four', 'A little reminder', 'Draft attached', 'A missing piece', 'On the way', 'Could you confirm?',
    'The short version', 'Extra set of keys', 'Something to discuss', 'Delivery window', 'Good to meet you',
    'A note from home', 'The final draft', 'Spare parts list', 'A place to stay', 'Item details',
    'Paint color samples', 'A fresh start', 'The porch light', 'Maps for Saturday', 'The other envelope',
    'Window measurements', 'A late arrival', 'The garden path', 'Names for the picnic', 'Quiet hours',
    'A name for the group', 'The attic hatch', 'The early train', 'A brass compass', 'The spare umbrella',
    'A corner table', 'Our new routine', 'A note about parking', 'The north entrance', 'A recipe to share',
    'The cracked teacup', 'The extra blanket', 'A list for the cabin', 'The last bus home', 'A second opinion',
    'Along the river path', 'A box of postcards', 'A better route', 'The striped scarf', 'The garden schedule',
    'A map of the floor', 'The envelope seal', 'One shelf available', 'The paper lanterns', 'The silver buttons',
    'Revised arrival time', 'The cedar bench', 'The ferry timetable', 'A change of pace', 'The ceramic pitcher',
    'The choir rehearsal', 'Cotton tablecloth', 'The orchard gate', 'Two cups of tea', 'A key for the shed',
    'The linen cupboard', 'The reading lamp', 'The downstairs bell', 'A day at the lake', 'The narrow bookshelf',
    'A call before noon', 'The music room', 'The red suitcase', 'A bundle of letters', 'The side entrance',
    'A longer walk', 'The courtyard steps', 'A borrowed ladder', 'The morning ferry', 'An extra chair',
    'The stone footbridge', 'A repair update', 'A quiet afternoon', 'The library card', 'The keys are ready',
    'A handwritten list', 'The evening class', 'A stop along the way'];

  // A list that reloads on a schedule: busy (spinner, dimmed rows) for `busy` ms, then the rows come back in a
  // new order. A click while busy is a mistake. Timeline: busy [0, first), idle `gap`, busy `busy`, idle `gap`, ...
  function sampleRefresh(rng, beat, o) {
    const lv = o.lv || 0;
    const n = o.ood ? rng.int(8, 9) : Math.round(rng.int(5, 7) - 2 * lv);
    const kind = rng.pick(REFRESH_KINDS);
    const seen = new Set();
    const items = [];
    for (let k = 0; items.length < n && k < 200; k++) {
      const name = C.personName(rng, C.csplitOf(o)).full;
      if (seen.has(name)) continue;
      seen.add(name);
      items.push({ name, note: rng.pick(REFRESH_NOTES) });
    }
    const target = rng.int(0, items.length - 1);
    // Display orders per reload epoch: the target never sits at the same place twice in a row.
    const pos = (ord) => ord.indexOf(target);
    const orders = [items.map((_, i) => i)];
    while (orders.length < 6) {
      const ord = rng.shuffle(items.map((_, i) => i));
      if (pos(ord) !== pos(orders[orders.length - 1])) orders.push(ord);
    }
    const busy = snap(rng.float(1, 2 - 0.4 * lv) * beat);
    const first = snap(rng.float(1.5, 3 - 0.8 * lv) * beat);
    const gap = snap(rng.float(3 + 1.2 * lv, 4.5 + 1.5 * lv) * beat);
    return { kind: kind.id, label: kind.label, what: kind.what, items, target, orders, first, busy, gap };
  }

  const T_REFRESH = ['Open {what} {name}.', 'Find {what} {name} in the list and open it.', 'Click through to {what} {name}.',
    'Go into {what} {name}.', 'Select {what} {name} from the list.', 'Pick {what} {name} and open it.',
    'The item to open is {what} {name}.', 'Open the entry for {what} {name}.', 'Take me to {what} {name}.',
    'I want to view {what} {name}.', 'Show me {what} {name} opened.'];

  env.scenario('act-in-time', {
    name: 'refresh',
    sample: sampleRefresh,
    start(spec) {
      const mode = spec.startMode;
      const m = { t: 0, open: null, early: 0, strikes: 0 };
      if (mode === 'wrong') Object.assign(m, { open: (spec.target + 1) % spec.items.length, strikes: 1 });
      return m;
    },
    error: (model, spec) => model.open !== null && model.open === spec.target ? 0 : 1,
    endedBy(model, spec) {
      if (model.early) return 'busy-click';
      return model.strikes >= limit(spec) ? 'wrong-choice' : null;
    },
    tolerance: toleranceOpen,
    act(model, spec, ev, m, t) {
      // ev.item: the row clicked (an item index). While the list is busy a click is early, whatever it hits.
      if (ev.item !== undefined && m.open === null) {
        if (refreshBusy(spec, t)) m.early += 1;
        else {
          m.open = ev.item;
          if (ev.item !== spec.target) m.strikes += 1;
        }
      } else if (ev.back) m.open = null;
    },
    simulate(m, spec, step, c) {
      if (c.row !== undefined) m = act(m, spec, { item: c.row });
      else if (c.back) m = act(m, spec, { back: true });
      return m;
    },
    plan(model, spec) {
      const t = model.t;
      if (model.open !== null) return model.open === spec.target ? null : { click: { back: true } };
      return refreshBusy(spec, t) ? { wait: true } : { click: { row: spec.target } };
    },
    solveBy(spec, model, m) {
      return { ...m, open: spec.target, early: 0, strikes: 0 };
    },
    phrase(spec, rng, pick, say) {
      const nm = spec.items[spec.target].name;
      return say(I.fill(pick(T_REFRESH), { what: spec.what, name: Q(nm) }), { terse: `open ${nm}` });
    },
    judgeAsk(jr, spec, mk, cant) {
      const names = spec.items.map((x) => x.name);
      let name = '';
      for (let k = 0; k < 60 && (!name || names.includes(name)); k++) name = C.personName(jr, C.csplitOf(spec)).full;
      return mk(name, T_REFRESH, { what: spec.what, name: Q(name) }, cant(`${name} is not in the list`));
    },
    factRows(model, spec, f) {
      if (model.open === null) return [];
      const it = spec.items[model.open];
      const label = { inbox: 'Subject', tickets: 'Ticket topic', orders: 'Order note', contacts: 'Contact note' }[spec.kind] || 'Note';
      return [f(label, it.note, ['Note', 'Topic']), f('Opened', it.name, ['Name', 'From'])];
    },
    silentEdit(next, prev, spec, rng, m, out) {
      const beat = spec.beat;
      // The row did not open; the list must still be idle and in the same order when the click is repeated.
      const tn = next.t + beat;
      if (!(next.open === spec.target && prev.open !== spec.target) || refreshBusy(spec, tn) || refreshEpoch(spec, tn) !== refreshEpoch(spec, next.t)) return null;
      m.open = null;
      return out(m);
    },
    retargetEdit(spec, model, rng, base, good, others) {
      // the named item never sits at the same place twice running in the page's reload orders
      const moves = (t) => spec.orders.every((o, k) => k === 0 || o.indexOf(t) !== spec.orders[k - 1].indexOf(t));
      const t = others(spec.items.length, spec.target, model.open === null ? -1 : model.open).filter(moves);
      return t.length ? good({ ...base, target: rng.pick(t) }) : null;
    },
  });
})();
