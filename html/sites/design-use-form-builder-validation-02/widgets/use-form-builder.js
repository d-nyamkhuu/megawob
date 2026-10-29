// Design on the shared use-form-builder/editor template.
function formBuilderActionIcon(st,parent,name) {
  const span=st.ctx.util.el('span','vista-action-glyph',parent);
  const source=document.querySelector(`.vista-tool-icon.${name} svg`);
  if(source)span.appendChild(source.cloneNode(true));
  else span.innerHTML='<svg viewBox="0 0 28 28" width="23" height="23" aria-hidden="true"><path d="M7 3l7 7 7-7 4 4-7 7 7 7-4 4-7-7-7 7-4-4 7-7-7-7z" fill="#d52d1e" stroke="#a52920"/><path d="M7 5l7 7 7-7" fill="none" stroke="#ff9589"/></svg>';
  return span;
}
env.widget({
  task: 'use-form-builder',
  site: 'design-use-form-builder-validation-02',
  name: 'design',
  split: 'train',
  scenarios: ['validation'],
  template: 'use-form-builder/editor',
  design: {
    accent: '#087bd9', background: '#fdfefe', panel: '#fdfefe', text: '#101529',
    muted: '#4d5c70', line: '#a4b3c5', fontFamily: 'Segoe UI, Tahoma, Arial, sans-serif',
    fontSize: '18px', radius: '0px', inset: 0,
    parts: {
      topbar: (base, S) => st => {
        const {P}=S;
        document.querySelector('.vista-title').textContent=`FormBuilder - ${st.ctx.spec.title} (Draft)`;
        const old=document.querySelector('.vista-live-preview')||document.querySelector('.vista-tool-icon.preview')?.parentNode;
        if(old.classList.contains('vista-live-preview')){st.top=old;st.top.replaceChildren();}
        else {st.top=P.el(st,'div','vista-live-preview',old.parentNode);old.replaceWith(st.top);}
        const b=P.button(st,'Preview',st.top,{preview:true},null,'vista-preview-button');
        b.addEventListener('click',()=>P.commit(st,{ui:{preview:!st.ctx.model.ui.preview}}));
        P.el(st,'span','vista-monitor-icon',b);
      },
      layout: (base, S) => st => {
        const {P}=S;
        st.workspace=P.el(st,'div','vista-workspace',st.root);
        st.editor=P.el(st,'div','vista-editor',st.workspace);
        P.tabs(st);
        const panel=P.el(st,'section','vista-section-panel vista-pane',st.editor);
        P.el(st,'h3','vista-pane-title',panel,'Sections');
        st.sections=P.el(st,'div','af-sections',panel);
        const actions=P.el(st,'div','vista-section-actions',panel);
        for(const [label,glyph,cls] of [['Add section','✚','add'],['Delete section','×','delete'],['Move section up','⬆','up'],['Move section down','⬇','down']]) {
          const b=P.button(st,'',actions,null,null,'vista-action-icon '+cls);b.title=label;b.setAttribute('aria-label',label);
          formBuilderActionIcon(st,b,cls==='add'?'question':cls);
        }
        st.body=P.el(st,'div','af-body',st.editor);
        st.foot=P.el(st,'div','af-foot',st.root);
        const note=document.querySelector('.ref-panel');
        if(note)panel.insertBefore(note,actions);
      },
      sectionButton: (base, S) => (st,id) => {
        const {P}=S,m=st.ctx.model,sec=st.ctx.spec.sections.find(s=>s.id===id);
        const b=P.button(st,'',st.sections,{section:id},{ui:{section:id,selected:m.orders[id][0]||null}},m.ui.section===id?'on':'');
        P.el(st,'span','vista-document',b);
        const text=P.el(st,'span','vista-section-text',b);
        P.el(st,'span','af-section-label',text,sec.title);
        P.el(st,'small','',text,`${m.orders[id].length} questions`);b.title=sec.title;
      },
      questionPanels: (base, S) => st => {
        const {P}=S,m=st.ctx.model;
        const q=env.taskDef.helpers.question(m,m.ui.selected);
        const left=P.el(st,'section','vista-pane vista-question-panel',st.body);
        P.el(st,'h3','vista-pane-title',left,'Questions in this section:');
        const bar=P.el(st,'div','vista-question-actions',left);
        const add=P.button(st,'Add Question',bar,{add:true},{ui:{open:m.ui.open==='add'?null:'add'}},'vista-list-action add');
        formBuilderActionIcon(st,add,'question');
        if(q){const del=P.button(st,'Delete',bar,{remove:q.id},{remove:q.id},'vista-list-action delete');formBuilderActionIcon(st,del,'delete');}
        for(const [label,dir,glyph] of [['Move Up',-1,'⬆'],['Move Down',1,'⬇']]) {
          const b=P.button(st,label,bar,null,null,'vista-list-action move');formBuilderActionIcon(st,b,dir<0?'up':'down');
          b.addEventListener('click',()=>{const ids=[...st.ctx.model.orders[m.ui.section]],i=ids.indexOf(st.ctx.model.ui.selected),j=i+dir;if(i>=0&&j>=0&&j<ids.length){[ids[i],ids[j]]=[ids[j],ids[i]];P.commit(st,{order:['questions',ids]});}});
        }
        const canvas=P.pane(st,'canvas','af-canvas',left);
        P.canvas(st,canvas);
        const edit=P.el(st,'section','vista-pane vista-edit-panel',st.body);
        P.el(st,'h3','vista-pane-title',edit,'Edit Question');
        const inspector=P.pane(st,'inspector','af-inspector',edit);P.inspector(st,inspector);
        const index=P.el(st,'section','vista-pane vista-index',st.body);
        P.el(st,'h3','vista-pane-title',index,'Form items');
        const searchWrap=P.el(st,'div','vista-search',index);
        const search=P.el(st,'input','',searchWrap);search.placeholder='Search';search.setAttribute('aria-label','Search form items');
        P.icon(st,'search',searchWrap,20);
        const cols=P.el(st,'div','vista-index-columns',index);P.el(st,'span','',cols,'Type');P.el(st,'span','',cols,'Label');
        const tree=P.el(st,'div','vista-tree',index);
        for(const id of m.sectionOrder) {
          const sec=st.ctx.spec.sections.find(s=>s.id===id);
          const group=P.el(st,'div','vista-tree-group',tree);
          P.el(st,'span','vista-tree-toggle',group,'◢');P.el(st,'span','',group,`${sec.title} (${m.orders[id].length})`);
          for(const qid of m.orders[id]) {
            const item=env.taskDef.helpers.question(m,qid);if(!item)continue;
            const row=P.button(st,'',tree,null,{ui:{section:id,selected:qid}},'vista-tree-row'+(m.ui.selected===qid?' selected':''));
            const glyph=item.type==='Number'?'123':item.options.length?'◉':/email/i.test(item.title)?'@':'ABC';
            P.el(st,'span','vista-type-icon'+(glyph==='@'||glyph==='◉'?' symbol':''),row,glyph);
            const label=P.el(st,'span','vista-tree-label',row,item.title);
            st.syncers.push(()=>{label.textContent=env.taskDef.helpers.question(st.ctx.model,qid)?.title||'';});
          }
        }
        search.addEventListener('input',()=>{for(const row of tree.querySelectorAll('.vista-tree-row'))row.hidden=!row.textContent.toLowerCase().includes(search.value.toLowerCase());});
      },
      canvasHeader: () => () => {},
      addControl: () => () => {},
      questionCard: (base, S) => (st,parent,sec,id,q) => {
        const {P}=S,m=st.ctx.model;
        const card=P.el(st,'article','af-card'+(m.ui.selected===id?' selected':''),parent);
        card.tabIndex=0;card.setAttribute('role','button');card.setAttribute('aria-label',q.title);P.register(st,{question:id},card,'canvas');
        const select=()=>P.commit(st,{ui:{selected:id}});
        card.addEventListener('click',select);card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select();}});
        const glyph=q.type==='Number'?'123':q.options.length?'◉':/email/i.test(q.title)?'@':'ABC';
        P.el(st,'span','vista-type-icon'+(glyph==='@'||glyph==='◉'?' symbol':''),card,glyph);
        P.el(st,'span','vista-question-number',card,`${m.orders[sec.id].indexOf(id)+1}.`);
        const text=P.el(st,'div','vista-question-text',card),name=P.el(st,'div','af-card-title',text,q.title);
        P.el(st,'div','vista-question-type',text,q.type==='Paragraph'?'Long text':q.type);
        st.syncers.push(()=>{name.textContent=env.taskDef.helpers.question(st.ctx.model,id)?.title||'';});P.questionDecorated(st,card,q);return card;
      },
      inspector: (base, S) => (st,p) => {
        const q=env.taskDef.helpers.question(st.ctx.model,st.ctx.model.ui.selected);if(!q)return;
        if(st.ctx.model.ui.tab==='logic'){S.P.routing(st,p,q);return;}
        S.P.properties(st,p,q);S.P.validation(st,p,q);
        const response=S.P.el(st,'div','vista-response',p);
        S.P.el(st,'h3','vista-legend',response,'Response options');
        for(const text of ['Allow multiple answers','Show help text to respondents']) {
          const label=S.P.el(st,'label','vista-local-checkbox',response),input=S.P.el(st,'input','',label);input.type='checkbox';S.P.el(st,'span','',label,text);
        }
      },
      properties: (base, S) => (st,p,q) => {
        const title=S.P.field(st,'Question text:','title',q.title,p,'inspector',true);
        title.parentElement.classList.add('vista-question-field');
        S.P.el(st,'span','vista-text-scroll',title.parentElement);
        S.P.select(st,'Question type:','type',q.type,p,'inspector');
        if(q.options.length)S.P.field(st,'Answer options:','options',q.options.join('\n'),p,'inspector',true);
      },
      select: (base, S) => (st,label,name,value,parent,paneName) => {
        const b=base(st,label,name,value,parent,paneName);
        if(name==='type') {
          const glyph=value==='Number'?'123':value==='Multiple choice'||value==='Checkboxes'?'◉':'ABC';
          const icon=S.P.el(st,'span','vista-type-icon vista-select-type-icon',b,glyph);
          b.insertBefore(icon,b.firstChild);
        }
        return b;
      },
      validation: (base, S) => (st,p,q) => {
        const group=S.P.el(st,'div','vista-validation',p);base(st,group,q);
        group.querySelector('.af-divider')?.remove();
        const legend=group.querySelector('h3');legend.textContent='Validation';legend.className='vista-legend';
        group.querySelector('.af-label').textContent='Validation preset:';
        const labels=group.querySelectorAll('.af-pair .af-label');
        labels.forEach((label,i)=>label.textContent=q.validation.preset==='Text length'?(i?'Maximum length:':'Minimum length:'):(i?'Maximum value:':'Minimum value:'));
        group.querySelectorAll('.af-desc,.af-rule-summary,.af-notice').forEach(node=>node.remove());
      },
      toggle: (base, S) => (st,label,hint,name,on,parent,paneName) => {
        const {P}=S,row=P.el(st,'div','vista-check-row',parent);
        const b=P.button(st,on?'✓':'',row,{toggle:name},{toggle:name},'vista-checkbox');
        b.setAttribute('role','checkbox');b.setAttribute('aria-label',label);b.setAttribute('aria-checked',String(on));P.register(st,{toggle:name},b,paneName);
        const text=P.el(st,'span','',row,name==='required'?'Value is required':label);text.addEventListener('click',()=>b.click());return b;
      },
    },
  },
});
