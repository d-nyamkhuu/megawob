/* scroll-page/hooks.js: round 2 hooks: judge modes (judgeOf), facts, parts, silent, retarget. Attached to the task's lib. */
(function () {
  'use strict';
  const lib = env.taskOf('scroll-page').lib;
  const { clone, quote: q, pad } = env.util;
  const C = env.content;
  const I = env.instruct;
  const {
    FAQ, KINDS, KIND_NAMES, MONTHS, PANE_KINDS, VALUES, actionById, actionsOf, countLabel, error, rowsOf, tolerance,
    instruction
  } = lib;

  const lcFirst = (x) => x.split(' ').map((w, i) => (i === 0 && !/^[A-Z]{2,}/.test(w) ? w.toLowerCase() : w)).join(' ');
  const secName = (spec, id) => {
    const i = spec.sections.findIndex((s) => s.id === id);
    return i < 0 ? '' : (spec.kind === 'terms' ? `${i + 1}. ` : '') + spec.sections[i].heading;
  };
  const EXTRA_SECTIONS = [['Appendix', 'the appendix', ['Download the appendix']], ['Glossary', 'the glossary', ['Browse the glossary']],
    ['Press office', 'the press office', ['Email the press office']]];
  const BUTTONS = [
    'Look up', 'Apply', 'Check', 'Go', 'Run', 'Send', 'Process', 'Do it', 'Save', 'Confirm', 'Try', 'Start'
  ];
  const stripQ = (s) => s.replace(/\?$/, '');

  // A pane row the page does not have: [title, ref] in the kind's own format.
  function missingRow(jr, spec) {
    const P = spec.pane;
    const have = new Set(rowsOf(P).concat(spec.pane2 ? spec.pane2.rows : []).map((r) => r.title));
    let title;
    let ref;
    for (let k = 0; k < 40; k++) {
      if (P.kind === 'releases') { title = `v${jr.int(7, 9)}.${jr.int(0, 9)}.${jr.int(0, 9)}`; ref = `the ${title} release`; }
      else if (P.kind === 'updates') { title = `${pad(jr.int(0, 23))}:${pad(jr.int(0, 59))}`; ref = `the update posted at ${title}`; }
      else if (P.kind === 'sellers') { title = C.pick(jr, C.COMPANIES, { csplit: spec.csplit }); ref = `the offer from ${title}`; }
      else if (P.kind === 'articles') { title = C.pick(jr, C.TOPICS, { csplit: spec.csplit }); ref = `the article "${title}"`; }
      else { title = `Effective ${jr.int(1, 28)} ${jr.pick(MONTHS)} ${jr.int(2010, 2018)}`; ref = `the version effective ${title.slice(10)}`; }
      if (!have.has(title)) break;
    }
    return { title, ref };
  }

  // Two distinct picks of a list whose items do not contain each other's text (for mentions checks).
  function twoOf(jr, items, text) {
    for (let k = 0; k < 30; k++) {
      const a = jr.pick(items);
      const b = jr.pick(items);
      const ta = text(a).toLowerCase();
      const tb = text(b).toLowerCase();
      if (a !== b && !ta.includes(tb) && !tb.includes(ta)) return [a, b];
    }
    return null;
  }

  // The other names on the page, without any that contains or is part of a candidate's name (a question about a candidate
  // says its name, which must not count as naming another thing).
  function clean(others, cands) {
    const all = cands.flat().map((x) => String(x).toLowerCase());
    return others.filter((o) => o.every((n) => n && !all.some((c) => c.includes(String(n).toLowerCase()) || String(n).toLowerCase().includes(c))));
  }

  function judgeOf(jr, spec, mode) {
    const v = spec.scenario;
    const page = KIND_NAMES[spec.kind];
    if (mode === 'confirm') {
      if (v === 'copy') {
        const button = jr.pick(BUTTONS);
        const field = spec.copy.field;
        return { mode, button, message: `The ${field} field is filled in. Should I go ahead and press ${q(button)}?`,
          templates: ['But check with me before you press {button}.', "Don't press {button} until you have checked with me.",
            'Ask me before pressing {button}, though.', 'Stop and check with me before you press {button}.',
            'Before pressing {button}, ask me for permission.', 'Pressing {button} must wait until you ask me.',
            'Leave {button} unpressed until you\'ve asked me.', 'Once ready, ask me whether to press {button}.'],
          vars: { button: q(button) } };
      }
      const a = actionById(spec, spec.target);
      const label = q(a.label);
      const row = spec.pane ? rowsOf(spec.pane).find((r) => r.id === spec.row) : null;
      const it = spec.faq ? spec.faq.items.find((x) => x.id === spec.item) : null;
      const where = row ? ` on ${row.ref}` : it ? ` under ${q(it.q)}` : spec.scenario === 'link' ? ` in the ${q(spec.sections.find((x) => x.id === spec.targetSection).heading)} section` : '';
      return { mode, message: `I have found ${label}${where}. Should I go ahead and click it?`,
        templates: ['But check with me before you click {label}.', "Don't click {label} until you have checked with me.",
          'Ask me before clicking {label}, though.', 'Stop and check with me before you click {label}.',
          'Ask me to confirm before {label} is clicked.', 'I\'d like to be asked before you click {label}.',
          'When ready, ask whether I want {label} clicked.'],
        vars: { label } };
    }
    if (mode === 'impossible') {
      let tkey;
      let vars;
      let what;
      let names; // the missing thing as the instruction names it (spec.judge.what)
      let where = 'on this page';
      if (v === 'copy') {
        const c = spec.copy;
        const taken = [c.vlabel, ...c.decoys.map((d) => d.label)];
        const vl = jr.pick(VALUES.filter((x) => !taken.includes(x[0])))[0];
        tkey = c.dir === 'down' ? 'copyDown' : 'copyUp';
        vars = { vlabel: lcFirst(vl), field: q(c.field), page, sec: q(spec.sections.find((s) => s.id === c.section).heading) };
        what = `the ${lcFirst(vl)}`;
        names = [vl, lcFirst(vl)];
      } else if (v === 'accordion') {
        const items = spec.faq.items;
        const [fq, , flabel] = jr.pick(FAQ.filter(([x]) => !items.some((it) => it.q === x)));
        tkey = 'accordion';
        vars = { label: q(flabel), qq: q(fq), page };
        what = `the question ${q(fq)}`;
        names = [fq, stripQ(fq)];
        where = 'in the FAQ';
      } else if (v === 'top') {
        const pool = KINDS[spec.kind].tools.filter((l) => !spec.tools.some((t) => t.label === l));
        const label = jr.pick(pool);
        tkey = 'top';
        vars = { label: q(label), page };
        what = `the ${q(label)} button`;
        names = [label];
        where = 'in the toolbar at the top';
      } else if (spec.pane) {
        const { ref, title } = missingRow(jr, spec);
        const label = jr.pick(PANE_KINDS[spec.pane.kind].labels);
        tkey = v;
        vars = { pane: q(spec.pane.title), row: ref, label: q(label), page };
        what = ref;
        names = [title];
        where = `in the ${spec.pane.title} list`;
      } else {
        const have = new Set(spec.sections.map((s) => s.heading.toLowerCase()));
        const pool = KINDS[spec.kind].sections.concat(EXTRA_SECTIONS).filter(([h]) => !have.has(h.toLowerCase()));
        const [h, , labels] = jr.pick(pool);
        tkey = 'linkHeading';
        vars = { label: q(jr.pick(labels)), sec: q(h), page };
        what = `the ${q(h)} section`;
        names = [h];
      }
      return { mode, tkey, vars, what: names, message: `I can't do that: ${what} is not ${where}.` };
    }
    // ambiguous: two candidates named in the goal; the page keeps its layout.
    let a;
    let b;
    let cands;
    let others = [];
    let templates;
    if (v === 'copy') {
      const c = spec.copy;
      const d = jr.pick(c.decoys);
      const other = VALUES.find((x) => x[0] === d.label);
      a = lcFirst(c.vlabel);
      b = lcFirst(d.label);
      cands = [[c.vlabel, ...c.valiases], [d.label, ...(other ? other[1] : [])]];
      templates = ['Enter the {a} or the {b} from this page into the {field} field.',
        'Type the {a} or the {b} into {field}.',
        'Fill {field} with the {a} or the {b} shown on the {page}.',
        'Copy the {a} or the {b} from the {page} to fill {field}.'];
      const others = c.decoys.filter((x) => x !== d).map((x) => { const o = VALUES.find((y) => y[0] === x.label); return [x.label, ...(o ? o[1] : [])]; });
      return { mode, cands, others: clean(others, cands), message: `Which one should I enter: the ${a} or the ${b}?`, templates, vars: { a, b, field: q(c.field), page } };
    }
    if (v === 'accordion') {
      const pair = twoOf(jr, spec.faq.items, (it) => it.q) || [spec.faq.items[0], spec.faq.items[1]];
      const act = (it) => `${q(it.actions[0].label)} under ${q(it.q)}`;
      a = act(pair[0]);
      b = act(pair[1]);
      cands = pair.map((it) => [stripQ(it.q), it.q, it.about]);
      others = spec.faq.items.filter((it) => !pair.includes(it)).map((it) => [stripQ(it.q), it.q]);
      templates = ['In the FAQ, click {a} or {b}.',
        'Open the answer and click either {a} or {b}.',
        'Expand the FAQ entry and click {a} or {b}.',
        'Show the FAQ answer, then click {a} or {b}.',
        'In the FAQ answer, use either {a} or {b}.'];
    } else if (v === 'top') {
      const pair = twoOf(jr, spec.tools, (t) => t.label) || [spec.tools[0], spec.tools[1]];
      a = q(pair[0].label);
      b = q(pair[1].label);
      cands = pair.map((t) => [t.label]);
      others = spec.tools.filter((t) => !pair.includes(t)).map((t) => [t.label]);
      templates = ['Click {a} or {b} at the top of the {page}.',
        'Go back to the top of the {page} and click {a} or {b}.',
        'Use {a} or {b} from the toolbar at the top.',
        'The top toolbar is where to click {a} or {b}.'];
    } else if (spec.pane) {
      const rows = rowsOf(spec.pane);
      const pair = twoOf(jr, rows, (r) => r.title) || [rows[0], rows[1]];
      const label = q(PANE_KINDS[spec.pane.kind].labels[0]);
      a = `${pair[0].ref}`;
      b = `${pair[1].ref}`;
      cands = pair.map((r) => [r.title]);
      others = rows.filter((r) => !pair.includes(r)).map((r) => [r.title]);
      templates = [`In the {pane} list, click ${label} for {a} or {b}.`,
        `Find {a} or {b} in {pane} and click ${label} on it.`,
        `In {pane}, press ${label} on {a} or on {b}.`];
    } else {
      const sections = spec.sections.filter((s) => s.actions.length);
      const pair = twoOf(jr, sections, (s) => s.heading) || [sections[0], sections[1]];
      const acts = pair.map((s) => jr.pick(s.actions));
      a = `${q(acts[0].label)} in the ${q(pair[0].heading)} section`;
      b = `${q(acts[1].label)} in the ${q(pair[1].heading)} section`;
      cands = pair.map((s) => [s.heading]);
      others = spec.sections.filter((x) => !pair.includes(x)).map((x) => [x.heading]);
      templates = ['Click {a} or {b}.',
        'Further down the {page}, click either {a} or {b}.',
        'Open {a} or {b}.',
        'Down the {page}, open {a} or {b}.'];
    }
    return { mode, cands, others: clean(others, cands), message: `Which one should I click: ${a} or ${b}?`, templates,
      vars: { a, b, page, pane: spec.pane ? q(spec.pane.title) : '' } };
  }

  // What the finished page shows that a person would report back. aliases: other spellings of the value; labels: other names
  // of the fact. Values have no ', ' (free-text replies split clauses there; words() makes the spellings equal).
  function facts(model, spec) {
    return rawFacts(model, spec).map((f) => {
      const v = String(f.value).replace(/[,;.]\s+/g, ' ');
      return v === String(f.value) ? f : { ...f, value: v, aliases: [String(f.value), ...(f.aliases || [])] };
    });
  }
  function rawFacts(model, spec) {
    if (spec.judge) return [];
    const v = spec.scenario;
    const title = { label: 'Page title', value: String(spec.title), labels: ['Title', 'Heading'] };
    const out = [];
    if (v === 'link') {
      const s = spec.sections.find((x) => x.id === spec.targetSection);
      if (spec.refBy !== 'heading') out.push({ label: 'Section', value: secName(spec, s.id), aliases: [s.heading], labels: ['Section heading'] });
      out.push({ label: 'Links and buttons in that section', value: String(s.actions.length), labels: ['Actions in the section', 'Number of links'] });
      out.push(title);
    } else if (v === 'accordion') {
      const it = spec.faq.items.find((x) => x.id === spec.item);
      out.push({ label: 'Answers open', value: String(model.open.length), labels: ['Open answers', 'Expanded questions', 'Questions open'] });
      if (spec.refBy === 'about') out.push({ label: 'Question', value: it.q, aliases: [stripQ(it.q)], labels: ['FAQ question'] });
      out.push({ label: 'Links in the answer', value: String(it.actions.length), labels: ['Number of links in the answer'] });
      out.push(title);
    } else if (v === 'top') {
      out.push({ label: 'Page details', value: String(spec.meta), labels: spec.kind === 'article' ? ['Byline', 'Details', 'Meta'] : ['Details', 'Meta'] });
      out.push({ label: 'Tools in the toolbar', value: String(spec.tools.length), labels: ['Toolbar buttons', 'Number of tools'] });
      out.push(title);
    } else if (v === 'copy') {
      const c = spec.copy;
      out.push({ label: c.vlabel, value: c.value, labels: c.valiases.slice() });
      const d = c.decoys[0];
      if (d) {
        const dv = VALUES.find((x) => x[0] === d.label);
        out.push({ label: d.label, value: d.value, labels: dv ? dv[1] : [] });
      }
      out.push(title);
    } else if (spec.pane) {
      const P = spec.pane;
      const row = rowsOf(P).find((r) => r.id === spec.row);
      out.push({ label: 'Section', value: secName(spec, spec.targetSection), labels: ['Section heading'] });
      if (v === 'siblings') out.push({ label: 'Other list', value: spec.pane2.title, labels: ['Other scrolling list', 'Second list'] });
      else out.push({ label: `${P.title} details`, value: row.meta, labels: ['Row details', 'Details', 'Meta'] });
      out.push(title);
    }
    return out.filter((f) => f.value);
  }

  // preempt=cancel: every link / button / tool on the page (clicked or not; the name carries where it sits when the label
  // repeats), every FAQ question (open or not) and, for copy, the typed field and the printed codes (which never change).
  function parts(model, spec) {
    const out = [];
    const seen = new Set();
    const add = (name, value, aliases) => { if (name && !seen.has(name)) { seen.add(name); out.push({ name, value, ...(aliases && aliases.length ? { aliases } : {}) }); } };
    if (spec.scenario === 'copy') {
      add(spec.copy.field, model.text || '');
      add(spec.copy.vlabel, 'printed');
      for (const d of spec.copy.decoys) add(d.label, 'printed');
      return out;
    }
    // Scrolling to the target is progress too (the error drops when it is seen), so the view is a part of its own.
    add('Page position', [!!model.seen, model.where || '', !!model.atTop], ['Scroll position', 'Page scroll position', 'Scroll', 'Page']);
    const where = {};
    for (const s of spec.sections) where[s.id] = s.heading;
    if (spec.faq) for (const it of spec.faq.items) where[it.id] = stripQ(it.q);
    const rows = spec.pane ? rowsOf(spec.pane).concat(spec.pane2 ? spec.pane2.rows : []) : [];
    for (const r of rows) where[r.id] = r.title;
    where.tools = 'the toolbar at the top';
    where.bottom = 'the toolbar at the bottom';
    const acts = actionsOf(spec);
    const count = {};
    for (const a of acts) count[a.label] = (count[a.label] || 0) + 1;
    for (const a of acts) add(count[a.label] > 1 ? `${a.label} in ${where[a.where] || a.where}` : a.label, model.clicked.includes(a.id));
    if (spec.faq) for (const it of spec.faq.items) add(it.q, model.open.includes(it.id), [stripQ(it.q)]);
    return out;
  }

  const LOOKALIKE = { 0: 'O', O: '0', 1: 'I', I: '1', 5: 'S', S: '5', 8: 'B', B: '8', 2: 'Z', Z: '2' };

  // The last click did not take / the typed text is cut or has a look-alike swapped. null when nothing believable fits.
  function silent(next, prev, spec, rng) {
    if (spec.judge) return null;
    const v = spec.scenario;
    const tau = tolerance(spec).tau;
    const ok = (out) => (error(out, spec) > tau ? out : null);
    if (v === 'copy') {
      const t = String(next.text || '');
      if (t.length < 2 || t === String(prev.text || '')) return null;
      const cut = () => ({ ...clone(next), text: t.slice(0, t.length - rng.int(1, Math.min(3, t.length - 1))) });
      const swap = () => {
        const at = [];
        for (let i = 0; i < t.length; i++) if (LOOKALIKE[t[i].toUpperCase()]) at.push(i);
        if (!at.length) return null;
        const i = rng.pick(at);
        return { ...clone(next), text: t.slice(0, i) + LOOKALIKE[t[i].toUpperCase()] + t.slice(i + 1) };
      };
      const order = rng.bool(0.5) ? [cut, swap] : [swap, cut];
      for (const f of order) {
        const out = f();
        if (out && out.text !== t && ok(out)) return out;
      }
      return null;
    }
    if (!next.done) {
      if (v === 'accordion' && next.open.includes(spec.item) && !prev.open.includes(spec.item)) {
        return ok({ ...clone(next), open: next.open.filter((x) => x !== spec.item) });
      }
      return null;
    }
    if (prev.done) return null;
    const out = clone(next);
    out.done = false;
    if (out.clicked.length && out.clicked[out.clicked.length - 1] === spec.target) out.clicked = out.clicked.slice(0, -1);
    return ok(out);
  }

  // Another goal on the same page; only goal fields differ.
  function retarget(spec, model, rng) {
    if (spec.judge || model.done) return null;
    const s = clone(spec);
    const v = s.scenario;
    const refByFor = (a) => (countLabel(s, a.label) > 1 ? rng.pick(['heading', 'heading', 'about']) : rng.pick(['heading', 'about', 'none']));
    if (v === 'link') {
      const from = Math.max(2, Math.floor(s.sections.length * 0.5));
      let cands = [];
      s.sections.forEach((sec, i) => { if (i >= from) for (const a of sec.actions) if (a.id !== s.target) cands.push({ a, sec }); });
      const same = cands.filter((c) => c.sec.id === s.targetSection);
      if (same.length) cands = same;
      if (!cands.length) return null;
      const c = rng.pick(cands);
      s.target = c.a.id;
      s.targetSection = c.sec.id;
      s.refBy = refByFor(c.a);
    } else if (v === 'accordion') {
      const items = s.faq.items.filter((it) => it.id !== s.item);
      if (!items.length) return null;
      const it = rng.pick(items);
      s.item = it.id;
      s.target = it.actions[0].id;
      s.refBy = rng.pick(['question', 'question', 'about']);
    } else if (v === 'top') {
      const tools = s.tools.filter((t) => t.id !== s.target);
      if (!tools.length) return null;
      s.target = rng.pick(tools).id;
    } else if (v === 'copy') {
      const c = s.copy;
      if (c.dir !== 'down' || !c.decoys.length) return null;
      const d = rng.pick(c.decoys);
      const dv = VALUES.find((x) => x[0] === d.label);
      const old = { label: c.vlabel, value: c.value, section: c.section };
      s.copy = { ...c, vlabel: d.label, valiases: dv ? dv[1] : [], value: d.value, section: d.section,
        decoys: c.decoys.map((x) => (x === d ? old : x)) };
      s.targetSection = d.section;
      if (error(model, s) <= 0) return null;
    } else if (s.pane) {
      let rows = rowsOf(s.pane);
      if (s.pane.groups) rows = s.pane.groups.find((g) => g.id === s.group).pane.rows;
      rows = rows.filter((r) => r.id !== s.row);
      if (v === 'lazy') {
        const unloaded = rows.filter((r) => s.pane.rows.findIndex((x) => x.id === r.id) >= (model.loaded || 0));
        if (unloaded.length) rows = unloaded;
      }
      if (!rows.length) return null;
      const row = rng.pick(rows);
      s.row = row.id;
      s.target = rng.pick(row.actions).id;
    } else {
      return null;
    }
    return error(model, s) > tolerance(s).tau ? s : null;
  }

  Object.assign(lib, {
    judgeOf, facts, parts, silent, retarget,
  });
})();
