(function () {
  const palette = { bg: '#ffffff', panel: '#ffffff', fg: '#203045', muted: '#6c7a8d', line: '#dce3e9' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      if (_c.display !== 'hidden' && _c.W <= 1280) _c.display = 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'minimal-sign');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      head.innerHTML = '<b>Bright<span>Path</span></b><small><i class="av"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#556" stroke-width="1.6"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-5 4-7 8-7s8 2 8 7"/></svg></i>Guest User <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="#556" stroke-width="1.5"><path d="M2 4l4 4 4-4"/></svg></small>';
      const noteHost = u.el(_c.display === 'header' ? 'header' : 'aside', 'task-note note-' + _c.display);
      noteHost.hidden = _c.display === 'hidden';
      if (_c.display === 'header') shell.appendChild(noteHost);
      if (_c.display !== 'panel') u.el('h2', '', noteHost, 'Your task');
      Object.assign(_c, { shell, head, noteHost, header: noteHost });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.head;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const work = u.el('div', 'work', _c.shell);
      const nav = u.el('nav', 'minimal-nav', work);
      const IC = [
        '<path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10"/>',
        '<path d="M6 2h8l5 5v15H6zM14 2v5h5"/>',
        '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-5 4-7 8-7s8 2 8 7"/>',
        '<circle cx="12" cy="12" r="3.5"/><path d="M9 3l1-2h4l1 2 2 1 2-1 3 3-1 2 1 2 2 1v4l-2 1-1 2 1 2-3 3-2-1-2 1-1 2h-4l-1-2-2-1-2 1-3-3 1-2-1-2-2-1v-4l2-1 1-2-1-2 3-3 2 1z"/>',
      ];
      ['Home', 'Documents', 'Profile', 'Settings'].forEach((t, i) => {
        const d = u.el('div', i === 1 ? 'active' : '', nav);
        d.innerHTML = '<svg class="ico" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">' + IC[i] + '</svg><span>' + t + '</span>';
      });
      const card = u.el('section', 'agreement-card', work);
      u.el('h1', '', card, 'User Agreement');
      if (_c.display !== 'header') work.appendChild(_c.noteHost);
      Object.assign(_c, { body: work, card });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteHost;
      base(_c);
      _c.body = body;
      const title = _c.noteHost.querySelector('.ref-panel-title');
      if (title) title.textContent = 'Your task';
      const text = _c.noteHost.querySelector('.ref-panel-text');
      if (text) text.classList.add('instruction');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.card);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        _c.noteHost.appendChild(note);
        note.querySelector('.ref-note-text').classList.add('instruction', 'instruction-toast');
      }
      const u = _c.util;
      const shortcut = u.el('section', 'shortcut', _c.body);
      const bolt = u.el('span', 'bolt', shortcut);
      bolt.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg>';
      u.el('strong', '', shortcut, 'Quick action');
      u.el('p', '', shortcut, 'Auto-fill my name');
      u.el('button', '', shortcut, 'Unavailable').disabled = true;
      if (_c.display !== 'hidden' && _c.display !== 'header') {
        const aside = _c.noteHost;
        shortcut.style.top = Math.max(_c.body.clientHeight * 0.388, aside.offsetTop + aside.offsetHeight + 24) + 'px';
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.shell.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => { base(_c); },
    overlay: () => (ctx) => {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el('p', '', el, 'Close this notice to continue.');
      const dismiss = ctx.util.el('button', 'dismiss', el, 'Close');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-handle-text-sign-agreement-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-handle-text-sign-agreement-12': palette },
      LOW_THEME: palette,
      ACCENTS: ['#60cfb0'],
      LOW_ACCENTS: ['#60cfb0'],
      parts,
    },
  });
})();
