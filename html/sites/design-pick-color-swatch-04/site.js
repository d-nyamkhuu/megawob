(function () {
  'use strict';
  const ICONS = {
    Pick: '<svg viewBox="0 0 40 40"><path d="M4 35l2-8 16-16 7 7-16 16z" fill="none" stroke="#111" stroke-width="3" stroke-linejoin="round"/><path d="M17 9l14 14M24 12l7-7a5 5 0 0 1 7 7l-7 7z" fill="#111" stroke="#111" stroke-width="3" stroke-linecap="round"/></svg>',
    Adjust: '<svg viewBox="0 0 40 40"><path d="M4 9h32M4 21h32M4 32h32" stroke="#111" stroke-width="3" stroke-linecap="round"/><circle cx="17" cy="9" r="4.5" fill="#111"/><circle cx="27" cy="21" r="4.5" fill="#111"/><circle cx="16" cy="32" r="4.5" fill="#111"/></svg>',
    View: '<svg viewBox="0 0 40 40"><rect x="6" y="6" width="28" height="28" fill="none" stroke="#111" stroke-width="3"/><path d="M6 15h28M6 25h28M15 6v28M25 6v28" stroke="#111" stroke-width="2.5"/></svg>',
    Reset: '<svg viewBox="0 0 40 40"><path d="M7 15a15 15 0 1 1 1 13" fill="none" stroke="#111" stroke-width="3.5" stroke-linecap="round"/><path d="M3 12l4 4 5-4" fill="none" stroke="#111" stroke-width="3" stroke-linejoin="round"/></svg>',
  };
  const palette = { bg: '#f5f4ee', panel: '#f5f4ee', fg: '#111111', muted: '#111111', line: '#111111' };
  function styleInstruction(_c, selector) {
    const text = _c.header.querySelector(selector);
    if (text) {
      text.classList.add('instruction');
      text.style.fontSize = Math.min(2.85, 154 / Math.max(1, _c.ctx.instruction.length)) + 'cqw';
    }
  }
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
      document.body.className = 'design laboratory';
      const shell = u.el('div', 'shell', document.body);
      const ribbon = u.el('header', 'ribbon', shell);
      const brand = u.el('div', 'brand', ribbon);
      u.el('div', 'brand-name', brand, 'COLOR MATCH');
      u.el('div', 'brand-sub', brand, 'PICK · ADJUST · MATCH');
      u.el('div', 'rule', ribbon);
      for (const label of ['Pick', 'Adjust', 'View', 'Reset']) {
        const b = u.el('button', 'tool' + (label === 'Pick' ? ' on' : ''), ribbon);
        b.type = 'button';
        u.el('span', 'tool-ic', b).innerHTML = ICONS[label];
        u.el('span', 'tool-name', b, label);
        b.onclick = () => env.log('menu', { label });
      }
      u.el('div', 'rule', ribbon);
      const mode = u.el('div', 'mode', ribbon);
      u.el('div', 'mode-title', mode, 'Mode');
      const mb = u.el('div', 'mode-btns', mode);
      for (const label of ['RGB', 'HSL', 'HEX']) {
        const b = u.el('button', 'mode-btn' + (label === 'RGB' ? ' on' : ''), mb, label);
        b.type = 'button';
        b.onclick = () => env.log('mode', { label });
      }
      const note = u.el('section', 'task-note', shell);
      if (_c.display === 'panel') note.classList.add('instruction-panel');
      if (_c.display === 'toast') note.classList.add('instruction-toast');
      if (_c.display === 'hidden') {
        note.hidden = true;
        shell.classList.add('instruction-hidden');
      }
      const action = u.el('div', 'action-section');
      Object.assign(_c, { shell, header: note, action });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      styleInstruction(_c, '.ref-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.action;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.shell; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      styleInstruction(_c, '.ref-panel-text');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.shell);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.header.appendChild(note);
        styleInstruction(_c, '.ref-note-text');
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const footer = u.el('footer', 'footer', _c.shell);
      const hint = u.el('div', 'hint', footer);
      u.el('span', 'hint-ic', hint).innerHTML = '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="13" fill="none" stroke="#111" stroke-width="2"/><circle cx="20" cy="20" r="6" fill="none" stroke="#111" stroke-width="2"/><path d="M20 1v13M20 26v13M1 20h13M26 20h13" stroke="#111" stroke-width="2.5" stroke-linecap="round"/></svg>';
      u.el('span', 'hint-text', hint, 'Instrument ready. Generic RGB profile.');
      u.el('div', 'rule', footer);
      const difference = u.el('section', 'difference-section', footer);
      u.el('div', 'diff-label', difference, 'ΔE00 (preview)');
      u.el('div', 'difference-value', difference, '—').dataset.role = 'color-difference';
      footer.appendChild(_c.action);
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.action.appendChild(foot);
      const extras = u.el('div', 'footer-extras', hint);
      for (const b of footer.querySelectorAll('.ref-xtra')) extras.appendChild(b);
      Object.assign(_c, { footer, extras });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        const ribbon = _c.shell.querySelector('.ribbon');
        ribbon.classList.add('has-floating-control');
        ribbon.appendChild(dock);
      }
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
    name: 'design-pick-color-swatch-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-pick-color-swatch-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#ffe040'],
      LOW_ACCENTS: ['#ffe040'],
      parts,
    },
  });
})();
