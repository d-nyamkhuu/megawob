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
        const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
        let copyBox = box;
        if (kind === 'promo') {
          util.el('div', 'cadence-promo-art', box);
          copyBox = util.el('div', 'cadence-promo-copy', box);
          util.el('h2', '', copyBox, 'Get the latest music news');
          const x = util.el('button', 'cadence-promo-close', copyBox, '×');
          x.type = 'button';
          x.setAttribute('aria-label', word ? word('close') : 'Close');
          x.addEventListener('click', () => ctx.dismiss('close'));
        }
        if (kind === 'chat') util.el('strong', 'cadence-chat-title', copyBox, 'Hi! How can we help?');
        util.el(
          'div',
          'ref-ov-text',
          copyBox,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
        if (kind === 'promo') {
          const input = util.el('input', 'cadence-newsletter-email', copyBox);
          input.type = 'email';
          input.placeholder = 'Your email address';
          input.setAttribute('aria-label', 'Your email address');
        }
        if (kind === 'cookie') util.el('span', 'cadence-cookie-more', copyBox, 'Learn more');
        const row = util.el('div', 'ref-ov-row', copyBox);
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
        if (kind === 'promo')
          util.el('small', 'cadence-promo-privacy', copyBox, 'We respect your privacy. Unsubscribe at any time.');
        if (kind === 'chat') {
          const compose = util.el('div', 'cadence-chat-compose', copyBox, 'Type a message…');
          util.el('span', '', compose, '➤');
        }
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.layout': (base, S) =>
      function (_c) {
        const { ctx, util } = _c;
        const W = window.innerWidth;
        const H = window.innerHeight;
        const roomy = W >= 1260;
        const tall = H >= 700;
        let display = ctx.display || 'header';
        if (display === 'panel' && !roomy) display = 'header';
        if (display === 'toast' && !tall) display = 'header';
        // reset() reuses the body: a previous toast must not shrink later episodes.
        document.body.classList.toggle('ref-has-note', display === 'toast');

        // Cadence Music masthead and tabbed navigation.
        const titlebar = util.el('div', 'breeze-titlebar', document.body);
        const mark = util.el('span', 'breeze-appmark', titlebar);
        mark.innerHTML =
          '<svg viewBox="0 0 76 76" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="6"><path d="M8 30v16M19 20v36M30 12v52M41 7v62M52 15v54M63 25v32M72 34v14"/></g></svg>';
        util.el('span', 'breeze-title', titlebar, 'Cadence');
        util.el('span', 'breeze-subtitle', titlebar, 'MUSIC');
        const winbuttons = util.el('div', 'breeze-winbuttons', titlebar);
        util.el('span', '', winbuttons, '−');
        util.el('span', '', winbuttons, '□');
        util.el('span', '', winbuttons, '×');
        const menubar = util.el('nav', 'breeze-menubar', document.body);
        for (const item of ['File', 'Edit', 'View', 'Library', 'Account', 'Tools', 'Help'])
          util.el('span', '', menubar, item);
        const appbar = util.el('div', 'breeze-appbar', document.body);
        const appnav = util.el('div', 'breeze-appnav', appbar);
        for (const [icon, item] of [
          ['', 'Home'],
          ['', 'Browse'],
          ['', 'Radio'],
          ['', 'My Music'],
          ['', 'Plans'],
        ]) {
          const n = util.el('div', `breeze-appnav-item${item === 'Game Pass' ? ' active' : ''}`, appnav);
          util.el('span', 'breeze-icon', n, icon);
          util.el('span', '', n, item);
        }
        appnav.lastChild.classList.add('active');
        const search = util.el('div', 'breeze-search', appbar);
        search.innerHTML =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/></svg><span>Search</span>';
        util.el('span', 'breeze-tagline', appbar, 'MUSIC FOR A BRIGHTER EVERYDAY');
        const account = util.el('span', 'breeze-account', appbar);
        account.innerHTML =
          '<svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="17" fill="currentColor"/><circle cx="18" cy="12" r="5" fill="#faf7ef"/><ellipse cx="18" cy="26" rx="9" ry="6" fill="#faf7ef"/></svg>';
        Object.assign(_c, {
          H,
          W,
          account,
          appbar,
          appnav,
          display,
          mark,
          menubar,
          roomy,
          search,
          tall,
          titlebar,
          winbuttons,
        });
      },
    'frame.instruction': (base, S) =>
      function (_c) {
        const { ctx, display, header, util } = _c;
        if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
        else util.el('div', 'ref-spacer', header);
        document.body.dataset.instruction = display;
        document.body.dataset.longInstruction = display === 'header' && ctx.instruction.length > 140 ? 'true' : 'false';
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const gameNav = util.el('aside', 'breeze-game-nav', body);
        for (const [icon, item] of [
          ['♛', 'Game Pass'],
          ['🎮', 'All Games'],
          ['★', 'New Releases'],
          ['▮', 'Top Rated'],
          ['▣', 'Coming Soon'],
          ['▥', 'My Library'],
          ['⬇', 'Downloads'],
          ['⚙', 'Settings'],
        ]) {
          const n = util.el('div', `breeze-game-nav-item${item === 'Game Pass' ? ' active' : ''}`, gameNav);
          util.el('span', 'breeze-icon', n, icon);
          util.el('span', '', n, item);
        }
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, gameNav });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        const summary = util.el('aside', 'breeze-summary', body);
        util.el('strong', '', summary, 'Featured Playlists');
        util.el('a', 'breeze-benefit', summary, 'See all');
        for (const [index, [title, genre]] of [
          ['Morning Favourites', '1.2M listeners'],
          ['Indie for Today', '843K listeners'],
          ['Chill Vibes', '2.1M listeners'],
          ['Workout Beats', '1.6M listeners'],
          ['Classic Rock', '1.4M listeners'],
          ['Feel Good Friday', '957K listeners'],
          ['New Music This Week', '1.8M listeners'],
          ['Acoustic Moments', '721K listeners'],
        ].entries()) {
          const row = util.el('div', `breeze-game cover-${index + 1}`, summary);
          util.el('span', 'breeze-thumb', row);
          const info = util.el('span', '', row);
          util.el('b', '', info, title);
          util.el('small', '', info, genre);
        }
        const taskPanel = body.querySelector(':scope > .ref-panel');
        if (taskPanel) summary.prepend(taskPanel);
        Object.assign(_c, { stage, summary });
      },
    'frame.footer': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
        let { submit } = _c;
        if (wantFooter) {
          const foot = util.el('footer', 'ref-foot', document.body);
          const footText = rng.pick([
            '© 2024 Example Co.',
            'All changes are saved automatically.',
            'Need help? Contact your administrator.',
            'v4.2.1 · Status: all systems normal',
          ]);
          const footerCopy = word
            ? lr.pick([
                `© 2024 Example Co. ${word('footRights')}`,
                word('footSaved'),
                word('footHelp'),
                `v4.2.1 · ${word('footStatus')}`,
              ])
            : footText;
          util.el('span', 'ref-foot-text', foot, 'Cadence Music · Help & support');
          const tools = util.el('div', 'ref-tools', foot);
          if (decoys.length > 1) decoyBtn(tools, decoys[1]);
          if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
          if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
          if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
        }
        Object.assign(_c, { submit });
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const { W, endBtn, header, headerTools, label, placement, util } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }
        const headerNote = header.querySelector('.ref-instruction');
        if (headerNote) {
          const noteWidth = headerTools.getBoundingClientRect().left - W * 0.27 - 22;
          headerNote.style.setProperty('width', `${Math.max(180, noteWidth)}px`, 'important');
        }
        Object.assign(_c, { headerNote, submit });
      },
  };

  env.site({
    name: 'design-avoid-dark-patterns-forced-02',
    template: 'site/base',
    design: { parts },
  });
})();
