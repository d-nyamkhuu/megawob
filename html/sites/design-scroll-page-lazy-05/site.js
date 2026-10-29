// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const ICONS = {
    cloud:
      '<path d="M15 31C5 33 1 19 10 15 7 4 21-1 27 7 35 0 43 6 43 10 58 7 64 29 49 31 45 39 34 39 30 35 23 43 14 39 15 31Z"/>',
    search: '<circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/>',
    home: '<path d="m3 11 9-8 9 8-3 0v10h-5v-7h-3v7H6V11Z"/>',
    accounts:
      '<path d="M6 2h12v20h3v2H3v-2h3Z" fill="currentColor" stroke="none"/>' +
      [5, 9, 13]
        .map((y) =>
          [9, 14]
            .map((x) => `<rect x="${x}" y="${y}" width="2" height="2" fill="var(--sf-icon-hole,#fff)" stroke="none"/>`)
            .join(''),
        )
        .join('') +
      '<path d="M10 24v-6h4v6" fill="var(--sf-icon-hole,#fff)" stroke="none"/>',
    contacts: '<circle cx="12" cy="7" r="4"/><path d="M4 22v-4a8 8 0 0 1 16 0v4Z"/>',
    crown:
      '<path d="m3 7 4 5 5-8 5 8 4-5-3 12H6ZM6 22h12"/><circle cx="2" cy="5" r="1"/><circle cx="12" cy="2" r="1"/><circle cx="22" cy="5" r="1"/>',
    chart:
      '<path d="M3 22h19"/><rect x="5" y="10" width="3" height="9" fill="currentColor" stroke="none"/><rect x="11" y="3" width="3" height="16" fill="currentColor" stroke="none"/><rect x="17" y="7" width="3" height="12" fill="currentColor" stroke="none"/>',
    gauge: '<path d="M2 20a10 10 0 0 1 20 0M12 20l6-9"/>',
    gear:
      '<circle cx="12" cy="12" r="8" fill="currentColor" stroke="none"/>' +
      Array.from(
        { length: 8 },
        (_, i) =>
          `<rect x="10" y="0" width="4" height="7" rx=".5" transform="rotate(${i * 45} 12 12)" fill="currentColor" stroke="none"/>`,
      ).join('') +
      '<circle cx="12" cy="12" r="4" fill="white" stroke="none"/>',
    bell: '<path d="M5 17h14l-2-3V8a5 5 0 0 0-10 0v6Zm5 4h4"/>',
    print: '<path d="M6 8V2h12v6M6 17H3V8h18v9h-3M6 13h12v9H6Zm11-2h1"/>',
    share:
      '<circle cx="5" cy="12" r="2.5"/><circle cx="19" cy="4" r="2.5"/><circle cx="19" cy="20" r="2.5"/><path d="m7 11 10-6M7 13l10 6"/>',
    report: '<path d="M4 2h16v20H4Zm4 5h8M8 11h6m-6 4h4"/>',
    calendar: '<path d="M3 5h18v17H3Zm0 4h18M7 2v6m10-6v6m-9 7 3 3 5-6"/>',
  };

  function icon(util, parent, name, cls) {
    const span = util.el('span', `sf-icon sf-icon-${name} ${cls || ''}`, parent);
    span.innerHTML = `<svg viewBox="0 0 ${name === 'cloud' ? '64 44' : '24 24'}" aria-hidden="true">${ICONS[name] || ICONS.report}</svg>`;
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
        const notice = util.el(
          'div',
          'ref-ov-text',
          box,
          kind === 'cookie' ? 'We use cookies to improve your experience, analyze site usage, and support our wellness programs. You can manage your preferences at any time.' : kind === 'chat' ? 'Hi! How can we help you today?' : kind === 'banner' ? 'Join our spring wellness challenge for a healthier, happier you. Learn more about dates, activities, and prizes.' : kind === 'promo' ? '' : word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
        if (kind === 'cookie') {
          const heading = util.el('strong', 'well-cookie-title', notice, 'We use cookies');
          notice.prepend(heading);
          util.el('a', 'well-cookie-settings', notice, 'Cookie settings');
        }
        if (kind === 'cookie') {
          const cookie = util.el('span', 'sf-cookie-icon', box);
          cookie.innerHTML = '<svg viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="23" fill="#d49b4d" stroke="#9f6e32" stroke-width="2"/><circle cx="18" cy="16" r="3" fill="#7d4d24"/><circle cx="31" cy="13" r="3" fill="#7d4d24"/><circle cx="37" cy="25" r="4" fill="#7d4d24"/><circle cx="22" cy="30" r="4" fill="#7d4d24"/><circle cx="30" cy="39" r="3" fill="#7d4d24"/><circle cx="12" cy="27" r="2.5" fill="#7d4d24"/></svg>';
        }
        if (kind === 'promo') {
          const art = util.el('div', 'sf-promo-art', box);
          art.innerHTML =
            '<svg viewBox="0 0 280 440" aria-hidden="true"><rect width="280" height="440" fill="#dceee1"/><path d="M0 260 66 178l57 61 64-86 93 110v177H0Z" fill="#79aa91"/><path d="m0 260 66-82 57 61-35-17-22-22-23 29-16 1Z" fill="#f3fbff"/><path d="m123 239 64-86 58 69-33-17-25-31-24 42-18-3Z" fill="#f3fbff"/><path d="M0 348q75-80 140-25t140-30v147H0Z" fill="#3f8661"/><path d="M0 401q100-82 167-32t113-10v81H0Z" fill="#176143"/><g fill="#0b4f3b"><path d="m18 270-26 99h52Zm50 37-35 107h70Zm149-93-42 154h84Z"/></g></svg>';
          util.el('h2', 'sf-promo-title', box, 'Stay in the know');
          util.el(
            'p',
            'sf-promo-description',
            box,
            'Get the latest health tips, wellness resources, and program updates in your inbox.',
          );
          const email = util.el('input', 'sf-promo-email', box);
          email.type = 'text';
          email.placeholder = 'Email address';
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
          rng.bool(0.5);
          rng.pick(['Reject all', 'Necessary only']);
          rng.pick(['Accept all', 'Accept', 'Got it']);
          dismiss = btn('Dismiss', 'accept', false);
        } else if (kind === 'promo') {
          dismiss = btn(rng.pick(['No thanks', 'Maybe later', 'Close']), 'close', false);
          rng.pick(['Upgrade now', 'Start trial', 'Learn more']);
          btn('Subscribe', null, true);
        } else if (kind === 'banner') {
          dismiss = btn('Dismiss', 'close', false);
        } else {
          dismiss = btn('×', 'close', false);
          dismiss.setAttribute('aria-label', word ? word('close') : 'Close');
        }
        if (kind === 'promo') {
          dismiss.classList.add('sf-promo-close');
          dismiss.title = dismiss.textContent;
          dismiss.setAttribute('aria-label', word ? word('close') : 'Close');
          dismiss.textContent = '×';
          const no = util.el('a', 'well-promo-no', box, 'No thanks');
          no.href = '#';
          no.addEventListener('click', e => { e.preventDefault(); ctx.dismiss('close'); });
        }
        if (kind === 'chat') {
          const head = util.el('div', 'sf-chat-head', el);
          util.el('strong', '', head, 'Chat with us');
          head.append(dismiss);
          el.prepend(head);
          const actions = util.el('div', 'sf-chat-actions', el);
          ['Find an article', 'Book an appointment', 'Technical support'].forEach((label) => {
            const button = util.el('button', '', actions, label);
            button.type = 'button';
            button.addEventListener('click', () => env.log('overlay-click', { label }));
          });
          const compose = util.el('div', 'sf-chat-compose', el);
          util.el('span', '', compose, 'Type a message...');
          util.el('b', '', compose, '➤');
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
        for (const [k, v] of Object.entries({
          bg: '#e5eef5',
          panel: '#ffffff',
          fg: '#0b2145',
          muted: '#59677e',
          line: '#d4e1ec',
          accent: '#0070f5',
        }))
          root.style.setProperty(`--${k}`, v);
        root.dataset.theme = 'light';
        Object.assign(_c, { accent, content, name, rng, root, tr, util });
      },
    'frame.placement': (base, S) =>
      function (_c) {
        const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
        const { K, endLabel } = S;
        // End control placement (none in finish mode).
        let placement = ctx.finish ? null : rng.pick(['header', 'header', 'icon', 'link']);
        let wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
        const baseWantFooter = wantFooter;
        if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
        const sidebar = roomy && rng.bool(0.35);
        const nav = W >= 1180 && rng.bool(0.5);
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (word) label = word(lr.pick(K.end));
        if (!word && rng.fork('lightning/end-label').bool(0.55)) label = 'OK';
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);
        const wr = rng.fork('wellpath/end');
        if (!ctx.finish) {
          placement = ctx.display === 'hidden' ? 'footer' : wr.pick(['footer', 'footer', 'footer', 'header', 'icon', 'link']);
          wantFooter = placement === 'footer';
          if (!word && (ctx.display === 'hidden' || wr.bool(0.65))) label = 'Finish';
        } else wantFooter = false;
        if (collide && !word) collide.text = label === 'Continue' ? 'Finish' : 'Continue';
        Object.assign(_c, { baseWantFooter, collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const appBrand = util.el('div', 'sf-app-brand', header);
        const mark = util.el('span', 'well-mark', appBrand);
        mark.innerHTML = '<svg viewBox="0 0 44 44" aria-hidden="true"><path fill="currentColor" d="M20 32C9 29 7 19 9 8c6 5 10 6 15 5-5 5-7 10-4 19Zm4-1C24 17 32 10 43 6c0 13-5 25-19 25ZM8 34c13 2 25-4 34-19-4 14-15 24-31 24H3Z"/></svg>';
        util.el('strong', '', appBrand, 'WellPath');
        util.el('span', 'well-brand-rule', appBrand, '|');
        util.el('span', 'well-brand-sub', appBrand, 'Employee Wellness');
        const globalSearch = util.el('div', 'sf-global-search', header);
        util.el('span', '', globalSearch, 'Search resources...');
        icon(util, globalSearch, 'search');
        const profile = util.el('div', 'sf-profile', header);
        ['My Account', 'Help', 'Sign Out'].forEach((x, i) => {
          if (i) util.el('span', 'well-separator', profile, '|');
          util.el('a', '', profile, x);
        });
        S.frameBrand(_c, header);
        Object.assign(_c, { appBrand, globalSearch, header, profile });
      },
    'frame.controls': (base, S) =>
      function (_c) {
        const { ctx, label, util } = _c;
        const decoyBtn = (parent, text, collides) => {
          const b = util.el('button', 'ref-xtra', parent, text);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.dataset.extraKind = collides ? 'word' : 'other';
          b.addEventListener('click', () =>
            env.log('decoy', collides ? { label: text, collide: true } : { label: text }),
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
        Object.assign(_c, { decoyBtn, endBtn });
      },
    'frame.tools': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
        let submit = null;
        const headerTools = util.el('div', 'ref-tools', header);
        // Optional utility decoys sit with the form footer, keeping the account bar compact.
        if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
        if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
        if (placement === 'link') submit = endBtn(headerTools, 'ref-endlink', `${label} ›`);
        if (placement === 'icon') {
          submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
        }
        Object.assign(_c, { headerTools, submit });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const tabs = util.el('nav', 'well-tabs', body);
        ['Home', 'My Plan', 'Health Resources', 'Programs', 'Appointments', 'Community'].forEach((x, i) =>
          util.el('div', i === 2 ? 'well-tab active' : 'well-tab', tabs, x),
        );
        const hero = util.el('section', 'well-hero', body);
        util.el('div', 'well-landscape', hero);
        const heroCopy = util.el('div', 'well-hero-copy', hero);
        util.el('h1', '', heroCopy, 'Health Resources');
        util.el('p', '', heroCopy, 'Reliable information and practical tools to help you and your family make healthy choices.');
        const summary = util.el('section', 'well-summary', hero);
        util.el('h2', '', summary, 'Resource Library');
        [['Help articles', '48'], ['Guides and handouts', '12'], ['Videos', '16'], ['Tools and calculators', '9']].forEach(([x, n]) => {
          const line = util.el('div', 'well-summary-line', summary);
          util.el('span', '', line, x);
          util.el('span', '', line, n);
        });
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, tabs, hero, heroCopy, summary });
      },
    'frame.panel': (base, S) =>
      function (_c) {
        const { body, ctx, display, header, heroCopy, lr, rng, util, word } = _c;
        const { K } = S;
        const content = util.el('div', 'well-content', body);
        const side = util.el('aside', 'well-side', content);
        util.el('div', 'well-bar', side, 'In this section');
        ['Help articles', 'Guides and handouts', 'Videos', 'Tools and calculators', 'Frequently asked questions'].forEach((x, i) => {
          const a = util.el('a', i === 0 ? 'selected' : '', side, x);
          a.href = `#${['articles', 'popular', 'categories', 'tips', 'faq'][i]}`;
        });
        if (display === 'panel') {
          const panel = util.el('aside', 'ref-panel', side);
          const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
          util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
          util.el('div', 'ref-panel-text', panel, ctx.instruction);
          if (rng.bool(0.5)) body.classList.add('ref-panel-right');
          side.insertBefore(panel, side.children[1]);
        }
        const helpWindow = util.el('section', 'sf-window', content);
        const helpbar = util.el('div', 'sf-helpbar', helpWindow);
        util.el('strong', 'sf-window-name', helpbar, 'Help articles');
        const instruction = header.querySelector('.ref-instruction');
        // Header instructions stay in the WellPath account bar.
        if (instruction && display !== 'header') instruction.remove();
        if (display === 'toast') {
          const toast = util.el('div', 'well-toast', document.body);
          util.el('span', 'well-toast-icon', toast, 'i');
          util.el('div', 'well-toast-text', toast, ctx.instruction);
          const close = util.el('button', 'well-toast-close', toast, '×');
          close.type = 'button';
          close.setAttribute('aria-label', 'Close');
          close.addEventListener('click', () => toast.remove());
        }
        const windowBody = util.el('div', 'sf-window-body', helpWindow);
        const toc = util.el('section', 'well-toc', windowBody);
        util.el('h2', '', toc, 'Table of contents');
        util.el('p', '', toc, 'Jump to a section on this page.');
        const list = util.el('ul', '', toc);
        [['Help articles', 'articles'], ['Popular topics', 'popular'], ['Health categories', 'categories'], ['Tips for using these resources', 'tips']].forEach(([x, id]) => {
          const li = util.el('li', '', list);
          const a = util.el('a', '', li, x);
          a.href = `#${id}`;
        });
        const stage = util.el('main', 'ref-stage', windowBody);
        stage.id = 'articles';
        Object.assign(_c, { helpWindow, helpbar, instruction, stage, windowBody, main:windowBody });
      },
    'frame.footer': (base, S) =>
      function (_c) {
        const { baseWantFooter, collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
        let { submit } = _c;
        const footChoices = [
          '© 2024 Example Co.',
          'All changes are saved automatically.',
          'Need help? Contact your administrator.',
          'v4.2.1 · Status: all systems normal',
        ];
        const footText = baseWantFooter ? rng.pick(footChoices) : rng.fork('wellpath/footer').pick(footChoices);
        if (wantFooter) {
          const foot = util.el('footer', 'ref-foot', document.body);
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
          for (const button of _c.headerTools.querySelectorAll('.ref-xtra')) tools.append(button);
          if (decoys.length) decoyBtn(tools, decoys[0]);
          if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
          if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
        }
        Object.assign(_c, { submit });
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const { ctx, endBtn, headerTools, label, main, placement, util } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }
        const secondaryTools = util.el('div', 'sf-secondary-tools', main);
        Object.assign(_c, { secondaryTools, submit });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { stage } = _c;
        S.frameAlign(_c, stage);
      },
  };

  env.site({
    name: 'design-scroll-page-lazy-05',
    template: 'site/base',
    design: { parts },
  });
})();
