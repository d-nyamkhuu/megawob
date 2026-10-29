// Carbon desktop checklist, retaining the shared portal's task bindings and random draws.
env.widget({
  task: 'use-gov-portal',
  site: 'design-use-gov-portal-checklist-02',
  name: 'design',
  split: 'train',
  scenarios: ['checklist'],
  template: 'use-gov-portal/portal',
  design: {
    fontSize:16, lineHeight:1.2, insetX:0, insetY:0, maxWidth:2000, maxHeight:1200, inputHeight:26, shadow:'none',
    parts: {
      masthead: (base, S) => v => {
        base(v);v.els.messagesButton.closest('.gov-masthead').remove();
      },
      heading: (base, S) => v => {
        base(v);v.els.pill.closest('.gov-head').remove();
      },
      workflow: (base, S) => v => {
        base(v);v.els.steps.closest('.gov-workflow').remove();
      },
      sidebar: (base, S) => v => {
        base(v);v.els.sidebar.remove();
      },
      record: (base, S) => v => {
        // Retain the dossier's three case-number draws and its auxiliary panels.
        base(v);
        const {u,s,els}=v;
        const cards=u.el('div','carbon-records',els.sidePanels.record);
        const applicant=u.el('section','carbon-panel carbon-applicant',cards);
        u.el('h3','carbon-title',applicant,'Applicant record');
        const dl=u.el('dl','carbon-record-list',applicant);
        S.P.recordRow(v,dl,'Full name:',s.record.name);
        for(const f of s.fields) if(f.kind==='text'&&f.id!=='name') S.P.recordRow(v,dl,f.label+':',f.source);
        S.P.recordRow(v,dl,'Residency status:',s.record.months+' months in district');
        S.P.recordRow(v,dl,'Employment:',s.record.employment);
        S.P.recordRow(v,dl,'Dependants:',s.record.dependants);
        const eligibility=u.el('section','carbon-panel carbon-eligibility',cards);
        u.el('h3','carbon-title',eligibility,'Eligibility requirements');
        const rules=u.el('div','carbon-rules',eligibility);
        const rule=(label,value,met=true)=>{
          const row=u.el('div','carbon-rule',rules);
          u.el('span','carbon-tick'+(met?'':' carbon-no'),row,met?'✓':'!');
          u.el('span','',row,label);u.el('span','',row,String(value));
        };
        rule('Resident in the district',s.record.months+' months');
        rule('Minimum residence required',s.record.minimum+' months',s.record.eligible);
        rule('Employment status',s.record.employment);
        rule('Dependants in household',s.record.dependants);
        const info=u.el('div','carbon-info',eligibility);
        u.el('b','',info,'i');u.el('span','',info,s.record.eligible?'You meet the eligibility requirements for this support.':'You do not meet the minimum residence requirement.');
        els.carbonRecords=cards;
      },
      main: (base, S) => v => {
        base(v);
        v.els.form.append(v.els.carbonRecords);
      },
      introduction: (base, S) => v => {
        base(v);
        v.els.form.querySelector('.gov-page-intro').remove();
      },
      fields: (base, S) => v => {
        base(v);
        const panel=v.u.el('section','carbon-panel carbon-application',v.els.form);
        v.u.el('h3','carbon-title',panel,'Application form');
        const grid=v.u.el('div','carbon-form-grid',panel);
        v.u.el('h4','carbon-form-subtitle',grid,'Personal information');
        for(const group of Object.values(v.groups))grid.append(group.el);
        let left=2,right=2;
        for(const f of v.s.fields){
          const w=v.fields[f.id];
          if(f.kind==='text'){
            const contact=/email|e-mail|post(code|al)|contact|phone/i.test(f.label);
            w.wrap.style.gridColumn=contact?'2':'1';
            w.wrap.style.gridRow=String(contact?right++:left++);
          }else{
            w.wrap.style.gridColumn='2';w.wrap.style.gridRow=String(right+1);
            w.wrap.classList.add('carbon-correspondence');
            const heading=v.u.el('h4','carbon-correspondence-title',grid,'Correspondence');
            heading.style.gridRow=String(right);right+=2;
          }
        }
        const declaration=v.u.el('div','carbon-declaration-note',grid);
        declaration.style.gridRow=String(right);
        v.u.el('h4','',declaration,'Declaration');
        v.u.el('span','',declaration,'Review your details before making your declaration.');
        v.els.carbonApplication=panel;
      },
      section: (base, S) => (v,name) => {
        const group=base(v,name);
        group.el.querySelector('legend').textContent=name.replace(/^\d+ · /,'');
        return group;
      },
      evidence: (base, S) => v => {
        base(v);
        const fs=v.els.evidenceCount.closest('.gov-section');
        fs.classList.add('carbon-evidence','carbon-panel');
        fs.querySelector('legend').textContent='Evidence checklist';
        const columns=v.u.el('div','carbon-evidence-columns',fs);
        for(const label of ['Status','Document type','Details','','Attachment'])v.u.el('span','',columns,label);
        fs.insertBefore(columns,fs.querySelector('.gov-file'));
        v.els.form.insertBefore(fs,v.els.carbonApplication);
      },
      evidenceRow: (base, S) => (v,parent,d,size,types) => {
        const result=base(v,parent,d,size,types);
        const row=result.attach.closest('.gov-file');
        const badge=row.querySelector('.gov-file-rule');
        badge.classList.add(d.rule.startsWith('Optional')?'carbon-optional':'carbon-required');
        const name=row.querySelector('h4');
        const detail=row.querySelector(':scope > .gov-hint');
        const classification=v.u.el('div','carbon-classification',row);
        const face=v.u.el('button','carbon-select',classification,'Select document type');
        face.type='button';face.setAttribute('aria-label',d.label+' document type');
        face.addEventListener('click',()=>{if(v.ctx.model.docs[d.id].attached)result.buttons.values().next().value.focus();});
        row.replaceChildren(badge,name,detail,classification,result.attach,result.chooser,result.fileState,result.err);
        result.face=face;
        return result;
      },
      sync: (base, S) => (v,m) => {
        base(v,m);
        for(const d of v.s.docs){
          const w=v.docs[d.id],doc=m.docs[d.id];
          w.attach.textContent=doc.attached?'Remove':'Attach…';
          w.face.textContent=doc.type||'Select document type';
          w.face.setAttribute('aria-expanded',String(doc.attached&&!doc.type));
          w.face.setAttribute('aria-disabled',String(!doc.attached));
        }
        const stats=document.querySelector('.gov-stats');
        if(stats){
          const required=v.s.docs.filter(d=>!d.rule.startsWith('Optional'));
          const optional=v.s.docs.filter(d=>d.rule.startsWith('Optional'));
          stats.children[0].textContent='Application status: '+(m.submitted?'Received':m.saved?'Saved draft':'Draft');
          stats.children[1].textContent='Required documents: '+required.filter(d=>m.docs[d.id].attached).length+'/'+required.length+'　 Optional documents: '+optional.filter(d=>m.docs[d.id].attached).length+'/'+optional.length;
        }
      },
      footer: (base, S) => v => {
        base(v);
        // The app's navigation actions occupy the spare toolbar area on wide windows.
        if(v.ctx.size.width>=1000){
          const foot=v.els.primary.closest('.gov-bottom');
          foot.classList.add('carbon-toolbar-actions');
          const toolbar=document.querySelector('.gov-menubar');
          toolbar.insertBefore(foot,toolbar.querySelector('.gov-stats'));
        }
      },
    },
  },
});
