/* pan-map/_editor-parts: city editor parts parts; installed per page, preserving the city design API. */
(function () {
  'use strict';
  const F = () => env.taskDef.helpers;
  const sv = (tag, attrs, parent) => env.util.svg(tag, attrs, parent);
  const pathOf = (pts) => pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join('');

  function installView(BASE, S) {
    BASE.renderEditor = (ctx) => {
      const { util, spec: s } = ctx, fam = F();
      S.P.editorStyle(ctx);
      const chrome = S.P.shell(ctx, true), { root, top, work, panel } = chrome;
      S.els.chrome = chrome;
      const { search, results } = S.P.editorSearch(ctx, top);
      chrome.finishTop();
      S.P.editorHeading(ctx, panel);
      let travelMode = 'Driving';
      const { settings, inspectorStatus } = S.P.editorSettings(ctx, panel, (label) => { travelMode = label; }, () => paint(ctx.model));
      const { list, stopLabels } = S.P.editorDirectory(ctx, panel, commit);
      const { map, port, W, H } = S.P.editorFrame(ctx, work);
      const { world, labels, pins, roadLabels } = S.P.editorWorld(ctx, port, W, H);
      const { path, vertices, handles, pin } = S.P.editorOverlay(ctx, port, W, H);
      const { edit, pan, clear, close } = S.P.editorTools(ctx, port, commit);
      const { zin, level, zout } = S.P.editorZoom(ctx, port);
      const { readout, saved } = S.P.editorReadout(ctx, port, chrome);
      let resultButtons = {}, resultKey = null;
      const coord = (p) => fam.toPort(ctx.model, p);
      const elements = {
        W, H, world, pins, roadLabels, labels, handles, pin, path, vertices, level, zin, zout,
        edit, pan, close, stopLabels, inspectorStatus, chrome, readout, saved, search, results, commit,
        get travelMode() { return travelMode; },
        get resultButtons() { return resultButtons; },
        set resultButtons(v) { resultButtons = v; },
        get resultKey() { return resultKey; },
        set resultKey(v) { resultKey = v; },
      };
      function paint(m) { S.P.editorPaint(ctx, elements, m); }
      function commit(m) { ctx.update(m); paint(ctx.model); }
      search.addEventListener('input', () => commit({ ...ctx.model, query: search.value, searchOpen: true }));
      search.addEventListener('focus', () => commit({ ...ctx.model, searchOpen: true }));
      search.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') commit({ ...ctx.model, searchOpen: false });
        if (e.key === 'Enter') { const b = Object.values(resultButtons)[0]; if (b) b.click(); }
      });
      const zoom = (z, p) => commit(fam.zoomAt(ctx.model, s, z, p));
      zin.addEventListener('click', () => zoom(ctx.model.z + 1));
      zout.addEventListener('click', () => zoom(ctx.model.z - 1));
      const local = (e) => { const r = port.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
      port.addEventListener('wheel', (e) => {
        if (!s.wheel) return;
        e.preventDefault(); zoom(ctx.model.z + fam.wheelSteps(e.deltaY), local(e));
      }, { passive: false });
      port.addEventListener('dblclick', (e) => { if (s.scenario === 'zoomto' && !e.target.closest('button')) zoom(ctx.model.z + 1, local(e)); });
      let drag = null;
      port.addEventListener('pointerdown', (e) => {
        if (e.button !== 0 || e.target.closest('button') || e.target.closest('.mpe-zoom,.mpe-tools')) return;
        e.preventDefault(); port.setPointerCapture(e.pointerId);
        const handle = ctx.model.tool === 'pan' ? null : e.target.closest('[data-waypoint]'), dropped = ctx.model.tool === 'pan' ? null : e.target.closest('[data-pin]');
        drag = { x: e.clientX, y: e.clientY, start: ctx.model, handle: handle ? Number(handle.dataset.waypoint) : null,
          pin: !!dropped, moved: false };
        if (ctx.model.searchOpen) commit({ ...ctx.model, searchOpen: false });
      });
      port.addEventListener('pointermove', (e) => {
        if (!drag) return;
        const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        if (!drag.moved && Math.hypot(dx, dy) < 4) return;
        drag.moved = true;
        if (drag.handle !== null) {
          const wp = ctx.model.waypoints.slice(); wp[drag.handle] = fam.fromPort(ctx.model, local(e));
          commit({ ...ctx.model, waypoints: wp });
        } else if (drag.pin) commit({ ...ctx.model, pin: fam.fromPort(ctx.model, local(e)) });
        else commit(fam.panPx({ ...ctx.model, c: drag.start.c }, s, [dx, dy]));
      });
      port.addEventListener('pointerup', (e) => {
        if (!drag) return;
        const d = drag; drag = null;
        if (d.moved || ctx.model.tool === 'pan') return;
        const p = fam.fromPort(ctx.model, local(e));
        if (s.scenario === 'pin') commit({ ...ctx.model, pin: p });
        if (s.scenario === 'zone' && !ctx.model.closed) {
          if (ctx.model.vertices.length >= 3 && Math.hypot(...local(e).map((x, i) => x - coord(ctx.model.vertices[0])[i])) < 12) commit({ ...ctx.model, closed: true });
          else commit({ ...ctx.model, vertices: ctx.model.vertices.concat([p]) });
        }
      });
      port.addEventListener('pointercancel', () => { drag = null; });
      Object.assign(S.els, { port, root, top, world, labels, handles, pin, path, vertices, search, results, list, readout });
      S.P.mapDecorated(ctx, port, true);
      commit({ ...ctx.model, port: [W, H] });
      return {
        anchors: [root, port, top], sync: paint,
        locate(t) {
          if (t.search) return util.center(search);
          if (t.suggestion) return resultButtons[t.suggestion] ? util.center(resultButtons[t.suggestion]) : null;
          if (t.tool) return util.center(t.tool === 'pan' ? pan : edit);
          if (t.clear) return util.center(clear);
          if (t.closeZone) return util.center(close);
          if (t.zoom) return util.center(t.zoom === 'in' ? zin : zout);
          if (t.waypoint !== undefined) return util.center(handles[t.waypoint]);
          if (t.pin) return util.center(pin);
          const r = port.getBoundingClientRect(), base = [r.left, r.top];
          if (t.point) return fam.toPort(ctx.model, t.point).map((v, i) => v + base[i]);
          if (t.map) return [r.left + W / 2, r.top + H / 2];
          if (t.grab || t.release) {
            const D = fam.dragPx(ctx.model, s, t.grab || t.release), k = t.grab ? -.5 : .5;
            return [r.left + W / 2 + k * D[0], r.top + H / 2 + k * D[1]];
          }
          return null;
        },
      };
    };

    BASE.editorStyle = (ctx) => {
      ctx.css('mp-editor-style', S.P.cssText(S.D.editorCss));
    };

    BASE.editorSearch = (ctx, top) => {
      const { util } = ctx;
      const sb = util.el('div', 'mpe-searchbox mpp-search', top); S.P.icon(sb, 'search', 15);
      const search = util.el('input', '', sb); search.placeholder = S.D.editorSearch; search.setAttribute('aria-label', S.D.editorSearch);
      const results = util.el('div', 'mpe-results', sb); results.hidden = true;

      return { search, results };
    };

    BASE.editorHeading = (ctx, panel) => {
      const { util, spec: s } = ctx;
      const section = util.el('div', 'mpe-section', panel);
      util.el('div', 'mpe-kicker', section, 'Workspace / Survey district');
      const titles = S.D.editorTitles;
      util.el('div', 'mpe-heading', section, titles[s.scenario]);
      const hints = S.D.editorHints;
      util.el('div', 'mpe-help', section, hints[s.scenario]);

      return section;
    };
  }

  function installSurvey(BASE, S) {
    BASE.editorSettings = (ctx, panel, onMode, repaint) => {
      const { util, spec: s } = ctx;
      const controls = util.el('div', 'mpp-controls', panel);
      let travelMode = 'Driving';
      if (s.scenario === 'route') {
        const modes = [['car', 'Driving'], ['walk', 'Walking'], ['bike', 'Cycling']].map(([symbol, label]) => {
          const b = S.P.iconButton(controls, symbol, label); b.classList.toggle('active', label === travelMode);
          b.addEventListener('click', () => { travelMode = label; onMode(label); modes.forEach((el) => el.classList.toggle('active', el === b)); repaint(); }); return b;
        });
        util.el('span', 'mpp-meta', controls, 'Route options / Avoid tolls');
      } else {
        const b = S.P.iconButton(controls, s.scenario === 'zone' ? 'polygon' : 'folder', s.scenario === 'zone' ? 'Service area properties' : 'Collection details', s.scenario === 'zone' ? 'Standard service' : 'Field collection');
        b.addEventListener('click', () => { settings.hidden = !settings.hidden; });
      }
      const settings = util.el('div', 'mpp-inspector', panel);
      if (s.scenario === 'zone') {
        util.el('strong', '', settings, 'Primary service area');
        for (const [label, value] of [['Schedule', 'Weekdays 09:00-18:00'], ['Priority', 'Standard delivery'], ['Visibility', 'Operations team']]) { const row = util.el('div', 'mpp-property', settings); util.el('span', '', row, label); util.el('span', '', row, value); }
      }
      const inspectorStatus = util.el('div', 'mpp-meta', settings);

      return { controls, settings, inspectorStatus };
    };

    BASE.editorDirectory = (ctx, panel, commit) => {
      const { util, spec: s } = ctx, fam = F();
      const list = util.el('div', 'mpe-list', panel);
      const entries = s.scenario === 'route' ? s.stops.map((id) => fam.placeById(s, id)) : s.places;
      const stopLabels = [];
      entries.forEach((p, i) => {
        const { row, button: b, name, address } = S.P.editorRow(ctx, list, p, s.scenario === 'route' ? String(i + 1) : String(s.places.indexOf(p) + 1));
        if (s.scenario === 'route') stopLabels.push({ name, address });
        else { const meta = S.P.placeMeta(ctx, p); const line = util.el('div', 'mpp-meta', b); S.P.icon(line, 'star', 10); line.append(document.createTextNode(` ${meta.rating} (${meta.reviews}) / `)); util.el('span', 'mpp-open', line, meta.hours); }
        b.title = 'Show on map';
        b.addEventListener('click', () => commit({ ...ctx.model, c: s.scenario === 'route' ? ctx.model.waypoints[i].slice() : [p.x, p.y], sel: p.id }));
      });
      if (s.scenario === 'route') {
        util.el('div', 'mpe-section mpe-kicker', list, 'Places on this map');
        s.places.forEach((p, i) => {
          const { button: b } = S.P.editorRow(ctx, list, p, String(i + 1));
          b.addEventListener('click', () => commit({ ...ctx.model, c: [p.x, p.y] }));
        });
      }

      return { list, stopLabels };
    };

    BASE.editorRow = (ctx, list, p, badge) => {
      const { util } = ctx;
      const row = util.el('div', 'mpe-item', list);
      util.el('span', 'mpe-badge', row, badge);
      const b = util.el('button', '', row);
      const name = util.el('span', 'mpe-name', b, p.name);
      const address = util.el('span', 'mpe-address', b, p.address);

      S.P.rowDecorated(ctx, row, p);
      return { row, button: b, name, address };
    };

    BASE.editorFrame = (ctx, work) => {
      const { util } = ctx;
      const map = util.el('div', 'mpe-map', work);
      const port = util.el('div', 'mp-port mpe-port', map);
      const W = port.clientWidth, H = port.clientHeight;

      return { map, port, W, H };
    };

    BASE.editorWorld = (ctx, port, W, H) => {
      const { util, spec: s } = ctx;
      const svg = sv('svg', { class: 'mp-svg', width: W, height: H }, port);
      const world = sv('g', {}, svg);
      for (const p of s.world.parks) sv('path', { class: 'mp-park', d: pathOf(p.pts) + 'Z' }, world);
      const cx = s.world.W / 2, cy = s.world.H / 2, br = ctx.rng.fork('survey-buildings');
      for (let col = -6; col <= 5; col++) for (let row = -5; row <= 4; row++) {
        for (let b = 0; b < 3; b++) S.P.building(ctx, world, { class: 'mpe-block', x: cx + col * s.spacing[0] + s.spacing[0] / 2 + 13 + b * 40,
          y: cy + row * s.spacing[1] + 36, width: br.int(22, 34), height: br.int(48, 93), rx: 2 });
      }
      const outerStreets = [];
      for (let n = -6; n <= 6; n++) {
        const x = cx + (n + .5) * s.spacing[0], y = cy + n * s.spacing[1];
        outerStreets.push(`M${x} ${cy - 1200}L${x} ${cy + 1200}`);
        if (Math.abs(n) > 1) outerStreets.push(`M${cx - 1600} ${y}L${cx + 1600} ${y}`);
      }
      sv('path', { class: 'mp-streets', d: outerStreets.join(''), 'stroke-width': 8 }, world);
      sv('path', { class: 'mp-streets', d: s.world.streets.map(([x, y, a, b]) => `M${x} ${y}L${a} ${b}`).join(''), 'stroke-width': 8 }, world);
      for (const r of s.world.roads) {
        sv('path', { class: 'mp-casing', d: pathOf(r.pts), 'stroke-width': 18 }, world);
        sv('path', { class: 'mp-road', d: pathOf(r.pts), 'stroke-width': 15 }, world);
      }
      const labels = util.el('div', 'mp-layer', port);
      const pins = s.places.map((p, i) => {
        const pin = S.P.editorPin(ctx, labels, p, i);
        return pin;
      });
      const roadLabels = s.world.roads.map((r) => util.el('div', 'mp-lbl mp-roadname', labels, r.name));

      return { world, labels, pins, roadLabels };
    };

    BASE.editorPin = (ctx, labels, p, i) => {
      const { util } = ctx;
      const pin = util.el('div', 'mp-pin', labels); pin.style.setProperty('--c', S.D.editorPinColor);
      util.el('div', 'mp-dot', pin, String(i + 1));
      const name = util.el('div', 'mp-name', pin, p.name); name.title = p.name;

      return pin;
    };

    BASE.editorOverlay = (ctx, port, W, H) => {
      const { util, spec: s } = ctx;
      const overlay = sv('svg', { class: 'mpe-editlayer', width: W, height: H }, port);
      const path = sv('path', { class: s.scenario === 'zone' ? 'mpe-polygon' : 'mpe-path' }, overlay);
      const vertices = sv('g', {}, overlay);
      const handles = s.scenario === 'route' ? ctx.model.waypoints.map((_, i) => {
        return S.P.handle(ctx, port, i);
      }) : [];
      const pin = util.el('div', 'mpe-handle pin', port); S.P.icon(pin, 'pin', 17); pin.dataset.pin = '1'; pin.setAttribute('aria-label', 'Dropped pin');
      if (s.scenario === 'zoomto') util.el('div', 'mpe-centre', port);

      return { path, vertices, handles, pin };
    };
  }

  function installControls(BASE, S) {
    BASE.editorTools = (ctx, port, commit) => {
      const { util, spec: s } = ctx;
      const tools = util.el('div', 'mpe-tools', port);
      const edit = util.el('button', '', tools, S.D.editLabels[s.scenario]);
      S.P.icon(edit, s.scenario === 'zone' ? 'polygon' : s.scenario === 'route' ? 'route' : 'pin', 13);
      const pan = util.el('button', '', tools, 'Pan'); S.P.icon(pan, 'map', 13);
      let clear, close;
      if (s.scenario === 'zone') {
        clear = util.el('button', '', tools, 'Clear');
        close = util.el('button', '', tools, 'Close');
        clear.addEventListener('click', () => commit({ ...ctx.model, vertices: [], closed: false }));
        close.addEventListener('click', () => { if (ctx.model.vertices.length >= 3) commit({ ...ctx.model, closed: true }); });
      }
      edit.addEventListener('click', () => commit({ ...ctx.model, tool: 'edit' }));
      pan.addEventListener('click', () => commit({ ...ctx.model, tool: 'pan' }));

      return { tools, edit, pan, clear, close };
    };

    BASE.editorZoom = (ctx, port) => {
      const { util } = ctx;
      const zb = util.el('div', 'mpe-zoom', port);
      const zin = util.el('button', '', zb); S.P.icon(zin, 'plus'); zin.title = 'Zoom in';
      const level = util.el('output', '', zb);
      const zout = util.el('button', '', zb); S.P.icon(zout, 'minus'); zout.title = 'Zoom out';

      return { zin, level, zout };
    };

    BASE.editorReadout = (ctx, port, chrome) => {
      const { util } = ctx;
      const readout = util.el('div', 'mpe-readout', port);
      const saved = chrome.status;
      const legend = util.el('div', 'mpe-legend', port); S.P.icon(legend, 'compass', 14); util.el('div', '', legend, 'North up');

      return { readout, saved };
    };

    BASE.readoutLines = (ctx, readout, lines) => {
      const { util } = ctx;
      readout.replaceChildren();
      for (const [label, value] of lines) { const line = util.el('div', '', readout); util.el('b', '', line, label + ': '); line.append(document.createTextNode(value)); }
    };

    BASE.suggestion = (ctx, results, p) => {
      const { util } = ctx;
      const b = util.el('button', '', results, p.name); util.el('small', '', b, p.address);

      return b;
    };
  }

  env.template('pan-map/_editor-parts', () => ({
    install(BASE, S) {
      installView(BASE, S);
      installSurvey(BASE, S);
      installControls(BASE, S);
    },
  }));
})();
