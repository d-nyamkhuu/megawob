// This design uses the shared sort preset for sharp squares and color-coded bins.
env.widget({
  task: 'sort-into-bins',
  site: 'design-sort-into-bins-sort-09',
  name: 'design',
  split: 'train',
  scenarios: ['sort'],
  template: 'sort-into-bins/boxes',
  traits: { layout: 'rows', itemSize: .16 },
  design: {
    boxColorVar: true,
    shapes: { square: '<rect x="8" y="8" width="84" height="84" rx="5"/>' },
    parts: {
      fit: (base, S) => (ctx) => {
        // One affine fit preserves the template's model coordinates and oracle targets.
        const spec = S.spec;
        const starts = Object.values(spec.startPos || ctx.model.pos).filter(Array.isArray);
        const points = starts;
        const xs = spec.containers.flatMap(c => [c.x, c.x + c.w]);
        const ys = spec.containers.flatMap(c => [c.y + (c.head || 0), c.y + c.h]);
        for (const p of points) {
          xs.push(p[0] - spec.item.w/2, p[0] + spec.item.w/2);
          ys.push(p[1] - spec.item.h/2, p[1] + spec.item.h/2);
        }
        const minX = Math.min(...xs) - .02, maxX = Math.max(...xs) + .02;
        const minY = Math.min(...ys) - .12, maxY = Math.max(...ys) + .08;
        const boardW = Math.floor(ctx.size.width - 8), boardH = Math.floor(ctx.size.height - 8);
        const W = boardW/(maxX-minX), H = boardH/(maxY-minY);
        return { W, H, x: -minX*W, y: -minY*H, boardW, boardH };
      },
      item: (base, S) => (ctx, el, it) => {
        base(ctx, el, it);
        el.style.height = S.spec.item.h*S.geo.H + 'px';
      },
      box: (base, S) => (ctx, el, c) => {
        base(ctx, el, c);
        const titleHeight = Math.min(82, S.geo.boardH*.115), originalHead = (c.head || 0)*S.geo.H;
        const head = Math.max(0,titleHeight-originalHead), pad = Math.min(14, S.geo.boardW*.015), foot = Math.min(22, S.geo.boardH*.03);
        const panel = ctx.util.el('div', 'bin-panel', S.board);
        panel.style.setProperty('--bc', el.style.getPropertyValue('--bc') || '#f89046');
        Object.assign(panel.style, { left: parseFloat(el.style.left)-pad+'px', top: parseFloat(el.style.top)-head+'px', width: parseFloat(el.style.width)+pad*2+'px', height: parseFloat(el.style.height)+head+foot+'px' });
        S.board.insertBefore(panel, el);
        const w = parseFloat(el.style.width), h = parseFloat(el.style.height), inset = Math.min(8,w*.02);
        const outline = ctx.util.svg('svg',{class:'bin-outline',width:w,height:h,viewBox:'0 0 '+w+' '+h},el);
        ctx.util.svg('rect',{x:inset,y:originalHead+1,width:w-inset*2,height:h-originalHead-2,rx:12,fill:'none',stroke:'var(--bc)','stroke-width':1.5,'stroke-dasharray':'8 7'},outline);
        const label = el.querySelector('.bx-label');
        if (label) { label.style.height = titleHeight+'px'; label.style.top = -head+'px'; }
      },
      shapeSvg: (base, S) => (content, it) => base(content, it).replace('rgba(0,0,0,.38)', 'rgba(0,0,0,.14)').replace('stroke-width="3"', 'stroke-width="1.2"'),
      rendered: (base, S) => (ctx) => {
        base(ctx);
        const spec = S.spec, geo = S.geo;
        const rows = document.querySelectorAll('.inspector-row');
        if (rows[0]) rows[0].lastElementChild.textContent = String(spec.items.length);
        if (rows[1]) rows[1].lastElementChild.textContent = String(spec.containers.length);
        const source = Object.values(spec.startPos || ctx.model.pos).filter(Array.isArray);
        const outside = source.filter(p=>!spec.containers.some(c=>p[0]>=c.x&&p[0]<=c.x+c.w&&p[1]>=c.y&&p[1]<=c.y+c.h));
        if (outside.length) {
          const bottom = Math.max(...spec.containers.map(c=>geo.y+(c.y+c.h)*geo.H));
          const itemTop = Math.min(...outside.map(p=>geo.y+(p[1]-spec.item.h/2)*geo.H));
          const top = bottom + (itemTop-bottom)*.5;
          const tray = ctx.util.el('section','shape-tray',S.board);
          Object.assign(tray.style,{left:'0px',top:top+'px',width:geo.boardW+'px',height:Math.max(0,geo.boardH-top)+'px'});
          ctx.util.el('h3','',tray,'Shapes to drag:');
        }
      },
    },
  },
});
