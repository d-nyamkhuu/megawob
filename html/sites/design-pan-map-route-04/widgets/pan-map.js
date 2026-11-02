// Design on the shared pan-map/city template.
env.widget({
  task: 'pan-map',
  site: 'design-pan-map-route-04',
  name: 'design',
  split: 'train',
  scenarios: ['route'],
  traits: { zoom: 'both' },
  template: 'pan-map/city',
  design: {
    font: '15px/1.25 Arial, Helvetica, sans-serif',
    panelWidth: 460,
    mapColors: {
      land: '#e5e2db', water: '#62afe0', park: '#a9c997', street: '#f9f8f4', road: '#f6c94f',
      casing: '#d3a936', transitRoad: '#dc7373', transitCasing: '#9e4242', parkName: '#47764a',
      open: '#16824a', productLand: '#e5e2db', productWater: '#62afe0', productPark: '#a9c997',
      productRoad: '#f6c94f', editorLand: '#e5e2db', editorRoad: '#f6c94f', editorCasing: '#d3a936',
      droppedPin: '#c74439',
    },
    tierColors: { 1: '#df2626', 2: '#1769d1', 3: '#118840' },
    editorPinColor: '#111111',
    maxWidth: 1600,
    maxHeight: 900,
    widthInset: 8,
    heightInset: 8,
    minMapWidth: 500,
    maxMapWidth: 1500,
    minMapHeight: 520,
    parts: {
      editorDirectory(base, S) {
        return (ctx, panel, commit) => {
          const { util, spec } = ctx;
          const tabs = util.el('div', 'os2-panel-tabs', panel);
          for (const [label, active] of [['Places', true], ['Districts', false]]) {
            const tab = util.el('button', active ? 'active' : '', tabs, label);
            tab.type = 'button';
            tab.addEventListener('click', () => env.log('decoy', { what: 'directory-tab', label }));
          }
          const list = util.el('div', 'mpe-list os2-place-list', panel);
          const heading = util.el('div', 'os2-place-head', list);
          util.el('span', '', heading, 'Name');
          util.el('span', '', heading, 'Type');
          const glyphs = ['◉', '▧', '♜', '★', '▣', '♨', '♧', '◈', '✚', '⚑'];
          for (let i = 0; i < spec.places.length; i++) {
            const p = spec.places[i];
            const row = util.el('div', 'mpe-item os2-place-row', list);
            const button = util.el('button', 'os2-place-button', row);
            util.el('span', `os2-place-icon os2-icon-${i % glyphs.length}`, button, glyphs[i % glyphs.length]);
            const name = util.el('span', 'mpe-name', button, p.name);
            const rawType = p.kind || p.type || 'Place';
            const type = util.el('span', 'os2-place-type', button, rawType[0].toUpperCase() + rawType.slice(1));
            button.title = 'Show on map';
            button.addEventListener('click', () => commit({ ...ctx.model, c: [p.x, p.y] }));
            row.dataset.place = p.id;
          }
          const stopLabels = [];
          const sink = util.el('div', 'os2-stop-sink', panel);
          for (let i = 0; i < (spec.scenario === 'route' ? spec.stops.length : 0); i++) {
            stopLabels.push({ name: util.el('span', '', sink), address: util.el('span', '', sink) });
          }
          return { list, stopLabels };
        };
      },
      editorWorld(base, S) {
        return (ctx, port, W, H) => {
          const result = base(ctx, port, W, H);
          const { spec } = ctx;
          const world = result.world;
          const cx = spec.world.W / 2, cy = spec.world.H / 2;
          const geography = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          geography.setAttribute('class', 'os2-geography');
          const path = (cls, d) => {
            const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            p.setAttribute('class', cls); p.setAttribute('d', d); geography.appendChild(p);
          };
          const w = Math.max(W * 1.45, 1300), h = Math.max(H * 1.5, 760);
          const x = cx - w / 2, y = cy - h / 2;
          path('os2-water', `M${x-80} ${y-80} H${x+w*.18} C${x+w*.25} ${y+h*.14},${x+w*.05} ${y+h*.23},${x+w*.2} ${y+h*.34} C${x+w*.28} ${y+h*.45},${x+w*.12} ${y+h*.57},${x+w*.19} ${y+h*.68} C${x+w*.32} ${y+h*.76},${x+w*.38} ${y+h*.83},${x+w*.51} ${y+h*.82} C${x+w*.65} ${y+h*.8},${x+w*.72} ${y+h*.94},${x+w*.84} ${y+h+80} H${x-80}Z`);
          path('os2-water os2-river', `M${x+w*.58} ${y-80} C${x+w*.52} ${y+h*.18},${x+w*.76} ${y+h*.22},${x+w*.67} ${y+h*.38} C${x+w*.59} ${y+h*.49},${x+w*.82} ${y+h*.57},${x+w*.73} ${y+h*.72} C${x+w*.68} ${y+h*.84},${x+w*.9} ${y+h*.91},${x+w*.82} ${y+h+80}`);
          path('os2-shore', `M${x+w*.18} ${y-30} C${x+w*.25} ${y+h*.14},${x+w*.05} ${y+h*.23},${x+w*.2} ${y+h*.34} C${x+w*.28} ${y+h*.45},${x+w*.12} ${y+h*.57},${x+w*.19} ${y+h*.68} L${x+w*.33} ${y+h+30}`);
          const minor = [];
          const step = 56;
          for (let n = -Math.ceil(w / step); n <= Math.ceil(w / step); n++) {
            const xx = cx + n * step + Math.sin(n * 1.7) * 9;
            minor.push(`M${xx} ${cy-h}L${xx+Math.sin(n)*13} ${cy+h}`);
          }
          for (let n = -Math.ceil(h / step); n <= Math.ceil(h / step); n++) {
            const yy = cy + n * step + Math.sin(n * 2.1) * 8;
            minor.push(`M${cx-w} ${yy}L${cx+w} ${yy+Math.sin(n*.8)*9}`);
          }
          path('os2-minor-casing', minor.join(''));
          path('os2-minor-street', minor.join(''));
          for (let row = 0; row < Math.ceil(h/72); row++) {
            for (let col = 0; col < Math.ceil(w/82); col++) {
              const bx = cx-w/2 + col*82 + ((row+col)%2)*8;
              const by = cy-h/2 + row*72 + ((row*3+col)%3)*6;
              for (let n = 0; n < 6; n++) {
                const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                const xx = bx + (n%3)*26, yy = by + Math.floor(n/3)*31;
                r.setAttribute('class', 'os2-building'); r.setAttribute('x', xx); r.setAttribute('y', yy);
                r.setAttribute('width', 24 + ((row*3+col+n)%3)*5); r.setAttribute('height', 20 + ((row+col*2+n)%3)*5);
                r.setAttribute('transform', `rotate(${((row+col+n)%3)-1} ${xx} ${yy})`); geography.appendChild(r);
              }
            }
          }
          for (let a = 0; a < 3; a++) {
            const r = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const xx = cx - w*.20 + a*112;
            r.setAttribute('class', 'os2-arterial-casing');
            r.setAttribute('d', `M${xx} ${cy-h*.39} C${xx-14} ${cy-h*.18},${xx+18} ${cy-h*.02},${xx+5} ${cy+h*.19}`);
            geography.appendChild(r);
            const road = r.cloneNode(true); road.setAttribute('class', 'os2-arterial'); geography.appendChild(road);
          }
          for (const road of spec.world.roads) {
            if (!road.pts.length) continue;
            const a = road.pts[Math.floor((road.pts.length-1)*.4)], b = road.pts[Math.ceil((road.pts.length-1)*.6)];
            const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            t.setAttribute('class', 'os2-road-name'); t.setAttribute('x', (a[0]+b[0])/2); t.setAttribute('y', (a[1]+b[1])/2-8);
            t.textContent = road.name; geography.appendChild(t);
          }
          path('mp-park', `M${cx-w*.18} ${cy-h*.24} l90 -18 52 43 -22 72 -96 8 -45 -49Z`);
          path('mp-park', `M${cx+w*.17} ${cy+h*.12} l82 -30 48 52 -21 76 -91 13 -38 -51Z`);
          path('mp-park', `M${cx-w*.08} ${cy+h*.33} l82 -20 47 41 -35 62 -90 -4 -35 -39Z`);
          const districts = [
            ['WEST END', cx-w*.30, cy-h*.18], ['NORTHGATE', cx+w*.03, cy-h*.30],
            ['RIVERDALE', cx+w*.36, cy-h*.30], ['OLD TOWN', cx-w*.02, cy+h*.16],
            ['EASTWOOD', cx+w*.34, cy+h*.16], ['HARBOR VIEW', cx+w*.08, cy+h*.37],
          ];
          for (const [label, dx, dy] of districts) {
            const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            t.setAttribute('class', 'os2-district'); t.setAttribute('x', dx); t.setAttribute('y', dy); t.textContent = label;
            geography.appendChild(t);
          }
          world.insertBefore(geography, world.firstChild);
          for (const cls of ['os2-water', 'os2-river', 'os2-shore']) {
            const feature = geography.querySelector(`.${cls}`);
            if (feature) world.appendChild(feature.cloneNode(true));
          }
          return result;
        };
      },
      editorTools(base, S) {
        return (ctx, port, commit) => {
          const result = base(ctx, port, commit);
          port.parentElement.appendChild(result.tools);
          return result;
        };
      },
      editorPin(base, S) {
        return (ctx, labels, place, index) => {
          const { util } = ctx;
          const pin = util.el('div', 'mp-pin os2-map-place', labels);
          pin.style.setProperty('--c', '#222');
          const glyphs = ['◉', '▧', '♜', '★', '▣', '♨', '♧', '◈', '✚', '⚑'];
          const marker = util.el('div', `mp-dot os2-place-symbol os2-icon-${index % glyphs.length}`, pin, glyphs[index % glyphs.length]);
          marker.setAttribute('aria-hidden', 'true');
          const name = util.el('div', 'mp-name', pin, place.name);
          name.title = place.name;
          return pin;
        };
      },
      handle(base, S) {
        return (ctx, port, index) => {
          const handle = base(ctx, port, index);
          handle.classList.add(`os2-waypoint-${index + 1}`);
          return handle;
        };
      },
    },
  },
});
