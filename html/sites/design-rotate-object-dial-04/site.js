/* 2008 Office-ribbon building controls manager. Task state and rotations belong to the rotate task. */
(function () {
  'use strict';
  const PATHS = {
    close: 'M5 5L21 21M21 5L5 21', minimize: 'M5 20H21', maximize: 'M6 6H21V21H6Z',
  };
  function icon(parent, name, size = 24) {
    const svg = env.util.svg('svg', { width: size, height: size, viewBox: '0 0 28 28', 'aria-hidden': 'true' }, parent);
    env.util.svg('path', { d: PATHS[name], fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, svg);
    return svg;
  }
  // Large ribbon / rail glyphs: [path d, fill, stroke] lists on a 40x40 box.
  const GLYPHS = {
    thermo: [['M17 6a3 3 0 0 1 6 0V22a6 6 0 1 1-6 0Z', '#fff4b7', '#17629b', 2], ['M20 6V27', 'none', '#267cae', 2], ['M20 24a3 3 0 1 0 .01 0Z', '#2885ba', '#1a6398', 1]],
    bulb: [['M20 5a10 10 0 0 0-5 18v4h10v-4a10 10 0 0 0-5-18Z', '#ffe36a', '#c9a21a', 2], ['M15 31H25M17 35H23', 'none', '#777', 2.5]],
    fan: [['M20 20C12 8 22 3 24 12C32 8 36 20 25 21C32 30 20 36 19 26C10 32 4 20 15 19C8 10 20 6 22 14Z', '#5d6f8d', '#3b4a63', 1.5]],
    auto: [['M20 4a16 16 0 1 0 .01 0Z', '#fff', '#44566f', 2.5], ['M12 29L20 9L28 29M15 23H25', 'none', '#44566f', 3]],
    leaf: [['M8 32C6 14 18 6 33 6C33 22 26 33 8 32Z', '#58b04a', '#2f7d2f', 2], ['M8 32L24 16', 'none', '#2f7d2f', 2]],
    leaf2: [['M8 32C6 14 18 6 33 6C33 22 26 33 8 32Z', '#e9f6d6', '#74b04a', 2], ['M8 32L24 16', 'none', '#74b04a', 2]],
    power: [['M12 9A14 14 0 1 0 28 9', 'none', '#44566f', 3.5], ['M20 4V20', 'none', '#44566f', 3.5]],
    building: [['M9 36V6H25V36ZM25 15H32V36H25M13 11H15M19 11H21M13 17H15M19 17H21M13 23H15M19 23H21M13 29H15M19 29H21', '#2f5fa8', '#1e3f78', 1.5]],
    buildingG: [['M9 36V6H25V36ZM25 15H32V36H25M13 11H15M19 11H21M13 17H15M19 17H21M13 23H15M19 23H21M13 29H15M19 29H21', '#7a8494', '#4b5563', 1.5]],
    buildings: [['M3 36V14H13V36ZM13 8H25V36H13ZM25 16H37V36H25M6 18H9M6 24H9M16 13H22M16 19H22M16 25H22M28 21H34M28 27H34', '#7a8494', '#4b5563', 1.5]],
    calendar: [['M5 9H35V36H5ZM5 17H35M12 4V11M28 4V11', '#fff', '#2f5fa8', 3], ['M10 22H14M18 22H22M26 22H30M10 28H14M18 28H22M26 28H30', 'none', '#2f5fa8', 3]],
    bars: [['M6 36V22H13V36ZM16 36V12H23V36ZM26 36V4H33V36Z', '#4a86d2', '#2f5fa8', 1.5]],
    doc: [['M9 3H25L32 10V37H9Z', '#fff', '#2f5fa8', 2.2], ['M14 17H27M14 23H27M14 29H27', 'none', '#2f5fa8', 2]],
    home: [['M4 20L20 5L36 20H31V34H9V20Z', '#5b8fd6', '#2f5fa8', 2]],
    gear: [['M20 4L24 7L29 6L31 11L36 14L34 19L36 24L31 27L29 32L24 31L20 34L16 31L11 32L9 27L4 24L6 19L4 14L9 11L11 6L16 7Z', '#6b7585', '#454e5c', 1.5], ['M20 14a6 6 0 1 0 .01 0Z', '#dfe6f0', '#454e5c', 1.5]],
    help: [['M20 4a16 16 0 1 0 .01 0Z', '#6b7585', '#454e5c', 1.5], ['M14 15a6 6 0 1 1 8 5.5C20 22 20 23 20 25M20 30V31', 'none', '#fff', 3.5]],
  };
  function glyph(parent, name, size) {
    const svg = env.util.svg('svg', { width: size, height: size, viewBox: '0 0 40 40', 'aria-hidden': 'true', class: 'glyph' }, parent);
    if (name === 'fan') svg.setAttribute('viewBox', '3 3 34 34');
    if (name === 'leaf' || name === 'leaf2') svg.setAttribute('viewBox', '4 3 33 37');
    const rail = parent.classList.contains('rail-item');
    const defs = env.util.svg('defs', {}, svg);
    const id = 'gloss-' + name + (rail ? '-rail' : '-ribbon');
    const grad = env.util.svg('linearGradient', { id, x1: '0%', y1: '0%', x2: '80%', y2: '100%' }, defs);
    const gray = rail && name !== 'home';
    const palettes = {
      bulb: ['#fffce2', '#fff7a2', '#ffd340'], leaf: ['#b4d98a', '#64aa3c', '#397b29'],
      leaf2: ['#f5ffdf', '#d5ed9f', '#b8d779'], fan: ['#b6c4d2', '#8b9fb2', '#566f86'],
      building: ['#629cda', '#2e72b7', '#19528c'], buildingG: ['#94a5b6', '#63758a', '#45586b'],
      buildings: ['#94a5b6', '#63758a', '#45586b'], gear: ['#9bb1c3', '#718b9f', '#536d83'],
      help: ['#9bb1c3', '#718b9f', '#536d83'], bars: ['#87baf0', '#478ed1', '#2c73b5'],
      home: ['#b6d9ff', '#77afe9', '#4f8ac5'],
    };
    const palette = gray ? ['#9cb0c1', '#6d879d', '#496780'] : palettes[name];
    if (palette) palette.forEach((color, i) => env.util.svg('stop', { offset: (i * 50) + '%', 'stop-color': color }, grad));
    if (name === 'fan') {
      for (let i = 0; i < 4; i++) {
        env.util.svg('path', { d: 'M20 18C15 15 11 10 14 6C17 1 25 3 27 7C30 13 24 16 20 18Z', transform: `rotate(${i * 90} 20 20)`, fill: `url(#${id})`, stroke: '#526c85', 'stroke-width': 1.2 }, svg);
        env.util.svg('path', { d: 'M15 8C15 4 21 3 25 6', transform: `rotate(${i * 90} 20 20)`, fill: 'none', stroke: '#e8f0f7', 'stroke-width': 0.8 }, svg);
      }
      env.util.svg('circle', { cx: 20, cy: 20, r: 4.3, fill: '#c4d4e4', stroke: '#556c84', 'stroke-width': 1.5 }, svg);
    } else if (['building', 'buildingG', 'buildings'].includes(name)) {
      const blocks = name === 'buildings' ? [[2,15,10,21],[13,5,14,31],[28,17,10,19]] : [[7,15,8,21],[16,5,16,31]];
      blocks.forEach(([x,y,w,h]) => {
        env.util.svg('path', { d: `M${x} 36V${y}H${x+w}V36Z`, fill: `url(#${id})`, stroke: '#526b86', 'stroke-width': 1 }, svg);
        for (let yy = y + 4; yy < 33; yy += 6) {
          for (let xx = x + 3; xx < x + w - 2; xx += 5) env.util.svg('rect', { x: xx, y: yy, width: 2, height: 3, fill: '#eef5fc' }, svg);
        }
      });
      env.util.svg('path', { d: 'M2 37H38', stroke: name === 'building' ? '#2c6eb2' : '#597189', 'stroke-width': 2 }, svg);
    } else {
      for (const [d, fill, stroke, w] of GLYPHS[name]) {
        const tinted = gray && stroke !== '#fff' ? '#648198' : stroke;
        env.util.svg('path', { d, fill: palette && fill !== 'none' && fill !== '#fff' && fill !== '#dfe6f0' ? `url(#${id})` : fill,
          stroke: tinted, 'stroke-width': w, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, svg);
      }
      if (name === 'calendar') {
        env.util.svg('path', { d: 'M6 10H34V16H6Z', fill: gray ? '#7594ad' : '#3771b9', stroke: 'none' }, svg);
      }
      if (name === 'home') {
        env.util.svg('path', { d: 'M3 19L20 4L37 19M17 34V24H24V34', fill: 'none', stroke: '#e9f6ff', 'stroke-width': 2 }, svg);
      }
      if (name === 'leaf' || name === 'leaf2') {
        env.util.svg('path', { d: 'M7 37L24 15M14 28L14 20M18 24L26 24', fill: 'none', stroke: name === 'leaf' ? '#559733' : '#89ad40', 'stroke-width': 1.6 }, svg);
      }
    }
    return svg;
  }
  const GROUPS = [
    ['Controls', [['Temperature', 'thermo', 'on-warm'], ['Lighting', 'bulb'], ['Ventilation', 'fan']]],
    ['Mode', [['Auto', 'auto'], ['Comfort', 'leaf'], ['Eco', 'leaf2'], ['Off', 'power']]],
    ['Zones', [['Zone 1', 'building', 'on-blue'], ['Zone 2', 'buildingG'], ['Zone 3', 'buildingG'], ['All Zones', 'buildings']]],
    ['Manage', [['Create Schedule', 'calendar', 'wide'], ['View Trends', 'bars'], ['Export Report', 'doc']]],
  ];
  const RAIL = [['Rooms', 'home'], ['Schedules', 'calendar'], ['Energy', 'bars'], ['Settings', 'gear'], ['Help', 'help']];

  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('section', 'tour-bubble overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const content = {
      chat: ['Welcome to Building Controls Manager', 'Take a quick tour to learn the controls and features.', 'Start tour', 'Skip tour'],
      cookie: ['Your privacy', 'Allow optional cookies for this workspace?', 'Accept optional', 'Reject optional'],
      toast: ['Settings saved', 'Your current workspace is ready to continue.', null, 'Dismiss'],
      promo: ['Discover more', 'Explore more tools after completing this task.', 'Show details', 'Not now'],
      banner: ['Workspace notice', 'This session works offline.', null, 'Dismiss'],
    }[ctx.kind];
    u.el('h2', '', el, content[0]);
    const close = u.el('button', 'bubble-close', el);
    close.type = 'button'; close.setAttribute('aria-label', 'Close notice'); icon(close, 'close', 25);
    close.onclick = () => ctx.dismiss('close');
    const message = u.el('p', '', el, content[1]);
    const actions = u.el('div', 'tour-actions', el);
    if (content[2]) {
      const primary = u.el('button', 'tour-primary', actions, content[2]); primary.type = 'button';
      primary.onclick = () => {
        if (ctx.kind === 'cookie') ctx.dismiss('accept');
        else { message.textContent = 'Drag the dial grip around the scale to set the temperature.'; primary.hidden = true; }
      };
    }
    const dismiss = u.el('button', 'tour-dismiss', actions, content[3]); dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('skip');
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  env.site({
    name: 'design-rotate-object-dial-04', styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const collideRng = ctx.rng.fork('chrome/collide');
      const labelOf = (item) => typeof item === 'string' ? item : item.label || item.text || item.name;
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const placement = endRng.pick(['footer', 'footer', 'toolbar', 'link']);
      const endLabel = placement === 'footer' ? 'Submit' : endRng.pick(endLabels);
      const logDecoy = (button, label) => {
        button.addEventListener('click', () => env.log('decoy', { label }));
      };
      document.body.className = `ribbon instruction-${ctx.display}`;
      const frame = u.el('div', 'frame', document.body);

      const titlebar = u.el('header', 'titlebar', frame);
      const app = u.el('span', 'app-icon', titlebar);
      for (let i = 0; i < 4; i++) u.el('i', 'q' + i, app);
      u.el('span', 'title-sep', titlebar);
      u.el('span', 'title-text', titlebar, 'Building Controls Manager - Floor 1');
      const windowActions = u.el('div', 'window-actions', titlebar);
      for (const action of ['minimize', 'maximize', 'close']) {
        const b = u.el('button', 'window-action ' + action, windowActions);
        b.type = 'button'; b.setAttribute('aria-label', action); icon(b, action, 18);
        logDecoy(b, action);
      }

      u.el('div', 'orb', frame);
      const tabs = u.el('nav', 'ribbon-tabs', frame);
      ['Home', 'View', 'Tools', 'Reports', 'Help'].forEach((t, i) => {
        const b = u.el('button', 'rtab' + (i === 0 ? ' sel' : ''), tabs, t); b.type = 'button';
        logDecoy(b, t);
      });
      const ribbon = u.el('div', 'ribbon-body', frame);
      for (const [gname, items] of GROUPS) {
        const g = u.el('div', 'rgroup', ribbon);
        const row = u.el('div', 'rrow', g);
        for (const [label, gl, cls] of items) {
          const b = u.el('button', 'rbtn ' + (cls || ''), row); b.type = 'button';
          glyph(b, gl, 40); u.el('span', '', b, label);
          logDecoy(b, label);
        }
        u.el('div', 'rgname', g, gname);
      }

      const rail = u.el('nav', 'rail', frame);
      RAIL.forEach(([label, gl], i) => {
        const b = u.el('button', 'rail-item' + (i === 0 ? ' sel' : ''), rail); b.type = 'button';
        glyph(b, gl, 36); u.el('span', '', b, label);
        logDecoy(b, label);
      });

      const doctab = u.el('div', 'doc-tab', frame);
      u.el('span', '', doctab, 'Room 101'); u.el('b', '', doctab, '✕');
      const page = u.el('section', 'notebook-page', frame);
      const heading = u.el('h1', 'instruction', page, ctx.instruction);
      if (ctx.display === 'hidden') heading.hidden = true;
      if (ctx.display === 'toast') {
        const close = u.el('button', 'instruction-dismiss', heading, 'Close');
        close.type = 'button'; close.onclick = () => { heading.hidden = true; };
      }
      const stage = u.el('main', 'cube-stage', page);
      stage.dataset.role = 'stage';
      u.el('div', 'divider', page);
      const info = u.el('aside', 'info', page);
      u.el('h2', '', info, 'Room 101');
      for (const [k, v, strong] of [['Zone', 'Zone 1'], ['Type', 'Office'], ['Occupancy', 'Occupied', true]]) {
        const d = u.el('div', 'kv', info);
        u.el('span', 'k', d, k); u.el('span', 'v' + (strong ? ' strong' : ''), d, v);
      }
      u.el('div', 'rule', page);
      const reset = u.el('button', 'reset-button', page, 'Reset'); reset.type = 'button';
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'toolbar' ? tabs : page;
        const cls = placement === 'toolbar' ? 'end-toolbar' : placement === 'link' ? 'end-link' : 'submit-button';
        submit = u.el('button', cls, parent, endLabel);
        submit.type = 'button'; submit.dataset.role = 'submit'; submit.onclick = () => ctx.submit();
        submit.title = endLabel; submit.setAttribute('aria-label', endLabel);
      }
      if (collideRng.bool(0.3)) {
        const pool = endLabels.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (pool.length) {
          const label = collideRng.pick(pool);
          const decoy = u.el('button', 'end-xtra', page, label);
          decoy.type = 'button'; decoy.dataset.role = 'xtra';
          decoy.onclick = () => env.log('decoy', { label, collide: true });
        }
      }

      const status = u.el('footer', 'statusbar', frame);
      u.el('span', '', status, 'Building: East Wing');
      u.el('span', 'sep', status, '|');
      u.el('span', '', status, 'Floor: 1');
      u.el('span', 'sep', status, '|');
      u.el('span', '', status, 'Room: 101');
      u.el('span', 'clock', status, 'Apr 23, 2008   10:24 AM');

      return { stage, submit };
    },
    overlay: drawOverlay,
  });
})();
