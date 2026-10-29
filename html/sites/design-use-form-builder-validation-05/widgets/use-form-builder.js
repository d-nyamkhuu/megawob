// Design on the shared use-form-builder/editor template.
env.widget({
  task: 'use-form-builder',
  site: 'design-use-form-builder-validation-05',
  name: 'design',
  split: 'train',
  scenarios: ['validation'],
  template: 'use-form-builder/editor',
  design: {
    fontFamily: 'monospace', fontSize: '20px',
    accent: '#b8d3ff', background: '#e7e7e7', panel: '#e7e7e7',
    text: '#000', muted: '#333', line: '#808080', radius: '0', inset: 0,
    parts: {
      layout: (base, S) => st => {
        base(st);
        const P = S.P;
        const rail = P.el(st, 'div', 'classic-sections', st.workspace);
        P.el(st, 'b', 'classic-caption', rail, 'Sections:');
        rail.append(st.sections);
        st.workspace.prepend(rail);
        st.root.append(st.tabs);
        const dock = P.el(st, 'nav', 'gem-dock', st.root);
        const icons = [
          '<path d="M9 4h17l6 6v27H9z"/><path d="M26 4v7h6M13 14h13M13 18h13M13 22h13M13 26h13M13 30h10"/>',
          '<path d="M13 6h22v23H13zM9 11h22v23H9z"/><path d="M4 17h22v22H4z"/><path d="M8 22h14"/>',
          '<path d="M18 3h8v8h-8zM6 29h8v9H6zM29 29h8v9h-8zM18 29h8v9h-8zM22 11v9M10 29v-9h23v9M22 20v9"/><path d="M18 16l4 4 4-4"/>',
          '<path d="M22 5C10 5 3 12 4 23c1 9 9 13 16 11 4-1 0-7 5-7h5c10-1 10-11 4-17-3-3-7-5-12-5z"/><circle cx="13" cy="15" r="2"/><circle cx="22" cy="11" r="2"/><circle cx="30" cy="15" r="2"/><circle cx="10" cy="24" r="2"/><circle cx="20" cy="20" r="2"/>',
          '<path d="M7 4h19l5 6v26H7zM25 4v7h6M11 14h12M11 18h10M11 23h8M11 28h8"/><circle cx="28" cy="26" r="8"/><path d="M34 32l7 8" stroke-width="3"/>',
          '<path d="M5 4v34h34M11 35V22h5v13M22 35V8h5v27M33 35V17h5v18"/>'
        ];
        ['Survey','Sections','Logic','Themes','Preview','Reports'].forEach((label, i) => {
          const button = P.el(st, 'button', 'gem-dock-item' + (i === 0 ? ' active' : ''), dock);
          button.type = 'button';
          const art = P.el(st, 'span', 'gem-dock-icon', button);
          art.innerHTML = '<svg viewBox="0 0 44 44" fill="white" stroke="black" stroke-width="2" stroke-linejoin="miter" stroke-linecap="square" aria-hidden="true">' + icons[i] + '</svg>';
          P.el(st, 'span', '', button, label);
          button.addEventListener('click', () => env.log('decoy', {label}));
        });
        const help = P.el(st, 'div', 'classic-help', st.root);
        const helpBar = P.el(st, 'div', 'gem-help-bar', help);
        P.el(st, 'span', '', helpBar, '▤');
        P.el(st, 'b', '', helpBar, 'Help');
        P.el(st, 'b', 'classic-help-title', help, 'Response validation');
        P.el(st, 'p', '', help, 'Set a validation rule to control the type and range of responses for the selected question.');
        P.el(st, 'p', '', help, 'Rules include number range, text length, pattern matching and more. You can also mark a question as required.');
        const tips = P.el(st, 'div', 'gem-tips', help);
        P.el(st, 'b', '', tips, 'Tips:');
        const list = P.el(st, 'ul', '', tips);
        for (const tip of ['Choose a rule that matches the kind of answer you expect.', 'Required questions must be answered.', 'Validation helps ensure consistent and useful responses.']) P.el(st, 'li', '', list, tip);
      },
      tabs: (base, S) => st => {
        base(st);
        const names = {Logic:'Routing', Arrange:'Order', Settings:'Response Policies'};
        for (const button of st.tabs.querySelectorAll('button')) {
          const text = button.textContent.trim();
          if (names[text]) button.textContent = names[text];
        }
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
        const sec = st.ctx.spec.sections.find(s => s.id === st.ctx.model.ui.section);
        P.el(st, 'b', 'classic-caption', region, 'Section ' + (st.ctx.spec.sections.indexOf(sec) + 1) + ': ' + sec.title);
        const canvas = P.pane(st, 'canvas', 'af-canvas classic-table', region);
        const head = P.el(st, 'div', 'classic-table-head', canvas);
        for (const label of ['#', '', 'Question text', 'Type']) P.el(st, 'span', '', head, label);
        const m = st.ctx.model;
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
        P.el(st, 'span', 'gem-lines', P.el(st, 'span', 'classic-icon-cell', card));
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
        b.textContent = 'Add Question…';
        b.setAttribute('aria-label', 'Add Question');
        S.P.register(st, {add: true}, b);
      },
      inspector: (base, S) => (st, p) => {
        if (st.ctx.model.ui.tab === 'logic') return base(st, p);
        const P = S.P, q = env.taskDef.helpers.question(st.ctx.model, st.ctx.model.ui.selected);
        if (!q) { P.el(st, 'div', 'af-empty', p, 'Select a question or add your first question.'); return; }
        const settings = P.el(st, 'fieldset', 'classic-settings', p);
        const number = st.ctx.model.orders[st.ctx.model.ui.section].indexOf(q.id) + 1;
        P.el(st, 'legend', '', settings, 'Question ' + number);
        P.el(st, 'b', 'gem-content-heading', settings, 'Question content');
        P.properties(st, settings, q);
        P.validation(st, settings, q);
        const extra = P.el(st, 'div', 'gem-additional', settings);
        P.el(st, 'b', '', extra, 'Additional options');
        const help = P.el(st, 'label', 'gem-help-field', extra);
        P.el(st, 'span', '', help, 'Help text:');
        const input = P.el(st, 'textarea', '', help);
        input.setAttribute('aria-label', 'Help text');
        const scroll = P.el(st, 'span', 'gem-scrollbar', help);
        P.el(st, 'b', '', scroll, '▲');
        P.el(st, 'span', '', scroll);
        P.el(st, 'b', '', scroll, '▼');
        const del = P.button(st, 'Delete Question', st.questionTools, {remove: q.id}, {remove: q.id});
        del.textContent = 'Delete';
        del.setAttribute('aria-label', 'Delete Question');
        P.register(st, {remove: q.id}, del);
      },
      properties: (base, S) => (st, p, q) => {
        const P = S.P;
        const title = P.field(st, 'Question text:', 'title', q.title, p, 'inspector', true);
        title.dataset.classicTitle = 'true';
        const row = P.el(st, 'div', 'classic-type-row', p);
        P.select(st, 'Question type:', 'type', q.type, row, 'inspector');
        if (q.options.length) {
          const extra = P.el(st, 'details', 'classic-options', p);
          P.el(st, 'summary', '', extra, 'Answer options');
          P.field(st, 'Answer options · one per line', 'options', q.options.join('\n'), extra, 'inspector', true);
        }
      },
      validation: (base, S) => (st, p, q) => {
        const box = S.P.el(st, 'div', 'classic-validation', p);
        S.P.el(st, 'b', 'gem-validation-heading', box, 'Response validation');
        base(st, box, q);
        const label = box.querySelector('.af-field > .af-label');
        if (label) label.textContent = 'Validation rule:';
        const required = box.querySelector('.af-toggle-row b');
        if (required) required.textContent = 'Response is required';
      },
      rendered: (base, S) => st => {
        base(st);
        const header = document.querySelector('.ref-task');
        if (header) header.style.setProperty('--form-title', JSON.stringify('Survey Builder - ' + st.ctx.spec.title));
      },
    },
  },
});
