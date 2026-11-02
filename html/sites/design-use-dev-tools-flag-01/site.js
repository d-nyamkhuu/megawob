// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const nav = W >= 1180 && rng.bool(0.5);
      // The design has a persistent related-record index and a tab strip.
      const showIndex = true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, showIndex, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      {
        const brand = util.el('div', 'ref-brand', header);
        brand.innerHTML = '<svg class="ref-cloud" viewBox="0 0 40 30" aria-hidden="true"><path d="M12 25h17a8 8 0 0 0 1-16 11 11 0 0 0-21-1A8.5 8.5 0 0 0 12 25Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Acme Cloud</span>';
        brand.dataset.role = 'brand';
      }
      const project = util.el('button', 'ref-project', header, 'Phoenix  ⌄');
      project.type = 'button';
      project.addEventListener('click', () => env.log('decoy', { what: 'project', label: 'Phoenix' }));
      if (true) {
        const n = util.el('nav', 'ref-nav', header);
        for (const item of ['Overview', 'Code', 'Pipelines', 'Observability', 'Database', 'Feature Flags', 'Settings']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { header, project });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      const globalSearch = util.el('div', 'ref-global-search', headerTools, '⌕  Search…');
      globalSearch.setAttribute('aria-hidden', 'true');
      const notification = util.el('button', 'ref-notification', headerTools);
      notification.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      notification.type = 'button';
      notification.setAttribute('aria-label', 'Notifications');
      notification.addEventListener('click', () => env.log('decoy', { what: 'notification' }));
      const profile = util.el('button', 'ref-profile', headerTools, 'JD');
      profile.type = 'button';
      profile.setAttribute('aria-label', 'Jordan Davis profile');
      profile.addEventListener('click', () => env.log('decoy', { what: 'profile' }));
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      Object.assign(_c, { globalSearch, headerTools, notification, profile, submit });
    },
    'frame.body': (base, S) => function (_c) {
      const { showIndex, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      let indexList = null;
      if (showIndex) {
        const side = util.el('aside', 'ref-side', body);
        const heading = util.el('div', 'ref-index-heading', side);
        util.el('div', 'ref-index-title', heading, 'Feature Flags');
        const add = util.el('button', 'ref-new-flag', heading, '+  New flag');
        add.type = 'button';
        add.addEventListener('click', () => env.log('decoy', { what: 'new-flag' }));
        const search = util.el('div', 'ref-index-search', side, '⌕  Search flags…');
        search.setAttribute('aria-hidden', 'true');
        indexList = util.el('div', 'ref-index-list', side);
        const records = [
          ['new-onboarding', 'New user onboarding experience', true],
          ['retention-policy', 'Controls data retention behavior', true],
          ['search-redesign', 'Enable new search experience', false],
          ['billing-v2', 'Use v2 billing flow', true],
          ['ai-assistant', 'Enable AI assistant for users', false],
          ['beta-dashboard', 'New dashboard for beta users', true],
          ['performance-metrics', 'Collect enhanced performance metrics', true],
          ['mobile-app', 'Enable mobile app experience', false],
          ['team-collaboration', 'Collaboration tools and sharing', true],
          ['dark-mode', 'Dark mode for supported clients', false],
        ];
        for (const [i, [item, description, enabled]] of records.entries()) {
          const a = util.el('a', 'ref-sidelink', indexList);
          if (i === 0) a.classList.add('selected');
          const copy = util.el('span', 'ref-record-copy', a);
          util.el('strong', 'ref-record-name', copy, item);
          util.el('span', 'ref-record-description', copy, description);
          const status = util.el('span', `ref-index-status${enabled ? ' is-on' : ' is-off'}`, a);
          util.el('i', 'ref-status-dot', status);
          util.el('span', '', status, enabled ? 'On' : 'Off');
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
      Object.assign(_c, { body, indexList });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      Object.assign(_c, { stage });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-dev-tools-flag-01',
    template: 'site/base',
    design: { parts },
  });
})();
