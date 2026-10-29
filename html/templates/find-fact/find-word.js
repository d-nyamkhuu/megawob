/*
 * find-fact/find-word: find-word widget extracted from the L1 medoid design-find-fact-table-01.
 * Scenarios served: find-word. With design: {} reproduces design-find-fact-find-word-02 exactly.
 * Other widget builders and wrapper registration code are deliberately omitted.
 * Tokens (defaults first; VARIANTS below applies the scenario's shared presentation):
 *   roomInset: [48, 48], full-stage room width/height subtraction.
 *   emptyLabel: null, fallback label for unlabeled answer fields.
 *   multipleTitle: 'Answer form', title when there are multiple fields.
 *   answerNote: true, sample the original single-field note.
 *   preserveNote: false, keep .ds-header-note when dropping reply controls.
 *   sampledFrame: false, opt into the seeded app frame (preset true for 11/12 sites).
 * Scenario preset: find-word: sampledFrame true; exact default site find-word-02 (also -03).
 * Parts (replace with (base, S) => replacement; call inner parts through S.P):
 *   style() -> void; install the original rl-style stylesheet once
 *   frame(ctx) -> {app, work, room}; dispatch to sampledFrame or fullFrame by token
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
 *   fits(el, room) -> bool; original bounding-box fit
 *   fullFrame(ctx) -> frame; full-stage alternative, roomInset applied
 *   sampledFrame(ctx) -> frame; seeded records frame and bar (11/12)
 *   usable(ctx) -> box; stage excluding floating end control
 *   build(ctx, work, up, room) -> view; passage and answer
 *   readingTitle(ctx) -> string; original rng-picked title
 *   readingCard(ctx, card, body, work) -> void; after card class, default no-op
 *   paragraphs(ctx, card, body) -> void; plain source paragraphs
 *   counters(ctx, card, body) -> void; word/character counter hook (2/12), default no-op
 *   answers(ctx, B) -> void; after form, before fit, default no-op
 *   fit(ctx, B) -> void; original 16/15/14/13 font-fit loop
 *   fitted(ctx, B) -> void; extra layout fit after original loop, default no-op
 * B in layout hooks is {work, room, rc, body, fields, up}.
 * S.ctx, S.spec, S.view and S.frame are live getters; S.D and S.P expose resolved tokens/parts.
 * All episode state belongs to this factory. Hooks run before anchors are returned.
 * Preserve each replaced part's rng draws and order; fork any new decoration randomness.
 */
