// Design on the shared use-gov-portal portal; defaults reproduce the reference scaffold.
env.widget({
  task: 'use-gov-portal',
  site: 'design-use-gov-portal-strict-01',
  name: 'design',
  split: 'train',
  scenarios: ['strict'],
  template: 'use-gov-portal/portal',
  design: {
    fontFamily: 'Arial, sans-serif',
    fontSize: 18, inputHeight: 40, insetX: 0, insetY: 0,
    maxWidth: 1800, maxHeight: 1400, wideAt: 9999,
    parts: {
      heading: (base, S) => v => {
        base(v);
        const head = v.els.app.querySelector('.gov-head');
        head.querySelector('h2').textContent = 'Civic Support Application';
        const subtitle = head.querySelector('.gov-subtitle');
        subtitle.replaceChildren();
        v.u.el('p', 'civic-description', subtitle, 'Apply for financial support with everyday living costs.');
        const note = document.querySelector('.ref-task > .ref-instruction');
        if (note) {
          v.u.el('div','ref-instruction civic-instruction',head,note.textContent); subtitle.hidden = true;
        }
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
        const personal = u.el('section', 'civic-personal', columns);
        u.el('h3', '', personal, 'Personal information');
        const contact = u.el('section', 'civic-contact', columns);
        u.el('h3', '', contact, 'Correspondence preferences');
        const priority = ['id','identity','date','postcode','name'];
        const ordered = [...s.fields].sort((a,b) => {
          const rank = f => f.kind === 'choice' ? -1 : priority.includes(f.id) ? priority.indexOf(f.id) : f.id === 'street' ? 10 : 20;
          return rank(a) - rank(b);
        });
        for (const f of ordered) {
          const target = f.kind === 'choice' || /street|address|email|phone/.test(f.id) ? contact : personal;
          if (f.id === 'street') fields[f.id].wrap.classList.add('civic-address');
          target.append(fields[f.id].wrap);
        }
        for (const group of Object.values(v.groups)) group.el.classList.add('civic-original-section');
      },
      footer: (base, S) => v => {
        base(v);
        const {u,els,s} = v;
        const extra = u.el('details', 'civic-more', els.form);
        u.el('summary', '', extra, 'Applicant services and account information');
        extra.append(els.sidebar);
        const account = document.querySelector('.ref-account-name');
        if (account) account.title = s.record.name;
        const applicant = document.querySelector('.ref-inspector-details dd:nth-of-type(2)');
        if (applicant) applicant.textContent = s.record.name;
      },
    },
  },
});
