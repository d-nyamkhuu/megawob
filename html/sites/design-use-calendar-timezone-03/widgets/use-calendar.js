// Design on the shared use-calendar/workspace template.
env.widget({
  task: 'use-calendar',
  site: 'design-use-calendar-timezone-03',
  name: 'design',
  split: 'train',
  scenarios: ['timezone'],
  template: 'use-calendar/workspace',
  design: {
    colors: ['#000', '#000', '#000', '#000'],
    theme: {panel:'#fff', line:'#000', accent:'#000', muted:'#000', fg:'#000', bg:'#fff'},
    fontFamily: 'Arial, Helvetica, sans-serif',
    zoneAxis: 90,
    minuteHeight: .85,
    narrowAt: 0,
    parts: {
      icon: (base) => (st,parent,name,cls='') => {
        const icon=base(st,parent,name,cls);
        if(name==='chevron') {
          const path=icon.querySelector('path');
          path.setAttribute('d','M8 5L17 12 8 19Z');
          path.setAttribute('fill','currentColor');
          path.setAttribute('stroke','none');
        }
        return icon;
      },
      toolbar: (base, S) => st => {
        const result = base(st), {u,root} = st;
        const title = u.el('div','mac-titlebar');
        const close=u.el('span','mac-window-box mac-window-close',title);
        const face=u.svg('svg',{viewBox:'0 0 24 24',width:23,height:23,'aria-hidden':'true'},close);
        u.svg('path',{d:'M5 6v5h4V6M15 6h4v5h-4M7 16q5 5 10 0',fill:'none',stroke:'#000','stroke-width':2},face);
        u.el('strong','mac-window-name',title,'Team Calendar');
        u.el('span','mac-window-box',title,'▾');
        root.insertBefore(title,result.top);
        const tabs=u.el('div','mac-tabs',result.top);
        for(const name of ['Day','Week','Month','Team','Rooms']) {
          const tab=u.el('span',name==='Week'?'mac-tab active':'mac-tab',tabs,name);
          tab.setAttribute('aria-hidden','true');
        }
        result.top.prepend(tabs);
        const tools=document.querySelector('.ref-task > .ref-tools');
        if(tools) result.top.appendChild(tools);
        const plus=S.P.iconButton(st,result.top,'plus','Create meeting',()=>S.P.commit(st,{...st.ctx.model,selected:st.s.target}));
        plus.classList.add('mac-tool');
        result.today.classList.add('mac-tool');
        result.today.replaceChildren();
        S.P.icon(st,result.today,'calendar');
        result.today.title='Today';
        result.today.setAttribute('aria-label','Today');
        result.top.appendChild(result.today);
        const list=S.P.iconButton(st,result.top,'menu','View options',()=>S.P.openMenu(st,'view'));
        list.classList.add('mac-tool');
        return result;
      },
      workspace: (base) => st => {
        const result=base(st), {u}=st;
        const datebar=u.el('div','mac-datebar',result.main);
        const note=document.querySelector('.ref-instruction');
        if(note) datebar.appendChild(note);
        const row=u.el('div','mac-date-line',datebar);
        const nav=u.el('div','mac-date-nav',row);
        nav.append(st.previous,st.next);
        row.appendChild(st.period);
        result.main.prepend(datebar);
        return result;
      },
      inspector: (base,S) => st => {
        const inspector=base(st), {u,s}=st;
        inspector.querySelector('.ac-inspector-head > span').textContent='Event Details';
        const month=u.el('section','mac-month');
        const heading=u.el('div','mac-month-heading',month);
        u.el('strong','',heading,`${s.month} 2027`);
        const nav=u.el('span','mac-month-nav',heading);
        S.P.iconButton(st,nav,'chevron','Previous month',()=>S.P.browse(st,-1)).firstChild.style.transform='rotate(180deg)';
        S.P.iconButton(st,nav,'chevron','Next month',()=>S.P.browse(st,1));
        const grid=u.el('div','mac-month-grid',month);
        for(const day of ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']) u.el('span','mac-weekday',grid,day);
        const first=(s.firstWeekday+1)%7;
        for(let i=0;i<Math.ceil((first+s.monthDays)/7)*7;i++) {
          const day=i-first+1;
          u.el('span',day===s.date?'mac-month-day selected':'mac-month-day',grid,day>0&&day<=s.monthDays?String(day):'');
        }
        inspector.prepend(month);
        const panel=document.querySelector('.ref-panel');
        if(panel) inspector.appendChild(panel);
        return inspector;
      },
      details: (base) => st => {
        const result=base(st), {u,s}=st;
        result.details.replaceChildren();
        const field=(label,node,extra='')=>{
          const row=u.el('div',`mac-field ${extra}`,result.details);
          u.el('label','',row,label);
          const box=u.el('div','mac-value',row);
          if(node) box.appendChild(node);
          return box;
        };
        field('Title:',result.detailTitle);
        st.macDate=u.el('span','');field('Date:',st.macDate,'mac-date-field');
        field('Start (Local):',result.startLine,'mac-short-field');
        field('Duration:',result.detailDuration,'mac-short-field');
        const people=field('Attendees:',null,'mac-attendees');
        u.el('span','mac-form-scrollbar',people);
        for(const name of s.people) {
          const guest=u.el('div','mac-attendee',people);
          u.el('span','mac-checkbox',guest,'✓');u.el('span','',guest,name);
        }
        field('Location:',result.room);
        const notes=field('Notes:',result.code,'mac-notes');
        u.el('span','mac-form-scrollbar',notes);
        result.endLine.hidden=true;
        return result;
      },
      paintDetails: (base) => (st,m) => {
        const result=base(st,m), {s,f}=st, event=m.events[result.id];
        st.detailTitle.textContent=result.exists?st.detailTitle.textContent:'';
        st.macDate.textContent=`${s.month} ${event.day}, 2027`;
        st.startLine.textContent=result.exists?f.helpers.time(event.start):'';
        st.detailDuration.textContent=result.exists?`${event.duration} min`:'';
        st.room.textContent=result.exists?(result.id===s.target?s.room:st.roomNames.get(result.id)):'';
        st.code.textContent='';
        return result;
      },
      timeHeader: (base,S) => st => {
        const names=base(st), header=st.main.querySelector('.ac-head');
        header.querySelector('.ac-axis-head').textContent='Local';
        st.u.el('div','mac-zone-head',header,`UTC${st.s.offset<0?'−':'+'}${st.f.helpers.time(Math.abs(st.s.offset))}`);
        return names;
      },
      rulers: (base,S) => (st,grid,axis) => {
        base(st,grid,axis);
        const secondary=st.u.el('div','mac-zone-ruler',grid);
        for(const label of grid.querySelectorAll('.ac-hour-label')) {
          const value=label.lastChild;
          const copy=st.u.el('div','mac-zone-label',secondary);
          copy.style.top=label.style.top;
          copy.appendChild(value);
        }
      },
      timeGrid: (base,S) => (st,names) => {
        const headings=Array.from(st.main.children).reduce((height,el)=>height+el.getBoundingClientRect().height,0);
        S.D.minuteHeight=Math.max(.65,(st.main.clientHeight-headings-1)/(st.s.close-st.s.open));
        const result=base(st,names);
        result.columns.style.right='90px';
        result.eventLayer.style.right='90px';
        return result;
      },
      adjacentEvents: (base) => (st,grid) => {
        base(st,grid);st.refs.adjacent.style.right='90px';
      },
      painted: (base) => (st,m) => {
        base(st,m);
        st.period.textContent=`${st.s.month} ${8+(m.browse||0)*7} – ${12+(m.browse||0)*7}, 2027`;
      },
    },
  },
});
