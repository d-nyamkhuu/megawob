// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) => function (_c) {
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
      // This reference design has a fixed Vista blue palette; retain the draws above for seed stability.
      name = 'light';
      accent = '#0876c9';
      for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name])) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', accent);
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, util, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      const windowControls = util.el('div', 'ref-window-controls', document.body);
      util.el('span', 'ref-window-min', windowControls, '−');
      util.el('span', 'ref-window-max', windowControls, '□');
      util.el('span', 'ref-window-close', windowControls, '×');
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter, windowControls });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) rng.pick(TITLES);
      const brand = util.el('div', 'ref-brand', header, 'Tidewater Utilities');
      brand.dataset.role = 'brand';
      const n = util.el('nav', 'ref-nav', header);
      {
        // Keep the original nav content draws so every later seeded frame choice stays stable.
        local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        const items = ['Home', 'My Account', 'Billing', 'Service & Outages', 'Customer Support'];
        for (const item of items) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      const utilities = util.el('div', 'ref-utilities', header);
      util.el('span', 'ref-contact', utilities, 'Contact Us');
      const search = util.el('div', 'ref-search', utilities);
      util.el('span', '', search, 'Search Help');
      util.el('b', '', search, '⌕');
      Object.assign(_c, { brand, header, n, search, utilities });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const ticket = util.el('section', 'ref-ticket', body);
      const summary = util.el('div', 'ref-ticket-summary', ticket);
      const replyTitle = util.el('div', 'ref-reply-title', ticket, 'Add a Reply');
      const replyTabs = util.el('div', 'ref-reply-tabs', ticket);
      util.el('div', 'ref-reply-tab', replyTabs, '▤　Write a Message');
      util.el('div', 'ref-reply-tab', replyTabs, '♧　Attach a File');
      util.el('div', 'ref-reply-tab ref-reply-tab-active', replyTabs, '♩　Record a Voice Note');
      ticket.append(stage);
      const context = util.el('section', 'ref-page-context', summary);
      util.el('h1', '', context, 'Support Ticket #842317');
      util.el('strong', '', context, 'Water service question');
      util.el('div', 'ref-opened', context, 'Opened May 14, 2007');
      util.el('div', 'ref-message', context);
      util.el('b', '', context.querySelector('.ref-message'), 'You');
      util.el('span', '', context.querySelector('.ref-message'), 'May 14, 2007   10:26 AM');
      util.el('p', '', context.querySelector('.ref-message'), 'I’m seeing lower water pressure at my home. Can you help?');
      const inspector = util.el('aside', 'ref-inspector', summary);
      util.el('h2', '', inspector, 'Tips');
      const tips = util.el('ul', 'ref-tip-list', inspector);
      for (const tip of ['You can record a short voice note to add details to your ticket.',
        'Make sure your microphone is connected and working.',
        'Speak clearly and keep your message under 2 minutes.']) util.el('li', '', tips, tip);
      Object.assign(_c, { context, inspector, replyTabs, replyTitle, stage, tips });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-protect-privacy-permissions-04',
    template: 'site/base',
    design: { parts },
  });
})();
