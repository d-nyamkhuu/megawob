/* Soundscape desktop audio profile editor frame. */
(function () {
  'use strict';
  function icon(u, parent, path) {
    const s = u.svg(
      'svg',
      {
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': 1.8,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'aria-hidden': 'true',
      },
      parent,
    );
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
  env.site({
    name: 'design-set-slider-match-03',
    styles: ['site.css', 'soundscape.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        r = ctx.rng.fork('chrome/end');
      const placement = ctx.finish ? null : r.pick(['header', 'header', 'footer', 'icon']);
      const labels = ctx.content && ctx.content.END_LABELS;
      const raw = r.pick(
        Array.isArray(labels) && labels.length
          ? labels
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'],
      );
      const label = typeof raw === 'string' ? raw : raw.label || raw.text || raw.name || String(raw);
      const cr = ctx.rng.fork('chrome/collide');
      const pool = (
        Array.isArray(labels) && labels.length
          ? labels
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
      )
        .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
        .filter((x) => x.toLowerCase() !== label.toLowerCase());
      const collision = cr.bool(0.3) && pool.length ? cr.pick(pool) : null;
      const small = (window.innerWidth || 1280) <= 1100;
      const display =
        (ctx.display === 'panel' && small) || (ctx.display === 'toast' && (small || (window.innerHeight || 900) <= 740))
          ? 'header'
          : ctx.display;
      document.body.className = 'soundscape instruction-' + display;
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
      if (!ctx.finish && placement === 'header') {
        const b = u.el('button', 'done-button', bar, label);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.onclick = () => ctx.submit();
      }
      if (collision) {
        const b = u.el('button', 'xtra-button', bar, collision);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.onclick = () => env.log('decoy', { label: collision, collide: true });
      }
      const rail = u.el('aside', 'left-rail', document.body);
      const nav = [
        ['Home', '⌂'],
        ['Profiles', '☷'],
        ['Library', '♫'],
        ['Devices', '♧'],
      ];
      nav.forEach(([name, glyph], i) => {
        const a = u.el('div', 'rail-item' + (i === 1 ? ' selected' : ''), rail);
        u.el('span', 'rail-icon', a, glyph);
        u.el('span', '', a, name);
      });
      u.el('div', 'rail-rule', rail);
      for (const [name, glyph] of [
        ['Effects', '☷'],
        ['Preferences', '⚙'],
      ]) {
        const a = u.el('div', 'rail-item', rail);
        u.el('span', 'rail-icon', a, glyph);
        u.el('span', '', a, name);
      }
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
      const stage = u.el('main', 'mixer-stage', app);
      stage.dataset.role = 'stage';
      const inspector = u.el('aside', 'inspector', app);
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
      const device = field('Output Device', 'Surface Headphones');
      device.classList.add('select-control');
      device.after;
      const mode = field('Audio Mode', 'Stereo');
      mode.classList.add('select-control');
      const range = u.el('div', 'range-field', inspector);
      u.el('span', 'field-label', range, 'Equalizer Range');
      u.el('div', 'range-value', range, '-12 dB to +12 dB');
      if (display === 'panel') {
        const note = u.el('div', 'instruction-panel', inspector);
        u.el('strong', '', note, 'Task');
        u.el('p', '', note, ctx.instruction);
      }
      if (display === 'header') {
        const note = u.el('div', 'instruction-header', summary, ctx.instruction);
      }
      if (display === 'toast') {
        const note = u.el('div', 'instruction-toast', inspector, ctx.instruction);
        const x = u.el('button', 'toast-x', note, '×');
        x.type = 'button';
        x.onclick = () => note.remove();
      }
      const actions = u.el('div', 'stage-actions', app);
      if (!ctx.finish && placement === 'footer') {
        const b = u.el('button', 'footer-done', actions, label);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.onclick = () => ctx.submit();
      }
      if (!ctx.finish && placement === 'icon') {
        const b = u.el('button', 'icon-done', bar, '✓');
        b.type = 'button';
        b.dataset.role = 'submit';
        b.title = 'All set';
        b.setAttribute('aria-label', label);
        b.onclick = () => ctx.submit();
      }
      return { stage, submit: document.querySelector('[data-role="submit"]') || null };
    },
    overlay: drawOverlay,
  });
})();
