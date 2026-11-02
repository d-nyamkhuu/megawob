(function () {
  'use strict';
  const palette = { bg: '#fff', panel: '#fff', fg: '#111', muted: '#444', line: '#999' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const head = u.el('header', 'ds-top', document.body);
      const id = u.el('div', 'ds-identity', head);
      u.el('strong', 'ds-brand', id, 'Riverton University');
      u.el('span', 'ds-subbrand', id, 'Computing Services');
      const links = u.el('nav', 'ds-links', head);
      ['Home', 'Help', 'Site Map', 'Contact'].forEach((x, i) => {
        if (i) u.el('i', '', links, '|');
        u.el('a', '', links, x);
      });
      Object.assign(_c, { header: links });
    },
    'frame.nav': () => (_c) => {
      const tabs = _c.util.el('nav', 'ds-tabs', document.body);
      ['Guides', 'Software', 'Hardware', 'Network', 'Accounts', 'Facilities', 'Policies'].forEach((x, i) =>
        _c.util.el('span', i ? '' : 'on', tabs, x),
      );
      _c.contentPane = _c.util.el('div', 'ds-content', document.body);
    },
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.contentPane;
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
    },
    'frame.body': () => (_c) => {
      _c.body = _c.contentPane;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('main', 'ds-stage', _c.body);
      const related = u.el('aside', 'ds-related', _c.body);
      u.el('h2', '', related, 'Related Documents');
      const list = u.el('div', 'ds-list', related);
      [
        ['Title', 'Date'],
        ['Lab Equipment Guide', 'Mar 12, 1995'],
        ['Software Installation', 'Feb 28, 1995'],
        ['Printing in the Labs', 'Feb 20, 1995'],
        ['Network Access for Students', 'Jan 15, 1995'],
        ['Accounts and Passwords', 'Jan 10, 1995'],
        ['Using E-mail', 'Dec 1, 1994'],
        ['File Storage Areas', 'Nov 18, 1994'],
        ['Computer Lab Locations', 'Nov 2, 1994'],
        ['Unix User Guide', 'Oct 14, 1994'],
        ['Windows for Workgroups', 'Sep 30, 1994'],
        ['Backup and Recovery', 'Sep 12, 1994'],
        ['Safety in the Labs', 'Aug 25, 1994'],
        ['Hardware Purchase Policy', 'Aug 10, 1994'],
        ['Frequently Asked Questions', 'Jul 28, 1994'],
        ['Glossary of Terms', 'Jul 10, 1994'],
      ].forEach((row, i) => {
        const r = u.el('div', i ? 'ds-row' : 'ds-row ds-row-head', list);
        row.forEach((v, j) => u.el(j ? 'span' : 'a', '', r, v));
      });
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.body.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.body.appendChild(foot);
      const status = foot.querySelector('.ref-foot-text');
      status.classList.add('ds-status');
      status.textContent = 'Riverton University Computing Services';
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        e = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      e.dataset.role = 'overlay';
      u.el(
        'div',
        '',
        e,
        {
          cookie: 'We use cookies to remember your preferences.',
          toast: 'Changes synced.',
          chat: 'Hello. How can we help?',
          promo: 'Try our new services.',
          banner: 'Scheduled maintenance tonight.',
        }[ctx.kind],
      );
      const d = u.el('button', '', e, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      d.onclick = () => ctx.dismiss('close');
      return { el: e, dismiss: d, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-find-fact-count-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-find-fact-count-12': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0000a8'],
      LOW_ACCENTS: ['#0000a8'],
      parts,
    },
  });
})();
