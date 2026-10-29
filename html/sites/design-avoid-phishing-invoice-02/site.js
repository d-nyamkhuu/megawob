// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, util, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'header', 'header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      const titlebar = util.el('div', 'invoice-titlebar', document.body);
      util.el('span', 'invoice-appicon', titlebar, 'A');
      util.el('strong', '', titlebar, 'Apex Accounts Payable');
      const win = util.el('div', 'invoice-window-controls', titlebar);
      for (const mark of ['−', '□', '×']) util.el('span', '', win, mark);
      const menu = util.el('nav', 'invoice-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Go', 'Tools', 'Reports', 'Window', 'Help']) util.el('span', '', menu, item);
      const toolbar = util.el('div', 'invoice-toolbar', document.body);
      for (const [icon, label] of [['▤','New'],['✉','Mail'],['✉','Message'],['▣','Print'],['▣','Print'],['◉','Refresh'],['←','Back'],['→','Forward'],['↗','Next'],['↖','Previous'],['▦','List'],['▤','Grid'],['⌕','Search']]) {
        const tool = util.el('span', 'invoice-tool', toolbar);
        util.el('b', '', tool, icon); util.el('span', '', tool, label);
      }
      Object.assign(_c, { collide, cr, decoys, label, menu, nav, placement, sidebar, titlebar, toolbar, wantFooter, win });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const help = util.el('aside', 'invoice-help', body);
      util.el('div', 'invoice-help-title', help, 'Help & Tips');
      util.el('strong', '', help, 'Process an Invoice');
      util.el('p', '', help, 'Compare the invoice with the vendor master record. Check that the vendor, amount and bank account match.');
      util.el('p', '', help, 'If everything matches you can post the invoice for payment. If there are differences, place it on hold and add a note.');
      util.el('strong', '', help, 'Bank Account Check');
      util.el('p', '', help, "Ensure the invoice's bank account matches the vendor master record. Be alert for changed account numbers or unknown banks.");
      util.el('strong', '', help, 'Common Reasons for Hold');
      util.el('p', '', help, '•　Vendor not found\n•　Amount does not match\n•　Bank account differs\n•　Missing or unclear details\n•　Possible phishing attempt');
      const records = util.el('aside', 'invoice-records', body);
      util.el('div', 'invoice-list-title', records, '✦　Inbox - Accounts Payable');
      util.el('div', 'invoice-record-filter', records, 'All Invoices　⌄');
      util.el('div', 'invoice-record-heading', records, 'Ref');
      // Decorative records stay independent of the episode's goal and instruction.
      for (let n = 2887; n <= 2896; n++) {
        const row = util.el('div', 'invoice-record', records);
        util.el('span', '', row, '▤'); util.el('span', '', row, `CASE-${n}`);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, help, records });
    },
    'frame.footer': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
      let { submit } = _c;
      if (wantFooter) {
        const foot = util.el('footer', 'ref-foot', document.body);
        const footText = rng.pick(['© 2024 Example Co.', 'All changes are saved automatically.',
          'Need help? Contact your administrator.', 'v4.2.1 · Status: all systems normal']);
        util.el('span', 'ref-foot-text', foot, word ? lr.pick([`© 2024 Example Co. ${word('footRights')}`,
          word('footSaved'), word('footHelp'), `v4.2.1 · ${word('footStatus')}`]) : footText);
        const tools = util.el('div', 'ref-tools', foot);
        if (decoys.length > 1) decoyBtn(tools, decoys[1]);
        if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
        if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
        if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
      }
      const dock = util.el('nav', 'invoice-dock', document.body);
      for (const [icon, item] of [['◆','Home'],['✉','Inbox'],['♟','Vendors'],['▤','Invoices'],['▤','Payments'],['▥','Reports'],['⚙','Settings']]) {
        const a = util.el('a', 'invoice-dock-item', dock);
        a.href = '#';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        util.el('b', '', a, icon); util.el('span', '', a, item);
      }
      Object.assign(_c, { dock, submit });
    },
  };

  env.site({
    name: 'design-avoid-phishing-invoice-02',
    template: 'site/base',
    design: { parts },
  });
})();
