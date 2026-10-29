// Design on the shared pan-map/city template.
env.widget({
  task: 'pan-map',
  site: 'design-pan-map-zoom-03',
  name: 'design',
  split: 'train',
  scenarios: ['zoom'],
  traits: { zoom: 'both' },
  template: 'pan-map/city',
  design: {
    font: '12px/1.25 Tahoma, Arial, sans-serif',
    mapColors: {
      land: '#e8e1d2', water: '#56b5eb', park: '#a9df8b', street: '#fffdf8',
      road: '#f4cf36', casing: '#d7a91e', transitRoad: '#d7b39b', transitCasing: '#8c7667',
      parkName: '#175b2b', open: '#16824a', productLand: '#e8e1d2', productWater: '#56b5eb',
      productPark: '#a9df8b', productRoad: '#f4cf36', editorLand: '#e8e1d2',
      editorRoad: '#f4cf36', editorCasing: '#d7a91e', droppedPin: '#c74439',
    },
    parts: {
      fit() {
        return ({ size }) => ({
          width: Math.floor(Math.min(size.width < 1100 ? 850 : 1100, size.width * (size.width < 1100 ? .94 : .66))),
          height: Math.floor(Math.min(785, size.height)),
        });
      },
      frame(base) {
        return (...args) => {
          const root = base(...args);
          root.style.boxSizing = 'border-box';
          root.style.border = '4px ridge #d4d0c8';
          root.style.boxShadow = '1px 1px #555';
          return root;
        };
      },
      shellHeader(base, S) {
        return (ctx, root, editor) => {
          const result = base(ctx, root, editor);
          const tools = ctx.util.el('dialog', 'city-tools', root);
          tools.setAttribute('aria-label', 'Map tools and places');
          const close = ctx.util.el('button', 'city-tools-close', tools, 'Close tools');
          close.addEventListener('click', () => tools.close());
          tools.append(result.top, result.bar);
          S.cityTools = tools;
          return result;
        };
      },
      shellPanels(base, S) {
        return (...args) => {
          const result = base(...args);
          const content = args[0].util.el('div', 'city-tools-content', S.cityTools);
          content.append(result.rail, result.panel);
          S.cityTools.append(result.drawer);
          return result;
        };
      },
      explorerFrame(base, S) {
        return (...args) => {
          const result = base(...args);
          const tools = args[0].util.el('button', 'city-tools-open', result.head, 'Tools');
          tools.addEventListener('click', () => S.cityTools.showModal());
          result.card.append(result.head);
          return result;
        };
      },
      explorerControls(base) {
        return (...args) => {
          const result = base(...args);
          Object.assign(result.zoomBox.style, { top: '8px', left: '8px', right: 'auto', bottom: 'auto' });
          return result;
        };
      },
      cssText(base) {
        return (...args) => base(...args) + `
          .mp-product { flex: none; }
          .mp-product .mp-head { border-radius: 0; background: #d4d0c8; }
          .mp-product .mp-port { border-radius: 0; }
          .mp-product .mp-zoom { padding: 0; gap: 0; border-radius: 0; }
          .mp-product .mp-zbtn { width: 36px; height: 40px; border-radius: 0; }
          .city-tools { width: min(650px, 90vw); max-height: 80vh; padding: 8px; border: 3px outset #eee; background: #d4d0c8; color: #111; }
          .city-tools-content { display: flex; height: 280px; }
          .city-tools-content .mpp-panel { flex: 1; }
          .city-tools .mpp-drawer { top: 108px; bottom: 8px; left: 52px; }
          .city-tools-close { float: right; }
        `;
      },
      explorerWorld(base) {
        return (ctx, port, W, H) => {
          const result = base(ctx, port, W, H);
          const NS = 'http://www.w3.org/2000/svg';
          const add = (tag, attrs, parent = result.world) => {
            const el = document.createElementNS(NS, tag);
            for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, String(value));
            parent.appendChild(el);
            return el;
          };
          let geoLayer = null;
          if (ctx.model && ctx.model.c) {
            const [cx, cy] = ctx.model.c;
            const geo = geoLayer = document.createElementNS(NS, 'g');
            geo.setAttribute('class', 'map-fallback-geography');
            add('path', { class: 'map-bay', d: `M${cx - W * .62},${cy - H * .58} C${cx - W * .44},${cy - H * .55} ${cx - W * .46},${cy - H * .43} ${cx - W * .36},${cy - H * .36} C${cx - W * .27},${cy - H * .29} ${cx - W * .43},${cy - H * .15} ${cx - W * .34},${cy - H * .06} C${cx - W * .24},${cy + H * .04} ${cx - W * .38},${cy + H * .16} ${cx - W * .31},${cy + H * .25} C${cx - W * .23},${cy + H * .37} ${cx - W * .39},${cy + H * .43} ${cx - W * .32},${cy + H * .56} C${cx - W * .4},${cy + H * .61} ${cx - W * .53},${cy + H * .58} ${cx - W * .62},${cy + H * .59} Z` }, geo);
            add('path', { class: 'map-river-art', d: `M${cx + W * .17},${cy - H * .62} C${cx + W * .27},${cy - H * .55} ${cx + W * .31},${cy - H * .43} ${cx + W * .22},${cy - H * .34} C${cx + W * .14},${cy - H * .23} ${cx + W * .09},${cy - H * .12} ${cx + W * .17},${cy - H * .03} C${cx + W * .26},${cy + H * .07} ${cx + W * .29},${cy + H * .15} ${cx + W * .19},${cy + H * .25} C${cx + W * .1},${cy + H * .36} ${cx + W * .14},${cy + H * .48} ${cx + W * .21},${cy + H * .62}` }, geo);
            add('path', { class: 'map-park-art', d: `M${cx - W * .12},${cy - H * .31} Q${cx - W * .02},${cy - H * .39} ${cx + W * .06},${cy - H * .29} L${cx + W * .12},${cy - H * .14} Q${cx + W * .02},${cy - H * .07} ${cx - W * .11},${cy - H * .12} Z` }, geo);
            add('path', { class: 'map-park-art', d: `M${cx - W * .11},${cy + H * .15} Q${cx - W * .01},${cy + H * .08} ${cx + W * .09},${cy + H * .17} L${cx + W * .16},${cy + H * .35} Q${cx + W * .03},${cy + H * .43} ${cx - W * .13},${cy + H * .34} Z` }, geo);
            for (const [px, py] of [[-.07,-.23],[.0,-.27],[.07,-.2],[-.06,-.16],[.02,-.12],[-.06,.22],[.04,.19],[.1,.27],[-.03,.31],[.08,.36]]) {
              const tree = add('g', { class: 'map-tree', transform: `translate(${cx + W * px} ${cy + H * py})`, 'pointer-events': 'none' }, geo);
              add('path', { d: 'M0 4v8', class: 'tree-trunk' }, tree);
              add('circle', { cx: 0, cy: 0, r: 7, class: 'tree-crown' }, tree);
              add('circle', { cx: -2.5, cy: -2, r: 2.5, class: 'tree-light' }, tree);
            }
            for (const py of [-.19, .22]) {
              add('path', { class: 'map-bridge', d: `M${cx - W * .05},${cy + H * py} L${cx + W * .42},${cy + H * py}` }, geo);
            }
            for (const [x, y, w] of [[-.43,-.36,.19],[-.4,-.28,.15],[-.39,.29,.2],[-.42,.38,.16]]) {
              add('path', { class: 'map-pier', d: `M${cx + W*x},${cy + H*y} l${W*w},${H*.025} l-${W*.01},${H*.035} l-${W*w},-${H*.025} Z` }, geo);
            }
            const districts = result.wd.districts || [];
            for (const [i, pt] of [[.31,-.37],[.37,-.04],[.34,.39]].entries()) {
              if (districts[i]) add('text', { class: 'map-district-label', x: cx + W * pt[0], y: cy + H * pt[1], 'text-anchor': 'middle' }, geo).textContent = districts[i].name;
            }
            for (const [i, pt] of [[-.02,-.47],[.4,-.2],[-.25,.09],[.34,.47],[-.48,.3]].entries()) {
              const street = result.minorNames[i % result.minorNames.length];
              add('text', { class: 'map-road-label', x: cx + W * pt[0], y: cy + H * pt[1], 'text-anchor': 'middle', transform: `rotate(${i === 1 || i === 4 ? -90 : 0} ${cx + W * pt[0]} ${cy + H * pt[1]})` }, geo).textContent = street;
            }
          }
          const inside = (p, poly) => {
            let hit = false;
            for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
              const a = poly[i], b = poly[j];
              if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < (b[0] - a[0]) * (p[1] - a[1]) / (b[1] - a[1]) + a[0]) hit = !hit;
            }
            return hit;
          };
          const grid = result.wd.grid;
          if (grid) {
            const detail = add('g', { class: 'map-block-detail', 'pointer-events': 'none' });
            for (let x = grid.ox; x < result.wd.W; x += grid.g) for (let y = grid.oy; y < result.wd.H; y += grid.g) {
              if (result.wd.sea && inside([x, y], result.wd.sea) || result.wd.lake && inside([x, y], result.wd.lake)) continue;
              add('path', { d: `M${x + 3},${y + grid.g * .25}h${grid.g - 7} M${x + 3},${y + grid.g * .72}h${grid.g - 7}` }, detail);
            }
          }
          for (const park of result.wd.parks) {
            const pts = park.pts;
            const minX = Math.min(...pts.map(p => p[0])), maxX = Math.max(...pts.map(p => p[0]));
            const minY = Math.min(...pts.map(p => p[1])), maxY = Math.max(...pts.map(p => p[1]));
            for (let row = 0; row < 3; row++) for (let col = 0; col < 4; col++) {
              const x = minX + (col + .6 + (row % 2) * .35) * (maxX - minX) / 4.7;
              const y = minY + (row + .7) * (maxY - minY) / 3.5;
              if (!inside([x, y], pts)) continue;
              const tree = add('g', { class: 'map-tree', transform: `translate(${x} ${y})`, 'pointer-events': 'none' });
              add('path', { d: 'M0 4v5', class: 'tree-trunk' }, tree);
              add('circle', { cx: 0, cy: 0, r: 5.2, class: 'tree-crown' }, tree);
              add('circle', { cx: -2, cy: -1.5, r: 2, class: 'tree-light' }, tree);
            }
          }
          if (geoLayer) result.world.appendChild(geoLayer);
          return result;
        };
      },
    },
  },
});
