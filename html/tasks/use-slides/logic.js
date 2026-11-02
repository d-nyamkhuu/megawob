/*
 * use-slides: reorder, align and restyle slides, and handle comments and tracked changes.
 * Fictional office suite, deck editing and document review.
 * Real-app counterparts: presentation thumbnail rails, slide arrangement and text
 * formatting ribbons; word processor anchored comments and tracked revisions.
 * Scenarios: reorder (thumbnail drag), align (align to slide + distribute shapes),
 * restyle (text emphasis, colour, point size), comments (phrase-anchored comment),
 * trackchanges (accept/reject named revisions, leave other revisions pending).
 *
 * Spec: scenario, level, ood, isplit/csplit, startMode; title, owner, slides
 * [{title,subtitle}], shapes [{label,x,y,w,h}], paragraphs/doc, phrases
 * [{text,start,end}], changes [{before,after,author}], baseComment; goals:
 * order [slide index], edge ('middle'|'bottom'), element index, style
 * {bold,italic,color,size}, phrase index, comment string, decisions [status].
 * Model: order, positions [{x,y}], styles [{bold,italic,color,size}], selected
 * [shape indices], activeSlide; selection {start,end}, composer {open,start,end},
 * draft, comments [{start,end,text}], decisions ['pending'|'accept'|'reject'];
 * view is an unscored geometry mirror of scrolling panes, maintained by the widget.
 * Coordinates: 720 x 400 slide units; shapes 110 x 48. Alignment is relative
 * to the slide, distribution between the unchanged outer shapes at x=40,570.
 * Error: mean normalized geometry, style fields, discordant slide pairs,
 * comment span/text distance (plus unwanted posts), or revision decisions.
 * All scenarios exact (tau=0), except align tau=.003 (about one slide unit).
 * Starts: off, partial (some edits done), wrong (plausible incorrect edits), solved.
 * Easy/medium reduce counts and task steps; ood expands decks/documents and sizes.
 * Inputs: pointer, wheel; keyboard for restyle/comments and ambiguous episodes.
 * Targets: {slide:i}, {slot:i}, {shape:i}, {tool:name}, {field:name},
 * {color:name}, {char:offset,edge}, {revision:i,action}, {deleteComment:i},
 * {pane:'rail'|'document'|'review'} (wheel). locate is read-only.
 *
 * facts(model,spec): 2-3 visible status facts (slide count, owner, comment and
 * revision counts), calculated from the resulting model, not copied goal values.
 * parts(model,spec): preempt=cancel items by the name the page shows: slides by title (value: place in the rail), shapes
 * by label (value: style; align: its vertical and horizontal position, one item each, since one align press moves every shape), the comment box ('Comment': composer state and draft) plus each anchor phrase
 * (value: the comments on it), revisions as 'before to after' (value: decision).
 * silent(next,prev,spec,rng): revert one just-saved edit / truncate a posted
 * comment. Corruption is cloned, above tolerance, and repairable by repeating.
 * retarget(spec,model,rng): change goal order/alignment/style/phrase/decisions
 * without changing any scene content; returns only a currently unsatisfied goal.
 * judgeModes: ambiguous, two shapes with the same visible label; ask which shape before editing. The request is
 * worded like a restyle task with the sampled style. spec.judge = { mode, label, message, baseline, cands, others }:
 * cands the label twice (twins: nothing else on the page tells the shapes apart, "first X" / "second X" is accepted),
 * others the other shapes' labels, never offered. The kit grades the reply; the task judged() only checks that no
 * scored edit was made.
 * Helpers (widget API, env.taskDef.helpers):
 *   COLORS: named text colours mapped to CSS hex values.
 *   distributedX(spec,i): evenly distributed shape x position in slide units.
 */
