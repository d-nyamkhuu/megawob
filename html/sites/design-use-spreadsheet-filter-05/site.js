// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, util, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      const titlebar = util.el('div', 'ref-titlebar', document.body);
      const lights = util.el('div', 'ref-window-lights', titlebar);
      const brand = util.el('div', 'ref-window-title', titlebar);
      const logo = util.el('span', 'ref-logo-mark', brand);
      logo.innerHTML = '<svg viewBox="0 0 32 36" aria-hidden="true"><path fill="currentColor" d="M4 1h16l9 9v25H4z"/><path fill="#7b2937" d="M20 1v9h9z"/><path stroke="#7b2937" stroke-width="2" d="M9 16h15M9 21h15M9 26h12"/></svg>';
      util.el('span', '', brand, 'Invoices');
      const headerIcons = util.el('div', 'ref-header-icons', titlebar);
      const svgIcon = (name, markup) => {
        const holder = util.el('span', `ref-header-icon ref-header-${name}`, headerIcons);
        holder.innerHTML = markup;
        holder.setAttribute('aria-hidden', 'true');
      };
      svgIcon('grid', '<svg viewBox="0 0 24 24"><path d="M3 3h18v18H3zM9 3v18M15 3v18M3 9h18M3 15h18"/></svg>');
      svgIcon('chart', '<svg viewBox="0 0 24 24"><path fill="currentColor" stroke="none" d="M3 12h4v9H3zm7-9h4v18h-4zm7 5h4v13h-4z"/></svg>');
      svgIcon('gear', '<svg viewBox="0 0 24 24"><path d="M10 2h4l.7 2.5 2 .9 2.3-1.2 2.8 2.8-1.2 2.3.9 2L24 12v4l-2.5.7-.9 2 1.2 2.3-2.8 2.8-2.3-1.2-2 .9L14 26h-4l-.7-2.5-2-.9L5 23.8l-2.8-2.8 1.2-2.3-.9-2L0 16v-4l2.5-.7.9-2L2.2 7l2.8-2.8 2.3 1.2 2-.9z" transform="translate(1 -2) scale(.92)"/><circle cx="12" cy="12" r="3.2"/></svg>');
      Object.assign(_c, { collide, cr, decoys, label, lights, nav, placement, sidebar, titlebar, wantFooter });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      const appTools = util.el('div', 'ref-app-tools', header);
      const appButton = (glyph, label, selected) => {
        const b = util.el('button', `ref-app-tool${selected ? ' is-selected' : ''}`, appTools);
        b.type = 'button'; b.title = label; b.setAttribute('aria-label', label);
        util.el('span', 'ref-app-glyph', b, glyph);
        util.el('span', 'ref-app-label', b, label);
        return b;
      };
      appButton('▦', 'Workbook', true);
      appButton('▥', 'Charts');
      appButton('▤', 'Tables');
      appButton('A↧', 'Sort & Filter');
      appButton('✎', 'Format');
      util.el('span', 'ref-toolbar-gap', appTools);
      appButton('▦＋', 'Insert');
      appButton('▦−', 'Delete');
      appButton('∑', 'AutoSum');
      const search = util.el('div', 'ref-search', appTools);
      util.el('span', 'ref-search-icon', search, '⌕');
      util.el('span', '', search, 'Search Sheet');
      Object.assign(_c, { appButton, appTools, search });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util, ctx } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const inspector = util.el('aside', 'ref-properties', document.body);
      const inspectorHead = util.el('div', 'ref-properties-head', inspector);
      const detailIcon = util.el('span', 'ref-properties-close', inspectorHead);
      detailIcon.innerHTML = '<svg viewBox="0 0 32 38" aria-hidden="true"><path fill="currentColor" d="M3 1h18l8 8v28H3z"/><path fill="#e4efec" d="M21 1v8h8z"/><path stroke="#fff7eb" stroke-width="2" d="M9 17h15M9 23h15M9 29h12"/></svg>';
      util.el('strong', '', inspectorHead, 'Record Details');
      const fields = util.el('div', 'ref-detail-fields', inspector);
      const values = {};
      const column = (items) => {
        const col = util.el('div', 'ref-detail-column', fields);
        for (const [label, value, kind] of items) {
          const row = util.el('label', 'ref-detail-row', col);
          util.el('span', '', row, label);
          const input = util.el('div', `ref-detail-value${kind ? ' ' + kind : ''}`, row);
          values[label] = util.el('span', 'ref-detail-text', input, value);
          if (kind === 'select') util.el('span', 'ref-detail-caret', input, '⌄');
          if (kind === 'date') util.el('span', 'ref-detail-calendar', input, '▦');
        }
      };
      column([['Invoice #', 'INV-1001'], ['Customer', 'Acme Co.'], ['Date', '2024-01-05', 'date'], ['Amount', '$1,250.00']]);
      column([['Status', 'Paid', 'select'], ['Due Date', '2024-01-20', 'date'], ['Notes', 'Website redesign', 'notes']]);
      const refreshDetails = () => {
        const model = document.__invoiceDetailsModel?.();
        if (!model) return;
        const rowIndex = Math.max(1, Math.min((model.cells || []).length - 3, model.selection?.[0] ?? 1));
        const row = model.cells?.[rowIndex];
        if (!row) return;
        const amount = Number(row[2]) * Number(row[3]);
        const amountText = Number.isFinite(amount) ? '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : String(row[4] ?? '');
        const forecast = Number.isFinite(amount) ? (amount * 1.08).toFixed(2) : String(row[6] ?? '');
        const displayed = [row[0], row[1], row[2], amountText, row[5], forecast, row[7]];
        ['Invoice #', 'Customer', 'Date', 'Amount', 'Status', 'Due Date', 'Notes'].forEach((label, i) => {
          values[label].textContent = String(displayed[i] ?? '');
        });
      };
      document.__invoiceDetailsRefresh = refreshDetails;
      if (!document.__invoiceDetailsEvents) {
        document.addEventListener('click', () => document.__invoiceDetailsRefresh?.());
        document.addEventListener('keyup', () => document.__invoiceDetailsRefresh?.());
        document.__invoiceDetailsEvents = true;
      }
      Object.assign(_c, { inspector, inspectorHead, stage });
    },
  };

  env.site({
    name: 'design-use-spreadsheet-filter-05',
    template: 'site/base',
    design: { parts },
  });
})();
