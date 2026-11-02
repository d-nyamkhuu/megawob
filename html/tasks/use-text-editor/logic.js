/*
 * use-text-editor: place the cursor, edit, find and replace, and review changes in a text editor.
 * Precise text editing in an editor the page implements itself (no contenteditable): a code editor
 * (widget 'classic', Monaco / VS Code-like: line numbers, gutter, syntax colouring, minimap, status bar with Ln / Col)
 * and a rich-text document editor (widget 'rich', Docs-like: toolbar, Editing / Suggesting / Viewing modes, suggestion
 * cards).
 *
 * The task owns the editor model (text buffer, cursors and selections, undo, clipboard, completion popup,
 * find widget, tracked changes); the widgets only draw it and map pointer and key events to the engine below, so the
 * state is exact and the oracle plan runs through the same functions.
 * inputs: pointer (click, shift-click, alt-click, double / triple click, drag selection), keyboard (typing, arrows,
 * Home / End, Shift+arrows, Tab / Shift+Tab, Enter with auto-indent, Backspace / Delete, Control+/ ] [ Z Y A C X V F H,
 * Control+Shift+K, Control+Alt+ArrowDown / ArrowUp, Escape).
 *
 * scenarios (widgets: classic = code: cursor, multiline, multicursor, findreplace, autocomplete; rich = prose: cursor,
 * findreplace, trackchanges; the widget's traits.doc says which)
 *   cursor        put the caret at an exact spot and type: after / before a token on a line, at the end of a line,
 *                 at "Ln L, Col C" (the status bar shows Ln / Col), after a unique token; prose: add a word after a
 *                 word of the k-th paragraph. ~40% of code episodes have the completion popup on (spec.suggest).
 *   multiline     select an exact line range (route drag, shift-click or Shift+ArrowDown) and comment it out,
 *                 uncomment it, indent it (under-indented if-body), outdent it (over-indented statements) or delete
 *                 it (debug lines)
 *   multicursor   one edit on several lines at once: a prefix at the same column (route Control+Alt+ArrowDown or
 *                 alt-click), a suffix at the line ends (cursors, then End), "await " before calls at different
 *                 columns (alt-click only)
 *   findreplace   the find widget (Control+F / Control+H or its button; Aa = match case, ab = whole word, prev /
 *                 next, Replace, Replace All): mode 'all' replaces every whole-word, case-sensitive occurrence while
 *                 substring and case distractors stay; mode 'some' replaces only the occurrences on the given lines
 *                 (code) or in the given paragraph (prose)
 *   autocomplete  add one or two new lines after line L while a completion popup (identifiers of the file and
 *                 keywords) opens on every word and steals Enter / Tab; the first line ends in a word that prefixes
 *                 other identifiers, so Enter there would accept a completion instead of breaking the line
 *   trackchanges  (rich) goal 'review': accept / reject the named suggestions of other authors and leave the rest;
 *                 goal 'suggest': switch to Suggesting and insert, delete or replace a word as a suggestion
 *
 * spec   { scenario, doc ('code' | 'prose'), lang ('js' | 'py' | 'en'), unit, tok, isplit, csplit, ood, level,
 *          startMode, suggest, base (start text, code) | doc0 (start runs, prose), target (the target buffer as
 *          a string; prose: serialized with ⟨+inserted⟩ / ⟨-deleted⟩ marks), doc1 (prose target runs), goal, d0,
 *          names, judge? }
 *   goal kinds: insert { at, text, ref }, lines { op, a, b, route }, multi { op, lines, cols, text, route },
 *          find { x, y, mode, want: [[a, b]], mc, ww, where, route }, review { want: { id: 'accept' | 'reject' } },
 *          suggest { op ('insert' | 'delete' | 'replace'), a, b, word, text }
 * model  code: { text, cur: [{ h, a }] (head / anchor offsets; cur[0] is the primary cursor), focus (null |
 *          'editor' | 'query' | 'repl'), pop (null | { a, o, items, sel }), find (null | { open, rep, query, repl,
 *          mc, ww, pos }), hist / fut (undo / redo snapshots), clip, op, dcol }
 *        prose: { doc: [[{ t, k: 'b' | 'i' | 'd', a?, id? }]] (paragraphs of runs; k = base / inserted / deleted),
 *          cur, focus, mode ('edit' | 'suggest' | 'view'), menu, find, hist, fut, seq, clip, op }
 *        Offsets are positions in the flat text: code text, or the paragraphs' display text (deleted runs included)
 *        joined by '\n'.
 * error  Levenshtein distance between the buffer (prose: serialized with suggestion marks) and spec.target, after
 *        stripping the common prefix and suffix; tau 0, sigma max(2, d0 / 2), so partial progress counts. multiline
 *        with the buffer untouched: that x (1 - 0.5 x the Jaccard of the selected line range and the goal's lines).
 * start modes: off; partial (half the text typed, the first line of a range done or the range selected, some
 *        cursors' lines done, some occurrences replaced or the widget filled in, one review decision made, the
 *        mode switched); wrong (text typed on another line / after another token, a shifted line range, a line
 *        too many, Replace All without the options, a wrong review decision, a direct edit instead of a
 *        suggestion: every wrong start is on the page's undo stack); solved.
 * judge modes (judgeModes; every scenario builds both; the page is left as it is): ambiguous (the token, call,
 *        line content or author occurs twice and nothing says which), impossible (a line / paragraph beyond the
 *        end, a find text that is not in the file, an author with no suggestion). spec.judge = { mode, message, text, cands,
 *        others, what }: ambiguous: the reply asks (free text: a question) with one option per place the request could apply
 *        to (cands: code: the line number and the line's text when unique, the other lines are others; prose: stretches of
 *        2-4 words around each place that occur nowhere else in the document, the paragraph when each has its own;
 *        suggestions: their words and author, the other authors' suggestions are others); impossible: the reply names the
 *        missing thing (what: the absent line, text, paragraph or author).
 *
 * plan targets (widget locate())
 *   { pos: o }                      the caret boundary before flat offset o (a click there puts the caret at o)
 *   { find: 'open' | 'expand' | 'query' | 'repl' | 'case' | 'word' | 'prev' | 'next' | 'one' | 'all' | 'close' }
 *   { pop: i }                      completion item i
 *   { sug: id, act: 'accept' | 'reject' }   a suggestion card's button (prose)
 *   { mode: 'menu' | 'edit' | 'suggest' | 'view' }   the mode dropdown and its items (prose)
 *   { undo: true }                  the toolbar undo button (prose)
 * plan steps: generic repair = the first hunk of a character alignment (click / shift-click to place or select,
 *   type one character or press Delete; Escape first while extra cursors or a popup would eat Enter / Tab);
 *   Control+Z first whenever undoing lowers the error; lines: select per route, then Tab / Shift+Tab /
 *   Control+] / Control+[ / Control+/ / Delete / Control+Shift+K per uniform group of lines; multi: cursors per
 *   route, then the text; find: open, type query / replacement ({ type }), toggles, then Replace All or Replace /
 *   Next per match; review: card buttons; suggest: mode menu, then click / double-click and type or Backspace.
 *
 * hooks
 *   facts(model, spec)       code: line count (gutter / status bar), cursor line and column ("Ln L, Col C" in the status bar), language; prose: word
 *                            count, open suggestions, mode (all shown in the status bar / toolbar)
 *   silent(next, prev, ...)  one cursor's line of a multi-line change reverted (an edit applied to one cursor
 *                            fewer, one occurrence missed by Replace All, one line of a block skipped), else the
 *                            update dropped (the autosave lost the last keystroke / the decision did not stick)
 *   retarget(spec, model)    a new insert goal (a text after a unique token on a line / word of a paragraph) on
 *                            the current buffer; prose review: new decisions on the suggestions still open
 * The self-test lives in selftest.js; shared internals are in lib, loaded by files below.
 * Helpers (widget API, env.taskDef.helpers):
 *   lc(text, offset): zero-based line and column.
 *   offOf(text, line, column): flat text offset.
 *   lines(text): text split into lines.
 *   keyDown(model, spec, key): updated model and handled flag.
 *   pointerDown(model, spec, offset, options): caret, selection or extra cursor.
 *   pointerDrag(model, spec, anchor, head): drag selection.
 *   findOp(model, spec, operation, argument): find/replace widget command.
 *   popPick(model, spec, index): accept a completion.
 *   review(model, spec, id, action): accept or reject a suggestion.
 *   setMode(model, spec, mode): set the document editing mode.
 *   toggleMenu(model): toggle the mode menu.
 *   undo(model, spec): restore the preceding undo snapshot.
 *   redo(model, spec): restore the next redo snapshot.
 *   focusTo(model, target): change editor/find focus.
 *   matches(model, spec): matching find ranges.
 *   currentMatch(model, spec): active find range.
 *   suggestions(doc): attributed open suggestion records.
 *   wordCount(doc): visible word count.
 *   keyFromEvent(event): normalize a DOM keyboard event.
 *   KEYWORDS: completion keywords by language.
 *   lo(cursor): lower selection offset.
 *   hi(cursor): upper selection offset.
 *   MODE_LABEL: displayed labels by editing mode.
 *   LANG_LABEL: displayed labels by code language.
 */
