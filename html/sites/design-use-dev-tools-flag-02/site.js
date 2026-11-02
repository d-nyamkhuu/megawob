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
        brand.innerHTML = '<span class="ref-app-mark"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.6 8-4.6M12 12v9"/></svg></span><span>AcmeApp</span><span class="ref-brand-caret">⌄</span>';
        brand.dataset.role = 'brand';
      }
      if (true) {
        const n = util.el('nav', 'ref-nav', header);
        for (const item of ['Overview', 'Code', 'Pipelines', 'Observability', 'Database', 'Feature Flags', 'Settings']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      const notification = util.el('span', 'ref-toolbar-icon', headerTools);
      notification.setAttribute('aria-label', 'Notifications');
      notification.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg>';
      const account = util.el('span', 'ref-account-avatar', headerTools, 'JD');
      account.setAttribute('aria-label', 'Account');
      Object.assign(_c, { account, headerTools, notification, submit });
    },
    'frame.body': (base, S) => function (_c) {
      const { showIndex, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      if (showIndex) {
        const side = util.el('aside', 'ref-side', body);
        util.el('div', 'ref-index-title', side, 'Project');
        const navIcons = {
          Overview:'<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>',
          Code:'<path d="m8 5-6 7 6 7m8-14 6 7-6 7m-2-18-4 24"/>',
          'Pull requests':'<circle cx="7" cy="5" r="2"/><circle cx="17" cy="19" r="2"/><path d="M7 7v10a2 2 0 0 0 2 2h6m2-2V7a2 2 0 0 0-2-2h-2"/>',
          Pipelines:'<circle cx="12" cy="5" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><path d="m11 7-5 9m7-9 5 9M7 18h10"/>',
          Environments:'<path d="M4 5h16v5H4zM4 14h16v5H4zM7 7.5h.01M7 16.5h.01"/>',
          'Feature flags':'<path d="M5 21V3m1 1h12l-3 4 3 4H6"/>',
          Logs:'<path d="M6 3h9l4 4v14H6zM15 3v5h4M9 12h7M9 16h7"/>',
          Metrics:'<path d="M4 20v-8h4v8m2 0V4h4v16m2 0V9h4v11"/>',
          Traces:'<circle cx="5" cy="7" r="2"/><circle cx="18" cy="5" r="2"/><circle cx="13" cy="18" r="2"/><path d="m7 7 9-2m-9 4 5 7m6-9-4 9"/>',
          Database:'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
          Settings:'<circle cx="12" cy="12" r="3"/><path d="m19 13 2 1-2 4-2-1-2 1v2h-5v-2l-2-1-2 1-2-4 2-1v-2l-2-1 2-4 2 1 2-1V4h5v2l2 1 2-1 2 4-2 1z"/>'
        };
        for (const [i, item] of ['Overview', 'Code', 'Pull requests', 'Pipelines', 'Environments', 'Feature flags', 'Logs', 'Metrics', 'Traces', 'Database', 'Settings'].entries()) {
          const a = util.el('a', 'ref-sidelink', side, item);
          a.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${navIcons[item]}</svg><span class="ref-side-label">${item}</span>`;
          if (i === 5) a.classList.add('selected');
          if (i === 2) util.el('span', 'ref-index-status', a, '3');
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
        util.el('div', 'ref-index-title ref-recent-title', side, 'Recent');
        for (const item of ['payment-service', 'search-service', 'frontend', 'fraud-detection', 'mobile-app']) {
          const a = util.el('a', 'ref-sidelink ref-recent', side);
          a.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.6 8-4.6"/></svg><span class="ref-side-label">${item}</span>`;
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'recent', label: item }); });
        }
      }
      Object.assign(_c, { body });
    },
    'frame.panel': (base, S) => function (_c) {
      const { body, ctx, display, header, lr, rng, util, word } = _c;
      const { K } = S;
      if (display === 'panel') {
        const panel = util.el('aside', 'ref-panel', body);
        const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
        if (rng.bool(0.5)) body.classList.add('ref-panel-right');
      }
      const backdrop = util.el('section', 'ref-backdrop', body);
      util.el('h1', '', backdrop, 'Feature flags');
      util.el('p', '', backdrop, 'Manage feature flags across environments and segments.');
      if (display === 'header') {
        backdrop.lastElementChild.classList.add('ref-header-subtitle');
        backdrop.appendChild(header.querySelector('.ref-instruction'));
      }
      const summary = util.el('div', 'ref-back-cards', backdrop);
      const envCard = util.el('div', 'ref-back-card ref-env-card', summary);
      util.el('strong', 'ref-back-title', envCard, 'Flags by environment');
      for (const [name, count, color] of [['Production','42','green'],['Staging','38','blue'],['Development','41','gray']]) {
        const row = util.el('div', 'ref-back-row', envCard);
        util.el('i', `ref-status-dot ${color}`, row);
        util.el('span', '', row, name);
        util.el('span', 'ref-back-count', row, count);
      }
      const activity = util.el('div', 'ref-back-card ref-activity-card', summary);
      util.el('strong', 'ref-back-title', activity, 'Recent activity');
      for (const [name, detail, time, color] of [
        ['user-dashboard','Updated rule for Staging','2 hours ago','green'],
        ['checkout-v2','Enabled for 10% (Staging)','5 hours ago','green'],
        ['fraud-detection','Disabled for Internal team','1 day ago','gray'],
        ['search-rewrite','Updated targeting rules','2 days ago','blue']
      ]) {
        const row = util.el('div', 'ref-activity-row', activity);
        util.el('i', `ref-status-dot ${color}`, row);
        const copy = util.el('div', 'ref-activity-copy', row);
        util.el('strong', '', copy, name);
        util.el('span', '', copy, detail);
        util.el('small', '', copy, time);
      }
      const about = util.el('aside', 'ref-about', body);
      util.el('strong', '', about, 'About feature flags');
      util.el('p', '', about, 'Use feature flags to safely roll out features, run experiments, and control access by environment and user segment.');
      util.el('a', '', about, 'Learn more');
      util.el('hr', '', about);
      util.el('strong', '', about, 'Flag lifecycle');
      for (const [title, text, color] of [['On', 'Feature is enabled', 'green'], ['Off', 'Feature is disabled', 'gray'], ['Targeted', 'Enabled for specific segments', 'blue'], ['Experiment', 'Used for A/B testing', 'purple']]) {
        const row = util.el('div', 'ref-legend-row', about);
        util.el('i', `ref-status-dot ${color}`, row);
        const copy = util.el('div', '', row);
        util.el('span', '', copy, title);
        util.el('small', '', copy, text);
      }
      util.el('hr', '', about);
      util.el('strong', '', about, 'Tips');
      util.el('p', '', about, '• Flags are evaluated by environment, then segment.');
      util.el('p', '', about, '• Changes take effect quickly after saving.');
      util.el('p', '', about, '• Use descriptive names and keep flags focused.');
      Object.assign(_c, { about, activity, backdrop, envCard, summary });
    },
    'frame.footer': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
      let { submit } = _c;
      if (wantFooter) {
        const foot = util.el('footer', 'ref-foot', document.body);
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
      const dock = util.el('nav', 'ref-bottom-dock', document.body);
      for (const item of ['Home', 'Code', 'Pipelines', 'Environments', 'Feature flags', 'Logs', 'Metrics', 'Database']) {
        const a = util.el('span', 'ref-dock-item', dock);
        const paths = {
          Home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
          Code: '<path d="m8 5-6 7 6 7M16 5l6 7-6 7M14 3l-4 18"/>',
          Pipelines: '<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="18" r="2.5"/><circle cx="19" cy="18" r="2.5"/><path d="M10.5 7 6.5 16M13.5 7l4 9M7.5 18h9"/>',
          Environments: '<rect x="3" y="3" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="7" rx="2"/><path d="M7 6.5h.01M7 17.5h.01"/>',
          'Feature flags': '<path d="M5 21V3m1 1h12l-3 4 3 4H6"/>',
          Logs: '<path d="M6 3h9l4 4v14H6zM15 3v5h4M9 12h7M9 16h7"/>',
          Metrics: '<path d="M4 20V11h4v9M10 20V4h4v16M16 20V8h4v12"/>',
          Database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>'
        };
        a.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[item]}</svg><span>${item}</span>`;
        if (item === 'Feature flags') a.classList.add('active');
      }
      Object.assign(_c, { dock, submit });
    },
    'frame.floating': (base, S) => function (_c) {
      const { backdrop, body, endBtn, label, placement, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      const headerNote = backdrop.querySelector('.ref-instruction');
      const noteBottom = headerNote ? headerNote.getBoundingClientRect().bottom - body.getBoundingClientRect().top : 0;
      document.body.style.setProperty('--flag-note-top', `${Math.max(102, Math.ceil(noteBottom + 16))}px`);
      Object.assign(_c, { headerNote, noteBottom, submit });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-dev-tools-flag-02',
    template: 'site/base',
    design: { parts },
  });
})();
