// Design on the shared use-form-builder/editor template.
env.widget({
  task: 'use-form-builder',
  site: 'design-use-form-builder-addq-03',
  name: 'design',
  split: 'train',
  scenarios: ['addq'],
  template: 'use-form-builder/editor',
  design: {
      accent: '#82bff7', background: '#faf8ef', panel: '#faf8ef', text: '#071c64',
      muted: '#536586', line: '#a9c6d3', fontSize: '20px', radius: '3px',
      fontFamily: 'Arial, sans-serif', columns: '48.5% 51.5%',
    parts: {
      frame: (base) => (st) => {
        const root = base(st);
        root.style.bottom = 'auto';
        const note = document.querySelector('.ref-note');
        if (note) st.ctx.stage.style.paddingBottom = (note.getBoundingClientRect().height + 28) + 'px';
        return root;
      },
      topbar: (base, S) => (st) => {
        base(st);
        const note = document.querySelector('.ref-instruction');
        if (note) st.top.append(note);
        document.querySelector('.ref-account')?.remove();
        const account = S.P.el(st, 'div', 'ref-account', document.querySelector('.ref-task'));
        const chart = S.P.el(st, 'span', 'ref-chart', account);
        const svg = st.ctx.util.svg('svg', {viewBox:'0 0 30 30', width:27, height:27, 'aria-hidden':'true'}, chart);
        st.ctx.util.svg('path', {d:'M3 26V12h5v14zm9 0V7h5v19zm9 0V2h5v24z', fill:'#075bb4'}, svg);
        S.P.el(st, 'span', '', account, st.ctx.spec.owner);
        S.P.el(st, 'span', 'ref-account-arrow', account, '');
      },
      icon: (base, S) => (st, name, parent, size = 16) => {
        if (name === 'number') {
          const svg = st.ctx.util.svg('svg', {viewBox:'0 0 28 24', width:size, height:size, class:'af-icon', 'aria-hidden':'true'}, parent);
          st.ctx.util.svg('text', {x:0, y:18, fill:'#071c64', stroke:'none', 'font-family':'Arial, sans-serif', 'font-size':16, 'font-weight':700}, svg).textContent = '123';
          return svg;
        }
        const svg = base(st, name, parent, size);
        if (name === 'form') {
          svg.replaceChildren();
          st.ctx.util.svg('path', {d:'M3 1h12l6 6v16H3zM15 1v6h6M7 10h10M7 14h10M7 18h10'}, svg);
        }
        return svg;
      },
      layout: (base, S) => (st) => {
        base(st);
        const add = S.P.button(st, 'Add section', st.editor, null, null, 'fc-add-section');
        S.P.el(st, 'span', 'fc-plus', add, '+');
        add.addEventListener('click', () => env.log('decoy', {label:'Add section'}));
      },
      sectionButton: (base, S) => (st, id) => {
        base(st, id);
        const button = st.sections.lastElementChild;
        button.querySelector('.af-section-label').textContent = st.ctx.spec.sections.find(s => s.id === id).title;
        button.querySelector('small').remove();
        const icon = S.P.icon(st, 'form', button, 36);
        button.prepend(icon);
      },
      canvasHeader: () => () => {},
      questionCard: (base, S) => (st, parent, sec, id, q) => {
        const card = base(st, parent, sec, id, q);
        const top = card.querySelector('.af-card-top');
        const label = top.querySelector('span');
        const icon = top.querySelector('svg');
        const name = card.querySelector('.af-card-title');
        card.querySelector('.af-preview-options, .af-preview-line')?.remove();
        label.className = 'fc-row-number';
        card.replaceChildren(label, icon, name);
        const grip = S.P.el(st, 'span', 'fc-row-grip', card, '⠿');
        grip.setAttribute('aria-hidden', 'true');
        st.syncers.push(() => { label.textContent = String(st.ctx.model.orders[sec.id].indexOf(id) + 1); });
        return card;
      },
      addControl: (base, S) => (st, parent) => {
        base(st, parent);
        const add = parent.querySelector('.af-add');
        add.querySelector('svg')?.remove();
        S.P.el(st, 'span', 'fc-plus', add, '+');
      },
      properties: (base, S) => (st, p, q) => {
        const P = S.P;
        P.el(st, 'h3', 'fc-inspector-title', p, 'Edit question');
        const tools = P.el(st, 'div', 'fc-question-tools', p);
        P.el(st, 'span', 'fc-tool', tools, '▲');
        P.el(st, 'span', 'fc-tool', tools, '▼');
        P.field(st, 'Question text', 'title', q.title, p, 'inspector');
        const help = P.el(st, 'label', 'af-field fc-help', p);
        P.el(st, 'span', 'af-label', help, 'Help text (optional)');
        const input = P.el(st, 'textarea', 'af-input', help);
        input.setAttribute('aria-label', 'Help text (optional)');
        P.el(st, 'div', 'af-divider', p);
        P.select(st, 'Question type', 'type', q.type, p, 'inspector');
        p.lastElementChild.classList.add('fc-type-field');
        const typeButton = p.lastElementChild.querySelector('button');
        typeButton.prepend(P.icon(st, P.typeIcon(st, q.type), typeButton, 27));
        if (q.options.length) P.field(st, 'Answer options · one per line', 'options', q.options.join('\n'), p, 'inspector', true);
      },
      validation: (base, S) => (st, p, q) => {
        base(st, p, q);
        const heading = [...p.querySelectorAll('h3')].find(h => h.textContent === 'Response validation');
        if (heading) heading.textContent = 'Validation';
        if (heading?.previousElementSibling?.classList.contains('af-divider')) heading.previousElementSibling.remove();
        const preset = p.querySelector('.af-select[aria-label="Rule"]') || [...p.querySelectorAll('.af-field')].find(e => e.querySelector('.af-label')?.textContent === 'Rule');
        if (preset) preset.classList.add('fc-preset-field');
        const required = p.querySelector('.af-toggle-row b');
        if (required) required.textContent = 'This question is required';
        const response = S.P.el(st, 'div', 'fc-response', p);
        S.P.el(st, 'h3', '', response, 'Response options');
        for (const text of ['Store as contact field', 'Hide this question based on answers']) {
          const row = S.P.el(st, 'label', 'fc-check-row', response);
          const box = S.P.el(st, 'input', '', row);
          box.type = 'checkbox';
          S.P.el(st, 'span', '', row, text);
          box.addEventListener('change', () => env.log('decoy', {label:text}));
        }
      },
      inspector: (base, S) => (st, p) => {
        base(st, p);
        const del = [...p.children].find(e => e.tagName === 'BUTTON' && e.textContent === 'Delete question');
        if (del) {
          del.classList.add('fc-delete');
          del.setAttribute('aria-label', 'Delete question');
          del.title = 'Delete question';
          del.textContent = '';
          const trash = st.ctx.util.svg('svg', {viewBox:'0 0 24 26', width:23, height:25, 'aria-hidden':'true'}, del);
          st.ctx.util.svg('path', {d:'M4 7h16M9 7V3h6v4M6 7l1 16h10l1-16M10 10v10M14 10v10', fill:'none', stroke:'#ed111d', 'stroke-width':2.5}, trash);
          p.querySelector('.fc-question-tools')?.append(del);
        }
      },
    },
  },
});
