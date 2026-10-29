/* read-figure/_base-choices: shared template implementation; design parts stay on the calling template. */
(function () {
  'use strict';
  function buildColor(unitScope, ctx, body, up, B) {
    const { answered, answerer, env, fail } = unitScope;
    const { spec, util, rng } = ctx;
    const n = spec.colors.length;
    const row = util.el('div', 'up-row', body);
    const sampleW = spec.mode === 'sample' ? 130 : 0;
    if (spec.mode === 'sample') {
      const box = util.el('div', 'up-sample', row);
      util.el('span', 'up-label', box, 'Sample');
      const sw = util.el('div', '', box);
      sw.style.cssText = `width:72px;height:72px;border-radius:10px;background:${spec.hex[spec.target]}`;
    }
    const cols = n <= 4 ? n : rng.pick([n <= 8 ? n : Math.ceil(n / 2), Math.ceil(n / 2), Math.ceil(n / 3)]);
    const rows = Math.ceil(n / cols);
    const gap = rng.int(12, 22);
    const S = Math.floor(Math.min(rng.int(60, 92), (B.w - sampleW - gap * (cols - 1)) / cols, (B.h - gap * (rows - 1)) / rows));
    const radius = rng.pick(['4px', '10px', '50%', '16px']);
    const grid = util.el('div', 'up-swatches', row);
    grid.style.gridTemplateColumns = `repeat(${cols}, ${S}px)`;
    grid.style.gap = `${gap}px`;
    const els = spec.hex.map((hex) => {
      const d = util.el('div', 'up-sw', grid);
      d.style.cssText = `width:${S}px;height:${S}px;border-radius:${radius};background:${hex}`;
      d.dataset.role = 'swatch';
      return d;
    });
    const bt = env.ui.buttons(els, { label: 'swatch', history: answered(ctx.model), onClick: answerer(ctx, up) });
    return { sync: (m) => bt.set(answered(m)), locate: (t) => (t.swatch !== undefined ? bt.locate(t.swatch) : fail(t)) };
  }

  function buildShades(unitScope, ctx, body, up, B) {
    const { CHECK, env, fail } = unitScope;
    const { spec, util, rng } = ctx;
    const n = spec.tiles.length;
    const cols = spec.cols;
    const rows = Math.ceil(n / cols);
    const gap = rng.int(8, 14);
    const hintH = spec.select === 'modifier' ? 30 : 0;
    const T = Math.floor(Math.min(rng.int(54, 78), (B.w - gap * (cols - 1)) / cols, (B.h - hintH - gap * (rows - 1)) / rows));
    const grid = util.el('div', 'up-tiles', body);
    grid.style.gridTemplateColumns = `repeat(${cols}, ${T}px)`;
    grid.style.gap = `${gap}px`;
    const tiles = spec.tiles.map((t, i) => {
      const d = util.el('div', 'up-tile', grid);
      d.style.cssText = `width:${T}px;height:${T}px;background:hsl(${t.h}, ${t.s}%, ${t.l}%)`;
      d.dataset.role = 'tile';
      d.setAttribute('role', 'checkbox');
      util.el('span', 'ck', d).innerHTML = CHECK;
      d.addEventListener('click', (e) => {
        const sel = ctx.model.selected;
        const mod = e.ctrlKey || e.metaKey || e.shiftKey;
        let next;
        if (spec.select === 'modifier' && !mod) next = [i];
        else next = sel.includes(i) ? sel.filter((x) => x !== i) : sel.concat([i]).sort((a, b) => a - b);
        ctx.log('select', { what: 'tile', value: i, mod });
        up({ selected: next });
      });
      return d;
    });
    if (spec.select === 'modifier') util.el('div', 'up-hint', body, rng.pick(['Click a tile to select it. Ctrl+click to select more than one.', 'Hold Ctrl (or Shift) while clicking to add tiles to the selection.']));
    const sync = (m) => tiles.forEach((d, i) => d.setAttribute('aria-checked', String(m.selected.includes(i))));
    return { sync, locate: (t) => (t.tile !== undefined ? env.util.center(tiles[t.tile]) : fail(t)) };
  }

  function boardCell(unitScope, spec, B, max, reserve = 0) {
    const big = spec.tiny ? Math.min(max, 56) : max;
    return Math.floor(Math.min(big, (B.w - 2) / spec.cols, (B.h - reserve - 2) / spec.rows));
  }

  function buildItemsBoard(unitScope, ctx, body, up, B, max) {
    const { answered, answerer, boardCell, drawBoard, env, fail } = unitScope;
    const { spec } = ctx;
    const items = drawBoard(ctx, body, spec, boardCell(spec, B, max), true);
    const bt = env.ui.buttons(items, { label: 'item', history: answered(ctx.model), onClick: answerer(ctx, up) });
    return {
      sync: (m) => bt.set(answered(m)),
      locate: (t) => {
        if (t.item === undefined) fail(t);
        const hit = items[t.item].querySelector('.hit');
        return env.util.center(hit);
      },
    };
  }

  function buildIdentify(unitScope, ctx, body, up, B) {
    const { answered, boardSvg, cap, drawFigure, fail, optionButtons, palette } = unitScope;
    const { spec, util, rng } = ctx;
    const W = Math.floor(Math.min(rng.int(380, 460), B.w));
    const H = Math.floor(Math.min(rng.int(220, 270), B.h - 70));
    const svg = boardSvg(util, body, W, H, spec);
    svg.dataset.role = 'frame';
    const f = spec.figure;
    const s = Math.min(W, H) * 0.56 * f.scale;
    const m = s / 2 + 14;
    drawFigure(util, svg, f.kind, f.text, m + f.x * (W - 2 * m), m + f.y * (H - 2 * m), s, palette(spec).colors[f.color]);
    const bt = optionButtons(ctx, body, spec.options, (k) => cap(k), up);
    return { sync: (m2) => bt.set(answered(m2)), locate: (t) => (t.option !== undefined ? bt.locate(t.option) : fail(t)) };
  }

  function buildCount(unitScope, ctx, body, up, B) {
    const { answerField, answered, boardSvg, drawBoard, fail, optionButtons, palette, polyPoints } = unitScope;
    const { spec, util, rng } = ctx;
    const reserve = 64;
    if (spec.mode === 'shapes') {
      const cell = Math.floor(Math.min(66, (B.w - 2) / spec.cols, (B.h - reserve - 2) / spec.rows));
      drawBoard(ctx, body, spec, cell, false);
    } else {
      const W = Math.floor(Math.min(rng.int(320, 420), B.w));
      const H = Math.floor(Math.min(rng.int(220, 260), B.h - reserve));
      const svg = boardSvg(util, body, W, H, spec);
      svg.dataset.role = 'frame';
      const pal = palette(spec);
      const col = pal.board ? pal.colors[spec.color] : { black: '#212529', blue: '#1c63d6', red: '#e03131', green: '#2f9e44', purple: '#7048e8' }[spec.color];
      const R = Math.min(W, H) * 0.4 * spec.scale;
      const tint = rng.bool(0.4);
      util.svg('polygon', {
        points: polyPoints(spec.sides, W / 2, H / 2, R, spec.rot), fill: tint ? `${col}22` : 'none',
        stroke: col, 'stroke-width': rng.pick([3, 3.5, 4]), 'stroke-linejoin': rng.pick(['miter', 'round']), class: 'up-fig',
      }, svg);
    }
    if (spec.answer === 'typed') {
      const tf = answerField(ctx, body, up, '');
      return { sync: (m) => tf.set(m.text), locate: (t) => (t.field ? tf.locate() : fail(t)) };
    }
    const bt = optionButtons(ctx, body, spec.options, (k) => String(k), up);
    return { sync: (m) => bt.set(answered(m)), locate: (t) => (t.option !== undefined ? bt.locate(t.option) : fail(t)) };
  }

  function buildGreatest(unitScope, ctx, body, up, B) {
    const { env, fail } = unitScope;
    const { spec, util, rng } = ctx;
    const n = spec.values.length;
    const gap = rng.int(12, 24);
    const W = Math.floor(Math.min(rng.int(84, 106), (B.w - gap * (n - 1)) / n, (B.h - 40) / 1.42));
    const H = Math.round(W * 1.42);
    const row = util.el('div', 'up-cards', body);
    row.style.gap = `${gap}px`;
    const cards = spec.values.map((v) => {
      const c = util.el('div', 'up-card', row);
      c.style.cssText = `width:${W}px;height:${H}px;font-size:${Math.round(W * (String(v).length > 2 ? 0.32 : 0.42))}px`;
      c.dataset.role = 'card';
      util.el('span', 'corner', c, String(v));
      util.el('span', 'val', c, String(v));
      util.el('span', 'corner br', c, String(v));
      return c;
    });
    if (spec.mode === 'cards') util.el('div', 'up-hint', body, 'Click a card to turn it over. Only one card is face up at a time.');
    function sync(m) {
      cards.forEach((c, i) => {
        c.classList.toggle('down', spec.mode === 'cards' && m.up !== i);
        c.classList.toggle('sel', m.up === i);
      });
    }
    env.ui.buttons(cards, {
      label: 'card',
      onClick: (k) => {
        const m = ctx.model;
        if (m.up === k) return;
        up({ up: k, seen: m.seen.includes(k) ? m.seen : m.seen.concat([k]) });
      },
    });
    return { sync, locate: (t) => (t.card !== undefined ? env.util.center(cards[t.card]) : fail(t)) };
  }
  env.template('read-figure/_base-choices', () => ({ buildColor, buildShades, boardCell, buildItemsBoard, buildIdentify, buildCount, buildGreatest }));
})();
