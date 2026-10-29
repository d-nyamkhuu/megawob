/*
 * solve-puzzle / fix-error: fix the field of a form that shows an error.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('solve-puzzle');
  const { keepIdx, pad2 } = env.util;
  const { C, I, say } = fam.lib;

  const VALID = {
    email: (v) => /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(v.trim()),
    zip: (v) => /^\d{5}$/.test(v.trim()),
    phone: (v) => (v.match(/\d/g) || []).length === 10 && /^[\d\s().+-]+$/.test(v.trim()),
    qty: (v, f) => /^\d+$/.test(v.trim()) && Number(v) >= f.min && Number(v) <= f.max,
    confirm: (v, f, vals) => v.trim() !== '' && v.trim() === String(vals[f.of]).trim(),
    date: (v) => {
      const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v.trim());
      if (!m) return false;
      const mo = Number(m[1]);
      const d = Number(m[2]);
      const dim = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][mo - 1];
      return mo >= 1 && mo <= 12 && d >= 1 && d <= dim;
    },
    required: (v) => v.trim() !== '',
    url: (v) => /^https?:\/\/[^\s/]+\.[^\s]+$/.test(v.trim()),
    text: () => true,
  };

  function sampleFixError(rng, spec) {
    const cs = { csplit: spec.csplit };
    const p = C.personName(rng, cs);
    const email = C.emailAddress(rng, p).toLowerCase();
    const area = rng.int(201, 989);
    const phone = `(${area}) ${rng.int(200, 999)}-${String(rng.int(0, 9999)).padStart(4, '0')}`;
    const zip = String(rng.int(10000, 99999));
    const y = rng.int(2024, 2026);
    const mo = rng.int(1, 12);
    const d = rng.int(13, 28);
    const date = `${pad2(mo)}/${pad2(d)}/${y}`;
    const site = `https://www.${C.slug(C.pick(rng, C.COMPANIES, cs)).replace(/-/g, '')}.com`;
    const qmax = rng.pick([5, 10, 20]);
    const city = C.pick(rng, C.CITIES, cs).city;
    // Pool of fields: [label, kind, value, aliases, extra]
    const pool = [
      { label: 'First name', kind: 'required', value: p.first, aliases: ['given name'] },
      { label: 'Last name', kind: 'required', value: p.last, aliases: ['surname', 'family name'] },
      { label: 'Email', kind: 'email', value: email, aliases: ['email address', 'e-mail'] },
      { label: 'Phone', kind: 'phone', value: phone, aliases: ['phone number', 'telephone'] },
      { label: 'ZIP code', kind: 'zip', value: zip, aliases: ['postal code', 'ZIP'] },
      { label: 'City', kind: 'text', value: city, aliases: ['town'] },
      { label: 'Delivery date', kind: 'date', value: date, aliases: ['date'] },
      { label: 'Quantity', kind: 'qty', value: String(rng.int(1, qmax)), min: 1, max: qmax, aliases: ['amount', 'number of items'] },
      { label: 'Website', kind: 'url', value: site, aliases: ['web address', 'URL'] },
      { label: 'Company', kind: 'text', value: C.pick(rng, C.COMPANIES, cs), aliases: ['organization'] },
    ];
    const n = spec.ood ? rng.int(7, 9) : rng.int(4, 6);
    // The bad field's kind decides which fields must be present.
    const badKind = rng.pick(['email', 'zip', 'phone', 'qty', 'confirm', 'date', 'required', 'url']);
    let fields = rng.sample(pool.filter((f) => f.kind !== 'required' || badKind !== 'required'), n - 1);
    let bad;
    if (badKind === 'confirm') {
      if (!fields.some((f) => f.kind === 'email')) fields[0] = pool[2];
      const at = fields.findIndex((f) => f.kind === 'email');
      fields.splice(at + 1, 0, { label: 'Confirm email', kind: 'confirm', value: email, of: at + 1, aliases: ['email confirmation', 'repeat email'] });
      fields = fields.slice(0, n);
      bad = fields.findIndex((f) => f.kind === 'confirm');
      fields.forEach((f) => { if (f.kind === 'confirm') f.of = fields.findIndex((g) => g.kind === 'email'); });
    } else if (badKind === 'required') {
      const req = pool[rng.int(0, 1)];
      fields.splice(rng.int(0, fields.length), 0, { ...req });
      bad = fields.indexOf(fields.find((f) => f.label === req.label));
    } else {
      let at = fields.findIndex((f) => f.kind === badKind);
      if (at < 0) {
        at = rng.int(0, fields.length);
        fields.splice(at, 0, pool.find((f) => f.kind === badKind));
      } else fields.push(rng.pick(pool.filter((f) => !fields.includes(f) && f.kind !== badKind && f.kind !== 'required')) || pool[5]);
      bad = at;
    }
    fields = fields.map((f) => ({ ...f }));
    // Labels must be unique.
    if (new Set(fields.map((f) => f.label)).size !== fields.length) return sampleFixError(rng.fork('again'), spec);
    const f = fields[bad];
    const fix = f.value;
    let broken;
    let msg;
    const typoOf = (s) => {
      const i = rng.int(1, s.length - 2);
      return s.slice(0, i) + s[i + 1] + s[i] + s.slice(i + 2);
    };
    switch (f.kind) {
      case 'email': {
        const [local, dom] = fix.split('@');
        broken = rng.pick([`${local}@${dom.split('.')[0]}`, `${local}${dom}`, `${local}@@${dom}`, `${local} @${dom}`]);
        msg = rng.pick([
          'Enter a valid email address.', 'This email address looks incomplete.', 'Please check the email address.',
          'Email address cannot be parsed.', 'Use standard email address syntax.'
        ]);
        break;
      }
      case 'zip': broken = fix.includes('0') && rng.bool(0.5) ? fix.replace('0', 'O') : fix + String(rng.int(0, 9)); msg = 'ZIP code must be 5 digits.'; break;
      case 'phone': { const k = fix.lastIndexOf(fix.match(/\d/g)[rng.int(4, 9)]); broken = fix.slice(0, k) + fix.slice(k + 1); msg = rng.pick(['Enter a 10-digit phone number.', 'Phone number is too short.']); break; }
      case 'qty': broken = String(rng.bool(0.5) ? 0 : f.max + rng.int(1, 30)); msg = `Quantity must be between ${f.min} and ${f.max}.`; break;
      case 'confirm': broken = typoOf(fix); msg = rng.pick(['Email addresses do not match.', 'The two email addresses must match.']); break;
      case 'date': {
        const [mm, dd, yy] = fix.split('/');
        broken = rng.pick([`${yy}-${mm}-${dd}`, `${dd}/${mm}/${yy}`, `${dd}.${mm}.${yy}`]);
        msg = rng.pick(['Use the format MM/DD/YYYY.', 'Enter the date as MM/DD/YYYY.']);
        break;
      }
      case 'required': broken = ''; msg = `${f.label} is required.`; break;
      default: broken = fix.replace(/^https:\/\//, ''); msg = rng.pick(['Enter a full URL starting with https://', 'Website must start with https://']);
    }
    if (VALID[f.kind](broken, f, fields.map((x, i) => (i === bad ? broken : x.value)))) return sampleFixError(rng.fork('again2'), spec);
    f.msg = msg;
    f.fix = fix;
    f.value = broken;
    const cleanFields = fields.map((x, i) => ({ label: x.label, kind: x.kind, value: x.value, fix: i === bad ? fix : x.value, aliases: x.aliases || [],
      ...(x.min !== undefined ? { min: x.min, max: x.max } : {}), ...(x.of !== undefined ? { of: x.of } : {}), ...(i === bad ? { msg } : {}) }));
    return { title: rng.pick([
      'Shipping details', 'Account settings', 'Checkout', 'Profile', 'Order form', 'Contact details', 'Registration',
      'Form summary', 'Form options', 'Preferences', 'Personal data'
    ]), fields: cleanFields, bad };
  }

  function fieldValid(spec, i, values) {
    const f = spec.fields[i];
    return VALID[f.kind](String(values[i] ?? ''), f, values);
  }

  function fixError(model, spec) {
    let e = 0;
    spec.fields.forEach((f, i) => {
      const ok = fieldValid(spec, i, model.values);
      if (!ok) e += 1;
      else if (i !== spec.bad && String(model.values[i]).trim() !== String(f.fix).trim()) e += 0.5;
    });
    return e;
  }

  env.scenario('solve-puzzle', {
    name: 'fix-error',
    sample: sampleFixError,
    level(spec, r, { k }) {
      const f = spec.fields[spec.bad];
      const must = [spec.bad];
      if (f.kind === 'confirm') must.push(f.of);
      const keep = keepIdx(r, spec.fields.length, must, k(1, 2));
      if (keep.length < spec.fields.length) {
        spec.fields = keep.map((i) => (spec.fields[i].of !== undefined ? { ...spec.fields[i], of: keep.indexOf(spec.fields[i].of) } : spec.fields[i]));
        spec.bad = keep.indexOf(spec.bad);
      }
    },
    judge(jr, spec, ph) {
      const label = jr.pick([
        'Birthday', 'Country', 'Password', 'Fax number', 'Job title', 'Username', 'Language', 'Time zone', 'Street',
        'Apartment', 'Province', 'Pronouns', 'Interests', 'Biography', 'Signature', 'Salutation', 'Department',
        'File name', 'Avatar', 'Comments'
      ].filter((l) => !spec.fields.some((f) => f.label === l)));
      return ph(['Fix the {label} field.', 'Correct the {label} entry in the form.'], { label }, `the form has no ${label} field.`, [`${label} field`, label]);
    },
    base(spec) {
      return { values: spec.fields.map((f) => f.value) };
    },
    start(spec, m, mode, rng) {
      const values = m.values.slice();
      if (mode === 'wrong') {
        // A failed attempt: the bad field changed but still invalid.
        const f = spec.fields[spec.bad];
        const tries = { email: f.fix.replace('@', ' at '), zip: f.fix.slice(0, 4), phone: f.fix.replace(/\d(?=\D*$)/, ''), qty: '-1',
          confirm: f.fix.toUpperCase() === f.fix ? `${f.fix}x` : f.fix.toUpperCase(), date: f.fix.replace(/\//g, '-'), required: ' ', url: f.fix.replace('https://', 'https//') };
        values[spec.bad] = tries[f.kind];
        if (fieldValid(spec, spec.bad, values)) values[spec.bad] = f.value;
      }
      return { values };
    },
    tolerance() {
      return { tau: 0, sigma: 0.5, minInitialError: 0.5 };
    },
    error(model, spec) {
      return fixError(model, spec);
    },
    instruction(spec, rng) {
      const f = spec.fields[spec.bad];
      const label = I.alias(rng, f.label, f.aliases);
      return say(rng, spec, ['Fix the error in the form.', 'The form did not save; correct the field with the error.',
        'One field in this form is invalid. Fix it.', 'Correct the "{label}" field so the form is valid.', 'The "{label}" field has a problem; fix it.',
        'Resolve the validation error shown on the form.', 'Make the form valid by fixing the bad value.',
        'Use the error message to repair the form.', 'Only the field showing an error needs editing.',
        'Repair "{label}" using its error message.', 'Leave valid entries alone; fix the flagged one.',
        'Find the flagged value and make it valid.', 'All but one entry are valid. Repair that one.'], { label }, { terse: 'fix the form error' });
    },
    plan(model, spec) {
      const i = spec.fields.findIndex((f, k) => (k === spec.bad ? !fieldValid(spec, k, model.values) : String(model.values[k]).trim() !== String(f.fix).trim()));
      return i < 0 ? null : { type: [{ ffield: i }, spec.fields[i].fix] };
    },
    simulate(model, spec, step) {
      const values = model.values.slice();
      values[step.type[0].ffield] = step.type[1];
      return { values };
    },
    facts(model, spec) {
  const f = spec.fields[spec.bad];
  if (!fieldValid(spec, spec.bad, model.values)) return [];
  return [{ label: f.label, value: String(model.values[spec.bad]), labels: f.aliases }, { label: 'Form status', value: 'All fields look good.', labels: ['Status', 'Banner'] }];
    },
    silent(next, prev, spec, rng, pick) {
      const f = spec.fields[spec.bad];
      const cur = String(next.values[spec.bad]);
      const cut = next.values.slice();
      cut[spec.bad] = cur.slice(0, -1);
      const back = next.values.slice();
      back[spec.bad] = f.value;
      return pick({ ...next, values: cur !== f.value ? (rng.bool() ? cut : back) : cut }) || pick({ ...next, values: back });
    },
  });
  Object.assign(fam.lib, { VALID });
  Object.assign(fam.helpers, { fieldValid });
})();
