// Design on templates/use-hr/workspace.js; defaults reproduce the scaffold.
env.widget({
  task: 'use-hr',
  site: 'design-use-hr-onboarding-03',
  name: 'design',
  split: 'train',
  scenarios: ['onboarding'],
  template: 'use-hr/workspace',
  design: {
    inset: '0px', radius: '0px', font: '16px/1.25 Arial,sans-serif',
    parts: {
      icon: (base, S) => (ctx, parent, name) => {
        const art = {
          file: '<path fill="#fff" d="M5 1h10l5 5v17H5z"/><path fill="#dbe6e9" d="M15 1v6h5z"/><path stroke="#66869a" stroke-width="1" d="M8 10h9m-9 3h9m-9 3h9m-9 3h7"/>',
          checklist: '<rect fill="#e79838" x="3" y="3" width="19" height="21" rx="2"/><rect fill="#fff" x="6" y="6" width="13" height="16"/><path fill="#79a1b8" d="M9 1h7v5H9z"/><path stroke="#60778a" stroke-width="1" d="M8 10h2m2 0h5m-9 4h2m2 0h5m-9 4h2m2 0h5"/>',
          laptop: '<path fill="#333e48" d="m5 2 17-1-2 15H3z"/><path fill="#75bfe6" d="m7 4 12-1-2 11H5z"/><path fill="#b9c4ca" d="m3 16 17 1 3 5-15 2-8-4z"/><path stroke="#6c7d86" stroke-width="1" d="m7 18 10 1m-8 2h5"/>',
          calendar: '<rect fill="#fff" x="2" y="3" width="21" height="21" rx="2"/><path fill="#f98620" d="M2 3h21v7H2z"/><path d="M7 1v5m11-5v5"/><path stroke="#cf6b16" stroke-width="2" d="M6 13h3m3 0h3m3 0h2M6 17h3m3 0h3m3 0h2M6 21h3m3 0h3m3 0h2"/>',
          people: '<path fill="#609dc5" d="M2 24v-4c0-5 5-6 8-8C4 5 9-1 14 2c4 2 3 7 0 10 4 3 8 3 8 8v4z"/><path stroke="#d9eff9" d="M9 3c-3 3-1 7 1 9m-5 9c0-4 3-5 5-6"/>',
        };
        if (!art[name]) return base(ctx, parent, name);
        const svg = ctx.util.svg('svg', { class: 'hr-svg human-icon', viewBox: '0 0 25 26', 'aria-hidden': 'true' }, parent);
        svg.innerHTML = art[name]; return svg;
      },
      shell: (base, S) => (ctx) => {
        base(ctx);
        S.root.classList.add('human-app');
        S.current.taskNote = document.querySelector('.ref-panel');
        S.current.formEnd = document.querySelector('.ref-foot');
        S.current.floatingEnd = document.querySelector('.ref-float-dock');
      },
      heading: (base, S) => (ctx) => {
        const { P } = S, { s, main } = S.current, hire = s.hire || {};
        const h = P.element(ctx, 'header', 'human-heading', main);
        const note = document.querySelector('.ref-instruction');
        if (note) h.append(note);
        const notification = document.querySelector('.ref-note');
        if (notification) h.append(notification);
        const crumb = P.element(ctx, 'div', 'human-crumb', h, 'Onboarding');
        P.element(ctx, 'span', '', crumb, '›');
        P.element(ctx, 'b', '', crumb, hire.name || 'New Hire');
        P.element(ctx, 'h1', '', h, hire.name || 'New Hire');
        P.element(ctx, 'div', 'human-subtitle', h, `${hire.role || 'Employee'}  |  ${hire.team || 'Engineering'}  |  ${hire.city || ''}`);
      },
      offer: (base, S) => (ctx, parent) => {
        const { P } = S, { s, extras } = S.current, hire = s.hire || {};
        const section = P.element(ctx, 'section', 'human-offer human-box', parent);
        const head = P.element(ctx, 'div', 'human-sectionhead', section);
        P.icon(ctx, head, 'file'); P.element(ctx, 'b', '', head, 'Offer Letter');
        const paper = P.element(ctx, 'article', 'human-paper', section);
        const top = P.element(ctx, 'div', 'human-lettertop', paper);
        P.element(ctx, 'div', 'human-company', top, s.company);
        P.element(ctx, 'span', 'human-letterdate', top, 'April 28, 2006');
        P.element(ctx, 'div', 'human-address', paper, `1234 Market Street\n${hire.city || ''}`);
        P.element(ctx, 'p', '', paper, `Dear ${hire.name || 'New Hire'},`);
        P.element(ctx, 'div', '', paper, `We are pleased to offer you the position of ${hire.role || 'Employee'} at ${s.company}. This letter confirms the key terms of your employment.`);
        const terms = P.element(ctx, 'dl', 'human-terms', paper);
        for (const [key, value] of [['Start Date:', s.date], ['Equipment:', s.equipment.find(e => e.id === s.kit)?.name || s.equipment[0]?.name || 'Standard equipment']]) {
          P.element(ctx, 'dt', '', terms, key); P.element(ctx, 'dd', '', terms, value);
        }
        P.element(ctx, 'p', '', paper, 'We look forward to having you join our team.');
        P.element(ctx, 'div', 'human-signature', paper, `Sincerely,\n${extras[4]?.name || 'People Operations'}\nDirector of Human Resources`);
      },
      checklist: (base, S) => (ctx, parent) => {
        const { P } = S, { s, ui } = S.current;
        const h = P.element(ctx, 'div', 'human-sectionhead', parent);
        P.icon(ctx, h, 'checklist'); P.element(ctx, 'b', '', h, 'Onboarding Tasks');
        const columns = P.element(ctx, 'div', 'human-columns', parent);
        for (const text of ['Complete', 'Task', 'Due Date']) P.element(ctx, 'span', '', columns, text);
        for (const [i, task] of s.tasks.entries()) {
          if (ui.query && !`${task.label} ${task.owner}`.toLowerCase().includes(ui.query)) continue;
          const b = P.task(ctx, parent, task, i); P.taskEvents(ctx, b, task);
        }
      },
      task: (base, S) => (ctx, parent, task, i) => {
        const { P } = S;
        const b = P.element(ctx, 'button', 'human-taskrow', parent);
        b.type = 'button'; b.setAttribute('role', 'checkbox'); b.setAttribute('aria-checked', String(!!ctx.model.checked[task.id]));
        const cell = P.element(ctx, 'span', 'human-complete', b);
        const mark = P.element(ctx, 'span', 'human-checkbox', cell);
        if (ctx.model.checked[task.id]) P.icon(ctx, mark, 'check');
        P.element(ctx, 'span', 'human-tasklabel', b, task.label);
        P.element(ctx, 'span', 'human-due', b, i < 2 ? 'Before day one' : 'First week');
        P.decorated(ctx, b, task, 'task'); return b;
      },
      equipment: (base, S) => (ctx, parent, equipment) => {
        const { P } = S;
        const b = P.element(ctx, 'button', 'human-equipment', parent);
        b.type = 'button'; b.setAttribute('aria-pressed', String(ctx.model.kit === equipment.id));
        const mark = P.element(ctx, 'span', 'human-checkbox', b);
        if (ctx.model.kit === equipment.id) P.icon(ctx, mark, 'check');
        P.icon(ctx, b, 'laptop');
        const text = P.element(ctx, 'span', 'human-equipmenttext', b);
        P.element(ctx, 'span', '', text, equipment.name);
        P.element(ctx, 'small', '', text, equipment.detail);
        P.decorated(ctx, b, equipment, 'equipment'); return b;
      },
      setup: (base, S) => (ctx, parent) => {
        const { P } = S, { s } = S.current;
        const eq = P.element(ctx, 'section', 'human-box human-equipmentbox', parent);
        const h = P.element(ctx, 'div', 'human-sectionhead', eq);
        P.icon(ctx, h, 'laptop'); P.element(ctx, 'b', '', h, 'Equipment Assignment');
        for (const equipment of s.equipment) {
          const b = P.equipment(ctx, eq, equipment); P.equipmentEvents(ctx, b, equipment);
        }
        const date = P.element(ctx, 'section', 'human-datebox human-box', parent);
        P.icon(ctx, date, 'calendar');
        P.dateField(ctx, date);
        const label = date.querySelector('label'); label.textContent = 'Start Date';
        const input = date.querySelector('input'); input.placeholder = ''; input.setAttribute('aria-label', 'Start date (YYYY-MM-DD)');
        const glyph = P.element(ctx, 'span', 'human-dateglyph', date); P.icon(ctx, glyph, 'calendar');
        const actions = P.element(ctx, 'div', 'human-formactions', date);
        for (const control of [S.current.formEnd, S.current.floatingEnd]) {
          if (control && control.querySelector('button,a')) actions.append(control);
        }
        if (!actions.childElementCount) actions.remove();
      },
      onboarding: (base, S) => (ctx) => {
        const { P } = S, { s, extras, work } = S.current, hire = s.hire || {};
        const column = P.element(ctx, 'div', 'human-content', work);
        P.offer(ctx, column);
        const checklist = P.pane(ctx, column, 'checklist', 'human-checklist human-box');
        P.checklist(ctx, checklist);
        const setup = P.pane(ctx, column, 'setup', 'human-setup'); P.setup(ctx, setup);
        const details = P.element(ctx, 'aside', 'human-details', work);
        const title = P.element(ctx, 'div', 'human-detailtitle', details);
        P.icon(ctx, title, 'people'); P.element(ctx, 'b', '', title, 'Candidate Details');
        const values = P.element(ctx, 'dl', 'human-values', details);
        for (const [key, value] of [['Name', hire.name || 'New Hire'], ['Email', hire.email || extras[0]?.email || ''], ['Phone', '(415) 555-0132'], ['Location', hire.city || ''], ['Department', hire.team || 'Engineering'], ['Job Title', hire.role || 'Employee'], ['Hire Type', 'Full-time'], ['Manager', extras[4]?.name || 'People Operations']]) {
          P.element(ctx, 'dt', '', values, key); P.element(ctx, 'dd', '', values, value);
        }
        if (S.current.taskNote) details.append(S.current.taskNote);
        P.element(ctx, 'h3', 'human-detailheading', details, 'Application');
        const application = P.element(ctx, 'dl', 'human-values', details);
        for (const [key, value] of [['Status', 'Offer Accepted'], ['Applied', 'Apr 10, 2006'], ['Offer Date', 'Apr 28, 2006']]) {
          P.element(ctx, 'dt', '', application, key); P.element(ctx, 'dd', '', application, value);
        }
        P.element(ctx, 'h3', 'human-detailheading', details, 'Documents');
        for (const [i, name] of ['Offer Letter', 'Resume', 'Background Check', 'I-9', 'W-4'].entries()) {
          const row = P.element(ctx, 'div', 'human-document' + (i === 0 ? ' selected' : ''), details);
          P.icon(ctx, row, 'file'); P.element(ctx, 'span', '', row, name);
        }
      },
    },
  },
});
