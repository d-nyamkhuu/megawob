// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) =>
      function (_c) {
        const { content, local, rng, util } = _c;
        const { K, TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Document Workspace');
        brand.dataset.role = 'brand';
        if (true) {
          const n = util.el('nav', 'ref-nav', header);
          const sampledNav = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
          for (const item of ['Projects', 'Documents', 'Reports', 'Calendar', 'Team', 'Settings']) {
            const a = util.el('a', 'ref-navlink', n, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'nav', label: item });
            });
          }
        }
        Object.assign(_c, { brand, header, title });
      },
    'frame.tools': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
        let submit = null;
        const headerTools = util.el('div', 'ref-tools', header);
        const quick = (glyph, label) => {
          const b = util.el('button', 'ref-quick', headerTools, glyph);
          b.type = 'button';
          b.title = label;
          b.setAttribute('aria-label', label);
        };
        const search = util.el('label', 'ref-search', headerTools);
        util.el('span', '', search, '⌕');
        const searchInput = util.el('input', '', search);
        searchInput.type = 'text';
        searchInput.placeholder = 'Search…';
        searchInput.setAttribute('aria-label', 'Search');
        quick('♟', 'Notifications');
        util.el('span', 'ref-user-avatar', headerTools, 'JD');
        for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
        if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
        if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
        if (placement === 'icon') {
          submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
        }
        Object.assign(_c, { headerTools, quick, search, searchInput, submit });
      },
    'frame.stage': (base, S) =>
      function (_c) {
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
        util.el('h1', '', article, 'Project Plan');
        util.el(
          'p',
          '',
          article,
          'The reporting platform will provide a unified view of key business metrics, making it easier for teams to track progress and make data-driven decisions. This project focuses on delivering an improved reports experience with better performance, easier filtering and a cleaner UI.',
        );
        util.el('h2', '', article, 'Key Objectives');
        const bullets = util.el('ul', '', article);
        [
          'Improve report loading performance',
          'Simplify filtering and search',
          'Enhance the overall user experience',
          'Support additional export formats',
        ].forEach((x) => util.el('li', '', bullets, x));
        util.el('h2', '', article, 'Next steps');
        const steps = util.el('ol', '', article);
        [
          'Implement the driver count logic in FleetManager.',
          'Add unit tests for driver management.',
          'Review and update documentation.',
        ].forEach((x) => util.el('li', '', steps, x));
        const comments = util.el('aside', 'ref-comments', docBody);
        for (const [initials, person, time, message, color] of [
          ['JD', 'Jordan Diaz', 'Today, 10:24', 'Consider adding more detail about validation rules.', 'violet'],
          [
            'MK',
            'Maya Chen',
            'Today, 09:17',
            'This section could mention error handling for duplicate drivers.',
            'green',
          ],
        ]) {
          const card = util.el('div', 'ref-comment', comments);
          const top = util.el('div', 'ref-comment-top', card);
          util.el('b', `ref-avatar ${color}`, top, initials);
          const who = util.el('div', 'ref-comment-who', top);
          util.el('strong', '', who, person);
          util.el('small', '', who, time);
          util.el('span', 'ref-comment-menu', top, '⋮');
          util.el('p', '', card, message);
          util.el('a', '', card, 'Reply');
        }
        const docFoot = util.el('div', 'ref-doc-foot', doc);
        util.el('span', '', docFoot, '108 words');
        util.el('span', 'ref-doc-view', docFoot, '▤　　 ▣　　 100%　⌄');
        const properties = util.el('aside', 'ref-properties', body);
        util.el('h2', '', properties, 'Reports');
        const propSection = (name, rows) => {
          const section = util.el('section', 'ref-prop-section', properties);
          util.el('h3', '', section, `⌄　${name}`);
          for (const [label, value] of rows) {
            const row = util.el('div', 'ref-prop-row', section);
            util.el('span', '', row, label);
            util.el('b', '', row, value);
          }
        };
        propSection('Recent', [
          ['Monthly Reports', 'Apr 24, 2024'],
          ['User Activity', 'Apr 22, 2024'],
          ['Revenue Summary', 'Apr 20, 2024'],
          ['System Health', 'Apr 18, 2024'],
          ['Candidate Pipeline', 'Apr 16, 2024'],
          ['Marketing Performance', 'Apr 12, 2024'],
          ['Sales Dashboard', 'Apr 10, 2024'],
          ['Product Metrics', 'Apr 8, 2024'],
          ['Onboarding Progress', 'Apr 5, 2024'],
          ['Customer Feedback', 'Apr 2, 2024'],
          ['Release Notes', 'Mar 28, 2024'],
          ['Competitor Analysis', 'Mar 25, 2024'],
        ]);
        propSection('Index', []);
        propSection('Symbols', [
          ['▣　FleetManager', ''],
          ['　ƒ　FleetManager()', ''],
          ['　ƒ　addDriver(Driver)', ''],
          ['　ƒ　getDriverCount()', ''],
          ['　◇　drivers', ''],
          ['　◇　totalTrips', ''],
          ['　◇　driverCount', ''],
        ]);
        Object.assign(_c, {
          article,
          bullets,
          comments,
          doc,
          docBody,
          docFoot,
          docTab,
          propSection,
          properties,
          stage,
          steps,
          toolbar,
        });
      },
    'frame.nav': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-use-text-editor-cursor-02',
    template: 'site/base',
    design: { parts },
  });
})();
