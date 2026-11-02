// Design on the shared pan-map/city template.
env.widget({
  task: 'pan-map',
  site: 'design-pan-map-zoomto-03',
  name: 'design',
  split: 'train',
  scenarios: ['zoomto'],
  traits: { zoom: 'both' },
  template: 'pan-map/city',
  design: {
    parts: {
      editorHeading: (base) => (ctx, panel) => {
        const section = ctx.util.el('div', 'mpe-section harbor-directory-head', panel);
        ctx.util.el('strong', 'mpe-heading', section, 'Places');
        ctx.util.el('span', 'mpp-meta', section, `${ctx.spec.places.length} items`);
        return section;
      },
      editorWorld: (base) => (ctx, port, W, H) => {
        const view = base(ctx, port, W, H);
        const { world } = view;
        const s = ctx.spec;
        const ns = 'http://www.w3.org/2000/svg';
        const cx = s.world.W / 2, cy = s.world.H / 2;
        const add = (tag, attrs) => {
          const el = document.createElementNS(ns, tag);
          for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, String(value));
          world.appendChild(el);
          return el;
        };
        world.replaceChildren();
        add('path', { d: `M${cx-1400} ${cy-1000}H${cx+1500}V${cy+1000}L${cx+1000} ${cy+900}Q${cx+750} ${cy+720} ${cx+540} ${cy+810}T${cx+120} ${cy+760}Q${cx-80} ${cy+820} ${cx-260} ${cy+690}T${cx-720} ${cy+620}Q${cx-950} ${cy+520} ${cx-1180} ${cy+300}Z`, fill: '#193f43', stroke: '#367568', 'stroke-width': 12 });
        add('path', { d: `M${cx-1400} ${cy-1000}H${cx-640}Q${cx-560} ${cy-790} ${cx-700} ${cy-610}T${cx-540} ${cy-360}Q${cx-690} ${cy-150} ${cx-520} ${cy+30}T${cx-710} ${cy+310}Q${cx-890} ${cy+510} ${cx-1180} ${cy+300}Z`, fill: '#06365b', stroke: '#126084', 'stroke-width': 9 });
        add('path', { d: `M${cx-720} ${cy-190}Q${cx-450} ${cy-260} ${cx-210} ${cy-120}T${cx+270} ${cy-55}Q${cx+560} ${cy-110} ${cx+890} ${cy+60}`, fill: 'none', stroke: '#0879a6', 'stroke-width': 72, 'stroke-linecap': 'round' });
        add('path', { d: `M${cx-720} ${cy-190}Q${cx-450} ${cy-260} ${cx-210} ${cy-120}T${cx+270} ${cy-55}Q${cx+560} ${cy-110} ${cx+890} ${cy+60}`, fill: 'none', stroke: '#3e9eb6', 'stroke-width': 8, 'stroke-linecap': 'round' });
        const parkShapes = [
          `M${cx+260} ${cy-740}Q${cx+400} ${cy-850} ${cx+590} ${cy-760}T${cx+780} ${cy-630}Q${cx+690} ${cy-450} ${cx+520} ${cy-500}T${cx+260} ${cy-570}Z`,
          `M${cx-1090} ${cy-190}Q${cx-920} ${cy-390} ${cx-730} ${cy-260}T${cx-690} ${cy+20}Q${cx-820} ${cy+220} ${cx-1030} ${cy+80}Z`,
          `M${cx-190} ${cy+470}Q${cx+20} ${cy+350} ${cx+180} ${cy+470}T${cx+370} ${cy+690}Q${cx+120} ${cy+780} ${cx-120} ${cy+670}Z`,
        ];
        for (const d of parkShapes) add('path', { d, fill: '#1e624c', stroke: '#438364', 'stroke-width': 8 });
        const streets = [];
        for (let i = -5; i <= 5; i++) {
          const x = cx + i * 160;
          streets.push(`M${x-60} ${cy-690}Q${x+40} ${cy-320} ${x-20} ${cy+30}T${x+25} ${cy+620}`);
          const y = cy + i * 125;
          streets.push(`M${cx-1050} ${y-35}Q${cx-500} ${y+50} ${cx+20} ${y-20}T${cx+1050} ${y+30}`);
        }
        add('path', { d: streets.join(''), fill: 'none', stroke: '#a7cbd7', 'stroke-width': 7, opacity: .8, 'stroke-linecap': 'round' });
        const lanes = [];
        for (let i = -6; i <= 6; i++) {
          const x = cx + i * 115;
          lanes.push(`M${x} ${cy-600}Q${x+35} ${cy-280} ${x-15} ${cy+40}T${x+20} ${cy+560}`);
          const y = cy + i * 92;
          lanes.push(`M${cx-960} ${y}Q${cx-450} ${y+18} ${cx+30} ${y-16}T${cx+980} ${y+5}`);
        }
        add('path', { d: lanes.join(''), fill: 'none', stroke: '#d2e3e7', 'stroke-width': 2.6, opacity: .72 });
        for (const road of s.world.roads) {
          const d = road.pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join('');
          add('path', { d, fill: 'none', stroke: '#955f38', 'stroke-width': 23, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' });
          add('path', { d, fill: 'none', stroke: '#efbd51', 'stroke-width': 15, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' });
        }
        for (const [text, x, y] of [['West End',cx-820,cy-320],['Northside',cx+590,cy-470],['Riverton',cx+350,cy-40],['City Centre',cx-120,cy+150],['Old Town',cx-510,cy+400],['Eastwood',cx+700,cy+250],['Pine Hill',cx+150,cy+610]]) {
          const label = add('text', { x, y, fill: '#b7d2df', 'font-size': 46, 'font-family': 'Segoe UI, Arial, sans-serif', 'text-anchor': 'middle', opacity: .9 });
          label.textContent = text;
        }
        return view;
      },
    },
  },
});
