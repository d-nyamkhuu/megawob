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
      const workspace = document.querySelector('.ref-body');
      const bottomDock = document.querySelector('.ref-float-dock') || document.querySelector('.ref-foot');
      const bottomSpace = bottomDock ? bottomDock.getBoundingClientRect().height : 0;
      if (kind === 'banner' && workspace) el.style.top = `${workspace.getBoundingClientRect().top}px`;
      if (kind === 'promo' && workspace) {
        el.style.top = `${workspace.getBoundingClientRect().top}px`;
        el.style.bottom = `${bottomSpace}px`;
      }
      if (kind === 'cookie') el.style.bottom = `${bottomSpace}px`;
      if (kind === 'chat') el.style.bottom = `${bottomSpace + 16}px`;
      if (kind === 'toast' && workspace) el.style.top = `${workspace.getBoundingClientRect().top + 12}px`;
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
      const officeBrand = util.el('div', 'ref-office-brand', header);
      util.el('span', 'ref-office-swoosh', officeBrand, '');
      util.el('strong', '', officeBrand, 'NIMBUS');
      util.el('span', '', officeBrand, 'OFFICE');
      S.frameBrand(_c, header);
      Object.assign(_c, { header, officeBrand });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      const officeTabs = util.el('nav', 'ref-office-tabs', header);
      for (const text of ['Home', 'Mail', 'Accounts Payable', 'Documents', 'Contacts', 'Reports']) {
        const tab = util.el('a', text === 'Mail' ? 'office-tab active' : 'office-tab', officeTabs, text);
        tab.addEventListener('click', () => env.log('decoy', { what: 'nav', label: text }));
      }
      const search = util.el('div', 'ref-office-search', header);
      util.el('span', 'ref-search-field', search, 'Search Mail & Documents');
      const searchButton = util.el('button', 'ref-search-button', search, 'Search');
      searchButton.addEventListener('click', () => env.log('decoy', { label: 'Search' }));
      Object.assign(_c, { officeTabs, search, searchButton });
    },
    'frame.floating': (base, S) => function (_c) {
      const { endBtn, header, label, placement, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      // The title-area note occupies its own line below the application's tabs.
      const instruction = header.querySelector('.ref-instruction');
      if (instruction) header.after(instruction);
      const foot = document.querySelector('.ref-foot');
      if (foot && !foot.querySelector('.ref-tools').children.length) foot.style.display = 'none';
      Object.assign(_c, { foot, instruction, submit });
    },
  };

  env.site({
    name: 'design-avoid-phishing-link-03',
    template: 'site/base',
    design: { parts },
  });
})();
