// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const appTitle = util.el('div', 'ref-brand', header, 'MarketHub');
      appTitle.dataset.role = 'brand';
      const win = util.el('div', 'ref-window-controls', header);
      for (const [label, glyph] of [['Minimize', '−'], ['Maximize', '□'], ['Close', '×']]) {
        const b = util.el('span', 'ref-window-control', win, glyph);
        b.setAttribute('aria-label', label);
      }
      const menu = util.el('nav', 'ref-menu', document.body);
      for (const item of ['File', 'Edit', 'View', 'Note', 'Format', 'Tools', 'Help']) util.el('span', 'ref-menu-item', menu, item);
      const actionbar = util.el('div', 'ref-actionbar', document.body);
      for (const [ico, label] of [['✚', 'New Note'], ['▱', 'Open'], ['↶', 'Undo'], ['↻', 'Redo']]) {
        const item = util.el('div', 'ref-action-item', actionbar);
        util.el('span', 'ref-action-icon', item, ico);
        util.el('span', '', item, label);
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { actionbar, appTitle, header, menu, win });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const rail = util.el('nav', 'ref-rail', body);
      for (const [ico, label] of [['⌂', 'Home'], ['▤', 'Notes'], ['✓', 'Tasks'], ['◇', 'Tags'], ['▤', 'Trash'], ['⚙', 'Settings']]) {
        const item = util.el('div', `ref-rail-item${label === 'Settings' ? ' selected' : ''}`, rail);
        util.el('span', 'ref-rail-icon', item, ico);
        util.el('span', '', item, label);
      }
      const info = util.el('aside', 'ref-info', body);
      util.el('h1', '', info, 'Preferences');
      util.el('p', 'ref-info-intro', info, 'Customize how EverNote Pro works for you. Changes are saved only when you click Save.');
      const tips = util.el('section', 'ref-tips', info);
      util.el('h2', '', tips, '💡  Tips');
      const list = util.el('ul', '', tips);
      for (const text of ['Use the settings search to quickly find an option.', 'Some settings show additional options when turned on.', 'Your changes apply across all your devices after saving.']) util.el('li', '', list, text);
      const help = util.el('section', 'ref-help', info);
      util.el('h2', '', help, '♧  Need help?');
      for (const text of ['Preferences overview', 'Manage your data', 'Notification settings', 'Billing and subscriptions', 'Privacy and security']) {
        const a = util.el('a', '', help, text); a.href = '#'; a.addEventListener('click', e => { e.preventDefault(); env.log('decoy', { what: 'help', label: text }); });
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, help, info, list, rail, tips });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      const payments = util.el('aside', 'mh-payments', body);
      const payhead = util.el('div', 'mh-payhead', payments);
      util.el('strong', '', payhead, '▤　Saved Payment Methods');
      const add = util.el('button', '', payhead, 'Add New');
      add.type = 'button';
      const table = util.el('div', 'mh-table', payments);
      for (const row of [['Type','Name','Last 4','Expires'],['VISA','Personal Visa','4242','12/2027'],['●●','Work Mastercard','5555','08/2026'],['AMEX','Amex Card','1001','03/2028'],['▤','Checking Account','6789','—'],['P','PayPal','—','—']]) {
        const line = util.el('div', 'mh-row', table);
        row.forEach((cell, i) => util.el('span', i === 0 ? 'mh-type' : '', line, cell));
        if (row[0] !== 'Type') { const edit = util.el('a', '', line, 'Edit'); edit.href = '#'; edit.addEventListener('click', e => { e.preventDefault(); env.log('decoy', {what:'payment-edit'}); }); }
      }
      S.frameAlign(_c, stage);
      Object.assign(_c, { add, payhead, payments, stage, table });
    },
  };

  env.site({
    name: 'design-change-settings-search-04',
    template: 'site/base',
    design: { parts },
  });
})();
