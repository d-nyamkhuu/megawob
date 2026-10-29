/*
 * use-file-manager / rangemix: a Shift run corrected with Ctrl-clicks, then one operation.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('use-file-manager');
  const { buildRange } = fam.lib;

  const V = env.scenariosOf('use-file-manager');

  env.scenario('use-file-manager', {
    name: 'rangemix',
    goal(rng, spec, tree) {
      return buildRange(rng, spec, tree, true);
    },
    instruction: V.range.instruction,
  });
})();
