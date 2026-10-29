(function () {
  'use strict';
  env.site({
    name: 'design-act-in-time-toast-02',
    styles: ['site.css', 'lightning.css', 'detail.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        root = document.body;
      let display = ctx.display || 'header';
      const header = u.el('header', 'sf-head', root);
      const logo = u.el('div', 'sf-cloud', header, '');
      const search = u.el('div', 'sf-search', header, '⌕　 Search Salesforce');
      const tools = u.el('div', 'sf-tools', header);
      ['♟', '?', '⚙', 'JS'].forEach((x, i) => u.el('span', i === 3 ? 'sf-avatar' : '', tools, x));
      const nav = u.el('nav', 'sf-nav', root);
      u.el('span', 'sf-launcher', nav, '▦');
      u.el('span', 'sf-app', nav, 'Sales');
      ['Home', 'Accounts', 'Contacts', 'Leads', 'Opportunities', 'Cases', 'Reports', 'Dashboards'].forEach((x, i) => {
        const a = u.el('span', i === 1 ? 'active' : '', nav, x);
      });
      let label = 'Finish',
        submit = null;
      const end = ctx.rng.fork('chrome/end'),
        collision = ctx.rng.fork('chrome/collide');
      let placement = 'header';
      if (!ctx.finish) {
        placement = end.bool(0.5) ? 'header' : end.pick(['header', 'footer', 'link', 'icon']);
        const labels = (ctx.content && ctx.content.END_LABELS) || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
        ];
        label = placement === 'header' && end.bool(0.5) ? 'Finish' : end.pick(labels);
      }
      const workspace = u.el('div', 'sf-workspace', root);
      const left = u.el('section', 'sf-left', workspace);
      const summary = u.el('section', 'sf-summary', left);
      const identity = u.el('div', 'sf-identity', summary);
      u.el('span', 'sf-building', identity, '▦');
      const idtext = u.el('div', '', identity);
      u.el('small', '', idtext, 'Account');
      u.el('strong', '', idtext, 'Global Media Solutions');
      const fields = u.el('div', 'sf-fields', summary);
      [
        ['Account Number', 'A1003287'],
        ['Type', 'Customer'],
        ['Industry', 'Media & Entertainment'],
        ['Phone', '(415) 555-0189'],
        ['Website', 'www.globalmediasolutions.com'],
        ['Owner', 'Jordan Singh'],
      ].forEach(([k, v]) => {
        const f = u.el('div', '', fields);
        u.el('small', '', f, k);
        u.el('span', k === 'Website' ? 'link' : '', f, v);
      });
      const detail = u.el('section', 'sf-detail', left);
      const tabs = u.el('nav', 'sf-tabs', detail);
      ['Details', 'Related', 'Activity', 'Security', 'Chatter'].forEach((x, i) =>
        u.el('span', i === 3 ? 'active' : '', tabs, x),
      );
      if (display === 'header') {
        const note = u.el('div', 'sf-note-head', detail, ctx.instruction);
      }
      const stage = u.el('main', 'ds-stage sf-stage', detail);
      const side = u.el('aside', 'sf-recent', workspace);
      const sidehead = u.el('div', 'sf-recent-head', side);
      u.el('span', 'sf-building', sidehead, '▦');
      u.el('strong', '', sidehead, 'Recent Accounts');
      u.el('a', 'sf-view', sidehead, 'View All');
      u.el('div', 'sf-side-search', side, '⌕　 Search accounts...');
      const records = [
        ['Global Media Solutions', 'Media & Entertainment', 'A1003287'],
        ['Skyline Retail Group', 'Retail', 'A1003288'],
        ['Pacific Health Partners', 'Healthcare', 'A1003289'],
        ['Riverside Manufacturing', 'Manufacturing', 'A1003290'],
        ['Vertex Technology', 'Technology', 'A1003291'],
        ['Summit Financial', 'Financial Services', 'A1003292'],
        ['Clearview Logistics', 'Transportation & Logistics', 'A1003293'],
        ['Maple Education Group', 'Education', 'A1003294'],
        ['BrightWay Energy', 'Energy', 'A1003295'],
        ['Crestline Real Estate', 'Real Estate', 'A1003296'],
      ];
      const list = u.el('div', 'sf-records', side);
      records.forEach((r, i) => {
        const row = u.el('div', i === 0 ? 'sf-record selected' : 'sf-record', list);
        u.el('span', 'sf-building', row, '▦');
        const txt = u.el('div', 'sf-record-text', row);
        u.el('a', '', txt, r[0]);
        u.el('small', '', txt, r[1]);
        u.el('small', 'sf-number', row, r[2]);
      });
      if (display === 'panel') {
        const panel = u.el('div', 'sf-panel-note', side);
        u.el('b', '', panel, 'Your task');
        u.el('p', '', panel, ctx.instruction);
      }
      if (!ctx.finish) {
        const mk = (p, cls, text) => {
          const b = u.el('button', cls, p, text);
          b.type = 'button';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.addEventListener('click', () => ctx.submit());
          return b;
        };
        if (placement === 'header') submit = mk(nav, 'sf-end', label);
        if (placement === 'footer' || placement === 'link') {
          const ft = u.el('footer', 'sf-footer', detail);
          submit = mk(ft, placement === 'link' ? 'sf-endlink' : 'sf-end', placement === 'link' ? label + ' ›' : label);
        }
        if (placement === 'icon') submit = mk(nav, 'sf-end sf-icon', '✓');
        if (collision.bool(0.3)) {
          const d = u.el('button', 'sf-xtra', nav, 'Let’s go');
          d.type = 'button';
          d.dataset.role = 'xtra';
          d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
        }
      }
      if (display === 'toast') {
        const note = u.el('div', 'sf-toast-note', root, ctx.instruction);
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to improve your experience.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Explore more Salesforce features.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const b = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      b.type = 'button';
      b.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss: b, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
