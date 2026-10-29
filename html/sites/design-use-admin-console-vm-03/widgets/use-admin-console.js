// Design on use-admin-console/console; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'use-admin-console',
  site: 'design-use-admin-console-vm-03',
  name: 'design',
  split: 'train',
  scenarios: ['vm'],
  template: 'use-admin-console/console',
  design: {
    inset: 0, minWidth: 200, minHeight: 180, sidebarWidth: 0,
    narrowSidebarWidth: 0, contextAt: 10000, fontSize: 18,
    fontFamily: 'Arial, Helvetica, sans-serif', radius: 0,
    parts: {
      topbar: () => () => {},
      sidebar: () => () => {},
      heading: () => () => {},
      tabs: () => () => {},
      toolbar: () => () => {},
      facts: () => () => {},
      vm: (base, S) => (m) => {
        const { util } = S.ctx;
        const el = util.el;
        const P = S.P;
        const fields = S.spec.fields;
        if (m.step < 7) {
          const steps = el('div', 'cloud-steps', S.main);
          const labels = ['Region', 'Image', 'Instance Size', 'Storage', 'Network', 'Tags'];
          fields.forEach((field, i) => {
            const item = el('div', `cloud-step${m.step === i ? ' current' : ''}${i < m.step ? ' complete' : ''}`, steps);
            const number = el('b', '', item);
            if (i < m.step) P.icon(number, 'check');
            else number.textContent = String(i + 1);
            el('span', '', item, labels[i]);
          });
        }
        const fieldArea = el('div', 'cloud-field-area', S.main);
        const fieldBody = el('div', 'cloud-field-body', fieldArea);
        if (m.step < 6) {
          const field = fields[m.step];
          const titles = ['Select a Region', 'Choose an Image', 'Select an Instance Size', 'Configure Storage', 'Select a Network', 'Choose an Environment Tag'];
          el('h3', '', fieldBody, titles[m.step]);
          el('p', 'cloud-field-hint', fieldBody, field.id === 'region' ? 'Choose the region where your virtual machine will be deployed.' : field.hint);
          const picker = P.picker(fieldBody, field.id, m.values[field.id]);
          picker.setAttribute('aria-label', field.label);
          if (field.id === 'region') {
            const pin = el('span', 'cloud-location', picker);
            pin.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 22s8-8.7 8-14a8 8 0 0 0-16 0c0 5.3 8 14 8 14Z"/><circle cx="12" cy="8" r="2.5"/></svg>';
            picker.prepend(pin);
          }
        } else {
          el('h3', '', fieldBody, m.created ? 'Virtual Machine Created' : 'Review Virtual Machine');
          const review = el('dl', 'aa-review', fieldBody);
          for (const field of fields) {
            el('dt', '', review, field.label);
            el('dd', '', review, (m.created ? m.saved : m.values)[field.id]);
          }
          if (m.created) { el('dt', '', review, 'Resource ID'); el('dd', '', review, S.spec.resourceId); }
        }
        const actions = el('div', 'cloud-actions', fieldBody);
        if (m.step > 0 && m.step < 7) P.button(actions, 'Back', { nav: 'back' }, { nav: 'back' }, 'cloud-back');
        const action = m.created ? 'edit' : m.step === 6 ? 'create' : 'next';
        P.button(actions, m.created ? 'Edit configuration' : m.step === 6 ? 'Create virtual machine' : 'Next', { nav: action }, { nav: action }, 'primary cloud-next');
        if (m.step === 0) {
          const globe = el('img', 'cloud-globe', fieldArea);
          globe.src = 'sites/design-use-admin-console-vm-03/assets/globe.svg';
          globe.alt = '';
        }
      },
      decorated: (base, S) => (ctx, m) => {
        const summary = document.querySelector('.ref-resource-summary');
        const values = summary?.querySelectorAll('.ref-summary-dash');
        if (values) S.spec.fields.forEach((field, i) => {
          values[i].textContent = m.step > i || m.created ? (m.created ? m.saved : m.values)[field.id] || '—' : '—';
        });
        const amount = summary?.querySelector('.ref-summary-cost');
        if (amount) amount.textContent = m.step > 0 ? env.taskDef.helpers.cost(m, S.spec) : '$0.00';
      },
    },
  },
});