(function () {
  'use strict';
  const C = env.content, I = env.instruct, U = env.util;
  const COLORS = { Indigo: '#5046b8', Teal: '#087f8c', Coral: '#c44536', Plum: '#923b85', Forest: '#207447' };
  const TITLES = ['Opening', 'The opportunity', 'Our approach', 'Key findings', 'Delivery plan', 'Next steps', 'Appendix'];
  const LABELS = ['Explore', 'Design', 'Build', 'Launch', 'Learn'];
  const STATUSES = ['pending', 'accept', 'reject'];
  const alignY = (s) => s.edge === 'middle' ? 176 : 352;
  const distributedX = (s, i) => 40 + 530 * i / (s.shapes.length - 1);
  const levRatio = (a, b) => U.lev(a, b) / Math.max(1, a.length, b.length);
  function spanCost(a, b) {
    const overlap = Math.max(0, Math.min(a.end, b.end) - Math.max(a.start, b.start));
    return 1 - overlap / Math.max(1, Math.max(a.end, b.end) - Math.min(a.start, b.start));
  }
  function commentCost(c, s) { return .4 * spanCost(c, s.phrases[s.phrase]) + .6 * levRatio(c.text, s.comment); }
  function initial(s) {
    const n = s.slides.length;
    const m = { order: Array.from({ length: n }, (_, i) => n - i - 1),
      positions: s.shapes.map((p) => ({ x: p.x, y: p.y })),
      styles: s.shapes.map(() => ({ bold: false, italic: false, color: 'Indigo', size: 20 })),
      selected: [], activeSlide: 0, selection: { start: 0, end: 0 },
      composer: { open: false, start: 0, end: 0 }, draft: '', comments: [],
      decisions: s.changes.map(() => 'pending'), view: {} };
    if (s.startMode === 'partial' || s.level === 'easy') {
      if (s.scenario === 'reorder') { m.order = s.order.slice(); [m.order[0], m.order[1]] = [m.order[1], m.order[0]]; }
      if (s.scenario === 'align') m.positions[0] = { x: distributedX(s, 0), y: alignY(s) };
      if (s.scenario === 'restyle') m.styles[s.element].bold = s.style.bold;
      if (s.scenario === 'comments') {
        const p = s.phrases[s.phrase]; m.selection = { start: p.start, end: p.end };
        m.composer = { open: true, ...m.selection }; m.draft = s.comment.slice(0, Math.floor(s.comment.length / 2));
      }
      if (s.scenario === 'trackchanges') {
        const i = s.decisions.findIndex((x) => x !== 'pending'); m.decisions[i] = s.decisions[i];
        // A one-revision task must still start unsolved.
        if (m.decisions.every((x, j) => x === s.decisions[j])) m.decisions[i] = 'pending';
      }
    }
    if (s.startMode === 'wrong') {
      m.order = s.order.slice().reverse();
      m.positions = s.shapes.map((p) => ({ x: p.x, y: s.edge === 'middle' ? 352 : 176 }));
      m.styles[s.element] = { bold: !s.style.bold, italic: !s.style.italic, color: 'Plum', size: 16 };
      m.comments = [{ ...s.phrases[(s.phrase + 1) % s.phrases.length], text: s.comment }];
      m.decisions = s.decisions.map((x) => x === 'pending' ? 'pending' : x === 'accept' ? 'reject' : 'accept');
    }
    return m;
  }
  function scored(m) { return [m.order, m.positions, m.styles, m.comments, m.decisions]; }
  function error(m, s) {
    if (s.judge) return JSON.stringify(scored(m)) === JSON.stringify(scored(s.judge.baseline)) ? 0 : 1;
    if (s.scenario === 'reorder') {
      const rank = Object.fromEntries(s.order.map((x, i) => [x, i])); let bad = 0;
      for (let i = 0; i < m.order.length; i++) for (let j = i + 1; j < m.order.length; j++) bad += rank[m.order[i]] > rank[m.order[j]] ? 1 : 0;
      return bad / (m.order.length * (m.order.length - 1) / 2);
    }
    if (s.scenario === 'align') return m.positions.reduce((a, p, i) => a + Math.abs(p.y - alignY(s)) / 400 + Math.abs(p.x - distributedX(s, i)) / 720, 0) / m.positions.length;
    if (s.scenario === 'restyle') return Math.min(1, m.styles.reduce((sum, st, i) => {
      const wanted = i === s.element ? s.style : { bold: false, italic: false, color: 'Indigo', size: 20 };
      return sum + ['bold', 'italic', 'color', 'size'].reduce((a, k) => a + (st[k] === wanted[k] ? 0 : k === 'size' ? Math.min(1, Math.abs(st[k] - wanted[k]) / 16) : 1), 0) / 4;
    }, 0));
    if (s.scenario === 'comments') {
      if (m.comments.length) return Math.min(1, Math.min(...m.comments.map((c) => commentCost(c, s))) + .25 * Math.abs(m.comments.length - 1));
      return m.composer.open ? .7 + .15 * spanCost(m.composer, s.phrases[s.phrase]) + .15 * levRatio(m.draft, s.comment) : 1;
    }
    return m.decisions.reduce((a, x, i) => a + (x === s.decisions[i] ? 0 : 1), 0) / s.decisions.length;
  }
  const tolerance = (s) => ({ tau: s.scenario === 'align' && !s.judge ? .003 : 0, sigma: .25, minInitialError: .025 });
  // A target outside its pane is scrolled in with a margin, and so is one within NEAR px of an edge it can be
  // scrolled away from: a drag that starts near the pane edge makes Chromium autoscroll the pane while the button
  // is down, by an amount that depends on wall time. Below the last target there may be nothing to scroll to.
  const NEAR = 24;
  function scrollTo(m, pane, top, bottom) {
    const v = m.view && m.view[pane];
    if (!v) return null;
    const margin = Math.max(6, Math.min(40, (v.height - (bottom - top)) / 2 - 1));
    if (top < v.scroll - .5) return { wheel: [{ pane }, top - v.scroll - margin] };
    if (bottom > v.scroll + v.height - .5) return { wheel: [{ pane }, bottom - v.scroll - v.height + margin] };
    const last = v.targets.length ? Math.max(...v.targets.map((x) => x[1])) : bottom;
    if (bottom > v.scroll + v.height - NEAR && bottom + NEAR <= last) {
      return { wheel: [{ pane }, bottom - v.scroll - v.height + Math.min(margin, last - bottom)] };
    }
    if (top < v.scroll + NEAR && v.scroll > 0) return { wheel: [{ pane }, Math.max(top - v.scroll - margin, -v.scroll)] };
    return null;
  }
  env.task({
    name: 'use-slides',
    reply: true, // judge and report endings are structured replies under the default reply=auto (kit/runtime/reply.js)
    scenarios: ['reorder', 'align', 'restyle', 'comments', 'trackchanges'],
    startModes: ['off', 'partial', 'wrong', 'solved'], judgeModes: ['ambiguous'],
    inputs: (s) => ['pointer', 'wheel', ...(['restyle', 'comments'].includes(s.scenario) || s.judge ? ['keyboard'] : [])],
    helpers: { COLORS, distributedX },
    sample(rng, opts) {
      const cr = rng.fork('content'), co = { csplit: opts.csplit || 'train' };
      const level = opts.level || 'normal', ood = !!opts.ood;
      const n = level === 'easy' ? 4 : level === 'medium' ? 5 : ood ? 7 : 6;
      const k = level === 'easy' ? 3 : ood ? 5 : 4;
      const paragraphs = C.paragraphs(cr, n, { ...co, domain: 'meeting', min: 2, max: 2 });
      let offset = 0;
      const phrases = paragraphs.map((text) => { const phrase = text.split(' ').slice(0, 4).join(' '); const p = { text: phrase, start: offset, end: offset + phrase.length }; offset += text.length + 2; return p; });
      const s = { scenario: opts.scenario || rng.pick(opts.scenarios || this.scenarios), level, ood,
        isplit: opts.isplit || 'train', csplit: co.csplit, startMode: opts.startMode || 'off',
        title: `${C.pick(cr, C.COMPANIES, co)} · Team briefing`, owner: C.personName(cr, co).full,
        slides: TITLES.slice(0, n).map((title) => ({ title, subtitle: C.pick(cr, C.TOPICS, co) })),
        shapes: LABELS.slice(0, k).map((label, i) => ({ label, x: i === 0 ? 40 : i === k - 1 ? 570 : 40 + 530 * i / (k - 1) + (i % 2 ? 10 : -10), y: 112 + i * 39, w: 110, h: 48 })),
        paragraphs, doc: paragraphs.join('\n\n'), phrases, changes: [],
        order: rng.shuffle(Array.from({ length: n }, (_, i) => i)), edge: rng.pick(['middle', 'bottom']),
        element: rng.int(0, k - 1), style: { bold: true, italic: level !== 'easy' && rng.bool(), color: rng.pick(['Teal', 'Coral', 'Forest']), size: rng.pick(ood ? [34, 38, 42] : [24, 28, 32]) },
        phrase: rng.int(0, paragraphs.length - 1), comment: C.pick(cr, [
          'Please confirm this with the team.', 'Could we include the latest figures?',
          'Please add the source before sharing.', 'Let us revisit this at the next review.',
          'This needs a clearer delivery date.', 'Could we make the key point clearer?',
          'Maybe add a brief recap at the end.', 'Could this section use a clear heading?',
          'Could we shorten the opening paragraph?', 'The flow here could be more natural.',
          'This section frames the topic clearly.', 'This part fits the wider discussion.',
          'The closing thought feels a bit abrupt.'
        ], co),
        baseComment: { author: C.personName(cr, co).full, text: 'Thanks for pulling this draft together.' },
      };
      const before = ['three weeks', 'the design team', 'a small pilot', 'the first milestone', 'a draft summary', 'the current forecast', 'the next review'];
      const after = ['four weeks', 'the delivery team', 'a wider pilot', 'the second milestone', 'a final summary', 'the revised forecast', 'the final review'];
      s.changes = before.slice(0, n).map((text, i) => ({ before: text, after: after[i], author: C.personName(cr, co).full }));
      const count = level === 'easy' ? 1 : level === 'medium' ? 2 : ood ? 4 : 3;
      const chosen = rng.sample(Array.from({ length: n }, (_, i) => i), count);
      s.decisions = s.changes.map((_, i) => chosen.includes(i) ? (chosen.indexOf(i) % 2 ? 'reject' : 'accept') : 'pending');
      // Ensure an off start cannot accidentally match the reverse-order initial rail.
      if (s.order.every((x, i) => x === n - i - 1)) [s.order[0], s.order[1]] = [s.order[1], s.order[0]];
      if (opts.judge === 'ambiguous') {
        s.shapes[1].label = s.shapes[0].label;
        s.judge = { mode: 'ambiguous', label: s.shapes[0].label, cands: [[s.shapes[0].label], [s.shapes[0].label]],
          others: s.shapes.slice(2).map((x) => [x.label]),
          message: `Which of the two "${s.shapes[0].label}" shapes do you mean?` };
        s.judge.baseline = initial(s);
      }
      return s;
    },
    init: (s) => s.judge ? U.clone(s.judge.baseline) : initial(s), error, tolerance,
    instruction(s, rng) {
      let core;
      if (s.judge) core = `Format "${s.judge.label}" as ${s.style.bold ? 'bold' : 'regular'}${s.style.italic ? ' italic' : ', non-italic'} text, ${s.style.color}, ${s.style.size} pt. Leave the other shapes unchanged.`;
      else if (s.scenario === 'reorder') core = I.phrase(rng, [
        'Arrange the slides in this order: {order}.', 'Use this slide order for the presentation: {order}.',
        'Put the deck into this sequence: {order}.', 'Make all slides run first to last: {order}.',
        'Move each slide to its listed place: {order}.', 'The deck must follow this exact list: {order}.',
        'Have the slides appear as follows: {order}.'
      ], { order: s.order.map((i) => `"${s.slides[i].title}"`).join(', ') }, s.isplit);
      else if (s.scenario === 'align') core = `Align all ${s.shapes.length} labelled shapes to the ${s.edge === 'middle' ? 'vertical middle' : 'bottom'} of the slide and distribute them evenly horizontally. Keep the outer shapes at their current horizontal positions.`;
      else if (s.scenario === 'restyle') core = `Format "${s.shapes[s.element].label}" as ${s.style.bold ? 'bold' : 'regular'}${s.style.italic ? ' italic' : ', non-italic'} text, ${s.style.color}, ${s.style.size} pt. Leave the other shapes unchanged.`;
      else if (s.scenario === 'comments') core = I.phrase(rng, [
        'Add the comment "{comment}" to the exact phrase "{phrase}".',
        'Attach "{comment}" as a comment on "{phrase}".', 'Comment on the phrase "{phrase}" with "{comment}".',
        '"{comment}" is the comment to post on "{phrase}".'
      ], { comment: s.comment, phrase: s.phrases[s.phrase].text }, s.isplit);
      else core = s.decisions.map((x, i) => x === 'pending' ? '' : `${x === 'accept' ? 'Accept' : 'Reject'} the change from "${s.changes[i].before}" to "${s.changes[i].after}"`).filter(Boolean).join('; ') + '. Leave all other changes pending.';
      return I.say(rng, core, { isplit: s.isplit });
    },
    judged: (m, s) => error(m, s) === 0, // the reply itself is graded by the kit
    parts(m, s) {
      if (s.judge) return [];
      if (s.scenario === 'reorder') return s.slides.map((slide, i) => ({ name: slide.title, value: m.order.indexOf(i) }));
      if (s.scenario === 'align') return s.shapes.flatMap((x, i) => [
        { name: `${x.label} vertical position`, aliases: [`${x.label} vertical`, `${x.label} y`], value: m.positions[i].y },
        { name: `${x.label} horizontal position`, aliases: [`${x.label} horizontal`, `${x.label} x`], value: m.positions[i].x }]);
      if (s.scenario === 'restyle') return s.shapes.map((x, i) => ({ name: x.label, value: m.styles[i] }));
      if (s.scenario === 'comments') return [{ name: 'Comment', value: [m.composer.open, m.composer.start, m.composer.end, m.draft] },
        ...s.phrases.map((p) => ({ name: p.text, value: m.comments.filter((c) => c.start === p.start).map((c) => c.text) }))];
      return s.changes.map((c, i) => ({ name: `${c.before} to ${c.after}`, aliases: [`${c.before} ${c.after}`], value: m.decisions[i] }));
    },
    plan(m, s) {
      if (s.judge) return { finish: true, message: s.judge.message };
      if (s.scenario === 'reorder') {
        const i = m.order.findIndex((x, j) => x !== s.order[j]); if (i < 0) return null;
        const j = m.order.indexOf(s.order[i]), to = j - 1;
        const v = m.view.rail;
        const scroll = v && scrollTo(m, 'rail', 6 + to * v.pitch + 30.5, 6 + j * v.pitch + 30.5); if (scroll) return scroll;
        return { drag: [{ slide: m.order[j] }, { slot: to }] };
      }
      if (s.scenario === 'align') {
        if (m.selected.length !== s.shapes.length) return { click: { tool: 'selectAll' } };
        if (m.positions.some((p) => Math.abs(p.y - alignY(s)) > .1)) return { click: { tool: s.edge } };
        if (m.positions.some((p, i) => Math.abs(p.x - distributedX(s, i)) > .1)) return { click: { tool: 'distribute' } };
        return null;
      }
      if (s.scenario === 'restyle') {
        const desired = m.styles.map((_, i) => i === s.element ? s.style : { bold: false, italic: false, color: 'Indigo', size: 20 });
        const i = m.styles.findIndex((st, j) => Object.keys(desired[j]).some((key) => st[key] !== desired[j][key]));
        if (i < 0) return null;
        if (m.selected.length !== 1 || m.selected[0] !== i) return { click: { shape: i } };
        const st = m.styles[i], goal = desired[i];
        if (st.bold !== goal.bold) return { click: { tool: 'bold' } };
        if (st.italic !== goal.italic) return { click: { tool: 'italic' } };
        if (st.color !== goal.color) return { click: { color: goal.color } };
        if (st.size !== goal.size) return { type: [{ field: 'size' }, String(goal.size)] };
        return null;
      }
      if (s.scenario === 'comments') {
        if (m.comments.length === 1 && commentCost(m.comments[0], s) === 0) return null;
        if (m.comments.length) {
          const v = m.view.comments, box = v && v.targets[0], scroll = box && scrollTo(m, 'comments', box[0], box[1]);
          return scroll || { click: { deleteComment: 0 } };
        }
        const p = s.phrases[s.phrase], v = m.view.document;
        const box = v && v.targets[s.phrase], scroll = box && scrollTo(m, 'document', box[0], box[1]); if (scroll) return scroll;
        if (!m.composer.open || spanCost(m.composer, p) !== 0) {
          if (spanCost(m.selection, p) !== 0) return { drag: [{ char: p.start, edge: 'before' }, { char: p.end - 1, edge: 'after' }] };
          return { click: { tool: 'comment' } };
        }
        if (m.draft !== s.comment) return { type: [{ field: 'comment' }, s.comment] };
        return { click: { tool: 'post' } };
      }
      const i = m.decisions.findIndex((x, j) => x !== s.decisions[j]); if (i < 0) return null;
      const v = m.view.review, box = v && v.targets[i], scroll = box && scrollTo(m, 'review', box[0], box[1]); if (scroll) return scroll;
      return { click: { revision: i, action: m.decisions[i] !== 'pending' ? 'undo' : s.decisions[i] } };
    },
    solve(s, m) {
      if (s.judge) return U.clone(s.judge.baseline);
      const out = U.clone(m);
      if (s.scenario === 'reorder') out.order = s.order.slice();
      if (s.scenario === 'align') out.positions = s.shapes.map((_, i) => ({ x: distributedX(s, i), y: alignY(s) }));
      if (s.scenario === 'restyle') out.styles = out.styles.map((_, i) => i === s.element ? { ...s.style } : { bold: false, italic: false, color: 'Indigo', size: 20 });
      if (s.scenario === 'comments') out.comments = [{ ...s.phrases[s.phrase], text: s.comment }];
      if (s.scenario === 'trackchanges') out.decisions = s.decisions.slice();
      return out;
    },
    facts(m, s) {
      const base = [{ label: 'Owner', value: s.owner }];
      if (s.scenario === 'comments') return [...base, { label: 'Comments', value: String(1 + m.comments.length) }, { label: 'Words', value: String(s.doc.split(/\s+/).length) }];
      if (s.scenario === 'trackchanges') return [...base, { label: 'Pending changes', value: String(m.decisions.filter((x) => x === 'pending').length) }, { label: 'Reviewed', value: String(m.decisions.filter((x) => x !== 'pending').length) }];
      return [...base, { label: 'Slides', value: String(m.order.length) }, { label: 'Objects', value: String(m.positions.length) }];
    },
    silent(next, prev, s, rng) {
      if (s.judge || error(next, s) >= error(prev, s)) return null;
      const out = U.clone(next);
      if (s.scenario === 'reorder') out.order = prev.order.slice();
      if (s.scenario === 'align') {
        const moved = next.positions.map((p, i) => p.x !== prev.positions[i].x || p.y !== prev.positions[i].y ? i : -1).filter((i) => i >= 0);
        if (!moved.length) return null; const i = rng.pick(moved); out.positions[i] = { ...prev.positions[i] };
      }
      if (s.scenario === 'restyle') out.styles[s.element] = { ...prev.styles[s.element] };
      if (s.scenario === 'comments') {
        if (next.comments.length > prev.comments.length) out.comments[out.comments.length - 1].text = s.comment.slice(0, -5);
        else return null;
      }
      if (s.scenario === 'trackchanges') {
        const i = next.decisions.findIndex((x, j) => x !== prev.decisions[j]); if (i < 0) return null; out.decisions[i] = prev.decisions[i];
      }
      return error(out, s) > tolerance(s).tau ? out : null;
    },
    retarget(s, m, rng) {
      if (s.judge) return null;
      const out = U.clone(s);
      if (s.scenario === 'reorder') { out.order = m.order.slice(); const i = rng.int(0, out.order.length - 2); [out.order[i], out.order[i + 1]] = [out.order[i + 1], out.order[i]]; }
      if (s.scenario === 'align') out.edge = s.edge === 'middle' ? 'bottom' : 'middle';
      if (s.scenario === 'restyle') out.style = { ...s.style, color: rng.pick(Object.keys(COLORS).filter((x) => x !== m.styles[s.element].color)), size: s.style.size + 2 };
      if (s.scenario === 'comments') out.phrase = (s.phrase + 1) % s.phrases.length;
      if (s.scenario === 'trackchanges') { const i = rng.int(0, out.decisions.length - 1); out.decisions[i] = rng.pick(STATUSES.filter((x) => x !== m.decisions[i])); }
      return error(m, out) > tolerance(out).tau ? out : null;
    },
  });
})();
