// Design on the shared use-calendar/workspace template.
env.widget({
  task: 'use-calendar',
  site: 'design-use-calendar-timezone-02',
  name: 'design',
  split: 'train',
  scenarios: ['timezone'],
  template: 'use-calendar/workspace',
  design: {
    brand: 'ZenTeam',
    colors: ['#9cc5ff','#a7d3bd','#f1d989','#c299eb'],
    zoneAxis: 132,
    minuteHeight: 1,
    narrowAt: 400,
    sidebarAt: 10000,
    parts: {
      toolbar: (base,S) => st => {
        const {u,root}=st;
        const title=u.el('div','zen-window-title',root);
        u.el('span','',title,'Team Calendar');
        const note=document.querySelector('.ref-task > .ref-instruction');
        if(note) { title.appendChild(note);title.classList.add('zen-title-with-note'); }
        const tools=document.querySelector('.ref-task > .ref-tools');
        if(tools&&tools.children.length) title.appendChild(tools);
        if(!document.querySelector('.ref-task > .ref-spacer')) u.el('div','ref-spacer',document.querySelector('.ref-task'));
        u.el('span','zen-window-tools',title,'⌄   ⤧');
        const controls=base(st);
        controls.top.querySelector('.ac-logo').remove();
        controls.top.querySelector('.ac-brand').remove();
        const nav=controls.top.querySelector('.ac-nav-pair');
        controls.top.prepend(nav);
        controls.top.querySelector('.ac-utility').classList.add('zen-toolbar-utilities');
        const oldView=controls.top.querySelector('.ac-tab');
        oldView.textContent='⋯'; oldView.title='View options';
        const tabs=u.el('div','zen-view-tabs');
        ['Day','Week','Month'].forEach(label=>{
          const b=u.el('button',label==='Week'?'selected':'',tabs,label);
          b.addEventListener('click',()=>S.P.openMenu(st,'view'));
        });
        oldView.before(tabs);
        return controls;
      },
      inspector: (base,S) => st => {
        const pane=base(st);
        if(pane) {
          pane.classList.add('zen-month-pane');
          const head=st.u.el('div','zen-month-heading',pane);
          st.u.el('strong','zen-month-caption',head);
          const nav=st.u.el('span','zen-month-nav',head);
          S.P.iconButton(st,nav,'chevron','Previous week',()=>S.P.browse(st,-1)).style.transform='rotate(180deg)';
          S.P.iconButton(st,nav,'chevron','Next week',()=>S.P.browse(st,1));
          st.u.el('div','zen-month-grid',pane);
          st.u.el('h3','zen-agenda-heading',pane);
          st.u.el('div','zen-agenda',pane);
        }
        return pane;
      },
      timeHeader: (base,S) => st => {
        const names=base(st),{u,s,refs}=st;
        const header=st.main.querySelector('.ac-head');
        const people=u.el('div','zen-attendee-head',st.main);
        header.before(people);
        const zone=u.el('div','zen-zone-head',people);
        const primary=u.el('div','',zone,'UTC');u.el('small','',primary,'+00:00');
        const secondary=u.el('div','',zone,'Local');
        u.el('small','',secondary,`UTC${s.offset<0?'−':'+'}${st.f.helpers.time(Math.abs(s.offset))}`);
        const members=u.el('div','zen-members',people);
        s.people.forEach((name,i)=>{
          const member=u.el('div','zen-member',members);
          const avatar=u.el('span','zen-avatar',member,S.P.initials(st,name));
          avatar.style.setProperty('--avatar-tone',S.D.colors[i%4]);
          const text=u.el('div','',member,name);
          u.el('small','',text,['Product','Engineering','Design','Marketing'][i%4]);
        });
        return names;
      },
      painted: (base,S) => (st,m) => {
        base(st,m);
        const {s,f,refs,u}=st;
        const day=m.selected&&m.events[m.selected]&&(m.selected!==s.target||m.created)?m.events[m.selected].day:s.date||11;
        st.period.textContent=f.helpers.dateLabel(s,day+(m.browse||0)*7);
        const pane=st.root.querySelector('.zen-month-pane');
        if(pane) {
          const month=S.P.shownMonth(st,m);
          pane.querySelector('.zen-month-caption').textContent=month.name+' 2027';
          const grid=pane.querySelector('.zen-month-grid');grid.replaceChildren();
          ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(w=>u.el('span','zen-weekday',grid,w));
          const first=(month.first+1)%7;
          for(let k=0;k<35;k++) {
            const date=k-first+1;
            const outside=date<1||date>month.days;
            const value=date<1?31+date:date>month.days?date-month.days:date;
            u.el('span',outside?'zen-outside':date===day?'zen-current':'',grid,String(value));
          }
          pane.querySelector('.zen-agenda-heading').textContent=f.helpers.dateLabel(s,day);
          const agenda=pane.querySelector('.zen-agenda');agenda.replaceChildren();
          const events=s.events.filter(e=>m.events[e.id].day===day&&(e.id!==s.target||m.created)).sort((a,b)=>m.events[a.id].start-m.events[b.id].start);
          if(m.created&&!events.some(e=>e.id===s.target)) events.push({id:s.target,title:s.title,tone:0});
          for(const e of events) {
            const value=m.events[e.id];
            const row=u.el('div','zen-agenda-event',agenda);
            row.style.setProperty('--tone',S.D.colors[e.tone%4]);
            u.el('i','',row);
            const info=u.el('div','',row);u.el('b','',info,e.title);
            u.el('span','',info,`${f.helpers.time(value.start)} – ${f.helpers.time(value.start+value.duration)}`);
          }
        }
        const stats=st.root.querySelector('.zen-stats');
        if(stats) {
          const existing=s.events.filter(e=>e.id!==s.target||m.created);
          if(m.created&&!existing.some(e=>e.id===s.target)) existing.push({id:s.target});
          const count=existing.filter(e=>m.events[e.id].day===day).length;
          stats.querySelector('[data-stat="events"]').textContent=count;
          const now=s.open+135;
          const busy=new Set(existing.filter(e=>{const v=m.events[e.id];return v.day===day&&v.start<=now&&v.start+v.duration>now;}).map(e=>e.owner||0)).size;
          stats.querySelector('[data-stat="meeting"]').textContent=busy;
          stats.querySelector('[data-stat="available"]').textContent=Math.max(0,s.people.length-busy);
        }
        const upcoming=document.querySelector('.zen-upcoming-events');
        if(upcoming) {
          upcoming.replaceChildren();
          s.events.slice(0,4).forEach((e,i)=>{
            const row=u.el('div','zen-upcoming-row',upcoming);
            u.el('span','',row,String(i+1));const text=u.el('div','',row,e.title);
            const value=m.events[e.id];u.el('small','',text,`${f.helpers.dateLabel(s,value.day)}, ${f.helpers.time(value.start)}`);
          });
        }
      },
      status: (base,S) => st => {
        base(st);
        const stats=st.u.el('div','zen-stats',st.root);
        [['guests',st.s.people.length,'Team members','members'],['calendar',0,'Events on this day','events'],['guests','—','In meetings now','meeting'],['clock','—','Available now','available']].forEach(([icon,value,label,key])=>{
          const row=st.u.el('div','zen-stat',stats);
          const glyph=S.P.icon(st,row,icon);
          if(key==='members') glyph.firstChild.setAttribute('d','M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8M4 22v-2a8 8 0 0 1 16 0v2M8 20h8');
          if(key==='available') glyph.firstChild.setAttribute('d','M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20');
          const text=st.u.el('div','',row);
          const n=st.u.el('strong','',text,String(value));n.dataset.stat=key;
          st.u.el('span','',text,label);
        });
      },
    },
  },
});
