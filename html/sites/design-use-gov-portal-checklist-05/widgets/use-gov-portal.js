// Design on the shared use-gov-portal portal; defaults reproduce the reference scaffold.
env.widget({
  task: 'use-gov-portal',
  site: 'design-use-gov-portal-checklist-05',
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
        const band = u.el('section', 'civic-summary', source);
        const left = u.el('div', 'civic-summary-left', band);
        u.el('h2', '', left, 'Civic Support Application  –  Housing Support');
        const right = u.el('div', 'civic-summary-right', band);
        u.el('h3', '', right, 'Verified Record');
        const value = id => s.fields.find(f => f.id === id)?.source || '';
        const line = (parent, label, text) => {
          const row = u.el('div', 'civic-summary-row', parent);
          u.el('strong', '', row, label);
          u.el('span', '', row, String(text || ''));
        };
        line(left, 'Reference:', s.ref);
        line(left, 'Status:', 'Draft');
        line(left, 'Date started:', value('date'));
        line(left, 'Applicant:', s.record.name);
        line(left, 'Support type:', 'Housing Support');
        line(right, 'Name:', s.record.name);
        for (const f of s.fields) if (f.kind === 'text' && f.id !== 'name')
          line(right, (f.id === 'date' ? 'Effective date' : f.label) + ':', f.source);
      },
      fields: (base, S) => v => {
        base(v);
        const u = v.u;
        const column = u.el('div', 'civic-application', v.els.form);
        const applicant = u.el('div', 'civic-fields-body', column);
        u.el('h3', 'civic-form-heading', applicant, 'Applicant Details');
        const eligibility = u.el('section', 'civic-eligibility', column);
        u.el('h3', 'civic-form-heading', eligibility, 'Eligibility');
        for (const prompt of ['Are you responsible for the housing costs?', 'Do you or your partner receive any other public support?']) {
          const block = u.el('div', 'civic-eligibility-question', eligibility);
          u.el('div', '', block, prompt);
          const choices = u.el('div', 'civic-eligibility-choices', block);
          for (const label of ['Yes', 'No']) {
            const option = u.el('label', '', choices);
            const radio = u.el('input', '', option);
            radio.type = 'radio';
            radio.name = `eligibility-${prompt}`;
            u.el('span', '', option, label);
          }
        }
        const correspondence = u.el('div', 'civic-correspondence', v.els.form);
        u.el('strong', 'civic-correspondence-title', correspondence, 'Preferred correspondence method');
        for (const g of Object.values(v.groups)) {
          if (g.fields.some(f => f.id === 'contact')) correspondence.appendChild(g.el);
          else applicant.appendChild(g.el);
        }
      },
      evidence: (base, S) => v => {
        base(v);
        const fs = v.els.form.querySelector(':scope > .gov-section');
        if (!fs) return;
        fs.classList.add('civic-evidence');
        fs.querySelector('legend').textContent = 'Evidence Documents';
        const headers = v.u.el('div', 'civic-evidence-head', fs);
        for (const text of ['Document type', 'Details', 'Attachment']) v.u.el('b', '', headers, text);
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
        const toggle = S.P.button(v, document, 'civic-type-toggle', 'Select document type');
        toggle.setAttribute('aria-label', `${d.label} document type`);
        toggle.addEventListener('click', () => {
          if (!v.ctx.model.docs[d.id].attached) return;
          result.open = !result.open;
          S.P.sync(v, v.ctx.model);
        });
        const rule = d.rule.startsWith('Optional') ? 'Optional' :
          d.rule.includes('employed') ? 'If employed' :
          d.rule.includes('dependants') ? 'If dependants' : 'Required';
        const requirement = u.el('div', 'civic-requirement', null, d.label);
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
        const stage = v.els.app.parentElement;
        const tabs = v.u.el('div', 'civic-tabs');
        for (const [i, name] of ['Application', 'Evidence', 'Review', 'Correspondence', 'History'].entries()) {
          const tab = v.u.el('span', i ? 'civic-tab' : 'civic-tab active', tabs, name);
          tab.setAttribute('role', 'tab');
          tab.setAttribute('aria-selected', String(i === 0));
        }
        stage.insertBefore(tabs, v.els.app);
        const appActions = v.els.app.querySelector('.gov-bottom');
        const footer = document.querySelector('.ref-foot');
        if (appActions && footer) {
          appActions.classList.add('civic-app-actions');
          footer.insertBefore(appActions, footer.firstChild);
        }
        // The related-record index follows the same seeded applicant as the form.
        const cells = document.querySelectorAll('.gov-applicant-grid > span');
        if (cells.length) cells[0].textContent = v.s.ref;
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
          w.toggle.textContent = (doc.type || 'Select document type') + '  ▾';
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
