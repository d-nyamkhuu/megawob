// Design on the shared use-calendar/workspace template.
env.widget({
  task: 'use-calendar',
  site: 'design-use-calendar-freeslot-04',
  name: 'design',
  split: 'train',
  scenarios: ['freeslot'],
  template: 'use-calendar/workspace',
  design: {
    inset: 0,
    fontFamily: '"Times New Roman", Times, serif',
    parts: {
      toolbar: (base, S) => st => {
        const {u,root,s}=st;
        const top=u.el('div','ac-toolbar legacy-toolbar',root);
        const date=u.el('div','legacy-date-heading',top);
        u.el('strong','',date,`Monday,\n${s.month} ${s.date || 8},\n2027`);
        const zones=u.el('div','legacy-tool-group',top);
        u.el('span','',zones,'Time zone:');
        u.el('span','legacy-select',zones,'(GMT-8) Pacific Time (PST)');
        const show=u.el('div','legacy-tool-group',top);
        u.el('span','',show,'Show:');u.el('span','legacy-select legacy-show',show,'Both time zones');
        const views=u.el('div','legacy-tool-group legacy-views',top);
        u.el('span','',views,'View:');
        const today=u.el('button','legacy-active',views,'Day');today.title='Return to the shared dates';
        today.addEventListener('click',()=>S.P.browse(st,0));
        const previous=u.el('button','',views,'Week');previous.addEventListener('click',()=>S.P.browse(st,-1));
        const next=u.el('button','',views,'Month');next.addEventListener('click',()=>S.P.browse(st,1));
        const period=u.el('span','',top);period.hidden=true;
        return {top,today,previous,next,period};
      },
      sidebar: () => () => {},
      workspace: () => st => {
        const main=st.u.el('div','ac-main',st.body);
        const context=st.u.el('div','ac-context',main);context.hidden=true;
        const contextTitle=st.u.el('b','',context);
        return {main,context,contextTitle};
      },
      inspector: () => () => undefined,
      details: base => st => {const fields=base(st);fields.details.hidden=true;return fields;},
      timeHeader: () => st => {
        const {s,u,f,main,refs,ctx}=st;
        refs.axis=Math.max(145,Math.min(205,ctx.size.width*.125));
        st.root.style.setProperty('--lane-label',`${refs.axis}px`);
        refs.count=s.people.length;refs.dayHeads=[];
        const head=u.el('div','legacy-rulers',main);
        for(let z=0;z<2;z++) {
          const row=u.el('div','legacy-ruler',head);
          u.el('span','legacy-zone',row,z?'EST':'PST');
          const times=u.el('div','legacy-hours',row);
          for(let t=s.open+60;t<=s.close;t+=60) {
            const label=u.el('span','',times,f.helpers.time(t+z*180));
            label.style.left=`${100*(t-s.open)/(s.close-s.open)}%`;
          }
        }
        return s.people;
      },
      allDay: () => () => {},
      timeGrid: () => (st,names) => {
        const {s,u,main,refs}=st;
        const wrap=u.el('div','ac-scroll-wrap',main),pane=u.el('div','ac-pane',wrap),grid=u.el('div','ac-time-grid',pane);
        refs.pane=pane;refs.grid=grid;
        const labels=u.el('div','legacy-lane-labels',grid);
        names.forEach((name,i)=>{const row=u.el('div','legacy-person',labels);u.el('strong','',row,name);u.el('span','',row,i===2?'(EST)':'(PST)');});
        const columns=u.el('div','ac-columns legacy-lanes',grid);refs.columns=columns;
        names.forEach(()=>u.el('div','legacy-lane',columns));
        const count=(s.close-s.open)/30;
        for(let i=1;i<count;i++) {const line=u.el('div',i%2?'legacy-grid-line':'legacy-grid-line legacy-hour-line',columns);line.style.left=`${i/count*100}%`;}
        const eventLayer=u.el('div','ac-columns legacy-card-layer',grid);refs.eventLayer=eventLayer;
        refs.now=u.el('i','',grid);refs.now.hidden=true;
        return {wrap,pane,grid,columns,eventLayer};
      },
      adjacentEvents: () => (st,grid) => {st.refs.adjacent=st.u.el('div','legacy-adjacent',grid);},
      positionEvent: (base,S) => (st,el,e,id) => {
        if(!el||!e) return;
        const {s,refs,f}=st,owner=id===s.target?0:S.P.eventInfo(st,id).owner;
        el.style.left=`${100*(e.start-s.open)/(s.close-s.open)}%`;
        el.style.width=`${100*e.duration/(s.close-s.open)}%`;
        el.style.top=`calc(${100*owner/refs.count}% + 8px)`;
        el.style.height=`calc(${100/refs.count}% - 24px)`;
        el.querySelector('small').textContent=`${f.helpers.time(e.start)} - ${f.helpers.time(e.start+e.duration)}`;
        el.classList.toggle('legacy-one',/^1:1/.test(S.P.eventInfo(st,id).title));
      },
      minute: () => (st,grid,x) => {
        const r=st.refs.columns.getBoundingClientRect(),s=st.s;
        return Math.max(s.open,Math.min(s.close,s.open+Math.round((x-r.left)/r.width*(s.close-s.open)/15)*15));
      },
      creation: (base,S) => (st,grid,columns) => {
        const {ctx,s,u,f}=st;
        const draft=u.el('div','ac-draft',columns);let begin;
        env.ui.track(grid,{
          start(p,e) {
            if(ctx.model.browse||e.target.closest('.ac-event')) return false;
            const r=columns.getBoundingClientRect();if(p.x<r.left) return false;
            begin={day:s.date,start:S.P.minute(st,grid,p.x)};return true;
          },
          move(p) {
            const end=S.P.minute(st,grid,p.x);
            draft.style.display='block';draft.style.left=`${100*(Math.min(begin.start,end)-s.open)/(s.close-s.open)}%`;
            draft.style.width=`${100*Math.max(15,Math.abs(end-begin.start))/(s.close-s.open)}%`;
            draft.style.top='0';draft.style.height='100%';
          },
          end(p) {
            draft.style.display='none';const end=S.P.minute(st,grid,p.x),start=Math.min(begin.start,end),duration=Math.max(15,Math.abs(end-begin.start));
            S.P.commit(st,f.helpers.change(ctx.model,s.target,{day:begin.day,start,duration},s));
          }
        },'calendar-create');
      },
      attach: (base,S) => (st,el,id,isEdge=false) => {
        const {ctx,s,f,refs}=st;let original,grab;
        const delta=dx=>Math.round(dx/refs.columns.getBoundingClientRect().width*(s.close-s.open)/15)*15;
        env.ui.track(el,{
          start(p,e) {
            if(!isEdge&&e.target.closest('.ac-edge')) return false;
            e.stopPropagation();original={...ctx.model.events[id]};grab={x:p.x,y:p.y};
          },
          move(p) {
            const patch=isEdge?{duration:Math.max(15,original.duration+delta(p.x-grab.x))}:{day:s.date,start:original.start+delta(p.x-grab.x)};
            S.P.positionEvent(st,el.closest('.ac-event'),f.helpers.change(ctx.model,id,patch,s).events[id],id);
          },
          end(p) {
            const patch=isEdge?{duration:original.duration+delta(p.x-grab.x)}:{day:s.date,start:original.start+delta(p.x-grab.x)};
            if(Math.abs(p.dx)+Math.abs(p.dy)<3) S.P.commit(st,{...ctx.model,selected:id});
            else S.P.commit(st,f.helpers.change(ctx.model,id,patch,s));
          }
        },isEdge?'calendar-duration':'calendar-event');
      },
      locate: (base,S) => (st,t) => {
        const {refs,s,ctx}=st;
        if(t.cell||t.end) {
          const cell=t.cell||t.end,b=refs.columns.getBoundingClientRect();
          return [b.left+(cell[1]-s.open)/(s.close-s.open)*b.width+(t.cell&&ctx.model.created?8:t.end?-2:0),b.top+b.height/refs.count/2];
        }
        if(t.event||t.edge) {
          const b=refs.events.get(t.event||t.edge).getBoundingClientRect();
          return [t.edge?b.right-2:b.left+Math.min(8,b.width/3),b.top+b.height/2];
        }
        return base(st,t);
      },
      scrollbar: () => st => {
        // The full day is visible at once; mirror its bounds just as the base pane does.
        st.ctx.patch({view:{top:st.s.open,bottom:st.s.close,px:0}});
      },
      rendered: () => st => {
        const heading=document.querySelector('.legacy-records-title');
        if(heading) heading.textContent=`Team Events – Mon, ${st.s.month.slice(0,3)} ${st.s.date || 8}, 2027`;
        const rows=[...document.querySelectorAll('.legacy-record-row')];
        const events=st.s.events.filter((e,i,all)=>all.findIndex(x=>x.start===e.start&&x.title===e.title)===i).sort((a,b)=>a.start-b.start);
        if(events.length&&rows[1]) {
          rows[1].children[0].textContent=st.f.helpers.time(events[0].start);
          rows[1].children[1].textContent=events[0].title;
        }
        if(events.length>1&&rows[2]) {
          rows[2].children[0].textContent=st.f.helpers.time(events[1].start);
          rows[2].children[1].textContent=events.slice(1).map((e,i)=>`${i?st.f.helpers.time(e.start)+'　　':''}${e.title}`).join('　　　');
        }
      },
      status: () => st => {
        const legend=st.u.el('div','legacy-legend',st.root);
        for(const [cls,text] of [['busy','Busy (Meeting)'],['one','1:1'],['out','Out of office'],['free','Free']]) {
          const item=st.u.el('span','',legend);st.u.el('i',cls,item);st.u.el('span','',item,text);
        }
      },
    },
  },
});
