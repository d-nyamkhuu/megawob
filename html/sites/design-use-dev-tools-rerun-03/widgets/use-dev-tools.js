// Reference workspace design; shared widget: templates/use-dev-tools/workspace.js.
env.widget({
  task: 'use-dev-tools',
  site: 'design-use-dev-tools-rerun-03',
  name: 'design',
  split: 'train',
  scenarios: ['rerun'],
  template: 'use-dev-tools/workspace',
  design: {
    brand: 'DevForge', inset: 0, bottomInset: 0, fontSize: 16, success: '#008763', error: '#c91425',
    parts: {
      frame: (base, S) => ctx => {
        const card = base(ctx);
        Object.assign(card.style, {left:'0', top:'0', width:'100%', height:'100%'});
        return card;
      },
      top: () => () => {},
      layout: (base, S) => ctx => {
        const {el, s, card} = S.st;
        const shell = el('div', 'dv-shell df-shell', card);
        shell.style.height='100%';
        const work = el('div', 'dv-work', shell);
        work.style.minHeight='0';
        const badge = S.P.heading(ctx, work);
        const content = el('div', 'dv-content', work);
        const main = el('div', 'dv-main', content);
        // Reserve a usable scroll window even when the frame needs more space.
        main.style.flex='1 1 0';
        main.style.minHeight='180px';
        const query = S.P.tools(ctx, main);
        const sidebar = el('aside', 'df-properties', shell);
        const section = title => { const box=el('section','df-property-section',sidebar); el('h3','',box,title); return box; };
        const info = section('Pipeline Details');
        for (const [key,value] of [['Pipeline',`#${s.runId}`],['Project',s.project],['Branch','fix/session-guard'],['Commit',s.revision],['Author',s.author],['Triggered by','Push'],['Started','Apr 28, 2024 10:14 AM'],['Duration',S.st.dfDuration],['Status','Failed']]) {
          const line=el('div','df-property',info); el('span','',line,key); el('span',key==='Commit'?'df-link':key==='Status'?'df-failure':'',line,value);
        }
        const taskNote=document.querySelector('.ref-panel');
        if(taskNote)sidebar.append(taskNote);
        const commit = section('Commit');
        el('a','df-link',commit,s.revision);
        el('p','',commit,s.author);
        el('p','',commit,'Add session timeout handling');
        const links = (box, labels) => labels.forEach(([glyph,label]) => {
          const a=el('button','df-inspector-link',box); S.P.icon(a,glyph); el('span','',a,label);
          a.onclick=()=>S.P.peek(label,[[s.revision,`Project ${s.project}`,'file']]);
        });
        links(commit,[['file','View commit'],['package','Browse source'],['branch','View pull request']]);
        links(section('Related'),[['pipeline','View workflow'],['package','View artifacts'],['logs','View logs'],['grid','View metrics']]);
        return {shell,sidebar,work,badge,query,content,main};
      },
      heading: (base, S) => (ctx, work) => {
        const {el,s} = S.st;
        const total=s.items.reduce((n,x)=>n+(parseInt(x.duration,10)||0),0);
        S.st.dfDuration=`${Math.floor(total/60)}m ${total%60}s`;
        const heading=el('header','df-record',work);
        heading.style.boxSizing='border-box';
        const title=el('div','df-record-title',heading);
        const bread=el('div','df-breadcrumb',title); el('span','',bread,'Pipelines'); el('span','',bread,'›'); el('span','',bread,s.project); el('span','',bread,'›'); el('strong','',bread,`#${s.runId}`);
        el('h1','',title,`Pipeline #${s.runId}`);
        const branch=el('div','df-branch',title); S.P.icon(branch,'branch'); el('span','',branch,'fix/session-guard'); el('span','',branch,'•'); el('a','df-link',branch,s.revision); el('span','df-commit-message',branch,'Add session timeout handling');
        const author=el('div','df-author',title); el('span','df-avatar',author,S.P.initials(s.author)); el('span','',author,`Opened by ${s.author}`); el('span','',author,'3 hours ago');
        const badge=el('span','df-run-status',heading,'Failed');
        const summary=el('div','df-run-summary',heading);
        const failed=s.items.filter(x=>x.status==='Failed').length;
        for (const [label,value] of [['Started','Apr 28, 2024 10:14 AM'],['Duration',S.st.dfDuration],['Triggered by','Push'],['Commit',s.revision],['Jobs',`${s.items.length} total   ${failed} failed   ${s.items.length-failed} succeeded`]]) {
          const line=el('div','df-property',summary); el('span','',line,label); el('span',label==='Commit'?'df-link':'',line,value);
        }
        return badge;
      },
      tools: (base, S) => (ctx, main) => {
        const {el,s}=S.st;
        const head=el('div','df-jobs-heading',main); el('h2','',head,`Jobs (${s.items.length})`);
        const query=base(ctx,head);
        return query;
      },
      graph: () => () => {},
      columnHead: (base, S) => (ctx, main) => {
        const head=S.st.el('div','dv-columnhead df-job-columns',main);
        ['#','Name','Status','Duration','Started At'].forEach(x=>S.st.el('span','',head,x));
      },
      rowContent: (base, S) => (ctx,row,item,rec) => {
        const {el,s}=S.st;
        el('span','df-job-number',row,String(s.items.indexOf(item)+1));
        el('span','df-job-name',row,item.label);
        const status=el('span','df-job-status',row); rec.icon=el('span','',status); rec.status=el('span','dv-status',status);
        el('span','',row,item.duration);
        el('span','df-start-time',row,`10:${String(14+s.items.indexOf(item)).padStart(2,'0')} AM`);
      },
      detail: (base, S) => (ctx, content) => {
        const {el}=S.st;
        const detail=el('aside','dv-detail df-lower-detail',content);
        // Keep the entire inspector scrollable, including its preparation controls.
        Object.assign(detail.style,{flex:'0 1 320px',minHeight:'80px',width:'100%',maxWidth:'none',boxSizing:'border-box',overflow:'auto',paddingBottom:'5px'});
        const head=el('div','df-detail-heading',detail);
        const dh=el('h3','',head,'Select an item'); const meta=el('p','dv-muted',head);
        const tabs=el('nav','df-detail-tabs',detail);
        ['Summary','Logs','Artifacts','Metrics'].forEach((label,i)=>{
          const b=el('button',i===0?'active':'',tabs,label);
          b.onclick=()=>{if(i)S.P.peek(label,[[label,'Select a job to view its output','file']]);};
        });
        S.st.dfDetailBody=el('div','df-detail-body',detail);
        S.st.dfActions=el('div','df-job-actions',detail);
        Object.assign(S.st.dfActions.style,{position:'static',flex:'none',marginTop:'6px'});
        return {detail,dh,meta};
      },
      controlsRerun: (base, S) => (ctx, detail) => {
        const controls=base(ctx,detail);
        S.st.refs.jobOutput.classList.add('df-output-storage');
        S.st.dfActions.append(controls.prepare,controls.confirmBox);
        const options=S.st.el('button','dv-btn df-options',S.st.dfActions,'⚙  Rerun with options  ﹀');
        options.onclick=()=>S.P.peek('Rerun with options',[['Commit',S.st.s.revision,'branch'],['Variables','Retain current pipeline variables','settings']]);
        const remove=S.st.el('button','dv-btn df-delete-job',S.st.dfActions,'Delete job run');
        S.P.icon(remove,'close');
        remove.onclick=()=>env.log('decoy',{label:'Delete job run'});
        return controls;
      },
      facts: (base,S) => (ctx,detail) => {
        const {el}=S.st;
        const box=el('div','df-detail-facts',S.st.dfDetailBody);
        S.st.dfSelectedName=el('div','df-property',box);
        const facts=base(ctx,box);
        for(const [label,value] of [['Runner','ubuntu-20.04 (2 vCPU, 7 GB)'],['Image','cypress/included:12.6.0']]) {
          const line=el('div','df-property',box);el('span','',line,label);el('span','',line,value);
        }
        return facts;
      },
      detailExtra: (base,S) => () => {
        const {el}=S.st;
        const box=el('div','df-description',S.st.dfDetailBody);
        el('strong','',box,'Description');
        S.st.dfDescription=el('p','',box,'Select a job above to inspect its status and retry information.');
        el('strong','',box,'Steps');
        for (const [name,time] of [['Install dependencies','1m 02s'],['Start web server','42s'],['Run tests','9m 48s'],['Upload results','31s']]) {
          const line=el('div','df-step',box);el('span',name==='Run tests'?'df-step-error':'df-step-ok',line,name==='Run tests'?'×':'✓');el('span','',line,name);el('span','',line,time);
        }
      },
      paint: (base,S) => model => {
        base(model);
        const {s,el,rows,prepare,dfSelectedName,dfDescription}=S.st;
        const item=s.items.find(x=>x.id===model.selected);
        S.st.detail.classList.toggle('df-has-job',!!item);
        S.st.dh.dataset.status=item?(model.attempts[item.id]?'Queued':item.status):'';
        if(item)S.st.meta.textContent=`Job #${s.items.indexOf(item)+1}  •  ${item.duration}  •  Started Apr 28, 2024 10:24 AM`;
        if(!item){S.st.dh.textContent='Job details';S.st.meta.textContent='Choose a job above to inspect it.';}
        dfSelectedName.replaceChildren();el('span','',dfSelectedName,'Name');el('span','',dfSelectedName,item?item.label:'No job selected');
        dfDescription.textContent=item?`Run ${item.label} using the pipeline runner.`:'Select a job above to inspect its status and retry information.';
        prepare.style.display=''; prepare.disabled=!item;
        for(const job of s.items){ const r=rows[job.id];r.row.classList.toggle('df-failed-row',job.status==='Failed'&&!model.attempts[job.id]);if(r.status.textContent==='Passed')r.status.textContent='Succeeded'; }
      },
    },
  },
});
