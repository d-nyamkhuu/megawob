// Design on the shared use-calendar/workspace template.
env.widget({
  task: 'use-calendar',
  site: 'design-use-calendar-move-05',
  name: 'design',
  split: 'train',
  scenarios: ['move'],
  template: 'use-calendar/workspace',
  design: {
    inset: 0,
    colors: ['#2c9fff', '#5df36a', '#efbf37', '#b05bfc'],
    theme: {panel:'#101a23',bg:'#0d161e',line:'#263441',fg:'#f0f3f8',muted:'#b4c2d3',accent:'#63f36b'},
    parts: {
      begin: (base, S) => st => {
        base(st);
        S.D.minuteHeight = Math.max(.8, (st.ctx.size.height - 166) / (st.s.close-st.s.open));
      },
      toolbar: (base, S) => st => {
        const controls = base(st), {u} = st;
        const tabs = u.el('div','ref-view-tabs',controls.top);
        for (const title of ['Day','Week','Month']) {
          const tab = u.el('button',title==='Week'?'active':'',tabs,title);
          tab.addEventListener('click',()=>S.P.openMenu(st,'view'));
        }
        controls.top.insertBefore(tabs, controls.today);
        const note=document.querySelector('.ref-instruction');
        if(note) { controls.top.appendChild(note);st.root.classList.add('has-header-note'); }
        const tools=document.querySelector('.ref-task .ref-tools');
        if(tools) { controls.top.appendChild(tools);tools.classList.add('ref-calendar-tools'); }
        return controls;
      },
      sidebar: () => () => {},
      inspector: (base, S) => st => {
        const {u,root,s} = st;
        const panel = u.el('aside','ref-records',root);
        const instruction=document.querySelector('.ref-panel');
        if(instruction) panel.appendChild(instruction);
        const month = u.el('section','ref-month',panel);
        const head = u.el('div','ref-month-heading',month,`${s.month} 2027`);
        const arrows = u.el('span','ref-month-arrows',head);
        u.el('span','',arrows,'‹');u.el('span','',arrows,'›');
        const grid = u.el('div','ref-month-grid',month);
        for (const d of ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']) u.el('span','ref-month-weekday',grid,d);
        const first = (s.firstWeekday+1)%7;
        const previousDays={January:31,February:31,March:28,April:31,May:30,June:31,July:30,August:31,September:31,October:30,November:31,December:30}[s.month]||31;
        const weeks=Math.ceil((first+s.monthDays)/7);
        grid.style.gridTemplateRows=`22px repeat(${weeks},minmax(0,1fr))`;
        for (let i=0;i<weeks*7;i++) {
          const day = i-first+1, valid=day>0&&day<=s.monthDays;
          const cell=u.el('span',`ref-month-date${valid?'':' outside'}${day===8?' today':''}${day===9?' selected':''}`,grid,String(valid?day:day<1?previousDays+day:day-s.monthDays));
          if (valid && s.events.some(e=>st.ctx.model.events[e.id].day===day)) {
            const dots=u.el('i','ref-date-dots',cell);
            const palette=['#2c9fff','#5df36a','#b05bfc','#fa6370','#edc239','#5e6cff'];
            s.events.filter(e=>st.ctx.model.events[e.id].day===day).slice(0,2).forEach(e=>{const dot=u.el('i','',dots);dot.style.background=palette[env.util.hash32(e.id)%palette.length];});
          }
        }
        st.recordList=u.el('section','ref-event-index',panel);
        return panel;
      },
      timeHeader: (base, S) => st => {
        const names=base(st), {refs,u,s} = st;
        S.D.minuteHeight=Math.max(.8,(st.main.clientHeight-64)/(s.close-s.open));
        refs.axis=Math.round(st.ctx.size.width*.092);
        st.root.style.setProperty('--calendar-axis',`${refs.axis}px`);
        st.root.style.setProperty('--hour-height',`${60*S.D.minuteHeight}px`);
        const head=st.main.querySelector('.ac-head'), axis=head.querySelector('.ac-axis-head');
        axis.style.width=`${refs.axis}px`;axis.replaceChildren();
        for (const [title,zone] of [['PT','(UTC-8)'],['ET','(UTC-5)']]) {const z=u.el('span','ref-zone',axis,title);u.el('small','',z,zone);}
        for (const [i,title] of [[5,'Sat'],[6,'Sun']]) {
          const h=u.el('div','ac-day-head ref-weekend',head);
          u.el('span','ac-head-name',h,title);u.el('b','',h,String(8+i));
        }
        return names;
      },
      allDay: (base) => (st,names) => { base(st,names); st.main.querySelector('.ac-allday').hidden=true; },
      currentTime: (base) => (st,grid,axis) => { base(st,grid,axis);st.refs.now.style.display='none'; },
      timeGrid: (base, S) => (st,names) => {
        const result=base(st,names);
        result.grid.style.height=`${(st.s.close-st.s.open)*S.D.minuteHeight}px`;
        const weekends=st.u.el('div','ref-weekend-grid',result.grid);
        st.u.el('div','',weekends);st.u.el('div','',weekends);
        return result;
      },
      rulers: (base, S) => (st,grid,axis) => {
        const {u,s}=st, rulers=u.el('div','ac-rulers',grid);rulers.style.width=`${axis}px`;
        const time=t=>`${Math.floor(((t/60)%24+11)%12)+1}${t%60?':'+String(t%60).padStart(2,'0'):''} ${t%1440<720?'AM':'PM'}`;
        for(let t=s.open;t<=s.close;t+=60) {
          const label=u.el('div','ac-hour-label',rulers);label.style.top=`${Math.max(10,(t-s.open)*S.D.minuteHeight)}px`;
          u.el('span','',label,time(t));u.el('span','',label,time(t+180));
        }
      },
      timeEvent: (base, S) => (st,layer,e) => {
        const card=base(st,layer,e), {el}=card;
        const palette=['#2c9fff','#5df36a','#b05bfc','#fa6370','#edc239','#5e6cff'];
        el.style.setProperty('--tone',palette[env.util.hash32(e.id)%palette.length]);
        const time=el.querySelector('small');el.insertBefore(time,el.firstChild);
        const place=el.querySelector('.ac-event-location');place.replaceChildren();
        S.P.icon(st,place,'guests');st.u.el('span','',place,String(st.s.people.length));
        return card;
      },
      positionEvent: (base, S) => (st,el,e,id) => {
        base(st,el,e,id);
        el.style.height=`${Math.max(st.ctx.size.width>1300?42:26,e.duration*S.D.minuteHeight)}px`;
        el.toggleAttribute('data-roomy',e.duration*S.D.minuteHeight>=60);
        const clock=t=>`${(Math.floor(t/60)+11)%12+1}:${String(t%60).padStart(2,'0')}`;
        el.querySelector('small').textContent=`${clock(e.start)} – ${clock(e.start+e.duration)}`;
      },
      painted: (base, S) => (st,m) => {
        base(st,m);
        const {s,u,f,period,refs}=st, offset=m.browse||0;
        period.textContent=`${s.month} ${8+offset*7} – ${14+offset*7}, 2027`;
        refs.dayHeads.forEach((h,i)=>{h.querySelector('b').textContent=`${s.month.slice(0,3)} ${8+i+offset*7}`;});
        st.main.querySelectorAll('.ref-weekend b').forEach((label,i)=>{label.textContent=`${s.month.slice(0,3)} ${13+i+offset*7}`;});
        const panel=st.recordList;if(!panel) return;
        panel.replaceChildren();
        const selectedDay=m.events[m.selected||s.target].day;
        const date=day=>`${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][(day-8+7)%7]}, ${s.month.slice(0,3)} ${day}`;
        const clock=t=>{const h=Math.floor(t/60);return `${(h+11)%12+1}:${String(t%60).padStart(2,'0')}`;};
        const when=e=>`${clock(e.start)} – ${clock(e.start+e.duration)}`;
        u.el('h3','',panel,`Events · ${date(selectedDay)}, 2027`);
        const today=s.events.filter(e=>m.events[e.id].day===selectedDay).sort((a,b)=>m.events[a.id].start-m.events[b.id].start);
        for(const e of today) {
          const row=u.el('div','ref-index-row',panel),model=m.events[e.id];
          const dot=u.el('i','ref-event-dot',row);dot.style.background=refs.events.get(e.id).style.getPropertyValue('--tone');
          u.el('span','ref-index-time',row,when(model));
          const text=u.el('div','ref-index-description',row);
          u.el('div',e.id===s.target?'target':'',text,e.title);u.el('small','',text,`${s.people.length} attendees`);
          const guests=u.el('div','ref-index-guests',row);
          s.people.slice(0,2).forEach(name=>u.el('span','',guests,S.P.initials(st,name)));
          if(s.people.length>2)u.el('span','',guests,`+${s.people.length-2}`);
        }
        const others=u.el('section','ref-other-events',panel);u.el('h3','',others,'Other events this week');
        for(const e of s.events.filter(e=>m.events[e.id].day!==selectedDay).sort((a,b)=>m.events[a.id].day-m.events[b.id].day||m.events[a.id].start-m.events[b.id].start)) {
          const row=u.el('div','ref-other-row',others),model=m.events[e.id];
          u.el('span','',row,date(model.day));u.el('span','',row,when(model));
          const dot=u.el('i','ref-event-dot',row);dot.style.background=refs.events.get(e.id).style.getPropertyValue('--tone');
          u.el('span','ref-other-title',row,e.title);
        }
      },
    },
  },
});
