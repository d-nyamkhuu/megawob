// Design on templates/use-desktop-tools/base.js: the base site's use-desktop-tools widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'use-desktop-tools',
  site: 'design-use-desktop-tools-week-02',
  name: 'design',
  split: 'train',
  scenarios: ['week'],
  template: 'use-desktop-tools/base',
  design: {
    parts: {
      buildWeek: (base) => function (ctx, main) {
        const result = base(ctx, main);
        const month = String(ctx.spec.month || '').slice(0, 3);
        main.querySelectorAll('.at-wdays > div:not(.g):not(.s)').forEach((day) => {
          const date = day.querySelector('b');
          if (date && month) date.textContent = month + ' ' + date.textContent;
        });
        main.querySelectorAll('.at-gut span').forEach((label) => {
          const match = label.textContent.trim().match(/^(\d{1,2})(AM|PM)$/i);
          if (match) label.textContent = match[1] + ':00 ' + match[2].toUpperCase();
        });
        return result;
      }
    }
  },
});
