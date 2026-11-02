// Preserve this site's header-note docking space while using the shared copy-paste-2 layout.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-copy-paste-2-05',
  name: 'design',
  split: 'train',
  scenarios: ['copy-paste-2'],
  template: 'handle-text/editor',
  design: {
    parts: {
      rendered: () => (ctx, view) => {
        const end = document.querySelector('.submit');
        const answer = view.card.querySelector('.ut-fieldrow');
        if (end && answer) answer.append(end);
        const taskNote = document.querySelector('.instruction');
        if (answer && taskNote && !taskNote.hidden && taskNote.dataset.display === 'header') {
          answer.classList.add('has-instruction');
          answer.insertBefore(taskNote, answer.firstChild);
          view.card.style.setProperty('--news-note-space', taskNote.getBoundingClientRect().height + 23 + 'px');
        }
      },
    },
  },
});
