// Design on the shared use-gov-portal portal; defaults reproduce the reference scaffold.
env.widget({
  task: 'use-gov-portal',
  site: 'design-use-gov-portal-saveresume-03',
  name: 'design',
  split: 'train',
  scenarios: ['saveresume'],
  template: 'use-gov-portal/portal',
  design: {
    fontFamily: 'Arial,"Liberation Sans",sans-serif', fontSize: 16, lineHeight: 1.25,
    insetX: 0, insetY: 0, inputHeight: 25, controlRadius: 0,
    parts: {
      masthead: (base) => (v) => { base(v); v.els.messagesButton.parentElement.parentElement.hidden = true; },
      heading: (base) => (v) => { base(v); v.els.pill.closest('.gov-head').hidden = true; },
      workflow: (base) => (v) => { base(v); v.els.steps.parentElement.hidden = true; },
      record: (base, S) => (v) => {
        base(v); // Retain the three other-application random draws, in order.
        const {u,s,els:{sidePanels}} = v, source = sidePanels.record;
        const other = [...source.querySelectorAll('.gov-other-case')];
        source.replaceChildren();
        const card = u.el('section','civic-record-card',source);
        u.el('h3','civic-panel-title',card,'Applicant record (verified details)');
        const facts = u.el('dl','civic-record-facts',card);
        S.P.recordRow(v,facts,'Name:',s.record.name);
        for (const f of s.fields) if (f.kind === 'text' && f.id !== 'name')
          S.P.recordRow(v,facts,f.label + ':',f.source);
        const eligibility = u.el('section','civic-eligibility',source);
        u.el('h3','civic-panel-title',eligibility,'Eligibility for Housing Support');
        u.el('p','',eligibility,'You may be eligible if you:');
        const list = u.el('ul','',eligibility);
        u.el('li','',list,`have lived in the district for at least ${s.record.minimum} months`);
        u.el('li','',list,'provide employment details if employed');
        u.el('li','',list,'provide household details where applicable');
        u.el('li','',list,'provide the required evidence');
        const circumstances = u.el('p','civic-source-circumstances',eligibility);
        circumstances.textContent = `Verified: ${s.record.months} months in district; ${s.record.employment.toLowerCase()}; dependants: ${s.record.dependants.toLowerCase()}.`;
        const more = u.el('details','civic-other-records',source);
        u.el('summary','',more,'Other applications');
        for (const item of other) more.appendChild(item);
      },
      main: (base) => (v) => {
        base(v);
        v.u.el('h3','civic-form-title',v.els.main,'Saved application (edit details)');
        v.els.main.prepend(v.els.main.lastElementChild);
      },
      section: (base) => (v,name) => {
        const group = base(v,name);
        group.el.querySelector('legend').textContent = name.replace(/^\d+\s*·\s*/, '');
        return group;
      },
      field: (base) => (v,f,group) => {
        const result = base(v,f,group);
        result.label.lastElementChild.textContent = f.label + ':';
        return result;
      },
      fields: (base) => (v) => {
        base(v);
        const combined = {};
        for (const [name,group] of Object.entries(v.groups)) {
          const plain = name.replace(/^\d+\s*·\s*/, '');
          const title = /Applicant|Identity/i.test(plain) ? 'Personal information'
            : /Contact|Correspondence/i.test(plain) ? 'Contact and correspondence' : plain;
          if (combined[title]) {
            combined[title].grid.append(...group.grid.children);
            combined[title].fields.push(...group.fields);
            group.el.remove();
          } else {
            combined[title] = group;
            group.el.querySelector('legend').textContent = title;
            group.el.dataset.section = title;
          }
          delete v.groups[name];
        }
        Object.assign(v.groups,combined);
        const section = v.u.el('fieldset','gov-section civic-situation',v.els.form);
        v.u.el('legend','',section,'Current situation');
        const grid = v.u.el('div','gov-fields',section);
        for (const [label,value] of [['Employment status:',v.s.record.employment],['Dependants:',v.s.record.dependants]]) {
          const row = v.u.el('div','gov-field',grid);
          v.u.el('span','gov-label',row,label);
          v.u.el('span','civic-static-value',row,value);
        }
      },
      evidence: (base) => (v) => {
        base(v);
        if (v.els.evidenceCount) {
          const section = v.els.evidenceCount.closest('fieldset');
          section.classList.add('civic-evidence');
          section.querySelector('legend').textContent = 'Evidence';
        } else {
          const section = v.u.el('fieldset','gov-section civic-evidence',v.els.form);
          v.u.el('legend','',section,'Evidence');
          v.u.el('p','civic-evidence-note',section,'No evidence attachments required. Other account files:');
          v.els.visualEvidence = section;
        }
      },
      library: (base) => (v) => {
        base(v);
        const library = v.els.form.querySelector('.gov-library');
        const help = v.els.form.querySelector('.gov-help-block');
        if (v.els.visualEvidence) v.els.visualEvidence.append(library);
        else {
          const details = v.u.el('details','civic-library',v.els.sidePanels.record);
          v.u.el('summary','',details,'Account files');
          details.append(library);
        }
        v.els.sidePanels.record.append(help);
      },
      sync: (base) => (v,m) => {
        base(v,m);
        if (m.page === 'form') v.els.primary.textContent = 'Open review';
        const stats = document.querySelectorAll('.civic-stats .gov-summary-col');
        if (stats.length === 3) {
          const applicable = v.s.fields.filter(f => v.fam.helpers.active(f,m.values));
          const complete = applicable.filter(f => String(m.values[f.id] || '').trim()).length;
          const added = v.s.docs.filter(d => m.docs[d.id].attached).length;
          const values = [[`Form fields:  ${applicable.length}`,`Entered:  ${complete}`,`Missing or to check:  ${applicable.length - complete}`],
            [`Evidence items:  ${v.s.docs.length}`,`Added:  ${added}`,`Missing:  ${v.s.docs.length - added}`]];
          values.forEach((rows,i) => rows.forEach((text,j) => { stats[i+1].children[j].textContent = text; }));
        }
      },
    },
  },
});
