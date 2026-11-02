// Design on the shared use-form-builder/editor template.
env.widget({
  task: 'use-form-builder',
  site: 'design-use-form-builder-branching-02',
  name: 'design',
  split: 'train',
  scenarios: ['branching'],
  template: 'use-form-builder/editor',
  design: {
    inset: 0, radius: '0', fontFamily: '"Times New Roman", serif',
    columns: 'minmax(0, .442fr) minmax(0, .558fr)',
    parts: {
      frame: (base, S) => st => {
        const root = base(st), {height,width} = st.ctx.stage.getBoundingClientRect();
        root.classList.toggle('library-condensed', height < 700);
        root.classList.toggle('library-tight', height < 520 || (width < 1150 && height < 650));
        root.classList.toggle('library-narrow', width < 1400);
        return root;
      },
      topbar: (base, S) => st => {
        base(st);
        const title = document.querySelector('.ref-window-title');
        if (title) title.textContent = `Form Author — ${st.ctx.spec.title} (Draft)`;
        // Keep the preview target and its original action on the print toolbar icon.
        const preview = st.top.querySelector('[data-library-preview]') ||
          [...st.top.querySelectorAll('button')].find(b => b.textContent.startsWith('Preview'));
        const slot = document.querySelectorAll('.ref-toolbar-icon')[2];
        if (slot && preview) {
          const svg = slot.innerHTML;
          preview.title = 'Preview'; preview.setAttribute('aria-label', 'Preview');
          preview.className = 'ref-toolbar-icon library-tool';
          preview.innerHTML = svg;
          slot.replaceWith(preview);
          st.top.appendChild(document.createElement('span'));
        }
      },
      layout: (base, S) => st => {
        const P = S.P;
        st.workspace = P.el(st, 'div', 'library-workspace', st.root);
        const left = P.el(st, 'section', 'library-section-pane', st.workspace);
        P.el(st, 'h2', 'library-pane-heading', left, 'Sections');
        st.sections = P.el(st, 'div', 'af-sections', left);
        const actions = P.el(st, 'div', 'library-section-actions', left);
        for (const label of ['Add Section', 'Rename', 'Delete']) {
          const b = P.button(st, label, actions, null, null);
          b.addEventListener('click', () => env.log('decoy', {label}));
        }
        st.editor = P.el(st, 'div', 'library-editor', st.workspace);
        P.tabs(st);
        st.body = P.el(st, 'div', 'af-body', st.editor);
        st.foot = P.el(st, 'div', 'af-foot', st.root);
      },
      tabs: (base, S) => st => {
        const P = S.P, toolbar = document.querySelector('.ref-toolbar');
        st.tabs = toolbar;
        st.tabButtons = {};
        const slots = [...toolbar.querySelectorAll('.ref-toolbar-icon')];
        [['questions','Questions',0],['logic','Logic',6],['arrange','Arrange',8],['settings','Settings',9]].forEach(([id,label,i]) => {
          const slot = slots[i];
          const b = P.button(st, label, toolbar, {tab:id}, {ui:{tab:id}}, 'ref-toolbar-icon library-tool');
          b.setAttribute('role', 'tab'); b.setAttribute('aria-label', label); b.title = label;
          b.innerHTML = slot.innerHTML;
          slot.replaceWith(b); st.tabButtons[id] = b;
        });
      },
      canvas: (base, S) => (st, parent) => {
        const P = S.P, m = st.ctx.model;
        const sec = st.ctx.spec.sections.find(s => s.id === m.ui.section);
        P.canvasHeader(st, parent, sec);
        const list = P.el(st, 'div', 'library-question-list', parent);
        for (const id of m.orders[sec.id]) {
          const q = env.taskDef.helpers.question(m, id);
          if (q) P.questionCard(st, list, sec, id, q);
        }
        const actions = P.el(st, 'div', 'library-question-actions', parent);
        P.addControl(st, actions);
        const edit = P.button(st, 'Edit', actions, null, null);
        edit.addEventListener('click', () => st.root.querySelector('[name="library-title"]')?.focus());
        const duplicate = P.button(st, 'Duplicate', actions, null, null);
        duplicate.addEventListener('click', () => env.log('decoy', {label:'Duplicate'}));
        P.button(st, 'Delete', actions, {remove:m.ui.selected}, {remove:m.ui.selected});
        for (const [label,offset] of [['⬆',-1],['⬇',1]]) {
          const b = P.button(st, label, actions, null, null, 'library-order-button');
          b.title = offset < 0 ? 'Move question up' : 'Move question down';
          b.addEventListener('click', () => {
            const ids = [...st.ctx.model.orders[sec.id]], i = ids.indexOf(st.ctx.model.ui.selected), j = i + offset;
            if (i < 0 || j < 0 || j >= ids.length) return;
            [ids[i],ids[j]] = [ids[j],ids[i]];
            P.commit(st, {order:['questions',ids]});
          });
        }
      },
      canvasHeader: (base, S) => (st, parent) => {
        S.P.el(st, 'h2', 'library-pane-heading', parent, 'Questions in this section');
      },
      questionCard: (base, S) => (st, parent, sec, id, q) => {
        const P = S.P, m = st.ctx.model;
        const row = P.el(st, 'article', 'library-question-row' + (m.ui.selected === id ? ' selected' : ''), parent);
        row.tabIndex = 0; row.setAttribute('role','button'); row.setAttribute('aria-label',q.title);
        P.register(st, {question:id}, row, 'canvas');
        const select = () => P.commit(st, {ui:{selected:id}});
        row.addEventListener('click', select);
        row.addEventListener('keydown', e => {if(e.key === 'Enter' || e.key === ' ') {e.preventDefault();select();}});
        P.el(st, 'span', 'library-question-number', row, `${m.orders[sec.id].indexOf(id)+1}.`);
        const text = P.el(st, 'div', 'library-question-text', row);
        const title = P.el(st, 'div', 'library-question-title', text, q.title);
        const type = P.el(st, 'div', 'library-question-type', text, q.type);
        st.syncers.push(() => {
          const now = env.taskDef.helpers.question(st.ctx.model,id); if (!now) return;
          title.textContent = now.title + (now.validation.required ? ' *' : ''); type.textContent = now.type;
        });
        P.questionDecorated(st, row, q);
        return row;
      },
      inspector: (base, S) => (st, p) => {
        const q = env.taskDef.helpers.question(st.ctx.model, st.ctx.model.ui.selected);
        if (!q) { S.P.el(st,'div','af-empty',p,'Select a question.'); return; }
        S.P.routing(st, p, q);
      },
      routing: (base, S) => (st, p, q) => {
        const P = S.P, m = st.ctx.model;
        p.classList.add('library-inspector');
        const heading = P.el(st, 'h3', 'library-inspector-heading', p, `Question: ${q.title}`);
        const title = P.field(st,'Question text:','title',q.title,p,'inspector',true);
        title.name = 'library-title';
        title.parentElement.classList.add('library-title-field');
        const arrows = P.el(st,'span','library-text-arrows',title.parentElement);
        for (const [symbol,amount] of [['▵',-24],['▿',24]]) {
          const b = P.button(st,symbol,arrows,null,null);
          b.tabIndex = -1; b.setAttribute('aria-label',amount < 0 ? 'Scroll question text up' : 'Scroll question text down');
          b.addEventListener('click',()=>{title.scrollTop += amount;});
        }
        st.syncers.push(() => { heading.textContent = `Question: ${env.taskDef.helpers.question(st.ctx.model,q.id)?.title || ''}`; });
        P.select(st,'Question type:','type',q.type,p,'inspector');
        const choiceGroup = P.el(st, 'div', 'library-choice-group', p);
        P.el(st, 'div', 'library-field-label', choiceGroup, 'Answer choices:');
        const choices = P.el(st, 'div', 'library-choices', choiceGroup);
        q.options.forEach((answer,i) => {
          const b = P.button(st, answer, choices, {open:`route:${i}`}, {ui:{open:`route:${i}`}}, 'library-choice');
          b.title = `Set answer routing for ${answer}`;
          P.register(st, {open:`route:${i}`}, b, 'inspector');
        });
        const tools = P.el(st,'div','library-choice-actions',choiceGroup);
        const editOptions = () => {
          if (choices.querySelector('textarea')) return;
          choices.replaceChildren();
          const field = P.field(st,'Answer options · one per line','options',q.options.join('\n'),choices,'inspector',true);
          const done = P.button(st,'Close',choices,null,null,'library-options-close');
          done.addEventListener('click',()=>P.paint(st)); field.focus();
        };
        for (const label of ['Add','Edit','Remove','Move Up','Move Down']) {
          const b = P.button(st,label,tools,null,null);
          if (label === 'Add' || label === 'Edit') b.addEventListener('click',editOptions);
          else b.disabled = true;
        }
        // Retain the options field target while the list is in its compact display mode.
        // Its editor is reached through the ordinary Edit button above.
        const optionsEditor = P.field(st,'Answer options · one per line','options',q.options.join('\n'),choices,'inspector',true);
        optionsEditor.parentElement.hidden = true;
        const response = P.el(st,'section','library-response',p);
        P.el(st,'h3','library-group-heading',response,'Response settings');
        P.toggle(st,'Required question','','required',q.validation.required,response,'inspector');
        const other = P.el(st,'label','library-other',response);
        const checkbox = P.el(st,'input','',other); checkbox.type = 'checkbox';
        checkbox.addEventListener('change',()=>env.log('decoy',{label:'Allow Other with a text field'}));
        P.el(st,'span','',other,'Allow “Other” with a text field');
        const routing = P.el(st,'section','library-routing',p);
        P.el(st,'h3','library-group-heading',routing,'Answer routing');
        P.el(st,'p','library-routing-description',routing,'Send respondents to a section based on their answer:');
        const area = P.el(st,'div','library-rules-area',routing);
        const table = P.el(st,'div','library-rules-table',area);
        const head = P.el(st,'div','library-rule-head',table);
        P.el(st,'span','',head,'Answer'); P.el(st,'span','',head,'Go to section');
        const rows = P.el(st,'div','library-rule-body',table);
        const configured = q.options.map((answer,i)=>({answer,i,dest:m.rules[q.id]?.[answer]||'next'})).filter(r=>r.dest!=='next');
        if (!configured.length) P.el(st,'div','library-no-rules',rows,'No answer routing rules yet.');
        for (const r of configured) P.routingRule(st,rows,q,r.answer,r.i);
        const buttons = P.el(st,'div','library-rule-actions',area);
        const add = P.button(st,'Add Rule',buttons,null,null);
        add.disabled = !q.options.length;
        add.addEventListener('click',()=>{
          st.root.querySelector('.library-answer-picker')?.remove();
          const picker = P.el(st,'div','library-answer-picker',table);
          P.el(st,'b','',picker,'Choose an answer');
          for (let i=0;i<q.options.length;i++) P.button(st,q.options[i],picker,null,{ui:{open:`route:${i}`}});
          const close = P.button(st,'Close',picker,null,null);
          close.addEventListener('click',()=>picker.remove());
        });
        const first = configured[0];
        const edit = P.button(st,'Edit Rule',buttons,null,first ? {ui:{open:`route:${first.i}`}} : null); edit.disabled = !first;
        const remove = P.button(st,'Remove Rule',buttons,null,first ? {pick:[`route:${first.i}`,'next']} : null); remove.disabled = !first;
        const fallback = P.el(st,'div','library-default',routing);
        P.el(st,'span','',fallback,'Default destination (if no rule matches):');
        const next = P.button(st,'Next section',fallback,null,null,'library-default-select');
        P.el(st,'span','library-dropdown-arrow',next,'▾');
        next.addEventListener('click',()=>env.log('decoy',{label:'Default destination: Next section'}));
      },
      routingRule: (base, S) => (st, parent, q, answer, i) => {
        const P = S.P, dest = st.ctx.model.rules[q.id]?.[answer] || 'next';
        const row = P.el(st,'div','library-rule-row',parent);
        P.el(st,'span','',row,answer);
        P.select(st,'Go to section',`route:${i}`,dest === 'next' ? 'Next section' : st.ctx.spec.sections.find(s=>s.id===dest)?.title||dest,row,'inspector');
      },
    },
  },
});
