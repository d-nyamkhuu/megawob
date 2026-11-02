// Design on the shared pan-map/city template.
env.widget({
  task: 'pan-map',
  site: 'design-pan-map-zone-03',
  name: 'design',
  split: 'train',
  scenarios: ['zone'],
  traits: { zoom: 'both' },
  template: 'pan-map/city',
  design: {
    mapColors: { land: '#d3d0ca', water: '#4a8fc9', park: '#9bc99a', street: '#f4f2ee', road: '#f0e3ad', casing: '#9f9d99', editorLand: '#d3d0ca', editorRoad: '#f4f2ee', editorCasing: '#aaa8a3', productLand: '#d3d0ca', productWater: '#4a8fc9', productPark: '#9bc99a', productRoad: '#f0e3ad' },
    parts: {
    editorSearch: (base) => (ctx, top) => {
      const result = base(ctx, top);
      const root = top.parentNode;
      const panel = root.querySelector('.mpp-panel');
      if (panel && result.search.parentNode) panel.insertBefore(result.search.parentNode, panel.firstChild);
      return result;
    },
    editorHeading: (_base) => (ctx, panel) => {
      const legend = ctx.util.el('section', 'irix-legend', panel);
      ctx.util.el('div', 'irix-pane-title', legend, 'Map Legend');
      const rows = [['✚','Hospital / Clinic','red'],['▣','Shop / Market','blue'],['▣','Cafe / Restaurant','brown'],['▥','School / Library','purple'],['▤','Cultural Venue','orange'],['♣','Park / Green Space','green'],['■','Hotel','blue'],['━','Major Road','road'],['━','Street','street'],['■','Water','water'],['■','Park','park'],['■','Building / Area','building']];
      const inner = ctx.util.el('div', 'irix-legend-inner', legend);
      rows.forEach(([symbol, label, color]) => {
        const row = ctx.util.el('div', 'irix-legend-row', inner);
        ctx.util.el('span', `irix-symbol ${color}`, row, symbol);
        ctx.util.el('span', '', row, label);
      });
      const section = ctx.util.el('div', 'mpe-section orbit-places-head', panel);
      ctx.util.el('div', 'mpe-heading', section, `Places (${ctx.spec.places.length})`);
      return section;
    },
    editorDirectory: (base) => (ctx, panel, commit) => {
      const result = base(ctx, panel, commit);
      const glyphs = [['✚','red'],['▣','blue'],['▥','purple'],['▣','brown'],['▣','blue'],['♣','green'],['▥','purple'],['▤','orange']];
      [...result.list.querySelectorAll('.mpe-item')].forEach((row, i) => {
        const button = row.querySelector('button');
        if (!button) return;
        const name = row.querySelector('.mpe-name')?.textContent?.trim() || row.querySelector('.mpe-address')?.textContent?.trim() || button.textContent.trim();
        const [symbol, color] = glyphs[i % glyphs.length];
        const icon = ctx.util.el('span', `irix-place-icon ${color}`, null, symbol);
        const label = ctx.util.el('span', 'irix-place-name', null, name);
        button.replaceChildren(icon, label);
      });
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
      const shore = add('path', { class: 'orbit-shore', d: `M${cx-1600} ${cy-1600} L${cx-210} ${cy-1600} C${cx-140} ${cy-1230} ${cx-560} ${cy-1120} ${cx-520} ${cy-900} C${cx-460} ${cy-720} ${cx-820} ${cy-660} ${cx-700} ${cy-430} C${cx-560} ${cy-230} ${cx-830} ${cy-70} ${cx-820} ${cy+140} C${cx-790} ${cy+410} ${cx-1050} ${cy+550} ${cx-1000} ${cy+780} C${cx-930} ${cy+1010} ${cx-1100} ${cy+1270} ${cx-950} ${cy+1600} L${cx-1600} ${cy+1600}Z` }, features);
      const river = add('path', { class: 'orbit-river', d: `M${cx+930} ${cy-1600} C${cx+650} ${cy-1160} ${cx+1050} ${cy-730} ${cx+860} ${cy-390} C${cx+640} ${cy-40} ${cx+840} ${cy+290} ${cx+750} ${cy+560} C${cx+670} ${cy+900} ${cx+1100} ${cy+1190} ${cx+940} ${cy+1600}` }, features);
      add('path', { class: 'orbit-lake', d: `M${cx+500} ${cy-1250} C${cx+760} ${cy-1450} ${cx+1120} ${cy-1280} ${cx+1300} ${cy-1050} C${cx+1280} ${cy-780} ${cx+850} ${cy-750} ${cx+610} ${cy-890}Z` }, features);
      add('path', { class: 'orbit-island', d: `M${cx-1120} ${cy+80} C${cx-1040} ${cy-40} ${cx-900} ${cy-25} ${cx-850} ${cy+105} C${cx-820} ${cy+230} ${cx-915} ${cy+325} ${cx-1050} ${cy+280} C${cx-1150} ${cy+250} ${cx-1190} ${cy+155} ${cx-1120} ${cy+80}Z` }, features);
      const parkShapes=[];
      for (const [x,y,rx,ry] of [[-560,-940,180,100],[960,-640,220,115],[-820,930,260,145],[680,790,190,110],[-180,390,90,62]]) {
        parkShapes.push(add('path', { class: 'orbit-park', d: `M${cx+x-rx} ${cy+y} C${cx+x-rx*.75} ${cy+y-ry} ${cx+x-rx*.2} ${cy+y-ry*1.2} ${cx+x+rx*.25} ${cy+y-ry*.8} C${cx+x+rx*1.1} ${cy+y-ry*.4} ${cx+x+rx*.95} ${cy+y+ry*.45} ${cx+x+rx*.4} ${cy+y+ry*.7} C${cx+x-rx*.15} ${cy+y+ry*1.2} ${cx+x-rx*.9} ${cy+y+ry*.6} ${cx+x-rx} ${cy+y}Z` }, features));
      }
      const localRoads = add('g', { class: 'orbit-local-roads' }, features);
      for (let row = -17; row <= 17; row++) {
        const y = cy + row * 74;
        add('path', { class: 'orbit-minor-casing', d: `M${cx-1450} ${y+35} C${cx-940} ${y-24} ${cx-620} ${y+28} ${cx-210} ${y-8} S${cx+570} ${y+28} ${cx+1450} ${y-18}` }, localRoads);
        add('path', { class: 'orbit-minor-road', d: `M${cx-1450} ${y+35} C${cx-940} ${y-24} ${cx-620} ${y+28} ${cx-210} ${y-8} S${cx+570} ${y+28} ${cx+1450} ${y-18}` }, localRoads);
      }
      for (let col = -17; col <= 17; col++) {
        const x = cx + col * 78;
        add('path', { class: 'orbit-minor-casing', d: `M${x-24} ${cy-1450} C${x+22} ${cy-940} ${x-18} ${cy-520} ${x+12} ${cy-100} S${x-22} ${cy+740} ${x+20} ${cy+1450}` }, localRoads);
        add('path', { class: 'orbit-minor-road', d: `M${x-24} ${cy-1450} C${x+22} ${cy-940} ${x-18} ${cy-520} ${x+12} ${cy-100} S${x-22} ${cy+740} ${x+20} ${cy+1450}` }, localRoads);
      }
      features.appendChild(shore);
      features.appendChild(river);
      for (const park of parkShapes) features.appendChild(park);
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
      const districtNames = ['Riverside','Northwood','Meadowbrook','Oakridge','Cedar Grove'];
      districtNames.forEach((name, i) => { const text=add('text',{class:'orbit-map-district',x:cx+[-760,80,790,-380,440][i],y:cy+[-300,-470,-260,420,440][i]},features); text.textContent=name; });
      for (const [name,x,y,extra] of [['Pine Bay',-900,-220,'water'],['Maple River',825,45,'water'],['Cedar Point',-970,660,'park'],['Riverview Park',940,-680,'park']]) {
        const label=add('text',{class:`orbit-map-feature-label ${extra}`,x:cx+x,y:cy+y},features);
        label.textContent=name;
      }
      return view;
    },
    editorFrame: (base) => (ctx, work) => {
      const frame = base(ctx, work);
      const main = frame.map.closest('.mpp-main');
      if (main) {
        let branch = main;
        while (branch && branch !== ctx.stage) {
          const parent = branch.parentElement;
          if (!parent) break;
          for (const sibling of [...parent.children]) if (sibling !== branch) sibling.style.display = 'none';
          Object.assign(branch.style, { width:'100%', height:'100%', maxWidth:'none', maxHeight:'none', flex:'1 1 auto', margin:'0', padding:'0' });
          branch = parent;
        }
      }
      const shelf = ctx.util.el('div', 'irix-shelf', frame.map);
      const section = (title) => {
        const block = ctx.util.el('section', 'irix-shelf-section', shelf);
        ctx.util.el('div', 'irix-shelf-title', block, title);
        return block;
      };
      frame.irixBoundary = section('Boundary');
      frame.irixTools = section('Tools');
      frame.irixPan = section('Pan / Zoom');
      frame.irixShelf = shelf;
      return frame;
    },
    editorTools: (base) => (ctx, port, commit) => {
      const tools = base(ctx, port, commit);
      const map = port.parentNode;
      const shelf = map.querySelector('.irix-shelf');
      if (shelf) {
        const boundary = shelf.querySelector('.irix-shelf-section:nth-child(1)');
        const utility = shelf.querySelector('.irix-shelf-section:nth-child(2)');
        const pan = shelf.querySelector('.irix-shelf-section:nth-child(3)');
        const buttons = [...tools.tools.querySelectorAll('button')];
        const names = ['Draw Zone','Pan Map','Clear Zone','Close Zone'];
        buttons.forEach((b,i) => { if (names[i]) b.replaceChildren(document.createTextNode(names[i])); });
        if (buttons[0]) boundary.appendChild(buttons[0]);
        const add = ctx.util.el('button', 'irix-inactive', boundary, 'Add Vertex'); add.type='button'; add.disabled=true;
        if (buttons[3]) boundary.appendChild(buttons[3]);
        if (buttons[2]) boundary.appendChild(buttons[2]);
        const marker = ctx.util.el('button', 'irix-inactive', utility, 'Place Marker'); marker.type='button'; marker.disabled=true;
        const details = ctx.util.el('button', 'irix-inactive', utility, 'View Details'); details.type='button'; details.disabled=true;
        if (buttons[1]) pan.appendChild(buttons[1]);
        tools.tools.remove();
      }
      return tools;
    },
    editorReadout: (base) => (ctx, port, chrome) => {
      const result = base(ctx, port, chrome);
      result.readout.classList.add('irix-readout');
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
