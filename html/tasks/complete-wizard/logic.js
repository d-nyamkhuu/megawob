/*
 * complete-wizard: fill in a multi-step form, review the summary and confirm.
 * A multi-step form (task wizard). Only the current step is visible; Next validates the step
 * (required fields, formats) and shows inline errors instead of advancing; Back keeps what was typed; the
 * last page is a summary with an Edit link per step; Confirm (an in-app button: "Place order", "Confirm
 * booking", ...) sets the confirmed flag and shows a confirmation screen with a "Make changes" link. The
 * episode then ends on the site's end control (or finish). No MiniWoB counterpart (closest: book-flight,
 * form-sequence); teaches long horizons, partial observability, validation recovery and reading a summary.
 *
 * scenarios (flows; train 3-4 input steps + review, ood 4-6 input steps + review and more fields per step)
 *   checkout     account (email, name, phone) -> shipping address (street, apt, city, postcode, country)
 *                -> delivery (method with prices, gift wrap) -> payment (name on card, number, expiry, CVC)
 *   application  personal details -> experience (employer, title, years) -> availability (start date in
 *                the field's format, work mode, relocation) -> consent (a required checkbox)
 *   booking      stay (destination, check-in date, nights, guests) -> guest (name, email, phone) -> room
 *                (type with prices, breakfast, special requests)
 *   signup       account (username, email, password, confirm password) -> profile (display name, country,
 *                language) -> preferences (newsletter, product updates, theme)
 *   Optional fields that the instruction does not mention must stay empty (or keep their default).
 *   Choice targets are sometimes page-grounded ("the cheapest delivery option", "the fastest").
 *
 * spec   { scenario, flow (noun), title, steps: [{ title, fields: [id] }], fields: [field],
 *          labels: { next, back, save, confirm, edit, reopen, done }, ref (confirmation code),
 *          jumpNav (the step indicator is clickable for earlier steps), route ('back' | 'jump': how the
 *          oracle returns to an earlier step), enterKey (oracle presses Enter in a field instead of
 *          clicking Next when the focus is in the step), startMode, isplit, csplit, ood }
 *   field  { id, step, label, aliases[], kind: 'text' | 'choice' | 'check' | 'select', fmt (text:
 *          'name' | 'free' | 'email' | 'phone' | 'postcode' | 'card' | 'expiry' | 'cvc' | 'date' |
 *          'number' | 'username' | 'password' | 'match'), required, options[] (choice/select),
 *          prices{} (choice options with a price), dateFmt ('MM/DD/YYYY' ...), min/max (number), of (match:
 *          the password field), placeholder, hint, target, initial, ask (instruction phrase or null =
 *          not mentioned), grounded ('cheapest' | 'fastest' | null) }
 *          values: text -> string, choice/select -> string ('' = none), check -> boolean
 * model  { step (0..R-1 input steps, R = steps.length review, R + 1 confirmation), values: { id: value },
 *          invalid: [id] (inline errors on the current step), visited (furthest step reached),
 *          ret (editing from the review: Next returns to the review), confirmed, open (open dropdown id |
 *          null), focus (text field id holding the focus | null) }   invalid/visited/ret/open/focus are
 *          UI state: not scored, but the plan reads them.
 * error  (fields whose value is wrong + (confirmed ? 0 : 1)) / (fields + 1). Text compares are normalized
 *        per format (case/space-insensitive names, digits only for phone/card/CVC, dates parsed in the
 *        field's format, exact passwords). tau 0, sigma 0.25.
 * validation (Next): required fields non-empty; email/phone/postcode/card/expiry/CVC/date/number/username/
 *        password formats; confirm-password equals the password. Wrong-but-valid values pass (the
 *        summary shows them).
 *
 * start modes: off (step 1, empty), partial (the first steps done, maybe one field of the current step),
 *        wrong (1-2 fields of earlier steps hold plausible wrong values; the page is on a later step or on
 *        the summary, so the fix needs Back, the step indicator or Edit), solved (confirmed, all right).
 *        A confirmed wizard with wrong values is recovered with "Make changes" (no episode end).
 *
 * levels (normal is the task as above): easy = 3 input steps of at most 2 fields (optional fields
 *        dropped first) and at most 3 options per choice / dropdown; medium = 3 steps of at most 3 fields and
 *        4 options.
 *
 * judge modes (judgeModes; opts.judge; spec.judge = { mode, message, ... }): ambiguous / impossible start on the
 *        filled-in summary (every field right, not confirmed; tolerance(spec) lets that single missing confirmation
 *        count as "within tau") and the right move is a message:
 *          ambiguous   "change the name to X": two fields answer to "name" (Full name / Name on card, First / Last
 *                      name, Username / Display name, Guest name / Company); the reply asks (status ask) with the two
 *                      field labels as this page shows them (cands; others: every other field's label, never offered) and
 *                      the wizard stays unconfirmed (judged() checks that)
 *          impossible  "set the Delivery method to Drone drop": the option is not offered; status impossible, what: the option
 *          confirm     the normal task plus "but ask me before you press <Confirm>"; the widget flags 'irreversible'
 *                      when the summary's Confirm is pressed; the oracle fills the form and asks
 *
 * optional hooks (contract the html/kit/env.js header; pure, no DOM; called only by their knobs):
 *   parts(model, spec)            preempt=cancel: every field by its label (value: what it holds now)
 *   facts(model, spec)            the confirmation screen's details (label paraphrases in labels): "Reference" (the confirmation code) first, then what
 *                                 the screen shows beside it: checkout shipping cost and delivery time, booking room rate
 *                                 and stay total, application start date, signup notifications switched on (the widget lists
 *                                 every fact after the first under the code)
 *   silent(next, prev, spec, rng) a just-fixed field comes back wrong but valid (the validation still passes): text cut
 *                                 short, a phone or card digit off, a date a day later or day / month swapped, a number
 *                                 off by one, another option, a box that did not stick; passwords are left alone
 *   retarget(spec, model, rng)    a different goal in the same flow: one field gets a new value (option, date, number,
 *                                 name, email, ...) or an unticked box gets ticked; null for judge episodes
 *
 * plan targets (widget.locate)
 *   { field: id }               a text input            { choice: [id, option] }   a radio / tile
 *   { check: id }               a checkbox / switch     { open: id }               a dropdown trigger
 *   { option: [id, option] }    an option of the open dropdown
 *   { nav: 'next' | 'back' | 'confirm' | 'reopen' }     the step's primary button (Next / Save and
 *                               review), Back, the summary's Confirm, the confirmation's Make changes
 *   { edit: s }                 the Edit link of step s on the summary
 *   { jump: s }                 step s in the step indicator (only when spec.jumpNav)
 * plan steps: { type: [{ field }, text] } | { click: target } | { key: 'Enter' }
 *
 * Helpers (widget API, env.taskDef.helpers):
 *   apply(model, spec, act) -> model; act: { set: [id, value] } | { next } | { back } | { jump: s } |
 *     { edit: s } | { confirm } | { reopen } | { open: id | null } | { focus: id | null }
 *   validate(field, value, values) -> inline validation message or null.
 *   display(field, value) -> text for the summary (masks card numbers and passwords).
 *
 * Flow builders live in scenarios/*.js; shared internals are on lib.
 * The checker-only self-test lives in selftest.js.
 */
