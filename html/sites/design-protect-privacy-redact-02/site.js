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
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      const meta = util.el('section', 'report-meta', document.body);
      const mark = util.el('div', 'report-meta-mark', meta);
      util.el('span', 'report-meta-glyph', mark, '▤');
      const identity = util.el('div', 'report-meta-identity', meta);
      util.el('strong', '', identity, 'Accident Report');
      util.el('span', '', identity, 'Riverside Auto Center');
      util.el('span', '', identity, 'Service Department');
      const facts = util.el('div', 'report-meta-facts', meta);
      util.el('span', '', facts, 'Report No.: AR-10427');
      util.el('span', '', facts, 'Date: March 12, 1984');
      util.el('span', '', facts, 'Prepared by: Linda Park');
      util.el('span', '', facts, 'Type: Collision Report');
      const summary = util.el('aside', 'report-meta-summary', meta);
      util.el('strong', '', summary, 'Document Summary');
      for (const [label, value] of [['Total pages:', '3'], ['People mentioned:', '4'],
        ['Dates of birth:', '4'], ['Email addresses:', '3'], ['Home addresses:', '4']]) {
        const row = util.el('div', 'report-meta-count', summary);
        util.el('span', '', row, label);
        util.el('span', '', row, value);
      }
      Object.assign(_c, { facts, headerTools, identity, mark, meta, submit, summary });
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
    'frame.footer': (base) => function (_c) {
      base(_c);
      const foot = document.body.lastElementChild;
      if (foot.classList.contains('ref-foot')) _c.foot = foot;
    },
    'frame.floating': (base, S) => function (_c) {
      const { endBtn, label, placement, util } = _c;
      let { submit } = _c;
      let dock = null;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      const appDock = util.el('div', 'ref-dock', document.body);
      for (const [icon, name, active] of [['▣', 'Desk', false], ['▰', 'Documents', true],
        ['✉', 'Mail', false], ['▦', 'Calendar', false], ['▦', 'Calculator', false], ['▤', 'Wastebasket', false]]) {
        const item = util.el('div', `ref-dock-item${active ? ' is-active' : ''}`, appDock);
        util.el('span', 'ref-dock-icon', item, icon);
        util.el('span', 'ref-dock-label', item, name);
      }
      if (_c.foot) appDock.insertBefore(_c.foot, appDock.lastElementChild);
      if (dock) appDock.insertBefore(dock, appDock.lastElementChild);
      Object.assign(_c, { appDock, submit });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-protect-privacy-redact-02',
    template: 'site/base',
    design: { parts },
  });
})();
