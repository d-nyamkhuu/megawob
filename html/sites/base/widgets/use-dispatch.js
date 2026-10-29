/* base / use-dispatch / classic: a fleet operations workspace, warehouse
 * put-away board, daily capacity planner and stop sequencing / distance workbench.
 * Token-based light/dark styling; independent wheel-scrollable lanes, persistent
 * drop headers, pointer-capture drag previews, visible constraint warnings and
 * live load/distance totals. sync handles solve, silent saves and goal switches.
 * Operations navigation, saved plans, notifications, a shipment inspector, activity
 * and scenario-specific context add unscored background work. All icons are inline
 * SVG. locate only reads geometry; task targets and assignment mechanics remain.
 */
(function () {
  'use strict';
  let current;
  const ICONS={
    brand:'M4 8h14m-4-4 4 4-4 4M20 16H6m4-4-4 4 4 4',
    grid:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
    truck:'M3 6h11v11H3zM14 10h4l3 4v3h-7M5 17a2 2 0 1 0 4 0m7 0a2 2 0 1 0 4 0',
    box:'m3 7 9-4 9 4-9 4-9-4v10l9 4 9-4V7M12 11v10M7 5l10 4',
    calendar:'M4 5h16v16H4zM4 10h16M8 3v4M16 3v4M8 14h2m4 0h2m-8 4h2',
    route:'M6 5h10a4 4 0 0 1 0 8H8a4 4 0 0 0 0 8h10M3 5a2 2 0 1 0 4 0 2 2 0 1 0-4 0m14 16 4-3m-4 3 4 2',
    bell:'M5 17h14l-2-3V9a5 5 0 0 0-10 0v5l-2 3m5 3h4',
    filter:'M3 5h18l-7 8v6l-4 2v-8z',
    down:'m6 9 6 6 6-6',
    check:'m5 12 4 4L19 6',
    alert:'m12 3 10 18H2L12 3m0 6v5m0 3v1',
    file:'M5 3h9l5 5v13H5zM14 3v6h5M8 13h8m-8 4h6',
    activity:'M3 12h4l3-8 4 16 3-8h4',
    grip:'M8 5h1m6 0h1M8 12h1m6 0h1M8 19h1m6 0h1',
    user:'M8 7a4 4 0 1 0 8 0 4 4 0 1 0-8 0M4 21v-3a8 8 0 0 1 16 0v3',
    pin:'M5 9a7 7 0 1 1 14 0c0 5-7 12-7 12S5 14 5 9m4 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0',
    clock:'M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18m0 4v5l4 2',
    snow:'M12 2v20M3 7l18 10M3 17 21 7M9 4l3 3 3-3M9 20l3-3 3 3',
    close:'m6 6 12 12M6 18 18 6',
    panel:'M3 4h18v16H3zM15 4v16',
    archive:'M3 4h18v5H3zM5 9v12h14V9m-10 4h6',
    search:'M3 10a7 7 0 1 0 14 0 7 7 0 1 0-14 0m12 5 6 6'
  };
  function icon(parent,name,size=15) {
    const svg=env.util.svg('svg',{viewBox:'0 0 24 24',width:size,height:size,fill:'none',stroke:'currentColor','stroke-width':1.7,'stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true'},parent);
    env.util.svg('path',{d:ICONS[name]||ICONS.file},svg);return svg;
  }
  const CSS=`
  .ad-app{position:absolute;inset:8px;display:flex;flex-direction:column;min-height:0;min-width:0;overflow:hidden;background:var(--panel);color:var(--fg);border:1px solid var(--line);border-radius:9px;font:12px/1.35 system-ui,sans-serif;box-shadow:0 3px 16px #0000000c}
  .ad-app button{font:inherit;color:inherit;background:var(--panel);border:1px solid var(--line);border-radius:5px;padding:5px 9px;cursor:pointer}.ad-app button:hover{background:var(--bg)}
  .ad-toolbar{flex:none;height:48px;display:flex;align-items:center;gap:10px;padding:0 12px;border-bottom:1px solid var(--line)}
  .ad-mark{background:var(--accent);color:white;border-radius:6px;padding:4px 7px;font-size:17px;font-weight:800}.ad-brand{font-size:16px;font-weight:720}.ad-crumb{color:var(--muted);margin-right:auto;white-space:nowrap}.ad-badge{border:1px solid var(--line);border-radius:20px;padding:3px 8px;color:var(--muted);white-space:nowrap;font-size:10px}
  .ad-nav{height:31px;flex:none;display:flex;align-items:stretch;gap:20px;padding:0 13px;color:var(--muted);border-bottom:1px solid var(--line);background:color-mix(in srgb,var(--bg) 45%,var(--panel))}.ad-nav span{display:flex;align-items:center;white-space:nowrap}.ad-nav .active{border-bottom:2px solid var(--accent);color:var(--accent);font-weight:650}.ad-nav .ad-right{margin-left:auto;font-size:10px}
  .ad-context{flex:none;min-height:36px;display:flex;align-items:center;gap:8px;padding:5px 12px;border-bottom:1px solid var(--line)}.ad-context strong{font-size:13px}.ad-context .ad-muted{margin-left:auto;font-size:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ad-muted{color:var(--muted)}
  .ad-lanes{display:grid;flex:1;min-height:0;min-width:0;gap:8px;padding:8px;background:var(--bg)}
  .ad-lane{display:flex;flex-direction:column;min-width:0;min-height:0;background:var(--panel);border:1px solid var(--line);border-radius:6px;overflow:hidden}.ad-lane.over{outline:2px solid var(--accent);outline-offset:-2px}
  .ad-lane-head{flex:none;height:87px;padding:8px;border-bottom:1px solid var(--line);background:color-mix(in srgb,var(--accent) 4%,var(--panel));cursor:default}.ad-lane-head strong{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:12px}.ad-meta{display:block;font-size:10px;color:var(--muted);margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ad-load{font-size:11px;margin-top:4px;font-variant-numeric:tabular-nums}.ad-bar{height:3px;background:var(--line);border-radius:3px;margin-top:5px;overflow:hidden}.ad-fill{height:100%;background:var(--accent);width:0}.ad-warn{color:#c35135}.ad-lane.bad .ad-fill{background:#c35135}
  .ad-pane{flex:1;min-height:0;position:relative;overflow:auto;scrollbar-width:thin;overscroll-behavior:contain;padding:6px;scroll-behavior:auto;overflow-anchor:none}.ad-empty{padding:16px 4px;text-align:center;font-size:10px;color:var(--muted);border:1px dashed var(--line);border-radius:4px;margin-bottom:5px}
  .ad-card{height:68px;margin-bottom:8px;position:relative;cursor:grab;touch-action:none;border:1px solid var(--line);border-left:3px solid var(--accent);background:var(--panel);border-radius:5px;padding:6px 7px;overflow:hidden;box-shadow:0 1px 2px #00000009}
  .ad-card:hover{border-color:var(--accent)}.ad-card.dragging{opacity:.28}.ad-card.invalid{border-left-color:#c35135}.ad-card-top{display:flex;align-items:center;gap:5px;white-space:nowrap}.ad-id{font-size:11px;font-weight:750;color:var(--accent)}.ad-grip{color:var(--muted);font-size:13px;line-height:12px}.ad-weight{margin-left:auto;font-size:10px;font-weight:650;font-variant-numeric:tabular-nums}.ad-customer{font-size:11px;font-weight:600;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;margin-top:3px}.ad-card-note{font-size:10px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:3px}.ad-ghost{position:fixed;z-index:4000;pointer-events:none;opacity:.94;box-shadow:0 8px 20px #0004;margin:0;transform:rotate(-1deg)}
  .ad-footer{flex:none;min-height:39px;display:flex;align-items:center;gap:16px;padding:6px 12px;border-top:1px solid var(--line);font-size:10px;background:var(--panel);overflow:hidden}.ad-footer span{white-space:nowrap}.ad-footer b{font-weight:650;color:var(--fg)}.ad-footer .ad-reference{margin-left:auto;overflow:hidden;text-overflow:ellipsis;color:var(--muted)}
  .ad-routes{display:flex;flex:1;min-height:0;background:var(--bg);gap:10px;padding:8px}.ad-route-box{display:flex;flex-direction:column;min-width:0;min-height:0;flex:1;border:1px solid var(--line);border-radius:6px;background:var(--panel);overflow:hidden}.ad-route-head{flex:none;padding:8px 10px;border-bottom:1px solid var(--line);font-size:11px;display:flex;justify-content:space-between;gap:6px}.ad-route-list{padding:6px 9px}.ad-stop{height:40px;margin-bottom:8px;display:flex;align-items:center;gap:8px;padding:5px 7px}.ad-stop-number{flex:none;width:23px;height:23px;display:grid;place-items:center;border:1px solid var(--line);border-radius:50%;color:var(--muted);font-size:10px}.ad-stop-copy{min-width:0;flex:1}.ad-stop .ad-customer{margin:0;font-size:10px}.ad-stop .ad-card-note{margin:1px 0 0;font-size:9px}.ad-depot{flex:none;padding:6px 10px;font-size:10px;color:var(--muted);border-bottom:1px dashed var(--line);background:var(--bg)}.ad-depot:last-child{border-bottom:0;border-top:1px dashed var(--line)}
  .ad-matrix-box{flex:1.12;min-width:0;min-height:0;border:1px solid var(--line);border-radius:6px;background:var(--panel);display:flex;flex-direction:column;overflow:hidden}.ad-matrix-pane{overflow:auto;min-height:0;padding:8px;scrollbar-width:thin}.ad-table{width:100%;border-collapse:collapse;font-size:11px;text-align:center;font-variant-numeric:tabular-nums}.ad-table th,.ad-table td{padding:6px 2px;border-bottom:1px solid var(--line)}.ad-table th{font-size:10px;font-weight:650;background:var(--bg);color:var(--muted)}.ad-table td.on{background:color-mix(in srgb,var(--accent) 12%,var(--panel));font-weight:650;color:var(--accent)}.ad-policy{padding:9px 10px;font-size:10px;color:var(--muted);border-top:1px solid var(--line);line-height:1.5}.ad-popover{position:absolute;top:43px;right:9px;width:260px;z-index:30;padding:13px;background:var(--panel);border:1px solid var(--line);border-radius:7px;box-shadow:0 8px 24px #0003;font-size:12px}.ad-popover p{margin:7px 0;color:var(--muted)}
  .ad-app.compact .ad-brand{font-size:14px}.ad-app.compact .ad-crumb,.ad-app.compact .ad-nav .ad-right,.ad-app.compact .ad-badge{display:none}.ad-app.compact .ad-context .ad-muted{max-width:160px}.ad-app.compact .ad-footer{gap:10px;padding:6px 8px;font-size:9px}.ad-app.compact .ad-lanes{gap:5px;padding:5px}.ad-app.compact .ad-lane-head{padding:7px 5px}.ad-app.compact .ad-pane{padding:6px 4px}.ad-app.compact .ad-card{padding:6px 4px}.ad-app.compact .ad-table th,.ad-app.compact .ad-table td{padding:5px 1px;font-size:10px}
  .ad-app [hidden]{display:none!important}.ad-app svg{flex:none;vertical-align:middle}.ad-app button{display:inline-flex;align-items:center;justify-content:center;gap:5px}.ad-app button:focus-visible{outline:2px solid var(--accent);outline-offset:1px}
  .ad-toolbar{height:44px;gap:8px}.ad-mark{display:flex;padding:5px}.ad-brand{letter-spacing:-.4px}.ad-crumb{font-size:10px}.ad-toolbar .ad-icon-btn{position:relative;padding:5px}.ad-dot{width:5px;height:5px;border-radius:50%;background:var(--accent);display:inline-block;margin-right:4px}.ad-bell-count{position:absolute;right:-3px;top:-5px;background:var(--accent);color:white;border-radius:8px;font-size:8px;padding:0 3px}.ad-avatar{width:25px;height:25px;border-radius:50%;background:color-mix(in srgb,var(--accent) 20%,var(--panel));color:var(--accent);display:grid;place-items:center;font-size:9px;font-weight:700}
  .ad-shell{display:flex;min-height:0;flex:1}.ad-rail{flex:none;width:44px;border-right:1px solid var(--line);display:flex;flex-direction:column;overflow:hidden;background:color-mix(in srgb,var(--bg) 60%,var(--panel));padding:8px 4px}.ad-rail button{border:0;background:transparent;justify-content:flex-start;padding:7px 9px;margin-bottom:2px;color:var(--muted);width:100%;font-size:10px;white-space:nowrap}.ad-rail button.current{background:color-mix(in srgb,var(--accent) 12%,var(--panel));color:var(--accent);font-weight:700}.ad-rail-label,.ad-rail-count,.ad-saved{display:none}.ad-rail-bottom{margin-top:auto;border-top:1px solid var(--line);padding-top:7px}.ad-work{min-width:0;min-height:0;flex:1;display:flex;flex-direction:column}
  .ad-app.roomy .ad-rail{width:144px;padding:10px 8px}.ad-app.roomy .ad-rail-label{display:inline}.ad-app.roomy .ad-rail-count{display:inline;margin-left:auto;font-size:9px;color:var(--muted)}.ad-app.roomy .ad-saved{display:block;margin:16px 6px 0;font-size:9px;line-height:1.6;color:var(--muted)}.ad-saved h5{font-size:9px;letter-spacing:.08em;text-transform:uppercase;margin:0 0 7px;color:var(--muted)}.ad-saved div{padding:5px 0;border-bottom:1px solid var(--line)}.ad-saved b{display:block;color:var(--fg);font-size:10px;font-weight:550}
  .ad-nav{height:27px;gap:15px;padding:0 10px;font-size:10px}.ad-context{min-height:36px;padding:5px 10px}.ad-context strong{font-size:13px}.ad-context .ad-muted{font-size:9px}.ad-filters{height:31px;flex:none;display:flex;align-items:center;gap:6px;padding:3px 9px;border-bottom:1px solid var(--line);font-size:10px;white-space:nowrap;overflow:hidden}.ad-filters button{font-size:10px;padding:3px 6px;background:var(--panel)}.ad-filters .ad-filter-end{margin-left:auto;font-size:9px;color:var(--muted);overflow:hidden;text-overflow:ellipsis}.ad-filter-sep{height:15px;border-left:1px solid var(--line);margin:0 2px}
  .ad-workspace{display:flex;flex:1;min-height:0;min-width:0}.ad-main{flex:1;display:flex;flex-direction:column;min-height:0;min-width:0}.ad-lanes{gap:6px;padding:6px}.ad-lane-head{height:87px;padding:6px 7px}.ad-lane-head strong{font-size:11px;display:flex;align-items:center;gap:5px}.ad-lane-head .ad-meta{font-size:9px}.ad-lane-head .ad-load{font-size:10px}.ad-lane-head .ad-bar{margin-top:4px}.ad-empty{padding:10px 4px;font-size:10px;background:var(--bg)}.ad-empty svg{display:block;margin:0 auto 5px;color:var(--muted)}
  .ad-card{padding:4px 6px;border-left-width:2px;border-radius:3px;box-shadow:none}.ad-card-top{line-height:12px;gap:4px}.ad-id{font-size:10px}.ad-grip{display:flex}.ad-customer{font-size:10px;line-height:13px;margin-top:2px}.ad-card-note{display:flex;align-items:center;gap:3px;font-size:9px;line-height:11px;margin-top:2px}.ad-card-ref{font-size:8px;line-height:10px;color:var(--muted);display:flex;justify-content:space-between;margin-top:2px;white-space:nowrap;overflow:hidden}.ad-state{font-size:8px;line-height:11px;padding:0 3px;background:var(--bg);border:1px solid var(--line);border-radius:3px;color:var(--muted);overflow:hidden;max-width:56px}.ad-card.selected{background:color-mix(in srgb,var(--accent) 5%,var(--panel))}.ad-card.invalid .ad-state{color:#c35135}.ad-weight{font-size:9px}.ad-stop{padding:3px 5px;border-left-width:2px;gap:5px}.ad-stop .ad-customer{font-size:10px}.ad-stop-number{width:21px;height:21px;font-size:9px}.ad-stop .ad-state{margin-left:auto}.ad-stop .ad-weight{margin-left:0}.ad-load svg{width:11px;height:11px;margin-right:3px}
  .ad-inspector{display:none;flex:none;width:218px;min-height:0;border-left:1px solid var(--line);background:var(--panel);overflow:auto;scrollbar-width:thin;overscroll-behavior:contain}.ad-app.roomy .ad-inspector{display:block}.ad-inspector.open{display:block;position:absolute;right:0;top:44px;bottom:29px;z-index:25;width:255px;box-shadow:-5px 0 20px #0003}.ad-inspector-head{position:sticky;top:0;z-index:1;display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:var(--panel);border-bottom:1px solid var(--line);font-size:11px;font-weight:650}.ad-inspector-head button{padding:2px;border:0}.ad-section{padding:10px;border-bottom:1px solid var(--line)}.ad-section h5{font-size:9px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin:0 0 8px}.ad-inspect-title{font-size:12px;font-weight:650;margin:4px 0 7px}.ad-pairs{display:grid;grid-template-columns:76px minmax(0,1fr);gap:5px 6px;font-size:10px}.ad-pairs dt{color:var(--muted)}.ad-pairs dd{margin:0;overflow-wrap:anywhere}.ad-note{padding:7px;background:var(--bg);border-left:2px solid var(--accent);font-size:10px;line-height:1.5;margin-top:8px;color:var(--muted)}.ad-exceptions{font-size:10px;line-height:1.5;color:var(--muted)}.ad-exceptions.bad{color:#c35135}.ad-history-row{font-size:9px;padding:7px 0;border-bottom:1px solid var(--line);color:var(--muted)}.ad-history-row b{font-size:10px;display:block;color:var(--fg);font-weight:550;margin-bottom:2px}.ad-mini-map{width:100%;height:108px;display:block;background:var(--bg);border:1px solid var(--line);border-radius:4px}.ad-mini-map text{fill:var(--fg);font-size:8px;font-family:system-ui,sans-serif}.ad-mini-map .ad-map-road{stroke:var(--line);stroke-width:6;fill:none}.ad-mini-map .ad-map-route{stroke:var(--accent);stroke-width:2;fill:none}.ad-mini-map circle{fill:var(--panel);stroke:var(--accent);stroke-width:1.5}.ad-mini-caption{font-size:8px;color:var(--muted);margin-top:4px}.ad-cap-line{display:flex;justify-content:space-between;font-size:10px;margin:7px 0}.ad-cap-line span{color:var(--muted)}
  .ad-activity-dock{height:42px;flex:none;display:flex;gap:12px;align-items:center;padding:5px 9px;border-top:1px solid var(--line);background:var(--panel);overflow:hidden}.ad-activity-dock>div{min-width:0;flex:1;font-size:9px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ad-activity-dock b{display:block;font-size:9px;font-weight:600;color:var(--fg);margin-bottom:2px}.ad-activity-dock svg{margin-right:4px;color:var(--muted)}.ad-alert-count{color:#c35135!important}.ad-footer{height:29px;min-height:29px;font-size:9px;padding:4px 9px;gap:12px}.ad-footer .ad-reference{font-size:8px}
  .ad-popover{top:42px;right:8px;max-height:calc(100% - 50px);overflow:auto;width:290px;padding:12px;font-size:11px}.ad-popover .ad-history-row:last-child{border:0}.ad-popover button{margin-top:8px;font-size:10px}.ad-app.short .ad-activity-dock{display:none}.ad-app.short .ad-nav{display:none}.ad-app.compact .ad-state{display:none}.ad-app.compact .ad-filter-end{display:none}.ad-app.compact .ad-inspect-toggle{padding:5px}.ad-app.compact .ad-inspect-toggle span{display:none}
  `;
  env.widget({
    task:'use-dispatch',site:'base',name:'classic',split:'train',
    scenarios:['board','warehouse','reschedule','route-order'],
    render(ctx) {
      const s=ctx.spec, f=env.taskDef, u=ctx.util, route=s.scenario==='route-order';
      ctx.css('app-dispatch-classic',CSS);
      const app=u.el('section',`ad-app${ctx.size.width<800?' compact':''}${ctx.size.width>=1140?' roomy':''}${ctx.size.height<430?' short':''}`,ctx.stage);
      app.setAttribute('aria-label','Dispatch operations');
      const refs={cards:new Map(),lanes:new Map(),panes:new Map(),heads:new Map(),loads:new Map(),fills:new Map(),facts:[],rows:new Map()};
      let dragging=null, painting=false, selected=s.items[0].id;
      const cr=ctx.rng.fork('operations-content'),C=ctx.content,co={csplit:s.csplit};
      const dispatcher=C.personName(cr,co),contacts=s.items.map(()=>C.personName(cr,co));
      const otherCompanies=C.sample(cr,C.COMPANIES,12,co),otherProducts=C.sample(cr,C.PRODUCTS,6,co);
      const otherPlans=[['East district','18 orders','In progress'],['Customer returns','7 collections','Awaiting review'],['South depot','22 orders','Ready to dispatch'],['West district','12 orders','Draft']];
      const bgRows=Array.from({length:9},(_,i)=>({ref:`${s.scenario==='warehouse'?'RCV':'RUN'}-${4100+i}`,name:otherCompanies[i],status:['Completed','Awaiting paperwork','In progress'][i%3]}));
      const noteText=s.scenario==='warehouse'?'Receiving note: retain lot labels and keep handling instructions with each carton.':s.scenario==='reschedule'?'Customer service note: weekday commitments have been confirmed. Preserve the delivery contact and reference.':'Delivery note: use the goods entrance. Call the receiving desk on arrival; signature required.';
      function btn(parent,label,name,fn,cls='') {
        const b=u.el('button',cls,parent);b.type='button';if(name)icon(b,name);if(label)u.el('span','',b,label);b.addEventListener('click',fn);return b;
      }
      const titles={board:'Dispatch board',warehouse:'Warehouse put-away',reschedule:'Delivery capacity', 'route-order':'Route planner'};
      const toolbar=u.el('div','ad-toolbar',app);icon(u.el('span','ad-mark',toolbar),'brand',18);u.el('span','ad-brand',toolbar,'Wayline');u.el('span','ad-crumb',toolbar,'North depot / Operations');
      const live=u.el('span','ad-badge',toolbar);u.el('i','ad-dot',live);u.el('span','',live,'Changes saved');
      const notices=btn(toolbar,'','bell',()=>showBackground('Notifications','Three updates from other operations'), 'ad-icon-btn');notices.setAttribute('aria-label','Notifications');u.el('span','ad-bell-count',notices,'3');
      const help=btn(toolbar,'Rules','file',()=>{});
      const details=btn(toolbar,'Details','panel',()=>{refs.inspector.hidden=false;refs.inspector.classList.toggle('open');},'ad-inspect-toggle');details.setAttribute('aria-label','Show shipment details');
      const avatar=u.el('span','ad-avatar',toolbar,dispatcher.first[0]+dispatcher.last[0]);avatar.title=dispatcher.full;
      const pop=u.el('div','ad-popover',app);pop.hidden=true;u.el('strong','',pop,'Planning rules');
      u.el('p','',pop,route?'Every stop is visited once. Distances are directional; include departure from and return to Depot.':
        s.scenario==='warehouse'?'Match the item’s storage temperature. Hazardous inventory requires a hazmat-certified bin. Loads are measured in kg.':
        s.scenario==='board'?'A vehicle’s shift must cover each job’s entire delivery window. The total assigned load must fit its capacity.':'Daily capacity is the total weight of deliveries. Move cards between days to balance the plan.');
      u.el('p','',pop,'Assignments are saved automatically. Customer references and receiving notes remain attached to the shipment.');
      help.addEventListener('click',()=>{pop.hidden=!pop.hidden;});
      const background=u.el('div','ad-popover',app);background.hidden=true;
      function showBackground(title,subtitle) {
        background.replaceChildren();background.hidden=false;pop.hidden=true;
        u.el('strong','',background,title);u.el('p','ad-muted',background,subtitle);
        const data=title==='Notifications'?[['09:42','East district: driver check-in overdue'],['09:37','Receiving dock 4: paperwork requested'],['09:31','South depot: a route was shared with the team']]:
          bgRows.map(r=>[`${r.ref} · ${r.name}`,r.status]);
        data.forEach(([a,b])=>{const row=u.el('div','ad-history-row',background);u.el('b','',row,a);u.el('span','',row,b);});
        btn(background,'Close','close',()=>{background.hidden=true;});
      }
      const shell=u.el('div','ad-shell',app),rail=u.el('aside','ad-rail',shell),work=u.el('div','ad-work',shell);
      const areas=[['grid','Overview',''],['truck','Dispatch','24'],['box','Inventory','16'],['calendar','Schedules','5'],['route','Routes','12'],['user','Customers','']];
      areas.forEach(([ic,label,count])=>{const active=label===(s.scenario==='warehouse'?'Inventory':s.scenario==='reschedule'?'Schedules':route?'Routes':'Dispatch');
        const b=btn(rail,'',ic,()=>showBackground(label,`Other ${label.toLowerCase()} records at North depot`),active?'current':'');b.title=label;b.setAttribute('aria-label',label);u.el('span','ad-rail-label',b,label);if(count)u.el('span','ad-rail-count',b,count);});
      const saved=u.el('div','ad-saved',rail);u.el('h5','',saved,'Saved workspaces');
      otherPlans.forEach(([name,count,status])=>{const row=u.el('div','',saved);u.el('b','',row,name);u.el('span','',row,`${count} · ${status}`);});
      const bottom=u.el('div','ad-rail-bottom',rail);const team=btn(bottom,'','user',()=>showBackground('Planning team','North depot · Dispatch and receiving'));team.title='Planning team';u.el('span','ad-rail-label',team,'Planning team');
      const nav=u.el('div','ad-nav',work);[titles[s.scenario],'Activity','Documents'].forEach(t=>{const n=u.el('span',t===titles[s.scenario]?'active':'',nav,t);if(t!==titles[s.scenario]){n.style.cursor='pointer';n.addEventListener('click',()=>showBackground(t,'Recent records from the depot'));}});u.el('span','ad-right',nav,'Shared with Planning team');
      const context=u.el('div','ad-context',work);u.el('strong','',context,titles[s.scenario]);u.el('span','ad-badge',context,`${s.items.length} ${s.scenario==='warehouse'?'items':route?'stops':'deliveries'}`);
      u.el('span','ad-muted',context,s.scenario==='board'?'Service windows · local depot time':s.scenario==='warehouse'?'Receiving batch · storage compliance':s.scenario==='reschedule'?'Week 24 · kg per day':'Distance matrix · km · directional');
      const filters=u.el('div','ad-filters',work);
      btn(filters,s.scenario==='warehouse'?'Receipt RCV-2406':s.scenario==='reschedule'?'Week 24':'Tuesday, 8 June','calendar',()=>showBackground('Planning periods','Other saved periods and batches'));
      btn(filters,'North depot','down',()=>showBackground('Depots','Other operational workspaces'));u.el('span','ad-filter-sep',filters);
      btn(filters,'Current plan','filter',()=>showBackground('Saved views','Other plans are shown for operational context'));
      const exceptionCount=u.el('span','ad-filter-end',filters);refs.exceptionCount=exceptionCount;
      const workspace=u.el('div','ad-workspace',work),main=u.el('div','ad-main',workspace);
      const footer=u.el('div','ad-footer');
      function makePane(parent,id,cls='') {
        const p=u.el('div',`ad-pane ${cls}`,parent);p.setAttribute('aria-label',`${id==='pool'?'Unassigned':id} scroll area`);
        refs.panes.set(id,p);p.addEventListener('scroll',()=>{if(!painting&&!dragging) mirror();});
        // Native scrolling stays available to mouse users; explicit handling also keeps wheel actions deterministic.
        p.addEventListener('wheel',e=>{e.preventDefault();p.scrollTop+=e.deltaY;mirror();},{passive:false});
        return p;
      }
      function mirror() {
        const view={};
        for(const [id,p] of refs.panes) view[id]={px:p.scrollTop,h:p.clientHeight-12,row:route?48:76};
        if(JSON.stringify(view)!==JSON.stringify(ctx.model.view)) ctx.patch({view});
      }
      function commit(m) {ctx.update(m);paint(ctx.model);mirror();}
      function attach(card,it) {
        let origin;
        env.ui.track(card,{
          start() {
            origin=card.getBoundingClientRect();dragging=it.id;
            const ghost=card.cloneNode(true);ghost.classList.add('ad-ghost');ghost.style.width=`${origin.width}px`;ghost.style.height=`${origin.height}px`;
            ghost.style.left=`${origin.left}px`;ghost.style.top=`${origin.top}px`;app.appendChild(ghost);refs.ghost=ghost;card.classList.add('dragging');
          },
          move(p) {
            if(!refs.ghost) return;
            refs.ghost.style.left=`${origin.left+p.dx}px`;refs.ghost.style.top=`${origin.top+p.dy}px`;
            for(const [id,l] of refs.lanes) {const r=l.getBoundingClientRect();l.classList.toggle('over',p.x>=r.left&&p.x<=r.right&&p.y>=r.top&&p.y<=r.bottom);}
          },
          end(p) {
            refs.ghost?.remove();refs.ghost=null;card.classList.remove('dragging');dragging=null;
            for(const l of refs.lanes.values()) l.classList.remove('over');
            if(Math.abs(p.dx)+Math.abs(p.dy)<4) {selected=it.id;paint(ctx.model);if(ctx.size.width<1140) refs.inspector.classList.add('open');return;}
            if(route) {
              const pane=refs.panes.get('route'), r=pane.getBoundingClientRect();
              if(p.x<r.left||p.x>r.right||p.y<r.top||p.y>r.bottom) return;
              const i=u.clamp(Math.floor((p.y-r.top+pane.scrollTop-6)/48),0,ctx.model.order.length-1);
              commit(f.helpers.move(ctx.model,it.id,i,s));
            } else for(const [id,l] of refs.lanes) {
              const r=l.getBoundingClientRect();if(p.x>=r.left&&p.x<=r.right&&p.y>=r.top&&p.y<=r.bottom) {commit(f.helpers.move(ctx.model,it.id,id,s));break;}
            }
          }
        },'dispatch-card');
      }
      function card(it,parent) {
        const el=u.el('div',`ad-card${route?' ad-stop':''}`,parent);el.setAttribute('aria-label',`${it.id}: ${it.name}, ${it.weight} kg`);el.title=`${it.id} · ${it.name} · ${it.address}`;
        if(route) {
          icon(u.el('span','ad-grip',el),'grip',11);u.el('span','ad-stop-number',el);
          const copy=u.el('div','ad-stop-copy',el);u.el('div','ad-customer',copy,`${it.id} · ${it.name}`);u.el('div','ad-card-note',copy,`${it.address} · 10 min service`);u.el('span','ad-state',el,'Planned');u.el('span','ad-weight',el,`${it.weight} kg`);
        } else {
          const top=u.el('div','ad-card-top',el);icon(u.el('span','ad-grip',top),'grip',10);u.el('span','ad-id',top,it.id);u.el('span','ad-state',top);u.el('span','ad-weight',top,`${it.weight} kg`);
          u.el('div','ad-customer',el,it.name);
          const note=u.el('div','ad-card-note',el);icon(note,s.scenario==='warehouse'?(it.temp==='chilled'?'snow':it.haz?'alert':'box'):s.scenario==='board'?'clock':'pin',10);
          u.el('span','',note,s.scenario==='warehouse'?`${it.temp==='chilled'?'Chilled · 2–8°C':'Ambient'}${it.haz?' · HAZMAT':''}`:
            s.scenario==='board'?`${f.helpers.time(it.start)}–${f.helpers.time(it.end)}`:it.address);
          const ref=u.el('div','ad-card-ref',el);u.el('span','',ref,`${s.scenario==='warehouse'?'LOT':'ORD'}-${2800+s.items.indexOf(it)}`);u.el('span','',ref,s.scenario==='warehouse'?'QC released':s.scenario==='reschedule'?'Customer confirmed':'Signature required');
        }
        refs.cards.set(it.id,el);attach(el,it);return el;
      }
      if(!route) {
        const lanes=u.el('div','ad-lanes',main);lanes.style.gridTemplateColumns=`repeat(${s.lanes.length+1},minmax(0,1fr))`;
        for(const l of [{id:'pool',label:s.scenario==='warehouse'?'Receiving dock':'Unassigned'},...s.lanes]) {
          const lane=u.el('section','ad-lane',lanes);lane.setAttribute('aria-label',l.label);refs.lanes.set(l.id,lane);
          const head=u.el('div','ad-lane-head',lane);refs.heads.set(l.id,head);const label=u.el('strong','',head);icon(label,l.id==='pool'?'archive':s.scenario==='warehouse'?'box':s.scenario==='reschedule'?'calendar':'truck',12);u.el('span','',label,l.label);
          u.el('span','ad-meta',head,l.id==='pool'?(s.scenario==='warehouse'?'Receipt RCV-2406':'Current plan backlog'):s.scenario==='warehouse'?`${l.temp==='chilled'?'Chilled · 2–8°C':'Ambient'}${l.haz?' · Hazmat certified':''}`:
            s.scenario==='board'?l.vehicle:'Scheduled deliveries');
          if(l.id!=='pool'&&s.scenario==='board') u.el('span','ad-meta',head,`Shift ${f.helpers.time(l.start)}–${f.helpers.time(l.end)}`);
          refs.loads.set(l.id,u.el('div','ad-load',head));const bar=u.el('div','ad-bar',head);refs.fills.set(l.id,u.el('div','ad-fill',bar));
          const pane=makePane(lane,l.id);const empty=u.el('div','ad-empty',pane);icon(empty,l.id==='pool'?'check':'archive',17);u.el('span','',empty,l.id==='pool'?(s.scenario==='warehouse'?'Receiving queue cleared':'All jobs allocated'):
            s.scenario==='warehouse'?'No stock allocated':s.scenario==='reschedule'?'No deliveries scheduled':'No jobs assigned');refs.rows.set(l.id,empty);
        }
        for(const it of s.items) card(it,refs.panes.get(ctx.model.assign[it.id]||'pool'));
      } else {
        const body=u.el('div','ad-routes',main),left=u.el('div','ad-route-box',body);
        const rh=u.el('div','ad-route-head',left);u.el('strong','',rh,`Run N-24 · ${s.items.length} stops`);u.el('span','ad-muted',rh,`${s.routeCapacity} kg vehicle`);
        const start=u.el('div','ad-depot',left);icon(start,'pin',11);u.el('span','',start,' North depot · Departure');const pane=makePane(left,'route','ad-route-list');
        for(const id of ctx.model.order) card(s.items.find(it=>it.id===id),pane);
        const end=u.el('div','ad-depot',left);icon(end,'pin',11);u.el('span','',end,' North depot · Return');
        const matrix=u.el('div','ad-matrix-box',body);const mh=u.el('div','ad-route-head',matrix);u.el('strong','',mh,'Distance matrix');u.el('span','ad-muted',mh,'Rows: from · Columns: to');
        const mp=u.el('div','ad-matrix-pane',matrix),table=u.el('table','ad-table',mp);table.setAttribute('aria-label','Directed distances in kilometers');
        const nodes=['depot',...s.items.map(it=>it.id)],thead=u.el('thead','',table),tr=u.el('tr','',thead);u.el('th','',tr,'km');
        nodes.forEach(id=>u.el('th','',tr,id==='depot'?'Depot':id));const tb=u.el('tbody','',table);refs.cells=new Map();
        for(const a of nodes) {const row=u.el('tr','',tb);u.el('th','',row,a==='depot'?'Depot':a);for(const b of nodes) refs.cells.set(`${a}/${b}`,u.el('td','',row,a===b?'—':String(s.distances[a][b])));}
        u.el('div','ad-policy',matrix,'Each value is the road distance from the row stop to the column stop. Highlighted cells show the current route. Depot travel is included.');
      }
      const dock=u.el('div','ad-activity-dock',main);refs.dock=dock;
      const issue=u.el('div','',dock);const issueTitle=u.el('b','',issue);icon(issueTitle,'alert',11);u.el('span','',issueTitle,' Plan exceptions');refs.issue=u.el('span','',issue);
      const feed=u.el('div','',dock);const feedTitle=u.el('b','',feed);icon(feedTitle,'activity',11);u.el('span','',feedTitle,' Depot activity');u.el('span','',feed,'09:37 · South depot manifest shared');
      const inspector=u.el('aside','ad-inspector',workspace);refs.inspector=inspector;inspector.setAttribute('aria-label','Shipment information');
      const ih=u.el('div','ad-inspector-head',inspector);u.el('span','',ih,route?'Route information':s.scenario==='warehouse'?'Receiving information':'Shipment information');btn(ih,'','close',()=>{inspector.classList.remove('open');if(ctx.size.width>=1140)inspector.hidden=true;}).setAttribute('aria-label','Close details');
      const detail=u.el('div','ad-section',inspector);refs.detail=detail;
      const contextPanel=u.el('div','ad-section',inspector);u.el('h5','',contextPanel,route||s.scenario==='board'?'Service area':s.scenario==='warehouse'?'Storage locations':'Other delivery runs');
      if(route||s.scenario==='board') {
        const map=u.svg('svg',{viewBox:'0 0 200 108',class:'ad-mini-map',role:'img','aria-label':'Schematic service area'},contextPanel);
        u.svg('path',{d:'M0 24h200M0 64h200M35 0v108M95 0v108M158 0v108',class:'ad-map-road'},map);
        const mr=ctx.rng.fork('service-map'),points={depot:[24,83]};s.items.forEach(it=>{points[it.id]=[mr.int(40,184),mr.int(12,91)];});refs.points=points;
        refs.routePath=u.svg('path',{class:'ad-map-route'},map);
        for(const [id,p] of Object.entries(points)) {u.svg('circle',{cx:p[0],cy:p[1],r:6},map);const t=u.svg('text',{x:p[0]+8,y:p[1]+3},map);t.textContent=id==='depot'?'Depot':id;}
        u.el('div','ad-mini-caption',contextPanel,'Service area schematic · distances use road km');
      } else if(s.scenario==='warehouse') {
        for(const [i,l] of s.lanes.entries()) {const row=u.el('div','ad-history-row',contextPanel);const b=u.el('b','',row);icon(b,'box',11);u.el('span','',b,` North / ${l.temp==='chilled'?'Cold room':'Dry storage'} / ${l.label}`);u.el('span','',row,`${l.haz?'Hazmat certified':'Standard receiving'} · ${l.capacity} kg limit`);}
        u.el('div','ad-note',contextPanel,'Quality desk: certificate for receipt RCV-2403 is pending. This receipt is released for put-away.');
      } else {
        [['Thursday','East district · 14 booked'],['Friday','South depot · 21 booked'],['Saturday','Collections only · 6 booked']].forEach(([a,b])=>{const r=u.el('div','ad-history-row',contextPanel);u.el('b','',r,a);u.el('span','',r,b);});
      }
      const related=u.el('div','ad-section',inspector);u.el('h5','',related,s.scenario==='warehouse'?'Other receipts':'Other active plans');
      bgRows.slice(0,5).forEach((row,i)=>{const r=u.el('div','ad-history-row',related);u.el('b','',r,`${row.ref} · ${s.scenario==='warehouse'?otherProducts[i].name:row.name}`);u.el('span','',r,row.status);});
      work.appendChild(footer);
      for(let i=0;i<3;i++) refs.facts.push(u.el('span',i===2?'ad-reference':'',footer));
      function paint(m) {
        if(dragging) return;
        painting=true;
        const alerts=[];
        if(route) {
          const pane=refs.panes.get('route');
          m.order.forEach((id,i)=>{const el=refs.cards.get(id);if(pane.children[i]!==el) pane.insertBefore(el,pane.children[i]||null);el.querySelector('.ad-stop-number').textContent=String(i+1);});
          const seq=['depot',...m.order,'depot'],edges=new Set(seq.slice(1).map((id,i)=>`${seq[i]}/${id}`));
          for(const [key,el] of refs.cells) el.classList.toggle('on',edges.has(key));
          if(s.items.reduce((a,it)=>a+it.weight,0)>s.routeCapacity) alerts.push('Manifest exceeds vehicle capacity');
          const points=['depot',...m.order,'depot'].map(id=>refs.points[id]);
          refs.routePath.setAttribute('d',points.map((p,i)=>`${i?'L':'M'}${p[0]} ${p[1]}`).join(' '));
        } else {
          const totals=f.helpers.loads(m,s);
          for(const [id,pane] of refs.panes) {
            const items=s.items.filter(it=>(m.assign[it.id]||'pool')===id);
            const empty=refs.rows.get(id);empty.hidden=items.length>0;
            items.forEach((it,i)=>{
              const el=refs.cards.get(it.id);if(pane.children[i+1]!==el) pane.insertBefore(el,pane.children[i+1]||null);
              const l=s.lanes.find(x=>x.id===id);el.classList.toggle('invalid',!!l&&(!f.helpers.compatible(it,l,s)||totals[id]>l.capacity));
              if(l&&!f.helpers.compatible(it,l,s)) alerts.push(`${it.id}: ${s.scenario==='warehouse'?'incompatible storage':'outside vehicle shift'}`);
              el.querySelector('.ad-state').textContent=!l?'Queued':!f.helpers.compatible(it,l,s)||totals[id]>l.capacity?'Review':'Assigned';
            });
            const l=s.lanes.find(x=>x.id===id),load=items.reduce((n,it)=>n+it.weight,0),bad=!!l&&load>l.capacity;
            if(bad) alerts.push(`${l.label}: ${load-l.capacity} kg over capacity`);
            refs.loads.get(id).replaceChildren();if(bad)icon(refs.loads.get(id),'alert',11);u.el('span','',refs.loads.get(id),l?`${load} / ${l.capacity} kg`:`${items.length} waiting · ${load} kg`);
            refs.loads.get(id).classList.toggle('ad-warn',bad);refs.lanes.get(id).classList.toggle('bad',bad);
            refs.fills.get(id).style.width=l?`${Math.min(100,100*load/l.capacity)}%`:'0%';
          }
        }
        for(const [id,el] of refs.cards) el.classList.toggle('selected',id===selected);
        refs.exceptionCount.textContent=`${alerts.length} constraint ${alerts.length===1?'alert':'alerts'} · Autosaved`;
        refs.exceptionCount.classList.toggle('ad-alert-count',alerts.length>0);
        refs.issue.textContent=alerts.length?alerts.slice(0,2).join('; '):'No capacity or handling exceptions';refs.issue.title=alerts.join('; ');refs.issue.classList.toggle('ad-alert-count',alerts.length>0);
        const it=s.items.find(x=>x.id===selected),idx=s.items.indexOf(it),l=s.lanes.find(x=>x.id===m.assign[it.id]);
        detail.replaceChildren();u.el('h5','',detail,`${s.scenario==='warehouse'?'Inventory':'Delivery'} detail · ${it.id}`);u.el('div','ad-inspect-title',detail,it.name);
        const pairs=u.el('dl','ad-pairs',detail);
        const data=[['Reference',`${s.scenario==='warehouse'?'LOT':'ORD'}-${2800+idx}`],['Status',route?'Planned':l?'Assigned':'Awaiting allocation'],
          [s.scenario==='warehouse'?'Location':route?'Stop number':'Assigned to',route?String(m.order.indexOf(it.id)+1):l?l.label:'Unassigned'],
          ['Load',`${it.weight} kg`],['Contact',contacts[idx].full],
          s.scenario==='warehouse'?['Storage',`${it.temp}${it.haz?' / hazmat':''}`]:['Address',`${24+idx*7} ${it.address}`],
          s.scenario==='board'?['Window',`${f.helpers.time(it.start)}–${f.helpers.time(it.end)}`]:s.scenario==='warehouse'?['Quality','Released for put-away']:['Service','10 minutes / signature'],['Owner',dispatcher.full]];
        data.forEach(([key,value])=>{u.el('dt','',pairs,key);u.el('dd','',pairs,value);});
        u.el('div','ad-note',detail,noteText);
        if(alerts.length){u.el('h5','',detail,'Constraint alerts');u.el('div','ad-exceptions bad',detail,alerts.join('. '));}
        f.facts(m,s).forEach((fact,i)=>{refs.facts[i].textContent=`${fact.label}: ${fact.value}`;});
        painting=false;
      }
      paint(ctx.model);mirror();
      current={refs,util:u,route};
      return {anchors:[app],sync(m){paint(m);mirror();}};
    },
    locate(t) {
      const {refs,util:u}=current;
      if(t.item) return u.center(refs.cards.get(t.item));
      if(t.lane) return u.center(refs.heads.get(t.lane));
      if(t.pane) return u.center(refs.panes.get(t.pane));
      if(t.slot!==undefined) {const p=refs.panes.get('route'),r=p.getBoundingClientRect();return [r.left+r.width/2,r.top+6+t.slot*48+20-p.scrollTop];}
      throw new Error(`Unknown use-dispatch target: ${JSON.stringify(t)}`);
    }
  });
})();
