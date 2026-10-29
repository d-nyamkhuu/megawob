/*
 * kit/runtime/rng.js: seeded randomness. Rng (mulberry32) is env.Rng; fork(label) gives an independent sub-stream
 * (hash32 of seed and label), so what one consumer draws never shifts another's sequence.
 * Loaded by play.html before kit/env.js, like every kit/runtime/*.js module (see the list there).
 */
(function () {
  'use strict';
  const kit = (window.__megawobKit = window.__megawobKit || {});

  function mulberry32(a) {
    return function () {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function hash32(s) {
    let h = 0x811c9dc5;
    for (const ch of String(s)) {
      h ^= ch.codePointAt(0);
      h = Math.imul(h, 0x01000193);
    }
    return h >>> 0;
  }

  class Rng {
    constructor(seed) {
      this.seed = seed >>> 0;
      this.next = mulberry32(this.seed);
    }
    float(lo = 0, hi = 1) { return lo + (hi - lo) * this.next(); }
    int(lo, hi) { return lo + Math.floor(this.next() * (hi - lo + 1)); }
    bool(p = 0.5) { return this.next() < p; }
    pick(xs) { return xs[Math.floor(this.next() * xs.length)]; }
    shuffle(xs) {
      const a = xs.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(this.next() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }
    sample(xs, k) { return this.shuffle(xs).slice(0, k); }
    // Independent sub-stream: what one consumer draws never shifts another's sequence.
    fork(label) { return new Rng(hash32(`${this.seed}/${label}`)); }
  }

  kit.rng = { Rng, hash32 };
})();
