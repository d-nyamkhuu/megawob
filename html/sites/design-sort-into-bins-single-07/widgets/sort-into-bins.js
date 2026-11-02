// The document scene uses the template's model and drag coordinate mapping.
env.widget({
  task: 'sort-into-bins',
  site: 'design-sort-into-bins-single-07',
  name: 'design',
  split: 'train',
  scenarios: ['single'],
  traits: { itemSize: [0.28, 0.30] },
  template: 'sort-into-bins/boxes',
  design: {
    stepHint: false,
    parts: {
      fit: (base, S) => (ctx) => {
        const fallback = base(ctx);
        const spec = S.spec;
        const rects = spec.containers.map(c => ({x:c.x,y:c.y,w:c.w,h:c.h}));
        for (const it of spec.items) {
          const p = ctx.model.pos[it.id];
          rects.push({x:p[0]-spec.item.w/2,y:p[1]-spec.item.h/2,w:spec.item.w,h:spec.item.h});
        }
        const x0 = Math.min(...rects.map(r => r.x));
        const y0 = Math.min(...rects.map(r => r.y));
        const x1 = Math.max(...rects.map(r => r.x+r.w));
        const y1 = Math.max(...rects.map(r => r.y+r.h));
        const boardW = Math.max(1,ctx.size.width-8);
        const boardH = Math.max(1,ctx.size.height-8);
        const lead = document.querySelector('.document-instruction');
        const stageRect = ctx.stage.getBoundingClientRect();
        const top = lead ? Math.max(20,lead.getBoundingClientRect().bottom-stageRect.top+28) : 28;
        const availableH = Math.max(60,boardH-top-26);
        const desired = Math.min(boardW*0.175,boardH*0.32,availableH*0.52);
        const H = Math.min(desired/spec.item.h,(boardW-90)/((x1-x0)*spec.aspect),availableH/(y1-y0));
        if (!Number.isFinite(H) || H <= 0) return {...fallback,boardW,boardH,x:0,y:0};
        const first = spec.containers[0];
        const mirror = first.x+first.w/2 > ctx.model.pos[spec.items[0].id][0];
        const W = H*spec.aspect*(mirror ? -1 : 1);
        return {W,H,boardW,boardH,x:(boardW-(x0+x1)*W)/2,y:top+(availableH-(y1-y0)*H)/2-y0*H};
      },
      board: (base, S) => (ctx) => {
        const board = base(ctx);
        board.style.setProperty('--shape-size', Math.abs(S.geo.W)*S.spec.item.w+'px');
        return board;
      },
      toPx: (base, S) => (p) => {
        const g = S.geo, px = Math.abs(g.W)*S.spec.item.w;
        return [g.x+p[0]*g.W-px/2,g.y+p[1]*g.H-px/2];
      },
      toModel: (base, S) => (q) => {
        const g = S.geo, px = Math.abs(g.W)*S.spec.item.w;
        return [(q[0]+px/2-g.x)/g.W,(q[1]+px/2-g.y)/g.H];
      },
      rectPx: (base, S) => (r) => {
        const g = S.geo;
        return {left:Math.min(g.x+r.x*g.W,g.x+(r.x+r.w)*g.W)+'px',top:g.y+r.y*g.H+'px',width:Math.abs(r.w*g.W)+'px',height:r.h*g.H+'px'};
      },
      bounds: (base, S) => () => {
        const g = S.geo, px = Math.abs(g.W)*S.spec.item.w;
        const p0 = S.P.toPx([S.spec.item.w/2,S.spec.item.h/2]);
        const p1 = S.P.toPx([1-S.spec.item.w/2,1-S.spec.item.h/2]);
        return {x0:Math.max(0,Math.min(p0[0],p1[0])),y0:Math.max(0,Math.min(p0[1],p1[1])),x1:Math.min(g.boardW-px,Math.max(p0[0],p1[0])),y1:Math.min(g.boardH-px,Math.max(p0[1],p1[1]))};
      },
    },
  },
});
