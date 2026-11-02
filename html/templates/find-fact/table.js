/*
 * find-fact/table: table widget extracted from the L1 medoid design-find-fact-table-01.
 * Scenarios served: table. With design: {} reproduces design-find-fact-table-01 exactly.
 * Other widget builders and wrapper registration code are deliberately omitted.
 * Tokens (defaults first; VARIANTS below applies the scenario's shared presentation):
 *   roomInset: [48, 48], full-stage room width/height subtraction.
 *   emptyLabel: null, fallback label for unlabeled answer fields.
 *   multipleTitle: 'Answer form', title when there are multiple fields.
 *   answerNote: true, sample the original single-field note.
 *   preserveNote: false, keep .ds-header-note when dropping reply controls.
 *   recordHeader: null, or ['Field', 'Value'] for records (4/12 sites).
 * Scenario preset: none; no added table feature occurs in a majority of the 12 sites.
 * Parts (replace with (base, S) => replacement; call inner parts through S.P):
 *   style() -> void; install the original rl-style stylesheet once
 *   frame(ctx) -> {app, work, room}; full-stage frame with roomInset
 *   card(util, parent, title, sub) -> {card, body}; original card DOM
 *   begin(ctx) -> void; before frame, default no-op
 *   framed(ctx, frame, up) -> void; before widget, default no-op
 *   rendered(ctx, frame, up) -> void; after widget, default no-op
 *   input(util, parent, role, placeholder) -> input; text input with original attributes
 *   answerTitle(ctx, labels) -> string; sampled single title / multipleTitle
 *   placeholder(ctx, label) -> string; sampled when unlabeled
 *   answerCard(ctx, card, body) -> void; before fields, default no-op
 *   answerForm(ctx, parent, labels, model, onEdit) -> fields; controlled answer fields
 *   dropAnswer(ctx, app) -> void; remove answer controls in reply mode, optionally keep header note
 *   fits(el, room) -> bool; compare bounds to room
 *   build(ctx, work, up, room) -> view; source table and answers
 *   source(ctx, card, body) -> void; before source table, default no-op
 *   table(ctx, table, body) -> void; before source headers, default no-op
 *   answers(ctx, B) -> void; answer arrangement before fitting, default no-op
 *   fit(ctx, B) -> void; original compact/narrow/grow/tight sequence
 *   fitted(ctx, B) -> void; after fit, default no-op
 * B in layout hooks is {work, room, tc, body, t, form, fields, up}.
 * S.ctx, S.spec, S.view and S.frame are live getters; S.D and S.P expose resolved tokens/parts.
 * All episode state belongs to this factory. Hooks run before anchors are returned.
 * Preserve each replaced part's rng draws and order; fork any new decoration randomness.
 */
