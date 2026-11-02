/* use-spreadsheet/_chrome: frame, ribbon and workspace part installers.
 * S is the live workbook scope; BASE retains every overridable part on use-spreadsheet/workbook.
 * Installers only register functions; DOM work starts in render.
 */
(function () {
  'use strict';
  function frameParts(S, BASE, CSS) {
    BASE.css = () => {
      return CSS(S.D);
    };

    BASE.frame = (ctx) => {
      ctx.css('app-sheet', S.P.css());
      const el = S.util.el('div', `as-book${S.isCanvas ? ' as-canvas' : ''}`, ctx.stage);
      el.classList.toggle('as-short', ctx.size.height < S.D.shortHeight);
      el.classList.toggle('as-roomy', ctx.size.width >= S.D.roomyWidth);
      el.classList.toggle('as-wide', ctx.size.width >= S.D.wideWidth);
      el.classList.toggle('as-compact', ctx.size.width < S.D.compactWidth);
      return el;
    };

    BASE.icon = (parent, key, size = 16) => {
      const svg = S.util.svg('svg', { viewBox: '0 0 20 20', width: size, height: size, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true', class: 'as-icon' }, parent);
      S.util.svg('path', { d: S.D.icons[key] || S.D.icons.sheet }, svg); return svg;
    };

    BASE.button = (p, text, key, fn, cls = '', glyph) => {
      const e = S.util.el('button', 'as-btn ' + cls, p, text); e.type = 'button'; e.addEventListener('click', fn);
      if (key) S.controls[key] = e;
      if (glyph) { const v = S.P.icon(e, glyph); e.insertBefore(v, e.firstChild); }
      if (!text) { e.setAttribute('aria-label', key || glyph); e.title = key || glyph; }
      return e;
    };

    BASE.info = (title, text) => {
      S.popover.replaceChildren(); S.util.el('strong', '', S.popover, title); S.util.el('p', '', S.popover, text);
      S.P.button(S.popover, 'Close', null, () => { S.popover.hidden = true; }); S.popover.hidden = false;
    };

    BASE.title = (ctx, book) => {
      const title = S.util.el('div', 'as-title', book);
      S.P.icon(S.util.el('div', 'as-logo', title), 'sheet');
      const heading = S.util.el('div', 'as-heading', title);
      S.util.el('b', '', heading, S.isCanvas ? S.spec.title.replace('Operations', 'Planning workbook') : S.spec.title);
      S.util.el('small', '', heading, S.isCanvas ? S.D.canvasBreadcrumb : S.D.breadcrumb);
      S.P.icon(S.util.el('span', 'as-saved', title, 'Saved to workspace'), 'check');
      S.P.button(title, '', 'Comments', () => S.P.info('Comments (3)', `${S.spec.cells[2][1]}: Please check the revised quantities before the month-end review.`), '', 'comment');
      S.P.button(title, '', 'Notifications', () => S.P.info('Notifications', `${S.spec.cells[3][1]} shared the Budget workbook. The vendor review has 2 new comments.`), '', 'bell');
      S.P.button(title, 'Share', null, () => S.P.info('People with access', `${S.spec.cells[1][1]} and ${S.spec.cells[2][1]} can edit. Workspace members can view.`), 'as-share', 'users');
      S.util.el('span', 'as-avatar', title, String(S.spec.cells[1][1]).slice(0, 1));
      return title;
    };

    BASE.navigation = (ctx, book) => {
      const nav = S.util.el('div', 'as-nav', book);
      for (const t of S.isCanvas ? S.D.canvasTabs : S.D.tabs) S.util.el('span', '', nav, t);
      return nav;
    };
  }

  function ribbonParts(S, BASE) {
    BASE.group = (tools, label, cls = '') => {
      const g = S.util.el('div', 'as-group ' + cls, tools), r = S.util.el('div', 'as-toolrow', g), r2 = S.util.el('div', 'as-toolrow', g); S.util.el('small', '', g, label); return [r, r2];
    };

    BASE.pick = (parent, text, fn, cls = '') => {
      const e = S.P.button(parent, text, null, fn, 'as-pick ' + cls); S.P.icon(e, 'down', 11); return e;
    };

    BASE.style = (key, value) => {
      S.P.update({ ...S.ctx.model, sheetStyle: { ...(S.ctx.model.sheetStyle || {}), [key]: value } });
    };

    BASE.clipboard = (tools) => {
      const [edits, edits2] = S.P.group(tools, 'Clipboard');
      S.undo = S.P.button(edits, '', 'undo', () => {
        const m = S.ctx.model; if (!m.history.length) return;
        const n = S.util.clone(m), old = n.history.pop(); Object.assign(n, old); S.P.update(n);
      }, '', 'undo'); S.undo.title = 'Undo (Ctrl+Z)';
      S.P.button(edits, '', 'Version history', () => S.P.info('Version history', 'Current version: Operations review. Previous version: Vendor quantities updated.'), '', 'clock');
      S.P.button(edits2, 'Paste', null, () => S.P.info('Clipboard', 'Use the formula bar to enter a value or formula. Existing cells remain editable.'), '', 'sheet');
    };

    BASE.fontTools = (tools) => {
      const [fonts, fontStyles] = S.P.group(tools, 'Font', 'as-fontgroup');
      S.fontPick = S.P.pick(fonts, S.D.font, () => S.P.style('font', S.ctx.model.sheetStyle?.font === S.D.alternateFont ? S.D.font : S.D.alternateFont));
      S.P.pick(fonts, '10', () => S.P.style('large', !S.ctx.model.sheetStyle?.large));
      for (const [label, key] of [['B', 'bold'], ['I', 'italic'], ['U', 'underline']]) { const b = S.P.button(fontStyles, label, null, () => S.P.style(key, !S.ctx.model.sheetStyle?.[key])); b.title = key; }
      S.P.button(fontStyles, '', 'Borders', () => S.P.style('borders', !S.ctx.model.sheetStyle?.borders), '', 'border');
    };

    BASE.alignmentTools = (tools) => {
      const [align, merge] = S.P.group(tools, 'Alignment', 'as-optional');
      S.P.button(align, '', 'Align left', () => S.P.style('align', 'left'), '', 'align');
      S.P.button(align, '', 'Wrap text', () => S.P.info('Wrap text', 'Row heights are fixed for this imported orders table.'), '', 'list');
      const mergeButton = S.P.button(merge, 'Merge', null, () => {}, '', 'merge'); mergeButton.disabled = true; mergeButton.title = 'Cells in an orders table cannot be merged';
    };

    BASE.numberTools = (tools) => {
      const [numbers, decimals] = S.P.group(tools, 'Number');
      S.numberPick = S.P.pick(numbers, 'Number', () => S.P.style('format', S.ctx.model.sheetStyle?.format === 'general' ? 'number' : 'general'));
      S.P.button(decimals, '$', null, () => S.P.style('currency', !S.ctx.model.sheetStyle?.currency));
      S.P.button(decimals, '%', null, () => S.P.style('percent', !S.ctx.model.sheetStyle?.percent));
      S.P.button(decimals, '.00', null, () => S.P.style('decimals', !S.ctx.model.sheetStyle?.decimals));
    };

    BASE.formatTools = (tools) => {
      const [formats, dataTools] = S.P.group(tools, 'Styles & data', 'as-formatgroup');
      const conditional = S.P.button(formats, 'Conditional format', 'condfmt', () => {
        const m = S.util.clone(S.ctx.model); m.dialog = true; m.menu = null;
        m.draft = m.rule ? { ...S.util.clone(m.rule), range: S.task.helpers.rangeName(m.rule.range), threshold: String(m.rule.threshold) } : { range: S.task.helpers.rangeName(m.selection), op: '>', threshold: '', color: 'red' };
        S.P.update(m);
      }, '', 'paint'); S.P.icon(conditional, 'down', 11);
      S.P.button(dataTools, 'Clear filter', 'clearFilter', () => S.P.commit(S.task.helpers.transition(S.ctx.model, S.spec, 'clearFilter')), '', 'filter');
      S.P.button(dataTools, 'Functions', null, () => S.P.info('Functions', 'SUM(range)  /  AVERAGE(range)  /  MIN(range)  /  MAX(range)  /  COUNT(range). Start a formula with = in the formula bar.'), '', 'fx');
    };

    BASE.tableTools = (tools) => {
      const [tableTools, viewTools] = S.P.group(tools, 'Table tools', 'as-ribbonextra');
      S.P.button(tableTools, 'Format as table', null, () => S.P.style('borders', !S.ctx.model.sheetStyle?.borders), '', 'grid');
      S.P.button(viewTools, 'Freeze row 1', null, () => S.P.info('Freeze panes', 'Row 1 is frozen. Table headings stay visible while you work with the records below.'), '', 'freeze');
    };

    BASE.editingTools = (tools) => {
      const [findTools, reviewTools] = S.P.group(tools, 'Editing', 'as-ribbonextra');
      S.P.button(findTools, 'Find & select', null, () => S.P.info('Find in workbook', 'Use the name box to go to a cell address or select a range in the current sheet.'), '', 'search');
      S.P.button(reviewTools, 'Sort & filter', null, () => S.P.update({ ...S.ctx.model, menu: { col: S.ctx.model.selection[1] } }), '', 'filter');
    };

    BASE.ribbon = (ctx, book) => {
      const tools = S.util.el('div', 'as-tools', book);
      S.P.clipboard(tools);
      S.P.fontTools(tools);
      S.P.alignmentTools(tools);
      S.P.numberTools(tools);
      S.P.formatTools(tools);
      S.P.tableTools(tools);
      S.P.editingTools(tools);
      return tools;
    };
  }

  function workspaceParts(S, BASE) {
    BASE.sheetCell = (p, m = S.ctx.model) => {
      return [m.sort && p[0] > 0 && p[0] <= S.spec.n ? m.order.indexOf(p[0]) + 1 : p[0], p[1]];
    };

    BASE.sourceCell = (p) => {
      return [S.ctx.model.sort && p[0] > 0 && p[0] <= S.spec.n ? S.ctx.model.order[p[0] - 1] : p[0], p[1]];
    };

    BASE.formulaSource = (value) => {
      return S.ctx.model.sort && value.startsWith('=') ? S.task.helpers.translate(value, S.ctx.model.selection[0] - S.P.sheetCell(S.ctx.model.selection.slice(0, 2))[0], 0) : value;
    };

    BASE.formulaBar = (ctx, book) => {
      const fbar = S.util.el('div', 'as-fbar', book);
      S.nameBox = S.util.el('input', 'as-name', fbar); S.nameBox.setAttribute('aria-label', 'Name box');
      S.nameBox.addEventListener('keydown', (e) => { if (e.key === 'Enter') { const a = S.task.helpers.parseRange(S.nameBox.value); if (a && a[2] < ctx.model.cells.length && a[3] < 8) S.P.update({ ...ctx.model, selection: [...S.P.sourceCell(a.slice(0, 2)), ...S.P.sourceCell(a.slice(2))] }); S.grid.focus(); } });
      S.P.button(fbar, '', 'commit', () => { if (ctx.model.editing) S.P.commit(S.task.helpers.transition(ctx.model, S.spec, 'formula', S.P.formulaSource(S.formula.value))); }, '', 'check');
      S.P.icon(S.util.el('span', 'as-fx', fbar), 'fx');
      S.formula = S.util.el('input', 'as-input as-formula', fbar); S.formula.spellcheck = false; S.formula.setAttribute('aria-label', 'Formula bar'); S.controls.formula = S.formula;
      S.formula.addEventListener('input', () => S.P.update({ ...ctx.model, editing: true, formulaDraft: S.formula.value }));
      S.formula.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); S.P.commit(S.task.helpers.transition(ctx.model, S.spec, 'formula', S.P.formulaSource(S.formula.value))); S.grid.focus(); }
        if (e.key === 'Escape') { S.P.update({ ...ctx.model, editing: false, formulaDraft: '' }); S.grid.focus(); }
      });
    };

    BASE.context = (ctx, book) => {
      const context = S.util.el('div', 'as-context', book); S.P.icon(context, 'grid', 12); S.util.el('strong', '', context, 'Orders register');
      S.tableInfo = S.util.el('span', '', context, `${S.spec.n} records / USD`);
      const frozen = S.util.el('span', 'as-frozen', context, 'Row 1 frozen'); S.P.icon(frozen, 'freeze', 12);
      return context;
    };

    BASE.workarea = (ctx, book) => {
      return S.util.el('div', 'as-workarea', book);
    };

    BASE.workspace = (ctx, workarea) => {
      const workspace = S.util.el('aside', 'as-workspace', workarea);
      S.util.el('div', 'as-sideheading', workspace, 'Workspace');
      for (const [glyph, label, active] of [['folder', 'Workbooks', true], ['clock', 'Recent', false], ['star', 'Starred', false], ['users', 'Shared with me', false], ['comment', 'Comments', false]]) {
        S.P.workspaceItem(workspace, glyph, label, active);
      }
      const projects = S.util.el('div', 'as-projects', workspace); S.util.el('div', 'as-sideheading', projects, 'Finance / Planning');
      for (const [label, cls] of [['Operations', 'current'], ['Quarterly budget', ''], ['Vendor review', ''], ['Headcount plan', ''], ['Stock reconciliation', '']]) S.util.el('p', cls, projects, label);
      S.util.el('div', 'as-sideheading', projects, 'Shared drives'); S.util.el('p', '', projects, 'Procurement'); S.util.el('p', '', projects, 'Month-end close');
      return workspace;
    };

    BASE.workspaceItem = (workspace, glyph, label, active) => {
      const item = S.util.el('div', `as-sideitem${active ? ' active' : ''}`, workspace); S.P.icon(item, glyph); S.util.el('span', '', item, label); item.title = label;
      return item;
    };

    BASE.grid = (ctx, workarea) => {
      S.grid = S.util.el('div', 'as-grid', workarea); S.grid.tabIndex = 0; S.grid.setAttribute('aria-label', S.isCanvas ? 'Worksheet canvas. Use formula bar to edit selected cell.' : 'Worksheet grid');
      S.grid.setAttribute('role', S.isCanvas ? 'img' : 'grid');
      S.canvas = S.isCanvas ? S.util.el('canvas', '', S.grid) : null;
      return S.grid;
    };

    BASE.activity = (ctx, workarea) => {
      const activity = S.util.el('aside', 'as-activity', workarea); S.util.el('h4', '', activity, 'Workbook activity');
      for (const [who, what, when] of [[S.spec.cells[1][1], 'Updated the forecast assumptions to include the next delivery cycle.', '12 min ago'], [S.spec.cells[2][1], 'Added a comment to Vendor review: confirm the payment terms.', '38 min ago'], [S.spec.cells[3][1], 'Shared Quarterly budget with the Finance team.', 'Earlier today']]) {
        S.P.activityItem(activity, who, what, when);
      }
      return activity;
    };

    BASE.activityItem = (activity, who, what, when) => {
      const a = S.util.el('article', '', activity); S.util.el('strong', '', a, who); S.util.el('p', '', a, what); S.util.el('small', '', a, when);
      return a;
    };

    BASE.bottom = (ctx, book) => {
      const bottom = S.util.el('div', 'as-bottom', book);
      S.P.button(bottom, '', 'Sheet list', () => S.P.info('Sheets in this workbook', 'Orders, Summary, Budget, Vendors, Lookups and Archive.'), '', 'list');
      for (const label of [S.spec.sheet, ...S.D.sheets]) {
        S.P.sheetTab(bottom, label);
      }
      S.P.button(bottom, '', 'Add sheet', () => S.P.info('New worksheet', 'New worksheets are managed by workspace owners. You can edit the existing orders register.'), '', 'plus');
      const zoom = S.util.el('span', 'as-saved', bottom); S.P.icon(zoom, 'minus', 12); S.util.el('span', '', zoom, '100%'); S.P.icon(zoom, 'plus', 12); zoom.title = 'Workbook zoom';
      return bottom;
    };

    BASE.sheetTab = (bottom, label) => {
      const tab = S.P.button(bottom, label, null, () => label === S.spec.sheet ? (S.popover.hidden = true) : S.P.info(label + ' worksheet', label === 'Vendors' ? 'Vendor directory / Contract owner / Payment terms / Review date. Shared with the Procurement team.' : `${label} is a reference worksheet in this workbook. The current orders register remains open.`), 'as-tab' + (label === S.spec.sheet ? ' active' : ''));
      tab.setAttribute('role', 'tab'); tab.setAttribute('aria-selected', label === S.spec.sheet ? 'true' : 'false');
      return tab;
    };

    BASE.status = (ctx, book) => {
      const status = S.util.el('div', 'as-status', book);
      S.ready = S.util.el('span', '', status, 'Ready'), S.count = S.util.el('span', '', status), S.sum = S.util.el('span', '', status), S.records = S.util.el('span', '', status), S.total = S.util.el('span', 'as-total', status);
      S.P.icon(S.util.el('span', 'as-statusmark', status, 'Saved'), 'check', 11);
      return status;
    };

    BASE.overlays = (ctx, book) => {
      S.popover = S.util.el('aside', 'as-popover', book); S.popover.hidden = true;
      S.menu = S.util.el('div', 'as-menu', book); S.menu.hidden = true;
      S.shade = S.util.el('div', 'as-shade', book); S.shade.hidden = true;
    };

    BASE.dialog = (ctx) => {
      S.dialog = S.util.el('div', 'as-dialog', S.shade); S.dialog.setAttribute('role', 'dialog'); S.dialog.setAttribute('aria-label', 'Conditional formatting');
      S.util.el('h3', '', S.dialog, 'Conditional formatting'); S.util.el('p', '', S.dialog, 'Highlight cells that match a rule.');
      S.rangeField = S.P.field('Apply to range', 'range');
      S.util.el('label', '', S.dialog, 'Format cells if'); const operators = S.util.el('div', 'as-choices', S.dialog);
      for (const [key, label] of [['>', 'Greater than'], ['<', 'Less than'], ['=', 'Equal to']]) S.opEls[key] = S.P.button(operators, label, null, () => S.P.update({ ...ctx.model, draft: { ...ctx.model.draft, op: key } }));
      S.threshold = S.P.field('Value', 'threshold'); S.threshold.inputMode = 'decimal';
      S.util.el('label', '', S.dialog, 'Fill style'); const swatches = S.util.el('div', 'as-choices', S.dialog);
      for (const c of ['red', 'green', 'blue']) { S.colorEls[c] = S.P.button(swatches, c[0].toUpperCase() + c.slice(1), null, () => S.P.update({ ...ctx.model, draft: { ...ctx.model.draft, color: c } })); S.colorEls[c].style.background = S.D.colors[c][0]; S.colorEls[c].style.color = S.D.colors[c][1]; }
      S.preview = S.util.el('div', 'as-preview', S.dialog, '123   Preview');
      const actions = S.util.el('div', 'as-actions', S.dialog);
      S.P.button(actions, 'Cancel', 'cancel', () => S.P.update({ ...ctx.model, dialog: false }));
      S.P.button(actions, 'Apply rule', 'apply', () => S.P.commit(S.task.helpers.transition(ctx.model, S.spec, 'rule')), 'as-primary');
      return S.dialog;
    };

    BASE.field = (label, key) => {
      const l = S.util.el('label', '', S.dialog, label), e = S.util.el('input', 'as-input', S.dialog); e.id = `as-${S.D.renderer}-${key}`; l.htmlFor = e.id; S.controls[key] = e; e.addEventListener('input', () => S.P.update({ ...S.ctx.model, draft: { ...S.ctx.model.draft, [key]: e.value } })); return e;
    };
  }

  env.template('use-spreadsheet/_chrome', () => ({ frameParts, ribbonParts, workspaceParts }));
})();
