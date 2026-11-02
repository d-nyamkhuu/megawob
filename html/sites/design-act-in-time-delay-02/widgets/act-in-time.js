// Site design on the shared act-in-time/arena template.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-delay-02',
  name: 'design',
  split: 'train',
  scenarios: ['delay'],
  template: 'act-in-time/arena',
  design: {
    parts: {
      frame: (base, S) => (ctx) => {
        const u = ctx.util;
        const arena = u.el('div', 'wc-arena', ctx.stage);
        const context = ctx.spec.context || {};
        u.el('h1', 'wc-page-title', arena, context.title || 'Plan the Team Meeting');
        u.el('p', 'wc-page-intro', arena, (context.text ? context.text + ' ' : 'Set up the next project team meeting using the details below. ') + 'When the task is ready, use the controls to continue.');
        const details = u.el('section', 'wc-meeting-details', arena);
        u.el('h2', '', details, 'Meeting Details');
        const rows = [['Topic:', 'Spring Project Update'], ['Date:', 'Tuesday, April 20, 2010'], ['Time:', '11:00 AM (30 minutes)'], ['Location:', 'Conference Room B'], ['Attendees:', 'Project Team']];
        for (const [label, value] of rows) {
          const row = u.el('div', 'wc-detail-row', details);
          u.el('span', '', row, label);
          u.el('span', '', row, value);
        }
        u.el('h2', 'wc-calendar-title', arena, 'Calendar');
        const calendar = u.el('section', 'wc-calendar', arena);
        const bar = u.el('div', 'wc-calendar-bar', calendar);
        u.el('span', 'wc-calendar-arrow', bar, '◀');
        u.el('strong', '', bar, 'Tuesday, April 20, 2010');
        u.el('span', 'wc-calendar-arrow', bar, '▶');
        const body = u.el('div', 'wc-calendar-body', calendar);
        const status = document.querySelector('.wc-status-label');
        const clock = document.querySelector('.wc-task-clock');
        return {
          arena, body, status,
          setClock: t => { clock.textContent = S.P.clockText(t); },
          setStatus: h => { status.innerHTML = h === 'Working…' ? 'Waiting for task timer…' : h; },
        };
      },
      main: (base, S) => (ctx, main) => {
        main.classList.add('wc-task-surface');
        if (ctx.spec.mode === 'interval') return;
        const u = ctx.util;
        const agenda = u.el('div', 'wc-agenda', main);
        const events = [
          ['9:00 AM', 'Design Review', '9:00 AM – 10:00 AM'],
          ['10:00 AM', 'Client Call', '10:00 AM – 10:30 AM'],
          ['11:00 AM', 'Available', ''],
          ['12:00 PM', 'Lunch', '12:00 PM – 1:00 PM'],
        ];
        events.forEach((event, i) => {
          const row = u.el('div', 'wc-agenda-row', agenda);
          u.el('span', 'wc-agenda-time', row, event[0]);
          const entry = u.el('div', 'wc-agenda-entry' + (i === 2 ? ' wc-available' : ''), row);
          u.el('strong', '', entry, event[1]);
          if (event[2]) u.el('span', '', entry, event[2]);
        });
      },
      actions: (base, S) => (ctx, card) => document.querySelector('.wc-target-slot'),
      go: (base, S) => (ctx, f, go) => { go.classList.add('wc-action'); },
      card: (base, S) => (ctx, layout) => {
        layout.card.classList.add('wc-runtime-card');
        layout.card.querySelector('h3').hidden = true;
        layout.card.querySelector('p').hidden = true;
        document.querySelector('.wc-status-copy').append(layout.state);
      },
      waitText: (base, S) => (ctx, ready) => {
        const go = ctx.spec.buttons.find(button => button.key === 'go');
        return ready ? 'The button is enabled. You may continue.' : 'The ' + (go ? go.label : 'requested') + ' button will be enabled automatically at the task time.';
      },
      delaySync: (base, S) => (ctx, layout, m, ready) => {
        const hint = document.querySelector('.wc-target-hint');
        hint.textContent = ready ? 'Ready to continue.' : 'Currently disabled.\nPlease wait.';
        const explanation = document.querySelector('.wc-note-explainer');
        if (explanation) explanation.textContent = ready ? 'The button is now enabled on the task clock. You may click it to continue.' : 'The ' + layout.go.textContent + ' button will become enabled when the task clock reaches the required time. It is currently disabled. Please wait.';
      },
      interval: (base, S) => (ctx, layout) => {
        layout.main.classList.add('wc-interval');
        for (const button of layout.els) button.classList.add('wc-interval-button');
        const hint = document.querySelector('.wc-target-hint');
        hint.textContent = 'Use the labeled controls\nin the calendar.';
        const statusCopy = document.querySelector('.wc-status-copy');
        ctx.util.el('p', 'wc-interval-note', statusCopy, 'Follow the requested order and timing on the task clock.');
        document.querySelector('.ds-wait-hint').textContent = 'Note: Each press is recorded on the task clock. Follow the requested timing.';
        const explanation = document.querySelector('.wc-note-explainer');
        if (explanation) explanation.textContent = 'Follow the task clock and use the labeled controls in the calendar. Each press is recorded at the current task time.';
      },
    },
  },
});
