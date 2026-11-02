/* set-date/scenarios/segmented.js: scenario sampling (no DOM). */
(function () {
  'use strict';
  const lib = env.taskOf('set-date').lib;

  function sampleSegmented(rng, spec, opts) {
    // The typed scenario's scene, mask and ask (formats and relative phrases), shown as separate segments.
    if (!lib.sampleTyped(rng, spec, null)) return null;
    const ph = spec.maskShown || spec.mask;
    const segs = [];
    let i = 0;
    while (i < spec.mask.length) {
      const ch = spec.mask[i];
      if (/[A-Z]/.test(ch)) {
        let j = i;
        while (spec.mask[j] === ch) j++;
        segs.push({ k: ch.toLowerCase(), ph: ph.slice(i, j), w: j - i });
        i = j;
      } else { segs.push({ sep: ch }); i++; }
    }
    const r = rng.fork('seg');
    let how = r.pick(['type', 'type', 'spin', 'keys']);
    const kb = r.bool(0.5) ? 'type' : 'keys';
    if (opts.route === 'keyboard') how = kb;
    else if (opts.route === 'pointer') how = 'spin';
    spec.how = how;
    spec.segs = segs;
    return spec;
  }

  env.scenario('set-date', { name: 'segmented', sample: sampleSegmented });
})();
