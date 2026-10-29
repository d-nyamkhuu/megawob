// Design on use-data-grid/grid; defaults reproduce the scaffolded base widget.
env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-filter-05',
  name: 'design',
  split: 'train',
  scenarios: ['filter'],
  template: 'use-data-grid/grid',
  design: {
    parts: {
      fit: (base, S) => function () {
        base();
        S.rowH = Math.max(27, Math.min(36, Math.round(S.H * .041)));
      },
      place: (base, S) => function (box, anchor, alignRight) {
        const frame = S.card.getBoundingClientRect();
        const area = S.tools.getBoundingClientRect();
        const target = anchor.getBoundingClientRect();
        const width = box.offsetWidth;
        box.style.maxHeight = `${frame.height - 16}px`;
        box.style.overflowY = 'auto';
        const height = box.offsetHeight;
        let x = (alignRight ? target.right - width : target.left) - frame.left;
        x = Math.max(8, Math.min(area.right - frame.left - width - 8, x));
        let y = target.bottom - frame.top + 4;
        if (y + height > frame.height - 8) y = Math.max(8, target.top - frame.top - height - 4);
        box.style.left = `${x}px`;
        box.style.top = `${Math.max(8, Math.min(frame.height - height - 8, y))}px`;
      },
      heading: (base, S) => function () {
        base();
        S.title.textContent = 'Orders';
      },
      px: (base, S) => function (w) {
        const panel = S.ctx.stage.parentElement.querySelector('.ref-panel');
        const fraction = S.W <= 1150 ? .94 : panel ? .70 : .782;
        const available = S.W * fraction * .735 - 24 - (S.W <= 1150 ? 16 : 28) - 44;
        return Math.max(30, Math.floor(w / S.nominal * available));
      },
      toolbar: (base, S) => function () {
        base();
        S.selBar.prepend(S.delBtn);
        S.selBar.append(S.archBtn);
        const shipped = S.P.el('button', 'to-btn', S.selBar, 'Mark as Shipped');
        S.P.icon(shipped, 'archive');
        shipped.querySelector('.to-icon').innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 5h13v13H2zM15 10h5l3 5v3h-8z" fill="#327ff2"/><circle cx="6" cy="19" r="3" fill="#327ff2" stroke="white"/><circle cx="19" cy="19" r="3" fill="#327ff2" stroke="white"/></svg>';
        shipped.type = 'button';
        shipped.addEventListener('click', () => {
          if (S.ctx.model.selected.length && S.statusOpts.includes('Shipped')) S.P.act(S.fam.helpers.askBulk(S.ctx.model, S.spec, 'status', 'Shipped'));
        });
        S.selBar.insertBefore(shipped, S.markBtn);
        const more = S.P.el('button', 'to-btn to-more', S.tools, '•••');
        more.type = 'button';
        more.title = 'More actions';
        more.addEventListener('click', () => S.P.showUtility('More actions', ['Export records', 'View columns', 'Workspace settings']));
      },
      column: (base, S) => function (c) {
        base(c);
        const p = S.parts[c.id];
        const control = p.funnel || S.P.el('span', 'ib', S.hcells[c.id]);
        control.classList.add('column-filter');
        control.replaceChildren();
        S.P.el('span', 'filter-value', control, 'All');
        S.P.el('span', '', control, '⌄');
        if (!p.funnel) {
          control.title = `Column options: ${c.label}`;
          control.addEventListener('pointerdown', e => e.stopPropagation());
          control.addEventListener('click', () => S.P.act(S.fam.helpers.openMenu(S.ctx.model, S.spec, c.id, 'col')));
        }
      },
      drawHeader: (base, S) => function (m) {
        base(m);
        for (const c of S.spec.cols) {
          const label = S.hcells[c.id].querySelector('.filter-value');
          if (label) label.textContent = m.filters[c.id] ? m.filters[c.id].join(', ') || 'None' : 'All';
        }
      },
      drawTools: (base, S) => function (m) {
        base(m);
        S.selBar.style.display = 'flex';
        S.clearSelBtn.hidden = !m.selected.length;
        S.archBtn.hidden = !m.selected.length;
        if (S.input) S.input.parentElement.style.display = 'flex';
        S.count.textContent += ` ${S.spec.entities}`;
        S.chips.style.display = 'none';
      },
      footer: (base, S) => function () {
        base();
        S.rpp.hidden = false;
        S.rpp.classList.add('to-rpp');
        S.rpp.textContent = 'Rows per page:';
        const wrap = S.P.el('span', 'to-size-wrap', S.rpp);
        const button = S.P.el('button', 'to-page-size', wrap, `${S.P.sizeOf(S.ctx.model)}   ⌄`);
        button.type = 'button';
        button.addEventListener('click', () => {
          const old = wrap.querySelector('.to-size-menu');
          if (old) { old.remove(); return; }
          const menu = S.P.el('span', 'to-size-menu', wrap);
          for (const n of S.D.pageSizes) {
            const option = S.P.el('button', '', menu, String(n));
            option.type = 'button';
            option.addEventListener('click', () => {
              S.P.act(S.fam.helpers.setPageSize(S.ctx.model, S.spec, n));
              button.textContent = `${n}   ⌄`;
              menu.remove();
            });
          }
        });
      },
      drawFoot: (base, S) => function (m) {
        base(m);
        for (const [key, glyph] of [['prev', '‹'], ['next', '›']]) {
          if (S.pgButtons[key]) { S.pgButtons[key].textContent = glyph; S.pgButtons[key].title = key === 'prev' ? 'Previous page' : 'Next page'; }
        }
        S.info.textContent = S.info.textContent.replace('Showing ', '');
      },
    },
  },
});
