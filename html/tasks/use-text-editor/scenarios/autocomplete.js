/* use-text-editor/autocomplete: goal sampling for the autocomplete scenario. */
(function () {
  'use strict';
  const { lib } = env.taskOf('use-text-editor');

  function goalComplete(rng, spec, meta) {
    const text = spec.base;
    const nm = meta.names;
    const l = rng.pick([lib.tagLines(meta, 'stmt')[0], lib.tagLines(meta, 'stmt')[1]]);
    const ls = lib.linesOf(text);
    const ind = ls[l].slice(0, lib.leadWs(ls[l]));
    const v = rng.pick(['prev', 'copy', 'last', 'orig']);
    const s1 = spec.lang === 'py' ? `${v} = ${nm.n}` : `let ${v} = ${nm.n}`;
    const s2 = `${nm.h2}(${v})`;
    // Every character is one key press: two lines only while they fit the action budget.
    const stmts = spec.level === 'easy' || s1.length + s2.length > 26 ? [s1] : [s1, s2];
    const at = lib.offOf(text, l, ls[l].length);
    return { kind: 'insert', at, text: stmts.map((s) => `\n${ind}${s}`).join(''), ref: { by: 'after-line', line: l, stmts } };
  }

  env.scenario('use-text-editor', {
    name: 'autocomplete',
    sampleCode: goalComplete,
  });
})();
