// Design on templates/rotate-object/base.js: the base site's rotate-object widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'rotate-object',
  site: 'design-rotate-object-compass-04',
  name: 'design',
  split: 'train',
  scenarios: ['compass'],
  template: 'rotate-object/base',
  design: {
    parts: {
      'renderCompass': (base, S) => function renderCompass(ctx) {
        const { F, R2D, centerOf, env, polar, sv } = S;
        const { util, rng, size, spec } = ctx;
        const fam = F();
        const D = Math.floor(Math.min(500, size.height - 64, size.width - 300));
        const half = D / 2;
        const Rmap = half - 26;
        const Rring = half - 13;

        const card = util.el('div', 'rot-card', ctx.stage);
        card.style.gap = '24px';
        card.style.padding = '16px 22px';
        const svg = sv('svg', { class: 'rot-svg', width: D, height: D, viewBox: `${-half} ${-half} ${D} ${D}` }, card);
        svg.dataset.role = 'map';
        const defs = sv('defs', {}, svg);
        const cid = `rot-map-${Math.floor(rng.next() * 1e9)}`;
        sv('circle', { r: Rmap }, sv('clipPath', { id: cid }, defs));

        // Bezel ring (the drag target is the handle on it).
        sv('circle', { r: Rring, fill: 'none', stroke: 'color-mix(in srgb, var(--fg) 30%, var(--panel))', 'stroke-width': 24 }, svg);
        const turn = sv('g', {}, svg);
        const mapG = sv('g', { 'clip-path': `url(#${cid})` }, turn);
        const land = rng.pick(['#e9e7d9', '#eee9dc', '#e7ecdf']);
        sv('rect', { x: -half, y: -half, width: D, height: D, fill: land }, mapG);
        // Soft neighborhood parks and a pale, winding river give the map the illustrated atlas look.
        const parks = [];
        for (let k = 0; k < 3; k++) parks.push([rng.int(-Rmap, Rmap), rng.int(-Rmap, Rmap), rng.int(30, 70)]);
        for (const [x,y,r] of parks) {
          sv('path', { d:`M${x-r},${y} Q${x-r*1.1},${y-r*.6} ${x-r*.25},${y-r} Q${x+r*.75},${y-r*1.2} ${x+r},${y-r*.15} Q${x+r*1.2},${y+r*.75} ${x+r*.25},${y+r} Q${x-r*.8},${y+r*1.15} ${x-r},${y}Z`, fill:'#c9dfa9', opacity:.82 }, mapG);
          for (let n=0;n<7;n++) {
            const tx=x+Math.cos(n*2.4)*r*.66, ty=y+Math.sin(n*2.4)*r*.62;
            sv('circle',{cx:tx,cy:ty,r:5,fill:'#5b9e68',opacity:.75},mapG);
            sv('circle',{cx:tx-1.5,cy:ty-2,r:3.2,fill:'#81ba78'},mapG);
          }
        }
        const ry = rng.int(-Rmap / 2, Rmap / 2);
        const riverA = rng.int(-80,80), riverB = rng.int(-80,80), riverC = rng.int(-40,40);
        sv('path', { d: `M${half*.53},${-half} C${half*.3},${-half*.58} ${half*.84},${-half*.28+riverA*.12} ${half*.67},${half*.02} C${half*.54},${half*.3} ${half*.22},${half*.42+riverB*.08} ${half*.24},${half*.7} Q${half*.23},${half*.87} ${half*.1},${half} L${half*.53},${half} C${half*.65},${half*.78} ${half*.82},${half*.66} ${half*.75},${half*.45} C${half*.66},${half*.2} ${half*.98},${half*.02} ${half*.88},${-half*.2} Q${half*.78},${-half*.55} ${half*.82},${-half}Z`, fill:'#65b7dd', opacity:.95 }, mapG);
        // The streets have a narrow stone edge and a warm, almost white surface.
        for (let k = 0; k < 6; k++) {
          const a = rng.float(0, Math.PI);
          const o = rng.int(-Rmap, Rmap);
          const [dx, dy] = [Math.cos(a), Math.sin(a)];
          const x1=o*-dy-dx*D,y1=o*dx-dy*D,x2=o*-dy+dx*D,y2=o*dx+dy*D;
          const bend=(k%2?1:-1)*38, cx1=x1+dx*D*.62-dy*bend, cy1=y1+dy*D*.62+dx*bend, cx2=x2-dx*D*.62-dy*bend, cy2=y2-dy*D*.62+dx*bend;
          const d=`M${x1},${y1} C${cx1},${cy1} ${cx2},${cy2} ${x2},${y2}`;
          sv('path', { d, fill:'none', stroke:'#bcb8ae', 'stroke-width':k<2?13:8, 'stroke-linecap':'round' }, mapG);
          sv('path', { d, fill:'none', stroke:'#fffdf6', 'stroke-width':k<2?10:5, 'stroke-linecap':'round' }, mapG);
          if(k<3) sv('path',{d,fill:'none',stroke:'#ebe8df','stroke-width':1,'stroke-dasharray':'2 10','stroke-linecap':'round',opacity:.65},mapG);
        }
        // City blocks use irregular footprints, subtle shadows and individually pitched roofs.
        for (const [i,[x,y,w,h]] of [[-170,-145,48,30],[-108,-154,36,25],[-35,-160,43,28],[50,-148,46,34],[126,-126,34,27],[-202,-72,40,31],[-135,-54,48,33],[-65,-76,36,29],[12,-58,53,30],[91,-50,42,36],[155,8,34,29],[-174,28,45,35],[-103,35,38,27],[-28,50,50,34],[48,37,36,29],[-142,117,45,31],[-62,130,39,28],[20,122,48,34],[103,115,42,30]].entries()) {
          const turn=[-8,5,11,-4,7,-6,9,3,-10,6,2,-7,8,-3,5,10,-5,4,-9][i];
          const g=sv('g',{transform:`rotate(${turn} ${x+w/2} ${y+h/2})`},mapG);
          sv('rect',{x:x+3,y:y+4,width:w,height:h,rx:2,fill:'#aaa99f',opacity:.28},g);
          sv('path',{d:`M${x+2},${y+3} l${w*.18},-4 h${w*.62} l${w*.18},4 v${h-4} h-${w}Z`,fill:'#c4c2ba',stroke:'#aaa99f','stroke-width':1.2},g);
          sv('path',{d:`M${x+4},${y+7} h${w-8} M${x+w*.55},${y+7} v${h-9}`,stroke:'#d9d7d0','stroke-width':1.2,opacity:.8},g);
        }
        // Central plaza / roundabout and small landscaped verges.
        sv('circle',{cx:0,cy:0,r:43,fill:'#fffdf5',stroke:'#c5c1b5','stroke-width':2},mapG);
        sv('circle',{cx:0,cy:0,r:31,fill:'#a9d18c',stroke:'#e5ead9','stroke-width':3},mapG);
        sv('circle',{cx:0,cy:0,r:13,fill:'#448d62',stroke:'#86b978','stroke-width':3},mapG);
        for (const [x,y] of [[-192,-166],[-169,-128],[-83,-170],[23,-176],[147,-160],[177,-93],[-208,1],[-188,72],[-97,91],[82,82],[159,66],[-112,177],[70,171],[143,147],[-152,12],[-16,-119],[118,28],[35,156]]) {
          sv('ellipse',{cx:x+2,cy:y+6,rx:10,ry:6,fill:'#929b7f',opacity:.2},mapG);
          sv('circle', { cx:x, cy:y+1, r:9.5, fill:'#528e59', stroke:'#4c895a', 'stroke-width':1 }, mapG);
          sv('circle', { cx:x-4, cy:y+1, r:6.5, fill:'#67a866' }, mapG);
          sv('circle', { cx:x+3, cy:y-3, r:7, fill:'#77b775' }, mapG);
          sv('circle', { cx:x-4, cy:y-4, r:4.2, fill:'#8bc478' }, mapG);
          sv('circle', { cx:x+1, cy:y-6, r:2, fill:'#a0ce79' }, mapG);
        }
        const labels = [];
        const pinColors=['#e5242a','#0878db','#12ad2a','#ed7410','#8537e9'];
        // Pins sit on top of the clipped map so upright name tags remain readable at the edge.
        const pinG=sv('g',{},turn);
        for (const [pi,p] of spec.places.entries()) {
          const r = p.dist * (Rmap - 20);
          const [x, y] = [r * Math.sin(p.bearing / R2D), -r * Math.cos(p.bearing / R2D)];
          const pin = sv('g', { transform: `translate(${x.toFixed(1)},${y.toFixed(1)})` }, pinG);
          const inner = sv('g', {}, pin);
          sv('path', { d: 'M0,0 C-2,-6 -10,-11 -10,-19 a10,10 0 1 1 20,0 C10,-11 2,-6 0,0 Z', fill: pinColors[pi%pinColors.length], stroke: '#fff', 'stroke-width': 1.5 }, inner);
          sv('circle',{cx:0,cy:-19,r:4,fill:'#111820',stroke:'#fff','stroke-width':1},inner);
          const side=x>=0?1:-1, labelW=Math.max(56,p.name.length*6.1+10), labelX=side*13-labelW*(side<0?1:0);
          const labelY=-14+(pi-2)*19;
          sv('rect',{x:labelX,y:labelY,width:labelW,height:20,rx:3,fill:'#fffdf4',stroke:'#c9c7bd','stroke-width':1,opacity:.96},inner);
          const t = sv('text', { x: side*18, y: labelY+10, 'text-anchor': side>0?'start':'end', 'dominant-baseline': 'central' }, inner);
          t.textContent = p.name;
          t.style.font = '600 11px Verdana, Arial, sans-serif';
          t.style.paintOrder = 'stroke';
          t.style.fill = '#2b2f36';
          t.style.stroke = land;
          t.style.strokeWidth = '3px';
          labels.push(inner);
        }
        // North marker and drag handle on the bezel (they turn with the map).
        const nm = sv('text', { x: 0, y: -Rring, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, turn);
        nm.textContent = 'N';
        nm.style.fill = '#fff';
        nm.style.font = '700 12px system-ui, sans-serif';
        nm.style.pointerEvents = 'none';
        const hAngle = rng.pick([0, 0, 45, -45, 90]);
        const hp = polar([0, 0], Rring, hAngle);
        const handle = sv('circle', { class: 'rot-handle', cx: hp[0], cy: hp[1], r: 10, fill: 'var(--accent)', stroke: '#fff', 'stroke-width': 2.5 }, turn);
        if (hAngle === 0) turn.append(nm); // the N marker sits on the handle (it ignores the pointer)
        handle.dataset.role = 'handle';
        // Fixed center marker and a fixed "up" tick at the top of the bezel.
        sv('circle', { r: 7, fill: '#1c7ed6', stroke: '#fff', 'stroke-width': 3 }, svg);
        sv('path', { d: `M0,${-half + 1} l-6,0 l6,9 l6,-9 z`, fill: 'var(--fg)', opacity: 0.7, 'pointer-events': 'none' }, svg);

        const side = util.el('div', 'rot-col', card);
        util.el('div', 'rot-title', side, rng.pick(['Map', 'Orientation', 'Navigator', 'Map view']));
        const rose = sv('svg', { width: 86, height: 86, viewBox: '-43 -43 86 86', class: 'rot-svg' }, side);
        sv('circle', { r: 40, fill: 'var(--panel)', stroke: 'var(--line)', 'stroke-width': 2 }, rose);
        const needle = sv('g', {}, rose);
        sv('path', { d: 'M0,-34 L8,0 L-8,0 Z', fill: '#e03131' }, needle);
        sv('path', { d: 'M0,34 L8,0 L-8,0 Z', fill: 'var(--muted)' }, needle);
        const rn = sv('text', { x: 0, y: -24, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, needle);
        rn.textContent = 'N';
        rn.style.fill = '#fff';
        rn.style.font = '700 10px system-ui, sans-serif';
        // Always shown (the task's facts() reports it); the draw stays so later layout draws are as before.
        if (spec.mode !== 'bearing') rng.bool(0.6);
        const readout = util.el('div', 'rot-readout', side);
        util.el('div', 'rot-muted', side, rng.pick(['Drag the round handle on the ring to rotate the map.', 'Turn the map with the handle on its edge.']));

        function paint(a = ctx.model.angle) {
          turn.setAttribute('transform', `rotate(${a.toFixed(3)})`);
          for (const l of labels) l.setAttribute('transform', `rotate(${(-a).toFixed(3)})`);
          needle.setAttribute('transform', `rotate(${a.toFixed(3)})`);
          if (readout) readout.textContent = `Bearing: ${String(Math.round(fam.helpers.mod360(-a)) % 360).padStart(3, '0')}°`;
        }
        const rot = env.ui.rotateHandle(turn, handle, {
          label: 'map',
          pivot: () => centerOf(svg),
          radius: Rring,
          restAngle: hAngle,
          angle: ctx.model.angle,
          constrain: fam.helpers.mod360,
          place: (el, a) => paint(a),
          onInput(angle) {
            ctx.update({ angle });
          },
        });
        paint();
        S.view = {
          card,
          anchors: [svg],
          sync(m) {
            rot.set(m.angle);
            paint();
          },
          locate(t) {
            if (t.handle) return rot.locateHandle();
            if (t.handleAngle !== undefined) return rot.locate(t.handleAngle);
            return null;
          },
        };
      },
    },
  },
});
