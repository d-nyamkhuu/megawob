// Design on the shared use-form-builder/editor template.
env.widget({
  task: 'use-form-builder',
  site: 'design-use-form-builder-reorder-01',
  name: 'design',
  split: 'train',
  scenarios: ['reorder'],
  template: 'use-form-builder/editor',
  design: {
    accent:'#1766b4', background:'#ffffff', panel:'#e9e9e9', text:'#10121a', muted:'#555d65', line:'#a4a7ab', fontFamily:'Arial, Helvetica, sans-serif', fontSize:'18px', radius:'0px', inset:0, rowMin:49, rowMax:49,
    parts: {
      button: (base,S) => (st,label,parent,target,action,cls='') => {
        const b=base(st,label,parent,target,action,cls);
        const symbol=label.match(/^([✚✖⬆⬇])\s+/);
        if(symbol){b.replaceChildren();S.P.el(st,'span','classic-tool-symbol symbol-'+({'✚':'add','✖':'delete','⬆':'up','⬇':'down'}[symbol[1]]),b,symbol[1]);S.P.el(st,'span','',b,label.slice(symbol[0].length));}
        return b;
      },
      topbar: (base, S) => st => {
        base(st); st.top.classList.add('classic-original-top');
        const title=document.querySelector('.flash-titlebar');
        if(title?.firstChild)title.firstChild.textContent='▣  '+st.ctx.spec.title;
      },
      layout: (base, S) => st => {
        const P=S.P;
        st.instructionPanel=document.querySelector('.ref-panel');
        st.workspace=P.el(st,'div','af-workspace classic-workspace',st.root);
        const rail=P.el(st,'aside','classic-rail',st.workspace);
        st.nav=P.el(st,'div','classic-navigation',rail);
        const navArt=[
          '<path fill="white" d="M6 2h20l7 7v32H6z"/><path fill="#c5daff" d="M26 2v8h7"/><path fill="none" stroke="#225cb4" stroke-width="2" d="M12 13h4m4 0h8m-16 6h4m4 0h8m-16 6h4m4 0h8m-16 6h4m4 0h8"/>',
          '<path fill="#f3ca35" d="M3 6h26v31H3z"/><path fill="#71bfe8" d="M6 9h20v25H6z"/><path fill="#ffbd20" d="M8 31L30 3l6 5-22 28-10 5z"/><path fill="#d84824" d="M28 5l3-4 7 5-3 4z"/><path fill="#eee" d="M8 31l6 5-10 5z"/>',
          '<path fill="#87aabd" d="M16 2h8l1 6 5 2 5-3 5 7-5 4v6l5 4-4 7-6-2-5 3-1 6h-8l-1-6-5-2-5 3-4-7 5-4v-6l-5-3 4-7 5 2 5-3z"/><circle fill="#dfe9ed" cx="20" cy="22" r="7"/>',
          '<path stroke="#3e3530" stroke-width="7" d="M24 29l12 12"/><circle fill="#62c6ef" cx="16" cy="17" r="13"/><circle fill="#a0e4fa" stroke="#164c70" cx="16" cy="17" r="10"/><path fill="none" stroke="white" stroke-width="2" d="M9 17a7 7 0 0 1 8-7"/>',
          '<path fill="#6adb3b" d="M5 22h8v20H5z"/><path fill="#4bcbec" d="M16 7h8v35h-8z"/><path fill="#ec3a30" d="M27 16h8v26h-8z"/><path fill="none" d="M3 4v39h35"/>'
        ];
        [['Form Builder','form'],['Themes','palette'],['Response Settings','settings'],['Preview','eye'],['Reports','grid']].forEach(([label,icon],i)=>{
          const b=P.button(st,'',st.nav,null,null,'classic-nav'+(i===0?' current':''));
          const art=P.el(st,'span','classic-nav-art',b);art.innerHTML='<svg viewBox="0 0 42 46" aria-hidden="true" stroke="#142438" stroke-width="1.8" stroke-linejoin="round">'+navArt[i]+'</svg>'; P.el(st,'span','',b,label);
          b.addEventListener('click',()=>{if(i===0)P.commit(st,{ui:{tab:'questions'}});else if(i===1)P.drawer(st,'theme');else if(i===2)P.commit(st,{ui:{tab:'settings'}});else if(i===3)P.commit(st,{ui:{preview:!st.ctx.model.ui.preview}});else P.drawer(st,'responses');});
          if(i===3)P.register(st,{preview:true},b);
        });
        st.editor=P.el(st,'div','af-editor classic-editor',st.workspace);
        P.tabs(st); rail.append(st.tabs);
        st.sections=P.el(st,'div','af-sections',st.editor);
        st.body=P.el(st,'div','af-body classic-body',st.editor);
        st.foot=P.el(st,'div','af-foot',st.root);
      },
      sectionButton: () => () => {},
      paint: (base,S) => st => {
        if(st.instructionPanel)st.root.append(st.instructionPanel);
        base(st);
      },
      questionPanels: (base,S) => st => S.P.arrange(st),
      arrange: (base,S) => st => {
        const P=S.P, m=st.ctx.model, spec=st.ctx.spec, F=env.taskDef;
        const builder=P.el(st,'div','classic-builder',st.body);
        P.el(st,'div','classic-caption',builder,'Form Builder');
        const work=P.el(st,'div','classic-builder-content',builder);
        const a=P.pane(st,'canvas','classic-section-pane',work);
        P.el(st,'h3','classic-heading',a,'Sections');
        const sectionTools=P.el(st,'div','classic-tools',a);
        P.button(st,'✚  Add Section',sectionTools,null,null);P.button(st,'✖  Delete',sectionTools,null,null);
        P.orderList(st,'sections',a,m.sectionOrder,id=>spec.sections.find(s=>s.id===id).title);
        const center=P.el(st,'div','classic-center',work);
        const b=P.pane(st,'inspector','classic-question-pane',center);
        P.el(st,'h3','classic-heading',b,'Questions in this section');
        const tools=P.el(st,'div','classic-tools',b);
        P.button(st,'✚  Add Question',tools,{add:true},{ui:{open:m.ui.open==='add'?null:'add'}});
        const q=F.helpers.question(m,m.ui.selected);
        P.button(st,'✖  Delete',tools,q?{remove:q.id}:null,q?{remove:q.id}:null);
        for(const [label,delta] of [['⬆  Move Up',-1],['⬇  Move Down',1]]){
          const button=P.button(st,label,tools,null,null);
          button.addEventListener('click',()=>{const order=[...st.ctx.model.orders[st.ctx.model.ui.section]],i=order.indexOf(st.ctx.model.ui.selected),j=i+delta;if(i>=0&&j>=0&&j<order.length){[order[i],order[j]]=[order[j],order[i]];P.commit(st,{order:['questions',order]});}});
        }
        P.orderList(st,'questions',b,m.orders[m.ui.section],id=>F.helpers.question(m,id).title);
        const edit=P.pane(st,'edit','classic-edit',center);
        P.el(st,'h3','classic-heading',edit,'Edit Question');
        const fields=P.el(st,'div','classic-edit-fields',edit);
        if(q){
          P.select(st,'Question type:','type',q.type,fields,'edit');
          P.field(st,'Question text:','title',q.title,fields,'edit');
          const help=P.el(st,'label','af-field',fields);P.el(st,'span','af-label',help,'Help text (optional):');P.el(st,'input','af-input',help).setAttribute('aria-label','Help text (optional)');
          P.el(st,'div','af-divider',fields);
          P.toggle(st,'Require a response','','required',q.validation.required,fields,'edit');
          P.select(st,'Validation:','preset',q.validation.preset,fields,'edit');
          const error=P.el(st,'label','af-field',fields);P.el(st,'span','af-label',error,'Error message:');const err=P.el(st,'input','af-input',error);err.value=q.validation.preset==='Email address'?'Please enter a valid email address.':'';
          P.el(st,'div','af-divider',fields);
          const policy=P.el(st,'div','af-field',fields);P.el(st,'span','af-label',policy,'Response policy:');P.button(st,'Store with response     ▾',policy,null,null,'af-select');
        }
        const details=P.pane(st,'details','classic-details',st.body);
        if(st.instructionPanel)details.append(st.instructionPanel);
        P.el(st,'div','classic-caption',details,'Question Properties');
        if(q)P.inspector(st,details);
      },
      orderRow: (base,S) => (st,name,box,id,labelOf,rowHeight) => {
        const row=base(st,name,box,id,labelOf,rowHeight),P=S.P;
        if(name==='sections')P.register(st,{section:id},row,'canvas');
        else {
          const q=env.taskDef.helpers.question(st.ctx.model,id);
          row.classList.toggle('selected',st.ctx.model.ui.selected===id);
          P.register(st,{question:id},row,'inspector');
          row.tabIndex=0;row.setAttribute('role','button');row.setAttribute('aria-label',q.title);
          const select=()=>P.commit(st,{ui:{selected:id}});
          row.addEventListener('click',e=>{if(!e.target.closest('.af-grip'))select();});
          row.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select();}});
          const symbol=P.el(st,'span','classic-type-icon',row);
          symbol.innerHTML=q.type==='Number'?'<u>123</u>':q.options.length?'<svg viewBox="0 0 30 28" aria-hidden="true"><path fill="#3683d5" stroke="#003c90" stroke-width="1.6" d="M2 24v-5l7-5 7 5v5zm15-1v-5l5-4 6 4v5z"/><circle fill="#9ac9f4" stroke="#003c90" stroke-width="1.6" cx="9" cy="9" r="5"/><circle fill="#9ac9f4" stroke="#003c90" stroke-width="1.6" cx="22" cy="10" r="4"/></svg>':q.type==='Paragraph'?'<svg viewBox="0 0 30 28" aria-hidden="true"><path fill="#fff" stroke="#064b9c" stroke-width="2" d="M4 2h21v24H4z"/><path stroke="#064b9c" stroke-width="2" d="M8 8h13M8 13h13M8 18h10"/></svg>':'<svg viewBox="0 0 30 28" aria-hidden="true"><path fill="#b6dbff" stroke="#064b9c" stroke-width="2" d="M2 6h26v18H2z"/><path fill="none" stroke="#064b9c" stroke-width="2" d="M2 6l13 11L28 6M2 24l9-9m17 9l-9-9"/></svg>';
          row.insertBefore(symbol,row.querySelector('.af-order-label'));
        }
        return row;
      },
      inspector: (base,S) => (st,p) => {
        const P=S.P,q=env.taskDef.helpers.question(st.ctx.model,st.ctx.model.ui.selected);if(!q)return;
        const inner=P.el(st,'div','classic-details-inner',p);
        if(st.ctx.model.ui.tab==='logic'){P.routing(st,inner,q);return;}
        const group=(label)=>P.el(st,'h3','classic-group-caption',inner,'▾  '+label);
        group('General');
        const type=P.el(st,'label','af-field',inner);P.el(st,'span','af-label',type,'Question type:');P.el(st,'div','classic-readonly',type,q.type);
        P.field(st,'Question text:','title',q.title,inner,'details');
        const help=P.el(st,'label','af-field',inner);P.el(st,'span','af-label',help,'Help text:');P.el(st,'input','af-input classic-help',help).setAttribute('aria-label','Help text');
        if(q.options.length)P.field(st,'Answer options · one per line','options',q.options.join('\n'),inner,'details',true);
        group('Validation');
        P.toggle(st,'Required:','','required',q.validation.required,inner,'details');
        P.select(st,'Rule:','preset',q.validation.preset,inner,'details');
        if(['Number range','Text length'].includes(q.validation.preset)){const pair=P.el(st,'div','af-pair',inner);P.field(st,'Minimum','min',q.validation.min,pair,'details');P.field(st,'Maximum','max',q.validation.max,pair,'details');}
        const error=P.el(st,'label','af-field classic-error-field',inner);P.el(st,'span','af-label',error,'Error message:');const err=P.el(st,'input','af-input',error);err.value=q.validation.preset==='Email address'?'Please enter a valid email address.':'';
        group('Response Policy');
        const policy=P.el(st,'div','af-field classic-policy',inner);P.el(st,'span','af-label',policy,'Store response as:');P.button(st,'Store with response   ▾',policy,null,null,'af-select');
        group('Advanced');
        const id=P.el(st,'div','af-field classic-id',inner);P.el(st,'span','af-label',id,'ID:');P.el(st,'div','classic-readonly',id,q.id);
      },
    },
  },
});
