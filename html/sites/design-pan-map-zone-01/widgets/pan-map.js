// Design on the shared pan-map/city template.
env.widget({
  task: 'pan-map',
  site: 'design-pan-map-zone-01',
  name: 'design',
  split: 'train',
  scenarios: ['zone'],
  traits: { zoom: 'both' },
  template: 'pan-map/city',
  design: {
    mapColors: { land: '#f1eee8', water: '#83c9ed', park: '#a8d894', street: '#fffdf9', road: '#f6c65e', casing: '#edab48', editorLand: '#eeece8', editorRoad: '#fffdf9', editorCasing: '#c9c5bd', productLand: '#eeeae3', productWater: '#83c9ed', productPark: '#a8d894', productRoad: '#f6c65e' },
    parts: {
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
      add('path', { class: 'orbit-shore', d: `M${cx-1500} ${cy-1300} C${cx-1050} ${cy-1050} ${cx-1180} ${cy-650} ${cx-920} ${cy-450} C${cx-700} ${cy-200} ${cx-1050} ${cy+120} ${cx-860} ${cy+330} C${cx-660} ${cy+620} ${cx-1030} ${cy+850} ${cx-760} ${cy+1300} L${cx-1500} ${cy+1300}Z` }, features);
      add('path', { class: 'orbit-river', d: `M${cx-1000} ${cy+700} C${cx-550} ${cy+470} ${cx-250} ${cy+860} ${cx+150} ${cy+680} S${cx+850} ${cy+590} ${cx+1500} ${cy+790}` }, features);
      add('path', { class: 'orbit-lake', d: `M${cx+500} ${cy-1250} C${cx+760} ${cy-1450} ${cx+1120} ${cy-1280} ${cx+1300} ${cy-1050} C${cx+1280} ${cy-780} ${cx+850} ${cy-750} ${cx+610} ${cy-890}Z` }, features);
      add('path', { class: 'orbit-island', d: `M${cx-1120} ${cy+80} C${cx-1040} ${cy-40} ${cx-900} ${cy-25} ${cx-850} ${cy+105} C${cx-820} ${cy+230} ${cx-915} ${cy+325} ${cx-1050} ${cy+280} C${cx-1150} ${cy+250} ${cx-1190} ${cy+155} ${cx-1120} ${cy+80}Z` }, features);
      for (const [x,y,rx,ry] of [[-560,-940,180,100],[960,-640,220,115],[-820,930,260,145],[680,790,190,110],[-180,390,90,62]]) {
        add('path', { class: 'orbit-park', d: `M${cx+x-rx} ${cy+y} C${cx+x-rx*.75} ${cy+y-ry} ${cx+x-rx*.2} ${cy+y-ry*1.2} ${cx+x+rx*.25} ${cy+y-ry*.8} C${cx+x+rx*1.1} ${cy+y-ry*.4} ${cx+x+rx*.95} ${cy+y+ry*.45} ${cx+x+rx*.4} ${cy+y+ry*.7} C${cx+x-rx*.15} ${cy+y+ry*1.2} ${cx+x-rx*.9} ${cy+y+ry*.6} ${cx+x-rx} ${cy+y}Z` }, features);
      }
      const localRoads = add('g', { class: 'orbit-local-roads' }, features);
      for (let row = -8; row <= 8; row++) {
        const y = cy + row * 132;
        add('path', { class: 'orbit-minor-casing', d: `M${cx-1450} ${y+35} C${cx-940} ${y-24} ${cx-620} ${y+28} ${cx-210} ${y-8} S${cx+570} ${y+28} ${cx+1450} ${y-18}` }, localRoads);
        add('path', { class: 'orbit-minor-road', d: `M${cx-1450} ${y+35} C${cx-940} ${y-24} ${cx-620} ${y+28} ${cx-210} ${y-8} S${cx+570} ${y+28} ${cx+1450} ${y-18}` }, localRoads);
      }
      for (let col = -9; col <= 9; col++) {
        const x = cx + col * 138;
        add('path', { class: 'orbit-minor-casing', d: `M${x-24} ${cy-1450} C${x+22} ${cy-940} ${x-18} ${cy-520} ${x+12} ${cy-100} S${x-22} ${cy+740} ${x+20} ${cy+1450}` }, localRoads);
        add('path', { class: 'orbit-minor-road', d: `M${x-24} ${cy-1450} C${x+22} ${cy-940} ${x-18} ${cy-520} ${x+12} ${cy-100} S${x-22} ${cy+740} ${x+20} ${cy+1450}` }, localRoads);
      }
      const roadPaths = [
        [`M${cx-1100} ${cy-600} C${cx-500} ${cy-720} ${cx+250} ${cy-520} ${cx+1200} ${cy-680}`, 'Riverton Road'],
        [`M${cx-650} ${cy-900} C${cx-480} ${cy-250} ${cx-530} ${cy+300} ${cx-680} ${cy+800}`, 'Main Street'],
        [`M${cx+120} ${cy-980} C${cx+190} ${cy-360} ${cx+120} ${cy+360} ${cx+80} ${cy+900}`, 'Fox Run'],
        [`M${cx+700} ${cy-850} C${cx+620} ${cy-220} ${cx+790} ${cy+350} ${cx+720} ${cy+850}`, 'Lakeside Drive']
      ];
      for (const [i, [d, name]] of roadPaths.entries()) {
        add('path', { class: 'orbit-major-casing', d }, features);
        add('path', { class: 'orbit-major-road', d }, features);
        const text = add('text', { class: 'orbit-map-label', x: cx+[-780,-430,140,760][i], y: cy+[-610,-220,210,-540][i] }, features); text.textContent = name;
      }
      const crossRoads = [
        [`M${cx-1150} ${cy-120} C${cx-650} ${cy-170} ${cx-140} ${cy-60} ${cx+400} ${cy-110} S${cx+980} ${cy-80} ${cx+1450} ${cy-160}`, 'Maple Avenue', -20],
        [`M${cx-1350} ${cy+410} C${cx-740} ${cy+350} ${cx-220} ${cy+470} ${cx+340} ${cy+390} S${cx+900} ${cy+460} ${cx+1430} ${cy+370}`, 'Cedar Lane', 440],
        [`M${cx-1020} ${cy+80} C${cx-400} ${cy+10} ${cx+250} ${cy+100} ${cx+1150} ${cy+30}`, 'Elm Road', 95]
      ];
      for (const [d, name, y] of crossRoads) {
        add('path', { class: 'orbit-secondary-casing', d }, features);
        add('path', { class: 'orbit-secondary-road', d }, features);
        const text=add('text',{class:'orbit-map-label orbit-small-label',x:cx+180,y:cy+y},features); text.textContent=name;
      }
      const trees = add('g', { class: 'orbit-trees' }, features);
      for (const [x,y] of [[-600,-950],[-500,-900],[-650,-910],[920,-680],[1010,-650],[870,-620],[-850,920],[-760,970],[-900,980],[650,790],[710,820],[590,750],[-170,390],[-190,420]]) {
        add('circle',{cx:cx+x,cy:cy+y,r:17,class:'orbit-tree'},trees);
        add('circle',{cx:cx+x-5,cy:cy+y-6,r:5,class:'orbit-tree-light'},trees);
      }
      const districtNames = ['Riverside District','Northwood District','Meadowbrook District','Oakridge District','Cedar Grove District'];
      districtNames.forEach((name, i) => { const text=add('text',{class:'orbit-map-district',x:cx+[-760,80,790,-380,440][i],y:cy+[-300,-470,-260,420,440][i]},features); text.textContent=name; });
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
      return tools;
    },
    editorReadout: (base) => (ctx, port, chrome) => {
      const result = base(ctx, port, chrome);
      const bottom = port.parentNode.querySelector('.orbit-zone-bottom');
      if (bottom) bottom.appendChild(result.readout);
      return result;
    },
    editorPin: (base) => (ctx, labels, place, index) => {
      const pin = base(ctx, labels, place, index);
      const dot = pin.querySelector('.mp-dot');
      const address = place.kind !== 'venue';
      if (dot) dot.textContent = address ? '⌂' : '✦';
      pin.style.setProperty('--c', address ? '#f27655' : '#8054c7');
      return pin;
    }
    },
  },
});