(function () {
  'use strict';



  const NOTES = ['Type the value exactly as asked.', 'Copy values exactly as they appear.', 'Leading and trailing spaces are ignored.'];


  const TOKENS = { roomInset: [48, 48], emptyLabel: null, multipleTitle: 'Answer form', answerNote: true, preserveNote: false, recordHeader: null };
  const SCENARIOS = {};

  env.template('find-fact/table', (design, def) => {
    const { CSS } = env.templateLib('find-fact/_style');
    let D, P;
    let view = null;
    let ctxRef, frameRef;
    const BASE = {};
    const S = {
      get ctx() { return ctxRef; }, get spec() { return ctxRef && ctxRef.spec; },
      get view() { return view; }, get frame() { return frameRef; },
      get D() { return D; }, get P() { return P; },
    };
    BASE.style = () => {
      if (document.getElementById('rl-style')) return;
      const s = document.createElement('style');
      s.id = 'rl-style';
      s.textContent = CSS;
      document.head.append(s);
    };
    BASE.frame = (ctx) => {
      const { util, size } = ctx;
      const app = util.el('div', 'rl-app', ctx.stage);
      app.style.cssText = 'position:absolute;inset:0;display:flex;flex-direction:column';
      const work = util.el('div', 'rl-work', app);
      return { app, work, room: { w: size.width - D.roomInset[0], h: size.height - D.roomInset[1], grow: () => false } };
    };
    BASE.card = (util, parent, title, sub) => {
      const c = util.el('div', 'rl-card', parent);
      const h = util.el('h3', '', c, title);
      if (sub) util.el('small', '', h, sub);
      const b = util.el('div', 'rl-card-b', c);
      return { card: c, body: b };
    };
    BASE.begin = () => {};
    BASE.framed = () => {};
    BASE.rendered = () => {};
    BASE.input = (util, parent, role, placeholder) => {
      const inp = util.el('input', 'rl-input', parent);
      inp.type = 'text';
      inp.autocomplete = 'off';
      inp.spellcheck = false;
      inp.dataset.role = role;
      if (placeholder) inp.placeholder = placeholder;
      return inp;
    };
    BASE.answerForm = (ctx, parent, labels, model, onEdit) => {
      const { util, rng } = ctx;
      const inline = labels.length > 1 && labels.every((l) => l && l.length <= 14) && rng.bool(0.5);
      const { card: c, body } = P.card(util, parent, P.answerTitle(ctx, labels));
      c.classList.add('rl-form');
      P.answerCard(ctx, c, body);
      if (inline) c.classList.add('inline');
      const fields = labels.map((label, i) => {
        const f = util.el('div', 'rl-field', body);
        const id = `rl-f${i}`;
        if (label || D.emptyLabel) {
          const l = util.el('label', '', f, label || D.emptyLabel);
          l.htmlFor = id;
        }
        const inp = P.input(util, f, 'field', P.placeholder(ctx, label));
        inp.id = id;
        return env.ui.textField(inp, { value: model.answers[i] || '', label: `answer${i}`, onInput: (v) => onEdit(i, v) });
      });
      if (D.answerNote && labels.length === 1 && rng.bool(0.4)) util.el('div', 'rl-note', body, rng.pick(NOTES));
      return fields;
    };
    BASE.answerTitle = (ctx, labels) => {
      return labels.length > 1 ? D.multipleTitle : ctx.rng.pick(['Answer', 'Your answer', 'Response']);
    };
    BASE.placeholder = (ctx, label) => {
      return label ? '' : ctx.rng.pick(['Type your answer', 'Answer', 'Type here']);
    };
    BASE.answerCard = () => {};
    BASE.dropAnswer = (ctx, app) => {
      if (ctx.episode.answer !== 'reply') return;
      if (D.preserveNote) {
        app.querySelectorAll('.rl-form').forEach((form) => {
          const note = form.querySelector('.ds-header-note');
          if (!note) return form.remove();
          Array.from(form.children).forEach((c) => { if (c !== note) c.remove(); });
        });
        app.querySelectorAll('.rl-ans, .rl-strip > label, .rl-strip > .rl-input').forEach((el) => el.remove());
      } else app.querySelectorAll('.rl-form, .rl-ans, .rl-strip > label, .rl-strip > .rl-input').forEach((el) => el.remove());
      app.querySelectorAll('.rl-strip').forEach((el) => { if (!el.textContent.trim()) el.remove(); });
    };
    BASE.fits = (el, room) => { const r = el.getBoundingClientRect(); return r.width <= room.w + 1 && r.height <= room.h + 1; };
    BASE.build = (ctx, work, up, room) => {
      const { spec, util, rng } = ctx;
      const sub = spec.kind === 'record' ? `ID ${rng.int(10000, 99999)}` : `${spec.rows.length} rows`;
      const { card: tc, body } = P.card(util, work, spec.title, sub);
      P.source(ctx, tc, body);
      body.style.padding = '0';
      const t = util.el('table', 'rl-table' + (spec.kind === 'record' ? ' kv' : '') + (rng.bool(0.6) ? ' striped' : ''), body);
      t.style.setProperty('--rl-pad', rng.pick(['6px', '7px', '8px']));
      P.table(ctx, t, body);
      const numeric = (c) => spec.kind === 'grid' && spec.cols[c].num;
      if (spec.kind === 'grid') {
        const tr = util.el('tr', '', util.el('thead', '', t));
        spec.columns.forEach((c, i) => util.el('th', numeric(i) ? 'num' : '', tr, c));
      }
      if (spec.kind === 'record' && D.recordHeader) {
        const tr = util.el('tr', '', util.el('thead', '', t));
        D.recordHeader.forEach((label) => util.el('th', '', tr, label));
      }
      const tb = util.el('tbody', '', t);
      spec.rows.forEach((r) => {
        const tr = util.el('tr', '', tb);
        r.forEach((v, i) => util.el('td', (i === 0 ? 'key' : '') + (numeric(i) ? ' num' : ''), tr, v));
      });
      const fields = P.answerForm(ctx, work, spec.fields.map((f) => f.label), ctx.model, (i, v) => {
        const answers = ctx.model.answers.slice();
        answers[i] = v;
        up({ answers });
      });
      tc.style.flex = 'none';
      const form = work.lastElementChild;
      const B = { work, room, tc, body, t, form, fields, up };
      P.answers(ctx, B);
      P.fit(ctx, B);
      P.fitted(ctx, B);
      return {
        sync(m) { fields.forEach((f, i) => f.set(m.answers[i])); },
        locate: (tg) => (tg.field !== undefined && fields[tg.field] ? fields[tg.field].locate() : null),
      };
    };
    BASE.source = () => {};
    BASE.table = () => {};
    BASE.answers = () => {};
    BASE.fitted = () => {};
    BASE.fit = (ctx, B) => {
      const { work, room, tc, t, form } = B;
      // Too wide or too tall: compact table first, then a narrower answer card (so it goes beside the
      // table), then tighter rows, until the answer card ends inside the work area.
      const wr = () => work.getBoundingClientRect();
      const over = () => !P.fits(work, { w: room.w + 40, h: room.h + 32 }) || form.getBoundingClientRect().bottom > wr().bottom - 4
        || work.scrollHeight > work.clientHeight + 1 || work.scrollWidth > work.clientWidth + 1;
      if (over() || form.getBoundingClientRect().top > tc.getBoundingClientRect().top + 1) t.classList.add('compact');
      if (over()) form.classList.add('narrow');
      if (over()) room.grow();
      if (over()) t.classList.add('tight');
    };

    ({ D, P } = env.templateDesign('find-fact/table', design, def, { tokens: TOKENS, scenarios: SCENARIOS, base: BASE, state: S }));
    return {
      answerReply: true,
      render(ctx) {
        ctxRef = ctx;
        P.style();
        P.begin(ctx);
        frameRef = P.frame(ctx);
        const { app, work, room } = frameRef;
        const up = (patch) => ctx.update({ ...ctx.model, ...patch });
        P.framed(ctx, frameRef, up);
        view = P.build(ctx, work, up, room);
        P.rendered(ctx, frameRef, up);
        P.dropAnswer(ctx, app);
        return { anchors: [app], sync: (m) => view.sync(m) };
      },
      locate(t) {
        const p = view && view.locate(t);
        if (!p) throw new Error(`find-fact/records cannot locate ${JSON.stringify(t)}`);
        return p;
      },
    };
  }, { uses: ['find-fact/_style'] });
})();
