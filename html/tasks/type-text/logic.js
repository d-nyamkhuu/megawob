/*
 * type-text: type given text into labeled text fields.
 * MiniWoB counterparts: enter-text, enter-text-2, enter-text-dynamic, enter-password, login-user,
 * text-transform (plus real-world form patterns MiniWoB lacks: validation errors, masks, counters,
 * multi-line text, copying one field into another, disabled look-alikes, Enter-to-save, Tab order).
 *
 * scenarios
 *   single          one field; type the given string exactly
 *   transform       one field; type the given string transformed by a stated rule: upper case, lower case,
 *                   title case, or a substitution (spaces -> "_" / "-", spaces removed, "-" -> "/" or ".")
 *   password        "password" + "confirm password" fields (masked); both must equal the given password
 *   login           username/email + password (masked) and an in-app "Sign in" button: the credentials must
 *                   be right and signed in (spec.save). A wrong sign-in shows "Incorrect username or
 *                   password" and does not count.
 *   multi           3-5 labeled fields (8-10 with ood: the page then scrolls); the instruction lists
 *                   label -> value pairs in another order than the form, often naming a field by an alias
 *                   ("surname" for "Last name"). Field kinds include locale-formatted values (dates,
 *                   phones, postcodes, amounts), input masks (phone, card number: type digits, the mask adds
 *                   the separators), maxlength fields with a character counter, 0-2 blank fields that must
 *                   stay empty and 0-2 disabled look-alike fields (decoys, unscored). Half the forms have an
 *                   in-app Save button that must be used (spec.save).
 *   textarea        a multi-line <textarea> (address, list, delivery notes), sometimes with a counter and a
 *                   one-line companion field; the instruction gives the lines in order
 *   copy            copy the value of field A (already on the page, possibly multi-line) into field B
 *                   ("billing address = shipping address", "confirm email"); the value is not in the
 *                   instruction. Sometimes one more field from the instruction.
 *   validation-fix  the form was saved with one invalid field: every field is filled, one shows an inline
 *                   error ("Email addresses can't contain spaces", "Use capital letters", "Enter the date as
 *                   DD.MM.YYYY", "Use digits only"); correct that field (the fix follows from the message and
 *                   the value) and press the in-app Save/Update button (or Enter) so it saves. The
 *                   instruction never quotes the label: either it names nothing ("fix the field that's
 *                   wrong", spec.nameBy 'error': exactly one field is visibly invalid) or it names the field
 *                   by its kind ("fix the date field", "the email address is wrong", spec.nameBy 'kind';
 *                   the kind word fits no other field of the form).
 *   sections        a settings page whose 5-11 fields are split over 2-4 tabs or collapsible sections
 *                   (spec.sections, spec.panes 'tabs' | 'accordion'); every field holds the account's current
 *                   value and 1-3 must change (some may start empty). At least one asked field sits on a
 *                   non-default tab/section, so the agent opens it first; the rest must stay as they are.
 *                   The open tab/section is UI state in model.section (unscored).
 *   complete        "finish the form": a partly filled form whose blank required fields must be filled from
 *                   page-visible data, a profile card next to the form (spec.source 'card') or the full
 *                   record given in the instruction (spec.source 'instruction'); the instruction never says
 *                   which fields are missing. Optional fields (marked, no data anywhere) stay empty; the
 *                   prefilled fields already match the record. Wrong starts hold a near-miss value in a
 *                   missing field and then the instruction asks for the form to match the record.
 *
 * spec   { scenario, isplit, csplit, startMode, ood, title, locale,
 *          fields: [{ id, kind, label, aliases[], placeholder, type: 'text' | 'password' | 'textarea',
 *                     target, say (how the instruction writes the value), blank, disabled,
 *                     check (validator: 'email' | 'name' | 'digits' | 'upper' | 'nospace' | 'phone' |
 *                            'card' | 'date:<FMT>' | null), mask?, maxLength?, counter?, rows?,
 *                     section? (index into spec.sections), from? (sections: the current value at start),
 *                     required? (complete: marked required) }],
 *          ask: [id, ...] (instruction order), given, password, rule, sub ({ from, to, text }),
 *          save (bool: an in-app save button whose success counts), saveLabel, enter (bool: the oracle
 *          saves with Enter from a field), route ('click' | 'tab': the oracle moves between fields with Tab),
 *          invalid ({ id, how, message, bad, say } validation-fix; say = the kind word), nameBy
 *          (validation-fix: 'error' | 'kind'), copy ({ from, to } copy), long (bool: the widget scrolls the page),
 *          sections ([{ title, ids[] }] sections), panes ('tabs' | 'accordion' sections),
 *          source ('card' | 'instruction' complete), profile ({ title, rows: [{ label, value, id | null }] }
 *          complete: the record; rows with id null are facts without a form field) }
 *        fields are in form order; blank fields have target '' and must stay empty; disabled fields are
 *        decoys with a fixed value and are not scored.
 * model  { fields: { fieldId: string }, saved: bool, errors: { fieldId | '_form': message }, focus: id | null,
 *          section? (sections: index of the open tab / expanded section, null when all are collapsed) }
 *        errors = what the last save attempt reported (UI state; validation-fix starts with the invalid
 *        field's message); focus = the focused field (mirrored by the widget; the Tab route reads it);
 *        section = mirrored by the widget (starts at 0). None of these are scored.
 * error  mean over scored fields of the normalized Levenshtein distance between the value and the target
 *        (trimmed; textareas compare trimmed non-empty lines), a blank field counts 1 if non-empty; with
 *        spec.save the "not saved" state counts as one more wrong field: (sum + (saved ? 0 : 1)) / (n + 1).
 *        Editing any field after a save clears saved (dirty form).
 * tau    0 (exact after trimming); sigma 0.15
 *
 * levels (normal is the task as above): easy = one short word (single), upper / lower only on 1-2 words
 *              (transform), an 8-9 character lower-case + digit password, 2 fields (multi, validation-fix, no extras
 *              or decoys), 2 textarea lines, 2 sections with 1 change, 3 fields with 1 missing (complete), no extra
 *              ask on copy; medium = in between (3 fields, 3 lines, 3 sections, 4 fields with 2 missing ...).
 *
 * judge modes (judgeModes; every scenario supports all three; spec.judge = { mode, message, ... }): ambiguous and
 *              impossible start on the solved form (every field at its target, saved when spec.save) and the
 *              instruction is a one-line change request:
 *   ambiguous  two candidate values for one field (a normal-sounding request giving both: "Fill the phone field with A or
 *              B"; the page keeps its layout); the reply asks (status ask), one option per value (cands: [[A], [B]];
 *              others: the form's other labels and values and its title). A pick without a forced scenario leaves out
 *              the one-field forms (single, transform), where nothing but the instruction is on the page
 *   impossible "Set the fax number to X" for a field the form does not have; status impossible, what names the field
 *              (spec.judge.what)
 *   confirm    the normal task plus "but check with me before you press <Save>" (forms with a save / sign-in button,
 *              spec.save) or "... before you submit" (the kit's end control, whose ending the kit caps); judged() only checks the form
 *              was not saved;
 *              tolerance() lets the filled but unsaved form count as there; the widget flags 'irreversible' when the
 *              save / sign-in button is pressed
 *
 * optional hooks (contract the html/kit/env.js header; pure, no DOM; called only by their knobs):
 *   parts(model, spec)            preempt=cancel: each field by its label with the value typed (disabled look-alikes too)
 *   facts(model, spec)            2-4 things the page shows once the form is done and a person would report: the
 *                                 character counter of a limited field ("Display name characters: 12/20"), what a copy
 *                                 scenario copied, the values read off the profile card (complete), a password's length,
 *                                 else the asked fields as shown (always at least two: "Characters typed" tops it up)
 *   silent(next, prev, spec, rng) a just-correct field comes back wrong though the page still looks saved: text cut off
 *                                 (a textarea loses its last line or its end), the untransformed text, a date a day
 *                                 earlier, an amount rounded down to whole units; only values that still pass the
 *                                 field's own validation
 *   retarget(spec, model, rng)    a different goal in the same form: another text (single, transform), password or login,
 *                                 one more value for a multi / sections / copy field or a textarea line; null for
 *                                 validation-fix, complete and judge episodes
 *
 * start modes  off (empty fields; validation-fix: the rejected form; sections: current values), partial
 *              (some fields done or a value half typed; validation-fix: fixed but not saved), wrong
 *              (plausible wrong values prefilled: near misses, stale entries, the untransformed text, a wrong
 *              fix), solved.
 *
 * input route  opts.route (episode knob): 'keyboard' sets spec.route 'tab' where the scenario has a Tab route
 *              (password, login, multi, sections, complete) and spec.enter where it saves with Enter (login,
 *              multi, copy into a one-line field, validation-fix, sections, complete; only when spec.save);
 *              'pointer' sets route 'click' and enter false; undefined keeps the sampled mix. The override is
 *              applied after all draws, so it never changes a seed's content.
 *
 * plan targets: { field: id }      the centre of that field's input
 *               { save: true }     the in-app save / sign-in button
 *               { section: k }     sections: the tab / section header k
 * plan steps:   { click: { section: k } } when the first wrong field sits in a closed tab/section;
 *               { type: [{ field: id }, text] } for the first wrong field in form order ('' empties a blank
 *               field); { key: 'Tab' } first when spec.route is 'tab' and the previous field (same section)
 *               has focus; then { click: { save: true } } or { key: 'Enter' } (spec.enter, focus in a
 *               one-line field).
 * Helpers (widget API, env.taskDef.helpers):
 *   validate(spec, values)       field and sign-in validation errors, keyed by field id
 *   countOf(field, value)        Unicode character count for the widget's field counters
 *
 * Internal shared code is on lib; scenario samplers are in scenarios/*.js.
 * The task's checks live in selftest.js, loaded only by the checker and node tests.
 *
 * Widgets without traits (the design-* design widgets) see unchanged spec/model/plan semantics for single,
 * transform, password, login and multi; the new scenarios and spec fields only appear in widgets that list them.
 *
 * Deviations from MiniWoB: instructions never mention the end control; login requires the in-app sign-in.
 */
