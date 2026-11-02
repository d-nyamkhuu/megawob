/* wizard / booking: input-step builder; spec and fields are documented in logic.js. */
(function () {
  'use strict';
  const { C, F, person, emailFor, phoneOf, cardOf, cityNames, DATE_FMTS, randomDate, REQUESTS } = env.taskOf('complete-wizard').lib;
  const { pad2 } = env.util;

  env.scenario('complete-wizard', {
    name: 'booking',
    sample(rng, spec) {
      const p = person(rng, spec);
      const ood = spec.ood;
      const steps = [];
      const cities = C.sample(rng, cityNames(), ood ? 8 : rng.int(4, 6), spec);
      const dateFmt = rng.pick(DATE_FMTS);
      const stay = [F('destination', 'select', { options: cities, target: rng.pick(cities) }),
        F('checkin', 'text', { fmt: 'date', dateFmt, target: randomDate(rng, 2026, 2027), placeholder: dateFmt }),
        F('nights', 'text', { fmt: 'number', min: 1, max: 30, target: String(rng.int(1, 14)), placeholder: '1-30' })];
      if (ood || rng.bool(0.6)) stay.push(F('guests', 'choice', { options: ['1', '2', '3', '4'], target: String(rng.int(1, 4)), initial: rng.bool(0.5) ? '2' : '' }));
      steps.push({ title: rng.pick(['Your stay', 'Dates', 'Trip', 'Arrival', 'Nights', 'Where']), fields: stay });
      const guest = [F('fullName', 'text', { fmt: 'name', target: p.full }), F('email', 'text', { fmt: 'email', target: emailFor(rng, p) })];
      if (ood || rng.bool(0.6)) guest.push(F('phone', 'text', { fmt: 'phone', target: phoneOf(rng) }));
      if (ood) guest.push(F('company', 'text', { fmt: 'name', required: false, target: rng.bool(0.5) ? C.pick(rng, C.COMPANIES, spec) : '' }));
      steps.push({ title: rng.pick([
        'Guest details', 'Who is staying', 'Contact', 'Who to reach', 'Name and email', 'Identity'
      ]), fields: guest });
      const rooms = rng.sample([['Standard double', 89], ['Twin room', 95], ['Deluxe king', 139], ['Junior suite', 189],
        ['Family room', 159], ['Studio with kitchenette', 119]], rng.int(3, 4));
      const prices = Object.fromEntries(rooms);
      const g = rng.bool(0.3) ? 'cheapest' : null;
      const sorted = rooms.slice().sort((x, y) => x[1] - y[1]);
      const room = [F('room', 'choice', { options: rooms.map((r) => r[0]), prices, target: g ? sorted[0][0] : rng.pick(rooms)[0], grounded: g })];
      room.push(F('breakfast', 'check', { required: false, target: rng.bool(0.5) }));
      if (ood || rng.bool(0.5)) room.push(F('requests', 'text', { fmt: 'free', required: false, target: rng.bool(0.5) ? rng.pick(REQUESTS) : '' }));
      steps.push({ title: rng.pick([
        'Room', 'Room and extras', 'Extras', 'Comfort', 'Breakfast', 'Selection'
      ]), fields: room });
      if (ood) {
        const pay = [F('cardName', 'text', { fmt: 'name', target: p.full }),
          F('card', 'text', { fmt: 'card', target: cardOf(rng), placeholder: '1234 5678 9012 3456' }),
          F('expiry', 'text', { fmt: 'expiry', target: `${pad2(rng.int(1, 12))}/${rng.int(27, 31)}`, placeholder: 'MM/YY' })];
        steps.push({ title: 'Payment', fields: pay });
      }
      return steps;
    },
  });
})();
