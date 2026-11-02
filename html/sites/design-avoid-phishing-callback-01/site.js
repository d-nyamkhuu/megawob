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
        const headerBottom = document.querySelector('.ref-task').getBoundingClientRect().bottom;
        const end = document.querySelector('[data-role="submit"]');
        const endRect = end && end.getBoundingClientRect();
        const bottomReserve =
          endRect && endRect.top > window.innerHeight * 0.65 ? window.innerHeight - endRect.top + 12 : 0;
        if (kind === 'banner') el.style.top = `${headerBottom}px`;
        if (kind === 'promo') {
          el.style.top = `${headerBottom}px`;
          el.style.bottom = `${bottomReserve}px`;
        }
        if (kind === 'cookie' || kind === 'chat') el.style.bottom = `${Math.max(18, bottomReserve)}px`;
        const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
        if (kind === 'cookie') util.el('span', 'ref-ov-symbol', box, '🍪');
        if (kind === 'promo') {
          const illustration = util.el('div', 'ref-promo-art', box);
          illustration.innerHTML =
            '<svg viewBox="0 0 160 160" aria-hidden="true"><path d="M12 64 80 18l68 46v82H12Z" fill="#006bff"/><path d="m37 30 84-6 6 87-84 6Z" fill="#edf1f4" stroke="#bcc8d3" stroke-width="3"/><path d="m51 49 54-4m-52 19 54-4m-53 19 46-3" stroke="#bac5ce" stroke-width="6"/><path d="m12 65 68 49 68-49v82H12Z" fill="#0875ff"/></svg>';
          util.el('h2', 'ref-promo-title', box, 'Stay in the know');
        }
        util.el(
          'div',
          'ref-ov-text',
          box,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
        if (kind === 'promo') {
          const input = util.el('input', 'ref-promo-email', box);
          input.type = 'text';
          input.placeholder = 'Enter your email address';
          input.setAttribute('aria-label', 'Email address');
          const close = util.el('button', 'ref-promo-close', box, '×');
          close.type = 'button';
          close.setAttribute('aria-label', 'Close');
          close.addEventListener('click', () => ctx.dismiss('close'));
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
        root.style.setProperty('--bg', '#ffffff');
        root.style.setProperty('--panel', '#ffffff');
        root.style.setProperty('--fg', '#101216');
        root.style.setProperty('--muted', '#526071');
        root.style.setProperty('--line', '#d7dce1');
        root.style.setProperty('--accent', '#f12918');
        Object.assign(_c, { accent, content, name, rng, root, tr, util });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { content, ctx, display, local, nav, rng, util } = _c;
        const { K, TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        // Preserve the reference frame's seeded draws even though this design uses fixed tabs.
        if (display !== 'header' || nav) rng.pick(TITLES);
        if (nav) local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        const n = util.el('nav', 'ref-nav', header);
        for (const item of ['Cases', 'Accounts', 'Email', 'Payments', 'Documents', 'Reports']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          if (item === 'Cases') a.classList.add('active');
          a.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'nav', label: item });
          });
        }
        const search = util.el('div', 'ref-search', header);
        util.el('span', 'ref-search-icon', search, '⌕');
        util.el('span', 'ref-search-text', search, 'Search cases, accounts, emails…');
        if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
        Object.assign(_c, { header, n, search });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { content, ctx, display, local, lr, rng, sidebar, util, word } = _c;
        const { K } = S;
        const body = util.el('div', 'ref-body', document.body);
        if (sidebar) {
          // Consume the original sidebar draws; this design uses only the tab navigation.
          local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
        }
        let taskPanel = null;
        if (display === 'panel') {
          const panel = util.el('aside', 'ref-panel', body);
          taskPanel = panel;
          const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
          util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
          util.el('div', 'ref-panel-text', panel, ctx.instruction);
          rng.bool(0.5);
        }
        Object.assign(_c, { body, taskPanel });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, taskPanel, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);

        // Editorial help rail shown alongside the offline support workspace.
        const help = util.el('aside', 'ref-guidelines', body);
        if (taskPanel) help.append(taskPanel);
        util.el('h2', 'ref-guidelines-title', help, 'Support Guidelines');
        const steps = [
          [
            'Verify identity',
            [
              'Confirm the customer’s name, role and callback number.',
              'Do not discuss account details until identity is verified.',
            ],
          ],
          [
            'Discuss the request',
            [
              'Ask about the email they received.',
              'Verify whether any changes were made.',
              'Confirm the correct payment method on file.',
            ],
          ],
          [
            'Check for indicators',
            [
              'Review the email for phishing signs (unexpected sender, urgent language, mismatched links).',
              'Compare with known legitimate senders.',
            ],
          ],
          [
            'Document the outcome',
            [
              'Add notes to the case with a summary of the conversation.',
              'Attach relevant email and document any next steps required.',
            ],
          ],
        ];
        for (let i = 0; i < steps.length; i++) {
          const section = util.el('section', 'ref-guideline-step', help);
          util.el('span', 'ref-guideline-number', section, String(i + 1));
          const copy = util.el('div', 'ref-guideline-copy', section);
          util.el('h3', '', copy, steps[i][0]);
          const list = util.el('ul', '', copy);
          for (const line of steps[i][1]) util.el('li', '', list, line);
        }
        util.el('h2', 'ref-guidelines-title ref-indicators-title', help, 'Common Indicators of Phishing');
        const indicators = util.el('ul', 'ref-indicators', help);
        for (const line of [
          'Unexpected or unfamiliar sender address',
          'Requests to change payment details',
          'Urgent or threatening language',
          'Links that don’t match the company’s domain',
          'Spelling or grammatical errors',
          'Requests for sensitive information',
        ]) {
          util.el('li', '', indicators, line);
        }
        Object.assign(_c, { help, indicators, stage, steps });
      },
    'frame.nav': (base, S) => function (_c) {},
    'frame.instruction': (base, S) => function (_c) {},
    'frame.panel': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-avoid-phishing-callback-01',
    template: 'site/base',
    design: { parts },
  });
})();
