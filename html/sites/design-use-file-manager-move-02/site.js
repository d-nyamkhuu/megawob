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
      document.body.classList.toggle('cloud-header-note', display === 'header');
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      Object.assign(_c, { H, W, display, roomy, tall });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const tabs = util.el('nav', 'cloud-tabs', header);
      for (const [icon, item] of [['▰','Files'], ['♟','Shared'], ['◷','Recent'], ['★','Starred'], ['▤','Trash']]) {
        const tab = util.el('span', `cloud-tab${item === 'Files' ? ' active' : ''}`, tabs);
        util.el('b', '', tab, icon); util.el('span', '', tab, item);
      }
      const search = util.el('div', 'cloud-search', header, '⌕　Search files and folders');
      util.el('span', 'cloud-apps', header, '⠿');
      util.el('span', 'cloud-avatar', header, '●');
      S.frameBrand(_c, header);
      Object.assign(_c, { header, search, tabs });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const workspace = util.el('div', 'cloud-workspace', body);
      const stage = util.el('main', 'ref-stage', workspace);
      S.frameAlign(_c, stage);
      const recent = util.el('aside', 'cloud-recent', workspace);
      util.el('h2', '', recent, 'Recent files');
      const recentItems = [
        ['pdf', 'project-plan.pdf', 'Apr 14, 2012 10:07 AM'],
        ['doc', 'meeting-notes.odt', 'Apr 11, 2012 4:22 PM'],
        ['sheet', 'budget.xlsx', 'Apr 10, 2012 11:08 AM'],
        ['doc', 'research-review.odt', 'Apr 2, 2012 3:14 PM'],
        ['sheet', 'draft v5 (final).ods', 'Mar 30, 2012 6:48 PM'],
        ['doc', 'team-contacts.odt', 'Mar 27, 2012 1:56 PM'],
        ['pdf', 'requirements.pdf', 'Mar 25, 2012 9:12 AM'],
        ['image', 'design-mockup.png', 'Mar 22, 2012 2:03 PM'],
        ['doc', 'marketing-overview.odt', 'Mar 18, 2012 11:20 AM'],
        ['sheet', 'Q1-summary.xlsx', 'Mar 12, 2012 4:09 PM'],
      ];
      for (const [kind, file, date] of recentItems) {
        const row = util.el('div', 'cloud-recent-row', recent);
        util.el('span', `cloud-file-icon ${kind}`, row);
        const text = util.el('div', 'cloud-recent-copy', row);
        util.el('span', '', text, file);
        util.el('small', '', text, date);
      }
      Object.assign(_c, { recent, recentItems, stage });
    },
  };

  env.site({
    name: 'design-use-file-manager-move-02',
    template: 'site/base',
    design: { parts },
  });
})();
