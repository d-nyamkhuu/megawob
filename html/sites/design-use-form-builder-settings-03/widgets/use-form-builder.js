// Design on the shared use-form-builder/editor template.
env.widget({
  task: 'use-form-builder',
  site: 'design-use-form-builder-settings-03',
  name: 'design',
  split: 'train',
  scenarios: ['settings'],
  template: 'use-form-builder/editor',
  design: {
    inset: 0,
    fontSize: '15px',
    fontFamily: '"Segoe UI", Arial, sans-serif',
    radius: '5px',
    parts: {
      topbar: (base, S) => (st) => {
        base(st);
        const title = document.querySelector('.ref-document-title');
        if (title) title.textContent = st.ctx.spec.title + '　⌄';
      },
      layout: (base, S) => (st) => {
        const P = S.P;
        st.workspace = P.el(st, 'div', 'af-workspace', st.root);
        st.editor = P.el(st, 'div', 'af-editor', st.workspace);
        st.sections = P.el(st, 'div', 'af-sections', st.editor);
        st.body = P.el(st, 'div', 'af-body', st.editor);
        P.tabs(st);
        st.foot = P.el(st, 'div', 'af-foot', st.root);
      },
      tabs: (base, S) => (st) => {
        const P = S.P;
        st.tabs = P.el(st, 'div', 'af-details', st.root);
        const head = P.el(st, 'div', 'af-details-tabs', st.tabs);
        const note = document.querySelector('.ref-panel');
        if (note) { note.classList.add('af-task-card'); st.tabs.appendChild(note); }
        st.tabButtons = {};
        for (const [id, label] of [['questions', 'Question'], ['logic', 'Logic']]) {
          const b = P.button(st, label, head, {tab:id}, {ui:{tab:id}});
          b.setAttribute('role', 'tab');
          st.tabButtons[id] = b;
        }
        st.detailBody = P.el(st, 'div', 'af-detail-body', st.tabs);
        const foot = P.el(st, 'div', 'af-details-links', st.tabs);
        st.tabButtons.settings = P.button(st, 'Form settings', foot, {tab:'settings'}, {ui:{tab:'settings'}});
        P.button(st, 'Response settings', foot, null, {ui:{tab:'settings'}});
        const tools = document.querySelector('.ref-editor-toolbar');
        st.toolbarAdd = P.button(st, 'Add question　⌄', tools, {add:true}, null, 'ref-toolbar-item ref-add');
        st.toolbarAdd.addEventListener('click', () => P.commit(st, {ui:{open:st.ctx.model.ui.open === 'add' ? null : 'add'}}));
        tools.prepend(st.toolbarAdd);
        st.tabButtons.arrange = P.button(st, 'Move', tools, {tab:'arrange'}, {ui:{tab:'arrange'}}, 'ref-toolbar-item ref-move');
        const preview = P.button(st, 'Preview', tools, {preview:true}, {ui:{preview:true}}, 'ref-toolbar-item');
        P.icon(st, 'eye', preview, 22);
        // The hidden original topbar is retained for its persistent task targets.
        P.register(st, {preview:true}, preview);
        st.toolbarPreview = preview;
        st.toolbarDelete = tools.querySelector('[data-tool="delete"]');
        if (st.toolbarDelete) st.toolbarDelete.addEventListener('click', () => {
          if (st.ctx.model.ui.selected) P.commit(st, {remove:st.ctx.model.ui.selected});
        });
      },
      sectionButton: (base, S) => (st, id) => {
        const P = S.P, m = st.ctx.model;
        const sec = st.ctx.spec.sections.find(s => s.id === id);
        const i = m.sectionOrder.indexOf(id);
        const b = P.button(st, '', st.sections, {section:id}, {ui:{section:id, selected:m.orders[id][0] || null}}, m.ui.section === id ? 'on' : '');
        const svg = st.ctx.util.svg('svg', {viewBox:'0 0 32 32', width:34, height:34, class:'af-icon af-section-icon', 'aria-hidden':'true'}, b);
        const paths = [
          ['M16 3a6 6 0 1 1 0 12 6 6 0 0 1 0-12M4 29v-3c0-10 24-10 24 0v3Z'],
          ['M5 2h23v28H5Z', 'M10 9h2m4 0h7M10 15h2m4 0h7M10 21h2m4 0h7'],
          ['M28 13c0 7-7 12-15 11l-8 5 2-9C-4 8 12-3 23 4c3 2 5 5 5 9Z'],
        ];
        for (const d of paths[i] || paths[1]) st.ctx.util.svg('path', {d, fill:i === 0 ? 'currentColor' : 'none', stroke:'currentColor', 'stroke-width':i === 0 ? 0 : 2, 'stroke-linejoin':'round'}, svg);
        const label = P.el(st, 'span', 'af-section-label', b);
        P.el(st, 'b', '', label, sec.title);
        P.el(st, 'small', '', label, `${m.orders[id].length} questions`);
        b.title = sec.title;
      },
      canvasHeader: (base, S) => (st, parent) => {
        S.P.el(st, 'h3', 'af-list-heading', parent, 'Questions in this section');
      },
      questionCard: (base, S) => (st, parent, sec, id, q) => {
        const P = S.P, card = base(st, parent, sec, id, q);
        P.el(st, 'span', 'af-row-grip', card, '⠿');
        P.el(st, 'span', 'af-row-number', card, String(st.ctx.model.orders[sec.id].indexOf(id) + 1));
        const glyph = P.el(st, 'span', 'af-row-type', card);
        P.icon(st, P.typeIcon(st, q.type), glyph, 26);
        const label = P.el(st, 'span', 'af-row-label', card);
        label.appendChild(card.querySelector('.af-card-title'));
        const subtitle = P.el(st, 'small', '', label, q.type);
        st.syncers.push(() => { subtitle.textContent = env.taskDef.helpers.question(st.ctx.model, id)?.type || ''; });
        P.el(st, 'span', 'af-row-arrow', card, '›');
        return card;
      },
      addControl: (base, S) => (st, parent) => {
        S.P.register(st, {add:true}, st.toolbarAdd);
      },
      select: (base, S) => (st, label, name, value, parent, pane) => {
        const b = base(st, label, name, value, parent, pane);
        b.dataset.selectName = name;
        b.addEventListener('click', () => { st.menuPane = pane; }, true);
        return b;
      },
      menu: (base, S) => (st) => {
        if (st.menuPane === 'editor' && st.ctx.model.ui.open) {
          const b = [...st.body.querySelectorAll('.af-center [data-select-name]')].find(el => el.dataset.selectName === st.ctx.model.ui.open);
          if (b) S.P.register(st, {open:st.ctx.model.ui.open}, b, 'editor');
        }
        base(st);
      },
      properties: (base, S) => (st, p, q) => {
        const P = S.P, center = p.classList.contains('af-center'), pane = center ? 'editor' : 'inspector';
        const type = () => {
          const b = P.select(st, 'Question type', 'type', q.type, p, pane);
          const icon = P.icon(st, P.typeIcon(st, q.type), b, 24);
          icon.classList.add('af-selector-type');
          b.prepend(icon);
        };
        if (center) type(); else P.el(st, 'h3', '', p, 'Question properties');
        P.field(st, 'Question text', 'title', q.title, p, pane);
        const desc = P.el(st, 'label', 'af-field af-description', p);
        P.el(st, 'span', 'af-label', desc, 'Description (optional)');
        const input = P.el(st, 'textarea', 'af-input', desc);
        input.placeholder = 'Add a description...';
        if (!center) type();
        if (q.options.length) P.field(st, 'Answer options · one per line', 'options', q.options.join('\n'), p, pane, true);
      },
      validation: (base, S) => (st, p, q) => {
        const P = S.P;
        const box = P.el(st, 'div', 'af-answer-settings', p);
        P.el(st, 'h3', '', box, 'Answer settings');
        base(st, p, q);
        const required = p.querySelector('.af-toggle-row');
        required.querySelector('b').textContent = 'Required answer';
        required.querySelector('small')?.remove();
        box.appendChild(required);
        for (const [label, act] of [['Limit number of characters', {pick:['preset', 'Text length']}], ['Input mask', {ui:{open:'preset'}}]]) {
          P.button(st, label, box, null, act, 'af-answer-option');
        }
        const heading = [...p.children].find(el => el.tagName === 'H3' && el.textContent === 'Response validation');
        if (heading) heading.textContent = 'Validation';
        const preset = [...p.querySelectorAll('.af-field')].find(el => el.querySelector('.af-label')?.textContent === 'Rule');
        if (preset) preset.querySelector('.af-label').style.display = 'none';
      },
      questionPanels: (base, S) => (st) => {
        const P = S.P;
        for (const [key, value] of st.targets) if (st.detailBody.contains(value.el)) st.targets.delete(key);
        st.detailBody.replaceChildren();
        const a = P.pane(st, 'canvas', 'af-canvas');
        const center = P.pane(st, 'editor', 'af-center');
        const b = P.pane(st, 'inspector', 'af-inspector', st.detailBody);
        P.canvas(st, a);
        P.inspector(st, center);
        P.inspector(st, b);
      },
      painted: (base, S) => (st) => {
        base(st);
        S.P.register(st, {add:true}, st.toolbarAdd);
        S.P.register(st, {preview:true}, st.toolbarPreview);
        S.P.register(st, {tab:'arrange'}, st.tabButtons.arrange);
        if (st.toolbarDelete && st.ctx.model.ui.selected) S.P.register(st, {remove:st.ctx.model.ui.selected}, st.toolbarDelete);
        st.root.classList.toggle('af-show-settings', st.ctx.model.ui.tab === 'settings');
      },
    },
  },
});
