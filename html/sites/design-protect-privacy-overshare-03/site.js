// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
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

      // KDE Breeze window frame, menu and mail actions.
      const titlebar = util.el('div', 'km-titlebar', document.body);
      util.el('span', 'km-envelope', titlebar, '✉');
      util.el('span', 'km-title', titlebar, 'Ironbark Energy - Mail & Support');
      util.el('span', 'km-window-controls', titlebar, '−　□　×');
      const menubar = util.el('nav', 'km-menubar', document.body);
      for (const item of ['Mail', 'Support', 'Accounts', 'Billing', 'Help']) {
        util.el('span', 'km-menu-item', menubar, item);
      }
      const appbar = util.el('div', 'km-appbar', document.body);
      for (const [icon, label] of [['▧', 'New Message'], ['↶', 'Reply'], ['➦', 'Forward'], ['▤', 'Delete'], ['⊘', 'Spam']]) {
        const item = util.el('span', 'km-action', appbar);
        util.el('b', '', item, icon);
        util.el('span', '', item, label);
      }
      Object.assign(_c, { appbar, collide, cr, decoys, label, menubar, nav, placement, sidebar, titlebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { display, util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      header.dataset.display = display;
      S.frameBrand(_c, header);
      Object.assign(_c, { header });
    },
    'frame.panel': (base, S) => function (_c) {
      const { body, ctx, display, lr, rng, util, word } = _c;
      const { K } = S;
      if (display === 'panel') {
        const panel = util.el('aside', 'ref-panel', body);
        const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
        if (rng.bool(0.5)) body.classList.add('ref-panel-right');
      }
      const inspector = util.el('aside', 'ref-inspector', body);
      // The task card shares the inspector's column rather than squeezing the app.
      const panel = body.querySelector('.ref-panel');
      if (panel) inspector.append(panel);
      util.el('div', 'ref-inspector-head', inspector, 'Conversation Details');
      const facts = util.el('div', 'ref-inspector-facts', inspector);
      for (const [key, value] of [['From', 'Support desk'], ['Subject', 'Account assistance'],
        ['Reference', 'Open request'], ['Opened', 'Today'], ['Status', 'Open'],
        ['Category', 'Account access'], ['Attachments', '0']]) {
        const row = util.el('div', 'ref-inspector-row', facts);
        util.el('b', '', row, `${key}:`);
        util.el('span', '', row, value);
      }
      util.el('div', 'ref-inspector-rule', inspector);
      util.el('div', 'ref-inspector-head', inspector, 'Related Articles');
      const articles = util.el('div', 'ref-inspector-articles', inspector);
      for (const title of ['Verifying your identity', 'Resetting online access',
        'Keeping your account secure', 'Updating contact details']) {
        const link = util.el('div', 'ref-inspector-article', articles);
        util.el('b', '', link, '▤');
        util.el('span', '', link, title);
      }
      Object.assign(_c, { articles, facts, inspector });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const dock = util.el('div', 'km-dock', document.body);
      util.el('span', 'km-launcher', dock, 'K');
      util.el('span', 'km-folder-icon', dock, '▰');
      util.el('span', 'km-mail-icon', dock, '✉');
      util.el('span', 'km-dock-app', dock, 'KMail');
      util.el('span', 'km-dock-spacer', dock, '');
      util.el('span', 'km-tray', dock, '▣　◖　◉　⌃　10:22');
      Object.assign(_c, { dock, stage });
    },
  };

  env.site({
    name: 'design-protect-privacy-overshare-03',
    template: 'site/base',
    design: { parts },
  });
})();
