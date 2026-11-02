(function () {
  'use strict';
  const C = { theme: 'eink', accent: '#111' };
  const palette = { bg: '#e4ded1', panel: '#f8f4eb', fg: '#141414', muted: '#5d5850', line: '#cfc8b8' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.className = 'design paper display-' + _c.display;
      _c.root.style.setProperty('--font', '"Times New Roman",Georgia,serif');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const tabs = u.el('nav', 'nb-tabs', document.body);
      ['Math', 'Science', 'History', 'Literature', 'Art', 'Notes'].forEach((t, i) => {
        const b = u.el('button', 'nb-tab' + (i === 0 ? ' active' : ''), tabs);
        u.el('span', '', b, t);
        b.type = 'button';
        b.onclick = () => {
          tabs.querySelectorAll('.nb-tab').forEach((x) => x.classList.remove('active'));
          b.classList.add('active');
        };
      });
      const page = u.el('div', 'nb-page', document.body);
      const mast = u.el('header', 'nb-mast', page);
      u.el('div', 'nb-title', mast, 'The Daily Notebook');
      u.el('div', 'nb-motto', mast, 'PRACTICE  MAKES  PROGRESS');
      u.el('div', 'nb-date', mast, 'Tue, Apr 12, 2011');
      const sub = u.el('div', 'nb-sub', page);
      u.el('span', 'nb-tag', sub, 'MATHEMATICS  FOR  A  BRIGHTER  TOMORROW');
      const nav = u.el('span', 'nb-nav', sub);
      ['EXERCISES', 'TOOLS', 'HELP'].forEach((t, i) => {
        if (i) u.el('i', '', nav, '|');
        u.el('a', '', nav, t);
      });
      u.el('div', 'nb-kicker', page, 'GEOMETRY  PRACTICE');
      const note = u.el('section', 'task-note' + (_c.ctx.instruction.length > 110 ? ' long-instruction' : ''), page);
      note.hidden = _c.display === 'hidden' || _c.display === 'panel';
      const side = u.el('aside', 'nb-side');
      const box = u.el('div', 'nb-box', side);
      const taskSlot = u.el('div', 'nb-task-slot', box);
      taskSlot.hidden = _c.display !== 'panel';
      if (_c.display === 'panel') u.el('hr', '', box);
      u.el('h4', '', box, 'TOOLS');
      const add = u.el('button', 'nb-btn on', box);
      add.type = 'button';
      add.innerHTML = '<svg width="22" height="26" viewBox="0 0 22 26"><path d="M3 1V20L8 15L12 24L15 22.500L11 14H18Z" fill="#fff" stroke="#fff" stroke-width="1"/></svg><span>Add Point</span>';
      const clr = u.el('button', 'nb-btn', box);
      clr.type = 'button';
      clr.innerHTML = '<svg width="30" height="26" viewBox="0 0 30 26" fill="none" stroke="#222" stroke-width="1.6"><path d="M5 16L15 5Q17 3 19 5L25 10Q27 12 25 14L16 24Q14 26 12 24L5 20Q3 18 5 16ZM9 12L20 22"/></svg><span>Clear All</span>';
      clr.onclick = () => { env.widgetDef.clear?.(); };
      u.el('hr', '', box);
      u.el('h4', '', box, 'INFORMATION');
      u.el('p', 'nb-info', box, 'The dotted circle and marked points are shown in the workspace.');
      Object.assign(_c, { page, sub, side, taskSlot, header: note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const text = _c.header.querySelector('.ref-instruction');
      if (text) text.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.side;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const body = _c.util.el('div', 'nb-row', _c.page);
      Object.assign(_c, { body });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.taskSlot;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
      _c.stage.dataset.role = 'stage';
      _c.body.appendChild(_c.side);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.header.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.side.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.sub.appendChild(dock);
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
    name: 'design-click-point-right-angle-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-point-right-angle-09': palette },
      LOW_THEME: palette,
      ACCENTS: ['#b3202a'],
      LOW_ACCENTS: ['#b3202a'],
      parts,
    },
  });
})();
