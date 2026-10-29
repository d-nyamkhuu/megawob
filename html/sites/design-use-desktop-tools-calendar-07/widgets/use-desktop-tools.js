// Calendar design: fixed 20-row grid and a persistent event form with start and duration pickers.
env.widget({
  task: 'use-desktop-tools',
  site: 'design-use-desktop-tools-calendar-07',
  name: 'design',
  split: 'train',
  scenarios: ['calendar'],
  template: 'use-desktop-tools/workspace',
  design: {
    calRowCount: 20,
    formAlways: false,
    calEventPanel: false,
    calSelectedAgenda: false,
    calTime12: false,
    calNavText: false,
    parts: {
      calRows: (base) => (C, avail) => ({ rowH: avail / 20, rows: 20 }),
      calSide: (base, S) => (C) => {
        const { util, side, ctx, fam, N, tl } = C;
        util.el('h4', '', side, 'Agenda');
        C.agenda = util.el('div', 'at-agenda', side);
        C.hint = util.el('div', 'at-hint', side, 'Add an event to your calendar');
        C.hint.innerHTML = '<svg viewBox="0 0 48 54" fill="none" stroke="currentColor" stroke-width="3.5"><rect x="4" y="10" width="40" height="39" rx="3"/><path d="M4 20h40M14 5v9M34 5v9M24 29v13M17.5 35.5h13"/><path d="M6 12h36v7H6z" fill="currentColor"/></svg><div><strong>New Event</strong><span>Add an event to your calendar</span></div>';
        C.form = util.el('div', 'at-form', side);
        const titleGroup = util.el('label', 'dock-field title-field', C.form, 'Title');
        const name = C.name = util.el('input', '', titleGroup);
        name.type = 'text';
        name.placeholder = 'Enter event title';
        let selectedStart = ctx.model.event ? ctx.model.event.start : Math.floor(ctx.model.view.top);
        let selectedDur = ctx.model.event ? ctx.model.event.dur : 2;
        const startGroup = util.el('div', 'dock-field start-field', C.form);
        util.el('span', '', startGroup, 'Start time');
        const startButton = util.el('button', 'dock-select', startGroup, tl(selectedStart));
        startButton.type = 'button';
        const durationGroup = util.el('div', 'dock-field duration-field', C.form);
        util.el('span', '', durationGroup, 'Duration');
        const durationButton = util.el('button', 'dock-select', durationGroup, '1 hour');
        durationButton.type = 'button';
        const choose = (group, button, options, onChoose) => {
          const list = util.el('div', 'dock-options', group);
          list.hidden = true;
          button.addEventListener('click', () => { list.hidden = !list.hidden; });
          for (const [value, text] of options) {
            const option = util.el('button', '', list, text);
            option.type = 'button';
            option.addEventListener('click', () => { list.hidden = true; onChoose(value); });
          }
        };
        const updateDraft = () => {
          let m = fam.calendarDrag(ctx.model, selectedStart, Math.min(N - 1, selectedStart + selectedDur - 1));
          if (m.event) m = { ...m, event: { ...m.event, name: name.value }, form: true };
          ctx.update(m);
          C.paint(ctx.model);
        };
        C.dockInput = (value) => {
          let m = fam.calendarDrag(ctx.model, selectedStart, Math.min(N - 1, selectedStart + selectedDur - 1));
          if (m.event) m = { ...m, event: { ...m.event, name: value }, form: true };
          ctx.update(m);
          C.paint(ctx.model);
        };
        choose(startGroup, startButton, Array.from({ length: N }, (_, i) => [i, tl(i)]), (value) => {
          selectedStart = value;
          updateDraft();
        });
        choose(durationGroup, durationButton, [[1, '30 minutes'], [2, '1 hour'], [3, '1.5 hours'], [4, '2 hours']], (value) => {
          selectedDur = value;
          updateDraft();
        });
        C.when = util.el('div', 'when', C.form);
        C.row = util.el('div', 'row', C.form);
        C.cancel = util.el('button', 'at-btn dock-cancel', C.row, 'Cancel');
        C.cancel.type = 'button';
        C.create = util.el('button', 'at-btn pri', C.row, 'Create event');
        C.create.type = 'button';
        C.dockSync = (m) => {
          const e = m.event;
          if (e) {
            selectedStart = e.start;
            selectedDur = e.dur;
          }
          startButton.textContent = tl(selectedStart);
          durationButton.textContent = selectedDur === 2 ? '1 hour' : selectedDur % 2 ? `${selectedDur * 30} minutes` : `${selectedDur / 2} hours`;
        };
      },
      calNameInput: (base, S) => (C, v) => {
        if (!C.ctx.model.event) {
          C.dockInput(v);
          return;
        }
        if (C.ctx.model.event.name === v) return;
        C.ctx.update({ ...C.ctx.model, event: { ...C.ctx.model.event, name: v } });
        C.paintEvent(C.ctx.model);
      },
      calPaintForm: (base) => (C, m) => {
        C.form.hidden = false;
        C.hint.hidden = false;
        C.cancel.hidden = !m.form;
        if (C.field.get() !== (m.event ? m.event.name : '')) C.field.set(m.event ? m.event.name : '');
        C.dockSync(m);
      },
    },
  },
});
