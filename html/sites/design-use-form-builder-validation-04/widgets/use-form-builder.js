// Design on the shared use-form-builder/editor template.
env.widget({
  task: 'use-form-builder',
  site: 'design-use-form-builder-validation-04',
  name: 'design',
  split: 'train',
  scenarios: ['validation'],
  template: 'use-form-builder/editor',
  design: {
    inset: 0, radius: '0px', fontSize: '18px', fontFamily: '"Courier New", monospace', accent: '#ffda43', background: '#f8f8f8', panel: '#ffffff', text: '#111111', muted: '#666873', line: '#171717',
    parts: {
      topbar: (base, S) => st => {
        const {P,ctx}=S;
        const band=P.el(st,'div','fs-band',st.root);
        const top=P.el(st,'section','af-top',band);
        st.top=top;
        const intro=P.el(st,'div','fs-intro',top);
        P.el(st,'h1','fs-title',intro,ctx.spec.title);
        const note=document.querySelector('.ref-instruction');
        if(note) intro.append(note);
        else P.el(st,'p','fs-description',intro,'Internal form for event attendees, studio visitors and program participants.');
        const facts=P.el(st,'div','fs-facts',intro);
        st.fsFacts=facts;
        const status=P.el(st,'div','fs-status',top);
        P.el(st,'div','',status,'Form status');
        const draft=P.el(st,'div','fs-draft',status);
        P.el(st,'span','fs-dot',draft);P.el(st,'span','',draft,'Draft');P.el(st,'span','',draft,'▼');
        P.el(st,'small','',status,'Last edited');P.el(st,'div','fs-date',status,'Apr 12, 2019 10:24 AM');
        P.el(st,'small','',status,'Created');P.el(st,'div','fs-date',status,'Apr 10, 2019 3:17 PM');
        const poster=P.el(st,'div','fs-poster',top);
        const svg=ctx.util.svg('svg',{viewBox:'0 0 200 180','aria-hidden':'true'},poster);
        ctx.util.svg('circle',{cx:66,cy:65,r:59,fill:'#171717'},svg);
        for(const r of [50,44,38])ctx.util.svg('circle',{cx:66,cy:65,r,fill:'none',stroke:'#ffd944','stroke-width':'.7','stroke-dasharray':'1 5 9 3'},svg);
        for(let i=0;i<80;i++) {
          const angle=i*2.399963,r=24+(i*19%33),x=66+Math.cos(angle)*r,y=65+Math.sin(angle)*r;
          ctx.util.svg('path',{d:`M${x.toFixed(2)} ${y.toFixed(2)}l${(Math.sin(angle)*2).toFixed(2)} ${(Math.cos(angle)*2).toFixed(2)}`,stroke:'#ffd944','stroke-width':i%3===0?'.8':'.4'},svg);
        }
        ctx.util.svg('circle',{cx:66,cy:65,r:20,fill:'#ffdc43'},svg);
        ctx.util.svg('circle',{cx:66,cy:65,r:3,fill:'#111'},svg);
        ctx.util.svg('path',{d:'M169 14 104 31 124 43 91 77 122 68 106 92 158 46 136 46Z',fill:'#ffe05b',stroke:'#171717','stroke-width':3},svg);
        const posterName=P.el(st,'b','fs-poster-name',poster);
        for(const word of ctx.spec.title.split(' · ')[0].toUpperCase().split(' ')) {
          const line=P.el(st,'span','',posterName,word);
          line.style.setProperty('--poster-font',(Math.min(30,140/word.length))+'px');
        }
        const panel=document.querySelector('.ref-panel');
        if(panel){band.classList.add('has-panel');band.append(panel);}
        const toast=document.querySelector('.ref-note');
        if(toast){band.classList.add('has-toast');band.append(toast);}
      },
      layout: (base,S) => st => {
        const {P}=S;
        st.workspace=P.el(st,'div','af-workspace',st.root);
        const left=P.el(st,'aside','fs-sections',st.workspace);
        const heading=P.el(st,'div','fs-pane-head',left);
        const sectionTitle=P.el(st,'h3','',heading);
        const arrange=P.button(st,'Sections',sectionTitle,{tab:'arrange'},{ui:{tab:'arrange'}},'fs-arrange');
        arrange.title='Arrange';arrange.setAttribute('aria-label','Arrange');st.fsArrange=arrange;
        const sectionTools=P.el(st,'div','fs-section-tools',heading);
        const add=P.button(st,'＋ Add section',sectionTools,null,null,'fs-add');
        add.addEventListener('click',()=>P.drawer(st,'forms'));
        st.sections=P.el(st,'div','af-sections',left);
        st.editor=P.el(st,'div','af-editor',st.workspace);
        P.tabs(st);
        st.body=P.el(st,'div','af-body',st.editor);
        st.foot=P.el(st,'div','af-foot',st.root);
      },
      tabs: (base,S) => st => {
        const {P}=S;
        document.querySelector('.fs-top-tabs')?.remove();
        const tabs=P.el(st,'nav','af-tabs fs-top-tabs',document.querySelector('.ref-task'));
        tabs.setAttribute('aria-label','Form editor');
        const tabButtons={arrange:st.fsArrange};
        for(const [id,label] of [['questions','Build'],['logic','Logic']]) {
          tabButtons[id]=P.button(st,label,tabs,{tab:id},{ui:{tab:id}});tabButtons[id].setAttribute('role','tab');
        }
        const share=P.button(st,'Share',tabs);share.addEventListener('click',()=>P.drawer(st,'share'));
        const responses=P.button(st,'Responses',tabs);responses.addEventListener('click',()=>P.drawer(st,'responses'));
        tabButtons.settings=P.button(st,'Settings',tabs,{tab:'settings'},{ui:{tab:'settings'}});tabButtons.settings.setAttribute('role','tab');
        const preview=P.button(st,'',tabs,{preview:true},{ui:{preview:!S.ctx.model.ui.preview}},'fs-preview');
        P.icon(st,'eye',preview,24);P.el(st,'span','',preview,'Preview');
        document.querySelector('.ref-tools').before(tabs);
        Object.assign(st,{tabs,tabButtons});
      },
      icon: (base,S) => (st,name,parent,size=16) => {
        const svg=base(st,name,parent,size);
        svg.style.width=size+'px';svg.style.height=size+'px';
        const filled={
          grid:'M1 2h3v3H1zM7 2h16v3H7zM1 10h3v3H1zM7 10h16v3H7zM1 18h3v3H1zM7 18h16v3H7z',
          people:'M8 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8M17 3a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7M1 23v-5a7 7 0 0 1 14 0v5zM16 23v-5a8 8 0 0 0-2-5 7 7 0 0 1 9 6v4z',
          chevron:'M4 8h16l-8 11z',
          paragraph:'M1 3h22v4H1zM1 11h22v4H1zM1 19h13v4H1z',
        };
        if(filled[name]){svg.replaceChildren();st.ctx.util.svg('path',{d:filled[name],fill:'currentColor',stroke:'none'},svg);}
        if(name==='form'){svg.replaceChildren();st.ctx.util.svg('path',{d:'M4 2h10l6 6v14H4zM14 2v6h6M8 12h8M8 16h8M8 19h8',fill:'none',stroke:'currentColor','stroke-width':2},svg);}
        return svg;
      },
      questionPanels: (base,S) => st => {
        const {P,ctx}=S;
        const heading=P.el(st,'div','fs-pane-head',st.body);
        P.el(st,'h3','',heading,'Questions in this section');
        const add=P.button(st,'＋ Add question',heading,{add:true},{ui:{open:ctx.model.ui.open==='add'?null:'add'}},'fs-add');
        P.register(st,{add:true},add,'canvas');
        const list=P.pane(st,'canvas','af-canvas');
        const sec=ctx.spec.sections.find(s=>s.id===ctx.model.ui.section);
        for(const id of ctx.model.orders[sec.id]) {
          const q=env.taskDef.helpers.question(ctx.model,id);if(q)P.questionCard(st,list,sec,id,q);
        }
        const inspector=P.pane(st,'inspector','af-inspector');
        P.inspector(st,inspector);
      },
      questionCard: (base,S) => (st,parent,sec,id,q) => {
        const {P,ctx}=S;
        const card=P.el(st,'article','af-card'+(ctx.model.ui.selected===id?' selected':''),parent);
        card.tabIndex=0;card.setAttribute('role','button');card.setAttribute('aria-label',q.title);
        P.register(st,{question:id},card,'canvas');
        const choose=()=>P.commit(st,{ui:{selected:id}});
        card.addEventListener('click',choose);card.addEventListener('keydown',e=>{if(e.target===card&&(e.key==='Enter'||e.key===' ')){e.preventDefault();choose();}});
        P.el(st,'span','fs-question-no',card,String(ctx.model.orders[sec.id].indexOf(id)+1));
        const icon=P.el(st,'span','fs-type-icon',card);
        if(q.type==='Number')P.el(st,'b','fs-number-icon',icon,'123');
        else P.icon(st,P.typeIcon(st,q.type),icon,25);
        const title=P.el(st,'b','af-card-title',card,q.title);
        const type=P.el(st,'span','fs-question-type',card,q.type);
        const required=P.el(st,'span','fs-required',card);
        const more=P.button(st,'⋮',card,{remove:id},{remove:id},'fs-more fs-delete');
        more.title='Delete question';more.setAttribute('aria-label','Delete question');
        more.addEventListener('click',e=>e.stopPropagation());P.register(st,{remove:id},more,'canvas');
        st.syncers.push(()=>{const now=env.taskDef.helpers.question(ctx.model,id);if(!now)return;title.textContent=now.title;type.textContent=now.type;required.textContent=now.validation.required?'Required':'Optional';});
        P.questionDecorated(st,card,q);return card;
      },
      inspector: (base,S) => (st,p) => {
        if(S.ctx.model.ui.tab==='logic'){base(st,p);return;}
        const {P,ctx}=S,q=env.taskDef.helpers.question(ctx.model,ctx.model.ui.selected);
        if(!q){P.el(st,'div','af-empty',p,'Select a question.');return;}
        const head=P.el(st,'div','fs-edit-head',p);
        const title=P.el(st,'h2','',head,q.title);
        st.syncers.push(()=>{title.textContent=env.taskDef.helpers.question(ctx.model,q.id)?.title||'';});
        P.select(st,'Question type','type',q.type,head,'inspector');
        const grid=P.el(st,'div','fs-edit-grid',p);
        const fields=P.el(st,'div','fs-edit-fields',grid);
        P.field(st,'Question text','title',q.title,fields,'inspector');
        const help=P.el(st,'label','af-field fs-help',fields);P.el(st,'span','af-label',help,'Help text (optional)');
        const text=P.el(st,'textarea','af-input',help);text.placeholder='Add help text for respondents...';text.setAttribute('aria-label','Help text (optional)');
        if(q.options.length)P.field(st,'Answer options · one per line','options',q.options.join('\n'),fields,'inspector',true);
        const validation=P.el(st,'div','fs-validation',grid);P.validation(st,validation,q);
      },
      validation: (base,S) => (st,p,q) => {
        base(st,p,q);
        p.querySelector('h3').textContent='Validation';
        p.querySelector('.af-field .af-label').textContent='Validation preset';
        const pair=p.querySelector('.af-pair');
        if(pair) {const labels=pair.querySelectorAll('.af-label');if(q.validation.preset==='Number range'){labels[0].textContent='Minimum value';labels[1].textContent='Maximum value';}}
        const toggle=p.querySelector('.af-toggle-row');
        toggle.querySelector('b').textContent='This field is required';
        p.addEventListener('click',e=>{
          if(!e.target.closest('.af-select'))return;
          const menu=document.querySelector('.af-menu');
          if(!menu)return;
          menu.style.maxHeight='none';
          menu.style.overflow='visible';
          const pane=document.querySelector('.af-inspector');
          const r=menu.getBoundingClientRect(),b=pane.getBoundingClientRect();
          if(r.bottom>b.bottom){menu.style.transform='translateY(-100%)';S.ctx.reanchor();}
        });
      },
      sectionButton: (base,S) => (st,id) => {
        const {P,ctx}=S,sec=ctx.spec.sections.find(s=>s.id===id);
        const button=P.button(st,'',st.sections,{section:id},{ui:{section:id,selected:ctx.model.orders[id][0]||null}},ctx.model.ui.section===id?'on':'');
        const grip=P.el(st,'span','fs-section-grip',button);P.icon(st,'grip',grip,26);
        const label=P.el(st,'span','fs-section-label',button);P.el(st,'b','',label,sec.title);
        const count=ctx.model.orders[id].length;P.el(st,'small','',label,`${count} question${count===1?'':'s'}`);
        P.el(st,'span','fs-more',button,'⋮');button.title=sec.title;
      },
      status: (base,S) => st => {
        base(st);
        const {P,ctx}=S;
        st.fsFacts.replaceChildren();
        for(const [icon,text] of [['form',`${ctx.model.sectionOrder.length} sections`],['grid',`${ctx.model.orders[ctx.model.ui.section].length} questions`],['people','0 responses']]) {
          const fact=P.el(st,'span','fs-fact',st.fsFacts);P.icon(st,icon,fact,28);P.el(st,'span','',fact,text);
        }
      },
      painted: (base,S) => st => {
        base(st);S.P.register(st,{tab:'arrange'},st.fsArrange);
      },
    },
  },
});
