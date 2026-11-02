// Design on templates/set-date/base.js with a picker that fits below the week field.
env.widget({
  task: 'set-date',
  site: 'design-set-date-week-04',
  name: 'design',
  split: 'train',
  scenarios: ['week'],
  template: 'set-date/base',
  design: {
    parts: {
      ensureStyle: (base) => function () {
        base();
        if (document.getElementById('nb-picker-style')) return;
        const style = document.createElement('style');
        style.id = 'nb-picker-style';
        style.textContent = `
        /* Keep the calendar inside the space below the week field. */
        .fd-pop.nb-compact-picker { padding: 6px; }
        .nb-compact-picker .fd-head { height: 28px; }
        .nb-compact-picker .fd-nav,
        .nb-compact-picker .fd-navgap { width: 24px; height: 24px; }
        .nb-compact-picker .fd-menu { top: 28px; }
        `;
        document.head.append(style);
      },
      sizePop: (base, S) => function (width, height) {
        const { control, pop, geo, ctxRef, spec } = S;
        const top = control.offsetTop + control.offsetHeight + 6;
        const room = ctxRef.size.height - top - 2;
        if (height > room) {
          pop.classList.add('nb-compact-picker');
          const fixed = 12 + 28 + 26 + (spec.todayBtn ? 42 : 0);
          geo.cell = Math.min(geo.cell, Math.floor((room - fixed) / 6));
          pop.style.setProperty('--cell', geo.cell + 'px');
          height = fixed + 6 * geo.cell;
        }
        Object.assign(pop.style, {
          left: control.offsetLeft + 'px',
          top: top + 'px',
          width: width + 'px',
          height: height + 'px',
        });
        return top + height;
      },
    },
  },
});
