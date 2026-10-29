/* select-text/text.js: the document text sources (story grammar, real sentences, message / terms / chat / table / line
 * shapes), sentence and word boundaries, inline marks. Pure functions on rngs; attached to the task's lib. */
(function () {
  'use strict';
  const C = env.content;
  const I = env.instruct;

  // ---------------------------------------------------------------- story grammar (older text source)

  const ADJ = ['quiet', 'copper', 'narrow', 'golden', 'heavy', 'gentle', 'distant', 'bright', 'hollow',
    'patient', 'rusty', 'silver', 'steady', 'crooked', 'pale', 'warm', 'broad', 'sudden', 'tidy',
    'faded', 'humble', 'curious', 'restless', 'wooden', 'tired', 'cheerful', 'damp', 'ancient',
    'brittle', 'crowded'];
  const NOUNS = ['keeper', 'visitor', 'stone', 'door', 'road', 'crowd', 'shadow', 'rope', 'ledger',
    'kettle', 'bell', 'fence', 'field', 'cart', 'window', 'river', 'hill', 'map', 'coat', 'clock',
    'garden', 'ladder', 'basket', 'letter', 'candle', 'bench', 'gate', 'roof', 'barrel', 'wagon',
    'mirror', 'blanket', 'pigeon', 'scarf', 'teapot'];
  const TOPICS = ['lighthouse', 'orchard', 'ferry', 'observatory', 'bakery', 'glacier', 'library',
    'vineyard', 'sawmill', 'greenhouse', 'monastery', 'canal', 'railway', 'beehive', 'quarry',
    'windmill', 'telescope', 'compass', 'falcon', 'violin', 'tortoise', 'caravan', 'aqueduct', 'tavern'];
  const VERBS = ['stood near', 'leaned against', 'waited beside', 'rested under', 'drifted past',
    'faced', 'watched', 'guarded', 'outlasted', 'shaded', 'overlooked', 'hid', 'followed',
    'circled', 'brushed against', 'blocked', 'framed', 'ignored'];
  const ACTS = ['repaired', 'painted', 'visited', 'measured', 'sketched', 'cleaned', 'described',
    'photographed', 'admired', 'inspected', 'mapped', 'praised'];
  const NAMES = ['Mara', 'Tobias', 'Ines', 'Oskar', 'Lena', 'Hugo', 'Priya', 'Nils', 'Ada', 'Ravi',
    'Greta', 'Milo', 'Sofia', 'Emil'];
  const TIMES = ['morning', 'evening', 'winter', 'spring', 'autumn', 'summer', 'Sunday', 'night',
    'noon', 'harvest'];
  const MANNER = ['often', 'slowly', 'quietly', 'early', 'late', 'stubbornly', 'gracefully'];
  const PERFECT = ['appeared', 'settled', 'gathered', 'vanished', 'arrived', 'waited'];
  const ORD = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];
  const STOP = new Set(['the', 'and', 'but', 'its', 'was', 'had', 'near', 'every', 'nobody', 'knew',
    'why', 'looked', 'light', 'with', 'after', 'before', 'long', 'days', 'for', 'like', 'that', 'this',
    'your', 'you', 'have', 'will', 'from', 'they', 'there', 'their', 'what', 'when', 'which', 'would',
    'could', 'should', 'about', 'been', 'were', 'just', 'some', 'more', 'than', 'then', 'them', 'into', 'also']);
  // Sentence boundaries by rule, the cases of Unicode sentence segmentation (UAX 29) the text banks use, not
  // Intl.Segmenter: the browser's ICU data must not change a seed's text. A sentence ends after a run of . ! ?,
  // closing quotes or brackets and spaces, except: a period before a digit (3.14) or between capitals (U.S.), or
  // with no space after it (e.g. "file.txt"); a period whose next letter is lowercase ("e.g. this"); before a
  // comma, colon or another terminator. Common honorifics stay with the name that follows them ("Dr. Smith").
  const TERM = '.!?';
  const CLOSE = /["'\u201d\u2019)\]\u00bb]/;
  const LETTER = /\p{L}/u;
  const LOWER = /\p{Ll}/u;
  const UPPER = /\p{Lu}/u;
  const CONT = /[,;:\-\u2013\u2014]/;
  function sentenceParts(text) {
    const parts = [];
    const n = text.length;
    let start = 0;
    const push = (end) => {
      const part = text.slice(start, end).trim();
      start = end;
      if (!part) return;
      const last = parts.length - 1;
      if (last >= 0 && /\b(?:Dr|Mr|Mrs|Ms|Prof)\.$/.test(parts[last])) parts[last] += ' ' + part;
      else parts.push(part);
    };
    for (let i = 0; i < n; i++) {
      if (!TERM.includes(text[i])) continue;
      let j = i;
      let period = true;
      while (j < n && TERM.includes(text[j])) { if (text[j] !== '.') period = false; j++; }
      if (period && j === i + 1) {
        if (/\d/.test(text[j] || '')) continue;
        if (UPPER.test(text[i - 1] || '') && UPPER.test(text[j] || '')) continue;
      }
      const termEnd = j;
      while (j < n && CLOSE.test(text[j])) j++;
      let k = j;
      while (k < n && /\s/.test(text[k])) k++;
      if (period && k === termEnd && k < n) { i = k - 1; continue; }
      if (period) {
        let m = k;
        while (m < n && !LETTER.test(text[m]) && !TERM.includes(text[m])) m++;
        if (m < n && LOWER.test(text[m])) { i = k - 1; continue; }
      }
      if (k < n && (CONT.test(text[k]) || TERM.includes(text[k]))) { i = k - 1; continue; }
      push(k);
      i = k - 1;
    }
    push(n);
    return parts;
  }

  function adverbial(rng) {
    return rng.pick([
      () => `with a ${rng.pick(ADJ)} ${rng.pick(NOUNS)}`,
      () => `before the ${rng.pick(NOUNS)} closed`,
      () => `after the long ${rng.pick(TIMES)}`,
      () => `for ${rng.pick(['two', 'three', 'four', 'seven', 'eleven'])} days`,
      () => `under a ${rng.pick(ADJ)} sky`,
    ])();
  }

  function storySentence(rng, T) {
    const a = () => rng.pick(ADJ);
    const n = () => rng.pick(NOUNS.filter((x) => x !== T));
    const [a1, a2] = rng.sample(ADJ, 2);
    return rng.pick([
      () => `The ${a1} ${T} ${rng.pick(VERBS)} the ${a2} ${n()}.`,
      () => `Every ${rng.pick(TIMES)}, the ${n()} ${rng.pick(VERBS)} the ${T}.`,
      () => `${rng.pick(NAMES)} ${rng.pick(ACTS)} the ${T} ${adverbial(rng)}.`,
      () => `Nobody knew why the ${T} ${rng.pick(VERBS)} the ${n()} so ${rng.pick(MANNER)}.`,
      () => `By ${rng.pick(TIMES)}, a ${a()} ${n()} had ${rng.pick(PERFECT)} near the ${T}.`,
      () => `The ${T} was ${a1} but ${a2}, and the ${n()} ${rng.pick(VERBS)} it.`,
    ])();
  }

  const words = (s) => s.toLowerCase().match(/[a-z]+/g) || [];

  function trimRange(doc, s, e) {
    while (s < e && /\s/.test(doc[s])) s++;
    while (e > s && /\s/.test(doc[e - 1])) e--;
    return [s, e];
  }


  // Assemble paragraphs (arrays of sentences) into doc + sentence spans.
  function assemble(sents, topics) {
    const paragraphs = sents.map((ss) => ss.join(' '));
    const doc = paragraphs.join('\n\n');
    const spans = [];
    let base = 0;
    sents.forEach((ss, pi) => {
      let off = base;
      ss.forEach((s, si) => {
        spans.push({ p: pi, s: si, start: off, end: off + s.length, text: s });
        off += s.length + 1;
      });
      base += paragraphs[pi].length + 2;
    });
    return { topics: topics || null, sents, paragraphs, doc, spans };
  }

  function storyText(rng, nPara, minS, maxS) {
    const topics = rng.sample(TOPICS, nPara);
    const seen = new Set();
    const sents = topics.map((topic) => {
      const k = rng.int(minS, maxS);
      const out = [];
      while (out.length < k) {
        const T = out.length === 0 || rng.bool(0.45) ? topic : rng.pick(NOUNS);
        const s = storySentence(rng, T);
        if (seen.has(s)) continue;
        seen.add(s);
        out.push(s);
      }
      return out;
    });
    return { ...assemble(sents, topics), source: 'story' };
  }

  // Realistic paragraphs from the sentence bank: one domain per paragraph, no repeated sentence.
  function realText(rng, nPara, minS, maxS, cs) {
    const groups = C.SENTENCE_GROUPS;
    const domains = Object.keys(groups);
    const same = rng.bool(0.4) ? rng.pick(domains) : null;
    const seen = new Set();
    const sents = [];
    for (let p = 0; p < nPara; p++) {
      const k = rng.int(minS, maxS);
      let out = [];
      for (let tries = 0; tries < 6 && out.length < Math.min(k, 2); tries++) {
        const d = tries === 0 && same ? same : rng.pick(domains);
        const entries = C.sample(rng, groups[d].filter((s) => !/\n/.test(s) && s.length <= 170 && !seen.has(s)), 40, cs);
        // Split after sampling so each source entry keeps its content-bank train/heldout assignment.
        // Chat banks also contain fragments. Keep clear sentence boundaries when entries are joined:
        // an unfinished or lower-case fragment can otherwise merge with its neighbor and shift indices.
        const pool = [...new Set(entries.flatMap(sentenceParts))].filter((s) => !seen.has(s)
          && /^[“"(']*(?:[A-Z]|\d)/.test(s) && /[.!?][”"')]*$/.test(s));
        out = pool.slice(0, k);
      }
      for (const s of out) seen.add(s);
      if (out.length) sents.push(out);
    }
    return { ...assemble(sents), source: 'real' };
  }

  function paraStart(paragraphs, i) {
    let b = 0;
    for (let k = 0; k < i; k++) b += paragraphs[k].length + 2;
    return b;
  }

  function countOf(hay, needle) {
    let n = 0;
    for (let i = hay.indexOf(needle); i >= 0; i = hay.indexOf(needle, i + 1)) n++;
    return n;
  }

  // Words (letters only) with their offsets; boundaries that a double click respects (spaces, punctuation
  // other than hyphen, apostrophe, slash, '@' and '.' inside tokens).
  function wordTokens(doc) {
    const out = [];
    const re = /[A-Za-z]+/g;
    let m;
    while ((m = re.exec(doc))) {
      const a = doc[m.index - 1] || ' ';
      const b = doc[m.index + m[0].length] || ' ';
      const clean = (c, after) => /\s/.test(c) || /[,;:!?()"“”]/.test(c) || (after && c === '.' && !/\w/.test(doc[m.index + m[0].length + 1] || ' '));
      out.push({ w: m[0], start: m.index, end: m.index + m[0].length, clean: clean(a, false) && clean(b, true) });
    }
    return out;
  }

  // ---------------------------------------------------------------- message with entities (field scenario)

  const ROLES = {
    email: { names: ['the email address', 'the contact email', 'the e-mail address', "the sender's email address"],
      tpl: ['You can reach me at {X} if anything changes.', 'Please send the signed copy to {X}.',
        'For billing questions, write to {X}.', 'My new address for work emails is {X}.',
        'Please save {X} in your email contacts.', 'My inbox at {X} is working again.',
        'The email you received was sent from {X}.', 'I accept large email attachments at {X}.'] },
    phone: { names: ['the phone number', 'the telephone number', 'the number to call'],
      tpl: [
        'If it is urgent, call {X}.', 'Our hotline is {X} on weekdays.', 'You can also text me at {X}.',
        'Call {X} to discuss the pickup.', 'Leave a voice message at {X}.'
      ] },
    price: { names: ['the amount', 'the dollar amount', 'the price mentioned in the message'],
      tpl: ['The total comes to {X}, including tax.', 'We have refunded {X} to your original payment method.',
        'The upgrade costs {X} per month.', 'Your deposit of {X} has been received.',
        'The replacement part is priced at {X}.', 'We have set aside {X} for the art supplies.',
        'Your gift voucher has a stated value of {X}.', 'The estimate for repair work is {X}.',
        'The winning bid for this painting was {X}.', 'You saved {X} on your recent purchase.',
        'The handling fee of {X} has been waived.', 'There is a credit of {X} on your account.',
        'Admission to the spring fair is {X}.', 'The missing parcel was insured for {X}.',
        'We raised {X} at the community fundraiser.', 'Your rental charge for the projector is {X}.'] },
    order: { names: ['the order number', 'the order ID', 'the order reference'],
      tpl: ['Your order {X} has been packed and is ready to ship.', 'Order {X} was split into two parcels.',
        'I am writing about order {X}, which arrived damaged.',
        'We need your approval to proceed with order {X}.',
        'Your order {X} is now waiting for collection.',
        'Please cancel order {X} before it is processed.',
        'The handwritten gift note was added to order {X}.',
        'Order {X} includes an item that is out of stock.',
        'I would like to change the size in order {X}.'] },
    tracking: { names: ['the tracking number', 'the tracking code', 'the parcel tracking ID'],
      tpl: ['You can follow the parcel with tracking number {X}.', 'The carrier gave us the tracking code {X}.'] },
    invoice: { names: ['the invoice number', 'the invoice reference'],
      tpl: ['Invoice {X} is attached to this message.', 'Please quote invoice {X} when you pay.'] },
    date: { names: ['the date', 'the date mentioned in the message', 'the scheduled date'],
      tpl: [
        'Delivery is scheduled for {X}.', 'The workshop has been moved to {X}.',
        'Your appointment is confirmed for {X}.', 'The rehearsal will take place on {X}.',
        'Your parcel collection date is {X}.', 'The art exhibition opens on {X}.',
        'Please join our club gathering on {X}.', 'The inspection is booked for {X}.',
        'We will hold the launch on {X}.'
      ] },
    coupon: { names: ['the discount code', 'the promo code', 'the coupon code'],
      tpl: ['Use the code {X} at checkout to get 15% off.', 'As an apology, here is a voucher code: {X}.'] },
  };
  const FILLER_DOMAINS = ['support', 'meeting', 'product', 'travel', 'finance', 'community'];
  const GREET = [
    'Hi {to},', 'Hello {to},', 'Dear {to},', 'Good morning {to},', 'Hi there,', 'Hello,', 'Hey {to},', 'Greetings,',
    'Good day,', 'Hello again,', 'Morning {to},', 'Good day {to},', 'Hi again,', 'Dear all,', 'Hey there,',
    'Welcome,', 'Good evening,', 'Hello friend,', 'Hi folks,', 'Hello team,', 'Hiya,', 'Good afternoon,',
    'Dear reader,'
  ];
  const SIGN = [
    'Best regards, {from}', 'Thanks, {from}', 'Kind regards, {from}', 'Cheers, {from}', 'All the best, {from}',
    'Sincerely, {from}', 'Regards, {from}', 'Take care, {from}', 'Many thanks, {from}', 'With thanks, {from}',
    'Yours truly, {from}', 'Respectfully, {from}', 'Cordially, {from}', 'Warmly, {from}', 'Talk soon, {from}',
    'Yours, {from}', 'See you, {from}', 'Thank you, {from}', 'Until then, {from}'
  ];
  const MONTHS = C.MONTHS;

  function entityValue(rng, role, cs) {
    const p = C.personName(rng, cs);
    if (role === 'email') return C.emailAddress(rng, p);
    if (role === 'phone') return C.phone(rng, rng.pick(['en-US', 'en-GB', 'en-US']));
    if (role === 'price') return C.price(rng, C.pick(rng, C.PRODUCTS, cs)).text;
    if (role === 'order') return C.orderId(rng);
    if (role === 'tracking') return C.trackingCode(rng);
    if (role === 'invoice') return C.invoiceId(rng);
    if (role === 'coupon') return C.couponCode(rng);
    const d = rng.int(1, 28);
    const m = MONTHS[rng.int(0, 11)];
    const y = rng.int(2024, 2027);
    return rng.pick([`${m} ${d}, ${y}`, `${d} ${m} ${y}`, `${m} ${d}`]);
  }

  const plainFiller = (s) => !/[0-9@$#€£%]/.test(s) && !/\n/.test(s) && s.length <= 150
    && !new RegExp(`\\b(${MONTHS.join('|')})\\b`).test(s);

  function messageText(rng, nRoles, cs) {
    const roles = rng.sample(Object.keys(ROLES), nRoles);
    const to = C.personName(rng, cs);
    const from = C.personName(rng, cs);
    const fillerPool = C.sample(rng, C.SENTENCE_GROUPS[rng.pick(FILLER_DOMAINS)].filter(plainFiller), 20, cs);
    let fi = 0;
    const filler = () => (fi < fillerPool.length ? fillerPool[fi++] : null);
    const sents = [[C.fill(rng.pick(GREET), { to: to.first })]];
    const ents = {};
    const body = [];
    for (const role of roles) {
      const v = entityValue(rng, role, cs);
      const tpl = rng.pick(ROLES[role].tpl);
      body.push({ text: tpl.replace('{X}', v), role, value: v, at: tpl.indexOf('{X}') });
    }
    // 2-3 body paragraphs: entity sentences mixed with filler.
    const nP = Math.min(body.length, rng.int(2, 3));
    const paras = Array.from({ length: nP }, () => []);
    body.forEach((b, i) => paras[i % nP].push(b));
    for (const p of paras) {
      const out = [];
      for (const b of p) {
        if (rng.bool(0.5)) { const f = filler(); if (f) out.push({ text: f }); }
        out.push(b);
      }
      if (rng.bool(0.6)) { const f = filler(); if (f) out.push({ text: f }); }
      sents.push(out);
    }
    sents.push([C.fill(rng.pick(SIGN), { from: from.full })]);
    const flat = sents.map((ss) => ss.map((x) => (typeof x === 'string' ? x : x.text)));
    const t = assemble(flat);
    // Entity offsets.
    let k = 0;
    sents.forEach((ss, pi) => ss.forEach((x, si) => {
      const sp = t.spans[k++];
      if (x && x.role) ents[x.role] = { start: sp.start + x.at, end: sp.start + x.at + x.value.length, value: x.value };
    }));
    return { ...t, source: 'message', ents, roles };
  }

  // ---------------------------------------------------------------- opt-in text shapes (traits.unit / native)

  const endsClean = (s) => /^[“"(']*(?:[A-Z]|\d)/.test(s) && /[.!?][”"')]*$/.test(s);

  // Terms of service (traits.unit 'clause'): policy sentences sorted into topical clauses with a title
  // each, in the usual order of such documents. One clause per paragraph; titles are spec.titles.
  const CLAUSES = [
    ['Acceptance of these terms', /read these terms|agree to our terms/i],
    ['Your account', /account|password|register|years old|automated tools|referral/i],
    ['Privacy and personal data', /personal|data|privacy|encryption|GDPR|information/i],
    ['Cookies', /cookie/i],
    ['Orders and bookings', /order|booking|cancel/i],
    ['Prices and payment', /price|VAT|fee|billed|payment|interest|credit|gift card|offer/i],
    ['Delivery', /deliver|shipping|transit/i],
    ['Returns, refunds and warranty', /return|refund|warrant/i],
    ['Membership', /membership|subscription|renew/i],
    ['Stays and events', /check-in|pets|smoking|premises|ticket/i],
    ['Your content and links', /content|upload|links/i],
    ['Changes, disputes and governing law', /terms|law|dispute|provision/i],
  ];

  function termsText(rng, nClause, maxS, cs) {
    const pool = C.sample(rng, C.SENTENCE_GROUPS.policy
      .filter((s) => !/\n/.test(s) && !/^Last updated/.test(s) && s.length <= 170), 999, cs);
    const buckets = CLAUSES.map(() => []);
    for (const s of pool.flatMap(sentenceParts).filter(endsClean)) {
      const k = CLAUSES.findIndex(([, re]) => re.test(s));
      if (k >= 0 && buckets[k].length < maxS) buckets[k].push(s);
    }
    const full = buckets.map((b, k) => k).filter((k) => buckets[k].length);
    const keep = rng.sample(full, Math.min(nClause, full.length)).sort((a, b) => a - b);
    const t = assemble(keep.map((k) => buckets[k]));
    return { ...t, source: 'terms', titles: keep.map((k) => CLAUSES[k][0]) };
  }

  // Chat transcript (traits.unit 'message'): one chat-bank entry (sometimes two) per message.
  function chatText(rng, n, cs) {
    const groups = C.SENTENCE_GROUPS;
    const pool = C.sample(rng, groups.chat.concat(groups.meeting)
      .filter((s) => !/\n/.test(s) && s.length <= 120), 80, cs);
    const msgs = [];
    for (let i = 0; i < pool.length && msgs.length < n;) {
      const two = i + 1 < pool.length && endsClean(pool[i]) && endsClean(pool[i + 1]) && rng.bool(0.3);
      msgs.push(pool.slice(i, i + (two ? 2 : 1)).flatMap(sentenceParts));
      i += two ? 2 : 1;
    }
    return { ...assemble(msgs), source: 'chat' };
  }

  // Chat with entities (field scenario, unit 'message'): every entity sentence is a message of its own,
  // between plain chat messages.
  function chatFieldText(rng, nRoles, cs) {
    const roles = rng.sample(Object.keys(ROLES), nRoles);
    const fill = C.sample(rng, C.SENTENCE_GROUPS.chat.filter((s) => plainFiller(s) && endsClean(s)), 20, cs);
    let fi = 0;
    const msgs = [];
    for (const role of roles) {
      if (fi < fill.length && rng.bool(0.6)) msgs.push({ parts: sentenceParts(fill[fi++]) });
      const v = entityValue(rng, role, cs);
      const tpl = rng.pick(ROLES[role].tpl);
      msgs.push({ parts: [tpl.replace('{X}', v)], role, value: v, at: tpl.indexOf('{X}') });
    }
    if (fi < fill.length && rng.bool(0.6)) msgs.push({ parts: sentenceParts(fill[fi++]) });
    const t = assemble(msgs.map((m) => m.parts));
    const ents = {};
    msgs.forEach((m, p) => {
      if (!m.role) return;
      const s = paraStart(t.paragraphs, p) + m.at;
      ents[m.role] = { start: s, end: s + m.value.length, value: m.value };
    });
    return { ...t, source: 'chat', ents, roles };
  }

  // Table (traits.unit 'cell'): rows of people with 2-3 entity columns and a notes column; one cell per
  // paragraph in row-major order. t.pool lists the spans sentence/phrase targets come from (notes cells).
  const TABLE_COLS = {
    name: [
      'Name', 'Customer', 'Contact', 'Member', 'Person', 'Visitor'
    ], email: ['Email', 'E-mail'], phone: ['Phone', 'Telephone'],
    order: ['Order', 'Order no.'], price: ['Total', 'Amount'], date: ['Date', 'Due date'],
    tracking: ['Tracking', 'Tracking no.', 'Track code'], notes: ['Notes', 'Comments', 'Last message', 'Remarks'],
  };
  const TABLE_ROLES = {
    email: ['the email address', 'the e-mail address'], phone: ['the phone number', 'the telephone number'],
    order: ['the order number', 'the order ID'], price: ['the amount', 'the total'], date: ['the date'],
    tracking: ['the tracking number', 'the tracking code'],
  };

  function tableText(rng, o, cs, scenario) {
    const groups = C.SENTENCE_GROUPS;
    for (;;) {
      const roles = rng.sample(Object.keys(TABLE_ROLES), rng.int(2, 3));
      const cols = ['name', ...roles, 'notes'];
      const nR = o.ood ? rng.int(6, 7) : rng.int(4, 5);
      const notes = C.sample(rng, groups.support.concat(groups.product, groups.meeting)
        .filter((s) => plainFiller(s) && s.length <= 100 && endsClean(s)), 2 * nR, cs);
      const used = new Set();
      const cells = [];
      let ni = 0;
      let who = null;
      for (let r = 0; r < nR; r++) {
        for (const c of cols) {
          if (c === 'name') {
            who = C.personName(rng, cs);
            cells.push([who.full]);
          } else if (c === 'email') cells.push([C.emailAddress(rng, who)]);
          else if (c === 'notes') {
            const k = ni + 1 < notes.length && rng.bool(scenario === 'sentence' ? 0.8 : 0.4) ? 2 : 1;
            cells.push(notes.slice(ni, ni + k).flatMap(sentenceParts));
            ni += k;
          } else cells.push([entityValue(rng, c, cs)]);
        }
      }
      const texts = cells.map((c) => c.join(' '));
      if (texts.some((x) => !x || used.size === used.add(x).size)) continue;
      const t = assemble(cells);
      const nC = cols.length;
      const notesSpans = t.spans.filter((s) => s.p % nC === nC - 1);
      const multi = notesSpans.filter((s) => cells[s.p].length > 1);
      if (scenario === 'sentence' && !multi.length) continue;
      const table = { cols: cols.map((role) => ({ role, label: rng.pick(TABLE_COLS[role]) })), rows: nR };
      return { ...t, source: 'table', table, pool: scenario === 'sentence' ? multi : notesSpans };
    }
  }

  // A single line for a native <input> (spec.native 'input'): one or two short sentences.
  function lineText(rng, cs) {
    const groups = C.SENTENCE_GROUPS;
    for (;;) {
      const d = rng.pick(['support', 'product', 'travel', 'howto', 'meeting', 'finance']);
      const pool = C.sample(rng, groups[d].filter((s) => !/\n/.test(s) && s.length <= 78 && endsClean(s)), 12, cs);
      const line = [];
      for (const s of pool) {
        if ([...line, s].join(' ').length <= 78) line.push(s);
        if (line.length >= 2) break;
      }
      if (!line.length) continue;
      return { ...assemble([line.flatMap(sentenceParts)]), source: 'line' };
    }
  }

  // Senders and times of a chat transcript: who[i] indexes people (0 is the viewer, shown as "You"),
  // at[i] is the message's time as shown; times strictly increase, so (sender, time) names one message.
  function chatMeta(rng, n, csplit) {
    const k = rng.int(1, 2);
    const names = [];
    for (let tries = 0; names.length < k && tries < 20; tries++) {
      const nm = C.personName(rng, { csplit }).first;
      if (!names.includes(nm)) names.push(nm);
    }
    const people = ['You', ...names];
    const h24 = rng.bool(0.4);
    const fmt = (m) => {
      const h = Math.floor(m / 60) % 24;
      const mm = String(m % 60).padStart(2, '0');
      return h24 ? `${String(h).padStart(2, '0')}:${mm}` : `${((h + 11) % 12) + 1}:${mm} ${h < 12 ? 'AM' : 'PM'}`;
    };
    const who = [];
    const at = [];
    let cur = rng.int(0, people.length - 1);
    let m = rng.int(8 * 60, 18 * 60);
    for (let i = 0; i < n; i++) {
      if (i > 0 && rng.bool(0.65)) cur = (cur + rng.int(1, people.length - 1)) % people.length;
      who.push(cur);
      m += rng.int(1, 7);
      at.push(fmt(m));
    }
    return { people, who, at, h24 };
  }

  // ---------------------------------------------------------------- inline marks (links, bold runs)

  function sampleMarks(rng, t, n) {
    const toks = wordTokens(t.doc);
    const marks = [];
    for (let tries = 0; tries < 40 && marks.length < n; tries++) {
      const i = rng.int(0, toks.length - 1);
      const len = rng.int(1, 3);
      const a = toks[i];
      const b = toks[Math.min(toks.length - 1, i + len - 1)];
      if (/[\n,:;.!?()"]/.test(t.doc.slice(a.start, b.end)) || b.end - a.start < 3) continue;
      if (marks.some((m) => !(b.end + 1 < m.start || a.start > m.end + 1))) continue;
      marks.push({ start: a.start, end: b.end, kind: rng.bool(0.5) ? 'link' : 'bold' });
    }
    return marks.sort((x, y) => x.start - y.start);
  }

  Object.assign(env.taskOf('select-text').lib, {
    ORD, STOP, ROLES, TABLE_ROLES, sentenceParts, words, trimRange, paraStart, countOf, wordTokens,
    storyText, realText, messageText, termsText, chatText, chatFieldText, tableText, lineText, chatMeta, sampleMarks,
  });
})();
