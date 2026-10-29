/* use-form-builder/_settings: validation, reorder rows and response policies. Installs existing overridable editor parts. */
'use strict';
env.template('use-form-builder/_settings', () => ({
  install(BASE, S) {
    BASE.validation = (st,p,q) => {
      const { P } = S;
      const {ctx}=st;
      const F=env.taskDef;
      P.el(st,'div','af-divider',p);P.el(st,'h3','',p,'Response validation');
      P.select(st,'Rule','preset',q.validation.preset,p,'inspector');
      if(['Number range','Text length'].includes(q.validation.preset)) {
        const row=P.el(st,'div','af-pair',p);
        P.field(st,q.validation.preset==='Text length'?'Minimum characters':'Minimum','min',q.validation.min,row,'inspector');
        P.field(st,q.validation.preset==='Text length'?'Maximum characters':'Maximum','max',q.validation.max,row,'inspector');
        P.el(st,'p','af-desc',p,'Both endpoints are inclusive.');
      }
      const validationState=P.el(st,'div','af-rule-summary',p);
      const validationError=P.el(st,'div','af-inline-error',p);
      st.syncers.push(()=>{
        const v=F.helpers.question(ctx.model,q.id)?.validation;if(!v)return;
        validationState.textContent=v.preset==='None'?'No response validation. Any answer is accepted.':v.preset==='Number range'?`Accept numbers from ${v.min||'no minimum'} to ${v.max||'no maximum'}.`:v.preset==='Text length'?`Accept ${v.min||'0'} to ${v.max||'unlimited'} characters.`:v.preset==='Email address'?'Example: name@example.com':'Responses must match the selected pattern preset.';
        const bounded=['Number range','Text length'].includes(v.preset);
        const invalid=bounded&&v.min!==''&&v.max!==''&&Number(v.min)>Number(v.max);
        validationError.hidden=!invalid;validationError.replaceChildren();
        if(invalid){P.icon(st,'warning',validationError);P.el(st,'span','',validationError,'Minimum cannot exceed maximum.');}
      });
      P.toggle(st,'Required','Respondents must answer this question.','required',q.validation.required,p,'inspector');
      P.el(st,'div','af-notice',p,'Built-in rules: number range, text length, email and pattern presets. External checks, one-time email verification codes, live inventory checks and digital signature verification are unavailable.');
    };

    BASE.orderRow = (st,name,box,id,labelOf,rowHeight) => {
      const { P } = S;
      const {ctx}=st;
      const F=env.taskDef;
      const row=P.el(st,'div','af-order-row'+(name==='sections'?' af-order-section'+(ctx.model.ui.section===id?' on':''):''),box);
      row.style.height=rowHeight+'px';
      const grip=P.el(st,'span','af-grip',row);P.icon(st,'grip',grip);grip.setAttribute('aria-label',`Drag ${labelOf(id)}`);
      const label=P.el(st,'span','af-order-label',row);P.el(st,'b','',label,labelOf(id));
      const subtitle=name==='sections'?`${ctx.model.orders[id].length} questions`:F.helpers.question(ctx.model,id).type;P.el(st,'small','',label,subtitle);
      P.icon(st,name==='sections'?'form':P.typeIcon(st,F.helpers.question(ctx.model,id).type),row);
      if(name==='sections')row.addEventListener('click',e=>{if(!e.target.closest('.af-grip'))P.commit(st,{ui:{section:id,selected:ctx.model.orders[id][0]}});});
      P.register(st,{list:name,item:id},grip,name==='sections'?'canvas':'inspector');
      P.orderDecorated(st,row,name,id);
      return row;
    };

    BASE.sectionButton = (st,id) => {
      const { P } = S;
      const {ctx,sections}=st;
      const {spec}=ctx;
      const m=ctx.model;
      const sec=spec.sections.find(s=>s.id===id);
      const b=P.button(st,'',sections,{section:id},{ui:{section:id,selected:m.orders[id][0]||null}},m.ui.section===id?'on':'');
      P.el(st,'span','af-section-label',b,`${m.sectionOrder.indexOf(id)+1}. ${sec.title}`);P.el(st,'small','',b,String(m.orders[id].length));b.title=sec.title;
    };

    BASE.settings = (st) => {
      const { P, D } = S;
      const {body}=st;
      body.style.gridTemplateColumns=body.clientWidth>D.policyWidth?`minmax(0,1fr) ${D.policyPanelWidth}px`:'minmax(0,1fr)';
      const p=P.pane(st,'inspector','af-inspector af-settings');
      P.el(st,'div','af-kicker',p,'Form settings');P.el(st,'h2','',p,'Responses & access');
      P.el(st,'p','af-desc',p,'Control how respondents identify themselves and when this form accepts responses.');
      P.identitySettings(st,p);
      P.scheduleSettings(st,p);
      P.confirmationSettings(st,p);
      if(body.clientWidth>D.policyWidth)P.policy(st);
      P.el(st,'div','af-notice',p,'Response storage: Team workspace · Confirmation message: “Thanks for your feedback.”\nExisting responses are retained when a form closes.');
    };

    BASE.identitySettings = (st,p) => {
      const { P } = S;
      const {ctx}=st;
      const m=ctx.model;
      const identity=P.el(st,'div','af-settings-group',p);const identityTitle=P.el(st,'h3','',identity);P.icon(st,'people',identityTitle);P.el(st,'span','',identityTitle,'Respondent identity');
      P.toggle(st,'Collect email addresses','Store a respondent email with every response.','emails',m.settings.emails,identity,'inspector');
      P.toggle(st,'Limit to one response','Require sign-in and prevent duplicate submissions.','one',m.settings.one,identity,'inspector');
    };

    BASE.scheduleSettings = (st,p) => {
      const { P } = S;
      const {ctx}=st;
      const m=ctx.model;
      const schedule=P.el(st,'div','af-settings-group',p);const scheduleTitle=P.el(st,'h3','',schedule);P.icon(st,'calendar',scheduleTitle);P.el(st,'span','',scheduleTitle,'Response schedule');
      P.toggle(st,'Close on a date','Stop accepting new responses on the scheduled day.','closeEnabled',m.settings.closeEnabled,schedule,'inspector');
      if(m.settings.closeEnabled){P.field(st,'Closing date / YYYY-MM-DD','closeDate',m.settings.closeDate,schedule,'inspector');P.el(st,'p','af-desc',schedule,'Closes at 23:59 in workspace time (UTC).');}
    };

    BASE.confirmationSettings = (st,p) => {
      const { P } = S;
      const presentation=P.el(st,'div','af-settings-group',p);P.el(st,'h3','',presentation,'After submission');P.el(st,'p','af-desc',presentation,'Confirmation message');P.el(st,'div','af-share-link',presentation,'Thanks for your feedback. Your response has been recorded.');
    };

    BASE.policy = (st) => {
      const { P } = S;
      const {ctx,body}=st;
      const {spec}=ctx;
      const overview=P.el(st,'aside','af-policy-panel',body);P.el(st,'h3','',overview,'Publishing overview');for(const [label,value]of [['Visibility','Unpublished'],['Owner',spec.owner],['Responses','0'],['Storage','Team workspace'],['Time zone','UTC']]){const row=P.el(st,'div','af-policy-row',overview);P.el(st,'span','',row,label);P.el(st,'b','',row,value);}P.el(st,'p','af-smallprint',overview,'Changes are saved to your draft. Share a preview with collaborators before distributing the live form.');
    };

    BASE.arrange = (st) => {
      const { P } = S;
      const {ctx}=st;
      const {spec}=ctx;
      const F=env.taskDef;
      const m=ctx.model;
      const a=P.pane(st,'canvas','af-canvas'),b=P.pane(st,'inspector','af-inspector');
      P.el(st,'div','af-kicker',a,'Structure');P.el(st,'h3','',a,'Section order');P.el(st,'p','af-desc',a,'Drag a handle. Select a section to arrange its questions.');
      P.orderList(st,'sections',a,m.sectionOrder,id=>spec.sections.find(s=>s.id===id).title);P.journey(st,a);
      P.el(st,'div','af-kicker',b,spec.sections.find(s=>s.id===m.ui.section).title);P.el(st,'h3','',b,'Question order');P.el(st,'p','af-desc',b,'Drag question handles into the desired order.');
      P.orderList(st,'questions',b,m.orders[m.ui.section],id=>F.helpers.question(m,id).title);P.el(st,'div','af-notice',b,'Question settings and answer rules stay attached when the form structure changes. Section boundaries are preserved.');
    };

    BASE.questionPanels = (st) => {
      const { P } = S;
      const a=P.pane(st,'canvas','af-canvas'),b=P.pane(st,'inspector','af-inspector');P.canvas(st,a);P.inspector(st,b);
    };
  },
}));
