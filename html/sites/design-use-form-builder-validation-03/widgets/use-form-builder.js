// Design on the shared use-form-builder/editor template.
env.widget({
  task: 'use-form-builder',
  site: 'design-use-form-builder-validation-03',
  name: 'design',
  split: 'train',
  scenarios: ['validation'],
  template: 'use-form-builder/editor',
  design: {
      accent: '#1260e8', background: '#fff', panel: '#fff', text: '#111421',
      muted: '#777e90', line: '#d5d8e0', fontFamily: 'Arial, sans-serif',
      fontSize: '18px', radius: '0px', inset: 0,
      columns: 'minmax(0, .452fr) minmax(0, .548fr)',
    parts: {
      topbar: (base, S) => st => {
        base(st);
        st.top.classList.add('paper-title');
      },
      canvasHeader: (base, S) => (st, parent) => {
        const head = S.P.el(st, 'div', 'paper-list-heading', parent);
        S.P.el(st, 'strong', '', head, 'Questions in this section');
      },
      addControl: (base, S) => (st, parent) => {
        base(st, parent);
        const add = parent.querySelector('.af-add');
        parent.querySelector('.paper-list-heading').append(add);
      },
      questionCard: (base, S) => (st, parent, sec, id, q) => {
        const P = S.P, F = env.taskDef, ctx = st.ctx;
        const card = P.el(st, 'article', 'paper-question' + (ctx.model.ui.selected === id ? ' selected' : ''), parent);
        card.tabIndex = 0; card.setAttribute('role', 'button'); card.setAttribute('aria-label', q.title);
        P.register(st, {question: id}, card, 'canvas');
        card.addEventListener('click', () => P.commit(st, {ui: {selected: id}}));
        card.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); P.commit(st, {ui: {selected: id}}); }
        });
        P.el(st, 'span', 'paper-grip', card, '⠿');
        const icon = P.el(st, 'span', 'paper-type-icon', card);
        if (q.type === 'Number') icon.textContent = '123';
        else P.icon(st, q.title === 'Email' ? 'mail' : P.typeIcon(st, q.type), icon, 30);
        const text = P.el(st, 'div', 'paper-question-text', card);
        const title = P.el(st, 'div', 'paper-question-title', text, q.title);
        const type = P.el(st, 'div', 'paper-question-type', text, q.type === 'Paragraph' ? 'Long text' : q.type);
        P.el(st, 'span', 'paper-more', card, '⋮');
        st.syncers.push(() => {
          const now = F.helpers.question(ctx.model, id); if (!now) return;
          title.textContent = now.title;
          type.textContent = now.type === 'Paragraph' ? 'Long text' : now.type;
        });
        P.questionDecorated(st, card, q);
        return card;
      },
      properties: (base, S) => (st, p, q) => {
        const P = S.P;
        const type = P.select(st, 'Question type', 'type', q.type, p, 'inspector');
        type.parentElement.classList.add('paper-type-field');
        const icon = P.el(st, 'span', 'paper-select-type', type);
        if (q.type === 'Number') icon.textContent = '123';
        else P.icon(st, P.typeIcon(st, q.type), icon, 23);
        type.prepend(icon);
        P.field(st, 'Question text', 'title', q.title, p, 'inspector');
        const help = P.el(st, 'label', 'af-field paper-help', p);
        P.el(st, 'span', 'af-label', help, 'Help text (optional)');
        const input = P.el(st, 'input', 'af-input', help);
        input.type = 'text'; input.placeholder = 'Add help text...';
        if (q.options.length) P.field(st, 'Answer options · one per line', 'options', q.options.join('\n'), p, 'inspector', true);
      },
      validation: (base, S) => (st, p, q) => {
        base(st, p, q);
        const heading = p.querySelector('h3'); heading.textContent = 'Validation';
        const desc = S.P.el(st, 'div', 'paper-validation-desc', p, 'Control the type of answer and set any limits.');
        heading.after(desc);
        const preset = [...p.querySelectorAll('.af-select')].find(b => b !== p.querySelector('.af-select'));
        preset.parentElement.classList.add('paper-preset');
        preset.parentElement.querySelector('.af-label').textContent = 'Validation preset';
        if (!['Number range', 'Text length'].includes(q.validation.preset)) {
          const pair = S.P.el(st, 'div', 'af-pair', p);
          S.P.field(st, 'Minimum value (optional)', 'min', q.validation.min, pair, 'inspector');
          S.P.field(st, 'Maximum value (optional)', 'max', q.validation.max, pair, 'inspector');
          preset.parentElement.after(pair);
        }
        const pair = p.querySelector('.af-pair');
        if (pair) {
          const labels = pair.querySelectorAll('.af-label');
          labels[0].textContent = q.validation.preset === 'Text length' ? 'Minimum characters (optional)' : 'Minimum value (optional)';
          labels[1].textContent = q.validation.preset === 'Text length' ? 'Maximum characters (optional)' : 'Maximum value (optional)';
          for (const input of pair.querySelectorAll('input')) {
            input.inputMode = 'numeric';
            const spin = S.P.el(st, 'span', 'paper-spinner', input.parentElement);
            for (const [label, delta] of [['Increase', 1], ['Decrease', -1]]) {
              const button = S.P.el(st, 'button', '', spin, delta === 1 ? '▴' : '▾');
              button.type = 'button'; button.setAttribute('aria-label', label);
              button.addEventListener('click', () => {
                input.value = String((Number(input.value) || 0) + delta);
                input.dispatchEvent(new Event('input', {bubbles: true}));
              });
            }
          }
        }
        const toggle = p.querySelector('.af-toggle-row');
        toggle.classList.add('paper-required');
        toggle.querySelector('b').textContent = 'This question is required';
        toggle.querySelector('small').textContent = 'Respondents must provide an answer to continue.';
      },
      sectionButton: (base, S) => (st, id) => {
        base(st, id);
        const b = st.sections.lastElementChild;
        const sec = st.ctx.spec.sections.find(s => s.id === id);
        b.querySelector('.af-section-label').textContent = sec.title;
        b.querySelector('small').textContent = ' (' + st.ctx.model.orders[id].length + ')';
      },
      painted: (base, S) => st => {
        base(st);
        const P = S.P;
        const add = P.button(st, 'Add section', st.sections, null, null, 'paper-add-section');
        P.icon(st, 'plus', add, 28);
        add.addEventListener('click', () => env.log('decoy', {label: 'Add section'}));
        const inspector = st.body.querySelector('.af-inspector');
        const remove = inspector && [...inspector.children].find(el => el.tagName === 'BUTTON' && el.textContent === 'Delete question');
        if (remove?.textContent === 'Delete question') {
          const details = P.el(st, 'details', 'paper-question-menu', inspector);
          P.el(st, 'summary', '', details, '⋮'); details.append(remove);
          const selectedMore = st.body.querySelector('.paper-question.selected .paper-more');
          if (selectedMore) {
            selectedMore.setAttribute('role', 'button'); selectedMore.setAttribute('aria-label', 'Question actions');
            selectedMore.addEventListener('click', e => { e.stopPropagation(); details.open = !details.open; });
          }
        }
      },
    },
  },
});
