/* set-date/data.js: date arithmetic and field formats (no DOM). */
(function () {
  'use strict';
  const lib = env.taskOf('set-date').lib;

  const { pad2, civilToDays, daysToCivil, nonEmpty, sameJson, mIndex, monthKey } = env.util;

  const C = env.content;

  const I = env.instruct;

  const MONTHS = C.MONTHS;

  const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const MAX_DAYS = 1000;

  const MAX_MIN = 1440;

  const YEAR0 = 2020;

  const YEAR1 = 2032;

  const YEARS = Array.from({ length: YEAR1 - YEAR0 + 1 }, (_, i) => YEAR0 + i);

  const fdiv = Math.floor;

  const isoOf = (y, m, d) => `${y}-${pad2(m)}-${pad2(d)}`;

  const daysInMonth = (y, m) => (m === 12 ? civilToDays(y + 1, 1, 1) : civilToDays(y, m + 1, 1)) - civilToDays(y, m, 1);

  function ymd(iso) {
    const r = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    if (!r) return null;
    const [y, m, d] = [+r[1], +r[2], +r[3]];
    if (m < 1 || m > 12 || d < 1 || d > daysInMonth(y, m)) return null;
    return [y, m, d];
  }

  const days = (iso) => { const p = ymd(iso); return p ? civilToDays(...p) : null; };

  const fromDays = (n) => isoOf(...daysToCivil(n));

  const addDays = (iso, n) => fromDays(days(iso) + n);

  const weekday = (iso) => ((days(iso) % 7) + 11) % 7;

  const keyOf = (i) => monthKey(fdiv(i / 12), (i % 12) + 1);

  const addMonths = (key, n) => keyOf(mIndex(key) + n);

  const monthDiff = (a, b) => mIndex(b) - mIndex(a);

  const monthOf = (iso) => iso.slice(0, 7);

  const EPOCH = { first: monthKey(YEAR0, 1), last: monthKey(YEAR1, 12) };

  const clampKey = (key, lo, hi) => keyOf(Math.min(mIndex(hi), Math.max(mIndex(lo), mIndex(key))));

  const lastOfMonth = (key) => isoOf(+key.slice(0, 4), +key.slice(5, 7), daysInMonth(+key.slice(0, 4), +key.slice(5, 7)));

  function ordinal(n) {
    const s = n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] || 'th';
    return n + s;
  }

  function fmtDate(iso, style) {
    const [y, m, d] = ymd(iso);
    const M = MONTHS[m - 1];
    const Mon = M.slice(0, 3);
    const W = WEEKDAYS[weekday(iso)];
    switch (style) {
      case 'long': return `${M} ${d}, ${y}`;
      case 'longDay': return `${W}, ${M} ${d}, ${y}`;
      case 'dmy': return `${d} ${M} ${y}`;
      case 'ordinal': return `the ${ordinal(d)} of ${M}, ${y}`;
      case 'iso': return iso;
      case 'us': return `${pad2(m)}/${pad2(d)}/${y} (MM/DD/YYYY)`;
      case 'eu': return `${pad2(d)}/${pad2(m)}/${y} (DD/MM/YYYY)`;
      case 'de': return `${pad2(d)}.${pad2(m)}.${y}`;
      case 'short': return `${Mon} ${d}, ${y}`;
      case 'shortDay': return `${W.slice(0, 3)}, ${Mon} ${d}, ${y}`;
      case 'shortDmy': return `${d} ${Mon} ${y}`;
      case 'monthDay': return `${M} ${d}`;
      default: throw new Error(`fmtDate: unknown style ${style}`);
    }
  }

  const loc = (spec) => C.LOCALES[spec.locale] || C.LOCALES['en-US'];

  function pickLocale(rng, spec) {
    const ids = Object.keys(C.LOCALES);
    const r = rng.next();
    if (r < 0.5) return 'en-US';
    if (r < 0.62) return 'en-GB';
    return C.pick(rng, ids.filter((x) => x !== 'en-US'), { csplit: spec.csplit === 'heldout' ? 'all' : 'train' });
  }

  const LOCALE_MASK = {
    'en-US': 'MM/DD/YYYY', 'en-GB': 'DD/MM/YYYY', 'de-DE': 'DD.MM.YYYY', 'fr-FR': 'DD/MM/YYYY', 'es-ES': 'DD/MM/YYYY',
    'pt-BR': 'DD/MM/YYYY', 'it-IT': 'DD/MM/YYYY', 'nl-NL': 'DD-MM-YYYY', 'pl-PL': 'DD.MM.YYYY', 'ja-JP': 'YYYY/MM/DD',
    'zh-CN': 'YYYY/MM/DD',
  };

  const LOCAL_LETTERS = { 'de-DE': { D: 'T', M: 'M', Y: 'J' }, 'fr-FR': { D: 'J', M: 'M', Y: 'A' }, 'es-ES': { D: 'D', M: 'M', Y: 'A' },
    'pt-BR': { D: 'D', M: 'M', Y: 'A' }, 'it-IT': { D: 'G', M: 'M', Y: 'A' }, 'nl-NL': { D: 'D', M: 'M', Y: 'J' }, 'pl-PL': { D: 'D', M: 'M', Y: 'R' } };

  const MASKS = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD', 'DD.MM.YYYY', 'DD-MM-YYYY', 'YYYY/MM/DD'];

  const MASK_ASK = { 'MM/DD/YYYY': 'us', 'DD/MM/YYYY': 'eu', 'YYYY-MM-DD': 'iso', 'DD.MM.YYYY': 'de' };

  function maskText(raw, mask) {
    const dg = String(raw).replace(/\D/g, '');
    let out = '';
    let i = 0;
    for (const ch of mask) {
      if (i >= dg.length) break;
      out += /[A-Z]/.test(ch) ? dg[i++] : ch;
    }
    return out;
  }

  function fillMask(mask, parts) {
    const take = { Y: String(parts.Y).padStart(4, '0'), M: pad2(parts.M), D: pad2(parts.D), H: pad2(parts.H), N: pad2(parts.N) };
    const pos = { Y: 0, M: 0, D: 0, H: 0, N: 0 };
    let out = '';
    for (const ch of mask) out += take[ch] ? take[ch][pos[ch]++] : ch;
    return out;
  }

  function readMask(text, mask) {
    if (typeof text !== 'string' || text.length !== mask.length) return null;
    const acc = {};
    for (let i = 0; i < mask.length; i++) {
      const ch = mask[i];
      if (/[A-Z]/.test(ch)) {
        if (!/\d/.test(text[i])) return null;
        acc[ch] = (acc[ch] || '') + text[i];
      } else if (text[i] !== ch) return null;
    }
    return acc;
  }

  function parseDate(text, mask) {
    const a = readMask(text, mask);
    if (!a) return null;
    const iso = `${a.Y}-${a.M}-${a.D}`;
    return ymd(iso) ? iso : null;
  }

  const formatDate = (iso, mask) => { const [Y, M, D] = ymd(iso); return fillMask(mask, { Y, M, D }); };

  function parseLong(text) {
    const r = /^(?:([a-z]+)\.?,? )?([a-z]+)\.? (\d{1,2})(?:st|nd|rd|th)?,? (\d{4})$/.exec(String(text || '').trim().toLowerCase().replace(/\s+/g, ' '));
    if (!r) return null;
    const abbr = (name, list) => list.findIndex((x) => x.toLowerCase() === name || (name.length >= 3 && x.toLowerCase().startsWith(name) && (name.length === 3 || (name === 'sept' && x === 'September'))));
    const mi = abbr(r[2], MONTHS);
    if (mi < 0) return null;
    const iso = isoOf(+r[4], mi + 1, +r[3]);
    if (!ymd(iso)) return null;
    if (r[1] && abbr(r[1], WEEKDAYS) !== weekday(iso)) return null;
    return iso;
  }

  const typedText = (spec, iso) => (spec.longForm ? fmtDate(iso, spec.longForm) : formatDate(iso, spec.mask));

  const MASK24 = 'HH:NN';

  function parseTime24(text) {
    const a = readMask(text, MASK24);
    if (!a) return null;
    const h = +a.H;
    const n = +a.N;
    return h < 24 && n < 60 ? h * 60 + n : null;
  }

  const fmt24 = (min) => `${pad2(fdiv(min / 60))}:${pad2(min % 60)}`;

  const parts12 = (min) => ({ h: fdiv(min / 60) % 12 || 12, m: min % 60, ap: min >= 720 ? 'PM' : 'AM' });

  const from12 = (h, m, ap) => (h % 12) * 60 + m + (ap === 'PM' ? 720 : 0);

  function fmt12(min, dotted) {
    const { h, m, ap } = parts12(min);
    return `${h}:${pad2(m)} ${dotted ? (ap === 'AM' ? 'a.m.' : 'p.m.') : ap}`;
  }

  const NUM = ['twelve', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];

  function timeWords(rng, min) {
    if (min === 720) return 'noon';
    if (min === 0) return 'midnight';
    const { h, m } = parts12(min);
    const H = fdiv(min / 60);
    const part = (hh) => (hh < 12 ? 'in the morning' : hh < 18 ? 'in the afternoon' : 'in the evening');
    const hw = (x) => (rng.bool(0.5) ? NUM[x] : String(x));
    if (m === 0) return `${hw(h)} o'clock ${part(H)}`;
    if (m === 30) return `half past ${hw(h)} ${part(H)}`;
    if (m === 15) return `quarter past ${hw(h)} ${part(H)}`;
    if (m === 45) {
      const nx = parts12((min + 15) % 1440).h;
      return `quarter to ${hw(nx)} ${part(fdiv(((min + 15) % 1440) / 60))}`;
    }
    return null;
  }

  function fmtDur(min) {
    const h = fdiv(min / 60);
    const m = min % 60;
    return h ? `${h} h${m ? ` ${m} min` : ''}` : `${m} min`;
  }

  function durAsk(rng, min) {
    const h = fdiv(min / 60);
    const m = min % 60;
    const kinds = ['hm', 'words', 'minutes'];
    if (h) kinds.push('clock');
    if (m % 15 === 0 && h) kinds.push('decimal');
    if (min === 30 || min === 15 || min === 45 || (h && h <= 4 && (m === 0 || m === 30))) kinds.push('natural', 'natural');
    const kind = rng.pick(kinds);
    const NW = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
    if (kind === 'hm') return { askKind: kind, ask: fmtDur(min) };
    if (kind === 'minutes') return { askKind: kind, ask: `${min} minutes` };
    if (kind === 'clock') return { askKind: kind, ask: `${h}:${pad2(m)} (hours:minutes)` };
    if (kind === 'decimal') return { askKind: kind, ask: `${h + m / 60} hours` };
    if (kind === 'words') {
      const hs = h ? `${h} hour${h > 1 ? 's' : ''}` : '';
      const ms = m ? `${m} minute${m > 1 ? 's' : ''}` : '';
      return { askKind: kind, ask: [hs, ms].filter(Boolean).join(' and ') };
    }
    if (min === 15) return { askKind: kind, ask: 'a quarter of an hour' };
    if (min === 30) return { askKind: kind, ask: 'half an hour' };
    if (min === 45) return { askKind: kind, ask: 'three quarters of an hour' };
    if (m === 30) return { askKind: kind, ask: h === 1 ? 'an hour and a half' : `${NW[h]} and a half hours` };
    return { askKind: kind, ask: h === 1 ? 'one hour' : `${NW[h]} hours` };
  }

  const segsOf = (iso) => { const [y, m, d] = ymd(iso); return { y: String(y), m: pad2(m), d: pad2(d) }; };

  const weekStartOf = (iso, ws) => fromDays(days(iso) - ((weekday(iso) - ws + 7) % 7));

  const monthName = (key, style) => {
    const [y, m] = [+key.slice(0, 4), +key.slice(5, 7)];
    return style === 'short' ? `${MONTHS[m - 1].slice(0, 3)} ${y}` : style === 'num' ? `${pad2(m)}/${y}` : style === 'iso' ? key : `${MONTHS[m - 1]} ${y}`;
  };

  const inYears = (key) => key >= '2021-01' && key <= '2031-12';

  const NWORD = ['zero', 'one', 'two', 'three', 'four', 'five', 'six'];

  function relUnit(rng, n, unit) {
    const w = (k) => (k < NWORD.length ? NWORD[k] : String(k));
    if (n === 0) return `this ${unit}`;
    if (n === 1) return `next ${unit}`;
    if (n === -1) return `last ${unit}`;
    if (n === 2 && rng.bool(0.4)) return `the ${unit} after next`;
    return n > 0 ? rng.pick([`in ${w(n)} ${unit}s`, `${w(n)} ${unit}s from now`]) : `${w(-n)} ${unit}s ago`;
  }

  Object.assign(lib, { pad2, civilToDays, nonEmpty, sameJson, monthKey, C, I, MONTHS, WEEKDAYS, MAX_DAYS, MAX_MIN, YEAR0, YEAR1, YEARS, fdiv, isoOf, daysInMonth, ymd, days, fromDays, addDays, weekday, addMonths, monthDiff, monthOf, EPOCH, clampKey, lastOfMonth, ordinal, fmtDate, loc, pickLocale, LOCALE_MASK, LOCAL_LETTERS, MASKS, MASK_ASK, maskText, parseDate, parseLong, typedText, MASK24, parseTime24, fmt24, parts12, from12, fmt12, timeWords, fmtDur, durAsk, segsOf, weekStartOf, monthName, inYears, relUnit });
  Object.assign(env.taskOf('set-date').helpers, { days, fromDays, weekday, monthKey, addMonths, fmtDate, fmt12, fmtDur, maskText, loc, YEARS, MASK24, WEEKDAYS, MONTHS, parts12 });
})();
