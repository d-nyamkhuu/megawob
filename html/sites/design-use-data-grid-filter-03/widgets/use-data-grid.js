// Design on use-data-grid/grid; defaults reproduce the scaffolded base widget.
env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-filter-03',
  name: 'design',
  split: 'train',
  scenarios: ['filter'],
  template: 'use-data-grid/grid',
  design: {
    font: '18px/1.35 Arial,sans-serif',
    parts: {
      fit: (base, S) => () => {
        base();
        // Keep cardW unchanged: the heading's existing sample depends on it.
        S.cardH = S.H;
        S.rowH = Math.max(S.H < 600 ? 22 : 18, Math.min(36, Math.floor((S.H - (S.H < 600 ? 238 : 300)) / S.spec.pageSize)));
      },
      card: (base, S) => () => {
        base();
        S.card.classList.remove('dense', 'upper', 'zebra', 'showdots');
        S.card.classList.add('clearlooks');
        Object.assign(S.card.style, { left: '0', top: '0', width: '100%', height: '100%' });
      },
      heading: (base, S) => () => {
        const cardWidth = S.cardW;
        S.cardW = S.ctx.stage.dataset.headingSampleSize === '2' ? 701 : 700;
        base();
        S.cardW = cardWidth;
        S.object.querySelector('.to-icon').innerHTML = '<svg viewBox="0 0 38 48" fill="none"><path d="M3 2h22l10 10v33H3z" fill="#fff" stroke="#527fa9" stroke-width="3" stroke-linejoin="round"/><path d="M25 2v11h10M10 21h18M10 28h18M10 35h13" stroke="#527fa9" stroke-width="3"/></svg>';
        const note = document.querySelector('.ref-task > .ref-instruction');
        if (note) S.head.append(note);
        const secondary = S.P.el('div', 'to-secondary-tools', S.head);
        for (const b of [...S.head.querySelectorAll(':scope > .to-btn')]) {
          if (b !== S.nb) secondary.append(b);
        }
        // Fit the actual sheet, rather than the hidden template navigation.
        S.scale = (S.W - (S.H < 600 ? 45 : 64) - 10) / S.nominal;
      },
      toolbar: (base, S) => () => {
        base();
        if (S.input) {
          S.input.placeholder = '';
          S.input.setAttribute('aria-label', `Search ${S.spec.entities}`);
        }
        S.clearAll.textContent = 'Clear Filters';
        S.clearAll.classList.add('to-clear-native');
        S.P.el('span', 'to-broom', S.clearAll).innerHTML = '<svg viewBox="0 0 28 32"><path d="M22 2l3 2-10 16-4-3z" fill="#7893a6" stroke="#526979"/><path d="M10 15l8 5-4 11L2 24z" fill="#9eacb3" stroke="#5f727e" stroke-width="1.5"/><path d="M5 22l8 5M8 18l8 5" stroke="#d6dde0"/></svg>';
        S.clearAll.setAttribute('role', 'button');
        S.clearAll.tabIndex = 0;
        S.clearAll.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); S.clearAll.click(); }
        });
        S.clearAll.before(S.chips);
        S.tools.insertBefore(S.nb, S.selBar);
        S.selBar.insertBefore(S.delBtn, S.archBtn);
        S.delBtn.querySelector('.to-icon').innerHTML = '<svg viewBox="0 0 26 26"><path d="M5 2L13 10 21 2 25 6 17 14 25 22 21 26 13 18 5 26 1 22 9 14 1 6z" transform="translate(1 -1) scale(.9)" fill="#d95c56" stroke="#ad3a35"/></svg>';
      },
      grid: (base, S) => () => {
        base();
        S.card.style.setProperty('--row-height', `${S.rowH}px`);
        S.body.style.cssText = 'flex:1;min-height:0;overflow:auto;overscroll-behavior:contain';
      },
      column: (base, S) => c => {
        base(c);
        const p = S.parts[c.id];
        const funnelArt = '<svg viewBox="0 0 22 24"><path d="M3 4h16l-6 8v8l-4-2v-6z" fill="#b9bab7" stroke="#858784" stroke-width="1.5" stroke-linejoin="round"/><path d="M5 5h12l-6 6z" fill="#dedfda"/></svg>';
        if (!p.funnel) p.dots.innerHTML = funnelArt;
        else p.funnel.innerHTML = funnelArt;
        if (p.funnel) p.dots.classList.add('to-column-options');
      },
      decorate: () => () => {},
      cellContent: (base, S) => (cell, row, id, m, text) => {
        S.P.el('span', '', cell, text).title = text;
      },
      drawTools: (base, S) => m => {
        base(m);
        S.clearAll.hidden = false;
        S.selBar.style.display = 'flex';
        S.selInfo.hidden = !m.selected.length;
        S.clearSelBtn.hidden = !m.selected.length;
        for (const b of [S.markBtn, S.archBtn, S.delBtn]) b.disabled = !m.selected.length;
      },
      footer: (base, S) => () => {
        base();
        S.rpp.hidden = false;
        S.rpp.textContent = 'Rows per page:';
        S.P.el('span', 'to-native-spin to-page-size', S.rpp, String(S.spec.pageSize));
      },
      drawFoot: (base, S) => m => {
        base(m);
        const pages = S.fam.helpers.pageCount(m, S.spec);
        const current = Math.min(m.page, pages - 1);
        const prev = S.pgButtons.prev, next = S.pgButtons.next;
        if (!prev || !next) return;
        prev.textContent = '◀'; next.textContent = '▶';
        prev.classList.add('to-page-arrow'); next.classList.add('to-page-arrow');
        const first = S.P.pageButton('Ⅰ◀', 'first', current === 0, 'to-page-arrow');
        first.title = 'First page';
        first.addEventListener('click', () => S.P.act(S.fam.helpers.gotoPage(S.ctx.model, S.spec, 0)));
        const last = S.P.pageButton('▶Ⅰ', 'last', current >= pages - 1, 'to-page-arrow');
        last.title = 'Last page';
        last.addEventListener('click', () => S.P.act(S.fam.helpers.gotoPage(S.ctx.model, S.spec, pages - 1)));
        S.pagerWrap.prepend(first);
        const label = S.P.el('span', 'to-page-label', null, 'Page');
        prev.after(label);
        const nums = S.P.el('span', 'to-page-numbers', null);
        label.after(nums);
        for (const [key, b] of Object.entries(S.pgButtons)) if (/^p\d+$/.test(key)) nums.append(b);
        const total = S.P.el('span', 'to-page-total', null, `of ${pages}`);
        nums.after(total);
        S.info.textContent += ` ${S.spec.entities}`;
      },
      rendered: (base, S) => ctx => {
        base(ctx);
        const note = document.querySelector('.ref-task > .ref-instruction');
        if (note) S.head.append(note);
      },
    },
  },
});
