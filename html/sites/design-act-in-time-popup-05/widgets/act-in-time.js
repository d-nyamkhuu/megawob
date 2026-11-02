// Site design on the shared act-in-time/arena template.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-popup-05',
  name: 'design',
  split: 'train',
  scenarios: ['popup'],
  template: 'act-in-time/arena',
  design: {
    loginTitle: 'Welcome to WorkHub',
    parts: {
      dialogContent: () => (ctx, box) => {
        const { util } = ctx;
        const icon = util.el('span', 'ut-update-icon', box);
        icon.innerHTML =
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="white" d="M12 22a2.3 2.3 0 0 0 2.25-2h-4.5A2.3 2.3 0 0 0 12 22Zm7-5-1.5-2v-4.5a5.5 5.5 0 0 0-4.5-5.4V4a1 1 0 0 0-2 0v1.1a5.5 5.5 0 0 0-4.5 5.4V15L5 17v1h14v-1Z"/></svg>';
        util.el('h3', '', box, 'System Update');
        util.el(
          'p',
          '',
          box,
          'A scheduled system update will occur this evening at 10:00 PM (ET). You may experience brief interruptions.',
        );
      },
      dialogButtons: () => (ctx, box, row, choice) => {
        const { util } = ctx;
        const closeX = util.el('button', 'ut-close-x', box, '×');
        closeX.type = 'button';
        closeX.setAttribute('aria-label', 'Close');
        closeX.addEventListener('click', () => choice.stay.click());
      },
      rendered: () => (ctx, f) => {
        const note = ctx.stage.parentElement.querySelector('.ds-header-note');
        const title = f.body.querySelector('.ut-login h3');
        const firstField = f.body.querySelector('.ut-field');
        if (note && title && firstField) {
          const overlap = note.getBoundingClientRect().bottom + 14 - firstField.getBoundingClientRect().top;
          if (overlap > 0)
            title.style.setProperty(
              'margin-bottom',
              parseFloat(getComputedStyle(title).marginBottom) + overlap + 'px',
              'important',
            );
          // Long report instructions must not reserve space beyond the task stage.
          // Compact only the note and its surrounding whitespace, before anchoring.
          const login = f.body.querySelector('.ut-login .ut-btn');
          const instruction = note.querySelector('.ds-instruction');
          const bottom = ctx.stage.getBoundingClientRect().top + ctx.size.height - 8;
          const overflow = () => (login ? Math.max(0, login.getBoundingClientRect().bottom - bottom) : 0);
          const alignFields = () => {
            const delta = note.getBoundingClientRect().bottom + 14 - firstField.getBoundingClientRect().top;
            title.style.setProperty(
              'margin-bottom',
              Math.max(0, parseFloat(getComputedStyle(title).marginBottom) + delta) + 'px',
              'important',
            );
          };
          if (overflow() > 0) {
            const shift = Math.min(
              overflow(),
              Math.max(0, note.getBoundingClientRect().top - title.getBoundingClientRect().bottom - 8),
            );
            note.style.top = parseFloat(getComputedStyle(note).top) - shift + 'px';
            alignFields();
            if (overflow() > 0) {
              const style = getComputedStyle(note);
              const trim = Math.min(
                overflow() / 2,
                Math.max(0, Math.min(parseFloat(style.paddingTop), parseFloat(style.paddingBottom)) - 8),
              );
              const paddingTop = parseFloat(style.paddingTop) - trim;
              const paddingBottom = parseFloat(style.paddingBottom) - trim;
              note.style.setProperty('padding-top', paddingTop + 'px', 'important');
              note.style.setProperty('padding-bottom', paddingBottom + 'px', 'important');
              alignFields();
            }
            if (instruction) {
              for (
                let size = parseFloat(getComputedStyle(instruction).fontSize) - 1;
                overflow() > 0 && size >= 14;
                size--
              ) {
                instruction.style.setProperty('font-size', size + 'px', 'important');
                alignFields();
              }
            }
          }
        }
      },
    },
  },
});
