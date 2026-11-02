// Design on the shared pan-map/city template.
const SH = {};
const svgI = (body, w = 16) => `<svg viewBox="0 0 16 16" width="${w}" height="${w}" shape-rendering="crispEdges" aria-hidden="true">${body}</svg>`;
const ICO = {
  '🌲': svgI('<path d="M8 1l4 5h-2l3 4H9v3H7v-3H3l3-4H4z" fill="#1f7a34" stroke="#0e3d1c" stroke-width="1"/><rect x="7" y="13" width="2" height="2" fill="#6b3d1a"/>'),
  '⚽': svgI('<circle cx="8" cy="8" r="6.5" fill="#fff" stroke="#0b1d3d" stroke-width="1.5"/><path d="M8 5l3 2-1 3H6L5 7z" fill="#0b1d3d"/>'),
  '🏛': svgI('<path d="M2 6l6-4 6 4z" fill="#12335d"/><rect x="3" y="7" width="2" height="5" fill="#12335d"/><rect x="7" y="7" width="2" height="5" fill="#12335d"/><rect x="11" y="7" width="2" height="5" fill="#12335d"/><rect x="2" y="13" width="12" height="2" fill="#12335d"/>'),
  '🚉': svgI('<rect x="3" y="1" width="10" height="11" rx="2" fill="#d62a2a" stroke="#6b0f0f" stroke-width="1"/><rect x="5" y="3" width="6" height="4" fill="#fff"/><circle cx="5.5" cy="10" r="1" fill="#fff"/><circle cx="10.5" cy="10" r="1" fill="#fff"/><path d="M4 15l2-3M12 15l-2-3" stroke="#12335d" stroke-width="1.5"/>'),
};
env.widget({
  task: 'pan-map',
  site: 'design-pan-map-route-05',
  name: 'design',
  split: 'train',
  scenarios: ['route'],
  traits: { zoom: 'both' },
  template: 'pan-map/city',
  design: {
    parts: {
      shellHeader(base, S) {
        return (ctx, root, editor) => {
          const chrome = base(ctx, root, editor);
          if (chrome.top) chrome.top.classList.add('route-shell-top');
          if (chrome.bar) chrome.bar.classList.add('route-shell-status');
          if (chrome.bar) chrome.bar.style.display = 'none';
          return chrome;
        };
      },
      editorHeading(base, S) {
        return (ctx, panel) => {
          const section = base(ctx, panel);
          section.classList.add('route-place-heading');
          section.replaceChildren();
          section.textContent = 'Places';
          return section;
        };
      },
      editorDirectory(base, S) {
        return (ctx, panel, commit) => {
          const { util, spec: s } = ctx;
          panel.classList.add('route-place-pane');
          const list = util.el('div', 'mpe-list route-cat-list', panel);
          const cats = [
            ['Parks & Nature', '🌲', /park|forest|wood|nature|wetland|reserve|hide|lake|garden|brook|green|marsh|heath|meadow/i],
            ['Sports & Leisure', '⚽', /arena|leisure|golf|rowing|sports|stadium|pool|field|pavilion|club|court|ground|track/i],
            ['Transport', '🚉', /station|airport|terminal|depot|stop|ferry|port\b/i],
          ];
          const kindOf = (p) => { for (const c of cats) if (c[2].test(p.name)) return c; return ['Culture & Community', '🏛']; };
          const groups = {};
          for (const p of s.places) { const c = kindOf(p); (groups[c[0]] = groups[c[0]] || { icon: c[1], items: [] }).items.push(p); }
          for (const name of ['Parks & Nature', 'Sports & Leisure', 'Culture & Community', 'Transport']) {
            const g = groups[name]; if (!g) continue;
            const h = util.el('div', 'route-cat-head', list);
            util.el('span', 'route-cat-ico', h).innerHTML = ICO[g.icon]; util.el('span', '', h, name);
            for (const p of g.items) {
              const row = util.el('div', 'mpe-item route-place-row', list);
              util.el('span', 'route-cat-ico', row).innerHTML = ICO[g.icon];
              const b = util.el('button', '', row);
              util.el('span', 'mpe-name', b, p.name);
              b.title = 'Show on map';
              b.addEventListener('click', () => commit({ ...ctx.model, c: [p.x, p.y], sel: p.id }));
            }
          }
          const stopLabels = [];
          SH.slots = [];
          s.stops.forEach((id, i) => {
            const slot = document.createElement('div');
            slot.className = 'route-slot';
            slot.innerHTML = `<b>${i + 1}</b><i aria-hidden="true"><svg viewBox="0 0 16 22" width="16" height="22"><path d="M8 1a6 6 0 0 0-6 6c0 5 6 13 6 13s6-8 6-13a6 6 0 0 0-6-6z" fill="#fff" stroke="#12335d" stroke-width="1.6"/><circle cx="8" cy="7" r="2" fill="#12335d"/></svg></i><span>Click a place on the map<br>to add this stop</span>`;
            SH.slots.push(slot);
            // The strip keeps the reference's placeholder copy; the model still drives the handles.
            stopLabels.push({ name: { set textContent(v) {} }, address: { set textContent(v) {} } });
          });
          const legend = document.createElement('div');
          legend.className = 'route-place-legend';
          legend.innerHTML = '<div class="route-place-legend-title">Legend</div>' +
            `<span>${ICO['🌲']} Park / Nature</span><span class="route-key-road"><u></u>Major Road</span>` +
            `<span>${ICO['⚽']} Sports &amp; Leisure</span><span class="route-key-minor"><u></u>Minor Road</span>` +
            `<span>${ICO['🏛']} Culture / Community</span><span class="route-key-water"><u></u>River / Water</span>` +
            `<span>${ICO['🚉']} Station</span><span class="route-key-park"><u></u>Park / Green Space</span>`;
          panel.appendChild(legend);
          return { list, stopLabels };
        };
      },
      editorFrame(base, S) {
        return (ctx, work) => {
          const { util } = ctx;
          const map = util.el('div', 'mpe-map route-map-shell', work);
          const heading = util.el('div', 'route-map-heading', map);
          heading.innerHTML = '<span aria-hidden="true">🗺</span> Map';
          const port = util.el('div', 'mp-port mpe-port', map);
          const strip = util.el('div', 'route-strip', map);
          util.el('div', 'route-strip-head', strip, 'Waypoints (in visit order)');
          const row = util.el('div', 'route-strip-row', strip);
          for (const sl of (SH.slots || [])) row.appendChild(sl);
          return { map, port, W: port.clientWidth, H: port.clientHeight };
        };
      },
      editorPin(base, S) {
        return (ctx, labels, p, i) => {
          const pin = base(ctx, labels, p, i);
          const n = p.name;
          const icon = /park|forest|wood|nature|wetland|reserve|hide|lake|garden|brook|green|marsh|heath|meadow/i.test(n) ? '🌲'
            : /arena|leisure|golf|rowing|sports|stadium|pool|field|pavilion|club|court|ground|track/i.test(n) ? '⚽'
            : /station|airport|terminal|depot|ferry/i.test(n) ? '🚉' : '🏛';
          const dot = pin.querySelector('.mp-dot');
          if (dot) { dot.innerHTML = ICO[icon].replace(/width="16" height="16"/, 'width="26" height="26"'); dot.classList.add('route-pin-ico'); }
          return pin;
        };
      },
      editorWorld(base, S) {
        return (ctx, port, W, H) => {
          const out = base(ctx, port, W, H);
          const world = out.world;
          const ns = 'http://www.w3.org/2000/svg';
          const cx = ctx.spec.world.W / 2, cy = ctx.spec.world.H / 2;
          world.replaceChildren();
          const node = (tag, attrs, parent = world) => {
            const el = document.createElementNS(ns, tag);
            for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
            parent.appendChild(el); return el;
          };
          const path = (d, cls, extra = {}, parent = world) => node('path', { d, class: cls, ...extra }, parent);
          const text = (value, x, y, cls, extra = {}) => {
            const t = node('text', { x, y, class: cls, ...extra }); t.textContent = value; return t;
          };
          const left = cx - 2100, right = cx + 2100, top = cy - 1800, bottom = cy + 1800;
          // Irregular shore and broad river establish the map's geography first.
          path(`M${left} ${top}H${cx-520} Q${cx-390} ${cy-1450} ${cx-580} ${cy-1120} T${cx-450} ${cy-650} Q${cx-330} ${cy-360} ${cx-550} ${cy-60} T${cx-440} ${cy+530} Q${cx-350} ${cy+900} ${cx-570} ${bottom}H${left}Z`, 'route-water');
          path(`M${left} ${cy+400} C${cx-1350} ${cy+140} ${cx-920} ${cy+620} ${cx-430} ${cy+390} S${cx+280} ${cy+160} ${cx+620} ${cy+370} S${cx+1390} ${cy+650} ${right} ${cy+390}`, 'route-river-casing');
          path(`M${left} ${cy+400} C${cx-1350} ${cy+140} ${cx-920} ${cy+620} ${cx-430} ${cy+390} S${cx+280} ${cy+160} ${cx+620} ${cy+370} S${cx+1390} ${cy+650} ${right} ${cy+390}`, 'route-river');
          path(`M${cx+700} ${cy-1060} C${cx+820} ${cy-1180} ${cx+1090} ${cy-1100} ${cx+1110} ${cy-900} C${cx+1080} ${cy-740} ${cx+840} ${cy-720} ${cx+720} ${cy-850} Q${cx+650} ${cy-960} ${cx+700} ${cy-1060}Z`, 'route-water');
          // Parks have soft, surveyed edges instead of regular polygon corners.
          path(`M${cx-920} ${cy-1040} Q${cx-700} ${cy-1180} ${cx-450} ${cy-1060} T${cx-180} ${cy-880} Q${cx-250} ${cy-650} ${cx-520} ${cy-630} T${cx-900} ${cy-730} Q${cx-1080} ${cy-850} ${cx-920} ${cy-1040}Z`, 'route-park');
          path(`M${cx+70} ${cy+660} Q${cx+260} ${cy+470} ${cx+530} ${cy+580} T${cx+880} ${cy+700} Q${cx+930} ${cy+950} ${cx+700} ${cy+1110} T${cx+270} ${cy+1150} Q${cx+50} ${cy+1000} ${cx+70} ${cy+660}Z`, 'route-park');
          path(`M${cx-1690} ${cy+870} Q${cx-1530} ${cy+700} ${cx-1350} ${cy+800} L${cx-1270} ${cy+1110} Q${cx-1450} ${cy+1270} ${cx-1660} ${cy+1120}Z`, 'route-park');
          // Extra green patches scattered through the city, as on the reference map.
          const blob = (x, y, w, h) => `M${x} ${y} q${w * .3} ${-h * .6} ${w * .7} ${-h * .2} t${w * .3} ${h * .5} q${-w * .1} ${h * .6} ${-w * .6} ${h * .5} t${-w * .4} ${-h * .8}Z`;
          [[-300, -380, 330, 220], [260, -520, 300, 200], [480, -120, 280, 200], [-640, 180, 260, 180], [-80, 150, 260, 170],
            [820, 120, 300, 260], [-200, 980, 360, 240], [900, -300, 240, 200], [-1180, -300, 280, 260], [60, -820, 380, 200]]
            .forEach(([dx, dy, w, h]) => path(blob(cx + dx, cy + dy, w, h), 'route-park'));
          for (let i = 0; i < 7; i++) {
            const y = cy - 430 + i * 145, x = cx - 900 + (i % 2) * 50;
            path(`M${x} ${y} l-150 -44 l-22 16 l158 58 M${x-35} ${y+12} l-12 38 M${x-82} ${y-2} l-13 38 M${x-128} ${y-18} l-13 38`, 'route-pier');
          }

          const defs = node('defs', {});
          const clip = node('clipPath', { id: 'route-city-clip', clipPathUnits: 'userSpaceOnUse' }, defs);
          node('path', { d: `M${cx-500} ${top} L${cx+1000} ${top} C${cx+840} ${cy-1250} ${cx+1120} ${cy-800} ${cx+930} ${cy-430} S${cx+840} ${cy+260} ${cx+1030} ${cy+610} S${cx+830} ${cy+1280} ${cx+1050} ${bottom} L${cx-520} ${bottom} C${cx-420} ${cy+950} ${cx-710} ${cy+400} ${cx-510} ${cy+40} S${cx-650} ${cy-1080} ${cx-500} ${top}Z` }, clip);
          const city = node('g', { class: 'route-city', 'clip-path': 'url(#route-city-clip)' });

          // The city grid bends and shifts block by block. Footprints are deterministic
          // functions of their cell, so this decoration adds no random draws.
          const blocks = node('g', { class: 'route-buildings' });
          const streetPaths = [];
          const stepX = Math.max(62, ctx.spec.spacing[0] / 5.1), stepY = Math.max(58, ctx.spec.spacing[1] / 5.0);
          for (let col = -15; col <= 15; col++) {
            const x = cx + col * stepX;
            if (x < cx - 880) continue;
            const bend = (col % 2 ? 1 : -1) * stepX * (.55 + (Math.abs(col) % 3) * .09);
            streetPaths.push(`M${x} ${top} C${x+bend} ${cy-1150} ${x-bend*.8} ${cy-300} ${x+bend*.45} ${cy+300} S${x-bend*.7} ${cy+1250} ${x+bend*.3} ${bottom}`);
          }
          for (let row = -14; row <= 14; row++) {
            const y = cy + row * stepY;
            const bend = (row % 2 ? -1 : 1) * stepY * (.5 + (Math.abs(row) % 3) * .08);
            streetPaths.push(`M${cx-860} ${y} C${cx-1000} ${y+bend} ${cx-300} ${y-bend*.8} ${cx+150} ${y+bend*.35} S${cx+1100} ${y-bend} ${right} ${y+bend*.3}`);
          }
          for (let col = -14; col <= 14; col++) for (let row = -13; row <= 13; row++) {
            if (cx + col * stepX < cx - 880) continue;
            const seed = Math.abs((col * 73856093) ^ (row * 19349663));
            const bx = cx + col * stepX + 12 + seed % 17, by = cy + row * stepY + 11 + (seed >> 4) % 15;
            const count = 1 + seed % 3;
            for (let n = 0; n < count; n++) {
              const ox = (seed >> (n + 2)) % Math.max(12, stepX * .22) + n * 5;
              const oy = (seed >> (n + 5)) % Math.max(12, stepY * .22) + n * 5;
              const bw = 10 + (seed >> (n + 8)) % Math.max(13, stepX * .23);
              const bh = 10 + (seed >> (n + 11)) % Math.max(13, stepY * .22);
              node('rect', { x: bx + ox, y: by + oy, width: bw, height: bh, rx: 2 + seed % 3,
                class: `route-building tone-${seed % 4}` }, blocks);
            }
          }
          city.appendChild(blocks);
          path(streetPaths.join(''), 'route-street-casing', {}, city);
          path(streetPaths.join(''), 'route-local-streets', {}, city);

          // The named arterials are curved, gold-cased avenues over the minor grid.
          const arterial = [
            `M${cx-1950} ${cy-1170} C${cx-1100} ${cy-980} ${cx-520} ${cy-1100} ${cx+100} ${cy-1010} S${cx+1210} ${cy-770} ${right} ${cy-620}`,
            `M${cx-1850} ${cy+620} C${cx-1120} ${cy+500} ${cx-620} ${cy+720} ${cx-80} ${cy+620} S${cx+900} ${cy+520} ${right} ${cy+360}`,
            `M${cx-420} ${top} C${cx-250} ${cy-840} ${cx+20} ${cy-480} ${cx+80} ${cy-70} S${cx+220} ${cy+890} ${cx+40} ${bottom}`,
          ];
          for (const d of arterial) { path(d, 'route-avenue-casing', {}, city); path(d, 'route-avenue', {}, city); }
          for (const r of ctx.spec.world.roads) {
            const d = r.pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join('');
            path(d, 'route-avenue-casing', {}, city); path(d, 'route-avenue', {}, city);
            const first = r.pts[0], last = r.pts[r.pts.length - 1];
            const t = text(r.name, (first[0] + last[0]) / 2, (first[1] + last[1]) / 2 - 12, 'route-road-label'); city.appendChild(t);
          }
          world.appendChild(city);
          world.querySelectorAll('.route-park').forEach((p) => world.appendChild(p));
          world.querySelectorAll('.route-river-casing,.route-river').forEach((p) => world.appendChild(p));
          world.querySelectorAll('.route-district-label,.route-park-label,.route-water-label').forEach((t) => world.appendChild(t));
          text('Northview Park', cx-650, cy-850, 'route-park-label');
          text('Meadowbrook Park', cx+470, cy+820, 'route-park-label');
          text('West End', cx-670, cy-480, 'route-district-label');
          text('Midtown', cx-110, cy+360, 'route-district-label');
          text('Hillcrest', cx+540, cy+100, 'route-district-label');
          text('Southgate', cx+120, cy+820, 'route-district-label');
          text('Brightwater Bay', cx-1450, cy+120, 'route-water-label');
          text('Maple River', cx+1230, cy-820, 'route-water-label');
          text('Market Ave', cx-480, cy+620, 'route-road-label', { transform: `rotate(7 ${cx-480} ${cy+620})` });
          text('Maple St', cx+220, cy+450, 'route-road-label', { transform: `rotate(-79 ${cx+220} ${cy+450})` });
          text('Oak St', cx+280, cy-260, 'route-road-label');
          text('Pine St', cx-350, cy-1060, 'route-road-label');
          return out;
        };
      },
    },
  },
});
