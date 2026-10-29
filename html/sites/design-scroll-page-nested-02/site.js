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
        if (kind === 'banner') document.querySelector('.ref-task').after(el);
        const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
        const message = util.el(
          'div',
          'ref-ov-text',
          box,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
        if (kind === 'promo') {
          const illustration = util.el('div', 'acme-newsletter-art', box);
          illustration.innerHTML =
            '<svg viewBox="0 0 160 170" aria-hidden="true"><circle cx="73" cy="95" r="66" fill="#eaf4ff"/><path d="M80 37L153 8L124 72L106 49L80 37Z" fill="#1682eb"/><path d="M106 49L153 8L115 56L109 77Z" fill="#0b5ab3"/><path d="M24 100L76 64L128 100V155H24Z" fill="#167ae0"/><path d="M39 86H114V133H39Z" fill="white"/><path d="M51 97H102M51 109H102" stroke="#b6d9f8" stroke-width="5"/><path d="M24 100L76 133L128 100V155H24Z" fill="#268df0"/><path d="M24 155L68 121L76 133L85 121L128 155" fill="#1170ca"/></svg>';
          const title = util.el('h2', 'acme-newsletter-title', box, 'Get the latest product updates');
          box.insertBefore(illustration, message);
          box.insertBefore(title, message);
          util.el('div', 'acme-newsletter-input', box, 'Your email address');
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
          const head = util.el('div', 'acme-chat-head', box, 'How can we help?');
          head.appendChild(dismiss);
          box.insertBefore(head, message);
          util.el('div', 'acme-chat-input', box, 'Type a message...');
        }
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.theme': (base, S) =>
      function (_c) {
        const { ctx } = _c;
        const { ACCENTS, LOW_ACCENTS, THEMES } = S;
        const { rng, util, content } = ctx;
        let name = rng.pick(Object.keys(THEMES));
        const root = document.documentElement;
        let accent = rng.pick(ACCENTS);
        const tr = rng.fork('chrome/theme');
        if (tr.bool(0.08)) {
          name = 'low';
          accent = tr.pick(LOW_ACCENTS);
        }
        // Keep the reference's white help article palette while consuming the clone's original theme draws.
        for (const [k, v] of Object.entries({
          bg: '#ffffff',
          panel: '#f3f8fc',
          fg: '#17345a',
          muted: '#60758c',
          line: '#c6d8e8',
        }))
          root.style.setProperty(`--${k}`, v);
        root.style.setProperty('--accent', '#075fc5');
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
        document.body.classList.toggle('ref-has-note', display === 'toast');
        document.body.classList.toggle('acme-header-note', display === 'header');
        Object.assign(_c, { H, W, display, roomy, tall });
      },
    'frame.placement': (base, S) =>
      function (_c) {
        const { content, ctx, local, lr, rng, roomy, tall, util, word } = _c;
        const { K, endLabel } = S;
        // End control placement (none in finish mode).
        let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
        const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
        if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
        const sidebar = roomy && rng.bool(0.35);
        rng.bool(0.5); // preserve the clone's navigation draw
        const nav = true;
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (word) label = word(lr.pick(K.end));
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);
        const windowbar = util.el('div', 'vista-windowbar', document.body);
        util.el('span', 'vista-ie-icon', windowbar, 'e');
        util.el('span', 'vista-window-title', windowbar, 'Acme Support');
        const winControls = util.el('div', 'vista-window-controls', windowbar);
        for (const glyph of ['−', '□', '×']) util.el('span', 'vista-window-control', winControls, glyph);
        Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter, winControls, windowbar });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { content, local, nav, rng, util } = _c;
        const { K, TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        {
          rng.pick(TITLES);
          const brand = util.el('div', 'ref-brand', header, 'Acme Support');
          brand.dataset.role = 'brand';
          util.el('span', 'vista-brand-divider', header);
          util.el('div', 'vista-section-title', header, '');
        }
        if (nav) {
          const n = util.el('nav', 'ref-nav', header);
          const sampledNav = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
          const navItems = ['Dashboard', 'Tickets', 'Knowledge Base', 'Reports', 'Customers', 'Admin'];
          for (const item of navItems) {
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
    'frame.instruction': (base, S) =>
      function (_c) {
        const { ctx, display, header, util } = _c;
        if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
        else util.el('div', 'ref-spacer', header);
        const search = util.el('div', 'vista-search', header);
        util.el('span', 'vista-search-label', search, 'Search...');
        util.el('span', 'vista-search-icon', search, '⌕');
        const account = util.el('div', 'acme-account-tools', header);
        for (const text of ['Help', 'Emily Carter']) {
          const item = util.el('a', 'acme-account-link', account, text);
          util.el('span', 'acme-menu-caret', item);
          item.addEventListener('click', () => env.log('decoy', { label: text }));
        }
        Object.assign(_c, { account, search });
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
        const intro = util.el('section', 'acme-intro', document.body);
        const introCopy = util.el('div', 'acme-intro-copy', intro);
        util.el('div', 'acme-kicker', introCopy, 'Knowledge Base');
        util.el('h1', 'acme-intro-title', introCopy, 'Help Center');
        util.el(
          'p',
          'acme-intro-lead',
          introCopy,
          'Find answers to common questions, learn how to use our product, and get troubleshooting advice. Browse the help articles below or search for a topic.',
        );
        const searchPanel = util.el('div', 'acme-article-search', introCopy);
        util.el('span', 'acme-search-glass', searchPanel);
        util.el('span', 'acme-search-placeholder', searchPanel, 'Search help articles...');
        util.el('span', 'acme-search-button', searchPanel, 'Search');
        const topics = util.el('aside', 'acme-topics', intro);
        util.el('span', 'acme-topics-icon', topics);
        const topicCopy = util.el('div', 'acme-topics-copy', topics);
        util.el('h2', '', topicCopy, 'Popular Topics');
        const topicList = util.el('ul', '', topicCopy);
        for (const topic of [
          'Getting Started',
          'Account Settings',
          'Billing and Payments',
          'Troubleshooting',
          'Tips and Best Practices',
        ]) {
          const li = util.el('li', '', topicList);
          const a = util.el('a', '', li, topic);
          a.href = '#';
          a.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'popular-topic', label: topic });
          });
        }
        Object.assign(_c, { headerTools, intro, introCopy, searchPanel, submit, topicCopy, topicList, topics });
      },
    'frame.panel': (base, S) =>
      function (_c) {
        const { body, ctx, display, intro, lr, rng, util, word } = _c;
        const { K } = S;
        if (display === 'panel') {
          const panel = util.el('aside', 'ref-panel', intro);
          const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
          util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
          util.el('div', 'ref-panel-text', panel, ctx.instruction);
          if (rng.bool(0.5)) body.classList.add('ref-panel-right');
        }
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        const inspector = util.el('aside', 'acme-inspector', body);
        const details = util.el('section', 'acme-inspector-card', inspector);
        util.el('h2', '', details, 'Article details');
        const empty = util.el('p', '', details, 'Select an article from the list to view its details here.');
        const fields = util.el('dl', '', details);
        for (const [key, value] of [
          ['Category', '—'],
          ['Last updated', '—'],
          ['Tags', '—'],
        ]) {
          util.el('dt', '', fields, key);
          util.el('dd', '', fields, value);
        }
        const resources = util.el('section', 'acme-inspector-card acme-resources', inspector);
        util.el('h2', '', resources, 'Related resources');
        const resourceList = util.el('div', '', resources);
        for (const item of ['Community forum', 'Contact support', 'Product announcements', 'System status']) {
          const row = util.el('div', '', resourceList);
          util.el('span', 'acme-resource-icon', row);
          const link = util.el('a', '', row, item);
          link.href = '#';
          link.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'resource', label: item });
          });
        }
        Object.assign(_c, { details, empty, fields, inspector, resourceList, resources, stage });
      },
    'frame.footer': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, headerTools, label, lr, placement, rng, util, wantFooter, word } =
          _c;
        let { submit } = _c;
        if (wantFooter) {
          const foot = util.el('footer', 'ref-foot', document.body);
          const footText = rng.pick([
            '© 2024 Example Co.',
            'All changes are saved automatically.',
            'Need help? Contact your administrator.',
            'v4.2.1 · Status: all systems normal',
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
          if (placement !== 'footer' && placement !== 'link') {
            while (tools.firstChild) headerTools.appendChild(tools.firstChild);
            foot.remove();
          }
        }
        Object.assign(_c, { submit });
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const { endBtn, header, label, placement, root, util } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }
        root.style.setProperty('--acme-header-height', `${header.getBoundingClientRect().height}px`);
        Object.assign(_c, { submit });
      },
    'frame.nav': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-scroll-page-nested-02',
    template: 'site/base',
    design: { parts },
  });
})();
