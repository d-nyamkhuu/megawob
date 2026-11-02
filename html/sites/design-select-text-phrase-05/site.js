(function () {
  'use strict';
  const C = { theme: 'aqua5', ob: 'tips', accent: '#2f7be0' };
  const palette = { bg: '#e6eefa', panel: '#ffffff', fg: '#111820', muted: '#657080', line: '#c9cfd5' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original right pane accommodates every instruction display at all sizes.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('design', 'aqua5', 'layout-three');
      document.body.classList.toggle('has-instruction-toast', _c.display === 'toast');
      document.documentElement.style.setProperty('--font', 'Lucida Grande, Lucida Sans Unicode, Trebuchet MS, DejaVu Sans, sans-serif');
      const shell = u.el('div', 'shell', document.body);
      const head = u.el('header', 'head', shell);
        const controls = u.el('div', 'window-controls', head);
        for (const label of ['close', 'minimize', 'zoom']) {
          const bt = u.el('button', '', controls);
          bt.type = 'button';
          bt.setAttribute('aria-label', label);
          bt.onclick = () => env.log('window-control', { label });
        }
        const tb = u.el('div', 'aq-toolbar', head);
        for (const n of ['Open', 'Save', 'Print']) {
          const bt = u.el('button', 'aq-tool', tb);
          bt.type = 'button';
          const s = u.svg(
            'svg',
            {
              width: 38,
              height: 38,
              viewBox: '0 0 32 32',
              stroke: '#55789a',
              'stroke-width': 1,
              'stroke-linejoin': 'round',
            },
            bt,
          );
          const defs = u.svg('defs', {}, s),
            g = u.svg('linearGradient', { id: 'aq-' + n, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
          u.svg('stop', { offset: '0%', 'stop-color': n === 'Save' ? '#abd6ff' : '#ffffff' }, g);
          u.svg('stop', { offset: '50%', 'stop-color': n === 'Save' ? '#609dd2' : '#e2eaf1' }, g);
          u.svg('stop', { offset: '100%', 'stop-color': n === 'Save' ? '#28689d' : '#9db5c9' }, g);
          if (n === 'Open') {
            u.svg('path', { d: 'M5 2H19L27 10V30H5Z', fill: '#fafcff' }, s);
            u.svg('path', { d: 'M19 2V10H27', fill: '#d4e5f4' }, s);
            u.svg('path', { d: 'M8 13H23M8 16H23M8 19H23M8 22H23M8 25H21', stroke: '#b2cadd' }, s);
          } else if (n === 'Save') {
            u.svg('rect', { x: 3, y: 2, width: 26, height: 28, rx: 2, fill: 'url(#aq-Save)' }, s);
            u.svg('path', { d: 'M8 2H24V14H8Z', fill: '#e7f2fb' }, s);
            u.svg('rect', { x: 18, y: 4, width: 3, height: 7, fill: '#365473' }, s);
            u.svg('path', { d: 'M8 20H24V29H8Z', fill: '#b9dcf4' }, s);
            u.svg('rect', { x: 10, y: 23, width: 3, height: 5, fill: '#285f94' }, s);
            u.svg('path', { d: 'M5 3V28', stroke: '#e4f6ff' }, s);
          } else {
            u.svg('rect', { x: 7, y: 1, width: 18, height: 13, rx: 1, fill: '#fafcff' }, s);
            u.svg('rect', { x: 1, y: 10, width: 30, height: 15, rx: 3, fill: 'url(#aq-Print)' }, s);
            u.svg('path', { d: 'M4 14H28M5 20H27', stroke: '#6285a2' }, s);
            u.svg('rect', { x: 7, y: 19, width: 18, height: 11, fill: '#f5faff' }, s);
            u.svg('path', { d: 'M10 23H22M10 26H22', stroke: '#a8bfd4' }, s);
            u.svg('circle', { cx: 26, cy: 17, r: 1, fill: '#71a6dc', stroke: 'none' }, s);
          }
          u.el('span', '', bt, n);
          bt.onclick = () => env.log('toolbar', { n });
        }
        const search = u.el('div', 'aq-search', tb);
        u.el('span', '', search, 'Search Document');
      u.el('div', 'title', head, 'Text Selection Task');
      const content = u.el('div', 'content', shell);
      const note = u.el('section', 'task-note', content);
      note.hidden = _c.display === 'hidden';
      note.classList.toggle('instruction-panel', _c.display === 'panel');
      Object.assign(_c, { shell, toolbar: tb, contentPane: content, note, header: note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const text = _c.note.querySelector('.ref-instruction');
      if (text) text.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('aq-actions');
      _c.toolbar.insertBefore(_c.headerTools, _c.toolbar.querySelector('.aq-search'));
    },
    'frame.body': () => (_c) => {
      _c.body = _c.contentPane;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.note;
      base(_c);
      _c.body = body;
      const text = _c.note.querySelector('.ref-panel-text');
      if (text) text.classList.add('instruction');
    },
    'frame.stage': () => (_c) => {
      const stage = _c.util.el('main', 'stage', _c.body);
      stage.dataset.role = 'stage';
      const aside = _c.util.el('aside', 'aside', _c.body);
      Object.assign(_c, { stage, aside });
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display !== 'toast') return;
      const note = document.body.querySelector('.ref-note');
      note.classList.add('task-note', 'instruction-toast');
      note.querySelector('.ref-note-text').classList.add('instruction');
      note.querySelector('.ref-note-x').classList.add('note-close');
      _c.note.replaceWith(note);
      _c.note = note;
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.aside.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.aside.appendChild(dock);
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
    name: 'design-select-text-phrase-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'aqua5.css'],
    design: { THEMES: { 'design-select-text-phrase-05': palette }, LOW_THEME: palette, ACCENTS: ['#2f7be0'], LOW_ACCENTS: ['#2f7be0'], parts },
  });
})();
