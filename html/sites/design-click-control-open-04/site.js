(function () {
  'use strict';
  const cfg = {
    title: 'Salesforce',
    tools: 'Sales Home Accounts Contacts Opportunities Leads Reports Dashboards',
    rail: ['Account', 'Acme Corporation', 'Account Number', 'A-10023', 'Industry', 'Manufacturing', 'Type', 'Customer', 'Annual Revenue', '$52,400,000', 'Employees', '320'],
    side: ['File Summary', 'Total Files', '12', 'PDF Files', '4', 'Word Documents', '3', 'Excel Spreadsheets', '3', 'CSV Files', '2', 'Text Files', '1'],
  };
  const palette = { bg: '#e4eef6', panel: '#ffffff', fg: '#243b5b', muted: '#536987', line: '#d3e0eb' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // These notes have dedicated places even in the compact workspace.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'lightning');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      u.el('div', 'title', head, cfg.title);
      const search = u.el('div', 'search', head, '⌕　Search Salesforce');
      search.setAttribute('aria-hidden', 'true');
      u.el('span', 'head-help', head, '?');
      u.el('span', 'head-bell', head, '♟');
      u.el('span', 'head-avatar', head, 'JD');
      const tools = u.el('nav', 'tools', shell);
      cfg.tools.split(' ').forEach((label, i) => {
        u.el('span', 'menu-label' + (i === 0 ? ' selected' : ''), tools, label);
      });
      const work = u.el('div', 'work');
      const rail = u.el('aside', 'rail', work);
      cfg.rail.forEach((s, i) => u.el(
        i < 2 ? 'div' : 'span',
        i === 0 ? 'rail-kicker' : i === 1 ? 'rail-title' : i % 2 === 0 ? 'rail-label' : 'rail-value',
        rail, s,
      ));
      const center = u.el('section', 'center', work);
      const tabs = u.el('nav', 'record-tabs', center);
      ['Overview', 'Details', 'Contacts', 'Opportunities', 'Cases', 'Files', 'Related'].forEach((s, i) =>
        u.el('span', i === 5 ? 'active' : '', tabs, s));
      const aside = u.el('aside', 'inspector', work);
      cfg.side.forEach((s, i) => u.el(
        i === 0 ? 'h2' : i % 2 === 1 ? 'span' : 'strong',
        i === 0 ? '' : 'summary-item', aside, s,
      ));
      Object.assign(_c, { shell, head, work, rail, center, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.head;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.shell.appendChild(_c.work);
      _c.body = _c.work;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.rail;
      base(_c);
      _c.body = body;
      const note = _c.rail.querySelector('.ref-panel');
      if (note) note.classList.add('instruction', 'panel-note');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        _c.center.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.classList.add('footer');
        _c.shell.appendChild(foot);
      }
      _c.foot = foot;
      const status = _c.util.el('div', 'bottom-status', _c.shell);
      _c.util.el('span', '', status, 'Salesforce');
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('section', 'perturb ' + ctx.kind, document.body);
      u.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      u.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const b = u.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      b.type = 'button';
      b.addEventListener('click', ctx.dismiss);
      return { el, dismiss: b };
    },
  };
  env.site({
    name: 'design-click-control-open-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-control-open-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0875d1'],
      LOW_ACCENTS: ['#0875d1'],
      parts,
    },
  });
})();
