(function () {
  'use strict';
  const palette = { bg: '#f8fbfd', panel: '#ffffff', fg: '#2c3843', muted: '#818c99', line: '#dfe7ed' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'minimal');
      const win = u.el('main', 'win', document.body);
      win.classList.toggle('finish', _c.ctx.finish);
      const head = u.el('header', 'head', win);
      const brand = u.el('div', 'brand', head);
      u.el('i', '', brand);
      u.el('span', '', brand, 'Task Center');
      const nav = u.el('nav', 'nav', head);
      ['Home', 'Tasks', 'Settings'].forEach((s, i) => u.el('span', i === 1 ? 'on' : '', nav, s));
      const body = u.el('div', 'body', win);
      Object.assign(_c, { win, head, header: body, body });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.head;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      u.el('div', 'label', _c.body, 'Action Buttons');
      _c.center = u.el('section', 'center', _c.body);
      const notes = u.el('aside', 'notes', document.body);
      const nh = u.el('div', 'nh', notes);
      nh.innerHTML =
        '<svg viewBox="0 0 24 24"><path d="M5 1h13l3 3v18H3V3q0-2 2-2Z M7 7h10 M7 11h10 M7 15h7 M7 18h5"/></svg><span>' +
        (_c.display === 'panel' ? 'Task' : 'Notes') +
        '</span><svg class="x" viewBox="0 0 24 24"><path d="m2 2 20 20M22 2 2 22"/></svg>';
      _c.notes = notes;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.notes;
      base(_c);
      _c.body = body;
      ['Read the instruction carefully.', 'Identify the correct sequence.', 'Click the buttons on the left.']
        .forEach((s) => _c.util.el('p', '', _c.notes, s));
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) note.classList.add('toast-note');
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('foot');
      _c.win.appendChild(foot);
      _c.foot = foot;
      // An unused footer had no height in the original frame.
      foot.classList.toggle('has-tools', !!foot.querySelector('button, a') || _c.placement === 'floating');
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
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
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-click-control-sequence-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-control-sequence-07': palette },
      LOW_THEME: palette,
      ACCENTS: ['#36b98d'],
      LOW_ACCENTS: ['#36b98d'],
      parts,
    },
  });
})();
