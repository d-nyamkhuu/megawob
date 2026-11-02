/* use-form-builder/_frame: frame, DOM helpers, workspace content and heading. Installs existing overridable editor parts. */
'use strict';
env.template('use-form-builder/_frame', () => ({
  install(BASE, S) {
    const { CSS } = env.templateLib('use-form-builder/_assets');
    BASE.styles = (st) => {
      const { D } = S;
      const {ctx}=st;
      const colors={accent:D.accent,bg:D.background,panel:D.panel,fg:D.text,muted:D.muted,line:D.line};
      ctx.css('app-forms-classic',CSS
        .replace(/var\(--(accent|bg|panel|fg|muted|line)\)/g,(_,name)=>colors[name])
        .replace('inset:10px;',`inset:${D.inset}px;`)
        .replace('font-size:13px; box-shadow',`font-size:${D.fontSize}; box-shadow`)
        .replace('border-radius:10px; background',`border-radius:${D.radius}; background`)
        .replace('width:158px;',`width:${D.sidebarWidth}px;`)
        .replace('width:43px;',`width:${D.smallSidebarWidth}px;`)
        .replace('grid-template-columns:minmax(160px, 1fr) minmax(245px, .9fr);',`grid-template-columns:${D.columns};`));
    };

    BASE.frame = (st) => {
      const { D } = S;
      const {ctx}=st;
      const {util}=ctx;
      const root=util.el('div','af-app'+(ctx.size.width<D.compactWidth?' af-compact':'')+(ctx.size.width<D.smallNavWidth?' af-nav-small':''),ctx.stage);
      // The reference frame reserves a short note; a multi-question brief can make it taller.
      // Keep the editor above the actual note while staying within the supplied stage.
      const note=document.querySelector('.ref-note');
      if(note){const overlap=ctx.stage.getBoundingClientRect().bottom-note.getBoundingClientRect().top;root.style.bottom=Math.max(D.inset,overlap+D.noteGap)+'px';}
      if(D.fontFamily)root.style.fontFamily=D.fontFamily;
      return root;
    };

    BASE.register = (st,t,node,pane) => {
      const key=env.taskDef.helpers.targetKey;
      st.targets.set(key(t),{el:node,pane});return node;
    };

    BASE.el = (st,tag,cls,parent,text) => {
      const {ctx}=st;
      const {util}=ctx;
      return util.el(tag,cls,parent,text);
    };

    BASE.button = (st,label,parent,t,act,cls='') => {
      const { P } = S;
      const b=P.el(st,'button',cls,parent,label);b.type='button';
      if(t)P.register(st,t,b);
      if(act)b.addEventListener('click',()=>P.commit(st,act));
      return b;
    };

    BASE.icon = (st,name,parent,size=16) => {
      const { D } = S;
      const {ctx}=st;
      const {util}=ctx;
      const svg=util.svg('svg',{viewBox:'0 0 24 24',width:size,height:size,'aria-hidden':'true',class:'af-icon'},parent);
      for(const d of D.icons[name]||D.icons.form)util.svg('path',{d},svg);
      return svg;
    };

    BASE.typeIcon = (st,type) => {
      const { D } = S;
      return D.typeIcons[type]||'form';
    };

    BASE.iconButton = (st,label,parent,name,fn,cls='') => {
      const { P } = S;
      const b=P.button(st,'',parent,null,null,'af-icon-btn '+cls);b.setAttribute('aria-label',label);b.title=label;P.icon(st,name,b);if(fn)b.addEventListener('click',fn);return b;
    };

    BASE.content = (st) => {
      const { D } = S;
      const {ctx}=st;
      const {spec}=ctx;
      const cr=ctx.rng.fork('workspace-content');
      const peers=[spec.owner,...Array.from({length:2},()=>env.content.personName(cr,{csplit:spec.csplit}).full)];
      const neighboringForms=D.neighboringForms;
      Object.assign(st,{peers,neighboringForms});
    };

    BASE.topbar = (st) => {
      const { P, D } = S;
      const {ctx,root,peers}=st;
      const {spec}=ctx;
      const top=P.el(st,'div','af-top',root);
      P.icon(st,'form',P.el(st,'div','af-logo',top));
      const title=P.el(st,'div','af-title',top);
      P.el(st,'b','',title,spec.title);P.el(st,'small','',title,`${D.brand} / ${D.workspace} · ${spec.owner}`);
      P.el(st,'span','af-badge af-top-draft',top,'Draft');
      const saved=P.el(st,'span','af-status',top);P.icon(st,'check',saved);P.el(st,'span','',saved,'Saved');
      const avatars=P.el(st,'div','af-avatars',top);avatars.title='Editors: '+peers.join(', ');
      for(const person of peers)P.el(st,'span','af-avatar',avatars,person.split(' ').map(x=>x[0]).slice(0,2).join(''));
      P.iconButton(st,'Version history',top,'history',()=>P.drawer(st,'history'),'af-history');
      const notifications=P.iconButton(st,'Notifications',top,'bell',()=>P.drawer(st,'activity'));
      P.el(st,'span','af-notification-count',notifications,'3');
      const preview=P.button(st,'Preview',top,{preview:true},null);
      preview.addEventListener('click',()=>P.commit(st,{ui:{preview:!ctx.model.ui.preview}}));
      P.icon(st,'eye',preview);
      const share=P.button(st,'Share',top,null,null,'af-primary');P.icon(st,'share',share);share.addEventListener('click',()=>P.drawer(st,'share'));
      st.top=top;
    };

    BASE.layout = (st) => {
      const { P } = S;
      const {root}=st;
      const workspace=P.el(st,'div','af-workspace',root);
      st.workspace=workspace;
      P.sidebar(st);
      st.editor=P.el(st,'div','af-editor',workspace);
      P.tabs(st);
      st.sections=P.el(st,'div','af-sections',st.editor);
      st.body=P.el(st,'div','af-body',st.editor);
      st.foot=P.el(st,'div','af-foot',root);
    };
  },
}), { uses: ['use-form-builder/_assets'] });
