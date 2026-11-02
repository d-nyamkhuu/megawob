/* pan-map/_explorer-parts: city explorer parts parts; installed per page, preserving the city design API. */
(function () {
  'use strict';
  const F = () => env.taskDef.helpers;
  const sv = (tag, attrs, parent) => env.util.svg(tag, attrs, parent);
  const pathOf = (pts) => pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join('');

  function installMap(BASE, S) {
    BASE.explorerSearch = (ctx, chrome) => {
      const { util } = ctx;
      const sb = util.el('div', 'mpp-search', chrome.top); S.P.icon(sb, 'search', 15);
      const search = util.el('input', '', sb); search.placeholder = S.D.explorerSearch; search.setAttribute('aria-label', S.D.explorerSearch);

      return search;
    };

    BASE.explorerHeading = (ctx, panel) => {
      const { util, spec } = ctx;
      const section = util.el('div', 'mpe-section', panel);
      util.el('div', 'mpe-kicker', section, 'Explore / Local map');
      util.el('div', 'mpe-heading', section, spec.scenario === 'center' ? 'Map view' : 'Places');
      util.el('div', 'mpp-meta', section, `${spec.places.length} places / Local survey collection`);

      return section;
    };

    BASE.explorerRow = (ctx, list, p) => {
      const { util } = ctx;
      const row = util.el('div', 'mpe-item', list);
      const symbol = util.el('div', 'mpe-badge', row); S.P.icon(symbol, S.P.kindIcon(p), 13);
      const b = util.el('button', '', row), meta = S.P.placeMeta(ctx, p);
      util.el('span', 'mpe-name', b, p.name); util.el('span', 'mpe-address', b, p.label || 'Venue');
      util.el('span', 'mpe-address', b, meta.address);
      const rating = util.el('div', 'mpp-meta', b); S.P.icon(rating, 'star', 10); rating.append(document.createTextNode(` ${meta.rating} (${meta.reviews}) / `)); util.el('span', 'mpp-open', rating, meta.hours);

      S.P.rowDecorated(ctx, row, p);
      return { row, button: b };
    };

    BASE.directoryEnd = (ctx, list, count) => {
      const { util } = ctx;
      if (!count) { const e = util.el('div', 'mpp-inspector', list); S.P.icon(e, 'search', 24); util.el('p', '', e, 'No places found'); util.el('small', 'mpp-meta', e, 'Try another name or street address in this offline map.'); }
      else util.el('div', 'mpp-note', list, 'End of local results / Map data stored on this device');
    };

    BASE.filter = (ctx, parent, label, active) => {
      const b = ctx.util.el('button', '', parent, label);
      b.classList.toggle('active', active);
      return b;
    };

    BASE.explorerFrame = (ctx, chrome) => {
      const { util, spec } = ctx;
      const card = util.el('div', 'mp-card mpp-main', chrome.work);
      const head = util.el('div', 'mp-head', card);
      util.el('div', 'mp-title', head, spec.scenario === 'center' ? 'View centre / Local survey grid' : 'Explore the area');
      util.el('div', 'mp-spacer', head);
      const toggle = util.el('div', 'mp-toggle', head);
      const layers = [util.el('button', 'on', toggle, 'Map'), util.el('button', '', toggle, 'Transit')];
      const { W, H } = S.P.explorerFit(ctx, card);
      const port = util.el('div', 'mp-port', card);
      Object.assign(port.style, { width: W + 'px', height: H + 'px' });
      layers.forEach((b, i) => b.addEventListener('click', () => {
        layers.forEach((x, j) => x.classList.toggle('on', i === j));
        port.classList.toggle('transit', i === 1);
        ctx.log('layer', { layer: b.textContent });
      }));

      return { card, head, port, W, H };
    };

    BASE.explorerFit = (ctx, card) => {
      const W = Math.max(S.D.minMapWidth, Math.min(S.D.maxMapWidth, card.clientWidth));
      const H = Math.max(S.D.minMapHeight, card.clientHeight - S.D.mapHeaderHeight);

      return { W, H };
    };

    BASE.ambiguity = (ctx, port) => {
      const { util, spec } = ctx;
      if (spec.judge && spec.judge.mode === 'ambiguous') {
        const note = util.el('div', 'mp-ui mp-info', port); note.style.cssText = 'left:10px;top:10px;z-index:3';
        util.el('div', 'mp-info-name', note, 'Map directory');
        spec.places.filter((p) => p.name === spec.judge.name).forEach((p) => util.el('div', 'mp-info-sub', note, `${p.name} · ${p.address}`));
      }
    };

    BASE.explorerWorld = (ctx, port, W, H) => {
      const { rng, spec } = ctx, fam = F();
      const svg = sv('svg', { class: 'mp-svg', width: W, height: H }, port);
      const world = sv('g', {}, svg);
      const wd = spec.world;
      if (wd.sea) sv('path', { class: 'mp-sea', d: pathOf(wd.sea) + 'Z' }, world);
      if (wd.lake) sv('path', { class: 'mp-lake', d: pathOf(wd.lake) + 'Z' }, world);
      for (const p of wd.parks) sv('path', { class: 'mp-park', d: pathOf(p.pts) + 'Z' }, world);
      const streets = sv('path', { class: 'mp-streets', 'vector-effect': 'non-scaling-stroke',
        d: wd.streets.map(([a, b, c, d]) => `M${a} ${b}L${c} ${d}`).join('') }, world);
      if (wd.river) sv('path', { class: 'mp-river', d: pathOf(wd.river.pts), 'stroke-width': wd.river.w }, world);
      const casings = wd.roads.map((r) => sv('path', { class: 'mp-casing', d: pathOf(r.pts), 'vector-effect': 'non-scaling-stroke' }, world));
      const roads = wd.roads.map((r) => sv('path', { class: 'mp-road', d: pathOf(r.pts), 'vector-effect': 'non-scaling-stroke' }, world));

      const minorNames = env.content.sample(rng.fork('minor-street-names'), env.content.STREET_NAMES, 20, { csplit: spec.csplit });
      const buildings = sv('g', { 'pointer-events': 'none' }, world);
      const gr = rng.fork('building-footprints');
      for (const p of spec.places) for (let i = 0; i < 8; i++) {
        const x = p.x + gr.float(-160, 160), y = p.y + gr.float(-140, 140);
        if (wd.sea && fam.inPoly([x, y], wd.sea) || wd.lake && fam.inPoly([x, y], wd.lake)) continue;
        S.P.building(ctx, buildings, { class: 'mpp-building', x, y, width: gr.int(10, 30), height: gr.int(12, 35), rx: 2 });
      }
      // Small building groups along the existing road grid fill the otherwise empty city blocks.
      const grid = wd.grid;
      if (grid) for (let x = grid.ox; x < wd.W; x += grid.g) for (let y = grid.oy; y < wd.H; y += grid.g) {
        if (wd.sea && fam.inPoly([x, y], wd.sea) || wd.lake && fam.inPoly([x, y], wd.lake)
          || wd.parks.some((p) => fam.inPoly([x, y], p.pts))) continue;
        if (wd.river && wd.river.pts.some((p) => Math.hypot(p[0] - x, p[1] - y) < wd.river.w + 80)) continue;
        for (let i = 0; i < 6; i++) S.P.building(ctx, buildings, { class: 'mpp-building', x: x + 12 + (i % 3) * 25, y: y + 12 + Math.floor(i / 3) * 45, width: gr.int(12, 21), height: gr.int(20, 38), rx: 1 });
      }
      world.insertBefore(buildings, streets); // Road casings remain visible over building footprints.

      return { world, wd, streets, casings, roads, minorNames };
    };

    BASE.reticle = (ctx, port, W, H) => {
      const { util, spec } = ctx;
      let reticle = null;
      if (spec.scenario === 'center') {
        reticle = util.el('div', 'mp-reticle', port);
        const c1 = util.el('div', 'mp-cross', port);
        const c2 = util.el('div', 'mp-cross', port);
        Object.assign(c1.style, { left: W / 2 - 7 + 'px', top: H / 2 - 1 + 'px', width: '14px', height: '2px' });
        Object.assign(c2.style, { left: W / 2 - 1 + 'px', top: H / 2 - 7 + 'px', width: '2px', height: '14px' });
      }

      return reticle;
    };
  }

  function installControls(BASE, S) {
    BASE.corners = (ctx) => {
      const { rng } = ctx;
      const zc = rng.pick(['tr', 'tr', 'br', 'tl']);
      const ic = zc === 'tl' ? 'bl' : rng.pick(['bl', 'tl']);
      const free = ['br', 'bl', 'tr', 'tl'].filter((c) => c !== zc && c !== ic && c[0] === 'b');
      const sc = free[0] || 'tr';

      return { zc, ic, sc };
    };

    BASE.explorerControls = (ctx, port, corners) => {
      const { util, rng, spec } = ctx, { zc, ic, sc } = corners;
      const at = (el, corner, m = 10) => {
        el.style[corner[0] === 't' ? 'top' : 'bottom'] = m + 'px';
        el.style[corner[1] === 'l' ? 'left' : 'right'] = m + 'px';
      };
      const zoomBox = util.el('div', 'mp-ui mp-zoom', port);
      at(zoomBox, zc);
      const zin = util.el('button', 'mp-zbtn', zoomBox); S.P.icon(zin, 'plus');
      zin.title = 'Zoom in';
      const ticks = [];
      for (let z = spec.zmax; z >= spec.zmin; z--) {
        const t = util.el('div', 'mp-tick', zoomBox);
        t.dataset.z = z;
        t.title = `Level ${z}`;
        ticks.push(t);
      }
      const zout = util.el('button', 'mp-zbtn', zoomBox); S.P.icon(zout, 'minus');
      zout.title = 'Zoom out';
      const level = util.el('div', 'mp-level', zoomBox);
      const scaleBox = util.el('div', 'mp-ui mp-scale', port);
      at(scaleBox, sc);
      const scaleTxt = util.el('div', '', scaleBox);
      const scaleBar = util.el('div', 'mp-scalebar', scaleBox);
      const attr = util.el('div', 'mp-ui mp-attr', port, rng.pick(S.D.attributions));
      at(attr, sc, 4);
      attr.style[sc[0] === 'b' ? 'bottom' : 'top'] = '40px';
      const info = util.el('div', 'mp-ui mp-info', port);
      at(info, ic);
      info.hidden = true;
      const infoName = util.el('div', 'mp-info-name', info);
      const infoSub = util.el('div', 'mp-info-sub', info);
      const infoRating = util.el('div', 'mp-info-sub', info);
      const infoAddress = util.el('div', 'mp-info-sub', info);
      const infoHours = util.el('div', 'mpp-open mp-info-sub', info);
      const infoRow = util.el('div', 'mp-info-row', info);
      util.el('button', '', infoRow, 'Directions');
      util.el('button', '', infoRow, rng.pick(S.D.infoActions));
      const close = util.el('button', 'mp-close', info); S.P.icon(close, 'close');
      close.title = 'Close';

      return { zoomBox, zin, ticks, zout, level, scaleTxt, scaleBar, info, infoName, infoSub, infoRating, infoAddress, infoHours, close };
    };

    BASE.label = (ctx, layer, cls, text, x, y, rot, scale) => {
      const { util } = ctx;
      const e = util.el('div', `mp-lbl ${cls}`, layer, text);
      e.style.left = x * scale + 'px';
      e.style.top = y * scale + 'px';
      if (rot) e.style.transform = `translate(-50%, -50%) rotate(${rot}deg)`;

      return e;
    };

    BASE.explorerPin = (ctx, layer, p, scale, shape) => {
      const { util } = ctx;
      const pin = util.el('div', `mp-pin t${p.tier} ${shape}`, layer);
      pin.dataset.id = p.id;
      pin.style.left = p.x * scale + 'px';
      pin.style.top = p.y * scale + 'px';
      pin.style.setProperty('--c', p.kind === 'venue' ? S.D.venueColor : S.D.tierColors[p.tier]);
      const dot = util.el('div', 'mp-dot', pin); S.P.icon(dot, S.P.kindIcon(p), 12);
      util.el('div', 'mp-name', pin, p.name);

      return { pin, dot };
    };
  }

  env.template('pan-map/_explorer-parts', () => ({
    install(BASE, S) {
      installMap(BASE, S);
      installControls(BASE, S);
    },
  }));
})();
