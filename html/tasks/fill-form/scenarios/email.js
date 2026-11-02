/* fill-form/email: source facts and document layout; shared form sampling stays in logic.js. */
(function () {
  'use strict';
  const C = env.content;
  const { pad } = env.util;
  const { person, EVENTS, randDate, addDays, SIZES, countryOptions, NUM_WORDS, textFact, slug, digits, dateFact, fmtDoc, blankFact, an, FIRST_FB, LAST_FB } = env.taskOf('fill-form').lib;
  function emailTask(g) {
    const rng = g.rng;
    const p = person(g);
    const style = rng.pick(['client', 'plain']);
    const dateStyle = rng.pick(['long', 'dmy', 'abbr']);
    const event = rng.pick(EVENTS);
    const arrive = randDate(rng, 2025, 2027);
    const nights = rng.int(1, 6);
    const depart = addDays(arrive, nights);
    const tickets = rng.int(1, 6);
    const size = rng.pick(SIZES);
    const meal = rng.pick(['Standard', 'Vegetarian', 'Vegan', 'Gluten-free']);
    const contact = rng.pick(['Email', 'Phone']);
    const newsletter = rng.bool();
    const cStyle = rng.pick(['code', 'name']);
    const co = countryOptions(rng, p.country, cStyle);
    const ticketWord = rng.bool() ? NUM_WORDS[tickets] : String(tickets);
    // Arrival time: 12-hour in the email, 24-hour in the form.
    const hh = rng.int(1, 12);
    const mm = rng.pick([0, 0, 15, 30, 45, 10, 20, 40, 50]);
    const pm = hh === 12 ? rng.bool(0.7) : rng.bool(0.6);
    const H = (hh % 12) + (pm ? 12 : 0);
    const timeDoc = mm === 0 && rng.bool(0.5) ? `${hh} ${pm ? 'pm' : 'am'}` : `${hh}:${pad(mm)} ${rng.pick(pm ? ['pm', 'PM', 'p.m.'] : ['am', 'AM', 'a.m.'])}`;
    const facts = {
      firstName: textFact(['First name', 'Given name'], p.first, p.first, { wrong: [p.last] }),
      lastName: textFact(['Last name', 'Surname', 'Family name'], p.last, p.last, { wrong: [p.first] }),
      email: textFact(['Email', 'Email address'], p.email, p.email, { wrong: [`registration@${slug(event.split(' ').slice(0, 2).join(''))}.org`] }),
      phone: textFact(['Phone (digits only)', 'Mobile (digits only)'], digits(p.phone), p.phone, { match: 'exact', placeholder: 'digits only', wrong: [p.phone] }),
      company: textFact([
        'Company', 'Organization', 'Employer', 'Workplace'
      ], p.company, p.company, { wrong: [p.job] }),
      job: textFact(['Job title', 'Position'], p.job, p.job, { wrong: [p.company] }),
      city: textFact(['City', 'Home city'], p.city, p.city, { wrong: [p.country.name] }),
      country: { kind: 'dropdown', labels: [cStyle === 'code' ? 'Country (ISO code)' : 'Country'], gold: co.gold, options: co.options, src: p.country.name, match: 'option' },
      arrive: dateFact(rng, ['Arrival date', 'Check-in date'], arrive, dateStyle),
      depart: dateFact(rng, ['Departure date', 'Check-out date'], depart, dateStyle),
      tickets: textFact(['Number of tickets'], String(tickets), ticketWord, { match: 'exact', placeholder: 'number', wrong: [ticketWord === String(tickets) ? String(tickets + 1) : ticketWord] }),
      size: { kind: 'dropdown', labels: ['T-shirt size'], gold: size[0], options: SIZES.map((s) => s[0]), src: size[1], match: 'option' },
      meal: { kind: 'radio', labels: ['Meal preference', 'Dinner menu'], gold: meal, options: ['Standard', 'Vegetarian', 'Vegan', 'Gluten-free'], src: meal.toLowerCase(), match: 'option' },
      contact: { kind: 'radio', labels: ['Preferred contact', 'Contact me by'], gold: contact, options: ['Email', 'Phone'], src: contact.toLowerCase(), match: 'option' },
      newsletter: { kind: 'checkbox', labels: ['Subscribe to the newsletter', 'Send me the newsletter'], gold: newsletter, src: newsletter ? 'newsletter' : "don't", match: 'bool' },
      nights: textFact(['Number of nights', 'Nights'], String(nights), `${fmtDoc(arrive, dateStyle)} - ${fmtDoc(depart, dateStyle)}`,
        { match: 'exact', placeholder: 'number', computed: true, needs: ['arrive', 'depart'], wrong: [String(nights + 1)] }),
      arrTime: textFact(['Arrival time', 'Expected arrival time'], `${pad(H)}:${pad(mm)}`, timeDoc,
        { match: 'exact', placeholder: 'HH:MM (24h)', wrong: [`${pad(hh)}:${pad(mm)}`, timeDoc] }),
      middle: blankFact(['Middle name']),
      fax: blankFact(['Fax number (digits only)'], 'text', { placeholder: 'digits only', match: 'exact' }),
      website: blankFact(['Website']),
      emergency: blankFact(['Emergency contact name']),
    };
    const always = ['firstName', 'lastName', 'email'];
    const optional = ['phone', 'company', 'job', 'city', 'country', 'arrive', 'depart', 'tickets', 'size', 'meal', 'contact', 'newsletter', 'nights', 'arrTime'];
    const build = (shown) => emailDoc(rng, style, p, facts, shown, { event, tickets, ticketWord, size, meal, contact, newsletter, timeDoc });
    return { style, facts, always, optional, build, docName: 'email' };
  }

  function emailDoc(rng, style, p, facts, shown, o) {
    const has = (k) => shown.has(k);
    const L = (xs) => rng.pick(xs);
    const host = slug(o.event.split(' ').slice(0, 2).join(''));
    const s = [];
    if (has('job') && has('company') && rng.bool(0.5)) s.push(L([`I work as ${an(p.job)} at ${p.company}.`, `I'm ${an(p.job)} with ${p.company}.`]));
    else {
      if (has('company')) s.push(L([`I'm coming on behalf of ${p.company}.`, `I'll be representing ${p.company}.`]));
      if (has('job')) s.push(`In case it matters for the badge, my role is ${p.job}.`);
    }
    if (has('city') && has('country')) s.push(L([`I'll be travelling from ${p.city}, ${p.country.name}.`, `I live in ${p.city}, ${p.country.name}.`]));
    else if (has('city')) s.push(`I'll be travelling in from ${p.city}.`);
    else if (has('country')) s.push(`I'm based in ${p.country.name}.`);
    if (has('tickets')) s.push(o.tickets === 1 ? `I only need ${o.ticketWord} ticket.` : L([`Could you reserve ${o.ticketWord} tickets for our group?`, `We will need ${o.ticketWord} tickets in total.`]));
    if (has('arrive') && has('depart')) s.push(L([`I arrive on ${facts.arrive.src} and leave on ${facts.depart.src}.`, `I'll be there from ${facts.arrive.src} until ${facts.depart.src}.`]));
    else if (has('arrive')) s.push(L([`I will arrive on ${facts.arrive.src}.`, `My arrival date is ${facts.arrive.src}.`]));
    else if (has('depart')) s.push(`I have to leave on ${facts.depart.src}.`);
    if (has('arrTime')) s.push(L([`My train gets in at ${o.timeDoc}.`, `I expect to arrive around ${o.timeDoc}.`, `My flight lands at ${o.timeDoc}, so I should be at the venue soon after.`]));
    if (has('meal')) {
      s.push(o.meal === 'Standard'
        ? L(['For the dinner, the standard menu is fine for me.', 'I have no dietary restrictions, so the standard meal is fine.'])
        : L([`For the dinner, please put me down for the ${o.meal.toLowerCase()} meal.`, `Please note that I need ${an(o.meal.toLowerCase())} meal.`]));
    }
    if (has('size')) s.push(L([`My T-shirt size is ${o.size[1]}.`, `I'd like ${an(o.size[1])} T-shirt, if there are any left.`]));
    if (has('contact')) s.push(o.contact === 'Phone' ? 'The best way to reach me is by phone.' : 'Please contact me by email rather than phone.');
    if (has('newsletter')) s.push(o.newsletter ? L(['Please also sign me up for your newsletter.', 'You can add me to the newsletter too.']) : L(["Please don't add me to the newsletter.", "I'd rather not receive the newsletter, thanks."]));
    const body = rng.shuffle(s);
    // Group sentences into 1-3 short paragraphs.
    const paras = [];
    const per = Math.max(2, Math.ceil(body.length / rng.int(1, 3)));
    for (let i = 0; i < body.length; i += per) paras.push(body.slice(i, i + per).join(' '));
    if (rng.bool(0.4)) {
      const other = `${rng.pick(FIRST_FB.filter((n) => n !== p.first))} ${rng.pick(LAST_FB.filter((n) => n !== p.last))}`;
      paras.push(`My colleague ${other} might register separately later.`);
    }
    const greet = L([
      'Hello,', 'Hi there,', 'Dear registration team,', 'Good morning,', 'Hello everyone,', 'Good afternoon,',
      'Good evening,', 'Greetings,', 'Dear all,', 'Dear organizers,', 'Hello there,', 'Dear event team,', 'Good day,'
    ]);
    const opener = L([`I'd like to register for the ${o.event}.`, `I'm writing to sign up for the ${o.event}.`, `Please register me for the ${o.event}.`]);
    const sig = [L([
      'Best regards,', 'Kind regards,', 'Thanks,', 'Cheers,', 'Sincerely,', 'Yours truly,', 'Take care,', 'Warmly,',
      'Until then,', 'Talk soon,', 'Fondly,', 'Respectfully,', 'Faithfully,'
    ]), `${p.first} ${p.last}`];
    if (has('phone')) {
      if (rng.bool(0.5)) sig.push(`${L(['Tel.', 'Phone:', 'Mobile:'])} ${p.phone}`);
      else paras.push(`If anything comes up, you can call me at ${p.phone}.`);
    }
    const sent = randDate(rng, 2024, 2025);
    return {
      kind: 'email', style,
      from: { name: `${p.first} ${p.last}`, addr: p.email },
      to: `registration@${host}.org`,
      subject: L([`Registration: ${o.event}`, `Sign-up for ${o.event}`, `${o.event} registration`]),
      date: `${fmtDoc(sent, 'abbr')}, ${pad(rng.int(7, 21))}:${pad(rng.int(0, 59))}`,
      greeting: greet,
      paragraphs: [opener, ...paras],
      signature: sig,
      initials: p.first[0] + p.last[0],
    };
  }


  env.scenario('fill-form', { name: 'email', task: emailTask, sample: (rng, opts) => env.taskOf('fill-form').lib.buildSpec(rng, 'email', opts) });
})();
