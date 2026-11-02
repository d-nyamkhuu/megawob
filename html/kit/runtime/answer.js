/*
 * kit/runtime/answer.js: answer-by-message episodes (knob answer = reply). The agent looks the answer up as usual
 * but states it in its ending message (BrowserGym send_msg_to_user, the finish route) instead of typing it into a
 * field: the widget draws no answer field, finish mode is forced and the goal text asks for a reply.
 * Applies where the task has answers(spec) -> [{ label, labels?, value }] (one entry per asked field: label the
 * name the goal uses, labels other names of it, value the expected answer as the oracle states it; [] or null for a
 * scenario with nothing typed) and answered(model, spec, values) -> model (the model with those fields set to the
 * strings given, '' for none), and the widget declares answerReply: true (it can draw the page without the field).
 * sample() gets opts.answer = 'reply' and records spec.answerBy = 'reply' where it builds one (not in judge
 * episodes); reset() keeps the knob only then (episodeMode).
 * Grading: every score reads the task's error() on answered(model, spec, values): before the episode ends the
 * values are '' (what the page model holds in its fields never counts, so progress comes from the navigation
 * alone); a finish fills them from the message, so typed-answer partial credit carries over. Values come from:
 *   structured reply (kit/runtime/reply.js)  status done, and each field's fact given once under its label (or a
 *                                            labels entry); anything else leaves the field ''
 *   free text                                bounded by the requested answer and report fields (freeLimit);
 *                                            a field's value is the text
 *                                            after "<label>:" in the one clause (split at ; and line ends, and at
 *                                            ", " when another "<label>:" follows) that starts with its label; with
 *                                            one field and no such clause, the whole message (trimmed, enclosing
 *                                            quotes dropped) is the value. A closing period is read both ways (the
 *                                            better counts: "Co." vs "5."). A label given twice counts as none, so a
 *                                            reply cannot carry a list of guesses.
 * reset() appends "Reply with just the <label>." (one field, free text), "Reply with <labels>, each as 'name:
 * value'." (several fields, free text) or "Reply with the <labels>." (structured; the format text follows) to the
 * goal. The oracle navigates with the task's plan() (which ends with { finish: true } where it would type) and
 * finishes with every field's value (and the report facts, if any). interruptions=cancel replaces the ending.
 */