(function () {
  'use strict';
  const lib = {};

  env.task({
    name: 'use-text-editor',
    files: ['buffer.js', 'commands.js', 'sampling.js', 'judge.js', 'model.js', 'instructions.js', 'oracle.js', 'reporting.js',
      'scenarios/cursor.js', 'scenarios/multiline.js', 'scenarios/multicursor.js', 'scenarios/findreplace.js', 'scenarios/autocomplete.js', 'scenarios/trackchanges.js'],
    scenarios: ['cursor', 'multiline', 'multicursor', 'findreplace', 'autocomplete', 'trackchanges'],
    startModes: ['off', 'partial', 'wrong', 'solved'],
    judgeModes: ['ambiguous', 'impossible'],
    inputs: ['pointer', 'keyboard'],
    lib,
    helpers: {},
    sample(...args) { return lib.sample(...args); },
    init(...args) { return lib.initModel(...args); },
    error(...args) { return lib.errorOf(...args); },
    tolerance(...args) { return lib.toleranceOf(...args); },
    instruction(...args) { return lib.instructionOf(...args); },
    plan(...args) { return lib.planOf(...args); },
    solve(...args) { return lib.solveOf(...args); },
    facts(...args) { return lib.factsOf(...args); },
    silent(...args) { return lib.silentOf(...args); },
    retarget(...args) { return lib.retargetOf(...args); },
  });
})();
