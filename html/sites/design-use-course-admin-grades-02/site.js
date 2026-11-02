// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      base(_c);
      const { util } = _c;
      const systembar = util.el('div', 'lms-systembar', document.body);
      util.el('span', 'lms-system-mark', systembar, '✦');
      util.el('strong', '', systembar, 'CIS 210 – Web Development');
      const syscontrols = util.el('div', 'lms-system-controls', systembar);
      for (const glyph of ['−', '□', '×']) util.el('span', '', syscontrols, glyph);
      Object.assign(_c, { syscontrols, systembar });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const courseHead = util.el('div', 'lms-course-head', header);
      util.el('div', 'lms-course-title', courseHead, 'CIS 210 – Web Development');
      const courseTabs = util.el('nav', 'lms-course-tabs', courseHead);
      for (const [i, tab] of ['Course Home', 'Content', 'Assignments', 'Grades', 'People', 'Settings'].entries()) {
        const a = util.el('span', `lms-course-tab${i === 3 ? ' active' : ''}`, courseTabs, tab);
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { courseHead, courseTabs, header });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      const summary = util.el('section', 'lms-summary', document.body);
      util.el('div', 'lms-course-photo', summary);
      const summaryText = util.el('div', 'lms-summary-text', summary);
      util.el('strong', '', summaryText, 'CIS 210 – Web Development');
      util.el('span', '', summaryText, 'Spring 2024');
      util.el('span', '', summaryText, 'Department of Computer Science');
      util.el('p', '', summaryText, 'Build modern, accessible web applications using HTML, CSS and JavaScript. Focus on clean design, development best practices and real-world projects.');
      const stats = util.el('div', 'lms-summary-stats', summary);
      for (const [icon, value, label] of [['♟','18','Students'],['▤','6','Assignments'],['▥','72%','Class average'],['▦','Apr 29, 2024','Last updated']]) {
        const stat = util.el('div', 'lms-stat', stats);
        util.el('span', 'lms-stat-icon', stat, icon);
        const copy = util.el('span', '', stat);
        util.el('strong', '', copy, value);
        util.el('small', '', copy, label);
      }
      Object.assign(_c, { stats, summary, summaryText });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const rail = util.el('aside', 'lms-app-rail', body);
      util.el('div', 'lms-app-mark', rail, '⌁');
      for (const [i, item] of ['Home', 'Courses', 'Calendar', 'Inbox', 'People', 'Files', 'Settings'].entries()) {
        const a = util.el('div', `lms-rail-item${i === 1 ? ' active' : ''}`, rail);
        util.el('span', 'lms-rail-icon', a, ['◆','▣','▦','✉','♟','▤','⚙'][i]);
        util.el('span', '', a, item);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, rail });
    },
  };

  env.site({
    name: 'design-use-course-admin-grades-02',
    template: 'site/base',
    design: { parts },
  });
})();
