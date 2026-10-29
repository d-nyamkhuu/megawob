/* wizard / checkout: input-step builder; spec and fields are documented in logic.js. */
(function () {
  'use strict';
  const { C, F, person, addressOf, emailFor, phoneOf, cardOf, countryNames, GIFT_NOTES } = env.taskOf('complete-wizard').lib;
  const { pad2 } = env.util;

  env.scenario('complete-wizard', {
    name: 'checkout',
    sample(rng, spec) {
      const p = person(rng, spec);
      const a = addressOf(rng, spec);
      const ood = spec.ood;
      const steps = [];
      const acct = [F('email', 'text', { fmt: 'email', target: emailFor(rng, p), placeholder: 'you@example.com' }),
        F('fullName', 'text', { fmt: 'name', target: p.full })];
      if (ood || rng.bool(0.4)) acct.push(F('phone', 'text', { fmt: 'phone', target: phoneOf(rng), required: false, hint: 'For delivery updates' }));
      steps.push({ title: rng.pick(['Account', 'Contact', 'Your details', 'About you', 'Buyer']), fields: acct });

      const countries = C.sample(rng, countryNames().filter((c) => c !== a.country), rng.int(4, ood ? 9 : 6), spec);
      const ship = [F('street', 'text', { fmt: 'free', target: a.street }),
        F('apt', 'text', { fmt: 'free', required: false, target: a.apt && rng.bool(0.6) ? a.apt : '' }),
        F('city', 'text', { fmt: 'name', target: a.city }),
        F('postcode', 'text', { fmt: 'postcode', target: a.postcode })];
      if (ood || rng.bool(0.5)) ship.push(F('country', 'select', { options: rng.shuffle([a.country, ...countries]), target: a.country }));
      const opts = rng.sample(C.SHIPPING_METHODS.filter((m) => m.price < 40), rng.int(3, 4));
      const prices = Object.fromEntries(opts.map((m) => [m.name, m.price]));
      const days = Object.fromEntries(opts.map((m) => [m.name, m.days ? m.days[1] : 5]));
      const grounded = rng.pick([null, null, 'cheapest', 'fastest']);
      const byPrice = opts.slice().sort((x, y) => x.price - y.price);
      const byDays = opts.slice().sort((x, y) => days[x.name] - days[y.name]);
      const uniqueMin = (xs, key) => xs.length > 1 && key(xs[0]) !== key(xs[1]);
      let g = grounded;
      if (g === 'cheapest' && !uniqueMin(byPrice, (m) => m.price)) g = null;
      if (g === 'fastest' && !uniqueMin(byDays, (m) => days[m.name])) g = null;
      const target = g === 'cheapest' ? byPrice[0].name : g === 'fastest' ? byDays[0].name : rng.pick(opts).name;
      const deliv = F('delivery', 'choice', { options: opts.map((m) => m.name), prices, days, target, grounded: g,
        initial: rng.bool(0.4) ? opts[0].name : '' });
      const delivery = [deliv];
      if (ood || rng.bool(0.4)) delivery.push(F('gift', 'check', { required: false, target: rng.bool(0.5), initial: false }));
      if (ood) delivery.push(F('giftNote', 'text', { fmt: 'free', required: false, target: rng.bool(0.6) ? rng.pick(GIFT_NOTES) : '' }));
      if (ood || rng.bool(0.5)) {
        steps.push({ title: rng.pick([
          'Shipping', 'Shipping address', 'Address', 'Destination', 'Send to'
        ]), fields: ship });
        steps.push({ title: rng.pick(['Delivery', 'Shipping method']), fields: delivery });
      } else steps.push({ title: rng.pick(['Shipping', 'Delivery']), fields: [...ship.filter((f) => f.id !== 'country' || ship.length < 5), deliv] });

      const exp = `${pad2(rng.int(1, 12))}/${rng.int(27, 31)}`;
      const pay = [F('cardName', 'text', { fmt: 'name', target: rng.bool(0.8) ? p.full : person(rng, spec).full }),
        F('card', 'text', { fmt: 'card', target: cardOf(rng), placeholder: '1234 5678 9012 3456' }),
        F('expiry', 'text', { fmt: 'expiry', target: exp, placeholder: 'MM/YY' }),
        F('cvc', 'text', { fmt: 'cvc', target: C.digits(rng, 3), placeholder: '123' })];
      steps.push({ title: rng.pick(['Payment', 'Billing', 'Card details', 'Your card', 'Tender']), fields: pay });
      return steps;
    },
  });
})();
