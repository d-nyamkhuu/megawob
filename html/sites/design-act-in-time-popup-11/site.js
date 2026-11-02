(function () {
  'use strict';
  const palette = { bg: '#f1f4f6', panel: '#fff', fg: '#172235', muted: '#657286', line: '#d7dfe7' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const sel = window.getSelection();
      if (sel) sel.removeAllRanges();
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, 'LedgerPro');
      const nav = u.el('nav', 'ds-menu', top);
      ['Transactions', 'Contacts', 'Reports', 'Settings'].forEach((t, i) => u.el('span', i === 0 ? 'active' : '', nav, t));
      const utilities = u.el('div', 'ds-utilities', top);
      u.el('span', 'ds-bell', utilities, '●');
      u.el('span', '', utilities, 'Help');
      const work = u.el('div', 'ds-workspace', document.body);
      Object.assign(_c, { header: work, utilities, work });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction-note', 'ds-note-header', 'ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.utilities;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util, work = _c.work;
      const ledger = u.el('section', 'ds-ledger', work);
      u.el('h1', '', ledger, 'Transaction Ledger');
      const tools = u.el('div', 'ds-ledger-tools', ledger);
      ['All accounts　⌄', 'Last 30 days　⌄', '⌕　Search transactions...'].forEach(t => u.el('div', 'ds-filter', tools, t));
      const add = u.el('button', 'ds-add', tools, '＋　Add transaction');
      add.type = 'button';
      const table = u.el('div', 'ds-table', ledger);
      ['Date', 'Description', 'Category', 'Amount', 'Status'].forEach(t => u.el('span', '', table, t));
      const empty = u.el('div', 'ds-empty', ledger);
      u.el('div', 'ds-file-icon', empty, '▤');
      u.el('strong', '', empty, 'No transactions yet');
      u.el('span', '', empty, 'Add a transaction to get started.');
      u.el('section', 'ds-login-pane', work);
      const preview = u.el('aside', 'ds-preview', work);
      const ph = u.el('div', 'ds-preview-head', preview);
      u.el('b', '', ph, '▣　Document Preview');
      u.el('span', '', ph, '⌗');
      const invoice = u.el('div', 'ds-invoice', preview);
      u.el('strong', '', invoice, 'Invoice');
      u.el('span', 'ds-invoice-vendor', invoice, 'Acme Supplies\n123 Market St.\nRiverton, CA 94601');
      u.el('div', 'ds-invoice-lines', invoice, 'Bill To:　　　　　　　　　Invoice #\n▰▰▰▰▰　　　　　　　　　Date\n▰▰▰　　　　　　　　　Due Date');
      u.el('div', 'ds-invoice-grid', invoice, 'Item　　　　　　　　 Qty　　 Unit Price　　 Total\n▰▰▰▰▰　　　　　　 ▰▰　　 ▰▰▰　　 ▰▰▰\n▰▰▰▰▰　　　　　　 ▰▰　　 ▰▰▰　　 ▰▰▰');
      _c.body = work;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-instruction-note', 'ds-note-panel');
        panel.querySelector('.ref-panel-title').classList.add('ds-note-title');
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.work);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-instruction-note', 'ds-note-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.work.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      foot.querySelector('.ref-foot-text').textContent = 'All changes are saved automatically.';
      _c.work.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u=ctx.util,el=u.el('section','ds-overlay ds-overlay-'+ctx.kind,document.body);el.dataset.role='overlay';
      const texts={cookie:'We use cookies to remember your preferences.',toast:'Changes synced.',chat:'Hello. How can we help?',promo:'Try our new workspace.',banner:'Scheduled maintenance tonight.'};
      u.el('div','',el,texts[ctx.kind]);const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept all':'Close');dismiss.addEventListener('click',()=>ctx.dismiss('close'));return{el,dismiss,ttlSteps:ctx.kind==='toast'?4:0};
    },
  };
  env.site({
    name: 'design-act-in-time-popup-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-popup-11': palette },
      LOW_THEME: palette,
      ACCENTS: ['#f15a0a'],
      LOW_ACCENTS: ['#f15a0a'],
      parts,
    },
  });
})();
