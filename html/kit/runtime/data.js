/*
 * kit/runtime/data.js: pure helpers for task logic (no DOM, no randomness of their own), exposed on env.util:
 *   lev(a, b)                    edit distance (insert, delete, substitute) between two strings or arrays, by index
 *                                (UTF-16 units for strings; pass [...s] to compare code points)
 *   clone(x)                     deep copy through JSON (drops undefined fields and functions, like the model does)
 *   keepIdx(rng, n, must, extra) the indices of 0..n-1 to keep, ascending: every index in must plus `extra` more
 *                                drawn with rng.sample from the rest (one sample call)
 *   clamp(x, lo, hi)             Math.min(hi, Math.max(lo, x))
 *   cap(s)                       first character upper-cased (a falsy s comes back unchanged)
 *   quote(s)                     `"s"` with straight double quotes
 *   pad(n, width = 2) / pad2(n)  zero-padded decimal string
 *   nonEmpty(xs)                 xs is a non-empty array of non-blank strings
 *   sameJson(a, b)               JSON.stringify(a) === JSON.stringify(b)
 *   pickWeighted(rng, items, weights)  rng.pick from items repeated weights[item] times (default 1): one pick call
 *   reportFactsOf(factsOf, solveOf)    the task's facts() for the report knob: the facts of the model, or (when it
 *                                      shows none and the spec has no judge) the facts of the solved model
 *   dist(a, b) / lerp(a, b, t)  distance between two [x, y] points; the point a share t of the way from a to b
 *   listText(xs, q)              "a", "a and b", "a, b and c": xs joined for a sentence, each mapped through q first (default: as is)
 *   isConfirm(spec)              the spec's judge is the confirm mode (spec.judge.mode === 'confirm')
 *   monthKey(y, m) / mIndex(key) 'YYYY-MM' key of a year and month (1-12); a key's month number counted from year 0
 *   civilToDays(y, m, d) / daysToCivil(n)   proleptic Gregorian date <-> days since 1970-01-01 ([y, m, d])
 *   srgbToLab([r, g, b]) / deltaE00(lab1, lab2)   8-bit sRGB -> CIELAB (D65); CIEDE2000 colour difference
 * hash32 (FNV-1a of a string, unsigned) is kit/runtime/rng.js's, also on env.util. A task that needs one of
 * these destructures it from env.util (`const { clamp, quote } = env.util;`) instead of defining its own; the
 * megawob.lint rule task-util-copy flags a task (or kit) file that defines a function with one of these names.
 */
