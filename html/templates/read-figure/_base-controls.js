/* read-figure/_base-controls: shared template implementation; design parts stay on the calling template. */
(function () {
  'use strict';
  function answerer(unitScope, ctx, up) {
    const { fam } = unitScope;
    return (k) => {
      const m = ctx.model;
      if (m.answer !== null && m.answer !== undefined) {
        ctx.log('locked', { key: k });
        return;
      }
      const wrong = fam().helpers.clickError(ctx.spec, k) > 0 ? 1 : 0;
      up({ clicks: m.clicks.concat([k]), answer: k, wrong: (m.wrong || 0) + wrong });
    };
  }

  function optionButtons(unitScope, ctx, parent, keys, label, up) {
    const { answered, answerer, env } = unitScope;
    const row = ctx.util.el('div', 'up-opts', parent);
    const els = keys.map((k) => {
      const b = ctx.util.el('button', 'up-opt', row, label(k));
      b.type = 'button';
      b.dataset.role = 'option';
      return b;
    });
    return env.ui.buttons(els, { keys, label: 'option', history: answered(ctx.model), onClick: answerer(ctx, up) });
  }

  function answerField(unitScope, ctx, parent, up, hint) {
    const { env } = unitScope;
    const wrap = ctx.util.el('div', 'up-field', parent);
    const lab = ctx.util.el('label', 'up-label', wrap, ctx.rng.pick(['Answer', 'Total', 'Count']));
    const input = ctx.util.el('input', 'up-input', wrap);
    input.type = 'text';
    input.id = 'up-answer';
    input.autocomplete = 'off';
    input.spellcheck = false;
    input.inputMode = 'numeric';
    input.dataset.role = 'field';
    lab.htmlFor = input.id;
    if (hint) ctx.util.el('span', 'up-hint', wrap, hint);
    return env.ui.textField(input, { value: ctx.model.text, label: 'answer', onInput: (v) => up({ text: v }) });
  }

  function resultBar(unitScope, ctx, panel, up) {
    const { env } = unitScope;
    const { spec, util, rng } = ctx;
    const bar = util.el('div', 'up-result', panel);
    const message = util.el('span', 'up-result-text', bar);
    const text = util.el('span', '', message, '');
    const btn = util.el('button', '', bar, rng.pick(spec.scenario === 'ascending' ? ['Undo', 'Undo last click', 'Take back'] : ['Undo', 'Change answer', 'Back']));
    btn.type = 'button';
    btn.dataset.role = 'undo';
    const saved = rng.pick(['Answer recorded.', 'Your answer was saved.', 'Choice saved.', 'Answer locked in.']);
    const idle = rng.pick(spec.scenario === 'ascending'
      ? ['A wrong click can be undone once.', 'Click the tiles in order.', 'Mistakes can be taken back.']
      : ['Your answer is saved when you click it.', 'Pick one answer; you can change it afterwards.', 'One answer only.']);
    // Keep the shrink-to-fit panel and its controls stationary through answer and undo feedback.
    // Reserve every message before the kit records the panel anchor, including wrong-start episodes.
    for (const value of [idle, saved, 'That number was out of order.']) {
      const reserve = util.el('span', 'up-result-size', message, value);
      reserve.setAttribute('aria-hidden', 'true');
    }
    btn.addEventListener('click', () => {
      const m = ctx.model;
      if (spec.scenario === 'ascending') {
        if (m.clicks.length) { ctx.log('undo'); up({ clicks: m.clicks.slice(0, -1) }); }
      } else if (m.answer !== null && m.answer !== undefined) { ctx.log('undo'); up({ answer: null }); }
    });
    const standing = (m) => {
      if (spec.scenario !== 'ascending') return m.answer !== null && m.answer !== undefined ? 'saved' : null;
      let k = 0;
      while (k < m.clicks.length && m.clicks[k] === spec.order[k]) k++;
      return m.clicks.length > k ? 'bad' : null;
    };
    return {
      sync(m) {
        const s = standing(m);
        bar.classList.toggle('bad', s === 'bad');
        text.textContent = s === 'bad' ? 'That number was out of order.' : s ? saved : idle;
        btn.disabled = !s;
      },
      locate: () => env.util.center(btn),
    };
  }
  env.template('read-figure/_base-controls', () => ({ answerer, optionButtons, answerField, resultBar }));
})();
