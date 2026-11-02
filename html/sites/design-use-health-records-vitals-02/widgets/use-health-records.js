// Design on use-health-records/chart; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'use-health-records',
  site: 'design-use-health-records-vitals-02',
  name: 'design',
  split: 'train',
  scenarios: ['vitals'],
  template: 'use-health-records/chart',
  design: {
    fontFamily: '"Times New Roman",serif', fontSize: '16px', rootInset: '0', rootRadius: '0',
    parts: {
      top: () => () => {},
      menu: () => () => {},
      tabs: () => () => {},
      rail: () => () => {},
      heading: () => () => {},
      toolbar: () => () => {},
      workflow: () => () => {},
      banner: (base, S) => ctx => {
        if(S.unidentified)return base(ctx);
        const el=ctx.util.el, s=S.spec, p=s.patient;
        const band=el('div','ehr-banner riverside-banner',S.root);
        const identity=el('div','r-identity',band);
        el('div','r-name',identity,p.name);
        el('div','r-demographics',identity,`DOB: ${p.dob}     Age: ${2027-Number(p.dob.slice(0,4))}     Sex: ${p.sex}     MRN: ${p.mrn}`);
        el('div','',identity,'Location: Medical Unit 3B     Room: 104     Bed: B');
        el('div','',identity,`Attending: ${s.providers[0]}     Code Status: Full Code     Allergies: No known allergies`);
        const summary=el('div','r-summary',band);
        riversideBadge(el('span','r-summary-icon',summary),'Patient');
        const text=el('div','',summary);
        for(const line of ['Medical Unit 3B','Room 104   Bed B',`Admitted: ${s.date}`,'Dx: Pneumonia',`Precautions: ${p.isolation==='None'?'Standard':p.isolation}`]) el('div','',text,line);
      },
      section: (base, S) => (title,parent=S.pane) => {
        const content=base(title,parent), head=content.previousElementSibling;
        const icon=S.ctx.util.el('span','r-section-icon',head);
        riversideBadge(icon,title);
        head.prepend(icon);
        return content;
      },
      vitals: (base,S) => ctx => {
        // Keep the original historical-observation draws and every registered field.
        base(ctx);
        const el=ctx.util.el, pane=S.pane, sections=[...pane.querySelectorAll(':scope > .ehr-section')];
        const [handoff,form,history,guidance]=sections;
        handoff.classList.add('r-handoff'); form.classList.add('r-form'); history.classList.add('r-history'); guidance.classList.add('r-guidance');
        handoff.querySelector('.ehr-sectionhead span:not(.r-section-icon)').textContent='Nursing Handoff';
        form.querySelector('.ehr-sectionhead span:not(.r-section-icon)').textContent='New Nursing Observation';
        history.querySelector('.ehr-sectionhead span:not(.r-section-icon)').textContent='Previous Nursing Observations';
        guidance.querySelector('.ehr-sectionhead span:not(.r-section-icon)').textContent='Measurement Guidance';
        const guide=guidance.querySelector('.ehr-sectionbody');guide.replaceChildren();
        for(const text of ['Temperature: Document in °C or °F as measured.','Blood Pressure: Enter systolic/diastolic (e.g., 120/80) in mmHg.','Oxygen Saturation (SpO₂): Enter whole number, e.g., 95 %.','Pulse: Enter in beats per minute (bpm).','Respiratory Rate: Enter in breaths per minute (/min).','Include relevant notes (e.g., patient activity, oxygen therapy changes).']) el('div','r-guide-line',guide,'•  '+text);
        const top=el('div','r-workspace',pane), right=el('div','r-entry',top);
        top.prepend(handoff);right.append(form,S.refs.preview);
        pane.prepend(top);
        const table=handoff.querySelector('table'), rows=[...table.rows];
        for(const row of rows) {
          const cells=[...row.cells];
          row.append(cells[0],cells[2],cells[1],cells[3],cells[4],cells[5]);
          el(row===rows[0]?'th':'td','',row,row===rows[0]?'Status':'Recorded');
          if(row!==rows[0]) {cells[1].textContent+=' mmHg';cells[4].textContent+=' bpm';cells[5].textContent+=' /min';}
        }
        const heads=table.rows[0].cells; heads[5].textContent='Resp';
        const old=history.querySelector('table');
        for(const [i,row] of [...old.rows].entries()) {
          const cells=[...row.cells];row.replaceChildren();
          const tag=i?'td':'th';
          const values=i?[cells[0].textContent.split(' | ')[0],cells[0].textContent.split(' | ')[1],cells[2].textContent,cells[1].textContent+' mmHg',cells[3].textContent,cells[4].textContent+' bpm',cells[5].textContent+' /min','--',S.nurse+' RN']:['Date','Time','Temp','BP','SpO₂','Pulse','Resp','Notes','By'];
          for(const value of values)el(tag,'',row,value);
        }
        const fields=[...form.querySelectorAll('.ehr-field')];
        const byLabel=word=>fields.find(field=>field.querySelector('label').textContent.toLowerCase().includes(word));
        const time=byLabel('observed'),temp=byLabel('temperature'),unit=fields.find(field=>field!==temp&&field.querySelector('label').textContent.toLowerCase().includes('unit'));
        const grid=form.querySelector('.ehr-formgrid');
        for(const field of [time,temp,byLabel('blood'),byLabel('oxygen')||byLabel('spo2'),byLabel('pulse'),byLabel('respiratory')].filter(Boolean)) grid.append(field);
        if(time) {time.classList.add('r-time');time.querySelector('label').textContent='Time:';const blank=el('span','r-time-readout',time);time.insertBefore(blank,time.querySelector('.ehr-choices'));el('small','',time,'(HH:MM, 24-hour)');}
        if(temp&&unit) {temp.append(unit.querySelector('.ehr-choices'));for(const [key,value] of S.refs.targets)if(value===unit)S.refs.targets.set(key,temp);unit.remove();temp.classList.add('r-temperature');}
        for(const field of fields) {
          const input=field.querySelector('input');if(input)input.placeholder='';
          const label=field.querySelector('label');if(label&&!label.textContent.endsWith(':'))label.textContent+=':';
        }
        const oxygen=byLabel('spo2');if(oxygen)oxygen.querySelector('label').textContent='Oxygen Saturation:';
        const notes=el('div','r-notes',grid);el('label','',notes,'Additional Notes:');const note=el('textarea','',notes);note.setAttribute('aria-label','Additional Notes');
      },
      preview: (base,S) => model => {
        const el=S.ctx.util.el, preview=S.refs.preview, values=model.saved||model.fields;
        preview.replaceChildren();
        const heading=el('div','r-preview-title',preview);riversideBadge(el('span','r-section-icon',heading),'Preview');el('span','',heading,model.saved?'Entry Preview (Saved)':'Entry Preview (Not Saved)');
        const grid=el('div','r-preview-values',preview);
        const labels=['Time','Temperature','BP','SpO₂','Pulse','Resp'];
        const match=['observed','temperature','blood','spo2','pulse','respiratory'];
        match.forEach((word,i)=>{const desc=S.spec.fields.find(d=>d.label.toLowerCase().includes(word));if(!desc)return;const row=el('div','',grid);el('span','',row,`${labels[i]}:`);let value=values[desc.id]||'--';if(i===1&&values[desc.id])value+=' '+(values[S.spec.fields.find(d=>d.label.toLowerCase().includes('unit')).id]||'');el('span','',row,value);});
        const row=el('div','',grid);el('span','',row,'Notes:');el('span','',row,'--');
        const time=S.root.querySelector('.r-time-readout');if(time)time.textContent=values[S.spec.fields.find(d=>d.label.toLowerCase().includes('observed'))?.id]||'';
      },
      sidebar: (base,S) => ctx => {
        // The base sidebar consumes the original three clinical-result draws.
        base(ctx);
        const side=S.body.querySelector('.ehr-context');
        side.replaceChildren();S.root.append(side);riversideInspector(S,side);
      },
      decorated: (base,S) => ctx => {
        base(ctx);
        if(!S.unidentified&&!S.root.querySelector('.ehr-context')) {
          const side=ctx.util.el('aside','ehr-context',S.root);riversideInspector(S,side);
        }
        const note=document.querySelector('.ref-panel'), side=S.root.querySelector('.ehr-context');
        if(note&&side)side.prepend(note);
        const footer=document.querySelector('.ref-foot'), actions=S.main.querySelector('.ehr-actions');
        if(footer&&actions)actions.append(footer);
      },
    },
  },
});

