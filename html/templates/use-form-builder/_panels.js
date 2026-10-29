/* use-form-builder/_panels: question panels, sortables and picker menus. Installs existing overridable editor parts. */
'use strict';
env.template('use-form-builder/_panels', () => ({
  install(BASE, S) {
    BASE.select = (st,label,name,value,parent,paneName) => {
      const { P } = S;
      const {ctx}=st;
      const wrap=P.el(st,'div','af-field',parent);P.el(st,'span','af-label',wrap,label);
      const b=P.button(st,'',wrap,{open:name},{ui:{open:ctx.model.ui.open===name?null:name}},'af-select');
      P.el(st,'span','',b,value);P.icon(st,'chevron',b);P.register(st,{open:name},b,paneName);return b;
    };

    BASE.toggle = (st,label,hint,name,on,parent,paneName) => {
      const { P } = S;
      const row=P.el(st,'div','af-toggle-row',parent),text=P.el(st,'div','',row);
      P.el(st,'b','',text,label);if(hint)P.el(st,'small','',text,hint);
      const b=P.button(st,'',row,{toggle:name},{toggle:name},'af-switch');
      b.setAttribute('role','switch');b.setAttribute('aria-label',label);b.setAttribute('aria-checked',String(on));P.register(st,{toggle:name},b,paneName);
      return b;
    };

    BASE.journey = (st,parent) => {
      const { P } = S;
      const {ctx}=st;
      const box=P.el(st,'div','af-journey',parent);P.el(st,'div','af-kicker',box,'Respondent journey');
      ctx.model.sectionOrder.forEach((id,i)=>{
        P.journeyRow(st,box,id,i);
      });
    };

    BASE.canvas = (st,parent) => {
      const { P } = S;
      const {ctx}=st;
      const {spec}=ctx;
      const F=env.taskDef;
      const m=ctx.model,sec=spec.sections.find(s=>s.id===m.ui.section);
      P.canvasHeader(st,parent,sec);
      for(const id of m.orders[sec.id]) {
        const q=F.helpers.question(m,id);if(!q)continue;
        P.questionCard(st,parent,sec,id,q);
      }
      if(m.ui.tab==='questions') {
        P.addControl(st,parent);
      } else P.journey(st,parent);
    };

    BASE.inspector = (st,p) => {
      const { P } = S;
      const {ctx}=st;
      const F=env.taskDef;
      const m=ctx.model,q=F.helpers.question(m,m.ui.selected);
      if(!q){P.el(st,'div','af-empty',p,'Select a question or add your first question.');return;}
      if(m.ui.tab==='logic') {
        P.routing(st,p,q);return;
      }
      P.properties(st,p,q);
      P.validation(st,p,q);
      const del=P.button(st,'Delete question',p,{remove:q.id},{remove:q.id});P.register(st,{remove:q.id},del,'inspector');
    };

    BASE.orderList = (st,name,parent,ids,labelOf) => {
      const { P, D } = S;
      const {body}=st;
      const box=P.el(st,'div','af-order',parent),items={};
      const rowHeight=Math.max(D.rowMin,Math.min(D.rowMax,Math.floor((body.clientHeight-100)/Math.max(1,ids.length))-5));
      for(const id of ids) {
        items[id]=P.orderRow(st,name,box,id,labelOf,rowHeight);
      }
      st.sorts[name]=env.ui.sortable(box,{
        order:ids,items,handle:'.af-grip',axis:'y',activeClass:'dragging',
        onChange(order){P.commit(st,{order:[name,order]});},
      });
    };

    BASE.menu = (st) => {
      const { P, D } = S;
      const {ctx,root}=st;
      const {spec}=ctx;
      const F=env.taskDef;
      const key=env.taskDef.helpers.targetKey;
      const name=ctx.model.ui.open;if(!name)return;
      const q=F.helpers.question(ctx.model,ctx.model.ui.selected);
      let options,value,trigger;
      if(name==='add'){options=F.helpers.types.map(v=>[v,v]);trigger=st.targets.get(key({add:true}))?.el;}
      else if(name==='type'){options=F.helpers.types.map(v=>[v,v]);value=q?.type;}
      else if(name==='preset'){options=F.helpers.presets.map(v=>[v,v]);value=q?.validation.preset;}
      else if(name.startsWith('route:')){options=[['next','Continue to next section'],...spec.sections.map(s=>[s.id,s.title])];value=ctx.model.rules[q.id]?.[q.options[Number(name.slice(6))]]||'next';}
      if(!options)return;
      trigger ||= st.targets.get(key({open:name}))?.el;if(!trigger)return;
      const back=P.el(st,'div','af-menu-back',root);back.addEventListener('click',()=>P.commit(st,{ui:{open:null}}));
      const pop=P.el(st,'div','af-menu',root);pop.setAttribute('role','menu');
      const r=trigger.getBoundingClientRect(),rr=root.getBoundingClientRect();
      const detailed=name==='add'||name==='type';
      const w=Math.min(Math.max(D.menuWidth,r.width),rr.width-16),h=Math.min(options.length*(detailed?45:32)+36,rr.height-20);
      const left=Math.max(8,Math.min(r.left-rr.left,rr.width-w-8));
      const top=Math.max(8,Math.min(r.bottom-rr.top+3,rr.height-h-8));
      Object.assign(pop.style,{left:left+'px',top:top+'px',width:w+'px',maxHeight:h+'px'});
      P.el(st,'div','af-menu-caption',pop,name==='add'?'Add a question':name==='preset'?'Built-in validation':name==='type'?'Question type':'Destination');
      for(const [v,label]of options) {
        P.menuOption(st,pop,name,value,detailed,v,label);
      }
      st.menus=[back,pop];
    };
  },
}));
