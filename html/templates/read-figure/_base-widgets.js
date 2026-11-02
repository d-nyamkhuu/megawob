/* read-figure/_base-widgets: shared template implementation; design parts stay on the calling template. */
(function () {
  'use strict';
  function buildGrid(unitScope, ctx, body, up, B) {
    const { DOT_COLORS, answered, answerer, env, fail } = unitScope;
    const { spec, util, rng } = ctx;
    const { xr, yr } = spec;
    const pad = 36;
    const sp = Math.floor(Math.min(72, (B.w - 2 * pad) / (2 * xr), (B.h - 2 * pad) / (2 * yr)));
    const W = 2 * xr * sp + 2 * pad;
    const H = 2 * yr * sp + 2 * pad;
    const svg = util.svg('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'up-plane' }, body);
    svg.dataset.role = 'plane';
    svg.style.setProperty('--up-dot', rng.pick(DOT_COLORS));
    const X = (x) => pad + (x + xr) * sp;
    const Y = (y) => pad + (yr - y) * sp;
    if (rng.bool(0.6)) {
      for (let x = -xr; x <= xr; x++) if (x) util.svg('line', { x1: X(x), y1: Y(yr) - 10, x2: X(x), y2: Y(-yr) + 10, class: 'gl' }, svg);
      for (let y = -yr; y <= yr; y++) if (y) util.svg('line', { x1: X(-xr) - 10, y1: Y(y), x2: X(xr) + 10, y2: Y(y), class: 'gl' }, svg);
    }
    const defs = util.svg('defs', {}, svg);
    const mk = util.svg('marker', { id: 'up-arrow', viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 8, markerHeight: 8, orient: 'auto-start-reverse' }, defs);
    util.svg('path', { d: 'M0,1 L9,5 L0,9 z', fill: 'currentColor', style: 'fill: var(--fg)' }, mk);
    util.svg('line', { x1: X(-xr) - 24, y1: Y(0), x2: X(xr) + 26, y2: Y(0), class: 'ax', 'marker-start': 'url(#up-arrow)', 'marker-end': 'url(#up-arrow)' }, svg);
    util.svg('line', { x1: X(0), y1: Y(-yr) + 24, x2: X(0), y2: Y(yr) - 26, class: 'ax', 'marker-start': 'url(#up-arrow)', 'marker-end': 'url(#up-arrow)' }, svg);
    util.svg('text', { x: X(xr) + 22, y: Y(0) - 14, class: 'axn' }, svg).textContent = 'x';
    util.svg('text', { x: X(0) + 14, y: Y(yr) - 24, class: 'axn' }, svg).textContent = 'y';
    const off = Math.min(17, sp * 0.3);
    for (let x = -xr; x <= xr; x++) util.svg('text', { x: X(x) + (x ? 0 : -off * 0.75), y: Y(0) + off, class: 'tk' }, svg).textContent = String(x);
    for (let y = -yr; y <= yr; y++) if (y) util.svg('text', { x: X(0) - off, y: Y(y) - off * 0.75, class: 'tk' }, svg).textContent = String(y);
    const dots = [];
    const keys = [];
    for (let y = yr; y >= -yr; y--) {
      for (let x = -xr; x <= xr; x++) {
        const g = util.svg('g', { class: 'up-dot' }, svg);
        g.dataset.role = 'dot';
        util.svg('circle', { cx: X(x), cy: Y(y), r: sp * 0.4, class: 'hit' }, g);
        util.svg('circle', { cx: X(x), cy: Y(y), r: 5.5, class: 'pt' }, g);
        dots.push(g);
        keys.push(`${x},${y}`);
      }
    }
    const bt = env.ui.buttons(dots, { keys, label: 'dot', history: answered(ctx.model), onClick: answerer(ctx, up) });
    return { sync: (m) => bt.set(answered(m)), locate: (t) => (t.point ? bt.locate(`${t.point[0]},${t.point[1]}`) : fail(t)) };
  }

  function buildAddition(unitScope, ctx, body, up, B) {
    const { BLOCK_COLORS, answerField, fail, px } = unitScope;
    const { spec, util, rng } = ctx;
    const row = util.el('div', 'up-row', body);
    row.style.gap = '20px';
    const most = Math.max(spec.a, spec.b);
    const cols = Math.max(rng.int(2, 5), Math.ceil(most / 5));
    const rowsMax = Math.ceil(most / cols);
    const size = Math.floor(Math.min(rng.int(22, 30), (B.h - 30) / rowsMax - 5, (B.w - 260) / (2 * cols) - 5));
    const color = rng.pick(BLOCK_COLORS);
    for (const [i, count] of [spec.a, spec.b].entries()) {
      if (i) util.el('span', 'up-op', row, '+');
      const g = util.el('div', 'up-group', row);
      g.dataset.role = 'blocks';
      g.style.gridTemplateColumns = `repeat(${cols}, ${size}px)`;
      g.style.setProperty('--up-block', color);
      for (let k = 0; k < count; k++) {
        const b = util.el('span', 'up-block', g);
        b.style.width = b.style.height = px(size);
      }
    }
    util.el('span', 'up-op', row, '=');
    const tf = answerField(ctx, row, up, '');
    return { sync: (m) => tf.set(m.text), locate: (t) => (t.field ? tf.locate() : fail(t)) };
  }

  function buildAscending(unitScope, ctx, body, up, B) {
    const { env, fail, px } = unitScope;
    const { spec, util, rng } = ctx;
    const W = Math.floor(Math.min(rng.int(560, 660), B.w));
    const H = Math.floor(Math.min(rng.int(300, 360), B.h));
    const board = util.el('div', 'up-field2d', body);
    board.style.width = px(W);
    board.style.height = px(H);
    board.dataset.role = 'board';
    const cw = (W - 12) / spec.gw;
    const chh = (H - 12) / spec.gh;
    const T = Math.floor(Math.min(rng.int(42, 50), cw - 8, chh - 8));
    const tiles = spec.cells.map((p, i) => {
      const d = util.el('div', 'up-num', board, String(spec.values[i]));
      d.style.width = d.style.height = px(T);
      d.style.left = px(6 + p.c * cw + 4 + p.jx * (cw - T - 8));
      d.style.top = px(6 + p.r * chh + 4 + p.jy * (chh - T - 8));
      if (String(spec.values[i]).length > 2) d.style.fontSize = px(Math.min(19, T * 0.38));
      d.dataset.role = 'number';
      return d;
    });
    const prefix = (m) => {
      let k = 0;
      while (k < m.clicks.length && m.clicks[k] === spec.order[k]) k++;
      return k;
    };
    function sync(m) {
      const masked = spec.mode === 'hide' && m.clicks.length > 0;
      const k = prefix(m);
      tiles.forEach((d, i) => {
        const pos = m.clicks.indexOf(i);
        const bad = pos >= k && pos >= 0;
        const gone = pos >= 0 && !bad;
        d.classList.toggle('gone', gone);
        d.classList.toggle('bad', bad);
        d.classList.toggle('masked', masked && !gone && !bad);
        d.textContent = masked && !bad ? '' : String(spec.values[i]);
      });
    }
    env.ui.buttons(tiles, {
      label: 'number',
      onClick: (i) => {
        const m = ctx.model;
        if (m.clicks.includes(i)) return;
        if (m.clicks.length > prefix(m)) { ctx.log('locked', { key: i }); return; } // a wrong click stands: undo first
        const clicks = m.clicks.concat([i]);
        const wrong = spec.order[m.clicks.length] === i ? 0 : 1;
        up({ clicks, wrong: (m.wrong || 0) + wrong });
      },
    });
    return { sync, locate: (t) => (t.number !== undefined ? env.util.center(tiles[t.number]) : fail(t)) };
  }

  function buildCheckboxes(unitScope, ctx, body, up) {
    const { env, fail } = unitScope;
    const { spec, util, rng } = ctx;
    const row = util.el('div', 'up-row', body);
    row.style.gap = `${rng.int(28, 48)}px`;
    if (rng.bool(0.5)) row.style.flexDirection = 'row-reverse';
    const grid = util.el('div', 'up-cbgrid', row);
    grid.style.gridTemplateColumns = `repeat(${spec.cols}, 24px)`;
    grid.dataset.role = 'checkboxes';
    const pairs = [];
    for (let r = 0; r < spec.rows; r++) {
      for (let c = 0; c < spec.cols; c++) {
        const cb = util.el('input', '', grid);
        cb.type = 'checkbox';
        cb.dataset.role = 'checkbox';
        pairs.push([r * spec.cols + c, cb]);
      }
    }
    const ex = util.el('div', 'up-example', row);
    util.el('span', 'up-label', ex, 'Example');
    const eg = util.el('div', 'up-exgrid', ex);
    eg.style.gridTemplateColumns = `repeat(${spec.cols}, 14px)`;
    for (const r of spec.pattern) for (const v of r) util.el('i', v ? 'on' : '', eg);
    const ch = env.ui.choices(pairs, { multi: true, label: 'checkbox', values: ctx.model.on, onChange: (vals) => up({ on: vals }) });
    return { sync: (m) => ch.set(m.on), locate: (t) => (t.cell !== undefined ? ch.locate(t.cell) : fail(t)) };
  }

  function buildScrollCount(unitScope, ctx, body, up, B) {
    const { ROW_COLORS, answerField, answered, drawIcon, env, fail, optionButtons, palette, px } = unitScope;
    const { spec, util, rng } = ctx;
    const n = spec.rows.length;
    const answerH = spec.answer === 'typed' ? 46 : 44;
    const RH = Math.max(26, Math.min(rng.int(32, 40), Math.floor((B.h - answerH - 40) / spec.view)));
    const LW = Math.floor(Math.min(rng.int(380, 470), B.w - 20));
    util.el('div', 'up-label', body, `${n} ${rng.pick(['items', 'entries', 'records'])}`);
    const wrap = util.el('div', 'up-sc', body);
    const list = util.el('div', 'up-sclist', wrap);
    list.style.height = px(spec.view * RH + 2); // + the 1px borders (border-box): exactly view rows inside
    list.style.width = px(LW);
    list.dataset.role = 'list';
    const pal = palette(spec);
    if (pal.board) {
      list.classList.add('up-low');
      list.style.setProperty('--up-lowboard', pal.board);
    }
    const rowColors = pal.board ? pal.colors : ROW_COLORS;
    const iconPx = Math.round(Math.min(spec.glyphs === 'emoji' ? 22 : 20, RH * 0.6));
    const rows = spec.rows.map((r) => {
      const d = util.el('div', 'up-scrow', list);
      d.style.height = px(RH);
      d.dataset.role = 'row';
      const svg = util.svg('svg', { width: iconPx, height: iconPx, viewBox: `0 0 ${iconPx} ${iconPx}` }, d);
      drawIcon(util, svg, r.icon, iconPx / 2, iconPx / 2, iconPx, rowColors[r.color], spec.glyphs);
      util.el('span', 'lbl', d, r.label);
      util.el('span', 'meta', d, r.meta);
      return d;
    });
    const track = util.el('div', 'up-sctrack', wrap);
    track.dataset.role = 'scrollbar';
    const thumb = util.el('div', 'up-scthumb', track);
    thumb.dataset.role = 'thumb';
    const lbx = env.ui.listbox(list, {
      label: 'list',
      options: rows.map((el, i) => [i, el]),
      onScroll(i) {
        const m = ctx.model;
        const top = Math.round(i * 1000) / 1000;
        const seen = Math.max(m.seen ?? spec.view - 1, Math.round((top + spec.view - 1) * 1000) / 1000);
        if (top !== m.top || seen !== m.seen) ctx.update({ ...m, top, seen });
      },
      scrollbar: { track, thumb, pad: 2, minThumb: 24 },
    });
    lbx.set({ scroll: ctx.model.top || 0 });
    let ans;
    if (spec.answer === 'typed') {
      const tf = answerField(ctx, body, up, '');
      ans = { sync: (m) => tf.set(m.text), locate: (t) => (t.field ? tf.locate() : null) };
    } else {
      const bt = optionButtons(ctx, body, spec.options, (k) => String(k), up);
      ans = { sync: (m) => bt.set(answered(m)), locate: (t) => (t.option !== undefined ? bt.locate(t.option) : null) };
    }
    return {
      sync: (m) => { ans.sync(m); lbx.refresh(); },
      locate(t) {
        if (t.pane) return env.util.center(list);
        if (t.thumb) return lbx.locateThumb();
        if (t.scroll !== undefined) return lbx.locateThumbFor(t.scroll);
        return ans.locate(t) || fail(t);
      },
    };
  }
  env.template('read-figure/_base-widgets', () => ({ buildGrid, buildAddition, buildAscending, buildCheckboxes, buildScrollCount }));
})();
