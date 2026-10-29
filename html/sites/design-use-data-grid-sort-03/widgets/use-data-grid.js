// Design on use-data-grid/grid; defaults reproduce the scaffolded base widget.
env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-sort-03',
  name: 'design',
  split: 'train',
  scenarios: ['sort'],
  template: 'use-data-grid/grid',
  design: {
    navWidth: 0,
    railWidth: 0,
    contextAt: 99999,
    cardInsetX: 0,
    cardInsetY: 0,
    cardTop: 0,
    parts: {
      stream: (base, S) => () => {},
      toolbar: (base, S) => () => {
        const { ctx, fam, spec, P } = S;
        const el = S.util.el;
        S.tools = el('div', 'to-tools order-tools', S.card);
        S.tools.style.cssText = 'height:auto;min-height:62px;flex:none;flex-wrap:wrap;align-content:center;padding:6px 14px;gap:7px';
        const action = (parent, label, utilityTitle = label) => {
          const button = el('button', 'to-btn order-action', parent, label);
          button.type = 'button';
          button.addEventListener('click', () => P.showUtility(utilityTitle, [
            'Order records / Operations', 'This action is available in the order workspace.',
          ]));
          return button;
        };
        const lead = el('div', 'order-leading', S.tools);
        action(lead, 'New Order');
        action(lead, 'Edit');
        action(lead, 'Delete');
        action(lead, 'Print');
        const more = action(lead, 'More Actions');
        more.classList.add('order-more');
        more.insertAdjacentText('beforeend', '  ▾');
        const searchLabel = el('span', 'order-label', S.tools, 'Search:');
        S.input = null;
        if (fam.helpers.searchable(spec)) {
          const search = el('label', 'to-search order-search', S.tools);
          S.input = el('input', '', search);
          S.input.type = 'text';
          S.input.placeholder = `Search ${spec.entities}…`;
          S.input.value = ctx.model.query || '';
          S.input.addEventListener('input', () => {
            ctx.update(fam.helpers.setQuery(ctx.model, S.input.value));
            P.drawLite(ctx.model);
          });
        } else {
          const box = el('label', 'to-search order-search', S.tools);
          const input = el('input', '', box);
          input.type = 'text';
          input.setAttribute('aria-label', 'Search orders');
        }
        const go = el('button', 'to-btn order-go', S.tools, 'Go');
        go.type = 'button';
        go.addEventListener('click', () => { if (S.input) S.input.dispatchEvent(new Event('input', { bubbles: true })); });
        const showGroup = el('div', 'order-show-group', S.tools);
        el('span', 'order-label order-show-label', showGroup, 'Show:');
        const show = el('button', 'to-btn order-show', showGroup, 'All Orders  ▾');
        show.type = 'button';
        show.addEventListener('click', () => P.showUtility('Show orders', ['All Orders', 'Open Orders', 'Completed Orders']));

        S.chips = el('div', '', S.tools);
        S.chips.style.cssText = 'display:flex;gap:6px;min-width:0;overflow:hidden';
        S.clearAll = el('span', 'to-link', S.tools, 'Clear filters');
        S.clearAll.addEventListener('click', () => P.act(fam.helpers.clearFilters(ctx.model)));
        S.selBar = el('div', '', S.tools);
        S.selBar.style.cssText = 'display:flex;align-items:center;gap:6px;flex:none';
        S.selInfo = el('span', 'to-selinfo', S.selBar, '');
        S.clearSelBtn = el('span', 'to-link', S.selBar, 'Clear');
        S.clearSelBtn.addEventListener('click', () => P.act(fam.helpers.clearSel(ctx.model)));
        S.markBtn = P.bulkButton('Mark as', '', 'status');
        S.archBtn = P.bulkButton('Archive', '', 'archive');
        S.delBtn = P.bulkButton('Delete', 'danger', 'delete');
        P.icon(S.markBtn, 'down', false); P.icon(S.archBtn, 'archive'); P.icon(S.delBtn, 'trash');
        S.markBtn.addEventListener('click', () => P.act(fam.helpers.openMark(ctx.model)));
        S.archBtn.addEventListener('click', () => P.act(fam.helpers.askBulk(ctx.model, spec, 'archive', null)));
        S.delBtn.addEventListener('click', () => P.act(fam.helpers.askBulk(ctx.model, spec, 'delete', null)));
        S.undoBtn = el('button', 'to-btn ghost', S.tools, 'Undo');
        P.icon(S.undoBtn, 'undo');
        S.undoBtn.type = 'button';
        S.undoBtn.addEventListener('click', () => P.act(fam.helpers.undo(ctx.model, spec)));
      },
    },
  },
});
