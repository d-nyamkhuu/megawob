// Design on the shared use-gov-portal portal; defaults reproduce the reference scaffold.
env.widget({
  task: 'use-gov-portal',
  site: 'design-use-gov-portal-saveresume-01',
  name: 'design',
  split: 'train',
  scenarios: ['saveresume'],
  template: 'use-gov-portal/portal',
  design: {
    fontFamily: 'Georgia,"Times New Roman",serif', fontSize: 20, lineHeight: 1.3,
    insetX: 0, insetY: 0, maxWidth: 2000, maxHeight: 1600, inputHeight: 34,
    shadow: 'none', title: 'Saved Application',
    parts: {
      record: (base, S) => (v) => {
        const {u,s,els} = v, source=els.sidePanels.record;
        const card=u.el('section','civic-record-card',source);
        u.el('h2','',card,'Applicant Record');
        const dl=u.el('dl','civic-record-details',card);
        S.P.recordRow(v,dl,'Name',s.record.name);
        const address=s.fields.find(f=>f.kind==='text'&&/address/i.test(f.label));
        const postcode=s.fields.find(f=>f.kind==='text'&&/postcode/i.test(f.label));
        for(const f of s.fields) if(f.kind==='text' && f.id!=='name' && f!==postcode)
          S.P.recordRow(v,dl,f.id==='date'?'Effective date':/identity/i.test(f.label)?'Civic ID':f.label,f===address&&postcode?`${f.source}, ${postcode.source}`:f.source);
        S.P.recordRow(v,dl,'Residence',`${s.record.months} months in district`);
        S.P.recordRow(v,dl,'Household',`${s.record.employment}; dependants: ${s.record.dependants}`);
        const rules=u.el('section','civic-eligibility-card',source);
        u.el('h2','',rules,'Eligibility for Civic Support');
        const list=u.el('ul','civic-eligibility-list',rules);
        for(const text of [
          `Resident in the district for at least ${s.record.minimum} months`,
          'Provide employment details where applicable',
          'Include household details for any dependants',
          'Check your information and accept the declaration',
        ]) u.el('li','',list,text);
        u.el('p','',rules,s.record.eligible?'You appear to meet the main eligibility requirements.':`Residence requirement: ${s.record.minimum} months; applicant record: ${s.record.months} months.`);
        const related=u.el('div','civic-versions',source); related.hidden=true;
        u.el('h3','',related,'Other applications');
        for(const [title,state] of [['Resident parking permit','Issued'],['Address registration','Closed'],['Community travel pass','Renewal due']])
          S.P.otherCase(v,related,title,state);
        els.relatedCases=related;
      },
      fields: (base, S) => (v) => {
        base(v);
        const {u,s,els,groups}=v;
        const columns=u.el('div','civic-form-columns',els.form);
        const personal=u.el('section','civic-personal',columns);
        u.el('h3','civic-section-title',personal,'Personal information');
        const right=u.el('section','civic-preferences',columns);
        u.el('h3','civic-section-title',right,'Correspondence preferences');
        u.el('p','civic-correspondence-intro',right,'We will use your preferred method to send letters and updates about your application.');
        const extra=u.el('div','civic-additional',right);
        u.el('h3','civic-section-title',extra,'Additional information');
        for(const g of Object.values(groups)) {
          g.el.classList.add('civic-field-group');
          if(g.fields.every(f=>f.kind==='text')) personal.append(g.el);
          else if(g.fields.some(f=>/correspond|contact.?method/i.test(f.id+' '+f.label))) right.insertBefore(g.el,extra);
          else extra.append(g.el);
        }
        if(!extra.querySelector('fieldset')) {
          const facts=u.el('dl','civic-circumstances',extra);
          for(const [label,value] of [['Current employment status',s.record.employment],['Dependants',s.record.dependants],['Residence in district',`${s.record.months} months`]]) {
            u.el('dt','',facts,label);u.el('dd','',facts,String(value));
          }
          u.el('p','civic-additional-note',extra,'Only provide employment and household details when they apply.');
        }
        for(const f of s.fields) if(f.kind==='choice' && /correspond|contact.?method/i.test(f.id+' '+f.label)) {
          const email=s.fields.find(x=>x.kind==='text'&&/email/i.test(x.label));
          const address=s.fields.find(x=>x.kind==='text'&&/address/i.test(x.label));
          const postcode=s.fields.find(x=>x.kind==='text'&&/postcode/i.test(x.label));
          for(const [value,button] of v.fields[f.id].choices) {
            const label=button.querySelector('span');
            if(label) {
              label.classList.add('civic-choice-copy');
              const detail=value==='Email'?email?.source:value==='Post'?[address?.source,postcode?.source].filter(Boolean).join(', '):'';
              if(detail)u.el('small','civic-choice-detail',label,detail);
            }
          }
        }
      },
      rendered: (base, S) => (v) => {
        base(v);
        const {u,els}=v;
        const bar=u.el('div','civic-form-heading',els.main);
        u.el('h2','',bar,'Saved Application');
        const tools=u.el('div','civic-form-tools',bar);
        tools.append(els.saveStatus,els.primary);
        const versions=S.P.button(v,tools,'civic-versions-button','View saved versions');
        versions.addEventListener('click',()=>{els.relatedCases.hidden=!els.relatedCases.hidden;});
        els.main.prepend(bar);
        els.app.dataset.page=v.ctx.model.page;
        els.app.dataset.density=v.ctx.size.height<520?'compact':'normal';
        S.P.geometry(v);
      },
      sync: (base, S) => (v,m) => {
        base(v,m);
        v.els.app.dataset.page=m.page;
      },
    },
  },
});
