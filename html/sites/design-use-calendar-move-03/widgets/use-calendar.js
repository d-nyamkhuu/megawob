// Design on the shared use-calendar/workspace template.
env.widget({
  task: 'use-calendar',
  site: 'design-use-calendar-move-03',
  name: 'design',
  split: 'train',
  scenarios: ['move'],
  template: 'use-calendar/workspace',
  design: {
    brand: 'TeamWorks',
    colors: ['#1666ff', '#459e49', '#c6a325', '#ef6067'],
    theme: {panel:'#fff', bg:'#fff', fg:'#000', muted:'#000', line:'#aab2bd', accent:'#0000ee'},
    fontFamily: '"Times New Roman", Times, serif',
    inset: 0,
    axis: 100,
    parts: {
      begin: (base, S) => st => {
        base(st);
        S.D.minuteHeight = Math.max(.8, (st.ctx.size.height - 190) / (st.s.close - st.s.open + 120));
      },
      toolbar: (base, S) => st => {
        const controls = base(st);
        const {u} = st;
        const views = u.el('div', 'tw-views', controls.top);
        for (const name of ['Day', 'Week', 'Month']) {
          const b = u.el('button', name === 'Week' ? 'selected' : '', views, name);
          b.addEventListener('click', () => S.P.openMenu(st, 'view'));
        }
        const zone = u.el('div', 'tw-zone', controls.top);
        u.el('span', '', zone, 'Time zone:');
        const b = u.el('button', 'tw-zone-button', zone, 'Pacific Time (PT)');
        u.el('span', '', b, '⌄');
        b.addEventListener('click', () => S.P.openMenu(st, 'settings'));
        return controls;
      },
      openMenu: (base, S) => (st,kind) => {
        base(st,kind);
        if(kind==='settings') for(const row of st.menu.querySelectorAll('.ac-menu-row')) {
          if(row.textContent.startsWith('Time zone:')) row.textContent='Time zone: Pacific Time (PT)';
        }
      },
      sidebar: (base, S) => st => {
        const {s,u,body,ctx} = st;
        const side = u.el('aside', 'ac-sidebar tw-summary-panel', body);
        S.P.miniCalendar(st, side);
        const heading = text => u.el('h2', 'tw-section-heading', side, text);
        heading('My Calendars');
        ['Team','Product','Design','Personal'].forEach((name,i) => S.P.calendarRow(st,side,name,i));
        heading('Team Members');
        s.people.forEach((name,i) => S.P.personRow(st,side,name,i));
        heading('Upcoming (next 7 days)');
        st.upcoming = s.events.slice(0,5).map(e => {
          const row = u.el('div', 'tw-upcoming', side);
          const link = u.el('a', '', row, e.title);
          link.href = '#';
          link.addEventListener('click', ev => {ev.preventDefault(); S.P.commit(st,{...ctx.model,selected:e.id});});
          return {id:e.id, date:u.el('span', '', row)};
        });
        heading('Calendar Summary');
        for (const [name,value] of [['Total events (week):',s.events.length],['Team members:',s.people.length],['Conflicts:',0]]) {
          const row = u.el('div', 'tw-count', side);
          u.el('span', '', row, name);u.el('span', '', row, String(value));
        }
      },
      miniCalendar: (base, S) => (st,side) => {
        const {s,u} = st;
        u.el('strong', 'tw-month-title', side, `${s.month} 2027`);
        const weekdays = u.el('div','tw-mini-weekdays',side);
        ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(w=>u.el('span','',weekdays,w));
        const mini = u.el('div','ac-mini',side);
        const first = (s.firstWeekday+1)%7;
        const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        const prev = (months.indexOf(s.month)+11)%12;
        const prevDays = [31,28,31,30,31,30,31,31,30,31,30,31][prev];
        for(let k=0;k<Math.ceil((first+s.monthDays)/7)*7;k++) {
          const d=k-first+1, outside=d<1||d>s.monthDays;
          u.el('span',outside?'ac-muted':d===8?'today':'',mini,String(d<1?prevDays+d:d>s.monthDays?d-s.monthDays:d));
        }
        const links = u.el('div','tw-month-links',side);
        for(const [name,dir] of [[`« ${months[prev].slice(0,3)}`,-1],[`${months[(prev+2)%12].slice(0,3)} »`,1]]) {
          const a=u.el('a','',links,name);a.href='#';
          a.addEventListener('click',e=>{e.preventDefault();S.P.browse(st,dir);});
        }
      },
      calendarRow: (base, S) => (st,side,name,i) => {
        const row=st.u.el('div','ac-person',side);
        row.style.setProperty('--tone',S.D.colors[i%4]);
        row.style.setProperty('--fill',['#bedbff','#bff2c1','#fff4ab','#ffc6c9'][i%4]);
        st.u.el('span','tw-checked',row,'✓');
        st.u.el('span','tw-swatch',row);
        st.u.el('span','',row,name);
      },
      personRow: (base, S) => (st,side,name,i) => S.P.calendarRow(st,side,name,i),
      timeHeader: (base, S) => st => {
        const names=base(st), header=st.refs.dayHeads[0].parentNode;
        const weekend=(name,day)=>{
          const node=st.u.el('div','ac-day-head tw-weekend-head',null);
          st.u.el('span','ac-head-name',node,name);
          st.u.el('b','',node,`${st.s.month.slice(0,3)} ${day}`);
          return node;
        };
        st.sundayHead=weekend('Sun',7);st.saturdayHead=weekend('Sat',13);
        header.insertBefore(st.sundayHead,st.refs.dayHeads[0]);header.appendChild(st.saturdayHead);
        const axis=header.querySelector('.ac-axis-head');axis.textContent='';
        st.u.el('span','',axis,'PT');st.u.el('span','',axis,'ET');
        return names;
      },
      timeGrid: (base, S) => (st,names) => {
        const result=base(st,names), {grid,columns,eventLayer}=result;
        const axis=st.refs.axis;
        for(const el of [columns,eventLayer]) {
          el.style.left=`calc(${axis}px + (100% - ${axis}px) / 7)`;
          el.style.right=`calc((100% - ${axis}px) / 7)`;
        }
        for(const right of [false,true]) {
          const col=st.u.el('div','ac-column tw-weekend',grid);
          col.style.width=`calc((100% - ${axis}px) / 7)`;
          if(right) col.style.right='0'; else col.style.left=`${axis}px`;
          for(let t=st.s.open;t<=st.s.close+60;t+=60) {
            const line=st.u.el('div','ac-hour-line',col);line.style.top=`${(t-st.s.open)*S.D.minuteHeight}px`;
          }
        }
        return result;
      },
      adjacentEvents: (base, S) => (st,grid) => {
        base(st,grid);
        const axis=st.refs.axis;
        st.refs.adjacent.style.left=`calc(${axis}px + (100% - ${axis}px) / 7)`;
        st.refs.adjacent.style.right=`calc((100% - ${axis}px) / 7)`;
      },
      rulers: (base, S) => (st,grid,axis) => {
        const {s,u,f}=st;
        const rulers=u.el('div','ac-rulers',grid);rulers.style.width=`${axis}px`;
        for(let t=s.open;t<=s.close+60;t+=60) {
          const row=u.el('div','ac-hour-label',rulers);
          row.style.top=`${Math.max(10,(t-s.open)*S.D.minuteHeight)}px`;
          u.el('span','',row,f.helpers.time(t));
          u.el('span','',row,f.helpers.time(t+180));
        }
      },
      event: (base, S) => (st,el,e) => {
        base(st,el,e);
        el.style.setProperty('--fill',['#bedbff','#bff2c1','#fff4ab','#ffc6c9'][e.tone%4]);
      },
      painted: (base, S) => (st,m) => {
        base(st,m);
        const off=(m.browse||0)*7, mo=st.s.month.slice(0,3);
        st.period.textContent=`${mo} ${7+off} – ${mo} ${13+off}, 2027`;
        st.refs.dayHeads.forEach((h,i)=>{h.querySelector('b').textContent=`${mo} ${8+i+off}`;h.classList.remove('today');});
        st.sundayHead.querySelector('b').textContent=`${mo} ${7+off}`;
        st.saturdayHead.querySelector('b').textContent=`${mo} ${13+off}`;
        for(const item of st.upcoming) {
          const e=m.events[item.id];item.date.textContent=`${mo} ${e.day}, ${st.f.helpers.time(e.start)}`;
        }
      },
    },
  },
});
