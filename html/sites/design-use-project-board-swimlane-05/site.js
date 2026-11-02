// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) => function (ctx) {
      const result = base(ctx);
      if (ctx.kind === 'chat') {
        const { el } = ctx.util;
        const title = el('div', 'release-chat-title', result.el, 'Chat');
        title.append(result.dismiss);
        result.el.prepend(title);
        const reply = el('button', 'release-chat-reply', result.el, 'Yes, please go ahead.');
        reply.addEventListener('click', () => env.log('overlay-click', { label: reply.textContent }));
        el('div', 'release-chat-compose', result.el, 'Write a message...     ➤');
      }
      return result;
    },
    'frame.header': (base, S) => function (_c) {
      const { content, local, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      {
        rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Project Navigator');
        brand.dataset.role = 'brand';
      }
      {
        const n = util.el('nav', 'ref-nav', header);
        const sampledNav = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        const navLabels = ['Home', 'Release Plan', 'Teams', 'Tasks', 'Milestones', 'Reports'];
        for (const [index, item] of navLabels.entries()) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          if (index === 1) a.style.textDecoration = 'underline';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: sampledNav[index % sampledNav.length] || item }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.nav': (base, S) => function (_c) {
    },
    'frame.body': (base, S) => function (_c) {
      base(_c);
      const rail = _c.body.querySelector('.ref-side');
      if (rail) rail.remove();
      document.body.classList.toggle('release-header-note', _c.display === 'header');
      document.body.classList.toggle('release-panel-note', _c.display === 'panel');
      document.body.classList.toggle('release-toast-note', _c.display === 'toast');
    },
    'frame.end': (base, S) => function (_c) {
      const footer = document.querySelector('.ref-foot .ref-tools');
      const footerWidth = footer ? footer.getBoundingClientRect().width : 0;
      const headerWidth = _c.headerTools.getBoundingClientRect().width;
      document.body.style.setProperty('--release-toolbar-space', `${headerWidth + footerWidth + (headerWidth || footerWidth ? 26 : 0)}px`);
      if (_c.display === 'header') _c.header.style.paddingRight = `${footerWidth + 18}px`;
      else _c.header.style.right = `${footerWidth + 22}px`;
      return base(_c);
    },
  };

  env.site({
    name: 'design-use-project-board-swimlane-05',
    template: 'site/base',
    design: { parts },
  });
})();
