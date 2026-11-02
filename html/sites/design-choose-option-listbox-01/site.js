(function () {
  'use strict';
  const CALENDAR = '<svg viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 4h20v20H3zM3 10h20M8 1v7M18 1v7M7 15h12M7 20h12M10 12v10M16 12v10"/></svg>';
  const palette = { bg: '#eeece6', panel: '#f7f6f2', fg: '#080808', muted: '#62615d', line: '#292929' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The briefing pane has room for every display at every supported size.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const shell = u.el('div', 'ds-shell', document.body);
      const brief = u.el('aside', 'ds-brief ds-display-' + _c.display, shell);
      u.el('h2', '', brief, 'Task Briefing');
      const noteSlot = u.el('div', 'ds-note-slot', brief);
      if (_c.display === 'header' || _c.display === 'toast') {
        u.el('h3', 'ds-your-task', noteSlot, _c.display === 'toast' ? 'Task note:' : 'Your task:');
      }
      u.el('p', 'ds-guide', brief, 'Use the application on the right to complete the task.');
      u.el('h3', 'ds-notes-title', brief, 'Notes:');
      const notes = u.el('ul', 'ds-notes', brief);
      u.el('li', '', notes, 'Use the mouse wheel or the scrollbar to view more options if needed.');
      u.el('li', '', notes, 'Select only the requested options from the list.');
      u.el('li', '', notes, 'Leave all other settings as they are.');
      u.el('li', '', notes, 'Finish when you have made the selection.');
      const workspace = u.el('section', 'ds-workspace', shell);
      const top = u.el('header', 'ds-top', workspace);
      u.el('span', 'ds-app-icon', top).innerHTML = CALENDAR;
      u.el('strong', 'ds-brand', top, 'Event Planner');
      const topTools = u.el('div', 'ds-top-tools', top);
      const controls = u.el('div', 'ds-window-controls', top);
      ['−', '□', '×'].forEach(t => u.el('span', '', controls, t));
      Object.assign(_c, { shell, brief, noteSlot, workspace, header: topTools });
    },
    'frame.nav': () => (_c) => {
      const menu = _c.util.el('nav', 'ds-menu', _c.workspace);
      ['File', 'Edit', 'View', 'Help'].forEach(t => _c.util.el('span', '', menu, t));
    },
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.noteSlot;
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
    },
    'frame.body': () => (_c) => {
      _c.body = _c.workspace;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteSlot;
      base(_c);
      _c.body = body;
      const title = _c.noteSlot.querySelector('.ref-panel-title');
      if (title) title.textContent = 'Instructions:';
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.workspace);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        _c.noteSlot.appendChild(document.body.querySelector('.ref-note'));
      }
      if (_c.ctx.instruction.length > 65) _c.brief.classList.add('ds-brief-long');
      // Fit long seeded notes before the kit measures task anchors.
      for (let pass = 0; pass < 5 && _c.brief.scrollHeight > _c.brief.clientHeight; pass++) {
        for (const text of _c.brief.querySelectorAll('.ref-instruction, .ref-panel-text, .ref-note-text, .ds-guide, .ds-notes')) {
          text.style.fontSize = (parseFloat(getComputedStyle(text).fontSize) * 0.92) + 'px';
        }
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const footer = _c.util.el('footer', 'ds-footer', _c.workspace);
      footer.appendChild(document.body.querySelector('.ref-foot'));
      const cancel = _c.util.el('button', 'ds-cancel', footer, 'Cancel');
      cancel.type = 'button';
      Object.assign(_c, { footer, cancel });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.insertBefore(dock, _c.cancel);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body); el.dataset.role = 'overlay';
      const texts = { cookie: 'We use cookies to remember your preferences.', toast: 'Changes synced.', chat: 'Hello. How can we help?', promo: 'Try our new workspace.', banner: 'Scheduled maintenance tonight.' };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    }
  };
  env.site({
    name: 'design-choose-option-listbox-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-choose-option-listbox-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#111111'],
      LOW_ACCENTS: ['#111111'],
      parts
    }
  });
})();
