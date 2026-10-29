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
      if (kind === 'banner') el.style.top = `${document.querySelector('.ref-task').getBoundingClientRect().bottom}px`;
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
    'frame.header': (base, S) => function (_c) {
      const { display, util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      document.body.dataset.instructionDisplay = display;
      const menu = util.el('nav', 'wire-menubar', header);
      for (const item of ['File', 'Edit', 'View', 'Invoice', 'Vendor', 'Reports', 'Tools', 'Help']) {
        const link = util.el('a', 'wire-menu-item', menu, item);
        link.href = '#';
        link.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'menu', label: item }); });
      }
      const toolbar = util.el('div', 'wire-toolbar', header);
      const tabIcons = {
        Mail: '<rect x="2" y="4" width="20" height="16" rx="1"/><path d="m3 5 9 7 9-7"/>',
        'Accounts Payable': '<path d="M6 2h9l5 5v15H6zM14 2v6h6M10 12h6M10 16h6M10 19h4"/>',
        Vendors: '<circle cx="9" cy="7" r="3"/><path d="M2 21v-3c0-5 14-5 14 0v3zM16 4c5 0 5 7 0 7M19 14c3 1 3 3 3 7h-3"/>',
        Reports: '<path d="M3 14v8M9 8v14M15 3v19M21 7v15" stroke-width="3"/>',
        Settings: '<path d="m10 2 4 0 .7 3 2 .9 2.8-1.1 2 3.5-2.2 2.1v2.3l2.2 2.1-2 3.5-2.8-1.1-2 .9-.7 3h-4l-.7-3-2-.9-2.8 1.1-2-3.5 2.2-2.1v-2.3L2.5 8.3l2-3.5 2.8 1.1 2-.9z"/><circle cx="12" cy="12" r="3.5"/>',
      };
      for (const label of ['Mail', 'Accounts Payable', 'Vendors', 'Reports', 'Settings']) {
        const button = util.el('button', 'wire-tool', toolbar);
        button.type = 'button';
        const icon = util.el('span', 'wire-tool-icon', button);
        icon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${tabIcons[label]}</svg>`;
        util.el('span', '', button, label);
        button.addEventListener('click', () => env.log('decoy', { what: 'toolbar', label }));
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { header, menu, tabIcons, toolbar });
    },
    'frame.floating': (base, S) => function (_c) {
      const { endBtn, header, headerTools, label, placement, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      header.classList.toggle('wire-has-header-tools', headerTools.childElementCount > 0);
      Object.assign(_c, { submit });
    },
  };

  env.site({
    name: 'design-avoid-phishing-wire-03',
    template: 'site/base',
    design: { parts },
  });
})();