(function () {
  'use strict';
  const C = env.content;
  const I = env.instruct;
  const { clone, pad2, quote: q } = env.util;

  // ---------------------------------------------------------------- dates (pure day arithmetic)

  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December'];
  const leap = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  const dim = (y, m) => [31, leap(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
  const DATE_FMTS = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD', 'DD.MM.YYYY'];

  function isoParts(iso) {
    const r = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    return r ? [+r[1], +r[2], +r[3]] : null;
  }
  function fmtDate(iso, f) {
    const [y, m, d] = isoParts(iso);
    if (f === 'MM/DD/YYYY') return `${pad2(m)}/${pad2(d)}/${y}`;
    if (f === 'DD/MM/YYYY') return `${pad2(d)}/${pad2(m)}/${y}`;
    if (f === 'DD.MM.YYYY') return `${pad2(d)}.${pad2(m)}.${y}`;
    return `${y}-${pad2(m)}-${pad2(d)}`;
  }
  function parseDate(text, f) {
    const s = String(text || '').trim();
    let r;
    let y;
    let m;
    let d;
    if (f === 'YYYY-MM-DD') {
      r = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s);
      if (r) [y, m, d] = [+r[1], +r[2], +r[3]];
    } else {
      const sep = f === 'DD.MM.YYYY' ? '\\.' : '/';
      r = new RegExp(`^(\\d{1,2})${sep}(\\d{1,2})${sep}(\\d{4})$`).exec(s);
      if (r) [y, m, d] = f === 'MM/DD/YYYY' ? [+r[3], +r[1], +r[2]] : [+r[3], +r[2], +r[1]];
    }
    if (!r || m < 1 || m > 12 || d < 1 || d > dim(y, m)) return null;
    return `${y}-${pad2(m)}-${pad2(d)}`;
  }
  const longDate = (iso) => { const [y, m, d] = isoParts(iso); return `${MONTHS[m - 1]} ${d}, ${y}`; };
  function randomDate(rng, y0, y1) {
    const y = rng.int(y0, y1);
    const m = rng.int(1, 12);
    return `${y}-${pad2(m)}-${pad2(rng.int(1, dim(y, m)))}`;
  }
  function shiftDate(iso, n) {
    let [y, m, d] = isoParts(iso);
    d += n;
    while (d > dim(y, m)) { d -= dim(y, m); m += 1; if (m > 12) { m = 1; y += 1; } }
    while (d < 1) { m -= 1; if (m < 1) { m = 12; y -= 1; } d += dim(y, m); }
    return `${y}-${pad2(m)}-${pad2(d)}`;
  }

  // ---------------------------------------------------------------- normalization and validation

  const squash = (s) => String(s ?? '').trim().replace(/\s+/g, ' ');
  const digitsOf = (s) => String(s ?? '').replace(/\D/g, '');
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

  function norm(f, v) {
    if (f.kind === 'check') return !!v;
    if (f.kind !== 'text') return v || '';
    const s = squash(v);
    switch (f.fmt) {
      case 'phone': case 'card': case 'cvc': return digitsOf(s);
      case 'email': case 'username': return s.toLowerCase();
      case 'postcode': return s.toUpperCase().replace(/[\s-]/g, '');
      case 'date': return s ? parseDate(s, f.dateFmt) || `?${s}` : '';
      case 'number': return s === '' ? '' : String(Number(s));
      case 'password': case 'match': return String(v ?? '');
      default: return s.toLowerCase();
    }
  }

  function correct(f, v) {
    if (f.kind === 'text' && f.fmt === 'date') return f.target === '' ? squash(v) === '' : norm(f, v) === f.target;
    return norm(f, v) === norm(f, f.target);
  }

  function validate(f, v, values) {
    if (f.kind === 'check') return f.required && !v ? 'Please tick this box to continue.' : null;
    if (f.kind !== 'text') return f.required && !v ? 'Please choose an option.' : null;
    const s = squash(v);
    if (!s) return f.required ? 'This field is required.' : null;
    switch (f.fmt) {
      case 'email': return EMAIL_RE.test(s) ? null : 'Enter a valid email address.';
      case 'phone': { const n = digitsOf(s).length; return n >= 7 && n <= 15 && !/[a-z]/i.test(s) ? null : 'Enter a valid phone number.'; }
      case 'postcode': return /^[A-Za-z0-9][A-Za-z0-9 -]{1,9}$/.test(s) ? null : 'Enter a valid postcode.';
      case 'card': return digitsOf(s).length === 16 && !/[^\d ]/.test(s) ? null : 'Card number must have 16 digits.';
      case 'expiry': return /^(0[1-9]|1[0-2])\/\d{2}$/.test(s) ? null : 'Use the format MM/YY.';
      case 'cvc': return /^\d{3,4}$/.test(s) ? null : 'Enter the 3-digit code.';
      case 'date': return parseDate(s, f.dateFmt) ? null : `Use the format ${f.dateFmt}.`;
      case 'number': {
        const n = Number(s);
        return /^\d+$/.test(s) && n >= f.min && n <= f.max ? null : `Enter a whole number from ${f.min} to ${f.max}.`;
      }
      case 'username': return /^[A-Za-z0-9._-]{3,30}$/.test(s) ? null : 'Use 3-30 letters, digits, dots or underscores.';
      case 'password': return String(v).length >= 8 ? null : 'Use at least 8 characters.';
      case 'match': return String(v) === String(values[f.of] ?? '') ? null : 'The passwords do not match.';
      default: return null;
    }
  }

  // How a value is shown on the summary page.
  function display(f, v) {
    if (f.kind === 'check') return v ? 'Yes' : 'No';
    if (f.kind === 'text' && (f.fmt === 'password' || f.fmt === 'match')) return v ? '•'.repeat(Math.min(12, String(v).length)) : '';
    if (f.kind === 'text' && f.fmt === 'card') { const d = digitsOf(v); return d ? `•••• ${d.slice(-4)}` : ''; }
    return squash(v);
  }

  // ---------------------------------------------------------------- content

  const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.name || x.city)) || String(x);

  const LANGUAGES = [
    'English', 'Español', 'Deutsch', 'Français', 'Português', 'Italiano', 'Nederlands', 'Polski', '日本語', 'Svenska',
    'Íslenska', 'Gaeilge', 'Cymraeg', 'Euskara', 'Català', 'Română', 'Magyar', 'Čeština', 'Slovenčina', 'Hrvatski',
    'Türkçe', 'Lietuvių', 'Latviešu', 'Afrikaans', 'Suomi', 'Gàidhlig', 'Sicilianu', 'Shqip', 'Galego', 'Malti',
    'Kiswahili', 'Brezhoneg', 'Wolof'
  ];
  const REQUESTS = ['Late arrival, around 11 pm', 'Quiet room away from the lift', 'Extra pillows, please',
    'Ground floor if possible', 'Celebrating an anniversary', 'Need a baby cot', 'Early check-in if available',
    'Twin beds instead of a double', 'Parking space for one car', 'Allergic to feathers',
    'Please provide a luggage rack', 'Two extra hangers, please', 'Room with a courtyard view',
    'Fresh towels on day two', 'Please keep curtains closed', 'An extra evening blanket', 'A room near the garden',
    'Please leave an area map'];
  const GIFT_NOTES = ['Happy birthday, Sam!', 'Congratulations on the new job', 'With love from all of us',
    'Enjoy the trip!', 'Thanks for everything', 'See you at the reunion', 'Wishing you a lovely day',
    'Warm wishes for your new home', 'Joy and laughter today', 'Thinking of you today', 'Enjoy a little celebration',
    'Sending you warm wishes', 'Make lovely memories', 'See you very soon', 'Hope you have a great day',
    'With love and good cheer', 'Rooting for you always', 'May good things find you', 'Hope this brings a smile',
    'Celebrating you from afar', 'Here is to fresh starts', 'Best days are ahead', 'Glad to celebrate with you',
    'All my best, always'];

  function person(rng, spec) {
    return C.personName(rng, { csplit: spec.csplit });
  }
  function emailFor(rng, p) {
    return C.emailAddress(rng, p);
  }
  function phoneOf(rng) {
    return C.phone(rng, rng.pick(['en-US', 'en-US', 'en-GB', 'de-DE', 'fr-FR']));
  }
  function cardOf(rng) {
    return C.cardNumber(rng);
  }
  function passwordOf(rng) {
    const words = [
      'Maple', 'Orbit', 'Cedar', 'Lumen', 'Harbor', 'Quartz', 'Falcon', 'Ember', 'Aspen', 'Ridge', 'Field', 'Azure',
      'Winds', 'Gorge', 'Satin', 'Brook', 'Grove', 'Fable', 'Clover', 'Willow', 'Summit', 'Canyon', 'Velvet',
      'Ripple', 'Comet', 'Frost', 'Mirth', 'Flint', 'Coral', 'Mosaic', 'Marble', 'Canvas'
    ];
    return `${rng.pick(words)}${rng.pick(['!', '#', '$', '%', '&', '*'])}${C.digits(rng, rng.int(2, 4))}${rng.pick(words).toLowerCase()}`;
  }
  function usernameOf(rng, p) {
    return C.username(rng, p).replace(/[^A-Za-z0-9._-]/g, '').slice(0, 24) || 'user01';
  }
  function addressOf(rng, spec) {
    const a = C.address(rng, rng.pick(['en-US', 'en-GB', 'en-US', 'de-DE', 'fr-FR', 'nl-NL', 'es-ES']), { csplit: spec.csplit });
    return { street: a.line1, apt: a.line2 || '', city: a.city, postcode: a.postcode, country: a.country };
  }
  const countryNames = () => C.COUNTRIES.map((c) => c.name);
  const cityNames = () => C.CITIES.map((c) => c.city);

  // Labels with aliases (instructions use an alias in a share of episodes; graders accept the field).
  const LABELS = {
    email: ['Email', ['email address', 'e-mail', 'mail address', 'contact email', 'e-mail ID', 'e-address']],
    fullName: ['Full name', ['name', 'your name', 'customer name', 'legal name']],
    firstName: ['First name', ['given name', 'first name']],
    lastName: ['Last name', ['surname', 'family name']],
    phone: ['Phone', ['phone number', 'telephone', 'mobile number', 'contact phone', 'callback line']],
    street: ['Street address', ['address', 'street', 'address line 1', 'road address']],
    apt: ['Apartment, suite (optional)', ['apartment', 'address line 2']],
    city: ['City', ['town', 'city']],
    postcode: ['Postcode', ['ZIP code', 'postal code', 'post code']],
    country: ['Country', ['country/region', 'country']],
    delivery: ['Delivery method', ['shipping method', 'shipping', 'delivery option', 'delivery', 'dispatch method']],
    gift: ['Gift wrap', ['gift wrapping']],
    giftNote: ['Gift message (optional)', ['gift note', 'card message']],
    cardName: ['Name on card', ['cardholder name', 'card holder']],
    card: ['Card number', ['credit card number', 'card no.']],
    expiry: ['Expiry date', ['expiration', 'expiry', 'valid thru', 'valid to']],
    cvc: ['CVC', ['security code', 'CVV']],
    employer: ['Current employer', ['company', 'employer']],
    jobTitle: ['Job title', ['position', 'role', 'current role', 'post', 'work title', 'occupation']],
    years: ['Years of experience', ['experience (years)', 'years in the field']],
    startDate: ['Earliest start date', ['start date', 'available from']],
    workMode: ['Work arrangement', ['work mode', 'workplace type']],
    relocate: ['Willing to relocate', ['relocation']],
    linkedin: ['Portfolio URL (optional)', ['portfolio', 'website']],
    consent: ['I confirm that the information above is accurate', ['the accuracy statement', 'the confirmation box']],
    alerts: ['Email me similar jobs', ['job alerts']],
    destination: ['Destination', ['city', 'where to']],
    checkin: ['Check-in date', ['arrival date', 'check-in']],
    nights: ['Nights', ['number of nights', 'length of stay']],
    guests: ['Guests', ['number of guests', 'people']],
    room: ['Room type', ['room', 'room category']],
    breakfast: ['Add breakfast', ['breakfast']],
    requests: ['Special requests (optional)', ['requests', 'notes for the hotel']],
    username: ['Username', ['user name', 'login name', 'handle', 'login', 'account ID']],
    password: ['Password', ['password']],
    confirmPw: ['Confirm password', ['repeat password', 'password again']],
    displayName: ['Display name', ['public name', 'profile name']],
    language: ['Language', ['preferred language', 'interface language']],
    newsletter: ['Subscribe to the newsletter', ['newsletter']],
    updates: ['Product update emails', ['product updates']],
    theme: ['Theme', ['appearance', 'color theme']],
    company: ['Company (optional)', ['company name', 'organisation']],
  };

  function F(id, kind, extra) {
    const [label, aliases] = LABELS[id] || [id, []];
    let al = aliases;
    const hit = C.FIELD_LABELS.find((x) => x && (x.id === id || x.label === label));
    if (hit && Array.isArray(hit.aliases)) al = Array.from(new Set([...aliases, ...hit.aliases]));
    return { id, label, aliases: al, kind, fmt: kind === 'text' ? 'free' : null, required: true, options: null,
      prices: null, dateFmt: null, min: null, max: null, of: null, placeholder: '', hint: '', target: '',
      initial: kind === 'check' ? false : '', ask: null, grounded: null, ...extra };
  }

  const money = (x) => (x === 0 ? 'Free' : `$${x.toFixed(2)}`);

  // ---------------------------------------------------------------- flow labels (builders live in scenarios/*.js)

  const FLOW_NOUN = { checkout: 'checkout', application: 'job application', booking: 'booking', signup: 'sign-up' };
  const TITLES = {
    checkout: ['Checkout', 'Secure checkout', 'Complete your order'],
    application: ['Apply: {job}', 'Job application', 'Application form', 'Role: {job}'],
    booking: ['Book your stay', 'Hotel reservation', 'Reservation', 'Plan your stay', 'Stay arrangements'],
    signup: ['Create your account', 'Sign up', 'Join the workspace', 'Workspace account'],
  };
  const CONFIRM = {
    checkout: [
      'Place order', 'Confirm order', 'Pay now', 'Confirm and pay', 'Buy these items', 'Order now', 'Pay for order'
    ],
    application: ['Send application', 'Confirm application', 'Apply now'],
    booking: ['Confirm booking', 'Book now', 'Complete reservation'],
    signup: ['Create account', 'Confirm sign-up', 'Finish sign-up', 'Register online'],
  };
  const DONE = {
    checkout: 'Order confirmed', application: 'Application received', booking: 'Booking confirmed', signup: 'Account created',
  };

  // ---------------------------------------------------------------- wrong values (valid but not the target)

  function wrongValue(rng, f, spec) {
    if (f.kind === 'check') return !f.target;
    if (f.kind === 'choice' || f.kind === 'select') return rng.pick(f.options.filter((o) => o !== f.target));
    const t = f.target;
    if (t === '') {
      if (f.fmt === 'free') return rng.pick(['N/A', 'none', 'see notes', 'tbd', 'draft', 'pending', 'sample']);
      if (f.fmt === 'name') return C.pick(rng, C.COMPANIES, spec);
      if (f.fmt === 'phone') return phoneOf(rng);
      return 'n/a';
    }
    switch (f.fmt) {
      case 'email': { const p = person(rng, spec); return emailFor(rng, p); }
      case 'name': {
        // A near miss (swapped letters) or another value of the same kind.
        if (rng.bool(0.5) && t.length > 4) { const k = rng.int(1, t.length - 3); return t.slice(0, k) + t[k + 1] + t[k] + t.slice(k + 2); }
        return f.id === 'city' || f.id === 'destination' ? rng.pick(cityNames().filter((c) => c !== t)) : person(rng, spec).full;
      }
      case 'phone': return phoneOf(rng);
      case 'card': return cardOf(rng);
      case 'cvc': { let x; do x = C.digits(rng, 3); while (x === t); return x; }
      case 'expiry': return `${pad2(((+t.slice(0, 2)) % 12) + 1)}/${t.slice(3)}`;
      case 'postcode': return t.replace(/\d/, (d) => String((+d + rng.int(1, 8)) % 10));
      case 'date': return fmtDate(shiftDate(t, rng.pick([-7, -3, -1, 1, 2, 7, 30])), f.dateFmt);
      case 'number': { const n = +t; return String(n + (n > f.min + 1 && rng.bool(0.5) ? -1 : 1) * rng.int(1, 3)); }
      case 'username': return `${t}${rng.int(1, 9)}`;
      default: return t.length > 6 ? t.slice(0, -rng.int(2, 4)) : `${t} ${rng.int(2, 9)}`;
    }
  }
  // What the oracle types for a text target (dates in the field's format).
  const typed = (f) => (f.fmt === 'date' && f.target ? fmtDate(f.target, f.dateFmt) : f.target);

  // ---------------------------------------------------------------- model helpers

  const fieldsOf = (spec, s) => spec.steps[s].fields.map((id) => spec.fields.find((f) => f.id === id));
  const fieldById = (spec, id) => spec.fields.find((f) => f.id === id);
  const reviewOf = (spec) => spec.steps.length;
  const wrongFields = (model, spec) => spec.fields.filter((f) => !correct(f, model.values[f.id]));

  function errorOf(model, spec) {
    const n = spec.fields.length;
    return (wrongFields(model, spec).length + (model.confirmed ? 0 : 1)) / (n + 1);
  }

  function invalidOf(model, spec, s) {
    return fieldsOf(spec, s).filter((f) => validate(f, model.values[f.id], model.values)).map((f) => f.id);
  }

  function apply(model, spec, act) {
    const m = { ...model, values: { ...model.values }, invalid: model.invalid.slice() };
    const R = reviewOf(spec);
    if (act.set) {
      const [id, v] = act.set;
      if (m.step >= R) return model;
      m.values[id] = v;
      m.invalid = m.invalid.filter((x) => x !== id);
      if (fieldById(spec, id).kind !== 'text') m.open = null;
      return m;
    }
    if (act.open !== undefined) { m.open = act.open; return m; }
    if (act.focus !== undefined) { m.focus = act.focus; return m; }
    m.open = null;
    if (act.next) {
      if (m.step >= R) return model;
      const bad = invalidOf(m, spec, m.step);
      if (bad.length) { m.invalid = bad; return m; }
      m.invalid = [];
      m.step = m.ret ? R : m.step + 1;
      m.ret = false;
      m.focus = null;
      m.visited = Math.max(m.visited, m.step);
      return m;
    }
    if (act.back) {
      if (m.step <= 0 || m.step > R) return model;
      m.step -= 1;
      m.invalid = [];
      m.ret = false;
      m.focus = null;
      return m;
    }
    if (act.jump !== undefined) {
      if (!(act.jump < m.step && m.step <= R)) return model;
      m.ret = m.step === R;
      m.step = act.jump;
      m.invalid = [];
      m.focus = null;
      return m;
    }
    if (act.edit !== undefined) {
      if (m.step !== R) return model;
      m.step = act.edit;
      m.ret = true;
      m.invalid = [];
      m.focus = null;
      return m;
    }
    if (act.confirm) {
      if (m.step !== R) return model;
      m.confirmed = true;
      m.step = R + 1;
      return m;
    }
    if (act.reopen) {
      if (m.step !== R + 1) return model;
      m.confirmed = false;
      m.step = R;
      return m;
    }
    return model;
  }

  function planOf(model, spec) {
    const R = reviewOf(spec);
    const wrong = wrongFields(model, spec);
    if (model.step === R + 1) return wrong.length ? { click: { nav: 'reopen' } } : null;
    if (model.step === R) {
      if (!wrong.length) return { click: { nav: 'confirm' } };
      const s = wrong[0].step;
      return spec.route === 'jump' && spec.jumpNav ? { click: { jump: s } } : { click: { edit: s } };
    }
    const s = model.step;
    const here = fieldsOf(spec, s).find((f) => !correct(f, model.values[f.id]));
    if (here) {
      if (here.kind === 'text') return { type: [{ field: here.id }, typed(here)] };
      if (here.kind === 'choice') return { click: { choice: [here.id, here.target] } };
      if (here.kind === 'check') return { click: { check: here.id } };
      return model.open === here.id ? { click: { option: [here.id, here.target] } } : { click: { open: here.id } };
    }
    const earlier = wrong.find((f) => f.step < s);
    if (earlier) return spec.route === 'jump' && spec.jumpNav ? { click: { jump: earlier.step } } : { click: { nav: 'back' } };
    const focusHere = model.focus && fieldsOf(spec, s).some((f) => f.id === model.focus && f.kind === 'text');
    if (spec.enterKey && focusHere) return { key: 'Enter' };
    return { click: { nav: 'next' } };
  }

  // Model-space effect of a plan step (selfTest; mirrors what the widget does).
  function effect(model, spec, step) {
    if (step.type) {
      const id = step.type[0].field;
      return apply(apply(model, spec, { focus: id }), spec, { set: [id, step.type[1]] });
    }
    if (step.key === 'Enter') return apply(model, spec, { next: true });
    const t = step.click;
    if (t.choice) return apply(model, spec, { set: t.choice });
    if (t.check !== undefined) return apply(model, spec, { set: [t.check, !model.values[t.check]] });
    if (t.open !== undefined) return apply(model, spec, { open: model.open === t.open ? null : t.open });
    if (t.option) return apply(model, spec, { set: t.option });
    if (t.edit !== undefined) return apply(model, spec, { edit: t.edit });
    if (t.jump !== undefined) return apply(model, spec, { jump: t.jump });
    if (t.nav === 'next') return apply(model, spec, { next: true });
    if (t.nav === 'back') return apply(model, spec, { back: true });
    if (t.nav === 'confirm') return apply(model, spec, { confirm: true });
    if (t.nav === 'reopen') return apply(model, spec, { reopen: true });
    throw new Error(`unknown step ${JSON.stringify(step)}`);
  }

  // ---------------------------------------------------------------- instruction

  const CHECK_PHRASES = {
    gift: [['with gift wrap', 'add gift wrapping'], ['no gift wrap', 'without gift wrapping']],
    relocate: [['willing to relocate', 'open to relocation'], ['not willing to relocate', 'no relocation']],
    alerts: [['sign up for job alerts', 'with similar-job emails'], ['no job alerts', 'no similar-job emails']],
    breakfast: [['with breakfast', 'add breakfast'], ['no breakfast', 'without breakfast']],
    newsletter: [['subscribe to the newsletter', 'with the newsletter'], ['no newsletter', 'do not subscribe to the newsletter']],
    updates: [['turn on product update emails', 'with product updates'], ['no product update emails', 'turn off product updates']],
  };

  function askOf(rng, f, spec) {
    const lbl = I.alias(rng, f.label.replace(/ \(optional\)$/, ''), f.aliases);
    if (f.ask !== null && f.ask !== undefined) return f.ask;
    if (f.fmt === 'match') return null;
    if (f.kind === 'check') {
      if (f.target === f.initial && rng.bool(0.6)) return null;
      const ph = CHECK_PHRASES[f.id];
      if (ph && rng.bool(0.7)) return rng.pick(f.target ? ph[0] : ph[1]);
      return f.target ? rng.pick([`tick ${q(f.label)}`, `check ${q(f.label)}`]) : rng.pick([`untick ${q(f.label)}`, `clear ${q(f.label)}`]);
    }
    if (f.target === '') return rng.bool(0.3) ? `leave ${lbl} empty` : null;
    if (f.grounded === 'cheapest') return rng.pick([`the cheapest ${lbl.toLowerCase()}`, `whichever ${lbl.toLowerCase()} costs least`]);
    if (f.grounded === 'fastest') return rng.pick([`the fastest ${lbl.toLowerCase()}`, `the quickest ${lbl.toLowerCase()}`]);
    let v = f.target;
    if (f.fmt === 'date') v = rng.pick([longDate(f.target), fmtDate(f.target, rng.pick(DATE_FMTS.filter((x) => x !== f.dateFmt))), longDate(f.target)]);
    if (f.fmt === 'number') {
      if (f.id === 'nights') return `${v} night${v === '1' ? '' : 's'}`;
      if (f.id === 'years') return `${v} years of experience`;
    }
    if (f.id === 'guests') return `${v} guest${v === '1' ? '' : 's'}`;
    return rng.pick([`${lbl} ${q(v)}`, `${lbl}: ${q(v)}`]);
  }

  const GENERIC = [
    'Complete the {flow} with these details: {list}. Confirm it on the last page.',
    'Go through every step of the {flow} using {list}, then confirm it.',
    'Fill in the {flow} ({list}) and confirm once the summary looks right.',
    'Use the following for the {flow}: {list}. Review and confirm at the end.',
    'Enter {list} in the {flow} form and confirm it.',
    'Work through the {flow} step by step: {list}. Confirm when you reach the summary.',
    'Finish the {flow} for me: {list}. Make sure it gets confirmed.',
    'Set up the {flow} with {list} and confirm it.',
    'What to use for the {flow}: {list}. Confirm at the review.',
    'For the {flow}, follow this list: {list}. Review it and confirm.',
    'These are the {flow} details: {list}. Enter them, review and confirm.',
    'Take the {flow} to final review with {list}, then confirm it.',
    'Once {list} is entered for the {flow}, review and confirm it.',
    'Details for the {flow}: {list}. Fill it out and confirm at review.',
    'At final review, confirm the {flow} after entering these details: {list}.',
  ];
  const SPECIFIC = {
    checkout: ['Place the order with {list}.', 'Buy what is in the cart using {list}, and place the order.'],
    application: ['Apply for the position with {list}, and send the application.', 'Send a job application for {who}: {list}.'],
    booking: ['Book the stay: {list}. Confirm the booking at the end.', 'Make the reservation for {who} with {list}.'],
    signup: ['Create the account: {list}.', 'Register {who} with {list} and finish the sign-up.'],
  };

  function instructionOf(spec, rng) {
    if (spec.judge && spec.judge.mode !== 'confirm') return judgeInstruction(spec, rng);
    const parts = spec.steps.map((st, s) => {
      const asks = fieldsOf(spec, s).map((f) => askOf(rng, f, spec)).filter(Boolean);
      return { title: st.title, asks };
    }).filter((x) => x.asks.length);
    const list = parts.map((x) => x.asks.join(', ')).join('; ');
    const named = spec.fields.find((f) => f.id === 'fullName' || f.id === 'displayName');
    const first = spec.fields.find((f) => f.id === 'firstName');
    const last = spec.fields.find((f) => f.id === 'lastName');
    const who = named ? named.target : first ? `${first.target} ${last ? last.target : ''}`.trim() : 'the customer';
    const tpl = I.pick(rng, [...GENERIC, ...SPECIFIC[spec.scenario]], spec.isplit);
    const core = I.fill(tpl, { flow: spec.flow, list, who });
    const steps = [...parts.map((x) => `on the ${x.title} step: ${x.asks.join(', ')}`), `confirm the ${spec.flow}`];
    const terse = `${spec.flow}: ${parts.map((x) => x.asks.join(', ')).join('; ')}; confirm`;
    const text = I.say(rng, core, { isplit: spec.isplit, terse, steps });
    if (spec.judge && spec.judge.mode === 'confirm') {
      return `${text.replace(/[.!]*\s*$/, '')}, but check with me before you press "${spec.labels.confirm}".`;
    }
    return text;
  }

  // ---------------------------------------------------------------- levels

  // easy / medium: fewer steps, fewer fields per step (optional ones go first), fewer options to choose from.
  function ladder(steps, level) {
    const easy = level === 'easy';
    const cap = easy ? 2 : 3;
    const optCap = easy ? 3 : 4;
    return steps.slice(0, 3).map((st) => {
      const fields = st.fields.slice();
      while (fields.length > cap) {
        let i = fields.length - 1;
        for (let j = fields.length - 1; j >= 0; j--) if (!fields[j].required) { i = j; break; }
        fields.splice(i, 1);
      }
      for (const f of fields) {
        if (f.options && f.options.length > optCap) {
          const keep = new Set([f.target, ...f.options.filter((o) => o !== f.target).slice(0, optCap - 1)]);
          f.options = f.options.filter((o) => keep.has(o));
          if (f.initial && !keep.has(f.initial)) f.initial = '';
        }
      }
      return { ...st, fields };
    });
  }

  // ---------------------------------------------------------------- judge modes

  // Fields that both answer to "the name", with the words a good question uses to tell them apart.
  const PAIRS = {
    checkout: ['fullName', 'cardName'], application: ['firstName', 'lastName'],
    booking: ['fullName', 'company'], signup: ['username', 'displayName'],
  };
  // Absent options for the impossible mode, by field.
  const ABSENT = {
    delivery: [
      'Drone drop', 'Same-hour courier', 'Pickup locker', 'Teleport', 'Pneumatic tube', 'Balloon mail', 'Pack mule',
      'Sled delivery'
    ], room: ['Penthouse', 'Presidential suite', 'Treehouse'],
    workMode: [
      'Underwater', 'On a boat', 'Four days a week', 'Osvarynn', 'Pelritha', 'Anvessal', 'Tholune', 'Uldovar',
      'Zemrith'
    ], country: ['Atlantis', 'Narnia', 'Wakanda'],
    destination: [
      'Atlantis', 'Gotham', 'Mordor', 'Nimquay', 'Brisfen', 'Othrell', 'Zunetha', 'Pellune', 'Qorwyn', 'Tivren',
      'Drovun'
    ], language: ['Klingon', 'Esperanto', 'Latin'], theme: ['Sepia', 'Neon', 'Solarized'],
    guests: ['9', '12'],
  };

  // The ambiguous mode needs both fields of the scenario's pair; a booking has no second name, so one is added.
  function withPair(jr, steps, spec) {
    const [a, b] = PAIRS[spec.scenario];
    const has = (id) => steps.some((st) => st.fields.some((f) => f.id === id));
    if (has(a) && has(b)) return steps;
    return steps.map((st, i) => (i === (spec.scenario === 'booking' ? 1 : steps.length - 1) && spec.scenario === 'booking'
      ? { ...st, fields: [...st.fields, F('company', 'text', { fmt: 'name', required: false,
        target: C.pick(jr, C.COMPANIES, spec) })] } : st));
  }

  function judgeOf(jr, spec, mode) {
    const confirm = spec.labels.confirm;
    if (mode === 'confirm') {
      return { mode, message: `The ${spec.flow} is filled in. Should I go ahead and press "${confirm}", or do you want to check it first?`,
        irreversible: confirm };
    }
    if (mode === 'ambiguous') {
      const [a, b] = PAIRS[spec.scenario].map((id) => spec.fields.find((f) => f.id === id));
      if (!a || !b) return undefined;
      const value = person(jr, spec).full;
      const bare = (f) => f.label.replace(/ \(optional\)$/, '');
      // the two fields are told apart by their labels on this page; every other field's label must not be offered
      return { mode, value, a: { id: a.id, label: bare(a) }, b: { id: b.id, label: bare(b) },
        cands: [[bare(a), a.label], [bare(b), b.label]],
        others: [...new Set(spec.fields.filter((f) => f.id !== a.id && f.id !== b.id).map(bare))].filter((l) => l !== bare(a) && l !== bare(b)).map((l) => [l]),
        message: `Which name should I change to ${value}: ${a.label.replace(/ \(optional\)$/, '')} or ${b.label.replace(/ \(optional\)$/, '')}?` };
    }
    const pool = spec.fields.filter((f) => (f.kind === 'choice' || f.kind === 'select') && ABSENT[f.id]);
    if (!pool.length) return undefined;
    const f = jr.pick(pool);
    const value = jr.pick(ABSENT[f.id].filter((x) => !f.options.includes(x)));
    return { mode, field: f.id, value, what: [value], message: `I can't do that: ${f.label} has no "${value}" option, only ${f.options.join(', ')}.` };
  }

  function judgeInstruction(spec, rng) {
    const j = spec.judge;
    const flow = spec.flow;
    let core;
    let terse;
    if (j.mode === 'ambiguous') {
      core = I.fill(I.pick(rng, ['Change the name to {v} and confirm the {flow}.', 'Update the name to {v}, then confirm the {flow}.',
        'Make the name {v} and finish the {flow}.',
        'Put {v} under the name, then finish the {flow}.',
        'Enter {v} as the name. Then confirm the {flow}.'], spec.isplit), { v: q(j.value), flow });
      terse = `name: ${j.value}; confirm`;
    } else {
      const f = spec.fields.find((x) => x.id === j.field);
      const l = I.alias(rng, f.label.replace(/ \(optional\)$/, ''), f.aliases).toLowerCase();
      core = I.fill(I.pick(rng, ['Set the {l} to {v} and confirm the {flow}.', 'Change the {l} to {v}, then confirm the {flow}.',
        'Pick {v} as the {l} and finish the {flow}.',
        'Use {v} for the {l}. Then confirm the {flow}.'], spec.isplit), { l, v: q(j.value), flow });
      terse = `${l}: ${j.value}; confirm`;
    }
    // through say, like the normal instruction, so a judge episode reads like a normal one
    return I.say(rng, core, { isplit: spec.isplit, terse });
  }

  // ---------------------------------------------------------------- optional hooks (facts, silent, retarget)

  const REF_ALIASES = {
    checkout: ['order number', 'order reference', 'confirmation code', 'reference number'],
    application: ['application number', 'application reference', 'confirmation code', 'reference number'],
    booking: ['booking reference', 'booking number', 'confirmation code', 'reservation number'],
    signup: ['account ID', 'confirmation code', 'reference number'],
  };
  const daysText = (d) => (d === 0 ? 'today' : d === 1 ? '1 day' : `up to ${d} days`);

  function facts(model, spec) {
    const v = (id) => model.values[id];
    const f = (id) => fieldById(spec, id);
    const out = [{ label: 'Reference', value: spec.ref, labels: REF_ALIASES[spec.scenario] }];
    if (spec.scenario === 'checkout' && f('delivery') && v('delivery') && f('delivery').prices) {
      const d = f('delivery');
      out.push({ label: 'Shipping cost', value: money(d.prices[v('delivery')]), labels: ['delivery cost', 'shipping'] });
      if (d.days && d.days[v('delivery')] !== undefined) out.push({ label: 'Delivery time', value: daysText(d.days[v('delivery')]), labels: ['arrives in', 'delivery estimate'] });
    } else if (spec.scenario === 'booking' && f('room') && v('room') && f('room').prices) {
      const rate = f('room').prices[v('room')];
      const n = Number(v('nights')) || 0;
      out.push({ label: 'Room rate', value: `$${rate.toFixed(2)} / night`, aliases: [`$${rate.toFixed(2)}`], labels: ['price per night'] });
      if (f('nights') && n > 0) out.push({ label: 'Stay total', value: `$${(rate * n).toFixed(2)}`, labels: ['total', 'total price'] });
    } else if (spec.scenario === 'application' && f('startDate') && v('startDate')) {
      const iso = parseDate(v('startDate'), f('startDate').dateFmt);
      // the page says "March 4, 2026"; the comma would end the clause of a free-text report, and the grader ignores punctuation
      if (iso) out.push({ label: 'Start date', value: longDate(iso).replace(',', ''), aliases: [longDate(iso), v('startDate')], labels: ['earliest start date'] });
    } else if (spec.scenario === 'signup') {
      const on = ['newsletter', 'updates'].filter((id) => f(id) && v(id)).length;
      out.push({ label: 'Notifications on', value: String(on), aliases: [`${on} of 2`], labels: ['emails switched on'] });
    }
    // Levels cut fields: fall back to what any flow still has (the card's last digits, else the step count).
    if (out.length < 2 && f('card') && digitsOf(v('card'))) out.push({ label: 'Card ending', value: digitsOf(v('card')).slice(-4), aliases: [display(f('card'), v('card'))] });
    if (out.length < 2) out.push({ label: 'Steps completed', value: String(reviewOf(spec)), aliases: [`${reviewOf(spec)} steps`] });
    return out;
  }

  // Wrong but valid values for a field that is right now (never a password: the pair would no longer match).
  function wrongCands(f, v, values) {
    const out = [];
    if (f.kind === 'check') return [!v];
    if (f.kind === 'choice' || f.kind === 'select') {
      const i = f.options.indexOf(v);
      return [f.options[i - 1], f.options[i + 1]].filter((o) => o !== undefined);
    }
    const s = squash(v);
    if (!s || f.fmt === 'password' || f.fmt === 'match') return out;
    if (f.fmt === 'date') {
      const iso = parseDate(s, f.dateFmt);
      if (!iso) return out;
      out.push(fmtDate(shiftDate(iso, 1), f.dateFmt), fmtDate(shiftDate(iso, -1), f.dateFmt));
      const [y, m, d] = isoParts(iso);
      if (d <= 12 && d !== m) out.push(fmtDate(`${y}-${pad2(d)}-${pad2(m)}`, f.dateFmt)); // MM/DD read as DD/MM
      return out;
    }
    if (f.fmt === 'number') {
      const n = Number(s);
      return [n + 1, n - 1].filter((x) => x >= f.min && x <= f.max).map(String);
    }
    if (f.fmt === 'phone' || f.fmt === 'card' || f.fmt === 'cvc') {
      const last = s.slice(-1);
      if (/\d/.test(last)) out.push(s.slice(0, -1) + String((+last + 1) % 10));
      if (f.fmt === 'phone') out.push(s.slice(0, -1));
      return out;
    }
    if (f.fmt === 'expiry') return [`${pad2(((+s.slice(0, 2)) % 12) + 1)}/${s.slice(3)}`];
    if (f.fmt === 'email') {
      const [local, dom] = s.split('@');
      return local && local.length > 3 ? [`${local.slice(0, -1)}@${dom}`, `${local.slice(0, -2)}@${dom}`] : [];
    }
    for (const k of [1, 2, 3]) if (s.length - k >= 2) out.push(s.slice(0, s.length - k));
    return out;
  }

  function silent(next, prev, spec, rng) {
    const right = spec.fields.filter((f) => correct(f, next.values[f.id]) && next.values[f.id] !== '');
    const fresh = right.filter((f) => !correct(f, prev.values[f.id]));
    const pool = rng.shuffle(fresh.length ? fresh : right);
    const tau = fam.tolerance(spec).tau;
    for (const f of pool) {
      const cands = rng.shuffle(wrongCands(f, next.values[f.id], next.values))
        .filter((c) => !correct(f, c) && !validate(f, c, { ...next.values, [f.id]: c }));
      if (!cands.length) continue;
      const m = clone(next);
      m.values[f.id] = cands[0];
      if (errorOf(m, spec) > tau) return m;
    }
    return null;
  }

  // A new value for a field, different from its target and still valid; undefined when the field has no natural alternative.
  function otherTarget(rng, f, spec) {
    const t = f.target;
    if (f.ask || f.grounded === 'x') return undefined;
    if (f.kind === 'check') return f.target === f.initial && f.id !== 'consent' ? !t : undefined;
    if (f.kind === 'choice' || f.kind === 'select') {
      const o = f.options.filter((x) => x !== t);
      return o.length ? rng.pick(o) : undefined;
    }
    if (f.fmt === 'password' || f.fmt === 'match' || f.id === 'jobTitle') return undefined;
    if (t === '') return f.required ? undefined : f.id === 'requests' ? rng.pick(REQUESTS) : f.id === 'giftNote' ? rng.pick(GIFT_NOTES)
      : f.id === 'company' ? C.pick(rng, C.COMPANIES, spec) : undefined;
    switch (f.fmt) {
      case 'email': return emailFor(rng, person(rng, spec));
      case 'phone': return phoneOf(rng);
      case 'card': return cardOf(rng);
      case 'cvc': return C.digits(rng, 3);
      case 'expiry': return `${pad2(rng.int(1, 12))}/${rng.int(27, 31)}`;
      case 'postcode': return addressOf(rng, spec).postcode;
      case 'date': return shiftDate(t, rng.pick([-14, -7, -3, -2, 2, 3, 7, 14, 30]));
      case 'number': return String(rng.int(f.min, f.max));
      case 'username': return usernameOf(rng, person(rng, spec));
      case 'name':
        if (f.id === 'firstName') return person(rng, spec).first;
        if (f.id === 'lastName') return person(rng, spec).last;
        if (f.id === 'employer' || f.id === 'company') return C.pick(rng, C.COMPANIES, spec);
        if (f.id === 'city') return C.pick(rng, C.CITIES, spec).city;
        return person(rng, spec).full;
      default: return f.id === 'street' ? addressOf(rng, spec).street : undefined;
    }
  }

  function retarget(spec, model, rng) {
    if (spec.judge) return null;
    const tau = fam.tolerance(spec).tau;
    for (const f0 of rng.shuffle(spec.fields)) {
      const v = otherTarget(rng, f0, spec);
      if (v === undefined || (f0.kind === 'text' && norm(f0, v) === norm(f0, f0.target)) || v === f0.target) continue;
      const sp = clone(spec);
      const f = fieldById(sp, f0.id);
      f.target = v;
      f.grounded = null;
      if (f.fmt === 'match') continue;
      if (errorOf(model, sp) > tau) return sp;
    }
    return null;
  }

  // ---------------------------------------------------------------- task

  const fam = {
    name: 'complete-wizard',
    scenarios: ['checkout', 'application', 'booking', 'signup'],
    startModes: ['off', 'partial', 'wrong', 'solved'],
    inputs: ['pointer', 'keyboard'],
    judgeModes: ['ambiguous', 'impossible', 'confirm'],

    helpers: { apply, validate, display },
    // Shared code for flow builders and the checker-only self-test.
    lib: { C, F, person, addressOf, emailFor, phoneOf, cardOf, passwordOf, usernameOf, countryNames, cityNames,
      labelOf, DATE_FMTS, randomDate, LANGUAGES, REQUESTS, GIFT_NOTES, reviewOf, typed, shiftDate, correct,
      fmtDate, longDate, parseDate, effect },
    files: ['scenarios/checkout.js', 'scenarios/application.js', 'scenarios/booking.js', 'scenarios/signup.js'],

    sample(rng, opts) {
      const pool = opts.scenarios && opts.scenarios.length ? opts.scenarios : this.scenarios;
      const scenario = opts.scenario || rng.pick(pool);
      const spec = { scenario, flow: FLOW_NOUN[scenario], startMode: opts.startMode || 'off', isplit: opts.isplit || 'train',
        csplit: opts.csplit || 'train', ood: !!opts.ood };
      let steps = env.scenariosOf('complete-wizard')[scenario].sample(rng.fork('flow'), spec);
      // Train: 3-4 input steps; ood keeps everything (4-6).
      if (!spec.ood && steps.length > 4) steps = steps.slice(0, 4);
      if (opts.level === 'easy' || opts.level === 'medium') steps = ladder(steps, opts.level);
      const judgeMode = (this.judgeModes || []).includes(opts.judge) ? opts.judge : null;
      const jr = judgeMode ? rng.fork('judge') : null;
      if (judgeMode === 'ambiguous') steps = withPair(jr, steps, spec);
      spec.fields = [];
      spec.steps = steps.map((st, s) => {
        for (const f of st.fields) { f.step = s; spec.fields.push(f); }
        return { title: st.title, fields: st.fields.map((f) => f.id) };
      });
      const job = (spec.fields.find((f) => f.id === 'jobTitle') || {}).target || 'Analyst';
      spec.title = rng.pick(TITLES[scenario]).replace('{job}', job);
      spec.labels = {
        next: rng.pick(['Next', 'Continue', 'Next step', 'Save and continue', 'Proceed', 'Move forward']),
        back: rng.pick(['Back', 'Previous', '← Back', 'Return']),
        save: rng.pick([
          'Save and review', 'Back to summary', 'Update and review', 'Review my changes', 'Save to summary'
        ]),
        confirm: rng.pick(CONFIRM[scenario]),
        edit: rng.pick(['Edit', 'Change', 'Modify', 'Revise', 'Amend', 'Tweak']),
        reopen: rng.pick(['Make changes', 'Edit details', 'Change something', 'Resume editing', 'Edit further']),
        review: rng.pick(['Review', 'Summary', 'Confirm', 'Preview', 'Checks']),
        done: DONE[scenario],
      };
      spec.ref = `${scenario === 'checkout' ? 'ORD' : scenario === 'booking' ? 'BK' : scenario === 'signup' ? 'ID' : 'APP'}-${C.alnum(rng, 6)}`;
      spec.jumpNav = rng.bool(0.5);
      spec.route = spec.jumpNav && rng.bool(0.5) ? 'jump' : 'back';
      spec.enterKey = rng.bool(0.3);
      if (judgeMode) spec.judge = judgeOf(jr, spec, judgeMode);
      return spec;
    },

    init(spec, rng) {
      const R = reviewOf(spec);
      const values = {};
      for (const f of spec.fields) values[f.id] = f.initial;
      const m = { step: 0, values, invalid: [], visited: 0, ret: false, confirmed: false, open: null, focus: null };
      const fillUpTo = (k) => { for (const f of spec.fields) if (f.step < k) values[f.id] = typed(f); };
      if (spec.judge && spec.judge.mode !== 'confirm') {
        // The filled-in summary: nothing to change, nothing to confirm yet.
        fillUpTo(R);
        return { ...m, step: R, visited: R };
      }
      if (spec.startMode === 'partial') {
        const k = rng.int(1, R - 1);
        fillUpTo(k);
        const cur = fieldsOf(spec, k).filter((f) => f.kind === 'text');
        if (cur.length > 1 && rng.bool(0.5)) values[cur[0].id] = typed(cur[0]);
        m.step = k;
        m.visited = k;
      } else if (spec.startMode === 'wrong') {
        const k = rng.int(1, R);
        fillUpTo(k);
        const cands = spec.fields.filter((f) => f.step < k && f.fmt !== 'password' && f.fmt !== 'match');
        for (const f of rng.sample(cands, Math.min(cands.length, rng.int(1, 2)))) {
          let v = wrongValue(rng, f, spec);
          if (f.kind === 'text' && f.fmt === 'date' && f.target === '') v = '';
          values[f.id] = v;
        }
        m.step = k;
        m.visited = k;
      }
      return m;
    },

    error: errorOf,

    tolerance(spec) {
      // Judge episodes: a form that is filled in right but not yet confirmed counts as "there" (confirming is the
      // irreversible step the agent must not take, or has no point).
      return { tau: spec && spec.judge ? 1 / (spec.fields.length + 1) : 0, sigma: 0.25 };
    },

    facts,
    silent,
    retarget,

    // model check only (the reply is graded by the kit): the wizard must not have been confirmed
    judged: (model) => !model.confirmed,
    // preempt=cancel: every field by its label (value: what it holds now)
    parts: (model, spec) => spec.fields.map((f) => ({ name: f.label.replace(/ \(optional\)$/, ''), value: model.values[f.id] })),

    instruction: instructionOf,
    plan: planOf,

    solve(spec, model) {
      const values = {};
      for (const f of spec.fields) values[f.id] = typed(f);
      const R = reviewOf(spec);
      return { ...model, step: R + 1, values, invalid: [], visited: R, ret: false, confirmed: true, open: null, focus: null };
    },

  };

  env.task(fam);
})();
