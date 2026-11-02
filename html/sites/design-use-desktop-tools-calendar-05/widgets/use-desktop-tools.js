// Calendar design with XP date text, scroll arrows, and an always-visible event form.
env.widget({
  task: 'use-desktop-tools',
  site: 'design-use-desktop-tools-calendar-05',
  name: 'design',
  split: 'train',
  scenarios: ['calendar'],
  template: 'use-desktop-tools/workspace',
  design: {
    calToday: true,
    agendaHidden: true,
    formAlways: true,
    formTitle: 'New event',
    namePlaceholder: '',
    createLabel: 'Create event',
    calTime12: true,
    calNavText: false,
    calRowCount: 26,
    calEventPanel: false,
    calSelectedAgenda: false,
    parts: {
      calHead: (base, S) => (C) => {
        base(C);
        const taskNote = document.querySelector('.task-note');
        if (taskNote && !taskNote.hidden) S.ctx.util.el('span', 'xp-date', taskNote, C.spec.day);
      },
      calRows: () => (C, avail) => {
        const rowH = Math.max(10, avail / 26);
        return { rowH, rows: Math.min(26, Math.floor((avail + 0.001) / rowH)) };
      },
      scrollExtra: (base) => (G, ctx) => {
        base(G, ctx);
        for (const [direction, caption] of [[-1, '⌃'], [1, '⌄']]) {
          const arrow = ctx.util.el('button', direction < 0 ? 'scroll-up' : 'scroll-down', G.sb, caption);
          arrow.type = 'button';
          arrow.setAttribute('aria-label', direction < 0 ? 'Scroll earlier' : 'Scroll later');
          arrow.addEventListener('pointerdown', (e) => e.stopPropagation());
          arrow.addEventListener('click', () => G.scrollTo(G.sc.scrollTop / G.rowH + direction * 2));
        }
      },
      calFormFields: () => (C) => {
        // This hook runs just before the template creates its default .when row.
        C.x = {};
        const when = C.x.when = C.util.el('div', 'when', C.form);
        C.util.el('em', '', when, 'Start time:');
        C.x.startValue = C.util.el('span', 'fld', when);
        C.util.el('em', '', when, 'Duration:');
        C.x.durationValue = C.util.el('span', 'fld', when);
      },
      calFormBuilt: () => (C) => {
        C.when.remove();
        C.when = C.x.when;
      },
      calEventPainted: () => (C, m, e) => {
        C.x.startValue.textContent = e ? C.tl(e.start) : '';
        C.x.durationValue.textContent = e ? `${e.dur * 30} min` : '';
      },
      calPaintEvent: (base, S) => (C, m) => {
        const e = m.event;
        C.mine.hidden = !e;
        if (e) {
          C.place(C.mine, e);
          C.mine.classList.toggle('draft', !e.saved);
          C.mine.replaceChildren();
          C.util.el('b', '', C.mine, e.name || (e.saved ? '(no title)' : 'New event'));
          if (e.dur > 1) C.util.el('span', '', C.mine, C.label(e));
        }
        S.P.calEventPainted(C, m, e);
      },
      calPaintForm: (base) => (C, m) => {
        base(C, m);
        C.name.readOnly = !m.form;
        C.create.disabled = !m.form;
        C.cancel.hidden = !m.form;
      },
    },
  },
});
