// Design on use-health-records/chart; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'use-health-records',
  site: 'design-use-health-records-vitals-05',
  name: 'design',
  split: 'train',
  scenarios: ['vitals'],
  template: 'use-health-records/chart',
  design: {
    railMinWidth: 0, railMinHeight: 0, fontFamily: '"Arial Narrow","Liberation Sans Narrow","DejaVu Sans Condensed",sans-serif',
    parts: {
      // Single-purpose paper window: no app navigation, encounter toolbar or status strip.
      top: () => () => {},
      menu: () => () => {},
      heading: () => () => {},
      toolbar: () => () => {},
      workflow: () => () => {},
      tabs: () => () => {},
      banner: (_base, S) => (ctx) => {
        const u=ctx.util, p=S.spec.patient, banner=u.el('div','ehr-banner mercy-patient',S.root);
        const identity=u.el('div','mercy-identity',banner);
        u.el('h1','',identity,p.name);
        const meta=u.el('div','mercy-demographics',identity);
        for(const text of [`DOB  ${p.dob}`,p.sex,`MRN ${p.mrn}`]) u.el('span','',meta,text);
        const location=u.el('div','mercy-location',banner);
        for(const [label,value] of [['Medical Unit','3 West'],['Room','318-A'],['Bed','1'],['Code Status','Full Code']]) {
          const cell=u.el('div','',location);u.el('span','',cell,label);u.el('b','',cell,value);
        }
      },
      rail: (_base, S) => (ctx) => {
        const u=ctx.util, p=S.spec.patient, rail=u.el('aside','mercy-patient-rail',S.root);
        const patient=u.el('div','mercy-rail-identity',rail);
        u.el('b','',patient,p.name);u.el('span','',patient,`MRN ${p.mrn}`);
        for(const label of ['Summary','Chart','Vitals','Orders','Medications','Results','Documents','Care Team','Scheduling','Bed Management'])
          u.el('div',label==='Vitals'?'mercy-rail-link active':'mercy-rail-link',rail,label);
      },
      vitals: (base, S) => (ctx) => {
        base(ctx);
        const u=ctx.util, pane=S.pane, sections=[...pane.querySelectorAll(':scope > .ehr-section')];
        const [handoff,entry,history,documentation]=sections;
        const panel=u.el('section','mercy-observations',pane);
        pane.prepend(panel);u.el('h2','mercy-panel-title',panel,'Nursing Observations');
        panel.append(handoff,entry);
        handoff.querySelector('.ehr-sectionhead').textContent='Recent Observations (Handoff)';
        const headers=['Date / Time','Blood Pressure\n(mmHg)','Temperature\n(°C)','Oxygen Saturation\n(%)','Pulse\n(bpm)','Respiratory Rate\n(br/min)'];
        handoff.querySelectorAll('th').forEach((th,i)=>th.textContent=headers[i]);
        const grid=entry.querySelector('.ehr-formgrid');
        const table=u.el('table','mercy-entry-table',entry.querySelector('.ehr-sectionbody'));
        const head=u.el('tr','',u.el('thead','',table));headers.forEach(text=>u.el('th','',head,text));
        const row=u.el('tr','',u.el('tbody','',table));
        for(const ids of [['time'],['bp'],['temp','tunit'],['spo2'],['pulse'],['resp']]) {
          const cell=u.el('td','',row), controls=u.el('div','mercy-entry-controls',cell);
          if(ids[0]==='time') u.el('span','mercy-entry-date',controls,S.spec.date||'2027-10-18');
          for(const id of ids) {const field=S.refs.targets.get(id);if(field)controls.append(field);}
          const unit={bp:'mmHg',spo2:'%',pulse:'bpm',resp:'br/min'}[ids[0]];
          if(unit)u.el('span','mercy-unit',controls,unit);
        }
        // Preserve additional fields in any future vitals preset.
        if(grid.children.length) {grid.classList.add('mercy-extra-fields');} else grid.remove();
        const related=u.el('section','mercy-related',pane);u.el('h2','mercy-panel-title',related,'Related Records');
        const tabs=u.el('div','mercy-record-tabs',related);
        for(const label of ['Observation History','Active Orders','Medications','Results','Documents','Bed History'])u.el('span',label==='Observation History'?'active':'',tabs,label);
        if(history) {history.querySelector('.ehr-sectionhead').remove();related.append(history);}
        if(documentation)documentation.hidden=true;
      },
      actions: (base,S) => (ctx) => {
        base(ctx);
        const panel=S.pane.querySelector('.mercy-observations'), actions=S.main.querySelector('.ehr-actions');
        if(panel&&actions)panel.querySelector('.mercy-panel-title').append(actions);
      },
    },
  },
});
