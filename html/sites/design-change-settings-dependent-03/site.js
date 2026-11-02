// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { ACCENTS, LOW_ACCENTS, LOW_THEME, THEMES } = S;
      const { rng, util, content } = ctx;
      document.body.classList.add('ref-workbench');
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
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      document.body.classList.toggle('wf-header-note', display === 'header');
      Object.assign(_c, { H, W, display, roomy, tall });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const mark = util.el('span', 'wf-mark', header, '▰');
      mark.setAttribute('aria-hidden', 'true');
      util.el('strong', 'wf-wordmark', header, 'WorkFlow');
      const topnav = util.el('nav', 'wf-nav', header);
      for (const item of ['Home', 'Tasks', 'Projects', 'Calendar', 'People', 'Settings']) {
        const a = util.el('a', `wf-navlink${item === 'Settings' ? ' active' : ''}`, topnav, item);
        a.href = '#';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
      }
      const search = util.el('div', 'wf-top-search', header, '⌕  Search anything...');
      util.el('span', 'wf-help-link', header, 'Help');
      util.el('span', 'wf-signout', header, 'Sign Out');
      S.frameBrand(_c, header);
      Object.assign(_c, { header, mark, search, topnav });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const summary = util.el('aside', 'wf-summary', body);
      const card = (title, cls) => {
        const el = util.el('section', `wf-card ${cls || ''}`, summary);
        util.el('h2', 'wf-card-title', el, title);
        return el;
      };
      const counts = card('Settings Summary');
      const countsBody = util.el('div', 'wf-card-body', counts);
      util.el('div', 'wf-count', countsBody, '3 sections');
      util.el('div', 'wf-count', countsBody, '9 settings');
      util.el('hr', 'wf-rule', countsBody);
      for (const [label, value] of [['Enabled', '4'], ['Disabled', '5'], ['With additional options', '2']]) {
        const row = util.el('div', 'wf-stat', countsBody);
        util.el('span', '', row, label); util.el('span', '', row, value);
      }
      const storage = card('Storage Usage');
      const storageBody = util.el('div', 'wf-card-body', storage);
      util.el('div', 'wf-meter', storageBody);
      const storageMeta = util.el('div', 'wf-storage-meta', storageBody);
      util.el('span', '', storageMeta, '420 MB of 2 GB used');
      util.el('span', '', storageMeta, '21%');
      const current = card('Current Settings');
      const currentBody = util.el('div', 'wf-card-body wf-current', current);
      for (const [label, value] of [['Language','English (US)'],['Time zone','(GMT-08:00) Pacific Time'],['Offline mode','Off'],['Cache files','Off'],['Auto-clean cache','On (30 days)']]) {
        const row = util.el('div', 'wf-current-row', currentBody);
        util.el('span', '', row, label); util.el('span', '', row, value);
      }
      util.el('hr', 'wf-rule', currentBody);
      for (const [label, value] of [['Share usage data','Off'],['Personalize content','On'],['Save search history','On']]) {
        const row = util.el('div', 'wf-current-row', currentBody);
        util.el('span', '', row, label); util.el('span', '', row, value);
      }
      Object.assign(_c, { card, counts, countsBody, current, currentBody, stage, storage, storageBody, storageMeta, summary });
    },
  };

  env.site({
    name: 'design-change-settings-dependent-03',
    template: 'site/base',
    design: { parts },
  });
})();
