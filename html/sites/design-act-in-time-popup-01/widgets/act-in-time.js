// Responsive login-card and floating-instruction fitting for the IRIX design.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-popup-01',
  name: 'design',
  split: 'train',
  scenarios: ['popup'],
  template: 'act-in-time/arena',
  design: {
    parts: {
      loginSync: () => {
        let subtitle;
        let subtitleSpace;
        let instructionNote;
        let instructionText;
        let floatingInstruction;
        let instructionTop;
        let instructionFont;

        return (ctx, layout) => {
          const { main, card, userEl } = layout;
          const currentSubtitle = card.querySelector('.ds-login-subtitle');
          if (currentSubtitle !== subtitle) {
            subtitle = currentSubtitle;
            subtitleSpace = parseFloat(getComputedStyle(subtitle).marginBottom) || 0;
            instructionNote = document.querySelector('.ds-header-note');
            instructionText = instructionNote && instructionNote.querySelector('.ds-instruction');
            floatingInstruction = instructionNote && getComputedStyle(instructionNote).position === 'absolute';
            instructionTop = floatingInstruction ? parseFloat(getComputedStyle(instructionNote).top) : 0;
            instructionFont = instructionText ? parseFloat(getComputedStyle(instructionText).fontSize) : 0;
          }

          // Keep the reference's generous spacing whenever it fits. A wrapped title,
          // feedback, or a smaller stage must not put Log in beneath the end control.
          subtitle.style.setProperty('margin-bottom', `${subtitleSpace}px`, 'important');
          const overflow = card.getBoundingClientRect().bottom - main.getBoundingClientRect().bottom + 12;
          if (overflow > 0)
            subtitle.style.setProperty('margin-bottom', `${Math.max(0, subtitleSpace - overflow)}px`, 'important');

          // Compact only a floating note that would overlap the login fields.
          if (floatingInstruction && instructionText) {
            instructionNote.style.top = `${instructionTop}px`;
            instructionNote.style.maxHeight = '';
            instructionText.style.fontSize = `${instructionFont}px`;
            const bottom = userEl.parentElement.getBoundingClientRect().top - 12;
            const top = subtitle.getBoundingClientRect().bottom + 12;
            const available = Math.max(0, bottom - top);
            if (instructionNote.getBoundingClientRect().bottom > bottom) {
              let fontSize = instructionFont;
              while (instructionNote.getBoundingClientRect().height > available && fontSize > 12) {
                instructionText.style.fontSize = `${--fontSize}px`;
              }
              instructionNote.style.maxHeight = `${available}px`;
              instructionNote.style.overflow = 'auto';
              const bounds = instructionNote.getBoundingClientRect();
              instructionNote.style.top = `${instructionTop + Math.max(top, bottom - bounds.height) - bounds.top}px`;
            }
          }
        };
      },
    },
  },
});
