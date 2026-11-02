(function () {
  'use strict';
  const C = { theme: 'forum', accent: '#1d82f2' };
  const palette = { bg: '#e3e9f1', panel: '#f3f6fb', fg: '#1b2a44', muted: '#5a6b86', line: '#9fb0c8' };
  function drawChrome(u, win) {
    const top = u.el('header', 'head ftop', win);
    u.el('div', 'ftitle', top, 'Community Forum');
    const tl = u.el('nav', 'ftoplinks', top);
    ['My Profile', 'Settings', 'Help', 'Log Out'].forEach((t, i) => {
      if (i) u.el('i', '', tl, '|');
      u.el('a', '', tl, t);
    });
    const nav = u.el('div', 'fnav', win);
    ['Home', 'Forums', 'Members', 'Calendar'].forEach((t, i) => u.el('span', 'ftab' + (i === 1 ? ' on' : ''), nav, t));
    u.el('span', 'fgrow', nav);
    const s = u.el('span', 'fsearch', nav, 'Search forums...');
    u.el('span', 'fgo', nav, 'Go');
    const cr = u.el('div', 'fcrumb', win);
    ['Forums', 'Product Support', 'User Interface'].forEach((t) => {
      u.el('a', '', cr, t);
      u.el('i', '', cr, '>');
    });
    u.el('span', '', cr, 'Thread: Resizing a panel');
    const thread = u.el('div', 'fthread', win);
    const th = u.el('div', 'fthead', thread);
    u.el('span', '', th, 'Resizing a panel');
    u.el('span', 'fopt', th, 'Thread Options ▾');
    const posts = [
      [
        'AlexR',
        'Member',
        '482',
        '10:12 AM',
        "I'm trying to resize the Comments panel to get a better view. What size should it be?",
      ],
      [
        'SamanthaK',
        'Member',
        '317',
        '10:18 AM',
        "There's a specific size for this task. Check the instructions below.",
      ],
      [
        'DevJoe',
        'Moderator',
        '1,204',
        '10:27 AM',
        'Right, use the bottom-right handle to resize. Make sure it matches the exact dimensions.',
      ],
    ];
    posts.forEach((p, i) => {
      const r = u.el('div', 'fpost p' + i, thread);
      const a = u.el('div', 'fauthor', r);
      u.el('b', '', a, p[0]);
      u.el('div', '', a, p[1]);
      u.el('div', 'fmore', a, 'Posts: ' + p[2]);
      u.el('div', 'fmore', a, 'Jan 14, 2003');
      const m = u.el('div', 'fmsg', r);
      const h = u.el('div', 'fmh', m);
      u.el('span', '', h, 'Posted ' + p[3]);
      u.el('span', '', h, '#' + (i + 1));
      u.el('div', 'fmt', m, p[4]);
    });
    return nav;
  }
  function drawPalette(u, body) {
    const pal = u.el('aside', 'aside fpal', body);
    const pt = u.el('div', 'fpt', pal);
    u.el('span', '', pt, 'Tools');
    u.el('span', 'fx', pt, '×');
    const ic = {
      Select: '<path d="M5 2V20L10 15L14 23L17 21L13 14H20Z" fill="#fff" stroke="#222" stroke-width="1.6"/>',
      Pan: '<path d="M7 22L3 13Q3 11 5 12L8 15V5Q9 3 10.500 5V11V3Q12 1 13 3V11V4Q15 2 16 4V12V7Q18 5 19 7V16L16 22Z" fill="#fff" stroke="#222" stroke-width="1.5"/>',
      ZoomIn:
        '<circle cx="10" cy="10" r="7" fill="none" stroke="#222" stroke-width="1.8"/><path d="M15 15L22 22M7 10H13M10 7V13" stroke="#222" stroke-width="1.8"/>',
      ZoomOut:
        '<circle cx="10" cy="10" r="7" fill="none" stroke="#222" stroke-width="1.8"/><path d="M15 15L22 22M7 10H13" stroke="#222" stroke-width="1.8"/>',
      Grid: '<rect x="3" y="3" width="18" height="18" fill="none" stroke="#222" stroke-width="1.6" stroke-dasharray="3 2"/><rect x="10" y="10" width="4" height="4" fill="none" stroke="#222"/>',
    };
    ic.ZoomIn = ic.ZoomOut;
    ic.Grid =
      '<path d="M3 10V3H10M14 3H21V10M21 14V21H14M10 21H3V14M3 12H21M12 3V21" fill="none" stroke="#263955" stroke-width="1.6" stroke-dasharray="5 2"/><circle cx="12" cy="12" r="1.6" fill="none" stroke="#657b94"/>';
    [
      ['Select', 'Select'],
      ['Pan', 'Pan'],
      ['ZoomIn', 'Zoom In'],
      ['ZoomOut', 'Zoom Out'],
      ['-'],
      ['Grid', 'Show Grid'],
    ].forEach((t, i) => {
      if (t[0] === '-') {
        u.el('div', 'fsep', pal);
        return;
      }
      const it = u.el('div', 'fitem' + (i === 0 ? ' on' : ''), pal);
      const sp = u.el('span', 'fic', it);
      sp.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24">' + ic[t[0]] + '</svg>';
      u.el('span', '', it, t[1]);
    });
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Every display fits in the original status area, including narrow views.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('design', 'forum');
      _c.root.style.setProperty('--font', "'Arial Narrow','Liberation Sans Narrow',Arial,sans-serif");
      const win = u.el('div', 'shell fwin', document.body);
      const toolbar = drawChrome(u, win);
      const note = u.el('section', 'task-note');
      note.hidden = _c.display === 'hidden';
      drawPalette(u, document.body);
      Object.assign(_c, { win, toolbar, note, header: note });
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
    },
    'frame.body': () => (_c) => { _c.body = _c.win; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.note;
      base(_c);
      _c.body = body;
      if (_c.display === 'panel') {
        _c.note.classList.add('forum-panel');
        _c.note.querySelector('.ref-panel-text').classList.add('instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.win);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        _c.note.classList.add('forum-toast');
        const note = document.body.querySelector('.ref-note');
        note.querySelector('.ref-note-text').classList.add('instruction');
        _c.note.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer', 'ffoot');
      foot.querySelector('.ref-foot-text').remove();
      foot.prepend(_c.note);
      const spacer = _c.util.el('div', 'fgrow');
      foot.insertBefore(spacer, foot.querySelector('.ref-tools'));
      _c.win.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
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
    name: 'design-resize-element-numeric-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'forum.css'],
    design: {
      THEMES: { 'design-resize-element-numeric-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#5b7fae'],
      LOW_ACCENTS: ['#5b7fae'],
      parts,
    },
  });
})();