(function () {
  'use strict';
  const kit = (window.__megawobKit = window.__megawobKit || {});

  function lev(a, b) {
    if (a === b) return 0;
    let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
    for (let i = 1; i <= a.length; i++) {
      const cur = [i];
      for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[b.length];
  }

  const clone = (x) => JSON.parse(JSON.stringify(x));

  function keepIdx(rng, n, must, extra) {
    const m = new Set(must);
    const rest = [...Array(n).keys()].filter((i) => !m.has(i));
    rng.sample(rest, Math.max(0, Math.min(extra, rest.length))).forEach((i) => m.add(i));
    return [...Array(n).keys()].filter((i) => m.has(i));
  }

  const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));
  const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
  const quote = (s) => `"${s}"`;
  const pad = (n, w = 2) => String(n).padStart(w, '0');
  const pad2 = (n) => String(n).padStart(2, '0');
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const listText = (xs, q) => {
    const a = q ? xs.map(q) : xs;
    return a.length < 2 ? a.join('') : `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}`;
  };
  const isConfirm = (spec) => !!(spec.judge && spec.judge.mode === 'confirm');
  const monthKey = (y, m) => `${y}-${pad2(m)}`;
  const mIndex = (key) => +key.slice(0, 4) * 12 + (+key.slice(5, 7) - 1);
  const nonEmpty = (xs) => Array.isArray(xs) && xs.length > 0 && xs.every((x) => typeof x === 'string' && x.trim());
  const sameJson = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  function pickWeighted(rng, items, weights) {
    const pool = [];
    for (const v of items) for (let k = 0; k < (weights[v] || 1); k++) pool.push(v);
    return rng.pick(pool);
  }

  // facts as the report knob reads them: the goal text lists the labels from the start page, so a page that shows
  // nothing before an answer lists the labels of the solved page (the same labels and the values of a right ending).
  const reportFactsOf = (factsOf, solveOf) => (model, spec) => {
    const f = factsOf(model, spec);
    return f.length || spec.judge ? f : factsOf(solveOf(spec, model), spec);
  };

  // ---------------------------------------------------------------- dates (proleptic Gregorian, no Date)

  const fdiv = Math.floor;

  function civilToDays(y, m, d) {
    const yy = m <= 2 ? y - 1 : y;
    const era = fdiv(yy / 400);
    const yoe = yy - era * 400;
    const doy = fdiv((153 * (m + (m > 2 ? -3 : 9)) + 2) / 5) + d - 1;
    const doe = yoe * 365 + fdiv(yoe / 4) - fdiv(yoe / 100) + doy;
    return era * 146097 + doe - 719468;
  }

  function daysToCivil(z) {
    z += 719468;
    const era = fdiv(z / 146097);
    const doe = z - era * 146097;
    const yoe = fdiv((doe - fdiv(doe / 1460) + fdiv(doe / 36524) - fdiv(doe / 146096)) / 365);
    const doy = doe - (365 * yoe + fdiv(yoe / 4) - fdiv(yoe / 100));
    const mp = fdiv((5 * doy + 2) / 153);
    const d = doy - fdiv((153 * mp + 2) / 5) + 1;
    const m = mp + (mp < 10 ? 3 : -9);
    return [yoe + era * 400 + (m <= 2 ? 1 : 0), m, d];
  }

  // ---------------------------------------------------------------- colour

  // 8-bit sRGB -> CIELAB (D65)
  function srgbToLab([r, g, b]) {
    const lin = (c) => ((c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    const [R, G, B] = [lin(r), lin(g), lin(b)];
    const X = (0.4124564 * R + 0.3575761 * G + 0.1804375 * B) / 0.95047;
    const Y = 0.2126729 * R + 0.7151522 * G + 0.072175 * B;
    const Z = (0.0193339 * R + 0.119192 * G + 0.9503041 * B) / 1.08883;
    const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116);
    const [fx, fy, fz] = [f(X), f(Y), f(Z)];
    return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
  }

  // CIEDE2000 color difference (Sharma, Wu & Dalal 2005), kL = kC = kH = 1.
  function deltaE00([L1, a1, b1], [L2, a2, b2]) {
    const rad = Math.PI / 180;
    const C7 = (c) => c ** 7 / (c ** 7 + 25 ** 7);
    const Cb = (Math.hypot(a1, b1) + Math.hypot(a2, b2)) / 2;
    const G = 0.5 * (1 - Math.sqrt(C7(Cb)));
    const a1p = (1 + G) * a1;
    const a2p = (1 + G) * a2;
    const C1p = Math.hypot(a1p, b1);
    const C2p = Math.hypot(a2p, b2);
    const hue = (b, a) => (b === 0 && a === 0 ? 0 : ((Math.atan2(b, a) / rad) + 360) % 360);
    const h1p = hue(b1, a1p);
    const h2p = hue(b2, a2p);
    const chroma = C1p * C2p !== 0;

    let dhp = 0;
    if (chroma) {
      dhp = h2p - h1p;
      if (dhp > 180) dhp -= 360;
      else if (dhp < -180) dhp += 360;
    }
    const dLp = L2 - L1;
    const dCp = C2p - C1p;
    const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin((dhp * rad) / 2);

    const Lbp = (L1 + L2) / 2;
    const Cbp = (C1p + C2p) / 2;
    let hbp = h1p + h2p;
    if (chroma) hbp = Math.abs(h1p - h2p) > 180 ? (hbp + (hbp < 360 ? 360 : -360)) / 2 : hbp / 2;
    const T = 1 - 0.17 * Math.cos((hbp - 30) * rad) + 0.24 * Math.cos(2 * hbp * rad)
      + 0.32 * Math.cos((3 * hbp + 6) * rad) - 0.2 * Math.cos((4 * hbp - 63) * rad);
    const dTheta = 30 * Math.exp(-(((hbp - 275) / 25) ** 2));
    const RT = -2 * Math.sqrt(C7(Cbp)) * Math.sin(2 * dTheta * rad);
    const SL = 1 + (0.015 * (Lbp - 50) ** 2) / Math.sqrt(20 + (Lbp - 50) ** 2);
    const SC = 1 + 0.045 * Cbp;
    const SH = 1 + 0.015 * Cbp * T;
    return Math.sqrt((dLp / SL) ** 2 + (dCp / SC) ** 2 + (dHp / SH) ** 2 + RT * (dCp / SC) * (dHp / SH));
  }

  kit.data = {
    lev, clone, keepIdx, clamp, cap, quote, pad, pad2, nonEmpty, sameJson, pickWeighted, reportFactsOf, civilToDays, daysToCivil,
    srgbToLab, deltaE00, dist, lerp, listText, isConfirm, monthKey, mIndex,
  };
})();
