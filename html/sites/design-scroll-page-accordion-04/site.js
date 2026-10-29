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
        const body = document.querySelector('.ref-body');
        if (body) body.before(el);
      } else {
        dismiss = btn('×', 'close', false);
        dismiss.setAttribute('aria-label', word ? word('close') : 'Close');
      }
      if (kind === 'promo') {
        const art = util.el('div', 'metro-promo-art', null, '✉');
        box.prepend(art);
        const heading = util.el('h2', '', null, 'Get the latest from Microsoft');
        box.insertBefore(heading, box.querySelector('.ref-ov-text'));
        const input = util.el('input', 'metro-overlay-input', null);
        input.placeholder = 'Enter your email address';
        input.setAttribute('aria-label', 'Email address');
        box.insertBefore(input, row);
        const close = util.el('button', 'metro-overlay-close', box, '×');
        close.type = 'button';
        close.setAttribute('aria-label', 'Close');
        close.addEventListener('click', () => ctx.dismiss('close'));
        const note = document.querySelector('.ps-head .ref-instruction');
        if (note) el.style.top = Math.max(134, note.getBoundingClientRect().bottom + 8) + 'px';
      } else if (kind === 'chat') {
        const heading = util.el('div', 'metro-chat-title', null, 'Chat with us');
        box.prepend(heading);
        const input = util.el('input', 'metro-overlay-input', box);
        input.placeholder = 'Type a message...';
        input.setAttribute('aria-label', 'Chat message');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
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
      const caption = util.el('div', 'metro-caption', document.body);
      util.el('span', 'metro-caption-icon', caption, '▦');
      util.el('span', '', caption, 'Microsoft Support - Help Center');
      const windowControls = util.el('span', 'metro-caption-controls', caption);
      for (const glyph of ['−', '□', '×']) util.el('span', '', windowControls, glyph);
      Object.assign(_c, { caption, collide, cr, decoys, label, nav, placement, sidebar, wantFooter, windowControls });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);

      // Stable Metro Support masthead. Keep the inherited frame draws above unchanged;
      // these elements provide the fixed visual identity of this design in every episode.
      const mast = util.el('div', 'metro-mast', header);
      const brandMark = util.el('span', 'metro-mark', mast);
      for (const c of ['#f25022', '#7fba00', '#00a4ef', '#ffb900']) {
        const sq = util.el('i', '', brandMark); sq.style.background = c;
      }
      util.el('span', 'metro-microsoft', mast, 'Microsoft');
      util.el('span', 'metro-divider', mast, '|');
      util.el('span', 'metro-support', mast, 'Support');
      const search = util.el('div', 'metro-top-search', mast);
      util.el('span', '', search, 'Search Microsoft Support');
      util.el('b', 'metro-search-icon', search);
      util.el('span', 'metro-signin', mast, 'Sign in');
      const mainNav = util.el('nav', 'metro-main-nav', header);
      ['Products', 'Devices', 'Account & billing', 'Troubleshooting', 'More support'].forEach((label) => {
        const item = util.el('span', '', mainNav, label);
        util.el('b', '', item, '⌄');
      });
      Object.assign(_c, { brandMark, mainNav, mast, search });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, mast, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      mast.append(headerTools);
      Object.assign(_c, { headerTools, submit });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const help = util.el('aside', 'metro-sidebar', body);
      util.el('div', 'metro-side-title', help, 'Help topics');
      const topics = ['Get started', 'Account help', 'Troubleshoot problems', 'Microsoft Store', 'Devices', 'Windows', 'Office', 'Surface', 'Xbox', 'Privacy & safety', 'More support'];
      topics.forEach((item, i) => {
        const link = util.el('a', `metro-topic${i === 0 ? ' selected' : ''}`, help, item);
        link.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
      });
      const tips = util.el('section', 'metro-tips', help);
      const tipTitle = util.el('div', 'metro-tip-title', tips);
      const bulb = util.el('span', 'metro-bulb', tipTitle);
      bulb.innerHTML = '<svg viewBox="0 0 40 42" aria-hidden="true"><g stroke="#0085ff" stroke-width="1.8" fill="none"><path d="M14 26c0-5-6-7-6-14a12 12 0 0124 0c0 7-6 9-6 14v6H14Zm0 2h12m-11 7h10m-8 3h6M20 0v-5M3 5l-4-3m38 3 4-3M2 17h-6m42 0h6M5 29l-4 4m34-4 4 4"/></g></svg>';
      util.el('span', '', tipTitle, 'Tips for using FAQs');
      util.el('p', '', tips, 'Browse the questions below to find a topic that matches your issue.');
      util.el('p', '', tips, 'Click a question to expand it and see the answer.');
      util.el('p', '', tips, 'You can scroll down to see more questions on this page.');
      const resources = util.el('section', 'metro-resources', help);
      util.el('div', '', resources, 'Related resources');
      const resourceLinks = util.el('div', 'metro-resource-links', resources);
      for (const [icon, text, cls] of [['windows', 'Windows help', 'windows'], ['office', 'Office help', 'office'],
        ['devices', 'Surface help', 'surface'], ['xbox', 'Xbox help', 'xbox']]) {
        const resource = util.el('div', 'metro-resource', resourceLinks);
        util.el('span', `metro-glyph ${cls}`, resource).dataset.icon = icon;
        util.el('span', '', resource, text);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, bulb, help, resourceLinks, resources, tipTitle, tips, topics });
    },
    'frame.panel': (base, S) => function (_c) {
      const { ctx, display, help, lr, rng, tips, util, word } = _c;
      const { K } = S;
      if (display === 'panel') {
        const panel = util.el('aside', 'ref-panel', help);
        const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
        help.insertBefore(panel, help.children[9] || tips);
        rng.bool(0.5); // preserve the baseline draw while keeping the help rail on the left
      }
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const dock = util.el('nav', 'metro-dock', document.body);
      [['home', 'Home'], ['account', 'Account'], ['devices', 'Devices'], ['windows', 'Products'], ['support', 'Support']].forEach(([icon, text], i) => {
        const item = util.el('div', `metro-dock-item${i === 0 ? ' active' : ''}`, dock);
        util.el('span', 'metro-dock-icon metro-glyph', item).dataset.icon = icon;
        util.el('span', '', item, text);
      });
      const glyphs = {
        home: '<path d="M2 12 12 3l10 9-2 2-2-2v10h-5v-7h-4v7H4V12Z"/><path d="M17 3h3v5l-3-3Z"/>',
        account: '<circle cx="12" cy="7" r="5"/><path d="M3 23v-4a9 9 0 0118 0v4Z"/>',
        devices: '<path d="M3 3h18v14H3Z" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M1 19h22v2H1Z"/>',
        windows: '<path d="M1 3 11 2v10H1Zm12-1 10-1v11H13ZM1 14h10v10L1 23Zm12 0h10v11l-10-1Z"/>',
        support: '<circle cx="12" cy="12" r="11"/><path d="M9 8a3 3 0 116 0c0 3-3 3-3 6m0 3v2" fill="none" stroke="#293139" stroke-width="2"/>',
        office: '<path d="m5 4 11-3 5 2v20l-5 2-11-4 11 1V5L8 7v12l-3 1Z"/>',
        xbox: '<circle cx="12" cy="12" r="11"/><path d="M5 4c4 0 10 8 14 16M19 4C15 4 9 12 5 20" fill="none" stroke="white" stroke-width="2.5"/>',
      };
      for (const glyph of document.querySelectorAll('.metro-glyph')) {
        glyph.innerHTML = `<svg viewBox="0 0 26 26" aria-hidden="true" fill="currentColor">${glyphs[glyph.dataset.icon]}</svg>`;
      }
      Object.assign(_c, { dock, glyphs, stage });
    },
  };

  env.site({
    name: 'design-scroll-page-accordion-04',
    template: 'site/base',
    design: { parts },
  });
})();
