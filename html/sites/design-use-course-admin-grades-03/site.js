// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const winbar = util.el('div', 'gem-titlebar', header);
      util.el('span', 'gem-appmark', winbar, '▣');
      util.el('span', 'gem-window-title', winbar, 'Course Administration - Introduction to Computing');
      const wincontrols = util.el('span', 'gem-window-controls', winbar, '▬  □  ×');
      const menubar = util.el('nav', 'gem-menubar', header);
      for (const item of ['File', 'Edit', 'View', 'Course', 'Gradebook', 'Reports', 'Window', 'Help']) util.el('span', '', menubar, item);
      const courseHead = util.el('div', 'lms-course-head', header);
      util.el('div', 'lms-course-title', courseHead, 'Introduction to Computing');
      const courseTabs = util.el('nav', 'lms-course-tabs', courseHead);
      for (const [i, tab] of ['Course Home', 'Content', 'Assignments', 'Grades', 'People', 'Settings'].entries()) {
        const a = util.el('span', `lms-course-tab${i === 3 ? ' active' : ''}`, courseTabs, tab);
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { courseHead, courseTabs, header, menubar, winbar, wincontrols });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const rail = util.el('aside', 'lms-rail', body);
      util.el('div', 'lms-mark', rail, '');
      for (const [i, item] of ['Courses', 'Students', 'Gradebook', 'Assignments', 'Quizzes', 'Modules', 'Reports'].entries()) {
        const a = util.el('div', `lms-rail-item${i === 1 ? ' active' : ''}`, rail);
        util.el('span', 'lms-rail-icon', a, ['◫','♟','▤','▧','▦','▥','▥'][i]);
        util.el('span', '', a, item);
      }
      const gemSide = util.el('aside', 'gem-side', body);
      const toolsBox = util.el('section', 'gem-course-tools', gemSide);
      util.el('h2', '', toolsBox, 'Course Tools');
      util.el('div', 'gem-course-row gem-course-name', toolsBox, '⊟　Introduction to Computing');
      for (const [i, item] of ['Roster', 'Gradebook', 'Assignments', 'Quizzes', 'Modules', 'Rubrics', 'Reports'].entries()) {
        util.el('div', `gem-course-row${i === 1 ? ' selected' : ''}`, toolsBox, `${['▤','▦','▧','▧','▥','▦','▧'][i]}　${item}`);
      }
      const helpBox = util.el('section', 'gem-help', gemSide);
      util.el('h2', '', helpBox, 'Help');
      util.el('p', '', helpBox, 'Use the gradebook fields to enter grades.');
      util.el('p', '', helpBox, 'Editable fields accept numeric values. Finalized grades are shown with a lock icon and cannot be edited.');
      util.el('p', '', helpBox, 'Only active students are included in course totals.');
      util.el('h3', '', helpBox, 'Legend');
      util.el('p', 'gem-legend', helpBox, '□　= Editable grade field\n▧　= Finalized grade (locked)\n▣　= Finalized (read-only)\n—　= No grade entered\n▰　= Inactive student');
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, gemSide, helpBox, rail, toolsBox });
    },
  };

  env.site({
    name: 'design-use-course-admin-grades-03',
    template: 'site/base',
    design: { parts },
  });
})();
