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
        document.body.classList.toggle('ref-display-header', display === 'header');
        Object.assign(_c, { H, W, display, roomy, tall });
      },
    'frame.placement': (base, S) =>
      function (_c) {
        const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
        const { K, endLabel } = S;
        // End control placement (none in finish mode).
        let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
        const wantFooterDraw = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
        const wantFooter = true;
        if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
        const sidebar = roomy && rng.bool(0.35);
        const nav = W >= 1180 && rng.bool(0.5);
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (word) label = word(lr.pick(K.end));
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);
        Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter, wantFooterDraw });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const titlebar = util.el('div', 'cb-titlebar', header);
        util.el('span', 'cb-sun', titlebar, '✿');
        const mark = util.el('span', 'cb-library-mark', titlebar);
        mark.setAttribute('aria-hidden', 'true');
        mark.innerHTML =
          '<svg viewBox="0 0 112 88" xmlns="http://www.w3.org/2000/svg"><g fill="#fbf8ef" stroke="#741a22" stroke-width="2.5" stroke-linejoin="round"><path d="M7 24h15v58H7zM25 13h16v69H25zM44 8h15v74H44zM62 17h16v65H62zM81 29h14v53H81zM98 42l8-2 8 41h-15z"/><path d="M10 34h9M10 42h9M28 24h10M28 33h10M47 19h9M47 29h9M65 28h10M65 38h10M84 40h8M84 49h8"/><path d="M5 83h105" fill="none"/></g></svg>';
        util.el('strong', 'cb-title', titlebar, 'Riverton Public Library');
        const windowControls = util.el('div', 'cb-window-controls', titlebar);
        for (const glyph of ['−', '□', '×']) util.el('span', 'cb-window-control', windowControls, glyph);
        const menu = util.el('nav', 'cb-menu', header);
        for (const item of ['File', 'Edit', 'View', 'Insert', 'Format', 'Page', 'Publish', 'Tools', 'Help']) {
          const m = util.el('span', 'cb-menu-item', menu, item);
          m.dataset.role = 'nav';
        }
        const toolbar = util.el('div', 'cb-toolbar', header);
        for (const [icon, label] of [
          ['▧', 'New'],
          ['📂', 'Open'],
          ['🌐', 'Preview'],
          ['🌐', 'Publish'],
          ['✂', 'Cut'],
          ['▤', 'Copy'],
          ['▣', 'Paste'],
          ['↶', 'Undo'],
          ['↷', 'Redo'],
          ['▤', 'Page'],
          ['☷', 'Properties'],
          ['▧', 'Media'],
        ]) {
          const item = util.el('div', 'cb-tool', toolbar);
          util.el('span', 'cb-tool-icon', item, icon);
          util.el('span', 'cb-tool-label', item, label);
        }
        toolbar.appendChild(util.el('span', 'cb-tool-spacer', toolbar));
        S.frameBrand(_c, header);
        Object.assign(_c, { header, mark, menu, titlebar, toolbar, windowControls });
      },
    'frame.tools': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
        let submit = null;
        const headerTools = util.el('div', 'ref-tools', header);
        for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
        if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
        if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
        if (placement === 'icon') {
          submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
        }
        const record = util.el('section', 'ref-record', document.body);
        const summary = util.el('div', 'record-summary', record);
        util.el('h1', '', summary, 'Spring Newsletter');
        util.el('div', 'record-page', summary, 'Page: Library News');
        const facts = util.el('div', 'record-facts', summary);
        for (const [label, value] of [
          ['Status:', 'Unpublished'],
          ['Last edited:', 'Apr 8, 1996  10:24 AM'],
          ['Author:', 'Pat Morgan'],
        ]) {
          const row = util.el('div', 'record-fact', facts);
          util.el('span', '', row, label);
          util.el('strong', '', row, value);
        }
        const description = util.el('div', 'record-description', summary);
        util.el('span', '', description, 'Page description:');
        util.el('span', 'record-field', description, 'Library news and upcoming events.');
        const preview = util.el('div', 'record-preview', record);
        util.el('strong', '', preview, 'Riverton Public Library');
        const building = util.el('div', 'record-building', preview);
        building.setAttribute('aria-hidden', 'true');
        util.el('div', 'record-caption', preview, 'Books  ·  People  ·  A Stronger Community');
        const strokes = util.el('div', 'record-strokes', preview);
        for (let i = 0; i < 7; i++) util.el('i', '', strokes);
        const details = util.el('div', 'record-details', record);
        util.el('h2', '', details, 'Page Details');
        for (const [label, value] of [
          ['Template:', 'Newsletter'],
          ['Publication date:', 'Apr 15, 1996'],
          ['SEO title:', 'Riverton Public Library News'],
          ['SEO description:', 'News, events and resources from Riverton Public Library.'],
        ]) {
          const row = util.el('div', 'record-detail', details);
          util.el('span', '', row, label);
          util.el('span', 'record-field', row, value);
        }
        Object.assign(_c, {
          building,
          description,
          details,
          facts,
          headerTools,
          preview,
          record,
          strokes,
          submit,
          summary,
        });
      },
    'frame.footer': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, word } = _c;
        let { submit } = _c;
        {
          const tips = util.el('div', 'ref-help', document.body);
          util.el('strong', 'ref-help-title', tips, 'Help & Tips');
          const list = util.el('div', 'ref-help-copy', tips);
          util.el('div', '', list, '• Drag a block from the right into a page position.');
          util.el('div', '', list, '• Arrange blocks in the two-column layout (rows 1–2, left and right).');
          util.el('div', '', list, '• Use text, headings, dividers, quotes, images and more to build your page.');
        }
        {
          const foot = util.el('footer', 'ref-foot', document.body);
          const footText = rng.pick([
            '© 2024 Example Co.',
            'All changes are saved automatically.',
            'Need help? Contact your administrator.',
            'v4.2.1 · Status: all systems normal',
          ]);
          util.el(
            'span',
            'ref-foot-text',
            foot,
            word
              ? lr.pick([
                  `© 2024 Example Co. ${word('footRights')}`,
                  word('footSaved'),
                  word('footHelp'),
                  `v4.2.1 · ${word('footStatus')}`,
                ])
              : footText,
          );
          const tools = util.el('div', 'ref-tools', foot);
          if (decoys.length > 1) decoyBtn(tools, decoys[1]);
          if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
          if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
          if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
        }
        Object.assign(_c, { submit });
      },
  };

  env.site({
    name: 'design-use-site-builder-page-04',
    template: 'site/base',
    design: { parts },
  });
})();
