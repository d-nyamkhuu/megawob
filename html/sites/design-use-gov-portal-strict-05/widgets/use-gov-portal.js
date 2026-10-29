// Design on the shared use-gov-portal portal; defaults reproduce the reference scaffold.
env.widget({
  task: 'use-gov-portal',
  site: 'design-use-gov-portal-strict-05',
  name: 'design',
  split: 'train',
  scenarios: ['strict'],
  template: 'use-gov-portal/portal',
  design: {
    fontFamily: 'Arial, sans-serif',
    fontSize: 18, inputHeight: 40, insetX: 36, insetY: 20,
    maxWidth: 1800, maxHeight: 1400, wideAt: 9999,
    parts: {
      heading: (base, S) => v => {
        base(v);
        const head = v.els.app.querySelector('.gov-head');
        head.querySelector('h2').textContent = 'Civic Support Application';
        const subtitle = head.querySelector('.gov-subtitle');
        subtitle.replaceChildren();
        v.u.el('p', 'civic-description', subtitle, 'Apply for financial support with everyday living costs.');
      },
      introduction: (base, S) => v => {
        base(v);
        const {u,s,els} = v;
        const top = u.el('div', 'civic-top', els.form);
        els.form.prepend(top);
        const record = u.el('section', 'civic-record', top);
        u.el('h3', '', record, 'Applicant record');
        const dl = u.el('dl', '', record);
        S.P.recordRow(v,dl,'Name',s.record.name);
        for (const f of s.fields) if (f.kind === 'text' && f.id !== 'name') {
          S.P.recordRow(v,dl,f.id === 'date' ? 'Proposed date' : f.label,f.source);
        }
        const rules = u.el('section', 'civic-eligibility', top);
        u.el('h3', '', rules, 'Eligibility requirements');
        const list = u.el('ul', '', rules);
        for (const text of [
          `Resident in the district for at least ${s.record.minimum} months`,
          `Applicant residence: ${s.record.months} months`,
          'Your application must match the applicant record',
          'Provide a valid form of ID',
        ]) u.el('li', '', list, text);
        u.el('p', '', rules, 'Your application must match your applicant record and meet all of the above requirements.');
      },
      fields: (base, S) => v => {
        base(v);
        const {u,els,fields,s} = v;
        const columns = u.el('div', 'civic-columns', els.form);
        u.el('h3', 'civic-applicant-title', columns, 'Applicant details');
        const personal = u.el('section', 'civic-personal', columns);
        const contact = u.el('section', 'civic-contact', columns);
        const consent = u.el('div', 'civic-consent', els.form);
        const preference = u.el('section', 'civic-preference', consent);
        u.el('h3', '', preference, 'Correspondence preference');
        u.el('p', 'civic-preference-copy', preference, 'Choose how we should contact you about this application.');
        const declaration = u.el('section', 'civic-declaration-slot', consent);
        Object.assign(els, {civicConsent:consent,civicDeclarationSlot:declaration});
        const priority = ['name','date','id','identity','postcode'];
        const ordered = [...s.fields].sort((a,b) => {
          const rank = f => f.kind === 'choice' ? -1 : priority.includes(f.id) ? priority.indexOf(f.id) : f.id === 'street' ? 10 : 20;
          return rank(a) - rank(b);
        });
        for (const f of ordered) {
          const target = f.id === 'contact' ? preference : /street|address|email|phone/.test(f.id) ? contact : personal;
          if (f.id === 'contact') fields[f.id].wrap.classList.add('civic-contact-choice');
          if (f.id === 'street') fields[f.id].wrap.classList.add('civic-address');
          target.append(fields[f.id].wrap);
        }
        for (const group of Object.values(v.groups)) group.el.classList.add('civic-original-section');
      },
      review: (base, S) => v => {
        base(v);
        const declaration = v.els.check.closest('.gov-declaration');
        declaration.querySelector('strong').textContent = 'Declaration';
        declaration.querySelector('.gov-hint').remove();
        declaration.querySelector('.gov-check span').textContent = 'I confirm that the information I have given is correct and complete to the best of my knowledge.';
        v.u.el('p', 'civic-legal-copy', declaration, 'I understand that if I give false or misleading information this may affect my application.');
        v.els.civicDeclaration = declaration;
      },
      steps: (base, S) => (v,m) => {
        base(v,m);
        const labels = ['Your details','Eligibility','Review'];
        [...v.els.steps.children].forEach((step,i) => { step.lastElementChild.textContent = labels[i]; });
      },
      sync: (base, S) => (v,m) => {
        const {civicDeclaration,civicDeclarationSlot,check,review} = v.els;
        if (civicDeclaration) {
          (m.page === 'form' ? civicDeclarationSlot : review).append(civicDeclaration);
          check.disabled = m.page !== 'review';
        }
        base(v,m);
      },
      footer: (base, S) => v => {
        base(v);
        const {u,els,s} = v;
        const sourceParent = document.querySelector('.ref-inspector') || els.form;
        for (const previous of sourceParent.querySelectorAll('.civic-source')) previous.remove();
        const extra = u.el('details', 'civic-source', sourceParent);
        u.el('summary', '', extra, 'Verified applicant record');
        extra.append(els.sidebar);
        for (const item of els.form.querySelectorAll('.gov-library,.gov-help-block')) extra.append(item);
        const account = document.querySelector('.ref-account-name');
        if (account) account.title = s.record.name;
        const applicant = document.querySelector('.ref-inspector-details dd:nth-of-type(2)');
        if (applicant) applicant.textContent = s.record.name;
      },
    },
  },
});
