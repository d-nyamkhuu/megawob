/* pan-map/_paint: city paint parts; installed per page, preserving the city design API. */
(function () {
  'use strict';
  const F = () => env.taskDef.helpers;
  const sv = (tag, attrs, parent) => env.util.svg(tag, attrs, parent);
  const pathOf = (pts) => pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join('');

  function installPaint(BASE, S) {
    BASE.explorerPaint = (ctx, E, m) => {
      const { spec } = ctx, fam = F();
      const { W, H, world, layer, ticks, zin, zout, level, reticle, scaleBar, scaleTxt, chrome, rowMap, info, infoName, infoSub, infoRating, infoAddress, infoHours, builtZ, buildLayer } = E;
      const z = m.z;
      if (z !== builtZ) buildLayer(z);
      const s = fam.scaleOf(z);
      const tx = W / 2 - m.c[0] * s;
      const ty = H / 2 - m.c[1] * s;
      world.setAttribute('transform', `translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${s})`);
      layer.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px)`;
      for (const [id, p] of Object.entries(E.pins)) p.pin.classList.toggle('sel', id === m.sel);
      ticks.forEach((t) => t.classList.toggle('on', Number(t.dataset.z) === z));
      zin.disabled = z >= spec.zmax;
      zout.disabled = z <= spec.zmin;
      level.textContent = `Level ${z}`;
      if (reticle) {
        const r = Math.max(4, spec.tau * s);
        Object.assign(reticle.style, { left: W / 2 - r + 'px', top: H / 2 - r + 'px', width: 2 * r + 'px', height: 2 * r + 'px' });
      }
      // Scale bar: a round number of metres (1 map unit = 2 m) about 80-120 px long.
      const mPerPx = 2 / s;
      const nice = [10, 20, 50, 100, 200, 250, 500, 1000, 2000, 5000];
      const metres = nice.find((n) => n / mPerPx >= 70) || 5000;
      scaleBar.style.width = Math.round(metres / mPerPx) + 'px';
      scaleTxt.textContent = metres >= 1000 ? `${metres / 1000} km` : `${metres} m`;
      chrome.position.textContent = `Centre ${m.c.map((x) => x.toFixed(0)).join(', ')} / Level ${m.z} / Local grid`;
      Object.entries(rowMap).forEach(([id, el]) => el.classList.toggle('selected', id === m.sel));
      const sel = m.sel && fam.placeById(spec, m.sel);
      info.hidden = !sel;
      if (sel) {
        infoName.textContent = sel.name;
        infoSub.textContent = [sel.label || 'Venue', sel.district].filter(Boolean).join(' / ');
        const meta = S.P.placeMeta(ctx, sel); infoRating.textContent = `${meta.rating} / ${meta.reviews} reviews`; infoAddress.textContent = meta.address; infoHours.textContent = meta.hours;
      }
    };

    BASE.editorPaint = (ctx, E, m) => {
      const { util, spec: s } = ctx, fam = F();
      const { W, H, world, pins, roadLabels, labels, handles, pin, path, vertices, level, zin, zout, edit, pan, close, stopLabels, inspectorStatus, travelMode, chrome, readout, saved, search, results, commit } = E;
      const sc = fam.scaleOf(m.z), tx = W / 2 - m.c[0] * sc, ty = H / 2 - m.c[1] * sc;
      world.setAttribute('transform', `translate(${tx} ${ty}) scale(${sc})`);
      pins.forEach((el, i) => { const p = s.places[i]; el.style.left = p.x * sc + 'px'; el.style.top = p.y * sc + 'px'; const name = el.querySelector('.mp-name'); name.style.width = Math.min(128, s.spacing[0] * sc - 10) + 'px'; name.style.display = m.z < 2 ? 'none' : 'block'; });
      roadLabels.forEach((el, i) => { el.style.left = (m.c[0] - (W / 2 - 65) / sc) * sc + 'px'; el.style.top = (s.world.roads[i].pts[0][1] - 13 / sc) * sc + 'px'; });
      labels.style.transform = `translate(${tx}px,${ty}px)`;
      handles.forEach((el, i) => { const p = fam.toPort(m, m.waypoints[i]); el.style.left = p[0] + 'px'; el.style.top = p[1] + 'px'; });
      pin.hidden = s.scenario !== 'pin' || !m.pin;
      // The display rule for editor handles is explicit: hidden must beat display:grid.
      pin.style.display = pin.hidden ? 'none' : 'grid';
      if (m.pin) { const p = fam.toPort(m, m.pin); pin.style.left = p[0] + 'px'; pin.style.top = p[1] + 'px'; }
      const pts = s.scenario === 'zone' ? m.vertices : s.scenario === 'route' ? fam.routeGeometry(m, s) : [];
      path.setAttribute('d', pts.length ? pathOf(pts.map((p) => fam.toPort(m, p))) + (m.closed ? 'Z' : '') : '');
      vertices.replaceChildren();
      if (s.scenario === 'zone') pts.forEach((p, i) => { const q = fam.toPort(m, p); S.P.vertex(ctx, vertices, q, i); });
      level.textContent = `Level ${m.z}`; zin.disabled = m.z >= s.zmax; zout.disabled = m.z <= s.zmin;
      edit.classList.toggle('active', m.tool === 'edit'); pan.classList.toggle('active', m.tool === 'pan');
      if (close) close.disabled = m.vertices.length < 3 || m.closed;
      stopLabels.forEach((row, i) => {
        const point = m.waypoints[i];
        const place = s.places.slice().sort((a, b) => Math.hypot(a.x - point[0], a.y - point[1]) - Math.hypot(b.x - point[0], b.y - point[1]))[0];
        row.name.textContent = place.name; row.address.textContent = place.address;
      });
      const st = fam.editorStats(m, s);
      inspectorStatus.textContent = s.scenario === 'pin' ? (m.pin ? 'Saved pin / ' + st.address : 'No saved pin yet. This collection is ready for a location.')
        : s.scenario === 'route' ? `${travelMode} / ${Math.max(1, Math.round(parseFloat(st.length) * (travelMode === 'Walking' ? 12 : travelMode === 'Cycling' ? 4 : 3)))} min estimated / ${m.waypoints.length} stops`
        : s.scenario === 'zone' ? `${m.closed ? 'Boundary saved' : 'Draft boundary'} / ${m.vertices.length} vertices / ${st.area}`
        : `Current view / Level ${m.z} / Bearing 0 degrees`;
      chrome.position.textContent = `${st.scale} / Centre ${m.c.map((v) => v.toFixed(0)).join(', ')} / Local grid`;
      const lines = s.scenario === 'pin' ? [['Street address', st.address], ['Nearest place', m.pin ? st.name : 'Not set'], ['Coordinates', m.pin ? st.coordinates : 'Not set']]
        : s.scenario === 'route' ? [['Route length', st.length], ['Stops', String(m.waypoints.length)]]
        : s.scenario === 'zone' ? [['Covered addresses', String(st.covered)], ['Area', st.area], ['Boundary', m.closed ? 'Closed' : 'Draft']]
        : [['Centre coordinates', st.coordinates], ['Map scale', st.scale]];
      S.P.readoutLines(ctx, readout, lines);
      saved.textContent = s.scenario === 'zone' ? (m.closed ? 'Boundary saved locally' : `${m.vertices.length} vertices · Draft boundary`) : 'Changes saved locally';
      if (search.value !== m.query) search.value = m.query;
      results.hidden = !m.searchOpen;
      const key = `${m.searchOpen}|${m.query}`;
      if (key !== E.resultKey) {
        E.resultKey = key; results.replaceChildren(); E.resultButtons = {};
        if (m.searchOpen) {
          const q = m.query.trim().toLowerCase();
          const found = s.places.filter((p) => (p.name + ' ' + p.address).toLowerCase().includes(q));
          if (!found.length) { const row = util.el('div', 'mpe-item', results); S.P.icon(row, 'search', 20); const text = util.el('div', '', row, 'No places found'); util.el('small', '', text, 'Try another name or street address in this offline map.'); }
          for (const p of found) {
            const b = S.P.suggestion(ctx, results, p); E.resultButtons[p.id] = b;
            b.addEventListener('click', () => commit({ ...ctx.model, c: [p.x, p.y], sel: p.id, searchOpen: false, searchDone: true }));
          }
        }
      }
    };

    BASE.vertex = (ctx, vertices, point, index) => {
      return sv('circle', { class: 'mpe-vertex', cx: point[0], cy: point[1], r: index === 0 ? 6 : 4 }, vertices);
    };

    BASE.rowDecorated = (ctx, row, place) => {};

    BASE.mapDecorated = (ctx, port, editor) => {};

    BASE.rendered = (ctx, view) => {};
  }

  env.template('pan-map/_paint', () => ({
    install(BASE, S) {
      installPaint(BASE, S);
    },
  }));
})();
