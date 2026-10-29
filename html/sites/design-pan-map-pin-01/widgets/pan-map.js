// Design on the shared pan-map/city template.
(() => {
const symbols = {
  search: 'M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14M15 15l6 6',
  pin: 'M12 22S4 13 4 8a8 8 0 1 1 16 0c0 5-8 14-8 14z M12 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6',
  pan: 'M4 2l16 12-9 1-3 7z M12 14l5 8',
  route: 'M4 19l7-12 9 3M4 16a3 3 0 1 0 0 6 3 3 0 0 0 0-6M11 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6M20 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6',
  area: 'M2 2h20v20H2z',
  train: 'M5 3h14v14H5zM8 7h8v5H8zM8 17l-3 5M16 17l3 5M7 15h2M15 15h2',
  bed: 'M2 21V6M2 16h20v5M22 16V9H10v7M5 9h3v4H5z',
  food: 'M4 2v8M8 2v8M2 6h8M6 10v12M18 2c-5 5-5 10 0 10V2v20',
  bag: 'M4 8h16l1 14H3zM8 9V5a4 4 0 0 1 8 0v4',
  museum: 'M2 7l10-5 10 5zM3 22h18M4 19h16M6 9v9M10 9v9M14 9v9M18 9v9',
  cap: 'M1 8l11-5 11 5-11 5zM5 11v7c5 4 9 4 14 0v-7M22 9v10',
  health: 'M9 2h6v7h7v6h-7v7H9v-7H2V9h7z',
  people: 'M8 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8M18 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6M1 22v-5a7 7 0 0 1 14 0v5zM17 12c5 0 6 3 6 6v4h-6',
  book: 'M12 5C7 2 3 3 2 4v16c5-2 8-1 10 1 2-2 5-3 10-1V4c-1-1-5-2-10 1v16',
  camera: 'M3 7h4l2-4h6l2 4h4v14H3zM12 9a4 4 0 1 0 0 8 4 4 0 0 0 0-8',
  tree: 'M12 1L5 10h4l-7 8h8v5h4v-5h8l-7-8h4z',
  cart: 'M1 3h4l3 13h11l3-10H6M10 7v6M15 7v6M7 20h2M17 20h2',
};
function aquaIcon(parent, name, color) {
  const svg = env.util.svg('svg', { viewBox:'0 0 24 24', width:26, height:26, fill:'none', stroke:color || 'currentColor', 'stroke-width':2.2, 'stroke-linejoin':'round', 'stroke-linecap':'round', 'aria-hidden':'true' }, parent);
  env.util.svg('path', {d:symbols[name] || symbols.pin}, svg);
  if (['pin','pan','cap','health','people','tree'].includes(name)) {
    svg.setAttribute('fill', color || 'currentColor');
    svg.setAttribute('fill-rule','evenodd');
  }
  if (name === 'area') svg.setAttribute('stroke-dasharray','3 2');
  return svg;
}
env.widget({
  task: 'pan-map',
  site: 'design-pan-map-pin-01',
  name: 'design',
  split: 'train',
  scenarios: ['pin'],
  traits: { zoom: 'both' },
  template: 'pan-map/city',
  design: {
    font: '12px/1.4 "Lucida Grande", "Lucida Sans Unicode", Arial, sans-serif',
    brand: 'City Map',
    panelWidth: 320,
    narrowPanelWidth: 220,
    maxWidth: 1640,
    maxHeight: 900,
    widthInset: 10,
    heightInset: 8,
    mapColors: {
      land: '#e9e5d7', water: '#7dc5ed', park: '#b8dca2', street: '#fffdf7', road: '#f8d46e', casing: '#d5b65c',
      transitRoad: '#8cc8e9', transitCasing: '#438dba', parkName: '#2f7a45', open: '#16824a',
      productLand: '#e9e5d7', productWater: '#7dc5ed', productPark: '#b8dca2', productRoad: '#f8d46e',
      editorLand: '#e9e5d7', editorRoad: '#f8d46e', editorCasing: '#d5b65c', droppedPin: '#d94735'
    },
    tierColors: { 1: '#1976d2', 2: '#1389bd', 3: '#6948ce' },
    venueColor: '#177fd0',
    editorPinColor: '#147fd0',
    maxMapWidth: 1380,
    minMapWidth: 380,
    minMapHeight: 300,
    parts: {
      shellHeader: (base) => (ctx, root, editor) => {
        const chrome = base(ctx, root, editor);
        if (chrome && chrome.bar) chrome.bar.style.display = 'none';
        return chrome;
      },
      shellPanels: (base) => (ctx, root) => {
        const panels = base(ctx, root);
        if (panels.rail) panels.rail.style.display = 'none';
        if (panels.foot) panels.foot.style.display = 'none';
        if (panels.status) panels.status.style.display = 'none';
        if (panels.drawer) panels.drawer.style.display = 'none';
        if (panels.panel) panels.panel.style.order = '3';
        if (panels.work) {
          panels.work.style.display = 'flex';
          panels.work.style.flexDirection = 'row';
          panels.work.style.minWidth = '0';
          panels.work.style.width = '100%';
        }
        return panels;
      },
      editorFrame: (base) => (ctx, work) => {
        const frame = base(ctx, work);
        const column = ctx.util.el('aside', 'aqua-map-tools');
        ctx.util.el('div', 'aqua-tools-title', column, 'Search for a place or address:');
        const input = document.querySelector('input[placeholder*="Search places"]');
        if (input) {
          input.classList.add('aqua-search-input');
          // Keep the template's top anchor as the visible search well.
          const field = input.closest('.mpp-top');
          const results = document.querySelector('.mpe-results');
          Array.from(field.children).forEach(child => { child.style.display = 'none'; });
          field.className = 'aqua-search-field';
          column.appendChild(field);
          aquaIcon(field, 'search');
          field.appendChild(input);
          if (results) field.appendChild(results);
        }
        const toolsTitle = document.createElement('div');
        toolsTitle.className = 'aqua-tools-subtitle';
        toolsTitle.textContent = 'Tools';
        column.appendChild(toolsTitle);
        work.insertBefore(column, frame.map);
        frame.map.classList.add('aqua-map-frame');
        return { ...frame, W:frame.port.clientWidth, H:frame.port.clientHeight };
      },
      editorTools: (base) => (ctx, port, commit) => {
        const result = base(ctx, port, commit);
        const column = document.querySelector('.aqua-map-tools');
        if (column) {
          result.edit.querySelector('svg')?.remove();
          aquaIcon(result.edit, 'pin');
          column.appendChild(result.edit);
          for (const [label, symbol] of [['Add Route Stop','route'],['Draw Area','area']]) {
            const button = ctx.util.el('button', 'aqua-secondary-tool', column, label);
            aquaIcon(button, symbol);
            button.addEventListener('click', () => env.log('decoy', {label}));
          }
          result.pan.querySelector('svg')?.remove();
          aquaIcon(result.pan, 'pan');
          column.appendChild(result.pan);
          result.tools.hidden = true;
        }
        return result;
      },
      editorDirectory: (base) => (ctx, panel, commit) => {
        const result = base(ctx, panel, commit);
        if (result.list) result.list.style.display = 'none';
        const summary = document.createElement('section');
        summary.className = 'aqua-summary';
        const taskNote = document.querySelector('.ref-body>.ref-panel');
        if (taskNote) summary.appendChild(taskNote);
        const heading = ctx.util.el('h3', '', summary, 'Places');
        ctx.util.el('b', '', heading, String(ctx.spec.places.length));
        const categoryOf = p => /hotel|lodge|inn|room/i.test(p.name) ? 'Accommodation' : /station|terminal/i.test(p.name) ? 'Transport' : /shop|market|store/i.test(p.name) ? 'Shops' : /school|college/i.test(p.name) ? 'Education' : /hospital|clinic/i.test(p.name) ? 'Health' : /community|club/i.test(p.name) ? 'Community' : /cafe|restaurant|bar|kitchen/i.test(p.name) ? 'Food & Drink' : 'Culture & Leisure';
        const categories = [['All Places','book','#1681ec'], ['Transport','train','#147ae1'], ['Accommodation','bed','#147ae1'], ['Food & Drink','food','#147ae1'], ['Shops','bag','#804bde'], ['Culture & Leisure','museum','#444361'], ['Education','cap','#0884bf'], ['Health','health','#e95146'], ['Community','people','#078bbc']];
        categories.forEach(([name, icon, color, count], i) => {
          const row = ctx.util.el('div', 'aqua-category' + (!i ? ' selected' : ''), summary);
          aquaIcon(row, icon, !i ? '#e9f5ff' : color);
          ctx.util.el('label', '', row, name);
          ctx.util.el('span', '', row, String(!i ? ctx.spec.places.length : ctx.spec.places.filter(p => categoryOf(p) === name).length));
        });
        ctx.util.el('hr', '', summary);
        const districts = [...new Set(ctx.spec.places.map(p => p.district).filter(Boolean))];
        const dh = ctx.util.el('h3', '', summary, 'Districts');
        ctx.util.el('b', '', dh, String(districts.length));
        districts.forEach(name => {
          const row = ctx.util.el('div', 'aqua-district-row', summary, name);
          ctx.util.el('span', '', row, String(ctx.spec.places.filter(p => p.district === name).length));
        });
        Array.from(panel.children).forEach((child) => { child.style.display = 'none'; });
        panel.appendChild(summary);
        return result;
      },
      editorPin: (base) => (ctx, layer, place, index) => {
        const pin = base(ctx, layer, place, index);
        const name = place.name.toLowerCase();
        const kind = /hotel|lodge|inn|room/.test(name) ? 'bed' : /station|terminal/.test(name) ? 'train' : /park|garden/.test(name) ? 'tree' : /library|book/.test(name) ? 'book' : /shop|market|store/.test(name) ? 'bag' : /school|college/.test(name) ? 'cap' : /hospital|clinic/.test(name) ? 'health' : /community|club/.test(name) ? 'people' : /museum|church/.test(name) ? 'museum' : /cafe|restaurant|bar|kitchen/.test(name) ? 'food' : 'camera';
        const dot = pin.querySelector('.mp-dot');
        dot.replaceChildren(); aquaIcon(dot, kind);
        pin.style.setProperty('--c', kind === 'bag' ? '#854ed8' : kind === 'health' ? '#e65449' : kind === 'tree' ? '#3d984b' : '#1685cb');
        pin.dataset.id = place.id;
        return pin;
      },
      editorWorld: (base) => (ctx, port, W, H) => {
        const result = base(ctx, port, W, H); // Includes every original survey-building draw.
        result.world.querySelectorAll('.mpe-block,.mp-streets,.mp-park').forEach(node => node.remove());
        const sv = (tag, attrs, parent) => env.util.svg(tag, attrs, parent);
        const art = sv('g', {'class':'aqua-cartography','pointer-events':'none'}, null);
        result.world.prepend(art);
        const defs = sv('defs', {}, art);
        const water = sv('linearGradient', {id:'aqua-water',x1:'0%',y1:'0%',x2:'80%',y2:'100%'},defs);
        sv('stop',{offset:'0','stop-color':'#89cbed'},water); sv('stop',{offset:'1','stop-color':'#83c5e9'},water);
        const ripples = sv('pattern',{id:'aqua-ripples',width:117,height:71,patternUnits:'userSpaceOnUse'},defs);
        sv('path',{d:'M4 12q23-2 42 0M61 36q16-3 39 0M10 57q23-2 39 0M80 9h16',fill:'none',stroke:'#dcf6ff','stroke-width':1,opacity:.13},ripples);
        const city = sv('pattern', {id:'aqua-city',width:288,height:267,patternUnits:'userSpaceOnUse',patternTransform:'rotate(22)'},defs);
        sv('rect',{width:288,height:267,fill:'#deddd3'},city);
        const r = ctx.rng.fork('aqua/cartographic-detail');
        for (let x=5;x<286;x+=15) for(let y=5;y<266;y+=18) {
          sv('path',{d:`M${x} ${y}h${r.int(7,12)}v${r.int(9,14)}h-6v-3h-4z`,fill:r.pick(['#d5d4ca','#e8e5db','#dbd9ce','#cdd0c3']),stroke:'#f1eee5','stroke-width':.8},city);
        }
        const minor=[];
        for(let x=0;x<=288;x+=32) minor.push(`M${x} 0L${x+r.int(-3,3)} 89L${x+r.int(-4,4)} 178L${x} 267`);
        for(let y=0;y<267;y+=30) minor.push(`M0 ${y}L96 ${y+r.int(-3,3)}L192 ${y+r.int(-3,3)}L288 ${y}`);
        sv('path',{d:minor.join(''),fill:'none',stroke:'#bfc0b4','stroke-width':6},city);
        sv('path',{d:minor.join(''),fill:'none',stroke:'#fffdf4','stroke-width':3.6},city);
        const landD = 'M-200-200H65C46-120 37-50 37 5C112-12 170 19 157 53C145 80 193 105 239 127C299 150 307 200 374 215C435 229 480 254 549 268C615 283 688 285 742 319L792 342C825 306 840 263 826 233C802 197 748 204 737 166C712 120 682 116 675 82C668 40 696 8 722-9L740-200H1200V1100H-200Z';
        const land = sv('clipPath',{id:'aqua-land'},defs); sv('path',{d:landD},land);
        const riverD = 'M911-60C838 40 953 76 915 161S864 276 866 346S820 429 889 489S962 564 932 631S891 740 1042 839';
        sv('rect',{x:-2000,y:-2000,width:5000,height:5000,fill:'url(#aqua-city)'},art);
        sv('rect',{x:-200,y:-200,width:1400,height:1300,fill:'url(#aqua-water)'},art);
        sv('rect',{x:-200,y:-200,width:1400,height:1300,fill:'url(#aqua-ripples)'},art);
        sv('path',{d:landD,fill:'url(#aqua-city)',stroke:'#f5edc5','stroke-width':14},art);
        sv('path',{d:riverD,fill:'none',stroke:'#b4d79c','stroke-width':98},art);
        sv('path',{d:riverD,fill:'none',stroke:'#f7ecc4','stroke-width':78},art);
        sv('path',{d:riverD,fill:'none',stroke:'url(#aqua-water)','stroke-width':67},art);
        const green = sv('g',{'clip-path':'url(#aqua-land)'},art);
        const parkD = 'M282 604C315 561 459 583 502 623C576 699 514 808 438 834C366 865 318 827 283 758C250 710 245 643 282 604Z';
        const northPark = 'M719-30C762-6 818-29 872-3L865 58C896 96 887 138 866 186L836 262C815 247 801 212 782 200C741 184 707 141 685 112C661 75 679 18 719-30Z';
        sv('path',{d:parkD,fill:'#b8dca0',stroke:'#d6e9b7','stroke-width':10},green);
        sv('path',{d:northPark,fill:'#b3d69c',stroke:'#d4e5af','stroke-width':8},green);
        sv('path',{d:'M35 2C68-9 111-3 137 14C157 28 141 52 121 60C99 70 90 96 61 100L38 85C32 58 44 34 35 2Z',fill:'#bad8a1',stroke:'#e6e8c2','stroke-width':5},green);
        const lakeD='M305 654C337 615 420 614 466 644C511 673 488 713 446 733C407 754 391 775 372 815C343 794 321 757 298 727C282 700 285 677 305 654Z';
        sv('path',{d:lakeD,fill:'url(#aqua-water)',stroke:'#b4dfdc','stroke-width':5},green);
        const dry = sv('mask',{id:'aqua-dry',x:-200,y:-200,width:1400,height:1300,maskUnits:'userSpaceOnUse'},defs);
        sv('rect',{x:-200,y:-200,width:1400,height:1300,fill:'white'},dry);
        sv('path',{d:lakeD,fill:'black',stroke:'black','stroke-width':5},dry);
        sv('path',{d:riverD,fill:'none',stroke:'black','stroke-width':75},dry);
        const vegetation = sv('g',{mask:'url(#aqua-dry)'},green);
        const tree = sv('g',{id:'aqua-tree'},defs);
        sv('path',{d:'M0 3v7',stroke:'#a3bb83','stroke-width':1.2},tree);
        const canopy = sv('linearGradient',{id:'aqua-canopy',x1:'0%',y1:'0%',x2:'75%',y2:'100%'},defs);
        sv('stop',{offset:0,'stop-color':'#c4dfa6'},canopy);sv('stop',{offset:1,'stop-color':'#a6cb8d'},canopy);
        sv('path',{d:'M-5 4C-10 4-8-2-5-3C-8-8-3-11 0-7C2-12 7-9 6-5C12-5 11 2 7 3C9 8 3 9 1 5C-1 9-6 8-5 4Z',fill:'url(#aqua-canopy)',stroke:'#99bc86','stroke-width':1},tree);
        sv('path',{d:'M0 6V-2M0 3l-3-3M0 0l3-3',fill:'none',stroke:'#9fbe86','stroke-width':.7,opacity:.7},tree);
        for(let i=0;i<1800;i++) {
          const x=r.float(0,1000),y=r.float(0,840);
          const north=x>680&&x<865&&y<180&&x>695+y*.2;
          const lakeside=Math.pow((x-389)/150,2)+Math.pow((y-710)/128,2)<1 && Math.pow((x-389)/107,2)+Math.pow((y-708)/88,2)>1.18;
          const riverbank=Math.abs(x-(875+35*Math.sin(y/95)))<55&&x>820;
          const headland=Math.pow((x-83)/54,2)+Math.pow((y-44)/56,2)<1;
          if(north||lakeside||riverbank||headland||i%11===0) {
            const scale=r.float(.65,1.2);
            sv('use',{href:'#aqua-tree',transform:`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${scale})`,opacity:r.float(.6,.95)},vegetation);
          }
        }
        for(let i=0;i<100;i++) {
          const x=r.float(0,840),y=r.float(140,840);
          sv('rect',{x,y,width:r.float(5,17),height:r.float(7,22),rx:4,fill:'#acd192',opacity:.6,transform:`rotate(22 ${x} ${y})`},vegetation);
        }
        const scenicRoads = ['M-30 265C94 320 135 345 221 376S359 380 474 418S656 478 773 528L848 572C862 614 874 695 908 756L1040 850','M135 120C267 141 310 238 445 265S644 283 720 316L1030 411','M43 860L156 550L231 373L259 330','M718 858L752 673L780 563L825 354','M-30 665L114 711L340 826L405 855','M357 263C337 362 306 409 326 490S347 580 451 597L638 648L902 763'];
        scenicRoads.forEach(d=>{
          sv('path',{d,fill:'none',stroke:'#d6be79','stroke-width':11,'stroke-linejoin':'round'},green);
          sv('path',{d,fill:'none',stroke:'#fff6ce','stroke-width':9,'stroke-linejoin':'round'},green);
          sv('path',{d,fill:'none',stroke:'#ffe49a','stroke-width':6,'stroke-linejoin':'round'},green);
        });
        sv('path',{d:'M706 136C758 107 779 151 824 132S851 109 860 77M726 159C735 206 821 196 840 218M287 636C233 711 292 794 347 823',fill:'none',stroke:'#f8f9e8','stroke-width':2.4,'stroke-dasharray':'4 4'},green);
        for(let i=0;i<5;i++) {
          const x=300+i*66,y=194+i*19;
          sv('path',{d:`M${x} ${y}l17-44`,stroke:'#b0b6aa','stroke-width':8},art);
          sv('path',{d:`M${x} ${y}l17-44`,stroke:'#f6f2e5','stroke-width':6},art);
        }
        const text=(label,x,y,cls,rotation)=> {
          const t=sv('text',{x,y,'class':cls,transform:rotation?`rotate(${rotation} ${x} ${y})`:''},art);
          t.textContent=label;
        };
        text(ctx.spec.world.sea?.name || 'Harbour Bay',390,89,'aqua-water-name');
        text('Maple',862,285,'aqua-water-name'); text('River',865,312,'aqua-water-name');
        text(ctx.spec.world.lake?.name || 'Silver Lake',341,695,'aqua-water-name');
        text('Riverside',765,108,'aqua-park-name'); text('Park',777,130,'aqua-park-name');
        text('Lakeside Park',348,788,'aqua-park-name');
        const districtNames=[...new Set(ctx.spec.places.map(p=>p.district).filter(Boolean))];
        const positions=[[90,211],[458,313],[615,465],[715,644],[594,764],[27,410]];
        districtNames.slice(0,6).forEach((name,i)=>text(name,...positions[i],'aqua-district-name'));
        const texture = sv('filter',{id:'aqua-paper',x:0,y:0,width:'100%',height:'100%'},defs);
        sv('feTurbulence',{type:'fractalNoise',baseFrequency:'.16 .4',numOctaves:3,seed:17,stitchTiles:'stitch'},texture);
        sv('feColorMatrix',{type:'saturate',values:0},texture);
        sv('rect',{x:0,y:0,width:1000,height:840,filter:'url(#aqua-paper)',opacity:.065,'style':'mix-blend-mode:multiply'},art);
        result.world._aquaArt = art;
        return result;
      },
      editorPaint: (base) => (ctx, elements, model) => {
        base(ctx, elements, model);
        const sc = Number(elements.world.getAttribute('transform').match(/scale\(([^)]+)/)[1]);
        const art=elements.world._aquaArt;
        if(art && !art.hasAttribute('transform')) {
          art.setAttribute('transform', `translate(${model.c[0]-elements.W/(2*sc)} ${model.c[1]-elements.H/(2*sc)}) scale(${elements.W/(1000*sc)} ${elements.H/(840*sc)})`);
        }
        elements.roadLabels.forEach((label,i)=> {
          const road=ctx.spec.world.roads[i];
          const start=road.pts[0], end=road.pts[road.pts.length-1];
          const p=[start[0]+(end[0]-start[0])*.22,start[1]+(end[1]-start[1])*.22];
          label.style.left=p[0]*sc+'px';
          label.style.top=(p[1]*sc-34)+'px';
        });
        const columns=[...new Set(ctx.spec.places.map(p=>p.x))].sort((a,b)=>a-b);
        elements.pins.forEach((pin,i) => {
          const name=pin.querySelector('.mp-name'), col=columns.indexOf(ctx.spec.places[i].x);
          const crowded=ctx.spec.spacing[0]*sc<150;
          const left=crowded && col===0, below=crowded && col>0 && col<columns.length-1;
          const width=below?128:150;
          Object.assign(name.style,{width:width+'px',left:(left?-width-8:below?16-width/2:40)+'px',top:below?'33px':'0px',textAlign:left?'right':below?'center':'left',maxHeight:below?'43px':'64px'});
        });
        elements.results.hidden = !model.searchOpen || !model.query.trim();
        elements.readout.hidden=!model.pin;
      },
    },
  },
});
})();
