// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.layout': (base, S) => function (_c) {
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

      // Hushwell's early Flash desktop frame: title, application menu and icon strip.
      const frame = util.el('div', 'hw-frame', document.body);
      util.el('div', 'hw-appicon', frame, '❧');
      util.el('strong', 'hw-window-title', frame, 'Hushwell  -  My Account');
      util.el('div', 'hw-window-buttons', frame, '−　□　×');
      const menu = util.el('nav', 'hw-menu', document.body);
      for (const item of ['File', 'Edit', 'View', 'Account', 'Tools', 'Help']) util.el('span', '', menu, item);
      const toolbar = util.el('div', 'hw-toolbar', document.body);
      for (const [icon, item] of [['⌂','Home'], ['♙','My Account'], ['▣','Billing'], ['▤','Subscriptions'], ['✉','Messages'], ['⚙','Settings'], ['?','Help']]) {
        const t = util.el('span', 'hw-tool', toolbar);
        util.el('b', '', t, icon); util.el('span', '', t, item);
      }
      Object.assign(_c, { H, W, display, frame, menu, roomy, tall, toolbar });
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebarDraw = roomy && rng.bool(0.35);
      const navDraw = W >= 1180 && rng.bool(0.5);
      // This design is the Brightpage desktop app: its left rail and account tabs
      // are part of the application frame on every episode.
      const sidebar = true;
      const nav = false;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, sidebarDraw, wantFooter });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, sidebar, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      let side = null;
      if (sidebar) {
        side = util.el('aside', 'ref-side', body);
        util.el('div', 'bp-logo', side, '◧');
        util.el('div', 'bp-brand', side, 'Brightpage Books');
        const sideItems = local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
        for (const [i, item] of ['Hushwell\nPremium Plan · Active', 'BeatStream\nIndividual Plan', 'SkyDrive\n100 GB Plan',
          'Daily Chronicle\nDigital Access', 'CineNow\nStandard Plan', 'PlayZone\nMonthly Plan', 'ShopKart\nMember', 'TripEasy\nTraveller Plan', 'SureHome\nBasic Plan'].entries()) {
          if (i === 6) util.el('div', 'hw-other-title', side, 'Other Accounts');
          const label = item;
          const a = util.el('a', 'ref-sidelink', side, label);
          a.dataset.record = String(i);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label }); });
        }
      }
      Object.assign(_c, { body, side });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, H, side, util } = _c;
      const workspace = util.el('section', 'hw-workspace', body);
      const pageHead = util.el('div', 'bp-pagehead', workspace);
      util.el('div', 'bp-title', pageHead, 'Hushwell');
      const tabs = util.el('div', 'bp-tabs', pageHead);
      for (const [i, tab] of ['Overview', 'Billing', 'Settings', 'Support'].entries()) {
        const t = util.el('span', i === 0 ? 'bp-tab active' : 'bp-tab', tabs, tab);
      }
      if (H <= 800 && side) {
        side.classList.add('hw-side-header');
        side.insertBefore(pageHead, side.firstChild);
      }
      const stage = util.el('main', 'ref-stage', workspace);
      const help = util.el('aside', 'bp-help', body);
      util.el('div', 'bp-help-title', help, 'Help & Support');
      for (const [title, copy, link] of [
        ['Managing your subscription', 'You can change your plan, update your payment method or cancel your membership at any time.', 'How do I cancel my subscription? ›'],
        ['Billing questions', 'View your billing history and receipts in Purchase History.', 'More about billing ›'],
        ['Need more help?', 'Visit our Help Centre for more information or contact our support team.', 'Go to Help Centre ›']
      ]) {
        const section = util.el('section', 'bp-help-section', help);
        util.el('div', 'bp-help-heading', section, title);
        util.el('div', 'bp-help-copy', section, copy);
        util.el('div', 'bp-help-link', section, link);
      }
      S.frameAlign(_c, stage);
      Object.assign(_c, { help, pageHead, stage, tabs });
    },
  };

  env.site({
    name: 'design-avoid-dark-patterns-roach-04',
    template: 'site/base',
    design: { parts },
  });
})();
