// Design on the shared pan-map/city template.
env.widget({
  task: 'pan-map',
  site: 'design-pan-map-zoomto-01',
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
          const zoom = document.querySelector('[data-rm-status="zoom"] span:last-child');
          const centre = document.querySelector('[data-rm-status="centre"] span:last-child');
          if (zoom) zoom.textContent = String(model.z);
          if (centre) centre.textContent = model.c.map(v => Math.round(v)).join(', ');
        };
      },
      editorPin(base, S) {
        return function(ctx, labels, place, index) {
          const pin = base(ctx, labels, place, index), dot = pin.querySelector('.mp-dot');
          const kind = `${place.kind || ''} ${place.type || ''} ${place.label || ''} ${place.name || ''}`.toLowerCase();
          const match = kind.match(/hospital|station|park|museum|theatre|theater|library|market|hotel|harbour|harbor/);
          const icons = { hospital:['+', '#e23736'], station:['▣', '#1776c8'], park:['♣', '#238b4a'], museum:['▤', '#d83b32'], theatre:['◆', '#7938c7'], theater:['◆', '#7938c7'], library:['▤', '#e27618'], market:['▣', '#e27618'], hotel:['▰', '#8438bb'], harbour:['⚓', '#1776c8'], harbor:['⚓', '#1776c8'] };
          const [symbol, color] = icons[match && match[0]] || ['•', '#2475b8'];
          dot.textContent = symbol;
          pin.style.setProperty('--c', color);
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
        add('path', { class:'rm-sea', d:`M${c-1900} ${cy-1200} H${c-510} C${c-400} ${cy-1000} ${c-630} ${cy-760} ${c-450} ${cy-600} C${c-300} ${cy-420} ${c-590} ${cy-260} ${c-390} ${cy-60} C${c-280} ${cy+70} ${c-510} ${cy+190} ${c-340} ${cy+380} L${c-1900} ${cy+380} Z` });
        add('path', { class:'rm-lake', d:`M${c+620} ${cy+520} C${c+820} ${cy+360} ${c+1150} ${cy+420} ${c+1230} ${cy+640} C${c+1310} ${cy+850} ${c+1140} ${cy+1050} ${c+890} ${cy+1000} C${c+650} ${cy+950} ${c+500} ${cy+740} ${c+620} ${cy+520} Z` });
        add('path', { class:'rm-park', d:`M${c-100} ${cy-1050} C${c+140} ${cy-1180} ${c+460} ${cy-1120} ${c+520} ${cy-860} L${c+390} ${cy-560} L${c+80} ${cy-610} Z` });
        add('path', { class:'rm-park', d:`M${c+520} ${cy-80} C${c+780} ${cy-260} ${c+1120} ${cy-180} ${c+1170} ${cy+90} L${c+980} ${cy+360} L${c+650} ${cy+290} Z` });
        add('path', { class:'rm-park', d:`M${c-270} ${cy+450} C${c-120} ${cy+280} ${c+260} ${cy+300} ${c+370} ${cy+520} L${c+260} ${cy+800} L${c-100} ${cy+760} Z` });
        add('path', { class:'rm-river', d:`M${c-1150} ${cy+570} C${c-850} ${cy+430} ${c-600} ${cy+650} ${c-330} ${cy+520} S${c+140} ${cy+360} ${c+390} ${cy+470} S${c+920} ${cy+650} ${c+1450} ${cy+410}` });
        const roads = [
          `M${c-1250} ${cy-260} C${c-890} ${cy-180} ${c-630} ${cy-430} ${c-250} ${cy-330} S${c+420} ${cy-180} ${c+1250} ${cy-310}`,
          `M${c-1300} ${cy+280} C${c-850} ${cy+130} ${c-520} ${cy+340} ${c-120} ${cy+230} S${c+620} ${cy+140} ${c+1330} ${cy+260}`,
          `M${c-780} ${cy-950} C${c-650} ${cy-560} ${c-780} ${cy-240} ${c-640} ${cy+30} S${c-690} ${cy+550} ${c-820} ${cy+950}`,
          `M${c+450} ${cy-1050} C${c+570} ${cy-650} ${c+430} ${cy-250} ${c+570} ${cy+40} S${c+510} ${cy+650} ${c+420} ${cy+1050}`,
        ];
        roads.forEach(d => add('path', { class:'rm-major-road', d }));
        for (let i=0;i<25;i++) {
          const x=c-420+i*58;
          add('path',{class:'rm-street',d:`M${x} ${cy-1100} C${x+((i%3)-1)*24} ${cy-420} ${x-((i%4)-1)*18} ${cy+280} ${x+((i%3)-1)*28} ${cy+1100}`});
        }
        for (let i=0;i<25;i++) {
          const y=cy-960+i*82;
          add('path',{class:'rm-street',d:`M${c-500} ${y} C${c-180} ${y-24} ${c+220} ${y+28} ${c+980} ${y}`});
        }
        [['Northshore',c+30,cy-480],['Rivermere',c+30,cy+40],['Old Town',c-460,cy+170],['Riverdale',c+540,cy+170],['Lakeside',c-40,cy+690]].forEach(([t,x,y])=>{
          const e=add('text',{class:'rm-district-label',x,y,'text-anchor':'middle'}); e.textContent=t;
        });
        const bay=add('text',{class:'rm-water-label',x:c-850,y:cy-360,'text-anchor':'middle'}); bay.textContent='Rivermere Bay';
        const river=add('text',{class:'rm-water-label',x:c+250,y:cy+540,'text-anchor':'middle'}); river.textContent='Clearwater River';
        [['Pine Park',c+220,cy-780],['Cedar Park',c+850,cy+80],['Mill Park',c+80,cy+600]].forEach(([t,x,y])=>{const e=add('text',{class:'rm-park-label',x,y,'text-anchor':'middle'});e.textContent=t;});
        roadLabels.forEach((e,i)=>{ if (spec.world.roads[i]) e.textContent=spec.world.roads[i].name; });
        return out;
        };
      }
    }
  },
});
