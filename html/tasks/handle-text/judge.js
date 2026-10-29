/* handle-text/judge.js: shared judge; private task lib. */
(function () {
  'use strict';
  const lib = env.taskOf('handle-text').lib;
  const C = env.content;
  const I = env.instruct;
  const { quote: q } = env.util;

  const GHOST_TITLES = [...lib.TITLES, 'Invoice', 'Contract', 'Agenda', 'Receipt', 'Policy', 'Report', 'Notes', 'Label', 'Phrase', 'Caption',
    'Sign', 'Greeting', 'Attendees', 'Contacts', 'Guest list', 'Items', 'Order lines', 'Addresses', 'Stops', 'Locations', 'Email', 'Confirmation', 'Sticky note'];

  const GHOST_FIELDS = ['Subject', 'Title', 'Signature', 'Footer', 'Address', 'Nickname', 'Search', 'Comments', 'Subject line', 'Company',
    'Paste here', 'Your text', 'Copied text', 'Response', 'Your entry', 'Input', 'Value', 'Word', 'Found word', 'Description', 'Reply', 'Email body',
    'Password', 'Department', 'Job role', 'Time zone', 'Due date', 'Start time', 'Duration', 'File name',
    'Folder path', 'Attachment', 'Author', 'Recipient', 'Page number', 'Revision', 'Priority', 'Status', 'Color',
    'Width', 'Height', 'Destination', 'Salutation', 'File format', 'Capacity', 'Material', 'Ingredients',
    'Room number', 'Seat number', 'Weather', 'Language', 'Music genre', 'Paper size', 'Font family', 'Frame rate',
    'Minimum age', 'Pet breed', 'Soil type', 'Elevation', 'Map scale', 'Shoe size', 'Musical key', 'Roast level',
    'Crust style', 'Knot type', 'Humidity', 'Rainfall', 'Tide level', 'Cabin class', 'Leaf shape', 'Roof pitch',
    'Fuel type'];

  const ABSENT_PHRASES = ['invoice', 'order', 'ticket', 'section', 'case', 'batch'];

  const lead = (s, n = 4) => String(s).split(/\s+/).slice(0, n).join(' ').replace(/[.,;:!?]+$/, '');

  const norm = (t) => String(t).normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[‘’ʼ]/g, "'").replace(/[^a-z0-9À-￿]+/g, ' ').trim();

  const freshOf = (jr, pool, taken) => {
    const t = new Set(taken.map((x) => String(x).toLowerCase()));
    const free = pool.filter((x) => !t.has(String(x).toLowerCase()));
    return jr.pick(free.length ? free : pool.map((x) => `${x} 2`));
  };

  // Word stretches of `text` (1-4 words, as a reply is compared) that none of the other texts has: what tells it apart.
  function ownSpans(text, others, max = 8) {
    const hay = others.map((o) => ` ${norm(o)} `);
    const toks = norm(text).split(' ').filter(Boolean);
    const out = [];
    for (const lens of [[2, 3, 4], [1]]) {
      for (const len of lens) {
        for (let i = 0; i + len <= toks.length; i++) {
          const sp = toks.slice(i, i + len).join(' ');
          if (!out.includes(sp) && !hay.some((h) => h.includes(` ${sp} `))) out.push(sp);
        }
      }
      if (out.length) break;
    }
    return out.slice(0, max);
  }

  // Stretches of 2-4 words around the occurrence [a, b) of `doc` that occur once in the whole document.
  function placeSpans(doc, a, b, max = 8) {
    const toks = [];
    const re = /[A-Za-z0-9]+/g;
    let mm;
    while ((mm = re.exec(doc))) toks.push({ w: mm[0].toLowerCase(), a: mm.index, b: mm.index + mm[0].length });
    const hay = ` ${toks.map((t) => t.w).join(' ')} `;
    const out = [];
    for (let len = 2; len <= 4; len++) {
      for (let i = 0; i + len <= toks.length; i++) {
        if (!(toks[i + len - 1].b > a && toks[i].a < b)) continue;
        const sp = toks.slice(i, i + len).map((t) => t.w).join(' ');
        const first = hay.indexOf(` ${sp} `);
        if (first >= 0 && hay.indexOf(` ${sp} `, first + 1) < 0 && !out.includes(sp)) out.push(sp);
      }
    }
    return out.slice(0, max);
  }

  const numNames = (n, noun) => [`${noun} ${n}`, `${noun}s ${n}`, String(n)];

  // Two boxes with the same title: the first stays the wanted one (box indexes and offsets are unchanged).
  function twinBox(jr, spec) {
    const w = spec.want.box;
    const title = spec.boxes[w].title;
    let j;
    if (spec.boxes.length < 2) {
      const text = spec.scenario === 'unicode' ? lib.unicodeText(jr) : jr.pick(lib.sentences(spec).filter((s) => s.length <= 95 && s !== spec.boxes[w].text));
      spec.boxes = [...spec.boxes, { title, text }];
      j = spec.boxes.length - 1;
    } else {
      j = spec.boxes.map((_, i) => i).filter((i) => i !== w)[0];
      spec.boxes = spec.boxes.map((b, i) => (i === j ? { ...b, title } : b));
    }
    if (spec.scenario === 'copy-paste') spec.refBy = 'title';
    return { title, a: w, b: j };
  }

  // spec.judge = { mode, message, cands, others, what, tpl, vars, patch, terse }. The request is the task's own wording:
  // either the normal instruction of the (changed) page, or of a patched spec (impossible: the missing name), or a normal
  // template with both alternatives in the slot (tpl, vars: "the second or third sentence"). The reply is graded from the data:
  // ambiguous: one option per cands entry (what tells the place apart on the page), none naming an others entry; impossible:
  // what names the missing thing.
  function ambiguousOf(jr, spec) {
    const v = spec.scenario;
    const mk = (cands, extra = {}) => ({ mode: 'ambiguous', cands, others: [], ...extra });
    if (v === 'copy-paste' || (v === 'unicode' && spec.mode === 'copy')) {
      const { title, a, b } = twinBox(jr, spec);
      const ta = spec.boxes[a].text;
      const tb = spec.boxes[b].text;
      const rest = spec.boxes.filter((_, i) => i !== a && i !== b).map((x) => x.text);
      const sa = ownSpans(ta, [tb, ...rest]);
      const sb = ownSpans(tb, [ta, ...rest]);
      const others = [...new Set(spec.boxes.map((x) => x.title).filter((x) => x !== title))].map((x) => [x]);
      return mk(sa.length && sb.length ? [sa, sb] : [[title], [title]], { others, message: `Which one do you mean: two boxes are titled "${title}"?` });
    }
    if (v === 'copy-paste-2') {
      if (spec.mode === 'value') {
        const key = spec.label;
        const code = lib.codeValue(jr, key);
        const b = spec.boxes[0];
        const line = `${lib.VALUE_LABELS[key]}: ${code}`;
        const others = b.lines.slice(1).map((l) => l.slice(l.indexOf(': ') + 2)).filter((x) => x && x !== spec.answer && x !== code).map((x) => [x]);
        spec.boxes = [{ ...b, text: `${b.text}\n${line}`, lines: [...b.lines, line] }];
        return mk([[spec.answer], [code]], { others, message: `Which one do you mean: the message lists the ${key} twice?` });
      }
      const n = spec.mode === 'line' ? spec.boxes[0].lines.length : Math.max(spec.k + 2, 3);
      let k2;
      do k2 = jr.int(0, n - 1); while (k2 === spec.k);
      const noun = spec.mode === 'line' ? 'line' : 'sentence';
      const ords = (k) => [lib.ORD[k], lib.ORDN[k], ...numNames(k + 1, noun)];
      const lineText = (k) => (spec.mode === 'line' ? ownSpans(spec.boxes[0].lines[k], spec.boxes[0].lines.filter((_, i) => i !== k), 3) : []);
      const others = lib.ORD.map((_, k) => k).filter((k) => k !== spec.k && k !== k2).map((k) => ords(k));
      const message = `Which ${noun} should I copy: the ${lib.ORD[spec.k]} or the ${lib.ORD[k2]}?`;
      const box = spec.boxes[0];
      const note = spec.mode === 'line' && box.numbered ? ' (without the line number)' : '';
      const which = spec.mode === 'line' ? (box.numbered ? `line ${spec.k + 1} or ${k2 + 1}` : `the ${lib.ORD[spec.k]} or ${lib.ORD[k2]} line`) : '';
      return mk([[...ords(spec.k), ...lineText(spec.k)], [...ords(k2), ...lineText(k2)]], {
        others, message, terse: `${lib.ORD[spec.k]} or ${lib.ORD[k2]} ${noun}`,
        ...(spec.mode === 'line'
          ? { tpl: 'line', vars: { which, t: box.title.toLowerCase(), note } }
          : { tpl: 'sentence', vars: { ord: `${lib.ORD[spec.k]} or ${lib.ORD[k2]}`, n: `${spec.k + 1} or ${k2 + 1}`, t: box.title.toLowerCase() } }) });
    }
    if (v === 'unicode' && spec.mode === 'type') {
      let b;
      do b = lib.unicodeText(jr); while (b === spec.answer);
      return mk([[spec.answer], [b]], { tpl: 'utype', vars: { a: `${q(spec.answer)} or ${q(b)}` }, terse: `${q(spec.answer)} or ${q(b)}`,
        message: `Which text should I type: ${q(spec.answer)} or ${q(b)}?` });
    }
    if (v === 'unicode') {
      const buttons = spec.items.map((it, i) => (it.type === 'button' && it.label !== spec.target ? i : -1)).filter((i) => i >= 0);
      const j = jr.pick(buttons);
      spec.items = spec.items.map((it, i) => (i === j ? { ...it, label: spec.target } : it));
      const others = [...new Set(spec.items.filter((it) => it.type === 'button' && it.label !== spec.target).map((it) => it.label))].map((x) => [x]);
      return mk([[spec.target], [spec.target]], { others, message: `Which one do you mean: two buttons are labeled ${q(spec.target)}?` });
    }
    if (v === 'scroll-text') {
      if (spec.mode === 'edge') {
        return mk([['top'], ['bottom']], { tpl: 'edge', vars: { g: 'top or bottom' }, terse: 'scroll to the top or bottom', message: 'Which end should I scroll to: the top or the bottom?' });
      }
      const n = spec.lines.length;
      const A = spec.line + 1;
      let B;
      do B = jr.int(1, n); while (B === A);
      const others = Array.from({ length: n }, (_, i) => i + 1).filter((k) => k !== A && k !== B).map((k) => numNames(k, 'line'));
      return mk([numNames(A, 'line'), numNames(B, 'line')], { others, tpl: 'sline', vars: { w: spec.which, n: `${A} or ${B}` },
        terse: `line ${A} or ${B}, ${spec.which} word`, message: `Which line should I read: line ${A} or line ${B}?` });
    }
    if (v === 'sign-agreement') {
      if (spec.mode === 'decline') {
        const name = C.personName(jr, C.csplitOf(spec)).first;
        return mk([['agree', 'accept'], ['cancel', 'decline']], { tpl: 'sign', vars: { n: q(name), b: '"Agree" or "Cancel"' },
          terse: `sign as ${q(name)}, Agree or Cancel`, message: 'Should I agree to the agreement or decline it?' });
      }
      const p = C.personName(jr, C.csplitOf(spec));
      const full = spec.name.includes(' ');
      const alt = full ? p.full : p.first;
      const btn = spec.mode === 'agree' ? 'Agree' : 'Cancel';
      return mk([[spec.name], [alt]], { tpl: 'sign', vars: { n: `${q(spec.name)} or ${q(alt)}`, b: q(btn) },
        terse: `sign as ${q(spec.name)} or ${q(alt)}, ${btn}`, message: `Which name should I enter: ${q(spec.name)} or ${q(alt)}?` });
    }
    if (v === 'spinner') {
      const lo = spec.min === null ? -Infinity : spec.min;
      const hi = spec.max === null ? Infinity : spec.max;
      const ok = (t) => (t >= lo && t <= hi);
      let t2;
      for (let k = 0; k < 60; k++) {
        t2 = spec.target + (jr.bool() ? 1 : -1) * jr.int(3, 14);
        if (ok(t2)) break;
      }
      const a = lib.fmtSpin(spec, spec.target);
      const b = lib.fmtSpin(spec, t2);
      const forms = (x) => [x, `${x}${spec.unit}`, `${x} ${spec.unit}`].filter((w) => w.trim());
      const shown = (x) => x + (spec.unit ? ` ${spec.unit}` : '');
      // the neighbouring values are what a number list would hit
      const others = [];
      for (let d = -40; d <= 40; d++) {
        const t = spec.target + d;
        if (d !== 0 && t !== t2 && ok(t)) others.push(forms(lib.fmtSpin(spec, t)));
      }
      return mk([forms(a), forms(b)], { others, tpl: 'spin', vars: { val: `${shown(a)} or ${shown(b)}` }, terse: `${spec.label}: ${shown(a)} or ${shown(b)}`,
        message: `Which value should I set: ${shown(a)} or ${shown(b)}?` });
    }
    if (v === 'edit') {
      const f0 = spec.fields[0];
      const word = jr.pick(['also', 'still', 'often', 'really', 'just']);
      // A word the field text has twice: the place is told apart by the words around it (nothing the instruction says).
      // A text without one gets a closing clause that repeats one of its words.
      const twice = (text) => {
        const re = /[A-Za-z]{2,}/g;
        const seen = new Map();
        let mm;
        while ((mm = re.exec(text))) seen.set(mm[0].toLowerCase(), [...(seen.get(mm[0].toLowerCase()) || []), [mm.index, mm.index + mm[0].length]]);
        return [...seen].filter(([, at]) => at.length === 2).map(([w, at]) => ({ w, at }))
          .filter((t) => t.at.every(([a, b]) => placeSpans(text, a, b).length));
      };
      let text = String(f0.target || f0.value);
      let pick = twice(text);
      if (!pick.length) {
        // repeat a word the text has once (one it already has twice or more would then stand three times)
        const words = text.match(/[A-Za-z]{4,}/g) || [];
        const once = [...new Set(words)].filter((x) => words.filter((y) => y.toLowerCase() === x.toLowerCase()).length === 1);
        for (const w of jr.shuffle(once.length ? once : [...new Set(words)])) {
          const tail = ` Please check the ${w} again.`;
          if (!twice(text + tail).length) continue;
          spec.fields = spec.fields.map((f, i) => (i ? f : { ...f, target: String(f.target) + tail, ...(typeof f.value === 'string' ? { value: f.value + tail } : {}) }));
          text += tail;
          break;
        }
        pick = twice(text);
        if (!pick.length) return null;
      }
      const t = jr.pick(pick);
      return mk(t.at.map(([a, b]) => placeSpans(text, a, b)), { tpl: 'insert', vars: { w: q(word), a: q(t.w), f: q(f0.label) },
        terse: `${f0.label}: add ${q(word)} before ${q(t.w)}`, message: `"${t.w}" appears twice in the ${f0.label} field. Which one do you mean?` });
    }
    // find: the phrase also stands in another paragraph (the first occurrence stays the wanted one)
    const others0 = spec.paragraphs.map((_, i) => i).filter((i) => i !== spec.para);
    const j = jr.pick(others0);
    const paragraphs = spec.paragraphs.map((p, i) => (i === j ? `${p} ${spec.phrase}.` : p));
    const doc = paragraphs.join('\n\n');
    const start = doc.indexOf(spec.phrase);
    let para = 0;
    for (let acc = 0; para < paragraphs.length; para++) {
      acc += paragraphs[para].length + 2;
      if (start < acc) break;
    }
    Object.assign(spec, { paragraphs, doc, para, want: { start, end: start + spec.phrase.length } });
    const second = doc.indexOf(spec.phrase, start + 1);
    const paraAt = (o) => { let acc = 0; for (let i = 0; i < paragraphs.length; i++) { acc += paragraphs[i].length + 2; if (o < acc) return i; } return paragraphs.length - 1; };
    const at = [[start, para], [second, paraAt(second)]];
    const place = (n) => [...numNames(n + 1, 'paragraph'), `para ${n + 1}`, `${lib.ORD[n]} paragraph`];
    const sorted = at.sort((x, y) => x[0] - y[0]);
    const cands = sorted.map(([o, pi]) => [...place(pi), ...placeSpans(doc, o, o + spec.phrase.length)]);
    const others = paragraphs.map((_, i) => i).filter((i) => i !== at[0][1] && i !== at[1][1]).map(place);
    return mk(cands, { others, message: `Which one do you mean: the phrase ${q(spec.phrase)} occurs twice in the document?` });
  }

  function impossibleOf(jr, spec) {
    const v = spec.scenario;
    const mk = (patch, what, message, extra = {}) => ({ mode: 'impossible', patch, what, message: `I can't do that: ${message}`, ...extra });
    if (v === 'copy-paste' || v === 'copy-paste-2' || (v === 'unicode' && spec.mode === 'copy')) {
      const t = freshOf(jr, GHOST_TITLES, spec.boxes.map((b) => b.title));
      const w = spec.want.box;
      return mk({ refBy: 'title', boxes: spec.boxes.map((b, i) => (i === w ? { ...b, title: t } : b)) }, [t], `there is no box titled "${t}".`);
    }
    if (v === 'unicode' && spec.mode === 'type') {
      const l = freshOf(jr, GHOST_FIELDS, [spec.field.label]);
      return mk({ field: { ...spec.field, label: l } }, [l], `there is no ${l} field on the page.`);
    }
    if (v === 'unicode') {
      const b = freshOf(jr, lib.UNI_BUTTONS, spec.items.filter((it) => it.type === 'button').map((it) => it.label));
      return mk({ target: b }, [b], `there is no "${b}" button.`);
    }
    if (v === 'scroll-text') {
      const n = spec.lines.length + jr.int(3, 20);
      return mk({ mode: 'line', line: n - 1, which: jr.pick(['first', 'last']) }, [`line ${n}`, `lines ${n}`], `the text has only ${spec.lines.length} lines.`);
    }
    if (v === 'sign-agreement') {
      const pool = [...new Set((C.BUTTON_LABELS || []).flatMap((g) => g.labels || []))].filter((x) => x.length <= 18);
      const b = freshOf(jr, pool.length ? pool : [
        'Continue', 'Submit form', 'Download', 'Save draft', 'Show help', 'Print page', 'Find text'
      ], ['Agree', 'Cancel', 'Decline', 'Accept']);
      const name = spec.name || C.personName(jr, C.csplitOf(spec)).first;
      return mk({ mode: 'agree', name, btn: b }, [b], `there is no "${b}" button on this page.`);
    }
    if (v === 'spinner') {
      const s = jr.pick(lib.SPINNERS.filter((x) => x.label !== spec.label));
      return mk({ label: s.label, unit: s.unit, step: s.step, decimals: s.decimals, target: jr.int(3, 90) },
        [s.label], `there is no ${s.label} spinner on the page.`);
    }
    if (v === 'edit') {
      const f0 = spec.fields[0];
      const l = freshOf(jr, GHOST_FIELDS, spec.fields.map((f) => f.label));
      const toks = [...new Set((String(f0.target || f0.value).match(/[A-Za-z]{4,}/g) || []))];
      return mk({ mode: 'insert', fields: [{ ...f0, label: l }], word: jr.pick(['also', 'still', 'often', 'really', 'just']), anchor: jr.pick(toks) }, [l],
        `the page has no ${l} field.`);
    }
    const code = `${jr.pick(ABSENT_PHRASES)} ${jr.int(1000, 9999)}-${jr.pick('KMRTX'.split(''))}`;
    return mk({ phrase: code }, [code], `the phrase "${code}" is not in the document.`);
  }

  function judgeOf(jr, spec, mode) {
    return mode === 'ambiguous' ? ambiguousOf(jr, spec) : impossibleOf(jr, spec);
  }

  function judgeInstruction(spec, rng) {
    const j = spec.judge;
    if (!j.tpl) return lib.instructionOf({ ...spec, ...(j.patch || {}) }, rng);
    const vars = { ...j.vars };
    if (spec.field) vars.fl = q(I.alias(rng, spec.field.label, []));
    if (j.tpl === 'spin') vars.l = q(I.alias(rng, spec.label, []));
    return lib.say(rng, spec, lib.TPL[j.tpl], vars, { terse: j.terse });
  }
  Object.assign(lib, { judgeOf, judgeInstruction });
})();
