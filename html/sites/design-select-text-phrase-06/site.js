(function () {
  'use strict';
  const C = {
    'layout': 'web2',
    'theme': 'web2',
    'title': 'Document Viewer',
    'aside': 'Notifications (4)',
    'foot': 'Help',
    'accent': '#3a86d4',
    'bg': '#f3f7fc',
    'surface': '#ffffff',
    'font': 'Trebuchet MS, Lucida Grande, DejaVu Sans, sans-serif',
    'ob': 'notifications',
  };
  const palette = { bg: '#f2f8fc', panel: '#ffffff', fg: '#0b1740', muted: '#344d72', line: '#c5dff4' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original task window accommodates all note modes at every size.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const ctx = _c.ctx, u = _c.util, body = document.body;
      body.className = 'design web2 layout-web2';
        let iconCount = 0;
        const icon = (par, paths, kind) => {
          const s = u.svg(
            'svg',
            { width: 30, height: 30, viewBox: '0 0 32 32', fill: 'none', 'stroke-linejoin': 'round' },
            par,
          );
          const id = 'w2-icon-' + ++iconCount,
            defs = u.svg('defs', {}, s),
            g = u.svg('linearGradient', { id, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
          const gold = kind === 'Open' || kind === 'Highlight';
          u.svg('stop', { offset: '0%', 'stop-color': gold ? '#fff5a7' : '#9bd4ff' }, g);
          u.svg('stop', { offset: '100%', 'stop-color': gold ? '#ffb322' : '#246ac3' }, g);
          const path = (d, fill, stroke, width = 1.8) =>
            u.svg('path', { d, fill: fill || 'none', stroke: stroke || '#386dab', 'stroke-width': width }, s);
          if (kind === 'Open') {
            path('M3 25V7Q3 4 6 4H12L15 8H27V25Z', '#ffe4a4', '#dc951d');
            path('M3 26L6 12H30L27 26Z', 'url(#' + id + ')', '#df941c');
            path('M7 14H27', null, '#fff8d1');
          } else if (kind === 'Save') {
            path('M4 3H26L29 6V29H4Z', 'url(#' + id + ')', '#2164b4');
            path('M9 3H23V13H9Z', '#e6f4ff');
            path('M19 4V11', null, '#2671c7', 3);
            path('M9 19H24V29H9Z', '#f8fcff');
            path('M12 22H21M12 25H21', null, '#9cbada', 1);
          } else if (kind === 'Print') {
            path('M9 3H23V14H9Z', '#f7fcff', '#6e96bc');
            path('M4 12H28V25H4Z', '#d8e4ed', '#527b9d');
            path('M5 13H27V17H5Z', '#f8fcff', '#a4b9cb');
            path('M9 21H23V30H9Z', '#fff', '#557ba0');
            path('M12 24H20M12 27H20', null, '#94afc7', 1);
            path('M24 19H26', null, '#55b063', 2);
          } else if (kind === 'Find') {
            u.svg(
              'circle',
              { cx: 13, cy: 12, r: 10, fill: 'url(#' + id + ')', stroke: '#186ac6', 'stroke-width': 1.5 },
              s,
            );
            u.svg('circle', { cx: 13, cy: 12, r: 6.7, fill: '#e9faff', stroke: '#fff' }, s);
            path('M20 20L28 28', null, '#2164b4', 6);
            path('M21 20L28 27', null, '#5b9ee8', 3);
          } else {
            path('M3 29L6 20L12 26Z', '#203f5e', '#183954');
            path('M6 20L23 3Q25 1 27 3L31 7Q32 9 30 11L13 28Z', 'url(#' + id + ')', '#dea119');
            path('M7 20L13 26M22 5L27 10', null, '#fff3b5', 2);
            path('M5 29H24', null, '#a3b7c8', 2);
          }
          return s;
        };
        const main = u.el('div', 'w2-main', body),
          bar = u.el('div', 'w2-bar', main);
        const di = u.svg(
          'svg',
          {
            class: 'w2-docicon',
            width: 30,
            height: 34,
            viewBox: '0 0 24 28',
            fill: '#fff',
            stroke: '#dfeaf7',
            'stroke-width': 1,
          },
          bar,
        );
        u.svg('path', { d: 'M3 1H14L21 8V27H3Z' }, di);
        u.svg('path', { d: 'M7 12H17M7 16H17M7 20H17', stroke: '#3d83cf', 'stroke-width': 1.6 }, di);
        u.el('span', 'w2-apptitle', bar, 'Document Viewer');
        const wel = u.el('span', 'w2-welcome', bar, 'Welcome, Alex');
        u.el('i', '', wel, '|');
        const so = u.el('span', '', wel, 'Sign ');
        u.el('u', '', so, 'Out');
        const tabs = u.el('div', 'w2-tabs', main);
        for (const [i, t] of ['Home', 'Documents', 'Tasks', 'Calendar', 'Contacts'].entries()) {
          const b = u.el('button', 'w2-tab' + (i === 1 ? ' on' : ''), tabs, t);
          b.type = 'button';
          b.onclick = () => {
            tabs.querySelectorAll('.w2-tab').forEach((x) => x.classList.remove('on'));
            b.classList.add('on');
          };
        }
        const tb = u.el('div', 'w2-toolbar', main);
        const tbtn = (txt, paths, cls) => {
          const b = u.el('button', 'w2-tbtn ' + (cls || ''), txt === 'Open' || txt === 'Save' ? grp1 : tb);
          b.type = 'button';
          icon(b, paths, txt);
          u.el('span', '', b, txt);
          b.onclick = () => env.log('toolbar', { txt });
          return b;
        };
        const grp1 = u.el('div', 'w2-tgroup', tb);
        tbtn('Open', [['M2 7H9L11 9H21V20H2Z', '#f3c04e']]);
        tbtn('Save', [
          ['M3 3H18L21 6V21H3Z', '#3a7fd0'],
          ['M7 3V9H16V3', '#fff'],
        ]);
        tbtn('Print', [['M6 9V3H18V9M6 18H3V10H21V18H18M6 14H18V21H6Z', '#d6dde6']], 'gap');
        u.el('span', 'w2-sep', tb);
        tbtn('Find', [['M10 3A7 7 0 1 1 10 17A7 7 0 1 1 10 3M15 15L21 21']]);
        const hb = tbtn(
          'Highlight',
          [
            ['M4 20L10 14L15 19L9 21Z', '#f3c04e'],
            ['M10 14L18 5L22 9L15 17Z', '#e9d860'],
          ],
          'hl',
        );
        u.el('b', 'w2-caret', hb);
        const stage = u.el('main', 'stage', main);
        stage.dataset.role = 'stage';
        const st = u.el('div', 'w2-status', main);
        u.el('span', '', st, 'Page 1 of 1');
        u.el('i', '', st, '');
        u.el('span', '', st, '173 words');
        const zm = u.el('div', 'w2-zoom', st);
        u.el('span', '', zm, '100%');
        u.el('b', '', zm, '−');
        const tr = u.el('div', 'w2-track', zm);
        u.el('div', 'w2-thumb', tr);
        u.el('b', '', zm, '+');
        const win = u.el('div', 'w2-task', body),
          tt = u.el('div', 'w2-ttitle', win);
        u.el('span', '', tt, 'Task');
        const wc = u.el('span', 'w2-wc', tt);
        for (const l of ['−', '□', '×']) {
          const x = u.el('i', '', wc, l);
        }
        const note = u.el('section', 'task-note', win);
        const ic = u.el('div', 'w2-tico', note);
        const si = u.svg('svg', { width: 30, height: 34, viewBox: '0 0 24 28', fill: '#fff' }, ic);
        u.svg('path', { d: 'M3 1H21V27H3Z' }, si);
        u.svg('path', { d: 'M7 8H17M7 12H17M7 16H17M7 20H17', stroke: '#4ea133', 'stroke-width': 1.6 }, si);
        note.hidden = _c.display === 'hidden';
        const tools = u.el('div', 'w2-tools', win);
        u.el('h4', '', tools, 'Tools');
        u.el(
          'p',
          '',
          tools,
          'Select text with your mouse. You can use the highlight tool in the document if you prefer.',
        );
        const hb2 = u.el('button', 'w2-tbtn hl', tools);
        hb2.type = 'button';
        icon(hb2, [], 'Highlight');
        u.el('span', '', hb2, 'Highlight');
        u.el('b', 'w2-caret', hb2);
        const acts = u.el('div', 'w2-acts', tools);
        const clr = u.el('button', 'w2-clear', acts, 'Clear Highlight');
        clr.type = 'button';
        clr.onclick = () => {
          env.widgetDef.clear?.();
        };
      Object.assign(_c, { main, toolbar: tb, stage, status: st, zoom: zm, win, header: note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const text = _c.header.querySelector('.ref-instruction');
      if (text) text.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.main; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const text = _c.header.querySelector('.ref-panel-text');
      if (text) text.classList.add('instruction');
    },
    'frame.stage': () => () => {},
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.querySelector('.ref-note-text').classList.add('instruction');
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.querySelector('.ref-foot-text').remove();
      _c.status.insertBefore(foot, _c.zoom);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.win.querySelector('.w2-acts').appendChild(dock);
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
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };    },
  };
  env.site({
    name: 'design-select-text-phrase-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'web2.css'],
    design: {
      THEMES: { 'design-select-text-phrase-06': palette },
      LOW_THEME: palette,
      ACCENTS: ['#3a86d4'],
      LOW_ACCENTS: ['#3a86d4'],
      parts,
    },
  });
})();
