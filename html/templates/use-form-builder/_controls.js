/* use-form-builder/_controls: navigation, facts, geometry and authoring controls. Installs existing overridable editor parts. */
'use strict';
env.template('use-form-builder/_controls', () => ({
  install(BASE, S) {
    BASE.sidebar = (st) => {
      const { P, D } = S;
      const {ctx,workspace,neighboringForms}=st;
      const {spec}=ctx;
      const sidebar=P.el(st,'aside','af-sidebar',workspace);sidebar.setAttribute('aria-label','Workspace navigation');
      const nav=P.el(st,'div','af-sidebar-scroll',sidebar);st.nav=nav;
      const brand=P.el(st,'div','af-side-brand',nav);P.icon(st,'grid',brand);P.el(st,'span','',brand,D.workspace);
      P.navButton(st,'All forms','grid',()=>P.drawer(st,'forms'),'','18');
      P.navButton(st,'Shared with me','people',()=>P.drawer(st,'forms'),'','6');
      P.navButton(st,'Recent activity','history',()=>P.drawer(st,'activity'));
      P.el(st,'div','af-side-caption',nav,'Projects');
      P.navButton(st,'Research','folder',()=>P.drawer(st,'forms'),'','8');
      P.navButton(st,'Operations','folder',()=>P.drawer(st,'forms'),'','5');
      P.el(st,'div','af-side-caption',nav,'Recent forms');
      P.navButton(st,spec.title.split(' · ')[1]||'Current draft','form',()=>{},'af-current');
      for(const title of neighboringForms)P.navButton(st,title,'form',()=>P.drawer(st,'forms'),'af-subform');
      const navFoot=P.el(st,'div','af-side-foot',sidebar,'Team plan');const meter=P.el(st,'div','af-meter',navFoot);P.el(st,'span','',meter);P.el(st,'span','',navFoot,'320 / 1,000 monthly responses');
    };

    BASE.navButton = (st,label,name,fn,cls='',count='') => {
      const { P } = S;
      const {nav}=st;
      const b=P.button(st,'',nav,null,null,cls);P.icon(st,name,b);P.el(st,'span','',b,label);if(count)P.el(st,'small','',b,count);b.title=label;b.setAttribute('aria-label',label);b.addEventListener('click',fn);return b;
    };

    BASE.tabs = (st) => {
      const { P, D } = S;
      const {editor}=st;
      const tabs=P.el(st,'nav','af-tabs',editor);tabs.setAttribute('aria-label','Form editor');
      const tabButtons={};
      for(const [id,label]of D.tabs) {
        tabButtons[id]=P.button(st,label,tabs,{tab:id},{ui:{tab:id}});tabButtons[id].setAttribute('role','tab');
      }
      const responses=P.button(st,'Responses',tabs,null,null,'af-tool');P.icon(st,'grid',responses);responses.addEventListener('click',()=>P.drawer(st,'responses'));
      const theme=P.iconButton(st,'Theme and appearance',tabs,'palette',()=>P.drawer(st,'theme'),'af-tool');
      theme.style.marginLeft='0';
      Object.assign(st,{tabs,tabButtons});
    };

    BASE.status = (st) => {
      const { P } = S;
      const {ctx,foot}=st;
      const {spec}=ctx;
      const F=env.taskDef;
      foot.replaceChildren();
      for(const f of F.facts(ctx.model,spec)) {
        const label=P.el(st,'span',f.label==='Form ID'?'af-id':'',foot,`${f.label}: `);P.el(st,'b','',label,f.value);
      }
    };

    BASE.mirror = (st) => {
      const { st: live } = S;
      const {ctx}=st;
      if(live!==st||st.painting)return;
      const hidden={};
      for(const [k,v]of st.targets) {
        if(!v.pane||!v.el.isConnected)continue;
        const p=st.panes[v.pane];if(!p)continue;
        const r=v.el.getBoundingClientRect(),pr=p.getBoundingClientRect();
        const center=r.top+r.height/2;
        if(center<pr.top+8 || center>pr.bottom-8)hidden[k]={pane:v.pane,dir:center<pr.top+8?-1:1};
      }
      // Only layout facts; no scored field changes during measuring or locating.
      if(JSON.stringify(ctx.model.view?.hidden)!==JSON.stringify(hidden))ctx.update({...ctx.model,view:{hidden}});
    };

    BASE.commit = (st,act,rebuild=true) => {
      const { P, st: live } = S;
      const {ctx}=st;
      const {spec}=ctx;
      const F=env.taskDef;
      if(live!==st)return;
      ctx.update(F.helpers.apply(ctx.model,spec,act));
      if(rebuild)P.paint(st);else {for(const sync of st.syncers)sync();P.status(st);P.mirror(st);}
    };

    BASE.pane = (st,name,cls,parent=st.body) => {
      const { P } = S;
      const p=P.el(st,'div',cls,parent);st.panes[name]=p;P.register(st,{pane:name},p);
      p.addEventListener('scroll',()=>P.mirror(st));
      p.addEventListener('wheel',e=>{e.preventDefault();p.scrollTop+=Math.sign(e.deltaY)*Math.min(Math.abs(e.deltaY),Math.max(16,p.clientHeight/2));P.mirror(st);},{passive:false});
      return p;
    };

    BASE.field = (st,label,name,value,parent,paneName,multiline=false) => {
      const { P } = S;
      const {ctx}=st;
      const F=env.taskDef;
      const wrap=P.el(st,'label','af-field',parent);P.el(st,'span','af-label',wrap,label);
      const inp=P.el(st,multiline?'textarea':'input','af-input',wrap);
      if(!multiline)inp.type='text';
      inp.value=value;inp.autocomplete='off';inp.spellcheck=false;
      P.register(st,{field:name},inp,paneName);
      const read=()=>name==='closeDate'?ctx.model.settings.closeDate:name==='title'?F.helpers.question(ctx.model,ctx.model.ui.selected)?.title:name==='options'?F.helpers.question(ctx.model,ctx.model.ui.selected)?.options.join('\n'):F.helpers.question(ctx.model,ctx.model.ui.selected)?.validation[name];
      st.syncers.push(()=>{const v=read()??'';if(inp.value!==v && !(name==='options'&&inp.value.endsWith('\n')&&inp.value.slice(0,-1)===v))inp.value=v;});
      inp.addEventListener('input',()=>P.commit(st,{field:[name,inp.value]},false));
      return inp;
    };
  },
}));
