/* pan-map/_explorer-view: explorer setup, label layers and gestures; parts remain overridable on city. */
(function () {
  'use strict';
  const F = () => env.taskDef.helpers;

  function explorerLayer(S, ctx, E, pinShape) {
    const { spec } = ctx, fam = F();
    const { layer, wd, roads, casings, streets, minorNames } = E;
    let builtZ = null;
    let pins = {};

    function buildLayer(z) {
      layer.replaceChildren();
      pins = {};
      const s = fam.scaleOf(z);
      const lbl = (cls, text, x, y, rot) => {
        const e = S.P.label(ctx, layer, cls, text, x, y, rot, s);
        return e;
      };
      if (z <= 4) for (const d of wd.districts) lbl('mp-district', d.name, d.x, d.y);
      if (z >= 2) {
        for (const p of wd.parks) {
          const cx = p.pts.reduce((a, q) => a + q[0], 0) / p.pts.length;
          const cy = p.pts.reduce((a, q) => a + q[1], 0) / p.pts.length;
          lbl('mp-parkname', p.name, cx, cy + 18 / s);
        }
      }
      if (z >= 3) {
        const gap = 640 / s;
        for (const r of wd.roads) {
          let acc = gap / 2;
          for (let i = 1; i < r.pts.length; i++) {
            const [a, b] = [r.pts[i - 1], r.pts[i]];
            const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
            while (acc < L) {
              const t = acc / L;
              let ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
              if (ang > 90) ang -= 180;
              if (ang <= -90) ang += 180;
              lbl('mp-roadname', r.name, a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, Math.round(ang));
              acc += gap;
            }
            acc -= L;
          }
        }
      }
      if (z >= 3) wd.streets.forEach(([x1, y1, x2, y2], i) => {
        if (i % 9 === 0) lbl('mp-roadname mpp-minor', minorNames[i % minorNames.length], (x1 + x2) / 2, (y1 + y2) / 2, x1 === x2 ? -90 : 0);
      });
      // Pins last (above labels), big places last so they paint on top.
      const vis = spec.places.filter((p) => fam.visible(spec, p, z)).sort((a, b) => b.tier - a.tier);
      for (const p of vis) {
        const { pin, dot } = S.P.explorerPin(ctx, layer, p, s, pinShape);
        pins[p.id] = { pin, dot };
      }
      // Stroke widths per zoom (non-scaling strokes).
      const roadW = S.D.roadWidths[z];
      roads.forEach((e) => e.setAttribute('stroke-width', roadW));
      casings.forEach((e) => e.setAttribute('stroke-width', roadW + 2));
      streets.setAttribute('stroke-width', S.D.streetWidths[z]);
      streets.style.opacity = z <= 1 ? 0 : 1;
      builtZ = z;
    }
    return { buildLayer, get pins() { return pins; }, get builtZ() { return builtZ; } };
  }

  function explorerZoom(ctx, E, paint) {
    const { spec } = ctx, fam = F();
    const { port, zin, zout, ticks, close } = E;
    const zoomTo = (z, atPx) => {
      const m = fam.zoomAt(ctx.model, spec, z, atPx);
      if (m === ctx.model) return;
      ctx.log('zoom', { z: m.z });
      ctx.update(m);
      paint(m);
    };
    zin.addEventListener('click', () => zoomTo(ctx.model.z + 1));
    zout.addEventListener('click', () => zoomTo(ctx.model.z - 1));
    ticks.forEach((t) => t.addEventListener('click', () => zoomTo(Number(t.dataset.z))));
    close.addEventListener('click', () => {
      ctx.update({ ...ctx.model, sel: null });
      paint(ctx.model);
    });
    port.addEventListener('wheel', (e) => {
      if (!spec.wheel) return;
      e.preventDefault();
      const k = fam.wheelSteps(e.deltaY);
      if (!k) return;
      const r = port.getBoundingClientRect();
      zoomTo(ctx.model.z + k, [e.clientX - r.left, e.clientY - r.top]);
    }, { passive: false });
  }

  function renderExplorer(S, ctx) {
    const { util, rng, spec } = ctx;
    const fam = F();
    const chrome = S.P.shell(ctx, false);
    S.els.chrome = chrome;
    const search = S.P.explorerSearch(ctx, chrome);
    chrome.finishTop();
    S.P.explorerHeading(ctx, chrome.panel);
    const filters = util.el('div', 'mpp-controls', chrome.panel);
    let category = 'All places';
    const list = util.el('div', 'mpe-list', chrome.panel);
    const rowMap = {};
    function directory() {
      list.replaceChildren();
      const query = search.value.trim().toLowerCase();
      const matches = spec.places.filter((p) => (p.name + ' ' + p.district + ' ' + S.P.placeMeta(ctx, p).address).toLowerCase().includes(query)
        && (category === 'All places' || (category === 'Food' ? /cafe|market|bakery|grocer/.test(p.kind) : /station|museum|library|university/.test(p.kind))));
      for (const p of matches) {
        const { row, button: b } = S.P.explorerRow(ctx, list, p); rowMap[p.id] = row;
        b.addEventListener('click', () => {
          const m = { ...ctx.model, c: [p.x, p.y], z: Math.max(ctx.model.z, p.minZoom), sel: p.id };
          ctx.update(m); paint(ctx.model);
        });
      }
      S.P.directoryEnd(ctx, list, matches.length);
    }
    const chips = [['All places', S.D.categories.all], ['Food', S.D.categories.food], ['Landmarks', S.D.categories.landmarks]].map(([key, label]) => {
      const b = S.P.filter(ctx, filters, label, key === category);
      b.addEventListener('click', () => { category = key; chips.forEach((el) => el.classList.toggle('active', el === b)); directory(); }); return b;
    });
    search.addEventListener('input', directory); directory();
    const { card, head, port, W, H } = S.P.explorerFrame(ctx, chrome);

    S.P.ambiguity(ctx, port);

    // World layer (map units, scaled by the group transform).
    const { world, wd, streets, casings, roads, minorNames } = S.P.explorerWorld(ctx, port, W, H);
    // Label + pin layer (px at the current zoom; translated on pan, rebuilt on zoom).
    const layer = util.el('div', 'mp-layer', port);

    // Reticle (center scenario).
    const reticle = S.P.reticle(ctx, port, W, H);

    // Corners: zoom stack, card, scale bar.
    const { zc, ic, sc } = S.P.corners(ctx);
    const { zoomBox, zin, ticks, zout, level, scaleTxt, scaleBar, info, infoName, infoSub, infoRating, infoAddress, infoHours, close } = S.P.explorerControls(ctx, port, { zc, ic, sc });

    const pinShape = rng.bool(0.35) ? 'sq' : '';
    const layerState = explorerLayer(S, ctx, { layer, wd, roads, casings, streets, minorNames }, pinShape);
    const { buildLayer } = layerState;

    const elements = {
      W, H, world, layer, ticks, zin, zout, level, reticle, scaleBar, scaleTxt, chrome, rowMap,
      info, infoName, infoSub, infoRating, infoAddress, infoHours, buildLayer,
      get pins() { return layerState.pins; },
      get builtZ() { return layerState.builtZ; },
    };
    function paint(m) { S.P.explorerPaint(ctx, elements, m); }

    // Pan / select.
    let drag = null;
    port.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || e.target.closest('.mp-ui')) return;
      e.preventDefault();
      port.setPointerCapture(e.pointerId);
      const pin = e.target.closest('.mp-pin');
      drag = { x0: e.clientX, y0: e.clientY, m0: ctx.model, pin: pin ? pin.dataset.id : null, moved: false };
    });
    port.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const d = [e.clientX - drag.x0, e.clientY - drag.y0];
      if (!drag.moved && Math.hypot(d[0], d[1]) < 4) return;
      if (!drag.moved) {
        drag.moved = true;
        port.classList.add('dragging');
        ctx.log('grab', { what: 'map' });
      }
      const m = fam.panPx({ ...drag.m0, sel: ctx.model.sel }, spec, d);
      ctx.update(m);
      paint(m);
    });
    const end = () => {
      if (!drag) return;
      const g = drag;
      drag = null;
      port.classList.remove('dragging');
      if (g.moved) {
        ctx.log('release', { what: 'map' });
        return;
      }
      const m = g.pin ? fam.select(ctx.model, spec, g.pin) : { ...ctx.model, sel: null };
      if (g.pin) ctx.log('select', { place: g.pin });
      if (m !== ctx.model && (m.sel !== ctx.model.sel)) {
        ctx.update(m);
        paint(m);
      }
    };
    port.addEventListener('pointerup', end);
    port.addEventListener('pointercancel', end);
    for (const el of [zoomBox, info]) el.addEventListener('pointerdown', (e) => e.stopPropagation());

    explorerZoom(ctx, { port, zin, zout, ticks, close }, paint);

    Object.assign(S.els, { port, head, layer, world, zoomBox, info, search, list, rowMap });
    S.P.mapDecorated(ctx, port, false);

    // Mirror the viewport size (unscored) so the logic can plan pans and clicks.
    const pw = port.clientWidth;
    const ph = port.clientHeight;
    const m0 = ctx.model;
    if (!m0.port || m0.port[0] !== pw || m0.port[1] !== ph) ctx.update({ ...m0, port: [pw, ph] });
    paint(ctx.model);

    const portCenter = () => {
      const r = port.getBoundingClientRect();
      return [r.left + port.clientLeft + pw / 2, r.top + port.clientTop + ph / 2];
    };
    S.view = {
      anchors: [port, zoomBox, head],
      sync: (m) => paint(m),
      locate(t) {
        if (t.marker !== undefined) {
          const p = layerState.pins[t.marker];
          return p ? util.center(p.dot) : null;
        }
        if (t.zoom) return util.center(t.zoom === 'in' ? zin : zout);
        if (t.map) return portCenter();
        if (t.close) return util.center(close);
        if (t.grab || t.release) {
          const D = fam.dragPx(ctx.model, spec, t.grab || t.release);
          const c = portCenter();
          const k = t.grab ? -0.5 : 0.5;
          return [c[0] + k * D[0], c[1] + k * D[1]];
        }
        return null;
      },
    };
    return S.view;
  }

  env.template('pan-map/_explorer-view', () => ({ renderExplorer }));
})();
