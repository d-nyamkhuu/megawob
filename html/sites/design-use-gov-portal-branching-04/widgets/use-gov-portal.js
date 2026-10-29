// Design on the shared use-gov-portal portal; defaults reproduce the reference scaffold.
env.widget({
  task: 'use-gov-portal',
  site: 'design-use-gov-portal-branching-04',
  name: 'design',
  split: 'train',
  scenarios: ['branching'],
  template: 'use-gov-portal/portal',
  design: {
    fontSize: 16, inputHeight: 40, controlRadius: 8,
    insetX: 0, insetY: 0, maxWidth: 2000, maxHeight: 1600,
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif',
    parts: {
      record: (base, S) => v => {
        // Build the original dossier first, retaining all three other-case draws.
        base(v);
        const {u,s,els} = v;
        const cards = u.el('div','gov-record-cards',els.sidePanels.record);
        const applicant = u.el('section','gov-record-card',cards);
        const title = u.el('h3','gov-card-title',applicant);
        S.P.icon(title,'user');u.el('span','',title,'Applicant record');
        const dl = u.el('dl','gov-record-data',applicant);
        S.P.recordRow(v,dl,'Name',s.record.name);
        for(const f of s.fields) if(f.kind==='text' && f.id!=='name') {
          S.P.recordRow(v,dl,f.id==='date'?'Effective date':f.label,f.source);
        }
        const eligibility = u.el('section','gov-eligibility-card',cards);
        const heading = u.el('h3','gov-card-title',eligibility);
        S.P.icon(heading,'check');u.el('span','',heading,'Eligibility requirements');
        const rules = [
          `Resident in the district for at least ${s.record.minimum} months`,
          `Residence in district: ${s.record.months} months`,
          `Employment: ${s.record.employment}`,
          `Dependants: ${s.record.dependants}`,
          'Only provide employment and household details when they apply.',
          'Provide a declaration and supporting evidence',
        ];
        for(const text of rules) {
          const row=u.el('div','gov-eligibility-row',eligibility);
          S.P.icon(row,'check');u.el('span','',row,text);
        }
        els.recordCards=cards;
      },
      main: (base, S) => v => {
        base(v);
        v.els.pane.insertBefore(v.els.recordCards,v.els.form);
      },
      section: (base, S) => (v,name) => {
        const g=base(v,name);
        const number=Number(name.match(/^\d+/)?.[0] || 0);
        g.el.dataset.section=String(number);
        const legend=g.el.querySelector('legend');
        legend.textContent='';
        const symbol=S.P.icon(legend,number===1?'user':number===5?'mail':'file');
        if(number===2) {
          symbol.querySelector('path').setAttribute('d','M2 11 12 2l10 9h-3v11h-5v-8h-4v8H5V11H2Z');
          symbol.setAttribute('fill','currentColor');
        }
        v.u.el('span','',legend,number===1?'Personal information':number===2?'Your household':number===5?'Correspondence preferences':name.replace(/^\d+\s*·\s*/,''));
        return g;
      },
      rendered: (base, S) => v => {
        base(v);
        const {u,els,groups}=v;
        const left=u.el('div','gov-form-left',els.form);
        const right=u.el('div','gov-form-right',els.form);
        for(const [name,g] of Object.entries(groups)) {
          (/^1\s*·/.test(name)?left:right).append(g.el);
        }
        const personal=Object.entries(groups).find(([name])=>/^1\s*·/.test(name))?.[1];
        if(personal) for(const f of v.s.fields) {
          if(f.kind==='text' && /^5\s*·/.test(f.section)) personal.grid.append(v.fields[f.id].wrap);
        }
        const employment=Object.entries(groups).find(([name])=>/^3\s*·/.test(name))?.[1];
        const dependants=Object.entries(groups).find(([name])=>/^4\s*·/.test(name))?.[1];
        v.fields.dependants?.wrap.classList.add('gov-dependants-trigger');
        if(employment && v.fields.employment) v.fields.employment.wrap.after(employment.el);
        if(dependants && v.fields.dependants) v.fields.dependants.wrap.after(dependants.el);
        // Keep auxiliary files and account material accessible below the task.
        const auxiliary=u.el('details','gov-auxiliary',els.form);
        u.el('summary','',auxiliary,'Account files and application guidance');
        for(const node of [...els.form.children]) {
          if(node.matches('.gov-library,.gov-help-block')) auxiliary.append(node);
        }
        const declaration=u.el('section','gov-declaration-note',right);
        const title=u.el('h3','gov-card-title',declaration);
        S.P.icon(title,'file');u.el('span','',title,'Declaration');
        u.el('p','',declaration,'Confirm that your information is correct and complete when you review your application.');
        S.P.geometry(v);
      },
      sync: (base, S) => (v,m) => {
        base(v,m);
        v.els.recordCards.hidden=m.page!=='form';
      },
    },
  },
});
