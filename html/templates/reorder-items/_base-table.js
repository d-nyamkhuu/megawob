/* reorder-items/_base-table: reference renderer scope with its original design unit hooks.
 * Registered by reorder-items/base in the original scope order. */
(function () {
  'use strict';
  env.template('reorder-items/_base-table', () => ({
    register(env, scriptOf, __parts, __has, setScope) {
      'use strict';
      const __scope = {
        get env() { return env; },
        get scriptOf() { return scriptOf; },
        get LOCK_SVG() { return LOCK_SVG; },
        get CSS() { return CSS; },
        get LETTERS() { return LETTERS; },
        get sortable() { return sortable; }, set sortable(v) { sortable = v; },
        get ensureStyle() { return ensureStyle; },
        get place() { return place; },
        get col() { return col; },
        get tag() { return tag; },
        get keyPanel() { return keyPanel; },
        get renderList() { return renderList; },
        get renderGrid() { return renderGrid; },
      };
      for (const k of Object.keys(__parts)) if (k.startsWith('+1.')) {
        let v; let built = false;
        Object.defineProperty(__scope, k.slice(3), {
          get: () => (built ? v : (built = true, v = __parts[k](undefined, __scope))),
          set: (x) => { built = true; v = x; },
        });
      }
      setScope(__scope);
      if (__has('ensureStyle@1')) ensureStyle = __parts['ensureStyle@1'](ensureStyle, __scope);
      if (__has('place')) place = __parts['place'](place, __scope);
      if (__has('col')) col = __parts['col'](col, __scope);
      if (__has('tag')) tag = __parts['tag'](tag, __scope);
      if (__has('keyPanel@1')) keyPanel = __parts['keyPanel@1'](keyPanel, __scope);
      if (__has('renderList')) renderList = __parts['renderList'](renderList, __scope);
      if (__has('renderGrid')) renderGrid = __parts['renderGrid'](renderGrid, __scope);

      const LOCK_SVG = __has('LOCK_SVG@1') ? __parts['LOCK_SVG@1'](undefined, __scope) : ('<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path fill="currentColor" d="M5 7V5a3 3 0 0 1 6 0v2h.5A1.5 1.5 0 0 1 13 8.5v5A1.5 1.5 0 0 1 11.5 15h-7A1.5 1.5 0 0 1 3 13.5v-5A1.5 1.5 0 0 1 4.5 7H5zm1.5 0h3V5a1.5 1.5 0 0 0-3 0v2z"/></svg>');

      const CSS = __has('CSS@1') ? __parts['CSS@1'](undefined, __scope) : (`
      .rt-outer { display: flex; gap: 20px; align-items: flex-start; flex: none; }
      .rt-wrap { position: relative; flex: none; }
      .rt-table {
        table-layout: fixed; border-collapse: separate; border-spacing: 0;
        background: var(--panel); border: 1px solid var(--line); border-radius: 4px;
        font: 14px/1.2 "Courier New", "Liberation Mono", monospace; color: var(--fg);
      }
      .rt-table th {
        font: 600 11px/1 system-ui, sans-serif; text-transform: uppercase; letter-spacing: .08em;
        color: #fff; background: var(--accent); text-align: left; padding: 0 10px; height: 30px;
      }
      .rt-table td { padding: 0 10px; border-top: 1px solid var(--line); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; background: var(--panel); }
      .rt-table tbody tr:nth-child(even) td { background: color-mix(in srgb, var(--line) 30%, var(--panel)); }
      .rt-row:focus { outline: 2px solid var(--accent); outline-offset: -2px; }
      .rt-row td.rt-name { font-weight: 700; font-size: 15px; }
      .rt-rank { color: var(--muted); text-align: right; }
      .rt-code { color: var(--muted); font-size: 12px; }
      .rt-val { text-align: right; font-variant-numeric: tabular-nums; }
      .rt-grip { cursor: grab; color: var(--muted); text-align: center; font-size: 18px; }
      .rt-lock { color: var(--muted); text-align: center; }
      .rt-row.rt-drag { position: relative; z-index: 3; }
      .rt-row.rt-drag td { background: color-mix(in srgb, var(--accent) 14%, var(--panel)) !important; border-top-color: var(--accent); }
      .rt-row.rt-drag .rt-grip { cursor: grabbing; color: var(--accent); }
      .rt-ph {
        position: absolute; z-index: 1; pointer-events: none;
        background: repeating-linear-gradient(45deg, color-mix(in srgb, var(--accent) 12%, transparent) 0 6px, transparent 6px 12px);
        border: 1px dashed var(--accent);
      }
      .rt-sheet th { text-align: center; padding: 0; }
      .rt-sheet tbody th { color: var(--muted); background: color-mix(in srgb, var(--accent) 10%, var(--panel)); border-top: 1px solid var(--line); }
      .rt-sheet td.rt-cell {
        text-align: center; font-weight: 700; font-size: 15px; cursor: grab;
        border-left: 1px solid var(--line);
      }
      /* Own focus style: Chromium's default ring (outline: auto) on a scripted focus() disappears once any native
         control took mouse focus on the page, so episodes reset in place would differ from the first one. */
      .rt-sheet td.rt-cell:focus { outline: 2px solid var(--accent); outline-offset: -2px; }
      .rt-sheet td.rt-cell small { display: block; font-weight: 400; font-size: 10.5px; color: var(--muted); overflow: hidden; text-overflow: ellipsis; }
      .rt-sheet td.rt-cell.rt-drag {
        position: relative; z-index: 3; cursor: grabbing;
        background: color-mix(in srgb, var(--accent) 18%, var(--panel)) !important; outline: 2px solid var(--accent); outline-offset: -2px;
      }
      .rt-sheet td.rt-empty { border-left: 1px solid var(--line); }
      .rt-tag { display: inline-block; padding: 1px 7px; border-radius: 3px; font: 700 11px system-ui, sans-serif; color: #fff; background: var(--tagc); }
      .rt-key { flex: none; border: 1px solid var(--line); background: var(--panel); font: 13px system-ui, sans-serif; }
      .rt-key h4 { margin: 0; padding: 6px 10px; font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: #fff; background: var(--accent); }
      .rt-key ol { margin: 8px 10px 10px; padding-left: 20px; display: grid; gap: 6px; }
      `);

      const LETTERS = __has('LETTERS') ? __parts['LETTERS'](undefined, __scope) : ('ABCDEFGH');
      let sortable = __has('sortable@1') ? __parts['sortable@1'](undefined, __scope) : undefined;

      function ensureStyle() {
        if (document.getElementById('rt-style')) return;
        const s = document.createElement('style');
        s.id = 'rt-style';
        s.textContent = CSS;
        document.head.append(s);
      }

      // The placeholder takes the slot's size; items keep the default transform placement.
      function place(el, rect, info) {
        if (info.placeholder) {
          Object.assign(el.style, { left: rect.x + 'px', top: rect.y + 'px', width: rect.w + 'px', height: rect.h + 'px' });
        } else {
          env.ui.sortable.defaultPlace(el, rect, info);
        }
      }

      function col(colgroup, w) {
        const c = document.createElement('col');
        c.style.width = w + 'px';
        colgroup.append(c);
      }

      function tag(util, parent, lab) {
        const t = util.el('span', 'rt-tag', parent, lab.tag);
        t.style.setProperty('--tagc', lab.color || '#868e96');
        return t;
      }

      function keyPanel(ctx, parent) {
        const { util, spec } = ctx;
        if (!spec.legend) return;
        const box = util.el('div', 'rt-key', parent);
        util.el('h4', '', box, spec.legendTitle || 'Key');
        const ol = util.el('ol', '', box);
        for (const l of spec.legend) tag(util, util.el('li', '', ol), l);
      }

      function renderList(ctx, wrap) {
        const { rng, util, size, spec } = ctx;
        const n = spec.items.length;
        const rowH = Math.max(26, Math.min(rng.int(32, 44), Math.floor((size.height - 70) / n)));
        const hasVal = spec.items.some((id) => spec.labels[id].value);
        const hasTag = spec.items.some((id) => spec.labels[id].tag);
        const longest = Math.max(...spec.items.map((id) => spec.labels[id].title.length));
        const keyW = spec.legend ? 190 : 0;
        const room = size.width - 60 - keyW;
        const codeW = rng.bool(0.6) ? 90 : 0;
        const valW = hasVal ? Math.max(...spec.items.map((id) => (spec.labels[id].value || '').length)) * 8.6 + 24 : 0;
        const tagW = hasTag ? Math.round(Math.max(...spec.items.map((id) => (spec.labels[id].tag || '').length)) * 7.6 + 36) : 0;
        const nameW = Math.max(150, Math.min(room - 36 - 40 - codeW - valW - tagW, Math.round(longest * 9.2 + 30), 380));
        const widths = [36, 40, nameW];
        const heads = ['', '#', rng.pick(['Item', 'Entry', 'Name', 'Title'])];
        if (hasTag) { widths.push(tagW); heads.push(spec.rule.kind === 'priority' ? 'Priority' : 'Tag'); }
        if (hasVal) { widths.push(valW); heads.push({ price: 'Price', date: 'Date', size: 'Size' }[spec.rule.kind] || 'Value'); }
        if (codeW) { widths.push(codeW); heads.push(rng.pick(['Ref', 'Code', 'ID'])); }
        const table = util.el('table', 'rt-table', wrap);
        table.style.width = widths.reduce((a, b) => a + b, 2) + 'px';
        const cg = util.el('colgroup', '', table);
        for (const w of widths) col(cg, w);
        const head = util.el('tr', '', util.el('thead', '', table));
        for (const h of heads) util.el('th', '', head, h);
        const body = util.el('tbody', '', table);
        const rows = {};
        const rank = {};
        const prefix = rng.pick(['RX', 'QA', 'TK', 'LN', 'OP']);
        for (const id of ctx.model.order) {
          const lab = spec.labels[id];
          const locked = !!(spec.locked && id in spec.locked);
          const tr = util.el('tr', 'rt-row', body);
          tr.dataset.role = 'card';
          tr.dataset.id = id;
          tr.style.height = rowH + 'px';
          if (locked) util.el('td', 'rt-lock', tr).innerHTML = LOCK_SVG;
          else util.el('td', 'rt-grip', tr, '⠿');
          rank[id] = util.el('td', 'rt-rank', tr);
          util.el('td', 'rt-name', tr, lab.title);
          if (hasTag) {
            const td = util.el('td', '', tr);
            if (lab.tag) tag(util, td, lab);
          }
          if (hasVal) util.el('td', 'rt-val', tr, lab.value || '');
          if (codeW) util.el('td', 'rt-code', tr, `${prefix}-${rng.int(1000, 9999)}`);
          if (locked) tr.title = 'Pinned';
          rows[id] = tr;
        }
        const ph = util.el('div', 'rt-ph', wrap);
        sortable = env.ui.sortable(wrap, {
          items: rows,
          order: ctx.model.order,
          handle: '.rt-grip',
          axis: 'y',
          bounds: 'center',
          placeholder: ph,
          place,
          arrange(order) {
            const had = document.activeElement;
            order.forEach((id, i) => {
              body.append(rows[id]);
              rank[id].textContent = i + 1;
            });
            // Re-appending rows drops focus; keep it where it was.
            if (had && had !== document.activeElement && body.contains(had)) had.focus();
          },
          activeClass: 'rt-drag',
          keyboard: !!spec.keys,
          label: 'row',
          onChange: (order) => {
            const pinned = env.taskDef.helpers.pin ? env.taskDef.helpers.pin(order, spec) : order;
            if (pinned.join() !== order.join()) sortable.set(pinned);
            ctx.update({ ...ctx.model, order: pinned });
          },
        });
        if (spec.keys) {
          table.addEventListener('pointerdown', (e) => {
            const tr = e.target.closest && e.target.closest('.rt-row');
            if (tr) tr.focus();
          });
          table.addEventListener('focusin', (e) => {
            const tr = e.target.closest && e.target.closest('.rt-row');
            if (tr && ctx.model.focus !== tr.dataset.id) ctx.update({ ...ctx.model, focus: tr.dataset.id });
          });
          table.addEventListener('focusout', (e) => {
            if (!(e.relatedTarget && table.contains(e.relatedTarget)) && ctx.model.focus) ctx.update({ ...ctx.model, focus: null });
          });
        }
      }

      function renderGrid(ctx, wrap) {
        const { rng, util, size, spec } = ctx;
        const n = spec.items.length;
        const cols = spec.cols;
        const nRows = Math.ceil(n / cols);
        const hasVal = spec.items.some((id) => spec.labels[id].value);
        const wordy = spec.rule.kind !== 'number';
        const maxCellW = Math.floor((size.width - 80 - 34) / cols);
        const cellW = Math.min(maxCellW, wordy ? rng.int(hasVal ? 130 : 112, hasVal ? 160 : 136) : rng.int(70, 100));
        const cellH = Math.max(34, Math.min(rng.int(44, hasVal ? 64 : 68), Math.floor((size.height - 70) / nRows)));
        const table = util.el('table', 'rt-table rt-sheet', wrap);
        table.style.width = 34 + cols * cellW + 2 + 'px';
        const cg = util.el('colgroup', '', table);
        col(cg, 34);
        for (let c = 0; c < cols; c++) col(cg, cellW);
        const head = util.el('tr', '', util.el('thead', '', table));
        util.el('th', '', head, '');
        for (let c = 0; c < cols; c++) util.el('th', '', head, LETTERS[c]);
        const body = util.el('tbody', '', table);
        const rowEls = [];
        for (let r = 0; r < nRows; r++) {
          const tr = util.el('tr', '', body);
          tr.style.height = cellH + 'px';
          util.el('th', '', tr, String(r + 1));
          rowEls.push(tr);
        }
        const cells = {};
        for (const id of ctx.model.order) {
          const lab = spec.labels[id];
          const td = util.el('td', 'rt-cell');
          td.dataset.role = 'card';
          td.dataset.id = id;
          td.append(lab.value || lab.title);
          if (lab.value) util.el('small', '', td, lab.title);
          cells[id] = td;
        }
        const fillers = Array.from({ length: nRows * cols - n }, () => util.el('td', 'rt-empty'));
        const ph = util.el('div', 'rt-ph', wrap);
        sortable = env.ui.sortable(wrap, {
          items: cells,
          order: ctx.model.order,
          bounds: 'center',
          placeholder: ph,
          place,
          arrange(order) {
            const had = document.activeElement;
            order.forEach((id, i) => rowEls[Math.floor(i / cols)].append(cells[id]));
            for (const f of fillers) rowEls[nRows - 1].append(f);
            if (had && had !== document.activeElement && body.contains(had)) had.focus();
          },
          activeClass: 'rt-drag',
          keyboard: !!spec.keys,
          label: 'cell',
          onChange: (order) => ctx.update({ ...ctx.model, order }),
        });
        if (spec.keys) {
          table.addEventListener('pointerdown', (e) => {
            const td = e.target.closest && e.target.closest('.rt-cell');
            if (td) td.focus();
          });
          table.addEventListener('focusin', (e) => {
            const td = e.target.closest && e.target.closest('.rt-cell');
            if (td && ctx.model.focus !== td.dataset.id) ctx.update({ ...ctx.model, focus: td.dataset.id });
          });
          table.addEventListener('focusout', (e) => {
            if (!(e.relatedTarget && table.contains(e.relatedTarget)) && ctx.model.focus) ctx.update({ ...ctx.model, focus: null });
          });
        }
      }

      env.widget({
        task: 'reorder-items',
        site: 'base',
        name: 'table',
        split: 'train',
        scenarios: ['list', 'grid', 'move'],

        render(ctx) {
          ensureStyle();
          const outer = ctx.util.el('div', 'rt-outer', ctx.stage);
          outer.style.margin = `${ctx.rng.int(4, 12)}px ${ctx.rng.int(8, 24)}px`;
          const keyFirst = ctx.spec.legend && ctx.rng.bool(0.4);
          if (keyFirst) keyPanel(ctx, outer);
          const wrap = ctx.util.el('div', 'rt-wrap', outer);
          if (ctx.spec.scenario === 'grid') renderGrid(ctx, wrap);
          else renderList(ctx, wrap);
          if (!keyFirst) keyPanel(ctx, outer);
          return { anchors: [wrap] };
        },

        locate(t) {
          if (t.item !== undefined) return sortable.locate(t.item);
          if (t.slot !== undefined) return sortable.locateSlot(t.slot);
          throw new Error(`reorder-items/table cannot locate ${JSON.stringify(t)}`);
        },
      });
    
    },
  }));
})();
