/*
 * kit/content/*.js: realistic, seeded content banks on env.content (window.env.content), loaded after env.js
 * in this order: core, people, commerce, places, text, ui, locale. Static data plus pure helpers: no DOM, no
 * fetch, no Date, no Math.random. Every helper that draws takes the kit Rng first; give content its own stream
 * (const crng = rng.fork('content')) so content draws never shift the task's other draws. All text is original
 * and fictional (no real brands or living people); real cities, countries and airport codes are used.
 * The kit's original keys (WORDS, MONTHS, COLORS, SHAPES) are unchanged.
 *
 *   const C = env.content, crng = rng.fork('content');
 *   const who = C.personName(crng, { csplit: opts.split });      // { first, last, full, origin }
 *   const items = C.sample(crng, C.PRODUCTS, 5);                  // [{ name, category, priceMin, priceMax }]
 *   const when = C.formatDate(C.randomDate(crng), 'de-DE', 'long');   // '11. März 2024'
 *
 * Eval split. Every list splits into a train part (~80%) and a heldout part (~20%) by a stable hash of each
 * item, so heldout pages show names, products, labels and sentences never seen in training.
 *   split(list, which)                which: 'train' (default) | 'heldout' | 'all'. Heldout iff
 *                                     hash32(key) % 5 === 0, key = the item if a string, else item.id ||
 *                                     item.name || JSON.stringify(item). A list of 10+ items where none hashes
 *                                     heldout holds out its lowest-hash item; a shorter one (formats, enums)
 *                                     falls back to the whole list, so a part is never empty.
 *   pick(rng, list, opts)             rng.pick(split(list, opts.csplit)); opts optional everywhere; a spec (or any
 *                                     object with csplit) can be passed as opts
 *   csplitOf(spec)                    { csplit: spec.csplit }: the opts for the other helpers (personName, address, ...)
 *   sample(rng, list, k, opts)        k distinct items from the split part (k capped at its size)
 *   isHeldout(item)                   true when the item is in the heldout part
 *   Helpers below that take opts honor opts.csplit the same way ('train' when omitted).
 *
 * core.js (utilities)
 *   hash32(str)                       FNV-1a, identical to the kit's
 *   lines(text) / rows(text, sep='|') multi-line literal -> trimmed non-empty lines / lines split into fields
 *   fill(template, vars)              replace {name} and {a.b} slots; unknown slots are left as they are
 *   ascii(str) / slug(str, sep='-')   strip diacritics / lower-case url-style slug
 *   digits(rng, n) / letters(rng, n, upper=true) / alnum(rng, n)   random code fragments (no I/O/0/1 in letters)
 *   weighted(rng, [[value, weight], ...])  weighted choice
 *   titleCase(str) / cap(str)         Title Case Words / Capitalize the first letter
 *
 * people.js
 *   NAME_GROUPS                       [{ origin, first[], last[] }], 24 cultural groups
 *   FIRST_NAMES (1516) LAST_NAMES (1656)    flattened, unique
 *   personName(rng, opts)             { first, last, full, origin }; opts: origin (force a group), mix (chance the
 *                                     last name comes from any group, default 0.2), familyFirst, csplit
 *   username(rng, person)             'ngozi.okafor', 'nokafor', 'ngozi42', 'okaforn7' ...
 *   emailAddress(rng, person, domain?)    'ngozi.okafor@quillpost.com'
 *   EMAIL_DOMAINS (223)                fictional mail and company domains (+ example.com/.org)
 *   JOB_TITLES (439)  DEPARTMENTS (156)
 *   phone(rng, localeId='en-US')      locale-formatted number, national or international form (US 555-01xx and
 *                                     UK 07700 900xxx fiction ranges); PHONE_FORMATS holds the patterns
 *
 * commerce.js
 *   COMPANIES (678)                   fictional company names in many styles ('Okafor & Sons', 'Tessellate AI')
 *   PRODUCTS (1709)                    { name, category, priceMin, priceMax (USD), unit? }, 17 categories
 *   PRODUCT_CATEGORIES (17)           { id, label }: electronics grocery clothing home kitchen office books toys
 *                                     sports beauty garden pets auto music health baby tools
 *   DISHES (516)                      { name, category, price, options?: [{ name, values[] }] }
 *   currency(code)                    { code, symbol, decimals, name, perUSD, locale } (16 currencies)
 *   price(rng, product, code='USD')   { amount, currency, text }: realistic endings (.99/.49/.00; ¥1,480)
 *   orderId(rng) invoiceId(rng) sku(rng) trackingCode(rng) couponCode(rng) giftCardCode(rng)   varied formats
 *   cardNumber(rng)                   Luhn-valid test-style numbers (4000 ...), grouped by 4
 *   COUPON_CODES (264)  SHIPPING_METHODS (12, { id, name, days: [min, max], price })
 *   PAYMENT_METHODS (19)  ORDER_STATUSES (15)
 *
 * places.js
 *   CITIES (914)                      { city, country, countryCode, region?, tz ('UTC+5:30'), iata, pc?, local? }
 *                                     (tz = standard offset; pc = postcode prefix; local = name in the local
 *                                     language when it differs: München, Roma, Warszawa)
 *   COUNTRIES (180) countryByCode(cc) { name, code, local? }
 *   STREET_NAMES (771)                English street names ('Maple Avenue', 'Church Lane')
 *   STREETS_BY_LOCALE                 de-DE fr-FR es-ES pt-BR it-IT nl-NL pl-PL ja-JP zh-CN street names
 *   address(rng, localeId='en-US', opts)  { line1, line2?, city, region?, postcode, country, countryCode, text }
 *                                     text in the locale's postal order for en-US en-GB de-DE fr-FR es-ES pt-BR
 *                                     it-IT nl-NL pl-PL ja-JP zh-CN en-CA en-AU; any other id: a random city
 *                                     worldwide in international form. opts.city forces the city.
 *   postcode(rng, localeId, city?)    well-formed postcode for the city's (or locale's) country
 *   VENUES (384)  STATIONS (379)  AIRLINES (30 fictional, { name, code })  flightNumber(rng) 'NV 2318'
 *
 * text.js
 *   SENTENCE_GROUPS                   { support, product, news, policy, howto, meeting, chat, travel, finance,
 *                                     science, community }: 45-52 sentences each, 5-35 words
 *   SENTENCES (2217)                   all groups flattened
 *   paragraph(rng, n=4, opts)         n sentences from one group (opts.domain picks it, else random)
 *   paragraphs(rng, k=3, opts)        k paragraphs from one group, 2-5 sentences each (opts.min/max)
 *   TOPICS (426)  HEADLINES (593)  EMAIL_SUBJECTS (910)  LINK_TEXTS (913)  POST_TEXTS (483, hashtags/mentions)
 *   emailBody(rng, ctx)               greeting, body, closer, sign-off (+ title); ctx (all optional): sender,
 *                                     recipient (person or name string), product, date, amount, company, topic,
 *                                     kind (one of EMAIL_KINDS), locale (date format), csplit. Returns a string,
 *                                     paragraphs separated by blank lines.
 *   EMAIL_KINDS                       meeting order invoice followup intro request thanks reminder update personal
 *   fileName(rng, ext?, opts?)        'Invoice_2023-11_Okafor.pdf', 'IMG_4821.jpg', 'draft v3 (final).docx'; csplit
 *   FILE_EXTENSIONS (34)              { ext, kind, label }   fileSize(rng, kind?) '2.4 MB'
 *
 * ui.js
 *   BUTTON_LABELS (48 groups, 253 labels)   { intent, labels[] }, labels unique; look-alike groups (save: Save,
 *                                     Save as..., Save draft, Saved, Save & close, ...)
 *   MENU_ITEMS (24 menus, 250 items)  { menu, items: [{ label, shortcut? }] }: File, Edit, View, Insert, Format,
 *                                     Tools, Window, Help, Account, Admin, Row actions, Message, Table, Sort by, ...
 *   NAV_ITEMS (116)
 *   SETTINGS (150)                    { id, label, group, kind: 'toggle'|'select'|'number', negated, description,
 *                                     options? (select), min?/max?/unit? (number) }; 13 groups; negated = the
 *                                     label turns something off ('Disable notifications', 'Hide my email address')
 *   FIELD_LABELS (121)                { id, label, aliases[], kind, placeholder?, secret? }; kind 'text' | 'email' |
 *                                     'phone' | 'date' | 'number' | 'select' | 'checkbox' (terms, newsletter)
 *   ICON_NAMES (91, { name, tooltip })
 *   END_LABELS (25)                   what a page's finishing control may say (Submit, Done, I'm done, ...)
 *   DECOY_LABELS (35)                 inert chrome buttons (Help, Reset view, Save draft, ...), disjoint from END_LABELS;
 *                                     sites that want a decoy colliding with the end label draw it from END_LABELS
 *                                     (minus the episode's end label), as the base site does in ~30% of episodes
 *   BANNER_TEXTS                      { cookie (22), toast (25), promo (22), chat (21), notice (20) }:
 *                                     [{ text, buttons[] }], first button = primary action
 *   endLabel(rng)                     rng.pick(END_LABELS)
 *   decoyLabels(rng, n)               rng.sample(DECOY_LABELS, n)
 *   collideLabel(rng, label)          rng.pick of END_LABELS minus label (case-insensitive), or null
 *   bannerText(rng, kind)             rng.pick(BANNER_TEXTS[kind]) -> { text, buttons[] }
 *
 * locale.js (no Intl: identical output in every browser and Node; matches CLDR/ICU for the long/full styles)
 *   LOCALES  LOCALE_IDS               en-US en-GB de-DE fr-FR es-ES pt-BR it-IT nl-NL pl-PL ja-JP zh-CN:
 *                                     { id, name, nativeName, firstDayOfWeek (0 Sun, 1 Mon), dateOrder
 *                                     'MDY'|'DMY'|'YMD', time24, decimal, group, currency, country, months[],
 *                                     monthsShort[], weekdays[] (Sunday first), weekdaysShort[] }
 *   formatDate(iso, localeId, style)  style 'numeric' 3/1/2024 | 'short' 03/01/2024, 01.03.2024, 2024/03/01 |
 *                                     'medium' Mar 1, 2024 | 'long' March 1, 2024, 1er mars 2024 | 'full'
 *                                     (with weekday) | 'monthYear' | 'monthDay' | 'iso'
 *   formatNumber(x, localeId, decimals?)  1,234.56 | 1.234,56 | 1 234,56 (fr U+202F, pl U+00A0) | 1234,56 (es/it/pl
 *                                     do not group 4 digits); decimals default: as few as needed, max 2
 *   formatMoney(x, code, localeId?)   '$1,234.56' | '1.234,56 €' | 'R$ 1.234,56' | '￥1,235' (spaces are U+00A0)
 *   UI_WORDS[localeId][key]  uiWord(key, localeId)   114 chrome words x 11 locales; keys: submit done finish
 *                                     continue save cancel ok confirm apply next back previous search delete close
 *                                     acceptAll rejectAll settings menu home help signIn signOut profile account
 *                                     cart checkout filter sort more less yes no edit add remove upload download
 *                                     send reply forward archive open share print copy paste undo refresh reset
 *                                     clear skip select view details total quantity price language notifications
 *                                     loading today required login register password email
 *                                     and site-chrome words and phrases (lang knob): projects reports team billing
 *                                     docs activity inbox files feedback preview saveDraft resetView export history
 *                                     yourTask instructions toDo goal dashboard workspace portal admin footSaved
 *                                     footHelp footStatus footRights cookieText cookieText2 toastSynced toastExport
 *                                     toastRestored chatHello chatPlans promoUpgrade promoTrial bannerMaint
 *                                     bannerShared bannerTrial necessaryOnly accept gotIt noThanks maybeLater
 *                                     upgradeNow startTrial learnMore dismiss
 *   randomDate(rng, { from, to })     'YYYY-MM-DD', default 2019-01-01 .. 2027-12-31
 *   dateParts(iso) toISO(y, m, d) addDays(iso, n) dayOfWeek(iso) (0 = Sunday) daysInMonth(y, m)   (no Date)
 */
