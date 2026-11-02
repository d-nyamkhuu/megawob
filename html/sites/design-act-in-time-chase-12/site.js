(function () {
  'use strict';
  const C = { site: 'design-act-in-time-chase-12' };
  const ICONS = {
    floppy:
      '<path d="M7 3H45L53 11V54H7Z" fill="#ddd" stroke="#080808" stroke-width="3"/><path d="M12 4H45V27H12Z" fill="#080808"/><path d="M20 5H39V23H20Z" fill="#eee"/><path d="M31 8H36V19H31Z" fill="#080808"/><path d="M12 33H47V50H12Z" fill="#ccc"/><path d="M20 37H39M20 41H35" stroke="#777" stroke-width="2"/><path d="M9 52H50" stroke="#f3f3f3" stroke-width="2"/>',
    folder:
      '<path d="M2 15V7H20L26 12H61V57H2Z" fill="#bcbcbc" stroke="#080808" stroke-width="3"/><path d="M3 17H60" stroke="#080808" stroke-width="3"/><path d="M5 20H58M5 20V54" stroke="#e8e8e8" stroke-width="2"/>',
    trash:
      '<path d="M15 17H47V59L42 62H20L15 58Z" fill="#ccc" stroke="#080808" stroke-width="3"/><path d="M12 13L22 9H40L50 13V19L40 23H23L12 19Z" fill="#ccc" stroke="#080808" stroke-width="3"/><path d="M24 10V5H39V10" fill="#aaa" stroke="#080808" stroke-width="3"/><path d="M21 27V56M26 27V58M31 27V58M36 27V58M41 26V56" stroke="#888" stroke-width="2"/><path d="M18 26V56M45 24V56" stroke="#eee" stroke-width="2"/>',
  };
  function desktopIcon(u, parent, kind) {
    const svg = u.svg(
      'svg',
      { class: 'ds-pixel-icon ds-pixel-' + kind, viewBox: '0 0 64 66', 'aria-hidden': 'true' },
      parent,
    );
    svg.innerHTML = ICONS[kind];
  }
  const palette = { bg: '#287d36', panel: '#d4d4d4', fg: '#080808', muted: '#292929', line: '#111' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
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
      ['Desk', 'File', 'Edit', 'Options', 'Window', 'Help'].forEach((t) => u.el('span', '', top, t));
      u.el('time', 'ds-date', top, 'Mon 27 Jan 1986  10:14 AM');
      const desktop = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', desktop);
      [['floppy', 'Floppy Disk'], ['folder', 'Work'], ['folder', 'Utilities'], ['trash', 'Trash']].forEach(([i, t]) => {
        const item = u.el('div', 'ds-desktop-icon', rail);
        desktopIcon(u, item, i);
        u.el('span', '', item, t);
      });
      const content = u.el('div', 'ds-content', desktop);
      u.el('div', 'ds-titlebar', content, 'Pointer Trainer');
      Object.assign(_c, { contentPane: content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note', 'ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const u = _c.util;
      const task = u.el('section', 'ds-task-controls', _c.contentPane);
      const taskHead = u.el('div', 'ds-section-head', task);
      u.el('b', 'ds-triangle', taskHead, '▶');
      u.el('strong', '', taskHead, 'Task controls');
      u.el('span', 'ds-collapsed', taskHead, '(collapsed)');
      const reveal = u.el('button', 'ds-show-controls', taskHead, 'Show controls');
      reveal.type = 'button';
      const taskBody = u.el('div', 'ds-task-body', task, 'Pointer tracking controls.');
      taskBody.hidden = true;
      reveal.addEventListener('click', () => {
        const open = taskBody.hidden;
        taskBody.hidden = !open;
        reveal.textContent = open ? 'Hide controls' : 'Show controls';
        taskHead.querySelector('.ds-triangle').textContent = open ? '▼' : '▶';
        taskHead.querySelector('.ds-collapsed').textContent = open ? '(expanded)' : '(collapsed)';
      });
      const pref = u.el('section', 'ds-preferences', _c.contentPane);
      const prefHead = u.el('div', 'ds-pref-head', pref);
      u.el('span', 'ds-triangle', prefHead, '▼');
      u.el('strong', '', prefHead, 'Preferences');
      const prefBody = u.el('div', 'ds-pref-body', pref);
      const speed = u.el('div', 'ds-speed', prefBody);
      u.el('span', '', speed, 'Circle speed:');
      const range = u.el('div', 'ds-range', speed);
      range.setAttribute('aria-hidden', 'true');
      u.el('i', '', range);
      u.el('span', '', speed, 'Medium');
      const bg = u.el('div', 'ds-background', prefBody);
      u.el('span', '', bg, 'Background:');
      u.el('span', 'ds-radio selected', bg, 'Plain');
      u.el('span', 'ds-radio', bg, 'Grid');
      const checks = u.el('div', 'ds-checks', prefBody);
      [['☑', 'Show elapsed time'], ['☑', 'Show dwell counter'], ['□', 'Play sound on success']].forEach(([i, t]) => {
        const row = u.el('div', '', checks);
        u.el('b', '', row, i);
        u.el('span', '', row, t);
      });
      const action = u.el('div', 'ds-action', prefBody);
      const h = _c.header;
      _c.header = action;
      base(_c);
      _c.header = h;
      const extras = u.el('div', 'ds-extra-tools', prefHead);
      _c.headerTools.querySelectorAll('.ref-xtra').forEach((b) => extras.appendChild(b));
      if (!_c.submit) {
        action.classList.add('ds-inactive');
        u.el('span', 'ds-device-note', action, 'Mouse only');
      }
      Object.assign(_c, { taskHead, prefHead, reveal });
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.contentPane);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) {
        note.classList.add('ds-brief');
        note.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.contentPane.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.prefHead.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.taskHead.insertBefore(dock, _c.reveal);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
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
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#111'], LOW_ACCENTS: ['#111'], parts,
    },
  });
})();
