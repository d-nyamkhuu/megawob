(function () {
  'use strict';
  const palette = { bg: '#dcd8d1', panel: '#dcd8d1', fg: '#1a1a1a', muted: '#5a1214', line: '#7a2024' };
  const styleNote = (_c, selector) => {
    const text = _c.left.querySelector(selector);
    if (text) {
      text.classList.add('instruction');
      if (_c.ctx.instruction.length > 55) text.classList.add('long-instruction');
    }
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // All note modes have a dedicated place in the original left pane.
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
      document.body.classList.add('design', 'colormatch');
      const shell = u.el('div', 'shell', document.body);
      const title = u.el('header', 'title-bar', shell);
      u.el('div', 'app-icon', title, '▣');
      const t = u.el('div', 'title', title);
      t.innerHTML = 'ColorMatch 1.2.0 &nbsp;- &nbsp;Display Calibration Utility';
      const controls = u.el('div', 'window-controls', title);
      for (const [label, name] of [['_', 'Minimize'], ['□', 'Maximize'], ['×', 'Close']]) {
        const b = u.el('button', 'window-button', controls, label);
        b.type = 'button';
        b.setAttribute('aria-label', name);
        b.onclick = () => env.log('window-control', { name });
      }
      const menu = u.el('nav', 'menu-bar', shell);
      for (const label of ['File', 'Edit', 'Tools', 'Help']) {
        const b = u.el('button', 'menu-item', menu);
        b.type = 'button';
        b.onclick = () => env.log('menu', { label });
        u.el('u', '', b, label[0]);
        b.append(label.slice(1));
      }
      const body = u.el('div', 'body', shell);
      const left = u.el('div', 'left-col', body);
      const header = u.el('section', _c.display === 'header' ? 'task-note display-header' : 'note-host', left);
      const right = u.el('aside', 'right-col', body);
      u.el('div', 'rp-head', right, 'Preview');
      const prev = u.el('div', 'prev-row', right);
      for (const k of ['target', 'current']) {
        const blk = u.el('div', 'prev-blk', prev);
        const lab = u.el('div', 'prev-label', blk, k === 'target' ? 'Target' : 'Current');
        lab.dataset.role = 'prev-' + k + '-label';
        u.el('div', 'prev-swatch', blk).dataset.role = 'prev-' + k;
      }
      const diff = u.el('section', 'diff-box', right);
      u.el('div', 'diff-title', diff, 'Color Difference (display only)');
      const dv = u.el('div', 'diff-value', diff);
      u.el('span', 'diff-key', dv, 'ΔE00');
      u.el('span', 'diff-num', dv, '—').dataset.role = 'color-difference';
      u.el('div', 'rp-head ctl-head', right, 'Controls');
      const rows = u.el('div', 'ctl-rows', right);
      const r1 = u.el('div', 'ctl-row one', rows);
      const r2 = u.el('div', 'ctl-row two', rows);
      for (const [p, label] of [[r1, 'Reset'], [r2, 'Randomize Current'], [r2, 'Copy Current Hex']]) {
        const b = u.el('button', 'push', p, label);
        b.type = 'button';
        b.dataset.action = label;
      }
      Object.assign(_c, { shell, menu, body, left, right, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      styleNote(_c, '.ref-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.right;
      base(_c);
      _c.header = header;
      // Auxiliary actions share the menu strip; the main control keeps its original spot.
      for (const b of _c.headerTools.querySelectorAll('.ref-xtra')) _c.menu.appendChild(b);
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const panel = _c.header.querySelector('.ref-panel');
      if (panel) panel.classList.add('task-note', 'display-panel');
      styleNote(_c, '.ref-panel-text');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.left);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.header.appendChild(note);
        note.classList.add('task-note', 'display-toast');
        styleNote(_c, '.ref-note-text');
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('status-bar');
      _c.shell.appendChild(foot);
      const ready = foot.querySelector('.ref-foot-text');
      ready.classList.add('st-ready');
      ready.textContent = 'Ready';
      const info = _c.util.el('span', 'st-info', foot, 'sRGB  |  Display: Generic LCD  |  1920 × 1080');
      foot.insertBefore(info, foot.querySelector('.ref-tools'));
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
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
        { cookie: 'Preferences', toast: 'Notice', chat: 'Support', promo: 'Reminder', banner: 'Workstation notice' }[
          kind
        ],
      );
      u.el(
        'p',
        '',
        box,
        {
          cookie: 'Optional settings may be stored on this workstation.',
          toast: 'The calibration utility is ready.',
          chat: 'Adjust the hue and saturation/value controls to match the target.',
          promo: 'Review the display profile before calibration.',
          banner: 'The display is using the Generic LCD profile.',
        }[kind],
      );
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Use default settings' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  };
  env.site({
    name: 'design-pick-color-swatch-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-pick-color-swatch-07': palette },
      LOW_THEME: palette,
      ACCENTS: ['#6e1418'],
      LOW_ACCENTS: ['#6e1418'],
      parts,
    },
  });
})();
