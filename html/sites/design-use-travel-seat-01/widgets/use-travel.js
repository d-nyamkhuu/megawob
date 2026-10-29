env.widget({
  task: 'use-travel',
  site: 'design-use-travel-seat-01',
  name: 'design',
  split: 'train',
  scenarios: ['seat'],
  template: 'use-travel/portal',
  design: {
    parts: {
      topbar: (base, S) => (app) => {
        const P = S.P, head = P.el('header', 'at-top seat-titlebar', app);
        P.el('strong', 'seat-title', head, 'Select seats');
        P.el('span', 'seat-flight', head, `${S.spec.origin.city} (${S.spec.origin.iata})  →  ${S.spec.dest.city} (${S.spec.dest.iata})`);
        P.el('span', 'seat-flight-meta', head, `${S.spec.original.date ? S.spec.original.date : ''}  ·  ${S.details.flight.airline} ${S.details.flight.no}  ·  Airbus A330`);
        P.el('div', 'seat-plane-art', head, '✈');
      },
      route: () => () => {},
      progress: () => () => {},
      passengerRail: (base, S) => (m) => {
        const P = S.P, spec = S.spec;
        const legend = P.el('aside', 'at-rail seat-legend', S.content);
        P.el('h3', '', legend, 'Seat map legend');
        for (const [cls, label] of [['available','Available seat'],['occupied','Occupied seat'],['unavailable','Unavailable seat'],['exit','Exit row (extra legroom)']]) {
          const row=P.el('div','seat-legend-row',legend); P.el('i',`seat-swatch ${cls}`,row); P.el('span','',row,label);
        }
        P.el('div','seat-facility',legend,'♟♟   Lavatory');
        P.el('div','seat-facility',legend,'☕   Galley');
        P.el('div','seat-facility',legend,'▣   Stairs');
        P.el('p','seat-legend-note',legend,'Exit rows cannot be selected.');
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
        const head=P.el('div','at-seat-head',map);for(const label of S.D.seatColumns)P.el('span','',head,label);
        const cabin=P.el('div','at-seat-wrap',map);
        for(const row of [...new Set(spec.seats.map(x=>x.row))]){
          const rowEl=P.el('div',`at-seat-row${spec.seats.find(x=>x.row===row).exit?' exit':''}`,cabin);
          rowEl.dataset.row=String(row);
          for(const x of spec.seats.filter(x=>x.row===row))P.seat(rowEl,x,row,m);
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
