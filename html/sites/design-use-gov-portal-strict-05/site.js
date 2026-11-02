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
      const brand = header.querySelector('.ref-brand');
      brand.replaceChildren();
      const brandCopy = util.el('div','council-copy',brand);
      util.el('div','council-name',brandCopy,'Rivermere Council');
      util.el('div','council-motto',brandCopy,'People · Services · A Stronger Community');
      const civicNav = util.el('nav', 'ref-nav', document.body);
      const icons = [
        '<path d="M5 1h11l6 6v24H5z"/><path d="M16 1v7h6M9 13h9M9 18h9M9 23h7" fill="none" stroke="#087f8d" stroke-width="2"/>',
        '<circle cx="14" cy="7" r="6"/><path d="M3 31v-5c0-12 22-12 22 0v5z"/>',
        '<path d="M1 6h26v21H1z"/><path d="m1 6 13 12L27 6M1 27l9-11m17 11-9-11" fill="none" stroke="#083357" stroke-width="2"/>',
        '<path d="M5 1h11l6 6v24H5z"/><path d="M16 1v7h6M9 13h9M9 18h9M9 23h7" fill="none" stroke="#083357" stroke-width="2"/>',
        '<circle cx="14" cy="7" r="5"/><circle cx="4" cy="11" r="4"/><circle cx="24" cy="11" r="4"/><path d="M7 31V20c0-8 14-8 14 0v11zM0 29V20c0-5 5-6 7-3-2 3-2 8-2 12zm23 0V20c0-1 0-2-1-3 4-3 6-1 6 3v9z"/>',
        '<path d="m1 14 13-12 13 12-3 3-10-10L4 17zM5 17l9-8 9 8v14h-7V21h-5v10H5z"/>',
        '<ellipse cx="18" cy="5" rx="9" ry="4"/><path d="M9 8q9 6 18 0v4q-9 6-18 0zm0 7q9 6 18 0v4q-9 6-18 0z"/><ellipse cx="9" cy="21" rx="9" ry="4"/><path d="M0 24q9 6 18 0v4q-9 6-18 0zM20 23h7v4h-7z"/>',
        '<path d="M9 5V1h11v4h7v24H1V5zm3 0h5V3h-5z"/><path d="M1 15h26M11 13h6v5h-6z" fill="none" stroke="#083357" stroke-width="2"/>',
        '<circle cx="14" cy="7" r="5"/><circle cx="4" cy="11" r="4"/><circle cx="24" cy="11" r="4"/><path d="M7 31V20c0-8 14-8 14 0v11zM0 29V20c0-5 5-6 7-3-2 3-2 8-2 12zm23 0V20c0-1 0-2-1-3 4-3 6-1 6 3v9z"/>',
        '<circle cx="14" cy="16" r="14"/><path d="M10 10c0-7 12-7 12 0 0 5-7 5-7 10m0 3v4" fill="none" stroke="#083357" stroke-width="3"/>',
        '<path d="M5 1 1 5c-2 8 12 25 21 27l6-6-7-6-5 4C10 20 7 15 6 11l5-4z"/>'
      ];
      let iconIndex = 0;
      for (const item of ['Applications', 'My Details', 'Messages', 'Saved Drafts', 'Benefits & Support', 'Housing', 'Council Tax', 'Employment', 'Community', 'Help', 'Contact Us']) {
        const a = util.el('a', 'ref-navlink', civicNav);
        const icon = util.el('span','rail-icon',a);
        icon.innerHTML = '<svg viewBox="0 0 28 34" aria-hidden="true" fill="currentColor">' + icons[iconIndex++] + '</svg>';
        util.el('span','rail-label',a,item);
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
      util.el('h2', 'ref-inspector-title', inspector, 'Help and guidance');
      util.el('h3', 'ref-help-heading', inspector, 'About this application');
      util.el('p', 'ref-help-copy', inspector, 'Use this form to apply for civic support. Fill in the details that apply to you. We will use the information to check your eligibility and may contact you for further evidence.');
      util.el('h3', 'ref-help-heading ref-tips-heading', inspector, 'Tips for completing the form');
      const tips = util.el('ul', 'ref-help-tips', inspector);
      for (const tip of ['Only enter details that apply to you.', 'Your identity number, date of birth and postcode must be in the formats shown.', 'Choose how you would like us to contact you.', 'Read and confirm the declaration before submitting.']) util.el('li', '', tips, tip);
      util.el('h3', 'ref-help-heading ref-more-heading', inspector, 'Further information');
      const info = util.el('div', 'ref-help-links', inspector);
      for (const item of ['Who can apply?', 'What evidence is needed?', 'How we use your information', 'Privacy and data protection']) util.el('a', '', info, '↗  ' + item);
      const taskPanel = body.querySelector('.ref-panel');
      if (taskPanel) inspector.append(taskPanel);
      Object.assign(_c, { inspector, taskPanel });
    },
  };

  env.site({
    name: 'design-use-gov-portal-strict-05',
    template: 'site/base',
    design: { parts },
  });
})();
