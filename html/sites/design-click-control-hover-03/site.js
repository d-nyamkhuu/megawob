(function () {
  'use strict';
  const palette = { bg: '#f7f2e4', panel: '#fbf8ee', fg: '#1b130c', muted: '#3a2c1e', line: '#b9ad94' };
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
      document.body.classList.add('ref', 'wood');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head);
      u.el('span', 'app-icon', title);
      u.el('span', 'title-text', title, 'Focus Test');
      const controls = u.el('span', 'window-controls', title);
      controls.innerHTML =
        '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      const menu = u.el('div', 'native-menu', head);
      ['File', 'Edit', 'View', 'Tools', 'Help'].forEach((label) => u.el('span', '', menu, label));
      const center = u.el('section', 'center');
      Object.assign(_c, { shell, menu, center, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const body = _c.util.el('div', 'work', _c.shell);
      body.appendChild(_c.center);
      _c.body = body;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.center;
      base(_c);
      _c.body = body;
      const note = _c.center.querySelector('.ref-panel');
      if (note) {
        note.classList.add('instruction', 'instruction-panel');
        note.dataset.display = _c.display;
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = _c.display;
        _c.center.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const foot = u.el('footer', 'footer', _c.shell);
      ['tl', 'tr', 'bl', 'br'].forEach((c) => u.el('i', 'screw ' + c, foot));
      const dock = u.el('div', 'dock-sections', foot);
      const s1 = u.el('section', 'dock-section motion', dock);
      u.el('strong', '', s1, 'Motion Area');
      const m = u.el('div', 'motion-body', s1);
      u.el('span', 'motion-icon', m);
      u.el('p', '', m, 'The square will move around inside this area.');
      const s2 = u.el('section', 'dock-section progress', dock);
      u.el('strong', '', s2, 'Progress');
      const bar = u.el('div', 'pbar', s2);
      u.el('i', '', bar);
      u.el('div', 'ptxt', s2, 'Elapsed time shown in the area');
      const s3 = u.el('section', 'dock-section opts', dock);
      u.el('strong', '', s3, 'Controls');
      [['Sound cues', true], ['Show area boundary', false]].forEach(([t, on]) => {
        const l = u.el('label', 'opt', s3);
        const i = u.el('input', '', l);
        i.type = 'checkbox';
        i.checked = on;
        u.el('span', '', l, t);
        if (t === 'Show area boundary')
          i.addEventListener('change', () => _c.stage.classList.toggle('boundary-emphasis', i.checked));
      });
      const hasEnd = ['footer', 'link', 'floating'].includes(_c.placement);
      const end = hasEnd ? u.el('section', 'dock-section end', dock) : null;
      if (!hasEnd) dock.classList.add('without-end');
      base(_c);
      const templateFoot = document.body.querySelector('.ref-foot');
      templateFoot.querySelector('.ref-foot-text').remove();
      const tools = templateFoot.querySelector('.ref-tools');
      for (const button of [...tools.querySelectorAll('.ref-xtra')]) _c.headerTools.appendChild(button);
      (end || foot).appendChild(templateFoot);
      Object.assign(_c, { foot, end });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.end.appendChild(dock);
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
    name: 'design-click-control-hover-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/ui-d493bb.css', 'templates/site/css/base-hooks.css', 'wood.css', 'site.css'],
    design: {
      THEMES: { 'design-click-control-hover-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2a7bf6'],
      LOW_ACCENTS: ['#2a7bf6'],
      parts,
    },
  });
})();
