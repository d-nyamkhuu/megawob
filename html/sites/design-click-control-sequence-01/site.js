(function () {
  'use strict';
  const palette = { bg: '#f4ead2', panel: '#f5ead4', fg: '#2f1c0b', muted: '#66503b', line: '#bca580' };
  const paths = [
    'M2 11 12 2 22 11l-2 2-2-2v11h-5v-8h-4v8H4V11l-1 2Z M16 3v4h3V3Z',
    'M3 5h18v17H3Z M7 2v6 M17 2v6 M3 10h18 M7 13h1 M12 13h1 M17 13h1 M7 17h1 M12 17h1 M17 17h1',
    'M5 3h14q2 0 2 2v14q0 2-2 2H5q-2 0-2-2V5q0-2 2-2Z M7 12l4 4 7-9',
    'M5 2h15v20H5Z M3 5H1 M3 9H1 M3 13H1 M3 17H1 M8 6h9 M8 9h9 M8 12h9 M8 15h9 M22 5v15',
    'M10 1h4l1 4 3 1 3-1 2 4-3 2v3l3 2-2 4-3-1-3 1-1 4h-4l-1-4-3-1-3 1-2-4 3-2v-3L1 9l2-4 3 1 3-1Z M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8',
  ];
  function styleControls(parent, toolbar) {
    parent.querySelectorAll('.ref-submit').forEach((el) => el.classList.add('submit', toolbar ? 'organizer-toolbar-end' : 'organizer-footer-end'));
    parent.querySelectorAll('.ref-endlink').forEach((el) => el.classList.add('submit', 'organizer-end-link'));
    parent.querySelectorAll('.ref-xtra').forEach((el) => el.classList.add('organizer-xtra'));
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The organizer already has a place for each note mode at every size.
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
      document.body.classList.add('ref', 'organizer', 'rail');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      u.el('div', 'title', head, 'My Organizer');
      const work = u.el('div', 'work', shell);
      const rail = u.el('nav', 'rail', work);
      ['Home', 'Calendar', 'Tasks', 'Notes', 'Settings'].forEach((s, i) => {
        const item = u.el('div', i === 0 ? 'active' : '', rail, s);
        item.insertAdjacentHTML('afterbegin', '<svg viewBox="0 0 24 24"><path d="' + paths[i] + '"/></svg>');
      });
      const center = u.el('section', 'center', work);
      u.el('div', 'organizer-date', shell, 'Tuesday, April 27, 2010');
      u.el('div', 'organizer-motto', shell, 'A more organized day is a brighter tomorrow.');
      Object.assign(_c, { shell, head, work, center, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.center.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.head;
      base(_c);
      _c.header = h;
      _c.headerTools.classList.add('organizer-toolbar');
      styleControls(_c.headerTools, true);
    },
    'frame.body': () => (_c) => { _c.body = _c.work; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.center;
      base(_c);
      _c.body = body;
      const panel = _c.center.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('instruction', 'instruction-panel');
        panel.dataset.display = _c.display;
      }
    },
    'frame.stage': () => (_c) => {
      const ornament = _c.util.el('img', 'organizer-twig', _c.center);
      ornament.src = 'sites/design-click-control-sequence-01/assets/twig.svg';
      ornament.alt = '';
      ornament.setAttribute('aria-hidden', 'true');
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = _c.display;
        _c.center.insertBefore(note, _c.center.firstChild);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.shell.appendChild(foot);
      const ready = foot.querySelector('.ref-foot-text');
      ready.classList.add('ready');
      ready.textContent = 'Ready.';
      styleControls(foot, false);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.foot.appendChild(dock);
        styleControls(dock, false);
      }
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
    name: 'design-click-control-sequence-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-control-sequence-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#386f9e'],
      LOW_ACCENTS: ['#386f9e'],
      parts,
    },
  });
})();
