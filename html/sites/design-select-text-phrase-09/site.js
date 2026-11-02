(function () {
  'use strict';
  const C = { theme: 'human-text', ob: 'notifications', accent: '#ed8333' };
  const palette = { bg: '#fff', panel: '#fff', fg: '#000', muted: '#000', line: '#000' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original note stays in the window, including at short viewports.
      _c.display = _c.ctx.display || 'header';
      if (_c.display === 'panel' && _c.W < 1260) _c.display = 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util, body = document.body;
      body.classList.add('design', 'mac');
      body.classList.toggle('has-instruction-toast', _c.display === 'toast');
      document.documentElement.style.setProperty('--font', '"Chicago","Geneva","DejaVu Sans Mono","Liberation Mono",monospace');
      const S = (p, a, par) => u.svg(p, a, par);
      const shell = u.el('div', 'mac-shell', body);
      const bar = u.el('nav', 'mac-menubar', shell);
      const ap = S('svg', { class: 'mac-apple', viewBox: '0 0 20 24', width: 22, height: 26 }, bar);
      S('path', { d: 'M10 6Q8 3 5 5Q1 8 3 15Q5 21 8 21Q10 20 12 21Q15 21 18 14Q14 12 15 8Q15 6 17 5Q14 2 10 6ZM11 4Q11 1 14 0Q14 3 11 4Z', fill: '#000' }, ap);
      for (const m of ['File', 'Edit', 'Search', 'Format', 'Windows', 'Help']) u.el('span', 'mac-menu', bar, m);
      const frame = u.el('div', 'mac-frame', shell);
      const rail = u.el('aside', 'mac-rail', frame);
      const icons = [
        ['New', 'M7 3H19L25 9V29H7ZM19 3V9H25M11 10H15M11 14H21M11 18H21M11 22H21M11 25H20'],
        ['Open', 'M3 11H12L14 13H28V28H3ZM3 11V7H10L13 10H25L28 13'],
        ['Save', 'M4 3H28V28H4ZM9 3V14H24V3M18 5V11H21V5M9 28V18H24V28M13 21H14M13 24H14'],
        ['Print', 'M9 11V2H24V11M9 5H10M23 5H24M6 10H27V13H29V25H25V19H8V25H3V13H6ZM8 19V29H25V19M6 14H8M25 14H27'],
      ];
      for (const [name, d] of icons) {
        const b = u.el('button', 'mac-tool', rail);
        b.type = 'button';
        const s = S('svg', { viewBox: '0 0 32 32', width: 44, height: 44, fill: 'none', stroke: '#000', 'stroke-width': 1.8, 'stroke-linejoin': 'miter' }, b);
        S('path', { d }, s);
        u.el('span', '', b, name);
        b.onclick = () => { env.log('tool', { name }); env.log('decoy', { label: name }); };
      }
      const win = u.el('div', 'mac-window', frame);
      const tb = u.el('div', 'mac-titlebar', win);
      u.el('span', 'mac-title', tb, 'Essay Editor');
      u.el('span', 'mac-zoom', tb);
      win.classList.toggle('mac-panel-mode', _c.display === 'panel');
      Object.assign(_c, { shell, bar, win, tb, header: win });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const instruction = _c.win.querySelector('.ref-instruction');
      if (instruction) {
        const note = _c.util.el('section', 'task-note', _c.win);
        note.appendChild(instruction);
        instruction.classList.add('instruction');
      }
      _c.win.querySelector('.ref-spacer')?.remove();
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.tb;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('mac-title-tools');
      // Auxiliary actions belong in the original menu strip.
      for (const button of _c.headerTools.querySelectorAll('.ref-xtra')) _c.bar.appendChild(button);
    },
    'frame.body': () => (_c) => { _c.body = _c.win; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.win.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('task-note', 'instruction-panel');
        panel.querySelector('.ref-panel-title').classList.add('mac-note-title');
        panel.querySelector('.ref-panel-title').textContent = 'Task';
        panel.querySelector('.ref-panel-text').classList.add('instruction');
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const row = u.el('div', 'mac-row', _c.win);
      const stage = u.el('main', 'stage', row);
      stage.dataset.role = 'stage';
      const sb = u.el('div', 'mac-scroll', row);
      u.el('span', 'mac-arrow up', sb, '▲');
      u.el('span', 'mac-track', sb);
      u.el('span', 'mac-arrow down', sb, '▼');
      Object.assign(_c, { row, stage });
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note', 'instruction-toast');
        note.querySelector('.ref-note-text').classList.add('instruction');
        note.querySelector('.ref-note-x').classList.add('note-close');
        _c.win.insertBefore(note, _c.row);
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const foot = u.el('footer', 'mac-foot', _c.win);
      u.el('span', 'mac-stat', foot, 'Page 1 of 1');
      u.el('span', 'mac-sep', foot);
      u.el('span', 'mac-stat', foot, 'Words: 93');
      u.el('span', 'mac-fill', foot);
      const find = u.el('button', 'mac-btn', foot, 'Find...');
      find.type = 'button';
      find.onclick = () => { env.log('find', {}); env.log('decoy', { label: 'Find...' }); };
      const clear = u.el('button', 'mac-btn', foot, 'Clear Highlight');
      clear.type = 'button';
      clear.onclick = () => env.widgetDef.clear?.();
      base(_c);
      const shared = document.body.querySelector('.ref-foot');
      foot.appendChild(shared);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      // Keep the corner action separate from the footer's right-hand controls.
      if (dock) _c.foot.insertBefore(dock, _c.foot.firstChild);
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
        title = 'Notifications (4)';
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
              ['New messages', 'You have 3 unread messages.'],
              ['Software update', 'A new version is available.'],
              ['Calendar reminder', 'Team sync at 11:00.'],
              ['Storage almost full', 'You have 1.2 GB remaining.'],
            ]) {
          const card = u.el('div', 'notification-card', notifications);
          u.el('strong', '', card, name);
          if (C.theme === 'human-text') {
            const index = notifications.children.length - 1;
            u.el('div', 'notification-time', card, ['10:14', '09:52', '09:20', '08:47'][index]);
            const svg = u.svg(
              'svg',
              {
                class: 'notification-icon',
                width: 44,
                height: 48,
                viewBox: '0 0 48 48',
                fill: 'none',
                stroke: '#423024',
                'stroke-width': 3,
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
              },
              card,
            );
            if (index === 0) {
              u.svg('rect', { x: 4, y: 10, width: 40, height: 32, rx: 3 }, svg);
              u.svg('path', { d: 'M5 12L24 28L43 12' }, svg);
            } else if (index === 1) {
              u.svg('path', { d: 'M6 20A18 18 0 0 1 40 15M40 5V16H29M42 28A18 18 0 0 1 8 33M8 43V32H19' }, svg);
            } else if (index === 2) {
              u.svg('rect', { x: 5, y: 8, width: 38, height: 37, rx: 3, fill: '#faf8f3' }, svg);
              u.svg('path', { d: 'M6 16H42', stroke: '#b33020', 'stroke-width': 7 }, svg);
              u.svg('path', { d: 'M14 5V12M34 5V12' }, svg);
              for (const x of [13, 23, 33])
                for (const y of [25, 35])
                  u.svg('rect', { x: x - 2, y: y - 2, width: 4, height: 4, fill: '#b33020', stroke: 'none' }, svg);
            } else {
              u.svg(
                'path',
                {
                  d: 'M20 6Q24 0 28 6M19 41Q24 49 29 41M5 40Q11 36 11 27V20Q11 8 24 8Q37 8 37 20V27Q37 36 43 40Z',
                  fill: '#d9ad74',
                },
                svg,
              );
            }
          }
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
    name: 'design-select-text-phrase-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'mac.css'],
    design: {
      THEMES: { 'design-select-text-phrase-09': palette },
      LOW_THEME: palette,
      ACCENTS: ['#000'],
      LOW_ACCENTS: ['#000'],
      parts,
    },
  });
})();
