// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const paperHead = util.el('div', 'paper-head xp-title', header);
      const appIcon = util.el('span', 'xp-ico', paperHead);
      appIcon.innerHTML = '<svg viewBox="0 0 32 32"><path d="M3 7h11l3 4h12v17H3z" fill="#ffe083" stroke="#9c7d36"/><path d="M3 14h27l-4 14H3z" fill="#f4c854" stroke="#a78132"/><path d="M18 19l6-6v4h7v8h-7v4l-6-6z" fill="#51a747" stroke="#31822b"/></svg>';
      util.el('div', 'paper-brand', paperHead, 'File Explorer');
      const paperSearch = util.el('div', 'paper-search', paperHead);
      for (const g of ['_', '□', '✕']) util.el('span', 'xp-wb', paperSearch, g);
      const searchRow = util.el('div', 'xp-menu', header);
      for (const m of ['File', 'Edit', 'View', 'Favorites', 'Tools', 'Help']) util.el('span', '', searchRow, m);
      const searchInput = searchRow;
      S.frameBrand(_c, header);
      Object.assign(_c, { header, paperHead, paperSearch, searchInput, searchRow });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const paperRail = util.el('aside', 'paper-rail', body);
      const paperHero = util.el('section', 'paper-hero', body);
      const heroCopy = util.el('div', 'paper-hero-copy', paperHero);
      const recent = util.el('div', 'paper-recent', paperHero);
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, heroCopy, paperHero, paperRail, recent });
    },
    'frame.instruction': (base) => function (_c) {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) _c.paperHead.after(note);
    },
    'frame.footer': (base) => function (_c) {
      base(_c);
      const foot = document.querySelector('.ref-foot');
      if (foot) foot.classList.toggle('xp-empty-footer', !foot.querySelector('button,a'));
    },
  };

  const overlay = (base) => function (ctx) {
    const result = base(ctx);
    if (result && result.el.classList.contains('ref-ov-banner')) {
      const stage = document.querySelector('.ref-stage');
      if (stage) {
        const win = stage.querySelector('.fm-win');
        const toolbar = win && win.querySelector('.fm-bar');
        if (toolbar) toolbar.after(result.el);
      }
    }
    return result;
  };

  env.site({
    name: 'design-use-file-manager-delete-05',
    template: 'site/base',
    design: { parts: { ...parts, overlay } },
  });
})();
