// Design of this site on the click-control/controls template (templates/click-control/controls.js): the buttons sit under a
// printed contact form (its fields are decoration); the form's message box shrinks when the buttons need room.
env.widget({
  task: 'click-control',
  site: 'design-click-control-button-08',
  name: 'design',
  split: 'train',
  scenarios: ['button'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    helper: false,
    parts: {
      buttonHost: () => (ctx, s) => {
        const { util } = ctx;
        const note = document.querySelector('.cv-instr');
        if (note) note.dataset.long = String(note.textContent.length > 35);
        const form = util.el('div', 'cv-form', s);
        for (const [label, value, kind] of [
          ['Your name', 'Jordan Lee', 'name'],
          ['Subject', 'General inquiry', 'subject'],
          ['Message', 'I have a question about city services.', 'message'],
        ]) {
          const row = util.el('div', 'cv-field ' + kind, form);
          util.el('div', 'cv-label', row, label);
          const valueEl = util.el('div', 'cv-value', row, value);
          if (kind === 'subject') util.el('span', 'cv-chevron', valueEl);
          if (kind === 'message') util.el('span', 'cv-grip', valueEl);
        }
        return util.el('div', 'cv-actions', s);
      },
      // Preserve the printed form's proportions; reclaim only the space needed by seeded controls.
      buttonBuilt: () => (ctx, s, els, content) => {
        const actions = s.querySelector('.cv-actions');
        const overflow = actions.getBoundingClientRect().bottom - content.getBoundingClientRect().bottom + 8;
        if (overflow > 0) {
          const message = s.querySelector('.cv-form .message .cv-value');
          message.style.height = Math.max(48, message.getBoundingClientRect().height - overflow) + 'px';
        }
      },
    },
  },
});
