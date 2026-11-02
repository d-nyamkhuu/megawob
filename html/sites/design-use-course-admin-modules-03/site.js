// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const winbar = util.el('div', 'vista-titlebar', header);
      util.el('span', 'vista-appicon', winbar, '▣');
      util.el('strong', 'vista-title', winbar, 'Data Science 101');
      const wincontrols = util.el('div', 'vista-window-controls', winbar);
      for (const glyph of ['−', '□', '×']) util.el('span', 'vista-window-control', wincontrols, glyph);
      const menubar = util.el('div', 'vista-menubar', header);
      for (const item of ['File', 'Edit', 'View', 'Tools', 'Reports', 'Help']) util.el('span', 'vista-menu-item', menubar, item);
      const quickbar = util.el('div', 'vista-quickbar', header);
      for (const [icon, label] of [['▤','New Module'], ['▧','New Lesson'], ['×','Delete'], ['↑','Move Up'], ['↓','Move Down'], ['⚙','Properties']]) {
        const tool = util.el('span', 'vista-tool', quickbar);
        util.el('b', 'vista-tool-icon', tool, icon);
        util.el('span', '', tool, label);
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { header, menubar, quickbar, winbar, wincontrols });
    },
    'frame.tools': (base, S) => function (_c) {
      const header = _c.header;
      _c.header = _c.quickbar;
      base(_c);
      _c.header = header;
    },
    'frame.footer': (base, S) => function (_c) {
      base(_c);
      const status = document.querySelector('.ref-foot-text');
      if (status) status.textContent = 'All changes saved';
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const resources = util.el('section', 'ref-course-resources', body);
      util.el('div', 'ref-course-resources-title', resources, 'Course resources');
      const resourceCards = util.el('div', 'ref-course-resource-cards', resources);
      for (const [icon, title, meta] of [['▰', 'Syllabus', 'PDF'], ['▥', 'Datasets', '3 files'], ['▤', 'Reading list', '6 items']]) {
        const card = util.el('div', 'ref-course-resource', resourceCards);
        util.el('span', 'ref-course-resource-icon', card, icon);
        const copy = util.el('span', 'ref-course-resource-copy', card);
        util.el('strong', '', copy, title);
        util.el('small', '', copy, meta);
      }
      const inspector = util.el('aside', 'ref-module-inspector', body);
      util.el('h3', '', inspector, 'Module details');
      for (const [label, value] of [['Title', 'Selected module'], ['Description', 'Course content and learning objectives for this module.'], ['Lessons', '4 lessons'], ['Duration', '2 weeks'], ['Status', '●  Published']]) {
        const field = util.el('div', 'ref-inspector-field', inspector);
        util.el('span', '', field, label);
        util.el('div', 'ref-inspector-value', field, value);
      }
      Object.assign(_c, { inspector, resourceCards, resources, stage });
    },
  };

  env.site({
    name: 'design-use-course-admin-modules-03',
    template: 'site/base',
    design: { parts },
  });
})();
