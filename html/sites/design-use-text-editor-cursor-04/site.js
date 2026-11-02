// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      const title = rng.pick(TITLES);
      const titlebar = util.el('div', 'aqua-titlebar', header);
      util.el('span', 'aqua-lights', titlebar, '● ● ●');
      const brand = util.el('div', 'ref-brand', titlebar, 'Project Editor');
      brand.dataset.role = 'brand';
      const menu = util.el('nav', 'aqua-menu', header);
      for (const item of ['File', 'Edit', 'View', 'Project', 'Build', 'Tools', 'Window', 'Help']) {
        util.el('span', '', menu, item);
      }
      const appbar = util.el('div', 'aqua-appbar', header);
      for (const [icon, label] of [['▯','New'], ['▰','Open'], ['⚒','Build'], ['▶','Run'], ['⬟','Stop'], ['⌕','Find'], ['⚯','Find Next'], ['⚙','Preferences']]) {
        const item = util.el('div', 'aqua-app-tool', appbar);
        util.el('span', 'aqua-app-icon', item, icon);
        util.el('span', '', item, label);
      }
      Object.assign(_c, { appbar, brand, header, menu, title, titlebar });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      const quick = (glyph, label) => {
        const b = util.el('button', 'ref-quick', headerTools, glyph);
        b.type = 'button'; b.title = label; b.setAttribute('aria-label', label);
      };
      quick('⌕', 'Search');
      quick('ⓘ', 'Help');
      quick('⚙', 'Settings');
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      Object.assign(_c, { headerTools, quick, submit });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const workspace = util.el('div', 'aqua-workspace', body);
      const project = util.el('aside', 'aqua-project', workspace);
      util.el('div', 'aqua-project-head', project, 'Project');
      util.el('div', 'aqua-project-tree', project, '  ▾  📁 WebApp\n     ▾  📁 src\n        ▤  app.js\n        ▤  router.js\n        ▤  store.js\n     ▾  📁 utils\n        ▤  format.js\n        ▤  api.js\n  ▸  📁 assets\n  ▸  📁 docs\n     ▤  README.md\n     ▤  LICENSE');
      const stage = util.el('main', 'ref-stage', workspace);
      S.frameAlign(_c, stage);

      // The rich document is a companion surface; the task editor remains the active task widget.
      const doc = util.el('section', 'ref-document', body);
      const docTab = util.el('div', 'ref-doc-tab', doc);
      util.el('strong', '', docTab, 'Project Notes');
      util.el('span', 'ref-doc-close', docTab, '×');
      const toolbar = util.el('div', 'ref-doc-toolbar', doc);
      util.el('button', 'ref-doc-style', toolbar, 'Normal text 　⌄');
      util.el('span', 'ref-doc-tools', toolbar, 'B　 I　 U　 │　☷　☷　│　↗');
      util.el('button', 'ref-doc-mode', toolbar, '✎　Editing　⌄');
      const docBody = util.el('div', 'ref-doc-body', doc);
      const article = util.el('article', 'ref-article', docBody);
      util.el('h1', '', article, 'Fleet Management Update');
      util.el('p', '', article, 'The fleet management system tracks drivers, vehicles and trips. This update focuses on improving the accuracy of driver statistics and making the system easier to maintain.');
      util.el('h2', '', article, 'Key changes');
      const bullets = util.el('ul', '', article);
      ['Track the total number of drivers in the fleet.', 'Ensure driver records are validated before adding them to the system.', 'Improve reporting for monthly trip totals.'].forEach((x) => util.el('li', '', bullets, x));
      util.el('h2', '', article, 'Next steps');
      const steps = util.el('ol', '', article);
      ['Implement the driver count logic in FleetManager.', 'Add unit tests for driver management.', 'Review and update documentation.'].forEach((x) => util.el('li', '', steps, x));
      const comments = util.el('aside', 'ref-comments', docBody);
      for (const [initials, person, time, message, color] of [
        ['JD', 'Jordan Diaz', 'Today, 10:24', 'Consider adding more detail about validation rules.', 'violet'],
        ['MK', 'Maya Chen', 'Today, 09:17', 'This section could mention error handling for duplicate drivers.', 'green'],
      ]) {
        const card = util.el('div', 'ref-comment', comments);
        const top = util.el('div', 'ref-comment-top', card);
        util.el('b', `ref-avatar ${color}`, top, initials);
        const who = util.el('div', 'ref-comment-who', top);
        util.el('strong', '', who, person); util.el('small', '', who, time);
        util.el('span', 'ref-comment-menu', top, '⋮');
        util.el('p', '', card, message); util.el('a', '', card, 'Reply');
      }
      const docFoot = util.el('div', 'ref-doc-foot', doc);
      util.el('span', '', docFoot, '98 words');
      util.el('span', 'ref-doc-view', docFoot, '▤　　 ▣　　 100%　⌄');
      const properties = util.el('aside', 'ref-properties', body);
      const helpTabs = util.el('div', 'aqua-help-tabs', properties);
      for (const label of ['Help', 'Outline', 'Symbols']) util.el('span', '', helpTabs, label);
      util.el('h2', '', properties, 'JavaScript Basics');
      const helpTopics = ['Variables and Constants', 'Functions', 'Objects', 'Modules', 'Event Handling', 'Common APIs'];
      const topics = util.el('div', 'aqua-help-topics', properties);
      helpTopics.forEach((label) => util.el('div', '', topics, `▸　${label}`));
      util.el('h2', 'aqua-tips-heading', properties, 'Tips');
      const tips = util.el('ul', 'aqua-tips', properties);
      ['Use const for values that do not change.', 'Objects are defined with { }.', 'Use dot notation to access properties, e.g. obj.name.', 'Template strings can include variables with ${...}.'].forEach((tip) => util.el('li', '', tips, tip));
      util.el('h2', 'aqua-examples-heading', properties, 'Examples');
      util.el('pre', 'aqua-example', properties, "const obj = {\n  port: 8080,\n  host: 'localhost'\n};\nconsole.log(obj.port);");
      Object.assign(_c, { article, bullets, comments, doc, docBody, docFoot, docTab, helpTabs, helpTopics, properties, stage, steps, tips, toolbar, topics });
    },
  };

  env.site({
    name: 'design-use-text-editor-cursor-04',
    template: 'site/base',
    design: { parts },
  });
})();
