// Design on use-workflow-editor/editor; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'use-workflow-editor',
  site: 'design-use-workflow-editor-reroute-02',
  name: 'design',
  split: 'train',
  scenarios: ['reroute'],
  template: 'use-workflow-editor/editor',
  design: {
    frameInset: 0,
    frameRadius: 0,
    fontFamily: 'Arial,system-ui,sans-serif',
    gridSize: 20,
    parts: {
      frame: (base) => (ctx) => {
        const app=base(ctx);
        app.style.width='100%'; app.style.height='100%';
        return app;
      },
      top: () => () => {},
      toolbar: (base, S) => (ctx) => {
        base(ctx);
        const host=ctx.stage.parentElement.querySelector('.relay-editor-head');
        const bar=S.els.bar;
        host.appendChild(bar);
        const buttons=Array.from(bar.children).filter(el=>el.tagName==='BUTTON');
        const zoom=ctx.util.el('button','relay-zoom-control',bar);
        zoom.type='button'; zoom.setAttribute('aria-label','Zoom level');
        zoom.appendChild(S.els.zoomLabel);
        ctx.util.el('span','',zoom,'⌄');
        const menu=ctx.util.el('div','relay-zoom-menu',bar);
        menu.hidden=true;
        menu.appendChild(buttons[0]); menu.appendChild(buttons[1]);
        zoom.addEventListener('click',()=>{ menu.hidden=!menu.hidden; });
        bar.insertBefore(zoom,bar.firstChild);
        const redo=ctx.util.el('button','af-btn relay-redo',bar);
        redo.type='button'; redo.title='Redo'; redo.setAttribute('aria-label','Redo');
        S.P.icon(redo,'undo');
        redo.addEventListener('click',()=>ctx.log('decoy',{label:'Redo'}));
        bar.insertBefore(redo,S.els.del);
        const reset=buttons[2];
        reset.querySelector('path').setAttribute('d','M15 15l6 6M17 9a7 7 0 1 1-14 0 7 7 0 0 1 14 0M6 9h6M9 6v6');
      },
      icon: (base) => (parent,name) => {
        const svg=base(parent,name);
        const shapes={
          bolt:'m13 2-8 12h7l-1 8 8-12h-7z',
          code:'M3 6h18M3 12h18M3 18h18M16 3v6M8 9v6M15 15v6',
          send:'M3 5h18v14H3zM3 6l9 7 9-7',
          record:'M3 6c0-5 18-5 18 0s-18 5-18 0m0 0v6c0 5 18 5 18 0V6M3 12v6c0 5 18 5 18 0v-6',
        };
        if(shapes[name]) svg.querySelector('path').setAttribute('d',shapes[name]);
        if(name==='bolt') svg.setAttribute('fill','currentColor');
        return svg;
      },
      painted: (base, S) => (ctx, m) => {
        base(ctx,m);
        S.els.zoomLabel.textContent=Math.round(S.zoom/S.D.initialZoom*100)+'%';
        for (const n of m.nodes) {
          const card=S.els.nodes[n.id];
          card.dataset.type=n.type;
        }
      },
      point: (base, S) => (n, kind) => {
        const dot=S.els.ports[`${n.id}:${kind}`];
        if (!dot) return base(n,kind);
        const a=dot.getBoundingClientRect(), c=S.els.canvas.getBoundingClientRect();
        return [(a.left+a.width/2-c.left)/S.zoom,(a.top+a.height/2-c.top)/S.zoom];
      },
      node: (base, S) => (ctx, layer, n) => {
        const card=base(ctx,layer,n);
        card.dataset.type=n.type;
        const head=card.querySelector('.af-nodehead');
        const foot=card.querySelector('.af-nodefoot');
        head.appendChild(foot.querySelector('span'));
        foot.remove();
        S.P.el('span','relay-port-caption in',card,'in');
        S.P.el('span','relay-port-caption out',card,'out');
        return card;
      },
    },
  },
});
