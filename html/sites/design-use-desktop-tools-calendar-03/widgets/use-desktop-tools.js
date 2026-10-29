// Design of this site on the use-desktop-tools/workspace template: a 1984 desktop dialog, a form with the stepper fields.
(function () {
  'use strict';
  env.widget({
    task: 'use-desktop-tools',
    site: 'design-use-desktop-tools-calendar-03',
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
        // The calendar window is a bare box scaled to the page width.
        frame: (base) => (ctx) => {
          const { util, size } = ctx;
          ctx.stage.style.setProperty('--unit', `${size.width / 1564}px`);
          const win = util.el('div', 'at-win', ctx.stage);
          const body = util.el('div', 'at-body', win);
          const main = util.el('div', 'at-main', body);
          return { win, main, gear: null, appMenu: null, title: null };
        },
        calHead: (base, S) => (C) => {
          const { util, spec } = C;
          util.el('span', 'nav', C.head).innerHTML = S.svg('<path d="M10 3.5L5.5 8 10 12.5"/>', 16);
          util.el('h3', '', C.head, spec.day + ', 1984');
          util.el('span', 'nav', C.head).innerHTML = S.svg('<path d="M6 3.5L10.5 8 6 12.5"/>', 16);
        },
        calRows: () => (C, avail) => {
          const rows = 20;
          return { rowH: avail / rows, rows };
        },
        calLine: () => (C, i) => {
          const { util } = C;
          const l = util.el('div', 'at-hh' + (i % 2 ? ' half' : ''), C.col);
          l.style.top = `${(i - (i % 2 ? 0 : 0.3)) * C.rowH}px`;
          if (i % 2 === 0) {
            const h = Math.floor(i / 2) % 24;
            const s = util.el('span', '', C.gut, `${h % 12 || 12}:00 ${h < 12 ? 'AM' : 'PM'}`);
            s.style.top = `${i * C.rowH}px`;
          }
        },
        calPlace: (base) => (C, el, e) => {
          base(C, el, e);
          el.classList.toggle('short', e.dur === 1);
        },
        calSide: (base, S) => (C) => {
          const { ctx, util, spec, side, N, tl, sc } = C;
          const X = C.x = {};
          const agenda = C.agenda = util.el('div', 'at-agenda', side);
          agenda.hidden = true;
          const hint = C.hint = util.el('div', 'at-hint', side);
          hint.hidden = true;
          const form = C.form = util.el('div', 'at-form', side);
          util.el('h4', '', form, 'New Event');
          const formRow = (label, cls = '') => {
            const r = util.el('div', 'form-field ' + cls, form);
            util.el('label', '', r, label);
            return r;
          };
          const titleRow = formRow('Title:');
          const name = C.name = util.el('input', '', titleRow);
          name.type = 'text';
          name.setAttribute('aria-label', 'Title');
          const dateRow = formRow('Date:');
          const date = util.el('div', 'date-field', dateRow);
          const shortDay = spec.day.replace(/^([A-Za-z]+), ([A-Za-z]+) /, (_, d, m) => d.slice(0, 3) + ', ' + m.slice(0, 3) + ' ');
          util.el('span', '', date, shortDay + ', 1984');
          const clock = document.querySelector('.menu-clock');
          if (clock) clock.textContent = shortDay.replace(',', '') + ', 1984   10:24 AM';
          const dateButton = util.el('button', '', date);
          dateButton.type = 'button';
          dateButton.setAttribute('aria-label', 'Calendar date');
          dateButton.innerHTML = '<svg viewBox="0 0 30 30"><rect x="3" y="5" width="24" height="23"/><path d="M3 11h24M9 2v7M21 2v7M8 15h3m4 0h3m4 0h2M8 20h3m4 0h3m4 0h2M8 25h3m4 0h3m4 0h2"/></svg>';
          dateButton.addEventListener('click', () => { sc.focus({ preventScroll: true }); });
          const stepField = (label, key) => {
            const r = formRow(label);
            const box = util.el('div', 'step-field', r);
            const input = util.el('input', '', box);
            input.type = 'text';
            input.setAttribute('aria-label', label.replace(':', ''));
            const buttons = util.el('div', 'step-buttons', box);
            for (const sign of [1, -1]) {
              const b = util.el('button', '', buttons);
              b.type = 'button';
              b.setAttribute('aria-label', (sign > 0 ? 'Increase ' : 'Decrease ') + key);
              util.el('i', '', b);
              b.addEventListener('click', () => stepValue(key, sign));
            }
            input.addEventListener('input', applyFields);
            input.addEventListener('change', applyFields);
            return input;
          };
          const startInput = X.startInput = stepField('Start time:', 'start time');
          startInput.closest('.form-field').classList.add('start-time');
          const durationInput = X.durationInput = stepField('Duration:', 'duration');
          const location = X.location = util.el('input', '', formRow('Location:', 'location'));
          location.type = 'text';
          location.setAttribute('aria-label', 'Location');
          const notesBox = util.el('div', 'notes-field', formRow('Notes:', 'notes'));
          const notes = X.notes = util.el('textarea', '', notesBox);
          notes.setAttribute('aria-label', 'Notes');
          const notesScroll = util.el('div', 'notes-scroll', notesBox);
          for (const [symbol, dy] of [['▵', -35], ['▿', 35]]) {
            const b = util.el('button', '', notesScroll, symbol);
            b.type = 'button';
            b.setAttribute('aria-label', dy < 0 ? 'Scroll notes up' : 'Scroll notes down');
            b.addEventListener('click', () => { notes.scrollTop += dy; });
          }
          C.when = util.el('div', 'when', form);
          const row = C.row = util.el('div', 'row', form);
          const cancel = C.cancel = util.el('button', 'at-btn', row, 'Cancel');
          cancel.type = 'button';
          const create = C.create = util.el('button', 'at-btn pri', row, 'Create event');
          create.type = 'button';
          const submit = document.querySelector('.site-shell .end-control');
          if (submit) row.append(submit);
          else row.style.gridTemplateColumns = '1fr 1fr';

          function parseTime(v) {
            const match = v.trim().toLowerCase().match(/^(\d{1,2})(?::(00|30))?\s*(am|pm)?$/);
            if (!match) return null;
            let h = Number(match[1]);
            if (match[3]) {
              if (h < 1 || h > 12) return null;
              h = h % 12 + (match[3] === 'pm' ? 12 : 0);
            }
            return h < 24 ? h * 2 + (match[2] === '30' ? 1 : 0) : null;
          }
          function parseDuration(v) {
            const match = v.trim().toLowerCase().match(/^(\d+(?:\.\d+)?)\s*(hours?|hrs?|h|minutes?|mins?|m)?$/);
            if (!match) return null;
            const slots = Number(match[1]) * (/^(m)/.test(match[2] || '') ? 1 / 30 : 2);
            return Number.isInteger(slots) && slots > 0 ? slots : null;
          }
          function applyFields() {
            const start = parseTime(startInput.value);
            const dur = parseDuration(durationInput.value);
            if (start === null || dur === null || start + dur > N) return false;
            ctx.update({ ...ctx.model, event: { start, dur, name: name.value, saved: false }, form: true });
            C.paintEvent(ctx.model, false);
            return true;
          }
          function stepValue(key, sign) {
            if (key === 'start time') {
              const value = parseTime(startInput.value);
              startInput.value = tl(S.clamp((value === null ? 18 : value) + sign, 0, N - 1));
            } else {
              const value = parseDuration(durationInput.value);
              const dur = S.clamp((value === null ? 1 : value) + sign, 1, N);
              durationInput.value = `${dur / 2} ${dur === 2 ? 'hour' : 'hours'}`;
            }
            applyFields();
          }
          X.applyFields = applyFields;
        },
        calActions: () => (C) => {
          const { fam, ctx, commit, x } = C;
          C.name.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter') return;
            e.preventDefault();
            if (x.applyFields()) commit(fam.calendarCreate(ctx.model));
          });
          C.create.addEventListener('click', () => {
            if (x.applyFields()) commit(fam.calendarCreate(ctx.model));
          });
          C.cancel.addEventListener('click', () => {
            C.field.set(''); x.startInput.value = ''; x.durationInput.value = '';
            x.location.value = ''; x.notes.value = '';
            commit(fam.calendarCancel({ ...ctx.model, form: true }));
          });
        },
        calPaintEvent: (base) => (C, m, updateFields = true) => {
          base(C, m);
          const e = m.event;
          if (e && updateFields) {
            C.x.startInput.value = C.tl(e.start);
            C.x.durationInput.value = `${e.dur / 2} ${e.dur === 2 ? 'hour' : 'hours'}`;
          }
        },
        // Opens the day at the hours of the task.
        calReady: () => (C) => {
          const { ctx, spec, N, rows } = C;
          if (!ctx.model.event) {
            const lo = spec.mode === 'at' ? spec.start : spec.win.lo;
            const hi = spec.mode === 'at' ? spec.start + spec.dur : spec.win.hi;
            const top = Math.max(0, Math.min(N - rows, Math.min(lo, Math.max(18, Math.ceil((hi - rows) / 2) * 2))));
            ctx.update({ ...ctx.model, view: { ...ctx.model.view, top } });
          }
        },
      },
    },
  });
})();
