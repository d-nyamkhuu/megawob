(function () {
  'use strict';
  const C = { site: 'design-find-fact-locate-05' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util,
        top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-logo', top, '▲');
      u.el('strong', 'ds-brand', top, 'Riverside Materials');
      u.el('div', 'ds-search', top, '⌕　Search documents...');
      const nav = u.el('nav', 'ds-menu', document.body);
      ['Documents', 'Inventory', 'Orders', 'Customers', 'Reports', 'Administration'].forEach((t, i) =>
        u.el('span', i === 0 ? 'on' : '', nav, t),
      );
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const natural = 'header';
      let mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'panel'
              : natural;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'header') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'panel') briefing(main, 'ds-brief');
      const stage = u.el('main', 'ds-stage', main);
      const inspector = u.el('aside', 'ds-inspector', main);
      u.el('h2', '', inspector, 'Document Details');
      const rows = [
        ['Title', 'Supplier Fee Schedule'],
        ['Document ID', 'SFS-2013'],
        ['Version', '1.0'],
        ['Effective Date', 'January 1, 2013'],
        ['Last Updated', 'December 20, 2012'],
        ['Pages', '7'],
        ['File Type', 'PDF (1.2 MB)'],
      ];
      const table = u.el('div', 'ds-properties', inspector);
      rows.forEach(([k, v]) => {
        const r = u.el('div', '', table);
        u.el('span', '', r, k + ':');
        u.el('span', '', r, v);
      });
      u.el('hr', '', inspector);
      u.el('h3', '', inspector, 'Description:');
      u.el(
        'p',
        'ds-description',
        inspector,
        'Lists the fees paid by Riverside Materials for materials supplied by approved vendors. Fees are per standard unit unless otherwise noted.',
      );
      u.el('hr', '', inspector);
      u.el('h3', '', inspector, 'Related Documents:');
      ['Supplier Agreement (PDF)', 'Material Specifications (PDF)', 'Compliance Guidelines (PDF)'].forEach((t) =>
        u.el('p', 'ds-related', inspector, '▤　' + t),
      );
      if (mode === 'toast') briefing(content, 'ds-toast');
      const foot = u.el('footer', 'ds-footer', content);
      let submit = null;
      const er = ctx.rng.fork('chrome/end'),
        labels = (
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
      const placement = ctx.finish ? null : er.pick(['header', 'footer', 'link']);
      const label = ctx.finish ? '' : er.pick(labels);
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const pool = labels.filter((x) => String(x).toLowerCase() !== String(label).toLowerCase());
        if (pool.length) collide = cr.pick(pool);
      }
      const button = (parent, text, role) => {
        const b = u.el(role === 'link' ? 'a' : 'button', role === 'link' ? 'ds-endlink' : 'ds-submit', parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = role === 'decoy' ? 'decoy' : 'submit';
        b.addEventListener('click', (e) => {
          e.preventDefault();
          if (role === 'decoy') env.log('decoy', { label: text, collide: true });
          else ctx.submit();
        });
        return b;
      };
      const tools = u.el('div', 'ds-tools', top);
      if (placement === 'header') submit = button(tools, label, 'end');
      if (placement === 'footer') submit = button(foot, label, 'end');
      if (placement === 'link') submit = button(foot, label + ' ›', 'link');
      if (collide) button(placement === 'footer' ? foot : tools, collide, 'decoy');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      u.el(
        'div',
        '',
        el,
        {
          cookie: 'We use cookies to remember your preferences.',
          toast: 'Changes synced.',
          chat: 'Hello. How can we help?',
          promo: 'Try our new workspace.',
          banner: 'Scheduled maintenance tonight.',
        }[ctx.kind],
      );
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
