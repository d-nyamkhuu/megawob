// Design on the shared use-gov-portal portal; defaults reproduce the reference scaffold.
env.widget({
  task: 'use-gov-portal',
  site: 'design-use-gov-portal-checklist-01',
  name: 'design',
  split: 'train',
  scenarios: ['checklist'],
  template: 'use-gov-portal/portal',
  design: {
      fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, lineHeight: 1.25,
      insetX: 0, insetY: 0, maxWidth: 2000, maxHeight: 1400,
      wideAt: 2200, compactAt: 0, shortAt: 0, narrowAt: 0,
      inputHeight: 29, controlRadius: 0, shadow: 'none',
      title: 'Civic Support Application',
    parts: {
      heading: (base, S) => v => {
        base(v);
        v.els.app.querySelector('.gov-head').classList.add('civic-title');
      },
      record: (base, S) => v => {
        // Build the original record first, retaining all three case-number draws.
        base(v);
        const {u, s, els} = v;
        const source = els.sidePanels.record;
        const original = u.el('div', 'civic-record-extra');
        while (source.firstChild) original.appendChild(source.firstChild);
        original.hidden = true;
        source.appendChild(original);
        const record = u.el('section', 'civic-record-box', source);
        u.el('h3', 'civic-blue-heading', record, 'Applicant Record');
        const dl = u.el('dl', 'civic-record-table', record);
        const row = (label, value) => S.P.recordRow(v, dl, label, value);
        row('Reference No:', s.ref);
        row('Full Name:', s.record.name);
        for (const f of s.fields) if (f.kind === 'text' && f.id !== 'name')
          row((f.id === 'date' ? 'Effective date' : f.label) + ':', f.source);
        row('Residence:', `${s.record.months} months`);
        row('Current Situation:', s.record.employment);
        row('Dependants:', s.record.dependants);
        const rules = u.el('section', 'civic-rules-box', source);
        u.el('h3', 'civic-blue-heading', rules, 'Eligibility Requirements');
        const body = u.el('div', 'civic-rules-body', rules);
        u.el('p', '', body, 'To be eligible for Civic Support you must meet all of the following:');
        const list = u.el('ul', '', body);
        for (const text of [
          `Have lived in this council area for at least ${s.record.minimum} months.`,
          'Complete the application using the verified applicant record.',
          'Provide employment and household details when they apply.',
          'Provide the required evidence listed.',
          'Review the application and accept the declaration.'
        ]) u.el('li', '', list, text);
      },
      fields: (base, S) => v => {
        base(v);
        const column = v.u.el('div', 'civic-application', v.els.form);
        v.u.el('h3', 'civic-orange-heading', column, 'Application Details');
        const body = v.u.el('div', 'civic-fields-body', column);
        let first = true;
        for (const g of Object.values(v.groups)) {
          body.appendChild(g.el);
          const legend = g.el.querySelector('legend');
          if (first) { legend.textContent = 'Personal Information'; first = false; }
          else if (g.fields.some(f => f.id === 'contact')) legend.textContent = 'Correspondence Preferences';
          else g.el.classList.add('civic-continuation');
        }
      },
      evidence: (base, S) => v => {
        base(v);
        const fs = v.els.form.querySelector(':scope > .gov-section');
        if (!fs) return;
        fs.classList.add('civic-evidence');
        fs.querySelector('legend').textContent = 'Evidence Checklist';
        const headers = v.u.el('div', 'civic-evidence-head', fs);
        for (const text of ['Document Type', 'Requirement', 'Attached']) v.u.el('b', '', headers, text);
        fs.insertBefore(headers, fs.querySelector('.gov-file'));
      },
      evidenceRow: (base, S) => (v, parent, d, size, types) => {
        const result = base(v, parent, d, size, types);
        const {u} = v;
        const row = result.attach.closest('.gov-file');
        const title = row.querySelector('.gov-file-title h4');
        const filename = row.querySelector('code');
        const meta = row.querySelector('.gov-file-meta');
        const document = u.el('div', 'civic-document');
        const text = u.el('div', 'civic-document-label', document);
        text.appendChild(title); text.appendChild(filename);
        meta.hidden = true; text.appendChild(meta);
        const toggle = S.P.button(v, document, 'civic-type-toggle', '▼');
        toggle.setAttribute('aria-label', `${d.label} document type`);
        toggle.addEventListener('click', () => {
          if (!v.ctx.model.docs[d.id].attached) return;
          result.open = !result.open;
          S.P.sync(v, v.ctx.model);
        });
        const rule = d.rule.startsWith('Optional') ? 'Optional' :
          d.rule.includes('employed') ? 'If employed' :
          d.rule.includes('dependants') ? 'If dependants' : 'Required';
        const requirement = u.el('div', 'civic-requirement', null, rule);
        requirement.title = d.rule;
        const attached = u.el('div', 'civic-attached');
        const blank = u.el('div', 'civic-attachment-value', attached);
        attached.appendChild(result.attach);
        row.replaceChildren(document, requirement, attached, result.chooser, result.err);
        result.chooser.classList.add('civic-type-menu');
        result.fileState.hidden = true;
        row.appendChild(result.fileState);
        Object.assign(result, {toggle, blank, open: false});
        return result;
      },
      rendered: (base, S) => v => {
        base(v);
        // The related-record index follows the same seeded applicant as the form.
        const cells = document.querySelectorAll('.gov-applicant-grid > span');
        if (cells.length) { cells[0].textContent = v.s.ref; cells[1].textContent = v.s.record.name; }
      },
      sync: (base, S) => (v, m) => {
        base(v, m);
        for (const d of v.s.docs) {
          const w = v.docs[d.id], doc = m.docs[d.id];
          if (!w.toggle) continue;
          if (doc.attached && !w.wasAttached) w.open = true;
          w.wasAttached = doc.attached;
          const open = doc.attached && w.open;
          w.chooser.hidden = !open;
          w.toggle.textContent = (doc.type || '') + ' ▼';
          w.toggle.setAttribute('aria-expanded', String(open));
          w.blank.textContent = doc.attached ? d.file : '';
          w.blank.title = doc.attached ? d.file : '';
          // Keep the choice targets available immediately after attaching a file.
        }
        S.P.geometry(v);
      },
    },
  },
});
