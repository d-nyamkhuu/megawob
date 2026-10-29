/* use-text-editor/instructions.js: Instruction wording and template selection. */
(function () {
  'use strict';
  const task = env.taskOf('use-text-editor');
  const { lib } = task;


  // A typed text in words: leading / trailing spaces said out loud.
  function spoken(t) {
    const core = t.trim();
    if (t.startsWith(' ') && !t.endsWith(' ')) return `a space and then "${core}"`;
    if (t.endsWith(' ') && !t.startsWith(' ')) return `"${core}" followed by a space`;
    return `"${t}"`;
  }
  function listOf(xs) {
    const s = xs.map(String);
    return s.length <= 1 ? s.join('') : `${s.slice(0, -1).join(', ')} and ${s[s.length - 1]}`;
  }
  const rangeOf = (a, b) => (a === b ? `line ${a + 1}` : `lines ${a + 1}-${b + 1}`);

  function sayIt(rng, spec, templates, vars) {
    const core = lib.I.phrase(rng, templates, vars, spec.isplit);
    return lib.I.say(rng, core, { isplit: spec.isplit });
  }

  function instructionOf(spec, rng) {
    if (spec.judge) return lib.I.say(rng, spec.judge.text, { isplit: spec.isplit });
    const g = spec.goal;
    if (g.kind === 'insert') {
      const r = g.ref || {};
      const t = spoken(g.text);
      if (r.by === 'after-line') {
        const L = r.line + 1;
        if (r.stmts.length === 1) {
          return sayIt(rng, spec, ['Add a new line after line {L} that reads "{s1}", indented like line {L}.',
            'Insert the line "{s1}" right below line {L}, with the same indentation as line {L}.',
            'Below line {L}, add a line "{s1}" at the same indentation.'], { L, s1: r.stmts[0] });
        }
        return sayIt(rng, spec, ['Add two new lines after line {L}, indented like it: "{s1}" and then "{s2}".',
          'Below line {L}, insert the line "{s1}" and under it the line "{s2}", both indented like line {L}.',
          'Right after line {L}, add "{s1}" on a new line, then "{s2}" on the next one, same indentation as line {L}.',
          'Make room below line {L} for two lines: first "{s1}", then "{s2}". Match its indentation.'],
        { L, s1: r.stmts[0], s2: r.stmts[1] });
      }
      if (lib.isProse(spec)) {
        const P = lib.ORD[r.para];
        const w = r.word;
        if (r.by === 'before') {
          return sayIt(rng, spec, ['In the {P} paragraph, add the word "{w}" right before "{tok}".',
            'Insert "{w}" just before "{tok}" in the {P} paragraph.'], { P, w, tok: r.tok });
        }
        return sayIt(rng, spec, ['In the {P} paragraph, add the word "{w}" right after "{tok}".',
          'Insert "{w}" just after "{tok}" in the {P} paragraph.', 'Type the word "{w}" after "{tok}" in the {P} paragraph.',
          'In the {P} paragraph, follow "{tok}" with a space and "{w}".',
          'In the {P} paragraph, change "{tok}" into "{tok} {w}".',
          'Expand the {P} paragraph with "{w}" just after "{tok}".'],
        { P, w, tok: r.tok });
      }
      const L = (r.line ?? 0) + 1;
      if (r.by === 'eol') return sayIt(rng, spec, ['At the end of line {L}, type {t}.', 'Go to the end of line {L} and add {t}.'], { L, t });
      if (r.by === 'lncol') {
        return sayIt(rng, spec, ['Put the cursor at Ln {L}, Col {C} and type {t}.',
          'Place the caret at line {L}, column {C} (the status bar shows Ln / Col) and type {t}.'], { L, C: r.col + 1, t });
      }
      if (r.by === 'unique') return sayIt(rng, spec, ['Type {t} right after "{tok}".', 'Add {t} immediately after "{tok}".'], { t, tok: r.tok });
      if (r.by === 'before') {
        return sayIt(rng, spec, ['On line {L}, type {t} right before "{tok}".', 'Put the cursor just before "{tok}" on line {L} and type {t}.'],
          { L, t, tok: r.tok });
      }
      return sayIt(rng, spec, ['On line {L}, type {t} right after "{tok}".', 'Put the cursor right after "{tok}" on line {L} and type {t}.',
        'In line {L}, add {t} directly after "{tok}".',
        'Follow "{tok}" on line {L} directly with {t}.',
        'Find "{tok}" on line {L}, type {t} just after it.'], { L, t, tok: r.tok });
    }
    if (g.kind === 'lines') {
      const vars = { range: rangeOf(g.a, g.b), tok: spec.tok, unit: spec.unit };
      const T = {
        comment: ['Comment out {range}: put "{tok} " in front of the code on each line, keeping the indentation.',
          'Turn {range} into line comments ("{tok} " before the code, indentation kept).'],
        uncomment: ['Uncomment {range} (remove the "{tok} " in front of the code).', 'Remove the line comments from {range} so the code runs again.'],
        indent: ['Indent {range} by one level ({unit} spaces).', 'Add one level of indentation ({unit} spaces) to {range}.'],
        outdent: ['Outdent {range} by one level ({unit} spaces).', 'Remove one level of indentation ({unit} spaces) from {range}.'],
        delete: ['Delete {range}.', 'Remove {range} entirely, lines and all.'],
      }[g.op];
      return sayIt(rng, spec, T, vars);
    }
    if (g.kind === 'multi') {
      const vars = { list: `${g.lines.length > 1 ? 'lines' : 'line'} ${listOf(g.lines.map((l) => l + 1))}`, t: spoken(g.text), fetch: spec.names.fetch,
        x: g.text };
      if (g.op === 'await') return sayIt(rng, spec, ['Put {t} in front of each "{fetch}(" call on {list}.', 'Add {t} before the "{fetch}" calls on {list}.'], vars);
      if (g.op === 'suffix') return sayIt(rng, spec, ['Add {t} at the end of {list}.', 'Append {t} to the end of each of {list}.'], vars);
      if (g.text.endsWith('_')) {
        return sayIt(rng, spec, ['Put "{x}" in front of the names on {list}.', 'Prefix the variable names on {list} with "{x}".'], vars);
      }
      return sayIt(rng, spec, ['Add {t} at the start of {list}.', 'Prefix each of {list} with {t}.'], vars);
    }
    if (g.kind === 'find') {
      const vars = { x: g.x, y: g.y, where: g.lines ? `${g.lines.length > 1 ? 'lines' : 'line'} ${listOf(g.lines.map((l) => l + 1))}` : `the ${lib.ORD[g.para]} paragraph` };
      if (g.mode === 'some') {
        return sayIt(rng, spec, ['On {where} only, replace the whole word "{x}" (exact case) with "{y}".',
          'Replace "{x}" with "{y}" on {where} only: whole words with exactly that case; leave every other "{x}" alone.'], vars);
      }
      return sayIt(rng, spec, ['Replace every "{x}" with "{y}": whole words with exactly that case only, so longer words that contain it stay as they are.',
        'Rename "{x}" to "{y}" wherever it appears as a whole word with exactly that case.'], vars);
    }
    if (g.kind === 'review') {
      if (g.how === 'author') {
        const v = g.act === 'accept' ? 'Accept' : 'Reject';
        return sayIt(rng, spec, ['{v} all of {A}\'s suggestions and leave the others open.', '{v} every suggestion {A} made; do not touch the other suggestions.'],
          { v, A: g.author });
      }
      const phr = (it) => {
        const s = it.short.replace(/^the /, `${it.author}'s `);
        return `${it.act} ${s}`;
      };
      const core = `${lib.cap(listOf(g.items.map(phr)))}.`;
      return lib.I.say(rng, `${core} Leave the other suggestions as they are.`, { isplit: spec.isplit });
    }
    if (g.kind === 'suggest') {
      const vars = { w: g.add, word: g.word, P: lib.ORD[g.para] };
      if (g.op === 'insert') {
        return sayIt(rng, spec, ['Switch to Suggesting mode and add "{w}" right before "{word}" in the {P} paragraph.',
          'As a suggestion (not a direct edit), insert the word "{w}" before "{word}" in the {P} paragraph.'], vars);
      }
      if (g.op === 'delete') {
        return sayIt(rng, spec, ['In Suggesting mode, delete the word "{word}" in the {P} paragraph.',
          'Suggest deleting "{word}" from the {P} paragraph (a suggestion, not a direct edit).'], vars);
      }
      return sayIt(rng, spec, ['In Suggesting mode, replace "{word}" with "{w}" in the {P} paragraph.',
        'Suggest changing "{word}" to "{w}" in the {P} paragraph (a suggestion, not a direct edit).'], vars);
    }
    return 'Edit the text.';
  }

  // ---------------------------------------------------------------- plan

  Object.assign(lib, { spoken, listOf, instructionOf });
})();
