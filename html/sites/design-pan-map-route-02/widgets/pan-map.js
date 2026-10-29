// Design on the shared pan-map/city template.
env.widget({
  task: 'pan-map',
  site: 'design-pan-map-route-02',
  name: 'design',
  split: 'train',
  scenarios: ['route'],
  traits: { zoom: 'both' },
  template: 'pan-map/city',
  design: {
    brand: 'Rivermere',
    panelWidth: 615,
    mapColors: {
      land: '#e2e3df', water: '#74c3ee', park: '#b8dba8', street: '#fff', road: '#ffdc80', casing: '#d5b665',
      transitRoad: '#e9a3a3', transitCasing: '#b55d5d', parkName: '#2f7a35', open: '#16824a',
      productLand: '#e8e7e1', productWater: '#67b8ea', productPark: '#b8dba8', productRoad: '#f7d36e',
      editorLand: '#e5e5df', editorRoad: '#f9faf9', editorCasing: '#c6c9c8', droppedPin: '#c74439',
    },
    parts: {
      fit: () => (ctx) => ({ width: ctx.size.width, height: ctx.size.height }),
      editorSearch: (base) => (ctx, top) => {
        const search = base(ctx, top);
        const masthead = document.querySelector('.breeze-search');
        if (masthead) {
          masthead.textContent = '';
          masthead.append(search.search.parentElement);
          search.search.placeholder = 'Search places, streets or districts...';
        }
        return search;
      },
      editorHeading: (base) => (ctx, panel) => {
        const heading = base(ctx, panel);
        heading.querySelector('.mpe-heading').textContent = 'Waypoints';
        return heading;
      },
      shellHeader: (base) => (ctx, root, editor) => {
        const head = base(ctx, root, editor);
        if (head.bar) head.bar.style.display = 'none';
        return head;
      },
      shellPanels: (base) => (ctx, root) => {
        const panes = base(ctx, root);
        panes.work.classList.add('breeze-work');
        panes.foot.style.display = 'none';
        if (panes.panel) {
          panes.panel.style.width = 'clamp(230px, 37vw, 620px)';
          panes.panel.style.flex = '0 0 clamp(230px, 37vw, 620px)';
          panes.panel.style.maxWidth = '42vw';
          panes.panel.style.borderRadius = '0';
          panes.panel.style.borderLeft = '1px solid #c5d1df';
        }
        return panes;
      },
      editorZoom: (base) => (ctx, port) => {
        const zoom = base(ctx, port);
        const box = zoom.zin && zoom.zin.parentElement;
        if (box) {
          port.style.position = 'relative';
          box.style.position = 'absolute';
          box.style.top = 'auto';
          box.style.right = 'auto';
          box.style.bottom = '18px';
          box.style.left = '18px';
          box.style.zIndex = '25';
          box.style.display = 'flex';
          box.style.flexDirection = 'column';
        }
        return zoom;
      },
      editorDirectory: (base) => (ctx, panel, commit) => {
        const directory = base(ctx, panel, commit);
        panel.style.setProperty('width', 'clamp(230px, 37vw, 620px)', 'important');
        panel.style.setProperty('flex', '0 0 clamp(230px, 37vw, 620px)', 'important');
        panel.style.setProperty('max-width', '42vw', 'important');
        const list = directory.list;
        if (list && list.children.length) {
          const marker = [...list.querySelectorAll('*')].find((node) => node.children.length === 0 &&
            node.textContent.trim().toLowerCase() === 'places on this map');
          if (marker) {
            let section = marker;
            while (section.parentElement && section.parentElement !== list) section = section.parentElement;
            const children = [...list.children];
            const split = children.indexOf(section);
            if (split > 0 && split < children.length) {
              const waypoints = list;
              const places = document.createElement('div');
              waypoints.classList.add('breeze-waypoints');
              places.className = 'breeze-places';
              children.forEach((child, i) => (i < split ? waypoints : places).appendChild(child));
              panel.style.display = 'grid';
              panel.style.gridTemplateColumns = '185px minmax(0, 1fr)';
              panel.style.gridTemplateRows = '42px minmax(0, 1fr) auto auto';
              panel.style.alignContent = 'stretch';
              panel.style.minHeight = '0';
              const head = panel.children[0];
              const settings = panel.querySelector('.mpp-controls');
              if (head) { head.style.gridColumn = '1'; head.style.gridRow = '1'; }
              if (settings) { settings.style.gridColumn = '1'; settings.style.gridRow = '4'; }
              waypoints.style.gridColumn = '1';
              waypoints.style.gridRow = '2';
              places.style.gridColumn = '2';
              places.style.gridRow = '1 / 5';
              places.style.minWidth = '0';
              places.style.overflow = 'auto';
              places.style.borderLeft = '1px solid #c5d1df';
              places.style.background = '#f8f9fb';
              const title = places.querySelector('.mpe-section');
              if (title) {
                title.className = 'breeze-directory-head';
                title.textContent = '';
                ctx.util.el('span', 'active', title, 'Places');
                ctx.util.el('span', '', title, 'Route');
                ctx.util.el('div', 'breeze-place-filter', title, 'All places');
              }
              const actions = ctx.util.el('div', 'breeze-route-actions', panel);
              actions.style.gridColumn = '1';
              actions.style.gridRow = '3';
              actions.style.margin = '0';
              actions.style.padding = '8px 10px';
              for (const [symbol, label] of [['▤', 'Remove Stop'], ['↑', 'Move Up'], ['↓', 'Move Down'], ['♧', 'Clear Route']]) {
                const b = ctx.util.el('button', 'breeze-route-secondary', actions);
                b.disabled = true;
                ctx.util.el('b', '', b, symbol);
                ctx.util.el('span', '', b, label);
              }
              panel.append(waypoints, places);
            }
          }
        }
        return directory;
      },
      editorRow: (base) => (ctx, list, p, badge) => {
        const row = base(ctx, list, p, badge);
        const categories = [
          [/cinema|screen|theater/i, 'Cinema', '#8f46b6', '▦'],
          [/cafe|diner|restaurant|room|kitchen/i, 'Restaurant', '#d7a51c', '♜'],
          [/park|trail|lookout|garden/i, 'Park', '#448b49', '♠'],
          [/market|shop|store/i, 'Market', '#20823b', '▾'],
          [/library|book/i, 'Library', '#2978d3', '▣'],
          [/museum|gallery|hall|center/i, 'Community Center', '#b3222b', '▥'],
          [/club|stage|music/i, 'Live Music Venue', '#b31e2b', '♫'],
          [/hotel|lodge/i, 'Hotel', '#8a4eb0', '▥'],
        ];
        const match = categories.find(([test]) => test.test(p.name));
        const [, category, color, symbol] = match || [null, p.label || 'Place', '#167ed0', '▣'];
        row.row.style.setProperty('--place-color', color);
        row.row.dataset.symbol = symbol;
        row.row.title = p.address || p.name;
        row.row.dataset.category = category;
        ctx.util.el('span', 'breeze-place-category', row.row, category);
        const distance = Math.hypot(p.x - ctx.spec.world.W / 2, p.y - ctx.spec.world.H / 2) * .002;
        ctx.util.el('span', 'breeze-place-distance', row.row, Math.max(.3, distance).toFixed(1) + ' km');
        return row;
      },
      editorPin: (base) => (ctx, labels, p, i) => {
        const pin = base(ctx, labels, p, i);
        const kinds = [
          [/park|trail|garden|lookout/i, '#448b49', 'tree'],
          [/cinema|screen|theater/i, '#9449b8', 'film'],
          [/cafe|diner|restaurant|kitchen|room/i, '#ce9e20', 'food'],
          [/museum|gallery|center|hall/i, '#ba252d', 'museum'],
          [/library|book/i, '#397bd9', 'book'],
          [/club|stage|music/i, '#b6232e', 'music'],
          [/market|shop/i, '#22873b', 'cart'],
        ];
        const [, color, kind] = kinds.find(([test]) => test.test(p.name)) || [null, '#2189ce', 'building'];
        const paths = {
          tree: '<path d="m12 2-6 8h3l-5 7h6v5h4v-5h6l-5-7h3z"/>',
          film: '<rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="white" stroke-width="2"/><path d="M5 5h3v3H5zm0 6h3v3H5zm0 6h3v3H5zm11-12h3v3h-3zm0 6h3v3h-3zm0 6h3v3h-3z"/>',
          food: '<path d="M5 2h2v7h1V2h2v7c0 3-2 4-2 4v9H5v-9S3 12 3 9V2h1v7h1zm12 0c-4 5-4 11-1 12v8h3V2z"/>',
          museum: '<path d="m12 2 10 6H2zM4 9h3v10H4zm7 0h3v10h-3zm7 0h3v10h-3zM2 20h20v2H2z"/>',
          book: '<path d="M2 4c4-1 7 0 10 2 3-2 6-3 10-2v16c-4-1-7 0-10 2-3-2-6-3-10-2zm9 4v11h2V8z"/>',
          music: '<path d="M9 5v12a4 4 0 1 0 2 3V8l9-2v8a4 4 0 1 0 2 3V2z"/>',
          cart: '<path d="M2 3h3l3 12h12l3-9H6v2h14l-2 5H9L7 3zm7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>',
          building: '<path d="M5 3h14v19H5zm3 3v3h3V6zm6 0v3h3V6zm-6 6v3h3v-3zm6 0v3h3v-3zm-4 6v4h4v-4z"/>',
        };
        pin.style.setProperty('--c', color);
        pin.querySelector('.mp-dot').innerHTML = `<svg viewBox="0 0 24 24" fill="white" aria-hidden="true">${paths[kind]}</svg>`;
        const directoryRow = [...document.querySelectorAll('.breeze-places .mpe-item')].find(row => row.title === (p.address || p.name));
        if (directoryRow) {
          directoryRow.querySelector('.mpe-badge').innerHTML = pin.querySelector('.mp-dot').innerHTML;
          directoryRow.style.setProperty('--place-color', color);
        }
        return pin;
      },
      editorTools: (base, S) => (ctx, port, commit) => {
        const tools = base(ctx, port, commit);
        tools.pan.title = 'Pan';
        tools.pan.setAttribute('aria-label', 'Pan');
        const column = S.els.chrome.panel.querySelector('.breeze-route-actions');
        if (column) column.prepend(tools.tools);
        return tools;
      },
      editorWorld: (base) => (ctx, port, W, H) => {
        const layers = base(ctx, port, W, H);
        layers.world.classList.add('breeze-survey-world');
        const outer = layers.world.querySelector('.mp-streets');
        if (outer) outer.classList.add('breeze-outer-grid');
        return layers;
      },
      editorPaint: (base) => (ctx, elements, model) => {
        base(ctx, elements, model);
        const { world, W, H } = elements;
        if (!world.__breezeArt) {
          world.__breezeArt = true;
          const sc = Number(world.getAttribute('transform').match(/scale\(([^)]+)/)[1]);
          const ns = 'http://www.w3.org/2000/svg';
          const add = (tag, attrs, parent) => {
            const node = document.createElementNS(ns, tag);
            for (const [key, val] of Object.entries(attrs)) node.setAttribute(key, val);
            (parent || art).appendChild(node);
            return node;
          };
          const art = document.createElementNS(ns, 'g');
          art.setAttribute('class', 'breeze-cartography');
          art.setAttribute('transform', `translate(${model.c[0] - W / 2 / sc} ${model.c[1] - H / 2 / sc}) scale(${W / 1200 / sc} ${H / 770 / sc})`);
          world.prepend(art);
          const coast = 'M210 -80C208 12 280 24 267 68S329 111 348 155 409 214 406 258 374 296 326 315 279 339 289 380 328 419 321 463 349 512 351 552 375 588 367 631 321 656 322 697 338 731 380 735 401 794 431 840L1400 840V-80Z';
          const defs = add('defs', {});
          const rough = add('filter', { id:'breeze-natural-edge', x:'-10%', y:'-10%', width:'120%', height:'120%' }, defs);
          add('feTurbulence', { type:'fractalNoise', baseFrequency:'.04', numOctaves:'3', seed:'17', result:'noise' }, rough);
          add('feDisplacementMap', { in:'SourceGraphic', in2:'noise', scale:'15', xChannelSelector:'R', yChannelSelector:'G' }, rough);
          const landClip = add('clipPath', { id: 'breeze-land' }, defs);
          add('path', { d: coast }, landClip);
          const worldClip = add('clipPath', { id:'breeze-world-land', clipPathUnits:'userSpaceOnUse' }, defs);
          add('path', { d:coast, transform:art.getAttribute('transform') }, worldClip);
          for (const node of [...world.children]) if (node.matches('.mp-streets,.mp-road,.mp-casing')) node.setAttribute('clip-path','url(#breeze-world-land)');
          const waterPattern = add('pattern', { id: 'breeze-water', width: 57, height: 41, patternUnits: 'userSpaceOnUse' }, defs);
          add('path', { d:'M8 18q4-5 8 0m15 17q4-4 8 0', fill:'none', stroke:'#c0e7fa', 'stroke-width':1.2, opacity:'.35' }, waterPattern);
          add('rect', { x:-2500, y:-2000, width:6500, height:4800, fill:'#70c1ef' });
          add('rect', { x:-2500, y:-2000, width:6500, height:4800, fill:'url(#breeze-water)' });
          add('path', { d:coast, fill:'#e1e2df', stroke:'#a3d8ed', 'stroke-width':30, 'stroke-linejoin':'round', filter:'url(#breeze-natural-edge)' });
          add('path', { d:coast, fill:'#e1e2df', stroke:'#fff0ca', 'stroke-width':17, 'stroke-linejoin':'round', filter:'url(#breeze-natural-edge)' });
          const island = 'M44 231q-10-13 10-19l13-2q7-30 25-21l10 14 18 4q20 9 7 24l-6 16 12 17q17 25-3 34l-9 9 4 20-13 12-17-12-2-18-16-11-9-20-19-5q-20-9-7-23z';
          add('path', { d:island, fill:'#bcdca9', stroke:'#a5d9ed', 'stroke-width':22, 'stroke-linejoin':'round', filter:'url(#breeze-natural-edge)' });
          add('path', { d:island, fill:'#bcdca9', stroke:'#ffedbf', 'stroke-width':7, 'stroke-linejoin':'round', filter:'url(#breeze-natural-edge)' });
          add('path', { d:'M90 234q-18 56 18 100T298 376', fill:'none', stroke:'#fcf8e7', 'stroke-width':5 });
          add('path', { d:'M45 263q33-2 49-37m-16 24q-21 11-17 32', fill:'none', stroke:'#87bc78', 'stroke-width':2, 'stroke-dasharray':'3 3' });
          const land = add('g', { 'clip-path':'url(#breeze-land)' });
          // A fine, irregular local street network replaces the survey's large blocks.
          const detail = ctx.rng.fork('breeze/cartography');
          const minor = [];
          const buildings = add('g', { fill:'#d8dad6', stroke:'#edf0eb', 'stroke-width':.65 }, land);
          const project = (x,y) => [x - .30*(y-385) + 28*Math.sin(y/180), y + .25*(x-600) + 14*Math.sin(x/210)];
          for (let x = 130; x < 1600; x += 26) {
            minor.push(Array.from({length:13},(_,i) => (i?'L':'M')+project(x,-150+i*90).join(' ')).join(''));
            for (let y = -40; y < 830; y += 24) {
              const w = detail.int(8,17), h = detail.int(9,17);
              const [px, py] = project(x+5,y+4);
              const block = add('g', { transform:`rotate(14 ${px} ${py})` }, buildings);
              add('rect', { x:px, y:py, width:w*.60, height:h*.44, rx:.5 }, block);
              add('rect', { x:px+11, y:py+1, width:w*.34, height:h*.65, rx:.5 }, block);
              add('path', { d:`M${px+1} ${py+11}h${w*.45}v3h${w*.4}v4h${-w*.85}z`, fill:'#d3d6d0' }, block);
            }
          }
          for (let y = -300; y < 1050; y += 24) minor.push(Array.from({length:15},(_,i) => (i?'L':'M')+project(130+i*100,y).join(' ')).join(''));
          add('path', { d:minor.join(''), fill:'none', stroke:'#f8f9f5', 'stroke-width':1.25 }, land);
          const parks = [
            'M235-40Q354-10 391 72T454 150Q408 191 346 160T258 65Z',
            'M994-20Q1136-3 1218 98L1196 223Q1128 199 1084 113T994-20Z',
            'M455 626Q490 599 546 621T655 636L709 718Q648 737 592 711T456 741L422 688Z',
            'M918 479q45-38 84 13l12 72-80 16Z',
          ];
          for (const d of parks) {
            add('path', { d, fill:'#bbdca7', stroke:'#d0e7bd', 'stroke-width':7, filter:'url(#breeze-natural-edge)' }, land);
            add('path', { d, fill:'none', stroke:'#7cba70', 'stroke-width':1.1, 'stroke-dasharray':'5 4' }, land);
          }
          for (let i = 0; i < 135; i++) {
            const x = detail.int(230,1190), y = detail.int(0,760);
            if ((x < 430 && y < 150) || (x > 1020 && y < 180) || (x > 445 && x < 700 && y > 641)) {
              add('circle', { cx:x, cy:y, r:detail.int(1,3), fill:'#8ec47e', opacity:'.7' }, land);
            }
          }
          const parkClip = add('clipPath', { id:'breeze-green-space' }, defs);
          for (const d of parks) add('path', {d}, parkClip);
          const foliage = add('g', {'clip-path':'url(#breeze-green-space)'}, land);
          for (let i=0;i<750;i++) {
            const x=detail.int(225,1230), y=detail.int(0,770);
            add('circle', {cx:x,cy:y,r:detail.int(1,4),fill:i%3?'#a0cc8d':'#78b874',opacity:'.65'}, foliage);
          }
          add('path', {d:'M259 5q88 30 73 81t78 79M304 0q74 48 55 81t44 89M1039 0q-27 55 61 107t52 101M462 710q60-50 104-32t111 12M481 620q11 44 76 42t113 39',fill:'none',stroke:'#7cb471','stroke-width':1.3,'stroke-dasharray':'5 3'}, foliage);
          add('path', {d:'M286 0q3 76 72 105t34 75M1040 0q79 63 61 123t74 78M444 701q73-50 119-32t136 28',fill:'none',stroke:'#f5f7e3','stroke-width':3}, foliage);
          const south = 'M740 770C716 716 731 651 793 621S912 629 958 656 1041 648 1081 665 1168 718 1240 732L1400 900H700Z';
          worldClip.firstChild.setAttribute('d', coast + south);
          worldClip.firstChild.setAttribute('clip-rule', 'evenodd');
          add('path', { d:south, fill:'#79c8f1', stroke:'#b5dfec', 'stroke-width':12, filter:'url(#breeze-natural-edge)' });
          add('path', { d:south, fill:'url(#breeze-water)', stroke:'#f7e9c7', 'stroke-width':3, filter:'url(#breeze-natural-edge)' });
          const river = 'M775-80C786 0 886 46 1001 91S1005 182 1127 210 1139 290 1230 335 1162 426 1295 480';
          add('path', { d:river, fill:'none', stroke:'#b2deec', 'stroke-width':38 });
          add('path', { d:river, fill:'none', stroke:'#79c8f1', 'stroke-width':24 });
          const roads = [
            'M414-70Q443 96 603 163T864 257 1260 406',
            'M390-40Q478 138 456 242T345 358Q301 435 381 534T463 804',
            'M324 557Q599 472 791 521T1242 718',
            'M638-20Q690 131 663 285T644 525 580 786',
            'M1038-50Q1087 102 1032 228T997 428 937 673',
          ];
          roads.forEach((d,i) => {
            add('path', { d, fill:'none', stroke:i===0?'#c7ad70':'#c4c8c4', 'stroke-width':i===0?12:9 }, land);
            add('path', { d, fill:'none', stroke:i===0?'#ffdc80':'#ffffff', 'stroke-width':i===0?9:6 }, land);
          });
          const highwayName = add('text', {x:735,y:229,fill:'#3b3d36','font-size':19,'text-anchor':'middle',transform:'rotate(22 735 229)',stroke:'#fff2cb','stroke-width':3,'paint-order':'stroke'});
          highwayName.textContent = ctx.spec.world.roads[0].name;
          for (const [x,y] of [[574,120],[905,288]]) {
            add('rect',{x,y,width:34,height:23,rx:3,fill:'#fafbfc',stroke:'#72818c','stroke-width':1});
            const shield=add('text',{x:x+17,y:y+17,'text-anchor':'middle',fill:'#37434d','font-size':16});
            shield.textContent='A1';
          }
          const districts = ctx.spec.world.districts || [];
          for (const [i, d] of districts.entries()) {
            const text = add('text', { x:[510,1060,576,918,594,913][i%6], y:[163,470,578,482,578,617][i%6], fill:'#5d6670', 'font-size':22, 'font-family':'Arial,sans-serif', 'text-anchor':'middle', stroke:'#f9faf7', 'stroke-width':4, 'paint-order':'stroke', 'font-weight':600 });
            text.textContent = d.name;
          }
          const minorNames = env.content.sample(ctx.rng.fork('breeze/street-names'), env.content.STREET_NAMES, 7, {csplit:ctx.spec.csplit});
          const namePositions = [[545,218,0],[405,380,-49],[561,539,-14],[811,557,16],[1066,601,22],[959,152,23],[688,411,16]];
          minorNames.forEach((name,i) => {
            const [x,y,a] = namePositions[i];
            const text = add('text', { x,y, fill:'#44484d','font-size':15,stroke:'#fafbf7','stroke-width':3,'paint-order':'stroke',transform:`rotate(${a} ${x} ${y})` });
            text.textContent = name;
          });
          const bay = add('text', { x:62, y:479, fill:'#1984ce', 'font-size':20, 'font-style':'italic', 'letter-spacing':1 });
          bay.textContent = 'Rivermere Bay';
          const lake = add('text', { x:864, y:728, fill:'#1984ce', 'font-size':19, 'font-style':'italic', 'letter-spacing':1 });
          lake.textContent = 'Willow Lake';
          const riverName = add('text', { x:899, y:76, fill:'#1984ce', 'font-size':18, 'font-style':'italic', transform:'rotate(24 899 76)' });
          riverName.textContent = 'Maple River';
          const scale = ctx.util.el('div', 'breeze-map-scale', world.parentElement.parentElement, '500 m');
          scale.setAttribute('aria-hidden', 'true');
          world.__breezeScale = scale;
        }
        const sc = Number(world.getAttribute('transform').match(/scale\(([^)]+)/)[1]);
        const metres = [10,20,50,100,200,250,500,1000,2000,5000].find(n => n*sc/2>=70)||5000;
        world.__breezeScale.style.width = Math.round(metres*sc/2)+'px';
        world.__breezeScale.textContent = metres>=1000 ? metres/1000+' km' : metres+' m';
        elements.roadLabels.forEach((label,i) => {
          const road = ctx.spec.world.roads[i];
          const point = road.pts[Math.floor(road.pts.length / 2)];
          label.style.left = point[0] * sc + 'px';
          label.style.top = point[1] * sc - 14 + 'px';
        });
        // Keep readable labels attached to the true, unchanged marker coordinates.
        const occupied = elements.pins.map((pin) => [parseFloat(pin.style.left)-19,parseFloat(pin.style.top)-19,38,38]);
        const tx = W/2-model.c[0]*sc, ty = H/2-model.c[1]*sc;
        elements.handles.forEach(handle => occupied.push([parseFloat(handle.style.left)-tx-20,parseFloat(handle.style.top)-ty-20,40,40]));
        elements.pins.forEach((pin,i) => {
          const name = pin.querySelector('.mp-name');
          const width = Math.min(150,Math.max(100,ctx.spec.places[i].name.length*5));
          const height = ctx.spec.places[i].name.length > 20 ? 32 : 16;
          name.style.width = width+'px';
          const px = parseFloat(pin.style.left)-15, py = parseFloat(pin.style.top)-15;
          const options = [[38,2],[-width-8,2],[0,-height-10],[0,38],[38,-height-8],[-width-8,30],[38,34],[-width-8,-height-10]];
          const overlap = ([x,y]) => occupied.reduce((sum,[a,b,w,h]) => sum + Math.max(0,Math.min(px+x+width,a+w)-Math.max(px+x,a))*Math.max(0,Math.min(py+y+height,b+h)-Math.max(py+y,b)),0);
          const [x,y] = options.reduce((best,next) => overlap(next)<overlap(best)?next:best,options[0]);
          name.style.left=x+'px'; name.style.top=y+'px'; name.classList.toggle('breeze-label-left',x<0);
          occupied.push([px+x,py+y,width,height]);
        });
        elements.stopLabels.forEach((label,i) => {
          const point = model.waypoints[i];
          const placed = ctx.spec.places.some(p => Math.hypot(p.x-point[0],p.y-point[1]) < 8);
          if (!placed) label.name.textContent = 'Add a stop...';
        });
      },
    },
  },
});
