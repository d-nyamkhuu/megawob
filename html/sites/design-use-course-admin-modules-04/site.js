// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const winbar = util.el('div', 'vista-titlebar', header);
      util.el('span', 'vista-appicon', winbar, '▰');
      util.el('strong', 'vista-title', winbar, 'Data Science Fundamentals');
      const wincontrols = util.el('div', 'vista-window-controls', winbar);
      for (const glyph of ['−', '□', '×']) util.el('span', 'vista-window-control', wincontrols, glyph);
      const menubar = util.el('div', 'vista-menubar', header);
      for (const [icon, item] of [['♧','Overview'], ['▦','Modules'], ['▤','Gradebook'], ['☑','Quizzes'], ['▣','Rubrics'], ['♙','Students'], ['⚙','Settings']]) {
        const tab = util.el('span', 'vista-menu-item', menubar);
        util.el('b', 'vista-tab-icon', tab, icon);
        util.el('span', '', tab, item);
        if (item === 'Modules') tab.classList.add('selected');
      }
      const quickbar = util.el('div', 'vista-quickbar', header);
      S.frameBrand(_c, header);
      Object.assign(_c, { header, menubar, quickbar, winbar, wincontrols });
    },
    'frame.tools': (base, S) => function (_c) {
      const header = _c.header;
      _c.header = _c.menubar;
      base(_c);
      _c.header = header;
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const help = util.el('aside', 'lms-help-rail', body);
      const helpBlock = (icon, title, text) => {
        const section = util.el('section', 'lms-help-block', help);
        util.el('span', 'lms-help-icon', section, icon);
        const copy = util.el('div', 'lms-help-copy', section);
        util.el('strong', '', copy, title);
        if (text) util.el('p', '', copy, text);
      };
      helpBlock('♧', 'Module Organization', 'Arrange modules to set the order they appear in the course. Select a module to view and manage its lessons.');
      helpBlock('♧', 'Tips', '•  Drag and drop modules to change the sequence.\n•  Lessons within a module follow the numbered order from the teaching outline.\n•  Use the outline as a reference for the recommended lesson sequence and titles.');
      helpBlock('▤', 'Teaching Outline', 'Each module contains the lessons shown here in order. Keep the lesson sequence within each module consistent with the outline.');
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, help, helpBlock });
    },
    'frame.panel': (base, S) => function (_c) {
      base(_c);
      const panel = _c.body.querySelector(':scope > .ref-panel');
      if (panel) _c.help.prepend(panel);
    },
  };

  env.site({
    name: 'design-use-course-admin-modules-04',
    template: 'site/base',
    design: { parts },
  });
})();
