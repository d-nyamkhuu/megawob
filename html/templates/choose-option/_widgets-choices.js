/* choose-option/_widgets-choices: widget template parts, installed in their original order.
 * All BASE keys remain design-overridable through the parent template.
 */
(function () {
  'use strict';
  function install(scopeRef) {
    scopeRef.BASE.choiceGrid = (ctx, group, n, cols) => {
      if (scopeRef.D.choiceFlow) group.style.gridAutoFlow = scopeRef.D.choiceFlow;
      if (scopeRef.D.choiceFlow || scopeRef.D.choiceRows)
        group.style.gridTemplateRows = `repeat(${Math.ceil(n / (scopeRef.D.choiceRows || cols))}, auto)`;
    };

    scopeRef.BASE.choiceBeforeText = () => {};

    scopeRef.BASE.choiceDetail = (ctx, option) =>
      (ctx.spec.details && ctx.spec.details[option]) || scopeRef.D.detailTable[option] || scopeRef.D.detailFallback;

    scopeRef.BASE.choicesReady = (ctx, controls) => {
      const clear = scopeRef.D.clearSelector && document.querySelector(scopeRef.D.clearSelector);
      if (clear)
        clear.addEventListener('click', () => {
          scopeRef.set({ values: [] });
          controls.show();
        });
    };

    scopeRef.BASE.choicesShown = () => {};

    scopeRef.BASE.emailContent = (ctx, card) => {
      if (!scopeRef.D.emailContent) return;
      const decoys = ctx.util.el('section', 'ds-email-content', card);
      ctx.util.el('h3', '', decoys, scopeRef.D.emailContentTitle);
      scopeRef.D.emailOptions.forEach((text) => {
        const label = ctx.util.el('label', '', decoys);
        const cb = ctx.util.el('input', '', label);
        cb.type = 'checkbox';
        ctx.util.el('span', '', label, text);
      });
    };

    const buildChoices = (field, ctx) => {
      const kind = ctx.spec.scenario;
      const { util, spec, rng } = ctx;
      const tiles = !!spec.details || rng.bool(0.45);
      const group = util.el('div', 'fp-group' + (tiles ? ' tiles' : ''), field);
      group.dataset.role = kind === 'radio' ? 'radiogroup' : 'group';
      const n = spec.options.length;
      if (scopeRef.D.choiceRowsVar) group.style.setProperty(scopeRef.D.choiceRowsVar, Math.ceil(n / scopeRef.D.choiceRowsDivisor));
      const longest = Math.max(...spec.options.map((o) => o.length));
      const cols = kind === 'checkbox' ? (n > 5 ? 2 : 1) : n > 6 || (tiles && n > 3 && longest <= 14) ? 2 : 1;
      group.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
      scopeRef.P.choiceGrid(ctx, group, n, cols);
      if (!tiles) group.style.rowGap = rng.int(8, 13) + 'px';
      const name = `fp-${kind}-${ctx.rng.int(0, 1e6)}`;
      const inputs = [];
      const labels = {};
      for (const [index, o] of spec.options.entries()) {
        const lab = util.el('label', 'fp-choice', group);
        lab.dataset.role = 'option';
        const inp = util.el('input', '', lab);
        inp.type = kind;
        inp.name = name;
        inp.value = o;
        scopeRef.P.choiceBeforeText(ctx, lab, inp, o, index);
        const txt = util.el('span', '', lab, o);
        const detail = scopeRef.P.choiceDetail(ctx, o);
        if (detail) util.el('span', 'fp-det', txt, detail);
        inputs.push([o, inp]);
        labels[o] = lab;
      }
      const multi = kind === 'checkbox';
      const ch = env.ui.choices(inputs, {
        label: kind,
        multi,
        value: ctx.model.value,
        values: ctx.model.values,
        onChange(v) {
          scopeRef.set(multi ? { values: v } : { value: v });
          show();
        },
      });
      const controls = { group, inputs, labels, ch, show, set: scopeRef.set };
      scopeRef.P.choicesReady(ctx, controls);
      function show() {
        const m = scopeRef.st.ctx.model;
        ch.set(multi ? m.values : m.value);
        for (const o of spec.options) labels[o].classList.toggle('on', multi ? m.values.includes(o) : m.value === o);
        scopeRef.P.choicesShown(ctx, controls);
      }
      scopeRef.st.show = show;
      scopeRef.st.loc = (t) => (t.option !== undefined ? ch.locate(t.option) : null);
    };
    scopeRef.buildChoices = buildChoices;
  }
  env.template('choose-option/_widgets-choices', () => ({ install }));
})();
