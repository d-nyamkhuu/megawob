/*
 * handle-text: copy, paste, edit, type, find and scroll text on a page.
 * Text handling on a page: copy, cut and paste through the clipboard, caret placement and undo,
 * typing non-ASCII text, reading text that is scrolled out of view, finding a phrase in a long document,
 * scroll-gated agreements and numeric spinners (clicks, typing, press-and-hold).
 * MiniWoB counterparts: copy-paste, copy-paste-2, unicode-test, scroll-text, scroll-text-2,
 * sign-agreement, use-spinner; edit and find go beyond MiniWoB.
 * inputs: pointer, keyboard (typing, Control+A / C / X / V / Z, spinner arrows), wheel (scrolling panes).
 *
 * scenarios
 *   copy-paste      1-3 source boxes (ood 4-5) of real sentences; copy the whole text of the named box (by
 *                   reading order or title) into the answer field
 *   copy-paste-2    copy one portion of a source box: mode 'sentence' (the k-th sentence of a paragraph),
 *                   'line' (line k of a list, numbered or not) or 'value' (the value after a label in a
 *                   message, e.g. the tracking code)
 *   unicode         non-ASCII text: mode 'type' (type the given string), 'copy' (copy a box into the field),
 *                   'button' (unicode-test: click the button with the given label among buttons, text and
 *                   inputs). Recoverable (spec.recoverable): a wrong click shows what was clicked and an Undo;
 *                   it costs 1 until undone, a second wrong click ends the episode; otherwise the first wrong
 *                   click ends it.
 *   scroll-text     a fixed-height box of lines (rows visible; ood 40-70 lines): mode 'last' (type the last
 *                   word of the text), 'line' (the first or last word of line k, out of view at the start) or
 *                   'edge' (scroll-text-2: scroll the box to the top or bottom)
 *   sign-agreement  an agreement in the same kind of box; the name field and both buttons stay disabled until
 *                   the box has been scrolled to the end. mode 'agree' (type the name, press Agree), 'cancel'
 *                   (type the name, press Cancel), 'decline' (just press Cancel). A wrong press (or a press with
 *                   a wrong name) is a wrong choice: recoverable episodes show the result with an Undo,
 *                   others end ('wrong-choice'). The right press does not end the episode.
 *   spinner         a numeric field with up / down buttons: mode 'click' (target 2-12 steps away; ~25% of
 *                   episodes route the oracle through focus + ArrowUp / ArrowDown), 'type' (the field is
 *                   editable and the target 30-200 steps away: type the number), 'hold' (target 25-60 steps
 *                   away, ood 80-150: press and hold a button; after 500 ms it repeats every 100 ms on the kit
 *                   clock, then fine-tune with clicks). Values are integers counted in steps of spec.step.
 *   edit            editing inside text fields: mode 'insert' (click to place the caret, then type a missing
 *                   word), 'cut' (Ctrl+X a phrase out of one field and paste it into another), 'undo' (Ctrl+Z
 *                   restores text someone changed by mistake; the page keeps its own undo history), 'paste-at'
 *                   (copy a code from a note and paste it at a given spot inside a message)
 *   find            find-in-page: a long document (5-8 paragraphs, ood 10-14) in a scrolling pane (mode
 *                   'pane') or on a page that scrolls as a whole (mode 'page'); select the given phrase, which
 *                   occurs exactly once, by dragging over it
 *
 * Round 2 hooks (optional, pure; see the html/kit/env.js header)
 *   facts(model, spec)       { label, value, aliases?, labels? } (aliases: other spellings of the value, labels: other names of the fact); what the page shows at the end: copy tasks "Pasted text" (the answer field), scroll-text word modes
 *                            "Typed word", sign-agreement "Result" ("Signed by NAME.") + "Signed by", spinner the readout under its
 *                            label, edit every field's text (e.g. the edited sentence), find "Paragraph" (which paragraph the
 *                            selection is in) + "Selected text". [] for unicode (type / button: the goal text itself is all
 *                            there is), scroll-text edge and before the thing exists.
 *   silent(next, prev, spec, rng)   text with the last word dropped (typed / pasted answers and names before the press, the edit
 *                            field just changed), the spinner rounded to a multiple of 5 steps (or one step off), the find
 *                            selection missing its first or last characters. null for unicode button and scroll-text edge (no
 *                            believable partial failure), after a press, and when the result would still be right.
 *   retarget(spec, model, rng)   a new goal on the same page: copy-paste another box, copy-paste-2 another line / label (sentence
 *                            mode: null, sentence boundaries are not stored), unicode type another string / button another
 *                            label, scroll-text edge the other end / line another line (last: null, the text is the question),
 *                            sign-agreement another action (before any press), spinner another target, find another phrase of
 *                            the same document. null for edit (the texts are built into the fields), unicode copy (one box) and
 *                            in judge episodes.
 *   judgeModes ambiguous, impossible (every scenario; spec.judge = { mode, message, cands, others, what, tpl, vars, patch, terse };
 *                 the page starts solved; the request is worded like the task's normal instructions, no fixed judge phrases):
 *     ambiguous   the page or the goal fits two ways; the reply asks (status ask) with one option per way (cands) and none of the
 *                 others. Two boxes with the same title (copy-paste, unicode copy; cands: stretches of each box's own text),
 *                 the label twice in the message (copy-paste-2 value; cands: the two codes), "2nd or 3rd line / sentence"
 *                 (copy-paste-2; cands: the ordinals and numbers, others the remaining ones), two strings (unicode type), two
 *                 buttons with the same label (unicode button; twins), "line A or B" / "top or bottom" (scroll-text; others
 *                 the other line numbers), two names or Agree-or-Cancel (sign-agreement), two values (spinner; others the
 *                 neighbouring values), two anchor words (edit), the phrase twice in the document (find; cands: the
 *                 paragraphs and the words around each; the first stays the wanted one).
 *     impossible  something the page lacks; status impossible and what names it (a box title, a field / button / spinner
 *                 label, a line past the end, a phrase that is not in the document), drawn per seed from the task's banks;
 *                 the instruction is the normal one of a patched spec (judge.patch). No confirm: none of these steps is
 *                 irreversible.
 *
 * Levels (opts.level easy | medium, normal unchanged): the sampled episode is eased in place from
 * rng.fork('level') (levelAdjust): copy-paste: the target box only on easy, one other on medium; copy-paste-2:
 * the target sentence alone / the text cut after it, fewer lines; unicode 'button': 3 / 4 items; scroll-text: a
 * shorter text, the asked line just below the fold; sign-agreement: a shorter agreement, first name only on
 * easy; spinner: a target at most 4 / 7 (click), 60 / 110 (type), 35 / 45 (hold) steps away; find: fewer
 * paragraphs. edit and unicode 'type' / 'copy' keep their normal draw.
 *
 * Clipboard. The page keeps its own clipboard in the model (model.clip): the widget handles the copy / cut /
 * paste events (Control+C / X / V), stores the copied text and pastes it into the focused field itself, so
 * pasting never reads the system clipboard and stale text cannot leak in. Undo (Control+Z) in edit fields
 * is the page's own history (model.history), not the browser's.
 *
 * opts.route (episode knob; undefined = the mixes below) overrides the drawn route and sets spec.forcedRoute:
 *   scroll-text, sign-agreement, find   'wheel' -> route 'wheel', 'pointer' -> route 'thumb' (find 'page'
 *                                       mode: the kit scrolls the page itself); 'keyboard' ignored
 *   spinner 'click'                     'keyboard' -> route 'keys', 'pointer' -> route 'buttons'; 'wheel'
 *                                       ignored ('type' always types, 'hold' is pointer-only already)
 *   other scenarios                      ignored (copy, edit and unicode 'type' need the keyboard by nature;
 *                                       unicode 'button' is pointer-only)
 *   Typing a word or name stays part of scroll-text 'last' / 'line' and sign-agreement 'agree' / 'cancel'.
 *
 * spec   { scenario, mode?, isplit, csplit, ood, startMode, route?, forcedRoute?, recoverable?, ... }
 *   copy tasks (copy-paste, copy-paste-2, unicode 'copy'):
 *          boxes: [{ title, text, lines?, numbered? }], want: { box, start, end }, answer, how ('all' |
 *          'drag'), refBy ('only' | 'ordinal' | 'title'), k / label (copy-paste-2), field: { label, placeholder }
 *   unicode 'type': answer, field.   unicode 'button': items, target (label), recoverable
 *   scroll-text: lines, rows, numbered, line, which ('first' | 'last'), answer, goal, start, field, route
 *   sign-agreement: heading, lines, rows, name, field, route, recoverable
 *   spinner: label, unit, step, decimals, min, max (ticks or null), start, target, editable, route ('buttons'
 *          | 'keys' | 'type' | 'hold'), stepMs
 *   edit: fields: [{ label, value (start), target }], insert: { at, text } | phrase: { start, end, text } |
 *          snippet: { title, text } + at; history (undo: the page's history at the start)
 *   find: paragraphs, doc (paragraphs joined by '\n\n'), phrase, want: { start, end }, route
 * model
 *   copy tasks / unicode 'type': { field, clip, sel: null | { box, start, end }, focus }
 *   unicode 'button': { clicked: null | item index, wrongs }
 *   scroll-text: { scroll (first visible line, float), seen, field }
 *   sign-agreement: { scroll, unlocked, name, pressed, signed, wrongs }
 *   spinner: { value (ticks), hold: null | { dir, since, n }, focus }
 *   edit: { values: [string per field], clip, sel: null | { field | box, start, end }, focus (null | 'f0' |
 *          'f1' | 'box'), caret (selectionStart of the focused field), history: [older values of field 0] }
 *   find: { sel: null | { start, end }, where (-1 above / 0 in view / 1 below; mirrored by the widget) }
 * error
 *   copy / type: d = normalized edit distance (code points, NFC, trimmed); copy tasks scale it by 0.6 once
 *          the clipboard holds the answer, 0.8 while the answer is selected; tau 0, sigma 0.15
 *   unicode 'button': 1 until the right button is clicked, 0 after; sigma 0.5
 *   scroll-text 'last' / 'line': answer distance x 0.7 once the target line has been in view; 'edge':
 *          lines between the scroll position and the goal (tau 0.3)
 *   sign-agreement: before a press (not unlocked + name distance + 1) / 3 ('decline': (not unlocked + 1) / 2);
 *          0 after the right press with the right name, 1 while a wrong press stands
 *   spinner: |value - target| in steps; tau 0, sigma 1.5
 *   edit: mean distance of the fields to their targets (spaces collapsed), x 0.7 while the clipboard holds
 *          the needed text, x 0.85 while it is selected; tau 0, sigma 0.15
 *   find: 1 - IoU of the selected and the wanted character ranges (0.9 for none while the phrase is in
 *          view); tau 0, sigma 0.3
 * start modes: off; partial (clipboard filled, prefix typed, target line in view, agreement unlocked with a
 *   partial name, spinner halfway, part of a word inserted, phrase already cut, part of the phrase
 *   selected); wrong (another box's text, an ASCII-folded string, a wrong button pending undo, a wrong
 *   word, a wrong name, the spinner moved the wrong way, a word inserted at the wrong spot, a phrase copied
 *   instead of cut, a second accidental change on top of the first, a different phrase selected); solved;
 *   scene (sign-agreement only: scrolled to the end, so unlocked, name blank, nothing pressed; all other
 *   scenarios start like 'off'; never in the default training mix).
 *
 * plan targets (the widget's locate() maps them to viewport px)
 *   { field: 'answer' | 'name' }        the centre of that text field
 *   { box: i } / { box: i, char: k, edge }   a source box / just inside glyph k of box i
 *   { thumb: 'text' } / { scroll: s } / { scrollEdge: 'top' | 'bottom' }   custom scrollbar (press at the
 *                                       thumb, release so line s is first visible / past an end)
 *   { scrollTo: 'phrase' }              (find) where to release the thumb so the phrase is mid-pane
 *   { pane: 'text' }                    a point inside the scrolling text (wheel target)
 *   { button: 'agree' | 'cancel' } / { undo: true }
 *   { choice: i }                       button item i (unicode 'button')
 *   { spin: 'up' | 'down' | 'value' }   spinner buttons / the value field
 *   { efield: i } / { caret: [i, k] }   edit field i (centre) / the caret boundary before character k of
 *                                       edit field i (a click there puts the caret at k)
 *   { snippet: true } / { doc: true, char: k, edge }   the edit note box / glyph k of the find document
 * plan steps: copy: { click: { box } } + { key: 'Control+a' } (how 'all') or { drag: [char, char] },
 *   { key: 'Control+c' }, { click: { field } }, { key: 'Control+v' }; scroll: route 'thumb' { drag: [{ thumb },
 *   { scroll } | { scrollEdge }] }, route 'wheel' { wheel: [{ pane }, dy] } (closed loop); spinner: { click:
 *   { spin } } per step, route 'keys' { click: { spin: 'value' } } then { key: 'ArrowUp' | 'ArrowDown' },
 *   'type' { type: [{ spin: 'value' }, text] }, 'hold' { down: { spin } }, { wait } until close, { up },
 *   then clicks; edit: insert { click: { caret } } + { key: c } per character ('Space' for spaces); cut
 *   { drag: [caret, caret] }, { key: 'Control+x' }, { click: { efield: 1 } }, { key: 'Control+v' }; undo
 *   { click: { efield: 0 } } + { key: 'Control+z' }; paste-at { click: { snippet } }, { key: 'Control+a' },
 *   { key: 'Control+c' }, { click: { caret } }, { key: 'Control+v' }; any edit field off the path is retyped
 *   with { type: [{ efield }, target] }; find: scroll (pane), then { drag: [{ doc, char, 'before' },
 *   { doc, char, 'after' }] }.
 * Implementation: sampling.js (banks/difficulty), scenarios/*.js (samplers), judge.js, instructions.js.
 * Task files share pure internals through lib.
 * Self-test: selftest.js (loaded only by the checker and node tests).
 * Helpers (widget API, env.taskDef.helpers):
 *   scrolled(model, spec, scroll): update scroll and seen/unlocked state
 *   maxScroll(spec): last scroll position
 *   copyText(spec, sel): selected source text
 *   fmtSpin(spec, ticks): format spinner value
 *   parseSpin(spec, text): parse a value on the step grid
 *   isCopy(spec): whether the task copies text
 *   signCorrect(model, spec): correct agreement result
 *   buttonCorrect(model, spec): correct Unicode button
 *   wrongPending(model, spec): wrong choice awaiting undo
 */
