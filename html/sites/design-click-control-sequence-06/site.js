(function () {
  'use strict';
  const INFO = [
    ['dev', [['Device', 'S-2700'], ['Serial No', '7A3F-1182'], ['Mode', 'Calibration'], ['Status', 'Ready']]],
    ['sess', [['Date', '2004-11-16'], ['Time', '14:27:08'], ['User', 'operator'], ['Profile', 'default']]],
    ['sig', [['CH1', '12.4'], ['CH2', '11.9'], ['CH3', '12.1'], ['CH4', '12.0']], 'Signal Input (mV)'],
    ['temp', [['Board', '36.8'], ['Ambient', '22.1'], ['Sensor', '35.9']], 'Temperature (°C)'],
  ];
  const palette = { bg: '#bcbab3', panel: '#c3c2bd', fg: '#10151b', muted: '#62625d', line: '#8a867d' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'calpro', 'strip');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head);
      u.el('span', 'title-icon', title);
      u.el('span', 'title-text', title, 'CalPro 1.3  -  Sensor Calibration Utility');
      const controls = u.el('span', 'window-controls', title);
      controls.innerHTML = '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      const work = u.el('div', 'work');
      Object.assign(_c, { shell, title, work, header: work });
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
      _c.header = _c.title;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const info = u.el('section', 'info', _c.shell);
      INFO.forEach(([k, rows, h]) => {
        const c = u.el('div', 'info-col info-' + k, info);
        if (h) u.el('div', 'info-h', c, h);
        rows.forEach(([a, b]) => {
          const r = u.el('div', 'info-row', c);
          u.el('span', 'il', r, a);
          u.el('span', 'ic', r, ':');
          u.el('span', 'iv', r, b);
        });
      });
      u.el('div', 'rule', _c.shell);
      _c.shell.appendChild(_c.work);
      _c.body = _c.work;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) {
        note.classList.add('instruction', 'instruction-panel');
        note.dataset.display = _c.display;
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const row = u.el('div', 'panels', _c.work);
      const p1 = u.el('section', 'panel p-read', row);
      u.el('div', 'panel-h', p1, 'Sensor Readings');
      const rb = u.el('div', 'panel-b read-b', p1);
      const rin = u.el('div', 'read-in', rb);
      [['CH1', '12.4'], ['CH2', '11.9'], ['CH3', '12.1'], ['CH4', '12.0']].forEach(([a, b]) => {
        const r = u.el('div', 'read-row', rin);
        u.el('span', '', r, a);
        u.el('span', '', r, b);
        u.el('span', '', r, 'mV');
      });
      const center = u.el('section', 'panel p-ctl center', row);
      u.el('div', 'panel-h', center, 'Controls');
      const stage = u.el('div', 'stage', center);
      const p3 = u.el('section', 'panel p-out', row);
      u.el('div', 'panel-h', p3, 'Output');
      const ob = u.el('div', 'panel-b out-b', p3);
      const oin = u.el('div', 'out-in', ob);
      ['> System ready.', '> No actions performed.', '> Awaiting input...'].forEach((t) => u.el('div', '', oin, t));
      Object.assign(_c, { stage, row });
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = _c.display;
        _c.work.insertBefore(note, _c.row);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.util.el('div', 'rule rule-b', _c.shell);
      foot.classList.add('footer');
      _c.shell.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
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
    name: 'design-click-control-sequence-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { calpro: palette },
      LOW_THEME: palette,
      ACCENTS: ['#6b1a22'],
      LOW_ACCENTS: ['#6b1a22'],
      parts,
    },
  });
})();