(function () {
  'use strict';



  const APPS = ['Ledger', 'Recordly', 'Filebase', 'Archivo', 'Datasheet', 'Registry', 'Tablewise', 'Lookout'];
  const TABS = { 'find-word': ['Library', 'Reading', 'Notes', 'Settings'] };
  const ACTIVE = { 'find-word': 1 };
  const NOTES = ['Type the value exactly as asked.', 'Copy values exactly as they appear.', 'Leading and trailing spaces are ignored.'];


  const TOKENS = { roomInset: [48, 48], emptyLabel: null, multipleTitle: 'Answer form', answerNote: true, preserveNote: false, sampledFrame: false };
  const SCENARIOS = { 'find-word': { sampledFrame: true } };

  env.template('find-fact/find-word', (design, def) => {
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
    BASE.sampledFrame = (ctx) => {
      const { util, rng, spec } = ctx;
      const box = P.usable(ctx);
      const app = util.el('div', 'rl-app', ctx.stage);
      const maxW = Math.min(box.w - 16, 1180);
      const W = Math.round(Math.max(Math.min(maxW, 640), maxW * rng.float(0.8, 1)));
      const H = Math.round(Math.min(box.h - 12, 760));
      app.style.width = W + 'px';
      app.style.height = H + 'px';
      const align = rng.pick(['start', 'center', 'center', 'end']);
      const left = align === 'start' ? 8 : align === 'end' ? box.w - W - 8 : (box.w - W) / 2;
      app.style.left = Math.round(box.x + Math.max(0, left)) + 'px';
      app.style.top = Math.round(box.y + Math.max(0, (box.h - H) / 2)) + 'px';
      const bar = util.el('div', 'rl-bar', app);
      const brand = util.el('div', 'rl-brand', bar);
      util.el('span', 'rl-mark', brand);
      util.el('span', '', brand, rng.pick(APPS));
      const tabs = util.el('div', 'rl-tabs', bar);
      if (W >= 700) TABS[spec.scenario].forEach((t, i) => util.el('span', i === ACTIVE[spec.scenario] ? 'on' : '', tabs, t));
      const user = util.el('div', 'rl-user', bar);
      const who = rng.pick(['J. Doe', 'A. Kim', 'M. Silva', 'R. Lee', 'T. Park', 'S. Okafor']);
      util.el('span', '', user, who);
      util.el('i', '', user, who.replace(/[^A-Z]/g, ''));
      const work = util.el('div', 'rl-work', app);
      // Room inside the work area (padding 16 / 20).
      const room = { w: W - 2 - 40, h: H - 2 - 46 - 32 };
      // Last-resort widening (a builder whose content does not fit): full usable width, same alignment.
      room.grow = () => {
        const W2 = Math.round(maxW);
        if (W2 <= W) return false;
        const l2 = align === 'start' ? 8 : align === 'end' ? box.w - W2 - 8 : (box.w - W2) / 2;
        app.style.width = W2 + 'px';
        app.style.left = Math.round(box.x + Math.max(0, l2)) + 'px';
        room.w = W2 - 2 - 40;
        return true;
      };
      return { app, work, room };
    };
    BASE.fullFrame = BASE.frame;
    BASE.frame = (ctx) => D.sampledFrame ? P.sampledFrame(ctx) : P.fullFrame(ctx);
    BASE.usable = (ctx) => {
      const box = { x: 0, y: 0, w: ctx.size.width, h: ctx.size.height };
      const st = ctx.stage.getBoundingClientRect();
      const sub = env.submitEl && env.submitEl.getBoundingClientRect();
      if (sub && sub.width && sub.left < st.right && sub.right > st.left && sub.top < st.bottom && sub.bottom > st.top) {
        const cutH = st.bottom - sub.top + 10;
        const cutW = st.right - sub.left + 10;
        if (cutH * box.w <= cutW * box.h) box.h -= cutH;
        else box.w -= cutW;
      }
      return box;
    };
    BASE.build = (ctx, work, up, room) => {
      const { spec, util, rng } = ctx;
      const title = P.readingTitle(ctx);
      const { card: rc, body } = P.card(util, work, title, spec.mode === 'nth' ? '1 paragraph' : `${spec.paragraphs.length} paragraphs`);
      rc.classList.add('rl-read');
      P.readingCard(ctx, rc, body, work);
      rc.style.maxWidth = Math.min(660, room.w) + 'px';
      P.paragraphs(ctx, rc, body);
      P.counters(ctx, rc, body);
      const fields = P.answerForm(ctx, work, [null], ctx.model, (i, v) => up({ answers: [v] }));
      const B = { rc, body, work, room, fields, up };
      P.answers(ctx, B);
      P.fit(ctx, B);
      P.fitted(ctx, B);
      return {
        sync(m) { fields[0].set(m.answers[0]); },
        locate: (tg) => (tg.field === 0 ? fields[0].locate() : null),
      };
    };
    BASE.readingTitle = (ctx) => {
      return ctx.rng.pick(['Daily reading', 'Passage', 'Excerpt', 'Field notes', 'Article', 'Memo']);
    };
    BASE.paragraphs = (ctx, rc, body) => {
      for (const p of ctx.spec.paragraphs) ctx.util.el('p', '', body, p);
    };
    BASE.readingCard = () => {};
    BASE.counters = () => {};
    BASE.answers = () => {};
    BASE.fitted = () => {};
    BASE.fit = (ctx, B) => {
      const { work, room, rc } = B;
      for (const fs of [16, 15, 14, 13]) {
        if (P.fits(work, { w: room.w + 40, h: room.h + 32 }) && work.scrollHeight <= work.clientHeight + 1) break;
        rc.style.setProperty('--rl-fs', fs + 'px');
      }
    };

    ({ D, P } = env.templateDesign('find-fact/find-word', design, def, { tokens: TOKENS, scenarios: SCENARIOS, base: BASE, state: S }));
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
