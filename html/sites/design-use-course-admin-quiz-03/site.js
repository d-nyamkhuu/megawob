// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.layout': (base, S) => function (_c) {
      base(_c);
      // The campus header needs more room than the reference frame. Keep
      // compact windows' toast instructions in the existing header slot.
      if (_c.display === 'toast' && _c.H < 800) {
        _c.display = 'header';
        document.body.classList.remove('ref-has-note');
      }
    },
    'frame.placement': (base, S) => function (_c) {
      const { content, ctx, local, lr, rng, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = false;
      const nav = false;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      header.classList.add('portal-header');
      {
        const brand = util.el('div', 'ref-brand', header, 'Rivermere College');
        brand.dataset.role = 'brand';
        util.el('div', 'brand-subtitle', header, 'Learning Management System');
        util.el('div', 'portal-search', header, '⌕　 Search courses, students, resources...');
      }
      Object.assign(_c, { header });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      util.el('div', 'portal-course', header, '');
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const courseband = util.el('section', 'course-band', document.body);
      body.before(courseband);
      util.el('div', 'course-photo', courseband, '');
      const coursehead = util.el('div', 'course-heading', courseband);
      util.el('div', 'course-code', coursehead, 'HIS 101');
      util.el('div', 'course-name', coursehead, 'World History');
      const tabs = util.el('nav', 'course-tabs', coursehead);
      for (const [i, item] of ['Home', 'Modules', 'Quizzes', 'Gradebook', 'Students', 'Reports'].entries()) {
        const tab = util.el('span', `course-tab${i === 2 ? ' selected' : ''}`, tabs, item);
      }
      const coursefacts = util.el('div', 'course-facts', courseband);
      util.el('div', '', coursefacts, 'Term　　　　　　　　 Spring 2026');
      util.el('div', '', coursefacts, 'Course Code　　　　 HIS 101');
      util.el('div', '', coursefacts, 'Enrolled Students　　 28');
      S.frameSidebar(_c, body);
      const courseTree = util.el('aside', 'course-tree', body);
      util.el('h2', '', courseTree, 'Course Content');
      const treeGroup = (icon, label, active = false) => {
        const row = util.el('div', `tree-row${active ? ' current' : ''}`, courseTree);
        util.el('span', `tree-icon ${icon}`, row);
        util.el('span', '', row, label);
        return row;
      };
      treeGroup('folder', 'Modules');
      for (let i = 1; i <= 5; i++) treeGroup('file', `Module ${i}`);
      treeGroup('quiz', 'Quizzes', true);
      for (const item of ['Quiz 1', 'Quiz 2', 'Midterm Review', 'Final Quiz']) treeGroup('file', item);
      treeGroup('folder', 'Assignments');
      treeGroup('chat', 'Discussions');
      treeGroup('file', 'Resources');
      Object.assign(_c, { body, courseTree, courseband, coursefacts, coursehead, tabs, treeGroup });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      stage.classList.add('portal-stage');
      stage.style.justifyContent = 'stretch';
      stage.style.alignItems = 'stretch';
      Object.assign(_c, { stage });
    },
  };

  env.site({
    name: 'design-use-course-admin-quiz-03',
    template: 'site/base',
    design: { parts },
  });
})();
