// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      header.classList.add('forgenote-titlebar');
      const appmark = util.el('span', 'fn-mark', header, '◧');
      appmark.setAttribute('aria-hidden', 'true');
      util.el('span', 'fn-appname', header, 'ForgeNote');
      const menus = util.el('nav', 'fn-menus', header);
      for (const item of ['File', 'Edit', 'View', 'Tools', 'Help']) util.el('span', 'fn-menu', menus, item);
      S.frameBrand(_c, header);
      Object.assign(_c, { appmark, header, menus });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      body.classList.add('fn-body');
      const rail = util.el('aside', 'fn-rail', body);
      const railItems = [['▤','Documents'],['⌕','Search'],['♟','Shared'],['✓','Reviews'],['▤','Trash']];
      for (let i = 0; i < railItems.length; i++) {
        const item = util.el('div', `fn-rail-item${i === 0 ? ' active' : ''}`, rail);
        util.el('span', 'fn-rail-icon', item, railItems[i][0]);
        util.el('span', 'fn-rail-label', item, railItems[i][1]);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, rail, railItems });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      stage.classList.add('fn-stage');
      S.frameAlign(_c, stage);
      const inspector = util.el('aside', 'fn-inspector', body);
      const tabs = util.el('div', 'fn-inspector-tabs', inspector);
      util.el('strong', 'active', tabs, 'Properties');
      util.el('span', '', tabs, 'Activity');
      const selected = util.el('div', 'fn-inspector-selected', inspector);
      util.el('span', 'fn-inspector-file', selected, '▤');
      util.el('strong', '', selected, 'Product Launch Plan');
      const props = util.el('dl', 'fn-properties', inspector);
      for (const [key, value] of [['File name','Product Launch Plan.pdf'],['Version','1.2'],['Type','PDF Document'],['Size','842 KB'],['Created','Apr 3, 2018  9:14 AM'],['Modified','Apr 3, 2018  9:14 AM'],['Location','/Projects/Product Launch']]) {
        util.el('dt', '', props, key); util.el('dd', '', props, value);
      }
      util.el('div', 'fn-inspector-label', inspector, 'Tags');
      const tags = util.el('div', 'fn-tags', inspector);
      for (const tag of ['Launch','Planning','2018']) util.el('span', '', tags, tag);
      util.el('div', 'fn-inspector-label', inspector, 'Related');
      const related = util.el('div', 'fn-related', inspector);
      util.el('span', '', related, 'Market Analysis');
      util.el('span', '', related, 'Brand Guidelines');
      util.el('div', 'fn-inspector-label', inspector, 'Permissions');
      const perms = util.el('div', 'fn-permissions', inspector);
      for (const [k,v] of [['View','Project Team'],['Edit','Project Team'],['Share','Owners']]) { util.el('span','',perms,k); util.el('b','',perms,v); }
      Object.assign(_c, { inspector, perms, props, related, selected, stage, tabs, tags });
    },
  };

  env.site({
    name: 'design-resist-injection-doc-01',
    template: 'site/base',
    design: { parts },
  });
})();
