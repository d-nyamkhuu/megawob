/* Metro notebook reference frame. Task state and rotations belong to the rotate task. */
(function () {
  'use strict';
  function icon(parent, name, size = 24) {
    const paths = {
      windows: 'M2 4L11 3V12H2ZM13 3L23 1V12H13ZM2 14H11V23L2 22ZM13 14H23V25L13 23Z',
      close: 'M5 5L21 21M21 5L5 21',
      minimize: 'M5 20H21',
      maximize: 'M6 6H21V21H6Z',
      search: 'M17 17L24 24M20 11A9 9 0 1 1 2 11A9 9 0 1 1 20 11',
      wifi: 'M2 9Q13 -1 24 9M6 14Q13 7 20 14M10 19Q13 16 16 19M13 23H13.1',
      sound: 'M3 10H8L14 5V23L8 18H3ZM18 9Q25 14 18 19M21 5Q33 14 21 23',
      up: 'M5 17L13 9L21 17',
      map: 'M3 6L9 3L18 6L25 3V22L18 25L9 22L3 25ZM9 3V22M18 6V25',
      pin: 'M14 25S5 15 5 10A9 9 0 1 1 23 10C23 15 14 25 14 25ZM14 7A3 3 0 1 0 14 13A3 3 0 1 0 14 7',
      photo: 'M3 5H25V23H3ZM4 20L10 13L14 17L18 11L24 19M19 9H19.1',
      notes: 'M7 3H20L24 7V25H7ZM20 3V8H24M11 12H20M11 16H20M11 20H18',
      layers: 'M14 3L26 9L14 15L2 9ZM3 14L14 20L25 14M3 19L14 25L25 19',
      settings:
        'M14 3V6M14 22V25M3 14H6M22 14H25M6.2 6.2L8.3 8.3M19.7 19.7L21.8 21.8M21.8 6.2L19.7 8.3M8.3 19.7L6.2 21.8M14 8A6 6 0 1 0 14 20A6 6 0 1 0 14 8',
      help: 'M14 25A11 11 0 1 0 14 3A11 11 0 1 0 14 25ZM10.5 10A3.5 3.5 0 1 1 15 13.3C14 14 14 15 14 16M14 20H14.1',
      calendar: 'M4 6H24V24H4ZM8 3V9M20 3V9M4 11H24M9 15H10M14 15H15M19 15H20M9 19H10M14 19H15M19 19H20',
    };
    const svg = env.util.svg('svg', { width: size, height: size, viewBox: '0 0 28 28', 'aria-hidden': 'true' }, parent);
    env.util.svg(
      'path',
      {
        d: paths[name],
        fill: name === 'windows' ? 'currentColor' : 'none',
        stroke: name === 'windows' ? 'none' : 'currentColor',
        'stroke-width': 1.7,
      },
      svg,
    );
    return svg;
  }
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('section', 'tour-bubble overlay-' + ctx.kind, document.body);
    if (ctx.initial) el.classList.add('reference-initial');
    el.setAttribute('role', 'dialog');
    const content = {
      chat: [
        'Welcome to City Explorer!',
        'Explore the map and place details in this workspace.',
        'Start tour',
        'Skip tour',
      ],
      cookie: [
        'Your privacy',
        'Allow optional cookies for this practice workspace?',
        'Accept optional',
        'Reject optional',
      ],
      toast: ['Practice saved', 'Your current workspace is ready to continue.', null, 'Dismiss'],
      promo: [
        'Discover more practice',
        'Explore more exercises after completing this task.',
        'Show details',
        'Not now',
      ],
      banner: ['Workspace notice', 'This practice session works offline.', null, 'Dismiss'],
    }[ctx.kind];
    u.el('h2', '', el, content[0]);
    const close = u.el('button', 'bubble-close', el);
    close.type = 'button';
    close.setAttribute('aria-label', 'Close notice');
    icon(close, 'close', 25);
    close.onclick = () => ctx.dismiss('close');
    const message = u.el('p', '', el, content[1]);
    const actions = u.el('div', 'tour-actions', el);
    if (content[2]) {
      const primary = u.el('button', 'tour-primary', actions, content[2]);
      primary.type = 'button';
      primary.onclick = () => {
        if (ctx.kind === 'cookie') ctx.dismiss('accept');
        else {
          message.textContent = 'Drag the coral handle around the compass ring to rotate the map.';
          primary.hidden = true;
        }
      };
    }
    const dismiss = u.el('button', 'tour-dismiss', actions, content[3]);
    dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('skip');
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  env.site({
    name: 'design-rotate-object-compass-01',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = `city-explorer instruction-${ctx.display}`;
      const titlebar = u.el('header', 'titlebar', document.body);
      u.el('span', 'app-mark', titlebar, '●');
      u.el('span', '', titlebar, 'City Explorer');
      const windowActions = u.el('div', 'window-actions', titlebar);
      for (const action of ['minimize', 'maximize', 'close']) {
        const b = u.el('button', 'window-action ' + action, windowActions);
        b.type = 'button';
        b.setAttribute('aria-label', action);
        icon(b, action);
      }
      const tabs = u.el('nav', 'notebook-tabs', document.body);
      tabs.setAttribute('aria-label', 'City Explorer sections');
      [
        ['map', 'Map'],
        ['pin', 'Places'],
        ['photo', 'Photos'],
        ['notes', 'Notes'],
        ['layers', 'Layers'],
        ['settings', 'Settings'],
        ['help', 'Help'],
      ].forEach(([mark, label], i) => {
        const tab = u.el('button', 'notebook-tab tab-' + i, tabs);
        tab.type = 'button';
        tab.dataset.action = label.toLowerCase();
        const glyph = icon(tab, mark, 24);
        glyph.classList.add('rail-icon');
        u.el('span', '', tab, label);
      });
      const page = u.el('section', 'notebook-page', document.body);
      const summary = u.el('header', 'city-header', page);
      u.el('div', 'city-thumb', summary, 'R');
      const identity = u.el('div', 'city-identity', summary);
      u.el('h1', 'city-name', identity, 'Riverton');
      u.el('div', 'city-subtitle', identity, 'City Map');
      const heading = u.el('div', 'instruction', identity, ctx.instruction);
      if (ctx.display === 'hidden') heading.hidden = true;
      if (ctx.display === 'toast') heading.classList.add('instruction-toast-card');
      const meta = u.el('div', 'city-meta', identity);
      [
        ['pin', '5 places'],
        ['photo', '12 photos'],
        ['calendar', 'Updated Apr 28, 2026'],
      ].forEach(([glyph, label], i) => {
        if (i) u.el('span', 'meta-divider', meta, '│');
        const item = u.el('span', 'meta-item', meta);
        const mark = icon(item, glyph, 22);
        mark.classList.add('meta-icon');
        u.el('span', '', item, label);
      });
      const stage = u.el('main', 'cube-stage', page);
      stage.dataset.role = 'stage';
      const controls = u.el('aside', 'controls-card', page);
      const listCard = u.el('section', 'place-list-card', controls);
      u.el('h2', '', listCard, 'Places (5)');
      [
        ['🔴', 'Bakery', 'Food & Drink'],
        ['🔵', 'Museum', 'Arts & Culture'],
        ['🟢', 'Park', 'Recreation'],
        ['🟡', 'Cafe', 'Food & Drink'],
        ['🟣', 'Library', 'Education'],
      ].forEach(([pin, n, c], i) => {
        const row = u.el('div', 'place-row ' + (i === 0 ? 'selected' : ''), listCard);
        u.el('span', 'place-pin', row, pin);
        u.el('span', 'place-name', row, n);
        u.el('span', 'place-category', row, c);
        u.el('span', 'place-arrow', row, '›');
      });
      const details = u.el('section', 'details-card', controls);
      u.el('h2', '', details, 'Place Details');
      const detailBody = u.el('div', 'detail-body', details);
      u.el('div', 'detail-photo', detailBody, 'BAKERY');
      const detailCopy = u.el('div', 'detail-copy', detailBody);
      u.el('h3', '', detailCopy, 'Bakery');
      u.el('p', '', detailCopy, 'Food & Drink');
      const address = u.el('p', '', detailCopy);
      u.el('span', 'detail-location', address);
      u.el('span', '', address, '218 Market St\n　　Riverton, RV 40210');
      u.el('p', '', detailCopy, '☎　(555) 010-4487');
      u.el('p', '', detailCopy, '◷　Daily 7:00 AM – 7:00 PM');
      let submit = null;
      if (!ctx.finish) {
        const endRng = ctx.rng.fork('chrome/end');
        const placements = ['page-footer', 'page-footer', 'page-toolbar', 'page-link'];
        const placement = endRng.pick(placements);
        const fallbackLabels = [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
          'Complete',
          "I'm done",
        ];
        const labels =
          ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
            ? ctx.content.END_LABELS
            : fallbackLabels;
        const labelValue = endRng.pick(labels);
        const endLabel =
          typeof labelValue === 'string'
            ? labelValue
            : labelValue.label || labelValue.text || labelValue.name || String(labelValue);
        submit = u.el(
          placement === 'page-link' ? 'a' : 'button',
          'submit-button ' + placement,
          page,
          placement === 'page-link' ? endLabel + ' ›' : endLabel,
        );
        if (placement === 'page-link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', endLabel);
        submit.title = endLabel;
        submit.onclick = (event) => {
          event.preventDefault();
          ctx.submit();
        };

        const collideRng = ctx.rng.fork('chrome/collide');
        if (collideRng.bool(0.3)) {
          const candidates = labels
            .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
            .filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
          if (candidates.length) {
            const decoyLabel = collideRng.pick(candidates);
            const decoy = u.el('button', 'end-xtra', page, decoyLabel);
            decoy.type = 'button';
            decoy.dataset.role = 'xtra';
            decoy.addEventListener('click', () => env.log('decoy', { label: decoyLabel, collide: true }));
          }
        }
      }
      const note = u.el('aside', 'notebook-note', page);
      note.hidden = true;
      tabs.addEventListener('click', (event) => {
        const action = event.target.closest('[data-action]')?.dataset.action;
        if (!action || action === 'reset') return;
        note.hidden = action === 'task';
        if (action === 'hints') note.textContent = 'Drag left or right to turn the cube. Drag up or down to tilt it.';
        if (action === 'examples')
          note.textContent =
            'A face points toward you when it appears square. Keep its label upright when the task asks for that.';
        if (action === 'notes')
          note.textContent = 'Use the pointer to rotate. Your current orientation stays in place when you release it.';
      });
      const taskbar = u.el('footer', 'taskbar', document.body);
      u.el('span', 'status-text', taskbar, 'City Explorer  /  Map workspace');
      return { stage, submit };
    },
    overlay: drawOverlay,
  });
})();
