// Design on the shared use-calendar/workspace template.
env.widget({
  task: 'use-calendar',
  site: 'design-use-calendar-move-04',
  name: 'design',
  split: 'train',
  scenarios: ['move'],
  template: 'use-calendar/workspace',
  design: {
    inset: 0,
    axis: 148,
    narrowAt: 0,
    colors: ['#498fff', '#43c46b', '#ff9c35', '#a178f2'],
    theme: {panel:'#f7f8fa', bg:'#f7f8fa', fg:'#151923', muted:'#656a73', line:'#d4d8df', accent:'#237ee5'},
    fontFamily: 'Arial, "Segoe UI", sans-serif',
    parts: {
      toolbar: (base, S) => st => {
        const controls = base(st);
        const {u} = st;
        controls.top.querySelectorAll('.ac-logo,.ac-brand,.ac-utility,.ac-profile').forEach(el=>el.remove());
        controls.top.prepend(controls.period);
        const nav = controls.top.querySelector('.ac-nav-pair');
        nav.insertBefore(controls.today, controls.next);
        const tab = controls.top.querySelector('.ac-tab');
        tab.textContent = 'Week';
        const views = u.el('div','carbon-view-tabs',controls.top);
        u.el('button','',views,'Day'); views.appendChild(tab); u.el('button','',views,'Month');
        return controls;
      },
      sidebar: () => () => {},
      inspector: (base) => st => {
        const el = base(st);
        el.querySelector('.ac-inspector-head').style.display='none';
        return el;
      },
      details: (base) => st => {
        const out=base(st), {u}=st;
        const summary=out.detailTitle.parentElement;
        summary.className='carbon-event-summary';
        const dot=u.el('i','carbon-detail-dot',summary); summary.prepend(dot);
        summary.appendChild(out.startLine.parentElement);
        const repeat=u.el('div','carbon-repeat',summary,'♻  Weekly team meeting');
        u.el('div','carbon-description',summary,'Quick team sync on progress and blockers.');
        out.room.parentElement.className='carbon-event-fields';
        out.code.className='carbon-booking-ref';
        const location=u.el('label','',out.room.parentElement,'Location');
        out.room.parentElement.insertBefore(location,out.room);
        u.el('label','',out.room.parentElement,'Calendar');
        u.el('div','carbon-value carbon-calendar-value',out.room.parentElement,'Team');
        u.el('label','',out.room.parentElement,'Alert');
        u.el('div','carbon-value carbon-alert-value',out.room.parentElement,'10 minutes before');
        return out;
      },
      paintDetails: (base, S) => (st,m) => {
        const result=base(st,m), {s,f}=st;
        const e=m.events[result.id];
        if(result.exists) {
          const day=['Monday','Tuesday','Wednesday','Thursday','Friday'][e.day-8]||'';
          st.startLine.textContent=day+', '+f.helpers.dateLabel(s,e.day)+', 2027';
          st.endLine.textContent=f.helpers.time(e.start)+' – '+f.helpers.time(e.start+e.duration)+' ('+e.duration+' minutes)';
          st.room.textContent=result.id===s.target?s.room:st.roomNames.get(result.id);
          st.room.className='carbon-value';
        }
        return result;
      },
      paintExtra: () => (st,id,exists) => {
        if(!st.refs.extra || st.carbonGuests===id) return;
        st.carbonGuests=id;
        const {u,s}=st, extra=st.refs.extra; extra.replaceChildren();
        u.el('div','carbon-attendees-title',extra,'Attendees ('+s.people.length+')');
        s.people.forEach((name,i)=>{
          const row=u.el('div','carbon-attendee',extra);
          u.el('i',i<s.people.length-1?'accepted':'tentative',row);
          u.el('span','',row,name);
          u.el('small','',row,i===0?'Organizer':i<s.people.length-1?'Accepted':'Tentative');
        });
      },
      timeHeader: (base) => st => {
        const names=base(st), header=st.main.querySelector('.ac-head');
        const axisHead=header.querySelector('.ac-axis-head'); axisHead.replaceChildren();
        st.u.el('span','',axisHead,'PST'); st.u.el('span','',axisHead,'EST');
        const month=['January','February','March','April','May','June','July','August','September','October','November','December'].indexOf(st.s.month)+1;
        ['Sat '+month+'/13','Sun '+month+'/14'].forEach(name=>st.u.el('div','carbon-weekend-head',header,name));
        return names;
      },
      allDay: () => () => {},
      timeGrid: (base) => (st,names) => {
        const result=base(st,names);
        const weekends=st.u.el('div','carbon-weekends',result.grid);
        for(let i=0;i<2;i++) st.u.el('div','ac-column',weekends);
        return result;
      },
      rulers: (base) => (st,grid,axis) => {
        base(st,grid,axis);
        const labels=grid.querySelectorAll('.ac-hour-label');
        labels.forEach((el,i)=>{
          const time=st.s.open+i*60;
          const fmt=t=>{const h=Math.floor(t/60)%24;return (h%12||12)+(h<12?' AM':' PM');};
          el.firstChild.textContent=fmt(time);
          st.u.el('span','',el,fmt(time+180));
        });
      },
      painted: () => (st,m) => {
        const offset=(m.browse||0)*7;
        st.period.textContent=st.s.month+' '+(8+offset)+'–'+(14+offset)+', 2027';
        st.refs.dayHeads.forEach((el,i)=>{
          el.classList.toggle('today',!offset&&i===4);
          el.querySelector('b').textContent=String(['January','February','March','April','May','June','July','August','September','October','November','December'].indexOf(st.s.month)+1)+'/'+(8+i+offset);
        });
        const month=['January','February','March','April','May','June','July','August','September','October','November','December'].indexOf(st.s.month)+1;
        st.main.querySelectorAll('.carbon-weekend-head').forEach((el,i)=>{el.textContent=['Sat','Sun'][i]+' '+month+'/'+(13+i+offset);});
      },
      rendered: () => st => {
        const {s}=st;
        const monthHead=document.querySelector('.carbon-side-month strong');
        if(monthHead) monthHead.textContent=s.month+' 2027';
        const monthIndex=['January','February','March','April','May','June','July','August','September','October','November','December'].indexOf(s.month);
        const previousDays=[31,28,31,30,31,30,31,31,30,31,30,31][(monthIndex+11)%12];
        const first=(s.firstWeekday+1)%7;
        const dates=document.querySelectorAll('.carbon-mini-calendar span:not(.carbon-mini-weekday)');
        dates.forEach((cell,i)=>{
          const d=i-first+1;
          cell.textContent=String(d<1?previousDays+d:d>s.monthDays?d-s.monthDays:d);
          cell.classList.toggle('carbon-mini-selected',d===12);
          cell.classList.toggle('carbon-mini-outside',d<1||d>s.monthDays);
        });
        const groups=document.querySelectorAll('.carbon-side-group');
        if(groups[1]) {
          const names=groups[1].querySelectorAll('.carbon-side-row');
          names.forEach((row,i)=>{
            row.style.display=i<s.people.length?'':'none';
            if(i<s.people.length) row.lastChild.textContent=s.people[i];
          });
        }
      },
    },
  },
});
