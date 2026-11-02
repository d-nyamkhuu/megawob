// Design on the shared use-form-builder/editor template.
env.widget({
  task: 'use-form-builder',
  site: 'design-use-form-builder-validation-01',
  name: 'design',
  split: 'train',
  scenarios: ['validation'],
  template: 'use-form-builder/editor',
  design: {
    fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '18px',
    accent: '#000080', background: '#c0c0c0', panel: '#c0c0c0',
    text: '#000', muted: '#333', line: '#808080', radius: '0', inset: 0,
    parts: {
      layout: (base, S) => st => {
        base(st);
        const P = S.P;
        const rail = P.el(st, 'div', 'classic-sections', st.workspace);
        P.el(st, 'b', 'classic-caption', rail, 'Sections:');
        rail.append(st.sections);
        const tools = P.el(st, 'div', 'classic-section-tools', rail);
        for (const label of ['Add Section', 'Rename', 'Delete']) {
          const b = P.button(st, label, tools);
          b.addEventListener('click', () => env.log('decoy', {label}));
        }
        st.workspace.prepend(rail);
        const help = P.el(st, 'div', 'classic-help', st.root);
        P.el(st, 'b', 'classic-help-title', help, 'Help: Response validation');
        P.el(st, 'p', '', help, 'Choose a validation preset and enter any values. Validation helps ensure that responses are in the format and range you expect. You can also mark a question as required.');
        P.el(st, 'p', '', help, 'Common presets include: Number range, Text length, and Pattern (e.g., email address, URL).');
      },
      sectionButton: (base, S) => (st, id) => {
        base(st, id);
        const b = st.sections.lastElementChild;
        const title = st.ctx.spec.sections.find(s => s.id === id).title;
        b.querySelector('.af-section-label').textContent = title;
        const icon = S.P.el(st, 'span', 'classic-document', null, '');
        b.prepend(icon);
      },
      questionPanels: (base, S) => st => {
        const P = S.P;
        const region = P.el(st, 'div', 'classic-question-region', st.body);
        P.el(st, 'b', 'classic-caption', region, 'Questions in this section:');
        const canvas = P.pane(st, 'canvas', 'af-canvas classic-table', region);
        const head = P.el(st, 'div', 'classic-table-head', canvas);
        for (const label of ['#', '', 'Question text', 'Type']) P.el(st, 'span', '', head, label);
        const m = st.ctx.model;
        const sec = st.ctx.spec.sections.find(s => s.id === m.ui.section);
        for (const id of m.orders[sec.id]) {
          const q = env.taskDef.helpers.question(m, id);
          if (q) P.questionCard(st, canvas, sec, id, q);
        }
        st.questionTools = P.el(st, 'div', 'classic-question-tools', region);
        P.addControl(st, st.questionTools);
        const edit = P.button(st, 'Edit Question', st.questionTools);
        edit.addEventListener('click', () => st.body.querySelector('[data-classic-title]')?.focus());
        const inspector = P.pane(st, 'inspector', 'af-inspector', st.body);
        P.inspector(st, inspector);
        const arrows = P.el(st, 'div', 'classic-arrows', st.questionTools);
        for (const label of ['⬆', '⬇']) {
          const b = P.button(st, label, arrows);
          b.setAttribute('aria-label', label === '⬆' ? 'Move question up' : 'Move question down');
          b.addEventListener('click', () => env.log('decoy', {label}));
        }
      },
      questionCard: (base, S) => (st, parent, sec, id, q) => {
        const P = S.P;
        const card = P.el(st, 'div', 'classic-question-row' + (st.ctx.model.ui.selected === id ? ' selected' : ''), parent);
        card.tabIndex = 0;
        card.setAttribute('role', 'button'); card.setAttribute('aria-label', q.title);
        P.register(st, {question: id}, card, 'canvas');
        const select = () => P.commit(st, {ui: {selected: id}});
        card.addEventListener('click', select);
        card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(); } });
        P.el(st, 'span', '', card, String(st.ctx.model.orders[sec.id].indexOf(id) + 1));
        P.el(st, 'span', 'classic-document' + (q.type === 'Number' ? ' classic-number-document' : ''), P.el(st, 'span', 'classic-icon-cell', card));
        const title = P.el(st, 'span', '', card, q.title);
        const type = P.el(st, 'span', '', card, q.type);
        st.syncers.push(() => {
          const now = env.taskDef.helpers.question(st.ctx.model, id);
          if (now) { title.textContent = now.title; type.textContent = now.type; card.setAttribute('aria-label', now.title); }
        });
        P.questionDecorated(st, card, q);
        return card;
      },
      addControl: (base, S) => (st, parent) => {
        const b = S.P.button(st, 'Add Question', parent, {add: true}, {ui: {open: st.ctx.model.ui.open === 'add' ? null : 'add'}});
        S.P.register(st, {add: true}, b);
      },
      inspector: (base, S) => (st, p) => {
        if (st.ctx.model.ui.tab === 'logic') return base(st, p);
        const P = S.P, q = env.taskDef.helpers.question(st.ctx.model, st.ctx.model.ui.selected);
        if (!q) { P.el(st, 'div', 'af-empty', p, 'Select a question or add your first question.'); return; }
        const settings = P.el(st, 'fieldset', 'classic-settings', p);
        P.el(st, 'legend', '', settings, 'Question settings');
        P.properties(st, settings, q);
        P.validation(st, settings, q);
        const del = P.button(st, 'Delete Question', st.questionTools, {remove: q.id}, {remove: q.id});
        P.register(st, {remove: q.id}, del);
      },
      properties: (base, S) => (st, p, q) => {
        const P = S.P;
        const title = P.field(st, 'Question text:', 'title', q.title, p, 'inspector');
        title.dataset.classicTitle = 'true';
        const row = P.el(st, 'div', 'classic-type-row', p);
        P.select(st, 'Response type:', 'type', q.type, row, 'inspector');
        if (q.options.length) {
          const extra = P.el(st, 'details', 'classic-options', p);
          P.el(st, 'summary', '', extra, 'Answer options');
          P.field(st, 'Answer options · one per line', 'options', q.options.join('\n'), extra, 'inspector', true);
        }
      },
      validation: (base, S) => (st, p, q) => {
        const box = S.P.el(st, 'fieldset', 'classic-validation', p);
        S.P.el(st, 'legend', '', box, 'Validation');
        base(st, box, q);
      },
      rendered: (base, S) => st => {
        base(st);
        const header = document.querySelector('.ref-task');
        if (header) header.style.setProperty('--form-title', JSON.stringify('Form Builder - ' + st.ctx.spec.title));
      },
    },
  },
});
