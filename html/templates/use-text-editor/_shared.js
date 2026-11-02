/* use-text-editor/_shared: shared editor frame CSS, overridable input parts and find-control wiring. */
(function () {
  'use strict';
  const fam = () => env.taskDef.helpers;
  const cardCss = `
  .te-card { position: absolute; display: flex; flex-direction: column; overflow: hidden; border: 1px solid var(--line);
    border-radius: 8px; box-shadow: 0 6px 24px rgba(0,0,0,.12); font: 13px/1.3 system-ui, -apple-system, 'Segoe UI', sans-serif; }
  .te-card button { font: inherit; color: inherit; cursor: pointer; }
  .te-card input { font: inherit; }

`;
  const isInput = (e) => !!e && (e.tagName === 'INPUT' || e.tagName === 'TEXTAREA');

  function parts(BASE, S) {
    let installed = false;
    BASE.el = function (tag, cls, text) {
      const e = document.createElement(tag);
      if (cls) e.className = cls;
      if (text !== undefined) e.textContent = text;
      return e;
    };

    // Usable part of the stage (stage-local px): the stage minus a floating end control inside it.
    BASE.usable = function (ctx) {
      const box = { x: 0, y: 0, w: ctx.size.width, h: ctx.size.height };
      const sr = ctx.stage.getBoundingClientRect();
      const sub = env.submitEl && env.submitEl.getBoundingClientRect();
      if (sub && sub.width && sub.left < sr.right && sub.right > sr.left && sub.top < sr.bottom && sub.bottom > sr.top) {
        const cutH = sr.bottom - sub.top + 10;
        const cutW = sr.right - sub.left + 10;
        if (cutH * box.w <= cutW * box.h) box.h -= cutH;
        else box.w -= cutW;
      }
      return box;
    };

    // Apply a new model: update the kit, then redraw (the kit never calls sync after ctx.update).
    BASE.commit = function (n) {
      if (!S.st) return;
      if (n !== S.st.ctx.model) S.st.ctx.update(n);
      S.st.draw(S.st.ctx.model);
    };

    BASE.install = function () {
      if (installed) return;
      installed = true;
      document.addEventListener('keydown', (e) => {
        if (!S.st || isInput(document.activeElement)) return;
        const m = S.st.ctx.model;
        if (!m || m.focus !== 'editor') return;
        const name = fam().keyFromEvent(e);
        if (!name) return;
        const r = fam().keyDown(m, S.st.ctx.spec, name);
        if (!r.handled) return;
        e.preventDefault();
        S.P.commit(r.model);
      });
      window.addEventListener('pointermove', (e) => {
        if (!S.st || !S.st.drag || !(e.buttons & 1)) return;
        const o = S.st.offsetAt(e.clientX, e.clientY);
        const m = S.st.ctx.model;
        const c = m.cur[0];
        if (o === null || (m.cur.length === 1 && c.h === o && c.a === S.st.drag.a)) return;
        S.P.commit(fam().pointerDrag(m, S.st.ctx.spec, S.st.drag.a, o));
      });
      window.addEventListener('pointerup', () => { if (S.st) S.st.drag = null; });
    };

    // Wire a find input: value -> model, focus -> model, Enter / Shift+Enter / Escape.
    BASE.wireInput = function (input, which) {
      input.addEventListener('focus', () => {
        const m = S.st.ctx.model;
        if (m.focus !== which) S.P.commit(fam().focusTo(m, which));
      });
      input.addEventListener('input', () => S.P.commit(fam().findOp(S.st.ctx.model, S.st.ctx.spec, which, input.value)));
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); S.P.commit(fam().findOp(S.st.ctx.model, S.st.ctx.spec, e.shiftKey ? 'prev' : 'next')); }
        else if (e.key === 'Escape') { e.preventDefault(); input.blur(); S.P.commit(fam().findOp(S.st.ctx.model, S.st.ctx.spec, 'close')); }
      });
    };
    BASE.onBtn = function (b, fn) {
      b.addEventListener('click', (e) => { e.preventDefault(); fn(); });
    };
    // Mirror the model's focus into the DOM (the find inputs).
    BASE.syncFocus = function (m, inputs) {
      const want = inputs[m.focus];
      if (want && document.activeElement !== want && want.offsetParent !== null) want.focus({ preventScroll: true });
      else if (!want && isInput(document.activeElement) && Object.values(inputs).includes(document.activeElement)) document.activeElement.blur();
    };
    BASE.findCount = function (m, spec) {
      const ms = fam().matches(m, spec);
      if (!m.find || !m.find.query) return '';
      if (!ms.length) return S.D.noResults;
      const cm = fam().currentMatch(m, spec);
      const i = Math.max(0, ms.findIndex((x) => x[0] === cm[0]));
      return `${i + 1} of ${ms.length}`;
    };

    BASE.theme = function () {
      return document.documentElement.dataset.theme || 'light';
    };

    BASE.begin = (ctx) => {};

    BASE.rendered = (ctx, view) => {};

    BASE.place = function (ctx, box, view) {
      const pr = ctx.rng.fork('place');
      const r = view.card.getBoundingClientRect();
      const free = (room, size) => Math.max(0, room - size - S.D.placeGap);
      const ax = pr.pick([0, 0.5, 0.5, 1]);
      const ay = pr.pick([0, 0.5, 1]);
      view.card.style.left = `${Math.round(box.x + S.D.placeInset + free(box.w, r.width) * ax)}px`;
      view.card.style.top = `${Math.round(box.y + S.D.placeInset + free(box.h, r.height) * ay)}px`;
    };

  }

  function wireFind(S, controls, openButton) {
    const { P, spec } = S;
    const F = fam();
    const { q, rp, exp, bCase, bWord, bPrev, bNext, bClose, bOne, bAll } = controls;
    P.wireInput(q, 'query');
    P.wireInput(rp, 'repl');
    const op = (name, arg) => () => P.commit(F.findOp(S.st.ctx.model, spec, name, arg));
    P.onBtn(openButton, op('open', true));
    P.onBtn(exp, op('expand'));
    P.onBtn(bCase, op('case'));
    P.onBtn(bWord, op('word'));
    P.onBtn(bPrev, op('prev'));
    P.onBtn(bNext, op('next'));
    P.onBtn(bClose, op('close'));
    P.onBtn(bOne, op('one'));
    P.onBtn(bAll, op('all'));
  }

  env.template('use-text-editor/_shared', () => ({ cardCss, isInput, parts, wireFind }));
})();
