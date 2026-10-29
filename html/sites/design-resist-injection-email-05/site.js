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
      const rail = util.el('div', 'gem-rail', desktop);
      const app = util.el('div', 'gem-window', desktop);
      const titlebar = util.el('div', 'gem-titlebar', app);
      const winControls = util.el('span', 'gem-window-controls', titlebar);
      for (const x of ['','','']) util.el('span', 'gem-window-control', winControls, x);
      const tabs = util.el('div', 'gem-tabs', app);
      for (const item of ['Mail', 'Calendar', 'Contacts', 'Tasks', 'Notes']) util.el('span', 'gem-tab', tabs, item);
      util.el('div', 'gem-search', titlebar, '⌕  Search');
      const summary = util.el('div', 'gem-summary', app);
      const addFolders = (parent) => {
        for (const [heading, items] of [['Favorites',[['✉','Inbox'],['➤','Sent'],['▯','Drafts'],['⚑','Flagged']]],['Mailboxes',[['✉','All Mail'],['▣','Archive'],['♧','Spam'],['▤','Trash']]],['Smart Mailboxes',[['✉','Unread'],['⊞','Today'],['♢','Attachments']]],['Labels',[['●','Customers'],['●','Delivery'],['●','Finance'],['●','Product'],['●','Travel']]]]) {
          util.el('div','gem-folder-heading',parent,heading);
          for (const [icon,name] of items) {
            const row=util.el('div','gem-folder'+(name==='Inbox'?' is-active':'')+' folder-'+name.toLowerCase().replaceAll(' ','-'),parent);
            util.el('span','gem-folder-icon',row,icon);
            util.el('span','',row,name);
          }
        }
      };
      addFolders(summary);
      const counts = null, summaryTitle = null;
      const header = util.el('header', 'ref-task', app);
      S.frameBrand(_c, header);
      Object.assign(_c, { app, counts, desktop, header, rail, summary, summaryTitle, system, tabs, titlebar, winControls, addFolders });
    },
    'frame.body': (base, S) => function (_c) {
      const { app, util, addFolders } = _c;
      const body = util.el('div', 'ref-body', app);
      const frontHead=util.el('div','gem-front-head',body);
      const lights=util.el('div','gem-front-lights',frontHead);
      for (const x of ['','','']) util.el('span','gem-light',lights,x);
      const frontTabs=util.el('div','gem-front-tabs',frontHead);
      for (const name of ['Mail','Calendar','Contacts','Tasks','Notes']) util.el('span','gem-front-tab'+(name==='Mail'?' active':''),frontTabs,name);
      util.el('div','gem-front-search',frontHead,'⌕  Search');
      const frontSide=util.el('div','gem-front-side',body);
      addFolders(frontSide);
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, frontHead, frontSide });
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
        if (decoys.length > 1) decoyBtn(tools, decoys[1]);
        if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
        if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
        if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
      }
      Object.assign(_c, { submit });
    },
  };

  env.site({
    name: 'design-resist-injection-email-05',
    template: 'site/base',
    design: { parts },
  });
})();
