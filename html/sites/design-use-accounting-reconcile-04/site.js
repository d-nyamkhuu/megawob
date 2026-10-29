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
      const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
      if (kind === 'promo') {
        util.el('div', 'qt-envelope', box, '✉');
        util.el('strong', 'qt-promotitle', box, 'Stay in the know');
        const close = util.el('button', 'qt-promoclose', box, '×');
        close.type = 'button'; close.setAttribute('aria-label', word ? word('close') : 'Close');
        close.addEventListener('click', () => ctx.dismiss('close'));
      }
      util.el('div', 'ref-ov-text', box, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
      if (kind === 'promo') {
        const email = util.el('input', 'qt-promoemail', box);
        email.type = 'email'; email.placeholder = 'Email address'; email.setAttribute('aria-label', 'Email address');
      }
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
      const header = document.querySelector('.ref-task');
      if (kind === 'banner' && header) {
        const instruction = document.querySelector('.ref-instruction');
        const anchor = instruction || header;
        anchor.after(el);
        el.style.top = anchor.getBoundingClientRect().bottom + 'px';
      }
      if (kind === 'cookie' || kind === 'chat') {
        const end = document.querySelector('[data-role="submit"]');
        const rect = end && end.getBoundingClientRect();
        if (rect && rect.top > document.documentElement.clientHeight * .7) el.style.bottom = (document.documentElement.clientHeight - rect.top + 8) + 'px';
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.layout': (base, S) => function (_c) {
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
      document.body.classList.toggle('ref-has-header-note', display === 'header');
      Object.assign(_c, { H, W, display, roomy, tall });
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const navDraw = W >= 1180 && rng.bool(0.5);
      const nav = true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      util.el('span', 'qt-appicon', header, '▥');
      const windowControls = util.el('div', 'qt-windowcontrols', header);
      for (const symbol of ['_', '□', '×']) {
        const control = util.el('button', '', windowControls, symbol);
        control.type = 'button'; control.tabIndex = -1;
        control.setAttribute('aria-label', symbol === '_' ? 'Minimize window' : symbol === '□' ? 'Maximize window' : 'Close window');
      }
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Riverton Community Services');
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        const sampledNav = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        for (const item of ['Dashboard', 'Transactions', 'Reconcile', 'Journal Entries', 'Expenses', 'Accounts Payable', 'Reports', 'Chart of Accounts', 'Settings']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          if (item === 'Reconcile') a.classList.add('is-current');
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { header, windowControls });
    },
    'frame.footer': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, headerTools, label, lr, placement, rng, util, wantFooter, word } = _c;
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
        if (placement !== 'footer' && placement !== 'link') {
          while (tools.firstChild) headerTools.appendChild(tools.firstChild);
          foot.remove();
        }
      }
      Object.assign(_c, { submit });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-accounting-reconcile-04',
    template: 'site/base',
    design: { parts },
  });
})();
