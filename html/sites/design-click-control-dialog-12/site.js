(function () {
  'use strict';
  const NAV = ['Home', 'Documents', 'Users', 'Settings', 'Help'];
  const palette = { bg: '#f3f4f7', panel: '#fff', fg: '#293442', muted: '#555', line: '#d9dde3' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.classList.remove('ref-has-note');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'bootstrap');
      const shell = u.el('main', 'shell', document.body);
      u.el('div', 'rightcol', shell);
      const head = u.el('header', 'head', shell);
      u.el('span', 'brand', head, 'Document Manager');
      const nav = u.el('nav', 'nav', head);
      NAV.forEach((l) => u.el('a', '', nav, l));
      const who = u.el('span', 'who', head);
      u.el('span', '', who, 'Signed in as: Alex Chen');
      u.el('i', '', who, '|');
      u.el('span', '', who, 'Sign out');
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      // Keep the strip after the stage without changing the template's section order.
      const strip = u.el('div', 'taskbar');
      u.el('span', 'tri', strip);
      const tx = u.el('div', 'tb-text', strip);
      const tt = u.el('strong', '', tx, 'Task controls (collapsed)');
      u.el('span', '', tx, 'Click to show task controls and see what to do.');
      const sb = u.el('button', 'show-btn', strip, 'Show controls');
      sb.type = 'button';
      sb.addEventListener('click', () => {
        strip.classList.add('open');
        tt.textContent = 'Task controls (expanded)';
        sb.textContent = 'Controls shown';
      });
      const aside = u.el('aside', 'inspector', shell);
      const ph = u.el('div', 'pal-h', aside);
      u.el('span', '', ph, 'Notes');
      const pc = u.el('span', 'pal-c', ph);
      u.el('i', 'min', pc);
      u.el('i', 'cls', pc, '×');
      const pb = u.el('div', 'pal-b', aside);
      u.el('div', 'palette-reminder', pb, 'Follow the instructions carefully.');
      aside.classList.toggle('has-instruction', _c.display === 'panel');
      Object.assign(_c, { shell, center, strip, pb, header: tx });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction', 'task-instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.strip;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.pb;
      base(_c);
      _c.body = body;
      const text = _c.pb.querySelector('.ref-panel-text');
      if (text) {
        text.classList.add('instruction');
        text.dataset.display = _c.display;
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
      _c.center.appendChild(_c.strip);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction-toast');
        _c.shell.appendChild(note);
        note.querySelector('.ref-note-text').classList.add('instruction');
        note.querySelector('.ref-note-text').dataset.display = _c.display;
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.shell.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      if (ctx.initial) {
        const stage = document.querySelector('.stage');
        const strip = document.querySelector('.taskbar');
        const original = strip.querySelector('.show-btn');
        const el = ctx.util.el('section', 'controls-gate', document.body);
        const r = stage.getBoundingClientRect();
        const shield = ctx.util.el('div', 'controls-shield', el);
        shield.style.cssText =
          'position:fixed;left:' + r.left + 'px;top:' + r.top + 'px;width:' + r.width + 'px;height:' + r.height + 'px';
        const b = original.getBoundingClientRect();
        const dismiss = ctx.util.el('button', 'show-btn gate-show', el, 'Show controls');
        dismiss.type = 'button';
        dismiss.style.cssText =
          'position:fixed;left:' + b.left + 'px;top:' + b.top + 'px;width:' + b.width + 'px;height:' + b.height + 'px';
        original.style.visibility = 'hidden';
        dismiss.addEventListener('click', () => {
          original.style.visibility = '';
          original.click();
          ctx.dismiss();
        });
        return { el, dismiss };
      }
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
    name: 'design-click-control-dialog-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'banner', p: 1, at: 0 },
    design: {
      THEMES: { 'design-click-control-dialog-12': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1a5fc4'],
      LOW_ACCENTS: ['#1a5fc4'],
      parts,
    },
  });
})();
