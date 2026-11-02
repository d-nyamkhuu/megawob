// Design on the shared pan-map/city template.
env.widget({
  task: 'pan-map',
  site: 'design-pan-map-zoomto-05',
  name: 'design',
  split: 'train',
  scenarios: ['zoomto'],
  traits: { zoom: 'both' },
  template: 'pan-map/city',
  design: {
    parts: {
      editorDirectory(base, S) {
        return function(ctx, panel, commit) {
        const out = base(ctx, panel, commit), panelRoot = out.list.parentElement;
        const util = ctx.util, places = ctx.spec.places;
        const heading = util.el('div', 'rm-places-head', null, '⌂  Places');
        panelRoot.insertBefore(heading, out.list);
        places.forEach((place, i) => {
          const button = out.list.children[i] && out.list.children[i].querySelector('button');
          if (!button) return;
          const kind = String(place.kind || place.type || place.label || 'Place');
          util.el('span', 'rm-kind', button, /station/i.test(kind) ? 'Station' : /park/i.test(kind) ? 'Park' : /district/i.test(kind) ? 'District' : kind);
        });
        const section = (title) => {
          const box = util.el('section', 'rm-table', panelRoot);
          util.el('div', 'rm-table-head', box, title);
          const body = util.el('div', 'rm-table-body', box);
          return body;
        };
        const rows = (body, entries) => entries.forEach(([a, b]) => {
          const row = util.el('div', 'rm-table-row', body);
          util.el('span', '', row, a); util.el('span', '', row, b);
        });
        const counts = section('▥  Counts');
        const kinds = places.reduce((a, p) => { const k = String(p.kind || p.type || '').toLowerCase(); if (/station/.test(k)) a.stations++; else if (/park/.test(k)) a.parks++; else if (!/district/.test(k)) a.venues++; return a; }, { stations: 0, parks: 0, venues: 0 });
        rows(counts, [['Total places', places.length], ['Stations', kinds.stations], ['Venues', kinds.venues], ['Parks', ctx.spec.world.parks.length], ['Districts', new Set(places.map(p => p.district)).size]]);
        const status = section('ⓘ  Map Status');
        rows(status, [['Zoom level', ctx.model.z], ['Centre at', ctx.model.c.map(v => Math.round(v)).join(', ')], ['Map area', 'Rivermere'], ['Active tool', 'Place marker']]);
        status.children[0].dataset.rmStatus = 'zoom';
        status.children[1].dataset.rmStatus = 'centre';
        return out;
        };
      },
      editorPaint(base, S) {
        return function(ctx, elements, model) {
          base(ctx, elements, model);
          const port = document.querySelector('.mpe-port');
          const cart = port && port.querySelector('.rm-cartography');
          if (cart && !cart.dataset.fitted) {
            const parent = cart.parentNode, matrix = parent.getScreenCTM();
            if (matrix && matrix.a) {
              const box = port.getBoundingClientRect();
              const point = new DOMPoint(box.left, box.top).matrixTransform(matrix.inverse());
              cart.setAttribute('transform', `translate(${point.x} ${point.y}) scale(${box.width / 1672 / matrix.a} ${box.height / 720 / matrix.d})`);
              cart.dataset.fitted = 'true';
            }
          }
          if (port) {
            const occupied = [];
            port.querySelectorAll('.mp-name').forEach(name => {
              name.style.visibility = '';
              const pin = name.parentElement;
              if (pin.style.display === 'none') return;
              const box = name.getBoundingClientRect();
              const overlap = occupied.some(r => box.left < r.right + 7 && box.right > r.left - 7 && box.top < r.bottom + 4 && box.bottom > r.top - 4);
              if (overlap) name.style.visibility = 'hidden';
              else occupied.push(box);
            });
          }
          const zoom = document.querySelector('[data-rm-status="zoom"] span:last-child');
          const centre = document.querySelector('[data-rm-status="centre"] span:last-child');
          const sin = document.querySelector('.mpp-search input');
          if (sin) sin.placeholder = 'Search places, addresses or districts...';
          if (zoom) zoom.textContent = String(model.z);
          if (centre) centre.textContent = model.c.map(v => Math.round(v)).join(', ');
        };
      },
      editorPin(base, S) {
        return function(ctx, labels, place, index) {
          const pin = base(ctx, labels, place, index), dot = pin.querySelector('.mp-dot');
          const kind = `${place.kind || ''} ${place.type || ''} ${place.label || ''} ${place.name || ''}`.toLowerCase();
          const match = kind.match(/hospital|station|park|museum|theatre|theater|library|market|hotel|harbour|harbor/);
          const iconPaths = {
            hospital:'<path d="M10 1h8v9h9v8h-9v9h-8v-9H1v-8h9z" fill="currentColor"/>',
            station:'<rect x="6" y="2" width="17" height="21" rx="3"/><path d="M9 6h11v8H9zM7 28l4-6m12 6-4-6"/><circle cx="11" cy="18" r="1"/><circle cx="19" cy="18" r="1"/>',
            library:'<path d="M14 6Q7 1 2 5v20q7-4 12 0 7-4 13 0V5q-7-4-13 1v19M6 8v11m4-11v11m8-11v11m5-11v11"/>',
            market:'<path d="M2 11h25l-3 14H5zM8 11l6-9 7 9M8 15v6m6-6v6m6-6v6"/>',
            school:'<path d="M7 29V2m1 1q6-4 14 0l-3 6 3 5q-8-4-14 0" fill="currentColor"/>',
            camera:'<path d="M2 8h6l3-5h9l3 5h4v18H2z"/><circle cx="15" cy="17" r="6"/>',
            hall:'<path d="M5 1h18v28H5zM1 29h27M9 6h3m5 0h3M9 11h3m5 0h3M9 16h3m5 0h3M12 29v-8h6v8"/>',
            park:'<path d="M15 0L7 12h4L4 22h9v7h4v-7h9l-8-10h4z" fill="currentColor"/>',
            building:'<path d="M2 9L14 2l12 7zM4 12h21M3 26h23M6 12v11m6-11v11m6-11v11m6-11v11"/>'
          };
          const type = match && match[0] || (/photo|studio/.test(kind) ? 'camera' : /school|college|community/.test(kind) ? 'school' : /hall|hotel/.test(kind) ? 'hall' : /row|canoe|concert|gallery/.test(kind) ? ['library','market','building'][index % 3] : 'building');
          dot.innerHTML = '<svg viewBox="0 0 29 30" aria-hidden="true">' + (iconPaths[type] || iconPaths.building) + '</svg>';
          pin.style.setProperty('--c', '#111');
          pin.setAttribute('aria-label', place.name || `Place ${index + 1}`);
          return pin;
        };
      },
      editorWorld(base, S) {
        return function(ctx, port, W, H) {
        const out = base(ctx, port, W, H), { world, labels, roadLabels } = out;
        const spec = ctx.spec, c = spec.world.W / 2, cy = spec.world.H / 2;
        world.replaceChildren();
        const svg = world.ownerSVGElement, ns = 'http://www.w3.org/2000/svg';
        const add = (tag, attrs) => { const e = document.createElementNS(ns, tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); world.append(e); return e; };
        if (!svg.querySelector('#rm-hatch')) {
          const defs = document.createElementNS(ns, 'defs');
          defs.innerHTML = '<pattern id="rm-hatch" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(-20)"><rect width="26" height="26" fill="#7d93a8"/><path d="M0 6 Q6 0 13 6 T26 6 M0 19 Q6 13 13 19 T26 19" stroke="#3f566b" stroke-width="3" fill="none"/></pattern><pattern id="rm-dots" width="22" height="22" patternUnits="userSpaceOnUse"><rect width="22" height="22" fill="#e6e6e6"/><circle cx="5" cy="6" r="2.2" fill="#444"/><circle cx="16" cy="15" r="2.2" fill="#444"/><circle cx="17" cy="4" r="1.6" fill="#666"/></pattern>';
          svg.insertBefore(defs, svg.firstChild);
        }
        const cart = add('g', {class:'rm-cartography'});
        const draw = (tag, attrs, parent = cart) => { const e = document.createElementNS(ns, tag); for (const [k,v] of Object.entries(attrs)) e.setAttribute(k,v); parent.append(e); return e; };
        const defs = document.createElementNS(ns, 'defs');
        defs.innerHTML = '<pattern id="gem-water" width="9" height="9" patternUnits="userSpaceOnUse"><rect width="9" height="9" fill="#a5bac2"/><path d="M-2 9L9-2M3 12L12 3" stroke="#4b6570" stroke-width=".8"/></pattern><pattern id="gem-lake" width="12" height="8" patternUnits="userSpaceOnUse"><rect width="12" height="8" fill="#a5bac2"/><path d="M-2 3Q1 0 4 3T10 3T16 3" fill="none" stroke="#526b75" stroke-width=".8"/></pattern><pattern id="gem-park" width="19" height="17" patternUnits="userSpaceOnUse"><rect width="19" height="17" fill="#e8e8e6"/><path d="M2 3l1 1m7 0l1-1m5 5l1 2M4 11l1 2m6-3l1 1m5 4l1 1M7 7l1-1M1 16l1-1" stroke="#353b39" stroke-width="1.6"/></pattern><pattern id="gem-blocks" width="83" height="61" patternUnits="userSpaceOnUse" patternTransform="rotate(14)"><rect width="83" height="61" fill="#ededeb"/><path d="M0 0H83V61H0zM34 0v61M0 26h83" stroke="#b6b7b5" stroke-width="1" fill="none"/><path d="M0 0H83M0 0V61" stroke="#fff" stroke-width="9"/><path d="M41 5v17m5 8v25M5 34h25m30-4v25" stroke="#d2d2d0" stroke-width="1"/></pattern>';
        svg.insertBefore(defs,svg.firstChild);
        const blocks = defs.querySelector('#gem-blocks');
        [[6,6,23,15],[40,5,35,15],[6,33,21,20],[42,34,13,20],[61,33,14,20]].forEach(([x,y,width,height], i) => {
          const e = document.createElementNS(ns, 'rect');
          Object.entries({x,y,width,height,fill:i%2 ? '#d9d9d7' : '#e0e0de',stroke:'#c2c2bf','stroke-width':.7}).forEach(([k,v])=>e.setAttribute(k,v));
          blocks.insertBefore(e, blocks.children[1]);
        });
        draw('rect',{x:-4000,y:-4000,width:10000,height:9000,fill:'url(#gem-blocks)'});
        const coast = 'M-100-100H830C789 36 752 58 703 65S620 77 570 107S498 144 480 164S409 189 370 217S330 255 291 239S231 213 217 246S265 282 248 318S240 396 199 431S120 449 82 475S61 518 20 544L-100 560Z';
        const parkNorth = 'M807-40H1700V459C1652 431 1591 436 1569 409S1527 365 1486 349S1447 307 1411 293S1363 263 1353 226S1303 194 1260 177S1194 170 1190 133S1141 109 1138 72S1102 41 1083 63L1076 138C1002 147 970 128 925 127S841 128 788 104L741 113Z';
        draw('path',{d:parkNorth,fill:'url(#gem-park)',stroke:'#666','stroke-width':1.2});
        draw('path',{d:'M46 564Q93 471 161 457L264 490 252 641 57 626Z',fill:'url(#gem-park)',stroke:'#666'});
        draw('path',{d:'M432 220Q500 127 623 106L671 88 646 206 550 246Z',fill:'url(#gem-park)',stroke:'#777'});
        draw('path',{d:coast,fill:'none',stroke:'#f8f8f5','stroke-width':23});
        draw('path',{d:coast,fill:'url(#gem-water)',stroke:'#26363d','stroke-width':1.3});
        draw('path',{d:'M23 287Q29 251 63 228T103 187Q118 154 144 169T174 206L158 252Q146 279 113 284L77 309Z',fill:'url(#gem-park)',stroke:'#222','stroke-width':1.4});
        draw('path',{d:'M1149 66C1184 61 1174 107 1202 113S1231 111 1260 139S1339 179 1370 207S1408 222 1417 257S1457 267 1464 292L1538 383 1570 395 1485 416 1418 362 1349 321 1311 300 1238 294 1188 264 1144 244Q1105 242 1114 200L1135 136Q1149 119 1138 101Z',fill:'url(#gem-lake)',stroke:'#33474c','stroke-width':1.4});
        draw('path',{d:'M889 760Q944 660 1028 618T1176 549 1332 489 1469 481T1722 435',fill:'none',stroke:'#34484e','stroke-width':66});
        draw('path',{d:'M889 760Q944 660 1028 618T1176 549 1332 489 1469 481T1722 435',fill:'none',stroke:'url(#gem-lake)','stroke-width':63});
        const road = (d, width=12) => {draw('path',{d,fill:'none',stroke:'#252525','stroke-width':width+2,'stroke-linejoin':'round'});draw('path',{d,fill:'none',stroke:'#fafaf8','stroke-width':width,'stroke-linejoin':'round'});};
        road('M19 567Q78 458 161 457T248 337 291 265Q351 226 412 203T515 145 648 83 763 40L795-20',13);
        road('M237 202Q226 259 291 265L620 333Q913 356 1100 348T1411 307 1700 283',11);
        road('M-20 638L242 731M183 453Q325 495 543 503T850 536 1043 548Q1239 429 1394 416T1690 403',12);
        road('M741 57L718 181 681 337 619 488 562 760',11);
        road('M1087-40L1076 139 1094 297 1118 415 1166 632',12);
        road('M678 149L809 175Q929 180 1078 176',10);
        road('M292 727L455 760M1 576L451 726 846 809',11);
        road('M281 760L280 541Q271 421 311 447L496 496',10);
        const rail = 'M55 321Q71 391 160 404T282 451 541 550Q690 563 777 620T903 736';
        draw('path',{d:rail,fill:'none',stroke:'#242424','stroke-width':7});
        draw('path',{d:rail,fill:'none',stroke:'#eee','stroke-width':4});
        draw('path',{d:rail,fill:'none',stroke:'#111','stroke-width':3,'stroke-dasharray':'8 6'});
        const text=(t,x,y,cls,rotate=0)=>{const e=draw('text',{x,y,class:cls,'text-anchor':'middle',transform:`rotate(${rotate} ${x} ${y})`});e.textContent=t;return e;};
        [['RIVERSIDE',526,268],['DOWNTOWN',665,465],['West End',400,420],['MARKET DISTRICT',566,620],['Oakwood',913,243],['District',913,272],['Maplewood',1030,445],['District',1030,474],['Lakeside',1200,669],['District',1200,698]].forEach(([t,x,y])=>text(t,x,y,'gem-district'));
        [['North Bay',320,96],['Cedar Lake',1210,196],['Mill River',1037,633]].forEach(([t,x,y])=>text(t,x,y,'gem-water-label',t==='Mill River'?-41:0));
        [['Riverside Park',553,173],['Pine Hill',909,70],['Lakeside Park',1228,49],['Oak Park',133,566],['Harbor',100,237],['Island',100,258]].forEach(([t,x,y])=>text(t,x,y,'gem-park-label'));
        const names=spec.world.roads.map(r=>r.name);
        [[names[0]||'Maple Avenue',884,173,3],[names[1]||'Grand Avenue',786,345,2],[names[2]||'Elm Street',791,527,6],[names[3]||'Riverton Road',710,252,-78],[names[4]||'Cedar Street',1126,459,75],[names[5]||'Pine Street',707,704,12]].forEach(([t,x,y,r])=>text(t,x,y,'gem-road-label',r));
        [[130,196],[145,520],[181,538],[216,558],[468,199],[574,195],[823,50],[844,92],[870,106],[971,106],[1171,40],[1285,97]].forEach(([x,y])=>draw('path',{d:`M${x} ${y-14}l-7 13h4l-7 11h8v7h4v-7h8l-7-11h4Z`,fill:'#4c5853'}));
        roadLabels.forEach(e=>e.style.display='none');
        return out;
        };
      }
    }
  },
});
