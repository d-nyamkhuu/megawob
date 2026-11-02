/* use-form-builder/_paint: local dialogs and body repaint orchestration. Installs existing overridable editor parts. */
'use strict';
env.template('use-form-builder/_paint', () => ({
  install(BASE, S) {
    BASE.drawer = (st,kind) => {
      const { P, D } = S;
      const {ctx,root,neighboringForms,peers}=st;
      const {spec}=ctx;
      root.querySelector('.af-dialog')?.remove();
      const dialog=P.el(st,'section','af-dialog',root);dialog.setAttribute('role','dialog');dialog.setAttribute('aria-label',kind);
      const head=P.el(st,'div','af-dialog-head',dialog);
      const names={forms:'Workspace forms',history:'Version history',activity:'Notifications',share:'Share this draft',responses:'Responses',theme:'Theme and appearance'};
      P.el(st,'b','',head,names[kind]);P.iconButton(st,'Close panel',head,'close',()=>dialog.remove());
      const panel=P.el(st,'div','af-dialog-body',dialog);
      if(kind==='forms') {
        P.el(st,'p','af-desc',panel,'Research / recently updated forms');
        [spec.title.split(' · ')[1],...neighboringForms].forEach((name,i)=>{const row=P.el(st,'div','af-activity-row',panel);P.icon(st,'form',row);const label=P.el(st,'div','',row,name);P.el(st,'small','',label,i===0?'Current draft / editing now':`${i%2?'Published':'Draft'} / ${peers[i%peers.length]} / ${i+1} days ago`);});
      } else if(kind==='activity'||kind==='history') {
        const rows=kind==='history'?['Draft changes saved','Question wording updated','Form created']:['You were added as an editor','A review was requested on Event registration','Quarterly pulse is ready for review'];
        rows.forEach((text,i)=>{const row=P.el(st,'div','af-activity-row',panel);P.icon(st,kind==='history'?'history':'bell',row);const label=P.el(st,'div','',row,text);P.el(st,'small','',label,`${peers[i%peers.length]} / ${i===0?'Just now':i===1?'2 hours ago':'Yesterday'}`);});
      } else if(kind==='share') {
        P.el(st,'h3','',panel,'Collaborator preview');P.el(st,'p','af-desc',panel,'This form is a draft. People with workspace access can review its structure before it is published.');
        P.el(st,'div','af-share-link',panel,`https://forms.example.com/preview/${spec.ref.toLowerCase()}`);
        peers.forEach((person,i)=>{const row=P.el(st,'div','af-activity-row',panel);P.icon(st,'people',row);const label=P.el(st,'div','',row,person);P.el(st,'small','',label,i?'Editor / Team workspace':'Owner / Can manage access');});
      } else if(kind==='responses') {
        P.icon(st,'grid',P.el(st,'div','af-empty',panel));P.el(st,'h3','',panel,'No responses yet');P.el(st,'p','af-desc',panel,'Responses will appear here after the form is published. Summary, individual responses and exports are available in this workspace.');
        P.el(st,'div','af-notice',panel,'Status: Draft / Response storage: Team workspace / Export format: CSV');
      } else {
        P.el(st,'h3','',panel,'Workspace theme');P.el(st,'p','af-desc',panel,'This form inherits its colors and typography from Team workspace.');
        const swatches=P.el(st,'div','af-pair',panel);for(const [label,color]of [['Accent',D.accent],['Canvas',D.background],['Surface',D.panel],['Text',D.text]]){const cell=P.el(st,'div','af-rule-summary',swatches,label);cell.style.borderTop=`12px solid ${color}`;}
        P.el(st,'div','af-notice',panel,'Typography: System sans / Body: 13 px / Question labels: Medium / Form layout: Sections');
      }
    };

    BASE.paint = (st) => {
      const { P } = S;
      const {ctx,root,top,tabs,tabButtons,sections,body}=st;
      st.painting=true;
      const scrolls={};for(const [name,p]of Object.entries(st.panes))scrolls[name]=p.scrollTop;
      for(const ctl of Object.values(st.sorts))ctl.detach();
      st.sorts={};st.syncers=[];st.panes={};
      if(st.menus)st.menus.forEach(e=>e.remove());st.menus=null;
      root.querySelector('.af-dialog')?.remove();
      // Persistent header targets survive; body/section targets are re-registered below.
      for(const [k,v]of st.targets)if(!top.contains(v.el)&&!tabs.contains(v.el))st.targets.delete(k);
      sections.replaceChildren();body.replaceChildren();
      const m=ctx.model;
      for(const [id,b]of Object.entries(tabButtons))b.setAttribute('aria-selected',String(id===m.ui.tab));
      for(const id of m.sectionOrder) {
        P.sectionButton(st,id);
      }
      sections.hidden=m.ui.tab==='settings';
      body.style.gridTemplateColumns='';
      if(m.ui.tab==='settings') {
        P.settings(st);
      } else if(m.ui.tab==='arrange') {
        P.arrange(st);
      } else {
        P.questionPanels(st);
      }
      for(const sync of st.syncers)sync();
      for(const [name,p]of Object.entries(st.panes))p.scrollTop=scrolls[name]||0;
      P.status(st);st.painting=false;P.mirror(st);
      P.menu(st);
      if(m.ui.preview) {
        P.respondentPreview(st);
      }
      P.painted(st);
    };
  },
}));
