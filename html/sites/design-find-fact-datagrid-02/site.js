(function () {
  'use strict';
  const palette = { bg: '#f5f2e9', panel: '#faf8f2', fg: '#20231a', muted: '#777365', line: '#d4cec0' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.classList.remove('ref-has-note');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const top = u.el('header', 'oak-top', document.body);
      u.el('strong', 'oak-brand', top, 'Oakridge & Co.');
      u.el('i', 'oak-section', top, 'Orders');
      u.el('nav', 'oak-links', top, 'Inventory　　Customers　　Orders　　Reports');
      u.el('div', 'oak-search', top, '⌕　Search...');
      const menu = u.el('nav', 'oak-menu', document.body);
      ['File', 'Edit', 'View', 'Records', 'Tools', 'Help'].forEach((x) => u.el('span', '', menu, x));
      const tools = u.el('div', 'oak-toolbar', document.body);
      const icons = [
        '<path d="M5 3h9l5 5v13H5z M14 3v5h5"/>',
        '<path d="M3 7h7l2 2h9v11H3z"/>',
        '<path d="m4 17 12.8-12.8a2 2 0 0 1 2.8 2.8L6.8 19.8 3 21z M14.5 6.5l3 3"/>',
        '<path d="M6 7h12l-1 14H7z M4 4h16 M9 4V2h6v2 M10 10v7 M14 10v7"/>',
        '<path d="M6 3h12v6H6z M4 9h16v8H4z M6 14h12v7H6z M8 11h2"/>',
        '<path d="M12 15V3m-5 5 5-5 5 5 M5 13v8h14v-8"/>',
      ];
      ['New', 'Open', 'Edit', 'Delete', 'Print', 'Export'].forEach((x, i) => {
        const b = u.el('div', 'oak-tool', tools);
        const icon = u.el('b', 'oak-icon', b);
        icon.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + icons[i] + '</svg>';
        u.el('span', '', b, x);
      });
      const shell = u.el('div', 'oak-shell', document.body);
      const left = u.el('div', 'oak-left', shell);
      const band = u.el('section', 'oak-summary', left);
      const title = u.el('div', 'oak-heading', band);
      u.el('h1', '', title, 'Orders');
      u.el('p', '', title, 'View and manage customer orders, track fulfillment and delivery status, and access order details.');
      const metrics = u.el('div', 'oak-metrics', band);
      [['1,248', 'Total Orders'], ['312', 'Pending'], ['789', 'Shipped'], ['147', 'Delivered']].forEach((x) => {
        const m = u.el('div', 'oak-metric', metrics);
        u.el('b', '', m, x[0]);
        u.el('span', '', m, x[1]);
      });
      Object.assign(_c, { tools, shell, left, header: band });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('oak-tasknote', 'ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.tools;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const main = u.el('main', 'oak-main', _c.left);
      const aside = u.el('aside', 'oak-aside', _c.shell);
      u.el('div', 'oak-photo', aside);
      const help = u.el('div', 'oak-help', aside);
      u.el('h2', '', help, 'Order Statuses');
      [
        ['#aaa', 'Pending – order received, not yet processed'],
        ['#2589bd', 'Processing – being prepared for shipment'],
        ['#d4a11e', 'Shipped – on the way to customer'],
        ['#21835b', 'Delivered – successfully delivered'],
      ].forEach((x) => {
        const row = u.el('div', 'oak-legend', help);
        const dot = u.el('i', '', row);
        dot.style.background = x[0];
        u.el('span', '', row, x[1]);
      });
      const tips = u.el('section', 'oak-tips', aside);
      u.el('h2', '', tips, 'Tips');
      const ul = u.el('ul', '', tips);
      [
        'Click a column header to sort the list.',
        'Use the scrollbar to view more orders.',
        'You can also use the mouse wheel to scroll through the list.',
        'All amounts are in USD.',
      ].forEach((x) => u.el('li', '', ul, x));
      Object.assign(_c, { body: _c.shell, main, aside });
    },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.aside });
      const panel = _c.aside.querySelector('.ref-panel');
      if (panel) panel.classList.add('oak-panelnote');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'ds-stage oak-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) note.classList.add('oak-toast');
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('oak-footer');
      _c.left.appendChild(foot);
      const ready = foot.querySelector('.ref-foot-text');
      ready.classList.add('oak-ready');
      ready.textContent = 'Ready';
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-find-fact-datagrid-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#424832'], LOW_ACCENTS: ['#424832'], parts,
    },
  });
})();
