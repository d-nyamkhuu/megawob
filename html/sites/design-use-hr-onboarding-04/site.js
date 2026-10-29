// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.layout': (base, S) => function (_c) {
      const { ctx, util } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1536;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');

      // Atari ST desktop strip; the task window itself is the existing page frame.
      const desk = util.el('div', 'gem-menubar', document.body);
      util.el('span', 'gem-mark', desk, '♟');
      for (const item of ['Desk', 'File', 'Edit', 'View', 'Records', 'Help']) util.el('span', 'gem-menu-item', desk, item);
      const clock = util.el('span', 'gem-clock', desk, 'Mon  2 Jun 1986 10:24');
      util.el('span', 'gem-status-icon', desk, '▣');
      util.el('span', 'gem-status-icon', desk, '▤');
      Object.assign(_c, { H, W, clock, desk, display, roomy, tall });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const identity = util.el('div', 'risograph-identity', header);
      util.el('strong', '', identity, 'Riverton');
      util.el('span', '', identity, 'PEOPLE OPERATIONS');
      const topTabs = util.el('nav', 'risograph-tabs', header);
      for (const [i, label] of ['Home', 'Recruiting', 'Onboarding', 'Employees', 'Time Off', 'Reports'].entries()) {
        const tab = util.el('span', i === 2 ? 'active' : '', topTabs, label);
      }
      const globalSearch = util.el('div', 'risograph-search', header);
      util.el('span', 'risograph-search-icon', globalSearch, '⌕');
      util.el('span', 'risograph-search-hint', globalSearch, 'Search people, jobs, or tasks…');
      const account = util.el('div', 'risograph-account', header);
      util.el('span', 'risograph-avatar', account, 'JD');
      const accountText = util.el('span', 'risograph-account-text', account);
      util.el('strong', '', accountText, 'Jordan Diaz');
      util.el('small', '', accountText, 'People Ops');
      util.el('span', 'risograph-account-caret', account, '⌄');
      const windowTitle = util.el('div', 'gem-window-title', header);
      util.el('span', 'gem-window-icon', windowTitle, '▦');
      util.el('strong', '', windowTitle, 'People Operations - New Hire Setup');
      const windowControls = util.el('span', 'gem-window-controls', windowTitle, '－  □  ×');
      S.frameBrand(_c, header);
      Object.assign(_c, { account, accountText, globalSearch, header, identity, topTabs, windowControls, windowTitle });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const help = util.el('aside', 'risograph-help', body);
      util.el('h2', '', help, 'Onboarding');
      for (const [icon, label] of [['▤', 'New Hire Checklist'], ['▧', 'Offer Letter'], ['☑', 'Tasks & Access'], ['▱', 'Training'], ['♟', 'People & Teams']]) {
        const row = util.el('div', 'risograph-help-link', help);
        util.el('span', '', row, icon);
        util.el('span', '', row, label);
      }
      const tip = util.el('section', 'risograph-tips', help);
      util.el('h3', '', tip, '☼  Tips');
      for (const text of ['Use the offer letter to copy the start date and equipment.', 'Complete all checklist items to prepare for day one.', 'IT and Facilities tasks will provision accounts and equipment.', 'You can revisit items later if details change.']) {
        util.el('p', '', tip, text);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, help, tip });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      Object.assign(_c, { stage });
    },
  };

  env.site({
    name: 'design-use-hr-onboarding-04',
    template: 'site/base',
    design: { parts },
  });
})();
