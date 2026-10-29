// Design on the shared use-calendar/workspace template.
env.widget({
  task: 'use-calendar',
  site: 'design-use-calendar-freeslot-01',
  name: 'design',
  split: 'train',
  scenarios: ['freeslot'],
  template: 'use-calendar/workspace',
  design: {
    colors: ['#1675ee', '#2fa527', '#ef8500', '#7040d8'],
    inset: 0,
    parts: {
      miniCalendar: (base, S) => (st, side) => {
        const {s,u}=st;
        const head=u.el('div','ol-month-head',side);
        u.el('span','',head,'‹');u.el('strong','',head,`${s.month} 2027`);u.el('span','',head,'›');
        const cal=u.el('div','ol-month',side);
        ['Mo','Tu','We','Th','Fr','Sa','Su'].forEach(w=>u.el('span','ol-weekday',cal,w));
        const first=s.firstWeekday;
        for(let k=0;k<Math.ceil((first+s.monthDays)/7)*7;k++) {
          const d=k-first+1;
          u.el('span',d===8?'ol-today':d<1||d>s.monthDays?'ol-out':'',cal,String(d<1?31+d:d>s.monthDays?d-s.monthDays:d));
        }
      },
      sidebar: (base,S) => st => {
        const {u,body}=st;
        const side=u.el('aside','ol-sidebar',body);
        S.P.miniCalendar(st,side);
        const calendars=u.el('div','ol-calendar-list',side);
        u.el('div','ol-calendar-heading',calendars,'▾  My Calendars');
        ['Calendar','Team Calendar','Other Calendars'].forEach((text,i)=>{
          const row=u.el('div',`ol-calendar-row ${i===0?'checked':''}`,calendars);
          u.el('span','ol-checkbox',row,i===0?'✓':'');u.el('span','ol-calendar-small',row,'▦');u.el('span','',row,text);
        });
        const bottom=u.el('div','ol-module-switch',side);
        ['✉','▦','♟','☑','•••'].forEach((x,i)=>{
          const item=u.el('span',i===1?'selected':'',bottom);
          const svg=u.svg('svg',{viewBox:'0 0 28 28','aria-hidden':'true'},item);
          const art=[
            'M2 5h24v18H2zM2 5l12 11L26 5M2 23l9-9m15 9-9-9',
            'M3 5h22v21H3zM3 11h22M8 2v7m12-7v7M8 11v15m6-15v15m6-15v15M3 16h22M3 21h22',
            'M10 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8M3 24v-6q7-8 14 0v6zM21 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6M20 15q6-1 6 6v3h-6',
            'M5 4h18v22H5zM10 2h8v5h-8zM8 16l4 4 8-10',
            'M5 14h.1M14 14h.1M23 14h.1'
          ];
          u.svg('path',{d:art[i],fill:i===2?'#6e849b':'#f7fbff',stroke:i===1?'#386db0':'#627d98','stroke-width':i===4?4:1.2,'stroke-linejoin':'round','stroke-linecap':'round'},svg);
        });
      },
      workspace: (base,S) => st => {
        const {u,body}=st;
        const main=u.el('div','ac-main ol-main',body);
        const summary=document.querySelector('.outlook-summary');
        if(summary) main.appendChild(summary);
        const context=u.el('div','ol-date-heading',main);
        const contextTitle=u.el('b','',context);
        return {main,context,contextTitle};
      },
      inspector: (base,S) => st => {
        const {u,body,s}=st;
        const inspector=u.el('aside','ol-right',body);
        u.el('div','ol-right-title',inspector,`Monday, 8 ${s.month} 2027`);
        S.P.miniCalendar(st,inspector);
        const agenda=document.querySelector('.outlook-agenda');
        if(agenda) inspector.appendChild(agenda);
        return inspector;
      },
      painted: (base,S) => (st,m) => {
        const {s,f}=st;
        st.contextTitle.textContent=`Monday, ${8+(m.browse||0)*7} ${s.month} 2027`;
      },
      rendered: (base,S) => st => {
        const {s,f,u}=st,summary=st.main.querySelector('.outlook-summary');
        const taskPanel=document.querySelector('.ref-panel');
        if(taskPanel){const right=st.root.querySelector('.ol-right');right.insertBefore(taskPanel,right.querySelector('.outlook-agenda'));}
        if(summary){
          const icon=summary.querySelector('.outlook-summary-icon');icon.replaceChildren();
          const svg=u.svg('svg',{viewBox:'0 0 44 44','aria-hidden':'true'},icon);
          u.svg('rect',{x:1,y:5,width:41,height:37,fill:'#fff',stroke:'#547ba4'},svg);
          u.svg('path',{d:'M2 6h39v7H2z',fill:'#78a6e3'},svg);
          u.svg('path',{d:'M8 2v8m26-8v8',stroke:'#3c6294','stroke-width':2},svg);
          u.svg('path',{d:'M2 21h39M2 28h39M2 35h39M11 14v27m10-27v27m10-27v27',stroke:'#a1b7d1','stroke-width':'.7'},svg);
          u.svg('rect',{x:23,y:23,width:6,height:5,fill:'#eca06b'},svg);
          summary.querySelector('.outlook-summary-title').textContent=s.title;
          summary.querySelector('.outlook-summary-subtitle').textContent=`Mon 8 ${s.month} 2027　 ${f.helpers.time(s.open)} – ${f.helpers.time(s.close)}　 (${s.duration} minutes)`;
          const guests=u.el('div','ol-summary-guests',summary.querySelector('.outlook-summary-main'));
          s.people.forEach((name,i)=>{const item=u.el('span','',guests);const dot=u.el('i','',item);dot.style.background=S.D.colors[i%4];u.el('span','',item,name);});
          const facts=summary.querySelector('.outlook-summary-facts');facts.replaceChildren();u.el('div','ol-scheduling',facts,'Scheduling');
          [['guests',`${s.people.length} attendees`],['clock',`${s.duration} minutes`],['location','Add location']].forEach(([icon,text])=>{const row=u.el('div','outlook-summary-fact',facts);S.P.icon(st,u.el('b','',row),icon);u.el('span','',row,text);});
        }
        const head=st.root.querySelector('.ol-sidebar .ol-month-head');
        if(head){head.firstChild.replaceWith(st.previous);head.lastChild.replaceWith(st.next);st.previous.style.transform='rotate(180deg)';st.previous.firstChild.style.transform='';}
        const ribbonToday=document.querySelector('.outlook-group:nth-child(2) .outlook-action:first-child');
        if(ribbonToday){st.today.className='outlook-action ol-today-control';st.today.replaceChildren(...ribbonToday.childNodes);ribbonToday.replaceWith(st.today);}
      },
    },
  },
});
