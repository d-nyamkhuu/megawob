/* use-text-editor/sampling.js: Seeded document generation and task goals. */
(function () {
  'use strict';
  const task = env.taskOf('use-text-editor');
  const { lib } = task;

  // ---------------------------------------------------------------- content: code

  const NOUNS = ['order', 'item', 'user', 'task', 'ticket', 'invoice', 'record', 'event', 'report', 'page', 'token',
    'cart', 'slot', 'badge', 'route', 'parcel', 'sample', 'member', 'device', 'folder', 'review', 'player', 'lesson',
    'recipe', 'plant', 'meter', 'bucket', 'note', 'card', 'photo', 'track', 'seat', 'visit', 'coupon', 'guest',
    'driver', 'vendor', 'asset', 'sensor'];
  const FIELDS = ['total', 'size', 'weight', 'price', 'score', 'level', 'limit', 'rank', 'width', 'height', 'margin',
    'quota', 'stock'];
  const VERBS_A = ['format', 'normalize', 'prepare', 'validate', 'tag', 'clean', 'shape', 'check', 'resolve', 'adjust'];
  const VERBS_B = ['load', 'sync', 'index', 'collect', 'refresh', 'gather', 'import', 'process'];
  const HELPERS = [['clamp', 'log'], ['bound', 'trace'], ['fit', 'emit'], ['cap', 'notify'], ['squeeze', 'audit'], ['keep', 'warn']];
  const FLAGS = ['archived', 'hidden', 'locked', 'draft', 'expired', 'paused', 'muted'];
  const LABEL_WORDS = ['list', 'queue', 'view', 'board', 'feed', 'panel'];
  const MODS = { js: ['./util', './helpers', '../lib/math', './shared/tools'], py: ['util', 'helpers', 'lib.mathx', 'shared.tools'] };
  const SUFFIX = { js: [
    'Next', 'Safe', 'V2', 'Raw', 'Old', 'Copy', 'Tmp', 'Base', 'Test', 'Stub', 'Full', 'Solo', 'Bulk', 'Min', 'Max',
    'Sum', 'Avg', 'Key', 'Set', 'Id', 'Db', 'Live', 'Lazy', 'Text', 'Ref', 'Map', 'Int', 'Io'
  ], py: ['_next', '_safe', '_v2', '_raw', '_old', '_copy', '_tmp'] };
  const PREFIX = { js: ['await ', '!', '...', 'void '], py: ['await ', 'not ', '*', '-'] };
  const EOL = { js: [' // ok', ' // check', ' // keep', ' // fixme'], py: [' # ok', ' # check', ' # keep', ' # fixme'] };
  const NOTE = { js: [' // TODO', ' // review', ' // FIXME'], py: [' # TODO', ' # review', ' # FIXME'] };

  // The code file: lines with tags the goals pick ranges from. need: { if2, under, over, debug, commented, fetch3,
  // guard } adds the structures a goal works on.
  function genCode(rng, spec, need) {
    const py = spec.lang === 'py';
    const cs = { csplit: spec.csplit };
    const n = lib.C.pick(rng, NOUNS, cs);
    const N = lib.cap(n);
    const ns = `${n}s`;
    const NS = ns.toUpperCase();
    const f = lib.C.pick(rng, FIELDS, cs);
    const F = f.toUpperCase();
    const [h1, h2] = rng.pick(HELPERS);
    const vA = lib.C.pick(rng, VERBS_A, cs);
    const vB = lib.C.pick(rng, VERBS_B, cs);
    const flag = rng.pick(FLAGS);
    const word = rng.pick(LABEL_WORDS);
    const mod = rng.pick(MODS[spec.lang]);
    const u = ' '.repeat(spec.unit);
    const s = spec.semi ? ';' : '';
    const Q = py ? '"' : rng.pick(["'", '"']);
    const k1 = rng.pick([10, 12, 20, 25, 50, 64, 100]);
    const k2 = rng.pick([0, 1, 3, 5, 8]);
    const nm = py
      ? { fnA: `${vA}_${n}`, fnB: `${vB}_${ns}`, fetch: `fetch_${n}`, label: `${n}_label`, count: `${n}_count` }
      : { fnA: `${vA}${N}`, fnB: `${vB}${N}s`, fetch: `fetch${N}`, label: `${n}Label`, count: `${n}Count` };
    Object.assign(nm, { n, N, f, F, h1, h2, flag, max: `MAX_${NS}`, def: `DEFAULT_${F}` });
    const L = [];
    const push = (t, tag) => L.push({ t, tag });
    const st = (x) => (py ? x : x + s);
    push(py ? `from ${mod} import ${h1}, ${h2}` : `import { ${h1}, ${h2} } from ${Q}${mod}${Q}${s}`, 'import');
    push('', 'blank');
    push(py ? `${nm.max} = ${k1}` : st(`const ${nm.max} = ${k1}`), 'const');
    push(py ? `${nm.def} = ${k2}` : st(`const ${nm.def} = ${k2}`), 'const');
    push(py ? `${nm.label} = "${N} ${word}"` : st(`const ${nm.label} = ${Q}${N} ${word}${Q}`), 'const');
    push(py ? `${nm.count} = 0` : st(`let ${nm.count} = 0`), 'let');
    push('', 'blank');
    push(py ? `def ${nm.fnA}(${n}, opts=None):` : `function ${nm.fnA}(${n}, opts = {}) {`, 'fnA');
    if (need.guard) {
      push(py ? `${u}if not ${n}:` : `${u}if (!${n}) {`, 'guard');
      push(st(`${u}${u}return ${py ? 'None' : 'null'}`), 'guard-body');
      if (!py) push(`${u}}`, 'guard-end');
    }
    if (need.if2) {
      push(py ? `${u}if ${n}.${flag}:` : `${u}if (${n}.${flag}) {`, 'if2');
      const bi = need.under ? u : u + u;
      push(st(`${bi}${nm.count} -= 1`), 'if2-body');
      push(st(`${bi}return ${n}`), 'if2-body');
      if (!py) push(`${u}}`, 'if2-end');
    }
    const si = need.over ? u + u : u;
    push(py ? `${si}${f} = ${h1}(${n}.${f} or ${nm.def}, 0, ${nm.max})` : st(`${si}const ${f} = ${h1}(${n}.${f} ?? ${nm.def}, 0, ${nm.max})`), 'stmt');
    push(st(`${si}${nm.count} += 1`), 'stmt');
    push(st(`${si}${h2}(${nm.label}, ${f})`), 'stmt');
    if (need.debug) {
      push(py ? `${u}print("debug", ${n}.id)` : st(`${u}console.log(${Q}debug${Q}, ${n}.id)`), 'debug');
      push(py ? `${u}print("${f}", ${f})` : st(`${u}console.log(${Q}${f}${Q}, ${f})`), 'debug');
    }
    if (need.commented) {
      push(`${u}${spec.tok} ${st(`${h2}(${Q}old ${f}${Q}, ${n}.${f})`)}`, 'commented');
      push(`${u}${spec.tok} ${st(`${nm.count} = 0`)}`, 'commented');
    }
    push(py ? `${u}return ${f}` : st(`${u}return { ...${n}, ${f} }`), 'ret');
    if (!py) push('}', 'fnA-end');
    push('', 'blank');
    push(py ? `async def ${nm.fnB}(ids):` : `async function ${nm.fnB}(ids) {`, 'fnB');
    const vars = need.fetch3 ? ['first', 'latest', 'fallback'] : ['first', 'latest'];
    const args = { first: 'ids[0]', latest: py ? 'ids[-1]' : 'ids[ids.length - 1]', fallback: nm.def };
    for (const v of vars) push(py ? `${u}${v} = ${nm.fetch}(${args[v]})` : st(`${u}const ${v} = ${nm.fetch}(${args[v]})`), 'fetch');
    push(py ? `${u}return [${nm.fnA}(x) for x in (${vars.join(', ')})]` : st(`${u}return [${vars.join(', ')}].map(${nm.fnA})`), 'retB');
    if (!py) push('}', 'fnB-end');
    return { lines: L, names: nm };
  }
  const tagLines = (meta, tag) => meta.lines.map((x, i) => (x.tag === tag ? i : -1)).filter((i) => i >= 0);
  const codeText = (meta) => meta.lines.map((x) => x.t).join('\n');

  // Identifier occurrences (not keywords) with their line.
  function identifiers(spec, text) {
    const out = [];
    const re = /[A-Za-z_$][A-Za-z0-9_$]*/g;
    let mm;
    while ((mm = re.exec(text))) {
      const w = mm[0];
      if (w.length < 2 || (lib.KEYWORDS[spec.lang] || []).includes(w)) continue;
      // Skip words inside a string literal or a comment.
      const s = lib.lineStart(text, mm.index);
      const before = text.slice(s, mm.index);
      if ((before.split(/['"]/).length - 1) % 2 === 1 || before.includes(spec.tok)) continue;
      out.push({ w, a: mm.index, b: mm.index + w.length, l: lib.lc(text, mm.index)[0] });
    }
    return out;
  }
  const countWord = (spec, text, w) => lib.occurrences(spec, text, w).length;

  // ---------------------------------------------------------------- content: prose

  const ADD_WORDS = ['also', 'still', 'now', 'often', 'already', 'usually', 'again', 'only', 'early', 'together'];
  const SWAP_WORDS = ['soon', 'later', 'quickly', 'gladly', 'easily', 'fully', 'mostly', 'simply', 'clearly', 'rarely'];
  const CODENAMES = ['Falcon', 'Juniper', 'Bluebird', 'Atlas', 'Maple', 'Cobalt', 'Harbor', 'Orchid', 'Quartz', 'Willow',
    'Sparrow', 'Lantern', 'Meadow', 'Comet', 'Pebble', 'Thistle', 'Acorn', 'Badger', 'Basalt', 'Bramble', 'Canyon',
    'Cicada', 'Copper', 'Cricket', 'Cypress', 'Dolphin', 'Estuary', 'Fennel', 'Firefly', 'Geyser', 'Glacier',
    'Granite', 'Hammock', 'Hazelnut', 'Heron', 'Hickory', 'Lagoon', 'Larch', 'Lichen', 'Lobster', 'Magnet', 'Mantis',
    'Minnow', 'Mosaic', 'Nutmeg', 'Otter', 'Papyrus', 'Parsnip', 'Puffin', 'Raccoon', 'Redwood', 'Seashell',
    'Starling', 'Tamarind', 'Trellis', 'Wombat', 'Anemone', 'Axolotl', 'Purslane', 'Caribou', 'Chickpea', 'Chisel',
    'Dune', 'Egret', 'Ermine', 'Feldspar', 'Mallet', 'Foxglove', 'Spindle', 'Hawthorn', 'Ibis', 'Inkwell', 'Kohlrabi',
    'Kudzu', 'Lychee', 'Narwhal', 'Thimble', 'Okapi', 'Pangolin', 'Silt', 'Sedge', 'Terrapin', 'Turbot', 'Wisteria',
    'Aardvark', 'Agate', 'Amaranth', 'Anvil', 'Barnacle', 'Bison', 'Bobolink', 'Capybara', 'Caraway', 'Dovetail',
    'Eider', 'Fireweed', 'Ginkgo', 'Guava', 'Halibut', 'Iolite', 'Jackdaw', 'Lentil', 'Mangrove', 'Nuthatch', 'Ocelot',
    'Waxwing', 'Pumice', 'Quince', 'Rutabaga', 'Scallop', 'Sorghum', 'Tanager', 'Burlap', 'Tapir', 'Tundra', 'Vervet',
    'Zircon', 'Loquat'];
  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const MEMO = [
    'The {T} launch moves to {day}.', 'Please send your {T} notes to {name} by {day}.',
    '{name} will present the {T} budget at the next meeting.', 'Everyone on the {T} team gets access to the shared folder.',
    'Questions about {T} can go to the help channel.', 'The {T} timeline is on the planning board.',
    'We expect the first {T} results in two weeks.', 'The {T} survey closes at the end of the month.',
    'The {T} training starts on {day}.', '{name} is testing the new {T} forms this week.',
    'Please reserve a room for the {T} workshop.', 'The {T} checklist now includes a backup step.',
    'We have filled all the seats for the {T} demo.', 'Bring your laptop to the {T} practice session.',
    'The {T} team needs a volunteer to take minutes on {day}.',
    '{name} will arrange captions for the short {T} video.',
    'Our {T} supplier has confirmed the revised delivery date.', 'The {T} draft needs a shorter introduction.',
    'We found a missing link in the {T} handbook.', 'Please label each box before the {T} office move.',
    'The {T} rota gives each shift a full break.', '{name} has booked the {T} equipment for {day}.',
    'A complete sample {T} kit is ready for inspection.', 'We are adding a glossary to the {T} guide.',
    'The {T} photos need clear captions before printing.', 'Our {T} room will be cleaned on {day}.',
    '{name} is checking the {T} audio levels today.', 'Please keep the {T} entrance clear for visitors.',
    'The {T} session will include a short quiz.', 'We will use recycled paper for the {T} posters.',
    'The {T} rehearsal needs a second camera now.', '{name} has ordered more chairs for the {T} event.',
  ];
  const DISTRACT = ['The {T}s from last year are archived.', 'Our old {t} logo stays on the cover page.',
    'The {t} sketches are in the design folder.', 'Last spring the {T}-era plans were dropped.',
    'An old {t} badge turned up in the drawer.', 'The {t} stamp has faded on these labels.',
    'Our {t} binder is missing its spine tab.', 'The spare {t} sign leans by the cupboard.',
    'A faded {t} ribbon marks the storage bin.', 'We kept the {t} mugs in the break room.',
    'Two {T}s were printed on the spare labels.', 'The tiny {T}s were cut from scrap paper.',
    'The {T}-era desk has a loose drawer knob.'];

  const plainWords = (text) => {
    const out = [];
    const re = /[A-Za-z]{3,}/g;
    let mm;
    while ((mm = re.exec(text))) {
      if (/[\p{L}\p{N}'’]/u.test(text[mm.index - 1] || '') || /[\p{L}\p{N}'’]/u.test(text[mm.index + mm[0].length] || '')) continue;
      out.push({ w: mm[0], a: mm.index, b: mm.index + mm[0].length });
    }
    return out;
  };
  const docOf = (paras) => paras.map((t) => [{ t, k: 'b' }]);
  function prose(rng, spec, k) {
    const out = lib.C.paragraphs(rng, k, { min: 2, max: 3, csplit: spec.csplit })
      .map((p) => p.replace(/["“”]/g, ''))
      .map((p) => (p.length > 300 ? p.slice(0, p.lastIndexOf('. ', 300) + 1) || p.slice(0, 300) : p));
    return out;
  }
  const paraOf = (text, o) => lib.lc(text, o)[0];

  // ---------------------------------------------------------------- goals

  // Every goal returns { goal, target? } on spec.base / spec.doc0; prose targets come with doc1.
  function codeTarget(spec, goal) {
    const t = spec.base;
    if (goal.kind === 'insert') return t.slice(0, goal.at) + goal.text + t.slice(goal.at);
    if (goal.kind === 'lines') {
      const g = [[goal.a, goal.b]];
      if (goal.op === 'delete') return lib.linesOf(t).filter((_, l) => l < goal.a || l > goal.b).join('\n');
      const edits = goal.op === 'indent' ? lib.indentEdits(t, g, spec.unit) : goal.op === 'outdent' ? lib.outdentEdits(t, g, spec.unit)
        : lib.commentEdits(t, g, spec.tok);
      return lib.applyEdits(t, edits).text;
    }
    if (goal.kind === 'multi') {
      return lib.applyEdits(t, goal.lines.map((l, i) => {
        const o = lib.offOf(t, l, goal.cols[i]);
        return { a: o, b: o, s: goal.text };
      })).text;
    }
    if (goal.kind === 'find') return lib.applyEdits(t, goal.want.map(([a, b]) => ({ a, b, s: goal.y }))).text;
    throw new Error(`no code target for ${goal.kind}`);
  }
  function proseTarget(spec, goal) {
    const m = lib.proseModel(spec, spec.doc0);
    if (goal.kind === 'insert') return lib.editRanges(m, spec, [[goal.at, goal.at, goal.text]]).doc;
    if (goal.kind === 'find') return lib.editRanges(m, spec, goal.want.map(([a, b]) => [a, b, goal.y])).doc;
    if (goal.kind === 'review') {
      let x = m;
      for (const [id, a] of Object.entries(goal.want)) x = lib.review(x, spec, id, a);
      return x.doc;
    }
    if (goal.kind === 'suggest') {
      const x = { ...m, mode: 'suggest' };
      return lib.editRanges(x, spec, [[goal.a, goal.b, goal.text]], 'edit', { back: true }).doc;
    }
    throw new Error(`no prose target for ${goal.kind}`);
  }

  function pickRoute(rng, opts, kb, ptr, all) {
    if (opts.route === 'keyboard' && kb) return kb;
    if (opts.route === 'pointer' && ptr) return rng.pick(ptr);
    return rng.pick(all);
  }

  // cursor (code): place the caret by line + token / unique token / Ln-Col / line end and type a short text.
  

  // cursor (prose): add a word right after / before a word of the k-th paragraph.
  

  // multiline: one line operation on a range of equal indentation.
  const MULTI_OPS = ['comment', 'uncomment', 'indent', 'outdent', 'delete'];
  function needFor(scenario, op, rng, level) {
    const need = { if2: level === 'easy' ? false : rng.bool(0.5), fetch3: level !== 'easy' && rng.bool(0.4), guard: false };
    if (scenario === 'multiline') {
      if (op === 'uncomment') need.commented = true;
      if (op === 'indent') { need.if2 = true; need.under = true; }
      if (op === 'outdent') need.over = true;
      if (op === 'delete') need.debug = true;
      if (op === 'comment' && rng.bool(0.3)) need.commented = true;
    }
    if (scenario === 'multicursor' && op === 'await') need.fetch3 = level !== 'easy';
    return need;
  }
  

  // multicursor: the same insertion on several lines.
  

  // findreplace (code): rename an identifier; mode 'all' (whole word, case-sensitive) or 'some' (given lines).
  
  // Which find options make the match set equal the wanted set.
  function needs(spec, text, x, want) {
    const key = (r) => r.join(',');
    const w = new Set(want.map(key));
    const ok = (mc, ww) => {
      const ms = lib.occurrences(spec, text, x, { mc, ww });
      return ms.length === w.size && ms.every((r) => w.has(key(r)));
    };
    for (const [mc, ww] of [[false, false], [true, false], [false, true], [true, true]]) if (ok(mc, ww)) return { mc, ww };
    return { mc: true, ww: true, partial: true };
  }

  // findreplace (prose): a memo with a code name used several times plus distractors.
  function memoDoc(rng, spec, T, name, opts = {}) {
    const fill = (s) => s.replace(/\{T\}/g, T).replace(/\{t\}/g, T.toLowerCase()).replace(/\{day\}/g, rng.pick(DAYS)).replace(/\{name\}/g, name);
    // ambiguous judge: the two sentences that name the person are fixed below, so the sample never holds them
    const ss = rng.sample(opts.twice ? MEMO.filter((t) => !t.includes('{name}')) : MEMO, spec.level === 'easy' ? 4 : 5).map(fill);
    if (opts.twice) {
      // ambiguous judge: two sentences name the same person and the code name
      ss[0] = fill('Please send your {T} notes to {name} by {day}.');
      ss[2] = fill('{name} will present the {T} budget at the next meeting.');
    }
    const ds = spec.level === 'easy' ? [] : rng.sample(DISTRACT, rng.int(1, 2)).map(fill);
    const all = [...ss];
    for (const d of ds) all.splice(rng.int(1, all.length), 0, d);
    const cut = Math.ceil(all.length / 2);
    return [all.slice(0, cut).join(' '), all.slice(cut).join(' ')];
  }
  

  // autocomplete: one or two new lines after line L, the first ending in a word that prefixes other identifiers.
  

  // trackchanges: other authors' suggestions in the start document.
  function seedSuggestions(rng, spec, paras, authors, k) {
    let doc = docOf(paras);
    let seq = 0;
    const used = [];
    const usedW = [];
    for (let t = 0; t < 40 && seq < k; t++) {
      const text = lib.flatDoc(doc);
      const chars = lib.runChars(doc);
      const ws = plainWords(text).filter((x) => x.w.length >= 4 && chars.slice(Math.max(0, x.a - 1), x.b + 1).every((c) => c.k === 'b' || c.k === 'n')
        && !used.some((u) => Math.abs(u - x.a) < 24) && countWord({ doc: 'prose' }, text, x.w) === 1);
      if (!ws.length) break;
      const x = rng.pick(ws);
      const kind = rng.pick(['ins', 'del', 'rep']);
      const fresh = (list) => rng.pick(list.filter((w) => !usedW.includes(w) && w !== x.w.toLowerCase()));
      const id = `a${++seq}`;
      const au = authors[(seq - 1) % authors.length];
      const out = chars.slice(0, x.a);
      const word = chars.slice(x.a, x.b);
      const rest = chars.slice(x.b);
      if (kind === 'ins') {
        const w = fresh(ADD_WORDS);
        usedW.push(w);
        out.push(...word, ...[...` ${w}`].map((ch) => ({ ch, k: 'i', a: au, id })));
      } else if (kind === 'del') {
        const sp = out.length && out[out.length - 1].ch === ' ' ? out.pop() : null;
        out.push(...[...(sp ? ' ' : '') + x.w].map((ch) => ({ ch, k: 'd', a: au, id })));
      } else {
        const w = fresh(SWAP_WORDS);
        usedW.push(w);
        out.push(...[...x.w].map((ch) => ({ ch, k: 'd', a: au, id })), ...[...w].map((ch) => ({ ch, k: 'i', a: au, id })));
      }
      doc = lib.implode([...out, ...rest]);
      used.push(x.a);
    }
    return doc;
  }
  function describe(s) {
    const del = s.del.trim();
    const ins = s.ins.trim();
    if (ins && del) return { short: `the change from "${del}" to "${ins}"`, verb: `changes "${del}" to "${ins}"` };
    if (ins) return { short: `the suggestion to add "${ins}"`, verb: `adds "${ins}"` };
    return { short: `the suggestion to delete "${del}"`, verb: `deletes "${del}"` };
  }
  
  

  // ---------------------------------------------------------------- judge modes

  // spec.judge = { mode, message, text, cands, others, what }: text is the request the instruction makes, message what a
  // careful agent answers. The reply is graded from the data: ambiguous: one option per cands entry (a list of names for
  // one place: its line number, or stretches of the document around it that occur nowhere else), none naming an
  // others entry; impossible: what names the missing thing.

  // Words as a reply is compared (kit/runtime/reply.js words()): lower-case alphanumeric runs.

  const SCENARIOS = ['cursor', 'multiline', 'multicursor', 'findreplace', 'autocomplete', 'trackchanges'];
  const PROSE_SCENARIOS = ['cursor', 'findreplace', 'trackchanges'];

  function sample(rng, opts) {
    const traits = opts.traits || {};
    const docKind = traits.doc === 'prose' ? 'prose' : 'code';
    const pool = (opts.scenarios && opts.scenarios.length ? opts.scenarios : SCENARIOS)
      .filter((v) => (docKind === 'prose' ? PROSE_SCENARIOS.includes(v) : v !== 'trackchanges'));
    const scenario = opts.scenario || rng.pick(pool);
    const level = opts.level === 'easy' || opts.level === 'medium' ? opts.level : 'normal';
    const spec = { scenario, doc: docKind, isplit: opts.isplit || 'train', csplit: opts.csplit || 'train', ood: !!opts.ood, level,
      startMode: opts.startMode || 'off' };
    const cr = rng.fork('content');
    const gr = rng.fork('goal');
    const judge = ['ambiguous', 'impossible'].includes(opts.judge) ? opts.judge : null;
    let meta = null;
    if (docKind === 'code') {
      spec.lang = cr.pick(['js', 'js', 'py']);
      spec.unit = spec.lang === 'py' ? 4 : cr.pick([2, 2, 4]);
      spec.tok = spec.lang === 'py' ? '#' : '//';
      spec.semi = spec.lang === 'js' && scenario !== 'autocomplete' && cr.bool(0.5);
      spec.suggest = scenario === 'autocomplete' || (scenario === 'cursor' ? gr.bool(0.4) : gr.bool(0.2));
      const op = scenario === 'multiline' ? gr.pick(MULTI_OPS) : scenario === 'multicursor' ? (opts.route === 'keyboard' ? gr.pick(['prefix', 'suffix']) : gr.pick(['prefix', 'suffix', 'await'])) : null;
      const need = needFor(scenario, op, cr, level);
      if (spec.ood) { need.guard = true; need.fetch3 = true; }
      meta = genCode(cr, spec, need);
      spec.base = codeText(meta);
      spec.names = meta.names;
      spec.file = spec.lang === 'py' ? `${meta.names.vA || meta.names.n}_${meta.names.n}s.py`.replace(/^undefined_/, '') : `${meta.names.n}s.${cr.pick(['js', 'mjs'])}`;
      spec.file = spec.lang === 'py' ? `${meta.names.n}s.py` : spec.file;
      spec.goal = env.scenariosOf('use-text-editor')[scenario].sampleCode(gr, spec, meta, op, opts);
      spec.target = codeTarget(spec, spec.goal);
    } else {
      spec.lang = 'en';
      spec.unit = 4;
      spec.tok = '';
      spec.suggest = false;
      const person = lib.C.personName(cr, { csplit: spec.csplit }).first;
      spec.names = { person };
      if (scenario === 'findreplace') {
        const T = lib.C.pick(cr, CODENAMES, { csplit: spec.csplit });
        spec.doc0 = docOf(memoDoc(cr, spec, T, person, { twice: judge === 'ambiguous' }));
        spec.title = `${T} update`;
        spec.goal = env.scenariosOf('use-text-editor')[scenario].sampleProse(gr, spec, T, opts);
      } else if (scenario === 'trackchanges') {
        const names = [];
        for (let t = 0; t < 30 && names.length < 4; t++) {
          const p = lib.C.personName(cr, { csplit: spec.csplit }).first;
          if (!names.includes(p) && p !== lib.ME) names.push(p);
        }
        const nA = spec.level === 'easy' ? 2 : cr.int(2, 3);
        const authors = names.slice(0, nA);
        spec.names.ghost = names[3] || 'Morgan';
        const k = spec.level === 'easy' ? 2 : judge === 'ambiguous' ? Math.max(nA + 1, 3) : cr.int(3, spec.ood ? 5 : 4);
        let doc = null;
        for (let t = 0; t < 6; t++) {
          doc = seedSuggestions(cr, spec, prose(cr, spec, spec.level === 'easy' ? 2 : cr.int(2, 3)), authors, k);
          if (lib.suggestions(doc).length >= Math.min(k, 2)) break;
        }
        spec.doc0 = doc;
        spec.authors = authors;
        spec.title = cr.pick([
          'Draft', 'Team notes', 'Newsletter draft', 'Proposal', 'Announcement', 'Team brief', 'Event plan',
          'Open items', 'Work record', 'Session log'
        ]);
        const g = spec.level === 'easy' ? 'review' : gr.pick(['review', 'suggest']);
        spec.goal = g === 'review' ? env.scenariosOf('use-text-editor')[scenario].review(gr, spec) : env.scenariosOf('use-text-editor')[scenario].suggest(gr, spec);
      } else {
        spec.doc0 = docOf(prose(cr, spec, spec.level === 'easy' ? 2 : cr.int(2, 3)));
        spec.title = cr.pick([
          'Draft', 'Notes', 'Weekly update', 'Untitled document', 'Announcement', 'Change log', 'Reading list',
          'Work plan', 'Team recap', 'Topic index'
        ]);
        spec.goal = env.scenariosOf('use-text-editor')[scenario].sampleProse(gr, spec);
      }
      spec.doc1 = proseTarget(spec, spec.goal);
      spec.target = lib.serDoc(spec.doc1);
    }
    if (judge) {
      const j = lib.judgeOf(rng.fork('judge'), spec, judge, meta);
      if (j) {
        spec.judge = j;
        spec.target = lib.isProse(spec) ? lib.serDoc(spec.doc0) : spec.base;
        if (lib.isProse(spec)) spec.doc1 = lib.U.clone(spec.doc0);
      }
    }
    spec.d0 = lib.dist(lib.isProse(spec) ? lib.serDoc(spec.doc0) : spec.base, spec.target);
    return spec;
  }


  Object.assign(lib, { NOUNS, SUFFIX, tagLines, identifiers, countWord, ADD_WORDS, CODENAMES, plainWords, paraOf, codeTarget, proseTarget, describe, PROSE_SCENARIOS, sample, PREFIX, EOL, pickRoute, NOTE, FIELDS, needs, SWAP_WORDS });
})();
