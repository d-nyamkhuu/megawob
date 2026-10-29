// Design on use-admin-console/console; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'use-admin-console',
  site: 'design-use-admin-console-vm-04',
  name: 'design',
  split: 'train',
  scenarios: ['vm'],
  template: 'use-admin-console/console',
  design: {
    fontSize: 19,
    fontFamily: 'Arial, sans-serif',
    contextAt: 10000,
    parts: {
      topbar: (base, S) => () => S.ctx.util.el('div', 'mac-sheet-title', S.shell, 'Provision a Virtual Machine'),
      sidebar: () => () => {},
      heading: () => () => {},
      tabs: () => () => {},
      toolbar: () => () => {},
      facts: () => () => {},
      vm: (base, S) => (m) => {
        // Keep the template's controls, actions and target registration. Only the
        // presentation around those controls is replaced by the Macintosh sheet.
        base(m);
        const { el } = S.ctx.util;
        const pane = S.main;
        const fields = S.spec.fields;
        const titles = ['Region', 'Operating System', 'Instance Size', 'Boot Disk', 'Network', 'Tags', 'Review'];
        const steps = pane.querySelector('.aa-steps');
        if (steps) {
          steps.classList.add('mac-step-rail');
          [...steps.children].forEach((step, i) => {
            step.querySelector('b').textContent = '';
            step.querySelector('span').textContent = `${i + 1}. ${titles[i]}`;
          });
        }
        const card = pane.querySelector('.aa-section');
        const actions = S.workspace.querySelector('.aa-actions');
        // The other template panels are read-only organization metadata.
        [...pane.children].forEach(node => { if (node !== steps && node !== card || m.created) node.remove(); });
        const column = el('div', 'mac-wizard-column', pane);
        const current = el('div', 'mac-current', column);
        if (card && !m.created) {
          current.append(card);
          card.classList.add('mac-field-card');
          const head = card.querySelector('.aa-section-head');
          if (head && m.step < 6) head.textContent = `${m.step + 1}. ${m.step === 0 ? 'Select Region' : titles[m.step]}`;
          if (m.step === 0) {
            card.querySelector('p').textContent = 'Choose the region where your virtual machine will be created.';
            card.querySelector('label').textContent = 'Region:';
            const body = card.querySelector('.aa-section-body');
            const help = el('p', 'mac-region-help', body);
            el('span', '', help, 'The region determines the datacenter location for your resources. ');
            el('span', '', help, 'You can choose a different region in a later step if needed.');
          }
        }
        if (actions) {
          actions.querySelector('.aa-grow').textContent = '';
          current.append(actions);
        }
        const summary = el('section', 'mac-summary', column);
        el('div', 'mac-summary-title', summary, 'Resource Summary');
        const body = el('div', 'mac-summary-body', summary);
        const cube = el('span', 'mac-cube', body);
        cube.innerHTML = document.querySelector('.mac-inspector .mac-cube').innerHTML;
        cube.querySelector('defs')?.remove();
        const data = el('div', 'mac-summary-data', body);
        const dl = el('dl', 'mac-summary-values', data);
        const resourceName = S.spec.resourceId;
        const values = m.created ? m.saved : m.values;
        const selected = (field, i) => m.created || i < m.step ? values[field.id] : 'Not selected';
        el('dt', '', dl, 'Name:'); el('dd', '', dl, resourceName);
        fields.forEach((field, i) => {
          el('dt', '', dl, `${field.id === 'image' ? 'Operating system' : field.label}:`);
          el('dd', '', dl, selected(field, i));
        });
        const cost = m.step >= 3 || m.created ? `${env.taskDef.helpers.cost(m, S.spec)} (USD)` : '$0.00 (USD)';
        const price = el('div', 'mac-summary-cost', data);
        el('span', '', price, 'Estimated monthly cost:'); el('span', '', price, cost);
        const inspector = document.querySelector('.mac-inspector');
        inspector.querySelector('.mac-resource b').textContent = resourceName;
        const entries = inspector.querySelectorAll('dd');
        entries[0].textContent = resourceName;
        entries[1].textContent = m.created ? 'Created' : 'Not created';
        fields.forEach((field, i) => { entries[i + 2].textContent = m.created || i < m.step ? values[field.id] : '—'; });
        inspector.querySelector('.mac-cost b').textContent = cost;
      },
    },
  },
});
