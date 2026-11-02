/* Electron lab-notebook reference frame. Task state and rotations belong to the rotate task. */
(function () {
  'use strict';
  function icon(parent, name, size = 24) {
    const paths = {
      close: 'M5 5L21 21M21 5L5 21', minimize: 'M5 14H21', maximize: 'M6 6H21V21H6Z',
      notes: 'M7 3H17V9H23V25H7ZM19 3L23 7M10 12H20M10 16H20M10 20H17',
      temp: 'M14 3A11 11 0 1 1 3 14A11 11 0 0 1 14 3ZM14 14V6M14 14L20 20',
      drop: 'M14 3Q23 14 23 18A9 9 0 0 1 5 18Q5 14 14 3Z',
      fan: 'M14 12C9 10 10 2 15 3C21 3 20 9 16 13ZM16 14C19 10 26 12 24 17C22 22 18 19 15 16ZM13 16C15 21 8 26 5 21C1 16 8 13 12 14Z',
      reset: 'M22 14A8 8 0 1 1 18 7M18 2V8H24',
    };
    const svg = env.util.svg('svg', { width: size, height: size, viewBox: '0 0 28 28', 'aria-hidden': 'true' }, parent);
    env.util.svg('path', { d: paths[name], fill: ['drop','fan'].includes(name) ? 'currentColor' : 'none', stroke: 'currentColor', 'stroke-width': 1.7,
      'stroke-linejoin': 'round' }, svg);
    if (name === 'notes') {
      env.util.svg('path', {d:'M6 3H16V9H22V25H6Z',fill:'currentColor',stroke:'none'},svg);
      env.util.svg('path', {d:'M9 12H19M9 16H19M9 20H16',fill:'none',stroke:'#454a4a','stroke-width':1.7},svg);
    }
    if (name === 'temp') env.util.svg('path', {d:'M14 5A9 9 0 0 1 21 20L14 14Z',fill:'currentColor',stroke:'none'},svg);
    if (name === 'fan') env.util.svg('circle', {cx:14,cy:14,r:2.2,fill:'currentColor'},svg);
    if (name === 'drop') env.util.svg('path', {d:'M9 17Q8 21 13 22',fill:'none',stroke:'#fff','stroke-width':1.5,opacity:.35},svg);
    return svg;
  }
  function drawOverlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'tour-bubble overlay-' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      const content = {
        chat: ['Welcome to Lab Notebook!', 'Take a quick tour to learn the controls and features.', 'Start tour', 'Skip tour'],
        cookie: ['Your privacy', 'Allow optional cookies for this practice workspace?', 'Accept optional', 'Reject optional'],
        toast: ['Practice saved', 'Your current workspace is ready to continue.', null, 'Dismiss'],
        promo: ['Discover more practice', 'Explore more exercises after completing this task.', 'Show details', 'Not now'],
        banner: ['Workspace notice', 'This practice session works offline.', null, 'Dismiss'],
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
          else { message.textContent = 'Drag the dial to turn it. Use the task instruction to choose the target value.'; primary.hidden = true; }
        };
      }
      const dismiss = u.el('button', 'tour-dismiss', actions, content[3]); dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('skip');
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  env.site({
    name: 'design-rotate-object-dial-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { notebook: { bg: '#f8f4ed', panel: '#f1eee8', fg: '#25272b', muted: '#5a5d63', line: '#bdb8ae' } },
      LOW_THEME: { bg: '#f8f4ed', panel: '#f1eee8', fg: '#25272b', muted: '#5a5d63', line: '#bdb8ae' },
      ACCENTS: ['#ee6a1c'],
      LOW_ACCENTS: ['#ee6a1c'],
      parts: {
        'frame.layout': (base) => (_c) => {
          base(_c);
          _c.display = _c.ctx.display || 'header';
          document.body.className = `lab-notebook instruction-${_c.display}`;
        },
        'frame.placement': (base) => (_c) => {
          base(_c);
          // The notebook always has a bottom dock, including at the smallest viewport.
          Object.assign(_c, { wantFooter: true, nav: false, sidebar: false });
          document.body.classList.toggle('end-away', !['footer', 'link'].includes(_c.placement));
        },
        'frame.header': () => (_c) => {
          const { util: u } = _c;
          const titlebar = u.el('header', 'titlebar', document.body);
          const logo = u.el('i', 'app-logo', titlebar);
          const appGlyph = u.svg('svg', {width:16,height:16,viewBox:'0 0 20 20'}, logo);
          u.svg('path', {d:'M3 3H17V17H3ZM5 6H15M5 9H15M5 12H11M7 4V16',fill:'none',stroke:'#fff','stroke-width':1}, appGlyph);
          u.el('span', 'app-name', titlebar, 'Lab Notebook');
          const menu = u.el('nav', 'menu', titlebar);
          ['File', 'Edit', 'View', 'Tools', 'Help'].forEach((m) => u.el('span', '', menu, m));
          const windowActions = u.el('div', 'window-actions', titlebar);
          for (const action of ['minimize', 'maximize', 'close']) {
            const b = u.el('button', 'window-action ' + action, windowActions);
            b.type = 'button'; b.setAttribute('aria-label', action); icon(b, action, 22);
          }
          const page = u.el('section', 'notebook-page ref-body', document.body);
          u.el('div', 'crumbs', page, 'Experiment  >  Environmental Control');
          Object.assign(_c, { titlebar, windowActions, page, header: page });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => (_c) => {
          base(_c);
          const heading = _c.header.querySelector('.ref-instruction');
          if (heading) heading.classList.add('instruction');
        },
        'frame.tools': (base) => (_c) => {
          base(_c);
          const { headerTools, titlebar, windowActions } = _c;
          headerTools.classList.add('titlebar-tools');
          titlebar.insertBefore(headerTools, windowActions);
          headerTools.querySelectorAll('.ref-xtra').forEach((b) => b.classList.add('chrome-xtra'));
          if (_c.submit) _c.submit.classList.add('submit-button', 'titlebar-submit');
        },
        'frame.body': () => (_c) => {
          const { util: u, page } = _c;
          const side = u.el('div', 'chamber', page);
          u.el('h2', '', side, 'Chamber A');
          u.el('pre', '', side, 'Mode   : Temperature Control\nRange  : 0.0 – 30.0 °C\nStep   : 0.1 °C');
          const controls = u.el('aside', 'control-card', page);
          u.el('div', 'lbl', controls, 'Control');
          u.el('div', 'big', controls, 'Manual');
          u.el('div', 'detail', controls, 'Pointer input');
          u.el('hr', '', controls);
          u.el('div', 'lbl', controls, 'Help');
          u.el('div', 'status', controls, 'Drag the handle to set\nthe value.');
          Object.assign(_c, { body: page });
        },
        'frame.panel': (base) => (_c) => {
          base(_c);
          const panel = _c.body.querySelector('.ref-panel');
          if (panel) panel.classList.add('notebook-note', 'instruction-panel');
        },
        'frame.stage': () => (_c) => {
          const stage = _c.util.el('main', 'cube-stage', _c.body);
          stage.dataset.role = 'stage';
          Object.assign(_c, { stage });
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          const note = document.querySelector('.ref-note');
          if (note) {
            note.classList.add('notebook-note', 'instruction-toast-card');
            _c.page.append(note);
          }
        },
        'frame.footer': (base) => (_c) => {
          base(_c);
          const { util: u, page } = _c;
          const dock = document.querySelector('.ref-foot');
          dock.className = 'dock';
          dock.querySelector('.ref-foot-text').remove();
          const actions = dock.querySelector('.ref-tools');
          actions.className = 'dock-row';
          const group = (title, cls, row) => {
            const g = u.el('div', 'dock-group ' + cls, dock);
            u.el('div', 'dock-title', g, title);
            if (row) { g.append(row); return row; }
            return u.el('div', 'dock-row', g);
          };
          const tool = (row, label, ic, active) => {
            const b = u.el('button', 'tool' + (active ? ' active' : ''), row);
            b.type = 'button';
            if (ic) icon(b, ic, 34);
            u.el('span', '', b, label);
            return b;
          };
          const note = u.el('aside', 'notebook-note', page, 'Use the pointer to rotate. Your current orientation stays in place when you release it.');
          note.hidden = true;
          const notes = tool(group('View', 'g-view'), 'Notes', 'notes');
          notes.onclick = () => { note.hidden = !note.hidden; };
          const controls = group('Controls', 'g-controls');
          tool(controls, 'Temperature', 'temp', true); tool(controls, 'Humidity', 'drop'); tool(controls, 'Fan', 'fan');
          const presets = group('Presets', 'g-presets');
          ['10 °C', '16.5 °C', '20 °C'].forEach((p) => tool(presets, p, null));
          group('Actions', 'g-actions', actions);
          const reset = tool(actions, 'Reset', 'reset');
          reset.classList.add('reset');
          actions.prepend(reset);
          actions.querySelectorAll('.ref-xtra').forEach((b) => b.classList.add('chrome-xtra'));
          if (_c.submit && actions.contains(_c.submit)) _c.submit.classList.add('submit-button');
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          if (_c.placement === 'floating') _c.submit.classList.add('submit-button', 'crumb-submit');
        },
        overlay: () => drawOverlay,
      },
    },
  });
})();
