/* read-figure/_scene-answers: shared template implementation; design parts stay on the calling template. */
(function () {
  'use strict';
  function install(BASE, scope, V) {
    if (V === 'count' || V === 'identify') {
      BASE.options = (p, keys) => {
        const row = scope.u.el('div', 'controls', scope.P.optionParent(p));
        keys.forEach((k) => {
          const b = scope.P.button(
            row,
            String(k).replace(/^./, (x) => x.toUpperCase()),
            { option: k },
            () => scope.P.answer(k),
          );
          scope.P.optionIcon(b, k);
          scope.paints.push((m) => b.classList.toggle('selected', m.answer === k));
        });
        scope.P.optionsReady(scope.ctx, row);
      };
      BASE.optionParent = (p) => p;
      BASE.optionsReady = (ctx, row) => {};
      BASE.optionIcon = (b, k) => {
        if (scope.s.scenario !== 'identify' || !scope.D.optionIcons) return;
        const icon = scope.u.svg(
          'svg',
          { width: 60, height: 60, viewBox: '0 0 60 60', style: 'display:block;margin:0 auto 12px' },
          b,
        );
        if (['circle', 'square', 'triangle', 'diamond', 'star', 'pentagon', 'hexagon'].includes(k)) {
          scope.P.figure(scope.u, icon, { kind: 'shape', text: k }, 30, 30, 45, 'none');
          icon.querySelectorAll('*').forEach((el) => {
            el.setAttribute('stroke', '#ff796e');
            el.setAttribute('stroke-width', '2');
          });
        } else {
          const t = scope.u.svg('text', { x: 30, y: 44, 'text-anchor': 'middle', fill: '#ff796e', 'font-size': 42 }, icon);
          t.textContent = k === 'letter' ? 'A' : '2';
        }
        b.prepend(icon);
      };
    }
    if (V === 'addition' || V === 'count') {
      BASE.input = (p, prop, label = 'Your answer:') => {
        const row = scope.u.el('div', 'answer', p);
        scope.u.el('label', '', row, label);
        const e = scope.u.el('input', '', row);
        e.type = 'text';
        e.autocomplete = 'off';
        e.inputMode = 'numeric';
        e.setAttribute('aria-label', label);
        scope.field = env.ui.textField(e, { value: scope.ctx.model[prop], label: 'answer', onInput: (v) => scope.P.set({ [prop]: v }) });
        scope.refs.set('field', e);
        if (scope.D.inputSynced) scope.paints.push((m) => scope.field.set(m[prop]));
        scope.P.inputReady(scope.ctx, e, prop);
        return e;
      };
      BASE.inputReady = (ctx, element, prop) => {};
    }
  }
  env.template('read-figure/_scene-answers', () => ({ install }));
})();
