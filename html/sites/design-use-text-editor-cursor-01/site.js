// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      const title = rng.pick(TITLES);
      const brand = util.el('div', 'ref-brand', header, 'Document Workspace');
      brand.dataset.role = 'brand';
      Object.assign(_c, { brand, header, title });
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
      const stage = util.el('main', 'ref-stage', body);
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
      util.el('h2', '', properties, 'Properties');
      const propSection = (name, rows) => {
        const section = util.el('section', 'ref-prop-section', properties);
        util.el('h3', '', section, `⌄　${name}`);
        for (const [label, value] of rows) {
          const row = util.el('div', 'ref-prop-row', section);
          util.el('span', '', row, label); util.el('b', '', row, value);
        }
      };
      propSection('File', [['Name', 'FleetManager.java'], ['Type', 'Java Source File'], ['Size', '1.2 KB'], ['Location', '/src/com/example/fleet'], ['Modified', 'Apr 12, 2017, 14:32']]);
      propSection('Language', [['Language', 'Java'], ['Indentation', 'Spaces'], ['Tab size', '4'], ['☑　Word wrap', '']]);
      propSection('Symbols', [['▣　FleetManager', ''], ['　ƒ　FleetManager()', ''], ['　ƒ　addDriver(Driver)', ''], ['　ƒ　getDriverCount()', ''], ['　◇　drivers', ''], ['　◇　totalTrips', ''], ['　◇　driverCount', '']]);
      Object.assign(_c, { article, bullets, comments, doc, docBody, docFoot, docTab, propSection, properties, stage, steps, toolbar });
    },
  };

  env.site({
    name: 'design-use-text-editor-cursor-01',
    template: 'site/base',
    design: { parts },
  });
})();
