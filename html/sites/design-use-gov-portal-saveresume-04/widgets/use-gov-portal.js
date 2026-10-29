// Design on the shared use-gov-portal portal; defaults reproduce the reference scaffold.
env.widget({
  task: 'use-gov-portal',
  site: 'design-use-gov-portal-saveresume-04',
  name: 'design',
  split: 'train',
  scenarios: ['saveresume'],
  template: 'use-gov-portal/portal',
  design: {
    fontFamily: '"Times New Roman",Georgia,serif', fontSize: 18, lineHeight: 1.15,
    insetX: 0, insetY: 0, maxWidth: 1800, maxHeight: 1200,
    parts: {
      // Keep the original builders (and their random draws and live controls),
      // but arrange their contents as the council's saved paper form.
      record: (base, S) => v => {
        base(v);
        const {u,s,els:{sidePanels}}=v, source=sidePanels.record;
        const dl=source.querySelector('dl');
        const archive=u.el('div','gov-record-archive');
        while(source.firstChild) archive.append(source.firstChild);
        archive.hidden=true;source.append(archive);
        const applicant=u.el('section','civic-record-half',source);
        u.el('h3','civic-caption',applicant,'Applicant Record (from council records)');
        const names=u.el('dl','',applicant);
        S.P.recordRow(v,names,'Name:',s.record.name);
        const householdFacts=[];
        while(dl.firstChild) {
          const label=dl.firstChild,value=label.nextSibling;
          if(/Residence in district|Employment|Dependants/.test(label.textContent)) {
            householdFacts.push([label.textContent,value.textContent]);label.remove();value.remove();
          } else {
            if(label.textContent==='Proposed effective date') label.textContent='Effective date:';
            names.append(label,value);
          }
        }
        v.els.householdFacts=householdFacts;
        const rules=u.el('section','civic-rules',source);
        u.el('h3','civic-caption',rules,'Eligibility Requirements');
        const list=u.el('ul','',rules);
        for(const line of [
          `Resident in the district for at least ${s.record.minimum} months`,
          `Current residence: ${s.record.months} months`,
          'Provide proof of identity and address',
          'Confirm employment and household details',
          'Choose a correspondence method',
          'Review your answers and make your declaration'
        ]) u.el('li','',list,line);
      },
      main: (base, S) => v => {
        base(v);
        const bar=v.u.el('div','civic-formbar',v.els.main);
        v.u.el('strong','',bar,'Saved Application');
        v.els.main.insertBefore(bar,v.els.pane);v.els.formbar=bar;
      },
      fields: (base, S) => v => {
        base(v);
        const {u,els:{form}}=v;
        const panel=(cls,title)=>{const p=u.el('section','civic-panel '+cls,form);u.el('h3','civic-caption',p,title);return p;};
        const personal=panel('civic-personal','Personal Information');
        const household=panel('civic-household','Household and Income');
        const correspondence=panel('civic-correspondence','Correspondence Preferences');
        for(const [name,g] of Object.entries(v.groups)) {
          const fieldNames=g.fields.map(f=>f.id+' '+f.label).join(' ');
          const parent=/correspond|contact method|preference/i.test(name+' '+fieldNames)?correspondence:
            /household|circumstance|employment|income|dependant/i.test(name)?household:personal;
          parent.append(g.el);
        }
        // Some scenarios keep the correspondence field in a contact section.
        for(const f of v.s.fields) if(f.kind==='choice'&&/correspond|contact method/i.test(f.label)) correspondence.append(v.fields[f.id].wrap);
        if(!household.querySelector('.gov-field')) {
          for(const f of v.s.fields) if(f.kind==='choice'&&!/correspond|contact method/i.test(f.label)) household.append(v.fields[f.id].wrap);
        }
        if(!household.querySelector('.gov-field')) for(const [label,value] of v.els.householdFacts) {
          const row=u.el('div','civic-readonly-row',household);
          u.el('span','',row,label+':');u.el('span','civic-readonly-value',row,value);
        }
        v.els.civicPersonal=personal;v.els.civicHousehold=household;
      },
      section: (base, S) => (v,name) => {
        const el=v.u.el('div','gov-section',v.els.form);
        const status=v.u.el('span','gov-section-status',el);status.hidden=true;
        return {el,status,grid:v.u.el('div','gov-fields',el),fields:[]};
      },
      evidence: (base, S) => v => {
        base(v);
        const fs=Array.from(v.els.form.children).find(el=>el.matches('fieldset'));
        if(fs){fs.classList.add('civic-panel','civic-evidence');fs.querySelector('legend').textContent='Supporting Evidence';}
        else {
          const box=v.u.el('section','civic-panel civic-evidence',v.els.form);
          v.u.el('h3','civic-caption',box,'Supporting Evidence');
          v.u.el('div','civic-no-evidence',box,'No evidence attachments required for this application.');
        }
      },
      footer: (base, S) => v => {
        base(v);
        const {u,s,els}=v, old=els.primary.parentElement;
        els.formbar.append(els.primary);
        const inspector=u.el('section','civic-inspector',els.app);
        const badge=u.el('div','civic-document',inspector);S.P.icon(badge,'file');
        const body=u.el('div','civic-inspector-body',inspector);
        u.el('h3','civic-caption',body,'Saved Application Details');
        const details=u.el('div','civic-inspector-details',body);
        const dl=u.el('dl','',details);
        for(const [label,value] of [['Reference:',s.ref],['Status:','Draft (not submitted)'],['Form version:','4.2']]) S.P.recordRow(v,dl,label,value);
        els.inspectorStatus=dl.querySelector('dd:nth-of-type(2)');
        const notes=u.el('div','civic-notes',details);u.el('span','',notes,'Notes:');
        const copy=u.el('div','civic-notes-copy',notes,'Saved draft restored.\nCheck entries against the applicant record.');
        const controls=u.el('div','civic-draft-tools',details);controls.append(els.edit,els.save,els.saveStatus);
        old.remove();
        const endFooter=document.querySelector('.ref-foot');
        if(endFooter){endFooter.classList.add('civic-end-footer');inspector.append(endFooter);}
      },
      sync: (base, S) => (v,m) => {
        base(v,m);
        if(m.page==='form') v.els.primary.textContent='Open Review';
        if(v.els.inspectorStatus) v.els.inspectorStatus.textContent=m.submitted?'Submitted':m.saved?'Draft saved':'Draft (not submitted)';
        v.els.formbar.firstChild.textContent=m.page==='form'?'Saved Application':m.page==='review'?'Review and Declaration':'Application Receipt';
        v.els.app.dataset.page=m.page;
      },
    },
  },
});
