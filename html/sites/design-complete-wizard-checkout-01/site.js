// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
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
        document.body.classList.toggle('cad-header-note', display === 'header');
        Object.assign(_c, { H, W, display, roomy, tall });
      },
    'frame.placement': (base, S) =>
      function (_c) {
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

        // DraftSight-style application frame. Keep this frame separate from the task
        // widget so the wizard continues to own all scored interactions.
        const appTitle = util.el('div', 'cad-titlebar', document.body);
        util.el('span', 'cad-app-mark', appTitle, '◧');
        util.el('span', '', appTitle, 'DraftSight Professional - [Riverside_Bridge.dwg]');
        util.el('span', 'cad-window-controls', appTitle, '−　□　×');
        const menu = util.el('nav', 'cad-menubar', document.body);
        for (const item of [
          'File',
          'Edit',
          'View',
          'Insert',
          'Format',
          'Dimension',
          'Draw',
          'Modify',
          'Tools',
          'Window',
          'Help',
        ]) {
          util.el('span', '', menu, item);
        }
        const toolbar = util.el('div', 'cad-toolbar', document.body);
        util.el('span', 'cad-tool-icons', toolbar, '▱　▰　▣　▤　│　↶　↷　⌕　◯　⊙　⌁　╱　╲　⌂　⬡　▱');
        util.el('span', 'cad-tool-select', toolbar, '▣  ByLayer　⌄　　━━━━  ByLayer　⌄　　Continuous　⌄　　0.25 mm　⌄');
        Object.assign(_c, { appTitle, collide, cr, decoys, label, menu, nav, placement, sidebar, toolbar, wantFooter });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const explorer = util.el('div', 'cad-explorer', body);
        const project = util.el('aside', 'cad-project', explorer);
        util.el('div', 'cad-pane-title', project, 'Project Explorer');
        util.el(
          'div',
          'cad-tree',
          project,
          '▾  ▣  Riverside_Bridge\n　▾  ▰  Drawings\n　　▧  Riverside_Bridge.dwg\n　　▧  Sections.dwg\n　　▧  Details.dwg\n　▾  ▰  References\n　　▧  Topography.dwg\n　　▧  City_Map.dwg\n　▾  ▰  Layers\n　　 ◉  0\n　　 ◉  Structure\n　　 ◉  Dimensions\n　　 ◉  Annotations\n　　 ◉  Construction\n　　 ◉  Bridge\n　　 ◉  Water\n　　 ◉  Terrain',
        );
        const props = util.el('aside', 'cad-properties', explorer);
        util.el('div', 'cad-pane-title', props, 'Properties');
        util.el(
          'div',
          'cad-property-copy',
          props,
          'No selection\n\nGeneral\nColor　　　　 ByLayer\nLayer　　　　　0\nLinetype　　　 Continuous\nLineweight　　 0.25 mm\nTransparency　 0\n\nView\nCenter X　　　 43214.1736\nCenter Y　　　 23187.4168\nCenter Z　　　 0.0000\nHeight　　　　 512.3607\nWidth　　　　　910.7301',
        );
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, project, props });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const workspace = util.el('div', 'cad-workspace', body);
        const canvas = util.el('div', 'cad-blueprint', workspace);
        canvas.setAttribute('aria-hidden', 'true');
        const storeWindow = util.el('div', 'cad-store-window', workspace);
        const storeTitle = util.el('div', 'cad-store-title', storeWindow);
        util.el('span', 'cad-store-icon', storeTitle, '▣');
        util.el('span', '', storeTitle, 'Online Store');
        util.el('span', 'cad-store-close', storeTitle, '×');
        const storeTabs = util.el('nav', 'cad-store-tabs', storeWindow);
        for (const [i, item] of ['Home', 'Drawings', 'Materials', 'Components', 'Online Store', 'Support'].entries()) {
          const tab = util.el('span', i === 4 ? 'cad-store-tab active' : 'cad-store-tab', storeTabs, item);
        }
        const stage = util.el('main', 'ref-stage cad-stage', storeWindow);
        S.frameAlign(_c, stage);
        Object.assign(_c, { canvas, stage, storeTabs, storeTitle });
      },
  };

  env.site({
    name: 'design-complete-wizard-checkout-01',
    template: 'site/base',
    design: { parts },
  });
})();
