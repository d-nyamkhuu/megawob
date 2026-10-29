// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const help = util.el('aside', 'ref-journal-help', body);
      const helpHead = util.el('div', 'ref-journal-help-head', help);
      util.el('span', 'ref-journal-help-icon', helpHead, '💡');
      util.el('strong', '', helpHead, 'Journal Entry Tips');
      const tips = [
        'Copy the accounts and amounts from the source voucher.',
        'Ensure total debits equal total credits before posting.',
        'Include the voucher memo or a clear description.',
        'You can add or remove lines as needed.',
      ];
      for (const tip of tips) util.el('div', 'ref-journal-tip', help, tip);
      const accountsHead = util.el('div', 'ref-journal-help-head ref-journal-section-head', help);
      util.el('span', 'ref-journal-help-icon', accountsHead, '▤');
      util.el('strong', '', accountsHead, 'Common Accounts');
      const accounts = [['1000', 'Cash'], ['1200', 'Accounts Receivable'], ['2000', 'Accounts Payable'],
        ['4000', 'Office Supplies'], ['5000', 'Advertising'], ['6000', 'Professional Services'], ['7000', 'Travel & Entertainment']];
      for (const [number, label] of accounts) {
        const row = util.el('div', 'ref-journal-help-row', help);
        util.el('span', '', row, number);
        util.el('span', '', row, label);
      }
      const keysHead = util.el('div', 'ref-journal-help-head ref-journal-section-head', help);
      util.el('span', 'ref-journal-help-icon', keysHead, '▦');
      util.el('strong', '', keysHead, 'Keyboard Shortcuts');
      for (const [key, label] of [['Tab', 'Next field'], ['Shift + Tab', 'Previous field'], ['Ctrl + Enter', 'Add line'],
        ['Ctrl + D', 'Duplicate line'], ['Ctrl + 1–9', 'Go to line']]) {
        const row = util.el('div', 'ref-journal-help-row', help);
        util.el('span', '', row, key);
        util.el('span', '', row, label);
      }
      Object.assign(_c, { accounts, accountsHead, help, helpHead, keysHead, stage, tips });
    },
  };

  env.site({
    name: 'design-use-accounting-journal-02',
    template: 'site/base',
    design: { parts },
  });
})();
