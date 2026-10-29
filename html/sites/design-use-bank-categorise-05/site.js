// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      base(_c);
      if (_c.ctx.finish) return;
      const pick = _c.rng.fork('rivermere/end/v2');
      if (pick.bool(0.58)) {
        _c.placement = 'footer';
        _c.wantFooter = true;
        _c.label = _c.word ? _c.word('done') : 'Done';
        if (_c.collide && _c.collide.text.trim().toLowerCase() === _c.label.trim().toLowerCase()) {
          _c.collide.text = _c.ctx.content.collideLabel(pick, _c.label);
        }
      }
    },
    overlay: (base, S) => function overlay(ctx) {
      const { K } = S;
      const { rng, util, kind } = ctx;
      const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
      el.dataset.role = 'overlay';
      const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
      if (kind === 'banner' || kind === 'promo') {
        el.style.top = `${document.querySelector('.ref-task').getBoundingClientRect().bottom}px`;
      }
      if (kind === 'promo') util.el('div', 'rb-promo-title', box, 'Rivermere Bank · News and offers');
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
      const caption = util.el('div', 'rb-window-caption', header);
      const mark = util.el('span', 'rb-bank-mark', caption);
      mark.innerHTML = '<svg viewBox="0 0 44 44" aria-hidden="true"><path d="M3 13 22 3l19 10v4H3zM5 19h34v3H5zm3 5h5v13H8zm11 0h5v13h-5zm11 0h5v13h-5zM4 39h36v3H4z" fill="currentColor"/></svg>';
      util.el('strong', '', caption, 'Rivermere Bank');
      const nav = util.el('div', 'rb-head-nav', header);
      util.el('span', '', nav, 'Personal Banking');
      util.el('span', 'rb-head-sep', nav, '|');
      util.el('span', '', nav, 'Transactions');
      S.frameBrand(_c, header);
      Object.assign(_c, { caption, header });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);

      // RISC OS style application iconbar. Keep it separate from the window title.
      const appbar = util.el('nav', 'rb-iconbar', document.body);
      const icons = [
        ['⌂', 'Accounts'], ['⇄', 'Transfers'], ['▤', 'Bill Pay'], ['▤', 'Transactions'],
        ['◕', 'Categories'], ['▰', 'Cards'], ['⬡', 'Disputes'], ['⚙', 'Settings'],
      ];
      const iconArt = {
        Accounts: '<path fill="#d1664f" d="M3 17 20 2l17 15-4 3L20 9 7 21Z"/><path fill="#f4d992" d="M9 18v19h23V18L20 8Z"/><path fill="#80bed7" d="M14 21h6v8h-6Z"/><path fill="#b76e40" d="M23 26h6v11h-6Z"/><path fill="#cc7152" d="M10 4h6v7l-6 6Z"/>',
        Transfers: '<path fill="#65b8a8" d="m24 3 13 12-13 11v-8H11v-7h13Z"/><path fill="#65b8a8" d="M16 15 3 27l13 11v-8h13v-7H16Z"/>',
        'Bill Pay': '<path fill="#e5e8ea" d="M7 3h27v34H7Z"/><path stroke="#40566e" d="M16 10h13M16 17h13M16 24h13M16 31h13M10 10h3M10 17h3M10 24h3M10 31h3"/>',
        Transactions: '<path fill="#e5e8ea" d="M7 3h27v34H7Z"/><path stroke="#40566e" d="M12 9h17M12 15h17M12 21h17M12 27h17M12 32h17"/>',
        Categories: '<path fill="#6ea744" d="M19 3a17 17 0 1 0 17 19H19Z"/><path fill="#6b83c2" d="M23 2v16h15A17 17 0 0 0 23 2Z"/><path fill="#a4b5df" d="m23 22 11 11 4-11Z"/>',
        Cards: '<path fill="#8a72d7" d="M2 8h37v25H2Z"/><path stroke="#373443" d="M3 17h35M6 25h10m7 0h10"/><path stroke="#d8b75b" d="M6 28h7m14 0h7"/>',
        Disputes: '<path fill="#d5e0ec" d="m20 3 13 5v13c0 9-13 17-13 17S7 30 7 21V8Z"/><path fill="#608fbc" d="m20 8 8 4v9c0 5-8 11-8 11s-8-6-8-11v-9Z"/><path fill="none" stroke="white" d="m15 19 4 4 7-8"/>',
        Settings: '<path fill="#aaa" d="m16 3 8 0 1 5 4 2 5-2 4 7-4 4v4l4 4-4 7-5-2-4 2-1 5h-8l-1-5-4-2-5 2-4-7 4-4v-4l-4-4 4-7 5 2 4-2Z"/><circle fill="#ddd" cx="20" cy="21" r="7"/>',
      };
      for (const [glyph, text] of icons) {
        const item = util.el('button', `rb-iconitem${text === 'Transactions' ? ' active' : ''}`, appbar);
        item.type = 'button';
        const icon = util.el('span', 'rb-icon', item);
        icon.innerHTML = `<svg viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg" stroke="#202020" stroke-width="1.8" stroke-linejoin="miter" aria-hidden="true">${iconArt[text]}</svg>`;
        util.el('span', 'rb-icon-label', item, text);
        item.addEventListener('click', () => env.log('decoy', { what: 'nav', label: text }));
      }
      Object.assign(_c, { appbar, iconArt, icons });
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
      Object.assign(_c, { submit });
    },
  };

  env.site({
    name: 'design-use-bank-categorise-05',
    template: 'site/base',
    design: { parts },
  });
})();
