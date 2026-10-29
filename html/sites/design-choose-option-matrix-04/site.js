// Design on templates/site/form-pick-autocomplete-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-choose-option-matrix-04',
    styles: ['site.css'],
    scripts: [],
    template: 'site/choose-option-autocomplete-01',
    design: {
      C: {
        site: 'design-choose-option-matrix-04',
        brand: 'Calendar - Sunbird',
        title: 'Availability Preferences',
        instruction: 'top',
        rail: '',
        menu: 'File|Edit|View|Go|Tools|Help',
        briefTitle: 'Instructions',
      },
      parts: {
        'frame.5': (base, S) =>
          function (_c) {
            const { u } = _c;
            const app = u.el('div', 'qt-window', document.body);
            const top = u.el('header', 'ds-top', app);
            u.el('span', 'qt-app-icon', top, '◉');
            Object.assign(_c, { app, top });
          },
        'frame.7': (base, S) =>
          function (_c) {
            const { C } = S;
            const { app, top, u } = _c;
            u.el('span', 'qt-window-controls', top, '−　□　×');
            if (C.menu) {
              const nav = u.el('nav', 'ds-menu', app);
              C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
            }
            const toolbar = u.el('div', 'qt-toolbar', app);
            [
              ['▧', 'New Event'],
              ['▤', 'New Task'],
              ['✎', 'Edit'],
              ['▤', 'Delete'],
              ['▦', 'Day'],
              ['▦', 'Week'],
              ['▦', 'Month'],
            ].forEach((x, i) => {
              if (i === 2 || i === 4) u.el('i', 'qt-tool-sep', toolbar);
              const b = u.el('button', 'qt-tool', toolbar);
              b.type = 'button';
              u.el('b', '', b, x[0]);
              u.el('span', '', b, x[1]);
            });
            const body = u.el('div', 'ds-body', app),
              width = window.innerWidth,
              height = window.innerHeight;
            const contentRoot = u.el('div', 'ds-content', body);
            Object.assign(_c, { body, contentRoot, height, toolbar, width });
          },
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.11': () => () => {},
        'frame.18': (base, S) =>
          function (_c) {
            const { main, u } = _c;
            const left = u.el('aside', 'qt-left', main);
            u.el('h2', 'qt-pane-title', left, 'Calendars');
            [
              ['#4c9df5', 'My Calendar'],
              ['#72b85c', 'Friends'],
              ['#4c9df5', 'Work'],
              ['#ffa13b', 'Holidays'],
            ].forEach((x, i) => {
              const row = u.el('div', 'qt-cal-row' + (i === 0 ? ' selected' : ''), left);
              u.el('span', 'qt-check', row, '☑');
              const dot = u.el('i', 'qt-color', row);
              dot.style.background = x[0];
              u.el('span', '', row, x[1]);
            });
            const mini = u.el('section', 'qt-mini', left);
            u.el('div', 'qt-month', mini, '◀　　April 2005　　▶');
            u.el('div', 'qt-weekdays', mini, 'Sun　Mon　Tue　Wed　Thu　Fri　Sat');
            u.el(
              'div',
              'qt-days',
              mini,
              '27　28　29　30　 1　 2\n 3　 4　 5　 6　 7　 8　 9\n10　11　12　13　14　15　16\n17　18　19　20　21　22　23\n24　25　26　27　28　29　30',
            );
            const events = u.el('section', 'qt-events', left);
            u.el('h2', 'qt-pane-title', events, 'Events');
            [
              ['#4c9df5', 'Team Meeting', 'Tue 10:00 AM'],
              ['#72b85c', 'Coffee with Sam', 'Tue 1:00 PM'],
              ['#4c9df5', 'Project Review', 'Wed 9:00 AM'],
              ['#ffa13b', 'Dentist', 'Thu 11:00 AM'],
            ].forEach((x) => {
              const row = u.el('div', 'qt-event', events);
              const dot = u.el('i', 'qt-color', row);
              dot.style.background = x[0];
              u.el('span', '', row, x[1]);
              u.el('small', '', row, x[2]);
            });
            const stage = u.el('main', 'ds-stage', main);
            u.el('div', 'qt-sheet-head', stage, 'Availability Preferences');
            const inspector = u.el('aside', 'qt-inspector', main);
            u.el('h2', 'qt-pane-title', inspector, 'Properties');
            [
              ['Calendar', 'Name:　My Calendar', 'Color:　■', 'Show in view:　☑'],
              ['Reminders', '☑　Show reminders', 'Default reminder:　15 minutes'],
              ['Time Zone', 'Time zone:　(GMT-08:00) Pacific Time (US & Canada)', '☐　Show a second time zone'],
            ].forEach((group) => {
              const sec = u.el('section', 'qt-property', inspector);
              u.el('h3', '', sec, '▾　' + group[0]);
              group.slice(1).forEach((t) => u.el('div', 'qt-property-row', sec, t));
            });
            Object.assign(_c, { events, inspector, left, mini, stage });
          },
        'frame.19': () => () => {},
        'frame.20': () => () => {},
        'frame.21': () => () => {},
        'frame.22': () => () => {},
        'frame.23': () => () => {},
        'frame.29': (base, S) =>
          function (_c) {
            const { ctx, endRng, labels } = _c;
            if (!ctx.finish) {
              if (endRng.bool(0.5)) {
                _c.placement = 'header';
                _c.label = 'Apply';
              } else {
                _c.placement = endRng.pick(['footer', 'link', 'header']);
                const alternatives = labels.filter((x) => x.trim().toLowerCase() !== 'submit');
                _c.label = alternatives.length ? endRng.pick(alternatives) : 'Done';
              }
            }
          },
        'frame.34': (base, S) =>
          function (_c) {
            const { app, u } = _c;
            const foot = u.el('footer', 'ds-footer', app);
            Object.assign(_c, { foot });
          },
        'frame.35': () => () => {},
        'frame.36': () => () => {},
        'frame.38': (base, S) =>
          function (_c) {
            const { ctx, decoyBtn, endBtn, foot, toolbar } = _c;
            if (!ctx.finish) {
              if (_c.placement === 'header') {
                let tools = toolbar;
                if (_c.collide && _c.collide.where === 'header') decoyBtn(tools, _c.collide.text, true);
                _c.submit = endBtn(tools, 'ds-submit ds-submit-head', _c.label);
              } else {
                if (_c.collide && _c.collide.where === 'header') decoyBtn(toolbar, _c.collide.text, true);
                if (_c.collide && _c.collide.where === 'footer') decoyBtn(foot, _c.collide.text, true);
                _c.submit =
                  _c.placement === 'link'
                    ? endBtn(foot, 'ds-endlink', `${_c.label} ›`)
                    : endBtn(foot, 'ds-submit', _c.label);
              }
            }
          },
      },
    },
  });
})();
