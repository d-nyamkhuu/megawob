/* Lab Trainer: early-Material paper frame on the shared site template. */
(function () {
  'use strict';
  const ICONS = {
    close: 'M5 5L21 21M21 5L5 21',
    gear: 'M12 8.5A3.5 3.5 0 1 0 12 15.5A3.5 3.5 0 1 0 12 8.5ZM10.4 2h3.2l.5 2.6 1.6.8 2.3-1.4 2.2 2.2-1.4 2.3.8 1.6 2.6.5v3.2l-2.6.5-.8 1.6 1.4 2.3-2.2 2.2-2.3-1.4-1.6.8-.5 2.6h-3.2l-.5-2.6-1.6-.8-2.3 1.4-2.2-2.2 1.4-2.3-.8-1.6L2 13.6v-3.2l2.6-.5.8-1.6-1.4-2.3 2.2-2.2 2.3 1.4 1.6-.8Z',
  };
  function icon(parent, name, size = 24) {
    const svg = env.util.svg('svg', { width: size, height: size, viewBox: '0 0 26 26', 'aria-hidden': 'true' }, parent);
    const closeIcon = name === 'close';
    env.util.svg('path', { d: ICONS[name], fill: closeIcon ? 'none' : 'currentColor',
      stroke: closeIcon ? 'currentColor' : 'none', 'stroke-width': 2.2, 'fill-rule': 'evenodd' }, svg);
    return svg;
  }
  function circleIcon(parent, glyph, cls) {
    return env.util.el('span', 'circ-icon ' + (cls || ''), parent, glyph);
  }
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('section', 'tour-bubble overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const content = {
      chat: ['Welcome to Lab Trainer', 'Take a quick tour to learn the controls and features.', 'Start tour', 'Skip tour'],
      cookie: ['Your privacy', 'Allow optional cookies for this practice workspace?', 'Accept optional', 'Reject optional'],
      toast: ['Practice saved', 'Your current workspace is ready to continue.', null, 'Dismiss'],
      promo: ['Discover more practice', 'Explore more exercises after completing this task.', 'Show details', 'Not now'],
      banner: ['Workspace notice', 'This practice session works offline.', null, 'Dismiss'],
    }[ctx.kind];
    u.el('h2', '', el, content[0]);
    const close = u.el('button', 'bubble-close', el);
    close.type = 'button'; close.setAttribute('aria-label', 'Close notice'); icon(close, 'close', 22);
    close.onclick = () => ctx.dismiss('close');
    const message = u.el('p', '', el, content[1]);
    const actions = u.el('div', 'tour-actions', el);
    if (content[2]) {
      const primary = u.el('button', 'tour-primary', actions, content[2]); primary.type = 'button';
      primary.onclick = () => {
        if (ctx.kind === 'cookie') ctx.dismiss('accept');
        else { message.textContent = 'Drag the knob with your pointer to rotate it to the requested value.'; primary.hidden = true; }
      };
    }
    const dismiss = u.el('button', 'tour-dismiss', actions, content[3]); dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('skip');
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  const palette = { bg: '#f7f8fa', panel: '#ffffff', fg: '#131b38', muted: '#616674', line: '#e7e9ee' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('material', 'instruction-' + _c.display);
      const bar = u.el('header', 'appbar', document.body);
      u.el('span', 'app-title', bar, 'Lab Trainer');
      const actions = u.el('div', 'app-actions', bar);
      const layout = u.el('div', 'layout', document.body);
      const left = u.el('aside', 'col col-left', layout);
      const task = u.el('section', 'paper card-task', left);
      u.el('h2', 'card-title', task, 'Task');
      const steps = u.el('ol', 'steps', task);
      ['Set timer', 'Check setting', 'Complete'].forEach((label, i) => {
        const li = u.el('li', 'step' + (i === 0 ? ' current' : ''), steps);
        u.el('span', 'step-dot', li, String(i + 1));
        u.el('span', 'step-label', li, label);
      });
      const refc = u.el('section', 'paper card-ref', left);
      if (_c.display !== 'panel') {
        u.el('h2', 'card-title', refc, 'Reference');
        u.el('p', 'card-text', refc, 'Turn the knob to the required time. Use the marked scale. Units are minutes (min).');
      }
      const page = u.el('main', 'paper center', layout);
      Object.assign(_c, { header: page, bar, actions, layout, refc, page });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.actions;
      base(_c);
      _c.header = h;
      const u = _c.util;
      const settings = u.el('button', 'app-action', _c.actions); settings.type = 'button';
      icon(settings, 'gear', 28); u.el('span', '', settings, 'Settings');
      const help = u.el('button', 'app-action', _c.actions); help.type = 'button';
      circleIcon(help, '?', 'help-circle'); u.el('span', '', help, 'Help');
    },
    'frame.body': () => (_c) => { _c.body = _c.layout; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.refc;
      base(_c);
      _c.body = body;
      const title = _c.refc.querySelector('.ref-panel-title');
      if (title) title.textContent = 'Task instructions';
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const stage = u.el('div', 'dial-stage', _c.page);
      stage.dataset.role = 'stage';
      const rightCol = u.el('aside', 'col col-right', _c.layout);
      const tool = u.el('section', 'paper card-tool', rightCol);
      u.el('h2', 'card-title', tool, 'Tool');
      const tip = u.el('div', 'tool-tip', tool);
      circleIcon(tip, 'i', 'info-circle');
      u.el('p', 'card-text', tip, 'Drag the knob with your pointer to rotate it.');
      const units = u.el('section', 'paper card-units', rightCol);
      u.el('h2', 'card-title', units, 'Units');
      u.el('p', 'card-text', units, 'Minutes (min)');
      Object.assign(_c, { stage, rightCol });
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction-toast');
        _c.page.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.rightCol.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.layout.querySelector('.card-task').appendChild(dock);
    },
    overlay: () => drawOverlay,
  };
  env.site({
    name: 'design-rotate-object-dial-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-rotate-object-dial-05': palette },
      LOW_THEME: palette,
      ACCENTS: ['#3f4fbf'],
      LOW_ACCENTS: ['#3f4fbf'],
      parts,
    },
  });
})();
