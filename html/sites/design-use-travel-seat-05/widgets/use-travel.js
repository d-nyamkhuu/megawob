env.widget({
  task: 'use-travel',
  site: 'design-use-travel-seat-05',
  name: 'design',
  split: 'train',
  scenarios: ['seat'],
  template: 'use-travel/portal',
  design: {
    parts: {
      topbar: (base, S) => (app) => {
        const P = S.P, head = P.el('header', 'at-top seat-titlebar', app);
        P.el('strong', 'seat-title', head, 'Manage My Trip');
        const tabs=P.el('div','seat-tabs',head);
        ['Flight Details','Seat Assignment','Baggage','Special Services'].forEach((label,i)=>P.el('span',`seat-tab${i===1?' active':''}`,tabs,label));
        P.el('div', 'seat-plane-art', head, '✈');
      },
      route: () => () => {},
      progress: () => () => {},
      passengerRail: (base, S) => (m) => {
        const P = S.P, spec = S.spec;
        const legend = P.el('aside', 'at-rail seat-legend', S.content);
        P.el('h3', '', legend, 'Seat map legend');
        for (const [cls, label] of [['available','Available Seat'],['occupied','Occupied Seat'],['exit','Exit Row (Not Available)']]) {
          const row=P.el('div','seat-legend-row',legend); P.el('i',`seat-swatch ${cls}`,row); P.el('span','',row,label);
        }
        P.el('div','seat-plane-preview',legend);
        const numberedRows=spec.seats.map(x=>x.row);
        P.el('div','seat-row-summary',legend,`Rows ${Math.min(...numberedRows)}–${Math.max(...numberedRows)} of 28`);
      },
      seats: (base, S) => (main, m) => {
        const P=S.P, spec=S.spec;
        const passengers=P.el('section','seat-passengers',main);
        P.el('h3','',passengers,'Passengers');
        const list=P.el('div','seat-passenger-list',passengers);
        const person=(initials,name,sub,seat)=>{const row=P.el('div','seat-person',list);P.el('span','seat-avatar',row,initials);const who=P.el('div','seat-person-name',row);P.el('strong','',who,name);if(sub)P.el('small','',who,sub);P.el('span','seat-person-seat',row,seat);P.el('span','seat-clear',row,'—');};
        const initials=spec.passenger.split(' ').map(x=>x[0]).slice(0,2).join('');
        person(initials,spec.passenger,'',m.seat?`Seat ${m.seat}`:'No seat selected');
        if(spec.goal.near) person('MS','Companion','Companion',spec.goal.near);
        const pane=P.newPane(main), map=P.el('div','seat-map-scene',pane);
        const flight=P.el('div','seat-flight-card',pane);
        P.el('b','',flight,`✈　${spec.origin.city} (${spec.origin.iata})　➜　${spec.dest.city} (${spec.dest.iata})`);
        P.el('span','',flight,`${spec.original.date ? spec.original.date : ''}　 ${S.details.flight.no}　 ${S.details.flight.airline}`);
        P.el('span','',flight,'Boeing 777-300ER');
        const detailRows=P.el('div','passenger-detail-rows',passengers);
        [['Name',spec.passenger],['Frequent Flyer',spec.frequentFlyer||'SW123456789'],['Ticket Number','016-2456789012']].forEach(([label,value])=>{const row=P.el('div','passenger-detail-row',detailRows);P.el('span','',row,label);P.el('strong','',row,value);});
        const seatDetail=P.el('div','seat-detail-box',passengers);
        P.el('h3','',seatDetail,'♿　Seat Details');
        P.el('strong','',seatDetail,m.seat?`Seat ${m.seat}`:'No seat selected');
        P.el('span','',seatDetail,m.seat?'Seat assignment ready':'Choose an available seat from the map.');
        const head=P.el('div','at-seat-head',map);for(const label of S.D.seatColumns)P.el('span','',head,label);
        const cabin=P.el('div','at-seat-wrap',map);
        for(const row of [...new Set(spec.seats.map(x=>x.row))]){
          const rowEl=P.el('div',`at-seat-row${spec.seats.find(x=>x.row===row).exit?' exit':''}`,cabin);
          rowEl.dataset.row=String(row);
          for(const [index,x] of spec.seats.filter(x=>x.row===row).entries()){
            if(index===3)P.el('span','seat-aisle',rowEl);
            P.seat(rowEl,x,row,m);
          }
          const aisle=rowEl.querySelector('.at-rownum'); if(aisle)aisle.remove();
        }
        const info=P.el('div','seat-selection-info',main), selected=spec.seats.find(x=>x.id===m.seat);
        P.el('strong','',info,`Selected seat (${spec.passenger})`);
        P.el('span','',info,m.seat||'No seat selected');
        P.el('span','seat-type-label',info,'Seat type');
        P.el('span','',info,selected?selected.kind:'—');
        P.el('span','seat-extra-label',info,'Extra legroom');
        P.el('span','',info,selected&&selected.exit?'Yes':'—');
      },
    },
  },
});