function riversideBadge(node,title) {
  let art='<path d="M6 4H20V25H3V4Z" fill="#fff"/><path d="M8 2H15V6H8Z" fill="#e5c56e"/><path d="M7 10H17M7 14H17M7 18H17M7 21H14"/>';
  if(/Patient/.test(title)) art='<path d="M3 12H21V26H3Z" fill="#efc855"/><path d="M5 11V6H13V11" fill="#fff"/><path d="M8 25V16Q13 11 19 16V25" fill="#3d92cb"/><path d="M11 9A4 4 0 1 0 19 9A4 4 0 1 0 11 9" fill="#ecc8a0"/><path d="M11 7Q14 1 18 7" fill="#17304d"/><path d="M14 17V24"/>';
  else if(/Medication/.test(title)) art='<path d="M10 4Q15 0 20 4V18Q18 24 12 21V7Z" fill="#f0d78c"/><path d="M11 8Q17 11 20 7" fill="none"/><path d="M3 13Q7 9 11 13L15 17Q17 23 11 26Q8 27 5 23L1 20Q0 16 3 13Z" fill="#e45454"/><path d="M3 13Q7 9 11 13L14 16 6 23 1 20Q0 16 3 13Z" fill="#fafafa"/>';
  else if(/documentation|Guidance/.test(title)) art='<path d="M2 4Q8 1 12 5Q18 1 23 4V25Q17 22 12 26Q7 22 2 25Z" fill="#fff"/><path d="M12 5V26M4 7H8M4 10H8M15 7H20M15 10H20" fill="none"/>';
  else if(/Longitudinal|Previous/.test(title)) art='<path d="M4 5H10L12 8H21V25H4Z" fill="#edc34b"/><path d="M6 5V23M10 10V18" stroke="#fff"/>';
  node.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 29" aria-hidden="true"><g stroke="#1c345e" stroke-width="1.4" stroke-linejoin="round">'+art+'</g></svg>';
}

