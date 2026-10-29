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
      for (const [k, v] of Object.entries({ bg: '#e9e7e2', panel: '#f8f7f3', fg: '#171b22', muted: '#59616b', line: '#c8c5bd', accent: '#3979bd' })) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', accent);
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      // Clearlooks desktop frame: title bar, application menu, then task tabs.
      const titlebar = util.el('div', 'gtk-titlebar', document.body);
      util.el('span', 'gtk-app-icon', titlebar, '◉');
      util.el('strong', 'gtk-window-title', titlebar, 'CodeStation - acme/webapp');
      const winControls = util.el('div', 'gtk-window-controls', titlebar);
      for (const glyph of ['−', '□', '×']) util.el('span', '', winControls, glyph);
      const menubar = util.el('nav', 'gtk-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Repository', 'Build', 'Tools', 'Help']) util.el('span', '', menubar, item);
      const appTabs = util.el('nav', 'gtk-app-tabs', document.body);
      for (const [icon, label] of [['▣', 'Pull Requests'], ['⛭', 'Pipelines'], ['▤', 'Logs'], ['▦', 'Database'], ['◆', 'Feature Flags']]) {
        const tab = util.el('span', `gtk-app-tab${label === 'Pull Requests' ? ' selected' : ''}`, appTabs);
        util.el('b', '', tab, icon);
        util.el('span', '', tab, label);
      }
      document.body.insertBefore(titlebar, header);
      document.body.insertBefore(menubar, header);
      document.body.insertBefore(appTabs, header);
      header.classList.add('gtk-toolbar');
      S.frameBrand(_c, header);
      Object.assign(_c, { appTabs, header, menubar, titlebar, winControls });
    },
    'frame.nav': (base, S) => function (_c) {
      const { content, display, header, local, nav, rng, util } = _c;
      const { K } = S;
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        for (const item of local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav)) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      header.classList.add(`gtk-display-${display}`);
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);

      // Pull request record band: summary and status sit above the working diff.
      const pr = util.el('section', 'pr-summary', document.body);
      const prMain = util.el('div', 'pr-summary-main', pr);
      const prIdentity = util.el('div', 'pr-identity', prMain);
      util.el('div', 'pr-title', prIdentity, 'Pull request #5218');
      util.el('div', 'pr-subtitle', prIdentity, 'Improve session resolution and error handling');
      const author = util.el('div', 'pr-author', prIdentity);
      util.el('div', 'pr-avatar', author, 'AC');
      const byline = util.el('div', 'pr-byline', author);
      util.el('strong', '', byline, 'alex.chen');
      util.el('span', '', byline, 'opened 2 days ago · updated 3 hours ago');
      const details = util.el('div', 'pr-details', prMain);
      for (const [heading, value] of [['Repository', 'acme/webapp'], ['Base', 'main'], ['Compare', 'feature/session-resolve']]) {
        const item = util.el('div', 'pr-detail', details);
        util.el('div', 'pr-detail-label', item, heading);
        util.el('div', `pr-detail-value${heading === 'Repository' ? ' plain' : ''}`, item, value);
      }
      const stats = util.el('div', 'pr-stats', prMain);
      const status = util.el('div', 'pr-status', stats);
      util.el('div', 'pr-stat-label', status, 'Review status');
      util.el('div', 'pr-status-line', status, '●　Changes requested');
      util.el('div', 'pr-status-note', status, '0 of 2 reviewers approved');
      util.el('div', 'pr-stat-label checks-label', stats, 'Checks');
      util.el('div', 'pr-check-line passed', stats, '●　5 passed');
      util.el('div', 'pr-check-line skipped', stats, '●　1 skipped');
      const tabs = util.el('nav', 'pr-tabs', pr);
      for (const [label, count, active] of [['Conversation', '6', false], ['Commits', '4', false], ['Files changed', '3', true], ['Checks', '5', false]]) {
        const tab = util.el('div', `pr-tab${active ? ' active' : ''}`, tabs);
        util.el('span', '', tab, label);
        util.el('b', '', tab, count);
      }
      Object.assign(_c, { author, byline, details, pr, prIdentity, prMain, stats, status, tabs });
    },
  };

  env.site({
    name: 'design-use-dev-tools-prcomment-02',
    template: 'site/base',
    design: { parts },
  });
})();
