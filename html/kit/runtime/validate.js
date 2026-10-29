/*
 * kit/runtime/validate.js: definition checks at registration. env.task(), env.scenario(), env.site() and env.widget()
 * (and a template widget or site once its template has been resolved) call these when the definition is registered, so
 * a missing key, a wrong type or a misspelled key fails at boot with the file and the problem named, instead of as
 * "x is not a function" in the middle of an episode. The key tables below are the contract of kit/env.js's header:
 * change one when the other changes.
 *
 *   task(def)              required: name, scenarios, startModes, sample, init, error, tolerance, instruction, plan,
 *                            solve; the optional hooks and flags are type-checked. A task is closed: what widgets
 *                            read from it goes under helpers, what its own files share under lib, and any other key
 *                            is an error (a near miss of a contract key names it: tolerence, Plan).
 *   scenario(task, def)     one env.scenario object: name (one of the task's scenarios, once), the hooks the
 *                            task contract names are type-checked, other members are the task's own.
 *   site(def)                required: name, and frame unless the site is built from a template; open like a
 *                            task (a site file may keep helper members), near misses throw. boot() checks the
 *                            site again once its template and scripts have filled it in (opts.resolved).
 *   widget(def)                a widget is closed: task, site, name, scenarios, render, locate are required and
 *                            only the keys of the widget contract are allowed (split is optional: manifest.json is
 *                            its source). A widget that names a template is checked twice: when registered it needs
 *                            task and template (name may be left to the template), and once the template is
 *                            resolved the whole object is checked (opts.resolved).
 *
 * Every check throws one Error: `<file>: env.<kind>(<name>): problem; problem`. The file is the running script
 * (document.currentScript) when there is one, else the conventional path of the definition.
 */
