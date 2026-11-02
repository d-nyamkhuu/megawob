/* act-in-time/_base-boards: shared template implementation; parts remain on the calling template. */
(function () {
  'use strict';
  function buildChase(unitScope, ctx, f, up) {
    const { env, boardSvg, NS, sideCard, sec1 } = unitScope;
    const { spec, util } = ctx;
    const fam = env.taskDef;
    const main = util.el('div', 'ut-main', f.body);
    const side = util.el('div', 'ut-side', f.body);
    const [W, H] = fam.helpers.boardDims(spec);
    const b = boardSvg(util, main, [W, H], 'chase');
    const grid = util.svg('g', { class: 'ut-grid' }, b.svg);
    for (let x = 0.1; x < W - 1e-6; x += 0.1) util.svg('line', { x1: x, y1: 0, x2: x, y2: H, 'stroke-width': 1, ...NS }, grid);
    for (let y = 0.1; y < H - 1e-6; y += 0.1) util.svg('line', { x1: 0, y1: y, x2: W, y2: y, 'stroke-width': 1, ...NS }, grid);
    const trail = util.svg('polyline', { class: 'ut-trail', 'stroke-width': 2, ...NS }, b.svg);
    const circle = util.svg('circle', { class: 'ut-circle', r: spec.r, 'stroke-width': 2.5, ...NS }, b.svg);
    const dot = util.svg('circle', { class: 'ut-dot', r: spec.r * 0.09 }, b.svg);

    const left = sideCard(util, side, 'Time left');
    const leftV = util.el('div', 'ut-v', left);
    const leftM = util.el('i', '', util.el('div', 'ut-meter', left));
    const ins = sideCard(util, side, 'Time inside');
    const insV = util.el('div', 'ut-v', ins);
    const insBar = util.el('div', 'ut-meter', ins);
    const insM = util.el('i', '', insBar);
    const goal = util.el('u', '', insBar);
    goal.style.left = `${(100 * spec.need) / spec.dur}%`;
    const st = sideCard(util, side, 'Pointer');
    const pill = util.el('div', 'ut-pill', st);
    pill.style.marginTop = '8px';
    util.el('div', 'ut-note', side, `Stay inside the circle for ${sec1(spec.need)} s of the ${sec1(spec.dur)} s round. The dashed line shows where it just came from.`);

    const hov = env.ui.hover(b.svg, {
      clock: ctx.clock,
      label: 'board',
      onMove: ({ x, y }) => {
        const p = b.toBoard([x, y]).map((v) => Math.round(v * 10000) / 10000);
        up({ p });
      },
      onLeave: () => up({ p: null }),
    });

    function sync(m) {
      const t = Math.min(m.t, spec.dur);
      const [cx, cy] = fam.helpers.chasePos(spec, t);
      circle.setAttribute('cx', cx);
      circle.setAttribute('cy', cy);
      dot.setAttribute('cx', cx);
      dot.setAttribute('cy', cy);
      const pts = [];
      for (let i = 18; i >= 0; i--) {
        const ti = t - (i / 18) * 3 * spec.beat;
        if (ti >= 0) pts.push(fam.helpers.chasePos(spec, ti).map((v) => v.toFixed(4)).join(','));
      }
      trail.setAttribute('points', pts.join(' '));
      const rest = Math.max(0, spec.dur - m.t);
      leftV.innerHTML = `${sec1(rest)} <small>s of ${sec1(spec.dur)} s</small>`;
      leftM.style.width = `${(100 * rest) / spec.dur}%`;
      insV.innerHTML = `${sec1(m.inside)} <small>s / ${sec1(spec.need)} s</small>`;
      insM.style.width = `${Math.min(100, (100 * m.inside) / spec.dur)}%`;
      const inside = m.p && Math.hypot(m.p[0] - cx, m.p[1] - cy) <= spec.r;
      pill.className = 'ut-pill ' + (m.p ? (inside ? 'on' : 'off') : '');
      pill.textContent = m.p ? (inside ? 'inside the circle' : 'outside the circle') : 'not on the board';
      f.setStatus(m.t >= spec.dur ? 'Round over' : `Round: <b>${sec1(spec.dur)} s</b>`);
    }
    return {
      sync,
      locate: (tg) => (tg.point ? b.fromBoard(tg.point) : null),
      detach: () => hov.detach(),
    };
}

  function buildMoving(unitScope, ctx, f, up) {
    const { env, boardSvg, NS, shapeEl, sideCard } = unitScope;
    const { spec, util } = ctx;
    const fam = env.taskDef;
    const main = util.el('div', 'ut-main', f.body);
    const side = util.el('div', 'ut-side', f.body);
    const b = boardSvg(util, main, fam.helpers.boardDims(spec), 'moving');
    const lh = 1 / spec.lanes.length;
    if (spec.orient === 'vertical') {
      // Upright board: the lanes are columns at ln.x, shapes run down (dir 1) or up (dir -1).
      spec.lanes.forEach((ln, i) => {
        util.svg('rect', { class: 'ut-lane' + (i % 2 ? ' alt' : ''), x: i * lh, y: 0, width: lh, height: spec.A }, b.svg);
        util.svg('line', { class: 'ut-lanemark', x1: ln.x, y1: 0, x2: ln.x, y2: spec.A, 'stroke-width': 1.5, ...NS }, b.svg);
        const s = 0.028;
        for (const y0 of [0.05, spec.A - 0.05]) {
          const d = ln.dir > 0 ? `M${ln.x - s} ${y0 - s / 2}L${ln.x} ${y0 + s / 2}L${ln.x + s} ${y0 - s / 2}` : `M${ln.x - s} ${y0 + s / 2}L${ln.x} ${y0 - s / 2}L${ln.x + s} ${y0 + s / 2}`;
          util.svg('path', { class: 'ut-chev', d, 'stroke-width': 2.5, ...NS }, b.svg);
        }
      });
    } else spec.lanes.forEach((ln, i) => {
      util.svg('rect', { class: 'ut-lane' + (i % 2 ? ' alt' : ''), x: 0, y: i * lh, width: spec.A, height: lh }, b.svg);
      util.svg('line', { class: 'ut-lanemark', x1: 0, y1: ln.y, x2: spec.A, y2: ln.y, 'stroke-width': 1.5, ...NS }, b.svg);
      // Chevrons pointing the way the lane moves, at both ends.
      const s = 0.028;
      for (const x0 of [0.05, spec.A - 0.05]) {
        const d = ln.dir > 0 ? `M${x0 - s / 2} ${ln.y - s}L${x0 + s / 2} ${ln.y}L${x0 - s / 2} ${ln.y + s}` : `M${x0 + s / 2} ${ln.y - s}L${x0 - s / 2} ${ln.y}L${x0 + s / 2} ${ln.y + s}`;
        util.svg('path', { class: 'ut-chev', d, 'stroke-width': 2.5, ...NS }, b.svg);
      }
    });
    const items = spec.items.map((it, i) => {
      const g = util.svg('g', {}, b.svg);
      g.dataset.key = String(i);
      g.dataset.role = 'item';
      shapeEl(util, g, it.shape, spec.r, spec.colors[it.color]);
      const tip = util.svg('title', {}, g);
      tip.textContent = `${it.color} ${it.shape}`;
      return g;
    });

    const tc = sideCard(util, side, 'Catch');
    const tv = util.el('div', 'ut-v', tc);
    tv.style.fontSize = '18px';
    tv.style.whiteSpace = 'nowrap';
    const sw = util.el('span', 'ut-swatch', tv);
    sw.style.background = spec.colors[spec.color];
    tv.append(`${spec.color} shapes`);
    // a judge episode names a color the board does not have: no card that contradicts it
    if (spec.judge) tc.style.display = 'none';
    const cc = sideCard(util, side, 'Caught');
    const cv = util.el('div', 'ut-v', cc);
    const tally = util.el('div', 'ut-tally', cc);
    const dots = [...Array(spec.nTargets)].map(() => util.el('i', '', tally));
    const mc = sideCard(util, side, 'Missed clicks');
    const mv = util.el('div', 'ut-v', mc);
    util.el('div', 'ut-note', side, 'Shapes slide along the lanes in the direction of the arrows. Other colors do not count; clicking one ends the round.');

    const brd = env.ui.board(b.svg, {
      toBoard: b.toBoard,
      fromBoard: b.fromBoard,
      label: 'board',
      onChange: (pt) => {
        const m = ctx.model;
        const i = fam.helpers.itemAt(spec, m.t, pt);
        if (i === null || m.hits.includes(i)) {
          env.log('miss', { point: pt });
          up({ misses: m.misses + 1 });
        } else {
          env.log('hit', { item: i, target: spec.items[i].target });
          up({ hits: m.hits.concat([i]) });
          items[i].style.display = 'none';
        }
      },
    });

    function sync(m) {
      items.forEach((g, i) => {
        const p = fam.helpers.itemPos(spec, i, m.t);
        if (!p || m.hits.includes(i)) {
          g.style.display = 'none';
          return;
        }
        g.style.display = '';
        g.setAttribute('transform', `translate(${p[0].toFixed(4)} ${p[1].toFixed(4)})`);
      });
      const got = m.hits.filter((i) => spec.items[i].target).length;
      cv.innerHTML = `${got} <small>of ${spec.nTargets}</small>`;
      dots.forEach((d, i) => {
        d.className = i < got ? 'got' : '';
        d.style.background = i < got ? spec.colors[spec.color] : '';
      });
      mv.textContent = String(m.misses);
      const onBoard = spec.items.filter((_, i) => !m.hits.includes(i) && fam.helpers.itemPos(spec, i, m.t)).length;
      f.setStatus(`On the board: <b>${onBoard}</b>`);
    }
    return {
      sync,
      locate: (tg) => {
        if (tg.item === undefined) return null;
        const p = fam.helpers.itemPos(spec, tg.item, ctx.model.t);
        return p ? brd.locate(p) : null;
      },
    };
}

  function buildDelay(unitScope, ctx, f, up) {
    const { env, clockText, spinner, ICON } = unitScope;
    const { spec, util, rng } = ctx;
    const fam = env.taskDef;
    const main = util.el('div', 'ut-main', f.body);
    const record = (k) => up({ clicks: ctx.model.clicks.concat([{ key: k, t: ctx.model.t }]) });

    if (spec.mode === 'interval') {
      const r = main.getBoundingClientRect();
      const W = Math.min(620, Math.floor(r.width));
      const H = Math.min(380, Math.floor(r.height));
      const surf = util.el('div', 'ut-surface', main);
      surf.style.width = W + 'px';
      surf.style.height = H + 'px';
      const pad = 20;
      const els = spec.buttons.map((bt) => {
        const el = util.el('button', 'ut-btn', surf, bt.label);
        el.type = 'button';
        el.dataset.key = bt.key;
        el.style.left = Math.round(pad + bt.x * (W - 92 - 2 * pad)) + 'px';
        el.style.top = Math.round(pad + bt.y * (H - 54 - 2 * pad)) + 'px';
        return el;
      });
      const early = () => ctx.model.t < (spec.ready || 0) - 1e-9;
      const btns = env.ui.buttons(els, { label: 'button', disabled: () => early(), onClick: (k) => record(k) });
      return {
        sync(m) {
          btns.set(m.clicks.map((c) => c.key));
          const c = m.clicks;
          const wait = early();
          for (const el of els) el.setAttribute('aria-disabled', wait ? 'true' : 'false');
          surf.style.opacity = wait ? '0.55' : '';
          f.setStatus(c.length > 1 ? `ONE at <b>${clockText(c[0].t)}</b> · TWO at <b>${clockText(c[1].t)}</b>` : c.length ? `ONE pressed at <b>${clockText(c[0].t)}</b>` : wait ? `Get ready… <b>${Math.ceil((spec.ready - m.t) / 1000)}</b>` : '<b>Go!</b>');
        },
        locate: (tg) => (tg.button ? btns.locate(tg.button) : null),
      };
    }

    const r = main.getBoundingClientRect();
    const card = util.el('div', 'ut-dl', main);
    card.style.left = Math.round(rng.float(0.1, 0.9) * Math.max(0, r.width - 440)) + 'px';
    card.style.top = Math.round(rng.float(0.1, 0.9) * Math.max(0, r.height - 230)) + 'px';
    util.el('h3', '', card, spec.context.title);
    util.el('p', '', card, spec.context.text);
    const state = util.el('div', 'ut-dlstate', card);
    const spin = spinner(util, state);
    const ok = util.el('span', '', state);
    ok.innerHTML = ICON.check;
    ok.style.display = 'none';
    const stTxt = util.el('span', '', state);
    const row = util.el('div', 'ut-row', card);
    row.style.justifyContent = rng.pick(['flex-start', 'flex-end', 'center']);
    const els = spec.buttons.map((bt) => {
      const el = util.el('button', 'ut-btn' + (bt.key === 'go' ? ' primary' : ''), row, bt.label);
      el.type = 'button';
      el.dataset.key = bt.key;
      return el;
    });
    const go = els[spec.buttons.findIndex((bt) => bt.key === 'go')];
    go.style.minWidth = '120px';
    const btns = env.ui.buttons(els, { label: 'button', onClick: (k) => record(k) });

    function sync(m) {
      const ready = fam.helpers.delayReady(spec, m.t);
      spin.svg.style.display = ready ? 'none' : '';
      ok.style.display = ready ? '' : 'none';
      spin.arc.setAttribute('transform', `rotate(${Math.round((m.t / spec.beat) * 135) % 360} 11 11)`);
      stTxt.textContent = ready ? 'Ready' : spec.mode === 'enable' ? 'Please wait…' : 'Loading…';
      go.setAttribute('aria-disabled', ready ? 'false' : 'true');
      go.classList.toggle('skeleton', spec.mode === 'appear' && !ready);
      btns.set(m.clicks.map((c) => c.key));
      f.setStatus(ready ? '<b>Ready</b>' : 'Working…');
    }
    return { sync, locate: (tg) => (tg.button ? btns.locate(tg.button) : null) };
}

  function buildSimon(unitScope, ctx, f, up) {
    const { env, sideCard } = unitScope;
    const { spec, util, rng } = ctx;
    const fam = env.taskDef;
    const main = util.el('div', 'ut-main', f.body);
    const side = util.el('div', 'ut-side', f.body);
    const mr = main.getBoundingClientRect();
    const S = Math.floor(Math.min(420, mr.height - 4, mr.width));
    const svg = util.svg('svg', { class: 'ut-simon', width: S, height: S, viewBox: '-1 -1 2 2' }, main);
    const n = spec.pads.length;
    const w = 360 / n;
    const start = rng.pick([0, w / 2]);
    const ri = 0.4;
    const ro = 0.97;
    const pt = (a, rad) => [rad * Math.sin((a * Math.PI) / 180), -rad * Math.cos((a * Math.PI) / 180)];
    const mids = [];
    const pads = spec.pads.map((p, i) => {
      const a0 = start + i * w - w / 2 + 2;
      const a1 = start + i * w + w / 2 - 2;
      const [x0, y0] = pt(a0, ro);
      const [x1, y1] = pt(a1, ro);
      const [x2, y2] = pt(a1, ri);
      const [x3, y3] = pt(a0, ri);
      const d = `M${x0} ${y0}A${ro} ${ro} 0 0 1 ${x1} ${y1}L${x2} ${y2}A${ri} ${ri} 0 0 0 ${x3} ${y3}Z`;
      const el = util.svg('path', { d, class: 'ut-pad', fill: p.hex }, svg);
      const tip = util.svg('title', {}, el);
      tip.textContent = p.color;
      mids.push(pt(start + i * w, (ri + ro) / 2));
      return el;
    });
    util.svg('circle', { class: 'ut-hub', r: ri - 0.05 }, svg);
    const hub1 = util.svg('text', { class: 'ut-hubt', y: -0.07, 'font-size': 0.13 }, svg);
    const hub2 = util.svg('text', { class: 'ut-hubt', y: 0.1, 'font-size': 0.11 }, svg);
    hub2.style.fontWeight = '600';

    const pc = sideCard(util, side, 'Phase');
    const pv = util.el('div', 'ut-v', pc);
    const sc = sideCard(util, side, 'Sequence');
    const steps = util.el('div', 'ut-steps', sc);
    const dots = spec.seq.map(() => util.el('i', '', steps));
    util.el('div', 'ut-note', side, `${spec.seq.length} flashes, one per second. Pads cannot be pressed while the pattern plays.`);

    const btns = env.ui.buttons(pads, {
      label: 'pad',
      disabled: () => fam.helpers.simonPhase(spec, ctx.model.t) === 'show',
      onClick: (k) => up({ presses: ctx.model.presses.concat([Number(k)]) }),
      mark: () => {},
    });

    function sync(m) {
      const phase = fam.helpers.simonPhase(spec, m.t);
      const lit = fam.helpers.simonLit(spec, m.t);
      svg.dataset.phase = phase;
      pads.forEach((el, i) => {
        if (i === lit) el.setAttribute('data-lit', 'true');
        else el.removeAttribute('data-lit');
      });
      if (phase === 'show') {
        const k = fam.helpers.simonShown(spec, m.t);
        hub1.textContent = 'WATCH';
        hub1.setAttribute('font-size', 0.13);
        hub2.textContent = `${k} / ${spec.seq.length}`;
        pv.textContent = 'Watch';
        dots.forEach((d, i) => { d.className = i < k ? 'on' : ''; });
        f.setStatus(`Showing flash <b>${k}</b> of ${spec.seq.length}`);
      } else {
        const k = m.presses.length;
        hub1.textContent = 'YOUR TURN';
        hub1.setAttribute('font-size', 0.09);
        hub2.textContent = `${k} / ${spec.seq.length}`;
        pv.textContent = 'Repeat';
        dots.forEach((d, i) => { d.className = i < k ? 'on' : ''; });
        f.setStatus(`Pressed <b>${k}</b> of ${spec.seq.length}`);
      }
      btns.set([]);
    }
    return {
      sync,
      locate(tg) {
        if (tg.pad === undefined) return null;
        const m = svg.getScreenCTM();
        const p = svg.createSVGPoint();
        [p.x, p.y] = mids[tg.pad];
        const q = p.matrixTransform(m);
        return [q.x, q.y];
      },
    };
}

  function buildStock(unitScope, ctx, f, up) {
    const { env, sideCard, clockText } = unitScope;
    const { spec, util } = ctx;
    const fam = env.taskDef;
    const main = util.el('div', 'ut-main', f.body);
    const side = util.el('div', 'ut-side', f.body);
    side.style.width = '230px';
    const mr = main.getBoundingClientRect();
    const CW = Math.floor(Math.min(mr.width, 700));
    const CH = Math.floor(Math.min(mr.height - 2, 420));
    const svg = util.svg('svg', { class: 'ut-chart', width: CW, height: CH, viewBox: `0 0 ${CW} ${CH}` }, main);
    const L = 58;
    const R = 18;
    const T = 16;
    const B = 30;
    const P0 = spec.prices[0];
    const yMin = Math.floor(P0 - 6);
    const yMax = Math.ceil(P0 + 4);
    const X = (k) => L + (k / (spec.T - 1)) * (CW - L - R);
    const Y = (p) => T + ((yMax - p) / (yMax - yMin)) * (CH - T - B);
    for (let v = yMin; v <= yMax; v += 2) {
      util.svg('line', { class: 'ut-ax', x1: L, x2: CW - R, y1: Y(v), y2: Y(v) }, svg);
      const tx = util.svg('text', { class: 'ut-axt', x: L - 8, y: Y(v) + 4, 'text-anchor': 'end' }, svg);
      tx.textContent = `$${v}`;
    }
    for (let k = 0; k < spec.T; k += spec.T > 13 ? 3 : 2) {
      const tx = util.svg('text', { class: 'ut-axt', x: X(k), y: CH - 10, 'text-anchor': 'middle' }, svg);
      tx.textContent = `${Math.round((k * spec.beat) / 1000)}s`;
    }
    const area = util.svg('path', { class: 'ut-area' }, svg);
    const line = util.svg('polyline', { class: 'ut-line' }, svg);
    const now = util.svg('line', { class: 'ut-now', y1: T, y2: CH - B }, svg);
    const dot = util.svg('circle', { class: 'ut-pt', r: 5 }, svg);
    const bdot = util.svg('circle', { class: 'ut-buypt', r: 6 }, svg);

    const qc = util.el('div', 'ut-card', side);
    const head = util.el('div', 'ut-k', qc, spec.company);
    util.el('span', 'ut-sym', head, spec.symbol);
    const price = util.el('div', 'ut-price', qc);
    const chg = util.el('div', 'ut-chg', qc);
    const buy = util.el('button', 'ut-btn primary ut-buy', side, 'Buy');
    buy.type = 'button';
    const cl = sideCard(util, side, 'Market closes in');
    const clv = util.el('div', 'ut-v', cl);
    const msg = util.el('div', 'ut-note', side);

    const btns = env.ui.buttons([buy], {
      keys: ['buy'],
      label: 'buy',
      disabled: () => !!ctx.model.bought,
      onClick: () => {
        const t = ctx.model.t;
        up({ bought: { k: fam.helpers.priceIndex(spec, t), price: fam.helpers.priceAt(spec, t) } });
        sync(ctx.model);
      },
      mark: () => {},
    });

    function sync(m) {
      const k = fam.helpers.priceIndex(spec, m.t);
      const pts = spec.prices.slice(0, k + 1).map((p, i) => [X(i), Y(p)]);
      line.setAttribute('points', pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' '));
      area.setAttribute('d', `M${X(0)} ${CH - B}` + pts.map(([x, y]) => `L${x.toFixed(1)} ${y.toFixed(1)}`).join('') + `L${X(k).toFixed(1)} ${CH - B}Z`);
      now.setAttribute('x1', X(k));
      now.setAttribute('x2', X(k));
      dot.setAttribute('cx', X(k));
      dot.setAttribute('cy', Y(spec.prices[k]));
      const p = spec.prices[k];
      price.textContent = fam.helpers.fmt$(p);
      if (k > 0) {
        const d = p - spec.prices[k - 1];
        chg.className = 'ut-chg ' + (d >= 0 ? 'up' : 'dn');
        chg.textContent = `${d >= 0 ? '▲' : '▼'} ${Math.abs(d).toFixed(2)} (${((100 * d) / spec.prices[k - 1]).toFixed(2)}%)`;
      } else {
        chg.className = 'ut-chg';
        chg.textContent = 'Market open';
      }
      const left = Math.max(0, spec.T * spec.beat - m.t);
      clv.textContent = clockText(left);
      if (m.bought) {
        buy.setAttribute('data-done', 'true');
        buy.textContent = 'Bought';
        msg.textContent = `You bought 1 share of ${spec.symbol} at ${fam.helpers.fmt$(m.bought.price)}.`;
        bdot.style.display = '';
        bdot.setAttribute('cx', X(m.bought.k));
        bdot.setAttribute('cy', Y(m.bought.price));
      } else {
        buy.removeAttribute('data-done');
        buy.textContent = 'Buy';
        msg.textContent = 'One click buys 1 share at the current price.';
        bdot.style.display = 'none';
      }
      f.setStatus(`${spec.symbol} <b>${fam.helpers.fmt$(p)}</b>`);
    }
    return { sync, locate: (tg) => (tg.buy ? btns.locate('buy') : null) };
}
  env.template('act-in-time/_base-boards', () => ({ buildChase, buildMoving, buildDelay, buildSimon, buildStock }));
})();
