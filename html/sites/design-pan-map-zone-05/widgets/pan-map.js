// Design on the shared pan-map/city template.
env.widget({
  task: 'pan-map',
  site: 'design-pan-map-zone-05',
  name: 'design',
  split: 'train',
  scenarios: ['zone'],
  traits: { zoom: 'both' },
  template: 'pan-map/city',
  design: {
    maxWidth: 3000, maxHeight: 2000, widthInset: 0, heightInset: 0,
    panelWidth: 373, narrowPanelWidth: 280,
    editorSearch: 'Search addresses or places',
    mapColors: { land: '#f1eee8', water: '#83c9ed', park: '#a8d894', street: '#fffdf9', road: '#f6c65e', casing: '#edab48', editorLand: '#eeece8', editorRoad: '#fffdf9', editorCasing: '#c9c5bd', productLand: '#eeeae3', productWater: '#83c9ed', productPark: '#a8d894', productRoad: '#f6c65e' },
    parts: {
    shellHeader: (base) => (ctx, root, editor) => {
      const result = base(ctx, root, editor);
      result.top.classList.add('city-embedded-header');
      result.bar.classList.add('city-embedded-header');
      return result;
    },
    shellPanels: (base) => (ctx, root) => {
      const result = base(ctx, root);
      for (const key of ['rail','foot']) if (result[key]) result[key].classList.add('city-embedded-header');
      return result;
    },
    editorRow: (base) => (ctx, list, place, badge) => {
      const result = base(ctx, list, place, badge);
      result.row.classList.add('city-place-row');
      const check = ctx.util.el('span', 'city-checkbox', result.row);
      check.setAttribute('aria-hidden', 'true');
      const pin = ctx.util.el('span', 'city-row-pin', result.row);
      pin.setAttribute('aria-hidden', 'true');
      ctx.util.el('span', 'city-place-type', result.row, /^\d/.test(place.address || '') ? 'Residential' : 'Venue');
      result.name.textContent = place.district || place.name;
      result.address.textContent = (place.address || place.name).replace(/,.*$/, '');
      result.name.classList.add('city-row-subtitle');
      result.address.classList.add('city-row-title');
      result.button.replaceChildren(result.address,result.name);
      const copy=ctx.util.el('div','city-row-copy',result.row);
      ctx.util.el('div','city-address-copy',copy,(place.address || place.name).replace(/,.*$/, ''));
      ctx.util.el('div','city-district-copy',copy,place.district || place.name);
      return result;
    },
    editorSearch: (base) => (ctx, top) => {
      const result = base(ctx, top);
      const root = top.parentNode;
      const panel = root.querySelector('.mpp-panel');
      if (panel && result.search.parentNode) panel.insertBefore(result.search.parentNode, panel.firstChild);
      return result;
    },
    editorHeading: (_base) => (ctx, panel) => {
      const section = ctx.util.el('div', 'mpe-section orbit-places-head', panel);
      ctx.util.el('div', 'mpe-heading', section, 'Places');
      ctx.util.el('div', 'orbit-place-count', section, `(${ctx.spec.places.length})`);
      panel.insertBefore(section, panel.firstChild);
      return section;
    },
    editorDirectory: (base) => (ctx, panel, commit) => {
      const result = base(ctx, panel, commit);
      const filters = ctx.util.el('div', 'orbit-place-filters', panel);
      const options = [['All','all'],['Addresses','address'],['Venues','venue'],['Districts','district']];
      for (const [label, kind] of options) {
        const button = ctx.util.el('button', kind === 'all' ? 'active' : '', filters, label);
        button.type = 'button';
        button.addEventListener('click', () => {
          filters.querySelectorAll('button').forEach((b) => b.classList.toggle('active', b === button));
          result.list.querySelectorAll('.mpe-item').forEach((row) => {
            const address = row.querySelector('.mpe-address')?.textContent || '';
            const isAddress = /^\s*\d/.test(address);
            row.hidden = kind === 'all' ? false : kind === 'address' ? !isAddress : isAddress;
          });
        });
      }
      panel.insertBefore(filters, result.list);
      return result;
    },
    editorWorld: (base) => (ctx, port, W, H) => {
      const view = base(ctx, port, W, H);
      const s = ctx.spec;
      const cx = s.world.W / 2, cy = s.world.H / 2;
      const ns = 'http://www.w3.org/2000/svg';
      const add = (tag, attrs, parent) => {
        const e = document.createElementNS(ns, tag);
        for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
        parent.appendChild(e); return e;
      };
      const features = add('g', { class: 'orbit-geography' }, view.world);
      const p = (x,y) => `${cx+x} ${cy+y}`;
      const water = [
        `M${p(-930,-1250)} L${p(590,-1250)} C${p(500,-920)} ${p(190,-910)} ${p(430,-670)} C${p(650,-520)} ${p(230,-450)} ${p(330,-300)} C${p(380,-150)} ${p(-100,-190)} ${p(-250,-290)} C${p(-500,-320)} ${p(-420,-650)} ${p(-690,-610)} C${p(-1000,-550)} ${p(-870,-1010)} ${p(-930,-1250)}Z`,
        `M${p(1800,300)} C${p(1330,340)} ${p(1190,490)} ${p(1130,650)} C${p(1030,820)} ${p(1170,1040)} ${p(1050,1250)} L${p(1800,1250)}Z`
      ];
      const river = `M${p(-1800,130)} C${p(-1210,40)} ${p(-770,580)} ${p(-280,420)} S${p(360,260)} ${p(680,390)} S${p(1230,650)} ${p(1800,380)}`;
      const branch = `M${p(15,-250)} C${p(-30,-30)} ${p(0,90)} ${p(150,200)} C${p(220,270)} ${p(190,310)} ${p(210,360)}`;
      const parks = [[-1100,-570,160,180],[460,-850,260,160],[440,650,180,140],[-460,320,140,85],[60,10,80,170],[890,-70,120,120],[-1050,100,160,110]];
      const defs = add('defs', {}, features);
      const mask = add('mask', {id:'city-land-mask',maskUnits:'userSpaceOnUse',x:0,y:0,width:s.world.W,height:s.world.H}, defs);
      add('rect',{width:s.world.W,height:s.world.H,fill:'white'},mask);
      water.forEach(d=>add('path',{d,fill:'black',stroke:'black','stroke-width':48},mask));
      for (const [d,width] of [[river,132],[branch,90]]) add('path',{d,fill:'none',stroke:'black','stroke-width':width},mask);
      const roads = add('g', { mask:'url(#city-land-mask)' }, features);
      for(let y=-1300, row=0;y<1400;y+=94,row++) {
        for(let x=-1700,col=0;x<1800;x+=110,col++) {
          const tilt = ((row+col)%4)*3;
          add('path',{d:`M${p(x+8,y+9)} l79 ${tilt} l-5 64 l-76 -3Z`,fill:(row+col)%13===0?'#cfe3be':(row+col)%3===0?'#e6e3df':'#e9e7e3',stroke:'#dad8d3','stroke-width':1},roads);
        }
      }
      const streetPaths=[];
      for(let y=-1400,row=0;y<1450;y+=94,row++) streetPaths.push(`M${p(-1800,y)} C${p(-900,y+42)} ${p(-450,y-30)} ${p(0,y+18)} S${p(980,y+80)} ${p(1800,y+20)}`);
      for(let x=-1800,col=0;x<1850;x+=110,col++) streetPaths.push(`M${p(x-95,-1400)} C${p(x+95,-700)} ${p(x-45,-200)} ${p(x,0)} S${p(x+75,800)} ${p(x-80,1400)}`);
      streetPaths.forEach(d=>add('path',{d,class:'orbit-minor-casing'},roads));
      streetPaths.forEach(d=>add('path',{d,class:'orbit-minor-road'},roads));
      for(const [x,y,rx,ry] of parks) {
        add('path',{d:`M${p(x-rx,y)} C${p(x-rx*1.1,y-ry*.5)} ${p(x-rx*.4,y-ry*1.12)} ${p(x+rx*.18,y-ry*.88)} C${p(x+rx*.72,y-ry*1.05)} ${p(x+rx*1.1,y-ry*.24)} ${p(x+rx*.94,y+ry*.2)} C${p(x+rx*1.13,y+ry*.7)} ${p(x+rx*.24,y+ry*1.1)} ${p(x-rx*.22,y+ry*.85)} C${p(x-rx*.83,y+ry)} ${p(x-rx*1.12,y+ry*.27)} ${p(x-rx,y)}Z`,fill:'#c9e3b8',stroke:'#d7eac7','stroke-width':14},features);
        for(let i=0;i<27;i++) {
          const tx=cx+x+Math.sin(i*7.31)*rx*.84,ty=cy+y+Math.cos(i*5.53)*ry*.78;
          add('path',{d:`M${tx} ${ty+13} v-20`,stroke:'#9cc68d','stroke-width':4},features);
          add('path',{d:`M${tx-11} ${ty} C${tx-19} ${ty-16} ${tx-5} ${ty-18} ${tx} ${ty-25} C${tx+8} ${ty-23} ${tx+6} ${ty-13} ${tx+14} ${ty-10} Q${tx+19} ${ty+5} ${tx-11} ${ty}Z`,fill:i%4===0?'#91bf89':'#b0d59b',stroke:'#a4cb94','stroke-width':2},features);
        }
      }
      water.forEach(d=>add('path',{d,class:'city-water'},features));
      for(const [d,width] of [[river,92],[branch,53]]) {
        add('path',{d,fill:'none',stroke:'#d1e5bb','stroke-width':width+54},features);
        add('path',{d,fill:'none',stroke:'#8cd4f4','stroke-width':width},features);
      }
      const major = [
        `M${p(-1700,-510)} C${p(-1050,-700)} ${p(-700,-590)} ${p(-400,-370)} S${p(120,-120)} ${p(360,-300)} S${p(900,-470)} ${p(1800,-180)}`,
        `M${p(-1710,40)} C${p(-1330,80)} ${p(-990,570)} ${p(-430,540)} S${p(140,390)} ${p(580,500)} S${p(1220,760)} ${p(1800,410)}`,
        `M${p(-1040,-900)} C${p(-1050,-240)} ${p(-1090,40)} ${p(-1350,500)}`,
        `M${p(800,-1300)} C${p(560,-680)} ${p(560,-510)} ${p(460,-300)}`,
        `M${p(760,390)} L${p(680,700)}`
      ];
      major.forEach(d=>add('path',{d,class:'orbit-secondary-casing'},features));
      major.forEach(d=>add('path',{d,class:'orbit-secondary-road'},features));
      const highway=`M${p(-1700,240)} C${p(-1130,350)} ${p(-1050,710)} ${p(-480,870)} S${p(580,1080)} ${p(720,960)} S${p(820,430)} ${p(1380,270)} L${p(1800,190)}`;
      add('path',{d:highway,class:'orbit-major-casing'},features);
      add('path',{d:highway,class:'orbit-major-road'},features);
      const label=(text,x,y,cls,rotation=0)=>{
        const t=add('text',{class:cls,x:cx+x,y:cy+y,transform:`rotate(${rotation} ${cx+x} ${cy+y})`},features);t.textContent=text;
      };
      for(const [name,x,y,rotation] of [['Lakeview Drive',240,-244,0],['Riverside Drive',80,524,-11],['Meadowbank Road',-420,735,10],['High Street',-970,930,16],['Willow Lane',-750,-30,-81],['Oakwood Road',1010,70,79],['Market Street',-690,910,-76]]) label(name,x,y,'orbit-map-label',rotation);
      const districts=[...new Set(s.places.map(place=>place.district).filter(Boolean))];
      for(const [i,name] of (districts.length>1?districts:['Westdale','Riverside','Lakeside','Old Town','Eastwood']).entries()) label(name,[-650,520,730,-750,490][i%5],[-80,-70,-540,850,920][i%5],'orbit-map-district');
      label('Maple Lake',-230,-650,'city-water-label');
      label('Northfield River',-570,440,'city-water-label',-3);
      label('Harbour Bay',1370,850,'city-water-label');
      label('Riverview Park',470,-790,'city-park-label');
      label('Hawthorn Park',440,700,'city-park-label');
      for(const [x,y] of [[-1180,490],[-510,880],[760,520]]) {
        add('rect',{x:cx+x-35,y:cy+y-19,width:70,height:38,rx:5,fill:'#39884f',stroke:'white','stroke-width':3},features);
        label('A417',x,y+10,'city-highway-label');
      }
      return view;
    },
    editorFrame: (base) => (ctx, work) => {
      const frame = base(ctx, work);
      const bottom = ctx.util.el('div', 'orbit-zone-bottom', frame.map);
      frame.bottom = bottom;
      return frame;
    },
    editorTools: (base) => (ctx, port, commit) => {
      const tools = base(ctx, port, commit);
      const bottom = port.parentNode.querySelector('.orbit-zone-bottom');
      if (bottom) bottom.appendChild(tools.tools);
      const icons = [
        [tools.edit, 'M5 2l16 12-8 1-4 7z'],
        [tools.pan, 'M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6'],
        [tools.close, 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 3a6 6 0 1 1 0 12 6 6 0 0 1 0-12'],
        [tools.clear, 'M6 7h12l-1 15H7L6 7zm-2-4h16v3H4V3zm5-2h6v2H9V1z']
      ];
      for(const [button,path] of icons) if(button) {
        const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
        svg.setAttribute('viewBox','0 0 24 24');
        svg.innerHTML=`<path d="${path}" fill="currentColor"/>`;
        button.replaceChildren(svg);
      }
      if(tools.close && tools.clear) tools.tools.insertBefore(tools.close,tools.clear);
      const extra=ctx.util.el('span','city-route-icon',tools.tools);
      extra.innerHTML='<svg viewBox="0 0 24 24"><path d="M5 18L19 5" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="5" cy="18" r="3" fill="white" stroke="currentColor" stroke-width="2.5"/><circle cx="19" cy="5" r="3" fill="white" stroke="currentColor" stroke-width="2.5"/></svg>';
      tools.tools.insertBefore(extra,tools.close);
      return tools;
    },
    editorZoom: (base) => (ctx,port) => {
      const result=base(ctx,port);
      result.zin.parentElement.classList.add('city-zoom');
      result.level.classList.add('city-zoom-level');
      return result;
    },
    editorReadout: (base) => (ctx, port, chrome) => {
      const result = base(ctx, port, chrome);
      const panel = port.closest('.mpp-root')?.querySelector('.mpp-panel') || ctx.stage.querySelector('.mpp-panel');
      if (panel) {
        const summary = ctx.util.el('section', 'city-summary', panel);
        ctx.util.el('strong', '', summary, 'Delivery area');
        summary.appendChild(result.readout);
        result.readout.classList.add('city-original-readout');
        for (const [label,key] of [['Addresses selected','selected'],['Total stops','stops'],['Total distance','distance']]) {
          const row=ctx.util.el('div','city-summary-line',summary);
          ctx.util.el('span','',row,label);
          const value=ctx.util.el('span','',row,key==='distance'?'0.0 km':'0');
          value.dataset.stat=key;
        }
      }
      return result;
    },
    editorPaint: (base) => (ctx, elements, model) => {
      base(ctx,elements,model);
      const vertices=model.vertices || [];
      const inside=(x,y)=>{
        let included=false;
        for(let i=0,j=vertices.length-1;i<vertices.length;j=i++) {
          const [xi,yi]=vertices[i], [xj,yj]=vertices[j];
          if(((yi>y)!==(yj>y)) && x<(xj-xi)*(y-yi)/(yj-yi)+xi) included=!included;
        }
        return included;
      };
      const count=model.closed && vertices.length>2?ctx.spec.places.filter(place=>inside(place.x,place.y)).length:0;
      for(const key of ['selected','stops']) {
        const value=ctx.stage.querySelector(`[data-stat="${key}"]`);
        if(value) value.textContent=String(count);
      }
      ctx.stage.querySelectorAll('.city-place-row').forEach((row,index)=>{
        const place=ctx.spec.places[index];
        row.classList.toggle('city-included',!!place && model.closed && vertices.length>2 && inside(place.x,place.y));
      });
    },
    editorPin: (base) => (ctx, labels, place, index) => {
      const pin = base(ctx, labels, place, index);
      const dot = pin.querySelector('.mp-dot');
      const label = pin.querySelector('.mp-name');
      if(label) {
        label.textContent=(place.address || place.name).replace(/,.*$/, '');
        label.style.setProperty('--label-offset',`${(index%3-1)*23}px`);
      }
      const address = place.kind !== 'venue';
      if (dot) dot.textContent = '';
      pin.style.setProperty('--c', '#e63849');
      return pin;
    }
    },
  },
});
