// Calendar workspace design: full-stage notebook frame, persistent event form, and the folded tools illustration.
(function () {
  'use strict';

  let designCtx = null;
  let designOpen = false;
  let designReveal = null;
  let designFocus = null;

  const ART = `<svg viewBox="0 0 300 390" aria-hidden="true"><path d="M73 96L271 68V338L74 363Z" fill="#000" stroke="#000" stroke-width="7" stroke-linejoin="round"/><path d="M51 75L262 49L253 311L52 340Z" fill="#ffe357" stroke="#000" stroke-width="7" stroke-linejoin="round"/><path d="M33 61L246 25L226 297L8 330Z" fill="#ffe357" stroke="#000" stroke-width="7" stroke-linejoin="round"/><g fill="none" stroke="#000" stroke-width="8" stroke-linejoin="round"><path d="M76 76V25L96 21V71Z M130 65V15L149 11V61Z M186 55V5L206 1V51Z"/></g><g transform="translate(58 146) rotate(-6)" fill="#000" font-family="monospace" font-size="43" font-weight="800"><text y="0">SMALL</text><text y="47">STEPS</text><text y="94">BIG</text><text y="141">DAYS</text></g></svg>`;

  const DESIGN_CSS = `
.at-win{left:0!important;top:0!important;width:100%!important;height:100%!important;border:0;border-radius:0;box-shadow:none}
.at-title{height:30px;border-radius:0;background:#ededeb;font-size:14px}
.at-rail{display:none}.at-body{flex:1;min-height:0}.at-main{min-width:0}`;

  function reveal(ctx) {
    designCtx = ctx;
    designOpen = !!ctx.model.designOpen || !!ctx.model.form;
    ctx.stage.classList.toggle('design-collapsed', !designOpen);
    designReveal = ctx.util.el('button', 'design-reveal', ctx.stage, 'Expand tools');
    designReveal.type = 'button';
    designReveal.hidden = designOpen;
    designReveal.addEventListener('click', () => {
      designOpen = true;
      ctx.stage.classList.remove('design-collapsed');
      designReveal.hidden = true;
      ctx.update({ ...ctx.model, designOpen: true });
      if (designFocus) {
        const input = ctx.stage.querySelector(designFocus);
        if (input) input.focus({ preventScroll: true });
      }
    });
  }

  function locateReveal(t) {
    if (designOpen || !designReveal || !(t.field || t.form)) return null;
    designFocus = 'input[placeholder="Event name"]';
    return env.util.center(designReveal);
  }

  env.widget({
    task: 'use-desktop-tools',
    site: 'design-use-desktop-tools-calendar-12',
    name: 'design',
    split: 'train',
    scenarios: ['calendar'],
    template: 'use-desktop-tools/workspace',
    design: {
      css: DESIGN_CSS,
      siteCssLast: true,
      formAlways: true,
      formTitle: 'New Event',
      createLabel: 'Create event',
      namePlaceholder: 'Event name',
      calToday: true,
      calTime12: false,
      calNavText: false,
      calRowCount: null,
      calEventPanel: false,
      calSelectedAgenda: false,
      agendaHidden: true,
      parts: {
        frame: (base) => (ctx) => {
          const { util } = ctx;
          const win = util.el('section', 'at-win', ctx.stage);
          const title = util.el('div', 'at-title', win);
          util.el('b', '', title, 'Notebook');
          const body = util.el('div', 'at-body', win);
          const main = util.el('div', 'at-main', body);
          const gear = util.el('button', '', title);
          gear.hidden = true;
          return { win, title, main, gear, appMenu: null };
        },
        calTimeLabel: () => (C, i) => C.fam.timeLabel(i, C.spec.h24),
        calHead: () => (C) => {
          const { util, spec, head } = C;
          util.el('span', 'today', head, 'Today');
          util.el('span', 'nav', head).innerHTML = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3.5L5.5 8 10 12.5"/></svg>';
          util.el('span', 'nav', head).innerHTML = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5L10.5 8 6 12.5"/></svg>';
          util.el('h3', '', head, spec.day);
          util.el('span', 'chip', head, 'Day');
        },
        calStart: () => (C) => {
          const timer = C.util.el('div', 'calendar-timer', document.querySelector('.design-header'));
          C.util.el('b', '', timer, 'TASK TIMER');
          C.util.el('strong', '', timer, 'PAUSED');
          C.util.el('p', '', timer, 'Starts after\nyou expand tools');
        },
        calRows: () => (C, avail) => {
          const rowH = Math.max(20, Math.floor(avail / 17));
          return { rowH, rows: Math.floor(avail / rowH) };
        },
        calEvent: (base) => (C, event) => {
          base(C, event);
          if (event.dur === 1) C.col.lastElementChild.classList.add('short');
        },
        calSide: () => (C) => {
          const { util, side, spec } = C;
          util.el('h4', '', side, 'Agenda').hidden = true;
          const art = util.el('div', 'calendar-art', side);
          art.innerHTML = ART;
          const agenda = C.agenda = util.el('div', 'at-agenda', side);
          agenda.hidden = true;
          C.hint = util.el('div', 'at-hint', side,
            'Drag across the time slots to add an event. Scroll the day to see more hours.');
          C.form = util.el('div', 'at-form', side);
          util.el('h4', '', C.form, 'New Event');
          util.el('label', 'calendar-label', C.form, 'Title');
          C.name = util.el('input', '', C.form);
          C.name.type = 'text';
          C.name.placeholder = 'Event name';

          const dateLabel = util.el('label', 'calendar-label', C.form, 'Date');
          util.el('div', 'calendar-readout', C.form, spec.day);
          const timeFields = util.el('div', 'calendar-time-fields', C.form);
          const startLabel = util.el('label', 'calendar-label', timeFields, 'Start');
          C.x = { selectedStart: 24, selectedDuration: 1, activeTime: null };
          C.x.startButton = util.el('button', 'calendar-readout', startLabel, '12:00 PM');
          C.x.startButton.type = 'button';
          const durationLabel = util.el('label', 'calendar-label', timeFields, 'Duration');
          C.x.durationButton = util.el('button', 'calendar-readout', durationLabel, '30 minutes');
          C.x.durationButton.type = 'button';
          C.x.timePop = util.el('div', 'calendar-picker', C.form);
          C.x.timePop.hidden = true;
          C.when = util.el('div', 'when', C.form);
          C.row = util.el('div', 'row', C.form);
          C.cancel = util.el('button', 'at-btn', C.row, 'Cancel');
          C.cancel.type = 'button';
          C.create = util.el('button', 'at-btn pri', C.row, 'Create event');
          C.create.type = 'button';
        },
        calActions: () => (C) => {
          const { util, fam, ctx, commit, x } = C;
          const paint = (m) => C.paint(m);
          const timeMenu = (kind) => {
            x.activeTime = kind;
            x.timePop.replaceChildren();
            const choices = kind === 'start' ? Array.from({ length: C.N }, (_, i) => i) : [1, 2, 3, 4, 6, 8];
            for (const value of choices) {
              const option = util.el('button', '', x.timePop,
                kind === 'start' ? C.tl(value) : `${value * 30} minutes`);
              option.type = 'button';
              option.addEventListener('click', () => {
                if (kind === 'start') x.selectedStart = value;
                else x.selectedDuration = value;
                x.selectedStart = Math.min(x.selectedStart, C.N - x.selectedDuration);
                const old = ctx.model.event;
                let m = fam.calendarDrag(ctx.model, x.selectedStart, x.selectedStart + x.selectedDuration - 1);
                m = { ...m, form: true, event: { ...m.event, name: old ? old.name : '' } };
                ctx.update(m);
                x.timePop.hidden = true;
                paint(m);
              });
            }
            x.timePop.hidden = false;
          };
          x.startButton.addEventListener('click', () => timeMenu('start'));
          x.durationButton.addEventListener('click', () => timeMenu('duration'));
          C.name.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter') return;
            e.preventDefault();
            commit(fam.calendarCreate(ctx.model));
          });
          C.create.addEventListener('click', () => commit(fam.calendarCreate(ctx.model)));
          C.cancel.addEventListener('click', () => commit(fam.calendarCancel(ctx.model)));
        },
        calEventPainted: () => (C, m, event) => {
          if (!event) return;
          C.x.startButton.textContent = C.tl(event.start);
          C.x.durationButton.textContent = `${event.dur * 30} minutes`;
          C.x.selectedStart = event.start;
          C.x.selectedDuration = event.dur;
        },
        calPaintForm: () => (C, m) => {
          if (m.form && designCtx === C.ctx && designReveal) {
            designOpen = true;
            C.ctx.stage.classList.remove('design-collapsed');
            designReveal.hidden = true;
          }
          C.form.hidden = false;
          C.hint.hidden = true;
          if (m.form && C.field.get() !== (m.event ? m.event.name : '')) C.field.set(m.event ? m.event.name : '');
        },
        rendered: () => (ctx) => reveal(ctx),
        locateFirst: () => locateReveal,
      },
    },
  });
})();
