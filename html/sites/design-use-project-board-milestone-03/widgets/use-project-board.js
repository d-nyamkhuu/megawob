// Design on templates/use-project-board/workspace.js; defaults reproduce the scaffold.
env.widget({
  task: 'use-project-board',
  site: 'design-use-project-board-milestone-03',
  name: 'design',
  split: 'train',
  scenarios: ['milestone'],
  template: 'use-project-board/workspace',
  design: {
    parts: {
      rendered(_base, S) {
        return function () {
          const { active, ctx, els } = S;
          const projectTitle = els.main && els.main.querySelector('.pj-title');
          if (projectTitle) projectTitle.textContent = 'Release Timeline';
          const d = document;
          const make = (tag, cls, parent, text) => {
            const n = d.createElement(tag);
            if (cls) n.className = cls;
            if (text != null) n.textContent = text;
            if (parent) parent.appendChild(n);
            return n;
          };
          const sidebar = ctx.stage.querySelector('.pj-sidebar');
          const sidebarScroll = sidebar && (sidebar.querySelector('.pj-sidebar-scroll') || sidebar);
          if (sidebarScroll) {
            sidebarScroll.replaceChildren();
            make('div', 'ms-list-title', sidebarScroll, 'Milestones');
            const list = make('div', 'ms-list', sidebarScroll);
            const details = make('section', 'ms-inspector', sidebarScroll);
            const colors = ['#2189ed','#37a34b','#f08a12','#df3833','#7138cf','#85888c'];
            const show = (it, index) => {
              details.replaceChildren();
              make('div', 'ms-details-label', details, 'Details');
              make('h3', '', details, it.title);
              const b = ctx.model.bars[it.id];
              const fields = [['Date', `${ctx.spec.month || 'June'} ${b.start}, 2015`], ['Type','Milestone'], ['Team',['Data Platform','Application','Marketing'][index % 3]], ['Status',it.state || 'Planned']];
              for (const [label, value] of fields) { const row=make('div','ms-field',details); make('span','',row,label); make('strong','',row,value); }
              make('p','ms-description',details,`Plan and deliver ${it.title.toLowerCase()} with the ${fields[2][1]} team.`);
            };
            active.forEach((it, i) => {
              const row = make('button', `ms-item${i===0?' selected':''}`, list);
              row.type='button'; row.style.setProperty('--milestone-color',colors[i%colors.length]);
              make('i','',row); make('span','',row,it.title);
              row.addEventListener('click',()=>{ list.querySelectorAll('.ms-item').forEach(x=>x.classList.remove('selected')); row.classList.add('selected'); show(it,i); });
            });
            show(active[0],0);
          }
          const body = els.body;
          if (body && !body.querySelector('.ms-delivery')) {
            const summary=make('div','ms-summary',null);
            make('h1','',summary,'Release Timeline');
            for (const [value,label] of [[String(active.length),'Milestones'],['3','Teams'],['25','Days']]) {
              const cell=make('div','',summary); make('b','',cell,value); make('span','',cell,label);
            }
            body.insertBefore(summary, body.firstChild);
            const board=make('section','ms-delivery',body);
            make('h2','',board,'Team Delivery Board');
            const cols=make('div','ms-columns',board);
            const teams=['Data Platform','Application','Marketing'];
            teams.forEach((team, ci)=>{
              const col=make('div','ms-column',cols);
              const head=make('div','ms-column-head',col,team);
              make('span','',head,`${ci===1?3:2} / 3`);
              const cards=active.filter((_,i)=>i%3===ci).concat(S.related[ci] ? [S.related[ci]] : []);
              cards.forEach((it,i)=>{
                const card=make('article','ms-card',col);
                make('b','',card,it.title);
                const meta=make('div','ms-card-meta',card);
                const dot=make('i','',meta); dot.style.background=it.state==='In Progress'?'#35a64d':'#2388ed';
                make('span','',meta,it.state||'Planned');
                const date=it.related ? it.start : ctx.model.bars[it.id].start;
                make('time','',meta,`${ctx.spec.month || 'June'} ${date}, 2015`);
              });
            });
          }
        };
      },
      timelineRefresh(_base, S) {
        return function () {
          S.P.timelineCalendar();
          const { AXIS, ROW, positions, nodes, wrap, phase, nextPhase } = S.scene;
          let y = AXIS;
          phase.style.display = 'none';
          nextPhase.style.display = 'none';
          for (const it of S.active) {
            const row = nodes[it.id];
            row.style.display = '';
            row.style.top = `${y}px`;
            positions[it.id] = y;
            y += ROW;
          }
          for (const it of S.related) nodes[it.id].style.display = 'none';
          wrap.style.height = `${y + 8}px`;
          S.P.paint(S.ctx.model);
        };
      },
    },
  },
});
