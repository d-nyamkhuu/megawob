(function () {
  'use strict';
  const palette = { bg: '#edf2f8', panel: '#fff', fg: '#202936', muted: '#65738b', line: '#d4dce8' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original frame provides dedicated notes even at compact sizes.
      _c.display = _c.ctx.display || 'header';
      document.body.dataset.instruction = _c.display;
      document.body.classList.toggle('ds-has-end', !_c.ctx.finish);
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
      if (_c.placement) document.body.dataset.endPlacement = _c.placement;
      else delete document.body.dataset.endPlacement;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection(); if (selection) selection.removeAllRanges();
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('strong', 'ds-brand', top, 'WorkHub');
      const nav = u.el('nav', 'ds-menu', top);
      ['Home', 'Documents', 'Tasks', 'Calendar', 'Reports', 'Settings'].forEach((label, i) => {
        u.el('span', i === 0 ? 'active' : '', nav, label);
      });
      u.el('span', 'ds-guest', top, '◉　Guest　⌄');
      const header = u.el('div', 'ds-header-note');
      header.hidden = _c.display !== 'header';
      Object.assign(_c, { top, header });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const ribbon = u.el('nav', 'ds-ribbon', document.body);
      const groups = [
        [['▤', 'New'], ['📁', 'Open'], ['▣', 'Save']],
        [['↶', 'Undo'], ['↷', 'Redo']],
        [['♟', 'Share'], ['✉', 'Email']],
        [['▣', 'Print'], ['⬇', 'Export']],
        [['⚙', 'Preferences'], ['?', 'Help']],
      ];
      groups.forEach(group => {
        const g = u.el('div', 'ds-toolgroup', ribbon);
        group.forEach(([icon, label]) => { const b = u.el('button', 'ds-tool', g); b.type = 'button';
          u.el('span', 'ds-tool-icon', b, icon); u.el('span', '', b, label); });
      });
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const text = _c.header.querySelector('.ref-instruction');
      if (text) text.classList.add('ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-content' + (_c.display === 'panel' ? ' ds-has-panel' : ''), document.body);
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
      _c.body.appendChild(_c.header);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.body.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      const status = foot.querySelector('.ref-foot-text');
      status.classList.add('ds-status');
      status.textContent = '●　All systems operational';
      const time = _c.util.el('span', 'ds-time', null, 'Apr 28, 2025　 2:14 PM');
      foot.insertBefore(time, foot.querySelector('.ref-tools'));
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      // Give the floating control its own corner, outside the task stage.
      if (dock) _c.foot.insertBefore(dock, _c.foot.firstChild);
    },
    overlay: () => (ctx) => {
      const u = ctx.util; const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = { cookie: 'We use cookies to remember your preferences.', toast: 'Changes synced.', chat: 'Hello. How can we help?', promo: 'Try our new workspace.', banner: 'A scheduled system update will occur this evening. You may experience brief interruptions.' };
      u.el('div', 'ds-overlay-text', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, 'Close'); dismiss.type = 'button'; dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-act-in-time-popup-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-popup-05': palette },
      LOW_THEME: palette,
      ACCENTS: ['#3f57b5'],
      LOW_ACCENTS: ['#3f57b5'],
      parts,
    },
  });
})();
