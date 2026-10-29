// Design on use-admin-console/console; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'use-admin-console',
  site: 'design-use-admin-console-vm-05',
  name: 'design',
  split: 'train',
  scenarios: ['vm'],
  template: 'use-admin-console/console',
  design: {
    inset: 0, contextAt: 100000, fontFamily: 'Georgia,"Times New Roman",serif', fontSize: 20,
    parts: {
      begin: (base) => (ctx) => {
        base(ctx);
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
        const stage = S.ctx.stage;
        if (!stage.querySelector('.compute-heading')) {
          const heading = el('div', 'compute-heading', stage);
          el('span', 'server-icon', heading, '▤');
          el('strong', '', heading, 'Compute');
          if (stage.cloudForgeInstruction) heading.append(stage.cloudForgeInstruction);
          const headerTools = document.querySelector('.ref-task > .ref-tools');
          if (headerTools?.children.length) {
            headerTools.classList.add('aqua-header-dock');
            document.querySelector('.ref-body').append(headerTools);
          }
          const back = el('div', 'compute-background', stage);
          const tabs = el('div', 'compute-tabs', back);
          for (const text of ['Instances', 'Images', 'Instance Types', 'Key Pairs']) el('span', '', tabs, text);
          const box = el('div', 'instance-box', back);
          el('div', 'instance-caption', box, 'Instances');
          const table = el('table', 'instance-table', box);
          const head = el('tr', '', table);
          for (const label of ['Name','Status','Type','Region']) el('th', '', head, label);
          for (const [name,status] of [['web-01','Running'],['web-02','Running'],['app-01','Stopped'],['db-01','Running'],['test-01','Running'],['staging-01','Stopped']]) {
            const row = el('tr', '', table);
            el('td', '', row, name);
            const cell = el('td', '', row);
            el('i', status.toLowerCase(), cell);
            el('span', '', cell, status);
            el('td', '', row, 'c2.small');
            el('td', '', row, 'East Harbor');
          }
        }
        const steps = main.querySelector('.aa-steps');
        const sections = [...main.querySelectorAll(':scope > .aa-section')];
        const field = sections[0];
        const cost = main.querySelector('.aa-price')?.firstChild?.textContent || '$0.00';
        const actions = S.workspace.querySelector(':scope > .aa-actions');
        const wizard = el('div', 'cf-wizard', main);
        if (steps) {
          wizard.append(steps);
          const labels = ['Region', 'Image', 'Instance Type', 'Storage', 'Network', 'Tags', 'Review'];
          [...steps.children].forEach((item, i) => { item.lastElementChild.textContent = `${i + 1}. ${labels[i]}`; });
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
            if (m.step === 0) {
              body.querySelector('p').textContent = 'Choose the geographic region where your virtual machine will run.';
              el('div', 'cf-hint', body, 'The region determines the location of your resources and can affect performance, availability and pricing.');
            }
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
