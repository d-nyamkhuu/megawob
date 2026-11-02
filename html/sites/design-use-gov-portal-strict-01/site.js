// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) => function overlay(ctx) {
      const { K } = S;
      const { rng, util, kind } = ctx;
      const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
      if (kind === 'banner') {
        const heading = document.querySelector('.gov-head');
        el.style.top = `${heading ? heading.getBoundingClientRect().bottom : 60}px`;
      }
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
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.nav': (base, S) => function (_c) {
      const { content, header, local, nav, rng, util } = _c;
      const { K } = S;
      if (nav) {
        const n = util.el('nav', 'ref-seeded-nav', header);
        for (const item of local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav)) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      if (!header.querySelector('.ref-brand')) util.el('div', 'ref-brand', header);
      const civicNav = util.el('nav', 'ref-nav', header);
      for (const item of ['Home', 'Benefits', 'Housing', 'Council Tax', 'Services', 'My Account']) {
        const a = util.el('a', 'ref-navlink', civicNav, item);
        a.addEventListener('click', e => { e.preventDefault(); env.log('decoy', {what:'nav',label:item}); });
      }
      const accountTools = util.el('div', 'ref-account-tools', header);
      util.el('span', 'ref-search', accountTools, 'Search');
      util.el('span', 'ref-account-name', accountTools, 'My Account');
      Object.assign(_c, { accountTools, civicNav });
    },
    'frame.panel': (base, S) => function (_c) {
      const { body, ctx, display, lr, rng, util, word } = _c;
      const { K } = S;
      if (display === 'panel') {
        const panel = util.el('aside', 'ref-panel', body);
        const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
        if (rng.bool(0.5)) body.classList.add('ref-panel-right');
      }
      const inspector = util.el('aside', 'ref-inspector', body);
      util.el('h2', 'ref-inspector-title', inspector, 'Application details');
      const details = util.el('dl', 'ref-inspector-details', inspector);
      for (const [key, value] of [['Scheme', 'Civic Support'], ['Applicant', 'Applicant record'],
        ['Status', 'Not started'], ['Correspondence', 'Not selected']]) {
        util.el('dt', '', details, key);
        util.el('dd', key === 'Status' ? 'ref-status' : '', details, value);
      }
      const evidence = util.el('section', 'ref-evidence', inspector);
      util.el('h3', '', evidence, 'Required evidence');
      for (const item of ['Proof of identity', 'Proof of address', 'Proof of income']) {
        const row = util.el('div', 'ref-evidence-row', evidence);
        const icon = util.el('span', 'ref-evidence-icon', row);
        icon.innerHTML = '<svg viewBox="0 0 24 28" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M4 2h10l7 7v17H4zM14 2v8h7M8 15h9M8 20h9"/></svg>';
        util.el('span', '', row, item);
        util.el('span', 'ref-evidence-status', row, 'Not added');
      }
      const taskPanel = body.querySelector('.ref-panel');
      if (taskPanel) inspector.append(taskPanel);
      Object.assign(_c, { details, evidence, inspector, taskPanel });
    },
  };

  env.site({
    name: 'design-use-gov-portal-strict-01',
    template: 'site/base',
    design: { parts },
  });
})();
