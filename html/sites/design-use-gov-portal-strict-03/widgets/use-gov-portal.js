// Design on the shared use-gov-portal portal; defaults reproduce the reference scaffold.
env.widget({
  task: 'use-gov-portal',
  site: 'design-use-gov-portal-strict-03',
  name: 'design',
  split: 'train',
  scenarios: ['strict'],
  template: 'use-gov-portal/portal',
  design: {
      fontFamily: 'Georgia,"Times New Roman",serif', fontSize: 20, lineHeight: 1.25,
      insetX: 0, insetY: 0, maxWidth: 2400, maxHeight: 1600,
      shadow: 'none', inputHeight: 39, controlRadius: 0,
    parts: {
      heading: (base) => (v) => {
        const head = v.u.el('header', 'stationery-heading', v.els.app);
        v.u.el('h1', '', head, 'Civic Support Application');
        v.els.pill = v.u.el('span', 'stationery-state', head);
        v.els.stationeryHeading = head;
      },
      main: (base) => (v) => {
        base(v);
        v.els.main.prepend(v.els.stationeryHeading);
      },
      record: (base) => (v) => {
        base(v); // Includes the three original other-case random draws.
        const {u, s, els} = v, source = els.sidePanels.record;
        const title = u.el('h1', 'stationery-record-title', null, 'Applicant Record');
        source.prepend(title);
        const dl = source.querySelector('dl');
        const nameLabel = u.el('dt', '', null, 'Name:');
        const nameValue = u.el('dd', '', null, s.record.name);
        dl.prepend(nameLabel, nameValue);
        const meta = [];
        for (const label of dl.querySelectorAll('dt')) {
          if (/Residence in district|Employment|Dependants/.test(label.textContent)) {
            const value = label.nextElementSibling;
            meta.push(label.textContent + ': ' + value.textContent);
            label.remove(); value.remove(); continue;
          }
          label.textContent = label.textContent.replace('Proposed effective date', 'Effective date').replace('Civic identity number', 'Identity number').replace('Home address', 'Address');
          if (!label.textContent.endsWith(':')) label.textContent += ':';
        }
        const rows = [...dl.querySelectorAll('dt')].map(label => [label, label.nextElementSibling]);
        const rank = ['Name:', 'Effective date:', 'Address:', 'Postcode:', 'Identity number:', 'Email address:'];
        rows.sort((a,b) => rank.indexOf(a[0].textContent) - rank.indexOf(b[0].textContent));
        for (const row of rows) dl.append(...row);
        const rule = source.querySelector('.gov-rule');
        const eligibility = u.el('section', 'stationery-eligibility', source);
        u.el('h2', '', eligibility, 'Eligibility for Civic Support');
        u.el('p', '', eligibility, 'You may be eligible if you:');
        const list = u.el('ul', '', eligibility);
        u.el('li', '', list, `have lived in the district for at least ${s.record.minimum} months (${s.record.months} recorded)`);
        u.el('li', '', list, 'provide a valid identity number');
        u.el('li', '', list, 'use the required date and postcode formats');
        u.el('li', '', list, 'provide only the details that apply');
        eligibility.append(rule);
        u.el('p', 'stationery-residence', eligibility, meta.slice(1).join(' · '));
        const supporting = u.el('section', 'stationery-supporting', source);
        u.el('h3', '', supporting, 'Verified information');
        const facts = u.el('ul', '', supporting);
        for (const label of ['Applicant details', 'Identity and address', 'Correspondence preferences', 'Review and declaration']) u.el('li', '', facts, label);
      },
      introduction: (base) => (v) => {
        base(v);
        v.u.el('h3', 'stationery-personal', v.els.form, 'Personal details');
      },
      field: (base) => (v, f, group) => {
        const w = base(v, f, group);
        w.wrap.dataset.field = f.id;
        w.label.replaceChildren();
        w.label.textContent = f.label + ':';
        return w;
      },
      fields: (base) => (v) => {
        base(v);
        // Preserve the section objects used by sync, while giving the document a single row flow.
        const order = ['name', 'identity', 'date', 'address', 'postcode', 'contact', 'email'];
        for (const [id, w] of Object.entries(v.fields)) {
          const f = v.s.fields.find(f => f.id === id);
          const home = /address/i.test(f.label) && !/email/i.test(f.label);
          const i = home ? 3 : order.indexOf(id);
          if (home) w.wrap.classList.add('stationery-address');
          w.wrap.style.order = i < 0 ? 8 : i + 1;
          if (id === 'name' && !w.wrap.querySelector('.gov-hint')) v.u.el('div', 'gov-hint', w.wrap, 'As shown on your identity document');
          if (home && !w.wrap.querySelector('.gov-hint')) v.u.el('div', 'gov-hint', w.wrap, 'Use your current residential address');
          if (id === 'contact' && !w.wrap.querySelector('.gov-hint')) v.u.el('div', 'gov-hint', w.wrap, 'We will use this to send updates about your application');
          if (id === 'email' && !w.wrap.querySelector('.gov-hint')) v.u.el('div', 'gov-hint', w.wrap, 'Format: name@example.com');
        }
      },
      textInput: (base) => (v, f, field) => {
        if (!/address/i.test(f.label) || /email/i.test(f.label)) return base(v, f, field);
        const input = v.u.el('textarea', 'gov-input', field.wrap);
        input.id = `gov-${f.id}`; field.label.htmlFor = input.id;
        input.autocomplete = 'off'; input.spellcheck = false;
        return input;
      },
      rendered: (base) => (v) => {
        base(v);
        const note = v.u.el('section', 'stationery-declaration-preview', v.els.form);
        v.u.el('h3', '', note, 'Declaration');
        v.u.el('p', '', note, 'I declare that the information provided is correct and complete to the best of my knowledge.');
        v.u.el('small', '', note, 'Check and accept this declaration on the review screen.');
      },
      sync: (base) => (v, model) => {
        base(v, model);
        const completed = v.s.fields.filter(f => String(model.values[f.id] || '').trim()).length;
        const attached = v.s.docs.filter(d => model.docs[d.id].attached).length;
        document.querySelector('.ref-task').dataset.summary = `${model.submitted ? 'Application received' : 'Application draft'}\n${completed} of ${v.s.fields.length} fields completed\n${attached} of ${v.s.docs.length} evidence items added`;
      },
    },
  },
});
