/*
 * kit/runtime/knobs.js: randomization parameters (see the kit/env.js header for what each one means). One table row per knob,
 * in draw order; reset() calls episode() once per episode and passes sampleOpts() to the task's sample().
 *
 * Draws (changing them changes episodes for a seed):
 *   - stream 'shared': one stream, knobs/<task>, drawn in table order. Removing or reordering a shared row
 *     shifts every later one; a new knob gets an 'own' row instead.
 *   - stream 'own': its own stream, knob/<name>, so weights on one never move another knob's draw.
 *   - stream null: read from the param as is, no draw.
 * A knob draws only when its value has weights ('header:.5,panel:.5'); perturbAt draws unless perturbat is given.
 */
(function () {
  'use strict';
  const kit = (window.__megawobKit = window.__megawobKit || {});

  const truthy = (v) => v === true || v === '1' || v === 'true';
  // on/off knobs (report, silent): on, 1 or true.
  const on = (v) => v === 'on' || truthy(v);
  // lang knob values -> locale ids of env.content (UI_WORDS covers all of them).
  const LANG_LOCALES = { en: 'en-US', de: 'de-DE', fr: 'fr-FR', es: 'es-ES', pt: 'pt-BR', it: 'it-IT', nl: 'nl-NL',
    pl: 'pl-PL', ja: 'ja-JP', zh: 'zh-CN' };
  const LEVELS = ['easy', 'medium', 'normal'];
  const MESSY_MODES = ['off', 'terse', 'typo', 'chatter', 'mixed'];
  const ROUTES = ['pointer', 'keyboard', 'wheel'];
  const positive = (v, def) => (Number(v) > 0 ? Number(v) : def);

  // A knob value is either one option ('hidden') or weights ('header:.5,panel:.2,hidden:.3'); weights are
  // sampled with rng, so episodes stay seeded.
  function knob(rng, spec, fallback) {
    const s = spec === undefined || spec === null || spec === '' ? fallback : String(spec);
    if (!s.includes(':')) return s;
    const parts = s.split(',').map((p) => p.split(':')).map(([k, w]) => [k.trim(), Number(w)]).filter(([, w]) => w > 0);
    const total = parts.reduce((a, [, w]) => a + w, 0);
    let x = rng.next() * total;
    for (const [k, w] of parts) if ((x -= w) < 0) return k;
    return parts.length ? parts[parts.length - 1][0] : fallback;
  }

  // Public parameter names (URL params, reset opts; MEGAWOB_<NAME> in the harness) -> the names the kit uses
  // inside: the episode record, the opts sample() gets and the knob/<name> stream salts. The internal names are
  // refused as params, so a caller that uses one fails loudly instead of silently running with defaults.
  const PARAMS = { instructionDisplay: 'instr', finishByMessage: 'finish', startState: 'start', popups: 'perturb', difficulty: 'level', pageLanguage: 'lang', inputRoute: 'route', composition: 'compose', undeclaredInput: 'stray', answerIn: 'answer', judgment: 'judge', instructionNoise: 'messy', dragSteps: 'drag', pageFaults: 'fault', reportFacts: 'report', silentFailures: 'silent', interruptions: 'preempt', safetyHazards: 'safety', replyFormat: 'reply', cursorLag: 'cursorlag', deviceScale: 'dsf', instructionSplit: 'isplit', contentSplit: 'csplit', popupAt: 'perturbat' };
  const PUBLIC = Object.fromEntries(Object.entries(PARAMS).map(([k, v]) => [v, k]));
  // Reset opts or URL params in public names -> internal names.
  function fromParams(o) {
    const out = {};
    for (const [k, v] of Object.entries(o)) {
      if (Object.hasOwn(PARAMS, k)) out[PARAMS[k]] = v;
      else if (Object.hasOwn(PUBLIC, k)) {
        if (v !== undefined) throw new Error(`parameter '${k}' is internal; use '${PUBLIC[k]}'`);
      } else out[k] = v;
    }
    return out;
  }

  // key: episode field; param: internal param (default key; the public name is in PARAMS); def: default value; value(v, c): the
  // recorded value (c = {fam, site, widget, content}); draw(rng, o, c): a custom draw.
  const TABLE = [
    { key: 'start', stream: 'shared', def: 'off',
      value: (v, c) => (c.fam.startModes.includes(v) || v === 'off' ? v : 'off') },
    { key: 'perturb', stream: 'shared', def: 'off',
      value: (v, c) => (kit.overlay.KINDS.includes(v) && c.site.overlay ? v : null) },
    { key: 'instr', stream: 'shared', def: 'header:.5,panel:.2,toast:.1,hidden:.2' },
    { key: 'finish', stream: 'shared', def: '0', value: truthy },
    { key: 'perturbAt', stream: 'shared',
      draw: (rng, o) => (o.perturbat !== undefined ? Number(o.perturbat) : rng.int(0, 3)) },
    { key: 'isplit', stream: null, value: (v) => v || 'train' },
    { key: 'csplit', stream: null, value: (v) => v || 'train' },
    { key: 'ood', stream: null, value: truthy },
    { key: 'recover', stream: null, value: (v) => (v !== undefined && v !== '' ? truthy(v) : null) },
    // Forced routes reach only the base site (design-* widgets may lack a keyboard / wheel path).
    { key: 'route', stream: 'shared', def: '',
      value: (v, c) => (ROUTES.includes(v) && c.site.name === 'base' ? v : null) },
    { key: 'compose', stream: 'shared', def: 'train', value: (v) => (v === 'heldout' ? 'heldout' : 'train') },
    { key: 'stray', stream: 'shared', def: 'reject', value: (v) => (v === 'void' ? 'void' : 'reject') },
    // Chrome language: only sites that list it in langs render it; others record 'en'.
    { key: 'lang', stream: 'shared', def: 'en',
      value: (v, c) => (v in LANG_LOCALES && (c.site.langs || ['en']).includes(v) ? v : 'en') },
    // Screenshot scale the harness applies (megawob/tasks.py passes dsf); recorded only.
    { key: 'dsf', stream: null, value: (v) => positive(v, 1) },
    { key: 'level', stream: 'own', def: 'normal', value: (v) => (LEVELS.includes(v) ? v : 'normal') },
    // judge: only modes the task declares in judgeModes; the task must also build it (spec.judge).
    { key: 'judge', stream: 'own', def: 'off', value: (v, c) => kit.judge.mode(v, c.fam) },
    { key: 'messy', stream: 'own', def: 'off', value: (v) => (MESSY_MODES.includes(v) ? v : 'off') },
    { key: 'drag', stream: 'own', def: 'atomic', value: (v) => (v === 'split' ? 'split' : 'atomic') },
    { key: 'clock', stream: null, value: (v) => (['real', 'action'].includes(v) ? v : 'step') },
    { key: 'stepMs', param: 'stepms', stream: 'own', def: '1000', value: (v) => positive(v, 1000) },
    { key: 'timescale', stream: 'own', def: '1', value: (v) => positive(v, 1) },
    // Round 2 (kit/runtime/fault.js, report.js, preempt.js, silent.js, hazard.js): own streams, off by default.
    { key: 'fault', stream: 'own', def: 'off', value: (v, c) => kit.fault.gate(v, c) },
    { key: 'report', stream: 'own', def: 'off', value: (v, c) => kit.report.gate(v, c) },
    { key: 'preempt', stream: 'own', def: 'off', value: (v, c) => kit.preempt.gate(v, c) },
    { key: 'silent', stream: 'own', def: 'off', value: (v, c) => kit.silent.gate(v, c) },
    // safetyHazards=on picks a kind from the same stream.
    { key: 'safety', stream: 'own', draw: (r, o, c) => kit.hazard.gate(knob(r, o.safety, 'off'), c, r) },
    // How an ending message is graded (kit/runtime/reply.js): auto (structured in tasks with reply: true, free
    // text elsewhere), structured (a drawn reply format everywhere) or free text.
    { key: 'reply', stream: 'own', def: 'auto', value: (v) => (v === 'free' || v === 'structured' ? v : 'auto') },
    // answerIn=reply (kit/runtime/answer.js): the answer goes in the ending message, not a field (tasks with
    // answers() / answered(), widgets with answerReply: true); reset() keeps it only where sample() built it.
    { key: 'answer', stream: 'own', def: 'field', value: (v, c) => kit.answer.gate(v, c) },
  ];
  // Order of the fields in the episode record (state().episode), kept as it was before the table.
  const ORDER = ['instr', 'finish', 'start', 'perturb', 'perturbAt', 'isplit', 'csplit', 'ood', 'recover',
    'scrollable', 'route', 'compose', 'stray', 'lang', 'locale', 'dsf', 'level', 'judge', 'messy', 'drag',
    'clock', 'stepMs', 'timescale', 'fault', 'report', 'preempt', 'silent', 'safety', 'reply', 'answer'];

  // The episode record for opts o, drawn from the episode rng. scrollable is filled in by reset() after
  // sampling, and judge is replaced by what the task built (judge.episodeMode).
  function episode(rng, o, c) {
    const shared = rng.fork(`knobs/${kit.salt(c.fam.name)}`);
    const got = { scrollable: false };
    for (const row of TABLE) {
      const param = row.param || row.key.toLowerCase();
      const r = row.stream === 'shared' ? shared : row.stream === 'own' ? rng.fork(`knob/${param}`) : null;
      if (row.draw) got[row.key] = row.draw(r, o, c);
      else {
        const v = r ? knob(r, o[param], row.def) : o[param];
        got[row.key] = row.value ? row.value(v, c) : v;
      }
    }
    got.locale = LANG_LOCALES[got.lang];
    if (got.report) got.finish = true; // the report is the ending: no page end control
    return Object.fromEntries(ORDER.map((k) => [k, got[k]]));
  }

  // What sample() gets: the reset opts plus the knobs the task reads.
  function sampleOpts(ep, o, scenarios, traits) {
    return { ...o, scenarios, traits, stepMs: ep.stepMs, startMode: ep.start, isplit: ep.isplit, csplit: ep.csplit,
      ood: ep.ood, recover: ep.recover, route: ep.route || undefined, compose: ep.compose, lang: ep.lang,
      level: ep.level, judge: ep.judge || undefined, drag: ep.drag,
      // Round-2 knobs: undefined when off, so sampling (and every spec) is unchanged.
      fault: ep.fault || undefined, report: ep.report || undefined, preempt: ep.preempt || undefined,
      silent: ep.silent || undefined, safety: ep.safety || undefined, answer: ep.answer || undefined };
  }

  kit.knobs = { knob, truthy, on, LANG_LOCALES, TABLE, PARAMS, fromParams, episode, sampleOpts };
})();
