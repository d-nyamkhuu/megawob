// Design on the shared use-form-builder/editor template.
env.widget({
  task: 'use-form-builder',
  site: 'design-use-form-builder-settings-02',
  name: 'design',
  split: 'train',
  scenarios: ['settings'],
  template: 'use-form-builder/editor',
  design: {
    fontFamily: 'Tahoma, Arial, sans-serif', fontSize: '16px', inset: 0,
    radius: '0px', brand: 'Survey Builder',
    columns: 'minmax(180px, .61fr) minmax(280px, 1fr)',
    parts: {
      frame: (base, S) => (st) => {
        const root = base(st);
        root.style.bottom = '0px';
        return root;
      },
      topbar: (base, S) => (st) => {
        base(st);
        const record = document.querySelector('.ref-survey-row.selected span');
        if (record) record.textContent = st.ctx.spec.title;
        const preview = st.top.querySelector('button[title="Preview"]') ||
          Array.from(st.top.querySelectorAll('button')).find(b => b.textContent.trim() === 'Preview');
        const tool = document.querySelector('.xp-tool:nth-child(5)');
        if (preview && tool) {
          preview.className = 'xp-live-preview';
          preview.replaceChildren();
          S.P.el(st, 'span', 'xp-tool-icon', preview, '▶');
          S.P.el(st, 'span', '', preview, 'Preview');
          preview.setAttribute('aria-label', 'Preview');
          tool.replaceWith(preview);
          st.previewToolbar = preview;
        }
      },
      layout: (base, S) => (st) => {
        const P = S.P;
        st.workspace = P.el(st, 'div', 'af-workspace', st.root);
        st.editor = P.el(st, 'div', 'af-editor', st.workspace);
        const structure = P.el(st, 'div', 'af-structure', st.editor);
        P.el(st, 'h3', 'xp-pane-heading', structure, 'Form Structure');
        const tools = P.el(st, 'div', 'xp-list-tools', structure);
        const add = P.button(st, 'Add Section', tools, null, null, 'xp-page-action');
        add.addEventListener('click', () => S.P.commit(st, {ui:{tab:'arrange'}}));
        P.button(st, 'Delete', tools, null, null, 'xp-delete-action');
        P.button(st, '⬆', tools, null, {ui:{tab:'arrange'}}, 'xp-arrow-action');
        P.button(st, '⬇', tools, null, {ui:{tab:'arrange'}}, 'xp-arrow-action');
        st.sections = P.el(st, 'div', 'af-sections', structure);
        st.body = P.el(st, 'div', 'af-body', st.editor);
        P.tabs(st);
        st.foot = P.el(st, 'div', 'af-foot', st.root);
      },
      tabs: (base, S) => (st) => {
        const P = S.P;
        st.tabs = P.el(st, 'nav', 'af-tabs xp-settings-bar', st.editor);
        st.tabButtons = {};
        for (const [id, label] of S.D.tabs) {
          const b = P.button(st, label, st.tabs, {tab:id}, {ui:{tab:id}}, 'xp-tab-' + id);
          b.setAttribute('role', 'tab');
          st.tabButtons[id] = b;
        }
      },
      sectionButton: (base, S) => (st, id) => {
        const P = S.P, m = st.ctx.model;
        const sec = st.ctx.spec.sections.find(s => s.id === id);
        const b = P.button(st, '', st.sections, {section:id},
          {ui:{section:id, selected:m.orders[id][0] || null}}, m.ui.section === id ? 'on' : '');
        P.el(st, 'span', 'xp-row-number', b, (m.sectionOrder.indexOf(id) + 1) + '.');
        P.el(st, 'span', 'af-section-label', b, sec.title);
        b.title = sec.title;
      },
      canvas: (base, S) => (st, parent) => {
        const P = S.P, m = st.ctx.model;
        const sec = st.ctx.spec.sections.find(s => s.id === m.ui.section);
        P.el(st, 'h3', 'xp-pane-heading', parent, 'Questions in this section');
        const tools = P.el(st, 'div', 'xp-list-tools', parent);
        P.addControl(st, tools);
        if (m.ui.selected) P.button(st, 'Delete', tools, {remove:m.ui.selected}, {remove:m.ui.selected}, 'xp-delete-action');
        P.button(st, '⬆', tools, null, {ui:{tab:'arrange'}}, 'xp-arrow-action');
        P.button(st, '⬇', tools, null, {ui:{tab:'arrange'}}, 'xp-arrow-action');
        for (const id of m.orders[sec.id]) {
          const q = env.taskDef.helpers.question(m, id);
          if (q) P.questionCard(st, parent, sec, id, q);
        }
      },
      addControl: (base, S) => (st, parent) => {
        const m = st.ctx.model;
        const b = S.P.button(st, 'Add Question', parent, {add:true},
          {ui:{open:m.ui.open === 'add' ? null : 'add'}}, 'xp-page-action');
        S.P.register(st, {add:true}, b, 'canvas');
      },
      questionCard: (base, S) => (st, parent, sec, id, q) => {
        const P = S.P, m = st.ctx.model;
        const card = P.el(st, 'article', 'af-card' + (m.ui.selected === id ? ' selected' : ''), parent);
        card.tabIndex = 0;
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', q.title);
        P.register(st, {question:id}, card, 'canvas');
        card.addEventListener('click', () => P.commit(st, {ui:{selected:id}}));
        card.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); P.commit(st, {ui:{selected:id}}); }
        });
        P.el(st, 'span', 'xp-row-number', card, (m.orders[sec.id].indexOf(id) + 1) + '.');
        const text = P.el(st, 'div', 'xp-question-text', card);
        const title = P.el(st, 'div', 'af-card-title', text, q.title);
        const type = P.el(st, 'div', 'xp-question-type', text, q.type);
        st.syncers.push(() => {
          const now = env.taskDef.helpers.question(st.ctx.model, id);
          if (now) { title.textContent = now.title; type.textContent = now.type; }
        });
        P.questionDecorated(st, card, q);
        return card;
      },
      properties: (base, S) => (st, p, q) => {
        const P = S.P;
        P.el(st, 'h3', 'xp-pane-heading', p, 'Edit Question');
        const fields = P.el(st, 'div', 'xp-property-fields', p);
        P.select(st, 'Question type:', 'type', q.type, fields, 'inspector');
        P.field(st, 'Question text:', 'title', q.title, fields, 'inspector', true);
        const help = P.el(st, 'label', 'af-field xp-help-field', fields);
        P.el(st, 'span', 'af-label', help, 'Help text (optional):');
        P.el(st, 'textarea', 'af-input', help).setAttribute('aria-label', 'Help text (optional)');
        if (q.options.length) P.field(st, 'Answer options · one per line', 'options', q.options.join('\n'), fields, 'inspector', true);
      },
      inspector: (base, S) => (st, p) => {
        const q = env.taskDef.helpers.question(st.ctx.model, st.ctx.model.ui.selected);
        if (!q) { S.P.el(st, 'p', 'af-empty', p, 'Select a question.'); return; }
        if (st.ctx.model.ui.tab === 'logic') { S.P.routing(st, p, q); return; }
        S.P.properties(st, p, q);
        S.P.validation(st, p, q);
      },
      validation: (base, S) => (st, p, q) => {
        const P = S.P;
        const box = P.el(st, 'div', 'xp-validation', p);
        P.toggle(st, 'Required response', '', 'required', q.validation.required, box, 'inspector');
        const limit = P.el(st, 'label', 'xp-check-line', box);
        const check = P.el(st, 'input', '', limit); check.type = 'checkbox';
        P.el(st, 'span', '', limit, 'Limit character count');
        const count = P.el(st, 'input', 'xp-char-count', limit); count.value = '100'; count.disabled = true;
        check.addEventListener('change', () => { count.disabled = !check.checked; });
        const rules = P.el(st, 'fieldset', 'xp-fieldset', box);
        P.el(st, 'legend', '', rules, 'Validation');
        const preset = P.select(st, 'Must match pattern:', 'preset', q.validation.preset, rules, 'inspector');
        preset.parentElement.classList.add('xp-pattern-row');
        preset.classList.toggle('xp-preset-none', q.validation.preset === 'None');
        const patternCheck = P.el(st, 'input', 'xp-pattern-check', preset.parentElement);
        patternCheck.type = 'checkbox'; patternCheck.checked = q.validation.preset !== 'None';
        patternCheck.setAttribute('aria-label', 'Must match pattern');
        patternCheck.addEventListener('click', () => preset.click());
        if (['Number range','Text length'].includes(q.validation.preset)) {
          const pair = P.el(st, 'div', 'af-pair', rules);
          P.field(st, 'Minimum', 'min', q.validation.min, pair, 'inspector');
          P.field(st, 'Maximum', 'max', q.validation.max, pair, 'inspector');
        }
        const error = P.el(st, 'label', 'xp-check-line xp-error-line', rules);
        const errCheck = P.el(st, 'input', '', error); errCheck.type = 'checkbox';
        P.el(st, 'span', '', error, 'Custom error message:');
        const errText = P.el(st, 'input', 'af-input', error); errText.disabled = true;
        errCheck.addEventListener('change', () => { errText.disabled = !errCheck.checked; });
        const answers = P.el(st, 'fieldset', 'xp-fieldset', box);
        P.el(st, 'legend', '', answers, 'Answer options');
        const multi = P.el(st, 'label', 'xp-check-line', answers);
        const cb = P.el(st, 'input', '', multi); cb.type = 'checkbox'; cb.checked = q.type === 'Paragraph';
        P.el(st, 'span', '', multi, 'Allow multiple lines (multiline text box)');
        const conditional = P.el(st, 'div', 'xp-check-line', answers);
        const cc = P.el(st, 'input', '', conditional); cc.type = 'checkbox';
        P.el(st, 'span', '', conditional, 'Show this question only if:');
        P.button(st, '-- None --', conditional, null, {ui:{tab:'logic'}}, 'xp-condition');
      },
      painted: (base, S) => (st) => {
        base(st);
        if (st.previewToolbar) S.P.register(st, {preview:true}, st.previewToolbar);
        st.root.classList.toggle('xp-show-settings', st.ctx.model.ui.tab === 'settings');
        st.root.classList.toggle('xp-show-arrange', st.ctx.model.ui.tab === 'arrange');
        st.tabButtons.settings.textContent = 'Response policies and settings';
        st.tabButtons.questions.textContent = st.ctx.model.ui.tab === 'settings' ? 'Back to questions' : 'Questions';
      },
    },
  },
});
