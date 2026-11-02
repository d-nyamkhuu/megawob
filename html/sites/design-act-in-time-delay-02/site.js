(function () {
  'use strict';
  const C = { site: 'design-act-in-time-delay-02', brand: 'Willow Creek Organizer' };
  const palette = { bg: '#38251c', panel: '#f2e8d4', fg: '#2b1713', muted: '#6d6256', line: '#c9b99c' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The organizer has a dedicated note area at every supported size.
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
      document.body.classList.add('wc-organizer');
      const pageSize = document.body.getBoundingClientRect();
      document.body.style.setProperty('--wc-u', Math.min(pageSize.width / 1672, pageSize.height / 941) + 'px');
      document.body.dataset.instruction = _c.display;
      const top = u.el('header', 'ds-top', document.body);
      const leaf = u.el('span', 'ds-leaf', top);
      leaf.innerHTML = '<svg viewBox="0 0 52 40" aria-hidden="true"><path d="M4 32C10 14 17 10 26 10S43 9 49 3C46 22 35 36 21 33C14 39 8 35 4 32Z" fill="#bda17a"/><path d="M3 38L41 11M13 28L12 17M21 22L22 12M28 18L35 19M20 25L31 28" fill="none" stroke="#64482e" stroke-width="1.4"/></svg>';
      u.el('span', 'ds-brand', top, C.brand);
      u.el('span', 'ds-date', top, 'Tue, Apr 20, 2010　 10:14 AM');
      const panel = u.el('aside', 'ds-panel');
      let noteBox = null;
      if (_c.display !== 'hidden') {
        const cls = _c.display === 'panel' ? 'wc-panel-note' : _c.display === 'toast' ? 'ds-toast' : 'ds-header-instruction';
        noteBox = u.el('section', 'wc-task-note ' + cls, panel);
        u.el('h2', 'ds-section-title', noteBox, 'Task Instructions');
      }
      const header = _c.display === 'header' ? u.el('div', 'wc-note-body', noteBox) : u.el('div', 'wc-header-slot', panel);
      const status = u.el('section', 'ds-status-card', panel);
      const statusTitle = u.el('h2', 'ds-section-title', status, 'Status');
      u.el('span', 'wc-task-clock', statusTitle, '0:00');
      const inner = u.el('div', 'ds-status-inner', status);
      u.el('span', 'ds-clock-icon', inner);
      const copy = u.el('div', 'wc-status-copy', inner);
      u.el('strong', 'wc-status-label', copy, 'Waiting for task timer…');
      const controls = u.el('section', 'ds-controls', panel);
      u.el('h2', 'ds-section-title', controls, 'Controls');
      const row = u.el('div', 'ds-control-row', controls);
      const target = u.el('div', 'wc-target-slot', row);
      u.el('div', 'wc-target-hint', target, 'Currently disabled.\nPlease wait.');
      u.el('div', 'ds-wait-hint', panel, 'Note: Do not refresh the page. The button will become enabled on the task clock.');
      Object.assign(_c, { top, panel, noteBox, header, row });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.row;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const content = _c.util.el('div', 'ds-content', document.body);
      const body = _c.util.el('div', 'ds-main', content);
      const stage = _c.util.el('main', 'ds-stage', body);
      body.appendChild(_c.panel);
      Object.assign(_c, { contentEl: content, body, stage });
    },
    'frame.panel': (base) => (_c) => {
      if (_c.display !== 'panel') { base(_c); return; }
      const body = _c.body;
      _c.body = _c.noteBox;
      base(_c);
      _c.body = body;
      const note = _c.noteBox.querySelector('.ref-panel');
      note.classList.add('ds-note-card');
      note.querySelector('.ref-panel-text').classList.add('ds-instruction');
      _c.util.el('p', 'wc-note-explainer', note, 'The button will become enabled when the task clock reaches the required time. It is currently disabled. Please wait.');
    },
    'frame.stage': () => () => {},
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('wc-note-body');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.noteBox.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.contentEl.appendChild(foot);
      const links = foot.querySelector('.ref-foot-text');
      links.classList.add('wc-foot-links');
      links.textContent = 'My Tasks　 |　 Calendar';
      _c.util.el('span', 'ds-foot-brand', foot, C.brand);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.insertBefore(dock, _c.foot.querySelector('.ds-foot-brand'));
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = { cookie: 'We use cookies to remember your preferences.', toast: 'Changes synced.', chat: 'Hello. How can we help?', promo: 'Try our new workspace.', banner: 'Scheduled maintenance tonight.' };
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
    design: { THEMES: { 'design-act-in-time-delay-02': palette }, LOW_THEME: palette, ACCENTS: ['#87613e'], LOW_ACCENTS: ['#87613e'], parts },
  });
})();