(function () {
  'use strict';
  const C = env.content;

  const { hash32 } = env.util;

  const keyOf = (item) => (typeof item === 'string' ? item : (item && (item.id || item.name)) || JSON.stringify(item));
  const isHeldout = (item) => hash32(keyOf(item)) % 5 === 0;

  // Split results are cached per list object; banks are never mutated after load.
  const cache = new WeakMap();
  function split(list, which) {
    if (!Array.isArray(list) || !list.length) return list || [];
    which = which || 'train';
    if (which === 'all') return list;
    let parts = cache.get(list);
    if (!parts || parts.n !== list.length) {
      const train = [];
      const heldout = [];
      for (const item of list) (isHeldout(item) ? heldout : train).push(item);
      // A bank of 10+ items where none hashes heldout holds out its lowest-hash item, so a heldout episode never
      // falls back to training text. Shorter lists (formats, enums) keep the whole list for both parts.
      if (!heldout.length && list.length >= 10) {
        const low = list.reduce((a, x) => (hash32(keyOf(x)) < hash32(keyOf(a)) ? x : a));
        heldout.push(low);
        train.splice(train.indexOf(low), 1);
      }
      parts = { n: list.length, train: train.length ? train : list, heldout: heldout.length ? heldout : list };
      cache.set(list, parts);
    }
    return which === 'heldout' ? parts.heldout : parts.train;
  }

  const lines = (text) => String(text).split('\n').map((s) => s.trim()).filter(Boolean);
  const rows = (text, sep = '|') => lines(text).map((l) => l.split(sep).map((s) => s.trim()));

  function fill(template, vars) {
    return String(template).replace(/\{([a-zA-Z0-9_.]+)\}/g, (m, path) => {
      let v = vars;
      for (const k of path.split('.')) v = v == null ? undefined : v[k];
      return v == null ? m : String(v);
    });
  }

  const ascii = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/ł/g, 'l').replace(/Ł/g, 'L').replace(/ß/g, 'ss').replace(/ø/g, 'o').replace(/Ø/g, 'O')
    .replace(/æ/g, 'ae').replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/ı/g, 'i');
  const slug = (s, sep = '-') => ascii(s).toLowerCase().replace(/[^a-z0-9]+/g, sep)
    .replace(new RegExp(`^\\${sep}+|\\${sep}+$`, 'g'), '');

  const DIG = '0123456789';
  const UP = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // no I, O: they read as 1, 0 in codes
  const AN = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const draw = (rng, alphabet, n) => {
    let s = '';
    for (let i = 0; i < n; i++) s += alphabet[rng.int(0, alphabet.length - 1)];
    return s;
  };

  Object.assign(C, {
    hash32,
    isHeldout,
    split,
    // The options object for the helpers below from a spec (or any object carrying csplit).
    csplitOf(spec) { return { csplit: spec.csplit }; },
    pick(rng, list, opts) { return rng.pick(split(list, opts && opts.csplit)); },
    sample(rng, list, k, opts) {
      const pool = split(list, opts && opts.csplit);
      return rng.sample(pool, Math.max(0, Math.min(k, pool.length)));
    },
    lines,
    rows,
    fill,
    ascii,
    slug,
    digits(rng, n) { return draw(rng, DIG, n); },
    letters(rng, n, upper = true) { const s = draw(rng, UP, n); return upper ? s : s.toLowerCase(); },
    alnum(rng, n) { return draw(rng, AN, n); },
    weighted(rng, pairs) {
      const total = pairs.reduce((a, p) => a + p[1], 0);
      let x = rng.float() * total;
      for (const [v, w] of pairs) { if ((x -= w) < 0) return v; }
      return pairs[pairs.length - 1][0];
    },
    titleCase(s) {
      const small = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'of', 'on', 'or', 'the', 'to', 'with']);
      return String(s).split(' ').map((w, i) => (i > 0 && small.has(w.toLowerCase()) ? w.toLowerCase()
        : w.charAt(0).toUpperCase() + w.slice(1))).join(' ');
    },
    cap(s) { return env.util.cap(String(s)); },
  });
})();
