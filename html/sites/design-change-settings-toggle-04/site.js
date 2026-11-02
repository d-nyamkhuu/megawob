// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  env.site({
    name: 'design-change-settings-toggle-04',
    template: 'site/base',
    design: {
      parts: {
        'frame.body': (base) => function (c) {
          base(c);
          const rail = c.util.el('aside', 'everyday-rail');
          c.body.prepend(rail);
          for (const label of ['⌂   Home', '🛒   Shopping', '▦   Calendar', '☑   Tasks', '▥   Reports', '⚙   Preferences']) {
            c.util.el('div', 'everyday-rail-item', rail, label);
          }
          // Keep the seeded navigation and sidebar links in the app's rail.
          const nav = c.header.querySelector('.ref-nav');
          const side = c.body.querySelector('.ref-side');
          if (nav) rail.append(nav);
          if (side) rail.append(side);
        },
        'frame.stage': (base) => function (c) {
          base(c);
          const help = c.util.el('aside', 'everyday-help', c.body);
          c.util.el('h2', 'everyday-help-title', help, '💡  About these settings');
          c.util.el('p', 'everyday-help-copy', help, 'Use these preferences to customize how Everyday works for you. Your changes are saved to this device and apply the next time you use the app.');
          c.util.el('h3', 'everyday-help-tips', help, 'Tips');
          for (const tip of ['⌕   Use the search field to quickly find a setting.', '☷   Some settings show additional options when turned on.', 'ⓘ   Settings are grouped by topic to make them easier to find.']) {
            c.util.el('p', 'everyday-help-copy', help, tip);
          }
        },
      },
    },
  });
})();
