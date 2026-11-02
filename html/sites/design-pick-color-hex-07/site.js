(function () {
  'use strict';
  const PRESETS = ['#d46a6a', '#e5b93c', '#55aaaa', '#4d82bd', '#a47fcb', '#8d8d8d'];
  const NAV = ['Adjust', 'Explore', 'Create'];
  const STEPS = [
    'Drag in the color area to choose a color.',
    'Use the hue slider if needed.',
    'Match the target color as closely as possible.',
  ];
  const palette = { bg: '#f8f1e6', panel: '#efe8dc', fg: '#1f3f46', muted: '#5d6f72', line: '#cfc6b6' };
  // Preserve the printed color chip inside the template's instruction text.
  function markInstruction(host) {
    if (!host) return;
    host.classList.add('instruction');
    const text = host.textContent;
    const m = text.match(/#[0-9a-fA-F]{6}|rgba?\([^)]*\)/i);
    if (!m) return;
    const at = text.indexOf(m[0]);
    host.textContent = '';
    host.append(document.createTextNode(text.slice(0, at)));
    const chip = document.createElement('span');
    chip.className = m[0][0] === '#' ? 'hex-mark' : 'hex-mark rgb-mark';
    chip.textContent = m[0];
    chip.style.background = 'color-mix(in srgb, ' + m[0] + ' 55%, #f8f1e6)';
    host.append(chip, document.createTextNode(text.slice(at + m[0].length)));
  }
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('design', 'riso');
      document.body.dataset.display = _c.display;
      document.body.dataset.endPlacement = _c.placement || 'none';
      const shell = u.el('div', 'shell', document.body);
      const doc = u.el('section', 'doc', shell);
      const margin = u.el('aside', 'margin', shell);
      const head = u.el('header', 'masthead', doc);
      const logo = u.el('div', 'logo', head);
      logo.innerHTML =
        '<svg viewBox="0 0 40 40" width="100%" height="100%"><path d="M9 31C13 24 18 19 27 10M17 22C16 11 24 8 33 6C34 17 27 24 17 22Z" fill="none" stroke="#f8f1e6" stroke-width="1.8" stroke-linecap="round"/><path d="M14 27C6 24 4 17 6 9C12 12 16 18 14 27ZM14 29C20 24 26 26 31 28C25 33 19 34 14 29Z" fill="#f8f1e6"/><path d="M20 21L24 12L29 10" fill="none" stroke="#f8f1e6" stroke-width="1.2"/></svg>';
      const brand = u.el('div', 'brand', head);
      u.el('div', 'brand-name', brand, 'Palette Studio');
      u.el('div', 'brand-tag', brand, 'Colors for a brighter tomorrow');
      const nav = u.el('nav', 'nav', head);
      NAV.forEach((label, i) => {
        if (i) u.el('span', 'nav-dot', nav, '·');
        const b = u.el('button', 'nav-item', nav, label);
        b.type = 'button';
        b.onclick = () => env.log('menu', { label });
      });
      const toolbar = u.el('div', 'header-tools', head);
      u.el('h1', 'doc-title', doc, 'Color Picker');
      const note = u.el('section', 'task-note', margin);
      Object.assign(_c, { shell, doc, margin, toolbar, header: note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      markInstruction(_c.header.querySelector('.ref-instruction'));
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.doc;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      if (_c.display === 'panel') _c.header.classList.add('instruction-panel');
      markInstruction(_c.header.querySelector('.ref-panel-text'));
      const u = _c.util;
      const how = u.el('section', 'how', _c.margin);
      u.el('h2', 'margin-h', how, 'How to complete');
      const ol = u.el('ol', 'steps', how);
      for (const s of STEPS) u.el('li', '', ol, s);
      u.el('hr', 'margin-rule', _c.margin);
      const target = u.el('section', 'margin-target', _c.margin);
      target.dataset.role = 'target-slot';
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.doc);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.header.classList.add('instruction-toast');
        _c.header.appendChild(note);
        markInstruction(note.querySelector('.ref-note-text'));
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const foot = u.el('footer', 'doc-foot', _c.doc);
      const pres = u.el('div', 'presets', foot);
      u.el('div', 'sec-label', pres, 'Quick Presets');
      const row = u.el('div', 'preset-row', pres);
      for (const c of PRESETS) {
        const preset = u.el('button', 'preset', row);
        preset.type = 'button';
        preset.dataset.color = c;
        preset.setAttribute('aria-label', 'Choose ' + c);
        preset.style.background = c;
      }
      const actions = u.el('div', 'actions', foot);
      const reset = u.el('button', 'reset', actions, 'Reset');
      reset.type = 'button';
      reset.dataset.role = 'reset';
      base(_c);
      actions.appendChild(document.body.querySelector('.ref-foot'));
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        const row = _c.util.el('div', 'margin-actions', _c.margin.querySelector('.how'));
        row.appendChild(dock);
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
          cookie: 'Studio preferences',
          toast: 'Studio notice',
          chat: 'Studio help',
          promo: 'Palette reminder',
          banner: 'Studio notice',
        }[kind],
      );
      u.el(
        'p',
        '',
        box,
        {
          cookie: 'Optional settings may be stored in this browser.',
          toast: 'The color picker is ready.',
          chat: 'Drag in the color area and the hue slider to match the target.',
          promo: 'Try the quick presets for inspiration.',
          banner: 'Palette Studio is running in standard mode.',
        }[kind],
      );
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Use default settings' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  };
  env.site({
    name: 'design-pick-color-hex-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-pick-color-hex-07': palette },
      LOW_THEME: palette,
      ACCENTS: ['#6b1428'],
      LOW_ACCENTS: ['#6b1428'],
      parts,
    },
  });
})();