(function () {
  'use strict';


  const lib = {};
  const C = env.content;

  // ---------------------------------------------------------------- scoring helpers

  const cps = (s) => [...String(s ?? '').normalize('NFC')];
  const levenshtein = (a, b) => env.util.lev(cps(a), cps(b));
  const clean = (s) => String(s ?? '').normalize('NFC').trim();
  const squash = (s) => clean(s).replace(/\s+/g, ' ');
  // megawob-lint: allow util-copy normalised text distance, not a point distance
  function dist(value, target, norm = clean) {
    const v = norm(value);
    const t = norm(target);
    if (v === t) return 0;
    return levenshtein(v, t) / Math.max(cps(t).length, cps(v).length, 1);
  }
  const wordOnly = (s) => String(s ?? '').normalize('NFC').replace(/[^\p{L}\p{N}]/gu, '');
  const wordDist = (value, target) => dist(wordOnly(value), wordOnly(target));

  const COPY = new Set(['copy-paste', 'copy-paste-2']);
  const isCopy = (spec) => COPY.has(spec.scenario) || (spec.scenario === 'unicode' && spec.mode === 'copy');
  const isTyped = (spec) => isCopy(spec) || (spec.scenario === 'unicode' && spec.mode === 'type');

  function copyText(spec, sel) {
    if (!sel || !spec.boxes || !spec.boxes[sel.box] || !(sel.end > sel.start)) return '';
    return spec.boxes[sel.box].text.slice(sel.start, sel.end);
  }
  const selOk = (spec, sel) => !!sel && sel.box === spec.want.box && clean(copyText(spec, sel)) === clean(spec.answer);
  const clipOk = (spec, clip) => clip !== null && clip !== undefined && clean(clip) === clean(spec.answer);

  const maxScroll = (spec) => Math.max(0, spec.lines.length - spec.rows);
  const visible = (spec, scroll, i) => i >= scroll - 0.02 && i + 1 <= scroll + spec.rows + 0.02;
  const UNLOCK = 0.3; // lines from the bottom that count as "scrolled to the end" (MiniWoB: 10 px)
  const LINE_PX = 24; // wheel estimate of one line (the widget's lines are 21-28 px); plans are closed-loop

  function scrolled(model, spec, scroll) {
    const m = { ...model, scroll };
    if (spec.scenario === 'scroll-text' && spec.mode !== 'edge') m.seen = !!model.seen || visible(spec, scroll, spec.line);
    if (spec.scenario === 'sign-agreement') m.unlocked = !!model.unlocked || scroll >= maxScroll(spec) - UNLOCK;
    return m;
  }

  function fmtSpin(spec, ticks) {
    const v = ticks * spec.step;
    const s = v.toFixed(spec.decimals);
    return s === '-0' || /^-0\.0*$/.test(s) ? s.slice(1) : s;
  }
  // Typed spinner text -> ticks (null unless it is a number on the step grid within the limits).
  function parseSpin(spec, text) {
    const t = String(text ?? '').trim().replace(/−/g, '-').replace(/,/g, '.');
    if (!/^-?\d+(\.\d+)?$/.test(t)) return null;
    const ticks = Number(t) / spec.step;
    const r = Math.round(ticks);
    if (Math.abs(ticks - r) > 1e-6) return null;
    if ((spec.min !== null && r < spec.min) || (spec.max !== null && r > spec.max)) return null;
    return r;
  }
  const HOLD = { delay: 500, rate: 100 };

  const signGoal = (spec) => (spec.mode === 'agree' ? 'agree' : 'cancel');
  function signCorrect(model, spec) {
    if (!model.pressed) return false;
    if (model.pressed !== signGoal(spec)) return false;
    return spec.mode === 'decline' || clean(model.signed) === clean(spec.name);
  }
  const buttonCorrect = (model, spec) => model.clicked !== null && model.clicked !== undefined
    && spec.items[model.clicked] && spec.items[model.clicked].label === spec.target;
  function wrongPending(model, spec) {
    if (spec.scenario === 'sign-agreement') return !!model.pressed && !signCorrect(model, spec);
    if (spec.scenario === 'unicode' && spec.mode === 'button') return model.clicked !== null && model.clicked !== undefined && !buttonCorrect(model, spec);
    return false;
  }

  // ---------------------------------------------------------------- round 2: facts, silent, retarget

  const dropWord = (t) => {
    const w = String(t ?? '').trimEnd().split(/\s+/).filter(Boolean);
    return w.length > 1 ? w.slice(0, -1).join(' ') : String(t ?? '').slice(0, -1);
  };

  function factsOf(model, spec) {
    const v = spec.scenario;
    const txt = (s) => String(s ?? '').trim();
    if (isCopy(spec)) return txt(model.field) ? [{ label: 'Pasted text', value: txt(model.field), labels: ['Answer', spec.field.label, 'Text'] }] : [];
    if (v === 'unicode') return [];
    if (v === 'scroll-text') return spec.mode !== 'edge' && txt(model.field) ? [{ label: 'Typed word', value: txt(model.field), labels: ['Answer', spec.field.label, 'Word'] }] : [];
    if (v === 'sign-agreement') {
      if (!model.pressed) return [];
      if (model.pressed === 'agree') {
        return [{ label: 'Result', value: `Signed by ${model.signed || '(no name)'}.`, labels: ['Status', 'Signature'] }, { label: 'Signed by', value: String(model.signed || ''), labels: ['Name', 'Signed name'] }];
      }
      return [{ label: 'Result', value: 'You declined the agreement.', labels: ['Status', 'Outcome'] }];
    }
    if (v === 'spinner') return [{ label: spec.label, value: fmtSpin(spec, model.value) + (spec.unit ? ` ${spec.unit}` : ''), aliases: [fmtSpin(spec, model.value)], labels: ['Value'] }];
    if (v === 'edit') return spec.fields.map((f, i) => ({ label: f.label, value: txt(model.values[i]), labels: [`Field ${i + 1}`] })).filter((f) => f.value);
    // find
    if (!model.sel || !(model.sel.end > model.sel.start)) return [];
    let para = 0;
    for (let acc = 0; para < spec.paragraphs.length; para++) {
      acc += spec.paragraphs[para].length + 2;
      if (model.sel.start < acc) break;
    }
    return [{ label: 'Paragraph', value: String(para + 1), labels: ['Paragraph number', 'Section'] }, { label: 'Selected text', value: spec.doc.slice(model.sel.start, model.sel.end), labels: ['Selection'] }];
  }

  function silentOf(next, prev, spec, rng) {
    const v = spec.scenario;
    const bad = (m) => errorOf(m, spec) > toleranceOf(spec).tau + 1e-9 && JSON.stringify(m) !== JSON.stringify(next);
    const pick = (m) => (bad(m) ? m : null);
    if (isTyped(spec) || (v === 'scroll-text' && spec.mode !== 'edge')) {
      return next.field ? pick({ ...next, field: dropWord(next.field) }) : null;
    }
    if (v === 'sign-agreement') return !next.pressed && next.name ? pick({ ...next, name: dropWord(next.name) }) : null;
    if (v === 'spinner') {
      const r = Math.round(next.value / 5) * 5;
      const dir = rng.bool() ? 1 : -1;
      const clampToSpec = (x) => Math.min(spec.max === null ? x : spec.max, Math.max(spec.min === null ? x : spec.min, x));
      return pick({ ...next, value: clampToSpec(r !== next.value ? r : next.value + dir), hold: null });
    }
    if (v === 'edit') {
      const changed = next.values.map((x, i) => (x !== prev.values[i] ? i : -1)).filter((i) => i >= 0);
      if (!changed.length) return null;
      const i = changed[changed.length - 1];
      return pick({ ...next, values: next.values.map((x, k) => (k === i ? dropWord(x) : x)) });
    }
    if (v === 'find') {
      const s = next.sel;
      if (!s || s.end - s.start < 3) return null;
      return pick({ ...next, sel: rng.bool() ? { ...s, end: s.end - rng.int(1, Math.min(3, s.end - s.start - 1)) } : { ...s, start: s.start + rng.int(1, Math.min(3, s.end - s.start - 1)) } });
    }
    return null;
  }

  function retargetOf(spec, model, rng) {
    if (spec.judge) return null;
    const v = spec.scenario;
    let out = null;
    if (v === 'copy-paste' && spec.boxes.length > 1) {
      const j = rng.pick(spec.boxes.map((_, i) => i).filter((i) => i !== spec.want.box));
      out = { ...spec, want: { box: j, start: 0, end: spec.boxes[j].text.length }, answer: spec.boxes[j].text };
    } else if (v === 'copy-paste-2' && spec.mode === 'line') {
      const lines = spec.boxes[0].lines;
      const k = rng.pick(lines.map((_, i) => i).filter((i) => i !== spec.k));
      const start = lines.slice(0, k).reduce((a, s) => a + s.length + 1, 0);
      out = { ...spec, k, want: { box: 0, start, end: start + lines[k].length }, answer: lines[k] };
    } else if (v === 'copy-paste-2' && spec.mode === 'value') {
      const lines = spec.boxes[0].lines;
      const byLabel = lines.map((l, i) => [i, Object.keys(lib.VALUE_LABELS).find((k) => l.startsWith(`${lib.VALUE_LABELS[k]}: `))]).filter(([i, k]) => i > 0 && k && k !== spec.label);
      if (byLabel.length) {
        const [i, key] = rng.pick(byLabel);
        const lineStart = lines.slice(0, i).reduce((a, s) => a + s.length + 1, 0);
        const start = lineStart + lib.VALUE_LABELS[key].length + 2;
        const value = lines[i].slice(lib.VALUE_LABELS[key].length + 2);
        out = { ...spec, label: key, want: { box: 0, start, end: start + value.length }, answer: value };
      }
    } else if (v === 'unicode' && spec.mode === 'type') {
      let a;
      for (let k = 0; k < 20 && !a; k++) {
        const t = lib.unicodeText(rng);
        if (t !== spec.answer) a = t;
      }
      out = { ...spec, answer: a };
    } else if (v === 'unicode' && spec.mode === 'button' && (model.clicked === null || model.clicked === undefined)) {
      const labels = spec.items.filter((it) => it.type === 'button' && it.label !== spec.target).map((it) => it.label);
      if (labels.length) out = { ...spec, target: rng.pick(labels) };
    } else if (v === 'scroll-text' && spec.mode === 'edge') {
      out = { ...spec, goal: spec.goal === 'top' ? 'bottom' : 'top' };
    } else if (v === 'scroll-text' && spec.mode === 'line') {
      for (let k = 0; k < 40 && !out; k++) {
        const line = rng.int(spec.rows, spec.lines.length - 1);
        const which = rng.pick(['first', 'last']);
        const ws = spec.lines[line].split(' ');
        const w = which === 'first' ? ws[0] : ws[ws.length - 1];
        if (/^[\p{L}][\p{L}'’-]*[.,;:!?]?$/u.test(w) && wordOnly(w).length >= 2 && (line !== spec.line || which !== spec.which)) out = { ...spec, line, which, answer: wordOnly(w) };
      }
    } else if (v === 'sign-agreement' && !model.pressed) {
      out = { ...spec, mode: rng.pick(['agree', 'cancel', 'decline'].filter((m) => m !== spec.mode)) };
    } else if (v === 'spinner') {
      const [dLo, dHi] = spec.mode === 'click' ? [2, 12] : spec.mode === 'type' ? [30, 200] : spec.ood ? [80, 150] : [25, 60];
      for (let k = 0; k < 80 && !out; k++) {
        const t = model.value + rng.int(dLo, dHi) * (rng.bool() ? 1 : -1);
        if (t !== spec.target && (spec.min === null || t >= spec.min) && (spec.max === null || t <= spec.max)) out = { ...spec, target: t };
      }
    } else if (v === 'find') {
      for (let k = 0; k < 60 && !out; k++) {
        const pi = rng.int(0, spec.paragraphs.length - 1);
        const words = spec.paragraphs[pi].split(' ');
        const len = rng.int(2, 5);
        if (words.length < len + 2) continue;
        const i = rng.int(0, words.length - len);
        const phrase = words.slice(i, i + len).join(' ').replace(/[.,;:!?)"]+$/, '').replace(/^[("]+/, '');
        if (phrase.length < 8 || /\n/.test(phrase) || spec.doc.split(phrase).length !== 2 || phrase === spec.phrase) continue;
        const base = spec.paragraphs.slice(0, pi).reduce((a, p) => a + p.length + 2, 0);
        const start = base + spec.paragraphs[pi].indexOf(phrase);
        out = { ...spec, phrase, para: pi, want: { start, end: start + phrase.length } };
      }
    }
    return out && errorOf(model, out) > toleranceOf(out).tau + 1e-9 ? out : null;
  }

  // ---------------------------------------------------------------- model

  function baseModel(spec) {
    const v = spec.scenario;
    if (isTyped(spec)) return { field: '', clip: null, sel: null, focus: null };
    if (v === 'unicode') return { clicked: null, wrongs: 0 };
    if (v === 'scroll-text') return scrolled({ scroll: spec.start, seen: false, field: '' }, spec, spec.start);
    if (v === 'sign-agreement') return { scroll: 0, unlocked: false, name: '', pressed: null, signed: null, wrongs: 0 };
    if (v === 'edit') return { values: spec.fields.map((f) => f.value), clip: null, sel: null, focus: null, caret: null, history: (spec.history || []).slice() };
    if (v === 'find') return { sel: null, where: 1 };
    return { value: spec.start, hold: null, focus: false };
  }

  const prefix = (s, f = 0.5) => cps(s).slice(0, Math.max(0, Math.floor(cps(s).length * f))).join('');

  function initModel(spec, rng) {
    const m = baseModel(spec);
    const mode = spec.startMode;
    rng = rng || new env.Rng(3);
    // scene: the reference screen's mid-task state. Only sign-agreement has one (scrolled to the end, so
    // unlocked, name still blank); the other scenarios have no such screen and start like 'off'.
    if (mode === 'scene') return spec.scenario === 'sign-agreement' ? scrolled(m, spec, maxScroll(spec)) : m;
    if (mode !== 'partial' && mode !== 'wrong') return m;
    const v = spec.scenario;
    if (isCopy(spec)) {
      if (mode === 'partial') m.clip = spec.answer;
      else {
        const others = spec.boxes.map((b) => b.text).filter((t) => clean(t) !== clean(spec.answer));
        m.field = others.length ? rng.pick(others).replace(/\n/g, ' ') : prefix(spec.answer, 0.6);
        if (v === 'copy-paste-2') {
          // A neighbouring portion: the whole box, or the line / sentence next to the wanted one.
          m.field = spec.boxes[0].text.replace(/\n/g, ' ');
        }
      }
      return m;
    }
    if (isTyped(spec)) {
      const folded = C.ascii(spec.answer);
      m.field = mode === 'partial' ? prefix(spec.answer) : folded !== spec.answer ? folded : `${prefix(spec.answer)}?`;
      return m;
    }
    switch (v) {
      case 'unicode':
        if (mode === 'wrong' && spec.recoverable) {
          m.clicked = spec.items.findIndex((x) => x.type === 'button' && x.label !== spec.target);
          m.wrongs = 1;
        }
        return m;
      case 'scroll-text':
        if (spec.mode === 'edge') {
          const goal = spec.goal === 'top' ? 0 : maxScroll(spec);
          const s = mode === 'partial' ? Math.round((spec.start + goal) / 2) : maxScroll(spec) - goal;
          return { ...m, scroll: s === goal ? spec.start : s };
        }
        if (mode === 'partial') return scrolled(m, spec, Math.min(maxScroll(spec), Math.max(0, spec.line - Math.floor(spec.rows / 2))));
        {
          const ws = spec.lines[spec.line].split(' ').map(wordOnly).filter((w) => w && w !== spec.answer);
          m.field = ws.length ? rng.pick(ws) : `${spec.answer}s`;
        }
        return m;
      case 'sign-agreement': {
        const n = scrolled(m, spec, maxScroll(spec));
        if (mode === 'partial') return { ...n, name: spec.mode === 'decline' ? '' : prefix(spec.name) };
        if (spec.mode === 'decline') {
          if (!spec.recoverable) return m;
          return { ...n, pressed: 'agree', signed: '', wrongs: 1 };
        }
        return { ...n, name: C.personName(rng, C.csplitOf(spec)).first };
      }
      case 'spinner': {
        const d = spec.target - spec.start;
        let val = mode === 'partial' ? spec.start + Math.trunc(d / 2) : spec.start - Math.sign(d) * Math.max(1, Math.min(3, Math.abs(Math.trunc(d / 4))));
        if (spec.min !== null) val = Math.max(spec.min, val);
        if (spec.max !== null) val = Math.min(spec.max, val);
        return { ...m, value: val === spec.target ? spec.start : val };
      }
      case 'edit': {
        const f0 = spec.fields[0];
        if (spec.mode === 'insert') {
          if (mode === 'partial') {
            const part = spec.insert.text.slice(0, Math.max(1, Math.floor(spec.insert.text.length / 2) - 0));
            m.values = [f0.value.slice(0, spec.insert.at) + part + f0.value.slice(spec.insert.at)];
          } else m.values = [`${spec.word} ${f0.value}`];
        } else if (spec.mode === 'cut') {
          const ph = spec.phrase;
          if (mode === 'partial') {
            m.values = [f0.value.slice(0, ph.start) + f0.value.slice(ph.end), ''];
            m.clip = ph.text;
          } else {
            m.values = [f0.value, ph.text];
            m.clip = ph.text;
          }
        } else if (spec.mode === 'undo') {
          if (mode === 'wrong') {
            // A second accidental change on top of the first one.
            m.history = [f0.target, f0.value];
            m.values = [`${f0.value} ${rng.pick(['zzz', 'qwerty', '...'])}`];
          }
        } else if (mode === 'partial') m.clip = spec.snippet.text;
        else m.values = [`${f0.value} ${spec.snippet.text}`];
        return m;
      }
      case 'find': {
        const w = spec.want;
        if (mode === 'partial') return { ...m, sel: { start: w.start, end: w.start + Math.max(1, Math.floor((w.end - w.start) / 2)) } };
        const s = Math.max(0, spec.doc.indexOf(' ', 20) + 1);
        return { ...m, sel: { start: s, end: s + 12 } };
      }
      default: return m;
    }
  }

  function editError(model, spec) {
    const d = spec.fields.reduce((a, f, i) => a + dist(model.values[i], f.target, squash), 0) / spec.fields.length;
    if (d === 0) return 0;
    const need = spec.mode === 'cut' ? spec.phrase.text : spec.mode === 'paste-at' ? spec.snippet.text : null;
    if (!need) return d;
    if (model.clip !== null && model.clip !== undefined && clean(model.clip) === need) return d * 0.7;
    if (model.sel && spec.mode === 'paste-at' && model.sel.box && model.sel.end - model.sel.start === need.length) return d * 0.85;
    if (model.sel && spec.mode === 'cut' && model.sel.field === 0 && model.sel.start === spec.phrase.start && model.sel.end === spec.phrase.end) return d * 0.85;
    return d;
  }

  function errorOf(model, spec) {
    const v = spec.scenario;
    if (isTyped(spec)) {
      const d = dist(model.field, spec.answer);
      if (!isCopy(spec) || d === 0) return d;
      return d * (clipOk(spec, model.clip) ? 0.6 : selOk(spec, model.sel) ? 0.8 : 1);
    }
    if (v === 'unicode') return buttonCorrect(model, spec) ? 0 : 1;
    if (v === 'scroll-text') {
      if (spec.mode === 'edge') return Math.abs((model.scroll || 0) - (spec.goal === 'top' ? 0 : maxScroll(spec)));
      const d = wordDist(model.field, spec.answer);
      return d === 0 ? 0 : d * (model.seen ? 0.7 : 1);
    }
    if (v === 'sign-agreement') {
      if (model.pressed) return signCorrect(model, spec) ? 0 : 1;
      const lock = model.unlocked ? 0 : 1;
      if (spec.mode === 'decline') return (lock + 1) / 2;
      return (lock + dist(model.name, spec.name) + 1) / 3;
    }
    if (v === 'edit') return editError(model, spec);
    if (v === 'find') {
      const s = model.sel;
      const w = spec.want;
      if (!s || !(s.end > s.start)) return model.where === 0 ? 0.9 : 1;
      const inter = Math.max(0, Math.min(s.end, w.end) - Math.max(s.start, w.start));
      const union = Math.max(s.end, w.end) - Math.min(s.start, w.start);
      return Math.round((1 - inter / union) * 1e6) / 1e6;
    }
    return Math.abs(model.value - spec.target);
  }

  function toleranceOf(spec) {
    const v = spec.scenario;
    if (isTyped(spec) || v === 'edit') return { tau: 0, sigma: 0.15 };
    if (v === 'unicode') return { tau: 0, sigma: 0.5, minInitialError: 0.5 };
    if (v === 'scroll-text') return spec.mode === 'edge' ? { tau: 0.3, sigma: 1.5, minInitialError: 1 } : { tau: 0, sigma: 0.3 };
    if (v === 'sign-agreement') return { tau: 0, sigma: 0.4, minInitialError: 0.5 };
    if (v === 'find') return { tau: 0, sigma: 0.3, minInitialError: 0.5 };
    return { tau: 0, sigma: 1.5, minInitialError: 1.5 };
  }

  // ---------------------------------------------------------------- instructions

  // The templates the judge episodes reuse (an ambiguous request puts both alternatives in one slot).

  // opts.route (episode knob): override the drawn route after sampling (undefined changes nothing).
  function forceRoute(spec, route) {
    const scrolls = spec.scenario === 'scroll-text' || spec.scenario === 'sign-agreement' || spec.scenario === 'find';
    const clicks = spec.scenario === 'spinner' && spec.mode === 'click';
    if (scrolls && (route === 'wheel' || route === 'pointer')) spec.route = route === 'wheel' ? 'wheel' : 'thumb';
    else if (clicks && (route === 'keyboard' || route === 'pointer')) spec.route = route === 'keyboard' ? 'keys' : 'buttons';
    else return spec;
    spec.forcedRoute = route;
    return spec;
  }

  // ---------------------------------------------------------------- plan

  function scrollPlan(model, spec, want, edge) {
    const cur = model.scroll || 0;
    if (spec.route === 'wheel') {
      if (edge) return { wheel: [{ pane: 'text' }, edge === 'top' ? -5000 : 5000] };
      const dy = Math.round((want - cur) * LINE_PX);
      return { wheel: [{ pane: 'text' }, Math.abs(dy) < LINE_PX ? Math.sign(dy || 1) * LINE_PX : dy] };
    }
    return { drag: [{ thumb: 'text' }, edge ? { scrollEdge: edge } : { scroll: want }] };
  }

  const keyOf = (ch) => (ch === ' ' ? 'Space' : ch);

  function editPlan(model, spec) {
    const f = spec.fields;
    const vals = model.values;
    const ok = (i) => squash(vals[i]) === squash(f[i].target);
    if (f.every((_, i) => ok(i))) return null;
    const retype = () => {
      const i = f.findIndex((_, k) => !ok(k));
      return { type: [{ efield: i }, f[i].target] };
    };
    if (spec.mode === 'insert') {
      const { at, text } = spec.insert;
      const base = f[0].value;
      // On the insertion path: base with text[0..j) inserted at `at`.
      let j = -1;
      for (let k = 0; k <= text.length; k++) if (vals[0] === base.slice(0, at) + text.slice(0, k) + base.slice(at)) j = k;
      if (j < 0 || j === text.length) return retype();
      if (model.focus !== 'f0' || model.caret !== at + j) return { click: { caret: [0, at + j] } };
      return { key: keyOf(text[j]) };
    }
    if (spec.mode === 'undo') {
      if (model.history && model.history.some((h) => squash(h) === squash(f[0].target))) {
        return model.focus === 'f0' ? { key: 'Control+z' } : { click: { efield: 0 } };
      }
      return retype();
    }
    if (spec.mode === 'cut') {
      const ph = spec.phrase;
      const clip = model.clip !== null && model.clip !== undefined && clean(model.clip) === ph.text;
      if (vals[0] === f[0].value) {
        // Not cut yet: select the phrase, then cut.
        const s = model.sel;
        if (model.focus === 'f0' && s && s.field === 0 && s.start === ph.start && s.end === ph.end) return { key: 'Control+x' };
        return { drag: [{ caret: [0, ph.start] }, { caret: [0, ph.end] }] };
      }
      if (ok(0) && squash(vals[1]) === '' && clip) return model.focus === 'f1' ? { key: 'Control+v' } : { click: { efield: 1 } };
      return retype();
    }
    // paste-at
    const clip = model.clip !== null && model.clip !== undefined && clean(model.clip) === spec.snippet.text;
    if (vals[0] !== f[0].value) return retype();
    if (!clip) {
      if (model.focus === 'box' && model.sel && model.sel.box && model.sel.end - model.sel.start === spec.snippet.text.length) return { key: 'Control+c' };
      return model.focus === 'box' ? { key: 'Control+a' } : { click: { snippet: true } };
    }
    if (model.focus !== 'f0' || model.caret !== spec.at) return { click: { caret: [0, spec.at] } };
    return { key: 'Control+v' };
  }

  function planOf(model, spec) {
    const v = spec.scenario;
    if (isTyped(spec)) {
      if (dist(model.field, spec.answer) === 0) return null;
      if (!isCopy(spec)) return { type: [{ field: 'answer' }, spec.answer] };
      if (clean(model.field) !== '') return { type: [{ field: 'answer' }, ''] };
      if (clipOk(spec, model.clip)) return model.focus === 'field' ? { key: 'Control+v' } : { click: { field: 'answer' } };
      if (selOk(spec, model.sel) && model.focus !== 'field') return { key: 'Control+c' };
      const w = spec.want;
      if (spec.how === 'all') return model.focus === `box:${w.box}` ? { key: 'Control+a' } : { click: { box: w.box } };
      return { drag: [{ box: w.box, char: w.start, edge: 'before' }, { box: w.box, char: w.end - 1, edge: 'after' }] };
    }
    if (v === 'unicode') {
      if (wrongPending(model, spec)) return spec.recoverable ? { click: { undo: true } } : null;
      if (buttonCorrect(model, spec)) return null;
      return { click: { choice: spec.items.findIndex((x) => x.type === 'button' && x.label === spec.target) } };
    }
    if (v === 'scroll-text') {
      if (spec.mode === 'edge') return scrollPlan(model, spec, null, spec.goal);
      if (wordDist(model.field, spec.answer) === 0) return null;
      if (!visible(spec, model.scroll || 0, spec.line)) {
        const s = Math.min(maxScroll(spec), Math.max(0, spec.line - (spec.rows - 1) / 2));
        return scrollPlan(model, spec, s, null);
      }
      return { type: [{ field: 'answer' }, spec.answer] };
    }
    if (v === 'sign-agreement') {
      if (wrongPending(model, spec)) return spec.recoverable ? { click: { undo: true } } : null;
      if (model.pressed) return null;
      if (!model.unlocked) return scrollPlan(model, spec, null, 'bottom');
      if (spec.mode !== 'decline' && clean(model.name) !== clean(spec.name)) return { type: [{ field: 'name' }, spec.name] };
      return { click: { button: signGoal(spec) } };
    }
    if (v === 'edit') return editPlan(model, spec);
    if (v === 'find') {
      const w = spec.want;
      if (errorOf(model, spec) === 0) return null;
      if (spec.mode === 'pane' && model.where !== 0) {
        if (spec.route === 'wheel') return { wheel: [{ pane: 'text' }, (model.where || 1) * 220] };
        return { drag: [{ thumb: 'text' }, { scrollTo: 'phrase' }] };
      }
      return { drag: [{ doc: true, char: w.start, edge: 'before' }, { doc: true, char: w.end - 1, edge: 'after' }] };
    }
    // spinner
    const d = spec.target - model.value;
    if (model.hold) {
      const perWait = Math.floor(spec.stepMs / HOLD.rate);
      const left = d * model.hold.dir;
      return left >= perWait ? { wait: true } : { up: { spin: model.hold.dir > 0 ? 'up' : 'down' } };
    }
    if (d === 0) return null;
    const dir = d > 0 ? 'up' : 'down';
    if (spec.route === 'type' || (spec.editable && Math.abs(d) > 15)) return { type: [{ spin: 'value' }, fmtSpin(spec, spec.target)] };
    if (spec.route === 'hold' && Math.abs(d) > 12) return { down: { spin: dir } };
    if (spec.route === 'keys') return model.focus ? { key: d > 0 ? 'ArrowUp' : 'ArrowDown' } : { click: { spin: 'value' } };
    return { click: { spin: dir } };
  }

  function solveOf(spec, model) {
    const v = spec.scenario;
    if (isTyped(spec)) return { ...model, field: spec.answer };
    if (v === 'unicode') return { ...model, clicked: spec.items.findIndex((x) => x.type === 'button' && x.label === spec.target) };
    if (v === 'scroll-text') {
      if (spec.mode === 'edge') return { ...model, scroll: spec.goal === 'top' ? 0 : maxScroll(spec) };
      return { ...model, field: spec.answer };
    }
    if (v === 'sign-agreement') {
      const name = spec.mode === 'decline' ? model.name : spec.name;
      return { ...model, scroll: maxScroll(spec), unlocked: true, name, pressed: signGoal(spec), signed: name };
    }
    if (v === 'edit') return { ...model, values: spec.fields.map((f) => f.target) };
    if (v === 'find') return { ...model, sel: { ...spec.want } };
    return { ...model, value: spec.target, hold: null };
  }

  function endedOf(model, spec) {
    if (spec.scenario !== 'sign-agreement' && !(spec.scenario === 'unicode' && spec.mode === 'button')) return null;
    return (model.wrongs || 0) >= (spec.recoverable ? 2 : 1) ? 'wrong-choice' : null;
  }

  // Press-and-hold auto-repeat on the kit clock (spinner).
  function tickOf(model, spec, dt, now) {
    if (spec.scenario !== 'spinner' || !model.hold) return model;
    const h = model.hold;
    const el = now - h.since;
    const due = el < HOLD.delay ? 0 : Math.floor((el - HOLD.delay) / HOLD.rate) + 1;
    if (due <= h.n) return model;
    let value = model.value + h.dir * (due - h.n);
    if (spec.min !== null) value = Math.max(spec.min, value);
    if (spec.max !== null) value = Math.min(spec.max, value);
    return { ...model, value, hold: { ...h, n: due } };
  }

  Object.assign(lib, { visible, levenshtein, dist, wordDist, fmtSpin, maxScroll, LINE_PX, wordOnly, squash });

  // ---------------------------------------------------------------- task

  const SCENARIOS = ['copy-paste', 'copy-paste-2', 'unicode', 'scroll-text', 'sign-agreement', 'spinner', 'edit', 'find'];

  env.task({
    name: 'handle-text',
    scenarios: SCENARIOS,
    files: ['sampling.js', 'judge.js', 'instructions.js',
      'scenarios/copy-paste.js', 'scenarios/copy-paste-2.js', 'scenarios/unicode.js', 'scenarios/scroll-text.js',
      'scenarios/sign-agreement.js', 'scenarios/spinner.js', 'scenarios/edit.js', 'scenarios/find.js'],
    lib,
    startModes: ['off', 'partial', 'wrong', 'solved', 'scene'],
    judgeModes: ['ambiguous', 'impossible'],
    inputs: ['pointer', 'keyboard', 'wheel'],
    tickMs: 50,

    helpers: { scrolled, maxScroll, copyText, fmtSpin, parseSpin, isCopy, signCorrect, buttonCorrect, wrongPending },

    sample(rng, opts) {
      const list = opts.scenarios && opts.scenarios.length ? opts.scenarios : this.scenarios;
      const scenario = opts.scenario || rng.pick(list);
      const base = { scenario, title: '', isplit: opts.isplit || 'train', csplit: opts.csplit || 'train', ood: !!opts.ood, startMode: opts.startMode || 'off' };
      const spec = { ...base, ...env.scenariosOf('handle-text')[scenario].sample(rng, base, opts) };
      const lv = opts.level === 'easy' ? 1 : opts.level === 'medium' ? 0.5 : 0;
      if (lv) lib.levelAdjust(spec, lv, rng.fork('level'));
      forceRoute(spec, opts.route);
      if (this.judgeModes.includes(opts.judge)) spec.judge = lib.judgeOf(rng.fork('judge'), spec, opts.judge);
      return spec;
    },

    // ambiguous / impossible start solved (nothing to change); the normal start supplies the unscored fields
    init: (spec, rng) => (spec.judge ? solveOf(spec, initModel({ ...spec, judge: undefined, startMode: 'off' }, rng)) : initModel(spec, rng)),
    error: errorOf,
    tolerance: toleranceOf,
    facts: factsOf,
    silent: (next, prev, spec, rng) => (spec.judge ? null : silentOf(next, prev, spec, rng)),
    retarget: retargetOf,
    instruction: (spec, rng) => (spec.judge ? lib.judgeInstruction(spec, rng) : lib.instructionOf(spec, rng)),
    plan: planOf,
    solve: solveOf,
    ended: endedOf,
    tick: tickOf,

  });
})();
