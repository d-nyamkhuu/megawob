// Design on the shared pan-map/city template.
env.widget({
  task: 'pan-map',
  site: 'design-pan-map-marker-04',
  name: 'design',
  split: 'train',
  scenarios: ['marker'],
  traits: { zoom: 'both' },
  template: 'pan-map/city',
  design: {
    parts: {
      explorerWorld: (base) => (ctx, port, W, H) => {
        const map = base(ctx, port, W, H);
        const { wd, world, streets, casings, roads } = map;
        const ns = 'http://www.w3.org/2000/svg';
        const pt = (x, y) => [Math.round(x * wd.W), Math.round(y * wd.H)];
        const center = ctx.model && ctx.model.c || [wd.W/2,wd.H/2];
        const parkShapes = [
          { name: 'Riverside Park', pts: [[-620,80],[-570,10],[-450,0],[-410,90],[-450,185],[-570,180]] },
          { name: 'Harborview Park', pts: [[210,-390],[300,-440],[405,-395],[390,-290],[290,-265],[215,-315]] },
          { name: 'Meadow Park', pts: [[-150,390],[-50,330],[60,365],[85,470],[-15,525],[-120,485]] },
        ];
        for (const park of parkShapes) {
          const pts = park.pts.map(([x,y]) => [Math.round(center[0]+x),Math.round(center[1]+y)]);
          const d = `M${pts.map(([x,y]) => `${x} ${y}`).join('L')}Z`;
          const path = document.createElementNS(ns, 'path');
          path.setAttribute('class','mp-park'); path.setAttribute('d',d);
          world.insertBefore(path, streets);
          wd.parks.push({ name: park.name, pts });
        }
        const river = document.createElementNS(ns, 'path');
        river.setAttribute('class','mp-river'); river.setAttribute('d',`M0 ${Math.round(wd.H*.61)} C${Math.round(wd.W*.22)} ${Math.round(wd.H*.53)},${Math.round(wd.W*.34)} ${Math.round(wd.H*.71)},${Math.round(wd.W*.52)} ${Math.round(wd.H*.62)} S${Math.round(wd.W*.8)} ${Math.round(wd.H*.55)},${wd.W} ${Math.round(wd.H*.64)}`);
        river.setAttribute('stroke-width',Math.max(28,wd.H*.035)); world.insertBefore(river, streets);
        const paths = [
          { name:'Riverton Expressway', pts:[[0,.27],[.24,.31],[.47,.25],[.72,.3],[1,.24]] },
          { name:'Cedar Boulevard', pts:[[.36,0],[.4,.25],[.43,.5],[.39,.76],[.44,1]] },
          { name:'Kingston Road', pts:[[0,.8],[.22,.75],[.49,.82],[.72,.77],[1,.84]] },
        ];
        for (const road of paths) {
          const pts = road.pts.map(([x,y]) => pt(x,y));
          const d = `M${pts.map(([x,y]) => `${x} ${y}`).join('L')}`;
          const casing = document.createElementNS(ns,'path');
          casing.setAttribute('class','mp-casing'); casing.setAttribute('d',d); casing.setAttribute('vector-effect','non-scaling-stroke');
          const surface = document.createElementNS(ns,'path');
          surface.setAttribute('class','mp-road'); surface.setAttribute('d',d); surface.setAttribute('vector-effect','non-scaling-stroke');
          world.append(casing,surface); casings.push(casing); roads.push(surface); wd.roads.push(road);
        }
        return map;
      },
    },
    font: '14px/1.4 system-ui,sans-serif',
    mapColors: { land: '#f3f2ef', water: '#62bdf0', park: '#b9dfa9', street: '#ffffff', road: '#ffd65e', casing: '#e5b83f', transitRoad: '#e9a3a3', transitCasing: '#b55d5d', parkName: '#19713d', open: '#16824a', productLand: '#f3f2ef', productWater: '#62bdf0', productPark: '#b9dfa9', productRoad: '#ffd65e', editorLand: '#f3f2ef', editorRoad: '#ffd65e', editorCasing: '#e5b83f', droppedPin: '#c74439' },
    tierColors: { 1: '#e4373b', 2: '#0877ed', 3: '#771a9e' },
    venueColor: '#8b20a5',
    widthInset: 10,
    heightInset: 8,
    maxWidth: 1600,
    maxHeight: 900,
    maxMapWidth: 1800,
    minMapWidth: 300,
  },
});
