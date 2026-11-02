/*
 * use-data-grid / edit a ticket found by scrolling a window of DOM rows
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('use-data-grid');
  const { editInit, editInstruction, editPlan, editRetarget, editSolve, sampleAdmin, ticketError } = fam.lib;

  env.scenario('use-data-grid', {
    name: 'virtual',
    saves: true,
    windowed: true,
    inputs: ['pointer', 'keyboard', 'wheel'],
    sample(rng, opts) {
      return sampleAdmin(rng, opts);
    },
    init(spec, m, mode, rng) {
      return editInit(spec, m, mode, rng);
    },
    fresh(m) {
      m.edits = {};
      m.editing = null;
      m.virtualTop = 0;
      m.windowSize = 6;
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