function riversideInspector(S,side) {
  const el=S.ctx.util.el, s=S.spec, p=s.patient;
  const details=S.P.section('Patient Details',side);details.parentElement.classList.add('r-details');
  for(const [label,value] of [['Name',p.name],['DOB',p.dob],['Age',2027-Number(p.dob.slice(0,4))],['Sex',p.sex],['MRN',p.mrn],['FIN',s.code],['Location','3B-104-B'],['Service','Internal Medicine'],['Attending',s.providers[0]],['Code Status','Full Code'],['Allergies','No known allergies']]) {
    const row=el('div','r-detail-row',details);el('span','',row,`${label}:`);el('span','',row,String(value));
  }
  S.P.readTable(side,'Active Medications',['Medication','Dose','Route','Freq'],s.meds.length?s.meds.map(m=>[m.name,m.dose+' '+m.unit,m.route||'PO',m.frequency]):[['Ceftriaxone','1 g','IV','q24h'],['Azithromycin','500 mg','IV','q24h'],['Acetaminophen','650 mg','PO','q6h PRN'],['Albuterol MDI','2 puff','INH','q4h PRN']]);
  S.P.readTable(side,'Recent Orders',['Date/Time','Order'],S.pastOrders.slice(0,4).map((o,i)=>[`${o.date} ${['10:14','10:14','11:03','13:27'][i]}`,o.name]));
}
