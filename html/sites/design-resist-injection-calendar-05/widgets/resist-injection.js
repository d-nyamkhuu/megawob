// Design on the shared resist-injection workspace.
env.widget({
  task: 'resist-injection',
  site: 'design-resist-injection-calendar-05',
  name: 'design',
  split: 'train',
  scenarios: ['calendar'],
  template: 'resist-injection/classic',
  design: {
    parts: {
      sourceCalendar: (base, S) => (ctx) => {
        const agendaTitle = document.querySelector('.ref-agenda-row.is-selected a:last-child');
        if (agendaTitle) agendaTitle.textContent = S.spec.sourceTitle;
        const dateNumber = ({Sunday: 20, Monday: 21, Tuesday: 22, Wednesday: 23, Thursday: 24, Friday: 25, Saturday: 26})[S.spec.day];
        const fullDate = dateNumber ? `${S.spec.day}, April ${dateNumber}, 2025` : S.spec.day;
        if (dateNumber) {
          const dayHeading = document.querySelector('.ref-agenda-title');
          if (dayHeading) dayHeading.textContent = `${S.spec.day.slice(0, 3)}, Apr ${dateNumber}, 2025`;
          for (const cell of document.querySelectorAll('.ref-day')) {
            cell.classList.toggle('is-selected', !cell.classList.contains('is-muted') && cell.textContent === String(dateNumber));
          }
        }
        const table = S.ctx.util.el('div', 'si-invitation-list', S.source);
        const heading = S.ctx.util.el('h2', 'si-invitation-heading', table, `Invitations (${S.spec.items.length})`);
        const grid = S.ctx.util.el('div', 'si-invitation-grid', table);
        const head = S.ctx.util.el('div', 'si-invitation-row si-invitation-header', grid);
        for (const label of ['From', 'Event', 'Date & Time']) S.ctx.util.el('span', '', head, label);
        S.spec.items.forEach((item, i) => {
          const row = S.P.navRow(grid, item);
          row.classList.add('si-invitation-row');
          row.setAttribute('aria-label', `${item.by}, ${item.name}`);
          row.replaceChildren();
          S.ctx.util.el('span', 'si-invitation-icon', row, '✉');
          S.ctx.util.el('span', 'si-invitation-from', row, item.by);
          S.ctx.util.el('span', 'si-invitation-event', row, item.name);
          S.ctx.util.el('span', 'si-invitation-date', row, `${S.spec.day} · ${i ? '2:00 PM' : '10:00 AM'}`);
          S.rowNodes.set(item.id, row);
          row.addEventListener('click', () => S.P.send({ row: item.id }));
        });
        const detail = S.ctx.util.el('section', 'si-invitation-detail', S.source);
        S.ctx.util.el('h2', '', detail, S.spec.sourceTitle);
        const guests = [...new Set([S.spec.person.full, ...S.spec.items.map(item => item.by)])].slice(0, 4);
        S.P.meta(detail, [['Date', fullDate], ['Time', '1:00 PM – 2:00 PM'], ['Location', S.spec.room],
          ['Organizer', S.spec.person.full], ['Attendees', guests.join('\n')], ['Subject', S.spec.sourceTitle]]);
        S.ctx.util.el('h3', 'si-invitation-description-title', detail, 'Description');
        S.ctx.util.el('p', 'si-invitation-intro', detail, `Let’s review the project progress and next steps. We’ll meet in ${S.spec.room}. Please come prepared with any updates.`);
        const workItem = S.spec.sourceTitle.match(/\bWK-\d+/)?.[0] || S.spec.sourceTitle;
        S.ctx.util.el('div', 'si-invitation-message', detail,
          `Discuss plans and next steps for work item ${workItem}, including scope, milestones, and resource needs. Please come prepared with any updates and questions.`);
        S.P.flow(detail);
      },
      properties: (base, S) => (ctx) => {
        // Keep the fields and save action in one vertical column at every height.
        S.fields.parentElement.style.flexWrap = 'nowrap';
        S.fields.style.flex = '1 1 auto';
        S.savebar.style.flex = '0 0 auto';
        S.savebar.style.marginLeft = '0';
        const row = S.ctx.util.el('div', 'si-calendar-response', S.fields);
        row.style.flexWrap = 'nowrap';
        const choiceBox = S.ctx.util.el('div', 'si-calendar-choices', row);
        choiceBox.style.flexWrap = 'wrap';
        choiceBox.style.flex = '0 1 auto';
        choiceBox.style.minWidth = '0';
        S.ctx.util.el('span', 'si-calendar-label', choiceBox, 'Your RSVP:');
        if (Object.hasOwn(S.spec.goals, 'choice')) {
          S.spec.choices.forEach((value) => S.choiceNodes.set(value,
            S.P.button(choiceBox, value, { choice: value }, { choice: value }, 'si-choice')));
        }
        const panel = document.querySelector('.ref-panel');
        if (panel) row.appendChild(panel);
        if (Object.hasOwn(S.spec.goals, 'answer')) {
          const field = S.P.field(row, S.spec.labels.answer, 'answer');
          field.style.minWidth = '0';
          const holder = field.matches('input, textarea') ? field.parentElement : field;
          const scroll = S.ctx.util.el('span', 'si-note-scrollbar', holder);
          S.ctx.util.el('span', '', scroll, '▲');
          S.ctx.util.el('span', '', scroll, '▼');
        }
        if (Object.hasOwn(S.spec.goals, 'assignee')) S.P.field(row, S.spec.labels.assignee, 'assignee').style.minWidth = '0';
        S.selection = S.ctx.util.el('span', 'si-muted', row);
        const toolbar = S.fields.closest('.si-app').querySelector('.si-toolbar');
        if (toolbar) {
          const actions = S.ctx.util.el('section', 'si-room-actions', row);
          const actionsHeader = S.ctx.util.el('div', 'si-actions-header', actions);
          S.ctx.util.el('h3', '', actionsHeader, 'Actions:');
          actionsHeader.appendChild(S.savebar);
          const buttons = [...toolbar.querySelectorAll('button, a')];
          toolbar.replaceChildren(...buttons);
          for (const button of buttons) {
            const label = button.textContent;
            if (/email|copy/i.test(label)) {
              const mail = /email/i.test(label);
              button.classList.add(mail ? 'campus-action-email' : 'campus-action-copy');
              button.replaceChildren();
              const pict = S.ctx.util.el('span', 'si-action-pict', button);
              pict.innerHTML = `<svg viewBox="0 0 34 34" aria-hidden="true"><g fill="white" stroke="black" stroke-width="1.5">${mail ? '<rect x="2" y="7" width="30" height="22"/><path d="M2 7l15 12L32 7M2 29l11-12m19 12L21 17" fill="none"/>' : '<rect x="5" y="5" width="25" height="26"/><path d="M5 5h25v6H5z" fill="#003dbb"/><path d="M10 2v7m15-7v7M6 18h23M6 25h23M13 12v18m9-18v18" fill="none"/>'}</g></svg>`;
              S.ctx.util.el('span', 'si-action-label', button, label);
            }
            else button.classList.add('campus-action-secondary');
          }
          actions.appendChild(toolbar);
        }
        S.P.button(S.savebar, S.spec.commit, { action: 'save' }, { action: 'save' }, 'primary');
      },
    },
  },
});
