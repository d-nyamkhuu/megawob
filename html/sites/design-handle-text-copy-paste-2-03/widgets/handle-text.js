// Uses the copy-paste-2 line-height preset and retains this portal's source/answer layout.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-copy-paste-2-03',
  name: 'design',
  split: 'train',
  scenarios: ['copy-paste-2'],
  template: 'handle-text/editor',
  design: {
    parts: {
      rendered: (base, S) => (ctx, view, look, box) => {
        const end = document.querySelector('.submit');
        const answer = view.card.querySelector('.ut-fieldrow');
        if (end && answer && end.dataset.placement === 'answer') answer.append(end);

        const compact = ctx.size.height < 350;
        const sourceTop = (ctx.display === 'hidden' ||
          (ctx.display === 'panel' && ctx.size.width < 1100 && ctx.size.height >= 350)) ? 18 : 0;
        const answerHeight = compact ? 40 : 60;
        const answerTop = Math.max(sourceTop + 80, box.h - answerHeight - (compact ? 20 : 39));
        const answerHeading = compact ? 0 : 58;
        const sourceHeight = Math.max(60, Math.min(225, answerTop - answerHeading - 14 - sourceTop));
        view.card.style.setProperty('--portal-source-top', sourceTop + 'px');
        view.card.style.setProperty('--portal-source-height', sourceHeight + 'px');
        view.card.style.setProperty('--portal-answer-top', answerTop + 'px');
        view.card.classList.toggle('compact-task', compact);
        view.card.querySelectorAll('.ut-src').forEach((src, i) => {
          const b = ctx.spec.boxes[i];
          const rows = b.lines ? b.lines.length : 0;
          const available = sourceHeight - (compact ? 34 : 40) - 12;
          const rowHeight = rows ? Math.min(52, available / rows) : 52;
          const font = Math.min(compact ? 16 : 23, rows ? rowHeight * 0.82 : 23);
          src.style.setProperty('--portal-row-height', rowHeight + 'px');
          src.style.setProperty('--portal-source-font', Math.max(7, font) + 'px');
        });
      },
    },
  },
});
