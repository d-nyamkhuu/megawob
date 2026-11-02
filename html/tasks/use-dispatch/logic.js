/*
 * use-dispatch: assign loads, put away stock, reschedule deliveries and order route stops.
 * Logistics planning with reversible drag assignments and stop ordering.
 * Real-app counterparts: fleet dispatch consoles, warehouse put-away workbenches,
 * delivery capacity calendars and last-mile route planners (all scene data fictional).
 *
 * Scenarios: board (driver lanes, kg capacity and delivery windows); warehouse (bin kg
 * capacity, ambient/chilled storage and hazmat certification); reschedule (named
 * deliveries on requested weekdays, daily kg limits); route-order (specified stop
 * sequence or exact shortest depot-to-depot route using a visible directed km table).
 * spec: {scenario,level,ood,isplit,csplit,startMode,items:[{id,name,address,weight,
 *   temp,haz,start,end}],lanes:[{id,label,capacity,start,end,temp,haz,vehicle}],
 *   goal:{itemId:laneId},required:{itemId:laneId},initial:{itemId:laneId|'pool'},
 *   order:[id],initialOrder:[id],objective:'sequence'|'distance',distances:{a:{b:km}},
 *   routeCapacity,code,judge?}. goal is a feasible witness for warehouse; required
 *   alone adds named warehouse placement requirements. Other assignment goals are exact.
 * model: {assign:{itemId:laneId|'pool'},order:[id],view:{pane:{px,h,row}}}.
 * view is unscored scroll geometry mirrored by the widget. No timer or task-side ending.
 * error: per-item wrong/missing/incompatible assignments plus normalized capacity
 * overflow; route positional errors, or excess distance above the exact optimum.
 * startModes: off (backlog / old delivery days / shuffled route), partial (half done),
 * wrong (misassigned or reversed), solved. Easy/medium reduce jobs, stops and lanes;
 * ood expands counts and weights. All deliveries have a feasible normal solution.
 * facts: visible Assigned load, Unassigned and Dispatch reference; routes report
 * Route distance, Remaining capacity and Dispatch reference, computed from model.
 * silent: one assignment or reorder fails to persist; returns a corrupted copy,
 * fixable by repeating the drag, only when the result remains above tolerance.
 * retarget: changes requested assignments/sequence only, retaining scene contents,
 * capacities and distances; warehouse can add a named compatible placement request.
 * parts(model,spec): preempt=cancel items: each job by id (value: its lane / day), a route by stop position ('Stop 1',
 * value: the job there).
 * judgeModes: impossible makes a (random) shipment exceed every lane's capacity (routes: vehicle cannot carry the
 * manifest); unchanged initial state is scored; status impossible, what names the job (id or weight) or, for a
 * route, the manifest / vehicle capacity (spec.judge.what).
 * Targets: {item:id}, {lane:id}, {slot:index}, {pane:id}. Closed-loop plan scrolls
 * sources into view and bubbles route stops through adjacent positions when needed.
 * Self-test: selftest.js (loaded only by the checker and Node tests).
 * Helpers (widget API, env.taskDef.helpers):
 *   compatible(item, lane, spec): whether storage/shift constraints permit an assignment.
 *   loads(model, spec): assigned weight per lane.
 *   move(model, itemId, destination, spec): copy with a changed lane or route position.
 *   time(minutes): zero-padded local HH:MM label.
 */
