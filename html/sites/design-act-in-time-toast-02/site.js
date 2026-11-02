(function () {
  'use strict';
  const palette = { bg: '#dde9f1', panel: '#ffffff', fg: '#071d3d', muted: '#607087', line: '#d4dfe8' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const header = u.el('header', 'sf-head', document.body);
      u.el('div', 'sf-cloud', header, '');
      u.el('div', 'sf-search', header, '⌕　 Search Salesforce');
      const tools = u.el('div', 'sf-tools', header);
      ['♟', '?', '⚙', 'JS'].forEach((x, i) => u.el('span', i === 3 ? 'sf-avatar' : '', tools, x));
      const nav = u.el('nav', 'sf-nav', document.body);
      u.el('span', 'sf-launcher', nav, '▦');
      u.el('span', 'sf-app', nav, 'Sales');
      ['Home', 'Accounts', 'Contacts', 'Leads', 'Opportunities', 'Cases', 'Reports', 'Dashboards'].forEach((x, i) =>
        u.el('span', i === 1 ? 'active' : '', nav, x));
      // Prepare the task pane so the template can draw its note before frame.body.
      const detail = u.el('section', 'sf-detail');
      const tabs = u.el('nav', 'sf-tabs', detail);
      ['Details', 'Related', 'Activity', 'Security', 'Chatter'].forEach((x, i) =>
        u.el('span', i === 3 ? 'active' : '', tabs, x));
      Object.assign(_c, { header: detail, detail, toolbar: nav });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const workspace = u.el('div', 'sf-workspace', document.body);
      const left = u.el('section', 'sf-left', workspace);
      const summary = u.el('section', 'sf-summary', left);
      const identity = u.el('div', 'sf-identity', summary);
      u.el('span', 'sf-building', identity, '▦');
      const idtext = u.el('div', '', identity);
      u.el('small', '', idtext, 'Account');
      u.el('strong', '', idtext, 'Global Media Solutions');
      const fields = u.el('div', 'sf-fields', summary);
      [
        ['Account Number', 'A1003287'], ['Type', 'Customer'], ['Industry', 'Media & Entertainment'],
        ['Phone', '(415) 555-0189'], ['Website', 'www.globalmediasolutions.com'], ['Owner', 'Jordan Singh'],
      ].forEach(([k, v]) => {
        const f = u.el('div', '', fields);
        u.el('small', '', f, k);
        u.el('span', k === 'Website' ? 'link' : '', f, v);
      });
      left.appendChild(_c.detail);
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
      Object.assign(_c, { body: workspace, side });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.side;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage sf-stage', _c.detail);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.detail.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.detail.appendChild(dock);
    },
    overlay: () => (ctx) => {
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
  };
  env.site({
    name: 'design-act-in-time-toast-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'lightning.css', 'detail.css'],
    design: { THEMES: { site: palette }, LOW_THEME: palette, ACCENTS: ['#0076de'], LOW_ACCENTS: ['#0076de'], parts },
  });
})();
