// Design on templates/draw-shape/base.js: the base site's draw-shape widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-polygon-04',
  name: 'design',
  split: 'train',
  scenarios: ['polygon'],
  template: 'draw-shape/base',
  design: {
    parts: {
      'drawMap': (base, S) => function drawMap(B) {
        const { ctx, svg, px, W, H, scale } = B;
        const { util, rng, spec } = ctx;
        const land = rng.pick(['#f3f1ea', '#eef0e6', '#f1efe9']);
        util.svg('rect', { x: 0, y: 0, width: W, height: H, fill: land }, svg);
        // Keep the original seeded draws (the sampled lots also keep the city texture varied),
        // then build the map as a compact, readable street atlas rather than isolated shapes.
        const blocks = util.svg('g', { opacity: 0.55 }, svg);
        const lots = [];
        for (let i = 0; i < 14; i++) {
          const x = rng.float(0, W - 40);
          const y = rng.float(0, H - 30);
          const w = rng.float(24, 70), h = rng.float(18, 50), color = rng.pick(['#e2ddd2', '#dcd8cd', '#e6e1d6']);
          lots.push({ x, y, w, h, color });
        }
        // River: a wide blue ribbon down the eastern edge, with a fine dashed centerline.
        if (spec.river) {
          const river=`M ${W*.77} ${-H*.12} C ${W*.68} ${H*.12},${W*.73} ${H*.28},${W*.78} ${H*.43} C ${W*.84} ${H*.60},${W*.81} ${H*.76},${W*.90} ${H*1.12}`;
          util.svg('path', { d:river, fill:'none', stroke:'#b5dfa4', 'stroke-width':.34*scale, 'stroke-linecap':'round', 'pointer-events':'none' }, svg);
          util.svg('path', { d:river, fill:'none', stroke:'#82c9ef', 'stroke-width':.25*scale, 'stroke-linecap':'round', 'pointer-events':'none' }, svg);
          util.svg('path', { d:river, fill:'none', stroke:'#d8f2ff', 'stroke-width':1.4, 'stroke-dasharray':'8 9', 'pointer-events':'none' }, svg);
        }
        // Preserve the park's two seeded position draws.
        const [pxx, pyy] = [rng.float(0.1, 0.9) * W, rng.float(0.1, 0.9) * H];
        const park = util.svg('g', {}, svg);
        util.svg('path', { d:`M ${W*.24} ${H*.25} Q ${W*.37} ${H*.20} ${W*.48} ${H*.29} L ${W*.47} ${H*.72} Q ${W*.34} ${H*.78} ${W*.23} ${H*.69} Z`, fill:'#c9e5b7', stroke:'#b7d9a3', 'stroke-width':2 }, park);
        util.svg('path', { d:`M ${W*.28} ${H*.33} C ${W*.35} ${H*.28},${W*.39} ${H*.42},${W*.34} ${H*.49} S ${W*.40} ${H*.63},${W*.45} ${H*.68} M ${W*.25} ${H*.61} C ${W*.31} ${H*.57},${W*.36} ${H*.71},${W*.44} ${H*.58}`, fill:'none', stroke:'#e8f0d9', 'stroke-width':Math.max(3,scale*.012), 'stroke-dasharray':'7 6' }, park);
        // Rectangular city blocks and individual building footprints.
        const grid = util.svg('g', { 'pointer-events':'none' }, svg);
        for(let c=0;c<6;c++) for(let r=0;r<5;r++) {
          const x=W*(.025+c*.16), y=H*(.04+r*.19);
          if(x>W*.67 && spec.river) continue;
          if(x>W*.21&&x<W*.49&&y>H*.22&&y<H*.75) continue;
          util.svg('rect',{x,y,width:W*.135,height:H*.145,rx:3,fill:'#eeece7',stroke:'#d7d8d6','stroke-width':1},grid);
          for(let b=0;b<3;b++) {
            const bx=x+W*(.015+b*.037), by=y+H*(b%2?.025:.055);
            util.svg('rect',{x:bx,y:by,width:W*.027,height:H*.045,rx:2,fill:['#deddd9','#e4e2dd','#d9d9d6'][b],stroke:'#d0d1ce','stroke-width':.7},grid);
          }
        }
        lots.forEach(q=>util.svg('rect',{x:q.x,y:q.y,width:q.w,height:q.h,rx:3,fill:q.color,stroke:'#d5d3cc','stroke-width':.7},blocks));
        // A neighborhood grid of pale streets with curbs and road surfaces.
        const roads=util.svg('g',{'pointer-events':'none'},svg);
        for(let c=0;c<7;c++){
          const x=W*(.015+c*.145);
          util.svg('line',{x1:x,y1:0,x2:x+W*.018,y2:H,stroke:'#cfd4d5','stroke-width':Math.max(9,scale*.045)},roads);
          util.svg('line',{x1:x,y1:0,x2:x+W*.018,y2:H,stroke:'#fff','stroke-width':Math.max(6,scale*.032)},roads);
        }
        for(let r=0;r<6;r++){
          const y=H*(.025+r*.18);
          util.svg('line',{x1:0,y1:y,x2:W,y2:y+H*.015,stroke:'#cfd4d5','stroke-width':Math.max(9,scale*.045)},roads);
          util.svg('line',{x1:0,y1:y,x2:W,y2:y+H*.015,stroke:'#fff','stroke-width':Math.max(6,scale*.032)},roads);
        }
        // Park lake and scattered tree canopies, composed without further random draws.
        util.svg('path',{d:`M ${W*.355} ${H*.55} C ${W*.30} ${H*.51},${W*.32} ${H*.47},${W*.37} ${H*.48} C ${W*.43} ${H*.49},${W*.42} ${H*.55},${W*.45} ${H*.61} C ${W*.48} ${H*.69},${W*.40} ${H*.72},${W*.37} ${H*.66} Z`,fill:'#8dd0f1',stroke:'#a8def5','stroke-width':2},svg);
        const trees=[[.26,.34],[.30,.43],[.40,.32],[.44,.45],[.27,.57],[.32,.66],[.43,.64],[.52,.25],[.58,.45],[.60,.68],[.13,.27],[.11,.70],[.67,.18],[.91,.22],[.92,.62],[.83,.83],[.12,.88],[.53,.88],[.61,.88]];
        const tg=util.svg('g',{},svg);
        trees.forEach(([x,y],i)=>{const cx=W*x,cy=H*y,r=Math.max(4,scale*(.012+(i%3)*.002));util.svg('circle',{cx:cx+2,cy:cy+3,r:r*1.15,fill:'#91b989',opacity:.28},tg);util.svg('circle',{cx,cy,r,fill:i%2?'#a9ce91':'#b8d69d',stroke:'#9fc38a','stroke-width':.7},tg);});
        for (const s of spec.streets) {
          const a = px(s.a);
          const b = px(s.b);
          const streetWidth = rng.pick([7, 9, 11]);
          util.svg('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: '#cfd4d5', 'stroke-width': streetWidth+4, 'stroke-linecap': 'round' }, svg);
          util.svg('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: '#ffffff', 'stroke-width': streetWidth, 'stroke-linecap': 'round' }, svg);
          const ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
          const t = rng.float(0.15, 0.3);
          const at = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
          const rot = Math.abs(ang) > 90 ? ang + 180 : ang;
          util.svg('text', { x: at[0], y: at[1] - 7, class: 'dw-street', transform: `rotate(${rot.toFixed(1)} ${at[0].toFixed(1)} ${at[1].toFixed(1)})` }, svg).textContent = s.name;
        }
        // Quiet map furniture seen in desktop map clients: north indicator and distance scale.
        const compass=util.svg('g',{'pointer-events':'none'},svg), cx=W*.055, cy=H*.105;
        util.svg('circle',{cx,cy,r:Math.max(17,scale*.043),fill:'rgba(255,255,255,.9)',stroke:'#8c99aa','stroke-width':1.2},compass);
        util.svg('text',{x:cx,y:cy-Math.max(19,scale*.05),class:'dw-label','text-anchor':'middle','font-size':Math.max(13,scale*.035)},compass).textContent='N';
        util.svg('path',{d:`M ${cx} ${cy-13} L ${cx-7} ${cy+9} L ${cx} ${cy+5} L ${cx+7} ${cy+9} Z`,fill:'#172033',stroke:'#172033','stroke-width':1},compass);
        const sbx=W*.025,sby=H*.94, sw=W*.22;
        util.svg('rect',{x:sbx-7,y:sby-23,width:sw+18,height:33,rx:4,fill:'rgba(255,255,255,.94)'},svg);
        util.svg('path',{d:`M ${sbx} ${sby} v -8 M ${sbx} ${sby} H ${sbx+sw} M ${sbx+sw} ${sby} v -8`,fill:'none',stroke:'#172033','stroke-width':2},svg);
        util.svg('text',{x:sbx,y:sby-11,class:'dw-street'},svg).textContent='0';
        util.svg('text',{x:sbx+sw,y:sby-11,class:'dw-street','text-anchor':'end'},svg).textContent='400 m';
      },
    },
  },
});
