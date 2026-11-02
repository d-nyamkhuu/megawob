/* use-text-editor/multiline: goal sampling for the multiline scenario. */
(function () {
  'use strict';
  const { lib } = env.taskOf('use-text-editor');

  function goalLines(rng, spec, meta, op, opts) {
    const tags = { uncomment: ['commented'], indent: ['if2-body'], outdent: ['stmt'], delete: ['debug'], comment: ['stmt', 'fetch', 'const'] }[op];
    const tag = rng.pick(tags);
    let ls = lib.tagLines(meta, tag);
    if (op === 'comment' && ls.length > 2 && spec.level !== 'easy' && rng.bool(0.4)) {
      const k = rng.int(2, ls.length - 1);
      const s = rng.int(0, ls.length - k);
      ls = ls.slice(s, s + k);
    }
    if (spec.level === 'easy' && ls.length > 2 && op !== 'indent' && op !== 'outdent') ls = ls.slice(0, 2);
    const route = op === 'delete'
      ? lib.pickRoute(rng, opts, 'keys', ['drag', 'shift'], ['drag', 'shift', 'keys', 'kill'])
      : lib.pickRoute(rng, opts, 'keys', ['drag', 'shift'], ['drag', 'shift', 'keys']);
    return { kind: 'lines', op, a: ls[0], b: ls[ls.length - 1], route, what: tag };
  }

  env.scenario('use-text-editor', {
    name: 'multiline',
    sampleCode(rng, spec, meta, op, opts) { return goalLines(rng, spec, meta, op, opts); },
  });
})();
