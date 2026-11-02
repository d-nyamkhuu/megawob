// Default center design on the shared pan-map/city template.
env.widget({
  task: 'pan-map',
  site: 'design-pan-map-center-04',
  name: 'design',
  split: 'train',
  scenarios: ['center'],
  traits: { zoom: 'both' },
  template: 'pan-map/city',
  design: {
    maxWidth: 3000,
    maxHeight: 2000,
    widthInset: 0,
    heightInset: 0,
    maxMapWidth: 3000,
    mapHeaderHeight: 0,
    minMapWidth: 320,
    minMapHeight: 240,
    brand: 'Riverton Map',
    parts: {
      explorerWorld: (base, S) => (ctx, port, W, H) => {
        const result = base(ctx, port, W, H);
        const { world, wd } = result;
        world.rivertonStreetNames = result.minorNames;
        const r = ctx.rng.fork('riverton/cartography');
        const svg = (tag, attrs, parent) => {
          const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
          for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
          parent.appendChild(el);
          return el;
        };
        const scenery = svg('g', {class:'riverton-scenery','pointer-events':'none'}, world);
        world.insertBefore(scenery, world.firstChild);
        const left = -2800, top = -2600, right = wd.W + 2800, bottom = wd.H + 2600;
        svg('rect', {x:left,y:top,width:right-left,height:bottom-top,fill:'#eceae3'}, scenery);
        // A fine-grained parcel survey continues beyond the playable city boundary.
        const parcels = svg('g', {transform:'rotate(17 0 1600)'}, scenery);
        const colors = ['#e3e5dd','#eeece4','#e6e5e0','#f1eee5','#ece9e0','#e8e6df','#d9e7cf','#cce4bd'];
        for (let x=left-1000;x<right+1000;x+=94) for (let y=top-1000;y<bottom+1000;y+=82) {
          svg('rect', {x:x+5,y:y+5,width:84,height:72,fill:r.pick(colors)}, parcels);
          if(r.bool(.33)) svg('rect',{x:x+r.int(10,45),y:y+r.int(10,40),width:r.int(14,30),height:r.int(12,26),fill:'#b7dba3',opacity:.65},parcels);
        }
        let grid='';
        for(let x=left-1000;x<right+1000;x+=94) grid+=`M${x} ${top-1000}V${bottom+1000}`;
        for(let y=top-1000;y<bottom+1000;y+=82) grid+=`M${left-1000} ${y}H${right+1000}`;
        svg('path',{d:grid,fill:'none',stroke:'#cdd0c9','stroke-width':7},parcels);
        svg('path',{d:grid,fill:'none',stroke:'#fff','stroke-width':5},parcels);
        // Irregular green spaces, with the translucent tree canopy of an XP-era map.
        const greens = svg('g',{},scenery);
        for(let x=left;x<right;x+=650) for(let y=top;y<bottom;y+=600) {
          const cx=x+r.int(-180,180),cy=y+r.int(-180,180),rx=r.int(110,230),ry=r.int(120,250);
          const pts=[];
          for(let i=0;i<12;i++) {const a=i*Math.PI/6,f=r.float(.75,1.15);pts.push([cx+Math.cos(a)*rx*f,cy+Math.sin(a)*ry*f]);}
          svg('polygon',{points:pts.map(p=>p.join(',')).join(' '),fill:'#b8dfa1'},greens);
          for(let i=0;i<26;i++) {
            const px=cx+r.float(-rx*.8,rx*.8),py=cy+r.float(-ry*.8,ry*.8),n=r.int(15,65);
            svg('path',{d:`M${px-n} ${py}l${n*.7} ${-n} ${n*.9} ${n*.25} ${n*.5} ${n} ${-n} ${n*.6}Z`,fill:r.pick(['#a6d68d','#c4e5b0','#93ca7b']),opacity:r.float(.2,.45)},greens);
          }
          svg('path',{d:`M${cx} ${cy-24}l-10 17h5l-10 16h11v9h8v-9h11l-10-16h5Z`,fill:'#258321',stroke:'#fff','stroke-width':2.5,'stroke-linejoin':'round'},greens);
        }
        // Broad suburban avenues remain beneath the seeded water and live roads.
        const avenues=[];
        for(let y=top;y<bottom;y+=950) avenues.push(`M${left} ${y}Q${wd.W/2} ${y+550} ${right} ${y-260}`);
        for(let x=left;x<right;x+=1050) avenues.push(`M${x} ${top}Q${x+700} ${wd.H/2} ${x-250} ${bottom}`);
        for(const d of avenues) {
          svg('path',{d,fill:'none',stroke:'#c5c9c0','stroke-width':13},scenery);
          svg('path',{d,fill:'none',stroke:'#fff','stroke-width':10},scenery);
        }
        // Continue the live road tangents through the surrounding survey tiles.
        for(const road of wd.roads) for(const end of [0,1]) {
          const a=road.pts[end?road.pts.length-1:0],b=road.pts[end?road.pts.length-2:1];
          const len=Math.hypot(a[0]-b[0],a[1]-b[1])||1;
          const d=`M${a[0]} ${a[1]}L${a[0]+(a[0]-b[0])/len*6000} ${a[1]+(a[1]-b[1])/len*6000}`;
          svg('path',{d,class:'mp-casing','vector-effect':'non-scaling-stroke'},scenery);
          svg('path',{d,class:'mp-road','vector-effect':'non-scaling-stroke'},scenery);
        }
        // Seeded park boundaries receive the same canopy detail, without new places.
        for(const park of wd.parks) {
          const clip=svg('clipPath',{id:'riverton-park-'+wd.parks.indexOf(park)},world);
          svg('polygon',{points:park.pts.map(p=>p.join(',')).join(' ')},clip);
          const canopy=svg('g',{'clip-path':`url(#${clip.id})`,'pointer-events':'none'},world);
          const xs=park.pts.map(p=>p[0]),ys=park.pts.map(p=>p[1]);
          for(let i=0;i<65;i++) svg('rect',{x:r.float(Math.min(...xs),Math.max(...xs)),y:r.float(Math.min(...ys),Math.max(...ys)),width:r.int(20,80),height:r.int(25,75),fill:r.pick(['#9ed087','#c3e8ac']),opacity:.35,transform:`rotate(${r.int(-30,30)} ${xs[0]} ${ys[0]})`},canopy);
          world.insertBefore(canopy,result.streets);
        }
        return result;
      },
      explorerPaint: (base, S) => (ctx, E, model) => {
        base(ctx,E,model);
        if(model.z<2 || E.layer.querySelector('.riverton-street-label')) return;
        const scale=Number(E.world.getAttribute('transform').match(/scale\(([^)]+)/)[1]);
        const wd=ctx.spec.world;
        const inPoly=(x,y,pts)=>{
          let inside=false;
          for(let i=0,j=pts.length-1;i<pts.length;j=i++) {
            const a=pts[i],b=pts[j];
            if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0]) inside=!inside;
          }
          return inside;
        };
        const minorNames=E.world.rivertonStreetNames || [];
        if(!minorNames.length) return;
        let n=0;
        for(let x=-2600;x<wd.W+2600;x+=600) for(let y=-2400;y<wd.H+2400;y+=620) {
          const a=17*Math.PI/180,px=x*Math.cos(a)-(y-1600)*Math.sin(a),py=1600+x*Math.sin(a)+(y-1600)*Math.cos(a);
          if(wd.sea&&inPoly(px,py,wd.sea)||wd.lake&&inPoly(px,py,wd.lake)||wd.parks.some(p=>inPoly(px,py,p.pts))) continue;
          const label=S.P.label(ctx,E.layer,'mp-roadname riverton-street-label',minorNames[n++%minorNames.length],px,py,17,scale);
          label.setAttribute('aria-hidden','true');
        }
      },
      explorerPin: (base, S) => (ctx, layer, place, scale, shape) => {
        const pin=base(ctx,layer,place,scale,shape);
        pin.pin.dataset.kind=place.kind;
        const paths={
          station:'M6 2h12v15H6z M8 6h8v5H8z M8 20l2-3m6 3-2-3 M9 14h.01M15 14h.01',
          university:'M2 8l10-5 10 5-10 5z M6 11v6q6 4 12 0v-6 M22 8v9',
          school:'M2 8l10-5 10 5-10 5z M6 11v6q6 4 12 0v-6',
          hospital:'M9 2h6v7h7v6h-7v7H9v-7H2V9h7z',
          museum:'M3 8l9-6 9 6z M5 10v9m5-9v9m4-9v9m5-9v9 M2 22h20',
          library:'M2 4q6-2 10 1 4-3 10-1v16q-6-2-10 1-4-3-10-1z M12 5v16',
          market:'M2 3h3l3 13h12l2-9H6 M9 21h.01M19 21h.01',
          hotel:'M2 5v17 M2 16h20v6 M6 10h5v6H6z M12 8h7q3 0 3 3v5H12z',
          venue:'M3 7h5l2-3h5l2 3h4v13H3z M17 13a5 5 0 1 1-10 0 5 5 0 0 1 10 0',
        };
        const path=paths[place.kind]||(/cafe|bakery|restaurant/.test(place.kind)?'M5 3v6m4-6v6M3 3v5q0 4 8 0V3 M7 10v12 M18 3q-5 5 0 10v9 M18 3v10':paths.venue);
        pin.dot.innerHTML=`<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"><path d="${path}"/></svg>`;
        return pin;
      },
      mapDecorated: (base, S) => (ctx, port, editor) => {
        base(ctx,port,editor);
        const taskPanel=ctx.stage.parentNode.querySelector('.ref-panel');
        const legend=ctx.util.el('div','riverton-legend',taskPanel || port);
        ctx.util.el('strong','riverton-legend-title',legend,'Map Legend');
        const icons={train:'M6 2h12v15H6z M8 6h8v5H8z M8 21l3-4m5 4-3-4 M9 14h.01M15 14h.01',hospital:'M9 2h6v7h7v6h-7v7H9v-7H2V9h7z',school:'M2 8l10-5 10 5-10 5z M6 11v6q6 4 12 0v-6 M22 8v9',shopping:'M2 3h3l3 13h12l2-9H6 M9 21h.01M19 21h.01',attraction:'M3 7h5l2-3h5l2 3h4v13H3z M17 13a5 5 0 1 1-10 0 5 5 0 0 1 10 0',hotel:'M2 5v17 M2 16h20v6 M6 10h5v6H6z M12 8h7q3 0 3 3v5H12z'};
        for(const [kind,label] of [['road','Major road'],['street','Street'],['park','Park / Green space'],['water','Water'],['train','Train station'],['hospital','Hospital'],['school','School / College'],['shopping','Shopping'],['attraction','Attraction'],['hotel','Hotel']]) {
          const row=ctx.util.el('div','riverton-legend-row '+kind,legend);
          const symbol=ctx.util.el('i','riverton-symbol',row);
          if(icons[kind]) symbol.innerHTML=`<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="${icons[kind]}"/></svg>`;
          ctx.util.el('span','',row,label);
        }
      },
    },
    mapColors: {
      land: '#f1eee6', water: '#72c5f5', park: '#b8dfa7', street: '#fff', road: '#ffe34a', casing: '#d9bd65',
      transitRoad: '#e9a3a3', transitCasing: '#b55d5d', parkName: '#267b2a', open: '#16824a',
      productLand: '#f1eee6', productWater: '#72c5f5', productPark: '#b8dfa7', productRoad: '#ffe34a',
      editorLand: '#f1eee6', editorRoad: '#ffe34a', editorCasing: '#d9bd65', droppedPin: '#c74439',
    },
  },
});
