// Design on templates/choose-option/base.js: the base site's choose-option widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-toggles-02',
  name: 'design',
  split: 'train',
  scenarios: ['toggles'],
  template: 'choose-option/base',
  design: {
    parts: {
      'buildToggles': (base, S) => function buildToggles(field, ctx) {
        const { req, set } = S;
        const { util, spec, rng } = ctx;
        const native = rng.bool(0.5);
        const square = rng.bool(0.25);
        const words = rng.bool(0.3);
        const n = spec.items.length;
        const cols = n > 7 ? 2 : 1;
        const grid = util.el('div', 'fp-trows', field);
        grid.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
        const sw = [];
        spec.items.forEach((it, i) => {
          const row = util.el(native ? 'label' : 'div', 'fp-trow', grid);
          row.dataset.role = 'setting';
          const tx = util.el('div', 'fp-ttext', row);
          util.el('div', 'fp-tl', tx, it.label);
          util.el('div', 'fp-td', tx, it.desc);
          const word = util.el('span', 'fp-onoff', row);
          let s;
          if (native) {
            s = util.el('input', 'fp-switch' + (square ? ' sq' : ''), row);
            s.type = 'checkbox';
            s.setAttribute('role', 'switch');
            s.addEventListener('change', () => flip(i));
          } else {
            s = util.el('button', 'fp-switch' + (square ? ' sq' : ''), row);
            s.type = 'button';
            s.setAttribute('role', 'switch');
            s.addEventListener('click', () => flip(i));
          }
          s.dataset.role = 'switch';
          sw.push([s, word]);
        });
        function flip(i) {
          const on = S.st.ctx.model.on.slice();
          on[i] = !on[i];
          set({ on });
          show();
        }
        function show() {
          const m = S.st.ctx.model;
          sw.forEach(([s, word], i) => {
            if (native) s.checked = !!m.on[i];
            else s.setAttribute('aria-checked', String(!!m.on[i]));
            if (word) word.textContent = m.on[i] ? 'On' : 'Off';
          });
        }
        S.st.show = show;
        S.st.loc = (t) => (t.toggle !== undefined ? req(sw[t.toggle][0], `switch ${t.toggle}`) : null);
      },
    },
  },
});
