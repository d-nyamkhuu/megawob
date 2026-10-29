/*
 * find-fact/similar: similar widget extracted from the L1 medoid design-find-fact-table-01.
 * Scenarios served: similar. With design: {} reproduces design-find-fact-similar-01 exactly.
 * Other widget builders and wrapper registration code are deliberately omitted.
 * Tokens (defaults first; VARIANTS below applies the scenario's shared presentation):
 *   roomInset: [48, 48], full-stage room width/height subtraction.
 *   briefSelector: null, optional source briefing host selector (9/12 sites).
 *   briefText: 'Choose all words from the list on the right that are similar in meaning to the source words.'
 *   wordRows: null, or column divisor for --word-rows (4/12 sites).
 * Scenario preset: similar: briefSelector .ds-brief; exact default site similar-01 (9/12 have a briefing).
 * Parts (replace with (base, S) => replacement; call inner parts through S.P):
 *   style() -> void; install the original rl-style stylesheet once
 *   frame(ctx) -> {app, work, room}; full-stage frame with roomInset
 *   card(util, parent, title, sub) -> {card, body}; original card DOM
 *   begin(ctx) -> void; before frame, default no-op
 *   framed(ctx, frame, up) -> void; before widget, invokes P.briefing(ctx)
 *   rendered(ctx, frame, up) -> void; after widget, default no-op
 *   build(ctx, work, up, room) -> view; original checkbox grid and bindings
 *   briefing(ctx) -> void; source-word briefing when briefSelector matches
 *   wordCard(ctx, card, body, work) -> void; after minWidth, default no-op
 *   hint(ctx, card, body) -> void; after sampled hint, default no-op
 *   grid(ctx, card, body, grid) -> void; before options, default no-op
 *   option(ctx, grid, word, index) -> label; original label parent and placement
 *   marked(ctx, model) -> void; after selection classes, default no-op
 *   ready(ctx, B) -> void; after initial selection, default no-op; B={c,body,grid,labels,inputs,ch,mark,up}
 * S.ctx, S.spec, S.view and S.frame are live getters; S.D and S.P expose resolved tokens/parts.
 * All episode state belongs to this factory. Hooks run before anchors are returned.
 * Preserve each replaced part's rng draws and order; fork any new decoration randomness.
 */
(function () {
  'use strict';




  const TOKENS = { roomInset: [48, 48], briefSelector: null, briefText: 'Choose all words from the list on the right that are similar in meaning to the source words.', wordRows: null };
  const SCENARIOS = { similar: { briefSelector: '.ds-brief' } };

  env.template('find-fact/similar', (design, def) => {
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
    BASE.build = (ctx, work, up, room) => {
      const { spec, util, rng } = ctx;
      const { card: c, body } = P.card(util, work, rng.pick(['Word list', 'Synonym check', 'Vocabulary']), `${spec.words.length} words`);
      c.style.minWidth = '300px';
      P.wordCard(ctx, c, body, work);
      const tiles = rng.bool(0.45);
      const rowsFit = Math.floor((room.h - 110) / (tiles ? 42 : 38));
      const cols = spec.words.length > rowsFit || (spec.words.length > 4 && rng.bool(0.6)) ? 2 : 1;
      if (rng.bool(0.6)) util.el('div', 'rl-hint', body, rng.pick(['Tick every word that means the same as one of the words in the task.', 'Check all synonyms that apply.', 'Select the matching words.']));
      P.hint(ctx, c, body);
      const grid = util.el('div', 'rl-words' + (tiles ? ' tiles' : ''), body);
      grid.style.gridTemplateColumns = `repeat(${cols}, minmax(150px, max-content))`;
      if (tiles) grid.style.gap = '8px 12px';
      if (D.wordRows) grid.style.setProperty('--word-rows', Math.ceil(spec.words.length / D.wordRows));
      P.grid(ctx, c, body, grid);
      const labels = {};
      const inputs = spec.words.map((w, i) => {
        const lab = P.option(ctx, grid, w, i);
        lab.dataset.role = 'option';
        const inp = util.el('input', '', lab);
        inp.type = 'checkbox';
        inp.value = w.text;
        util.el('span', '', lab, w.text);
        labels[w.text] = lab;
        return [w.text, inp];
      });
      const ch = env.ui.choices(inputs, {
        label: 'word',
        multi: true,
        values: ctx.model.values,
        onChange(values) {
          const order = spec.words.map((w) => w.text);
          up({ values: order.filter((x) => values.includes(x)) });
          mark(ctx.model);
        },
      });
      function mark(m) {
        for (const w of spec.words) labels[w.text].classList.toggle('on', m.values.includes(w.text));
        P.marked(ctx, m);
      }
      mark(ctx.model);
      P.ready(ctx, { c, body, grid, labels, inputs, ch, mark, up });
      return {
        sync(m) { ch.set(m.values); mark(m); },
        locate: (t) => (t.word !== undefined ? ch.locate(t.word) : null),
      };
    };
    BASE.wordCard = () => {};
    BASE.hint = () => {};
    BASE.grid = () => {};
    BASE.marked = () => {};
    BASE.ready = () => {};
    BASE.option = (ctx, grid, word, index) => {
      return ctx.util.el('label', 'rl-cb', grid);
    };
    BASE.briefing = (ctx) => {
      const brief = D.briefSelector && document.querySelector(D.briefSelector);
      if (!brief) return;
      ctx.util.el('hr', 'ds-rule', brief);
      ctx.util.el('b', 'ds-source-label', brief, 'Source words:');
      ctx.util.el('div', 'ds-words', brief, ctx.spec.given.join('\n'));
      ctx.util.el('p', 'ds-note', brief, D.briefText);
    };
    BASE.framed = (ctx) => P.briefing(ctx);

    ({ D, P } = env.templateDesign('find-fact/similar', design, def, { tokens: TOKENS, scenarios: SCENARIOS, base: BASE, state: S }));
    return {
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
