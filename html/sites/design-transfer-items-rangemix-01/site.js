// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.layout': (base, S) => function (_c) {
      const { ctx, util } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      const titlebar = util.el('div', 'app-titlebar', document.body);
      util.el('span', 'app-globe', titlebar, '🌎');
      util.el('strong', '', titlebar, 'Country Manager');
      const winControls = util.el('div', 'app-window-controls', titlebar);
      for (const [cls, text] of [['min', '−'], ['max', '□'], ['close', '×']]) {
        util.el('span', `app-window-control ${cls}`, winControls, text);
      }
      const menu = util.el('div', 'app-menu', document.body);
      for (const item of ['File', 'Edit', 'View', 'Tools', 'Help']) util.el('span', '', menu, item);
      Object.assign(_c, { H, W, display, menu, roomy, tall, titlebar, winControls });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const related = util.el('div', 'app-related', body);
      const countryIndex = util.el('aside', 'app-index', related);
      util.el('strong', 'app-index-title', countryIndex, 'Countries');
      const countryList = util.el('div', 'app-country-list', countryIndex);
      for (const item of ['All countries', 'Europe', 'Asia', 'North America', 'South America', 'Africa', 'Oceania']) {
        util.el('div', item === 'All countries' ? 'app-country active' : 'app-country', countryList, item);
      }
      S.frameSidebar(_c, related);
      Object.assign(_c, { body, countryIndex, countryList, related });
    },
    'frame.panel': (base) => function (_c) {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) _c.related.append(panel);
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const details = util.el('aside', 'app-details', body);
      util.el('strong', 'app-details-title', details, 'Country Details');
      for (const [label, value] of [['Name:', 'All countries'], ['Continent:', '—'], ['Population:', '—'],
        ['Area (km²):', '—'], ['Capital:', '—'], ['Currency:', '—']]) {
        const row = util.el('div', 'app-detail-row', details);
        util.el('span', '', row, label);
        util.el('span', '', row, value);
      }
      Object.assign(_c, { details, stage });
    },
    'frame.toast': (base) => function (_c) {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.lastElementChild;
        const row = _c.util.el('div', 'app-notice-row', document.body);
        row.append(note);
      }
    },
    'frame.floating': (base, S) => function (_c) {
      const { endBtn, label, placement, util } = _c;
      let { submit } = _c;
      let dock;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      const appDock = util.el('footer', 'app-dock', document.body);
      const tabs = [['🌎', 'Countries'], ['▥', 'Statistics'], ['▤', 'Reports'], ['⚙', 'Settings'], ['▣', 'Help']];
      for (let i = 0; i < tabs.length; i++) {
        const tab = util.el('div', i === 0 ? 'app-tab active' : 'app-tab', appDock);
        util.el('span', 'app-tab-icon', tab, tabs[i][0]);
        util.el('span', '', tab, tabs[i][1]);
      }
      const existingTools = document.querySelector('.ref-foot .ref-tools');
      if (existingTools) appDock.append(existingTools);
      if (dock) appDock.append(dock);
      Object.assign(_c, { appDock, existingTools, submit, tabs });
    },
  };

  env.site({
    name: 'design-transfer-items-rangemix-01',
    template: 'site/base',
    design: { parts },
  });
})();
