/* use-form-builder/_preview: respondent preview, target lookup and decoration hooks. Installs existing overridable editor parts. */
'use strict';
env.template('use-form-builder/_preview', () => ({
  install(BASE, S) {
    BASE.respondentPreview = (st) => {
      const { P } = S;
      const {ctx,root}=st;
      const {spec}=ctx;
      const F=env.taskDef;
      const m=ctx.model;
      const dialog=P.el(st,'div','af-dialog',root),head=P.el(st,'div','af-dialog-head',dialog);
      P.el(st,'b','',head,'Respondent preview');P.button(st,'Back to editor',head,{closePreview:true},{ui:{preview:false}});
      const p=P.el(st,'div','af-dialog-body',dialog);
      P.el(st,'h2','',p,spec.title);
      for(const sec of m.sectionOrder){P.el(st,'h3','',p,spec.sections.find(s=>s.id===sec).title);for(const id of m.orders[sec]){const q=F.helpers.question(m,id);P.previewCard(st,p,q);}}
    };

    BASE.previewCard = (st,p,q) => {
      const { P } = S;
      const card=P.el(st,'div','af-card',p);P.el(st,'b','',card,q.title+(q.validation.required?' *':''));P.el(st,'p','af-desc',card,q.type+(q.options.length?': '+q.options.join(' / '):''));
    };

    BASE.menuOption = (st,pop,name,value,detailed,v,label) => {
      const { P, D } = S;
      const b=P.button(st,'',pop,{pick:[name,v]},name==='add'?{add:v}:{pick:[name,v]},value===v?'chosen':'');
      P.icon(st,name==='add'||name==='type'?P.typeIcon(st,v):name==='preset'?'check':'route',b);const labelBox=P.el(st,'span','af-menu-label',b,label);
      if(detailed)P.el(st,'small','',labelBox,D.typeDetails[v]);
      if(value===v)P.icon(st,'check',b);b.setAttribute('role','menuitem');
    };

    BASE.locate = (st,t) => {
      const key=env.taskDef.helpers.targetKey;
      if(t.list&&t.slot!==undefined)return st.sorts[t.list].locateSlot(t.slot,undefined,t.item);
      if(t.list&&t.item)return st.sorts[t.list].locate(t.item);
      const v=st.targets.get(key(t));
      if(!v)throw new Error(`use-form-builder/classic target is not rendered: ${key(t)}`);
      // Clipped scroll panes use a point inside the exposed viewport, not an off-screen child.
      const r=v.el.getBoundingClientRect();
      return [r.left+r.width/2,r.top+r.height/2];
    };

    BASE.begin = (st) => {};

    BASE.rendered = (st) => {};

    BASE.painted = (st) => {};

    BASE.questionDecorated = (st,card,q) => {};

    BASE.orderDecorated = (st,row,name,id) => {};
  },
}));
