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
      el.dataset.role = 'overlay';
      if (kind === 'banner') el.style.top = document.querySelector('.ref-task').getBoundingClientRect().bottom + 'px';
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
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      util.el('div', 'ap-title', header, 'Approve Invoices');
      util.el('div', 'ap-date', header, 'Thu, Apr 24, 2003');
      S.frameBrand(_c, header);
      Object.assign(_c, { header });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);

      Object.assign(_c, { stage });
    },
    'frame.floating': (base, S) => function (_c) {
      const { endBtn, header, headerTools, label, placement, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // The desk reserves the right side of its form footer for the episode ending.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }

      // LedgerPro's horizontal product bar and purchase workspace header.
      const product = util.el('div', 'lp-productbar', header);
      const brand = util.el('div', 'lp-brand', product);
      const logo = util.el('span', 'lp-mark', brand);
      logo.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#0878ff" d="M29 2C12-1 2 8 2 23c0 5 2 7 8 7C25 31 31 18 29 2Z"/><path fill="none" stroke="white" stroke-width="1.5" d="M2 30 28 3M7 25c1-7 5-10 13-10"/></svg>';
      util.el('strong', '', brand, 'LedgerPro');
      const primary = util.el('nav', 'lp-primary-nav', product);
      for (const item of ['Dashboard', 'Banking', 'Expenses', 'Sales', 'Purchases', 'Accounting', 'Reports']) {
        const a = util.el('a', item === 'Purchases' ? 'active' : '', primary, item);
        a.href = '#'; a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
      }
      const user = util.el('div', 'lp-user', product);
      const search = util.el('span', 'lp-search-icon', user);
      search.innerHTML = '<svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="10" cy="10" r="7"/><path d="m15 15 7 7"/></svg>';
      const bell = util.el('span', 'lp-bell', user);
      bell.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 17h14l-2-4V9a5 5 0 0 0-10 0v4Zm5 3a2 2 0 0 0 4 0M12 2v2"/></svg>';
      util.el('span', 'lp-avatar', user, 'JS');
      util.el('span', '', user, 'Jordan Smith⌄');
      const pagehead = util.el('div', 'lp-pagehead', header);
      const titlearea = util.el('div', 'lp-titlearea', pagehead);
      const tabs = util.el('nav', 'lp-tabs', titlearea);
      for (const item of ['Invoices', 'Bills', 'Payments', 'Vendors']) {
        const a = util.el('a', item === 'Invoices' ? 'active' : '', tabs, item);
        a.href = '#'; a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'tab', label: item }); });
      }
      const metrics = util.el('div', 'lp-metrics', pagehead);
      for (const [value, caption, glyph, cls] of [
        ['12', 'Pending Approval', '◷', 'amber'], ['3', 'Over Threshold', '!', 'red'],
        ['28', 'Approved (This Month)', '✓', 'green'], ['5', 'Rejected (This Month)', '×', 'red']
      ]) {
        const card = util.el('div', `lp-metric ${cls}`, metrics);
        util.el('strong', '', card, value);
        const statusIcon = util.el('span', '', card);
        const strokes = glyph === '◷' ? '<path d="M12 5v7l4 2"/>' : glyph === '!' ? '<path d="M12 6v7m0 3v1"/>' : glyph === '✓' ? '<path d="m7 12 3 3 7-7"/>' : '<path d="m8 8 8 8m0-8-8 8"/>';
        statusIcon.innerHTML = '<svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="10"/>' + strokes + '</svg>';
        util.el('small', '', card, caption);
      }
      // Keep episode text and controls, but place them in the task header's title band.
      header.appendChild(product);
      header.appendChild(pagehead);
      titlearea.prepend(header.querySelector('.ap-title'));
      const instruction = header.querySelector('.ref-instruction');
      if (instruction) titlearea.appendChild(instruction);
      pagehead.appendChild(headerTools);
      const legacy = header.querySelector('.ap-date');
      if (legacy) legacy.remove();
      for (const old of header.querySelectorAll('.ref-brand, .ref-nav, .ref-spacer')) old.remove();
      Object.assign(_c, { bell, brand, instruction, legacy, logo, metrics, pagehead, primary, product, search, submit, tabs, titlearea, user });
    },
  };

  env.site({
    name: 'design-use-accounting-approve-03',
    template: 'site/base',
    design: { parts },
  });
})();
