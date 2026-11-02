// Design on templates/use-hr/workspace.js; defaults reproduce the scaffold.
env.widget({
  task: 'use-hr',
  site: 'design-use-hr-onboarding-05',
  name: 'design',
  split: 'train',
  scenarios: ['onboarding'],
  template: 'use-hr/workspace',
  design: {
    panel: '#f7f8fa', foreground: '#151936', line: '#d3dbe7',
    accent: '#a65359', muted: '#59617e', background: '#eef1f6',
    font: '12px/1.4 Arial, sans-serif',
    parts: {
      hireProgress: (base, S) => function (ctx, checklist) {
        base(ctx, checklist);
        const progress = checklist.querySelector(':scope > .hr-muted');
        const tasks = S.current.s.tasks;
        if (progress) progress.textContent = `${tasks.filter(task => ctx.model.checked[task.id]).length} of ${tasks.length} complete`;
      },
      dateField: (base, S) => function (ctx, setup) {
        base(ctx, setup);
        const label = setup.querySelector('.hr-fieldlabel');
        const input = setup.querySelector('#hr-start-date');
        const validation = setup.querySelector('.hr-validation');
        const row = S.P.element(ctx, 'div', 'app-date-row', setup);
        setup.insertBefore(row, label);
        label.textContent = 'Start Date';
        row.appendChild(label);
        const field = S.P.element(ctx, 'div', 'app-date-field', row);
        S.P.icon(ctx, field, 'calendar');
        field.appendChild(input);
        if (validation) row.appendChild(validation);
      },
      candidateDrawer: (base, S) => function (ctx) {
        base(ctx);
        const drawer = S.current.root.querySelector('.hr-drawer');
        const action = drawer && drawer.querySelector('.hr-danger');
        const tabs = drawer && drawer.querySelector('.hr-profiletabs');
        if (action && tabs) drawer.insertBefore(action, tabs);
      },
      task: (base, S) => function (ctx, checklist, task, i) {
        const button = base(ctx, checklist, task, i);
        const symbol = S.P.element(ctx, 'span', 'app-task-symbol', button);
        S.P.icon(ctx, symbol, ['file', 'laptop', 'shield', 'people', 'checklist'][i % 5]);
        return button;
      },
      onboarding: (base, S) => function (ctx) {
        base(ctx);
        const { work, panes, s } = S.current;
        const layout = work.querySelector('.hr-onboard');
        const checklist = panes.checklist;
        const setup = panes.setup;
        const offer = setup.querySelector('.hr-offer');
        if (!layout || !checklist || !setup || !offer) return;
        layout.classList.add('app-onboard');
        const equipmentTitle = setup.querySelector('h3');
        if (equipmentTitle) equipmentTitle.textContent = 'Equipment Assignment';
        const values = [...offer.querySelectorAll('dd')].map((node) => node.textContent.trim());
        const [name, city] = values;
        const labels = offer.querySelectorAll('dt');
        const details = offer.querySelectorAll('dd');
        ['Position:', 'Work Location:', 'Start Date:', 'Equipment:', 'Reporting To:'].forEach((label, i) => { if (labels[i]) labels[i].textContent = label; });
        if (details[0]) details[0].textContent = s.hire.role;
        // Keep the template's offer evidence, without repeating its target date
        // or adding details selected from the goal equipment field.
        const detailList = offer.querySelector('dl');
        for (const index of [0, 2, 1, 4, 3]) {
          if (labels[index] && details[index]) detailList.append(labels[index], details[index]);
        }
        const add = (tag, cls, parent, value) => S.P.element(ctx, tag, cls, parent, value);
        const viewer = add('section', 'app-offer-pane', layout);
        layout.insertBefore(viewer, checklist);
        add('strong', 'app-doc-heading', viewer, 'Offer Letter');
        const toolbar = add('div', 'app-doc-toolbar', viewer);
        add('span', 'app-doc-filename', toolbar, `Offer_Letter_${String(name || s.hire.name).replace(/\s+/g, '_')}.pdf`);
        const controls = add('span', 'app-doc-controls', toolbar);
        add('span', 'app-zoom-icon', controls, '−');
        add('span', '', controls, '100%');
        add('span', 'app-zoom-icon', controls, '+');
        S.P.icon(ctx, controls, 'download');
        const expand = add('span', 'app-expand-icon', controls);
        expand.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 3H3v6m12-6h6v6M3 15v6h6m12-6v6h-6M3 3l7 7m11-7-7 7M3 21l7-7m11 7-7-7"/></svg>';
        const page = add('div', 'app-doc-page', viewer);
        const mast = add('div', 'app-doc-mast', page);
        const brand = add('div', 'app-doc-brand', mast);
        add('span', 'app-doc-mark', brand);
        add('strong', '', brand, 'GREENFIELD\nTECH');
        add('small', '', mast, 'Greenfield Tech\n123 Market Street\nSan Francisco, CA 94105');
        add('p', 'app-doc-date', page, 'Employment offer');
        add('p', '', page, `${name || s.hire.name}\n${city || s.hire.city}`);
        add('p', '', page, `Dear ${String(name || s.hire.name).split(' ')[0]},`);
        add('p', '', page, `We are pleased to offer you the position of ${s.hire.role} at Greenfield Tech. We are excited for you to join our team.`);
        page.appendChild(offer);
        add('p', '', page, 'This offer is contingent on the successful completion of a background check. We look forward to welcoming you to Greenfield Tech.');
        add('p', '', page, 'Sincerely,');
        const signature = add('div', 'app-doc-signature', page);
        signature.setAttribute('aria-label', 'Jordan Kim');
        signature.innerHTML = '<svg viewBox="0 0 132 36" fill="none" stroke="#4e5770" stroke-width=".9" stroke-linecap="round" stroke-linejoin="round"><path d="M8 17C13 6 37 0 29 12L13 31C6 39 2 32 9 27L24 19M23 23c9-13 16-7 10-1-5 5-9 2-5-2m8-3-3 8 8-9c4-4 6-2 4 1m-3 6c7-11 15-11 9-3-5 7-10 5-5-1L65 4 54 22c-3 6 2 4 6 0m2-2c7-8 12-7 9-2-3 5-10 7-7 1m6 4 6-8-3 9 9-9c4-3 3 1 1 5-3 6 2 4 7 1M87 29 109 5 99 21l16-10-13 13 8 5m3-9 5-6-4 10 7-4m-2 3 6-8-3 9 6-7m-41 15 43-5"/></svg>';
        add('p', 'app-doc-signoff', page, 'Jordan Kim\nHead of People\nGreenfield Tech');
        const navigation = add('nav', 'app-document-nav', layout);
        for (const [symbol, label] of [['people','Overview'],['file','Offer Letter'],['checklist','Onboarding Tasks'],['laptop','Equipment & Access'],['people','Team & Reporting'],['file','Documents']]) {
          const row = add('div', 'app-document-nav-row' + (label === 'Offer Letter' ? ' active' : ''), navigation);
          S.P.icon(ctx, row, symbol);
          add('span', '', row, label);
        }
      },
    },
  },
});