(function () {
  'use strict';
  const C=env.content, I=env.instruct, U=env.util;
  const scenarios=['board','warehouse','reschedule','route-order'];
  const COLD_STOCK=[
    'Culture starter packs', 'Chilled oat drinks', 'Fresh herb trays', 'Plant-based yogurt', 'Fresh noodle cartons',
    'Cold brew bottles', 'Berry puree tubs', 'Seedling nutrient packs', 'Cultured cream tubs', 'Fresh tofu cartons',
    'Prepared salad cases', 'Chilled dessert cups', 'Salted butter blocks', 'Fresh mozzarella tubs',
    'Paneer cheese packs', 'Liquid egg cartons', 'Fresh chicken cases', 'Beef mince trays', 'Pork sausage packs',
    'Sliced ham packs', 'Smoked salmon packs', 'Fresh cod fillets', 'Cooked prawn tubs', 'Fresh mussel bags',
    'Pickled herring tubs', 'Fresh mushroom punnets', 'Baby spinach bags', 'Asparagus bunches',
    'Broccoli floret bags', 'Sweetcorn cob packs', 'Fresh fig trays', 'Raspberry punnets', 'Pomegranate aril tubs',
    'Cut pineapple tubs', 'Peeled garlic tubs', 'Fresh pesto jars', 'Guacamole tubs', 'Tzatziki tubs',
    'Refrigerated salsa tubs', 'Pizza dough balls', 'Ready-made quiche trays', 'Fresh yeast blocks',
    'Unbaked croissant trays', 'Cheesecake slices', 'Fresh kimchi tubs', 'Ricotta cheese tubs', 'Cottage cheese pots',
    'Halloumi cheese packs', 'Brie cheese wheels', 'Kefir drink bottles', 'Buttermilk cartons', 'Clotted cream pots',
    'Fresh custard cartons', 'Lamb chop trays', 'Duck breast packs', 'Turkey steak trays', 'Rabbit meat cases',
    'Venison steak packs', 'Fresh scallop tubs', 'Crab meat tubs', 'Fresh squid rings', 'Fresh octopus packs',
    'Trout roe jars', 'Fresh ravioli trays', 'Fresh gnocchi packs', 'Tempeh blocks', 'Seitan strips',
    'Chilled lentil pouches', 'Chilled falafel trays', 'Vegetable lasagne trays', 'Watercress bunches',
    'Brussels sprout bags', 'Leek bundles', 'Celery heart packs', 'Cut melon tubs', 'Rhubarb stalk bundles',
    'Fresh artichoke boxes', 'Cream eclair trays', 'Tiramisu trays', 'Rice pudding pots', 'Feta cheese tubs',
    'Mascarpone cheese tubs', 'Beef liver trays', 'Black pudding packs', 'Cooked meatball trays', 'Roast beef slices',
    'Whole quail trays', 'Fresh oyster crates', 'Live lobster crates', 'Fresh anchovy trays', 'Fresh skate wings',
    'Bean sprout bags', 'Pak choi bundles', 'Radish bunches', 'Baby carrot bags', 'Chicory head packs',
    'Fresh cherry cases', 'Fresh lychee trays', 'Okra punnets', 'Idli batter tubs', 'Potato gratin trays',
    'Scotch egg packs', 'Chilled pierogi packs', 'Sushi platters', 'Cooked couscous tubs', 'Baba ganoush tubs',
    'Fish pie trays', 'Chocolate mousse pots', 'Panna cotta pots', 'Fresh trifle bowls', 'Raw kombucha bottles'
  ];
  const HAZ_STOCK=[
    'Solvent cleaner drums', 'Aerosol lubricant cases', 'Lithium power cells', 'Adhesive hardener kits',
    'Resin activator bottles', 'Paint thinner cans', 'Industrial degreaser', 'Corrosion inhibitor drums',
    'Sealed fuel cartridges', 'Cleaning concentrate', 'Etching solution kits', 'Battery service packs',
    'Acetone solvent cans', 'Methanol reagent drums', 'Isopropyl alcohol bottles', 'Ethyl acetate drums',
    'Toluene solvent cans', 'Sulfuric acid carboys', 'Hydrochloric acid carboys', 'Formic acid drums',
    'Sodium metasilicate sacks', 'Naphthalene flake sacks', 'Camphor block cartons', 'Sulfur powder sacks',
    'Potassium nitrate sacks', 'Sodium persulfate sacks', 'Sodium nitrite sacks', 'Flammable contact cement',
    'Flammable marking paint', 'Solvent varnish tins', 'Alcohol perfume cartons', 'Safety match cartons',
    'Aerosol insecticide cases', 'Expanding foam aerosols', 'Pepper spray cartons', 'Carbon dioxide cylinders',
    'Xylene solvent cans', 'Heptane solvent drums', 'Butyl acetate drums', 'Perchloroethylene drums',
    'Turpentine oil cans', 'Barium nitrate sacks', 'Aniline reagent bottles', 'Nitrobenzene drums',
    'Argon welding cylinders', 'Propane cylinders', 'Aerosol hairspray cartons', 'Gasoline fuel cans',
    'Zinc chloride sacks', 'Pyridine reagent bottles', 'Hexamine fuel tablets', 'Silver nitrate bottles',
    'Dichloromethane bottles', 'Butane lighter cartons', 'Thiourea powder drums', 'Acetic anhydride drums',
    'Triethylamine drums', 'Iodine crystal bottles', 'Benzene reagent bottles', 'Potassium chlorate tubs',
    'Lead acetate bottles', 'Dimethylformamide bottles', 'Phenol crystal drums', 'Sodium dichromate drums'
  ];
  const time=n=>`${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;
  const compatible=(it,l,s)=>s.scenario==='warehouse' ? it.temp===l.temp && (!it.haz||l.haz) :
    s.scenario==='board' ? it.start>=l.start && it.end<=l.end : true;
  const loads=(m,s)=>Object.fromEntries(s.lanes.map(l=>[l.id,s.items.reduce((n,it)=>n+(m.assign[it.id]===l.id?it.weight:0),0)]));
  const assignedWeight=(m,s)=>s.items.reduce((n,it)=>n+(m.assign[it.id]&&m.assign[it.id]!=='pool'?it.weight:0),0);
  function distance(order,s) {
    const ids=['depot',...order,'depot'];
    return ids.slice(1).reduce((n,id,i)=>n+(s.distances[ids[i]]?.[id]||0),0);
  }
  function shortest(s) {
    let best=Infinity, order=[];
    function visit(prefix,rest,cost) {
      if(cost>=best) return;
      const from=prefix.at(-1)||'depot';
      if(!rest.length) {const d=cost+s.distances[from].depot;if(d<best){best=d;order=prefix;}return;}
      rest.forEach((id,i)=>visit(prefix.concat(id),rest.filter((_,j)=>i!==j),cost+s.distances[from][id]));
    }
    visit([],s.items.map(it=>it.id),0);
    return order;
  }
  function move(m,id,to,s) {
    const n=U.clone(m);
    if(s.scenario==='route-order') {
      n.order=n.order.filter(x=>x!==id);n.order.splice(U.clamp(to,0,n.order.length),0,id);
    } else n.assign[id]=to;
    return n;
  }
  const base=s=>({assign:{...s.initial},order:s.initialOrder.slice(),view:{}});
  function error(m,s) {
    const n=s.items.length;
    if(s.judge) return (s.items.filter(it=>m.assign[it.id]!==s.initial[it.id]).length+
      s.initialOrder.filter((id,i)=>m.order[i]!==id).length)/n;
    if(s.scenario==='route-order') {
      const missing=s.items.filter(it=>!m.order.includes(it.id)).length+Math.abs(m.order.length-n);
      const rank=s.objective==='distance' ? Math.max(0,distance(m.order,s)-distance(s.order,s))/Math.max(1,distance(s.order,s)) :
        s.order.filter((id,i)=>m.order[i]!==id).length/n;
      const weight=s.items.filter(it=>m.order.includes(it.id)).reduce((a,it)=>a+it.weight,0);
      return rank+missing/n+Math.max(0,weight-s.routeCapacity)/Math.max(1,s.routeCapacity);
    }
    const totals=loads(m,s);
    let wrong=0;
    for(const it of s.items) {
      const l=s.lanes.find(l=>l.id===m.assign[it.id]);
      const wanted=s.scenario==='warehouse'?s.required[it.id]:s.goal[it.id];
      if(!l||!compatible(it,l,s)||(wanted&&l.id!==wanted)) wrong++;
    }
    return wrong/n+s.lanes.reduce((a,l)=>a+Math.max(0,totals[l.id]-l.capacity)/Math.max(1,l.capacity),0)/s.lanes.length;
  }
  function scroll(m,pane,index,other=index) {
    const v=m.view[pane];if(!v) return null;
    const lo=Math.min(index,other)*v.row, hi=(Math.max(index,other)+1)*v.row;
    if(lo>=v.px-1&&hi<=v.px+v.h+1) return null;
    const target=Math.max(0,(lo+hi-v.h)/2);
    return {wheel:[{pane},target-v.px]};
  }
  const fam={
    name:'use-dispatch',
    reply:true, // judge and report endings are structured replies under the default reply=auto (kit/runtime/reply.js)
    scenarios,startModes:['off','partial','wrong','solved'],
    inputs:['pointer','wheel'],judgeModes:['impossible'],
    helpers:{time,compatible,loads,move},
    sample(rng,opts) {
      const scenario=opts.scenario||rng.pick(opts.scenarios||scenarios), level=opts.level||'normal';
      const cr=rng.fork('content'), co={csplit:opts.csplit};
      const count=scenario==='route-order'?(level==='easy'?4:level==='medium'?5:opts.ood?7:6):
        level==='easy'?4:level==='medium'?6:opts.ood?10:8;
      const k=scenario==='warehouse'?3:level==='easy'?2:3;
      const s={scenario,level,ood:!!opts.ood,isplit:opts.isplit,csplit:opts.csplit,startMode:opts.startMode||'off',
        items:[],lanes:[],goal:{},required:{},initial:{},order:[],initialOrder:[],distances:{},
        objective:scenario==='route-order'&&level!=='easy'&&rng.bool()?'distance':'sequence',code:`DP-${C.alnum(cr,6)}`};
      for(let j=0;j<k;j++) {
        const p=C.personName(cr,co);
        s.lanes.push({id:`l${j}`,label:scenario==='warehouse'?['A-01','C-02','H-03'][j]:
          scenario==='reschedule'?['Monday','Tuesday','Wednesday'][j]:`${p.first} ${p.last[0]}.`,
          capacity:0,start:480+j*60,end:1080+j*60,temp:j===1?'chilled':'ambient',haz:j===2,
          vehicle:['Cargo van','Box truck','Tail-lift truck'][j]});
      }
      const companies=C.sample(cr,C.COMPANIES,count,co);
      // Task-local handling classes complement the shared commerce product bank.
      const inventory=C.sample(cr,C.PRODUCTS,count,co);
      for(let i=0;i<count;i++) {
        const j=i%k, lane=s.lanes[j], weight=rng.int(opts.ood?15:5,opts.ood?90:35);
        const windowStart=lane.start+rng.int(0,8)*60;
        const stock=lane.temp==='chilled'?C.pick(cr,COLD_STOCK,co):lane.haz?C.pick(cr,HAZ_STOCK,co):inventory[i%inventory.length].name;
        const it={id:`J${i+1}`,name:scenario==='warehouse'?stock:companies[i%companies.length],address:C.pick(cr,C.STREET_NAMES,co),weight,
          temp:scenario==='warehouse'?lane.temp:'ambient',haz:scenario==='warehouse'&&lane.haz,
          start:windowStart,end:Math.min(lane.end,windowStart+120)};
        s.items.push(it);s.goal[it.id]=lane.id;lane.capacity+=weight;
        s.initial[it.id]=scenario==='reschedule'?s.lanes[(j+1)%k].id:'pool';
      }
      // Capacities are generated around a feasible witness, never around the starting mistake.
      for(const l of s.lanes) l.capacity+=rng.int(8,20);
      s.order=rng.shuffle(s.items.map(it=>it.id));
      const nodes=['depot',...s.items.map(it=>it.id)];
      for(const a of nodes) s.distances[a]=Object.fromEntries(nodes.map(b=>[b,a===b?0:rng.int(opts.ood?4:2,opts.ood?60:30)]));
      if(s.objective==='distance') s.order=shortest(s);
      s.initialOrder=rng.shuffle(s.order);
      if(s.initialOrder.every((id,i)=>id===s.order[i])) s.initialOrder.push(s.initialOrder.shift());
      // A distance optimum can tie: explicitly choose an unsolved starting route.
      if(scenario==='route-order'&&s.objective==='distance'&&distance(s.initialOrder,s)===distance(s.order,s)) {
        s.initialOrder=s.order.slice().reverse();
        if(distance(s.initialOrder,s)===distance(s.order,s)) {s.objective='sequence';}
      }
      s.routeCapacity=s.items.reduce((a,it)=>a+it.weight,0)+rng.int(15,40);
      if(opts.judge==='impossible') {
        const jr=rng.fork('judge-text'), total=s.items.reduce((a,it)=>a+it.weight,0); // judge-only draws, after everything else
        if(scenario==='route-order') s.routeCapacity=total-10;
        const heavy=s.items[jr.int(0,s.items.length-1)];
        if(scenario!=='route-order') heavy.weight=Math.max(...s.lanes.map(l=>l.capacity))+25;
        // what: the overloaded job (its id or weight) or, for a route, the manifest against the vehicle's capacity
        s.judge={mode:'impossible',what:scenario==='route-order'?['manifest','vehicle capacity',`${s.routeCapacity} kg`]:[heavy.id,`${heavy.weight} kg`],
          message:scenario==='route-order'?"I can't dispatch this route: the manifest exceeds the vehicle capacity.":
          `I can't assign ${heavy.id}: its load exceeds the capacity of every ${scenario==='warehouse'?'bin':scenario==='board'?'vehicle':'delivery day'}.`};
      }
      return s;
    },
    init(s) {
      const m=base(s);if(s.judge) return m;
      if(s.startMode==='solved') return this.solve(s,m);
      if(s.scenario==='route-order') {
        if(s.startMode==='partial') {m.order=s.order.slice();[m.order[0],m.order[1]]=[m.order[1],m.order[0]];}
        if(s.startMode==='wrong') m.order=s.order.slice().reverse();
        if(error(m,s)===0) m.order=s.initialOrder.slice();
      } else {
        if(s.startMode==='partial') s.items.slice(0,Math.floor(s.items.length/2)).forEach(it=>{m.assign[it.id]=s.goal[it.id];});
        if(s.startMode==='wrong') s.items.forEach(it=>{m.assign[it.id]=s.lanes[(s.lanes.findIndex(l=>l.id===s.goal[it.id])+1)%s.lanes.length].id;});
      }
      return m;
    },
    error,tolerance:()=>({tau:0,sigma:.5,minInitialError:.01}),
    instruction(s,rng) {
      const groups=s.lanes.map(l=>`${s.items.filter(it=>s.goal[it.id]===l.id).map(it=>it.id).join(', ')} to ${l.label}`).join('; ');
      let templates,vars={groups,seq:s.order.join(', then ')};
      if(s.scenario==='board') templates=[
        'Assign the jobs as follows: {groups}. Respect vehicle capacities and delivery windows.',
        'Dispatch {groups}, keeping every vehicle within its load limit and working window.'];
      else if(s.scenario==='warehouse') {
        const named=Object.entries(s.required).map(([id,l])=>`${id} in ${s.lanes.find(x=>x.id===l).label}`).join('; ');
        vars.named=named?` Put ${named}.`:'';
        templates=['Put away all items in bins matching their temperature; hazmat needs a certified bin. Keep each bin within capacity.{named}',
          'Assign every item to compatible storage without exceeding bin capacities. Match temperatures and use certified bins for hazmat.{named}'];
      } else if(s.scenario==='reschedule') templates=[
        'Reschedule the deliveries: {groups}. Keep every day within its capacity.',
        'Move the named deliveries onto these days: {groups}. Do not exceed any daily load limit.'];
      else if(s.objective==='distance') templates=[
        'Plan the shortest route through all stops, leaving from and returning to Depot. Distances depend on the direction of travel; keep within vehicle capacity.',
        'Find the shortest Depot-to-Depot route through every stop using the displayed distances. Stay within the vehicle load limit.'];
      else templates=['Arrange the driver’s stops as {seq}, starting and ending at Depot. Keep within vehicle capacity.',
        'Schedule the stops in this order: {seq}. Start and finish at Depot, within the vehicle load limit.'];
      return I.say(rng,I.phrase(rng,templates,vars,s.isplit),{isplit:s.isplit});
    },
    plan(m,s) {
      if(s.judge) return {finish:true,message:s.judge.message};
      if(s.scenario==='route-order') {
        for(let i=0;i<s.order.length;i++) if(m.order[i]!==s.order[i]) {
          const j=m.order.indexOf(s.order[i]);
          const v=m.view.route, fits=!v||(j-i+1)*v.row<=v.h-2;
          const to=fits?i:j-1;
          return scroll(m,'route',j,to)||{drag:[{item:s.order[i]},{slot:to}]};
        }
      } else {
        // Follow a feasible witness; warehouse accepts any fully compatible, non-overloaded assignment.
        for(const it of s.items) if(m.assign[it.id]!==s.goal[it.id]) {
          const from=m.assign[it.id]||'pool', index=s.items.filter(x=>(m.assign[x.id]||'pool')===from).findIndex(x=>x.id===it.id);
          return scroll(m,from,index)||{drag:[{item:it.id},{lane:s.goal[it.id]}]};
        }
      }
      return null;
    },
    solve(s,m) {return s.judge?base(s):{...(m?U.clone(m):base(s)),assign:{...s.goal},order:s.order.slice()};},
    // preempt=cancel: each job by id (value: its lane or day), a route by stop position (value: the job there)
    parts(m,s) {
      if(s.scenario==='route-order') return s.items.map((_,i)=>({name:`Stop ${i+1}`,value:m.order[i]||null}));
      return s.items.map(it=>({name:it.id,aliases:[it.name],value:m.assign[it.id]||'pool'}));
    },
    facts(m,s) {
      if(s.scenario==='route-order') return [{label:'Route distance',value:`${distance(m.order,s)} km`},
        {label:'Remaining capacity',value:`${s.routeCapacity-s.items.filter(it=>m.order.includes(it.id)).reduce((a,it)=>a+it.weight,0)} kg`},
        {label:'Dispatch reference',value:s.code}];
      return [{label:'Assigned load',value:`${assignedWeight(m,s)} kg`},
        {label:'Unassigned',value:String(s.items.filter(it=>!m.assign[it.id]||m.assign[it.id]==='pool').length)},
        {label:'Dispatch reference',value:s.code}];
    },
    silent(next,prev,s,rng) {
      if(s.judge||error(next,s)>=error(prev,s)) return null;
      const n=U.clone(next);
      if(s.scenario==='route-order') n.order=prev.order.slice();
      else {
        const ids=s.items.filter(it=>next.assign[it.id]!==prev.assign[it.id]).map(it=>it.id);
        if(!ids.length) return null;
        const id=rng.pick(ids);n.assign[id]=prev.assign[id];
      }
      return error(n,s)>0?n:null;
    },
    retarget(s,m,rng) {
      if(s.judge) return null;
      if(s.scenario==='route-order') {
        const n=U.clone(s);n.objective='sequence';n.order=rng.shuffle(s.order);
        if(error(m,n)===0) n.order.push(n.order.shift());
        return error(m,n)>0?n:null;
      }
      const candidates=rng.shuffle(s.items);
      for(const it of candidates) for(const l of rng.shuffle(s.lanes)) {
        if(l.id===s.goal[it.id]||!compatible(it,l,s)) continue;
        const n=U.clone(s);n.goal[it.id]=l.id;
        if(s.scenario==='warehouse') n.required[it.id]=l.id;
        const solved={assign:n.goal,order:n.order,view:{}};
        if(error(solved,n)===0&&error(m,n)>0) return n;
        // Swapping two items often frees the exact space needed without changing the scene.
        for(const other of candidates) if(s.goal[other.id]===l.id&&compatible(other,s.lanes.find(x=>x.id===s.goal[it.id]),s)) {
          const a=U.clone(n);a.goal[other.id]=s.goal[it.id];
          if(s.scenario==='warehouse') a.required[other.id]=a.goal[other.id];
          if(error({assign:a.goal,order:a.order,view:{}},a)===0&&error(m,a)>0) return a;
        }
      }
      return null;
    }
  };
  env.task(fam);
})();
