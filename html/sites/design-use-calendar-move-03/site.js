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
      // Paper-white academic calendar; retain the original theme draws above.
      name = 'light';
      accent = '#0000ee';
      for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name])) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', accent);
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.layout': (base, S) => function (_c) {
      const { ctx } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      document.body.dataset.calendarDisplay = display;
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      Object.assign(_c, { H, W, display, roomy, tall });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const rail = util.el('aside', 'tw-leftnav', body);
      util.el('a', 'tw-brand', rail, 'TeamWorks');
      const railItems = ['Calendar', 'Tasks', 'People', 'Projects', 'Documents', 'Reports', 'Settings'];
      for (const item of railItems) {
        const a = util.el('a', `tw-link${item === 'Calendar' ? ' active' : ''}`, rail, item);
        a.href = '#';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, rail, railItems });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const dock = util.el('nav', 'calendar-dock', document.body);
      const dockItems = [['▣', 'Calendar'], ['☑', 'Tasks'], ['▱', 'Projects'], ['♙', 'People'], ['◴', 'Reports']];
      for (const [icon, text] of dockItems) {
        const item = util.el('div', `calendar-dock-item${text === 'Calendar' ? ' active' : ''}`, dock);
        util.el('span', 'calendar-dock-icon', item, icon);
        util.el('span', '', item, text);
      }
      const dockTools = util.el('div', 'calendar-dock-tools', dock);
      util.el('span', '', dockTools, '⌕');
      util.el('span', '', dockTools, '♧');
      util.el('span', '', dockTools, '⚙');
      Object.assign(_c, { dock, dockItems, dockTools, stage });
    },
    'frame.floating': (base, S) => function (_c) {
      const { display, endBtn, header, headerTools, label, placement, util, wantFooter } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      header.classList.toggle('ref-task-empty', display !== 'header' && !headerTools.children.length);
      document.body.style.setProperty('--calendar-end-clearance', `${(wantFooter ? 38 : 0) + (placement === 'floating' ? 44 : 0)}px`);
      document.body.style.setProperty('--calendar-header-height', `${header.getBoundingClientRect().bottom + 3}px`);
      Object.assign(_c, { submit });
    },
  };

  env.site({
    name: 'design-use-calendar-move-03',
    template: 'site/base',
    design: { parts },
  });
})();
