/* type-text/sampling.js: Shared sampling, validation-fix corruptions and section/profile data. */
(function () {
  'use strict';

  const {
    LOCALES, person, addressOf, makeField, pad, MONTHS, checkValue, cap, DISABLED, digits, C, KINDS,
  } = env.taskOf('type-text').lib;

  function ctxOf(rng, opts, spec) {
    const g = { rng, csplit: spec.csplit, ood: spec.ood, locale: rng.pick(LOCALES) };
    g.person = person(g);
    g.addr = addressOf(g);
    return g;
  }

  const SAVE_LABELS = [
    'Save', 'Save changes', 'Update', 'Update profile', 'Save details', 'Apply changes', 'Keep edits', 'Save form',
    'Apply', 'Commit updates', 'Store input', 'Record entry', 'Confirm', 'Done editing', 'Accept changes',
    'Write data', 'Set values', 'Finalize'
  ];

  function sampleMulti(g, spec, kinds, n) {
    const ids = g.rng.sample(kinds, n);
    return ids.map((k) => makeField(g, k, k));
  }

  // Corruptions for validation-fix: each is fixable from the message and the value alone.
  function corrupt(g, f) {
    const rng = g.rng;
    const t = f.target;
    const opts = [];
    if (f.check === 'email') {
      const [local, domain] = t.split('@');
      if (local.length > 2) {
        const i = rng.int(1, local.length - 1);
        opts.push({ how: 'space', bad: `${local.slice(0, i)} ${local.slice(i)}@${domain}`, message: "Email addresses can't contain spaces." });
      }
      if (domain.includes('.')) {
        const j = domain.lastIndexOf('.');
        opts.push({ how: 'comma', bad: `${local}@${domain.slice(0, j)},${domain.slice(j + 1)}`, message: 'Use a period (.) in the domain, not a comma.' });
      }
      opts.push({ how: 'at', bad: `${local} at ${domain}`, message: 'Enter a valid email address, like name@example.com.' });
    }
    if (f.check === 'name' && t.length >= 2) {
      const i = rng.int(1, t.length);
      opts.push({ how: 'digits', bad: `${t.slice(0, i)}${rng.int(1, 9)}${t.slice(i)}`, message: "Names can't contain numbers." });
    }
    if (f.check === 'digits') {
      opts.push({ how: 'format', bad: f.say !== t ? f.say : `${t.slice(0, 3)} ${t.slice(3)}`, message: 'Use digits only (no spaces, dashes or brackets).' });
    }
    if (f.check === 'upper' && /[A-Z]/.test(t)) {
      opts.push({ how: 'case', bad: t.toLowerCase(), message: rng.pick(['Use capital letters.', 'Letters must be upper case.']) });
    }
    if (f.check === 'nospace' && t.length > 3) {
      const i = rng.int(1, t.length - 1);
      opts.push({ how: 'space', bad: `${t.slice(0, i)} ${t.slice(i)}`, message: "Usernames can't contain spaces." });
    }
    if (f.check && f.check.startsWith('date:')) {
      const fmt = f.check.slice(5);
      const y = Number(t.slice(fmt.indexOf('YYYY'), fmt.indexOf('YYYY') + 4));
      const m = Number(t.slice(fmt.indexOf('MM'), fmt.indexOf('MM') + 2));
      const d = Number(t.slice(fmt.indexOf('DD'), fmt.indexOf('DD') + 2));
      const bad = rng.bool(0.5) ? `${y}-${pad(m)}-${pad(d)}` : rng.pick([`${MONTHS[m - 1]} ${d}, ${y}`, `${d} ${MONTHS[m - 1]} ${y}`]);
      opts.push({ how: 'date', bad, message: rng.pick([`Enter the date as ${fmt}.`, `Use the format ${fmt}.`, `Invalid date - the format is ${fmt}.`]) });
    }
    return opts.length ? rng.pick(opts) : null;
  }

  const TAB_ROUTE = ['password', 'login', 'multi', 'sections', 'complete'];
  const ENTER_ROUTE = ['login', 'multi', 'copy', 'validation-fix', 'sections', 'complete'];

  // validation-fix wrong start: a half-done fix of the corruption that still fails validation and from which
  // the target still follows (another space, another digit, a semicolon for the comma, wrong separators...).
  function wrongFix(rng, f, inv) {
    const b = inv.bad;
    const t = f.target;
    let w = null;
    if (inv.how === 'space') {
      const i = rng.int(1, b.length - 1);
      w = b.slice(0, i) + (b[i - 1] === ' ' || b[i] === ' ' ? '' : ' ') + b.slice(i);
      if (w === b) w = `${b.slice(0, 1)} ${b.slice(1)}`;
    } else if (inv.how === 'comma') w = b.replace(',', ';');
    else if (inv.how === 'at') w = b.replace(' at ', '@ ');
    else if (inv.how === 'digits') {
      const i = rng.int(1, b.length);
      w = `${b.slice(0, i)}${rng.int(1, 9)}${b.slice(i)}`;
    } else if (inv.how === 'format') {
      const sep = rng.pick(['.', ' ', '/']);
      w = t.replace(/(\d{3})(?=\d{2})/g, `$1${sep}`);
    } else if (inv.how === 'case') {
      // Upper-case every letter but the last one.
      const last = b.search(/[a-z][^a-z]*$/);
      w = last >= 0 ? b.slice(0, last).toUpperCase() + b.slice(last) : b;
    } else if (inv.how === 'date') {
      const fmt = f.check.slice(5);
      w = t.replace(/[.\/-]/g, /-/.test(fmt) ? '/' : '-');
    }
    if (!w || w === t || checkValue(f.check, w.trim())) return b;
    return w;
  }

  // Settings-page groups for the sections scenario (one tab / collapsible section each).
  const GROUPS = [
    { titles: ['Personal', 'Personal info', 'About you', 'Identity', 'Basic data'], kinds: ['first', 'last', 'dob'] },
    { titles: ['Contact', 'Contact details'], kinds: ['email', 'phone'] },
    { titles: ['Address', 'Location', 'Home address', 'Residence'], kinds: ['street', 'city', 'zip'] },
    { titles: ['Work', 'Employment', 'Company', 'Profession', 'Job', 'Employer'], kinds: ['company', 'job'] },
    { titles: ['Public profile', 'Profile'], kinds: ['display', 'headline'] },
    { titles: ['Sign-in', 'Login details', 'Account', 'User name'], kinds: ['username'] },
    { titles: ['Billing', 'Payment', 'Orders & billing', 'Order info'], kinds: ['card', 'amount', 'order'] },
  ];
  // The complete scenario's record: every required field (its label or an alias that names no other field,
  // the value as people write it) plus 0-2 facts that have no form field, in an order of its own.
  function profileRows(g, spec) {
    const r = g.rng;
    const rows = spec.fields.filter((f) => !f.blank)
      .map((f) => ({ id: f.id, label: f.aliases.length && r.bool(0.35) ? cap(r.pick(f.aliases)) : f.label, value: f.say }));
    const labels = new Set(spec.fields.map((f) => f.label.toLowerCase()));
    for (const id of r.sample(Object.keys(DISABLED), r.int(0, 2))) {
      const label = r.pick(DISABLED[id].labels);
      if (!labels.has(label.toLowerCase())) rows.push({ id: null, label, value: DISABLED[id].gen(g) });
    }
    spec.profile.rows = r.bool(0.5) ? rows : r.shuffle(rows);
  }

  // Field kinds of the complete scenario, in the order forms usually ask for them.
  const COMPLETE_KINDS = ['first', 'last', 'email', 'phone', 'company', 'job', 'street', 'city', 'zip', 'dob', 'username'];

  // The value a sections field held before the change: same kind and format, valid, different from the target.
  function oldValue(g, f) {
    for (let k = 0; k < 12; k++) {
      let v;
      if (f.mask === '(999) 999-9999') {
        const d = `${g.rng.int(2, 9)}${digits(g.rng, 9)}`;
        v = `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
      } else if (f.kind === 'card') v = C.cardNumber(g.rng);
      else if (f.check === 'digits') v = `${g.rng.int(2, 9)}${digits(g.rng, Math.max(5, f.target.length - 1))}`;
      else v = KINDS[f.kind].gen(g).target;
      if (f.maxLength) v = v.slice(0, f.maxLength).trim();
      if (v && v !== f.target && checkValue(f.check, v)) return v;
    }
    return f.target.length > 2 ? f.target.slice(0, -1) : `${f.target}${f.target}`;
  }

  // Words naming a field by its kind ("the date field"), only when no other field of the form fits them.
  const KIND_WORDS = { email: ['email address', 'email'], first: ['first name'], last: ['last name', 'surname'],
    username: ['username'], dob: ['date', 'date of birth', 'birth date'], order: ['order number'],
    zip: ['postcode', 'postal code', 'ZIP code'], phone: ['phone number'] };
  function kindWords(f, fields) {
    const norm = (s) => String(s).toLowerCase().replace(/[^a-z]/g, '');
    return (KIND_WORDS[f.kind] || []).filter((w) => !fields.some((o) => o !== f
      && [o.label, ...(o.aliases || [])].some((l) => norm(l).includes(norm(w)) || norm(w).includes(norm(l)))));
  }


  Object.assign(env.taskOf('type-text').lib, {
    sampleMulti, SAVE_LABELS, corrupt, kindWords, GROUPS, oldValue, COMPLETE_KINDS, TAB_ROUTE, ENTER_ROUTE,
    ctxOf, profileRows, wrongFix,
  });
})();
