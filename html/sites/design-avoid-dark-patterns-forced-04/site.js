// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const ICONS = {
    music: '<path d="M10 4v15a4 4 0 1 1-2-3.46V6l13-3v13a4 4 0 1 1-2-3.46V1z"/>',
    home: '<path d="m1 11 11-10 11 10h-4v11h-5v-7h-4v7H5V11z"/>',
    browse: '<path d="M5 1h9l6 6v7h-3v-5h-6V4H8v9H5zM13 1v5h5zM3 14h12v9H3zm3 3v3h6v-3z"/>',
    radio:
      '<circle cx="12" cy="9" r="2"/><path d="M11 13h2v10h-2zM7 4 5 2a10 10 0 0 0 0 14l2-2A7 7 0 0 1 7 4zm10 0 2-2a10 10 0 0 1 0 14l-2-2a7 7 0 0 0 0-10zM3 0 1 1a15 15 0 0 0 0 17l2-2A12 12 0 0 1 3 0zm18 0-1 2a12 12 0 0 1 0 14l2 2a15 15 0 0 0-1-18z"/>',
    list: '<path d="M1 3h3v3H1zm6 0h16v2H7zM1 10h3v3H1zm6 0h16v2H7zM1 17h3v3H1zm6 0h16v2H7z"/>',
    users:
      '<circle cx="12" cy="6" r="4"/><circle cx="3" cy="8" r="3"/><circle cx="21" cy="8" r="3"/><path d="M6 22v-5a6 6 0 0 1 12 0v5zM0 20v-4a5 5 0 0 1 5-5l2 1a8 8 0 0 0-3 8zm24 0v-4a5 5 0 0 0-5-5l-2 1a8 8 0 0 1 3 8z"/>',
    star: '<path d="m12 0 3.5 8 8.5 1-6.5 6 2 9-7.5-4.6L4.5 24l2-9L0 9l8.5-1z"/>',
    devices: '<path d="M1 2h18v13h-6v3h3v2H5v-2h3v-3H1zm2 2v9h14V4zm15 5h6v15h-8V9zm0 2v10h4V11z"/>',
    settings:
      '<path d="m10 0 4 .1 1 3 3 1 3-1 2 4-2 2v4l2 2-2 4-3-1-3 2-1 3h-4l-1-3-3-2-3 1-2-4 2-2V9L1 7l2-4 3 1 3-1zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"/>',
  };

  function icon(util, parent, name, cls) {
    const span = util.el('span', cls || 'music-icon', parent);
    span.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICONS[name] + '</svg>';
    return span;
  }

  const parts = {
    overlay: (base, S) =>
      function overlay(ctx) {
        const { K } = S;
        const { rng, util, kind } = ctx;
        const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
        const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
        const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
        el.dataset.role = 'overlay';
        const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
        let copy = box;
        if (kind === 'promo') {
          const art = util.el('div', 'music-promo-art', box);
          art.setAttribute('aria-hidden', 'true');
          const crowd = util.el('div', 'music-crowd', art);
          for (let i = 0; i < 12; i++) util.el('i', '', crowd);
          copy = util.el('div', 'music-promo-copy', box);
          util.el('h2', '', copy, 'Stay in the loop');
          const close = util.el('button', 'music-promo-close', box, '×');
          close.type = 'button';
          close.setAttribute('aria-label', 'Close');
          close.addEventListener('click', () => ctx.dismiss('close'));
        }
        util.el(
          'div',
          'ref-ov-text',
          copy,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
        if (kind === 'promo') util.el('div', 'music-promo-email', copy, 'Your email address');
        const row = util.el('div', 'ref-ov-row', copy);
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
    'frame.theme': (base, S) =>
      function (_c) {
        const { ctx } = _c;
        const { ACCENTS, LOW_ACCENTS, LOW_THEME, THEMES } = S;
        const { rng, util, content } = ctx;
        let name = rng.pick(Object.keys(THEMES));
        const root = document.documentElement;
        let accent = rng.pick(ACCENTS);
        const tr = rng.fork('chrome/theme');
        if (tr.bool(0.08)) {
          name = 'low';
          accent = tr.pick(LOW_ACCENTS);
        }
        for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name]))
          root.style.setProperty(`--${k}`, v);
        root.style.setProperty('--accent', accent);
        root.dataset.theme = name;
        for (const [key, value] of Object.entries({
          bg: '#f1f5f8',
          panel: '#ffffff',
          fg: '#152236',
          muted: '#63728a',
          line: '#d6dee7',
          accent: '#0088ff',
        }))
          root.style.setProperty('--' + key, value);
        Object.assign(_c, { accent, content, name, rng, root, tr, util });
      },
    'frame.placement': (base, S) =>
      function (_c) {
        const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
        const { K, endLabel } = S;
        // The reference is a compact music service with a fixed left navigation rail.

        // End control placement (none in finish mode).
        let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
        const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
        if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
        const sidebar = roomy && rng.bool(0.35);
        const nav = W >= 1180 && rng.bool(0.5);
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (word) label = word(lr.pick(K.end));
        if (!word && rng.fork('cadence/end-label').bool(0.55)) label = 'Save';
        if (placement === 'floating') placement = 'header';
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);
        Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const gameNav = util.el('aside', 'breeze-game-nav', body);
        const brand = util.el('div', 'music-brand', gameNav);
        icon(util, brand, 'music', 'music-note');
        util.el('strong', '', brand, 'Cadence');
        for (const [symbol, item] of [
          ['home', 'Home'],
          ['browse', 'Browse'],
          ['radio', 'Radio'],
          ['music', 'Your Music'],
          ['list', 'Playlists'],
          ['users', 'Friends'],
          ['settings', 'Account'],
        ]) {
          const n = util.el(
            'div',
            `breeze-game-nav-item${item === 'Home' ? ' active' : ''}${item === 'Playlists' || item === 'Account' ? ' separated' : ''}`,
            gameNav,
          );
          icon(util, n, symbol, 'breeze-icon');
          util.el('span', '', n, item);
        }
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, brand, gameNav });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, ctx, header, util } = _c;
        const spec = ctx.spec;
        const say = spec.say || {};
        const offer = (spec.screens?.plans?.blocks || []).find((b) => b.t === 'hero') || {};
        const price = (offer.text || '').match(/[^\s\d]*\d+[.,]\d{2}/)?.[0] || '';
        const days = say.days || 30;
        const plan = say.plan || '';
        const saved = Object.values(spec.ctls || spec.ctrls || spec.controls || {}).find(
          (c) => c.kind === 'toggle' && (c.key === 'card' || c.key === 'renew'),
        );
        const card = saved?.label?.match(/\(([^)]+)\)/)?.[1] || '';
        const cardBrand = card.split(' ')[0] || 'CARD';
        const cardDigits = card.match(/\d{4}/)?.[0] || '';
        const hero = util.el('section', 'music-hero', body);
        util.el('h1', '', hero, 'Cadence Music');
        hero.appendChild(header);
        util.el('p', 'music-tagline', hero, 'Millions of songs. Wherever you go.');
        const benefits = util.el('div', 'music-benefits', hero);
        for (const [symbol, first, second] of [
          ['music', 'Unlimited', 'streaming'],
          ['devices', 'Listen on all', 'your devices'],
          ['star', 'Expertly curated', 'playlists'],
          ['users', 'No ads,', 'just music'],
        ]) {
          const benefit = util.el('div', 'music-benefit', benefits);
          icon(util, benefit, symbol);
          const text = util.el('span', '', benefit);
          util.el('span', '', text, first);
          util.el('span', '', text, second);
        }
        const lower = util.el('div', 'music-lower', body);
        const workspace = util.el('section', 'music-workspace', lower);
        const plans = util.el('section', 'music-plans', workspace);
        util.el('h2', '', plans, 'Choose your plan');
        const rows = util.el('div', 'music-plan-list', plans);
        for (const [title, description, amount, active] of [
          [plan, 'Just for you. Unlimited listening on all your devices.', price, true],
          [
            plan === 'Family' ? 'Duo' : 'Family',
            'Up to 6 people. Separate accounts. One great price.',
            (spec.curr || '$') + '14.99',
            false,
          ],
          [
            plan === 'Student' ? 'Premium' : 'Student',
            'Special pricing for eligible students.',
            (spec.curr || '$') + '4.99',
            false,
          ],
        ]) {
          const row = util.el('div', 'music-plan' + (active ? ' selected' : ''), rows);
          util.el('span', 'music-radio', row);
          const info = util.el('div', 'music-plan-info', row);
          util.el('h3', '', info, title);
          util.el('p', '', info, description);
          const cost = util.el('div', 'music-price', row);
          util.el('strong', '', cost, amount + ' / month');
          util.el('span', '', cost, days + '-day free trial');
          if (!active) row.addEventListener('click', () => env.log('decoy', { label: title }));
        }
        const included = util.el('section', 'music-included', plans);
        util.el('h2', '', included, 'What’s included');
        const features = util.el('ul', '', included);
        for (const text of [
          'Unlimited on-demand streaming',
          'Listen offline on mobile devices',
          'High-quality audio',
          'Create and share playlists',
          'No ads',
        ]) {
          const li = util.el('li', '', features);
          util.el('span', '', li, '✓');
          util.el('span', '', li, text);
        }
        const devices = util.el('div', 'music-device-art', included);
        devices.setAttribute('aria-hidden', 'true');
        const laptop = util.el('div', 'music-laptop', devices);
        const screen = util.el('div', 'music-device-screen', laptop);
        util.el('strong', '', screen, 'Cadence');
        util.el('small', '', screen, 'EVERYWHERE');
        const crowd = util.el('div', 'music-crowd', screen);
        for (let i = 0; i < 10; i++) util.el('i', '', crowd);
        const tablet = util.el('div', 'music-tablet', devices);
        const tabletScreen = util.el('div', 'music-tablet-screen', tablet);
        for (const t of ['Home', 'Discover', 'Your Music', 'Playlists', 'Radio']) {
          const track = util.el('div', '', tabletScreen);
          util.el('i', '', track);
          util.el('span', '', track, t);
        }
        const phone = util.el('div', 'music-phone', devices);
        util.el('div', 'music-phone-screen', phone, '♫');
        const trial = util.el('section', 'music-trial', workspace);
        util.el('h2', '', trial, 'Trial and billing terms');
        util.el(
          'p',
          'music-terms',
          trial,
          'Start your ' +
            days +
            '-day free trial today. After your trial ends, ' +
            plan +
            ' is ' +
            price +
            ' per month, billed monthly. You can cancel at any time.',
        );
        const payment = util.el('section', 'music-payment', trial);
        util.el('h2', '', payment, 'Payment method');
        const cardRow = util.el('div', 'music-card', payment);
        util.el('strong', 'music-card-brand', cardRow, cardBrand.toUpperCase());
        const cardCopy = util.el('div', '', cardRow);
        util.el('span', '', cardCopy, cardDigits ? cardBrand + ' ending in ' + cardDigits : 'Saved payment settings');
        util.el('small', '', cardCopy, 'Saved payment method');
        util.el('span', 'music-card-link', cardRow, 'On file');
        util.el(
          'h2',
          'music-preferences-heading',
          trial,
          say.pref === 'card' ? 'Saved-card preferences' : 'Auto-renewal',
        );
        const stage = util.el('main', 'ref-stage', trial);
        S.frameAlign(_c, stage);
        util.el(
          'p',
          'music-help-note',
          workspace,
          'You can manage your subscription and payment preferences from your account settings.',
        );
        const inspector = util.el('aside', 'music-inspector', lower);
        const taskPanel = body.querySelector('.ref-panel');
        if (taskPanel) inspector.appendChild(taskPanel);
        const details = util.el('section', 'music-details', inspector);
        util.el('h2', '', details, 'Plan details');
        const dl = util.el('dl', '', details);
        const endDate = (saved?.sub || '').match(/from (.+?)[.]?$/)?.[1]?.replace(/\.$/, '') || 'After your free trial';
        for (const [key, value] of [
          ['Plan', say.store + '\n' + plan],
          ['Price after trial', price + ' / month'],
          ['Free trial length', days + ' days'],
          ['Trial ends', endDate],
          ['Billing cycle', 'Monthly'],
          ['Payment method', cardBrand],
        ]) {
          const entry = util.el('div', '', dl);
          util.el('dt', '', entry, key);
          util.el('dd', '', entry, value);
        }
        const help = util.el('section', 'music-help', details);
        util.el('h2', '', help, 'Need help?');
        for (const text of [
          'How the free trial works',
          'Can I cancel anytime?',
          'Payment and billing FAQs',
          'More about our plans',
        ]) {
          const link = util.el('a', '', help, text);
          link.addEventListener('click', () => env.log('decoy', { label: text }));
        }
        Object.assign(_c, {
          benefits,
          card,
          cardBrand,
          cardCopy,
          cardDigits,
          cardRow,
          crowd,
          days,
          details,
          devices,
          dl,
          endDate,
          features,
          help,
          hero,
          included,
          inspector,
          laptop,
          lower,
          offer,
          payment,
          phone,
          plan,
          plans,
          price,
          rows,
          saved,
          say,
          screen,
          spec,
          stage,
          tablet,
          tabletScreen,
          taskPanel,
          trial,
          workspace,
        });
      },
    'frame.footer': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
        let { submit } = _c;
        if (wantFooter) {
          const foot = util.el('footer', 'ref-foot', document.body);
          const footText = rng.pick([
            '© 2013 Cadence Music.',
            'Your subscription preferences',
            'Need help? Visit the Help Centre.',
            'Cadence Music · Account services',
          ]);
          util.el(
            'span',
            'ref-foot-text',
            foot,
            word
              ? lr.pick([
                  `© 2024 Example Co. ${word('footRights')}`,
                  word('footSaved'),
                  word('footHelp'),
                  `v4.2.1 · ${word('footStatus')}`,
                ])
              : footText,
          );
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
    name: 'design-avoid-dark-patterns-forced-04',
    template: 'site/base',
    design: { parts },
  });
})();
