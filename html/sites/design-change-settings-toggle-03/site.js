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
        if (kind === 'cookie') {
          const icon = util.el('span', 'civic-cookie-icon', box);
          icon.innerHTML =
            '<svg viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" stroke-width="2"/><g fill="currentColor"><circle cx="12" cy="11" r="2.4"/><circle cx="23" cy="10" r="2.2"/><circle cx="18" cy="19" r="2.6"/><circle cx="9" cy="22" r="2.1"/><circle cx="25" cy="24" r="2.5"/><circle cx="17" cy="29" r="1.6"/></g></svg>';
          util.el('strong', 'civic-overlay-heading', box, 'We use cookies');
        }
        if (kind === 'chat') {
          const heading = util.el('strong', 'civic-overlay-heading', box, 'CivicHub Support');
          util.el('span', 'civic-chat-dot', heading, '●');
        }
        if (kind === 'promo') {
          const art = util.el('div', 'civic-newsletter-art', box);
          art.innerHTML =
            '<svg viewBox="0 0 120 110" aria-hidden="true"><g fill="none" stroke="#0078ff" stroke-width="3"><path d="M20 40L60 15L100 40V92H20Z"/><path d="M20 42L60 69L100 42M22 90L48 62M98 90L72 62"/><path fill="white" d="M36 22H84V53L60 69L36 53Z"/><path d="M46 33H74M46 42H74M46 51H65M60 3V12M10 25L20 30M110 25L100 30"/></g></svg>';
          util.el('strong', 'civic-overlay-heading', box, 'Stay in the know');
        }
        util.el(
          'div',
          'ref-ov-text',
          box,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
        if (kind === 'promo') {
          const email = util.el('input', 'civic-newsletter-email', box);
          email.type = 'email';
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
        if (kind === 'chat') {
          const entry = util.el('div', 'civic-chat-entry', box);
          const input = util.el('input', '', entry);
          input.placeholder = 'Type a message…';
          input.setAttribute('aria-label', 'Message');
          const send = util.el('button', '', entry, '➤');
          send.type = 'button';
          send.title = 'Send message';
          send.addEventListener('click', () => env.log('overlay-click', { label: 'Send message' }));
        }
        if (kind === 'promo') util.el('div', 'civic-privacy', box, 'We respect your privacy. Unsubscribe at any time.');
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
        for (const [k, v] of Object.entries({
          bg: '#fcfdfe',
          panel: '#fcfdfe',
          fg: '#080f48',
          muted: '#7483a2',
          line: '#d9e3ee',
          accent: '#0078ff',
        }))
          root.style.setProperty(`--${k}`, v);
        root.dataset.theme = 'light';
        Object.assign(_c, { accent, content, name, rng, root, tr, util });
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
        document.documentElement.classList.remove('civic-page-scroll');
        document.body.classList.toggle('ref-has-note', display === 'toast');
        document.body.classList.toggle('ref-header-note', display === 'header');
        Object.assign(_c, { H, W, display, roomy, tall });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { content, display, local, lr, nav, rng, util, word } = _c;
        const { K, TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        if (display !== 'header' || nav) {
          const title = rng.pick(TITLES);
          if (word) word(lr.pick(K.brand));
          const brand = util.el('div', 'ref-brand', header, 'CivicHub');
          brand.dataset.role = 'brand';
        }
        if (!header.querySelector('.ref-brand')) {
          const brand = util.el('div', 'ref-brand', header, 'CivicHub');
          brand.dataset.role = 'brand';
        }
        if (true) {
          const n = util.el('nav', 'ref-nav', header);
          if (nav) local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
          for (const item of ['Home', 'Services', 'My Requests', 'Community', 'Help']) {
            const a = util.el('a', 'ref-navlink', n, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'nav', label: item });
            });
          }
        }
        Object.assign(_c, { header });
      },
    'frame.controls': (base, S) =>
      function (_c) {
        const { ctx, header, label, util } = _c;
        const mark = util.el('span', 'civic-mark', header.querySelector('.ref-brand'));
        mark.innerHTML =
          '<svg viewBox="0 0 40 44" aria-hidden="true"><g fill="currentColor"><path d="M20 1C10 9 13 17 20 21C27 16 30 9 20 1Z"/><path d="M4 12C15 13 20 21 19 29C9 27 4 22 4 12Z"/><path d="M36 12C25 13 20 21 21 29C31 27 36 22 36 12Z"/><path d="M1 28C12 27 18 33 19 42C9 42 3 37 1 28Z"/><path d="M39 28C28 27 22 33 21 42C31 42 37 37 39 28Z"/></g></svg>';
        const user = util.el('div', 'civic-user', header);
        util.el('span', 'civic-user-avatar', user, 'JT');
        util.el('span', '', user, 'Jordan Taylor');
        util.el('span', 'civic-caret', user, '');
        const decoyBtn = (parent, text, collides) => {
          const b = util.el('button', 'ref-xtra', parent, text);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.addEventListener('click', () =>
            env.log('decoy', collides ? { label: b.textContent, collide: true } : { label: b.textContent }),
          );
        };
        const endBtn = (parent, cls, text) => {
          const b = util.el(cls === 'ref-endlink' ? 'a' : 'button', cls, parent, text);
          if (b.tagName === 'BUTTON') b.type = 'button';
          else b.href = '#';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          return b;
        };
        Object.assign(_c, { decoyBtn, endBtn, mark, user });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, display, header, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        if (display === 'header') {
          const note = header.querySelector('.ref-instruction');
          stage.style.setProperty('--instruction-height', `${Math.ceil(note.getBoundingClientRect().height)}px`);
        }
        const inspector = util.el('aside', 'civic-inspector', body);
        util.el('h2', '', inspector, 'Account details');
        const account = util.el('div', 'civic-account', inspector);
        util.el('div', 'civic-avatar', account, 'JT');
        const identity = util.el('div', 'civic-identity', account);
        util.el('strong', '', identity, 'Jordan Taylor');
        const email = util.el('span', '', identity);
        email.innerHTML = 'jordan.taylor@<wbr>example.com';
        const manage = util.el('a', '', identity, 'Manage your account');
        manage.href = '#';
        const about = util.el('section', 'civic-about', inspector);
        util.el('h2', '', about, 'About these settings');
        util.el(
          'p',
          '',
          about,
          'These preferences control your experience across CivicHub. Changes you make here apply to your account and can be updated at any time.',
        );
        const help = util.el('section', 'civic-help', inspector);
        util.el('h2', '', help, 'Need help?');
        for (const label of [
          'Privacy settings guide',
          'Sharing with family members',
          'Location and nearby services',
          'Managing your data',
        ]) {
          const a = util.el('a', '', help, label);
          a.href = '#';
        }
        inspector.querySelectorAll('a').forEach((a) =>
          a.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { label: a.textContent });
          }),
        );
        if (display === 'panel') {
          const panel = body.querySelector('.ref-panel');
          inspector.querySelector('h2').remove();
          account.remove();
          inspector.prepend(panel);
        }
        S.frameAlign(_c, stage);
        Object.assign(_c, { about, account, email, help, identity, inspector, manage, stage });
      },
    'frame.toast': (base, S) =>
      function (_c) {
        const { closeLabel, ctx, display, inspector, util } = _c;
        if (display === 'toast') {
          const note = util.el('div', 'ref-note', inspector);
          inspector.prepend(note);
          util.el('div', 'ref-note-text', note, ctx.instruction);
          const x = util.el('button', 'ref-note-x', note, '×');
          x.type = 'button';
          x.setAttribute('aria-label', closeLabel);
          x.addEventListener('click', () => {
            note.style.visibility = 'hidden';
            env.log('note-close');
          });
        }
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const { endBtn, inspector, label, placement, rng, util } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }
        // Prefer the reference's form-footer ending, using an independent stream.
        if (submit && rng.fork('civic/end').bool(0.5)) {
          let foot = document.querySelector('.ref-foot');
          if (!foot) {
            foot = util.el('footer', 'ref-foot', document.body);
            util.el('span', 'ref-foot-text', foot, 'CivicHub');
            util.el('div', 'ref-tools', foot);
          }
          submit.className = 'ref-submit';
          submit.textContent = 'Done';
          submit.title = 'Done';
          submit.setAttribute('aria-label', 'Done');
          foot.querySelector('.ref-tools').append(submit);
          document.querySelectorAll('.ref-xtra').forEach((b) => {
            if (b.textContent === 'Done') b.textContent = 'Confirm';
          });
          document.querySelectorAll('.ref-float-dock:empty').forEach((el) => el.remove());
        }
        document.querySelectorAll('.ref-foot-text').forEach((el) => {
          el.textContent = 'CivicHub';
        });
        // Form endings belong to a visible inspector action area, even on long pages.
        const ending = submit?.closest('.ref-foot, .ref-float-dock');
        if (ending) inspector.prepend(ending);
        Object.assign(_c, { submit });
      },
    'frame.nav': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-change-settings-toggle-03',
    template: 'site/base',
    design: { parts },
  });
})();
