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
      const app = util.el('div', 'app-shell', document.body);
      const rail = util.el('aside', 'app-rail', app);
      util.el('div', 'app-logo', rail, ' ');
      const navItems = [
        ['✉', 'Campaigns'], ['♟', 'Subscribers'], ['▤', 'Templates'], ['▮', 'Reports'], ['⚙', 'Settings'],
      ];
      for (const [icon, text] of navItems) {
        const item = util.el('div', text === 'Subscribers' ? 'app-nav selected' : 'app-nav', rail);
        util.el('span', 'app-nav-icon', item, icon);
        util.el('span', 'app-nav-label', item, text);
      }
      const records = util.el('main', 'app-records', app);
      const recordHead = util.el('div', 'app-record-head', records);
      util.el('div', 'app-record-title', recordHead, 'Subscribers');
      util.el('div', 'app-record-count', recordHead, '248 subscribers');
      const table = util.el('div', 'app-table', records);
      const th = util.el('div', 'app-row app-th', table);
      util.el('span', '', th, 'Name');
      util.el('span', '', th, 'Email');
      const subscriberRows = [
        ['Ava Chen', 'ava.chen@example.com'], ['Liam Brooks', 'liam.brooks@example.com'],
        ['Noah Patel', 'noah.patel@example.com'], ['Emma Davis', 'emma.davis@example.com'],
        ['Olivia Martin', 'olivia.martin@example.com'], ['William Scott', 'william.scott@example.com'],
        ['Sophia Lee', 'sophia.lee@example.com'], ['James Wright', 'james.wright@example.com'],
        ['Isabella Turner', 'isabella.turner@example.com'], ['Mason Clark', 'mason.clark@example.com'],
        ['Mia Robinson', 'mia.robinson@example.com'], ['Ethan Walker', 'ethan.walker@example.com'],
        ['Charlotte Hall', 'charlotte.hall@example.com'], ['Benjamin Young', 'benjamin.young@example.com'],
        ['Amelia King', 'amelia.king@example.com'],
      ];
      for (const row of subscriberRows) {
        const line = util.el('div', 'app-row', table);
        util.el('span', '', line, row[0]);
        util.el('span', '', line, row[1]);
      }

      // Sun Open Look application frame. The task widgets remain owned by the
      // composition widget; these controls are decorative application frame.
      const winbar = util.el('div', 'ol-titlebar', document.body);
      util.el('span', 'ol-app-icon', winbar, '◈');
      util.el('strong', 'ol-window-title', winbar, 'Media Tools');
      const winctl = util.el('div', 'ol-window-controls', winbar);
      for (const glyph of ['−', '□', '×']) util.el('span', 'ol-winctrl', winctl, glyph);
      const menubar = util.el('nav', 'ol-menubar', document.body);
      for (const label of ['File', 'Edit', 'View', 'Tools', 'Help']) {
        const m = util.el('span', 'ol-menu', menubar, label);
        util.el('i', 'ol-pushpin', m, '');
      }
      const toolbar = util.el('div', 'ol-toolbar', document.body);
      for (const [glyph, label, selected] of [['▤', 'Media', false], ['☷', 'Adjust', true], ['□', 'Library', false], ['↶', 'Return', false]]) {
        const b = util.el('div', `ol-tool${selected ? ' selected' : ''}`, toolbar);
        util.el('span', 'ol-tool-icon', b, glyph);
        util.el('span', '', b, label);
      }
      Object.assign(_c, { app, collide, cr, decoys, label, menubar, nav, navItems, placement, rail, recordHead, records, sidebar, subscriberRows, table, th, toolbar, wantFooter, winbar, winctl });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, display, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      stage.style.justifyContent = 'center';
      stage.style.alignItems = 'center';
      if (display === 'header') stage.classList.add('has-header-note');
      const inspector = util.el('aside', 'ol-inspector', body);
      util.el('div', 'ol-inspector-head', inspector, 'Properties');
      const inspectTop = util.el('div', 'ol-inspect-top', inspector);
      util.el('div', 'ol-inspect-swatch', inspectTop);
      const vals = util.el('div', 'ol-inspect-values', inspectTop);
      for (const [k, v] of [['Hex:', '#7BEBEF'], ['Red:', '123'], ['Green:', '235'], ['Blue:', '239']]) {
        const row = util.el('div', 'ol-property', vals);
        util.el('span', '', row, k); util.el('span', '', row, v);
      }
      for (const [title, lines] of [
        ['Audio', ['Reverb:　　 8.0', 'Contrast:　 100']],
        ['Return Item', ['Canvas Backpack', 'Outdoor daypack', 'Item # CB-320', 'Category: Bags']],
        ['Library Info', ['Type:　　　 Equipment', 'Brand:　　　TrailPro', 'Color:　　　Green', 'Size:　　　 One Size']],
      ]) {
        const sec = util.el('section', `ol-inspect-section${title === 'Return Item' ? ' return-item' : ''}`, inspector);
        util.el('strong', '', sec, title);
        if (title === 'Return Item') {
          util.el('div', 'ol-bag-art', sec);
          const copy = util.el('div', 'ol-inspect-copy', sec);
          for (const line of lines) util.el('div', 'ol-inspect-line', copy, line);
        } else for (const line of lines) util.el('div', 'ol-inspect-line', sec, line);
      }
      Object.assign(_c, { inspectTop, inspector, stage, vals });
    },
  };

  env.site({
    name: 'design-complete-goals-appearance-03',
    template: 'site/base',
    design: { parts },
  });
})();
