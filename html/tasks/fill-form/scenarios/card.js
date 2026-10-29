/* fill-form/card: source facts and document layout; shared form sampling stays in logic.js. */
(function () {
  'use strict';
  const C = env.content;
  const { person, countryOptions, randDate, textFact, digits, dateFact, blankFact, pattern, fmtDoc, ORGS } = env.taskOf('fill-form').lib;
  function cardTask(g) {
    const rng = g.rng;
    const p = person(g);
    const style = rng.pick(['id', 'contact', 'profile']);
    const dateStyle = style === 'id' ? 'short' : rng.pick(['long', 'dmy', 'iso', 'abbr']);
    const upper = style === 'id';
    const U = (s) => (upper ? s.toUpperCase() : s);
    const cStyle = rng.pick(['code', 'name']);
    const co = countryOptions(rng, p.country, cStyle);
    const sex = p.sex;
    const tier = rng.pick(['Basic', 'Silver', 'Gold', 'Platinum']);
    const donor = rng.bool();
    const dob = randDate(rng, 1950, 2005);
    const phoneLabel = rng.pick(['Phone', 'Phone number', 'Telephone']);
    // Height in feet and inches on the card, centimetres on the form (rounded; never near a .5).
    let inches;
    for (let k = 0; k < 20; k++) {
      inches = rng.int(58, 77);
      const f = (inches * 2.54) % 1;
      if (Math.abs(f - 0.5) > 0.12) break;
    }
    const heightDoc = rng.pick([`${Math.floor(inches / 12)} ft ${inches % 12} in`, `${Math.floor(inches / 12)}' ${inches % 12}"`,
      `${Math.floor(inches / 12)} ft ${inches % 12}`]);
    const facts = {
      firstName: textFact(['First name', 'Given name'], p.first, U(p.first), { wrong: [p.last, p.middle] }),
      lastName: textFact(['Last name', 'Surname', 'Family name'], p.last, U(p.last), { wrong: [p.first, `${p.first} ${p.last}`] }),
      email: textFact(['Email', 'Email address', 'E-mail'], p.email, p.email, { wrong: [p.email.replace('@', '.'), p.email.split('@')[0]] }),
      phone: textFact([`${phoneLabel} (digits only)`], digits(p.phone), p.phone, { match: 'exact', placeholder: 'digits only', wrong: [p.phone, digits(p.phone).slice(1)] }),
      dob: dateFact(rng, ['Date of birth', 'Birth date'], dob, dateStyle),
      street: textFact(['Street address', 'Address line 1', 'Street'], p.street, U(p.street), { wrong: [`${p.street}, ${p.city}`] }),
      city: textFact(['City', 'Town / City'], p.city, U(p.city), { wrong: [p.country.name, p.zip] }),
      zip: textFact([
        'ZIP / Postal code', 'Postal code', 'Postcode', 'Mailing code'
      ], p.zip, p.zip, { wrong: [p.city, p.zip.slice(0, -1)] }),
      country: { kind: 'dropdown', labels: [cStyle === 'code' ? 'Country (ISO code)' : 'Country'], gold: co.gold, options: co.options, src: U(p.country.name), match: 'option' },
      company: textFact([
        'Company', 'Employer', 'Organization', 'Business', 'Workplace', 'Enterprise'
      ], p.company, U(p.company), { wrong: [p.job] }),
      job: textFact(['Job title', 'Position', 'Role'], p.job, U(p.job), { wrong: [p.company] }),
      sex: { kind: 'radio', labels: ['Sex'], gold: sex === 'F' ? 'Female' : 'Male', options: ['Female', 'Male', 'Not specified'], src: sex, match: 'option' },
      tier: { kind: 'radio', labels: [
        'Membership level', 'Tier', 'Membership'
      ], gold: tier, options: ['Basic', 'Silver', 'Gold', 'Platinum'], src: U(tier), match: 'option' },
      donor: { kind: 'checkbox', labels: ['Registered organ donor', 'Organ donor'], gold: donor, src: donor ? 'Yes' : 'No', match: 'bool' },
      height: textFact(['Height (cm)', 'Height in cm'], String(Math.round(inches * 2.54)), heightDoc,
        { match: 'exact', placeholder: 'cm', wrong: [String(inches), heightDoc] }),
      middle: blankFact(['Middle name']),
      fax: blankFact(['Fax number (digits only)'], 'text', { placeholder: 'digits only', match: 'exact' }),
      website: blankFact(['Website', 'Personal website']),
      altEmail: blankFact(['Alternate email', 'Secondary email']),
      apt: blankFact(['Apartment / Suite']),
    };
    const always = ['firstName', 'lastName'];
    const optional = ['email', 'phone', 'dob', 'street', 'city', 'zip', 'country', 'company', 'job', 'sex', 'tier', 'donor', 'height'];
    const build = (shown) => cardDoc(rng, style, p, facts, shown, { dateStyle, upper, sex, tier, donor, heightDoc });
    return { style, facts, always, optional, build, docName: style === 'id' ? 'ID card' : style === 'contact' ? 'contact card' : 'profile' };
  }

  function cardDoc(rng, style, p, facts, shown, o) {
    const U = (s) => (o.upper ? s.toUpperCase() : s);
    const has = (k) => shown.has(k);
    const L = (opts) => rng.pick(opts);
    const rows = [];
    let heading = null;
    let subtitle = null;
    const nameMode = style === 'contact' ? 'heading' : style === 'id' ? 'split' : rng.pick(['split', 'comma']);
    if (nameMode === 'heading') heading = `${p.first} ${p.last}`;
    else if (nameMode === 'comma') rows.push({ label: 'Name', value: `${U(p.last)}, ${U(p.first)}` });
    else {
      rows.push({ label: L(['Surname', 'Family name', 'Last name']), value: U(p.last) });
      rows.push({ label: L(['Given name', 'First name', 'Forename']), value: U(p.first) });
    }
    if (style === 'contact' && (has('job') || has('company'))) {
      subtitle = has('job') && has('company') ? `${p.job} at ${p.company}` : has('job') ? p.job : p.company;
    } else {
      if (has('job')) rows.push({ label: L(['Position', 'Job title', 'Role']), value: U(p.job) });
      if (has('company')) rows.push({ label: L(['Company', 'Employer', 'Organization']), value: U(p.company) });
    }
    if (has('dob')) rows.push({ label: L([
      'Date of birth', 'DOB', 'Born', 'Birth date', 'Born on', 'Birth dt'
    ]), value: facts.dob.src });
    if (has('sex')) rows.push({ label: 'Sex', value: o.sex });
    if (has('height')) rows.push({ label: L(['Height', 'Ht.']), value: o.heightDoc });
    if (has('email')) rows.push({ label: L(['Email', 'E-mail', 'Mail']), value: p.email });
    if (has('phone')) rows.push({ label: L(['Phone', 'Tel.', 'Mobile', 'Telephone', 'Voice']), value: p.phone });
    const addr = [];
    if (has('street')) addr.push(U(p.street));
    const cityLine = has('city') && has('zip')
      ? (['US', 'CA', 'AU', 'GB', 'IE'].includes(p.country.code) ? `${U(p.city)} ${p.zip}` : `${p.zip} ${U(p.city)}`)
      : has('city') ? U(p.city) : has('zip') ? p.zip : null;
    if (cityLine) addr.push(cityLine);
    const countryRow = style === 'profile' && rng.bool(0.5);
    if (has('country') && !countryRow) addr.push(U(p.country.name));
    if (addr.length) rows.push({ label: L([
      'Address', 'Home address', 'Residence', 'Domicile', 'Home base', 'Usual abode'
    ]), value: addr.join('\n') });
    if (has('country') && countryRow) rows.push({ label: L(['Country', 'Country of residence']), value: p.country.name });
    if (has('tier')) rows.push({ label: L([
      'Membership', 'Tier', 'Member level', 'Level', 'Member class', 'Plan tier'
    ]), value: U(o.tier) });
    if (has('donor')) rows.push({ label: L(['Organ donor', 'Donor']), value: U(o.donor ? 'Yes' : 'No') });
    // Distractors that are never asked for.
    const extras = [];
    extras.push({ label: style === 'id' ? 'Document no.' : 'Member ID', value: pattern(rng, rng.pick([
      'A#######', 'AA######', '###-###-###', '####AAAA', 'A#A#A#A#', 'A##-###AA', 'AAA-#####', '#AA##A##',
      '##-A###-A'
    ])) });
    if (style === 'id' || rng.bool(0.4)) extras.push({ label: style === 'id' ? 'Expiry' : 'Member since', value: style === 'id' ? fmtDoc(randDate(rng, 2027, 2034), 'short') : String(rng.int(2008, 2025)) });
    const issuer = style === 'id'
      ? rng.pick(['IDENTITY CARD', 'RESIDENT PERMIT', 'NATIONAL ID CARD', 'PERSONAL ID CARD', 'RESIDENCE CARD'])
      : style === 'contact' ? rng.pick([
        'Contact', 'Directory', 'Address book', 'Card index', 'Listing', 'Record card'
      ]) : rng.pick(['Member profile', 'Customer record', 'Account details']);
    const org = rng.pick(ORGS);
    return { kind: 'card', style, heading, subtitle, issuer, org, rows, extras, initials: p.first[0] + p.last[0] };
  }


  env.scenario('fill-form', { name: 'card', task: cardTask, sample: (rng, opts) => env.taskOf('fill-form').lib.buildSpec(rng, 'card', opts) });
})();
