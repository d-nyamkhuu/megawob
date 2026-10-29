// Design on templates/use-hr/workspace.js; defaults reproduce the scaffold.
env.widget({
  task: 'use-hr',
  site: 'design-use-hr-onboarding-02',
  name: 'design',
  split: 'train',
  scenarios: ['onboarding'],
  template: 'use-hr/workspace',
  design: {
      font: '14px/1.35 Arial,sans-serif', inset: '0px', radius: '0px',
      panel: '#ffffff', foreground: '#17182d', line: '#d4dfda',
      accent: '#2f7455', muted: '#475366', background: '#edf3ef',
    parts: {
      frame: (base, S) => function (ctx) {
        const root = base(ctx); root.classList.add('nb-app');
        root.style.setProperty('--u', Math.max(.76, Math.min(1, ctx.size.width / 1648, ctx.size.height / 865)));
        return root;
      },
      shell: (base, S) => function (ctx) {
        const st = S.current, P = S.P;
        st.workspace = st.root; st.main = st.root;
        st.instruction = document.querySelector('.ref-instruction');
        st.panel = document.querySelector('.ref-panel');
        st.search = document.querySelector('.ref-search-input');
        st.search.addEventListener('input', () => { st.ui.query = st.search.value.trim().toLowerCase(); P.draw(ctx); });
        st.work = P.element(ctx, 'div', 'nb-work', st.root);
        st.footer = P.element(ctx, 'div', 'nb-hidden-stats', st.root);
      },
      stats: (base, S) => function (ctx) {
        base(ctx);
        const rows = S.root.querySelectorAll('.nb-summary .nb-detail');
        if (rows[2]) rows[2].lastElementChild.textContent = ctx.model.date || 'Not set';
      },
      onboarding: (base, S) => function (ctx) {
        const P = S.P, st = S.current, { s, extras, work } = st;
        const rail = P.element(ctx, 'aside', 'nb-hiring', work);
        const rh = P.element(ctx, 'div', 'nb-rail-head', rail);
        P.element(ctx, 'b', '', rh, 'Hiring Board'); P.element(ctx, 'span', 'nb-caret', rh, '⌄');
        const filter = P.button(ctx, rh, 'All Open Requisitions', () => P.notice(ctx, 'Hiring Board', ['All open requisitions are shown.']), 'nb-requisitions');
        P.element(ctx, 'span', 'nb-caret', filter, '⌄');
        [extras[0], extras[1], s.hire, extras[2], extras[3], extras[5], extras[6]].forEach((person, i) => {
          const row = P.element(ctx, 'div', 'nb-candidate' + (i === 2 ? ' selected' : ''), rail);
          P.element(ctx, 'b', '', row, person.name);
          P.element(ctx, 'span', 'nb-rowdate', row, ['Mar 12','Mar 11','Mar 10','Mar 8','Mar 6','Mar 5','Mar 3'][i]);
          P.element(ctx, 'div', '', row, person.role);
          P.element(ctx, 'div', 'nb-candidate-status', row, ['Offer','Interview','Offer Accepted','Interview','Screening','Interview','Offer'][i]);
        });
        const main = P.element(ctx, 'div', 'nb-main', work), band = P.element(ctx, 'div', 'nb-band', main);
        const record = P.element(ctx, 'section', 'nb-record', band), info = P.element(ctx, 'div', 'nb-record-info', record);
        const identity = P.element(ctx, 'div', 'nb-record-identity', info); P.element(ctx, 'h1', '', identity, s.hire.name);
        if (st.instruction && !st.instruction.classList.contains('ref-long-instruction')) identity.append(st.instruction);
        P.element(ctx, 'div', 'nb-subtitle', info, `${s.hire.role}  ·  ${s.hire.city}  ·  Req #DA-1024`);
        const steps = P.element(ctx, 'div', 'nb-steps', info);
        ['Sourced','Screen','Interview','Offer','Hired'].forEach((label, i) => {
          const step = P.element(ctx, 'div', 'nb-step' + (i === 3 ? ' active' : ''), steps);
          P.element(ctx, 'span', '', step, String(i + 1)); P.element(ctx, 'b', '', step, label);
        });
        const details = P.element(ctx, 'div', 'nb-record-details', record);
        [['Status','Offer Accepted'],['Offer Date','Mar 10, 2024'],['Department',s.hire.team || 'Data & Analytics'],['Manager',extras[4].name]].forEach(([a,b]) => {
          const row = P.element(ctx, 'div', 'nb-detail', details); P.element(ctx, 'span', '', row, a); P.element(ctx, 'span', '', row, b);
        });
        const summary = P.element(ctx, 'aside', 'nb-summary', band); P.element(ctx, 'h3', '', summary, 'Tasks & Onboarding');
        const done = s.tasks.filter(t => ctx.model.checked[t.id]).length;
        [['Checklist Items',`${done} / ${s.tasks.length}`],['Equipment',ctx.model.kit ? 'Selected' : 'Not selected'],['Start Date',ctx.model.date || 'Not set'],['IT Provisioning','Pending'],['Orientation','Pending']].forEach(([a,b]) => {
          const row = P.element(ctx, 'div', 'nb-detail', summary); P.element(ctx, 'span', '', row, a); P.element(ctx, 'span', '', row, b);
        });
        if (st.panel) summary.append(st.panel);
        const task = P.element(ctx, 'section', 'nb-task', main), tabs = P.element(ctx, 'div', 'nb-tabs', task);
        ['Offer Letter','Onboarding Checklist','Employee Details','Access & Provisioning'].forEach((label,i) => {
          const tab = P.element(ctx, 'div', 'nb-tab' + (i === 0 ? ' active' : ''), tabs);
          P.element(ctx, 'span', '', tab, String(i+1)); P.element(ctx, 'b', '', tab, label);
        });
        const columns = P.element(ctx, 'div', 'nb-columns', task), offer = P.element(ctx, 'section', 'nb-letter', columns); P.offer(ctx, offer);
        const right = P.element(ctx, 'div', 'nb-right', columns), checklist = P.pane(ctx, right, 'checklist', 'nb-checklist'); P.checklist(ctx, checklist);
        const setup = P.pane(ctx, right, 'setup', 'nb-setup'); P.setup(ctx, setup);
      },
      checklist: (base, S) => function (ctx, parent) {
        const P = S.P, { s, ui } = S.current;
        P.element(ctx, 'h3', 'nb-section-title', parent, 'Day One Checklist');
        const header = P.element(ctx, 'div', 'nb-check-head', parent); ['Task','Owner','Due'].forEach(text => P.element(ctx, 'span', '', header, text));
        const rows = P.element(ctx, 'div', 'nb-check-rows', parent);
        for (const [i, task] of s.tasks.entries()) {
          if (ui.query && !`${task.label} ${task.owner}`.toLowerCase().includes(ui.query)) continue;
          const b = P.task(ctx, rows, task, i); P.taskEvents(ctx, b, task);
        }
        if (ui.query && !rows.children.length) P.empty(ctx, rows, 'No checklist items match');
      },
      task: (base, S) => function (ctx, parent, task, i) {
        const P = S.P, b = P.element(ctx, 'button', 'hr-check nb-check', parent);
        b.type = 'button'; b.setAttribute('role', 'checkbox'); b.setAttribute('aria-checked', String(!!ctx.model.checked[task.id]));
        const mark = P.element(ctx, 'span', 'hr-checkmark', b); if (ctx.model.checked[task.id]) P.icon(ctx, mark, 'check');
        P.element(ctx, 'span', 'nb-task-label', b, task.label); P.element(ctx, 'span', 'nb-task-owner', b, task.owner);
        P.element(ctx, 'span', 'nb-task-due', b, i < 3 ? 'Apr 5, 2024' : i < 5 ? 'Apr 6, 2024' : 'Apr 7, 2024');
        P.decorated(ctx, b, task, 'task'); return b;
      },
      offer: (base, S) => function (ctx, parent) {
        const P = S.P, { s, extras } = S.current;
        P.element(ctx, 'h3', 'nb-section-title', parent, 'Offer Letter');
        const tools = P.element(ctx, 'div', 'nb-doc-tools', parent), notebook = P.element(ctx, 'span', 'nb-doc-sidebar', tools);
        notebook.innerHTML = '<svg width="18" height="20" viewBox="0 0 20 22" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="3" width="14" height="17" rx="2"/><path d="M7 3v17M3 7h4M3 11h4M3 15h4"/></svg>';
        ['‹','›','1','/ 1','−','100 %','+'].forEach((label,i) => P.element(ctx, 'span', [2,4,5,6].includes(i) ? 'nb-tool-box' : '', tools, label));
        const scroll = P.element(ctx, 'div', 'nb-document-scroll', parent), paper = P.element(ctx, 'article', 'nb-paper', scroll);
        const letterhead = P.element(ctx, 'div', 'nb-letterhead', paper), logo = P.element(ctx, 'div', 'nb-company-logo', letterhead);
        logo.innerHTML = '<svg viewBox="0 0 75 58" aria-hidden="true"><path fill="#102f2c" d="M1 44L21 18 41 44Z M18 44L38 3 65 44Z M35 44L58 16 75 44Z"/><path fill="#2f7455" opacity=".85" d="M3 48L24 27 43 48Z M28 48L46 21 68 48Z"/><path fill="#d7e8de" d="M0 48H75L69 56H7Z"/></svg>';
        const company = P.element(ctx, 'div', 'nb-company', letterhead); P.element(ctx, 'div', 'nb-company-name', company, s.company); P.element(ctx, 'div', 'nb-company-subtitle', company, 'Technology Group');
        P.element(ctx, 'div', 'nb-address', letterhead, `123 Market Street\n${s.hire.city}\nMarch 10, 2024`);
        P.element(ctx, 'h2', 'nb-offer-title', paper, 'Employment Offer'); P.element(ctx, 'p', '', paper, `Dear ${s.hire.name},`);
        P.element(ctx, 'p', '', paper, `We are pleased to offer you the position of ${s.hire.role} at ${s.company}. We are excited about the possibility of you joining our team.`);
        const dl = P.element(ctx, 'dl', 'nb-offer-details', paper);
        const [year, month, day] = s.date.split('-');
        const date = `${['January','February','March','April','May','June','July','August','September','October','November','December'][Number(month)-1]} ${Number(day)}, ${year}`;
        const required = s.equipment.find(e => e.id === s.kit);
        [['Position:',s.hire.role],['Department:',s.hire.team || 'Data & Analytics'],['Manager:',extras[4].name],['Start Date:',date],['Location:',s.hire.city],['Compensation:','$92,000 annual salary'],['Equipment:',`${required.name}\n${required.detail}\n${P.money(ctx, required.cost)}`]].forEach(([a,b]) => {
          const row = P.element(ctx, 'div', a === 'Start Date:' ? 'nb-start-evidence' : '', dl); P.element(ctx, 'dt', '', row, a); P.element(ctx, 'dd', '', row, b);
        });
        P.element(ctx, 'p', '', paper, `This offer is contingent upon the successful completion of a background check. We look forward to welcoming you to ${s.company}.`);
        const track = P.element(ctx, 'div', 'nb-document-track', parent), thumb = P.element(ctx, 'i', '', track);
        track.setAttribute('aria-hidden', 'true');
        const syncScroll = () => {
          const available = track.clientHeight - 20, ratio = scroll.clientHeight / scroll.scrollHeight;
          const height = Math.max(28, available * ratio), offset = scroll.scrollTop / Math.max(1, scroll.scrollHeight - scroll.clientHeight);
          thumb.style.height = height + 'px'; thumb.style.top = (4 + offset * (available - height)) + 'px';
        };
        scroll.addEventListener('scroll', syncScroll);
        track.addEventListener('pointerdown', e => {
          const r = track.getBoundingClientRect();
          scroll.scrollTop = (e.clientY - r.top) / r.height * scroll.scrollHeight - scroll.clientHeight / 2;
          syncScroll();
        });
      },
      setup: (base, S) => function (ctx, parent) {
        const P = S.P, { s } = S.current, equip = P.element(ctx, 'section', 'nb-equipment-section', parent);
        P.element(ctx, 'h3', 'nb-section-title', equip, 'Equipment (from offer letter)'); const options = P.element(ctx, 'div', 'nb-equipment-options', equip);
        for (const equipment of s.equipment) { const b = P.equipment(ctx, options, equipment); P.equipmentEvents(ctx, b, equipment); }
        const date = P.element(ctx, 'section', 'nb-date-section', parent); P.element(ctx, 'h3', 'nb-section-title', date, 'Start Date (from offer letter)'); P.dateField(ctx, date);
      },
      equipment: (base, S) => function (ctx, parent, equipment) {
        const P = S.P, b = P.button(ctx, parent, '', null, 'hr-equipment nb-equipment'); b.setAttribute('aria-pressed', String(ctx.model.kit === equipment.id));
        const mark = P.element(ctx, 'span', 'hr-checkmark', b); if (ctx.model.kit === equipment.id) P.icon(ctx, mark, 'check');
        const art = P.element(ctx, 'span', 'nb-laptop', b);
        art.innerHTML = '<svg viewBox="0 0 64 48" aria-hidden="true"><defs><linearGradient id="screen" x2="1" y2="1"><stop stop-color="#101744"/><stop offset=".55" stop-color="#2553a4"/><stop offset="1" stop-color="#5688dc"/></linearGradient></defs><rect x="9" y="3" width="45" height="32" rx="1" fill="#222936"/><rect x="12" y="6" width="39" height="26" fill="url(#screen)"/><path d="M12 30L43 6H51L24 30Z" fill="#8298df" opacity=".24"/><path d="M9 36H54L62 42H2Z" fill="#a5aaac"/><path d="M2 42H62V44H2Z" fill="#636b6d"/></svg>';
        if (/desktop|workstation/i.test(equipment.name + equipment.detail)) art.innerHTML = '<svg viewBox="0 0 64 48" aria-hidden="true"><defs><linearGradient id="desktop" x2="1" y2="1"><stop stop-color="#3e494d"/><stop offset="1" stop-color="#0b1014"/></linearGradient></defs><rect x="2" y="2" width="59" height="35" rx="1" fill="#111619"/><rect x="5" y="5" width="53" height="29" fill="url(#desktop)"/><path d="M29 37H35V43H45V46H19V43H29Z" fill="#30393b"/></svg>';
        P.element(ctx, 'span', 'nb-equipment-name', b, equipment.name); P.decorated(ctx, b, equipment, 'equipment'); return b;
      },
      dateField: (base, S) => function (ctx, parent) {
        const row = S.P.element(ctx, 'div', 'nb-date-row', parent); base(ctx, row); row.querySelector('label').textContent = 'Start Date'; S.P.icon(ctx, row, 'calendar');
      },
    },
  },
});
