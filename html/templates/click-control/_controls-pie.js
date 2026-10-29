/* click-control/_controls-pie: pie parts of click-control/controls.
 * install(BASE, scopeRef) keeps each part replaceable through the parent's design.parts.
 */
(function () {
  'use strict';

  function pieSize(scopeRef, r) {
    return Math.max(scopeRef.D.pieMin, Math.min(scopeRef.D.pieMax, Math.floor(r.height * scopeRef.D.pieHMul) - scopeRef.D.pieHSub, Math.floor(r.width * scopeRef.D.pieWMul) - scopeRef.D.pieWSub));
  }

  function pieScale(scopeRef) { return 1; }

  function pieInner(scopeRef, S) { return scopeRef.D.innerFrac === null ? 40 : S * scopeRef.D.innerFrac; }

  function pieAreaMade(scopeRef) {}

  function pieDefs(scopeRef) {}

  function slicePath(scopeRef, { pt, a0, a1, outer, inner, w }) {
    const [x0, y0] = pt(a0, outer);
    const [x1, y1] = pt(a1, outer);
    const [x2, y2] = pt(a1 - scopeRef.D.gapInner, inner);
    const [x3, y3] = pt(a0 + scopeRef.D.gapInner, inner);
    const big = w > 180 ? 1 : 0;
    return `M${x0} ${y0}A${outer} ${outer} 0 ${big} 1 ${x1} ${y1}L${x2} ${y2}A${inner} ${inner} 0 ${big} 0 ${x3} ${y3}Z`;
  }

  function sliceDecor(scopeRef) {}

  function labelRadius(scopeRef, inner, outer) { return (inner + outer) / 2; }

  function labelPos(scopeRef, pt, start, i, w, inner, outer, S) { return pt(start + i * w, scopeRef.P.labelRadius(inner, outer, S)); }

  function sliceLabel(scopeRef) {}

  function slicesDone(scopeRef) {}

  function knobRadius(scopeRef, S, inner) { return scopeRef.D.knobR === null ? inner : scopeRef.D.knobR; }

  function plus(scopeRef, spread, c) { return scopeRef.ctxRef.util.svg('path', { d: `M${c - 9} ${c}h18M${c} ${c - 9}v18`, class: 'uc-spread-i' }, spread); }

  function plusOrigin(scopeRef, c) { return `${c}px ${c}px`; }

  function hubBefore(scopeRef) {}

  function hubAfter(scopeRef) {}

  function hub(scopeRef, ctx, spread, c, S, inner) {
    scopeRef.P.hubBefore(ctx, spread, c, S, inner);
    const knob = ctx.util.svg('circle', { cx: c, cy: c, r: scopeRef.P.knobRadius(S, inner), class: 'uc-spread' }, spread);
    const plus = scopeRef.P.plus(spread, c, S, inner);
    plus.style.transformOrigin = scopeRef.P.plusOrigin(c, S);
    scopeRef.P.hubAfter(ctx, spread, c, S, inner);
    return knob;
  }

  function pieShow(scopeRef, area) { return (el, open) => {
    el.style.display = open ? '' : 'none';
    if (open) area.setAttribute('data-open', 'true');
    else area.removeAttribute('data-open');
  }; }

  function pieBound(scopeRef) {}

  function buildPie(scopeRef, ctx, content, up) {
    const { spec, util, rng } = ctx;
    const r = content.getBoundingClientRect();
    const S = scopeRef.P.pieSize(r, ctx);
    const b = scopeRef.P.box(ctx, content);
    const area = util.el('div', 'uc-pie', b);
    const scale = scopeRef.P.pieScale(S, r);
    area.style.width = S * scale + 'px';
    area.style.height = S * scale + 'px';
    scopeRef.P.pieAreaMade(ctx, area, S);
    const svg = util.svg('svg', { width: S * scale, height: S * scale, viewBox: `0 0 ${S} ${S}` }, area);
    const c = S / 2;
    const inner = scopeRef.P.pieInner(S, c);
    const outer = c - scopeRef.D.outerInset;
    const n = spec.items.length;
    const w = 360 / n;
    const start = rng.pick([0, 0, 90, -90, w / 2]);
    scopeRef.P.pieDefs(ctx, svg, S);
    const g = util.svg('g', {}, svg);
    const pt = (a, rad) => [c + rad * Math.sin((a * Math.PI) / 180), c - rad * Math.cos((a * Math.PI) / 180)];
    const slices = spec.items.map((label, i) => {
      const a0 = start + (i - 0.5) * w + scopeRef.D.gapOuter;
      const a1 = start + (i + 0.5) * w - scopeRef.D.gapOuter;
      const d = scopeRef.P.slicePath({ pt, a0, a1, outer, inner, w, S, i });
      const p = util.svg('path', { d, class: 'uc-slice' }, g);
      scopeRef.P.sliceDecor(ctx, g, p, d, i);
      const [lx, ly] = scopeRef.P.labelPos(pt, start, i, w, inner, outer, S);
      const tx = util.svg('text', { x: lx, y: ly, class: 'uc-slabel' }, g);
      tx.textContent = label;
      scopeRef.P.sliceLabel(ctx, g, tx, p, label, i, lx, ly, S);
      return p;
    });
    scopeRef.P.slicesDone(ctx, g, slices, S);
    const spread = util.svg('g', {}, svg);
    const knob = scopeRef.P.hub(ctx, spread, c, S, inner);
    util.el('div', 'uc-hint', b, 'Tip: the button in the middle expands the menu.');
    const pie = env.ui.pieMenu(area, {
      items: spec.items,
      slices,
      panel: g,
      trigger: knob,
      inner: () => inner * scale,
      outer: () => outer * scale,
      start,
      show: scopeRef.P.pieShow(area),
      onChange: (open) => up({ open }),
      onSelect: (k) => up({ clicks: ctx.model.clicks.concat([k]) }),
    });
    pie.set(ctx.model.open);
    scopeRef.P.pieBound(ctx, content, up);
    return {
      sync(m) { pie.set(m.open); },
      locate(t) {
        if (t.pie) return pie.locateOpen();
        if (t.slice !== undefined) return pie.locate(t.slice);
        return null;
      },
      recover: 'toast',
    };
  }

  function install(BASE, scopeRef) {
    BASE.pieSize = (...args) => pieSize(scopeRef, ...args);
    BASE.pieScale = (...args) => pieScale(scopeRef, ...args);
    BASE.pieInner = (...args) => pieInner(scopeRef, ...args);
    BASE.pieAreaMade = (...args) => pieAreaMade(scopeRef, ...args);
    BASE.pieDefs = (...args) => pieDefs(scopeRef, ...args);
    BASE.slicePath = (...args) => slicePath(scopeRef, ...args);
    BASE.sliceDecor = (...args) => sliceDecor(scopeRef, ...args);
    BASE.labelRadius = (...args) => labelRadius(scopeRef, ...args);
    BASE.labelPos = (...args) => labelPos(scopeRef, ...args);
    BASE.sliceLabel = (...args) => sliceLabel(scopeRef, ...args);
    BASE.slicesDone = (...args) => slicesDone(scopeRef, ...args);
    BASE.knobRadius = (...args) => knobRadius(scopeRef, ...args);
    BASE.plus = (...args) => plus(scopeRef, ...args);
    BASE.plusOrigin = (...args) => plusOrigin(scopeRef, ...args);
    BASE.hubBefore = (...args) => hubBefore(scopeRef, ...args);
    BASE.hubAfter = (...args) => hubAfter(scopeRef, ...args);
    BASE.hub = (...args) => hub(scopeRef, ...args);
    BASE.pieShow = (...args) => pieShow(scopeRef, ...args);
    BASE.pieBound = (...args) => pieBound(scopeRef, ...args);
    BASE.buildPie = (...args) => buildPie(scopeRef, ...args);
  }

  env.template('click-control/_controls-pie', () => ({ install }));
})();
