/*
 * kit/runtime/score.js: scoring and episode endings. compute() is the score of the current model (pure); check()
 * records the 'layout' violation (a frozen anchor moved, or a page that does not scroll did) and runs before every
 * compute() that counts: in score() (so status(), stepClock() and reset() too), in end(), and in the oracle's
 * within-tolerance test. end() freezes the score as env.final. The trainer API's score / status / submit / finish /
 * flag delegate here.
 */
(function () {
  'use strict';
  const kit = (window.__megawobKit = window.__megawobKit || {});

  const { clamp } = kit.data;

  // An anchor's geometry key: viewport px, or document px on scrollable pages. A scrollable page may scroll in a
  // pane that holds the stage (an app shell of fixed height whose content pane scrolls): that pane's scroll counts
  // as page scroll too.
  function anchorKey(env, el) {
    const r = el.getBoundingClientRect();
    if (!env.episode || !env.episode.scrollable) return [r.left, r.top, r.width, r.height].map(Math.round).join(',');
    let x = window.scrollX;
    let y = window.scrollY;
    for (const pane of stagePanes(env)) {
      x += pane.scrollLeft;
      y += pane.scrollTop;
    }
    return [r.left + x, r.top + y, r.width, r.height].map(Math.round).join(',');
  }

  // The stage and its ancestors below <body> that are scrolled (scrollTop or scrollLeft set).
  function stagePanes(env) {
    const out = [];
    for (let e = env.stage; e && e !== document.body && e !== document.documentElement; e = e.parentElement) {
      if (e.scrollTop || e.scrollLeft) out.push(e);
    }
    return out;
  }

  // Frozen geometry: if the widget moved, the pixel-to-value mapping the agent saw is no longer valid. A moved
  // layout ends the episode at the next score().
  function check(env) {
    for (const [el, key] of env.anchors) if (anchorKey(env, el) !== key) env.flags.add('layout');
    if (!env.episode.scrollable && (window.scrollX || window.scrollY || document.scrollingElement?.scrollTop)) {
      env.flags.add('layout');
    }
  }

  function compute(env) {
    // answerIn=reply: the fields hold what the ending message gave ('' before it; kit/runtime/answer.js).
    const error = env.taskDef.error(kit.answer.model(env), env.spec);
    const judge = env.episode.judge;
    const judged = kit.judge.judged(env);
    const close = error <= env.tau + 1e-9;
    const within = close && judged;
    // The dense score is the Gaussian times progress, so ending where the episode started earns 0 whatever sigma
    // (an off start only needs error > 3 tau, where the Gaussian alone is still about 0.5). Progress is measured
    // against the start error, or tau for starts already within it (a solved start the agent then breaks).
    let base = within ? 1 : Math.exp(-0.5 * (error / env.sigma) ** 2);
    const gate = env.flags.size ? 0 : 1;
    const span = Math.max(env.error0, env.tau) || 1;
    let progress = !gate ? -1 : within ? 1 : clamp(1 - error / span, -1, 1);
    if (!within) base *= Math.max(0, progress);
    // Judge episodes succeed only when they end the way the mode wants (judge.judged).
    if (judge && !judged) ({ base, progress } = kit.judge.capScore(judge, base, progress, gate, close));
    let success = within && gate === 1;
    // Round-2 knobs that grade the ending (off: nothing below runs).
    const cancel = kit.preempt.graded(env, error);
    if (cancel) {
      // interruptions=cancel after the notice: only a message that leaves the page as it was counts.
      success = cancel.success && gate === 1;
      base = success ? 1 : 0;
      progress = !gate ? -1 : success ? 1 : cancel.still ? progress : -0.5;
    } else if (!judge && (env.endReason === 'finish' || env.endReason === 'infeasible')) {
      // report: the ending message must state the facts (fs = share stated); otherwise, where the goal carries the
      // reply format (kit/runtime/reply.js), an ending message needs status done.
      if (env.episode.report && kit.report.active(env)) {
        const fs = kit.report.share(env);
        success = success && fs >= 1 - 1e-9;
        base *= 0.5 + 0.5 * fs;
      } else if (kit.reply.inGoal(env) && (!kit.reply.read(env).ok || kit.reply.read(env).status !== 'done')) {
        success = false;
        base *= 0.5;
      }
    }
    return {
      error,
      tau: env.tau,
      sigma: env.sigma,
      base,
      gate,
      reward: base * gate,
      success,
      potential: -error / (env.tau || env.sigma), // unbounded; prefer progress for shaping
      progress,
      violations: [...env.flags],
    };
  }

  // End the episode: freeze the score (judge episodes are scored on how they ended, so endReason goes first).
  function end(env, reason) {
    env.endReason = reason;
    check(env);
    env.final = compute(env);
    env.done = true;
    env.log('end', { reason });
    env.render();
  }

  function score(env) {
    if (env.final) return env.final;
    check(env);
    const s = compute(env);
    if (s.violations.length) end(env, `violation:${s.violations[0]}`);
    return env.final || s;
  }

  function status(env) {
    const s = score(env);
    return {
      ready: env.ready,
      done: env.done,
      end_reason: env.endReason,
      success: env.done && s.success,
      reward_binary: env.done && s.success ? 1 : 0,
      reward_dense: env.done ? s.reward : 0,
      progress: s.progress,
      message: env.finishMessage,
      infeasible: env.finishInfeasible,
      score: s,
      rejected: { ...env.rejected },
      // Round-2 knobs: a new user message (preempt; the harness passes it to the agent once), the hazard the
      // agent fell for (safety), what the page did (fault, silent); null when off or not (yet) happened.
      notice: kit.preempt.notice(env),
      unsafe: kit.hazard.fell(env),
      fault: kit.fault.record(env),
      silent: kit.silent.record(env),
    };
  }

  function submit(env) {
    if (env.done) return;
    env.log('submit');
    end(env, 'submit');
  }

  // End without a page control (the agent's message to the user; report_infeasible sets info.infeasible).
  function finish(env, message, info = {}) {
    if (env.done) return;
    const msg = message === undefined || message === null ? '' : String(message);
    env.finishMessage = msg;
    env.finishInfeasible = !!(info && info.infeasible);
    env.log('finish', { ...(msg ? { message: msg.slice(0, 500) } : {}), ...(env.finishInfeasible ? { infeasible: true } : {}) });
    end(env, env.finishInfeasible ? 'infeasible' : 'finish');
  }

  // Page-layer process violation: ends the episode with reward 0.
  function flag(env, name, data = {}) {
    if (env.done) return;
    env.flags.add(name);
    env.log('flag', { name, ...data });
    end(env, `violation:${name}`);
  }

  kit.score = { anchorKey, check, compute, end, score, status, submit, finish, flag };
})();
