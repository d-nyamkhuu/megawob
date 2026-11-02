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
      const navDraw = W >= 1180 && rng.bool(0.5);
      const sidebar = false;
      const nav = true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, sidebarDraw, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, ctx, display, local, lr, nav, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      const title = rng.pick(TITLES);
      const brand = util.el('div', 'ref-brand', header, 'City Health Centre  -  Appointment Booking');
      brand.textContent = 'Courier Management System';
      brand.dataset.role = 'brand';
      brand.setAttribute('aria-label', word ? word(lr.pick(K.brand)) : title);
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        const navItems = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
      const tabNames = ['File', 'Edit', 'View', 'Bookings', 'Customers', 'Reports', 'Tools', 'Help'];
      for (const i of [0, 1, 2, 3, 4, 5, 6]) {
          const item = navItems[i] || content.NAV_ITEMS[i];
          const a = util.el('a', 'ref-navlink', n, tabNames[i] || item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      if (display === 'header') { header.classList.add('courier-has-instruction'); util.el('div', 'ref-instruction', header, ctx.instruction); }
      else util.el('div', 'ref-spacer', header);
      const pagehead = util.el('div', 'ref-pagehead', header);
      util.el('div', 'ref-page-title', pagehead, 'New Appointment');
      const stats = util.el('aside', 'ref-stats', pagehead);
      util.el('div', 'ref-stats-title', stats, "Today's Appointments");
      for (const [key, value] of [['Scheduled:', '12'], ['Completed:', '7'], ['Remaining:', '5']]) {
        const row = util.el('div', 'ref-stats-row', stats);
        util.el('span', '', row, key);
        util.el('span', '', row, value);
      }
      Object.assign(_c, { brand, header, pagehead, stats, title });
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

      // The reference application's short command toolbar sits below the menu bar.
      const toolbar = util.el('div', 'courier-toolbar', header);
      for (const [icon, text] of [['▤','New'],['📂','Open'],['▣','Print'],['⌕','Find'],['♟','Customer'],['▣','Bookings'],['▥','Reports'],['ⓘ','Help']]) {
        const b = util.el('button', 'courier-tool', toolbar);
        b.type = 'button'; b.dataset.role = 'nav'; b.title = text;
        util.el('span', 'courier-tool-icon', b, icon); util.el('span', '', b, text);
        b.addEventListener('click', () => env.log('decoy', { what: 'nav', label: text }));
      }
      const help = util.el('aside', 'courier-help', document.body);
      util.el('h2', '', help, 'Help & Information');
      util.el('h3', '', help, 'About redelivery');
      util.el('p', '', help, 'Use this request if a delivery attempt has already been made and you need us to deliver the item again.');
      util.el('h3', '', help, 'What happens next?');
      const list = util.el('ol', '', help);
      for (const t of ['Tell us about the item.','Choose a collection option.','Confirm the delivery details.','Review your request.','We’ll send you a confirmation.']) util.el('li','',list,t);
      util.el('h3', '', help, 'Your redelivery code');
      util.el('p', '', help, 'Make a note of this code. You’ll need it later in the process.');
      Object.assign(_c, { headerTools, help, list, submit, toolbar });
    },
    'frame.nav': (base, S) => function (_c) {
    },
    'frame.instruction': (base, S) => function (_c) {
    },
    'frame.body': (base, S) => function (_c) {
      base(_c);
      _c.body.append(_c.help);
    },
  };

  env.site({
    name: 'design-recall-info-code-02',
    template: 'site/base',
    design: { parts },
  });
})();
