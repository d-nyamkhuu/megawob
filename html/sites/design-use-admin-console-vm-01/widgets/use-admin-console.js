// Design on use-admin-console/console; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'use-admin-console',
  site: 'design-use-admin-console-vm-01',
  name: 'design',
  split: 'train',
  scenarios: ['vm'],
  template: 'use-admin-console/console',
  design: {
    inset: 0, contextAt: 100000, fontFamily: 'Georgia,"Times New Roman",serif', fontSize: 20,
    parts: {
      begin: (base) => (ctx) => {
        base(ctx);
        if (ctx.stage.cloudForgeInstruction) ctx.stage.append(ctx.stage.cloudForgeInstruction);
      },
      topbar: () => () => {},
      sidebar: () => () => {},
      heading: () => () => {},
      tabs: () => () => {},
      toolbar: () => () => {},
      related: () => () => {},
      facts: () => () => {},
      vm: (base, S) => (m) => {
        // Build the original controls first, retaining their targets and mutations.
        base(m);
        const el = S.ctx.util.el, main = S.main;
        const steps = main.querySelector('.aa-steps');
        const sections = [...main.querySelectorAll(':scope > .aa-section')];
        const field = sections[0];
        const cost = main.querySelector('.aa-price')?.firstChild?.textContent || '$0.00';
        const actions = S.workspace.querySelector(':scope > .aa-actions');
        const wizard = el('div', 'cf-wizard', main);
        if (steps) {
          wizard.append(steps);
          const labels = ['Select region', 'Choose image', 'Select instance size', 'Configure storage', 'Select network', 'Add tags', 'Review'];
          [...steps.children].forEach((item, i) => { item.lastElementChild.textContent = labels[i]; });
        }
        const pane = el('div', 'cf-field-pane', wizard);
        if (field) {
          pane.append(field);
          if (m.step < 6) {
            const heading = field.querySelector('.aa-section-head');
            const titles = ['Select region', 'Choose image', 'Select instance size', 'Configure storage', 'Select network', 'Add tags'];
            heading.replaceChildren();
            el('h3', '', heading, titles[m.step]);
            const body = field.querySelector('.aa-section-body');
            if (m.step === 0) body.querySelector('p').textContent = 'Choose the region where your virtual machine will run. Select a region close to your users to reduce latency and improve performance.';
            body.querySelector('.aa-label').textContent = S.spec.fields[m.step].label;
          }
        }
        if (actions) {
          pane.append(actions);
          const draft = actions.querySelector('.aa-grow');
          if (draft) draft.textContent = '';
          const next = actions.lastElementChild;
          if (next?.querySelector('span')) next.append(next.querySelector('.aa-icon'));
        }
        // The summary replaces the inherited defaults, policy and inventory cards.
        for (const node of [...main.children]) if (node !== wizard) node.remove();
        const summary = el('section', 'cf-summary', main);
        el('h3', '', summary, 'Resource summary');
        const row = el('div', 'cf-overview-row', summary);
        const table = el('table', 'cf-values', row);
        const add = (label, value) => {
          const tr = el('tr', '', table);
          el('td', '', tr, label); el('td', '', tr, value);
        };
        add('Name (auto-generated)', S.spec.resourceId);
        for (const field of S.spec.fields) add(field.label, (m.created ? m.saved : m.values)[field.id] || (field.id === 'disk' ? '—' : 'Not selected'));
        const estimate = el('div', 'cf-estimate', row);
        el('h4', '', estimate, 'Estimated monthly cost');
        const price = el('div', 'cf-price', estimate, cost);
        el('small', '', price, ' USD');
        el('p', '', estimate, '(estimate until configuration is complete)');
      },
    },
  },
});
