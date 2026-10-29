// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const winbar = util.el('div', 'beos-titlebar', header);
      util.el('span', 'beos-app-icon', winbar, '▤');
      util.el('strong', 'beos-title', winbar, 'Ridgeview High — Course Manager');
      util.el('span', 'beos-window-buttons', winbar, '−   ▣   ×');
      S.frameBrand(_c, header);
      Object.assign(_c, { header, winbar });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const menu = util.el('div', 'beos-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Tools', 'Help']) util.el('span', '', menu, item);
      const tabs = util.el('nav', 'beos-tabs', document.body);
      for (const item of ['Overview', 'Students', 'Gradebook', 'Assignments', 'Quizzes', 'Modules', 'Rubrics', 'Reports']) {
        const t = util.el('span', item === 'Assignments' ? 'active' : '', tabs, item);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, menu, tabs });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      const course = util.el('aside', 'beos-course', body);
      util.el('strong', 'beos-side-head', course, 'Course');
      util.el('div', 'beos-course-current', course, '▾  English 10');
      for (const item of ['⌂  Home', '▤  Syllabus', '▧  Assignments', '▣  Resources', '▧  Discussions']) util.el('div', 'beos-course-link', course, item);
      util.el('strong', 'beos-side-head beos-students-head', course, 'Students');
      for (const item of ['Avery Chen', 'Brandon Cruz', 'Diego Herrera', 'Elena Park', 'Jason Lee', 'Maya Patel', 'Noah Kim', 'Sofía Vo', 'Tyler Brooks', 'Vanessa Garcia']) {
        util.el('div', item === 'Sofía Vo' ? 'beos-student selected' : 'beos-student', course, item);
      }
      const summary = util.el('aside', 'beos-summary', body);
      util.el('strong', 'beos-side-head', summary, 'Assignment Details');
      util.el('div', 'beos-summary-title', summary, 'Research Essay');
      for (const [k,v] of [['Type:', 'Essay'], ['Due:', 'May 10, 2024'], ['Points:', '100'], ['Rubric:', '5 criteria']]) {
        const line = util.el('div', 'beos-summary-line', summary); util.el('span', '', line, k); util.el('span', '', line, v);
      }
      util.el('strong', 'beos-side-head beos-summary-head', summary, 'Class Progress');
      for (const [k,v] of [['Graded:', '14'], ['Remaining:', '10'], ['Total:', '24']]) {
        const line = util.el('div', 'beos-summary-line', summary); util.el('span', '', line, k); util.el('span', '', line, v);
      }
      util.el('div', 'beos-progress', summary, '58%');
      util.el('strong', 'beos-side-head beos-summary-head', summary, 'Rubric Averages');
      for (const [k,v] of [['Class average:', '76%'], ['High score:', '100%'], ['Low score:', '52%']]) {
        const line = util.el('div', 'beos-summary-line', summary); util.el('span', '', line, k); util.el('span', '', line, v);
      }
      S.frameAlign(_c, stage);
      Object.assign(_c, { course, stage, summary });
    },
  };

  env.site({
    name: 'design-use-course-admin-rubric-03',
    template: 'site/base',
    design: { parts },
  });
})();
