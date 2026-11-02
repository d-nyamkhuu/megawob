/* Soundscape desktop audio profile editor design. */
(function () {
  'use strict';
  function icon(u, parent, path) {
    const s = u.svg('svg', {
      viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
      'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
      'aria-hidden': 'true',
    }, parent);
    u.svg('path', { d: path }, s);
    return s;
  }
  function drawOverlay(ctx) {
    const u = ctx.util,
      el = u.el('aside', 'sound-overlay overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const x = u.el('button', 'overlay-x', el, '×');
    x.type = 'button';
    x.setAttribute('aria-label', 'Close notice');
    x.onclick = () => ctx.dismiss('close');
    const title =
      {
        cookie: 'Privacy settings',
        toast: 'Soundscape',
        chat: 'Soundscape support',
        promo: 'Discover Soundscape',
        banner: 'Soundscape update',
      }[ctx.kind] || 'Soundscape';
    u.el('h2', '', el, title);
    const copy =
      {
        cookie: 'Choose how Soundscape stores your preferences.',
        toast: 'Your profile is up to date.',
        chat: 'How can we help with your audio settings?',
        promo: 'Get more from your listening experience.',
        banner: 'A new audio library update is available.',
      }[ctx.kind] || 'Your profile is up to date.';
    u.el('p', '', el, copy);
    const b = u.el('button', 'overlay-dismiss', el, ctx.kind === 'chat' ? 'Close' : 'Dismiss');
    b.type = 'button';
    b.onclick = () => ctx.dismiss('dismiss');
    return { el, dismiss: b, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('soundscape', 'instruction-' + _c.display);
      const bar = u.el('header', 'window-bar', document.body);
      const brand = u.el('div', 'window-brand', bar);
      u.el('span', 'brand-mark', brand, '♫');
      u.el('strong', '', brand, 'Soundscape');
      const menus = u.el('nav', 'app-menus', bar);
      for (const m of ['File', 'Edit', 'View', 'Playback', 'Profile', 'Help']) u.el('span', '', menus, m);
      const win = u.el('div', 'window-controls', bar);
      u.el('span', '', win, '—');
      u.el('span', '', win, '□');
      u.el('span', 'close-window', win, '×');
      const app = u.el('div', 'sound-main', document.body);
      const profile = u.el('section', 'profile-card', app);
      u.el('div', 'profile-cover', profile);
      const summary = u.el('div', 'profile-summary', profile);
      u.el('h1', '', summary, 'Everyday');
      u.el('p', 'profile-description', summary, 'Balanced sound for work, home and everywhere in between.');
      const meta = u.el('div', 'profile-meta', summary);
      for (const [title, value, extra] of [
        ['Output Device', 'Surface Headphones', 'headphones'],
        ['Audio Mode', 'Stereo', ''],
        ['Last Modified', 'Apr 12, 2026, 9:14 AM', ''],
      ]) {
        const cell = u.el('div', 'meta-cell', meta);
        u.el('span', 'meta-label', cell, title);
        const line = u.el('div', 'meta-value', cell);
        if (extra) icon(u, line, 'M3 13v-2a9 9 0 0 1 18 0v2M3 13h3v7H5a2 2 0 0 1-2-2zm18 0h-3v7h1a2 2 0 0 0 2-2z');
        u.el('span', '', line, value);
      }
      Object.assign(_c, { bar, app, summary, header: bar });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const rail = u.el('aside', 'left-rail', document.body);
      const nav = [['Home', '⌂'], ['Profiles', '☷'], ['Library', '♫'], ['Devices', '♧']];
      nav.forEach(([name, glyph], i) => {
        const a = u.el('div', 'rail-item' + (i === 1 ? ' selected' : ''), rail);
        u.el('span', 'rail-icon', a, glyph);
        u.el('span', '', a, name);
      });
      u.el('div', 'rail-rule', rail);
      for (const [name, glyph] of [['Effects', '☷'], ['Preferences', '⚙']]) {
        const a = u.el('div', 'rail-item', rail);
        u.el('span', 'rail-icon', a, glyph);
        u.el('span', '', a, name);
      }
    },
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.summary;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const inspector = u.el('aside', 'inspector', _c.app);
      const ih = u.el('div', 'inspector-head', inspector);
      u.el('h2', '', ih, 'Profile Details');
      u.el('span', 'inspector-more', ih, '•••');
      const field = (label, value, multi) => {
        const f = u.el('label', 'inspector-field', inspector);
        u.el('span', 'field-label', f, label);
        const input = u.el(multi ? 'div' : 'input', 'field-control', f);
        if (multi) u.el('span', '', input, value);
        else {
          input.value = value;
          input.setAttribute('aria-label', label);
        }
        return input;
      };
      field('Name', 'Everyday');
      field('Description', 'Balanced sound for work, home and everywhere in between.', true);
      u.el('div', 'inspector-divider', inspector);
      field('Output Device', 'Surface Headphones').classList.add('select-control');
      field('Audio Mode', 'Stereo').classList.add('select-control');
      const range = u.el('div', 'range-field', inspector);
      u.el('span', 'field-label', range, 'Equalizer Range');
      u.el('div', 'range-value', range, '-12 dB to +12 dB');
      const actions = u.el('div', 'stage-actions', _c.app);
      Object.assign(_c, { body: _c.app, inspector, actions });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.inspector;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'mixer-stage', _c.app);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (note) _c.inspector.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.querySelector('.ref-foot');
      if (foot) _c.actions.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) _c.actions.appendChild(dock);
    },
    overlay: () => drawOverlay,
  };
  const palette = { bg: '#211e34', panel: '#29263f', fg: '#e7e8f7', muted: '#b9bbd8', line: '#4a4567' };
  env.site({
    name: 'design-set-slider-match-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'soundscape.css', 'site.css'],
    design: {
      THEMES: { soundscape: palette },
      LOW_THEME: palette,
      ACCENTS: ['#ff6c75'],
      LOW_ACCENTS: ['#ff6c75'],
      parts,
    },
  });
})();
