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

      // Motif desktop frame: native title bar and the classic application menu row.
      const winbar = util.el('div', 'motif-titlebar', document.body);
      util.el('strong', 'metro-product', winbar, 'Form Builder');
      util.el('span', 'metro-title', winbar, 'Velvet Hammer Records · Participant intake');
      const wincontrols = util.el('span', 'motif-wincontrols', winbar);
      for (const mark of ['—', '□', '×']) util.el('i', '', wincontrols, mark);
      const menubar = util.el('div', 'motif-menubar', document.body);
      for (const item of ['Forms', 'Themes', 'Settings', 'Responses']) util.el('span', 'metro-menu-item', menubar, item);
      const menuSpacer = util.el('span', 'metro-menu-spacer', menubar);
      util.el('span', 'metro-menu-item metro-menu-right', menubar, 'Preview');
      util.el('span', 'metro-menu-item metro-menu-right', menubar, 'Logic');
      Object.assign(_c, { H, W, display, menuSpacer, menubar, roomy, tall, winbar, wincontrols });
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      // Keep the sibling site's seeded draws in place while this design always shows its help rail.
      const sampledSidebar = roomy && rng.bool(0.35);
      const sidebar = true;
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sampledSidebar, sidebar, wantFooter });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, sampledSidebar, sidebar, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) {
        // Preserve the former navigation sample draws; these labels are replaced by the Metro help navigation.
        if (sampledSidebar) local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
        const side = util.el('aside', 'ref-side', body);
        util.el('strong', 'metro-side-title', side, 'Form content');
        for (const [label, active] of [['Sections', true], ['Questions', false], ['Response rules', false], ['Validation', false], ['General settings', false]]) {
          const a = util.el('a', `ref-sidelink${active ? ' metro-active' : ''}`, side, label);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label }); });
        }
        util.el('div', 'metro-help-title', side, 'Help');
        util.el('strong', 'metro-help-head', side, 'Build your form');
        util.el('div', 'metro-help-copy', side, 'Add sections to organize your questions. Choose a question, then edit its details on the right.');
        util.el('strong', 'metro-tips-title', side, 'Tips');
        util.el('div', 'metro-tips-copy', side, '•  Use response rules to show or hide questions based on answers.\n•  Add validation to ensure accurate and complete responses.\n•  Reorder questions by dragging them in the list.');
      }
      Object.assign(_c, { body });
    },
  };

  env.site({
    name: 'design-use-form-builder-addq-04',
    template: 'site/base',
    design: { parts },
  });
})();
