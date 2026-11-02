(function () {
  'use strict';
  const C = {
    theme: 'playful', title: 'Short Read', accent: '#ff8f8a', bg: '#fdf8ee', surface: '#ffffff',
    font: 'Nunito, Avenir Next, Segoe UI, Helvetica Neue, Arial, sans-serif', ob: 'notifications',
  };
  const palette = { bg: C.bg, panel: C.surface, fg: '#111820', muted: '#657080', line: '#c9cfd5' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The dedicated left card fits every viewport and every instruction mode.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'design playful layout-dialog' + (_c.display === 'toast' ? ' has-instruction-toast' : '');
      document.documentElement.style.setProperty('--font', C.font);
      const shell = u.el('div', 'shell', document.body);
      shell.classList.toggle('finish-mode', !!_c.ctx.finish);
      shell.dataset.endPlacement = _c.placement || 'none';
      const head = u.el('header', 'head', shell);
      const icon = u.svg('svg', {
        class: 'app-icon', viewBox: '0 0 24 30', fill: 'none', stroke: '#1c1a3a',
        'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
      }, head);
      u.svg('path', { d: 'M4 2H15L21 8V28H4ZM15 2V8H21M8 14H17M8 19H17M8 24H14' }, icon);
      const dots = u.el('div', 'pdots', head);
      for (const c of ['#8c88c8', '#ff8f8a', '#fdf3d4']) u.el('i', '', dots).style.background = c;
      u.el('div', 'title', head, C.title);
      const note = u.el('section', 'task-note', shell);
      note.hidden = _c.display === 'hidden' || _c.display === 'toast';
      note.classList.toggle('instruction-panel', _c.display === 'panel');
      Object.assign(_c, { shell, head, header: note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const text = _c.header.querySelector('.ref-instruction');
      if (text) text.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.head;
      base(_c);
      _c.header = header;
      _c.shell.classList.toggle('has-header-action', !!_c.headerTools.children.length);
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'content', _c.shell);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const text = _c.header.querySelector('.ref-panel-text');
      if (text) text.classList.add('instruction');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note', 'instruction-toast');
        note.querySelector('.ref-note-text').classList.add('instruction');
        note.querySelector('.ref-note-x').classList.add('note-close');
        _c.shell.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const footer = document.body.querySelector('.ref-foot');
      footer.classList.add('footer');
      _c.shell.appendChild(footer);
      footer.querySelector('.ref-foot-text').hidden = true;
      // Keep incidental controls in the title toolbar, leaving the original tool row intact.
      for (const b of footer.querySelectorAll('.ref-xtra')) _c.headerTools.appendChild(b);
      _c.shell.classList.toggle('has-header-action', !!_c.headerTools.children.length);
      const mk = (cls, label, path, fn) => {
        const b = _c.util.el('button', 'ptool ' + cls);
        b.type = 'button';
        const s = _c.util.svg('svg', {
          width: 34, height: 34, viewBox: '0 0 32 32', fill: 'none', stroke: '#1c1a3a',
          'stroke-width': 2, 'stroke-linejoin': 'round',
        }, b);
        _c.util.svg('path', { d: path }, s);
        _c.util.el('span', '', b, label);
        b.onclick = fn;
        footer.insertBefore(b, footer.querySelector('.ref-tools'));
      };
      mk('sel', 'Select Text', 'M8 3V26L13 21L17 29L21 27L17 19L24 19Z', () => env.log('tool', { name: 'select' }));
      mk('clr', 'Clear Selection', 'M4 19L18 5Q20 3 22 5L28 11Q30 13 28 15L14 29Q12 31 10 29L4 23Q2 21 4 19Z', () => {
        try { window.getSelection().removeAllRanges(); } catch (e) {}
        env.widgetDef.clear?.();
      });
      _c.foot = footer;
    },
    'frame.floating': (base) => (_c) => { base(_c); },
    overlay: () => (ctx) => {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      el.addEventListener('pointerdown', (e) => {
        if (e.target.closest('button')) e.preventDefault();
      });
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
    name: 'design-select-text-phrase-07', template: 'site/base', langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { site: palette }, LOW_THEME: palette, ACCENTS: [C.accent], LOW_ACCENTS: [C.accent], parts },
  });
})();
