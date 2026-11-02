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

      // GTK Clearlooks window frame, menus, application tabs and mail actions.
      const titlebar = util.el('div', 'km-titlebar', document.body);
      util.el('span', 'km-envelope', titlebar, '✉');
      util.el('span', 'km-title', titlebar, 'Mail – Personal Folders');
      const winControls = util.el('span', 'km-window-controls', titlebar);
      for (const [cls, symbol] of [['min', '−'], ['max', '□'], ['close', '×']]) util.el('span', `km-win-${cls}`, winControls, symbol);
      const menubar = util.el('nav', 'km-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Go', 'Message', 'Tools', 'Help']) {
        util.el('span', 'km-menu-item', menubar, item);
      }
      const tabs = util.el('div', 'km-tabs', document.body);
      for (const [icon, label] of [['✉','Mail'], ['▤','Address Book'], ['▦','Calendar'], ['✓','Tasks'], ['▧','Notes']]) {
        const tab = util.el('span', 'km-tab', tabs);
        util.el('b', '', tab, icon); util.el('span', '', tab, label);
      }
      const appbar = util.el('div', 'km-appbar', document.body);
      for (const [icon, label] of [['✉', 'New Message'], ['↶', 'Reply'], ['↶', 'Reply All'], ['➦', 'Forward'], ['▤', 'Delete'], ['▧', 'Junk'], ['▤', 'Print']]) {
        const item = util.el('span', 'km-action', appbar);
        util.el('b', '', item, icon);
        util.el('span', '', item, label);
      }
      Object.assign(_c, { appbar, collide, cr, decoys, label, menubar, nav, placement, sidebar, titlebar, wantFooter, winControls });
    },
    'frame.header': (base, S) => function (_c) {
      const { display, util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      header.dataset.display = display;
      S.frameBrand(_c, header);
      Object.assign(_c, { header });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      Object.assign(_c, { stage });
    },
  };

  env.site({
    name: 'design-protect-privacy-overshare-05',
    template: 'site/base',
    design: { parts },
  });
})();
