/* handle-text/scenarios/sign-agreement.js: scenario sampling; private task lib. */
(function () {
  'use strict';
  const lib = env.taskOf('handle-text').lib;
  const C = env.content;

  function sampleSign(rng, spec, opts) {
    const mode = rng.pick(['agree', 'agree', 'cancel', 'decline']);
    const cols = rng.int(40, 54);
    const rows = rng.int(5, 8);
    const secs = rng.sample(lib.SECTIONS, spec.ood ? rng.int(7, 9) : rng.int(3, 5));
    const pool = lib.TERMS.concat(lib.sentences(spec, 'policy'));
    const lines = [];
    secs.forEach((title, i) => {
      if (i) lines.push('');
      lines.push(`${i + 1}. ${title}`);
      lines.push(...lib.wrap(rng.sample(pool, rng.int(2, 4)).join(' '), cols));
    });
    const p = C.personName(rng, C.csplitOf(spec));
    return {
      mode, cols, rows, lines,
      heading: rng.pick([
        'User agreement', 'Terms of Service', 'License agreement', 'Terms and conditions', 'Usage provisions',
        'Service conditions', 'Use guidelines'
      ]),
      name: rng.bool(0.5) ? p.first : p.full,
      field: { label: rng.pick([
        'Name', 'Full name', 'Signature', 'Your name', 'Signer', 'Sign as', 'Signed by', 'Name used'
      ]), placeholder: rng.pick(['Name', 'Type your name', '']) },
      route: rng.pick(['wheel', 'thumb']),
      recoverable: opts.recover ?? rng.bool(0.5),
    };
  }
  env.scenario('handle-text', { name: 'sign-agreement', sample: sampleSign });
})();
