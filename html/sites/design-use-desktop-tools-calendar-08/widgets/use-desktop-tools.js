// The calendar keeps its 1990s month sidebar and detailed event form on the shared workspace widget.
(function () {
  'use strict';

  env.widget({
    task: 'use-desktop-tools',
    site: 'design-use-desktop-tools-calendar-08',
    name: 'design',
    split: 'train',
    scenarios: ['calendar'],
    template: 'use-desktop-tools/workspace',
    design: {
      formAlways: true,
      formTitle: 'New event',
      namePlaceholder: '',
      createLabel: 'Create event',
      cancelLabel: 'Clear',
      calTime12: true,
      calNavText: false,
      calRowCount: 28,
      calEventPanel: false,
      calSelectedAgenda: false,
      parts: {
        calStart: (base) => (C) => {
          const { util, spec, main } = C;
          const win = main.parentNode.parentNode;
          const menu = util.el('div', 'at-menubar');
          for (const item of ['File', 'Edit', 'View', 'Tools', 'Help']) util.el('span', '', menu, item);
          win.insertBefore(menu, main.parentNode);

          const left = util.el('div', 'at-left', main);
          const mini = util.el('div', 'at-mini', left);
          const parts = spec.day.match(/^(\w+),?\s+(\w+)\s+(\d+)/);
          const month = parts ? parts[2] : 'April';
          const day = parts ? Number(parts[3]) : 24;
          const weekday = parts
            ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(parts[1])
            : 5;
          const days = month === 'February' ? 28 : ['April', 'June', 'September', 'November'].includes(month) ? 30 : 31;
          util.el('h5', '', mini, `${month} 1992`);
          const monthGrid = util.el('div', '', mini);
          for (const label of ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']) util.el('span', '', monthGrid, label);
          for (let i = 0; i < (weekday - ((day - 1) % 7) + 7) % 7; i++) util.el('span', '', monthGrid, '');
          for (let d = 1; d <= days; d++) util.el('span', d === day ? 'on' : '', monthGrid, String(d));
          util.el(
            'div',
            'at-dayl',
            left,
            spec.day
              .replace(/^\w+,?/, (m) => m.slice(0, 3) + ',')
              .replace(/\b(January|February|March|April|June|July|August|September|October|November|December)\b/g, (m) => m.slice(0, 3)),
          );
          const views = util.el('div', 'at-views', left);
          ['Daily View', 'Weekly View', 'Monthly View', 'Tasks', 'Contacts'].forEach((label, i) => {
            const row = util.el('span', i === 0 ? 'on' : '', views);
            util.el('i', '', row);
            row.append(label);
          });
          base(C);
        },
        calSideBuilt: (base) => (C) => {
          base(C);
          const tabs = C.util.el('div', 'at-dtabs');
          C.util.el('span', '', tabs, 'Event');
          C.util.el('span', '', tabs, 'Recurrence');
          C.side.insertBefore(tabs, C.side.firstChild);
        },
        calRows: () => (C, avail) => {
          const rowH = Math.max(12, avail / 28);
          return { rowH, rows: Math.round(avail / rowH) };
        },
        calGridBuilt: (base) => (C) => {
          base(C);
          C.gut.style.setProperty('--hour-height', `${C.rowH * 2}px`);
        },
        calFormFields: (base, S) => (C) => {
          base(C);
          const { util, ctx, fam, N } = C;
          const x = C.x = {};
          const title = util.el('label', 'at-title-label', C.form, 'Title:');
          title.htmlFor = C.name.id = 'event-title';

          x.controlStart = ctx.model.event ? ctx.model.event.start : Math.round(ctx.model.view.top);
          x.controlDuration = ctx.model.event ? ctx.model.event.dur : 2;
          const start = util.el('div', 'at-native-field start-field', C.form);
          util.el('span', 'field-label', start, 'Start time:');
          x.startValue = util.el('span', 'field-value', start);
          const duration = util.el('div', 'at-native-field duration-field', C.form);
          util.el('span', 'field-label', duration, 'Duration:');
          x.durationValue = util.el('span', 'field-value', duration);
          const location = util.el('label', 'at-location', C.form, 'Location:');
          util.el('input', '', location).type = 'text';
          const notes = util.el('label', 'at-notes', C.form, 'Notes:');
          util.el('textarea', '', notes);

          x.setDraft = () => {
            const model = fam.calendarDrag(ctx.model, x.controlStart, Math.min(N - 1, x.controlStart + x.controlDuration - 1));
            C.commit({ ...model, form: true, event: { ...model.event, name: C.name.value } });
          };
          for (const [box, change] of [
            [start, (delta) => { x.controlStart = S.clamp(x.controlStart + delta, 0, N - x.controlDuration); }],
            [duration, (delta) => { x.controlDuration = S.clamp(x.controlDuration + delta, 1, N - x.controlStart); }],
          ]) {
            const spins = util.el('div', 'at-spins', box);
            for (const [symbol, delta] of [['▲', 1], ['▼', -1]]) {
              const button = util.el('button', '', spins, symbol);
              button.type = 'button';
              button.addEventListener('click', () => { change(delta); x.setDraft(); });
            }
          }
        },
        calNameInput: (base) => (C, value) => {
          if (!C.ctx.model.event) {
            C.x.setDraft();
            return;
          }
          base(C, value);
        },
        calActions: (base) => (C) => {
          base(C);
          const button = C.util.el('button', 'at-dialog-cancel at-btn', C.side, 'Cancel');
          button.type = 'button';
          button.addEventListener('click', () => C.commit(C.fam.calendarCancel(C.ctx.model)));
        },
        calPaintExtra: (base) => (C, model) => {
          base(C, model);
          const x = C.x;
          if (model.event) {
            x.controlStart = model.event.start;
            x.controlDuration = model.event.dur;
          }
          x.startValue.textContent = C.tl(x.controlStart);
          x.durationValue.textContent = `${x.controlDuration * 30} minutes`;
          C.name.value = model.event ? model.event.name : '';
          const value = model.event ? model.event.name : '';
          if (C.field.get() !== value) C.field.set(value);
        },
      },
    },
  });
})();
