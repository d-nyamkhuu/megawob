// Keeps the task form's Notes context, calendar glyph, input example, and stage fitting.
(function () {
  'use strict';

  const CALENDAR_ICON = '<svg viewBox="0 0 34 36" aria-hidden="true"><rect x="4" y="7" width="25" height="24" rx="2" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M10 3v8m13-8v8M5 13h23" stroke="currentColor" stroke-width="3"/><path d="M9 17h3v3H9zm6 0h3v3h-3zm6 0h3v3h-3zM9 23h3v3H9zm6 0h3v3h-3zm6 0h3v3h-3z" fill="currentColor"/></svg>';

  env.widget({
    task: 'set-date',
    site: 'design-set-date-typed-04',
    name: 'design',
    split: 'train',
    scenarios: ['typed'],
    traits: { sceneRows: 1 },
    template: 'set-date/calendar',
    design: {
      title: 'Project Task',
      typedContext: null,
      fit: 'stage',
      calendarIcon: CALENDAR_ICON,
      parts: {
        typedBefore: (base, S) => (ctx) => {
          const { util } = ctx;
          const context = util.el('div', 'fd-context', S.card);
          const label = util.el('label', '', context, 'Notes ');
          util.el('i', '', label, '(optional)');
          util.el('div', 'fd-description', context, 'Add any details here...');
        },
        textCreated: (base, S) => (ctx, row, help, shown) => {
          const icon = ctx.util.el('span', 'fd-calbtn', row);
          icon.innerHTML = S.D.calendarIcon;
          const sampleParts = { YYYY: '2027', YY: '27', MM: '07', DD: '29' };
          ctx.util.el('span', 'fd-example', help, 'e.g. ' + shown.replace(/YYYY|YY|MM|DD/g, (token) => sampleParts[token]));
        },
      },
    },
  });
})();
