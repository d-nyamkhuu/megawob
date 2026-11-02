(function () {
  'use strict';
  const palette = { bg: '#f1f7f5', panel: '#ffffff', fg: '#263340', muted: '#7c8992', line: '#c9dfd7' };
  const tabs = ['Personal', 'Employment', 'Compensation', 'Benefits', 'Review'];
  const details = [['Record Type', 'Employee'], ['Record ID', 'E10427'], ['Last Updated', 'Apr 28, 2025 10:14 AM'], ['Updated By', 'A. Chen']];
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Preserve the original inspector breakpoint and inline toast at every height.
      _c.display = _c.ctx.display || 'header';
      if (_c.display === 'panel' && document.body.clientWidth <= 1300) _c.display = 'header';
    },
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
      u.el('span', 'ds-brand', top, 'Employee Record');
      u.el('span', 'ds-meta', top, 'HR Portal  |  v2.4.1  |  Mon, Apr 28, 2025');
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const nav = u.el('nav', 'ds-tabs', content);
      tabs.forEach((t, i) => {
        const tb = u.el('div', 'ds-tab' + (i === 0 ? ' on' : ''), nav);
        u.el('b', '', tb, String(i + 1));
        u.el('span', '', tb, t);
      });
      const header = u.el('aside', _c.display === 'header' ? 'ds-header-note' : 'ds-note-host', content);
      Object.assign(_c, { top, body, content, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const main = u.el('div', 'ds-main', _c.content);
      const col = u.el('div', 'ds-col', main);
      const sec = u.el('section', 'ds-sec', col);
      u.el('div', 'ds-bar', sec, 'Employee Information');
      const stage = u.el('main', 'ds-stage', sec);
      const fake = u.el('div', 'ds-fake', sec);
      ['Employee ID|E10427|ro', 'First Name|Jordan', 'Last Name|Miller', 'Email|jordan.miller@company.com'].forEach((s) => {
        const p = s.split('|');
        const r = u.el('div', 'ds-frow', fake);
        u.el('label', '', r, p[0]);
        u.el('div', 'ds-fin' + (p[2] ? ' ro' : ''), r, p[1]);
      });
      const fake2 = u.el('div', 'ds-fake ds-fake2', sec);
      [['Department', 'Product', 'sel'], ['Job Title', 'Product Manager']].forEach((p) => {
        const r = u.el('div', 'ds-frow', fake2);
        u.el('label', '', r, p[0]);
        u.el('div', 'ds-fin' + (p[2] ? ' sel' : ''), r, p[1]);
      });
      const sec2 = u.el('section', 'ds-sec ds-sec2', col);
      u.el('div', 'ds-bar', sec2, 'Additional Details');
      const g = u.el('div', 'ds-grid2', sec2);
      [['Employment Type', 'Full Time'], ['Work Arrangement', 'Hybrid'], ['Start Date', '2023-06-12'], ['Time Zone', 'Pacific (PT)'], ['Manager', 'Taylor Kim'], ['Employee Status', 'Active']].forEach((p) => {
        const r = u.el('div', 'ds-frow' + (p[0] === 'Start Date' ? ' ds-date' : ''), g);
        u.el('label', '', r, p[0]);
        u.el('div', 'ds-fin' + (p[0] === 'Start Date' ? '' : ' sel'), r, p[1]);
        if (p[0] === 'Start Date') {
          const icon = u.el('span', 'ds-calendar', r);
          icon.innerHTML = '<svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="17" rx="1"/><path d="M3 9h18M8 2v5M16 2v5M7 12h2m3 0h2m3 0h1M7 16h2m3 0h2m3 0h1"/></svg>';
        }
      });
      const sec3 = u.el('section', 'ds-sec ds-sec3', col);
      u.el('div', 'ds-bar', sec3, 'Notes');
      u.el('div', 'ds-notes', sec3, 'Add any relevant notes here...');
      u.el('div', 'ds-count', sec3, '0 / 500');
      const footHost = u.el('div', 'ds-footer-host', _c.content);
      const insp = u.el('aside', 'ds-insp', _c.body);
      Object.assign(_c, { main, stage, footHost, insp });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.insp;
      base(_c);
      _c.body = body;
      const u = _c.util;
      const p1 = u.el('div', 'ds-panel', _c.insp);
      u.el('div', 'ds-bar', p1, 'Record Details');
      const pb = u.el('div', 'ds-pbody', p1);
      details.forEach((d) => {
        const r = u.el('div', 'ds-drow', pb);
        u.el('span', '', r, d[0]);
        u.el('span', '', r, d[1]);
      });
      const p2 = u.el('div', 'ds-panel', _c.insp);
      u.el('div', 'ds-bar', p2, 'Field Help');
      const hb = u.el('div', 'ds-help', p2);
      u.el('h4', '', hb, 'Office Location');
      u.el('p', '', hb, "Select the employee's primary office location from the list. Choose the location that best represents where they work most often.");
    },
    'frame.stage': () => () => {},
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.content.insertBefore(note, _c.main);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.classList.add('ds-footer');
        _c.footHost.appendChild(foot);
      }
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
    name: 'design-choose-option-listbox-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#306451'], LOW_ACCENTS: ['#306451'], parts,
    },
  });
})();
