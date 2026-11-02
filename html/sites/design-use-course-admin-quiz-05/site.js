// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
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
      const { display, nav, util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      header.classList.add('portal-header');
      {
        const title = 'CampusLearn';
        const brand = util.el('div', 'ref-brand', header);
        brand.innerHTML = '<svg viewBox="0 0 32 24" width="36" height="27" fill="#111"><path d="M16 1L1 8l15 7 15-7z"/><path d="M7 13v6c0 2 4 4 9 4s9-2 9-4v-6l-9 4z"/><path d="M29 9v9" stroke="#111" stroke-width="2"/></svg>';
        util.el('span', '', brand, title);
        brand.dataset.role = 'brand';
      }
      const navBar = util.el('nav', 'ref-nav', header);
      ['Dashboard', 'Courses', 'Gradebook', 'Calendar', 'Messages'].forEach(name => util.el('span', name === 'Courses' ? 'on' : '', navBar, name));
      Object.assign(_c, { header });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') {
        header.classList.add('has-instruction');
        util.el('div', 'ref-instruction', header, ctx.instruction);
      }
      else util.el('div', 'ref-spacer', header);
      const tools = util.el('div', 'portal-course', header);
      tools.innerHTML = '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#111" stroke-width="2.4" stroke-linecap="round"><circle cx="10" cy="10" r="7.5"/><path d="M16 16l6 6"/></svg><svg viewBox="0 0 24 24" width="32" height="32" fill="#111"><circle cx="12" cy="12" r="11"/><circle cx="12" cy="8" r="3.8" fill="#faf9f6"/><path d="M5 19c0-3.5 3-5 7-5s7 1.5 7 5c-4 3.5-10 3.5-14 0z" fill="#faf9f6"/></svg>';
    },
    'frame.toast': (base, S) => function (_c) {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        _c.header.after(note);
      }
    },
    overlay: (base, S) => function (ctx) {
      const result = base(ctx);
      if (ctx.kind === 'banner') {
        result.el.style.top = `${document.querySelector('.portal-header').getBoundingClientRect().bottom}px`;
      }
      return result;
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
    name: 'design-use-course-admin-quiz-05',
    template: 'site/base',
    design: { parts },
  });
})();