(function () {
  'use strict';
  const kit = (window.__megawobKit = window.__megawobKit || {});

  const has = (fam) => typeof (fam && fam.answers) === 'function' && typeof fam.answered === 'function';
  // The knob value (c = { fam, site, widget }): reply where the task and the widget support it, else null.
  const gate = (v, c) => (v === 'reply' && has(c.fam) && !!(c.widget && c.widget.answerReply) ? 'reply' : null);

  const fields = (fam, spec) => {
    const list = has(fam) ? fam.answers(spec) : null;
    return Array.isArray(list) ? list.filter((f) => f && f.label !== undefined && f.value !== undefined) : [];
  };
  // The episode's mode once the spec is sampled: reply only where the task built one.
  const episodeMode = (ep, fam, spec) => (ep.answer === 'reply' && spec && spec.answerBy === 'reply' && !spec.judge
    && fields(fam, spec).length ? 'reply' : null);
  const active = (env) => env.episode && env.episode.answer === 'reply';

  const TEMPLATES = {
    one: ['Reply with just the {labels}.', 'Send me only the {labels} in your reply.', 'Answer with just the {labels}.',
      'Tell me the {labels} in your reply, and nothing else.'],
    many: ["Reply with the {labels}, each as 'name: value'.",
      "Send them in your reply, one 'name: value' each: {labels}.", "Answer with {labels}, each written as 'name: value'."],
    structured: ['Reply with the {labels}.', 'Send me the {labels} in your reply.', 'Tell me the {labels} in your reply.'],
  };
  const { listText } = kit.data;

  // The goal-text suffix.
  function suffix(env, rng) {
    const list = fields(env.taskDef, env.spec);
    const labels = listText(list.map((f) => String(f.label)));
    const set = kit.reply.structured(env) ? TEMPLATES.structured : list.length > 1 ? TEMPLATES.many : TEMPLATES.one;
    return env.instruct && env.instruct.phrase ? env.instruct.phrase(rng, set, { labels }, env.episode.isplit)
      : set[0].replace('{labels}', labels);
  }

  const cut = (v, keep) => (keep ? v : v.replace(/\.$/, ''));
  const isLabel = (f, text) => [f.label, ...(f.labels || [])].some((l) => kit.reply.sameName(text, l));

  // Each field's value from the ending message ('' when not given); free text drops a closing period unless keep.
  function values(env, keep = false) {
    const list = fields(env.taskDef, env.spec);
    const blank = list.map(() => '');
    if (env.endReason !== 'finish' && env.endReason !== 'infeasible') return blank;
    if (kit.preempt.pending(env)) return blank;
    const msg = String(env.finishMessage || '');
    if (kit.reply.structured(env)) {
      const reply = kit.reply.read(env);
      if (!reply.ok || reply.status !== 'done') return blank;
      return list.map((f) => {
        const given = reply.facts.filter(([n]) => n !== null && isLabel(f, n));
        return given.length === 1 && given[0][1] !== null ? String(given[0][1]).trim() : '';
      });
    }
    const report = kit.report.active(env) ? kit.report.facts(env) : [];
    if (msg.length > kit.reply.freeLimit([...list, ...report])) return blank;
    // Clauses: split at ; and line ends, and at a comma when a field's "<label>:" follows it (values may hold commas).
    const startsLabel = (s) => { const m = /^\s*([^:,]{1,60}):/.exec(s); return !!m && list.some((f) => isLabel(f, m[1])); };
    const clauses = msg.split(/[;\n]/).flatMap((c) => {
      const parts = [];
      let rest = c;
      for (let i = rest.indexOf(', '); i >= 0; i = rest.indexOf(', ', i + 1)) {
        if (startsLabel(rest.slice(i + 2))) { parts.push(rest.slice(0, i)); rest = rest.slice(i + 2); i = -1; }
      }
      return [...parts, rest];
    }).map((c) => c.trim()).filter(Boolean);
    const out = list.map((f) => {
      const hits = clauses.map((c) => /^([^:]{1,60}):\s*(.*)$/.exec(c)).filter((m) => m && isLabel(f, m[1]));
      return hits.length === 1 ? cut(hits[0][2].trim(), keep) : null;
    });
    if (list.length === 1 && out[0] === null) {
      out[0] = cut(msg.trim(), keep).replace(/^(["'`“‘])(.*)(["'`”’])$/, '$2').trim();
    }
    return out.map((v) => v || '');
  }

  // The model the episode is graded on. Free text is read with and without a closing period ("Harbor Supply Co.");
  // the better of the two counts.
  function model(env) {
    if (!active(env)) return env.model;
    const fam = env.taskDef;
    const v = values(env);
    const m = fam.answered(env.model, env.spec, v);
    if (kit.reply.structured(env)) return m;
    // An answer clause can end in a literal period even when report facts follow it in the message.
    const kept = values(env, true);
    if (kept.every((x, i) => x === v[i])) return m;
    const k = fam.answered(env.model, env.spec, kept);
    return fam.error(k, env.spec) < fam.error(m, env.spec) ? k : m;
  }
  // The error of a model under a spec (default the episode's), as scored: answerIn=reply episodes grade the fields
  // as the ending message fills them ('' while the episode runs). The step watchers and preempt use it.
  function errorOf(env, m = env.model, spec = env.spec) {
    const fam = env.taskDef;
    if (!active(env)) return fam.error(m, spec);
    if (m === env.model && spec === env.spec) return fam.error(model(env), spec);
    return fam.error(fam.answered(m, spec, fields(fam, spec).map(() => '')), spec);
  }
  // The facts the oracle states: [name, value] per field.
  const facts = (env) => fields(env.taskDef, env.spec).map((f) => [String(f.label), String(f.value)]);
  // Free text with one field and nothing else to say: the bare value.
  const message = (env, more = []) => {
    const all = [...facts(env), ...more];
    if (!kit.reply.structured(env) && all.length === 1) return all[0][1];
    if (!kit.reply.structured(env)) return all.map(([n, v]) => `${n}: ${v}`).join('; ');
    return kit.reply.format(env, { status: 'done', facts: all });
  };

  kit.answer = { gate, fields, episodeMode, active, TEMPLATES, suffix, values, model, errorOf, facts, message };
})();
