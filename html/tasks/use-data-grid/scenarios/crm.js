/*
 * use-data-grid / edit one ticket cell in a CRM, keeping every other record
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('use-data-grid');
  const { editInit, editInstruction, editPlan, editRetarget, editSolve, sampleAdmin, ticketError } = fam.lib;

  env.scenario('use-data-grid', {
    name: 'crm',
    saves: true,
    inputs: ['pointer', 'keyboard'],
    sample(rng, opts) {
      return sampleAdmin(rng, opts);
    },
    init(spec, m, mode, rng) {
      return editInit(spec, m, mode, rng);
    },
    fresh(m) {
      m.edits = {};
      m.editing = null;
    },
    solve(spec, m) {
      return editSolve(spec, m);
    },
    tolerance() {
      return { tau: 0, sigma: 0.6, minInitialError: 0.01 };
    },
    error(m, spec) {
      return ticketError(m, spec);
    },
    plan(m, spec) {
      return editPlan(m, spec);
    },
    instruction(spec, rng) {
      return editInstruction(spec, rng);
    },
    retarget(s, spec, model) {
      return editRetarget(s, spec, model);
    },
  });
})();
