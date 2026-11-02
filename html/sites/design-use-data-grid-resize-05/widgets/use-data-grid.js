// Design on use-data-grid/grid; defaults reproduce the scaffolded base widget.
env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-resize-05',
  name: 'design',
  split: 'train',
  scenarios: ['resize'],
  template: 'use-data-grid/grid',
  design: {
    brand: 'Company Manager',
    parts: {
      appbar: (_base, S) => () => {
          const el = (tag, cls, parent, text) => S.util.el(tag, cls, parent, text);
          S.shell = el('section', 'to-workspace', S.ctx.stage);
          S.shell.setAttribute('aria-label', 'Orders window');
          S.appbar = el('div', 'to-appbar mac-window-titlebar', S.shell);
          el('span', 'window-traffic', S.appbar).innerHTML = '<i></i><i></i><i></i>';
          el('strong', 'window-title', S.appbar, 'Orders');
          S.utility = null;
        },
      card: (base, S) => () => {
          base();
          Object.assign(S.card.style, { left: '0px', top: '0px', width: '100%', height: '100%' });
          S.card.classList.remove('upper', 'dense');
          S.card.style.setProperty('--row-height', S.rowH + 'px');
        },
      fit: (base, S) => () => {
        base();
        S.cardW = S.W; S.cardH = S.H; S.left = 0; S.top = 0;
        const unit = Math.max(.65, Math.min(1, S.ctx.stage.ownerDocument.body.clientWidth / 1672));
        S.FIXED = 232 * unit;
        S.rowH = Math.max(26, Math.floor((S.H - S.FIXED) / Math.max(9, S.spec.pageSize)));
      },
      toolbar: (base, S) => () => {
        base();
        const el = S.P.el;
        S.tools.classList.add('wb-tools');
        S.chips.className = 'wb-hidden';
        S.clearAll.classList.add('wb-hidden');
        S.selBar.className = 'wb-selection';
        S.tools.querySelector('.sp').className = 'wb-hidden';
        const old = S.tools.querySelector(':scope > .to-selinfo');
        if (old) old.remove();
        S.nb.className = 'wb-command wb-new';
        S.tools.prepend(S.nb);
        S.delBtn.className = 'wb-command wb-delete';
        S.delBtn.style.order = '0';
        S.nb.after(S.delBtn);
        const print = el('button', 'wb-command wb-print', S.tools, 'Print');
        print.type = 'button';
        print.addEventListener('click', () => S.P.showUtility('Print', ['Select the records to print from this view.']));
        S.delBtn.after(print);
        const find = el('span', 'wb-find-label', S.tools, 'Find:');
        print.after(find);
        if (S.input) {
          S.input.placeholder = '';
          find.after(S.input.parentElement);
        } else {
          const box = el('label', 'to-search', S.tools);
          const field = el('input', '', box); field.readOnly = true;
          find.after(box);
        }
        const show = el('div', 'wb-show', S.tools);
        el('span', '', show, 'Show:');
        const status = el('button', 'wb-select', show, 'All ' + S.spec.title);
        status.type = 'button';
        status.addEventListener('click', () => S.P.act(S.fam.helpers.openMenu(S.ctx.model, S.spec, S.spec.statusCol, 'filter')));
        S.undoBtn.classList.add('wb-undo');
      },
      drawTools: (base, S) => (m) => {
        base(m);
        S.selBar.classList.toggle('wb-hidden', !m.selected.length);
      },
      decorate: () => () => {},
      column: (base, S) => (c) => {
        base(c);
        S.parts[c.id].dots.innerHTML = '<span class="wb-sort">⌃</span>';
      },
      grid: (base, S) => () => {
        base();
        S.card.classList.remove('dense');
        // Use the actual header viewport: stage padding and the classic scroll
        // rail both consume space that ctx.size includes at some viewports.
        const headerWidth = S.hrow.getBoundingClientRect().width;
        const checkboxWidth = S.hcb.getBoundingClientRect().width;
        const initialWidth = S.ctx.model.order.reduce((sum, id) => sum + S.ctx.model.widths[id], 0);
        S.scale = Math.max(.1, (headerWidth - checkboxWidth - 12) / initialWidth);
        const rail = S.P.el('div', 'wb-scrollbar', S.grid);
        S.P.el('span', '', rail, '▲');
        S.P.el('i', '', rail);
        S.P.el('span', '', rail, '▼');
      },
      drawRows: (base, S) => (m) => {
        base(m);
        S.body.style.maxHeight = 'none';
      },
      footer: (base, S) => () => {
        base();
        S.rpp.hidden = false;
      },
      drawFoot: (base, S) => (m) => {
        base(m);
        const pages = S.fam.helpers.pageCount(m, S.spec);
        const p = Math.min(m.page, pages - 1);
        const prev = S.pgButtons.prev, next = S.pgButtons.next;
        prev.textContent = '◀'; next.textContent = '▶';
        const first = S.P.pageButton('Ⅰ◀', 'first', p === 0);
        first.addEventListener('click', () => S.P.act(S.fam.helpers.gotoPage(S.ctx.model, S.spec, 0)));
        S.pagerWrap.prepend(first);
        const label = S.P.el('span', 'wb-page-label', S.pagerWrap, `Page ${p + 1} of ${pages}`);
        prev.after(label);
        const last = S.P.pageButton('▶Ⅰ', 'last', p >= pages - 1);
        last.addEventListener('click', () => S.P.act(S.fam.helpers.gotoPage(S.ctx.model, S.spec, pages - 1)));
        S.rpp.textContent = 'Rows per page: ';
        S.P.el('span', 'wb-page-size', S.rpp, String(S.P.sizeOf(m)));
      },
    },
  },
});
