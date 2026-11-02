// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  const THEMES = {
    light: { bg: '#21192e', panel: '#30253f', fg: '#f5f2fb', muted: '#c1b8d1', line: '#483b58' },
    dark: { bg: '#21192e', panel: '#30253f', fg: '#f5f2fb', muted: '#c1b8d1', line: '#483b58' },
    warm: { bg: '#21192e', panel: '#30253f', fg: '#f5f2fb', muted: '#c1b8d1', line: '#483b58' },
  };

  const LOW_THEME = { bg: '#21192e', panel: '#30253f', fg: '#f5f2fb', muted: '#c1b8d1', line: '#483b58' };

  const LOW_ACCENTS = ['#ff777b', '#ff777b', '#ff777b', '#ff777b'];

  const ACCENTS = ['#ff777b', '#ff777b', '#ff777b', '#ff777b', '#ff777b', '#ff777b'];

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      header.classList.add('drift-episode-header');
      const desktopBar = util.el('div', 'drift-desktopbar', document.body);
      util.el('span', 'drift-mark', desktopBar, '◢');
      util.el('strong', 'drift-appname', desktopBar, 'Driftwood Social');
      const winControls = util.el('div', 'drift-window-controls', desktopBar);
      util.el('span', '', winControls, '—');
      util.el('span', '', winControls, '□');
      util.el('span', '', winControls, '×');
      document.body.insertBefore(desktopBar, header);
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Driftwood Social');
        brand.dataset.role = 'brand';
      }
      Object.assign(_c, { desktopBar, header, winControls });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      const socialSide = util.el('aside', 'drift-sidebar', body);
      const create = util.el('div', 'drift-create', socialSide);
      util.el('span', '', create, '▱');
      util.el('strong', '', create, 'Create Post');
      const sideLinks = util.el('nav', 'drift-side-links', socialSide);
      for (const [icon, label] of [['⌂', 'Home'], ['◉', 'Explore'], ['♧', 'Groups'], ['▣', 'Events'], ['♧', 'Saved'], ['●', 'Profile']]) {
        const link = util.el('div', `drift-side-link${label === 'Profile' ? ' is-active' : ''}`, sideLinks);
        util.el('span', '', link, icon);
        util.el('span', '', link, label);
      }
      const friends = util.el('section', 'drift-friends', socialSide);
      const friendHead = util.el('div', 'drift-friends-head', friends);
      util.el('strong', '', friendHead, 'Friends');
      util.el('span', '', friendHead, 'See all');
      for (const [icon, label] of [['ML', 'Morgan Lee'], ['RP', 'Riley Park'], ['CK', 'Casey Kim'], ['JE', 'Jordan Ellis'], ['TS', 'Taylor Singh'], ['AC', 'Avery Chen'], ['JP', 'Jamie Patel'], ['AR', 'Alex Rivera']]) {
        const row = util.el('div', 'drift-friend', friends);
        util.el('span', 'drift-avatar', row, icon);
        util.el('span', '', row, label);
      }
      body.insertBefore(socialSide, stage);
      S.frameAlign(_c, stage);
      Object.assign(_c, { create, friendHead, friends, sideLinks, socialSide, stage });
    },
    'frame.floating': (base, S) => function (_c) {
      const { body, collide, decoys, display, endBtn, header, label, placement, stage, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      if (display === 'header' || placement === 'header' || placement === 'icon' || decoys.length || collide) {
        header.classList.add('drift-episode-visible');
      }
      const tabs = util.el('nav', 'drift-tabs', document.body);
      const tabItems = [['⌂', 'Home'], ['♧', 'Friends'], ['●', 'Profile'], ['✉', 'Messages'], ['♧', 'Notifications']];
      for (const [icon, text] of tabItems) {
        const tab = util.el('div', `drift-tab${text === 'Profile' ? ' is-active' : ''}`, tabs);
        util.el('span', '', tab, icon);
        util.el('span', '', tab, text);
      }
      const search = util.el('div', 'drift-search', tabs);
      util.el('span', '', search, '⌕');
      util.el('span', '', search, 'Search people, posts, and groups');
      util.el('span', 'drift-user-avatar', tabs, 'P');
      util.el('span', 'drift-user-caret', tabs, '⌄');
      const workspace = util.el('div', 'drift-workspace', body);
      body.insertBefore(workspace, stage);
      workspace.appendChild(tabs);
      workspace.appendChild(stage);
      document.body.insertBefore(body, body.nextSibling);
      Object.assign(_c, { search, submit, tabItems, tabs, workspace });
    },
  };

  env.site({
    name: 'design-protect-privacy-visibility-04',
    template: 'site/base',
    design: { THEMES, LOW_THEME, LOW_ACCENTS, ACCENTS, parts },
  });
})();
