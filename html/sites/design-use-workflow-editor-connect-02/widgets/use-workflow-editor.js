// Human-era presentation; state, gestures and history remain in the editor template.
(() => {
const scenes = new WeakMap();
const paths = {
  mail: '<path d="M3 5h26v20H3z" fill="#f8f7ef"/><path d="m3 5 13 12L29 5"/>',
  database: '<ellipse cx="16" cy="6" rx="11" ry="4" fill="#e7f1fa"/><path d="M5 6v18c0 6 22 6 22 0V6M5 15c0 6 22 6 22 0M5 22c0 6 22 6 22 0"/>',
  globe: '<circle cx="16" cy="16" r="12"/><ellipse cx="16" cy="16" rx="5" ry="12"/><path d="M4 16h24M7 9h18M7 23h18"/>',
  file: '<path d="M7 3h13l7 7v20H7z" fill="#f9f7ef"/><path d="M20 3v8h7"/>',
  clock: '<circle cx="16" cy="16" r="12" fill="#faf9f1"/><path d="M16 8v9l6 4"/>',
  log: '<rect x="7" y="3" width="18" height="26" rx="1" fill="#f9f7ef"/><path d="M11 9h10M11 14h10M11 19h7M11 24h7"/>',
  variable: '<rect x="6" y="5" width="21" height="23" fill="#f9f7ef"/><path d="m12 11 9 11m0-11-9 11"/>',
  comment: '<path d="M5 6q0-3 4-3h16q4 0 4 4v13q0 4-4 4H14l-9 6 2-8q-3-1-3-5z" fill="#fff1bf"/>',
  list: '<path d="M10 7h18M10 15h14M10 23h10"/><circle cx="4" cy="7" r="1"/><circle cx="4" cy="15" r="1"/><circle cx="4" cy="23" r="1"/>',
};
function icon(P, parent, name) {
  const el = P.el('span', 'human-icon', parent);
  el.innerHTML = `<svg viewBox="0 0 32 32" fill="none" stroke="#203f6a" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">${paths[name] || paths.list}</svg>`;
  return el;
}
function position(S, n) {
  const scene = scenes.get(S.els.app), original = scene.origins.get(n.id);
  if (!original) return [n.x, n.y];
  const r = S.els.canvas.getBoundingClientRect();
  const w = r.width / S.zoom, h = Math.min(r.height,556) / S.zoom;
  const slots = [[.108,.375],[.318,.375],[.558,.375],[.828,.375],[.828,.72],[.318,.72],[.558,.72],[.108,.72]];
  const extra = Math.max(0, original.index-slots.length), extraRow = Math.floor(extra/4)+1;
  const slot = slots[original.index] || [[.108,.72+.12*extraRow],[.318,.72+.12*extraRow],[.558,.72+.12*extraRow],[.828,.72+.12*extraRow]][extra%4];
  return [slot[0]*w - 74 + n.x-original.x, slot[1]*h - 38 + n.y-original.y];
}
env.widget({
  task: 'use-workflow-editor',
  site: 'design-use-workflow-editor-connect-02',
  name: 'design',
  split: 'train',
  scenarios: ['connect'],
  template: 'use-workflow-editor/editor',
  design: {
    frameInset:0, frameRadius:0, paletteWidth:242, tightPaletteWidth:155, overviewWidth:314, compactWidth:0, initialZoom:1, fontFamily:'Arial, sans-serif', gridSize:18,
    parts: {
      frame: (base, S) => (ctx) => {
        const app = base(ctx);
        scenes.set(app, { origins:new Map(ctx.model.nodes.map((n,index)=>[n.id,{x:n.x,y:n.y,index}])) });
        return app;
      },
      top: () => () => {},
      toolbar: (base, S) => (ctx) => {
        base(ctx);
        const P=S.P, toolbar=P.el('div','human-toolbar',S.els.app);
        const tools=[['Select','<path d="m8 3 14 17-9-1-4 8z" fill="#444"/>'],['Pan','<path d="M9 16V8q0-4 3-1V4q2-4 4 0v2q3-4 4 1v3q3-3 4 1v12q-3 9-11 6L5 20q-1-5 4-4z"/>'],['Add Note','<path d="M5 3h22v25H5z" fill="#fff0b8"/><path d="M18 28V18h9"/>'],['Zoom In','<circle cx="13" cy="12" r="9"/><path d="m20 20 9 9M8 12h10M13 7v10"/>'],['Zoom Out','<circle cx="13" cy="12" r="9"/><path d="m20 20 9 9M8 12h10"/>'],['Fit','<path d="M12 4H4v8m16-8h8v8M4 20v8h8m16-8v8h-8M4 4l8 8m16-8-8 8M4 28l8-8m16 8-8-8"/>'],['Align','<path d="M5 3v26M9 7h17M9 14h12M9 21h17"/>'],['Arrange','<path d="M4 3h16v16H4zM14 12h15v15H14z" fill="#d8e7f4"/>']];
        tools.forEach(([label,path],i)=>{
          const button=P.button(toolbar,'',()=>{
            if(label==='Zoom In') P.setZoom(S.zoom+.1);
            else if(label==='Zoom Out') P.setZoom(S.zoom-.1);
            else if(label==='Fit') { S.zoom=scenes.get(S.els.app).fitZoom; P.commit({...ctx.model,pan:[0,0]}); }
            else if(label==='Select'||label==='Pan') { toolbar.querySelectorAll('button').forEach(b=>b.classList.toggle('selected',b===button)); }
            else env.log('decoy',{label});
          },`human-tool${i===0?' selected':''}`);
          const glyph=P.el('span','human-tool-icon',button);
          glyph.innerHTML=`<svg viewBox="0 0 32 32" fill="none" stroke="#494943" stroke-width="2" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
          P.el('span','',button,label);
        });
      },
      paletteFrame: (base,S) => () => {
        const P=S.P, E=S.els;
        E.palette=P.el('aside','af-palette human-palette',E.body);
        P.el('div','human-pane-title',E.palette,'Steps');
        E.search=P.el('input','af-search',E.palette); E.search.hidden=true;
        E.list=P.el('div','af-list human-list',E.palette);
        for(const [heading,items] of [
          ['General',[['Trigger','trigger'],['Action','action'],['Condition','condition'],['Transform','transform'],['End','end']]],
          ['Integrations',[['Email','mail'],['Database','database'],['HTTP Request','globe'],['File','file'],['Schedule','clock']]],
          ['Utilities',[['Log','log'],['Set Variable','variable'],['Delay','clock'],['Comment','comment']]]
        ]) {
          const group=P.el('section','human-group',E.list);
          P.el('div','human-group-title',group,heading);
          items.forEach(([label,glyph])=>{
            const row=P.el('div','human-step',group); row.dataset.glyph=glyph;
            if(['trigger','action','condition','transform','end'].includes(glyph)) P.el('span',`human-shape ${glyph}`,row);
            else icon(P,row,glyph);
            P.el('span','',row,label);
          });
        }
      },
      component: (base,S) => (ctx,list,type,i) => {
        const map=['trigger','condition','transform','mail','database','clock'];
        const rows=Array.from(list.querySelectorAll('.human-step'));
        const tile=rows.find(row=>row.dataset.glyph===map[i]) || S.P.el('div','human-step',list,type);
        tile.setAttribute('role','button'); tile.setAttribute('aria-label',`Drag ${type} to canvas`); tile.title=type;
        return tile;
      },
      references: (base,S) => (ctx) => { base(ctx); S.els.references.hidden=true; },
      edges: (base,S) => (m) => base(m),
      wire: (base,S) => (ctx,edge,a,b,start,end,selected) => {
        const [ax,ay]=position(S,a), [bx,by]=position(S,b);
        return base(ctx,edge,{...a,x:ax,y:ay},{...b,x:bx,y:by},start,end,selected);
      },
      overview: (base,S) => () => {
        const P=S.P, pane=P.el('aside','human-inspector',S.els.body);
        P.el('div','human-pane-title',pane,'Node');
        S.els.overviewTitle=P.el('div','human-inspector-copy',pane,'No node selected.');
        S.els.overviewProperties=P.el('div','human-properties',pane);
      },
      node: (base,S) => (ctx,layer,n) => {
        const P=S.P;
        const kind=n.type==='Webhook'?'trigger':n.type==='Filter'?'condition':n.type==='Create record'?'record':n.type==='Delay'?'delay':n.type==='Transform'?'normalize':'email';
        const card=P.el('div',`af-node human-node ${kind}`,layer); card.dataset.node=n.id; card.setAttribute('aria-label',n.label);
        const shape=P.el('div','human-node-shape',card);
        if(!['trigger','condition'].includes(kind)) icon(P,shape,kind==='record'?'database':kind==='delay'?'clock':kind==='normalize'?'list':'mail');
        P.el('span','human-node-label',['trigger','condition','normalize'].includes(kind)?card:shape,n.label);
        return card;
      },
      port: (base,S) => (ctx,card,n,kind) => {
        const dot=base(ctx,card,n,kind);
        if(n.type==='Webhook'||n.type==='Filter') dot.style.setProperty(kind==='in'?'left':'right',n.type==='Filter'?'17px':'24px','important');
        else if(n.type!=='Transform') dot.style.setProperty(kind==='in'?'left':'right','-21px','important');
        return dot;
      },
      point: (base,S) => (n,kind) => {
        const port=S.els.nodes[n.id]?.querySelector(`.af-port.${kind}`);
        if(port) {
          const r=port.getBoundingClientRect(), c=S.els.canvas.getBoundingClientRect();
          return [(r.left+r.width/2-c.left)/S.zoom-S.model.pan[0],(r.top+r.height/2-c.top)/S.zoom-S.model.pan[1]];
        }
        const [x,y]=position(S,n);
        return [x+(kind==='out'?148:0),y+38];
      },
      painted: (base,S) => (ctx,m) => {
        for(const n of m.nodes) { const [x,y]=position(S,n), card=S.els.nodes[n.id]; card.style.left=x+'px'; card.style.top=y+'px'; }
        S.els.overviewTitle.textContent=m.selected?.node ? m.nodes.find(n=>n.id===m.selected.node)?.label : 'No node selected.';
        S.els.overviewProperties.hidden=!m.selected?.node;
      },
      finish: (base,S) => (ctx) => {
        const rect=S.els.canvas.getBoundingClientRect();
        S.zoom=Math.min(1,rect.width/860,rect.height/320);
        scenes.get(S.els.app).fitZoom=S.zoom;
        return base(ctx);
      },
      rendered: (base,S) => () => {
        S.els.app.humanLayout=()=>{
          const rect=S.els.canvas.getBoundingClientRect();
          S.zoom=Math.min(1,rect.width/860,rect.height/320);
          scenes.get(S.els.app).fitZoom=S.zoom;
          S.P.paint(S.ctx.model);
        };
      },
      locate: (base,S) => (target) => {
        if(target.port) {
          const [id,kind]=target.port, port=S.els.nodes[id]?.querySelector(`.af-port.${kind}`);
          if(port) return env.util.center(port);
        }
        if(target.node) return env.util.center(S.els.nodes[target.node]);
        return base(target);
      },
    },
  },
});
})();