(function () {
  'use strict';

  const lib = {};

  env.task({
    name: 'type-text',
    files: [
      'fields.js', 'sampling.js', 'hooks.js', 'judge.js', 'instruction.js',
      'scenarios/single.js', 'scenarios/transform.js', 'scenarios/password.js', 'scenarios/login.js',
      'scenarios/multi.js', 'scenarios/textarea.js', 'scenarios/copy.js', 'scenarios/validation-fix.js',
      'scenarios/sections.js', 'scenarios/complete.js',
    ],
    lib,
    helpers: {
      validate: (...args) => lib.validate(...args),
      countOf: (...args) => lib.countOf(...args),
    },
    scenarios: ['single', 'transform', 'password', 'login', 'multi', 'textarea', 'copy', 'validation-fix', 'sections', 'complete'],
    startModes: ['off', 'partial', 'wrong', 'solved'],
    inputs: ['pointer', 'keyboard'],
    judgeModes: ['ambiguous', 'impossible', 'confirm'],

    sample(rng, opts) {
      const { ONE_FIELD, ctxOf, profileRows, TAB_ROUTE, ENTER_ROUTE, judgeOf } = lib;
      let pool = opts.scenarios && opts.scenarios.length ? opts.scenarios : this.scenarios;
      // ambiguous: a form with one field shows nothing but the instruction itself, so a free-text reply could not be told
      // from a dump of the page; a free pick prefers the forms with other fields.
      if (opts.judge === 'ambiguous' && !opts.scenario && pool.some((v) => !ONE_FIELD.includes(v))) pool = pool.filter((v) => !ONE_FIELD.includes(v));
      const scenario = opts.scenario || rng.pick(pool);
      const spec = { scenario, isplit: opts.isplit || 'train', csplit: opts.csplit || 'train', startMode: opts.startMode,
        ood: !!opts.ood, save: false, enter: false, route: 'click', long: false };
      const g = ctxOf(rng.fork('content'), opts, spec);
      g.rng = rng.fork(`v/${scenario}`);
      g.level = opts.level === 'easy' || opts.level === 'medium' ? opts.level : null;
      spec.locale = g.locale;
      env.scenariosOf('type-text')[scenario].sample(g, spec);
      if (!spec.ask) spec.ask = spec.fields.filter((f) => !f.blank && !f.disabled).map((f) => f.id);
      // An alias may never name another field of the same form (its label or one of its aliases).
      const key = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
      const count = new Map();
      for (const f of spec.fields) for (const a of new Set([f.label, ...(f.aliases || [])].map(key))) count.set(a, (count.get(a) || 0) + 1);
      for (const f of spec.fields) f.aliases = (f.aliases || []).filter((a) => count.get(key(a)) === 1);
      if (scenario === 'complete') profileRows(g, spec);
      // The input-route knob, applied after every draw so it never changes the content.
      if (opts.route === 'keyboard') {
        if (TAB_ROUTE.includes(scenario)) spec.route = 'tab';
        const to = spec.fields.find((f) => f.id === 'to');
        if (spec.save && ENTER_ROUTE.includes(scenario) && !(to && to.type === 'textarea')) spec.enter = true;
      } else if (opts.route === 'pointer') {
        spec.route = 'click';
        spec.enter = false;
      }
      if (this.judgeModes.includes(opts.judge)) {
        const j = judgeOf(rng.fork('judge'), spec, opts.judge);
        if (j) spec.judge = j;
      }
      return spec;
    },

    init(spec, rng) {
      const { password, KINDS, person, addressOf, wrongValue, wrongFix } = lib;
      if (spec.judge && spec.judge.mode !== 'confirm') return this.solve(spec, null); // nothing to change
      const fields = Object.fromEntries(spec.fields.map((f) => [f.id, f.disabled ? f.target : '']));
      const model = { fields, saved: false, errors: {}, focus: null };
      const live = spec.fields.filter((f) => !f.blank && !f.disabled);
      const alt = (f) => {
        if (f.type === 'password') return () => password(rng, spec.ood);
        if (KINDS[f.kind]) {
          const g = { rng, csplit: spec.csplit, locale: spec.locale, ood: spec.ood };
          g.person = person(g);
          g.addr = addressOf(g);
          return () => KINDS[f.kind].gen(g).target;
        }
        return null;
      };
      if (spec.scenario === 'copy') {
        fields.from = spec.fields.find((f) => f.id === 'from').target;
        const other = spec.fields.find((f) => f.id === 'other');
        if (other) fields.other = spec.extraAsk ? wrongValue(rng, other, alt(other)) : other.target;
      }
      if (spec.scenario === 'validation-fix') {
        for (const f of spec.fields) if (!f.disabled) fields[f.id] = f.target;
        fields[spec.invalid.id] = spec.invalid.bad;
        model.errors = { [spec.invalid.id]: spec.invalid.message };
        const f = spec.fields.find((x) => x.id === spec.invalid.id);
        if (spec.startMode === 'partial') fields[f.id] = f.target;
        if (spec.startMode === 'wrong') {
          // A botched fix: still invalid (the message still applies) and still recoverable from the page
          // (a fix that loses the original value, like a truncation, would leave the target unknowable).
          fields[f.id] = wrongFix(rng, f, spec.invalid);
        }
        return model;
      }
      if (spec.scenario === 'sections') {
        // Current values everywhere; partial: some changes done; wrong: an asked field holds a near miss.
        model.section = 0;
        for (const f of spec.fields) fields[f.id] = f.from;
        const asked = spec.fields.filter((f) => f.from !== f.target);
        if (spec.startMode === 'partial' && asked.length > 1) {
          for (const f of rng.sample(asked, rng.int(1, asked.length - 1))) fields[f.id] = f.target;
        } else if (spec.startMode === 'partial') {
          const f = asked[0];
          fields[f.id] = f.target.slice(0, Math.max(1, Math.floor(f.target.length * rng.float(0.3, 0.7))));
        } else if (spec.startMode === 'wrong') {
          const f = rng.pick(asked);
          fields[f.id] = wrongValue(rng, f, null);
        }
        return model;
      }
      if (spec.scenario === 'complete') {
        // Prefilled fields hold the record; missing ones are empty (partial: some done; wrong: a near miss).
        for (const f of spec.fields) if (!f.blank && !spec.missing.includes(f.id)) fields[f.id] = f.target;
        const miss = spec.missing.map((id) => spec.fields.find((f) => f.id === id));
        if (spec.startMode === 'partial') {
          for (const f of rng.sample(miss, rng.int(1, miss.length - 1))) fields[f.id] = f.target;
        } else if (spec.startMode === 'wrong') {
          const f = rng.pick(miss);
          fields[f.id] = wrongValue(rng, f, null);
        }
        return model;
      }
      if (spec.startMode === 'partial') {
        // Some fields done, the rest empty (one-field scenarios: the value half typed).
        if (live.length === 1 || spec.scenario === 'copy') {
          const f = spec.scenario === 'copy' ? spec.fields.find((x) => x.id === 'to') : live[0];
          const t = f.target;
          fields[f.id] = t.slice(0, Math.max(1, Math.floor(t.length * rng.float(0.3, 0.7))));
        } else {
          const k = rng.int(1, live.length - 1);
          for (const f of rng.sample(live, k)) fields[f.id] = f.target;
        }
        return model;
      }
      if (spec.startMode === 'wrong' || (spec.startMode === 'off' && spec.scenario !== 'copy' && rng.bool(0.2))) {
        // Plausible wrong values prefilled: a near miss, a stale entry, or the untransformed source text.
        const pool = spec.scenario === 'copy' ? [spec.fields.find((x) => x.id === 'to')] : live;
        const n = spec.startMode === 'wrong' ? Math.min(pool.length, rng.int(1, 2)) : 1;
        for (const f of rng.sample(pool, n)) {
          if (spec.scenario === 'transform' && rng.bool(0.5)) fields[f.id] = spec.given;
          else fields[f.id] = wrongValue(rng, f, alt(f));
        }
        if (spec.startMode === 'wrong' && rng.bool(0.4)) {
          const blank = spec.fields.find((f) => f.blank);
          if (blank) fields[blank.id] = rng.pick(['n/a', '-', 'none', 'TBD', 'test', 'old']);
        }
      }
      return model;
    },

    plan(model, spec) {
      const { fieldOk } = lib;
      const vals = model.fields || {};
      const live = spec.fields.filter((f) => !f.disabled);
      for (let i = 0; i < live.length; i++) {
        const f = live[i];
        if (fieldOk(f, vals[f.id])) continue;
        if (spec.sections && model.section !== f.section) return { click: { section: f.section } };
        if (spec.route === 'tab' && i > 0 && model.focus === live[i - 1].id
          && (!spec.sections || live[i - 1].section === f.section)) return { key: 'Tab' };
        return { type: [{ field: f.id }, f.blank ? '' : f.target] };
      }
      if (spec.save && !model.saved) {
        const focused = model.focus && spec.fields.find((f) => f.id === model.focus);
        if (spec.enter && focused && focused.type !== 'textarea') return { key: 'Enter' };
        return { click: { save: true } };
      }
      return null;
    },

    solve(spec, model) {
      const m = { fields: Object.fromEntries(spec.fields.map((f) => [f.id, f.target])), saved: !!spec.save, errors: {}, focus: null };
      if (spec.sections) m.section = model && model.section !== undefined ? model.section : 0;
      return m;
    },

    error(...args) { return lib.errorOf(...args); },

    tolerance(...args) { return lib.tolOf(...args); },

    facts(...args) { return lib.facts(...args); },

    parts(...args) { return lib.parts(...args); },

    silent(...args) { return lib.silent(...args); },

    retarget(...args) { return lib.retarget(...args); },

    instruction(...args) { return lib.instruction(...args); },

    // The reply's status and names are graded by the kit; confirm also needs the form left unsaved.
    judged: (model, spec) => spec.judge.mode !== 'confirm' || !model.saved,
  });
})();
