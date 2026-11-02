(function () {
  'use strict';
  const palette = { bg: '#2a2150', panel: '#eef1f5', fg: '#1d1d1f', muted: '#444444', line: '#c6cbd2' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The dedicated sidebar fits the note even at the smallest viewport.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'design metro';
      const shell = u.el('div', 'shell', document.body);
      const brief = u.el('aside', 'brief', shell);
      u.el('h1', 'brief-title', brief, 'Color Matching Task');
      const note = u.el('section', 'task-note', brief);
      note.hidden = _c.display === 'hidden';
      note.classList.toggle('instruction-panel', _c.display === 'panel');
      note.classList.toggle('instruction-toast', _c.display === 'toast');
      u.el('p', 'brief-copy', brief,
        'Use the controls on the right to adjust the color. Color values update as you work.');
      u.el('p', 'brief-copy brief-after', brief,
        'The workspace provides hue, saturation and value controls. No typing is required.');
      const win = u.el('div', 'win', shell);
      const title = u.el('header', 'title-bar', win);
      const icon = u.el('div', 'app-icon', title);
      for (let i = 0; i < 4; i++) u.el('i', '', icon);
      u.el('div', 'title', title, 'Color Studio');
      const controls = u.el('div', 'window-controls', title);
      for (const [label, name] of [['−', 'Minimize'], ['□', 'Maximize'], ['×', 'Close']]) {
        const b = u.el('button', 'window-button' + (name === 'Close' ? ' close' : ''), controls, label);
        b.type = 'button';
        b.setAttribute('aria-label', name);
        b.onclick = () => env.log('decoy', { label: name, what: 'window-control' });
      }
      const tabs = u.el('nav', 'tabs', win);
      const tabTask = u.el('button', 'tab', tabs, 'Task');
      const tabPrefs = u.el('button', 'tab on', tabs, 'Preferences');
      tabTask.type = tabPrefs.type = 'button';
      u.el('div', 'tabs-fill', tabs).hidden = true;
      Object.assign(_c, { shell, win, tabs, tabTask, tabPrefs, header: note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const text = _c.header.querySelector('.ref-instruction');
      if (text) text.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.tabs;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('tab-tools');
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'win-body', _c.win);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const text = _c.header.querySelector('.ref-panel-text');
      if (text) text.classList.add('instruction');
    },
    'frame.stage': () => (_c) => {
      const u = _c.util, body = _c.body;
      const stage = u.el('main', 'stage', body);
      stage.dataset.role = 'stage';
      _c.stage = stage;
      const prefs = u.el('section', 'prefs', body);
      u.el('h2', '', prefs, 'Preferences');
      u.el('p', 'prefs-sub', prefs, 'Customize the color picker and display settings.');
      const pc = u.el('div', 'prefs-cols', prefs);
      const c1 = u.el('div', '', pc);
      u.el('h3', '', c1, 'Color picker style');
      ['Hue / Saturation', 'Hue / Value', 'RGB Sliders'].forEach((t, i) => {
        const r = u.el('div', 'radio' + (i ? '' : ' on'), c1);
        u.el('span', 'dot', r);
        u.el('span', '', r, t);
      });
      u.el('h3', 'mt', c1, 'UI theme');
      u.el('div', 'fake-select', c1, 'Light');
      const ck = u.el('div', 'check', c1);
      u.el('span', 'box', ck, '✓');
      u.el('span', '', ck, 'Show color values (read-only)');
      const c2 = u.el('div', '', pc);
      u.el('h3', '', c2, 'Current color');
      const cur = u.el('div', 'cur', c2);
      u.el('div', 'cur-sw', cur);
      const cv = u.el('div', 'cur-vals', cur);
      [['Hex', '#3A7BD5'], ['RGB', '58, 123, 213'], ['HSL', '217°, 68%, 53%']].forEach(([a, b]) => {
        const r = u.el('div', '', cv);
        u.el('span', '', r, a);
        u.el('span', '', r, b);
      });
      u.el('h3', 'mt2', c2, 'Hue / Saturation');
      const hs = u.el('div', 'hs', c2);
      u.el('div', 'hs-plane', hs).append(u.el('i', 'hs-ring'));
      u.el('div', 'hs-strip', hs).append(u.el('i', 'hs-thumb'));
      _c.tabTask.onclick = () => {
        prefs.hidden = true;
        _c.tabTask.classList.add('on');
        _c.tabPrefs.classList.remove('on');
        env.log('tab', { name: 'Task' });
      };
      _c.tabPrefs.onclick = () => {
        prefs.hidden = false;
        _c.tabPrefs.classList.add('on');
        _c.tabTask.classList.remove('on');
        env.log('tab', { name: 'Preferences' });
      };
      const footer = u.el('footer', 'footer', body);
      const difference = u.el('section', 'difference-section', footer);
      u.el('div', 'difference-value', difference, '—').dataset.role = 'color-difference';
      _c.footer = footer;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.querySelector('.ref-note-text').classList.add('instruction');
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.footer.appendChild(foot);
      _c.footer.classList.toggle('footer-link', _c.placement === 'link');
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      u.el(
        'h3',
        '',
        box,
        {
          cookie: 'Console preferences',
          toast: 'Instrument notice',
          chat: 'Laboratory support',
          promo: 'Calibration reminder',
          banner: 'Workstation notice',
        }[kind],
      );
      u.el(
        'p',
        '',
        box,
        {
          cookie: 'Optional settings may be stored on this workstation.',
          toast: 'The calibration console is ready.',
          chat: 'Adjust the hue and saturation/value controls to match the target.',
          promo: 'Review the instrument profile before calibration.',
          banner: 'The instrument is operating with the Generic RGB profile.',
        }[kind],
      );
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Use default settings' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  };
  env.site({
    name: 'design-pick-color-hex-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-pick-color-hex-12': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2f6fd6'],
      LOW_ACCENTS: ['#2f6fd6'],
      parts,
    },
  });
})();
