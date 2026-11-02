// Design of this site on the use-desktop-tools/workspace template: a notebook-style event panel with dropdown pickers.
(function () {
  'use strict';
  env.widget({
    task: 'use-desktop-tools',
    site: 'design-use-desktop-tools-calendar-04',
    name: 'design',
    split: 'train',
    scenarios: ['calendar'],
    template: 'use-desktop-tools/workspace',
    design: {
      calTime12: false,
      calNavText: false,
      calRowCount: null,
      calEventPanel: false,
      calSelectedAgenda: false,
      namePlaceholder: '',
      parts: {
        calHead: () => (C) => {
          const { util, spec } = C;
          util.el('h3', '', C.head, spec.day);
          util.el('span', 'nav first', C.head).innerHTML = '<svg viewBox="0 0 16 16"><path d="M11 3v10L4 8z" fill="currentColor"/></svg>';
          util.el('span', 'today', C.head, 'Today');
          util.el('span', 'nav', C.head).innerHTML = '<svg viewBox="0 0 16 16"><path d="M5 3v10l7-5z" fill="currentColor"/></svg>';
        },
        calRows: () => (C, avail) => {
          const rows = 30;
          return { rowH: avail / rows, rows };
        },
        calSide: () => (C) => {
          const { ctx, util, side } = C;
          const X = C.x = { pendingDuration: 2, had: !!ctx.model.event };
          const agenda = C.agenda = util.el('div', 'at-agenda', side);
          agenda.hidden = true;
          C.hint = util.el('div', 'at-hint', side);
          C.hint.hidden = true;
          const form = C.form = util.el('div', 'at-form nb-panel', side);
          util.el('h4', 'nb-h', form, 'Create Event');
          const fbody = util.el('div', 'nb-body', form);
          const r1 = util.el('div', 'nb-row', fbody);
          util.el('label', '', r1, 'Title:');
          const name = C.name = util.el('input', '', r1);
          name.type = 'text';
          X.r2 = util.el('div', 'nb-row', fbody);
          util.el('label', '', X.r2, 'Start time:');
          X.startDD = util.el('div', 'nb-dd', X.r2);
          X.startTxt = util.el('span', '', X.startDD, 'Select time');
          util.el('i', '', X.startDD).innerHTML = '<svg viewBox="0 0 10 10"><path d="M1 3h8L5 8z" fill="#000"/></svg>';
          X.r3 = util.el('div', 'nb-row', fbody);
          util.el('label', '', X.r3, 'Duration:');
          X.durDD = util.el('div', 'nb-dd', X.r3);
          X.durTxt = util.el('span', '', X.durDD, 'Select duration');
          util.el('i', '', X.durDD).innerHTML = '<svg viewBox="0 0 10 10"><path d="M1 3h8L5 8z" fill="#000"/></svg>';
          const row = C.row = util.el('div', 'row', fbody);
          const create = C.create = util.el('button', 'at-btn pri', row, 'Create event');
          create.type = 'button';
          const det = util.el('div', 'nb-panel', side);
          util.el('h4', 'nb-h', det, 'Event Details');
          X.detBody = util.el('div', 'nb-body nb-det', det, 'No event selected.');
          const notes = util.el('div', 'nb-panel nb-notes', side);
          util.el('h4', 'nb-h', notes, 'Notes');
          const nbox = util.el('div', 'nb-body', notes);
          const noteWrap = util.el('div', 'nb-ta-wrap', nbox);
          const noteField = util.el('textarea', 'nb-ta', noteWrap);
          noteField.placeholder = 'Add any notes (optional):';
          noteField.setAttribute('aria-label', 'Notes');
          const noteScroll = util.el('div', 'nb-note-scroll', noteWrap);
          for (const [symbol, direction] of [['▲', -1], ['▼', 1]]) {
            const arrow = util.el('button', '', noteScroll, symbol);
            arrow.type = 'button';
            arrow.setAttribute('aria-label', direction < 0 ? 'Scroll notes up' : 'Scroll notes down');
            arrow.addEventListener('click', () => { noteField.scrollTop += direction * 40; });
          }
          const cancel = C.cancel = util.el('button', 'at-btn nb-clear', side, 'Clear');
          cancel.type = 'button';
        },
        calActions: () => (C) => {
          const { ctx, fam, N, tl, commit, field, x: X } = C;
          C.name.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter') return;
            e.preventDefault();
            commit(fam.calendarCreate(ctx.model));
          });
          C.create.addEventListener('click', () => commit(fam.calendarCreate(ctx.model)));
          C.cancel.addEventListener('click', () => { X.pendingDuration = 2; field.set(''); commit(fam.calendarCancel(ctx.model)); });

          // Both the original grid drag and the notebook's dropdowns draft the same task event.
          const durationText = (n) => n % 2 === 0 ? `${n / 2} hour${n === 2 ? '' : 's'}` : `${n * 30} minutes`;
          const selectDraft = (start, duration) => {
            const title = field.get();
            const drafted = fam.calendarDrag(ctx.model, start, Math.min(N - 1, start + duration - 1));
            commit({ ...drafted, form: true, event: { ...drafted.event, name: title } });
          };
          const dropdown = (control, row, options, choose) => {
            control.tabIndex = 0;
            control.setAttribute('role', 'button');
            control.setAttribute('aria-expanded', 'false');
            const menu = C.util.el('div', 'nb-options', row);
            menu.hidden = true;
            const close = () => { menu.hidden = true; control.setAttribute('aria-expanded', 'false'); };
            for (const [value, caption] of options) {
              const button = C.util.el('button', 'nb-option', menu, caption);
              button.type = 'button';
              button.addEventListener('click', () => { close(); choose(value); });
            }
            const toggle = () => { menu.hidden = !menu.hidden; control.setAttribute('aria-expanded', String(!menu.hidden)); };
            control.addEventListener('click', toggle);
            control.addEventListener('keydown', (e) => {
              if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
              if (e.key === 'Escape') close();
            });
            document.addEventListener('pointerdown', (e) => { if (!row.contains(e.target)) close(); });
          };
          dropdown(X.startDD, X.r2, Array.from({ length: N }, (_, i) => [i, tl(i)]), (start) => {
            selectDraft(start, ctx.model.event ? ctx.model.event.dur : X.pendingDuration);
          });
          dropdown(X.durDD, X.r3, Array.from({ length: N }, (_, i) => [i + 1, durationText(i + 1)]), (duration) => {
            X.pendingDuration = duration;
            if (ctx.model.event) selectDraft(ctx.model.event.start, duration);
            else X.durTxt.textContent = durationText(duration);
          });
        },
        calEventPainted: () => (C, m, e) => {
          const X = C.x;
          if (e) {
            X.startTxt.textContent = C.tl(e.start);
            const mins = e.dur * 30;
            X.durTxt.textContent = mins % 60 === 0 ? `${mins / 60} hour${mins === 60 ? '' : 's'}` : `${mins} min`;
            X.detBody.textContent = `${e.name || '(no title)'}: ${C.label(e)}`;
          } else {
            X.startTxt.textContent = 'Select time';
            X.durTxt.textContent = 'Select duration';
            X.detBody.textContent = 'No event selected.';
          }
        },
        calPaintForm: () => (C, m) => {
          if (m.event && C.field.get() !== m.event.name) C.field.set(m.event.name);
          else if (!m.event && C.x.had) C.field.set('');
          C.x.had = !!m.event;
        },
      },
    },
  });
})();
