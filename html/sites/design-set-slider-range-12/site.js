/* 1988 Macintosh bitmap: menu bar, titled picture window, bottom dock with collapsed Task controls. */
(function () {
  'use strict';
  const C = {
    menus: ['File', 'Edit', 'Image', 'Options', 'Window', 'Help'],
    title: 'Mountain View',
  };
  function landscape(parent) {
    const u = env.util;
    // Display only the reference's artwork, with all surrounding UI outside the viewBox.
    // The old note lies entirely in the white sky; cover it before drawing the live task note.
    const picture = u.svg('svg', {viewBox: '14 91 1644 589', preserveAspectRatio: 'none', class: 'scene', 'aria-hidden': 'true'}, parent);
    const defs = u.svg('defs', {}, picture);
    const filter = u.svg('filter', {id: 'bitmap-paper', x: 0, y: 0, width: '100%', height: '100%', 'color-interpolation-filters': 'sRGB'}, defs);
    u.svg('feColorMatrix', {type: 'saturate', values: 0}, filter);
    const transfer = u.svg('feComponentTransfer', {}, filter);
    for (const channel of ['R', 'G', 'B']) u.svg('feFunc' + channel, {type: 'linear', slope: 1.025, intercept: 0}, transfer);
    u.svg('image', {href: 'sites/design-set-slider-range-12/assets/mountain-source.webp', x: 0, y: 0, width: 1672, height: 941, filter: 'url(#bitmap-paper)'}, picture);
    u.svg('rect', {x: 1078, y: 108, width: 571, height: 157, fill: '#fff'}, picture);
  }
  function icon(parent, kind) {
    const u = env.util;
    const svg = u.svg('svg', {viewBox: '0 0 16 16', class: 'mic ' + kind, 'aria-hidden': 'true'}, parent);
    if (kind === 'help') {
      u.svg('rect', {x: 1.5, y: 1.5, width: 13, height: 13, fill: '#fff', stroke: '#000', 'stroke-width': 1.5}, svg);
      u.svg('path', {d: 'M5.5 6 Q5.5 3.5 8 3.5 Q10.5 3.5 10.5 5.5 Q10.5 7 8 8 V10', fill: 'none', stroke: '#000', 'stroke-width': 1.6}, svg);
      u.svg('rect', {x: 7, y: 11.5, width: 2, height: 2}, svg);
    } else {
      u.svg('path', {d: 'M2 1.5 H12 L14.5 4 V14.5 H2Z', fill: '#fff', stroke: '#000', 'stroke-width': 1.5}, svg);
      u.svg('rect', {x: 4.5, y: 2, width: 6, height: 4}, svg);
      u.svg('rect', {x: 4.5, y: 9, width: 7, height: 4, fill: '#fff', stroke: '#000'}, svg);
    }
  }
  // The design starts with the dock's task controls collapsed (stage hidden, "Show controls" button): the kit's
  // initial overlay. Pressing the button expands them and dismisses the overlay; without it (perturb=off) the
  // controls simply start expanded.
  function drawCollapsed(ctx) {
    const show = document.querySelector('.show-controls');
    const head = document.querySelector('.tc-h');
    document.body.classList.add('controls-collapsed');
    head.textContent = '\u25B6 Task controls (collapsed)';
    show.hidden = false;
    show.onclick = () => {
      document.body.classList.remove('controls-collapsed');
      head.textContent = '\u25BC Task controls';
      show.hidden = true;
      ctx.dismiss();
      env.reanchor && env.reanchor();
    };
    // Marker only: the kit removes `el` on dismissal and the dock must stay.
    const el = ctx.util.el('span', 'collapsed-marker', document.body);
    el.hidden = true;
    return {el, dismiss: show};
  }
  function drawOverlay(ctx) {
    if (ctx.initial) return drawCollapsed(ctx);
    const u = ctx.util;
    const el = u.el('aside', 'mac-dialog overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const title = {chat: 'Feedback', cookie: 'Privacy', toast: 'Note', promo: 'Support', banner: 'Notice'}[ctx.kind];
    u.el('h2', '', el, title);
    const msg = {chat: 'Please rate this window.', cookie: 'This program may remember your display preferences.', toast: 'Your picture is ready.', promo: 'Discover more pictures.', banner: 'Picture files are available offline.'}[ctx.kind];
    u.el('p', '', el, msg);
    const dismiss = u.el('button', 'mac-btn survey-close', el, 'OK');
    dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('dismiss');
    return {el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0};
  }
  const labelText = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
  env.site({name: 'design-set-slider-range-12', styles: ['site.css'], scripts: [], initialOverlay: {kind: 'collapsed'},
    frame(ctx) {
      const u = ctx.util;
      document.body.className = `mac instruction-${ctx.display}`;
      const endRng = ctx.rng.fork('chrome/end');
      const endLabels = ctx.content && ctx.content.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const commonLabel = endLabels.find((word) => labelText(word).trim().toLowerCase() === 'submit');
      const label = endRng.bool(0.5) ? labelText(commonLabel || 'Submit') : labelText(endRng.pick(endLabels));
      const placement = ctx.finish ? null : endRng.pick(['dock', 'dock', 'menu', 'link']);
      const collideRng = ctx.rng.fork('chrome/collide');
      let collision = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const options = [...new Set(endLabels.map(labelText))].filter((word) => word.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) collision = collideRng.pick(options);
      }
      const bar = u.el('header', 'menubar', document.body);
      const apple = u.el('span', 'apple', bar, '');
      apple.textContent = '';
      const ap = u.svg('svg', {viewBox: '0 0 16 18', class: 'apple-ico'}, bar);
      u.svg('path', {d: 'M8 4.5 C6 3 2 4 2 9 C2 13 5 17 7 16.5 C7.7 16.2 8.3 16.2 9 16.5 C11 17 14 13 14 10 C12 9 11.5 6 14 5 C13 3.5 10 3 8 4.5Z M8.5 3.5 C8.5 1.5 10 0.5 11 0.5 C11 2 10 3.5 8.5 3.5Z', fill: '#000'}, ap);
      for (const m of C.menus) u.el('span', 'menu', bar, m);
      u.el('span', 'clock', bar, '10:24 AM');
      icon(bar, 'help');
      icon(bar, 'disk');
      let submit = null;
      const makeEnd = (parent, cls, text) => {
        const b = u.el(cls === 'end-link' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button'; else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => { e.preventDefault(); ctx.submit(); });
        return b;
      };
      if (placement === 'menu') submit = makeEnd(bar, 'mac-btn menu-end', label);

      const win = u.el('section', 'window', document.body);
      const tb = u.el('div', 'titlebar', win);
      u.el('span', 'box', tb);
      u.el('span', 'stipple', tb);
      u.el('span', 'wtitle', tb, C.title);
      u.el('span', 'stipple', tb);
      u.el('span', 'box zoom', tb);
      const pane = u.el('div', 'pane', win);
      landscape(pane);
      const stage = u.el('main', 'record-stage', pane);
      stage.dataset.role = 'stage';
      const task = u.el('aside', 'note', pane);
      task.dataset.display = ctx.display;
      const instruction = u.el('div', 'instruction', task, ctx.instruction);
      if (ctx.display === 'hidden') task.hidden = true;
      if (ctx.display === 'toast') {
        const close = u.el('button', 'mac-btn instruction-close', task, 'Close');
        close.onclick = () => { task.hidden = true; };
      }
      u.el('p', 'sub', task, 'Adjust the range.');

      const dock = u.el('footer', 'dock', document.body);
      const prefs = u.el('div', 'dock-col prefs', dock);
      u.el('div', 'dock-h', prefs, '▼ Image Preferences');
      for (const l of ['Brightness:', 'Contrast:']) {
        const r = u.el('div', 'prow', prefs);
        u.el('span', 'plabel', r, l);
        const t = u.el('span', 'ptrack', r);
        u.el('span', 'pthumb', t);
        u.el('span', 'pval', r, '0');
      }
      const dr = u.el('div', 'prow', prefs);
      u.el('span', 'plabel', dr, 'Dithering:');
      u.el('span', 'psel', dr, 'Floyd—Steinberg');
      const g = u.el('div', 'chk', prefs);
      u.el('span', 'cb', g);
      u.el('span', '', g, 'Show grid');

      const view = u.el('div', 'dock-col view', dock);
      u.el('div', 'dock-h', view, '▼ View Options');
      const vl = u.el('div', 'vleft', view);
      [['Fit to window', 1], ['Show histogram', 0], ['Show selection outline', 0]].forEach(([l, on]) => {
        const c = u.el('div', 'chk', vl);
        u.el('span', 'cb' + (on ? ' on' : ''), c, on ? '✓' : '');
        u.el('span', '', c, l);
      });
      const z = u.el('div', 'zoom-row', view);
      u.el('span', '', z, 'Zoom:');
      u.el('span', 'psel', z, '100%');

      const tc = u.el('div', 'dock-col tasks', dock);
      u.el('div', 'dock-h tc-h', tc, '▼ Task controls');
      if (ctx.display === 'panel') tc.appendChild(task);
      const show = u.el('button', 'mac-btn show-controls', tc, 'Show controls');
      show.type = 'button';
      show.dataset.action = 'show-controls';
      show.hidden = true; // shown (and wired) by the initial overlay, see drawCollapsed
      if (collision) {
        const decoy = u.el('button', 'mac-btn pq-xtra', tc, collision);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', {label: collision, collide: true}));
      }
      if (placement === 'dock') submit = makeEnd(tc, 'mac-btn submit', label);
      if (placement === 'link') submit = makeEnd(tc, 'end-link dock-end-link', label + ' ›');
      return {stage, submit};
    },
    overlay: drawOverlay,
  });
})();
