(function () {
  'use strict';
  const C = {
    site: 'design-find-fact-chart-02',
    brand: 'Sales Reports',
    instruction: 'top',
    rail: 'Dashboard|Reports|Orders|Customers|Products',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      const dots = u.el('div', 'ds-dots', top);
      ['red', 'yellow', 'green'].forEach((c) => u.el('i', 'dot ' + c, dots));
      u.el('span', 'ds-brand', top, '⌕');
      const search = u.el('div', 'ds-search', top);
      u.el('span', '', search, '⌕');
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      C.rail.split('|').forEach((t, i) => {
        const item = u.el('div', 'ds-navitem' + (i === 1 ? ' active' : ''), rail);
        u.el('span', 'ds-navicon', item, ['▥', '▮', '▤', '♟', '◆'][i]);
        u.el('span', '', item, t);
      });
      const content = u.el('div', 'ds-content', body);
      const main = u.el('div', 'ds-main', content);
      const list = u.el('aside', 'ds-list', main);
      u.el('div', 'ds-list-title', list, 'Sales Reports');
      const rows = [
        'Orders by Category',
        'Orders by Region',
        'Monthly Orders',
        'Top Customers',
        'Product Sales',
        'Orders by Segment',
        'Returns',
      ];
      rows.forEach((t, i) => {
        const row = u.el('div', 'ds-report' + (i === 0 ? ' selected' : ''), list);
        u.el('div', 'ds-report-name', row, t);
        u.el('div', 'ds-report-date', row, 'Jan 1, 2015 – Dec 31, 2015');
      });
      const mode = ctx.display || 'header';
      function note(parent, cls) {
        const b = u.el('aside', cls, parent);
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'header') note(content, 'ds-header-note');
      if (mode === 'panel') note(list, 'ds-panel-note');
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') note(content, 'ds-toast');
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
      const placement = ctx.finish ? null : er.pick(['header', 'header', 'footer', 'link', 'icon']);
      const label = ctx.finish ? '' : placement === 'header' || placement === 'icon' ? 'Confirm' : er.pick(labels);
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const p = labels.filter((x) => String(x).toLowerCase() !== String(label).toLowerCase());
        if (p.length) collide = cr.pick(p);
      }
      const decoy = (parent, text) => {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      const tools = u.el('div', 'ds-tools', top);
      if (collide) decoy(tools, collide);
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
      if (placement === 'header') submit = end(tools, 'ds-submit ds-header-submit', label);
      if (placement === 'icon') submit = end(tools, 'ds-submit ds-header-submit ds-icon-submit', '✓');
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, 'Category name:');
      if (placement === 'footer') submit = end(foot, 'ds-submit', 'Finish');
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
