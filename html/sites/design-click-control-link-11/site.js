(function () {
  'use strict';

  const cfg = {
    title: 'The Daily Chronicle',
    tools: ['Home', 'U.S.', 'World', 'Business', 'Technology', 'Science', 'Health', 'Arts', 'Opinion'],
    obstacle: 'Notifications (4)',
    copy: 'New comment on your article|Event reminder|New message|Trending this morning',
    dismiss: 'Dismiss all',
  };

  // Dress the template's instruction element as the reference's native Task window.
  function taskWindow(_c, note) {
    const { ctx, display, util } = _c;
    const text = ctx.instruction;
    const close = note.querySelector('.ref-note-x');
    note.replaceChildren();
    note.className = 'instruction';
    note.dataset.display = display;
    if (display === 'toast') note.classList.add('instruction-toast');
    if (text.length > 60) note.classList.add('long-instruction');
    const copy = util.el('div', 'instruction-copy', note);
    const quoted = text.match(/["“]([^"”]+)["”]/);
    if (quoted) {
      const at = text.indexOf(quoted[0]);
      copy.append(text.slice(0, at));
      util.el('span', 'instruction-target', copy, quoted[0]);
      copy.append(text.slice(at + quoted[0].length));
    } else copy.textContent = text;
    util.el('p', 'instruction-hint', note, 'Article links open related information and documents.');
    util.el('span', 'task-window-controls', note, close ? '−' : '−  ×');
    if (close) {
      close.className = 'task-note-close';
      note.append(close);
    }
    _c.note = note;
  }

  function notificationStack(ctx) {
    const u = ctx.util;
    const obstacle = u.el('section', 'design-obstacle', document.body);
    u.el('h2', '', obstacle, cfg.obstacle);
    cfg.copy.split('|').forEach((t) => u.el('p', '', obstacle, t));
    const bodies = [
      'A reader replied to your comment on “City Budget Priorities.”',
      'Community forum tonight at 7 PM.',
      'You have a new message from Taylor.',
      '10 most-read stories in your area.',
    ];
    obstacle.querySelectorAll('p').forEach((p, i) => {
      const head = p.textContent;
      p.textContent = '';
      const icons = [
        '<rect x="1" y="3" width="22" height="18" rx="2" fill="#b71c20" stroke="none"/><path d="m2 5 10 8L22 5" stroke="white" stroke-width="1.2"/>',
        '<rect x="3" y="4" width="19" height="20" rx="1"/><path d="M7 1v7M17 1v7M4 10h17M7 13h12M7 17h12M10 11v11M15 11v11"/>',
        '<path d="M2 3h20v15H9l-5 5v-5H2Z" fill="#b71c20" stroke="none"/><g fill="white" stroke="none"><circle cx="6" cy="11" r="1.3"/><circle cx="12" cy="11" r="1.3"/><circle cx="18" cy="11" r="1.3"/></g>',
        '<path d="M3 1h13l5 5v17H3ZM16 1v6h5M7 11h10M7 15h10M7 19h10"/>',
      ];
      p.innerHTML = '<svg viewBox="0 0 24 24">' + icons[i] + '</svg><strong>' + head + '</strong>';
      u.el('span', 'notification-body', p, bodies[i]);
      u.el('small', 'notification-time', p, ['9:12 AM', '8:41 AM', '8:03 AM', '7:28 AM'][i]);
      const dismiss = u.el('button', 'single-dismiss', p, 'Dismiss');
      dismiss.addEventListener('click', () => (p.hidden = true));
    });
    const close = u.el('button', 'dismiss-design', obstacle, cfg.dismiss);
    const closeX = u.el('button', 'notification-close', obstacle, '×');
    closeX.type = 'button';
    closeX.addEventListener('click', () => ctx.dismiss('close'));
    close.type = 'button';
    close.addEventListener('click', () => ctx.dismiss('close'));
    return { el: obstacle, dismiss: close };
  }

  env.site({
    name: 'design-click-control-link-11',
    template: 'site/base',
    initialOverlay: { kind: 'promo' },
    design: {
      parts: {
        'frame.theme': () => (_c) => {
          const { ctx } = _c;
          document.body.className = 'ref newsstack board';
          Object.assign(_c, { rng: ctx.rng, util: ctx.util, content: ctx.content });
        },
        'frame.header': () => (_c) => {
          const { util } = _c;
          const shell = util.el('main', 'shell', document.body);
          const head = util.el('header', 'head', shell);
          util.el('div', 'title', head, cfg.title);
          const menus = util.el('div', 'tools', head);
          cfg.tools.forEach((text) => util.el('span', 'nav-item', menus, text));
          const account = util.el('div', 'account', head, 'Sign In  |  Register');
          const search = util.el('div', 'search-box', head);
          util.el('span', '', search, 'Search articles...');
          const icon = util.el('span', 'search-icon', search);
          icon.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></svg>';
          Object.assign(_c, { shell, head, header: account });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => (_c) => {
          base(_c);
          const note = _c.header.querySelector('.ref-instruction');
          if (note) taskWindow(_c, note);
          _c.header.querySelector('.ref-spacer')?.remove();
        },
        'frame.body': () => (_c) => {
          const { shell, util } = _c;
          const work = util.el('div', 'work ref-body', shell);
          const center = util.el('section', 'center', work);
          if (_c.note) center.append(_c.note);
          Object.assign(_c, { work, body: center });
        },
        'frame.panel': (base) => (_c) => {
          base(_c);
          const note = _c.body.querySelector('.ref-panel');
          if (note) taskWindow(_c, note);
        },
        'frame.stage': () => (_c) => {
          _c.stage = _c.util.el('div', 'stage', _c.body);
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          const note = document.querySelector('.ref-note');
          if (note) {
            taskWindow(_c, note);
            _c.body.prepend(note);
          }
        },
        'frame.footer': (base) => (_c) => {
          base(_c);
          let foot = document.querySelector('.ref-foot');
          if (foot) {
            foot.className = 'footer';
            foot.querySelector('.ref-foot-text').remove();
            _c.shell.append(foot);
          } else foot = _c.util.el('footer', 'footer', _c.shell);
          _c.foot = foot;
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          const dock = document.querySelector('.ref-float-dock');
          if (dock) {
            dock.className = 'frame-floating';
            _c.foot.append(dock);
          }
        },
        'frame.end': (base) => (_c) => {
          const { submit, placement, util, foot } = _c;
          if (submit) {
            submit.className = placement === 'link' ? 'episode-end-link'
              : ['header', 'icon'].includes(placement) ? 'episode-end-header' : 'submit';
          }
          const decoys = document.querySelectorAll('.ref-xtra');
          if (decoys.length) {
            const row = util.el('div', 'frame-actions', foot);
            decoys.forEach((button) => {
              button.className = 'chrome-xtra chrome-xtra-footer';
              row.append(button);
            });
          }
          return base(_c);
        },
        overlay: (base) => (ctx) => ctx.initial ? notificationStack(ctx) : base(ctx),
      },
    },
  });
})();
