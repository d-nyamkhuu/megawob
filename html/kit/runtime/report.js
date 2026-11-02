/*
 * kit/runtime/report.js: report-back episodes (knob report = on; E9). The episode ends with a message to the user
 * (finish mode is forced) that must state a few facts about the result the agent has to read off the page.
 * Only for tasks with facts(model, spec) -> [{ label, value, aliases?, labels? }] (kit/env.js header, task
 * contract): aliases are other spellings of the value, labels other names of the fact (never values).
 * reset() appends "When done, reply with a short summary including: <labels>" to the goal text (labels from
 * facts() of the start model); facts are computed again from the final model when graded.
 * Grading (score.js) reads the structured reply (kit/runtime/reply.js): status done, and fs = the share of facts
 * given exactly once under their label (or a labels entry) with a value equal to the value or an alias (numbers
 * compare as numbers, text word by word); success needs error <= tau and fs = 1, and the dense base is multiplied
 * by 0.5 + 0.5 fs. The oracle replies status done with every fact. Report is off in judge episodes.
 */
(function () {
  'use strict';
  const kit = (window.__megawobKit = window.__megawobKit || {});

  const gate = (v, c) => kit.knobs.on(v) && typeof c.fam.facts === 'function';

  const TEMPLATES = [
    'When done, reply with a short summary including: {labels}.',
    'When you are done, reply with a short summary that includes: {labels}.',
    'Afterwards, send me a short summary with: {labels}.',
    'Once finished, tell me in a short reply: {labels}.',
    'Then reply with a quick summary including {labels}.',
  ];

  const facts = (env) => {
    const list = env.taskDef.facts(env.model, env.spec);
    return Array.isArray(list) ? list.filter((f) => f && f.label !== undefined && f.value !== undefined) : [];
  };

  const { listText } = kit.data;

  // The goal-text suffix (reset() appends it after the messy knob, so the request itself stays readable).
  function suffix(env, rng) {
    const labels = facts(env).map((f) => String(f.label));
    if (!labels.length) return '';
    const t = env.instruct && env.instruct.phrase
      ? env.instruct.phrase(rng, TEMPLATES, { labels: listText(labels) }, env.episode.isplit)
      : TEMPLATES[0].replace('{labels}', listText(labels));
    return t;
  }

  // Share of facts the ending message states (structured: 0 unless its status is done; 1 when the task lists none).
  function share(env) {
    const list = facts(env);
    if (!kit.reply.structured(env)) return list.length ? kit.reply.freeShare(list, env.finishMessage,
      kit.answer.active(env) ? kit.answer.fields(env.taskDef, env.spec) : []) : 1; // replyFormat=free
    const reply = kit.reply.read(env);
    if (!reply.ok || reply.status !== 'done') return 0;
    if (!list.length) return 1;
    const R = kit.reply;
    const said = list.filter((f) => {
      const names = [f.label, ...(f.labels || [])];
      const given = reply.facts.filter(([n]) => n !== null && names.some((l) => R.sameName(n, l)));
      return given.length === 1 && given[0][1] !== null && [f.value, ...(f.aliases || [])].some((v) => R.sameValue(given[0][1], v));
    });
    return said.length / list.length;
  }

  // Report grading applies (knob on, not superseded by a preempt cancel).
  const active = (env) => !!(env.episode.report && !kit.preempt.pending(env));

  // The oracle's finish message.
  const message = (env) => kit.reply.format(env, { status: 'done', facts: facts(env).map((f) => [String(f.label), String(f.value)]) });

  kit.report = { gate, TEMPLATES, facts, suffix, share, active, message };
})();
