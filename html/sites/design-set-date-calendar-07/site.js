(function () {
  'use strict';
  const palette = { bg: '#f5f6f8', panel: '#ffffff', fg: '#000000', muted: '#858994', line: '#000000' };
  const ICON =
    '<svg width="100%" height="100%" viewBox="0 0 38 42"><rect x="2" y="5" width="34" height="35" rx="2" fill="#111"/><path d="M10 2v8M28 2v8" stroke="#111" stroke-width="5" stroke-linecap="round"/><rect x="7" y="15" width="24" height="20" fill="#fff"/><path d="M11 19h3m4 0h3m4 0h3M11 25h3m4 0h3m4 0h3M11 31h3m4 0h3m4 0h3" stroke="#111" stroke-width="2"/></svg>';
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      const logo = u.el('span', 'ds-logo', top);
      logo.innerHTML = ICON;
      u.el('span', 'ds-brand', top, 'PROJECT PLANNER');
      u.el('nav', 'ds-menu', top, 'Plan / Track / Deliver');
      const body = u.el('div', 'ds-body', document.body);
      const left = u.el('div', 'ds-left', body);
      const noteBox = _c.display === 'header' ? u.el('aside', 'ds-note-box', left) : null;
      Object.assign(_c, { header: top, body, left, noteBox });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      if (_c.noteBox) _c.header = _c.noteBox;
      base(_c);
      _c.header = header;
      const note = _c.noteBox && _c.noteBox.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('ds-instruction');
        if (note.textContent.length > 150) note.classList.add('ds-long-note');
      }
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const rail = u.el('aside', 'ds-rail', _c.body);
      const railHead = u.el('div', 'ds-rail-head', rail);
      u.el('h2', 'ds-rail-title', railHead, 'Project Details');
      const det = u.el('div', 'ds-details', rail);
      ['Name', 'Start date', 'End date', 'Owner', 'Priority'].forEach((k) => {
        const r = u.el('div', 'ds-drow', det);
        u.el('b', '', r, k + ':');
        u.el('span', '', r, '—');
      });
      _c.rail = rail;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.rail;
      base(_c);
      _c.body = body;
      const panel = _c.rail.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-rail-note');
        panel.querySelector('.ref-panel-title').textContent = 'Project instruction';
      }
      const u = _c.util;
      u.el('hr', 'ds-hr', _c.rail);
      u.el('h2', 'ds-help-title', _c.rail, 'Calendar Help');
      u.el('hr', 'ds-hr2', _c.rail);
      const ol = u.el('ol', 'ds-help', _c.rail);
      [
        'Click the calendar icon next to the date field.',
        'Select the requested date in the calendar.',
        'The date will appear in MM/DD/YYYY format in the field.',
      ].forEach((t) => u.el('li', '', ol, t));
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.left);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-rail-toast');
        _c.rail.appendChild(note);
        const mark = _c.util.el('span', 'ds-toast-mark', note, 'NOTICE');
        note.insertBefore(mark, note.firstChild);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      foot.querySelector('.ref-foot-text').remove();
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
    name: 'design-set-date-calendar-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-set-date-calendar-07': palette },
      LOW_THEME: palette,
      ACCENTS: ['#000000'],
      LOW_ACCENTS: ['#000000'],
      parts,
    },
  });
})();
