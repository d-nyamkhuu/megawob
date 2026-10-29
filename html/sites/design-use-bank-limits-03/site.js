// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) =>
      function overlay(ctx) {
        const { K } = S;
        const { rng, util, kind } = ctx;
        const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
        const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
        const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
        el.dataset.role = 'overlay';
        if (kind === 'banner' || kind === 'promo') {
          const heading = document.querySelector('.bank-page-heading');
          if (heading) el.style.top = `${heading.getBoundingClientRect().bottom + 8}px`;
        }
        const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
        util.el(
          'div',
          'ref-ov-text',
          box,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
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
    'frame.layout': (base, S) =>
      function (_c) {
        const { ctx } = _c;
        const W = window.innerWidth;
        const H = window.innerHeight;
        const roomy = W >= 1260;
        const tall = H >= 700;
        let display = ctx.display || 'header';
        if (display === 'panel' && !roomy) display = 'header';
        if (display === 'toast' && !tall) display = 'header';
        // reset() reuses the body: a previous toast must not shrink later episodes.
        document.body.classList.toggle('ref-has-note', display === 'toast');
        document.body.dataset.bankDisplay = display;
        Object.assign(_c, { H, W, display, roomy, tall });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const bankHead = util.el('div', 'bank-titlebar', header);
        util.el('div', 'bank-mark', bankHead, '◆');
        util.el('div', 'bank-wordmark', bankHead, 'Riverton Bank');
        const search = util.el('div', 'bank-search', bankHead, '⌕　Search transactions, payees, or help...');
        const avatar = util.el('div', 'bank-avatar', bankHead, 'JS');
        S.frameBrand(_c, header);
        Object.assign(_c, { avatar, bankHead, header, search });
      },
    'frame.tools': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
        let submit = null;
        const headerTools = util.el('div', 'ref-tools', header);
        for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
        if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
        if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
        if (placement === 'icon') {
          submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
        }
        const menu = util.el('nav', 'bank-menubar', document.body);
        for (const item of ['File', 'Edit', 'View', 'Accounts', 'Payments', 'Cards', 'Tools', 'Help']) {
          util.el('span', 'bank-menu-item', menu, item);
        }
        const toolbar = util.el('nav', 'bank-toolbar', document.body);
        const toolbarItems = [
          ['<path d="m3 11 9-8 9 8M6 9v12h12V9"/>', 'Home'],
          ['<path d="M3 7h17m-4-4 4 4-4 4M21 17H4m4-4-4 4 4 4"/>', 'Transfers'],
          ['<rect x="5" y="2" width="14" height="20" rx="1"/><path d="M8 7h8M8 11h8M8 15h8M8 18h6"/>', 'Pay bills'],
          [
            '<rect x="2" y="4" width="20" height="16" rx="2" fill="currentColor"/><path d="M6 12h5" stroke="white"/>',
            'Cards',
          ],
          ['<circle cx="4" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="20" cy="12" r="1"/>', 'More'],
        ];
        for (const [icon, text] of toolbarItems) {
          const item = util.el('div', `bank-tool${text === 'Cards' ? ' selected' : ''}`, toolbar);
          util.el('span', 'bank-tool-icon', item).innerHTML =
            `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icon}</svg>`;
          util.el('span', 'bank-tool-label', item, text);
        }
        Object.assign(_c, { headerTools, menu, submit, toolbar, toolbarItems });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);

        // The reference page keeps the two common card preferences visible beneath the limit form.
        const extras = util.el('div', 'bank-card-settings', document.body);
        util.el('h3', '', extras, 'Other card settings');
        const settingRow = (icon, title, copy, value, on) => {
          const row = util.el('div', 'bank-setting-row', extras);
          util.el('span', `bank-setting-icon ${on ? 'green' : ''}`, row).innerHTML = icon;
          const desc = util.el('div', 'bank-setting-copy', row);
          util.el('strong', '', desc, title);
          util.el('span', '', desc, copy);
          const control = util.el('span', `bank-setting-switch${on ? ' on' : ''}`, row);
          util.el('span', 'bank-setting-value', row, value);
        };
        settingRow(
          '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="6" y="13" width="20" height="15" rx="2" fill="none" stroke="currentColor" stroke-width="2.8"/><path d="M10 13V9a6 6 0 0 1 12 0v4" fill="none" stroke="currentColor" stroke-width="2.8"/></svg>',
          'Card status',
          "Lock your card temporarily if it's lost or you suspect fraud.",
          'Unlocked',
          false,
        );
        settingRow(
          '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" stroke-width="2.6"/><path d="M4 16h24M16 4c4 4 5 8 5 12s-1 8-5 12c-4-4-5-8-5-12s1-8 5-12Z" fill="none" stroke="currentColor" stroke-width="2.3"/></svg>',
          'International transactions',
          'Allow transactions outside the United States.',
          'Allowed',
          true,
        );
        const help = util.el('aside', 'bank-help', body);
        util.el('h2', '', help, 'About card controls');
        util.el(
          'p',
          'bank-help-intro',
          help,
          'Use these settings to help keep your account secure and stay in control of your spending.',
        );
        const tips = [
          [
            '<svg viewBox="0 0 32 32" aria-hidden="true"><g fill="currentColor"><rect x="5" y="17" width="5" height="12" rx="2.4"/><rect x="14" y="2" width="5" height="27" rx="2.4"/><rect x="23" y="12" width="5" height="17" rx="2.4"/></g></svg>',
            'Daily spending limit',
            'Set a daily limit for purchases and ATM withdrawals. This can help you manage your spending and prevent unauthorized transactions.',
          ],
          [
            '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="6" y="14" width="20" height="15" rx="2" fill="none" stroke="currentColor" stroke-width="2.8"/><path d="M10 14V9a6 6 0 0 1 12 0v5" fill="none" stroke="currentColor" stroke-width="2.8"/></svg>',
            'Lock or unlock your card',
            "Temporarily lock your card if it's lost or you suspect fraud. You can unlock it at any time.",
          ],
          [
            '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" stroke-width="2.6"/><path d="M4 16h24M16 4c4 4 5 8 5 12s-1 8-5 12c-4-4-5-8-5-12s1-8 5-12Z" fill="none" stroke="currentColor" stroke-width="2.3"/></svg>',
            'International transactions',
            'Choose whether to allow transactions outside the United States. You can change this setting whenever you travel.',
          ],
          [
            '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="3" y="7" width="26" height="19" rx="2" fill="none" stroke="currentColor" stroke-width="2.6"/><path d="M4 13h24" stroke="currentColor" stroke-width="3"/></svg>',
            'Need more help?',
            'Visit our Help Center for more information about card controls, spending limits, and security tips.',
          ],
        ];
        for (const [icon, title, copy] of tips) {
          const row = util.el('div', 'bank-help-row', help);
          util.el('span', 'bank-help-icon', row).innerHTML = icon;
          const text = util.el('div', '', row);
          util.el('strong', '', text, title);
          util.el('p', '', text, copy);
        }
        util.el('a', 'bank-help-link', help, 'Go to Help Center　→');
        Object.assign(_c, { extras, help, settingRow, stage, tips });
      },
  };

  env.site({
    name: 'design-use-bank-limits-03',
    template: 'site/base',
    design: { parts },
  });
})();
