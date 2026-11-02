env.widget({
  task: 'read-figure',
  site: 'design-read-figure-shape-09',
  name: 'design',
  split: 'train',
  scenarios: ['shape'],
  template: 'read-figure/scene',
  design: {
    fontFamily: 'Times New Roman, Times, serif',
    optionalMenu: true,
    parts: {
      shape: (base, S) => (ctx) => {
        const P = S.P,
          s = S.spec,
          u = ctx.util,
          f = env.taskDef,
          root = S.root,
          scene = S.scene,
          refs = S.refs,
          paints = S.paints;
        root.style.setProperty(
          '--ledger-rows',
          s.items.reduce((n, it) => n + (it.size !== 'small' && it.size !== 'tiny' ? 1.2 : 1), 0),
        );
        root.style.setProperty('--stage-height', ctx.size.height + 'px');
        const cap = (x) => String(x).replace(/^./, (c) => c.toUpperCase());
        const tbl = u.el('table', 'ledger', scene),
          hd = u.el('tr', '', u.el('thead', '', tbl));
        ['ID', 'Shape', 'Color', 'Size', 'Type'].forEach((h) => u.el('th', '', hd, h));
        const tb = u.el('tbody', '', tbl),
          pv = document.querySelector('.pv-body');
        s.items.forEach((it, i) => {
          const tr = u.el('tr', '', tb);
          u.el('td', '', tr, String(i + 1));
          const td = u.el('td', 'shape-cell', tr),
            svg = u.svg('svg', { width: 60, height: 60, viewBox: '0 0 60 60', class: 'fig' }, td);
          const big = it.size !== 'small' && it.size !== 'tiny';
          tr.classList.toggle('large-item', big);
          const sz = it.size === 'tiny' ? 14 : it.kind !== 'shape' ? (big ? 80 : 34) : big ? 56 : 30;
          P.figure(u, svg, it, 30, 30, sz, f.helpers.ITEM_COLORS[it.color]);
          u.el('td', '', tr, cap(it.color));
          u.el('td', '', tr, cap(it.size));
          u.el('td', '', tr, it.kind === 'shape' ? cap(it.text) : 'Letter');
          tr.addEventListener('click', () => P.answer(i));
          refs.set(JSON.stringify({ item: i }), svg);
          paints.push((m) => {
            tr.classList.toggle('selected', m.answer === i);
          });
        });
        const none = 'No item selected.';
        paints.push((m) => {
          if (!pv) return;
          const it = m.answer !== null && m.answer !== undefined ? s.items[m.answer] : null;
          pv.replaceChildren();
          if (!it) {
            pv.textContent = none;
            return;
          }
          const sv = u.svg('svg', { width: 90, height: 90, viewBox: '0 0 60 60' }, pv);
          P.figure(u, sv, it, 30, 30, it.kind !== 'shape' ? 50 : 42, f.helpers.ITEM_COLORS[it.color]);
          u.el(
            'div',
            '',
            pv,
            'Item ' +
              (m.answer + 1) +
              ': ' +
              cap(it.size) +
              ' ' +
              it.color +
              ' ' +
              (it.kind === 'shape' ? it.text : 'letter'),
          );
        });
        const clr = document.querySelector('.clear-slot');
        if (clr) {
          const b = u.el('button', 'clear-btn', clr, 'Clear Selection');
          b.type = 'button';
          b.addEventListener('click', () => P.set({ answer: null }));
        }
        // Measure after Clear Selection fills its frame slot, keeping the end link uncovered.
        const links = document.querySelector('.aside ul');
        if (pv && links)
          pv.parentElement.style.maxHeight =
            'max(0px, calc(100% - ' + (links.offsetTop + links.offsetHeight) + 'px - 2.6% - .5em - 2px))';
      },
    },
  },
});
