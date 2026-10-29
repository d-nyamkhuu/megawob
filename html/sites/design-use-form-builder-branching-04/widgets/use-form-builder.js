// Design on the shared use-form-builder/editor template.
env.widget({
  task: 'use-form-builder',
  site: 'design-use-form-builder-branching-04',
  name: 'design',
  split: 'train',
  scenarios: ['branching'],
  template: 'use-form-builder/editor',
  design: {
    inset: 0, radius: '0px', fontSize: '16px', brand: 'Velvet Forms',
    parts: {
      icon: (base,S) => (st,name,parent,size=16) => {
        const paths={
          textfield:['M5 5h15M5 5v14h15M9 10h11'],
          choicefield:['M4 6h16v13H4zM8 12h8'],
          radio:['M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0','M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0'],
        };
        if(!paths[name]) return base(st,name,parent,size);
        const svg=st.ctx.util.svg('svg',{viewBox:'0 0 24 24',width:size,height:size,class:'af-icon','aria-hidden':'true'},parent);
        for(const d of paths[name]) st.ctx.util.svg('path',{d},svg);
        return svg;
      },
      topbar: (base, S) => (st) => {
        st.top = S.P.el(st, 'div', 'af-top vf-hidden-top', st.root);
        document.querySelector('.vf-form-title').textContent=st.ctx.spec.title;
        document.querySelector('.vf-record.selected strong').textContent=st.ctx.spec.title;
      },
      layout: (base, S) => (st) => {
        const P = S.P;
        st.workspace = P.el(st, 'div', 'af-workspace', st.root);
        st.editor = P.el(st, 'div', 'af-editor vf-editor', st.workspace);
        P.tabs(st);
        const desk = P.el(st, 'div', 'vf-desk', st.editor);
        const side = P.el(st, 'aside', 'vf-section-panel', desk);
        const head = P.el(st, 'div', 'vf-panel-heading', side);
        P.el(st, 'h3', '', head, 'Sections');
        const arrange=P.iconButton(st, 'Arrange sections', head, 'plus', () => P.commit(st, {ui:{tab:'arrange'}}));
        P.register(st,{tab:'arrange'},arrange);
        st.arrangeButton=arrange;
        st.sections = P.el(st, 'div', 'af-sections', side);
        st.body = P.el(st, 'div', 'af-body', desk);
        st.foot = P.el(st, 'div', 'af-foot vf-hidden-foot', st.root);
      },
      tabs: (base, S) => (st) => {
        const P = S.P, tabs = P.el(st, 'nav', 'af-tabs', st.editor);
        st.tabs = tabs;
        st.tabButtons = {};
        const build = P.button(st, 'Build', tabs, {tab:'logic'}, {ui:{tab:'logic'}});
        build.dataset.vfLogic = 'true';
        st.tabButtons.logic = build;
        st.tabButtons.settings = P.button(st, 'Settings', tabs, {tab:'settings'}, {ui:{tab:'settings'}});
        const preview = P.button(st, 'Preview', tabs, {preview:true}, null);
        preview.addEventListener('click', () => P.commit(st, {ui:{preview:!st.ctx.model.ui.preview}}));
        const responses = P.button(st, 'Responses', tabs, null, null);
        responses.addEventListener('click', () => P.drawer(st, 'responses'));
        st.questionRecovery=P.button(st,'Back to questions',tabs,null,{ui:{tab:'questions'}},'vf-question-recovery');
      },
      sectionButton: (base, S) => (st, id) => {
        const P = S.P, m = st.ctx.model;
        const section = st.ctx.spec.sections.find(s => s.id === id);
        const b = P.button(st, '', st.sections, {section:id}, {ui:{section:id,selected:m.orders[id][0]||null}}, m.ui.section===id?'on':'');
        P.el(st, 'span', 'vf-section-number', b, String(m.sectionOrder.indexOf(id)+1));
        P.el(st, 'span', 'af-section-label', b, section.title);
        P.el(st, 'span', 'vf-section-grip', b, '⠿');
        b.title = section.title;
      },
      questionPanels: (base, S) => (st) => {
        const P = S.P;
        const canvas = P.pane(st, 'canvas', 'af-canvas');
        P.canvas(st, canvas);
        const inspector = P.pane(st, 'inspector', 'af-inspector');
        P.inspector(st, inspector);
      },
      canvas: (base, S) => (st, parent) => {
        const P = S.P, m = st.ctx.model;
        const sec = st.ctx.spec.sections.find(s=>s.id===m.ui.section);
        const head = P.el(st, 'div', 'vf-panel-heading', parent);
        P.el(st, 'h3', '', head, 'Questions in this section');
        const add = P.button(st, 'Add question', head, {add:true}, {ui:{open:m.ui.open==='add'?null:'add'}}, 'vf-outline');
        P.icon(st, 'plus', add);
        P.register(st, {add:true}, add, 'canvas');
        for (const id of m.orders[sec.id]) {
          const q = env.taskDef.helpers.question(m,id);
          if(q) P.questionCard(st,parent,sec,id,q);
        }
      },
      questionCard: (base, S) => (st, parent, sec, id, q) => {
        const P = S.P, m = st.ctx.model;
        const card = P.el(st, 'article', 'af-card vf-question-row'+(m.ui.selected===id?' selected':''), parent);
        card.tabIndex=0; card.setAttribute('role','button'); card.setAttribute('aria-label',q.title);
        P.register(st,{question:id},card,'canvas');
        const choose = () => P.commit(st,{ui:{selected:id}});
        card.addEventListener('click',choose);
        card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose();}});
        P.el(st,'span','vf-question-number',card,String(m.orders[sec.id].indexOf(id)+1));
        const fieldIcon=P.el(st,'span','vf-field-icon',card);
        P.icon(st,q.options.length?'choicefield':'textfield',fieldIcon,21);
        const title=P.el(st,'span','vf-question-title',card,q.title);
        const type=P.el(st,'span','vf-question-type',card);
        P.icon(st,q.type==='Short text'?'paragraph':P.typeIcon(st,q.type),type,22);
        const typeLabel=P.el(st,'span','',type,q.type);
        P.icon(st,'more',card,22);
        st.syncers.push(()=>{const now=env.taskDef.helpers.question(st.ctx.model,id);if(now){title.textContent=now.title+(now.validation.required?' *':'');typeLabel.textContent=now.type;}});
        P.questionDecorated(st,card,q);
        return card;
      },
      inspector: (base, S) => (st,p) => {
        const P=S.P, m=st.ctx.model, q=env.taskDef.helpers.question(m,m.ui.selected);
        if(!q) return base(st,p);
        const head=P.el(st,'div','vf-question-heading',p);
        P.el(st,'h2','',head,q.title);
        P.el(st,'small','',head,`Question ${m.orders[q.section].indexOf(q.id)+1} of ${m.orders[q.section].length}`);
        const tabs=P.el(st,'div','vf-question-tabs',p);
        for(const [name,label] of [['questions','Question'],['options','Answer choices'],['logic','Routing'],['validation','Validation'],['settings','Response policy']]) {
          const tabId=name==='options'||name==='validation'?'questions':name;
          P.button(st,label,tabs,name==='questions'||name==='logic'?{tab:name}:null,{ui:{tab:tabId}},m.ui.tab===name?'on':'');
        }
        const content=P.el(st,'div','vf-question-content',p);
        if(m.ui.tab==='logic') P.routing(st,content,q);
        else {
          P.properties(st,content,q);
          P.validation(st,content,q);
          const del=P.button(st,'Delete question',content,{remove:q.id},{remove:q.id});
          P.register(st,{remove:q.id},del,'inspector');
        }
      },
      routing: (base, S) => (st,p,q) => {
        const P=S.P, m=st.ctx.model;
        const box=P.el(st,'section','vf-routing-box',p);
        const head=P.el(st,'div','vf-routing-heading',box);
        const text=P.el(st,'div','',head);
        P.el(st,'h3','',text,'Answer-based routing');
        P.el(st,'p','af-desc',text,'Send respondents to a section based on their answer.');
        if(q.options.length) {
          const add=P.button(st,'Add rule',head,null,{ui:{open:'route:0'}},'vf-outline');
          P.icon(st,'plus',add);
          const rules=P.el(st,'div','vf-rule-list',box);
          q.options.forEach((answer,i)=>P.routingRule(st,rules,q,answer,i));
        } else P.el(st,'div','vf-empty-routing',box,'Routing is available for choice questions.');
        const defaultBox=P.el(st,'section','vf-default-routing',p);
        const copy=P.el(st,'div','',defaultBox);
        P.el(st,'h3','',copy,'Default routing');
        P.el(st,'p','af-desc',copy,'If no rules apply, continue to the next section.');
        const next=P.el(st,'span','vf-next-section',defaultBox);
        P.icon(st,'info',next,21);P.el(st,'span','',next,'Go to next section');P.icon(st,'chevron',next,19);
      },
      routingRule: (base, S) => (st,p,q,answer,i) => {
        const P=S.P, dest=st.ctx.model.rules[q.id]?.[answer]||'next';
        const row=P.el(st,'div','af-answer vf-rule-row',p);
        const condition=P.el(st,'span','vf-rule-condition',row);
        P.icon(st,'radio',condition,18);P.el(st,'span','',condition,answer);
        P.select(st,'Go to section',`route:${i}`,dest==='next'?'Continue to next section':st.ctx.spec.sections.find(s=>s.id===dest)?.title||dest,row,'inspector');
      },
      painted: (base,S) => (st) => {
        base(st);
        const m=st.ctx.model;
        st.root.classList.toggle('vf-settings-open',m.ui.tab==='settings');
        st.root.classList.toggle('vf-arrange-open',m.ui.tab==='arrange');
        st.root.classList.toggle('vf-compact-height',st.ctx.size.height<740);
        S.P.register(st,{tab:'arrange'},st.arrangeButton);
        if(m.ui.tab==='settings'||m.ui.tab==='arrange') S.P.register(st,{tab:'questions'},st.questionRecovery);
        if(m.ui.tab==='questions') st.tabButtons.logic.setAttribute('aria-selected','true');
      },
    },
  },
});
