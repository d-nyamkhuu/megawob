// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const help = util.el('aside', 'ref-help', body);
      const panel = body.querySelector('.ref-panel');
      if (panel) help.appendChild(panel);
      const section = (title, copy, bullets) => {
        const part = util.el('section', 'ref-help-section', help);
        util.el('h2', '', part, title);
        if (copy) util.el('p', '', part, copy);
        if (bullets) {
          const list = util.el('ul', '', part);
          for (const item of bullets) util.el('li', '', list, item);
        }
      };
      section('About Order Settings', 'Choose which columns appear in order lists and reports. You can add or remove columns to match your work.');
      section('Column details', 'Each column shows a sample value and its data type. Move columns to the right to include them in the order list.');
      section('Ways to move items', '', ['Select one or more items and click an arrow button.', 'Double-click an item.', 'Drag an item to the other list.', 'Use Ctrl+click to select multiple items.', 'Use Shift+click to select a range.']);
      section('Visible columns', 'The columns you select will appear in order lists and reports in the same order as shown in the Selected list.');
      Object.assign(_c, { help, section, stage });
    },
  };

  env.site({
    name: 'design-transfer-items-rangemix-03',
    template: 'site/base',
    design: { parts },
  });
})();
