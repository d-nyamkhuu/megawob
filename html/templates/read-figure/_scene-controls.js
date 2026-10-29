/* read-figure/_scene-controls: shared template implementation; design parts stay on the calling template. */
(function () {
  'use strict';
  function install(BASE, scope, V) {
    BASE.set = (patch) => {
      scope.ctx.update({ ...scope.ctx.model, ...patch });
      scope.P.sync(scope.ctx.model);
    };
    BASE.sync = (m) => {
      scope.paints.forEach((fn) => fn(m));
      scope.P.synced(m);
    };
    BASE.synced = (m) => {};
    BASE.answer = (k) => {
      const m = scope.ctx.model;
      if (m.answer !== null && m.answer !== undefined) return;
      scope.P.set({ clicks: m.clicks.concat([k]), answer: k, wrong: (m.wrong || 0) + (scope.f.helpers.clickError(scope.s, k) > 0 ? 1 : 0) });
    };
    BASE.begin = (ctx) => {};
    BASE.rendered = (ctx) => {};
    BASE.recoveryParent = (ctx) => (scope.D.recoveryParent ? document.querySelector(scope.D.recoveryParent) : scope.root);
    BASE.recovery = (ctx) => {
      if (!scope.s.recoverable || !(scope.f.helpers.isSingle(scope.s) || scope.s.scenario === 'ascending')) return;
      const bar = scope.u.el('div', 'recover', scope.P.recoveryParent(ctx)),
        msg = scope.u.el('span', '', bar);
      const undo = scope.P.button(bar, 'Undo', { undo: true }, () => {
        const m = ctx.model;
        if (scope.s.scenario === 'ascending') scope.P.set({ clicks: m.clicks.slice(0, -1) });
        else scope.P.set({ answer: null });
      });
      scope.paints.push((m) => {
        const active = scope.s.scenario === 'ascending' ? m.clicks.length > 0 : m.answer !== null && m.answer !== undefined;
        undo.disabled = !active;
        bar.style.visibility = active ? 'visible' : 'hidden';
        msg.textContent = active ? 'Answer recorded.' : 'Choose an answer.';
      });
      scope.P.recovered(ctx, bar);
    };
    BASE.recovered = (ctx, bar) => {};
    BASE.resetModel = (first) => JSON.parse(JSON.stringify(first));
    BASE.reset = (ctx) => {
      if (!scope.D.resetLabel) return;
      const first = JSON.parse(JSON.stringify(ctx.model));
      const reset = scope.u.el('button', 'control reference-reset', document.querySelector(scope.D.resetParent), scope.D.resetLabel);
      reset.type = 'button';
      reset.onclick = () => {
        ctx.update(scope.P.resetModel(first));
        scope.P.sync(ctx.model);
      };
    };
    BASE.menu = (ctx) => {
      if (!scope.D.menuLabels) return;
      const menu = document.querySelector('.menu');
      if (scope.D.optionalMenu && !menu) return;
      menu.replaceChildren();
      scope.D.menuLabels.forEach((label) => scope.u.el('div', '', document.querySelector('.menu'), label));
    };
    BASE.button = (p, text, key, fn, cls = 'control') => {
      const e = scope.u.el('button', cls, p, text);
      e.type = 'button';
      e.addEventListener('click', () => fn(key));
      scope.refs.set(JSON.stringify(key), e);
      return e;
    };
  }
  env.template('read-figure/_scene-controls', () => ({ install }));
})();
