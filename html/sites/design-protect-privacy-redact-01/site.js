// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebarDraw = roomy && rng.bool(0.35);
      const sidebar = false;
      const navDraw = W >= 1180 && rng.bool(0.5);
      const nav = W >= 1180;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, sidebarDraw, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (true) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'CoreDocs');
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        const navCount = rng.int(3, 5);
        const sampledNav = local(rng.sample(content.NAV_ITEMS, navCount), K.nav);
        for (const item of ['Documents', 'Requests', 'Shared', 'Reports', 'Settings']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const help = util.el('aside', 'docs-help', body);
      util.el('h2', '', help, 'Redaction tools');
      util.el('p', '', help, 'Use the tools to redact sensitive information in the document. Select text and choose Redact, or use the Highlighter and then apply redactions.');
      util.el('h3', '', help, 'Common sensitive information');
      util.el('p', '', help, '•  Dates of birth (e.g., 06/17/1985)\n•  Email addresses (e.g., name@example.com)\n•  Social Security numbers (e.g., 123-45-6789)');
      util.el('h3', '', help, 'How to redact');
      util.el('p', '', help, '①  Select the text you want to redact.\n②  Click Redact or use the Highlighter tool.\n③  Click Apply to save your redactions.');
      util.el('h3', '', help, 'Tips');
      util.el('p', '', help, '•  Redact all instances, not just the first one.\n•  Review the entire document before exporting.\n•  Use the zoom controls if needed.');
      util.el('h3', '', help, 'Exporting');
      util.el('p', '', help, 'After applying your redactions, export the redacted document using the Export button above the document.');
      Object.assign(_c, { help, stage });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-protect-privacy-redact-01',
    template: 'site/base',
    design: { parts },
  });
})();
