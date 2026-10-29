// Design on the shared pan-map/city template.
env.widget({
  task: 'pan-map',
  site: 'design-pan-map-zone-02',
  name: 'design',
  split: 'train',
  scenarios: ['zone'],
  traits: { zoom: 'both' },
  template: 'pan-map/city',
  design: {
    font: '16px/1.2 Arial, sans-serif', panelWidth: 226, narrowPanelWidth: 190,
    mapColors: { land: '#ece6d8', water: '#9fcbe8', park: '#bfdcae', street: '#fff', road: '#f7d58a', casing: '#c9a75a', transitRoad: '#e9a3a3', transitCasing: '#b55d5d', parkName: '#2f7a35', open: '#16824a', productLand: '#b7c5a4', productWater: '#66a9c9', productPark: '#76a55c', productRoad: '#e1cb91', editorLand: '#a4b594', editorRoad: '#e9d197', editorCasing: '#9a927b', droppedPin: '#c74439' },
    editorTitles: { zone: 'Places (20)' },
    editorHints: { zone: '' },
    parts: {
      editorFrame: (base) => (ctx, work) => {
        work.style.position = 'relative';
        work.style.display = 'block';
        work.style.width = '100%';
        work.style.height = '100%';
        const frame = base(ctx, work);
        frame.map.style.position = 'absolute';
        frame.map.style.inset = '0';
        frame.map.style.width = '100%';
        frame.map.style.height = '100%';
        frame.port.style.position = 'absolute';
        frame.port.style.inset = '0';
        frame.port.style.width = '100%';
        frame.port.style.height = '100%';
        frame.W = frame.port.clientWidth || work.clientWidth || ctx.size.width;
        frame.H = frame.port.clientHeight || work.clientHeight || (ctx.size.height - 190);
        return frame;
      },
      editorWorld: (base) => (ctx, port, W, H) => {
        const view = base(ctx, port, W, H);
        const svg = view.world.ownerSVGElement;
        const ns = 'http://www.w3.org/2000/svg';
        const width = ctx.spec.world.W || W * 2;
        const height = ctx.spec.world.H || H * 2;
        const cx = width / 2, cy = height / 2;
        const waterway = document.createElementNS(ns, 'path');
        waterway.setAttribute('d', `M${cx + 560},${cy - 1000} C${cx + 380},${cy - 650} ${cx + 760},${cy - 360} ${cx + 570},${cy - 80} C${cx + 420},${cy + 180} ${cx + 750},${cy + 390} ${cx + 590},${cy + 680} C${cx + 470},${cy + 900} ${cx + 630},${cy + 1050} ${cx + 700},${cy + 1200}`);
        waterway.setAttribute('fill', 'none'); waterway.setAttribute('stroke', '#75c2ed');
        waterway.setAttribute('stroke-width', '190'); waterway.setAttribute('stroke-linecap', 'round');
        waterway.setAttribute('stroke-linejoin', 'round');
        const bank = waterway.cloneNode(); bank.setAttribute('stroke', '#9bd58c'); bank.setAttribute('stroke-width', '270');
        const lake = document.createElementNS(ns, 'path');
        lake.setAttribute('d', `M${cx - 1500},${cy - 1050} C${cx - 1150},${cy - 930} ${cx - 1250},${cy - 720} ${cx - 1050},${cy - 500} C${cx - 890},${cy - 300} ${cx - 1200},${cy - 210} ${cx - 1080},${cy + 20} C${cx - 930},${cy + 280} ${cx - 1270},${cy + 480} ${cx - 1500},${cy + 560} Z`);
        lake.setAttribute('fill', '#75c2ed');
        view.world.insertBefore(lake, view.world.firstChild);
        view.world.insertBefore(bank, view.world.firstChild);
        view.world.insertBefore(waterway, view.world.firstChild);
        const districts = [
          ['Pineview Park', cx - 620, cy - 560], ['Northwood District', cx + 80, cy - 650],
          ['Lakeside District', cx - 620, cy + 180], ['Downtown', cx + 40, cy + 300],
          ['Eastbrook District', cx + 760, cy + 210], ['Meadowfield District', cx - 120, cy + 720],
          ['Central Park', cx + 330, cy + 40], ['Riverside Park', cx + 860, cy - 500],
        ];
        for (const [label, x, y] of districts) {
          const t = document.createElementNS(ns, 'text');
          t.textContent = label; t.setAttribute('x', x); t.setAttribute('y', y);
          t.setAttribute('text-anchor', 'middle'); t.setAttribute('fill', '#16345e');
          t.setAttribute('font-family', 'Georgia, serif'); t.setAttribute('font-size', '43');
          t.setAttribute('font-weight', 'bold'); t.setAttribute('stroke', '#fff');
          t.setAttribute('stroke-width', '5'); t.setAttribute('paint-order', 'stroke');
          view.world.appendChild(t);
        }
        return view;
      },
      editorTools: (base) => (ctx, port, commit) => {
        const controls = base(ctx, port, commit);
        const label = (button, text) => {
          const node = [...button.childNodes].reverse().find((n) => n.nodeType === 3);
          if (node) node.nodeValue = text;
          else button.append(document.createTextNode(text));
        };
        label(controls.edit, 'Draw Boundary');
        label(controls.clear, 'Clear Boundary');
        label(controls.close, 'Close Boundary');
        label(controls.pan, 'Pan');
        controls.edit.classList.add('zone-draw');
        controls.pan.classList.add('zone-pan');
        controls.clear.classList.add('zone-clear');
        controls.close.classList.add('zone-close');
        const select = ctx.util.el('button', 'zone-select', controls.tools, 'Select');
        select.type = 'button';
        select.addEventListener('click', () => controls.pan.click());
        controls.tools.insertBefore(select, controls.edit);
        return controls;
      },
    },
  },
});
