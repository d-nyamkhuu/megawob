// Design on the shared use-gov-portal portal; defaults reproduce the reference scaffold.
env.widget({
  task: 'use-gov-portal',
  site: 'design-use-gov-portal-checklist-04',
  name: 'design',
  split: 'train',
  scenarios: ['checklist'],
  template: 'use-gov-portal/portal',
  design: {
    fontSize: 16, lineHeight: 1.38, inputHeight: 30,
    insetX: 0, insetY: 0, maxWidth: 2000, maxHeight: 2000, shadow: 'none',
    parts: {
      main: (base, S) => (v) => {
        base(v);
        const summary = v.u.el('div', 'civic-summary', v.els.pane);
        v.els.pane.insertBefore(summary, v.els.form);
        const applicant = v.u.el('section', 'civic-record', summary);
        v.u.el('h2', '', applicant, 'Applicant record');
        const record = v.u.el('dl', 'civic-record-values', applicant);
        const values = [['Full name', v.s.record.name],
          ...v.s.fields.filter(f => f.kind === 'text' && f.id !== 'name').map(f => [f.label, f.source]),
          ['Employment status', v.s.record.employment], ['Dependants', v.s.record.dependants]];
        for (const [label, value] of values) {
          const pair = v.u.el('div', '', record);
          v.u.el('dt', '', pair, label); v.u.el('dd', '', pair, String(value));
        }
        const eligibility = v.u.el('section', 'civic-eligibility', summary);
        v.u.el('h2', '', eligibility, 'Eligibility requirements');
        const rules = [
          ['Residence in district', `${v.s.record.months} months`, v.s.record.eligible],
          ['Minimum residence required', `${v.s.record.minimum} months`, v.s.record.eligible],
          ['Employment status', v.s.record.employment, true],
          ['Dependants', v.s.record.dependants, true],
          ['Required evidence provided', 'Not yet', false],
          ['Application declaration completed', 'Not yet', false],
        ];
        v.els.civicRules = [];
        for (const [label, value, pass] of rules) {
          const row = v.u.el('div', 'civic-rule', eligibility);
          v.u.el('span', `civic-check${pass ? ' passed' : ''}`, row, pass ? '✓' : '');
          v.u.el('span', '', row, label);
          v.els.civicRules.push(v.u.el('span', '', row, String(value)));
        }
      },
      fields: (base) => (v) => {
        const panel = v.u.el('div', 'civic-application', v.els.form);
        v.u.el('h2', '', panel, 'Application for Civic Support');
        base(v);
        for (const group of Object.values(v.groups)) panel.append(group.el);
      },
      section: () => (v, name) => {
        const el = v.u.el('section', 'gov-section', v.els.form);
        v.u.el('h3', '', el, name);
        const status = v.u.el('span', 'gov-section-status', el);
        status.hidden = true;
        return {el, status, grid: v.u.el('div', 'gov-fields', el), fields: []};
      },
      evidence: (base) => (v) => {
        base(v);
        if (!v.s.docs.length) return;
        const panel = v.els.form.lastElementChild;
        panel.classList.add('civic-evidence');
        panel.querySelector('legend').textContent = 'Evidence checklist';
        panel.querySelector(':scope > .gov-hint').textContent = 'Attach the documents below. Select the document type for each file.';
      },
      evidenceRow: (base) => (v, parent, d, size, types) => {
        const result = base(v, parent, d, size, types);
        const row = result.attach.closest('.gov-file');
        row.classList.add('civic-evidence-row');
        const badge = row.querySelector('.gov-file-rule');
        badge.classList.toggle('optional', d.rule.startsWith('Optional'));
        const title = row.querySelector('h4');
        const label = v.u.el('span', '', row, d.label);
        title.replaceChildren(label, badge);
        const placeholder = v.u.el('button', 'civic-document-placeholder', row, 'Select document type');
        placeholder.type = 'button';
        placeholder.setAttribute('aria-label', `${d.label} document type: attach file first`);
        placeholder.addEventListener('click', () => result.attach.focus());
        result.placeholder = placeholder;
        const clip = v.u.el('span', 'civic-paperclip', row);
        clip.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m8 13 7-8a3 3 0 0 1 4 4L10 20a5 5 0 0 1-7-7L13 2a2 2 0 0 1 3 3L6 16a1 1 0 0 1-2-2l9-10"/></svg>';
        result.attach.prepend(clip);
        result.clip = clip;
        return result;
      },
      footer: (base) => (v) => {
        base(v);
        const foot = v.els.primary.closest('.gov-bottom');
        v.els.pane.append(foot);
        const details = v.u.el('details', 'civic-account-details', v.els.pane);
        v.u.el('summary', '', details, 'Other applications and account activity');
        details.append(v.els.sidebar);
      },
      sync: (base) => (v, m) => {
        base(v, m);
        for (const d of v.s.docs) {
          v.docs[d.id].placeholder.hidden = m.docs[d.id].attached;
          v.docs[d.id].attach.prepend(v.docs[d.id].clip);
        }
        const attached = v.s.docs.filter(d => m.docs[d.id].attached).length;
        v.els.civicRules[4].textContent = attached ? attached + ' attached' : 'Not yet';
        v.els.civicRules[5].textContent = m.declared ? 'Yes' : 'Not yet';
      },
    },
  },
});
