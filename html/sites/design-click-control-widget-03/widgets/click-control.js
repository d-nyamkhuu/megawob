// Design of this site on the click-control/controls template (templates/click-control/controls.js): the widgets sit in four
// titled groups (user information, theme, startup, help link); only text fields keep a caption.
(function () {
  'use strict';
  let groups = {};
  env.widget({
    task: 'click-control',
    site: 'design-click-control-widget-03',
    name: 'design',
    split: 'train',
    scenarios: ['widget'],
    traits: { menuOpen: ['hover', 'click'] },
    template: 'click-control/controls',
    design: {
      parts: {
        widgetsStart: () => (ctx, card) => {
          groups = {};
          [
            ['info', 'User Information'],
            ['theme', 'Theme Style'],
            ['startup', 'Startup'],
            ['help', 'Helpful Link'],
          ].forEach(([key, title]) => {
            const group = ctx.util.el('fieldset', 'be-group group-' + key, card);
            ctx.util.el('legend', '', group, title);
            groups[key] = ctx.util.el('div', 'group-controls', group);
          });
        },
        widgetHeading: () => (ctx, row, wd) => {
          if (wd.type === 'text' || wd.type === 'textarea') {
            const heading = ctx.util.el('span', 'field-caption', row, wd.type === 'text' ? 'Name:' : 'Message:');
            row.prepend(heading);
          }
        },
        widgetPlace: () => (ctx, card, row, wd) => {
          const destination =
            wd.type === 'radio'
              ? 'theme'
              : wd.type === 'checkbox'
                ? 'startup'
                : wd.type === 'button'
                  ? 'help'
                  : groups.info.children.length < 2
                    ? 'info'
                    : 'theme';
          groups[destination].append(row);
        },
        widgetsBuilt: () => (ctx) => {
          if (!groups.help.children.length) ctx.util.el('span', 'help-caption', groups.help, 'Learn more about preferences...');
          Object.values(groups).forEach((group) => {
            group.dataset.count = String(group.children.length);
          });
        },
      },
    },
  });
})();
