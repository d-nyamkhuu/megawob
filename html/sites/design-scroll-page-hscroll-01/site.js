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
      document.body.classList.add('gnome-help');
      const windowbar = util.el('div', 'gnome-windowbar', document.body);
      util.el('span', 'gnome-appmark', windowbar, '✿');
      util.el('strong', 'gnome-windowtitle', windowbar, 'Help Browser');
      util.el('span', 'gnome-wincontrols', windowbar, '−　□　×');
      const menubar = util.el('nav', 'gnome-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Go', 'Bookmarks', 'Help']) util.el('span', '', menubar, item);
      const toolbar = util.el('div', 'gnome-toolbar', document.body);
      util.el('span', 'gnome-tool', toolbar, '◀　Back');
      util.el('span', 'gnome-tool muted', toolbar, '▶　Forward');
      util.el('span', 'gnome-tool', toolbar, '⌂　Home');
      util.el('span', 'gnome-tool', toolbar, '▤　Print');
      util.el('span', 'gnome-tool', toolbar, '⌕　Find');
      Object.assign(_c, { collide, cr, decoys, label, menubar, nav, placement, sidebar, toolbar, wantFooter, windowbar });
    },
    'frame.header': (base, S) => function (_c) {
      const { display, lr, nav, util, word } = _c;
      const { K } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) {
        const title = 'ubuntu';
        const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
        brand.dataset.role = 'brand';
      }
      Object.assign(_c, { header });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      const inspector = util.el('aside', 'gnome-inspector', body);
      util.el('div', 'gnome-inspector-heading', inspector, 'Topic Details');
      const card = util.el('div', 'gnome-inspector-card', inspector);
      util.el('div', 'gnome-file-icon', card, '▤');
      util.el('strong', '', card, 'Help article');
      util.el('hr', '', inspector);
      util.el('b', '', inspector, 'Last updated');
      util.el('span', '', inspector, 'April 28, 2006');
      util.el('b', '', inspector, 'Version');
      util.el('span', '', inspector, 'Ubuntu 6.06 LTS');
      util.el('b', '', inspector, 'Related Topics');
      for (const item of ['Audio and Music', 'Video', 'Internet']) util.el('a', 'gnome-related', inspector, item);
      S.frameAlign(_c, stage);
      Object.assign(_c, { card, inspector, stage });
    },
  };

  env.site({
    name: 'design-scroll-page-hscroll-01',
    template: 'site/base',
    design: { parts },
  });
})();
