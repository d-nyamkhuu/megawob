(function () {
  'use strict';
  const C = { theme: 'aero', accent: '#54a636' };
  const palette = { bg: '#f8f7f3', panel: '#f8f7f3', fg: '#11140f', muted: '#4f5045', line: '#c5c3b6' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original inspector card only fits on a roomy, tall canvas.
      if (_c.display === 'panel' && (_c.W <= 1200 || _c.H <= 760)) _c.display = 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'design quiet display-' + _c.display + (_c.display === 'toast' ? ' has-instruction-toast' : '');
      const shell = u.el('div', 'qshell', document.body);
      const main = u.el('div', 'qmain', shell);
      const toolbar = u.el('div', 'q-eyebrow', main, 'CANVAS');
      const header = u.el('section', 'task-note', main);
      header.hidden = _c.display === 'hidden' || _c.display === 'panel';
      Object.assign(_c, { shell, main, toolbar, header });
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
    'frame.body': () => (_c) => {
      const u = _c.util;
      // Reserve the original two-line caption space without repeating the goal.
      const sub = u.el('p', 'q-sub', _c.main);
      sub.setAttribute('aria-hidden', 'true');
      sub.hidden = _c.display === 'hidden';
      const frame = u.el('div', 'q-frame', _c.main);
      const aside = u.el('aside', 'q-aside', _c.shell);
      u.el('h2', 'q-title', aside, 'Inspector');
      for (const [head, key] of [['Size (current)', 'cur'], ['Canvas', 'canvas']]) {
        u.el('h3', '', aside, head);
        for (const [label, k] of [['Width', 'w'], ['Height', 'h']]) {
          const row = u.el('div', 'q-row', aside);
          u.el('span', '', row, label);
          const field = u.el('span', 'q-field', row, key === 'cur' ? '' : '—');
          if (key === 'cur') field.dataset.cur = k;
        }
        u.el('hr', '', aside);
      }
      const guideTitle = u.el('h3', 'q-guide-title', aside, _c.display === 'panel' ? 'Instructions' : 'Pointer guide');
      guideTitle.hidden = _c.display === 'hidden';
      Object.assign(_c, { body: _c.shell, frame, aside });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      const panel = _c.aside.querySelector('.ref-panel');
      if (panel) panel.classList.add('episode-instruction');
      // Retain the numbered chrome, using only general pointer guidance.
      const ol = _c.util.el('ol', 'q-steps', _c.aside);
      ol.hidden = _c.display === 'hidden' || _c.display === 'panel';
      for (const text of ['Use the pointer to interact with the canvas.', 'The inspector shows current dimensions.', 'Changes appear in the work area.']) _c.util.el('li', '', ol, text);
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('main', 'stage', _c.frame);
      _c.stage.dataset.role = 'stage';
      u.el('span', 'q-work', _c.frame, 'Work area');
      u.el('span', 'q-tgt', _c.frame, 'Canvas');
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.header.classList.add('instruction-toast');
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        _c.aside.appendChild(foot);
        _c.foot = foot;
      }
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
    name: 'design-resize-element-ghost-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-resize-element-ghost-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#555845'],
      LOW_ACCENTS: ['#555845'],
      parts,
    },
  });
})();
