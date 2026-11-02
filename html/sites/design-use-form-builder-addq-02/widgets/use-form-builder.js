// Design on the shared use-form-builder/editor template.
function qtFormToolIcon(st,parent,name) {
  const u=st.ctx.util;
  const svg=u.svg('svg',{viewBox:'0 0 24 24',width:24,height:25,'aria-hidden':'true',class:'qt-tool-svg'},parent);
  const paths={plus:'M9 2H15V9H22V15H15V22H9V15H2V9H9Z',delete:'M4 2L12 10L20 2L23 5L15 13L23 21L20 24L12 16L4 24L1 21L9 13L1 5Z',up:'M12 1L22 12H16V23H8V12H2Z',down:'M8 1H16V12H22L12 23L2 12H8Z'};
  const color=name==='plus'?['#35c18b','#298663']:name==='delete'?['#f36677','#b72d42']:['#648aff','#244cbb'];
  u.svg('path',{d:paths[name],fill:color[0],stroke:color[1],'stroke-width':1,'stroke-linejoin':'round'},svg);
  return svg;
}
env.widget({
  task: 'use-form-builder',
  site: 'design-use-form-builder-addq-02',
  name: 'design',
  split: 'train',
  scenarios: ['addq'],
  template: 'use-form-builder/editor',
  design: {
    fontSize:'16px', radius:'0px', inset:0,
    parts: {
      status: (base,S) => st => {
        base(st);
        const m=st.ctx.model,spec=st.ctx.spec;
        const title=document.querySelector('.motif-titlebar strong');
        if(title?.firstChild)title.firstChild.nodeValue='Survey Builder - '+spec.title+' (Draft)';
        const name=document.querySelector('.qt-form-name');if(name)name.textContent=spec.title;
        const total=m.sectionOrder.reduce((n,id)=>n+m.orders[id].length,0);
        const counts=document.querySelectorAll('.qt-overview .qt-count');
        for(const [i,label,value] of [[0,'Sections',m.sectionOrder.length],[1,'Questions',total],[2,'Estimated time','3 min']]) {
          if(!counts[i])continue;
          counts[i].replaceChildren();S.P.el(st,'span','',counts[i],label);S.P.el(st,'span','',counts[i],String(value));
        }
        const labels=document.querySelectorAll('.qt-stat-label'),numbers=document.querySelectorAll('.qt-stat-number');
        const totalNode=document.querySelector('.qt-stat-total');if(totalNode)totalNode.textContent=String(total);
        m.sectionOrder.forEach((id,i)=>{
          if(labels[i+1])labels[i+1].textContent=spec.sections.find(s=>s.id===id).title;
          if(numbers[i])numbers[i].textContent=String(m.orders[id].length);
        });
      },
      topbar: (base, S) => st => {
        st.top=S.P.el(st,'div','qt-editor-caption',st.root,'Form Editor');
        S.P.el(st,'span','qt-collapse',st.top,'⌃');
      },
      layout: (base, S) => st => {
        const P=S.P;
        st.workspace=P.el(st,'div','qt-workspace',st.root);
        st.editor=st.workspace;
        P.tabs(st);
        const dock=P.el(st,'div','qt-section-dock',st.workspace);
        P.el(st,'div','qt-pane-heading',dock,'Sections');
        const tools=P.el(st,'div','qt-actions',dock);
        for(const [label,icon] of [['Add','plus'],['Delete','delete'],['Move Up','up'],['Move Down','down']]) {
          const b=P.button(st,'',tools,null,null,'qt-action');
          qtFormToolIcon(st,b,icon);
          P.el(st,'span','',b,label);
          b.addEventListener('click',()=>env.log('decoy',{what:'section-tool',label}));
        }
        st.sections=P.el(st,'div','af-sections qt-section-list',dock);
        st.body=P.el(st,'div','af-body qt-editor-body',st.workspace);
        st.foot=P.el(st,'div','af-foot',st.root);
      },
      sectionButton: (base,S) => (st,id) => {
        const P=S.P,m=st.ctx.model,sec=st.ctx.spec.sections.find(s=>s.id===id);
        const b=P.button(st,'',st.sections,{section:id},{ui:{section:id,selected:m.orders[id][0]||null}},'qt-section-row'+(m.ui.section===id?' on':''));
        const u=st.ctx.util;
        const doc=u.svg('svg',{viewBox:'0 0 22 28',width:22,height:28,class:'qt-document','aria-hidden':'true'},b);
        u.svg('rect',{x:1,y:1,width:20,height:26,fill:'#fff',stroke:'#1764ae','stroke-width':2},doc);
        u.svg('path',{d:'M4 6H6M4 11H6M4 16H6M4 21H6M9 6H18M9 11H18M9 16H18M9 21H18',stroke:'#287bc8','stroke-width':1.5},doc);
        P.el(st,'span','',b,`${m.sectionOrder.indexOf(id)+1}. ${sec.title}`);
        b.title=sec.title;
      },
      questionPanels: (base,S) => st => {
        const P=S.P;
        const canvas=P.pane(st,'canvas','af-canvas qt-question-pane');
        P.canvas(st,canvas);
        const inspector=P.pane(st,'inspector','af-inspector qt-edit-pane');
        P.inspector(st,inspector);
      },
      canvas: (base,S) => (st,parent) => {
        const P=S.P,m=st.ctx.model,sec=st.ctx.spec.sections.find(s=>s.id===m.ui.section);
        P.el(st,'div','qt-pane-heading',parent,'Questions in this section');
        const tools=P.el(st,'div','qt-actions',parent);
        P.addControl(st,tools);
        const selected=env.taskDef.helpers.question(m,m.ui.selected);
        for(const [label,icon] of [['Delete','delete'],['Move Up','up'],['Move Down','down']]) {
          const b=P.button(st,'',tools,label==='Delete'&&selected?{remove:selected.id}:null,label==='Delete'&&selected?{remove:selected.id}:null,'qt-action');
          qtFormToolIcon(st,b,icon);
          P.el(st,'span','',b,label);
        }
        const table=P.el(st,'div','qt-question-table',parent);
        const head=P.el(st,'div','qt-table-head',table);
        for(const text of ['#','Question text','Type','Required'])P.el(st,'span','',head,text);
        const rows=P.el(st,'div','qt-table-rows',table);
        for(const id of m.orders[sec.id]) {
          const q=env.taskDef.helpers.question(m,id);
          if(q)P.questionCard(st,rows,sec,id,q);
        }
      },
      addControl: (base,S) => (st,parent) => {
        const P=S.P,m=st.ctx.model;
        const b=P.button(st,'',parent,{add:true},{ui:{open:m.ui.open==='add'?null:'add'}},'qt-action qt-add-question');
        qtFormToolIcon(st,b,'plus');
        P.el(st,'span','',b,'Add Question');
        P.register(st,{add:true},b,'canvas');
      },
      questionCard: (base,S) => (st,parent,sec,id,q) => {
        const P=S.P,m=st.ctx.model;
        const row=P.el(st,'div','qt-question-row'+(m.ui.selected===id?' selected':''),parent);
        row.tabIndex=0;row.setAttribute('role','button');row.setAttribute('aria-label',q.title);
        P.register(st,{question:id},row,'canvas');
        row.addEventListener('click',()=>P.commit(st,{ui:{selected:id}}));
        row.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();P.commit(st,{ui:{selected:id}});}});
        P.el(st,'span','',row,String(m.orders[sec.id].indexOf(id)+1));
        const title=P.el(st,'span','',row,q.title),type=P.el(st,'span','',row,q.type),required=P.el(st,'span','',row,'');
        st.syncers.push(()=>{
          const now=env.taskDef.helpers.question(st.ctx.model,id);if(!now)return;
          title.textContent=now.title;type.textContent=now.type;required.textContent=now.validation.required?'Yes':'No';
        });
        P.questionDecorated(st,row,q);
        return row;
      },
      inspector: (base,S) => (st,parent) => {
        const P=S.P,q=env.taskDef.helpers.question(st.ctx.model,st.ctx.model.ui.selected);
        if(!q){P.el(st,'div','af-empty',parent,'Select a question or add your first question.');return;}
        if(st.ctx.model.ui.tab==='logic'){
          P.button(st,'Back to questions',parent,{tab:'questions'},{ui:{tab:'questions'}});
          P.routing(st,parent,q);return;
        }
        const edit=P.el(st,'div','qt-edit-question',parent);
        P.el(st,'div','qt-pane-heading',edit,'Edit Question');
        const grid=P.el(st,'div','qt-properties-grid',edit);
        const fields=P.el(st,'div','qt-fields',grid);
        P.properties(st,fields,q);
        const side=P.el(st,'div','qt-validation-side',grid);
        P.validation(st,side,q);
        const route=P.el(st,'div','qt-routing',parent);
        const heading=P.el(st,'div','qt-pane-heading',route);
        const open=P.button(st,'',heading,null,null,'qt-check');open.setAttribute('aria-label','Question routing');
        P.el(st,'span','',heading,'Question routing (optional)');
        const row=P.el(st,'div','qt-routing-row',route);
        const enable=P.button(st,'',row,null,null,'qt-check');enable.setAttribute('aria-label','Enable question routing');
        P.el(st,'span','',row,'Go to section:');
        const destination=P.button(st,st.ctx.spec.sections.find(s=>s.id!==q.section)?.title||'Next section',row,null,null,'qt-disabled-select');destination.disabled=true;
        P.el(st,'span','qt-muted',row,'when the answer is:');
        const answer=P.button(st,'Any answer',row,null,null,'qt-disabled-select');answer.disabled=true;
        open.addEventListener('click',()=>P.commit(st,{ui:{tab:'logic'}}));
        enable.addEventListener('click',()=>P.commit(st,{ui:{tab:'logic'}}));
      },
      properties: (base,S) => (st,p,q) => {
        const P=S.P;
        P.field(st,'Question text:','title',q.title,p,'inspector',true);
        P.select(st,'Question type:','type',q.type,p,'inspector');
        P.toggle(st,'This question is required','','required',q.validation.required,p,'inspector');
        if(q.options.length){P.field(st,'Answer options (one per line):','options',q.options.join('\n'),p,'inspector',true);}
        const help=P.el(st,'label','qt-help',p);
        P.el(st,'span','',help,'Help text (optional):');
        const area=P.el(st,'textarea','',help);area.setAttribute('aria-label','Help text (optional)');
        P.el(st,'i','qt-help-scroll',help,'▴\n\n▾');
      },
      validation: (base,S) => (st,p,q) => {
        const P=S.P,box=P.el(st,'fieldset','qt-validation',p);
        P.el(st,'legend','',box,'Validation');
        const email=P.button(st,'',box,null,null,'qt-checkbox-label');
        const check=P.el(st,'span','qt-checkbox'+(q.validation.preset==='Email address'?' checked':''),email);
        P.el(st,'span','',email,'Must be a valid email address');
        email.addEventListener('click',()=>P.commit(st,{pick:['preset',q.validation.preset==='Email address'?'None':'Email address']}));
        P.select(st,'Custom validation rule:','preset',q.validation.preset,box,'inspector');
        if(['Number range','Text length'].includes(q.validation.preset)) {
          const pair=P.el(st,'div','af-pair',box);
          P.field(st,'Minimum','min',q.validation.min,pair,'inspector');
          P.field(st,'Maximum','max',q.validation.max,pair,'inspector');
        }
        const response=P.el(st,'fieldset','qt-response',p);
        P.el(st,'legend','',response,'Response options');
        for(const label of ['Include an "Other" option','Allow multiple responses']) {
          const row=P.el(st,'div','qt-checkbox-label',response);
          P.el(st,'span','qt-checkbox',row);P.el(st,'span','',row,label);
        }
      },
      toggle: (base,S) => (st,label,hint,name,on,parent,paneName) => {
        const P=S.P,row=P.el(st,'div','af-toggle-row',parent);
        const b=P.button(st,'',row,{toggle:name},{toggle:name},'qt-checkbox-label');
        b.setAttribute('role','switch');b.setAttribute('aria-label',label);b.setAttribute('aria-checked',String(on));
        const check=P.el(st,'span','qt-checkbox'+(on?' checked':''),b);
        P.el(st,'span','',b,label);P.register(st,{toggle:name},b,paneName);
        return b;
      },
    },
  },
});
