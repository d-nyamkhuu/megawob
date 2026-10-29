/* type-text/fields.js: Field generators, text transforms, validation and distance helpers. */
(function () {
  'use strict';

  const { nonEmpty, cap, pad, quote: q } = env.util;

  const C = env.content;
  const I = env.instruct;

  // Fallback names for the rare run where six content names in a row are not typeable (see person()).
  const FIRST_FB = [
    'Maria', 'James', 'Aiko', 'Lukas', 'Priya', 'Omar', 'Sofia', 'Daniel', 'Chloe', 'Mateo', 'Amara', 'Niko', 'Elena',
    'Hugo', 'Leila', 'Talia', 'Andre', 'Kenji', 'Nadia', 'Isaac', 'Rania', 'Felix', 'Maren', 'Elias', 'Noemi',
    'Zahid', 'Anika', 'Kiran', 'Lucan', 'Robin', 'Imani', 'Yara', 'Dario', 'Maeve', 'Soren', 'Ravi', 'Greta', 'Tessa',
    'Ansel', 'Marcel'
  ];
  const LAST_FB = [
    'Lopez', 'Nakamura', 'Okafor', 'Schmidt', 'Patel', 'Rossi', 'Kowalski', 'Haddad', 'Chen', 'Silva', 'Morgan',
    'Fischer', 'Dubois', 'Mensah', 'Novak', 'Sato', 'Ibrahim', 'Costa', 'Bennett', 'Rahman', 'Alvarez', 'Tanaka',
    'Petrov', 'Farouk', 'Kessler', 'Doyle', 'Kamara', 'Salim', 'Byrne', 'Ortega', 'Laurent', 'Murphy', 'Jensen',
    'Duarte', 'Wilson', 'Hassan', 'Foster', 'Booker', 'Perry', 'Nolan'
  ];
  const PUNCT = '!#$%&*-_.@?+=';
  const LOWER = 'abcdefghijkmnopqrstuvwxyz';
  const UPPER = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const DIGITS = '0123456789';
  const LOCALES = ['en-US', 'en-US', 'en-US', 'en-GB', 'de-DE', 'fr-FR', 'es-ES', 'it-IT', 'nl-NL', 'pl-PL'];

  const chars = (rng, alphabet, n) => Array.from({ length: n }, () => rng.pick(alphabet)).join('');
  const digits = (rng, n) => chars(rng, DIGITS, n);
  const ascii = (s) => C.ascii(s);

  // Words for free text and transforms: lower-case ASCII words from product names and headlines.
  let WORDS = null;
  function words() {
    if (WORDS) return WORDS;
    const src = [...C.PRODUCTS.map((p) => p.name), ...C.HEADLINES, ...C.TOPICS.map(String)];
    const set = new Set();
    for (const s of src) {
      for (const w of ascii(s).toLowerCase().split(/[^a-z]+/)) if (w.length >= 4 && w.length <= 10) set.add(w);
    }
    WORDS = [...set].sort();
    return WORDS;
  }

  // ---------------------------------------------------------------- generators

  function person(g) {
    for (let k = 0; k < 6; k++) {
      const p = C.personName(g.rng, { csplit: g.csplit });
      // Keep names typeable and free of characters that change length when case-mapped.
      if (/^[\p{L}' -]+$/u.test(p.first + p.last) && !/[ßıİ]/.test(p.first + p.last)) return p;
    }
    const first = g.rng.pick(FIRST_FB);
    const last = g.rng.pick(LAST_FB);
    return { first, last, full: `${first} ${last}` };
  }

  function password(rng, ood, level) {
    if (level === 'easy') return chars(rng, LOWER, rng.int(5, 6)) + digits(rng, rng.int(2, 3));
    if (level === 'medium') return chars(rng, LOWER, 3) + chars(rng, UPPER, 2) + digits(rng, rng.int(2, 3)) + chars(rng, PUNCT, 1);
    const n = ood ? rng.int(14, 20) : rng.int(8, 12);
    const parts = [chars(rng, LOWER, 2), chars(rng, UPPER, 2), digits(rng, 2), chars(rng, PUNCT, rng.int(1, 2))];
    const rest = chars(rng, LOWER + UPPER + DIGITS, Math.max(0, n - parts.join('').length));
    return rng.shuffle((parts.join('') + rest).split('')).join('');
  }

  function username(g, p) {
    return handleOnly(C.username(g.rng, p));
  }
  const handleOnly = (s) => ascii(s).replace(/[^A-Za-z0-9._-]/g, '');

  function email(g, p) {
    return ascii(C.emailAddress(g.rng, p)).toLowerCase();
  }

  // National phone number for a locale (never with a leading '+', so "digits only" is unambiguous).
  function phone(g) {
    const pat = g.rng.pick(C.PHONE_FORMATS[g.locale].national);
    let first = true;
    return pat.replace(/#/g, () => {
      const d = first && /^[(]?#/.test(pat) ? g.rng.int(2, 9) : g.rng.int(0, 9);
      first = false;
      return String(d);
    });
  }

  function addressOf(g) {
    return C.address(g.rng, g.locale, { csplit: g.csplit });
  }

  // Date formats by locale ('short' numeric styles, as forms show them in their placeholder).
  const DATE_FMT = { 'en-US': 'MM/DD/YYYY', 'en-GB': 'DD/MM/YYYY', 'de-DE': 'DD.MM.YYYY', 'fr-FR': 'DD/MM/YYYY',
    'es-ES': 'DD/MM/YYYY', 'it-IT': 'DD/MM/YYYY', 'nl-NL': 'DD-MM-YYYY', 'pl-PL': 'DD.MM.YYYY' };
  const MONTHS = env.content.MONTHS;
  function fmtDate(dt, fmt) {
    return fmt.replace('YYYY', String(dt.y)).replace('MM', pad(dt.m)).replace('DD', pad(dt.d));
  }
  const dateRe = (fmt) => new RegExp(`^${fmt.replace(/[.\/-]/g, (c) => `\\${c}`).replace('YYYY', '\\d{4}').replace('MM', '\\d{2}').replace('DD', '\\d{2}')}$`);
  function randDate(rng, y0, y1) {
    const y = rng.int(y0, y1);
    const m = rng.int(1, 12);
    // Day > 12 so a numeric date never reads both ways.
    return { y, m, d: rng.int(13, 28) };
  }

  // Locale number format for amounts (1,234.56 / 1.234,56 / 1 234,56).
  function amountText(x, locale) {
    return C.formatNumber(x, locale, 2).replace(/[  ]/g, ' ');
  }

  // Free text for the single-field scenario (enter-text, enter-text-dynamic).
  function freeText(g) {
    const r = g.rng;
    const W = words();
    const p = () => person(g);
    return r.pick([
      () => r.pick(W),
      () => cap(r.pick(W)),
      () => `${r.pick(W)} ${r.pick(W)}`,
      () => `${cap(r.pick(W))} ${r.pick(W)} ${r.int(2, 99)}`,
      () => C.pick(g.rng, C.PRODUCTS, g).name,
      () => C.pick(g.rng, C.COMPANIES, g),
      () => C.pick(g.rng, C.CITIES, g).city,
      () => p().full,
      () => email(g, p()),
      () => C.couponCode(r),
      () => C.sku(r),
      () => `${chars(r, LOWER + DIGITS, 3)} ${chars(r, UPPER + DIGITS, 3)}`,
    ])();
  }

  // ---------------------------------------------------------------- labels (FIELD_LABELS bank + local aliases)

  // Find a FIELD_LABELS entry by candidate ids or labels; merge its aliases with the local ones.
  function labelInfo(ids, labels, aliases) {
    const bank = C.FIELD_LABELS;
    const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
    const want = new Set([...ids, ...labels].map(norm));
    const hit = bank.find((e) => e && (want.has(norm(e.id)) || want.has(norm(e.label))));
    const all = [...labels];
    let al = [...aliases];
    if (hit) {
      if (!all.some((l) => norm(l) === norm(hit.label))) all.unshift(hit.label);
      al = [...al, ...(hit.aliases || [])];
    }
    return { labels: all, aliases: al, entry: hit };
  }

  // Multi-form field kinds: label sources, placeholders, validator and value generator.
  // gen(g) -> { target, say?, placeholder?, mask?, maxLength?, counter?, check? }
  const KINDS = {
    first: { ids: ['first_name', 'firstName'], labels: ['First name', 'Given name'], aliases: ['given name', 'forename', 'first name'],
      ph: [
        'Jane', 'First name', '', 'Ivo', 'Mei', 'Lena', 'Ravi', 'Tess', 'Given name'
      ], check: 'name', gen: (g) => ({ target: g.person.first }) },
    last: { ids: ['last_name', 'lastName', 'surname'], labels: ['Last name', 'Surname', 'Family name'], aliases: ['surname', 'family name', 'last name'],
      ph: [
        'Doe', 'Last name', '', 'Wu', 'Roy', 'Kerr', 'Ames', 'Dunn', 'Surname'
      ], check: 'name', gen: (g) => ({ target: g.person.last }) },
    city: { ids: ['city'], labels: ['City', 'Town / city'], aliases: ['town', 'city'], ph: ['e.g. Springfield', 'City', ''],
      gen: (g) => ({ target: g.addr.city }) },
    email: { ids: ['email'], labels: ['Email', 'Email address', 'E-mail'], aliases: ['email address', 'e-mail', 'mail address'],
      ph: [
        'name@example.com', 'you@domain.com', '', 'ab@example.org', 'Email'
      ], check: 'email', gen: (g) => ({ target: email(g, g.person) }) },
    phone: { ids: ['phone'], labels: ['Phone', 'Phone number', 'Mobile'], aliases: ['phone number', 'telephone', 'contact number', 'mobile number'],
      ph: ['Phone', ''], check: 'phone',
      gen(g) {
        const raw = phone(g);
        const d = raw.replace(/\D/g, '');
        if (g.locale === 'en-US' && d.length === 10 && g.rng.bool(0.45)) {
          const target = `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
          return { target, say: g.rng.pick([d, `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`, `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`]),
            mask: '(999) 999-9999', placeholder: '(555) 000-0000' };
        }
        if (g.rng.bool(0.25)) return { target: d, say: raw, check: 'digits', placeholder: 'Digits only', labelSuffix: ' (digits only)' };
        return { target: raw };
      } },
    order: { ids: ['order_number', 'orderNumber', 'order'], labels: ['Order number', 'Order #', 'Order ID'], aliases: ['order reference', 'order no.', 'order ID'],
      ph: ['e.g. ORD-00000', 'Order number', '', 'Order ID'],
      gen(g) {
        const v = C.orderId(g.rng);
        return { target: v, check: /[A-Z]/.test(v) ? 'upper' : null };
      } },
    zip: { ids: ['postal_code', 'postcode', 'zip'], labels: ['ZIP code', 'Postal code', 'Postcode'], aliases: ['postcode', 'postal code', 'ZIP'],
      ph: ['Postal code', ''], gen: (g) => ({ target: g.addr.postcode, check: /[A-Z]/.test(g.addr.postcode) ? 'upper' : null }) },
    company: { ids: ['company'], labels: ['Company', 'Organization'], aliases: ['company name', 'employer', 'organisation'],
      ph: ['Company name', ''], gen: (g) => ({ target: C.pick(g.rng, C.COMPANIES, g) }) },
    username: { ids: ['username'], labels: ['Username', 'User name'], aliases: ['user name', 'login name', 'handle'],
      ph: ['username', ''], check: 'nospace', gen: (g) => ({ target: username(g, g.person) }) },
    street: { ids: ['address_line1', 'street', 'address1'], labels: ['Street address', 'Address line 1'], aliases: ['street', 'street and number', 'first address line'],
      ph: ['Street and number', ''], gen: (g) => ({ target: g.addr.line1 }) },
    job: { ids: ['job_title', 'jobTitle'], labels: ['Job title', 'Position'], aliases: ['role', 'title at work', 'position'],
      ph: ['e.g. Accountant', ''], gen: (g) => ({ target: C.pick(g.rng, C.JOB_TITLES, g) }) },
    dob: { ids: ['date_of_birth', 'dob', 'birthdate'], labels: ['Date of birth', 'Birth date'], aliases: ['birthday', 'birth date', 'DOB'],
      ph: [''],
      gen(g) {
        const fmt = DATE_FMT[g.locale] || 'MM/DD/YYYY';
        const v = fmtDate(randDate(g.rng, 1950, 2006), fmt);
        return { target: v, placeholder: fmt, check: `date:${fmt}` };
      } },
    card: { notAlias: ['debit card number'], ids: ['card_number', 'cardNumber'], labels: ['Card number', 'Credit card number'], aliases: ['card no.', 'credit card', 'card number'],
      ph: [''],
      gen(g) {
        const v = C.cardNumber(g.rng);
        return { target: v, say: g.rng.bool(0.5) ? v.replace(/\s/g, '') : v, mask: '9999 9999 9999 9999',
          placeholder: '1234 5678 9012 3456', check: 'card' };
      } },
    display: { ids: ['display_name', 'nickname'], labels: ['Display name', 'Nickname'], aliases: ['screen name', 'public name', 'nickname'],
      ph: [''],
      gen(g) {
        const max = g.rng.pick([15, 20, 24]);
        let v = g.rng.pick([`${g.person.first} ${g.person.last[0]}.`, `${g.person.first}${g.rng.int(1, 99)}`, `${cap(g.rng.pick(words()))} ${g.person.first}`]);
        v = v.slice(0, max);
        return { target: v.trim(), maxLength: max, counter: true, placeholder: `Up to ${max} characters` };
      } },
    headline: { ids: ['headline', 'title'], labels: ['Headline', 'Profile headline'], aliases: ['tagline', 'short bio', 'headline'],
      ph: [''],
      gen(g) {
        const max = g.rng.pick([40, 50, 60]);
        const pool = C.HEADLINES.filter((h) => h.length <= max && h.length >= 14 && !/"/.test(h));
        const v = C.pick(g.rng, pool, g);
        return { target: v, maxLength: max, counter: true, placeholder: '' };
      } },
    amount: { notAlias: [
      'total', 'sum', 'value', 'price', 'budget range', 'estimated budget', 'spending limit', 'allowance', 'cap'
    ], ids: ['amount', 'budget'], labels: ['Monthly budget', 'Amount'], aliases: ['budget', 'amount', 'monthly amount'],
      ph: [''],
      gen(g) {
        const x = g.rng.int(120, 98000) / (g.rng.bool(0.5) ? 1 : 100) + (g.rng.bool(0.5) ? 0 : g.rng.int(1, 99) / 100);
        const v = amountText(Math.round(x * 100) / 100, g.locale);
        return { target: v, placeholder: amountText(0, g.locale) };
      } },
  };
  // Blank fields (must stay empty) and disabled decoys (fixed values, unscored).
  const EXTRAS = {
    x_middle: { labels: ['Middle name'], ph: ['Optional', ''] },
    x_apt: { labels: ['Apartment / suite', 'Apt, suite, unit'], ph: ['Optional', ''] },
    x_coupon: { labels: ['Coupon code', 'Promo code'], ph: ['Enter code', ''] },
    x_fax: { labels: ['Fax'], ph: ['Optional', ''] },
    x_ref: { labels: ['Referral code', 'Referred by'], ph: ['Optional', ''] },
    x_dept: { labels: ['Department'], ph: ['e.g. Sales', ''] },
    x_website: { labels: ['Website'], ph: ['https://', ''] },
  };
  const DISABLED = {
    d_customer: { labels: ['Customer ID', 'Customer no.'], gen: (g) => `C-${digits(g.rng, 6)}` },
    d_account: { labels: ['Account number', 'Account ID'], gen: (g) => `${digits(g.rng, 4)} ${digits(g.rng, 4)}` },
    d_since: { labels: ['Member since', 'Customer since'], gen: (g) => String(g.rng.int(2009, 2024)) },
    d_plan: { labels: [
      'Plan', 'Subscription', 'Cedar', 'Orbit'
    ], gen: (g) => g.rng.pick(['Basic', 'Standard', 'Premium', 'Business']) },
    d_region: { labels: [
      'Region', 'Data region', 'Canada East', 'Japan', 'Australia', 'India South', 'Middle East'
    ], gen: (g) => g.rng.pick(['EU (Frankfurt)', 'US East', 'Asia Pacific', 'UK South']) },
    d_created: { labels: ['Created on', 'Registered'], gen: (g) => fmtDate(randDate(g.rng, 2015, 2024), DATE_FMT[g.locale] || 'MM/DD/YYYY') },
  };

  function makeField(g, id, kind, over = {}) {
    const k = KINDS[kind];
    const info = labelInfo(k.ids, k.labels, k.aliases);
    // Bank aliases that name something else for this field (a debit card, a price) are dropped.
    if (k.notAlias) info.aliases = info.aliases.filter((a) => !k.notAlias.includes(a.toLowerCase()));
    const v = k.gen(g);
    let label = g.rng.pick(info.labels);
    if (v.labelSuffix) label += v.labelSuffix;
    const norm = (s) => s.toLowerCase();
    const aliases = [...new Set(info.aliases.filter((a) => norm(a) !== norm(label)))];
    const placeholder = v.placeholder !== undefined ? v.placeholder : g.rng.pick(k.ph);
    return {
      id, kind, label, aliases, placeholder: placeholder === v.target ? '' : placeholder, type: 'text',
      target: v.target, say: v.say !== undefined ? v.say : v.target, blank: false, disabled: false,
      check: v.check !== undefined ? v.check : k.check || null,
      ...(v.mask ? { mask: v.mask } : {}), ...(v.maxLength ? { maxLength: v.maxLength, counter: !!v.counter } : {}),
      ...over,
    };
  }

  function plainField(id, label, placeholder, target, type = 'text', blank = false, extra = {}) {
    return { id, kind: id, label, aliases: [], placeholder: placeholder === target ? '' : placeholder, type, target,
      say: target, blank, disabled: false, check: null, ...extra };
  }

  // ---------------------------------------------------------------- text transforms

  const titleCase = (s) => s.split(' ').map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w)).join(' ');
  function transform(s, rule, sub) {
    if (rule === 'upper') return s.toUpperCase();
    if (rule === 'lower') return s.toLowerCase();
    if (rule === 'title') return titleCase(s);
    if (rule === 'sub') return s.split(sub.from).join(sub.to);
    return s;
  }
  const SUBS = [
    { from: ' ', to: '_', text: 'with every space replaced by an underscore (_)', alt: ['using underscores (_) instead of spaces'] },
    { from: ' ', to: '-', text: 'with every space replaced by a hyphen (-)', alt: ['with hyphens (-) where the spaces are'] },
    { from: ' ', to: '', text: 'with all spaces removed', alt: ['without any spaces'] },
    { from: '-', to: '/', text: 'with every hyphen (-) replaced by a slash (/)', alt: ['using slashes (/) instead of hyphens'] },
    { from: '-', to: '.', text: 'with every hyphen (-) replaced by a period (.)', alt: ['using periods (.) instead of hyphens'] },
  ];
  const RULE_TEXT = {
    upper: [
      'in all capital letters', 'in upper case', 'in capitals', 'all in caps', 'with no small letters',
      'all uppercase'
    ],
    lower: [
      'in all lower-case letters', 'in lower case', 'without any capital letters', 'using lowercase only',
      'with capitals lowercased'
    ],
    title: ['in title case (capitalize the first letter of each word, the rest lower case)',
      'with each word capitalized and the remaining letters in lower case'],
  };

  function randomCase(rng, s) {
    return s.split('').map((c) => (rng.bool(0.4) ? c.toUpperCase() : c.toLowerCase())).join('');
  }

  function transformSource(g, rule, sub) {
    const rng = g.rng;
    const ws = rng.sample(words(), g.level === 'easy' ? rng.int(1, 2) : g.level === 'medium' ? rng.int(2, 3) : rng.int(2, g.ood ? 6 : 4));
    if (g.level === 'easy' && ws.length < 2) ws.push(rng.pick(words()));
    if (rule === 'upper') {
      return rng.pick([() => ws.join(' '), () => ws.map(cap).join(' '), () => `${cap(ws[0])} ${ws[1]} ${rng.int(2, 99)}`,
        () => `${chars(rng, LOWER, 3)}-${digits(rng, 3)}`])();
    }
    if (rule === 'lower') {
      return rng.pick([() => ws.map((w) => w.toUpperCase()).join(' '), () => ws.map(cap).join(' '),
        () => randomCase(rng, ws.slice(0, 2).join(' ')), () => `${chars(rng, UPPER, 3)}-${digits(rng, 3)}`])();
    }
    if (rule === 'title') {
      return rng.pick([() => ws.join(' '), () => ws.map((w) => w.toUpperCase()).join(' '), () => randomCase(rng, ws.join(' ')),
        () => ascii(person(g).full).toLowerCase()])();
    }
    if (sub.from === '-') {
      return rng.pick([() => `${chars(rng, UPPER, 2)}-${digits(rng, 3)}-${chars(rng, UPPER + DIGITS, 2)}`, () => ws.join('-'),
        () => `${digits(rng, 4)}-${digits(rng, 2)}-${digits(rng, 2)}`])();
    }
    return rng.pick([() => ws.join(' '), () => `${cap(ws[0])} ${ws[1]} ${rng.int(2, 99)}`,
      () => `${ascii(person(g).full).replace(/[^A-Za-z ]/g, '')} ${digits(rng, 2)}`])();
  }

  // ---------------------------------------------------------------- error and validation

  const levenshtein = env.util.lev;

  const normLines = (v) => String(v ?? '').replace(/\r/g, '').split('\n').map((s) => s.trim()).filter(Boolean).join('\n');
  const normValue = (v, f) => (f.type === 'textarea' ? normLines(v) : String(v ?? '').trim());

  function fieldError(value, f) {
    const v = normValue(value, f);
    if (f.blank) return v ? 1 : 0;
    const t = normValue(f.target, f);
    return levenshtein(v, t) / Math.max(t.length, v.length, 1);
  }
  const fieldOk = (f, value) => fieldError(value, f) === 0;
  const scored = (spec) => spec.fields.filter((f) => !f.disabled);

  const MESSAGES = {
    required: ['This field is required.', 'Please fill in this field.', 'Required.'],
    email: ['Enter a valid email address.', 'That email address does not look right.'],
    name: ["Names can't contain numbers.", 'Use letters only.'],
    digits: ['Use digits only (no spaces or dashes).', 'Enter numbers only.'],
    upper: ['Use capital letters.', 'Letters must be upper case.'],
    nospace: ["Usernames can't contain spaces.", 'Remove the spaces.'],
    phone: ['Enter a valid phone number.'],
    card: ['Enter all 16 digits of the card number.'],
    date: (fmt) => [`Enter the date as ${fmt}.`, `Use the format ${fmt}.`],
  };

  function checkValue(check, v) {
    if (!check) return true;
    if (check === 'email') return /^[^\s@,]+@[^\s@,]+\.[A-Za-z]{2,}$/.test(v);
    if (check === 'name') return !/\d/.test(v);
    if (check === 'digits') return /^\d+$/.test(v);
    if (check === 'upper') return v === v.toUpperCase();
    if (check === 'nospace') return !/\s/.test(v);
    if (check === 'phone') return /^[+\d\s().\/-]+$/.test(v) && v.replace(/\D/g, '').length >= 7;
    if (check === 'card') return v.replace(/\D/g, '').length === 16;
    if (check.startsWith('date:')) return dateRe(check.slice(5)).test(v);
    return true;
  }

  // What a save attempt reports: { fieldId | '_form': message }; {} = the form saves.
  function validate(spec, values) {
    const out = {};
    for (const f of spec.fields) {
      if (f.disabled || f.blank) continue;
      const v = normValue(values[f.id], f);
      if (!v) out[f.id] = MESSAGES.required[0];
      else if (!checkValue(f.check, v)) {
        if (spec.invalid && spec.invalid.id === f.id) out[f.id] = spec.invalid.message;
        else out[f.id] = f.check.startsWith('date:') ? MESSAGES.date(f.check.slice(5))[0] : MESSAGES[f.check][0];
      }
    }
    if (spec.scenario === 'login' && !Object.keys(out).length
      && spec.fields.some((f) => normValue(values[f.id], f) !== normValue(f.target, f))) {
      out._form = 'Incorrect username or password.';
    }
    return out;
  }

  const countOf = (f, value) => [...String(value ?? '')].length;

  // A wrong value close to (or plausible for) the target, never equal to it after trimming.
  function wrongValue(rng, f, alt) {
    const target = f.target;
    for (let k = 0; k < 12; k++) {
      let v;
      const r = rng.next();
      if (alt && r < 0.4) v = alt();
      else if (r < 0.7 && target.length > 2) {
        const i = rng.int(0, target.length - 1);
        v = target.slice(0, i) + target.slice(i + 1);
      } else if (target.length > 1) {
        v = target.slice(0, rng.int(1, target.length - 1));
      } else v = 'x';
      if (f.maxLength) v = v.slice(0, f.maxLength);
      if (normValue(v, f) && fieldError(v, f) > 0) return v;
    }
    return f.type === 'textarea' ? `${target}\nx` : `${target}x`;
  }

  Object.assign(env.taskOf('type-text').lib, {
    LOCALES, person, addressOf, makeField, pad, MONTHS, checkValue, cap, DISABLED, digits, C, KINDS, scored,
    fieldError, countOf, normValue, fmtDate, fieldOk, freeText, transformSource, transform, password, email,
    username, q, I, RULE_TEXT, words, labelInfo, plainField, SUBS, EXTRAS, phone, levenshtein, validate,
    nonEmpty, wrongValue,
  });
})();
