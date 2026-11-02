// Design on the shared use-form-builder/editor template.
env.widget({
  task: 'use-form-builder',
  site: 'design-use-form-builder-addq-01',
  name: 'design',
  split: 'train',
  scenarios: ['addq'],
  template: 'use-form-builder/editor',
  design: {
    inset: 0, radius: '0', fontFamily: 'Arial, Helvetica, sans-serif',
    background: '#c3c1b8', panel: '#c3c1b8', text: '#111', muted: '#333',
    line: '#777', accent: '#88a4c7', columns: '43% minmax(0,1fr)',
    parts: {
      topbar: (base, S) => (st) => {
        base(st);
        st.top.classList.add('motif-app-tools');
        const menu = document.querySelector('.motif-menubar span');
        menu.tabIndex = 0;
        menu.addEventListener('click', () => st.top.classList.toggle('open'));
      },
      sidebar: () => () => {},
      tabs: (base, S) => (st) => {
        const P = S.P;
        const rail = document.querySelector('.motif-rail');
        st.tabs = rail;
        st.tabButtons = {};
        for (const [id, label] of S.D.tabs) {
          const title = {questions:'Questions', logic:'Logic', settings:'Settings'}[id];
          const old = title && [...rail.children].find(n => n.textContent.trim() === title);
          const b = P.button(st, '', old ? rail : st.top, {tab:id}, {ui:{tab:id}}, old ? 'motif-rail-item' : 'motif-arrange');
          if (old) { b.append(...old.childNodes); old.replaceWith(b); }
          else b.textContent = label;
          b.setAttribute('role', 'tab');
          st.tabButtons[id] = b;
        }
      },
      sectionButton: (base, S) => (st, id) => {
        base(st, id);
        const b = st.sections.lastElementChild;
        b.querySelector('.af-section-label').textContent = st.ctx.spec.sections.find(s => s.id === id).title;
        b.querySelector('small')?.remove();
      },
      questionPanels: (base, S) => (st) => {
        const P = S.P;
        const left = P.el(st, 'div', 'motif-question-pane', st.body);
        P.el(st, 'h3', '', left, 'Questions in this section:');
        const middle = P.el(st, 'div', 'motif-question-middle', left);
        const list = P.pane(st, 'canvas', 'motif-question-list', middle);
        const arrows = P.el(st, 'div', 'motif-order-buttons', middle);
        for (const [label, delta] of [['▲', -1], ['▼', 1]]) {
          const b = P.button(st, label, arrows);
          b.setAttribute('aria-label', delta < 0 ? 'Move question up' : 'Move question down');
          b.addEventListener('click', () => {
            const m = st.ctx.model, order = [...m.orders[m.ui.section]], i = order.indexOf(m.ui.selected), j = i + delta;
            if (i < 0 || j < 0 || j >= order.length) return;
            [order[i], order[j]] = [order[j], order[i]];
            P.commit(st, {order:['questions', order]});
          });
        }
        const m = st.ctx.model, sec = st.ctx.spec.sections.find(s => s.id === m.ui.section);
        for (const id of m.orders[sec.id]) {
          const q = env.taskDef.helpers.question(m, id);
          if (q) P.questionCard(st, list, sec, id, q);
        }
        const actions = P.el(st, 'div', 'motif-question-actions', left);
        P.addControl(st, actions);
        const duplicate = P.button(st, 'Duplicate', actions);
        duplicate.addEventListener('click', () => env.log('decoy', {label:'Duplicate'}));
        if (m.ui.selected) P.button(st, 'Delete', actions, {remove:m.ui.selected}, {remove:m.ui.selected});
        const inspector = P.pane(st, 'inspector', 'af-inspector motif-inspector');
        P.inspector(st, inspector);
      },
      questionCard: (base, S) => (st, parent, sec, id, q) => {
        const P = S.P, m = st.ctx.model;
        const row = P.el(st, 'div', 'motif-question-row' + (m.ui.selected === id ? ' selected' : ''), parent);
        row.tabIndex = 0;
        row.setAttribute('role', 'button');
        row.setAttribute('aria-label', q.title);
        P.register(st, {question:id}, row, 'canvas');
        const select = () => P.commit(st, {ui:{selected:id}});
        row.addEventListener('click', select);
        row.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') {e.preventDefault(); select();} });
        P.el(st, 'span', 'motif-question-number', row, String(m.orders[sec.id].indexOf(id) + 1));
        const name = P.el(st, 'span', 'motif-question-name', row, q.title);
        st.syncers.push(() => { const now = env.taskDef.helpers.question(st.ctx.model, id); if (now) {name.textContent = now.title; row.setAttribute('aria-label', now.title);} });
        P.questionDecorated(st, row, q);
        return row;
      },
      addControl: (base, S) => (st, parent) => {
        const P = S.P;
        const add = P.button(st, 'Add question...', parent, {add:true}, {ui:{open:st.ctx.model.ui.open === 'add' ? null : 'add'}}, 'motif-add');
        P.register(st, {add:true}, add);
      },
      inspector: (base, S) => (st, p) => {
        const P = S.P, m = st.ctx.model, q = env.taskDef.helpers.question(m, m.ui.selected);
        if (!q) {P.el(st, 'p', '', p, 'Select a question.'); return;}
        if (m.ui.tab === 'logic') {P.routing(st, p, q); return;}
        P.properties(st, p, q);
        P.validation(st, p, q);
        P.el(st, 'div', 'af-divider', p);
        P.el(st, 'h3', '', p, 'Response policy');
        const policy = P.el(st, 'label', 'motif-local-check', p);
        const check = P.el(st, 'input', '', policy); check.type = 'checkbox';
        P.el(st, 'span', '', policy, 'Include in analysis');
      },
      properties: (base, S) => (st, p, q) => {
        const P = S.P;
        P.el(st, 'h3', '', p, 'Edit question');
        P.field(st, 'Question text:', 'title', q.title, p, 'inspector', true).parentElement.classList.add('motif-title-field');
        P.el(st, 'div', 'af-divider', p);
        P.select(st, 'Question type:', 'type', q.type, p, 'inspector').parentElement.classList.add('motif-inline-field');
        if (q.options.length) {
          P.field(st, 'Answer options (one per line):', 'options', q.options.join('\n'), p, 'inspector', true).parentElement.classList.add('motif-option-field');
        }
        const help = P.el(st, 'label', 'af-field motif-inline-field motif-help', p);
        P.el(st, 'span', 'af-label', help, 'Help text (optional):');
        const text = P.el(st, 'textarea', 'af-input', help); text.setAttribute('aria-label', 'Help text (optional)');
      },
      validation: (base, S) => (st, p, q) => {
        const group = S.P.el(st, 'div', 'motif-validation', p);
        base(st, group, q);
        const headings = [...group.querySelectorAll('h3')];
        headings.find(n => n.textContent === 'Response validation').textContent = 'Validation';
        const rule = [...group.querySelectorAll('.af-field')].find(n => n.querySelector('.af-label')?.textContent === 'Rule');
        if (rule) {rule.classList.add('motif-inline-field'); rule.querySelector('.af-label').textContent = 'Rule:';}
        if (rule) rule.before(group.querySelector('.af-toggle-row'));
      },
      toggle: (base, S) => (st, label, hint, name, on, parent, paneName) => {
        const b = base(st, label, hint, name, on, parent, paneName);
        if (name === 'required') b.parentElement.querySelector('b').textContent = 'Require an answer';
        return b;
      },
      rendered: (base, S) => (st) => {
        base(st);
        document.querySelector('.motif-record-summary > strong').textContent = st.ctx.spec.title;
        document.querySelector('.motif-titlebar strong').textContent = st.ctx.spec.title;
        const title = document.querySelector('.motif-record-summary > strong');
        title.title = st.ctx.spec.title;
        document.querySelector('.motif-record-row-name').textContent = st.ctx.spec.title;
        document.querySelector('.motif-record-description').textContent = `Survey to plan upcoming workshop sessions for ${st.ctx.spec.title.split(' · ')[0]} staff.`;
      },
    },
  },
});
