(function () {
  'use strict';
  const C = { site: 'design-act-in-time-debounce-01' };
  env.site({
    name: C.site, styles: ['site.css', 'admin.css'], scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection(); if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const title = u.el('header', 'oa-titlebar', document.body);
      u.el('span', 'oa-cube', title, '◆');
      u.el('strong', 'oa-appname', title, 'Orders');
      if ((ctx.display || 'header') === 'header') u.el('div', 'oa-tasknote', title, ctx.instruction);
      const menu = u.el('nav', 'oa-menubar', document.body);
      ['File', 'Edit', 'View', 'Orders', 'Customers', 'Tools', 'Help'].forEach(x => u.el('span', '', menu, x));
      const toolbar = u.el('div', 'oa-toolbar', document.body);
      const tool = (icon, label, color) => { const b = u.el('button', 'oa-tool', toolbar); b.type = 'button';
        u.el('span', 'oa-icon ' + (color || ''), b, icon); u.el('span', '', b, label); b.addEventListener('click', () => env.log('decoy', { label })); return b; };
      tool('▧', 'New Order', 'blue'); tool('▰', 'Open', 'amber'); tool('✖', 'Delete', 'red');
      tool('▤', 'Print', 'gray'); tool('⟳', 'Refresh', 'green');
      const search = u.el('div', 'oa-search', toolbar); search.textContent = '⌕   Search orders...';
      let submit = null; let label = 'Apply';
      const fallback = ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labels = ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length ? ctx.content.END_LABELS : fallback;
      const labelOf = x => typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x);
      const er = ctx.rng.fork('chrome/end');
      const original = er.bool(.5); label = original ? 'Apply' : labelOf(er.pick(labels));
      let placement = original ? 'toolbar' : er.pick(['toolbar', 'footer', 'link', 'icon']);
      const cr = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && cr.bool(.3)) {
        const pool = labels.map(labelOf).filter(x => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) { const b = u.el('button', 'oa-xtra', toolbar, cr.pick(pool)); b.type = 'button'; b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', { label: b.textContent, collide: true })); }
      }
      const main = u.el('main', 'oa-workspace', document.body);
      const mode = ctx.display || 'header';
      const orders = u.el('section', 'oa-pane oa-orders', main);
      u.el('h2', 'oa-panehead', orders, 'Orders');
      const list = u.el('div', 'oa-orderlist', orders);
      const cols = u.el('div', 'oa-ordercols', list); ['Order #', 'Customer', 'Date'].forEach(x => u.el('span', '', cols, x));
      const rows = [
        ['10048', 'Acme Ltd', 'Apr 12, 2013'], ['10047', 'Global Mart', 'Apr 11, 2013'], ['10046', 'Ridgeway Co', 'Apr 10, 2013'],
        ['10045', 'Evergreen Inc', 'Apr 09, 2013'], ['10044', 'Northwind Traders', 'Apr 08, 2013'], ['10043', 'Sunrise Supply', 'Apr 06, 2013'],
        ['10042', 'Maple Leaf', 'Apr 05, 2013'], ['10041', 'Oceanic Corp', 'Apr 04, 2013'], ['10040', 'Beacon Industrial', 'Apr 03, 2013'],
        ['10039', 'Summit Goods', 'Apr 02, 2013'], ['10038', 'Horizon Stores', 'Apr 01, 2013'], ['10037', 'Pinecrest Ltd', 'Mar 30, 2013'],
        ['10036', 'Westbrook Co', 'Mar 29, 2013'], ['10035', 'Cedar Holdings', 'Mar 28, 2013'], ['10034', 'Valley Supply', 'Mar 27, 2013']
      ];
      rows.forEach((row, i) => { const r = u.el('div', 'oa-orderrow' + (i === 0 ? ' selected' : ''), list); row.forEach(x => u.el('span', '', r, x)); });
      if (mode === 'panel') { const p = u.el('aside', 'oa-panelnote', orders); u.el('b', '', p, 'Your task'); u.el('div', '', p, ctx.instruction); }
      const editor = u.el('section', 'oa-editor', main);
      const editorHead = u.el('div', 'oa-editorhead', editor);
      u.el('h1', '', editorHead, 'Order #10048');
      const tabs = u.el('div', 'oa-tabs', editor); ['General', 'Items', 'Shipping', 'Billing', 'Notes'].forEach((x, i) => u.el('span', i ? 'oa-tab' : 'oa-tab active', tabs, x));
      const section = u.el('div', 'oa-formarea', editor);
      const left = u.el('div', 'oa-formcol', section);
      const row = (name, value, cls) => { const r = u.el('div', 'oa-formrow' + (cls ? ' ' + cls : ''), left); u.el('label', '', r, name); const v = u.el('span', 'oa-fakefield', r, value || ''); return v; };
      u.el('h3', '', left, 'Customer');
      row('Name', 'Acme Ltd'); row('Contact', 'Sarah Mitchell'); row('Phone', '+44 20 7946 0958'); row('Email', 'sarah.mitchell@acme.co.uk');
      u.el('h3', '', left, 'Shipping Address');
      row('Address line 1', '221B Baker Street'); row('Address line 2', '');
      if (mode === 'toast') { const n = u.el('div', 'oa-toastnote', editor); u.el('span', '', n, ctx.instruction); const x = u.el('button', '', n, '×'); x.type = 'button'; x.setAttribute('aria-label', 'Close'); x.addEventListener('click', () => { n.hidden = true; env.log('note-close'); }); }
      const stage = u.el('main', 'oa-stage', section);
      const sideform = u.el('aside', 'oa-sideform', section);
      u.el('h3', '', sideform, 'Order Details');
      [['Order date', 'Apr 12, 2013'], ['Requested ship date', 'Apr 15, 2013'], ['Ship method', 'Standard'], ['Payment method', 'Purchase Order'], ['Status', 'Processing']].forEach(([k, v]) => {
        const r = u.el('div', 'oa-sideitem', sideform); u.el('span', '', r, k); u.el('b', '', r, v);
      });
      const totals = u.el('section', 'oa-totals', sideform); u.el('h3', '', totals, 'Totals');
      [['Subtotal', '£1,240.00'], ['Shipping', '£25.00'], ['Tax', '£253.00'], ['Total', '£1,518.00']].forEach(([k, v]) => {
        const r = u.el('div', 'oa-sideitem', totals); u.el('span', '', r, k); u.el('b', '', r, v);
      });
      row('State / Province', ''); row('Postal code', 'NW1 6XE'); row('Country', 'United Kingdom');
      const details = u.el('aside', 'oa-inspector', main);
      u.el('h2', 'oa-panehead', details, 'Order Properties');
      const group = (heading, entries) => { const g = u.el('section', 'oa-inspectgroup', details); u.el('h3', '', g, heading);
        entries.forEach(([k, v]) => { const r = u.el('div', 'oa-inspectrow', g); u.el('span', '', r, k); u.el('b', '', r, v); }); };
      group('General', [['Order #', '10048'], ['Customer', 'Acme Ltd'], ['Order date', 'Apr 12, 2013'], ['Status', 'Processing']]);
      group('Shipping', [['Ship method', 'Standard'], ['Requested ship date', 'Apr 15, 2013'], ['Ship to', '221B Baker Street\nLondon\nNW1 6XE\nUnited Kingdom']]);
      group('Billing', [['Payment method', 'Purchase Order'], ['Subtotal', '£1,240.00'], ['Shipping', '£25.00'], ['Tax', '£253.00'], ['Total', '£1,518.00']]);
      const foot = u.el('footer', 'oa-footer', document.body);
      const makeSubmit = (parent, cls, text = label) => { const b = u.el('button', cls, parent, text); b.type = 'button'; b.dataset.role = 'submit';
        b.setAttribute('aria-label', label); b.title = label; b.addEventListener('click', () => ctx.submit()); return b; };
      if (!ctx.finish) {
        if (placement === 'toolbar') submit = makeSubmit(toolbar, 'oa-apply');
        else if (placement === 'footer') submit = makeSubmit(foot, 'oa-apply');
        else if (placement === 'link') { const a = u.el('a', 'oa-endlink', foot, label); a.href = '#'; a.dataset.role = 'submit'; a.setAttribute('aria-label', label); a.title = label; a.addEventListener('click', e => { e.preventDefault(); ctx.submit(); }); submit = a; }
        else submit = makeSubmit(toolbar, 'oa-apply oa-icon-submit', '✓');
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util; const el = u.el('section', 'oa-overlay oa-overlay-' + ctx.kind, document.body); el.dataset.role = 'overlay';
      const texts = { cookie: 'We use cookies to remember your preferences.', toast: 'Changes synced.', chat: 'Hello. How can we help?', promo: 'Try our new workspace.', banner: 'Scheduled maintenance tonight.' };
      u.el('div', '', el, texts[ctx.kind]); const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close')); return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    }
  });
})();
