/* type-text/scenarios/single.js: single scenario sampling. */
(function () {
  'use strict';

  const { words, cap, freeText, labelInfo, plainField } = env.taskOf('type-text').lib;

  env.scenario('type-text', {
    name: 'single',
    sample(g, spec) {
      const given = g.level === 'easy' ? g.rng.pick(words()) : g.level === 'medium' ? cap(g.rng.pick(words())) : freeText(g);
      spec.given = given;
      const info = labelInfo([], ['Text', 'Your answer', 'Entry', 'Response', 'Value', 'Input'], ['text field', 'box', 'input']);
      spec.title = g.rng.pick([
        'Quick entry', 'Text input', 'Enter text', 'Response form', 'Data entry', 'Note', 'Message field',
        'Your message', 'Form entry', 'Free text', 'Text box', 'Writing'
      ]);
      spec.fields = [plainField('text', g.rng.pick(info.labels), g.rng.pick([
        'Type here', 'Enter text', 'Start typing...', '', 'As shown', 'Your text'
      ]), given)];
    },
  });
})();
