// Design on the shared use-form-builder/editor template.
env.widget({
  task: 'use-form-builder',
  site: 'design-use-form-builder-reorder-04',
  name: 'design',
  split: 'train',
  scenarios: ['reorder'],
  template: 'use-form-builder/editor',
  design: {
      fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '24px',
      accent: '#111', background: '#f8f7f5', panel: '#fff', text: '#111', muted: '#333', line: '#b9b9b9',
      inset: 0, radius: '0', rowMin: 60, rowMax: 60,
    parts: {
      layout: (base, S) => (st) => {
        base(st);
        st.root.classList.add('ink-editor');
      },
      questionPanels: (base, S) => (st) => {
        const P = S.P, m = st.ctx.model, F = env.taskDef;
        const left = P.pane(st, 'canvas', 'ink-sections');
        const sectionsHeading = P.el(st, 'h2', 'ink-heading', left, 'Sections');
        P.register(st, {tab: 'arrange'}, sectionsHeading);
        sectionsHeading.addEventListener('click', () => P.commit(st, {ui: {tab: 'arrange'}}));
        const sectionTools = P.el(st, 'div', 'ink-tools', left);
        P.button(st, '＋ Add section', sectionTools, null, null, 'ink-add-section');
        const move = (name, direction) => {
          const order = (name === 'sections' ? m.sectionOrder : m.orders[m.ui.section]).slice();
          const selected = name === 'sections' ? m.ui.section : m.ui.selected;
          const i = order.indexOf(selected), j = i + direction;
          if (i < 0 || j < 0 || j >= order.length) return;
          [order[i], order[j]] = [order[j], order[i]];
          P.commit(st, {order: [name, order]});
        };
        for (const dir of [-1, 1]) {
          const b = P.button(st, dir < 0 ? '↑' : '↓', sectionTools, null, null, 'ink-arrow');
          b.title = dir < 0 ? 'Move section up' : 'Move section down';
          b.disabled = m.sectionOrder.indexOf(m.ui.section) === (dir < 0 ? 0 : m.sectionOrder.length - 1);
          b.addEventListener('click', () => move('sections', dir));
        }
        P.orderList(st, 'sections', left, m.sectionOrder, id => st.ctx.spec.sections.find(s => s.id === id).title);
        const right = P.pane(st, 'inspector', 'ink-main');
        const top = P.el(st, 'div', 'ink-question-head', right);
        const questionsHeading = P.el(st, 'h2', 'ink-heading', top, 'Questions in this section');
        P.register(st, {tab: 'questions'}, questionsHeading);
        questionsHeading.addEventListener('click', () => P.commit(st, {ui: {tab: 'questions'}}));
        const tools = P.el(st, 'div', 'ink-tools', top);
        P.button(st, '＋ Add question', tools, {add: true}, {ui: {open: m.ui.open === 'add' ? null : 'add'}});
        for (const dir of [-1, 1]) {
          const b = P.button(st, dir < 0 ? '↑' : '↓', tools, null, null, 'ink-arrow');
          b.title = dir < 0 ? 'Move question up' : 'Move question down';
          b.disabled = m.orders[m.ui.section].indexOf(m.ui.selected) === (dir < 0 ? 0 : m.orders[m.ui.section].length - 1);
          b.addEventListener('click', () => move('questions', dir));
        }
        P.orderList(st, 'questions', right, m.orders[m.ui.section], id => F.helpers.question(m, id).title);
        const edit = P.el(st, 'section', 'ink-edit', right);
        P.el(st, 'h2', 'ink-heading', edit, 'Edit question');
        const form = P.el(st, 'div', 'ink-form', edit);
        P.inspector(st, form);
      },
      arrange: (base, S) => (st) => S.P.questionPanels(st),
      orderRow: (base, S) => (st, name, box, id, labelOf, height) => {
        const row = base(st, name, box, id, labelOf, height), P = S.P, m = st.ctx.model;
        row.classList.add('ink-row');
        const grip = row.querySelector('.af-grip');
        grip.replaceChildren(); grip.textContent = '≡';
        row.querySelector(':scope > svg')?.remove();
        const subtitle = row.querySelector('.af-order-label small');
        if (name === 'sections') {
          subtitle.remove();
          P.register(st, {section: id}, row, 'canvas');
        } else {
          row.classList.toggle('selected', m.ui.selected === id);
          subtitle.className = 'ink-type'; row.append(subtitle);
          P.el(st, 'span', 'ink-chevron', row, '⌄');
          P.el(st, 'span', 'ink-more', row, '⋯');
          P.register(st, {question: id}, row, 'inspector');
          row.addEventListener('click', e => {
            if (!e.target.closest('.af-grip')) P.commit(st, {ui: {selected: id}});
          });
        }
        row.tabIndex = 0;
        row.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            P.commit(st, {ui: name === 'sections' ? {section: id, selected: m.orders[id][0]} : {selected: id}});
          }
        });
        return row;
      },
      properties: (base, S) => (st, p, q) => {
        const P = S.P;
        P.field(st, 'Question text', 'title', q.title, p, 'inspector');
        const pair = P.el(st, 'div', 'ink-pair', p);
        P.select(st, 'Question type', 'type', q.type, pair, 'inspector');
        st.inkRequiredPair = pair;
        const help = P.el(st, 'label', 'af-field ink-help-text', p);
        P.el(st, 'span', 'af-label', help, 'Help text (optional)');
        const input = P.el(st, 'input', 'af-input', help); input.type = 'text';
        st.inkHelp ||= new Map();
        input.value = st.inkHelp.get(q.id) || '';
        input.addEventListener('input', () => st.inkHelp.set(q.id, input.value));
        if (q.options.length) P.field(st, 'Answer options · one per line', 'options', q.options.join('\n'), p, 'inspector', true);
      },
      validation: (base, S) => (st, p, q) => {
        const P = S.P, validation = P.el(st, 'div', 'ink-validation', p);
        base(st, validation, q);
        validation.querySelector('h3').textContent = '⌄  Validation';
        const required = validation.querySelector('.af-toggle-row');
        st.inkRequiredPair.append(required);
        const policy = P.el(st, 'div', 'ink-policy', p);
        P.el(st, 'h3', '', policy, '⌄  Response policy');
        P.toggle(st, 'Limit to one response', '', 'one', st.ctx.model.settings.one, policy, 'inspector');
      },
      toggle: (base, S) => (st, label, hint, name, on, parent, pane) => {
        const b = base(st, label, hint, name, on, parent, pane);
        b.textContent = on ? 'Yes' : 'No';
        b.classList.add('ink-boolean');
        return b;
      },
    },
  },
});
