// Design on templates/use-project-board/workspace.js; defaults reproduce the scaffold.
env.widget({
  task: 'use-project-board',
  site: 'design-use-project-board-milestone-05',
  name: 'design',
  split: 'train',
  scenarios: ['milestone'],
  template: 'use-project-board/workspace',
  design: {
    inset: 0, axisHeight: 70, rowHeight: 34, phaseHeight: 0,
    metaMin: 225, metaMax: 225, metaRatio: 0.16,
    parts: {
      timelineFrame(base, S) {
        return function() {
        const ctx = S.ctx, s = S.spec, u = S.ctx.util, P = S.P, active = S.active;
        const body = S.els.body;
        const summary = u.el('div', 'milestone-summary', body);
        body.before(summary);
        const release = u.el('div', 'lisa-release', summary);
        const illustration = u.el('div', 'lisa-stationery', release);
        const paperArt=u.svg('svg',{viewBox:'0 0 120 140',fill:'#faf9f5',stroke:'#111','stroke-width':2.2,'stroke-linejoin':'round','aria-hidden':'true'},illustration);
        const draw=(d, attrs={})=>u.svg('path',{d,...attrs},paperArt);
        draw('M8 49L75 21L112 45L46 74Z');
        draw('M25 44L20 30L70 10L77 33M23 34L69 16');
        draw('M35 61L29 32L83 17L87 51M34 35L79 23');
        draw('M40 68L36 36L91 26L94 57M41 39L87 31');
        draw('M48 72L48 34L97 25L97 57M54 39L91 32M55 45L88 39M55 51L81 46M55 58L84 52',{'stroke-width':2});
        draw('M8 49L46 72L46 133L8 110ZM46 72L112 45L112 105L46 133Z');
        for(let i=5;i<59;i+=4) draw(`M9 ${49+i}L46 ${72+i}L111 ${45+i}`,{'stroke-width':1.1,fill:'none'});
        const releaseText = u.el('div', 'lisa-release-text', release);
        u.el('h1','',releaseText,'Product Release');
        u.el('h2','',releaseText,'Search and Analytics Improvements');
        const fields = u.el('div','lisa-release-fields',releaseText);
        [['Release:','R3.0'],['Period:',`${s.month.slice(0,3)} 1, 2024 – ${s.month.slice(0,3)} ${s.days}, 2024`],['Owner:','Product Team'],['Status:','In Progress']].forEach(([k,v])=>{const line=u.el('div','',fields);u.el('span','',line,k);u.el('span','',line,v);});
        const metrics = u.el('div','lisa-metrics',release);
        const totals = u.el('div','',metrics);u.el('strong','',totals,'Milestones');
        [['Total',active.length],['Completed',active.filter(x=>x.state==='Complete').length],['Upcoming',active.filter(x=>x.state!=='Complete').length]].forEach(([k,v])=>{const line=u.el('div','',totals);u.el('span','',line,k);u.el('span','',line,String(v));});
        const teams = u.el('div','',metrics);u.el('strong','',teams,'Teams');
        [['Engineering',3],['Design',2],['Data',2],['QA',2]].forEach(([k,v])=>{const line=u.el('div','',teams);u.el('span','',line,k);u.el('span','',line,String(v));});
        const relatedList=u.el('div','lisa-milestones',summary);
        u.el('strong','',relatedList,'Milestones');
        const listHead=u.el('div','lisa-list-head',relatedList);u.el('span','',listHead,'Name');u.el('span','',listHead,'Date');
        const listBody=u.el('div','lisa-list-body',relatedList);
        const listDateNodes={};
        active.forEach((it,i)=>{const line=u.el('div',i===0?'lisa-selected':'',listBody);u.el('span','',line,it.title);listDateNodes[it.id]=u.el('span','',line,`${s.month.slice(0,3)} ${ctx.model.bars[it.id].start}, 2024`);});
        const scroll=u.el('div','lisa-list-scroll',relatedList);
        u.el('span','',scroll,'▲');u.el('span','',scroll,'▼');
        S.zoom = 'Month';
        const wrap = u.el('div', 'pj-timeline milestone-timeline', body);
        wrap.style.minHeight = '100%';
        const metaW = ctx.size.width <= 1100 ? 145 : 225;
        const positions = {}, nodes = {}, bars = {}, datesText = {}, ports = {}, captions = {};
        const axis = u.el('div', 'pj-axis', wrap), axisLabel = u.el('div', 'pj-axis-label', axis);
        axisLabel.style.width = `${metaW}px`;
        u.el('strong', '', axisLabel, 'Milestone Timeline');
        const dates = u.el('div', 'pj-dates', axis);
        const todayLine = u.el('div', 'pj-today', wrap);
        const phase = u.el('div', 'pj-phase', wrap); phase.style.display = 'none';
        const nextPhase = u.el('div', 'pj-phase', wrap); nextPhase.style.display = 'none';
        const lineLayer = u.svg('svg', { class: 'pj-edges' }, wrap), edgesG = u.svg('g', {}, lineLayer);
        const decorG = u.svg('g', { class: 'milestone-links' }, lineLayer);
        const rubber = u.svg('path', { class: 'pj-rubber' }, lineLayer);
        const strip = u.el('div', 'milestone-related', body);
        body.after(strip);
        u.el('strong','lisa-board-title',strip,'Delivery Board');
        const board=u.el('div','lisa-board',strip);
        const head=u.el('div','lisa-board-head',board);
        ['Team','Backlog\nWIP 5','In Progress\nWIP 3','Review\nWIP 2','Done'].forEach(t=>u.el('strong','',head,t));
        const all=[...active,...S.related];
        const names=['Engineering','Design','Data','QA'];
        names.forEach((name,r)=>{const row=u.el('div','lisa-board-row',board);u.el('span','lisa-team-name',row,name);for(let c=0;c<4;c++){const cell=u.el('div','lisa-board-cell',row);const it=all[(r*2+c*3)%all.length];if((c===0)||(c===1&&r<4)||(c===2&&(r===0||r===3))||(c===3&&r===3)){const card=u.el('div','lisa-board-card',cell);u.el('span','lisa-file-icon',card,'▤');u.el('span','',card,it.title);}}});
        // Keep each diamond clear of the sticky axis and its visibility guard.
        const rowHeight = ctx.size.height <= 720 ? 25 : 34;
        Object.assign(S.scene = {}, { AXIS:axis.offsetHeight, ROW:rowHeight, PHASE:0, wrap, metaW, positions, nodes, bars, datesText, ports, captions,
          axis, axisLabel, dates, todayLine, phase, nextPhase, lineLayer, edgesG, decorG, rubber, edgePoints:{}, dayW:0, shownDays:s.days, summary, strip, listDateNodes });
        };
      },
      timelineRow(base, S) {
        return function(it, index) {
        const u = S.ctx.util, scene = S.scene;
        const row = u.el('div', `pj-row${it.related ? ' milestone-hidden-related' : ''}`, scene.wrap);
        scene.nodes[it.id] = row;
        if (it.related) { scene.datesText[it.id]=u.el('span','milestone-date-hidden',row,''); return row; }
        scene.positions[it.id] = index * scene.ROW;
        row.style.top = `${index * scene.ROW}px`;
        row.style.height = `${scene.ROW}px`;
        const meta=u.el('div','pj-meta milestone-label',row); meta.style.width=`${scene.metaW}px`;
        u.el('span','pj-name',meta,it.title);
        scene.datesText[it.id]=u.el('span','milestone-date-hidden',meta,String(it.start));
        return row;
        };
      },
      timelineRefresh(base, S) {
        return function() {
          const { scene, active, P, ctx } = S;
          P.timelineCalendar();
          let y = scene.AXIS + 10;
          active.forEach((it, i) => {
            const row = scene.nodes[it.id];
            row.style.display = '';
            scene.positions[it.id] = y;
            row.style.top = `${y}px`;
            y += scene.ROW;
          });
          S.related.forEach(it => { scene.nodes[it.id].style.display = 'none'; });
          scene.wrap.style.height = `${y + 16}px`;
          S.els.body.style.minHeight = `${y + 16}px`;
          P.paint(ctx.model);
        };
      },
      timelineCalendar(base, S) {
        return function() {
          base();
          const month=S.scene.dates.querySelector('.pj-month');
          if (month) month.textContent=`${S.spec.month} 2024`;
        };
      },
      timelinePaint(base, S) {
        return function(model) {
          base(model);
          S.scene.decorG.replaceChildren();
          S.active.forEach(it=>{const node=S.scene.listDateNodes[it.id];if(node)node.textContent=`${S.spec.month.slice(0,3)} ${model.bars[it.id].start}, 2024`;});
        };
      },
    },
  },
});
