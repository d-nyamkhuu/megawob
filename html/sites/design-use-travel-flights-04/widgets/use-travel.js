env.widget({
  task: 'use-travel',
  site: 'design-use-travel-flights-04',
  name: 'design',
  split: 'train',
  scenarios: ['flights'],
  template: 'use-travel/portal',
  design: {
    brand: 'Meridian Travel', appLabel: 'Meridian Travel flights',
    fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '18px',
    inset: '0px', radius: '0px', railWidth: '23%', workspaceRailWidth: '0px',
    accent: '#181818', panel: '#f3f1eb', foreground: '#111111', muted: '#45443f', line: '#aaa89f',
    parts: {
      frame: (base, S) => (ctx) => {
        const {P}=S;
        S.app=P.app(ctx); P.topbar(S.app); P.route(S.app);
        S.progress=P.el('div','at-progress',S.app);
        S.content=P.el('div','at-content',S.app); S.footer=P.el('footer','at-footer',S.app);
      },
      app: (base, S) => (ctx) => {
        const app=S.P.el('section','at-app lisawindow',S.ctx.stage);
        app.setAttribute('aria-label',S.D.appLabel); return app;
      },
      topbar: (base,S) => (app) => {
        const {P}=S;
        const top=P.el('header','at-top lisa-brand',app);
        const globe=P.el('div','lisa-globe',top);
        globe.innerHTML='<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="43"/><ellipse cx="50" cy="50" rx="20" ry="43"/><path d="M8 50h84M17 29h66M17 71h66M50 7v86"/></svg>';
        const mark=P.el('div','lisa-wordmark',top);P.el('strong','',mark,'Meridian Travel');P.el('span','',mark,'P L A N　 E X P L O R E　 T R A V E L');
        const art=P.el('div','lisa-alps',top);
        art.innerHTML='<svg viewBox="0 0 620 115" preserveAspectRatio="none" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 97 75 66l37 14 68-66 53 70 42-44 32 46 41-61 38 55 28-38 48 46 35-22 53 31 64-18"/><path d="m116 80 64-66 28 40-27-14-26 22-18-5-22 24M270 86l37-46 15 22 24-12 33 39M340 94l40-57 24 20 22-26 27 59M432 94l44-38 33 24 33-18 33 31"/><path d="M28 96h580M394 94v-27l12-8 12 8v27m18 0V50l13-9 13 9v44m22 0V61l15-12 14 12v33m18 0V37h55v57m-45-45h8m10 0h8m-26 15h8m10 0h8m-26 14h8m10 0h8M5 104h604"/><path d="m0 92 33-10 24 10m518-4 28-10 17 13"/></g></svg>';
        // Reserve space for complete result rows when a long instruction reduces the stage.
        const brandHeight=Math.max(56,Math.min(136,S.ctx.size.height-440));
        if(brandHeight<136){
          top.style.height=`${brandHeight}px`;top.style.padding='4px 20px';
          globe.style.width=globe.style.height=`${Math.min(76,brandHeight-10)}px`;
          mark.firstElementChild.style.fontSize=`${Math.min(42,brandHeight*.5)}px`;
          mark.lastElementChild.style.fontSize=`${Math.min(17,brandHeight*.19)}px`;
          art.style.height=`${Math.max(40,brandHeight-10)}px`;
        }
      },
      route: (base,S) => (app) => {
        const {P}=S, nav=P.el('nav','lisa-tabs',app);nav.setAttribute('aria-label','Travel sections');
        for(const [name,active] of [['Flights',true],['Hotels',false],['My Itinerary',false],['Check In',false],['Manage Booking',false],['',false]]){
          const b=P.el('button',active?'active':'',nav,name);b.type='button';
          if(name)b.addEventListener('click',()=>S.P.panel(name));
        }
      },
      progress: (base,S) => () => {},
      worknav: (base,S) => () => {},
      resultFilters: (base,S) => (rail,_model) => {
        const {P,spec:s}=S, m=S.model;
        P.el('h3','lisa-filter-title',rail,'Search Flights');
        const field=(label,value)=>{const row=P.el('div','lisa-route-field',rail);P.el('span','',row,label);const box=P.el('div','lisa-route-value',row,value);const more=P.el('button','lisa-ellipsis',row,'…');more.type='button';};
        const [year,month,day]=s.calendar.base.split('-');
        const monthName=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][Number(month)-1];
        field('From',`${s.origin.city} (${s.origin.iata})`);field('To',`${s.dest.city} (${s.dest.iata})`);field('Departure Date',`${monthName} ${Number(day)}, ${year}`);
        P.el('h3','lisa-filter-title lisa-filter-divider',rail,'Filters');
        P.checkbox(rail,'Nonstop flights only','nonstop',!m.filters.nonstop,m.filters.nonstop);
        P.dropdown(rail,'Airline Alliance','alliance',[['','All alliances'],...env.taskDef.helpers.ALLIANCES.map(a=>[a,a])],m.filters.alliance);
        P.dropdown(rail,'Departure Time','before',[...new Set([1440,660,780,900,s.goal.before])].sort((a,b)=>a-b).map(a=>[a,a===1440?'Any time':env.taskDef.helpers.time(a)]),m.filters.before);
        P.dropdown(rail,'Maximum Price (USD)','max',[...new Set([s.maxPrice,250,350,450,s.goal.max])].sort((a,b)=>a-b).map(a=>[a,env.taskDef.helpers.money(a)]),m.filters.max);
      },
      resultCard: (base,S) => (p,x,m) => {
        const {P}=S, row=P.register({select:x.id},P.el('div',`lisa-flight-row${m.selected===x.id?' chosen':''}`,p),true);
        row.setAttribute('role','button');row.setAttribute('tabindex','0');row.setAttribute('aria-label',`${x.airline} ${x.no}, ${env.taskDef.helpers.time(x.dep)}, ${x.stops?'one stop':'Nonstop'}, ${env.taskDef.helpers.money(x.price)}`);
        row.addEventListener('click',()=>P.act({select:x.id}));row.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();P.act({select:x.id});}});
        const logo=P.el('i','lisa-airline-mark',row,'◢');
        P.el('span','',row,x.airline);P.el('span','',row,x.no);P.el('span','',row,env.taskDef.helpers.time(x.dep));
        P.el('span','',row,env.taskDef.helpers.time((x.dep+x.duration)%1440));P.el('span','',row,x.stops?'1 stop':'Nonstop');P.el('span','',row,env.taskDef.helpers.money(x.price));
      },
      results: (base,S) => (main,m) => {
        const {P,spec:s}=S, rows=env.taskDef.helpers.order(s,m);
        const heading=P.el('div','lisa-results-heading',main);
        P.el('strong','',heading,`Flights: ${s.origin.city} (${s.origin.iata}) → ${s.dest.city} (${s.dest.iata})`);
        P.el('strong','lisa-date',heading,env.taskDef.helpers.fmtDate(s.original.date));
        const tool=P.el('div','at-toolbar lisa-sortbar',main);P.el('span','',tool,'Sort by:');
        P.dropdown(tool,'Sort by','sort',[['recommended','Recommended'],['price','Lowest price'],['departure','Departure Time (Earliest First)']],m.sort);
        P.el('span','lisa-count',tool,`${rows.length} flights found`);
        const table=P.el('div','lisa-table',main),head=P.el('div','lisa-table-head',table);
        for(const label of ['Airline','Flight','Departs　▲','Arrives','Stops','Fare (USD)'])P.el('span','',head,label);
        const pane=P.newPane(table);
        // The template's visibility check requires a one-pixel inset at both edges.
        pane.style.padding='1px 0';
        for(const x of rows)P.resultCard(pane,x,m);
      },
      filterChips: (base,S) => () => {},
      footer: (base,S) => (m) => {
        if(m.selected || m.page==='review' || m.page==='manage')return base(m);
        const foot=S.footer;foot.replaceChildren();
        const bulb=S.P.el('span','lisa-bulb',foot);
        bulb.innerHTML='<svg viewBox="0 0 40 48" aria-hidden="true"><path d="M20 3a14 14 0 0 0-8 25c2 2 3 4 3 7h10c0-3 1-5 3-7A14 14 0 0 0 20 3Z" fill="none" stroke="currentColor" stroke-width="2.8"/><path d="M15 39h10m-9 5h8M20 8v8m-7-5 5 5m9-5-5 5" fill="none" stroke="currentColor" stroke-width="2.5"/></svg>';
        S.P.el('strong','lisa-help-title',foot,'Helpful Tips');
        const list=S.P.el('ul','lisa-tips',foot);
        for(const t of ['Use the filters to narrow results by nonstop service, alliance, departure time and maximum price.','Click a flight to view details, seat map and fare conditions.','Fares are one-way, in USD, and include taxes and fees.'])S.P.el('li','',list,t);
      }
    }
  },
});
