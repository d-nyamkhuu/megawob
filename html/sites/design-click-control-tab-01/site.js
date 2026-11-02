(function () {
  'use strict';
  const steps = [
    'Review feedback from the discovery phase',
    'Align on priorities with the team',
    'Prepare a first round of designs',
    'Schedule a follow-up check-in',
  ];
  const related = ['Product roadmap', 'Design principles', 'User research summary', 'Release plan'];
  const palette = { bg: '#fbfbf9', panel: '#fafaf7', fg: '#18202c', muted: '#59616a', line: '#c9c3b9' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'collage');
      const shell = u.el('main', 'shell', document.body);
      const defs = u.el('div', 'paper-defs', shell);
      defs.innerHTML =
        '<svg width="0" height="0" aria-hidden="true"><defs><filter id="paper-edge" x="-5%" y="-10%" width="110%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".075" numOctaves="3" seed="12" result="grain"/><feDisplacementMap in="SourceGraphic" in2="grain" scale="8" xChannelSelector="R" yChannelSelector="G"/></filter></defs></svg>';
      const header = u.el('header', 'top', shell);
      u.el('div', 'hint', header, 'Explore the notes below. The link is in one of the tabs.');
      const foot = u.el('footer', 'footer');
      const ic = u.el('span', 'dock-icon', foot);
      ic.innerHTML =
        '<svg viewBox="0 0 24 24"><path d="M5 7h14M5 12h14M5 17h14" stroke="#1f2126" stroke-width="2.6" stroke-linecap="round"/></svg>';
      const tk = u.el('div', 'dock-task', foot);
      u.el('strong', '', tk, 'Task');
      const help = u.el('span', 'help', foot);
      help.innerHTML = '<i>?</i><u>Help</u>';
      Object.assign(_c, { shell, header, foot });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.dataset.display = _c.display;
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.foot;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'work', _c.shell);
      const center = u.el('section', 'center', body);
      const aside = u.el('aside', 'inspector', body);
      Object.assign(_c, { body, center, aside });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      const u = _c.util;
      const aside = _c.aside;
      const panel = aside.querySelector('.ref-panel');
      if (panel) panel.querySelector('.ref-panel-title').textContent = 'Task';
      u.el('span', 'tape', aside);
      u.el('h2', '', aside, 'Next Steps');
      const ol = u.el('ol', 'steps', aside);
      steps.forEach((s, i) => {
        const li = u.el('li', '', ol);
        u.el('b', '', li, String(i + 1));
        u.el('span', '', li, s);
      });
      u.el('hr', '', aside);
      u.el('h2', '', aside, 'Related Links');
      const ul = u.el('ul', 'related', aside);
      related.forEach((s) => {
        const li = u.el('li', '', ul);
        u.el('span', '', li, s);
      });
      const star = u.el('span', 'star', aside);
      star.innerHTML =
        '<svg viewBox="0 0 60 64"><path d="M34 5l2 19 19 7-19 8 1 19-14-15-17 4 9-18L7 18l20 4Z" fill="#ffda70" stroke="#fff" stroke-width="10" stroke-linejoin="round"/><path d="M34 5l2 19 19 7-19 8 1 19-14-15-17 4 9-18L7 18l20 4Z" fill="none" stroke="#ffab18" stroke-width="4" stroke-linejoin="round"/><path d="m17 23 18 17-4-21-14 25 24-14-24-2 18 19" stroke="#ffaf22" stroke-width="3" fill="none" stroke-linejoin="round"/></svg>';
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        const title = _c.util.el('strong', 'note-title', null, 'Task');
        note.prepend(title);
        _c.body.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.foot.appendChild(foot);
      _c.shell.appendChild(_c.foot);
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
    name: 'design-click-control-tab-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-control-tab-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#ff6a13'],
      LOW_ACCENTS: ['#ff6a13'],
      parts,
    },
  });
})();
