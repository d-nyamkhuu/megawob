// Design on the shared use-gov-portal portal; defaults reproduce the reference scaffold.
env.widget({
  task: 'use-gov-portal',
  site: 'design-use-gov-portal-saveresume-02',
  name: 'design',
  split: 'train',
  scenarios: ['saveresume'],
  template: 'use-gov-portal/portal',
  design: {
    fontSize: 14, lineHeight: 1.35, inputHeight: 33, controlRadius: 10,
    insetX: 0, insetY: 0, maxWidth: 2400, maxHeight: 1600,
    adviceWidth: 398, twoColumnsAt: 620,
    parts: {
      sidebar: (base, S) => (v) => {
        base(v);
        const {u, s, els} = v;
        els.sidebar.hidden = true;
        const band = u.el('div', 'saved-record-band', els.app);
        els.app.insertBefore(band, els.work);
        const record = u.el('section', 'saved-record-card', band);
        u.el('h2', '', record, 'Applicant Record');
        const columns = u.el('div', 'saved-record-columns', record);
        const personal = u.el('dl', '', columns), household = u.el('dl', '', columns);
        const row = (parent, label, value) => {
          const line = u.el('div', 'saved-record-row', parent);
          u.el('dt', '', line, label);u.el('dd', '', line, String(value));
        };
        for (const f of s.fields.filter(f => f.kind === 'text')) {
          row(personal.children.length < 4 ? personal : household, f.label, f.source);
        }
        row(household, 'Residence in district', `${s.record.months} months`);
        row(household, 'Employment', s.record.employment);
        row(household, 'Dependants', s.record.dependants);
        const eligibility = u.el('section', 'saved-eligibility-card', band);
        u.el('h2', '', eligibility, 'Eligibility for Civic Support');
        const lead = u.el('div', 'saved-eligibility-lead', eligibility);
        u.el('span', 'saved-check large', lead, s.record.eligible ? '✓' : '!');
        u.el('strong', '', lead, s.record.eligible ? 'You appear to meet the main eligibility requirements.' : 'Please check the residence eligibility requirement.');
        for (const rule of [
          `Resident in the district for at least ${s.record.minimum} months`,
          'Provide employment details where applicable',
          'Include dependent household members where applicable',
          'Check your information against the applicant record',
        ]) {
          const line = u.el('div', 'saved-eligibility-rule', eligibility);
          u.el('span', 'saved-check', line, '✓');u.el('span', '', line, rule);
        }
      },
      introduction: (base, S) => (v) => {
        base(v);
        const intro = v.els.form.querySelector('.gov-page-intro');
        intro.querySelector('h3').textContent = 'Saved Application';
        intro.querySelector('p').textContent = 'Your progress is saved. Review and update the information below.';
      },
      section: (base, S) => (v, name) => {
        const group = base(v, name);
        const title = name.replace(/^\d+\s*·\s*/, '');
        group.el.dataset.section = title.toLowerCase();
        group.el.querySelector('legend').textContent = title === 'Applicant' ? 'Personal details' : /^(Preferences|Correspondence)$/.test(title) ? 'Correspondence preferences' : title;
        return group;
      },
      fields: (base, S) => (v) => {
        base(v);
        const applicant = Object.values(v.groups).find(g => g.el.dataset.section === 'applicant');
        const identity = Object.values(v.groups).find(g => g.el.dataset.section === 'identity');
        if (applicant && identity) {
          identity.el.classList.add('saved-identity');
          applicant.grid.append(identity.el);
        }
        const preference = Object.values(v.groups).find(g => g.el.dataset.section === 'correspondence');
        if (preference) {
          const caption = v.u.el('div', 'saved-correspondence-caption', preference.el);
          v.u.el('strong', '', caption, 'Correspondence preferences');
          v.u.el('small', '', caption, 'We will use this to send letters about your application.');
          preference.el.insertBefore(caption, preference.grid);
          preference.el.setAttribute('aria-label', 'Correspondence preferences');
          const field = preference.fields.find(f => f.kind === 'choice');
          const choices = field && v.fields[field.id].choices;
          if (choices) {
            const post = choices.get('Post');
            if (post) post.parentElement.prepend(post);
            for (const [value, button] of choices) {
              const source = v.s.fields.find(f => value === 'Post' ? /home address/i.test(f.label) : /email/i.test(f.label));
              if (source) v.u.el('small', 'saved-choice-detail', button, source.source);
            }
          }
        }
      },
      choice: (base, S) => (v, parent, value, radioIcon) => {
        const button = base(v, parent, value, radioIcon);
        if (radioIcon) {
          const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          dot.setAttribute('cx', '12');dot.setAttribute('cy', '12');dot.setAttribute('r', '4.5');
          dot.setAttribute('class', 'saved-radio-dot');button.querySelector('svg').append(dot);
        }
        return button;
      },
      advice: (base, S) => (v) => {
        const {u, groups, els} = v;
        const advice = u.el('aside', 'saved-advice', els.work);
        els.advice = advice;
        const taskNote = document.querySelector('.ref-panel');
        if (taskNote) { advice.prepend(taskNote);els.app.classList.add('saved-panel-mode'); }
        const help = u.el('section', 'saved-help-card', advice);
        const heading = u.el('h2', '', help);
        const book = S.P.icon(heading, 'file', 'saved-book-icon');
        book.querySelector('path').setAttribute('d', 'M12 5C8 2 4 2 1 4v17c4-2 7-2 11 0 4-2 7-2 11 0V4c-3-2-7-2-11 1v16M4 7h4m-4 4h4m-4 4h4m8-8h4m-4 4h4m-4 4h4');
        u.el('span', '', heading, 'Help and guidance');
        const answers = [
          ['Who can get civic support?', `Applicants must have lived in the district for at least ${v.s.record.minimum} months.`],
          ['What income is included?', 'Provide employment and household details when they apply to your circumstances.'],
          ['What evidence do I need?', 'Check the evidence checklist in your saved application.'],
          ['How we use your information', 'Resident Services uses your information to assess this application.'],
          ['Contact us', 'Contact Resident Services for help with your application.'],
        ];
        for (const [title, answer] of answers) {
          const item = u.el('details', 'saved-help-item', help);
          u.el('summary', '', item, title);u.el('p', '', item, answer);
        }
        const sections = u.el('section', 'saved-sections-card', advice);
        u.el('h2', '', sections, 'Your saved sections');
        const list = u.el('ul', 'gov-section-list', sections);
        els.adviceItems = new Map();
        for (const [name, group] of Object.entries(groups)) {
          const item = S.P.adviceItem(v, list, name, group);
          item.row.dataset.section = group.el.dataset.section;
          item.row.querySelector('button').textContent = group.el.querySelector('legend').textContent;
          const glyph = S.P.icon(item.row, group.el.dataset.section === 'address' ? 'seal' : group.el.dataset.section === 'correspondence' ? 'mail' : 'user', 'saved-section-icon');
          if (group.el.dataset.section === 'address') glyph.querySelector('path').setAttribute('d', 'M2 11 12 2l10 9h-4v11h-4v-8h-4v8H6V11H2Z');
          els.adviceItems.set(name, item);
        }
        const evidence = u.el('li', 'saved-evidence-jump', list);
        S.P.icon(evidence, 'file', 'saved-section-icon');
        const jump = S.P.button(v, evidence, 'gov-link', 'Supporting evidence');
        jump.addEventListener('click', () => {
          const target = els.form.querySelector('.gov-file-toolbar');
          if (target && v.ctx.model.page === 'form') {els.pane.scrollTop += target.getBoundingClientRect().top - els.pane.getBoundingClientRect().top - 30;S.P.geometry(v);}
        });
        u.el('small', '', evidence, `${v.s.docs.length} documents available`);
        const review = u.el('li', 'saved-review-jump', list);
        const reviewGlyph = S.P.icon(review, 'check', 'saved-section-icon');
        reviewGlyph.querySelector('path').setAttribute('d', 'm2 13 4 4 6-8m2-4h8m-8 5h8m-8 5h8m-8 5h8');
        u.el('span', 'saved-section-label', review, 'Review and declaration');
        els.reviewState = u.el('small', '', review, 'Not started');
      },
      footer: (base, S) => (v) => {
        base(v);
        const quick = document.querySelector('.gov-quick.selected');
        if (quick) {
          quick.replaceWith(v.els.primary);
          v.els.primary.classList.add('gov-quick', 'selected');
        }
        const toolbar = document.querySelector('.gov-quick-actions');
        if (toolbar) {
          // Replacing the frame's review button disables automatic append cleanup here.
          // Remove the previous render's save control before attaching the fresh one.
          toolbar.querySelectorAll('.saved-toolbar-save').forEach(button => button.remove());
          toolbar.append(v.els.save);v.els.save.classList.add('saved-toolbar-save');
        }
      },
      sync: (base, S) => (v, m) => {
        base(v, m);
        v.els.main.querySelector('.gov-bottom').hidden = m.page === 'form';
        v.els.primary.textContent = m.page === 'form' ? 'Open review' : 'Send application';
        const reviewIcon = S.P.icon(v.els.primary, 'file', 'toolbar-review-icon');v.els.primary.prepend(reviewIcon);
        for (const [name, group] of Object.entries(v.groups)) {
          if (group.el.dataset.section === 'identity') continue;
          const related = [...group.fields];
          if (group.el.dataset.section === 'applicant') {
            const identity = Object.values(v.groups).find(g => g.el.dataset.section === 'identity');
            if (identity) related.push(...identity.fields);
          }
          const live = related.filter(f => v.fam.helpers.active(f, m.values));
          const count = live.filter(f => String(m.values[f.id] || '').trim()).length;
          const item = v.els.adviceItems.get(name);
          item.status.textContent = `${count} of ${live.length} ${group.el.dataset.section === 'correspondence' ? 'options selected' : 'fields completed'}`;
        }
        if (v.els.reviewState) v.els.reviewState.textContent = m.submitted ? 'Submitted' : m.declared ? 'Declaration added' : 'Not started';
        // The review footer changes the pane's visible height after base sync.
        S.P.geometry(v);
      },
    },
  },
});