(function () {
  'use strict';
  const kit = (window.__megawobKit = window.__megawobKit || {});

  const START_MODES = ['off', 'partial', 'wrong', 'scene', 'solved'];
  const INPUT_KINDS = ['pointer', 'keyboard', 'wheel'];
  const JUDGE_MODES = ['ambiguous', 'impossible', 'confirm'];
  const SPLITS = ['train', 'heldout', 'test'];

  // Key tables: key -> type. 'a|b' is either; 'array<string>' an array of strings. Types: string, number, boolean,
  // function, object, array.
  const HOOKS = {
    sample: 'function', init: 'function', error: 'function', tolerance: 'function', instruction: 'function',
    plan: 'function', solve: 'function', tick: 'function', judged: 'function', ended: 'function',
    facts: 'function', parts: 'function', silent: 'function', retarget: 'function', answers: 'function',
    answered: 'function',
  };
  const TASK = {
    name: 'string', scenarios: 'array<string>', startModes: 'array<string>', uses: 'array<string>',
    files: 'array<string>', lib: 'object', helpers: 'object', inputs: 'function|array<string>', tickMs: 'number',
    judgeModes: 'array<string>', reply: 'boolean', faults: 'boolean|function', heldoutScenarios: 'array<string>', ...HOOKS,
  };
  const TASK_REQUIRED = ['name', 'scenarios', 'startModes', 'sample', 'init', 'error', 'tolerance', 'instruction',
    'plan', 'solve'];
  // What a scenario object may hold of the task contract (its name is the only required key).
  const SCENARIO = { name: 'string', inputs: TASK.inputs, judge: 'function', ...HOOKS };
  const SITE = {
    name: 'string', template: 'string', design: 'object', styles: 'array<string>', scripts: 'array<string>',
    langs: 'array<string>', frame: 'function', overlay: 'function', fault: 'function', hazard: 'function',
    notice: 'function', initialOverlay: 'object', pauseOnOverlay: 'boolean',
  };
  const WIDGET = {
    task: 'string', site: 'string', name: 'string', split: 'string', scenarios: 'array<string>',
    template: 'string', design: 'object', render: 'function', locate: 'function', traits: 'object',
    scrollable: 'boolean|function', uses: 'array', answerReply: 'boolean', clear: 'function',
  };
  const WIDGET_REQUIRED = ['task', 'site', 'name', 'scenarios', 'render', 'locate'];

  const kindOf = (v) => (Array.isArray(v) ? 'array' : v === null ? 'null' : typeof v);

  // Does value v have type spec t ('string', 'function|array<string>', ...)? 'array' without <> is any array.
  function isType(v, t) {
    return t.split('|').some((alt) => {
      const m = /^array<(\w+)>$/.exec(alt);
      if (m) return Array.isArray(v) && v.every((x) => kindOf(x) === m[1]);
      return kindOf(v) === alt;
    });
  }
  const describe = (t) => t.replace(/array<(\w+)>/g, 'array of $1s').split('|').join(' or ');

  // Edit distance with adjacent swaps counted as one.
  function editDistance(a, b) {
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
    return d[a.length][b.length];
  }
  // The contract key a misspelled key was probably meant to be: the same in another case, or one edit away on a
  // longer name.
  function nearMiss(key, names) {
    return names.find((n) => n !== key && (n.toLowerCase() === key.toLowerCase()
      || (n.length >= 5 && key.length >= 5 && editDistance(key, n) <= 1)));
  }

  // The running script's path below html/ (a definition registers while its file runs), or the fallback.
  function fileOf(fallback) {
    const src = document.currentScript && document.currentScript.src;
    const m = src && /\/((?:kit|tasks|sites|templates)\/[^?#]*)$/.exec(src);
    return m ? m[1] : fallback;
  }

  // Type-check the keys of def that the table names; closed: also flag every key the table lacks.
  function checkKeys(def, table, problems, { closed = false, names = Object.keys(table) } = {}) {
    for (const [k, v] of Object.entries(def)) {
      if (!Object.hasOwn(table, k)) {
        const near = nearMiss(k, names);
        if (near) problems.push(`unknown key '${k}' (did you mean '${near}'?)`);
        else if (closed) problems.push(`unknown key '${k}'`);
        continue;
      }
      if (v === undefined) continue;
      if (!isType(v, table[k])) problems.push(`'${k}' must be ${describe(table[k])}, not ${kindOf(v)}`);
    }
  }
  function checkRequired(def, keys, table, problems) {
    for (const k of keys) {
      if (def[k] === undefined) problems.push(`missing '${k}' (${describe(table[k])})`);
    }
  }
  function checkMembers(def, key, allowed, problems, { nonEmpty = false } = {}) {
    const v = def[key];
    if (!Array.isArray(v)) return;
    if (nonEmpty && !v.length) problems.push(`'${key}' is empty`);
    for (const x of v) if (allowed && !allowed.includes(x)) problems.push(`'${key}' has '${x}' (allowed: ${allowed.join(', ')})`);
    if (new Set(v).size !== v.length) problems.push(`'${key}' repeats a value`);
  }
  // The thrown error is marked so env.js's script loader can fail the boot with it (a throw inside a loaded
  // script is otherwise only a console message).
  function fail(where, problems) {
    if (!problems.length) return;
    throw Object.assign(new Error(`${where}: ${problems.join('; ')}`), { validation: true });
  }
  const label = (def, key = 'name') => (typeof def[key] === 'string' ? `'${def[key]}'` : '?');

  // The input kinds a task or scenario object lists.
  function checkInputs(def, problems) {
    if (Array.isArray(def.inputs)) checkMembers(def, 'inputs', INPUT_KINDS, problems);
  }

  function task(def) {
    const where = `${fileOf(`tasks/${def && def.name}/logic.js`)}: env.task(${label(def || {})})`;
    if (!def || typeof def !== 'object') throw new Error(`${where}: the definition must be an object`);
    const problems = [];
    checkRequired(def, TASK_REQUIRED, TASK, problems);
    checkKeys(def, TASK, problems, { closed: true });
    if (problems.some((p) => /^unknown key '[^']*'$/.test(p))) {
      problems.push('a task keeps what widgets read under helpers and what its own files share under lib');
    }
    if (typeof def.name === 'string' && !def.name) problems.push("'name' is empty");
    checkMembers(def, 'scenarios', null, problems, { nonEmpty: true });
    checkMembers(def, 'startModes', START_MODES, problems);
    checkMembers(def, 'judgeModes', JUDGE_MODES, problems);
    checkInputs(def, problems);
    if (Array.isArray(def.startModes) && !def.startModes.includes('off')) problems.push("'startModes' must include 'off'");
    for (const f of Array.isArray(def.files) ? def.files : []) {
      if (typeof f === 'string' && (!/^[\w-]+(\/[\w-]+)*\.js$/.test(f) || f === 'logic.js')) {
        problems.push(`'files' entry '${f}' must be a .js path below the task's folder (not logic.js)`);
      }
    }
    fail(where, problems);
  }

  // famDef: the registered task definition (its scenarios[] is what a scenario object may be named).
  function scenario(famDef, def) {
    const fam = famDef.name;
    const where = `${fileOf(`tasks/${fam}/scenarios/?.js`)}: env.scenario('${fam}', ${label(def || {})})`;
    if (!def || typeof def !== 'object') throw new Error(`${where}: the definition must be an object`);
    const problems = [];
    checkRequired(def, ['name'], SCENARIO, problems);
    checkKeys(def, SCENARIO, problems, { names: Object.keys(TASK) });
    checkInputs(def, problems);
    if (typeof def.name === 'string' && Array.isArray(famDef.scenarios) && !famDef.scenarios.includes(def.name)) {
      problems.push(`'${def.name}' is not one of the task's scenarios (${famDef.scenarios.join(', ')})`);
    }
    fail(where, problems);
  }

  // opts.resolved: a site built from a template, after the template filled it in.
  function site(def, opts = {}) {
    const where = `${fileOf(`sites/${def && def.name}/site.js`)}: env.site(${label(def || {})})`;
    if (!def || typeof def !== 'object') throw new Error(`${where}: the definition must be an object`);
    const problems = [];
    const templated = def.template !== undefined && !opts.resolved;
    checkRequired(def, templated ? ['name', 'template'] : ['name', 'frame'], SITE, problems);
    checkKeys(def, SITE, problems);
    if (typeof def.template === 'string' && !/^site\/[\w-]+$/.test(def.template)) {
      problems.push(`'template' must be 'site/<name>', not '${def.template}'`);
    }
    if (def.design !== undefined && def.template === undefined) problems.push("'design' needs a 'template'");
    const io = def.initialOverlay;
    if (io && typeof io === 'object') {
      if (typeof io.kind !== 'string') problems.push("'initialOverlay' needs a string 'kind'");
      for (const k of Object.keys(io)) {
        if (!['kind', 'p', 'at'].includes(k)) problems.push(`'initialOverlay' has unknown key '${k}' (kind, p, at)`);
        else if (k !== 'kind' && typeof io[k] !== 'number') problems.push(`'initialOverlay.${k}' must be a number`);
      }
      if (typeof def.overlay !== 'function' && !templated) problems.push("'initialOverlay' needs an overlay() function");
    }
    fail(where, problems);
  }

  // opts.resolved: a widget after its template was resolved (or one without a template): the whole contract.
  // famDef: the task's definition when registered; the widget's scenarios must be among its scenarios.
  function widget(def, opts = {}, famDef) {
    const d = def && typeof def === 'object' ? def : {};
    const nm = typeof d.name === 'string' ? d.name : d.template || '?';
    const where = `${fileOf(`sites/${d.site}/widgets/${d.task}.js`)}: env.widget(${d.task}/${nm})`;
    if (d !== def) throw new Error(`${where}: the definition must be an object`);
    const problems = [];
    const templated = def.template !== undefined && !opts.resolved;
    checkRequired(def, templated ? ['task', 'template'] : WIDGET_REQUIRED, WIDGET, problems);
    checkKeys(def, WIDGET, problems, { closed: true });
    if (def.design !== undefined && def.template === undefined) problems.push("'design' needs a 'template'");
    if (typeof def.template === 'string' && !/^[\w-]+\/[\w-]+$/.test(def.template)) {
      problems.push(`'template' must be '<task>/<name>', not '${def.template}'`);
    }
    if (def.design && typeof def.design === 'object' && def.design.parts !== undefined) {
      const p = def.design.parts;
      if (kindOf(p) !== 'object' || Object.values(p).some((f) => typeof f !== 'function')) {
        problems.push("'design.parts' must map part names to functions");
      }
    }
    if (typeof def.split === 'string' && !SPLITS.includes(def.split)) problems.push(`'split' must be train, heldout or test, not '${def.split}'`);
    checkMembers(def, 'scenarios', null, problems, { nonEmpty: true });
    if (famDef && Array.isArray(famDef.scenarios) && Array.isArray(def.scenarios)) {
      const bad = def.scenarios.filter((v) => !famDef.scenarios.includes(v));
      if (bad.length) problems.push(`'scenarios' has ${bad.join(', ')}, not among the task's (${famDef.scenarios.join(', ')})`);
    }
    // [file, ...] entries: the widget file to load first (a composite lists [task, widget], a vendor script its path)
    if (Array.isArray(def.uses) && !def.uses.every((u) => Array.isArray(u) && typeof u[0] === 'string' && u[0])) {
      problems.push("'uses' entries must be arrays that start with a widget file name");
    }
    fail(where, problems);
  }

  kit.validate = { task, scenario, site, widget };
})();
