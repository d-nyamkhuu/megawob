// Design on the shared pan-map/city template.
env.widget({
  task: 'pan-map',
  site: 'design-pan-map-zone-04',
  name: 'design',
  split: 'train',
  scenarios: ['zone'],
  traits: { zoom: 'both' },
  template: 'pan-map/city',
  design: {
    parts: {
      fit: (base, S) => (ctx) => ({
        ...base(ctx),
        width: Math.floor(ctx.size.width),
        height: Math.floor(ctx.size.height),
      }),
      frame: (base, S) => (ctx, width, height) => {
        const root = base(ctx, width, height);
        root.style.boxSizing = 'border-box';
        return root;
      },
      editorHeading: (base, S) => (ctx, panel) => {
        const section = base(ctx, panel);
        section.classList.add('mag-directory-head');
        const tabs = ctx.util.el('div', 'mag-inspector-tabs', section);
        ctx.util.el('span', 'selected', tabs, 'Places');
        ctx.util.el('span', '', tabs, 'Details');
        const filter = ctx.util.el('div', 'mag-directory-filter', section);
        ctx.util.el('span', '', filter, 'Show');
        ctx.util.el('span', 'mag-filter-value', filter, 'All Places');
        const taskPanel = document.querySelector('.ref-panel');
        if (taskPanel) section.appendChild(taskPanel);
        const columns = ctx.util.el('div', 'mag-directory-columns', section);
        ctx.util.el('span', '', columns, 'Name');
        ctx.util.el('span', '', columns, 'Type');
        return section;
      },
      editorRow: (base, S) => (ctx, list, place, badge) => {
        const row = base(ctx, list, place, badge);
        ctx.util.el('span', 'mag-place-type', row.button, place.kind === 'station' ? 'Station' : 'Venue');
        return row;
      },
      editorDirectory: (base, S) => (ctx, panel, commit) => {
        const directory = base(ctx, panel, commit);
        for (const name of ['Riverview Park', 'Lakeside Park', 'Cedar Grove Park']) {
          const row = ctx.util.el('div', 'mag-geographic-row', directory.list);
          ctx.util.el('span', 'mag-geographic-dot', row);
          ctx.util.el('span', 'mpe-name', row, name);
          ctx.util.el('span', 'mag-place-type', row, 'Park');
        }
        return directory;
      },
      editorPaint: (base, S) => (ctx, elements, model) => {
        base(ctx, elements, model);
        const scale = elements.world.transform.baseVal.consolidate().matrix.a;
        elements.roadLabels.forEach((label, i) => {
          const points = ctx.spec.world.roads[i].pts;
          label.style.left = ((points[0][0] + points[points.length - 1][0]) / 2) * scale + 'px';
          label.style.top = points[0][1] * scale + 6 + 'px';
        });
      },
      editorFrame: (base, S) => (ctx, work) => {
        const compact = ctx.size.height < 520;
        work.style.setProperty('--mag-boundary-space', compact ? '60px' : ctx.size.width <= 1200 ? '82px' : '98px');
        const frame = base(ctx, work);
        ctx.util.el('div', 'mag-boundary-footer' + (compact ? ' mag-compact-boundary' : ''), frame.map);
        return frame;
      },
      editorTools: (base, S) => (ctx, port, commit) => {
        const controls = base(ctx, port, commit);
        const footer = port.parentElement.querySelector('.mag-boundary-footer');
        ctx.util.el('strong', 'mag-boundary-title', footer, 'Delivery Zone Tools');
        footer.appendChild(controls.tools);
        for (const text of ['Add Point', 'Delete Point']) {
          const button = ctx.util.el('button', 'mag-disabled-tool', controls.tools, text);
          const icon = ctx.util.el('span', 'mag-boundary-icon', button);
          icon.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${text === 'Add Point' ? '<path d="M12 22 7 10a5.5 5.5 0 1 1 10 0Z"/><circle cx="12" cy="7" r="2"/>' : '<path d="m5 5 14 14M19 5 5 19"/>'}</svg>`;
          button.disabled = true;
          controls.tools.insertBefore(button, controls.clear);
        }
        const help = ctx.util.el('div', 'mag-boundary-help', footer);
        const mouse = ctx.util.el('span', 'mag-mouse', help);
        mouse.innerHTML = '<svg width="25" height="34" viewBox="0 0 25 34" fill="none" stroke="#174367" stroke-width="1.7"><rect x="5" y="5" width="16" height="26" rx="8" fill="#fff"/><path d="M13 3v14M5 16h16"/><rect x="11" y="7" width="4" height="8" rx="2" fill="#8ab9dd"/></svg>';
        ctx.util.el('div', '', help, 'Drag to pan the map\nUse + / − or mouse wheel to zoom\nClick on the map to add boundary points');
        const toolbar = document.querySelectorAll('.mag-tool');
        if (toolbar[0]) {
          controls.pan.replaceChildren(...toolbar[0].childNodes);
          controls.pan.classList.add('mag-tool', 'mag-pan-tool');
          toolbar[0].replaceWith(controls.pan);
        }
        if (toolbar[2]) toolbar[2].addEventListener('click', () => controls.edit.click());
        if (toolbar[4]) toolbar[4].addEventListener('click', () => controls.clear.click());
        return controls;
      },
      editorWorld: (base, S) => (ctx, port, W, H) => {
        // Keep the template's seeded survey drawing and add geography beneath it.
        // Calling the original part first preserves its RNG stream and all pin anchors.
        const view = base(ctx, port, W, H);
        const spec = ctx.spec;
        const svg = port.querySelector('svg.mp-svg');
        const world = view.world;
        const ns = 'http://www.w3.org/2000/svg';
        const centerX = spec.world.W / 2, centerY = spec.world.H / 2;
        const path = (d, fill, stroke, width) => {
          const el = document.createElementNS(ns, 'path');
          el.setAttribute('d', d); el.setAttribute('fill', fill);
          if (stroke) { el.setAttribute('stroke', stroke); el.setAttribute('stroke-width', width); }
          el.setAttribute('stroke-linejoin', 'round'); el.setAttribute('stroke-linecap', 'round');
          world.insertBefore(el, world.firstChild);
          return el;
        };
        const coastX = centerX - 820;
        const coast = `M${centerX-5000} ${centerY-2400} H${coastX+130} C${coastX+20} ${centerY-1900} ${coastX+260} ${centerY-1690} ${coastX+90} ${centerY-1450} C${coastX-80} ${centerY-1180} ${coastX+250} ${centerY-1000} ${coastX+70} ${centerY-730} C${coastX-90} ${centerY-480} ${coastX+210} ${centerY-260} ${coastX+40} ${centerY+10} C${coastX-130} ${centerY+260} ${coastX+190} ${centerY+480} ${coastX+10} ${centerY+720} C${coastX-170} ${centerY+960} ${coastX+170} ${centerY+1200} ${coastX-20} ${centerY+1450} C${coastX-180} ${centerY+1730} ${coastX+110} ${centerY+1950} ${coastX-40} ${centerY+2300} H${centerX-5000} Z`;
        path(coast, '#8fc9e7', '#fffefa', 26);
        const river = `M${centerX-4200} ${centerY+110} C${centerX-2600} ${centerY+10} ${centerX-1700} ${centerY+215} ${centerX-600} ${centerY+110} C${centerX+350} ${centerY+10} ${centerX+1600} ${centerY+220} ${centerX+2700} ${centerY+95} C${centerX+3500} ${centerY+0} ${centerX+4100} ${centerY+130} ${centerX+4700} ${centerY+75} L${centerX+4700} ${centerY+245} C${centerX+3500} ${centerY+300} ${centerX+2800} ${centerY+175} ${centerX+2700} ${centerY+265} C${centerX+1600} ${centerY+390} ${centerX+350} ${centerY+190} ${centerX-600} ${centerY+280} C${centerX-1700} ${centerY+390} ${centerX-2600} ${centerY+190} ${centerX-4200} ${centerY+285} Z`;
        path(river, '#83c5e8', '#fffefa', 15);
        const parkPolys = [
          `M${centerX-250} ${centerY-1000} C${centerX+90} ${centerY-1190} ${centerX+480} ${centerY-1110} ${centerX+550} ${centerY-820} C${centerX+620} ${centerY-560} ${centerX+240} ${centerY-460} ${centerX-60} ${centerY-590} Q${centerX-290} ${centerY-700} ${centerX-420} ${centerY-860} Z`,
          `M${centerX+950} ${centerY-820} C${centerX+1240} ${centerY-1010} ${centerX+1690} ${centerY-930} ${centerX+1800} ${centerY-650} C${centerX+1880} ${centerY-400} ${centerX+1530} ${centerY-300} ${centerX+1210} ${centerY-430} Q${centerX+1020} ${centerY-510} ${centerX+850} ${centerY-620} Z`,
          `M${centerX-650} ${centerY+720} C${centerX-360} ${centerY+500} ${centerX+80} ${centerY+600} ${centerX+190} ${centerY+880} C${centerX+270} ${centerY+1150} ${centerX-120} ${centerY+1290} ${centerX-470} ${centerY+1170} Q${centerX-720} ${centerY+1080} ${centerX-850} ${centerY+900} Z`,
        ];
        for (const d of parkPolys) {
          const el = document.createElementNS(ns, 'path'); el.setAttribute('d', d);
          el.setAttribute('class', 'mp-park'); el.setAttribute('fill', '#b8d7a1');
          world.insertBefore(el, world.children[spec.world.parks.length] || null);
        }
        const treePoints = [
          [-310,-900],[-120,-780],[80,-960],[330,-820],[490,-700],
          [1080,-760],[1290,-650],[1500,-790],[1690,-610],
          [-610,850],[-420,760],[-250,930],[-560,1080],[-300,1130],[10,1040],
        ];
        const beforeBuildings = 2 + spec.world.parks.length + parkPolys.length;
        for (const [dx,dy] of treePoints) {
          const g = document.createElementNS(ns, 'g');
          const crown = document.createElementNS(ns, 'circle');
          crown.setAttribute('cx', centerX+dx); crown.setAttribute('cy', centerY+dy); crown.setAttribute('r', '27');
          crown.setAttribute('fill', '#8fbd7d'); crown.setAttribute('stroke', '#729f67'); crown.setAttribute('stroke-width', '5');
          const trunk = document.createElementNS(ns, 'path');
          trunk.setAttribute('d', `M${centerX+dx} ${centerY+dy+18} v24`); trunk.setAttribute('stroke', '#806e4c'); trunk.setAttribute('stroke-width', '7');
          g.append(crown,trunk);
          world.insertBefore(g, world.children[beforeBuildings] || null);
        }
        const geoLabel = (text,x,y,className) => {
          const label = document.createElementNS(ns, 'text'); label.textContent = text;
          label.setAttribute('x', centerX+x); label.setAttribute('y', centerY+y); label.setAttribute('text-anchor', 'middle');
          label.setAttribute('class', className); world.appendChild(label);
        };
        geoLabel('Riverview Park', -90, -650, 'ref-map-park');
        geoLabel('Lakeside Park', 1380, -500, 'ref-map-park');
        geoLabel('Cedar Grove Park', -430, 1280, 'ref-map-park');
        geoLabel('Oakridge Bay', -1260, -250, 'ref-map-water');
        geoLabel('Mill River', 300, 365, 'ref-map-water');
        for (const [text, x, y] of [['Northside', centerX+160, centerY-760], ['Riverside', centerX+180, centerY-60], ['Eastwood', centerX+1450, centerY-120], ['West Hills', centerX-520, centerY+920]]) {
          const label = document.createElementNS(ns, 'text'); label.textContent = text;
          label.setAttribute('x', x); label.setAttribute('y', y); label.setAttribute('text-anchor', 'middle');
          label.setAttribute('class', 'ref-map-district'); world.appendChild(label);
        }
        // The base builds the complete survey, including its original RNG draws.
        // Replace only the cartographic paint; pins and all world coordinates stay intact.
        world.replaceChildren();
        const make = (tag, attrs, parent = world) => {
          const el = document.createElementNS(ns, tag);
          for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
          parent.appendChild(el); return el;
        };
        const layer = make('g', {class:'mag-cartography'});
        const terrain = (d, fill, stroke, width = 2, parent = layer) => make('path', {d, fill, stroke:stroke || 'none', 'stroke-width':width, 'stroke-linejoin':'round', 'stroke-linecap':'round'}, parent);
        // Local coordinates keep the entire illustrated survey attached to the slippy world.
        layer.setAttribute('transform', `translate(${centerX} ${centerY}) scale(.58 .55)`);
        const shorePoints = [[-1280,-4000],[-1270,-1500],[-1350,-1120],[-1240,-880],[-1320,-700],[-1290,-580],[-1200,-480],[-1080,-430],[-1060,-330],[-1130,-240],[-1260,-200],[-1340,-70],[-1310,30],[-1450,110],[-1510,130],[-1550,250],[-1600,370],[-1700,440],[-1740,550],[-1820,650],[-1820,800],[-1890,1020],[-2000,4000]];
        let shore = 'M-5000 -4000';
        for(let i=1;i<shorePoints.length;i++) {
          const [ax,ay]=shorePoints[i-1], [bx,by]=shorePoints[i];
          const steps=Math.ceil(Math.hypot(bx-ax,by-ay)/22);
          for(let j=0;j<=steps;j++) {
            const t=j/steps, ripple=Math.sin((i*13+j)*1.9)*10+Math.sin(j*.71)*9;
            shore+=`L${ax+(bx-ax)*t+ripple} ${ay+(by-ay)*t}`;
          }
        }
        shore+='H-5000Z';
        terrain('M-5000 -4000H5000V4000H-5000Z', '#eeeae1');
        const parkA = 'M-1370 -1100C-1080 -1270 -820 -1190 -700 -890L-780 -370C-1020 -270 -1280 -390 -1320 -570L-1450 -800Z';
        const parkB = 'M700 -1100C1040 -1140 1390 -990 1500 -680L1300 -340C1030 -260 800 -360 640 -550Z';
        const parkC = 'M-1650 230C-1400 60 -1080 210 -920 340L-1060 920C-1320 1150 -1760 1120 -1940 920Z';
        for (const d of [parkA,parkB,parkC]) terrain(d, '#c3d99f', '#d8e3b5', 15);
        // Uneven lots and inset footprints give blocks the texture of a printed street atlas.
        const defs = make('defs', {});
        const waterWash=make('linearGradient',{id:'mag-water-wash',x1:'0%',y1:'100%',x2:'100%',y2:'0%'},defs);
        make('stop',{offset:'0%','stop-color':'#a7def0'},waterWash);make('stop',{offset:'55%','stop-color':'#91d0ec'},waterWash);make('stop',{offset:'100%','stop-color':'#80c8e9'},waterWash);
        const parkWash=make('linearGradient',{id:'mag-park-wash',x1:'0%',y1:'0%',x2:'100%',y2:'100%'},defs);
        make('stop',{offset:'0%','stop-color':'#bcd69b'},parkWash);make('stop',{offset:'55%','stop-color':'#c8dda7'},parkWash);make('stop',{offset:'100%','stop-color':'#d2dfb2'},parkWash);
        for(const element of layer.querySelectorAll('path[fill="#c3d99f"]')) element.setAttribute('fill','url(#mag-park-wash)');
        const grain=make('filter',{id:'mag-paper',x:'0%',y:'0%',width:'100%',height:'100%'},defs);
        make('feTurbulence',{type:'fractalNoise',baseFrequency:'.12',numOctaves:3,seed:ctx.rng.fork('magazine/paper').int(1,999),result:'grain'},grain);
        make('feColorMatrix',{in:'grain',type:'saturate',values:0,result:'grey'},grain);
        make('feBlend',{in:'SourceGraphic',in2:'grey',mode:'soft-light'},grain);
        const mask = make('mask', {id:'mag-city-land',maskUnits:'userSpaceOnUse',x:-5000,y:-4000,width:10000,height:8000},defs);
        make('rect',{x:-5000,y:-4000,width:10000,height:8000,fill:'white'},mask);
        for(const d of [parkA,parkB,parkC]) make('path',{d,fill:'black',stroke:'black','stroke-width':15},mask);
        make('path',{d:shore,fill:'black'},mask);
        const city = make('g', {mask:'url(#mag-city-land)'}, layer);
        const buildings = make('g', {transform:'scale(1.25 1.1)'}, city), streets = make('g', {transform:'scale(1.25 1.1)'}, city);
        const random = ctx.rng.fork('magazine/cartography');
        for (let col=-9;col<17;col++) for(let row=-11;row<13;row++) {
          const x=col*148+22+Math.sin(row*.8)*8, y=row*128+14;
          if (x < -1100 || (y > 70 && y < 240) || (x>650 && x<1420 && y < -350) || (x< -880 && y>240)) continue;
          make('rect',{x,y,width:130,height:112,fill:'#e8e3d9',stroke:'#f3f0e9','stroke-width':3},buildings);
          for(let k=0;k<8;k++) {
            const bx=x+8+(k%4)*30+random.int(0,5), by=y+8+Math.floor(k/4)*54+random.int(0,10);
            make('rect',{x:bx,y:by,width:random.int(16,25),height:random.int(23,40),fill:k%3 ? '#ded8cc':'#e3ddd2',stroke:'#d4cdc1','stroke-width':1,transform:`rotate(${random.int(-5,5)} ${bx+12} ${by+16})`},buildings);
          }
        }
        for(let col=-7;col<17;col++) {
          const x=col*148+10;
          terrain(`M${x} -1600Q${x-12} -500 ${x+6} 50 M${x+6} 240Q${x+20} 700 ${x+8} 1600`, 'none','#d3cec4',13,streets);
          terrain(`M${x} -1600Q${x-12} -500 ${x+6} 50 M${x+6} 240Q${x+20} 700 ${x+8} 1600`, 'none','#fffefa',9,streets);
        }
        for(let row=-12;row<14;row++) {
          const y=row*128+7;
          if(y>60 && y<240) continue;
          const d=`M-1120 ${y}Q-100 ${y+Math.sin(row)*18} 600 ${y+8}T2600 ${y+26}`;
          terrain(d,'none','#d3cec4',13,streets);terrain(d,'none','#fffefa',9,streets);
        }
        // Footpaths, scattered trees and shrub patches in the three public parks.
        for (const [ox,oy] of [[-1120,-780],[1030,-750],[-1450,650]]) {
          terrain(`M${ox-250} ${oy-160}C${ox-60} ${oy-80} ${ox-90} ${oy+60} ${ox+30} ${oy+110}S${ox+160} ${oy+80} ${ox+260} ${oy+150}`,'none','#fffef7',11);
          terrain(`M${ox-200} ${oy+230}Q${ox+10} ${oy+60} ${ox+160} ${oy+260}`,'none','#8eaf6f',5).setAttribute('stroke-dasharray','18 15');
          for(let k=0;k<26;k++) {
            const x=ox+random.int(-260,240), y=oy+random.int(-220,240);
            if(k%3===0) { make('circle',{cx:x,cy:y,r:random.int(4,9),fill:'#a7c88c'},layer);continue; }
            terrain(`M${x} ${y+5}v24`,'none','#88a56c',5);
            const tree=make('g',{fill:k%2?'#95bc7f':'#a3c78a',opacity:'.86'},layer);
            make('ellipse',{cx:x,cy:y-5,rx:15,ry:20},tree);
            make('circle',{cx:x-9,cy:y+3,r:11},tree);make('circle',{cx:x+9,cy:y+2,r:12},tree);
          }
        }
        // Sandy banks and fine, irregular shallows soften the coast and river edges.
        terrain(shore,'url(#mag-water-wash)','#eae5bd',36);terrain(shore,'url(#mag-water-wash)','#b7e6f1',15);
        const riverPath='M-1410 130C-1170 -30 -1080 80 -900 135S-520 220 -290 160S70 110 340 170S680 230 870 155S1110 70 1360 155S1650 250 1900 180L2800 260';
        terrain(riverPath,'none','#d5dfb4',106);terrain(riverPath,'none','#fff9de',91);terrain(riverPath,'none','#8dd1ed',75);terrain(riverPath,'none','#a6def0',3);
        terrain('M1120 -1000C980 -900 1110 -820 1040 -730S1090 -510 1240 -480S1530 -520 1500 -680S1320 -900 1120 -1000Z','#91ceed','#eae5bd',18);
        for(const [x,y] of [[-1560,-360],[-1480,-40],[-1660,200],[-1900,690],[-2060,860]]) {
          terrain(`M${x} ${y}q-25 -35 -45 -5t-15 35q40 20 60 -30Z`,'#c5dba7','#f2e9c4',9);
        }
        const paper=make('rect',{x:-5000,y:-4000,width:10000,height:8000,fill:'#ece8da',opacity:'.065','pointer-events':'none'},layer);
        // Keep the surveyed address roads in exactly the same positions as the markers.
        const surveyClip=make('g', {mask:'url(#mag-city-land)'},layer);
        const surveyRoads=make('g', {transform:'scale(1.7241379318 1.8181818182)'},surveyClip);
        for(const [index, road] of spec.world.roads.entries()) {
          const d=road.pts.map(([x,y],i)=>`${i?'L':'M'}${x-centerX} ${y-centerY}`).join(' ');
          terrain(d,'none',index===0?'#d9b650':'#d3cec4',index===0?20:13,surveyRoads);terrain(d,'none',index===0?'#fff5b3':'#fffefa',index===0?15:9,surveyRoads);
        }
        for(const d of ['M-840 -1700Q-620 -1000 -710 -300L-830 420Q-900 700 -1300 1200','M540 -1600Q610 -700 640 0T720 1600','M-830 480Q-500 750 240 830T2400 840']) {
          terrain(d,'none','#d6ad43',27);terrain(d,'none','#fff0a2',21);terrain(d,'none','#fff8cc',2);
        }
        const text = (value,x,y,cls,rotate=0) => {
          const el=make('text',{x,y,class:cls,'text-anchor':'middle',transform:`rotate(${rotate} ${x} ${y})`},layer); el.textContent=value;
        };
        text('Northside',-240,-800,'ref-map-district');text('Riverside',-100,-410,'ref-map-district');
        text('Eastwood',1350,-250,'ref-map-district');text('West Hills',-1390,590,'ref-map-district');text('Meadowbrook',1180,700,'ref-map-district');
        text('Riverview',-1100,-820,'ref-map-park');text('Park',-1100,-765,'ref-map-park');
        text('Lakeside',810,-810,'ref-map-park');text('Park',810,-755,'ref-map-park');
        text('Cedar Grove',-1450,790,'ref-map-park');text('Park',-1450,845,'ref-map-park');
        text('Oakridge',-1870,-380,'ref-map-water');text('Bay',-1870,-320,'ref-map-water');
        text('Mill River',150,190,'ref-map-water');text('Willow',1280,-750,'ref-map-water');text('Lake',1280,-695,'ref-map-water');
        text('Harbor Road',-740,-420,'mag-road-label',-82);text('Lakeriet Road',610,-700,'mag-road-label',84);
        text('Pieretview Boulevard',700,520,'mag-road-label',86);text('Ridgeway Road',70,800,'mag-road-label',7);text('Orchard Street',1170,835,'mag-road-label');
        text('Maple Street',-200,-660,'mag-minor-label');text('Cedar Street',200,-500,'mag-minor-label');text('Elm Street',1400,-410,'mag-minor-label');
        return view;
      },
    },
  },
});
