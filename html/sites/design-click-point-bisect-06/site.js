(function () {
  'use strict';
  const C = { theme: 'eink', accent: '#111' };
  const palette = { bg: '#0b0f16', panel: '#0f181f', fg: '#b1fa64', muted: '#a9b9c8', line: '#1b2633' };

  function fitInstruction(note, text) {
    if (!text) return;
    note.style.setProperty('--instruction-chars', String(text.textContent.length));
    const style = getComputedStyle(note);
    const width = note.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    const tracking = parseFloat(getComputedStyle(text).letterSpacing) || 0;
    text.style.fontSize = Math.max(12, Math.min(24,
      (width / Math.max(1, text.textContent.length) - tracking) / 0.61)).toFixed(2) + 'px';
  }

  function styleControls(parent, u) {
    parent.querySelectorAll('.ref-submit').forEach((button) => {
      button.classList.add('submit');
      if (!button.classList.contains('ref-icon') && !button.querySelector('svg')) {
        const icon = u.svg('svg', { width: 22, height: 20, viewBox: '0 0 22 20',
          fill: 'none', stroke: 'currentColor', 'stroke-width': 1.8, 'stroke-linejoin': 'round' }, button);
        u.svg('path', { d: 'M2 2L20 10L2 18L5 10Z M5 10H20' }, icon);
      }
    });
  }

  function drawPalette(u) {
    const body = document.body;
    const pal = u.el('aside', 'palette', body);
    const ph = u.el('div', 'pal-head', pal);
    u.el('span', '', ph, 'Tools');
    u.el('i', '', ph);
    const grid = u.el('div', 'pal-grid', pal);
    const ICONS = {
      Point: '<circle cx="12" cy="12" r="4.8" fill="currentColor" stroke="none"/>',
      Line: '<path d="M2 22L22 2"/>',
      Ray: '<path d="M3 21L21 3M13 4L21 3L20 11"/>',
      Circle: '<circle cx="12" cy="12" r="9"/>',
      Delete: '<path d="M4 6H20M9 6V3H15V6M6 6L7 22H17L18 6M10 10V18M14 10V18"/>',
      Clear: '<path d="M3 15L14 3L22 11L12 21H9ZM8 9L17 17"/>',
    };
    for (const n of ['Point', 'Line', 'Ray', 'Circle', 'Delete', 'Clear']) {
      const b = u.el('button', 'ptool' + (n === 'Point' ? ' on' : ''), grid);
      b.type = 'button';
      const s = u.svg(
        'svg',
        { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 },
        b,
      );
      s.innerHTML = ICONS[n];
      u.el('span', '', b, n);
      b.onclick = () => {
        grid.querySelectorAll('.ptool').forEach((x) => x.classList.remove('on'));
        b.classList.add('on');
      };
    }
    u.el('hr', '', pal);
    for (const [t, on] of [
      ['Show grid', 1],
      ['Show labels', 1],
      ['Snap to grid', 0],
    ]) {
      const l = u.el('label', 'pchk', pal);
      const i = u.el('input', '', l);
      i.type = 'checkbox';
      i.checked = !!on;
      u.el('span', '', l, t);
    }
  }

  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This workspace provides its own note area even at compact sizes.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util, body = document.body;
      body.className = 'design dark-dev' + (_c.display === 'toast' ? ' has-instruction-toast' : '');
    const shell = u.el('div', 'shell', body),
      head = u.el('header', 'head', shell);
    const logo = u.svg(
      'svg',
      {
        width: 30,
        height: 30,
        viewBox: '0 0 30 30',
        fill: 'none',
        stroke: '#b1fa64',
        'stroke-width': 1.8,
        class: 'logo',
      },
      head,
    );
    u.svg('path', { d: 'M15 2L28 27H2Z', 'stroke-linejoin': 'round' }, logo);
    u.svg(
      'path',
      { d: 'M15 6L22 24H7Z M15 7V22 M10 20L15 12L19 22', 'stroke-width': 1, opacity: 0.8, 'stroke-linejoin': 'round' },
      logo,
    );
    u.el('div', 'title', head, 'GeoTask');
    const menu = u.el('nav', 'menu', head);
    for (const t of ['Construct', 'Transform', 'Measure', 'Help']) u.el('span', '', menu, t);
      const content = u.el('div', 'content', shell);
      const note = u.el('section', 'task-note', content);
      note.hidden = _c.display !== 'header';
      Object.assign(_c, { shell, head, content, header: note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const text = _c.header.querySelector('.ref-instruction');
      if (text) {
        text.classList.add('instruction');
        fitInstruction(_c.header, text);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.head;
      base(_c);
      _c.header = header;
      styleControls(_c.headerTools, _c.util);
    },
    'frame.body': () => (_c) => {
      _c.body = _c.content;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.content.querySelector('.ref-panel');
      if (note) {
        note.classList.add('task-note', 'instruction-panel');
        const text = note.querySelector('.ref-panel-text');
        text.classList.add('instruction');
        fitInstruction(note, text);
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const stage = u.el('main', 'stage', _c.content);
      stage.dataset.role = 'stage';
      const st = u.el('div', 'statusbar', _c.content);
      u.el('span', 'pill', st, 'x: 0.000    y: 0.000');
      u.el('span', 'pill right', st, 'Grid: 1.0 units');
      _c.stage = stage;
      drawPalette(u);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note', 'instruction-toast');
        const text = note.querySelector('.ref-note-text');
        text.classList.add('instruction');
        note.querySelector('.ref-note-x').classList.add('note-close');
        _c.content.insertBefore(note, _c.stage);
        fitInstruction(note, text);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.shell.appendChild(foot);
      foot.querySelector('.ref-foot-text').remove();
      const u = _c.util;
      const reset = u.el('button', 'clear', foot);
      reset.type = 'button';
      const icon = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20',
        fill: 'none', stroke: 'currentColor', 'stroke-width': 1.6 }, reset);
      u.svg('path', { d: 'M3 10A8 8 0 1 0 6 3.8M3 1.5V6.5H8',
        'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, icon);
      u.el('span', '', reset, 'Reset');
      reset.onclick = () => env.widgetDef.clear?.();
      foot.prepend(reset);
      styleControls(foot, u);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.foot.appendChild(dock);
        styleControls(dock, _c.util);
      }
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      let title, text, label;
      const o = C.ob;
      if (o === 'update') {
        title = 'A new version is available';
        text = 'Get the latest features and security fixes.';
        label = 'Remind me later';
      } else if (o === 'privacy') {
        title = 'We’d like your consent';
        text =
          'We use optional analytics to improve this application. You can change this setting at any time in the Options menu.';
        label = 'Reject optional';
      } else if (o === 'tips') {
        title = 'Tip of the day';
        text = 'The midpoint is the point that is the same distance from both marked points.';
        label = 'Close';
      } else if (o === 'newsletter') {
        title = 'Stay in the loop';
        text = 'Get occasional tips, practice problems, and feature updates.';
        label = 'Close';
      } else if (o === 'notifications') {
        title = 'Notifications (5)';
        text = 'Software Update Available\nDisk Almost Full\nTip of the Day\nWelcome to Shape Sorter\nReminder';
        label = 'Dismiss all';
      } else if (o === 'survey') {
        title = 'Quick Survey';
        text = 'Please take a moment to give us some feedback.\nHow easy is this training task?';
        label = 'Close survey';
      } else {
        title = {
          cookie: 'Your privacy',
          toast: 'Changes saved',
          chat: 'Support',
          promo: 'Workspace update',
          banner: 'Service notice',
        }[kind];
        text = {
          cookie: 'This application stores optional cookies.',
          toast: 'Your changes have been saved.',
          chat: 'Need a hand with this workspace?',
          promo: 'Explore the latest workspace features.',
          banner: 'You are viewing a shared workspace.',
        }[kind];
        label = kind === 'cookie' ? 'Reject optional' : 'Close';
      }
      u.el('h3', '', box, title);
      if (o === 'notifications') {
        const notifications = u.el('div', 'notifications', box);
        for (const [name, body] of C.theme === 'bitmap'
          ? [
              ['Software Update Available', 'A new version is ready.'],
              ['Disk Almost Full', 'You have 12 MB remaining.'],
              ['Tip of the Day', 'Organize your files faster.'],
              ['Welcome to Shape Sorter', 'Learn how to play.'],
              ['Reminder', 'Back up your disk.'],
            ]
          : [
              ['New message', 'You have a new message from Alex.'],
              ['Weekly digest', 'Your summary is ready to view.'],
              ['Product update', 'Check out what’s new this week.'],
              ['Event reminder', 'Design sync starts in 1 hour.'],
            ]) {
          const card = u.el('div', 'notification-card', notifications);
          u.el('strong', '', card, name);
          u.el('p', '', card, body);
          const x = u.el('button', 'notification-x', card, '×');
          x.onclick = () => card.remove();
        }
      } else u.el('p', '', box, text);
      if (o === 'tips') {
        const label = u.el('label', 'tip-option', box);
        const input = u.el('input', '', label);
        input.type = 'checkbox';
        u.el('span', '', label, 'Do not show again');
      }
      const dismiss = u.el('button', 'dismiss', box, label);
      if (o === 'privacy' || o === 'newsletter') {
        const icon = u.svg(
          'svg',
          {
            class: 'ob-icon',
            width: 64,
            height: 64,
            viewBox: '0 0 64 64',
            fill: 'none',
            stroke: C.accent,
            'stroke-width': 3,
          },
          box,
        );
        u.svg(
          'path',
          {
            d:
              o === 'newsletter'
                ? 'M8 14H56V50H8ZM8 14L32 34L56 14'
                : 'M32 4L54 14V30Q54 49 32 59Q10 49 10 30V14ZM22 30L29 37L44 21',
          },
          icon,
        );
      }
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      if (o === 'privacy' || (kind === 'cookie' && !o)) {
        const accept = u.el('button', 'dismiss', box, 'Accept optional');
        accept.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  };

  env.site({
    name: 'design-click-point-bisect-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'dark.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#b1fa64'],
      LOW_ACCENTS: ['#b1fa64'],
      parts,
    },
  });
})();
