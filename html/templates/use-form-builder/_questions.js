/* use-form-builder/_questions: question cards, journey, routing and properties. Installs existing overridable editor parts. */
'use strict';
env.template('use-form-builder/_questions', () => ({
  install(BASE, S) {
    BASE.canvasHeader = (st,parent,sec) => {
      const { P } = S;
      const {ctx}=st;
      const {spec}=ctx;
      const m=ctx.model;
      const header=P.el(st,'div','af-form-header',parent);
      P.el(st,'div','af-kicker',header,'FORM / DRAFT');P.el(st,'h2','',header,spec.title.split(' · ')[1]||spec.title);
      P.el(st,'p','',header,'Your feedback helps us plan better experiences. Responses are shared with the organizing team.');
      const badge=P.el(st,'span','af-badge',header);P.icon(st,'lock',badge);P.el(st,'span','',badge,'Not published');
      const sectionHead=P.el(st,'div','af-section-heading',parent);P.el(st,'h3','',sectionHead,sec.title);
      P.el(st,'span','af-badge',sectionHead,`${m.sectionOrder.indexOf(sec.id)+1} / ${spec.sections.length}`);
    };

    BASE.questionCard = (st,parent,sec,id,q) => {
      const { P } = S;
      const {ctx}=st;
      const F=env.taskDef;
      const m=ctx.model;
      const card=P.el(st,'article','af-card'+(m.ui.selected===id?' selected':''),parent);
      card.tabIndex=0;card.setAttribute('role','button');card.setAttribute('aria-label',q.title);
      P.register(st,{question:id},card,'canvas');
      card.addEventListener('click',()=>P.commit(st,{ui:{selected:id}}));
      card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();P.commit(st,{ui:{selected:id}});}});
      const type=P.el(st,'div','af-card-top',card);P.icon(st,P.typeIcon(st,q.type),type);
      const typeLabel=P.el(st,'span','',type,`${m.orders[sec.id].indexOf(id)+1} / ${q.type}`);
      P.icon(st,'more',P.el(st,'span','af-card-more',type));
      const name=P.el(st,'div','af-card-title',card,q.title);
      const preview=P.el(st,'div',q.options.length?'af-preview-options':'af-preview-line',card);
      st.syncers.push(()=>{
        const now=F.helpers.question(ctx.model,id);if(!now)return;
        name.textContent=now.title+(now.validation.required?' *':'');
        typeLabel.textContent=`${ctx.model.orders[sec.id].indexOf(id)+1} / ${now.type}`;
        P.questionPreview(st,preview,now);
      });
      P.questionDecorated(st,card,q);
      return card;
    };

    BASE.questionPreview = (st,preview,now) => {
      const { P, D } = S;
      preview.replaceChildren();
      if(now.options.length) {
        now.options.slice(0,D.previewOptions).forEach(text=>{const row=P.el(st,'div','af-preview-option',preview);P.icon(st,now.type==='Checkboxes'?'box':'radio',row);P.el(st,'span','',row,text);});
        if(now.options.length>D.previewOptions)P.el(st,'span','af-preview-more',preview,`+ ${now.options.length-D.previewOptions} more options`);
      } else preview.textContent=now.type==='Number'?'Enter a number':now.type==='Paragraph'?'Long answer text':'Short answer text';
    };

    BASE.addControl = (st,parent) => {
      const { P } = S;
      const {ctx}=st;
      const m=ctx.model;
      const add=P.button(st,'Add question',parent,{add:true},{ui:{open:m.ui.open==='add'?null:'add'}},'af-add');P.icon(st,'plus',add);P.register(st,{add:true},add,'canvas');
      P.el(st,'p','af-smallprint',parent,'End of section / continues to the next section');
    };

    BASE.journeyRow = (st,box,id,i) => {
      const { P } = S;
      const {ctx}=st;
      const {spec}=ctx;
      const row=P.el(st,'div','af-journey-row',box);P.el(st,'span','af-step',row,String(i+1));
      P.el(st,'span','',row,spec.sections.find(x=>x.id===id).title);
      P.el(st,'small','',row,`${ctx.model.orders[id].length} questions`);P.icon(st,'arrow',row,13);
    };

    BASE.routing = (st,p,q) => {
      const { P } = S;
      const {ctx}=st;
      const m=ctx.model;
      const head=P.el(st,'div','af-property-heading',p);P.icon(st,'route',head);P.el(st,'b','',head,'Answer routing');P.el(st,'small','',head,`Q${m.orders[q.section].indexOf(q.id)+1}`);P.el(st,'h3','',p,q.title);
      if(!q.options.length) {P.icon(st,'route',P.el(st,'div','af-empty',p));P.el(st,'p','af-desc',p,'No answer rules for this question. Routing is available for Multiple choice and Checkboxes.');const other=m.questions.find(x=>x.options.length);if(other)P.button(st,'View choice question',p,null,{ui:{section:other.section,selected:other.id}});P.journey(st,p);return;}
      P.el(st,'p','af-desc',p,'If answer is equal to … go to section. Unconfigured answers continue normally.');
      q.options.forEach((answer,i)=>{
        P.routingRule(st,p,q,answer,i);
      });
      const count=Object.values(m.rules[q.id]||{}).filter(x=>x!=='next').length;P.el(st,'div','af-rule-summary',p,`${count} custom routes / ${q.options.length} answer choices. Routing is evaluated when respondents finish this section.`);
      return;
    };

    BASE.routingRule = (st,p,q,answer,i) => {
      const { P } = S;
      const {ctx}=st;
      const {spec}=ctx;
      const m=ctx.model;
      const row=P.el(st,'div','af-answer',p);P.el(st,'div','af-kicker',row,`Rule ${String(i+1).padStart(2,'0')} / answer equals`);const condition=P.el(st,'div','af-condition',row);P.icon(st,'radio',condition);P.el(st,'b','',condition,answer);
      const dest=m.rules[q.id]?.[answer]||'next';
      P.select(st,'Go to section',`route:${i}`,dest==='next'?'Continue to next section':spec.sections.find(s=>s.id===dest)?.title||dest,row,'inspector');
    };

    BASE.properties = (st,p,q) => {
      const { P } = S;
      const {ctx}=st;
      const m=ctx.model;
      const head=P.el(st,'div','af-property-heading',p);P.icon(st,P.typeIcon(st,q.type),head);P.el(st,'b','',head,'Question properties');P.el(st,'small','',head,`Q${m.orders[q.section].indexOf(q.id)+1}`);
      P.field(st,'Question title','title',q.title,p,'inspector',true);
      P.select(st,'Question type','type',q.type,p,'inspector');
      if(q.options.length) {
        P.field(st,'Answer options · one per line','options',q.options.join('\n'),p,'inspector',true);
        P.el(st,'p','af-desc',p,'Options appear to respondents in this order.');
      }
    };
  },
}));
