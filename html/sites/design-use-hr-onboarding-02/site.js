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
        if (kind === 'promo') {
          const art = util.el('div', 'ref-promo-art', box);
          art.innerHTML =
            '<svg viewBox="0 0 260 260" aria-hidden="true"><circle cx="130" cy="130" r="117" fill="#e4f2ec"/><path d="M28 139L63 105 91 132 169 116 218 150 211 204H42Z" fill="#3d9e7b"/><path d="M67 128L112 74Q130 44 158 63L202 114 195 213H76Z" fill="#c6e4d7"/><rect x="79" y="87" width="106" height="112" rx="7" fill="white" stroke="#bddfd0" stroke-width="3"/><path d="M96 111H166M96 125H166M96 139H166M96 153H150" stroke="#7ac9aa" stroke-width="4"/><path d="M32 141L130 205 224 141V233H32Z" fill="#9bcfb7"/><path d="M32 233L130 169 224 233" fill="#b7dfcd"/><path d="M32 141L130 205 224 141" fill="none" stroke="#7dbf9f" stroke-width="2"/></svg>';
          util.el('h2', 'ref-promo-title', box, 'Stay in the loop');
        }
        const chatHead = kind === 'chat' ? util.el('div', 'ref-chat-head', box, '☏  PeopleOps Support') : null;
        util.el(
          'div',
          'ref-ov-text',
          box,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
        if (kind === 'promo') {
          const email = util.el('input', 'ref-promo-email', box);
          email.type = 'text';
          email.placeholder = 'Enter your email address';
          email.setAttribute('aria-label', 'Email address');
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
        if (kind === 'promo') {
          const x = util.el('button', 'ref-promo-close', box, '×');
          x.type = 'button';
          x.setAttribute('aria-label', word ? word('close') : 'Close');
          x.addEventListener('click', () => ctx.dismiss('close'));
        }
        if (chatHead) {
          chatHead.append(dismiss);
          const compose = util.el('div', 'ref-chat-compose', box),
            input = util.el('input', '', compose);
          input.type = 'text';
          input.placeholder = 'Type a message...';
          input.setAttribute('aria-label', 'Support message');
          const send = util.el('button', '', compose, '➤');
          send.type = 'button';
          send.setAttribute('aria-label', 'Send support message');
          send.addEventListener('click', () => env.log('overlay-click', { label: 'Send support message' }));
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

        // Atari ST desktop strip; the task window itself is the existing page frame.
        const desk = util.el('div', 'gem-menubar', document.body);
        util.el('span', 'gem-mark', desk, '♟');
        for (const item of ['Desk', 'File', 'Edit', 'View', 'Records', 'Help'])
          util.el('span', 'gem-menu-item', desk, item);
        const clock = util.el('span', 'gem-clock', desk, 'Mon  2 Jun 1986 10:24');
        util.el('span', 'gem-status-icon', desk, '▣');
        util.el('span', 'gem-status-icon', desk, '▤');
        Object.assign(_c, { H, W, clock, desk, display, roomy, tall });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { W, content, ctx, display, local, lr, nav, rng, util, word } = _c;
        const { K, TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        const windowTitle = util.el('div', 'gem-window-title', header);
        util.el('span', 'gem-window-icon', windowTitle, '▦');
        util.el('strong', '', windowTitle, 'People Operations - New Hire Setup');
        const windowControls = util.el('span', 'gem-window-controls', windowTitle, '－  □  ×');
        let brandText = 'PeopleOps';
        if (display !== 'header' || nav) brandText = word ? word(lr.pick(K.brand)) : rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, brandText);
        brand.textContent = 'PeopleOps';
        brand.dataset.role = 'brand';
        if (true) {
          const n = util.el('nav', 'ref-nav', header);
          const sampledItems = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
          const navItems = word
            ? sampledItems
            : ['Home', 'Recruiting', 'Employees', 'Time Off', 'Compensation', 'Reports', 'Admin'];
          for (const item of navItems) {
            const a = util.el('a', 'ref-navlink', n, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'nav', label: item });
            });
          }
        }
        const search = util.el('div', 'ref-search', header);
        const searchInput = util.el('input', 'ref-search-input', search);
        searchInput.type = 'search';
        searchInput.placeholder = 'Search people, jobs, or reqs...';
        searchInput.setAttribute('aria-label', 'Search people, jobs, or reqs...');
        const searchIcon = util.el('span', 'ref-search-icon', search, '⌕');
        searchIcon.setAttribute('aria-hidden', 'true');
        const profile = util.el('div', 'ref-profile', header);
        util.el('span', 'ref-profile-avatar', profile, 'JD');
        util.el('span', 'ref-profile-caret', profile, '▾');
        if (display === 'header')
          util.el(
            'div',
            'ref-instruction' + (W < 1200 && ctx.instruction.length > 160 ? ' ref-long-instruction' : ''),
            header,
            ctx.instruction,
          );
        else util.el('div', 'ref-spacer', header);
        Object.assign(_c, {
          brand,
          brandText,
          header,
          profile,
          search,
          searchIcon,
          searchInput,
          windowControls,
          windowTitle,
        });
      },
    'frame.nav': (base, S) => function (_c) {},
    'frame.instruction': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-use-hr-onboarding-02',
    template: 'site/base',
    design: { parts },
  });
})();
