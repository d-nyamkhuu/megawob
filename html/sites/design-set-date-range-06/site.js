(function () {
  'use strict';
  const C = {
    brand: 'Event Planner',
    menu: 'Plan|Organize|Coordinate',
    tabs: 'Overview|Events|Contacts|Reports',
    events: [
      ['Aug 10, 2023', 'Team Meeting', 'Conference Room', 'Confirmed'],
      ['Aug 18, 2023', 'Project Review', 'Main Office', 'Tentative'],
      ['Aug 25, 2023', 'Client Workshop', 'East Hall', 'Confirmed'],
      ['Sep 12, 2023', 'Strategy Session', 'Conference Room', 'Planned'],
    ],
    details: [
      ['Event:', 'Project Review'],
      ['Date:', 'Aug 18, 2023'],
      ['Location:', 'Main Office'],
      ['Attendees:', '8'],
      ['Notes:', 'Discuss project milestones and next steps.'],
    ],
  };
  const palette = { bg: '#fffcef', panel: '#f7fbff', fg: '#0e2a6e', muted: '#5f7396', line: '#9db2d3' };
  function styleControls(parent) {
    parent.querySelectorAll('.ref-submit').forEach((el) => el.classList.add('ds-submit'));
    parent.querySelectorAll('.ref-endlink').forEach((el) => el.classList.add('ds-endlink'));
    parent.querySelectorAll('.ref-xtra').forEach((el) => el.classList.add('ds-clear'));
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
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
      const top = u.el('header', 'ds-top', document.body);
      const logo = u.el('span', 'ds-logo', top);
      for (let i = 0; i < 9; i++) u.el('i', i % 4 === 0 ? 'd' : '', logo);
      u.el('span', 'ds-brand', top, C.brand);
      const nav = u.el('nav', 'ds-menu', top);
      C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      const tabs = u.el('div', 'ds-tabs', top);
      C.tabs.split('|').forEach((t, i) => u.el('span', i === 0 ? 'on' : '', tabs, t));
      const over = u.el('section', 'ds-over', document.body);
      const up = u.el('div', 'ds-up', over);
      u.el('h3', '', up, 'Upcoming Events');
      const tb = u.el('table', '', up);
      const hr = u.el('tr', '', tb);
      ['Date', 'Event', 'Location', 'Status'].forEach((t) => u.el('th', '', hr, t));
      C.events.forEach((r) => {
        const tr = u.el('tr', '', tb);
        r.forEach((t, i) => u.el('td', i === 3 ? 'st-' + t.toLowerCase() : '', tr, t));
      });
      const qd = u.el('div', 'ds-qd', over);
      u.el('h3', '', qd, 'Quick Details');
      const qb = u.el('dl', '', qd);
      C.details.forEach((r) => {
        u.el('dt', '', qb, r[0]);
        u.el('dd', '', qb, r[1]);
      });
      const body = u.el('div', 'ds-body');
      const content = u.el('div', 'ds-content', body);
      const sched = u.el('div', 'ds-sched', content);
      u.el('h2', '', sched, 'Schedule a New Event');
      const steps = u.el('div', 'ds-steps', sched);
      ['Date & Time', 'Event Details', 'Confirmation'].forEach((t, i) => u.el('span', i === 0 ? 'on' : '', steps, t));
      Object.assign(_c, { body, content, sched, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note', 'ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.sched;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('ds-end-tools');
      styleControls(_c.headerTools);
    },
    'frame.body': () => (_c) => {
      document.body.appendChild(_c.body);
      _c.main = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.main;
      base(_c);
      _c.body = body;
      const panel = _c.main.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note, _c.main);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.content.appendChild(foot);
      styleControls(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.foot.appendChild(dock);
        styleControls(dock);
      }
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
    name: 'design-set-date-range-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-set-date-range-06': palette },
      LOW_THEME: palette,
      ACCENTS: ['#4f78b5'],
      LOW_ACCENTS: ['#4f78b5'],
      parts,
    },
  });
})();
