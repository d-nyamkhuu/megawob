// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { ACCENTS, LOW_ACCENTS, LOW_THEME, THEMES } = S;
      const { rng, util, content } = ctx;
      let name = rng.pick(Object.keys(THEMES));
      const root = document.documentElement;
      let accent = rng.pick(ACCENTS);
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name])) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', accent);
      // Keep the visual identity fixed across seeded theme draws while retaining their RNG order.
      for (const [k, v] of Object.entries({ bg: '#f4f0e7', panel: '#fbf9f4', fg: '#21190f', muted: '#62594e', line: '#c9bda8' })) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', '#9a7834');
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.layout': (base, S) => function (_c) {
      const { ctx } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1400;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && H < 768) display = 'header';
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      Object.assign(_c, { H, W, display, roomy, tall });
    },
    'frame.placement': (base, S) => function (_c) {
      const { content, ctx, local, lr, rng, tall, util, word } = _c;
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
      const windowbar = util.el('div', 'desk-windowbar', document.body);
      util.el('span', 'desk-appmark', windowbar, '▣');
      util.el('strong', 'desk-windowtitle', windowbar, 'Riverside College LMS');
      const wincontrols = util.el('div', 'desk-window-controls', windowbar);
      for (const [glyph, name] of [['−','Minimize'],['□','Maximize'],['×','Close']]) {
        const c = util.el('span', 'desk-wincontrol', wincontrols, glyph); c.setAttribute('aria-label', name);
      }
      const menubar = util.el('div', 'desk-menubar', document.body);
      for (const item of ['File','Edit','View','Course','Tools','Help']) util.el('span', 'desk-menuitem', menubar, item);
      Object.assign(_c, { collide, cr, decoys, label, menubar, nav, placement, sidebar, wantFooter, wincontrols, windowbar });
    },
    'frame.header': (base, S) => function (_c) {
      const { display, nav, util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      header.classList.add('portal-header');
      header.classList.add(`note-${display}`);
      if (display !== 'header' || nav) {
        const title = 'Course Administration';
        const brand = util.el('div', 'ref-brand', header, title);
        brand.dataset.role = 'brand';
      }
      Object.assign(_c, { header });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      util.el('div', 'portal-course', header, 'Argumentation Basics');
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const rail = util.el('nav', 'desk-rail', body);
      const navItems = [['◆','Dashboard'],['▤','Courses'],['▣','Modules'],['▤','Assignments'],['▦','Quizzes'],['▥','Gradebook'],['♟','Students'],['▮','Reports'],['⚙','Settings']];
      for (const [icon, title] of navItems) {
        const a = util.el('a', `desk-rail-item${title === 'Courses' ? ' selected' : ''}`, rail);
        util.el('span', 'desk-rail-icon', a, icon); util.el('span', '', a, title);
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: title }); });
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, navItems, rail });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      stage.classList.add('portal-stage');
      stage.style.justifyContent = 'stretch';
      stage.style.alignItems = 'stretch';
      const help = util.el('aside', 'desk-help', body);
      util.el('h2', '', help, 'Quiz Builder Help');
      util.el('hr', '', help);
      util.el('h3', '', help, 'Adding questions');
      util.el('p', '', help, '1. Click Add Question to insert a new question into the quiz.');
      util.el('p', '', help, '2. Choose the question type and enter the details.');
      util.el('p', '', help, '3. Repeat to add more questions.');
      util.el('hr', '', help);
      util.el('h3', '', help, 'Question types');
      util.el('p', '', help, '◉  Multiple Choice — one correct answer from a list of options.');
      util.el('p', '', help, '☑  True/False — a simple true or false statement.');
      util.el('p', '', help, '▤  Short Answer · Matching · Essay');
      util.el('hr', '', help);
      util.el('h3', '', help, 'Points');
      util.el('p', '', help, 'Set the point value for each question based on its difficulty and importance.');
      Object.assign(_c, { help, stage });
    },
  };

  env.site({
    name: 'design-use-course-admin-quiz-04',
    template: 'site/base',
    design: { parts },
  });
})();
