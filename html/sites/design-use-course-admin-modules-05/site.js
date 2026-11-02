// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base) => function (ctx) {
      const result = base(ctx);
      if (ctx.kind === 'banner') {
        const header = document.querySelector('.ref-task');
        header.insertBefore(result.el, header.querySelector('.course-overview'));
        result.el.classList.add('academic-announcement');
      }
      return result;
    },
    'frame.toast': (base) => function (_c) {
      base(_c);
      // The note occupies a flex row here, so the fixed-note reservation is redundant.
      document.body.classList.remove('ref-has-note');
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const winbar = util.el('div', 'vista-titlebar', header);
      const collegeBrand = util.el('div', 'college-brand', winbar);
      const crest = util.el('span', 'college-crest', collegeBrand);
      const shield = util.svg('svg', {viewBox:'0 0 50 64', fill:'none', stroke:'#111', 'stroke-width':2.5}, crest);
      util.svg('path', {d:'M3 3h44v27c0 16-10 25-22 31C12 55 3 46 3 30zM25 3v57M4 30h42'}, shield);
      for (const [x,y] of [[14,17],[36,17],[14,42],[36,42]]) {
        util.svg('path', {d:`M${x} ${y-8}v16M${x-6} ${y-2}h12M${x-4} ${y+6}l4-4 4 4`, 'stroke-width':3}, shield);
      }
      const brandWords = util.el('span', 'college-name', collegeBrand);
      util.el('b', '', brandWords, 'Rivermere College');
      util.el('span', '', brandWords, 'Course Management');
      const courseHeading = util.el('div', 'course-heading', winbar);
      util.el('b', '', courseHeading, 'Art History 101');
      util.el('span', '', courseHeading, 'Fall 1995');
      const quickbar = util.el('div', 'vista-quickbar', header);
      const menubar = util.el('div', 'vista-menubar', header);
      S.frameBrand(_c, header);
      const overview = util.el('section', 'course-overview', header);
      util.el('div', 'course-photo', overview, '♜');
      const details = util.el('div', 'course-details', overview);
      util.el('h2', '', details, 'Course Overview');
      util.el('p', '', details, 'An introduction to the visual arts, with a focus on close looking, historical context, and the role of objects in human experience.');
      const facts = util.el('div', 'course-facts', details);
      for (const [label, value] of [['Instructor:', 'Dr. Elaine Porter'], ['Term:', 'Fall 1995'], ['Enrolled Students:', '24']]) {
        util.el('b', '', facts, label); util.el('span', '', facts, value);
      }
      const tools = util.el('section', 'course-tools', overview);
      util.el('h2', '', tools, 'Course Tools');
      const links = util.el('ul', '', tools);
      for (const label of ['Gradebook', 'Quiz Builder', 'Module Organizer', 'Assessment Rubric']) {
        const li = util.el('li', '', links); const a = util.el('a', '', li, label); a.href = '#';
        a.addEventListener('click', (event) => event.preventDefault());
      }
      Object.assign(_c, { header, menubar, quickbar, winbar });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, placement, quickbar, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', quickbar);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      Object.assign(_c, { headerTools, submit });
    },
  };

  env.site({
    name: 'design-use-course-admin-modules-05',
    template: 'site/base',
    design: { parts },
  });
})();
