env.widget({
  task: 'use-travel',
  site: 'design-use-travel-flights-02',
  name: 'design',
  split: 'train',
  scenarios: ['flights'],
  template: 'use-travel/portal',
  design: {
    parts: {
      resultFilters: (base, S) => (rail, m) => {
        const P = S.P, s = S.spec, F = env.taskDef;
        const heading=P.el('h3','',rail,'');
        P.checkbox(rail,'Nonstop only','nonstop',!m.filters.nonstop,m.filters.nonstop);
        S.refs.set(F.helpers.key({filter:'nonstop',value:m.filters.nonstop}),S.refs.get(F.helpers.key({filter:'nonstop',value:!m.filters.nonstop})));
        P.dropdown(rail,'Airline alliance','alliance',[['','All alliances'],...F.helpers.ALLIANCES.map(a=>[a,a])],m.filters.alliance);
        P.dropdown(rail,'Depart before','before',[...new Set([1440,660,780,900,s.goal.before])].sort((a,b)=>a-b).map(a=>[a,a===1440?'Any time':F.helpers.time(a)]),m.filters.before);
        P.dropdown(rail,'Max price (USD)','max',[...new Set([s.maxPrice,250,350,450,s.goal.max])].sort((a,b)=>a-b).map(a=>[a,F.helpers.money(a)]),m.filters.max);
        heading.textContent='';
      },
      results: (base, S) => (main,m) => {
        const P=S.P,s=S.spec,F=env.taskDef;
        const rows=F.helpers.order(s,m);
        P.resultToolbar(main,m,rows);
        const pane=P.newPane(main);
        if(!rows.length){P.emptyResults(pane,m);return;}
        const table=P.el('div','flight-table',pane);
        const head=P.el('div','flight-head',table);
        for(const label of ['Airline','Flight','Departure','Arrival','Stops','Duration','Price (USD)']) P.el('span','',head,label);
        for(const x of rows){
          const row=P.el('div','flight-row',table);
          const airline=P.el('span','flight-carrier',row);P.el('i','flight-mark',airline,'≈');P.el('span','',airline,x.airline);
          P.el('span','',row,x.no);P.el('span','',row,F.helpers.time(x.dep));P.el('span','',row,`${F.helpers.time((x.dep+x.duration)%1440)}${x.dep+x.duration>=1440?' +1':''}`);
          P.el('span','',row,x.stops?'1 stop':'Nonstop');P.el('span','',row,`${Math.floor(x.duration/60)}h ${x.duration%60}m`);P.el('span','',row,F.helpers.money(x.price));
          const hit=P.button(row,'',{select:x.id},'flight-hit',true);hit.setAttribute('aria-label',`${x.airline} ${x.no}, ${F.helpers.time(x.dep)}, ${F.helpers.money(x.price)}`);
          P.cardBuilt(row,x,m);
        }
      },
      sidepanel: (base,S) => (m) => {
        const P=S.P,s=S.spec,d=S.details,F=env.taskDef,side=P.el('aside','at-sidepanel flight-inspector',S.content);
        const img=P.el('img','destination-photo',side);img.src='sites/design-use-travel-flights-02/assets/prague.jpg';img.alt='Prague skyline and Charles Bridge';
        P.el('div','destination-caption',side,`${s.origin.city} (${s.origin.iata})`);P.el('small','destination-country',side,'Czech Republic');
        const tabs=P.el('div','inspector-tabs',side);for(const t of ['Flight Details','Airport Info','Destination'])P.el('span',t==='Flight Details'?'active':'',tabs,t);
        const flight=s.flights.find(x=>x.id===m.selected)||d.flight;
        const facts=P.el('div','flight-facts',side);
        for(const [k,v,sub] of [['From',`${s.origin.city} (${s.origin.iata})`,s.origin.airport||'Airport'],['To',`${s.dest.city} (${s.dest.iata})`,s.dest.airport||'Airport'],['Date',F.helpers.fmtDate(s.original.date),''],['Passengers','1 Adult',''],['Cabin class','Economy','']]){
          const line=P.el('div','inspector-fact',facts);P.el('span','',line,k);const val=P.el('div','',line);P.el('strong','',val,v);if(sub)P.el('small','',val,sub);
        }
        P.el('div','inspector-airline',side,flight.airline);
        for(const [icon,label] of [['▣','Baggage policy'],['▤','Change & refund rules'],['●','In-flight amenities']]){const a=P.el('div','inspector-link',side);P.el('b','',a,icon);P.el('u','',a,label);}
      },
      route: (base,S) => (app) => {
        const P=S.P,s=S.spec,route=P.el('div','at-route',app),title=P.el('div','flight-route-title',route);
        P.el('h2','',title,'Search Flights');
        const fields=P.el('div','route-fields',route);
        for(const [label,value] of [['From',`${s.origin.city} (${s.origin.iata})`],['To',`${s.dest.city} (${s.dest.iata})`],['Date',env.taskDef.helpers.fmtDate(s.original.date)]]){
          const box=P.el('div','route-field',fields);P.el('label','',box,label);P.el('strong','',box,value);
        }
        P.el('span','route-swap',fields,'⇄');
      },
      paint: (base,S) => () => {
        base();
        if(S.spec.scenario==='flights'&&S.ctx.size.width>700) S.P.sidepanel(S.ctx.model);
      }
    }
  },
});
