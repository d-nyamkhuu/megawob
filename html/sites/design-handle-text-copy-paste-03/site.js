(function () {
  'use strict';
  const palette = { bg: '#bcbdbd', panel: '#ffffff', fg: '#080a0c', muted: '#34383b', line: '#727778' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
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
      document.body.classList.add('ref', 'os2', 'workplace');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      u.el('div', 'tools', head, 'File     Edit     View     Insert     Format     Tools     Help');
      const title = u.el('div', 'title', head, 'Text Practice - OS/2 Workplace Shell');
      const controls = u.el('span', 'window-controls', title);
      controls.innerHTML =
        '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      const ribbon = u.el('div', 'os2-ribbon', head);
      [
        ['New', '▯'], ['Open', '▱'], ['Save', '▤'], ['Print', '▥'],
        ['Cut', '✂'], ['Copy', '▤'], ['Paste', '▣'], ['Undo', '↶'],
        ['Redo', '↷'], ['Find', '♧'], ['Replace', '▧'], ['Help', '?'],
      ].forEach((x, i) => {
        const b = u.el('div', 'os2-tool' + ([3, 8, 10].includes(i) ? ' divider' : ''), ribbon);
        u.el('span', 'os2-icon', b, x[1]);
        u.el('span', '', b, x[0]);
      });
      const work = u.el('div', 'work', shell);
      const tabs = u.el('nav', 'os2-tabs', work);
      ['Task', 'Notes', 'Reference'].forEach((x, i) => u.el('div', i === 0 ? 'active' : '', tabs, x));
      const center = u.el('section', 'center', work);
      Object.assign(_c, { shell, ribbon, work, center, header: center });
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
      const header = _c.header;
      _c.header = _c.ribbon;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.work; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.center;
      base(_c);
      _c.body = body;
      const panel = _c.center.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('instruction');
        panel.dataset.display = 'panel';
      }
    },
    'frame.stage': () => (_c) => {
      const stageFrame = _c.util.el('div', 'os2-stage-frame', _c.center);
      _c.stage = _c.util.el('div', 'stage', stageFrame);
      _c.stageFrame = stageFrame;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = 'toast';
        _c.center.insertBefore(note, _c.stageFrame);
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
      const app = _c.util.el('span', 'os2-app', foot, 'Workplace Shell');
      foot.insertBefore(app, ready);
      _c.util.el('span', 'os2-date', foot, 'Apr 24, 1994');
      _c.util.el('span', 'os2-time', foot, '10:17 AM');
      _c.util.el('span', 'os2-lang', foot, '▦　 EN');
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.insertBefore(dock, _c.foot.querySelector('.os2-date'));
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
    name: 'design-handle-text-copy-paste-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { os2: palette },
      LOW_THEME: palette,
      ACCENTS: ['#08bfc8'],
      LOW_ACCENTS: ['#08bfc8'],
      parts,
    },
  });
})();
