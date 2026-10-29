// Design on the shared use-gov-portal portal; defaults reproduce the reference scaffold.
env.widget({
  task: 'use-gov-portal',
  site: 'design-use-gov-portal-branching-02',
  name: 'design',
  split: 'train',
  scenarios: ['branching'],
  template: 'use-gov-portal/portal',
  design: {
      fontFamily: '"DejaVu Sans Mono","Liberation Mono",monospace',
      fontSize: 16, lineHeight: 1.3, inputHeight: 28,
      insetX: 0, insetY: 0, maxWidth: 2400, maxHeight: 1600,
      shadow: 'none', title: 'Application Form', wideAt: 3000,
    parts: {
      frame: (base) => (v) => {
        base(v);
        v.els.app.style.setProperty('--unit', `${Math.min(1, v.geo.height / 884)}px`);
      },
      heading: (base) => (v) => {
        base(v);
        v.els.pill.closest('.gov-head').hidden = true;
      },
      record: (base) => (v) => {
        // Build the original record first to retain all three case-number draws.
        base(v);
        const {u,s,els:{sidePanels}}=v, source=sidePanels.record;
        const values=s.fields.filter(f=>f.kind==='text').map(f=>[
          f.label==='Registered business activity'?'Business activity':f.label==='Employer name'?'Employer':f.label,f.source]);
        const rows=[['Name:',s.record.name],
          ...values.filter(([label])=>!/full name/i.test(label)),
          ['Residence:',`${s.record.months} months`],
          ['Household:',s.record.dependants==='Yes'?'Has dependants':'No dependants'],
          ['Employment:',s.record.employment],['Household member:',s.record.child],['Status:','Resident']];
        v.recordRows=rows;
        source.replaceChildren();
        u.el('h3','desk-inspector-heading',source,'Applicant Record');
        const table=u.el('table','desk-record-table',source);
        for(const [label,value] of rows){
          const row=u.el('tr','',table);u.el('td','',row,label);u.el('td','',row,value);
        }
        u.el('h3','desk-inspector-heading',source,'Eligibility Rules');
        const rules=u.el('div','desk-rules',source);
        u.el('div','',rules,'To be eligible you must:');
        const list=u.el('ul','',rules);
        for(const text of [
          `have lived in the district for at least ${s.record.minimum} months`,
          'complete the applicant details from the record',
          'provide employment details if employed or self-employed',
          'provide details of your dependants, if any',
          'choose how you wish to receive correspondence',
          'review your answers and accept the declaration',
        ])u.el('li','',list,text);
        u.el('h3','desk-inspector-heading',source,'Required Evidence');
        const evidence=u.el('table','desk-evidence-table',source);
        for(const [label,state] of [['Applicant details','Required'],['Residence period','Required'],['Effective date','Required'],['Employment details (if employed)','If applicable'],['Dependant details (if any)','If applicable']]){
          const row=u.el('tr','',evidence);u.el('td','',row,label);u.el('td','',row,state);
        }
      },
      main: (base) => (v) => {
        base(v);
        const heading=v.u.el('h2','desk-main-heading',null,'Application Form');
        v.els.main.prepend(heading);
      },
      introduction: (base) => (v) => {
        base(v);
        const {u,s,els:{form}}=v;
        form.querySelector('.gov-page-intro').remove();
        const source=u.el('fieldset','desk-reference',null);
        u.el('legend','',source,'Applicant Record (for reference)');
        const table=u.el('table','desk-reference-table',source);
        const address=s.fields.find(f=>/address/i.test(f.label));
        const date=s.fields.find(f=>f.id==='date');
        const rows=[['Name:',s.record.name],['Effective date:',date?.source||''],
          ['Residence:',`${s.record.months} months`],
          ['Address:',address?.source||'Not recorded'],
          ['Household:',s.record.dependants==='Yes'?'Has dependants':'No dependants'],
          ['Employment:',s.record.employment]], half=3;
        for(let i=0;i<half;i++){
          const tr=u.el('tr','',table);
          for(const item of [rows[i],rows[i+half]]){
            u.el('td','desk-ref-label',tr,item?item[0]:'');u.el('td','',tr,item?item[1]:'');
          }
        }
        const eligibility=u.el('fieldset','desk-eligibility',null);
        u.el('legend','',eligibility,'Eligibility');
        const checks=u.el('div','desk-checks',eligibility);
        const requirements=[
          `Residency: ${s.record.eligible?'meets requirement':'does not meet requirement'}`,
          `Minimum residence: ${s.record.minimum} months`,
          'Applicant details: required',
          'Employment details: if applicable',
          'Household details: if applicable',
          'Correspondence choice: required',
          'Declaration: required after review',
        ];
        for(const text of requirements){const row=u.el('div','desk-check-row',checks);u.el('span','desk-tick',row,'✓');u.el('span','',row,text);}
        const title=u.el('h2','desk-form-heading',null,'Your Application');
        form.prepend(source,eligibility,title);
      },
      section: (base) => (v,name) => {
        const section=base(v,name);
        const title=name.replace(/^\d+\s*·\s*/, '');
        section.el.dataset.section=title.toLowerCase();
        section.el.querySelector('legend').textContent=title==='Applicant'?'Personal Information':title==='Eligibility'?'Household and Employment':title;
        return section;
      },
      fields: (base) => (v) => {
        base(v);
        const applicant=Object.values(v.groups).find(g=>/Applicant/.test(g.el.querySelector('legend').textContent)||g.el.dataset.section==='applicant');
        const address=v.s.fields.find(f=>/home address/i.test(f.label));
        if(applicant&&address){
          const field=v.fields[address.id];
          field.wrap.classList.add('desk-address-field');
          applicant.grid.append(field.wrap);
        }
      },
      field: (base) => (v,f,group) => {
        const field=base(v,f,group);
        field.wrap.dataset.field=f.id;
        field.label.replaceChildren();
        v.u.el('span','',field.label,`${f.label}:`);
        return field;
      },
      textInput: (base) => (v,f,field) => {
        const input=base(v,f,field);
        if(f.id==='date')input.placeholder='DD/MM/YYYY';
        return input;
      },
      library: (base) => (v) => {
        base(v);
        v.els.form.querySelector('.gov-library').hidden=true;
        v.els.form.querySelector('.gov-help-block').hidden=true;
        const preview=v.u.el('fieldset','desk-declaration-preview',v.els.form);
        v.u.el('legend','',preview,'Declaration');
        const line=v.u.el('div','desk-declaration-line',preview);
        v.u.el('span','desk-checkbox',line);
        v.u.el('span','',line,'I confirm that the information I have provided is correct and complete.');
        v.u.el('small','',preview,'Complete the declaration on the review screen.');
      },
    },
  },
});
