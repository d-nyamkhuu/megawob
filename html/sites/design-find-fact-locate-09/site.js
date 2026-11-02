(function () {
  'use strict';
  const C = {
    site: 'design-find-fact-locate-09',
    brand: 'Ridgewell & Co.',
    rail: 'Vehicle Registration Fees|License Renewal Fees|Inspection Service Fees|Duplicate Document Fees|Special Permit Fees|Title Transfer Fees|Administrative Fees|Equipment Registration Fees|Emission Testing Fees|Commercial Vehicle Fees|Non-Resident Fees|Fee Schedule (Archive)',
    menu: 'Home|Documents|Policies|Departments|Resources|Help',
  };
  const palette = { bg: '#e8e6e3', panel: '#f8f7f4', fg: '#171717', muted: '#61666a', line: '#aeb3b6' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, C.brand);
      u.el('span', 'ds-window', top, '−    □    ×');
      const nav = u.el('nav', 'ds-menu', document.body);
      C.menu.split('|').forEach((t, i) => u.el('span', i === 1 ? 'selected' : '', nav, t));
      u.el('div', 'ds-global-search', nav, 'Search documents…　⌕');
      const shell = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', shell);
      u.el('h2', '', rail, 'Fee Schedules');
      C.rail.split('|').forEach((t, i) => {
        const row = u.el('div', i === 0 ? 'active' : '', rail);
        u.el('b', '', row, '▤');
        const copy = u.el('span', '', row);
        u.el('strong', '', copy, t);
        u.el('small', '', copy, [
          'Mar 12, 2008', 'Feb 28, 2008', 'Jan 15, 2008', 'Jan 10, 2008',
          'Dec 3, 2007', 'Nov 21, 2007', 'Oct 30, 2007', 'Oct 18, 2007',
          'Sep 26, 2007', 'Sep 12, 2007', 'Aug 29, 2007', 'Jul 11, 2007',
        ][i]);
      });
      const content = u.el('div', 'ds-content', shell);
      Object.assign(_c, { header: content, toolbar: top, contentPane: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note', 'ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('ds-tools');
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.contentPane);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.contentPane.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      foot.insertBefore(_c.headerTools, foot.querySelector('.ref-tools'));
      _c.contentPane.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
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
    name: C.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#7f101b'],
      LOW_ACCENTS: ['#7f101b'],
      parts,
    },
  });
})();
