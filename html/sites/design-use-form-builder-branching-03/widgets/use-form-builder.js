// Design on the shared use-form-builder/editor template.
env.widget({
  task: 'use-form-builder',
  site: 'design-use-form-builder-branching-03',
  name: 'design',
  split: 'train',
  scenarios: ['branching'],
  template: 'use-form-builder/editor',
  design: {
      accent: '#3e87cc', background: '#f9f8f6', panel: '#fbfaf8', text: '#151824',
      muted: '#737680', line: '#cccac5', fontFamily: 'Arial, Helvetica, sans-serif',
      fontSize: '16px', radius: '6px', columns: '32% minmax(0,1fr)',
    parts: {
      icon: (base, S) => (st,name,parent,size=16) => {
        const paths={
          help:['M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0','M9 8a3 3 0 0 1 6 1c0 2-3 2-3 5M12 17h.01'],
          list:['M3 4h3v3H3zM3 11h3v3H3zM3 18h3v3H3z','M9 5h12M9 12h12M9 19h12'],
          trash:['M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0','M6 12h12'],
        };
        if(!paths[name])return base(st,name,parent,size);
        const svg=S.ctx.util.svg('svg',{viewBox:'0 0 24 24',width:size,height:size,class:'af-icon gtk-icon-'+name,'aria-hidden':'true'},parent);
        paths[name].forEach(d=>S.ctx.util.svg('path',{d},svg));return svg;
      },
      frame: (base, S) => (st) => {
        const root = base(st);
        root.classList.add('gtk-editor');
        return root;
      },
      topbar: (base, S) => (st) => {
        base(st);
        document.body.style.setProperty('--window-title', JSON.stringify(S.spec.title + ' — Survey Editor'));
      },
      tabs: (base, S) => (st) => {
        const {P} = S;
        const tabs = document.querySelector('.ref-gtkbar');
        st.tabs = tabs;
        st.tabButtons = {};
        for (const [id, label] of [['questions','Editor'], ['settings','Settings']]) {
          const b = tabs.querySelector(`[aria-label="${label}"]`);
          P.register(st, {tab:id}, b);
          b.addEventListener('click', () => P.commit(st, {ui:{tab:id}}));
          st.tabButtons[id] = b;
        }
        const logic = P.button(st, '▾', tabs, {tab:'logic'}, {ui:{tab:'logic'}}, 'gtk-logic-tab');
        logic.title = 'Answer routing';
        logic.setAttribute('aria-label', 'Logic');
        st.tabButtons.logic = logic;
        const arrange = P.button(st, '↕', tabs, {tab:'arrange'}, {ui:{tab:'arrange'}}, 'gtk-arrange-tab');
        arrange.title = 'Arrange questions';
        st.tabButtons.arrange = arrange;
      },
      sectionButton: (base, S) => (st, id) => {
        const {P,ctx,spec} = S;
        const sec = spec.sections.find(s=>s.id===id);
        P.button(st, sec.title, st.sections, {section:id}, {ui:{section:id,selected:ctx.model.orders[id][0]||null}}, ctx.model.ui.section===id?'on':'');
      },
      canvas: (base, S) => (st, parent) => {
        const {P,ctx} = S, m = ctx.model;
        const list = P.el(st,'div','gtk-question-list',parent);
        P.el(st,'b','gtk-list-heading',list,`Questions in this section (${m.orders[m.ui.section].length})`);
        for (const id of m.orders[m.ui.section]) {
          const q=env.taskDef.helpers.question(m,id);
          const row=P.el(st,'article','gtk-question-row'+(m.ui.selected===id?' selected':''),list);
          row.tabIndex=0;row.setAttribute('role','button');row.setAttribute('aria-label',q.title);
          P.register(st,{question:id},row,'canvas');
          const choose=()=>P.commit(st,{ui:{selected:id}});
          row.addEventListener('click',choose);
          row.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose();}});
          P.el(st,'span','gtk-number',row,String(m.orders[m.ui.section].indexOf(id)+1)+'.');
          const text=P.el(st,'div','gtk-question-copy',row);
          const title=P.el(st,'div','',text,q.title);
          P.el(st,'span','gtk-question-type',text,q.type==='Multiple choice'?'Single choice':q.type);
          st.syncers.push(()=>{title.textContent=env.taskDef.helpers.question(ctx.model,id)?.title||'';});
        }
        const tools=P.el(st,'div','gtk-question-tools',parent);
        const add=P.button(st,'Add question…',tools,{add:true},{ui:{open:m.ui.open==='add'?null:'add'}},'gtk-add-question');
        P.icon(st,'plus',add);P.el(st,'span','',add,'▾');P.register(st,{add:true},add,'canvas');
        if(m.ui.selected) {
          const del=P.button(st,'Delete',tools,{remove:m.ui.selected},{remove:m.ui.selected},'gtk-delete');
          P.icon(st,'trash',del);P.register(st,{remove:m.ui.selected},del,'canvas');
        }
        for(const arrow of ['⬆','⬇']){const b=P.button(st,arrow,tools,null,null,'gtk-arrow');b.disabled=true;}
        const preview=st.nativePreview || st.top.querySelector('button[title="Preview"]') || Array.from(st.top.querySelectorAll('button')).find(b=>b.textContent.startsWith('Preview'));
        if(preview){st.nativePreview=preview;preview.className='gtk-preview';preview.title='Preview';preview.setAttribute('aria-label','Preview');preview.replaceChildren();P.icon(st,'eye',preview);tools.appendChild(preview);P.register(st,{preview:true},preview,'canvas');}
      },
      inspector: (base, S) => (st,p) => {
        const {P,ctx}=S, q=env.taskDef.helpers.question(ctx.model,ctx.model.ui.selected);
        if(!q){P.el(st,'p','',p,'Select a question.');return;}
        P.properties(st,p,q);P.routing(st,p,q);P.validation(st,p,q);
      },
      properties: (base, S) => (st,p,q) => {
        const {P,ctx}=S;
        const fields=P.el(st,'div','gtk-question-fields',p);
        P.field(st,'Question','title',q.title,fields,'inspector');
        P.select(st,'Question type','type',q.type==='Multiple choice'?'Single choice':q.type,fields,'inspector');
        if(!q.options.length)return;
        const group=P.el(st,'div','gtk-options',p);
        P.el(st,'h3','',group,'Answer options');
        const columns=P.el(st,'div','gtk-control-columns',group);
        const list=P.el(st,'div','gtk-options-list',columns);
        const options=P.field(st,'','options',q.options.join('\n'),list,'inspector',true);
        options.classList.add('gtk-options-input');
        options.style.backgroundSize=`100% ${q.options.length*27}px`;
        q.options.forEach((answer,i)=>{
          const row=P.button(st,'',list,{open:`route:${i}`},{ui:{open:`route:${i}`}},'gtk-option-row');
          row.style.top=(i*27)+'px';row.title='Set routing for '+answer;row.setAttribute('aria-label','Set routing for '+answer);
          P.el(st,'span','gtk-grip',row,'⠿');
          P.register(st,{open:`route:${i}`},row,'inspector');
        });
        const controls=P.el(st,'div','gtk-control-buttons',columns);
        const editOptions=()=>{
          st.root.querySelector('.af-dialog')?.remove();
          const d=P.el(st,'section','af-dialog gtk-options-dialog',st.root);
          const head=P.el(st,'div','af-dialog-head',d,'Answer options');
          P.iconButton(st,'Close',head,'close',()=>{d.remove();P.paint(st);});
          const body=P.el(st,'div','af-dialog-body',d);
          P.field(st,'Answer options · one per line','options',q.options.join('\n'),body,'inspector',true);
        };
        for(const label of ['Add…','Edit…','Remove','⬆   Move up','⬇   Move down']) {
          const b=P.button(st,label,controls,null,null);
          if(label==='Add…'||label==='Edit…')b.addEventListener('click',editOptions);else b.disabled=true;
        }
      },
      routing: (base, S) => (st,p,q) => {
        const {P,ctx,spec}=S, m=ctx.model;
        const group=P.el(st,'section','gtk-routing',p);
        P.el(st,'h3','',group,'Routing');
        const enabled=Object.values(m.rules[q.id]||{}).some(x=>x!=='next');
        const check=P.button(st,'Set answer-based routing for this question',group,null,null,'gtk-checkbox'+(enabled||st.routingEnabled?' checked':''));
        check.setAttribute('role','checkbox');check.setAttribute('aria-checked',String(enabled));
        check.addEventListener('click',()=>{st.routingEnabled=!st.routingEnabled;check.classList.toggle('checked',st.routingEnabled||enabled);});
        P.el(st,'p','gtk-routing-hint',group,q.options.length?'Choose where respondents go based on their answer.':'Routing is available for choice questions.');
        const columns=P.el(st,'div','gtk-control-columns',group);
        const table=P.el(st,'div','gtk-routing-table',columns);
        const heading=P.el(st,'div','gtk-routing-head',table);
        P.el(st,'span','',heading,'Answer');P.el(st,'span','',heading,'Go to section');
        const rows=[];
        q.options.forEach((answer,i)=>{
          const dest=m.rules[q.id]?.[answer];if(!dest||dest==='next')return;
          const row=P.el(st,'div','gtk-routing-row',table);
          rows.push([row,i]);
          row.addEventListener('click',()=>{
            st.activeRule=i;
            rows.forEach(([node,n])=>node.classList.toggle('active',n===i));
            edit.disabled=false;remove.disabled=false;
          });
          P.el(st,'span','',row,answer);
          P.select(st,'',`route:${i}`,spec.sections.find(s=>s.id===dest)?.title||dest,row,'inspector');
        });
        const controls=P.el(st,'div','gtk-control-buttons',columns);
        const add=P.button(st,'Add rule…',controls,null,null);add.disabled=!q.options.length;
        add.addEventListener('click',()=>{
          st.root.querySelector('.gtk-answer-picker')?.remove();
          const picker=P.el(st,'div','gtk-answer-picker',st.root);
          const head=P.el(st,'div','af-dialog-head',picker,'Choose an answer');
          P.iconButton(st,'Close',head,'close',()=>picker.remove());
          q.options.forEach((answer,i)=>P.button(st,answer,picker,null,{ui:{open:`route:${i}`}},'gtk-answer-choice'));
        });
        const edit=P.button(st,'Edit rule…',controls,null,null);edit.disabled=true;
        edit.addEventListener('click',()=>P.commit(st,{ui:{open:`route:${st.activeRule}`}}));
        const remove=P.button(st,'Remove rule',controls,null,null);remove.disabled=true;
        remove.addEventListener('click',()=>P.commit(st,{pick:[`route:${st.activeRule}`,'next']}));
      },
      validation: (base, S) => (st,p,q) => {
        const {P}=S;
        const group=P.el(st,'section','gtk-validation',p);
        const heading=P.el(st,'div','gtk-validation-heading',group);
        P.el(st,'h3','',heading,'Validation');
        const preset=P.button(st,'▾',heading,{open:'preset'},{ui:{open:S.ctx.model.ui.open==='preset'?null:'preset'}},'gtk-validation-rule');
        preset.title='Response validation rule';P.register(st,{open:'preset'},preset,'inspector');
        const b=P.button(st,'Require an answer to this question',group,{toggle:'required'},{toggle:'required'},'gtk-checkbox'+(q.validation.required?' checked':''));
        b.setAttribute('role','checkbox');b.setAttribute('aria-checked',String(q.validation.required));
        P.register(st,{toggle:'required'},b,'inspector');
        if(q.validation.preset!=='None') {
          P.el(st,'p','gtk-routing-hint',group,q.validation.preset);
          if(['Number range','Text length'].includes(q.validation.preset)) {
            const pair=P.el(st,'div','af-pair',group);
            P.field(st,'Minimum','min',q.validation.min,pair,'inspector');
            P.field(st,'Maximum','max',q.validation.max,pair,'inspector');
          }
        }
      },
      status: (base, S) => (st) => {
        const {P,ctx,spec}=S,m=ctx.model;
        let summary=ctx.stage.querySelector('.gtk-summary');
        if(!summary)summary=P.el(st,'aside','gtk-summary',ctx.stage);
        summary.replaceChildren();
        const facts=(title,rows)=>{
          P.el(st,'h3','',summary,title);
          for(const [icon,text] of rows){const row=P.el(st,'div','gtk-stat',summary);P.icon(st,icon,row,22);P.el(st,'span','',row,text);}
        };
        const count=Object.values(m.rules).reduce((n,v)=>n+Object.values(v).filter(x=>x!=='next').length,0);
        facts('Survey content',[['form',`${m.sectionOrder.length} sections`],['help',`${m.questions.length} questions`],['route',`${count} routing rules`]]);
        const sec=spec.sections.find(s=>s.id===m.ui.section);
        const ids=m.orders[sec.id];
        const routes=ids.reduce((n,id)=>n+Object.values(m.rules[id]||{}).filter(x=>x!=='next').length,0);
        facts(sec.title,[['list',`${ids.length} questions`],['route',`${routes} routing rules`]]);
      },
      painted: (base, S) => (st) => {
        st.root.querySelector('.gtk-answer-picker')?.remove();
      },
    },
  },
});
