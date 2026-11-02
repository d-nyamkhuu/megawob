// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
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
      document.body.dataset.display = display;
      Object.assign(_c, { H, W, display, roomy, tall });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const desktop = util.el('div', 'gem-desktop', document.body);
      const system = util.el('div', 'gem-system', desktop);
      util.el('span', 'gem-mark', system, '✉');
      for (const item of ['File', 'Edit', 'View', 'Tools', 'Message', 'Help']) util.el('span', 'gem-menu', system, item);
      util.el('span', 'gem-clock', system, 'Mon 10 Mar 1986　14:24');
      const rail = util.el('div', 'gem-rail', desktop);
      for (const [icon, text] of [['▣','A:'],['▣','B:'],['▤','Documents'],['▰','MailDesk'],['▱','Projects'],['▦','Calendar'],['▥','Addresses'],['▤','Waste']]) {
        const item = util.el('div', 'gem-desktop-item', rail);
        util.el('span', 'gem-desktop-icon', item, icon);
        util.el('span', 'gem-desktop-label', item, text);
      }
      const app = util.el('div', 'gem-window', desktop);
      const titlebar = util.el('div', 'gem-titlebar', app);
      app.appendChild(system);
      util.el('span', 'gem-title-gadget', titlebar, '⊞');
      util.el('strong', 'gem-title', titlebar, 'Windows Mail');
      const winControls = util.el('span', 'gem-window-controls', titlebar);
      for (const x of ['−','□','×']) util.el('span', 'gem-window-control', winControls, x);
      const tabs = util.el('div', 'gem-tabs', app);
      for (const item of ['Mail', 'Calendar', 'Contacts', 'Tasks']) util.el('span', 'gem-tab', tabs, item);
      const summary = util.el('div', 'gem-summary', app);
      util.el('span', 'gem-envelope', summary, '✉');
      const summaryTitle = util.el('div', 'gem-summary-title', summary);
      util.el('strong', '', summaryTitle, 'Inbox');
      util.el('span', '', summaryTitle, '3 messages');
      const counts = util.el('div', 'gem-counts', summary);
      util.el('span', '', counts, 'Unread　　　0');
      util.el('span', '', counts, 'Total　　　3');
      const header = util.el('header', 'ref-task', app);
      S.frameBrand(_c, header);
      Object.assign(_c, { app, counts, desktop, header, rail, summary, summaryTitle, system, tabs, titlebar, winControls });
    },
    'frame.body': (base, S) => function (_c) {
      const { app, util } = _c;
      const body = util.el('div', 'ref-body', app);
      S.frameSidebar(_c, body);
      Object.assign(_c, { body });
    },
    'frame.stage': (base, S) => function (_c) {
      base(_c);
      Object.assign(_c.stage.style, { alignItems: 'center', justifyContent: 'center', padding: '0' });
    },
    'frame.toast': (base, S) => function (_c) {
      base(_c);
      if (_c.display === 'toast') _c.tabs.appendChild(document.body.querySelector('.ref-note'));
    },
    'frame.floating': (base, S) => function (_c) {
      base(_c);
      if (_c.placement === 'floating') _c.tabs.appendChild(_c.submit.parentElement);
    },
    'frame.footer': (base, S) => function (_c) {
      const { app, collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
      let { submit } = _c;
      if (wantFooter) {
        const foot = util.el('footer', 'ref-foot', app);
        const footText = rng.pick(['© 2024 Example Co.', 'All changes are saved automatically.',
          'Need help? Contact your administrator.', 'v4.2.1 · Status: all systems normal']);
        util.el('span', 'ref-foot-text', foot, word ? lr.pick([`© 2024 Example Co. ${word('footRights')}`,
          word('footSaved'), word('footHelp'), `v4.2.1 · ${word('footStatus')}`]) : footText);
        const tools = util.el('div', 'ref-tools', foot);
        tools.style.position = 'static';
        if (decoys.length > 1) decoyBtn(tools, decoys[1]);
        if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
        if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
        if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
      }
      Object.assign(_c, { submit });
    },
  };

  env.site({
    name: 'design-resist-injection-email-03',
    template: 'site/base',
    design: { parts },
  });
})();
