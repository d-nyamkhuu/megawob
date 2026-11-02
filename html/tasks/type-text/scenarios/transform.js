/* type-text/scenarios/transform.js: transform scenario sampling. */
(function () {
  'use strict';

  const { SUBS, transformSource, transform, plainField } = env.taskOf('type-text').lib;

  env.scenario('type-text', {
    name: 'transform',
    sample(g, spec) {
      spec.rule = g.rng.pick(g.level === 'easy' ? ['upper', 'lower'] : g.level === 'medium' ? ['upper', 'lower', 'title'] : ['upper', 'lower', 'title', 'sub']);
      if (spec.rule === 'sub') spec.sub = g.rng.pick(SUBS);
      let given;
      let target;
      for (let k = 0; k < 20; k++) {
        given = transformSource(g, spec.rule, spec.sub);
        target = transform(given, spec.rule, spec.sub);
        if (target !== given) break;
      }
      spec.given = given;
      spec.title = g.rng.pick([
        'Quick entry', 'Text input', 'Enter text', 'Response form', 'Data entry', 'Label maker', 'Response box',
        'Answer form', 'Text answer', 'Form entry', 'Text field', 'Entry window'
      ]);
      spec.fields = [plainField('text', g.rng.pick([
        'Text', 'Your answer', 'Entry', 'Response', 'Value', 'Input', 'Note', 'Phrase', 'Details', 'Message',
        'Comment', 'Remarks'
      ]),
        g.rng.pick([
          'Type here', 'Enter text', 'Start typing...', '', 'Type it', 'Add text', 'Type away', 'Write here'
        ]), target)];
    },
  });
})();
