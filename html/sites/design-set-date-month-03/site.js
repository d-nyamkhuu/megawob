(function () {
  'use strict';
  const C = {
    'site': 'design-set-date-month-03',
    'brand': 'Business Reports',
    'title': 'Generate Report',
  };
  env.site({
    name: C.site,
    template: 'site/base',
    design: { parts: {
    frame: () => function frame(ctx) {
      const u = ctx.util;
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const top = u.el('header', 'ds-top', content);
      const brandIcon = u.el('span', 'ds-brand-icon ds-bars', top);
      brandIcon.innerHTML = '<i></i><i></i><i></i>';
      u.el('span', 'ds-brand', top, 'Business Reports');
      u.el('span', 'ds-company', top, 'Acme Corporation  ▾');
      const menu = u.el('nav', 'ds-menu', content);
      ['File', 'Edit', 'View', 'Reports', 'Tools', 'Help'].forEach((name) => {
        const item = u.el('button', 'ds-menu-item', menu, name);
        item.type = 'button';
        item.addEventListener('click', () => env.log('decoy', {label: name}));
      });
      const toolbar = u.el('div', 'ds-toolbar', content);
      function tool(cls, icon, label) {
        const b = u.el('button', 'ds-tool ' + cls, toolbar);
        b.type = 'button';
        u.el('span', 'ds-tool-icon', b).innerHTML = icon;
        u.el('span', '', b, label);
        b.addEventListener('click', () => env.log('decoy', {label}));
        return b;
      }
      tool('', '<svg viewBox="0 0 28 28"><path d="M5 2h12l6 6v18H5z" fill="#fff" stroke="#2871bb" stroke-width="1.6"/><path d="M17 2v7h6" fill="none" stroke="#2871bb" stroke-width="1.3"/></svg>', 'New Report');
      tool('', '<svg viewBox="0 0 28 28"><path d="M2 7h10l3 3h11l-3 15H2z" fill="#f6b641" stroke="#a77520"/><path d="M2 7V4h9l3 3" fill="#ffe39b" stroke="#a77520"/><path d="M3 24l4-12h19l-4 12z" fill="#ffdc82" stroke="#a77520"/></svg>', 'Open');
      tool('ds-tool-printer', '<svg viewBox="0 0 28 28"><path d="M7 2h14v8H7z" fill="#e9f0f9" stroke="#496582"/><path d="M4 10h20v12H4z" fill="#6f8aa8" stroke="#39536d"/><path d="M7 18h14v8H7z" fill="#fff" stroke="#496582"/><path d="M10 21h8" stroke="#9eb1c5"/></svg>', 'Print');
      tool('ds-tool-divider', '<svg viewBox="0 0 28 28"><rect x="2" y="2" width="24" height="24" fill="#fff" stroke="#2675be" stroke-width="1.5"/><path d="M2 9h24M2 16h24M9 2v24M17 2v24" stroke="#2675be" stroke-width="1.4"/><path d="M3 3h22v5H3z" fill="#6ab4eb"/></svg>', 'Export  ▾');
      const usePanel = ctx.display === 'panel' && document.documentElement.clientWidth >= 1180;
      const useToast = ctx.display === 'toast' && document.documentElement.clientHeight >= 700;
      if (ctx.display === 'header' || (ctx.display === 'panel' && !usePanel) || (ctx.display === 'toast' && !useToast)) {
        const note = u.el('div', 'ds-header-note', content);
        u.el('span', 'ds-info-icon', note, 'i');
        u.el('span', '', note, ctx.instruction);
      }
      const main = u.el('div', 'ds-main' + (usePanel ? ' ds-panel-mode' : ''), content);
      const report = u.el('section', 'ds-report ds-box', main);
      u.el('h2', 'ds-box-head', report, 'Generate Report');
      function section(title) { const s = u.el('section', 'ds-section', report); u.el('h3', 'ds-section-head', s, title); return s; }
      function row(parent, name, value, opts) {
        const r = u.el('div', 'ds-row', parent);
        u.el('label', 'ds-row-label', r, name);
        const field = u.el('button', 'ds-field', r, value);
        field.type = 'button';
        if (opts !== false) u.el('span', 'ds-arrow', field);
        field.addEventListener('click', () => env.log('decoy', {label: name}));
        return r;
      }
      const details = section('Report Details');
      row(details, 'Report Type', 'Sales Summary');
      const monthRow = u.el('div', 'ds-row ds-month-row', details);
      u.el('label', 'ds-row-label', monthRow, ctx.spec.scene.label);
      const live = u.el('div', 'ds-live', monthRow);
      const stage = u.el('main', 'ds-stage', live);
      row(details, 'Region', 'All Regions');
      row(details, 'Product Category', 'All Categories');
      const filters = section('Filters');
      row(filters, 'Sales Channel', 'All Channels');
      row(filters, 'Customer Segment', 'All Segments');
      const checkrow = u.el('label', 'ds-check-row', filters);
      const checkbox = u.el('input', '', checkrow); checkbox.type = 'checkbox';
      u.el('span', '', checkrow, 'Include returns');
      const options = section('Display Options');
      row(options, 'Group By', 'Product Category');
      row(options, 'Show', 'Totals and % of Total');
      const side = u.el('aside', 'ds-side', main);
      const summary = u.el('section', 'ds-summary ds-box', side);
      u.el('h2', 'ds-box-head', summary, 'Report Summary');
      [['Total Sales','1,284,320'],['Total Orders','4,892'],['New Customers','312'],['Returning Customers','1,024']].forEach(([name,value]) => {
        const r = u.el('div', 'ds-summary-row', summary); u.el('span', '', r, name); u.el('strong', '', r, value);
      });
      if (usePanel) {
        const n = u.el('section', 'ds-task ds-box', side);
        u.el('h2', 'ds-box-head', n, 'Task');
        const contentNote = u.el('div', 'ds-task-content', n);
        u.el('span', 'ds-info-icon', contentNote, 'i');
        u.el('span', '', contentNote, ctx.instruction);
      }
      const recent = u.el('section', 'ds-recent ds-box', side);
      u.el('h2', 'ds-box-head', recent, 'Recent Reports');
      const table = u.el('table', 'ds-table', recent);
      const thead = u.el('thead', '', table); const trh = u.el('tr', '', thead);
      ['Report Name','Month','Status'].forEach((x) => u.el('th', '', trh, x));
      const tbody = u.el('tbody', '', table);
      [['Sales Summary','Jul 2027'],['Sales by Region','Jul 2027'],['Product Performance','Jun 2027'],['Customer Growth','Jun 2027'],['Returns Analysis','May 2027']].forEach(([name,month]) => {
        const tr = u.el('tr', '', tbody); const first = u.el('td', '', tr);
        const bars = u.el('span', 'ds-bars ds-row-icon', first); bars.innerHTML = '<i></i><i></i><i></i>';
        u.el('span', '', first, name); u.el('td', '', tr, month); u.el('td', '', tr, 'Completed');
      });
      const foot = u.el('footer', 'ds-footer', report);
      if (useToast) {
        const toast = u.el('div', 'ds-toast', content);
        u.el('span', 'ds-toast-check', toast, '✓');
        u.el('span', '', toast, ctx.instruction);
        const close = u.el('button', '', toast, '×'); close.type='button'; close.addEventListener('click', () => toast.remove());
      }
      const endRng = ctx.rng.fork('chrome/end');
      const endMix = ctx.rng.fork('chrome/report-end');
      const bank =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      let placement = null,
        label = 'Continue';
      if (!ctx.finish) {
        if (endRng.bool(0.55) !== endMix.bool(0.5)) {
          placement = 'toolbar';
        } else {
          const alternatives = bank.map(labelOf).filter((x) => x.trim().toLowerCase() !== 'continue');
          if (alternatives.length) label = endRng.pick(alternatives);
          placement = endRng.pick(['toolbar', 'footer', 'link', 'icon']);
        }
      }
      let submit = null;
      const endButton = (parent, cls, text, asLink) => {
        const b = u.el(asLink ? 'a' : 'button', cls, parent, text);
        if (asLink) {
          b.href = '#';
        } else b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (placement === 'toolbar') submit = endButton(menu, 'ds-end-header', label, false);
      if (placement === 'footer') submit = endButton(foot, 'ds-submit', label, false);
      if (placement === 'link') submit = endButton(foot, 'ds-end-link', label + ' ›', true);
      if (placement === 'icon') submit = endButton(menu, 'ds-end-icon', '✓', false);
      if (!ctx.finish) {
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const words = bank.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (words.length) {
            const text = cr.pick(words);
            const d = u.el('button', 'ds-xtra', placement === 'toolbar' || placement === 'icon' ? menu : foot, text);
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          }
        }
      }
      return { stage, submit };
    },
    overlay: () => function overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      if (ctx.kind === 'banner') {
        const headerNote = document.querySelector('.ds-header-note');
        const toolbar = document.querySelector('.ds-toolbar');
        el.style.top = `${(headerNote || toolbar).getBoundingClientRect().bottom}px`;
        u.el('span', 'ds-info-icon', el, 'i');
        const copy = u.el('div', 'ds-banner-copy', el);
        u.el('strong', '', copy, 'System maintenance this weekend');
        u.el('span', '', copy, 'Reports may be unavailable on Saturday, Aug 2 from 1:00 AM to 5:00 AM (UTC).');
        const dismiss = u.el('button', 'ds-banner-dismiss', el, 'Dismiss');
        dismiss.addEventListener('click', () => ctx.dismiss('close'));
        const x = u.el('button', 'ds-banner-x', el, '×');
        x.setAttribute('aria-label', 'Close');
        x.addEventListener('click', () => ctx.dismiss('close'));
        return { el, dismiss, ttlSteps: 0 };
      }
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
    } },
  });
})();
