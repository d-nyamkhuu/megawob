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
      util.el('span', 'km-title', titlebar, 'RIVET');
      const search = util.el('div', 'neo-search', titlebar);
      util.el('span', '', search, '⌕');
      util.el('span', '', search, 'Search conversations...');
      util.el('span', 'neo-bell', titlebar, '♟');
      util.el('span', 'neo-profile', titlebar, '●　Jordan Diaz　⌄');
      const menubar = util.el('nav', 'km-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Go', 'Message', 'Tools', 'Settings', 'Help']) {
        util.el('span', 'km-menu-item', menubar, item);
      }
      const appbar = util.el('div', 'km-appbar', document.body);
      for (const [icon, label] of [['▧', 'New Message'], ['↶', 'Reply'], ['➦', 'Forward'], ['▤', 'Delete'], ['⊘', 'Spam']]) {
        const item = util.el('span', 'km-action', appbar);
        util.el('b', '', item, icon);
        util.el('span', '', item, label);
      }
      Object.assign(_c, { appbar, collide, cr, decoys, label, menubar, nav, placement, search, sidebar, titlebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { display, util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      header.dataset.display = display;
      S.frameBrand(_c, header);
      Object.assign(_c, { header });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const rail = util.el('nav', 'neo-rail', body);
      for (const [icon, label] of [['✉', 'Inbox'], ['★', 'Starred'], ['▤', 'Drafts'], ['➤', 'Sent'], ['▰', 'Archive'], ['▤', 'Trash']]) {
        const item = util.el('div', 'neo-rail-item', rail);
        util.el('span', 'neo-rail-icon', item, icon);
        util.el('span', '', item, label);
      }
      const index = util.el('aside', 'neo-index', body);
      util.el('div', 'neo-index-title', index, 'Support Conversations');
      for (const [from, subject, excerpt, date] of [
        ['Ironbark Energy Support', 'Re: Account verification details', 'Hi again, we just need a few details...', 'Apr 12'],
        ['Maple Bank Support', 'Card replacement', 'Your new card has been shipped...', 'Apr 10'],
        ['Rivet Help Center', 'Your recent request', "We've updated your ticket...", 'Apr 8'],
        ['City of Brookdale', 'Water service inquiry', 'Thanks for your message...', 'Apr 5'],
        ['Leaf Logistics', 'Delivery address update', "We've changed your address...", 'Apr 2'],
        ['Ironbark Energy Support', 'Welcome to Ironbark Energy', 'Thanks for joining...', 'Mar 28'],
        ['PixelPlay', 'Account security notice', 'We noticed a new sign-in...', 'Mar 21'],
        ['HealthPlus Clinic', 'Your appointment', 'Appointment confirmed for Apr 3...', 'Mar 18'],
      ]) {
        const row = util.el('div', 'neo-mail-row', index);
        const meta = util.el('div', 'neo-mail-meta', row);
        util.el('strong', '', meta, from);
        util.el('span', '', meta, date);
        util.el('div', 'neo-mail-subject', row, subject);
        util.el('div', 'neo-mail-excerpt', row, excerpt);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, index, rail });
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
    name: 'design-protect-privacy-overshare-02',
    template: 'site/base',
    design: { parts },
  });
})();
