(function () {
  'use strict';
  const C = { site: 'design-find-fact-datagrid-02' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
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
      [['New'], ['Open'], ['Edit'], ['Delete'], ['Print'], ['Export']].forEach((x, i) => {
        const b = u.el('div', 'oak-tool', tools);
        const icon = u.el('b', 'oak-icon', b);
        icon.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + icons[i] + '</svg>';
        u.el('span', '', b, x[0]);
      });
      const shell = u.el('div', 'oak-shell', document.body);
      const left = u.el('div', 'oak-left', shell);
      const band = u.el('section', 'oak-summary', left);
      const title = u.el('div', 'oak-heading', band);
      u.el('h1', '', title, 'Orders');
      u.el(
        'p',
        '',
        title,
        'View and manage customer orders, track fulfillment and delivery status, and access order details.',
      );
      const metrics = u.el('div', 'oak-metrics', band);
      [
        ['1,248', 'Total Orders'],
        ['312', 'Pending'],
        ['789', 'Shipped'],
        ['147', 'Delivered'],
      ].forEach((x) => {
        const m = u.el('div', 'oak-metric', metrics);
        u.el('b', '', m, x[0]);
        u.el('span', '', m, x[1]);
      });
      const natural = 'header';
      let mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'panel'
              : natural;
      const note = (cls, parent) => {
        const n = u.el('aside', cls, parent);
        u.el('div', 'oak-note-label', n, 'Task note');
        u.el('div', 'ds-instruction', n, ctx.instruction);
        return n;
      };
      if (mode === 'header') note('oak-tasknote', band);
      const main = u.el('main', 'oak-main', left);
      const stage = u.el('section', 'ds-stage oak-stage', main);
      const aside = u.el('aside', 'oak-aside', shell);
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
      if (mode === 'panel') note('oak-panelnote', aside);
      let toast = null;
      if (mode === 'toast') toast = note('oak-toast', document.body);
      const foot = u.el('footer', 'oak-footer', left);
      u.el('span', 'oak-ready', foot, 'Ready');
      let submit = null;
      const er = ctx.rng.fork('chrome/end');
      const labels = (
        (ctx.content && ctx.content.END_LABELS) || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
          'Complete',
        ]
      ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
      const baseline = !ctx.finish && er.bool(0.5);
      const placement = ctx.finish ? null : baseline ? 'footer' : er.pick(['header', 'link']);
      const label = ctx.finish
        ? ''
        : baseline
          ? 'Submit'
          : er.pick(labels.filter((x) => String(x).toLowerCase() !== 'submit'));
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const pool = labels.filter((x) => String(x).toLowerCase() !== String(label).toLowerCase());
        if (pool.length) collide = cr.pick(pool);
      }
      const decoy = (parent, text, isCollide) => {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () =>
          env.log('decoy', isCollide ? { label: text, collide: true } : { label: text }),
        );
      };
      const end = (parent, cls, text) => {
        const b = u.el(cls === 'ds-endlink' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (collide) decoy(placement === 'footer' ? foot : tools, collide, true);
      if (placement === 'header') submit = end(tools, 'ds-submit ds-header-submit', label);
      if (placement === 'footer') submit = end(foot, 'ds-submit', label);
      if (placement === 'link') submit = end(foot, 'ds-endlink', label + ' ›');
      return { stage, submit };
    },
    overlay(ctx) {
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
  });
})();
