// Flight search adds comparison ledgers, sort controls and a selected-trip inspector.
(function () {
  'use strict';
  const flightTime = (minutes) => {
    const n = ((minutes % 1440) + 1440) % 1440;
    return `${Math.floor(n / 60) % 12 || 12}:${String(n % 60).padStart(2, '0')} ${n < 720 ? 'AM' : 'PM'}`;
  };
  function paintAirLogo(el, name) {
    const n = name.toLowerCase();
    const marks = {
      frontier: '<path fill="#087449" d="M10 5h34l-5 12H8zM8 20h29l-5 11H5zM5 34h20l-5 9H2z"/><path stroke="#549585" d="M9 18h27M6 32h20"/>',
      delta: '<path fill="#b50830" d="M24 3L45 43 24 30 3 43z"/><path fill="#fff" d="M24 24L45 43 24 35 3 43z"/><path fill="#820426" d="M24 3v27L45 43z"/>',
      american: '<path fill="#258ac0" d="M3 2h10c4 0 9 9 16 21H17z"/><path fill="#b20b22" d="M22 25h10l15 21H32c-4 0-7-5-10-11z"/><path fill="#b9c4c8" d="M17 21c10-5 18-2 23 3l-14 2 5 9-9-1z"/>',
      southwest: '<path fill="#dba632" stroke="#aaa" d="M24 9C9-5-9 16 6 30l18 16 18-17C56 15 39-4 24 9z"/><path fill="#c1172b" d="M24 11C10-1-5 15 8 28l16 15 16-16C52 15 38-1 24 11z"/><path fill="#183681" d="M6 24l18 19 10-10L8 15z"/><path stroke="#fff" stroke-width="2" d="M8 16l26 17"/>',
      united: '<rect x="3" y="2" width="43" height="44" fill="#07379b"/><circle cx="8" cy="40" r="34" fill="none" stroke="#fff" stroke-width="1.7"/><path fill="none" stroke="#fff" stroke-width="1.3" d="M7 8c29 5 35 19 24 36M5 13c25 4 31 17 20 31M4 19c20 3 25 14 14 25M4 26c17 1 19 8 8 18M7 7c5 15 16 29 27 32M3 11c7 15 16 25 34 23M3 18c8 12 17 18 36 9M3 26c10 9 21 9 34-2M10 6c1 17 7 30 17 38M17 7c1 13 6 28 13 36"/>',
    };
    const kind = ['frontier', 'delta', 'american', 'southwest', 'united'].find((k) => n.includes(k));
    if (kind) {
      el.innerHTML = `<svg viewBox="0 0 48 48" aria-hidden="true">${marks[kind]}</svg>`;
      return;
    }
    const hash = [...name].reduce((h, ch) => h + ch.charCodeAt(0), 0);
    el.textContent = name.slice(0, 1);
    el.style.setProperty('--air-color', ['#118563', '#ba1635', '#238fc1', '#214cba'][hash % 4]);
  }
  env.widget({
    task: 'use-shop', site: 'design-use-shop-flight-08', name: 'design', split: 'train', scenarios: ['flight'],
    traits: { sort: true }, template: 'use-shop/store',
    design: {
      fieldLabels: { from: 'From', to: 'To', date: 'Depart' }, searchLabel: 'Search Flights', dateFormat: 'us',
      parts: {
        flightStatics: () => () => {},
        flightEmpty: (base, S) => (V) => {
          const { util, form } = V;
          const heads = util.el('div', 'fl-colh');
          for (const x of ['', 'Airline', 'Departure', 'Arrival', 'Duration', 'Stops', 'Price', '']) util.el('span', '', heads, x);
          V.x.emptyBody = util.el('div', 'fl-fempty');
          V.x.emptySortHost = util.el('section', 'fl-comparison');
          V.x.emptySortHost.append(heads, V.x.emptyBody);
          V.x.emptyDetails = util.el('section', 'fl-details empty');
          util.el('div', 'fl-detail-title', V.x.emptyDetails, 'Flight details');
          util.el('div', 'fl-detail-empty', V.x.emptyDetails, 'Search flights to compare fares.');
          form.append(V.x.emptySortHost, V.x.emptyDetails);
        },
        flightForm: (base, S) => (V) => {
          base(V);
          const { util, fam, ctx, form } = V;
          const pills = V.card.querySelector('.fl-pills');
          pills.children[1].textContent = 'Round-trip';
          pills.children[2].textContent = 'Multi-city';
          const sort = util.el('div', 'fl-sort');
          for (const [label, val] of [['Sort by:', 'Price (Low to High)'], ['Stops:', 'Any'], ['Airline:', 'Any']]) {
            util.el('span', '', sort, label);
            const trigger = util.el('div', 'fl-dd', sort, val);
            if (label === 'Sort by:') {
              trigger.dataset.role = 'sort';
              const pop = util.el('div', 'fl-sort-pop', form);
              const opts = fam.FLIGHT_SORTS.map(([key, title]) => [key, util.el('div', 'fl-sort-option', pop, title)]);
              const position = () => {
                const t = trigger.getBoundingClientRect(), h = form.getBoundingClientRect();
                pop.style.left = t.left - h.left + 'px'; pop.style.top = t.bottom - h.top + 3 + 'px';
              };
              trigger.addEventListener('pointerdown', position); trigger.addEventListener('click', position); trigger.addEventListener('focus', position);
              const dropdown = env.ui.dropdown(trigger, pop, { label: 'sort', value: ctx.model.sort, options: opts,
                onOpenChange(open) { if (open) position(); },
                onChange(value) { if (value !== ctx.model.sort) V.step({ click: { sortBy: value } }); },
              });
              V.x.sortControls = [{ trigger, dropdown }];
            }
          }
          form.insertBefore(sort, V.x.emptySortHost);
          V.x.emptySortHost.insertBefore(sort, V.x.emptySortHost.firstChild);
        },
        flightSummary: (base, S) => (V) => {
          const { ctx, util, body, step, fam } = V;
          V.res = util.el('div', 'fl-res', body);
          V.sum = util.el('div', 'fl-sum fl-card', V.res);
          const pills = V.card.querySelector('.fl-pills').cloneNode(true);
          V.sum.append(pills);
          V.x.summaryFields = {};
          const row = util.el('div', 'fl-row', V.sum);
          for (const [key, label] of [['from','From'], ['to','To'], ['date','Depart']]) {
            const field = util.el('div', 'fl-field' + (key === 'date' ? ' date' : ''), row);
            util.el('div', 'fl-lab', field, label);
            const ctl = util.el('div', 'fl-ctl fl-readonly', field);
            V.x.summaryFields[key] = util.el('span', 'fl-input', ctl);
            if (key === 'date') util.el('i', 'fl-summary-calendar', ctl).innerHTML = S.H.ICON.cal;
          }
          V.back = S.H.btn(util, 'as-btn fl-back fl-go primary', row, 'Modify search', 'back');
          V.back.addEventListener('click', () => step({ click: { back: true } }));
          V.route = util.el('span', 'fl-route', V.sum); V.route.hidden = true;
          V.sdate = util.el('span', 'fl-sdate', V.sum); V.sdate.hidden = true;
          V.cancelBook = S.H.btn(util, 'as-btn sm fl-cancel', pills, 'Cancel booking', 'cancel-booking');
          V.cancelBook.addEventListener('click', () => { if (ctx.model.booked) step({ click: { cancelBook: true } }); });
          V.x.sortControls = V.x.sortControls || [];
          const sort = util.el('div', 'fl-sort', V.res);
          for (const [label, val] of [['Sort by:', 'Price (Low to High)'], ['Stops:', 'Any'], ['Airline:', 'Any']]) {
            util.el('span', '', sort, label);
            const trigger = util.el('div', 'fl-dd', sort, val);
            if (label === 'Sort by:') {
              trigger.dataset.role = 'sort';
              const pop = util.el('div', 'fl-sort-pop', V.res);
              const options = fam.FLIGHT_SORTS.map(([key, title]) => [key, util.el('div', 'fl-sort-option', pop, title)]);
              const position = () => { const t=trigger.getBoundingClientRect(), h=V.res.getBoundingClientRect(); pop.style.left=t.left-h.left+'px'; pop.style.top=t.bottom-h.top+3+'px'; };
              trigger.addEventListener('pointerdown', position); trigger.addEventListener('click', position); trigger.addEventListener('focus', position);
              const dropdown = env.ui.dropdown(trigger,pop,{label:'sort',value:ctx.model.sort,options,
                onOpenChange(open){if(open)position();}, onChange(value){if(value!==ctx.model.sort)step({click:{sortBy:value}});}});
              V.x.sortControls.push({trigger,dropdown});
            }
          }
          V.x.resultSort = sort;
        },
        flightColumns: () => (V) => {
          const { util, res } = V; const h=util.el('div','fl-colh',res);
          for(const x of ['','Airline','Departure','Arrival','Duration','Stops','Price','']) util.el('span','',h,x);
        },
        flightTable: (base, S) => (V) => {
          base(V);
          const { util } = V;
          V.x.comparison = util.el('section','fl-comparison');
          V.res.insertBefore(V.x.comparison, V.count);
          V.x.comparison.append(V.x.resultSort, V.count, V.res.querySelector('.fl-colh'), V.pane);
          V.x.details = util.el('section','fl-details',V.res);
          util.el('div','fl-detail-title',V.x.details,'Flight details');
          V.x.detailBody = util.el('div','fl-detail-body',V.x.details);
          const rules=util.el('section','fl-rules-pop',V.res); rules.hidden=true; V.x.rules=rules;
          util.el('b','',rules,'Fare rules');
          util.el('p','',rules,'Fares include taxes and carrier fees. Baggage allowance varies by airline. Free cancellation within 24 hours.');
          const close=S.H.btn(util,'as-btn',rules,'Close'); close.addEventListener('click',()=>{rules.hidden=true;});
          V.x.sideBook=null;
        },
        resultsSummary: (base,S) => (V,s) => {
          V.route.textContent = `${V.fam.airport(s.from).city} (${s.from}) → ${V.fam.airport(s.to).city} (${s.to})`;
          V.sdate.textContent = `${V.fam.fmtDate(s.date,'long')} · 1 adult · Economy`;
          V.x.summaryFields.from.textContent=V.fam.airport(s.from).label;
          V.x.summaryFields.to.textContent=V.fam.airport(s.to).label;
          V.x.summaryFields.date.textContent=V.fam.fmtDate(s.date,'us');
        },
        flightPitch: (base,S) => (V) => {
          const {ctx,spec,rng,pane,gap}=V;
          V.pitch=S.H.pitchFor(pane,V.x.comparison,spec.rows,gap,24,rng.int(84,100),-18);
          pane.style.height=spec.rows*V.pitch-gap+2+'px'; S.H.mirrorPitch(ctx,V.pitch);
        },
        flightRow: (base,S) => (V,i,fl,flights,s) => {
          const {ctx,util,fam,fmt,step,bookEls,rowEls}=V;
          const r=util.el('div','fl-frow'); r.dataset.role='flight';
          util.el('i','fl-radio',r);
          const air=util.el('div','fl-air',r), logo=util.el('i','fl-air-logo',air); paintAirLogo(logo,fl.airline);
          util.el('b','',air,fl.airline); util.el('span','',air,fl.no);
          const dep=util.el('div','fl-col',r); util.el('b','',dep,flightTime(fl.dep)); util.el('span','',dep,s.from);
          const arr=util.el('div','fl-col',r); util.el('b','',arr,flightTime(fl.dep+fl.dur)); util.el('span','',arr,s.to);
          if(fl.dep+fl.dur>=1440) util.el('sup','',arr.firstChild,'+1');
          util.el('div','fl-col fl-dur',r,fam.fmtDur(fl.dur)); util.el('div','fl-col fl-stp',r,String(fl.stops));
          util.el('div','fl-fp',r,fmt(fl.price));
          const b=S.H.btn(util,'as-btn primary fl-book',r,fmt(fl.price),'book');
          b.title='Book this flight for '+fmt(fl.price); b.setAttribute('aria-label','Book '+fl.airline+' for '+fmt(fl.price));
          b.addEventListener('click',()=>{if(!ctx.model.booked&&!(ctx.model.loading>0))step({click:{book:i}});});
          bookEls[i]=b; rowEls[i]=r; r.addEventListener('click',()=>{V.x.selected=i; V.paint(ctx.model);}); return r;
        },
        flightResults: (base,S) => (V,m) => {
          const {ctx,spec,fam,pane,gap,bookEls,rowEls}=V,s=m.searched,flights=fam.flightsFor(spec,s);
          S.P.resultsSummary(V,s); if(!V.pitch) S.P.flightPitch(V);
          for(const k of Object.keys(bookEls))delete bookEls[k]; for(const k of Object.keys(rowEls))delete rowEls[k];
          V.lbx=S.H.listPane(ctx,pane,{keys:fam.flightOrder(spec,s,m.sort),rows:spec.rows,pitch:V.pitch,gap,scroll:m.scroll,label:'flights',build(i){return S.P.flightRow(V,i,flights[i],flights,s);}});
          V.x.first=fam.flightOrder(spec,s,m.sort)[0]; V.x.selected=m.booked?m.booked.index:V.x.first;
        },
        flightPaint: (base,S) => (V,m) => {
          if (m.screen === 'results' && V.x.lastSort !== undefined && V.x.lastSort !== m.sort) V.builtKey = null;
          V.x.lastSort = m.sort;
          base(V,m);
          for(const c of V.x.sortControls||[]) { c.dropdown.set({value:m.sort}); c.trigger.textContent=(V.fam.FLIGHT_SORTS.find(([k])=>k===m.sort)||V.fam.FLIGHT_SORTS[0])[1]; }
          if(m.screen==='results'&&m.searched){
            const flights=V.fam.flightsFor(V.spec,m.searched), chosen=flights[m.booked?m.booked.index:(V.x.selected??V.x.first)];
            V.x.detailBody.replaceChildren();
            if(chosen){
              const airline=V.util.el('div','fl-detail-air',V.x.detailBody); paintAirLogo(V.util.el('i','fl-air-logo',airline),chosen.airline);
              const text=V.util.el('div','',airline); V.util.el('div','',text,chosen.airline); V.util.el('small','',text,chosen.no);
              V.util.el('small','',text,chosen.stops?`${chosen.stops} stop${chosen.stops>1?'s':''}`:'Nonstop');
              const start=V.util.el('div','fl-detail-time',V.x.detailBody,flightTime(chosen.dep)); V.util.el('small','',start,m.searched.from);
              const line=V.util.el('div','fl-detail-line',V.x.detailBody,V.fam.fmtDur(chosen.dur)); V.util.el('i','',line); V.util.el('small','',line,chosen.stops?`${chosen.stops} stop${chosen.stops>1?'s':''}`:'Nonstop');
              const end=V.util.el('div','fl-detail-time',V.x.detailBody,flightTime(chosen.dep+chosen.dur)); V.util.el('small','',end,m.searched.to);
              const price=V.util.el('div','fl-detail-price',V.x.detailBody,V.fmt(chosen.price));
              const rules=S.H.btn(V.util,'fl-rules-link',price,'Fare rules'); rules.addEventListener('click',()=>{V.x.rules.hidden=false;});
            }
            for(const [i,row] of Object.entries(V.rowEls))row.classList.toggle('preview',!m.booked&&+i===(V.x.selected??V.x.first));
          }
        },
        flightLocate: (base,S) => (V,t) => {
          if(t.sort)return V.x.sortControls[V.ctx.model.screen==='results'?1:0].dropdown.locateTrigger();
          if(t.sortBy)return V.x.sortControls[V.ctx.model.screen==='results'?1:0].dropdown.locateOption(t.sortBy);
          return base(V,t);
        },
      },
    },
  });
})();
