/* HarborChart Pro: 2014 drafting desktop frame. Task state and rotations belong to the rotate task. */
(function () {
  'use strict';
  const PATHS = {
    close: 'M5 5L21 21M21 5L5 21', minimize: 'M5 20H21', maximize: 'M6 6H21V21H6Z',
    map: 'M3 7L10 4L18 7L25 4V21L18 24L10 21L3 24ZM10 4V21M18 7V24',
    layers: 'M14 3L25 9L14 15L3 9ZM3 14L14 20L25 14M3 19L14 25L25 19',
    pin: 'M14 25C14 25 6 16 6 11A8 8 0 0 1 22 11C22 16 14 25 14 25ZM14 8A3 3 0 1 0 14 14A3 3 0 1 0 14 8Z',
    ruler: 'M4 19L19 4L24 9L9 24ZM8 15L11 18M11 12L14 15M14 9L17 12',
    gear: 'M11 2H17L18 6L21 7L24 6L27 11L24 14L24 17L26 20L22 25L18 23L15 24L13 27L7 25L7 21L4 19L1 18L2 12L6 11L7 8L7 4ZM14 10A4 4 0 1 0 14 18A4 4 0 1 0 14 10Z',
    check: 'M5 14L11 20L23 7',
    boat: 'M12 3L11 18H3ZM15 1L24 18H14ZM2 20H26L22 24H7ZM1 26Q5 23 10 26Q14 23 19 26Q23 23 27 26',
  };
  function icon(parent, name, size = 24) {
    const svg = env.util.svg('svg', { width: size, height: size, viewBox: '0 0 28 28', 'aria-hidden': 'true' }, parent);
    env.util.svg('path', { d: PATHS[name], fill: name === 'boat' ? '#5fb4e8' : 'none',
      stroke: name === 'boat' ? 'none' : 'currentColor', 'stroke-width': 1.6, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, svg);
    return svg;
  }
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('section', 'hc-ov hc-ov-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const content = {
      chat: ['Chat with us', 'Hi! How can we help you today?', 'Send', 'Close chat'],
      cookie: ['Your privacy', 'We use cookies to improve your experience, analyze traffic, and personalize content. You can change preferences at any time.', 'Accept', 'Dismiss'],
      toast: ['Chart saved', 'Your current chart view is stored locally.', null, 'Dismiss'],
      promo: ['Explore More Charts', 'Get the latest map updates, new features, and sailing tips delivered to your inbox.', 'Subscribe', 'Not now'],
      banner: ['Chart update', 'New charts for the eastern islands are now available.', null, 'Dismiss'],
    }[ctx.kind];
    u.el('h2', '', el, content[0]);
    const close = u.el('button', 'hc-close', el);
    close.type = 'button'; close.setAttribute('aria-label', 'Close notice'); icon(close, 'close', 18);
    close.onclick = () => ctx.dismiss('close');
    const message = u.el('p', '', el, content[1]);
    const actions = u.el('div', 'hc-actions', el);
    if (ctx.kind === 'chat' || ctx.kind === 'promo') {
      const field = u.el('input', 'hc-input', actions);
      field.type = ctx.kind === 'promo' ? 'email' : 'text';
      field.placeholder = ctx.kind === 'promo' ? 'Your email address' : 'Type a message…';
      field.setAttribute('aria-label', field.placeholder);
    }
    if (ctx.kind === 'cookie') u.el('i', 'hc-cookie-icon', el, '•');
    if (ctx.kind === 'promo') {
      const preview = u.el('div', 'hc-chart-preview', el);
      const chart = document.querySelector('svg[data-role="map"]');
      if (chart) {
        const copy = chart.cloneNode(true); copy.removeAttribute('data-role'); copy.classList.add('hc-preview-svg');
        copy.querySelectorAll('.chart-pin, .bezel-decor, .rot-handle, .handle-mark, :scope > circle, :scope > path').forEach(node => node.remove());
        preview.append(copy);
      }
      u.el('small', 'hc-promo-foot', el, 'No spam. Unsubscribe anytime.');
    }
    if (ctx.kind === 'banner') el.style.top = `${document.querySelector('.menubar').getBoundingClientRect().bottom}px`;
    if (content[2]) {
      const primary = u.el('button', 'hc-primary', actions, content[2]); primary.type = 'button';
      primary.onclick = () => {
        if (ctx.kind === 'cookie') ctx.dismiss('accept');
        else { message.textContent = 'Drag the yellow handle on the ring to turn the map.'; primary.hidden = true; }
      };
    }
    const dismiss = u.el('button', 'hc-dismiss', actions, content[3]); dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('skip');
    return { el, dismiss: ['chat', 'promo', 'banner'].includes(ctx.kind) ? close : dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  const harborFrame = function (base, S) { return function frame(ctx) {
      const u = ctx.util;
      document.body.className = `harbor instruction-${ctx.display}`;
      const titlebar = u.el('header', 'titlebar', document.body);
      icon(titlebar, 'boat', 20); u.el('span', '', titlebar, 'HarborChart Pro');
      const windowActions = u.el('div', 'window-actions', titlebar);
      for (const action of ['minimize', 'maximize', 'close']) {
        const b = u.el('button', 'window-action ' + action, windowActions);
        b.type = 'button'; b.setAttribute('aria-label', action); icon(b, action, 20);
      }
      const menubar = u.el('nav', 'menubar', document.body);
      ['File', 'Edit', 'View', 'Map', 'Tools', 'Help'].forEach((m) => {
        const b = u.el('button', 'menu-item', menubar, m); b.type = 'button';
      });
      const noteHost = u.el('div', 'menu-note', menubar);
      const toolEnd = u.el('div', 'tool-end', menubar);
      titlebar.insertBefore(noteHost, windowActions);
      titlebar.insertBefore(toolEnd, windowActions);

      const body = u.el('div', 'content', document.body);
      const stage = u.el('main', 'map-stage', body);
      stage.dataset.role = 'stage';

      const legend = u.el('aside', 'legend', body);
      u.el('h2', '', legend, 'Legend');
      const placeList = u.el('div', 'legend-places', legend);
      const PIN = ['#e53935', '#2fd23f', '#3b82f6', '#f5d90a', '#fb8c00', '#a64be0', '#22d3ee', '#b0b6bd'];
      ['Harbor', 'Lighthouse', 'Marina', 'Fort', 'Cove', 'Quay'].forEach((name, i) => {
        const row = u.el('div', 'legend-row', placeList);
        const dot = u.el('i', 'legend-pin', row); dot.style.background = PIN[i % 8];
        u.el('span', '', row, name);
      });
      const keys = u.el('div', 'legend-keys', legend);
      [['key-island', 'Island (land)'], ['key-reef', 'Reef / Rock'], ['key-depth', 'Depth contour'], ['key-grid', 'Grid line']].forEach(([c, t]) => {
        const row = u.el('div', 'legend-row', keys); u.el('i', c, row); u.el('span', '', row, t);
      });
      const scale = u.el('div', 'legend-scale', legend);
      u.el('i', '', scale);
      u.el('span', '', scale, '0   5   10   20 km');

      const narrow = document.documentElement.clientWidth < 1180;
      const form = (ctx.display === 'panel' || ctx.display === 'toast') && narrow ? 'header' : ctx.display;
      if (form === 'panel') stage.classList.add('with-chart-note');
      const note = u.el('div', 'task-note note-' + form, form === 'header' ? noteHost : body, ctx.instruction);
      if (ctx.display === 'hidden') note.hidden = true;
      if (form === 'panel') note.prepend(u.el('b', '', null, 'Chart note'));

      const dock = u.el('footer', 'dock', document.body);
      [['map', 'Map'], ['layers', 'Layers'], ['pin', 'Places'], ['ruler', 'Measure'], ['gear', 'Settings']].forEach(([ic, t], i) => {
        const b = u.el('button', 'dock-tab' + (i === 0 ? ' active' : ''), dock); b.type = 'button';
        icon(b, ic, 28); u.el('span', '', b, t);
      });
      const dockEnd = u.el('div', 'dock-end', dock);

      let submit = null;
      if (!ctx.finish) {
        const endRng = ctx.rng.fork('chrome/end');
        const placements = ['top-button', 'top-button', 'dock-button', 'dock-link', 'top-icon'];
        const placement = endRng.pick(placements);
        const fallbackLabels = ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
        const labels = ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS : fallbackLabels;
        const labelValue = endRng.pick(labels);
        const endLabel = typeof labelValue === 'string' ? labelValue : (labelValue.label || labelValue.text || labelValue.name || String(labelValue));
        const host = placement.startsWith('top') ? toolEnd : dockEnd;
        if (placement === 'dock-link') {
          submit = u.el('button', 'submit-button end-text', host, endLabel); submit.type = 'button';
        } else if (placement === 'top-icon') {
          submit = u.el('button', 'submit-button top-icon', host); submit.type = 'button'; icon(submit, 'check', 20);
        } else {
          submit = u.el('button', 'submit-button ' + placement, host, endLabel); submit.type = 'button';
        }
        submit.dataset.role = 'submit'; submit.setAttribute('aria-label', endLabel); submit.title = endLabel;
        submit.onclick = (event) => { event.preventDefault(); ctx.submit(); };

        const collideRng = ctx.rng.fork('chrome/collide');
        if (collideRng.bool(0.3)) {
          const candidates = labels.map((x) => typeof x === 'string' ? x : (x.label || x.text || x.name || String(x)))
            .filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
          if (candidates.length) {
            const decoyLabel = collideRng.pick(candidates);
            const decoy = u.el('button', 'end-xtra', host, decoyLabel);
            decoy.type = 'button'; decoy.dataset.role = 'xtra';
            host.insertBefore(decoy, submit);
            decoy.addEventListener('click', () => env.log('decoy', { label: decoyLabel, collide: true }));
          }
        }
      }
      return { stage, submit };
  }; };
  env.site({
    name: 'design-rotate-object-compass-05',
    template: 'site/base',
    design: { parts: { frame: harborFrame, overlay: () => drawOverlay } },
  });
})();
