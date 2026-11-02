env.widget({
  task: 'use-travel',
  site: 'design-use-travel-seat-03',
  name: 'design',
  split: 'train',
  scenarios: ['seat'],
  template: 'use-travel/portal',
  design: {
    fontFamily: 'Arial, sans-serif', fontSize: '16px', inset: '8px', radius: '0px', accent: '#347bd4', panel: '#e4e4e4', foreground: '#111', muted: '#333', line: '#999', summaryRailWidth: '0px',
    parts: {
      passengerRail: (base, S) => (m) => {
        base(m);
        const rail=S.content.querySelector('.at-rail.seat-info');
        if (rail) {
          rail.classList.add('travel-passenger-details'); rail.replaceChildren();
          const P=S.P, s=S.spec, d=S.details;
          P.el('h3','',rail,'Passenger Details');
          const fields=P.el('div','travel-passenger-fields',rail), passenger=P.el('div','passenger-name',fields);
          P.el('b','',passenger,'Passenger');P.el('span','',passenger,s.passenger);
          P.el('span','travel-frequent-label',passenger,'Frequent flyer (optional)');P.el('span','travel-empty-field',passenger,'');
          const facts=P.el('div','travel-flight-fields',fields);
          for(const [label,value] of [['Flight',`${d.flight.airline} ${d.flight.no}`],['From',`${s.origin.city} (${s.origin.iata})`],['To',`${s.dest.city} (${s.dest.iata})`],['Date',m.date],['Departs','—'],['Arrives','—']]){
            const f=P.el('div','travel-fact-field',facts);P.el('b','',f,label);P.el('span','',f,value);
          }
        }
      },
      seats: (base, S) => (main, m) => {
        base(main,m);
        const head=main.querySelector('.at-seat-infohead'), pane=main.querySelector('.at-pane');
        if(!head||!pane)return;
        const legend=pane.querySelector('.at-legend');
        const oldNote=pane.querySelector('.at-calnote');
        const panel=document.createElement('section'); panel.className='travel-aircraft-panel';
        const title=document.createElement('h3'); title.textContent='Aircraft – Economy Class'; panel.append(title);
        const body=document.createElement('div'); body.className='travel-map-and-legend'; panel.append(body);
        const bottom=document.createElement('div'); bottom.className='travel-seat-bottom';
        if(legend){legend.querySelectorAll('span').forEach((x)=>{const i=x.querySelector('i');if(i&&x.textContent.trim()==='Occupied')i.classList.add('occ');});bottom.append(legend);}
        const selected=document.createElement('div'); selected.className='travel-selected-seat';
        const label=document.createElement('b');label.textContent='Selected Seat';
        const value=document.createElement('span');value.className='travel-selected-value';value.textContent=m.seat||'No seat selected';
        const aisle=document.createElement('span');aisle.className='travel-aisle';aisle.textContent='Aisle:  Between C and D';
        selected.append(label,value,aisle);bottom.append(selected);
        pane.before(panel); body.append(pane); body.append(bottom);
        if(oldNote)oldNote.remove(); head.remove();
        main.classList.add('travel-seat-main');
      }
    }
  },
});
