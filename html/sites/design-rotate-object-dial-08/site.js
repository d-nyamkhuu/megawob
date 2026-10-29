/* BeOS-style Oven Controller reference frame. Task state and rotations belong to the rotate task. */
(function () {
  'use strict';
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('section', 'beos-note overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const content = {
      chat: ['Welcome', 'Take a quick tour to learn the controls.', 'Start tour', 'Skip tour'],
      cookie: ['Your privacy', 'Allow optional cookies for this workspace?', 'Accept optional', 'Reject optional'],
      toast: ['Settings saved', 'Your current settings are ready to continue.', null, 'Dismiss'],
      promo: ['More utilities', 'Explore more controls after completing this task.', 'Show details', 'Not now'],
      banner: ['Notice', 'This utility works offline.', null, 'Dismiss'],
    }[ctx.kind];
    u.el('h2', '', el, content[0]);
    const close = u.el('button', 'bubble-close', el, '×');
    close.type = 'button'; close.setAttribute('aria-label', 'Close notice');
    close.onclick = () => ctx.dismiss('close');
    const message = u.el('p', '', el, content[1]);
    const actions = u.el('div', 'tour-actions', el);
    if (content[2]) {
      const primary = u.el('button', 'tour-primary', actions, content[2]); primary.type = 'button';
      primary.onclick = () => {
        if (ctx.kind === 'cookie') ctx.dismiss('accept');
        else { message.textContent = 'Drag the knob around its dial to the requested value.'; primary.hidden = true; }
      };
    }
    const dismiss = u.el('button', 'tour-dismiss', actions, content[3]); dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('skip');
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }

  function glyph(parent, kind) {
    const s = env.util.svg('svg', { viewBox: '0 0 40 40', width: 40, height: 40, 'aria-hidden': 'true' }, parent);
    const p = (d, extra) => env.util.svg('path', Object.assign({ d, fill: 'none', stroke: '#222', 'stroke-width': 2.4 }, extra || {}), s);
    if (kind === 'temp') {
      p('M16 6a4 4 0 0 1 8 0V24a7 7 0 1 1-8 0Z');
      env.util.svg('circle', { cx: 20, cy: 29, r: 4, fill: '#222' }, s); p('M20 12V28');
    } else if (kind === 'timer') {
      env.util.svg('circle', { cx: 20, cy: 20, r: 15, fill: 'none', stroke: '#f2e6c8', 'stroke-width': 2.6 }, s);
      env.util.svg('path', { d: 'M20 10V21H28', fill: 'none', stroke: '#f2e6c8', 'stroke-width': 2.6 }, s);
    } else {
      p('M10 3q5 6 0 13t0 13M20 3q5 6 0 13t0 13M30 3q5 6 0 13t0 13', { 'stroke-width': 3 });
      p('M5 36H35', { 'stroke-width': 3 });
    }
  }

  env.site({
    name: 'design-rotate-object-dial-08', styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = `beos-oven instruction-${ctx.display}`;
      const win = u.el('div', 'win', document.body);
      const titlebar = u.el('header', 'titlebar', win);
      const tab = u.el('div', 'title-tab', titlebar);
      const lg = u.svg('svg', { viewBox: '0 0 30 24', width: 30, height: 24, 'aria-hidden': 'true' }, tab);
      u.svg('path', { d: 'M3 11L11 10L15 3L19 5L17 10L26 11L27 14L20 16L18 21L13 21L11 17L5 16Z M5 12L13 15L24 12 M12 17L19 17', fill: '#e4e4d8', stroke: '#222', 'stroke-width': 1.6 }, lg);
      u.el('span', '', tab, 'Oven Controller');
      const wa = u.el('div', 'window-actions', titlebar);
      for (const a of ['min', 'max', 'close']) {
        const b = u.el('button', 'window-action ' + a, wa); b.type = 'button'; b.setAttribute('aria-label', a);
        b.dataset.role = 'xtra'; b.onclick = () => env.log('decoy', { label: a });
      }
      const menu = u.el('nav', 'menubar', win);
      for (const m of ['File', 'Edit', 'View', 'Help']) {
        const item = u.el('span', '', menu, m);
        item.onclick = () => env.log('decoy', { label: m });
      }
      const tools = u.el('div', 'menu-tools', menu);
      const endRng = ctx.rng.fork('chrome/end');
      const labelOf = x => typeof x === 'string' ? x : x.label || x.text || x.name;
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const classicEnd = endRng.bool(0.5);
      const placement = classicEnd ? 'footer' : endRng.pick(['toolbar', 'link']);
      const endLabel = classicEnd ? 'Submit' : endRng.pick(endLabels);
      const decoyBtn = (parent, label, collide = false) => {
        const b = u.el('button', 'chrome-xtra', parent, label);
        b.type = 'button'; b.dataset.role = 'xtra';
        b.onclick = () => env.log('decoy', collide ? { label, collide: true } : { label });
        return b;
      };
      const collideRng = ctx.rng.fork('chrome/collide');
      if (collideRng.bool(0.3)) {
        const choices = endLabels.filter(label => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (choices.length) decoyBtn(tools, collideRng.pick(choices), true);
      }

      const band1 = u.el('section', 'band band-instr', win);
      const heading = u.el('h1', 'instruction', band1, ctx.instruction);
      if (ctx.display === 'hidden') heading.hidden = true;
      if (ctx.display === 'toast') {
        const close = u.el('button', 'instruction-dismiss', heading, 'Close');
        close.type = 'button'; close.onclick = () => { heading.hidden = true; };
      }

      const band2 = u.el('section', 'band band-main', win);
      const legend = u.el('div', 'legend', band2);
      u.el('span', '', legend, 'Oven Settings'); u.el('i', '', legend);
      const list = u.el('ul', 'settings', band2);
      [['temp', 'Temperature', '200 °C'], ['timer', 'Timer', '12 min'], ['mode', 'Mode', 'Convection']].forEach(([k, a, b]) => {
        const li = u.el('li', k === 'timer' ? 'sel' : '', list);
        glyph(li, k);
        const t = u.el('div', '', li);
        u.el('b', '', t, a); u.el('span', '', t, b);
      });
      const stage = u.el('main', 'dial-stage', band2);
      stage.dataset.role = 'stage';
      const units = u.el('div', 'units', band2, 'Units: minutes');
      stage.showDialState = (label, value, unit) => {
        const selected = list.querySelector('.sel');
        if (selected.dataset.label !== label) {
          selected.dataset.label = label;
          const temperature = /temperature/i.test(label);
          selected.querySelector('svg').remove();
          glyph(selected, temperature ? 'temp' : 'timer');
          selected.prepend(selected.lastElementChild);
          const passive = list.firstElementChild;
          passive.querySelector('b').textContent = temperature ? 'Timer' : 'Temperature';
          passive.querySelector('span').textContent = temperature ? '12 min' : '200 °C';
          passive.querySelector('svg').remove();
          glyph(passive, temperature ? 'timer' : 'temp');
          passive.prepend(passive.lastElementChild);
        }
        selected.querySelector('b').textContent = label;
        selected.querySelector('span').textContent = value;
        units.textContent = 'Units: ' + (unit.trim() === 'min' ? 'minutes' : unit.trim() || 'degrees');
      };

      const band3 = u.el('footer', 'band band-foot', win);
      u.el('i', 'led', band3);
      u.el('span', 'status', band3, 'Oven ready.');
      const reset = u.el('button', 'btn reset', band3, 'Reset'); reset.type = 'button';
      reset.dataset.role = 'xtra'; reset.onclick = () => env.log('decoy', { label: 'Reset' });
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'footer' ? band3 : tools;
        submit = u.el('button', placement === 'footer' ? 'btn submit-button' : 'end-' + placement, parent, endLabel);
        submit.type = 'button'; submit.dataset.role = 'submit'; submit.onclick = () => ctx.submit();
        submit.title = endLabel; submit.setAttribute('aria-label', endLabel);
      }
      return { stage, submit };
    },
    overlay: drawOverlay,
  });
})();
