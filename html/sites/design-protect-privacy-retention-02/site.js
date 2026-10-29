// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { content, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      rng.pick(TITLES);
      const brand = util.el('div', 'ref-brand', header, 'Driftwood Social');
      brand.dataset.role = 'brand';
      {
        const n = util.el('nav', 'ref-nav', header);
        rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        for (const item of ['Files', 'Photos', 'Shared', 'Activity', 'Account']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { brand, header });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, rng, sidebar, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        rng.sample(content.NAV_ITEMS, rng.int(4, 7));
        for (const item of []) {
          const a = util.el('a', 'ref-sidelink', side, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
      Object.assign(_c, { body });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const info = util.el('aside', 'ref-info', body);
      const about = util.el('section', 'ref-info-card ref-about', info);
      util.el('h2', '', about, 'About your data');
      util.el('p', '', about, 'Your data includes the content you create, the information you provide, and the activity we collect as you use Driftwood Social. You can download a copy at any time.');
      util.el('a', 'ref-info-link', about, 'Learn more about your data');
      const tips = util.el('section', 'ref-info-card ref-tips', info);
      util.el('h2', '', tips, '♧　Tips');
      const tip = (icon, title, text, tone) => {
        const row = util.el('div', `ref-tip ${tone}`, tips);
        util.el('span', 'ref-tip-icon', row, icon);
        const copy = util.el('div', 'ref-tip-copy', row);
        util.el('strong', '', copy, title);
        util.el('span', '', copy, text);
      };
      tip('✓', 'Select only the data you need.', 'A smaller request is faster and easier to manage.', 'green');
      tip('◆', 'Keep your data secure.', 'The download link will be sent to your email and will expire after 7 days.', 'cyan');
      tip('♙', 'Only choose an email address you control.', 'Don’t send your data to a shared or public email address.', 'amber');
      const pending = util.el('section', 'ref-info-card ref-pending', info);
      util.el('h2', '', pending, '◷　Pending requests');
      util.el('p', '', pending, 'You don’t have any pending requests right now. Requests can take a few minutes to a few hours to prepare, depending on the size of the data.');
      Object.assign(_c, { about, info, pending, stage, tip, tips });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-protect-privacy-retention-02',
    template: 'site/base',
    design: { parts },
  });
})();
