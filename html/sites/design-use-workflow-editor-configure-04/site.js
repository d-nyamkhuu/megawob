// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  const TITLES = ['Relayboard'];

  const parts = {
    overlay: (base, S) => function overlay(ctx) {
      const { K } = S;
      const { rng, util, kind } = ctx;
      const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
      el.dataset.role = 'overlay';
      const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
      util.el('div', 'ref-ov-text', box, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
      const row = util.el('div', 'ref-ov-row', box);
      const btn = (label, how, primary) => {
        if (word && K.button[label]) label = word(K.button[label]);
        const b = util.el('button', primary ? 'ref-ov-btn ref-ov-primary' : 'ref-ov-btn', row, label);
        b.type = 'button';
        b.addEventListener('click', () => (how ? ctx.dismiss(how) : env.log('overlay-click', { label })));
        return b;
      };
      let dismiss;
      if (kind === 'cookie') {
        if (rng.bool(0.5)) btn('Settings', null, false);
        btn(rng.pick(['Reject all', 'Necessary only']), 'reject', false);
        dismiss = btn(rng.pick(['Accept all', 'Accept', 'Got it']), 'accept', true);
      } else if (kind === 'promo') {
        dismiss = btn(rng.pick(['No thanks', 'Maybe later', 'Close']), 'close', false);
        btn(rng.pick(['Upgrade now', 'Start trial', 'Learn more']), null, true);
      } else if (kind === 'banner') {
        dismiss = btn('Dismiss', 'close', false);
      } else {
        dismiss = btn('×', 'close', false);
        dismiss.setAttribute('aria-label', word ? word('close') : 'Close');
      }
      if (kind === 'promo') {
        const art = util.el('div', 'rb-promo-art', box);
        const envelope = util.svg('svg', { viewBox: '0 0 120 120', fill: 'none', stroke: '#253c2b', 'stroke-width': 2.4 }, art);
        util.svg('path', { d: 'm27 43 65-9 7 49-65 9Zm0 0 39 23 26-32M34 92l25-31m40 22L72 62' }, envelope);
        const title = util.el('h2', 'rb-promo-title', box, 'Get product updates');
        box.prepend(art, title);
        el.style.top = '66px';
        el.style.bottom = '62px';
      }
      if (kind === 'banner') {
        el.style.top = document.querySelector('.ref-summary').getBoundingClientRect().top + 12 + 'px';
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (!header.querySelector('.ref-brand')) {
        const brand = util.el('div', 'ref-brand ref-brand-fallback', header, 'Relayboard');
        brand.dataset.role = 'brand';
      }
      if (!header.querySelector('.ref-nav')) {
        const n = util.el('nav', 'ref-nav ref-nav-fallback', header);
        for (const item of ['Workflows', 'Integrations', 'Activity', 'Library']) {
          util.el('span', 'ref-navlink', n, item);
        }
      }
      const brandMark = util.svg('svg', { viewBox: '0 0 28 30', class: 'rb-brand-mark', fill: 'none', stroke: '#75642c', 'stroke-width': 2 }, header.querySelector('.ref-brand'));
      util.svg('path', { d: 'M13 17C4 17 3 10 3 5c7 1 11 5 10 12Zm3 0c9 0 10-7 10-12-7 1-11 5-10 12ZM12 22c-5-5-11-2-8 2 3 3 7 1 8-2Zm5 0c5-5 11-2 8 2-3 3-7 1-8-2Z' }, brandMark);
      const quick = util.el('div', 'rb-quick-tools', header);
      const search = util.el('div', 'rb-search', quick);
      const searchIcon = util.svg('svg', { viewBox: '0 0 24 24', class: 'rb-search-icon', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.7 }, search);
      util.svg('circle', { cx: 10, cy: 10, r: 6.6 }, searchIcon);
      util.svg('path', { d: 'm15 15 5 5' }, searchIcon);
      util.el('span', 'rb-search-label', search, 'Search workflows...');
      const bell = util.el('span', 'rb-bell', quick);
      bell.setAttribute('aria-label', 'Notifications');
      const bellIcon = util.svg('svg', { viewBox: '0 0 28 32', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.8 }, bell);
      util.svg('path', { d: 'M4 24h20c-3-2-4-5-4-11a6 6 0 0 0-12 0c0 6-1 9-4 11ZM12 28a2 2 0 0 0 4 0M13 5V3h2v2' }, bellIcon);
      const avatar = util.el('span', 'rb-avatar', quick, 'JK');
      const summary = util.el('section', 'ref-summary', document.body);
      const summaryMain = util.el('div', 'ref-summary-main', summary);
      const workflowTitle = util.el('h1', 'ref-summary-title', summaryMain, 'Customer Onboarding');
      util.el('span', 'rb-title-more', workflowTitle, '···');
      const metadata = util.el('div', 'ref-summary-meta', summaryMain);
      util.el('span', 'rb-active', metadata, '●  Active');
      util.el('span', 'rb-updated', metadata, 'Last updated Jun 14, 2023, 10:24 AM');
      util.el('span', 'rb-owner', metadata, 'By Jordan Kim');
      util.el('p', 'ref-summary-description', summaryMain,
        'Automates key onboarding steps for new customers, including record setup, notifications, and team assignment.');
      if (display === 'header') {
        const note = util.el('div', 'ref-instruction rb-header-note', null, ctx.instruction);
        summary.before(note);
      }
      const metrics = util.el('div', 'ref-summary-metrics', summary);
      for (const [value, label] of [['6', 'Steps'], ['2', 'Integrations'], ['4m', 'Estimated run time']]) {
        const metric = util.el('div', 'ref-summary-metric', metrics);
        util.el('strong', '', metric, value);
        util.el('span', '', metric, label);
      }
      Object.assign(_c, { avatar, bell, bellIcon, brandMark, metadata, metrics, quick, search, searchIcon, summary, summaryMain, workflowTitle });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, summary, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const help = util.el('aside', 'rb-help', body);
      const helpHead = util.el('div', 'rb-help-head', help);
      const book = util.svg('svg', { viewBox: '0 0 28 28', class: 'rb-help-icon', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.8 }, helpHead);
      util.svg('path', { d: 'M14 6C10 3 6 3 2 5v18c4-2 8-2 12 1 4-3 8-3 12-1V5c-4-2-8-2-12 1Zm0 0v18' }, book);
      util.el('span', '', helpHead, 'Workflow builder');
      util.el('p', 'rb-help-intro', help, 'Drag steps from the panel to build your workflow. Click a step to configure its settings.');
      const tipsHead = util.el('div', 'rb-tips-head', help);
      const bulb = util.svg('svg', { viewBox: '0 0 28 30', class: 'rb-tips-icon', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.8 }, tipsHead);
      util.svg('path', { d: 'M10 23h8m-7 4h6M9 20c0-5-5-6-5-12a10 10 0 0 1 20 0c0 6-5 7-5 12v3H9Zm5-18c-4 1-5 3-5 6' }, bulb);
      util.el('span', '', tipsHead, 'Tips');
      const tips = util.el('ul', 'rb-tips', help);
      for (const item of ['Connect steps by dragging from an output port to an input port.', 'Use conditions to branch your workflow.', 'Add delays to control timing between steps.', 'Integrate with your favorite apps from the steps panel.']) util.el('li', '', tips, item);
      const taskCard = body.querySelector('.ref-panel');
      if (taskCard) {
        help.prepend(taskCard);
        help.classList.add('rb-has-task');
        summary.classList.add('ref-summary-panel');
        const summaryHeight = summary.getBoundingClientRect().height;
        help.style.marginTop = -summaryHeight + 'px';
        help.style.height = `calc(100% + ${summaryHeight}px)`;
      }
      Object.assign(_c, { book, bulb, help, helpHead, stage, taskCard, tips, tipsHead });
    },
  };

  env.site({
    name: 'design-use-workflow-editor-configure-04',
    template: 'site/base',
    design: { TITLES, parts },
  });
})();
