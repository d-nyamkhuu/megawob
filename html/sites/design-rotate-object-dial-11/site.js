// FocusLab frame: design-specific sections on the shared site template.
(function () {
  'use strict';
  function icon(parent) {
    const svg = env.util.svg('svg', { width: 25, height: 25, viewBox: '0 0 28 28', 'aria-hidden': 'true' }, parent);
    env.util.svg('path', { d: 'M5 5L21 21M21 5L5 21', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.7 }, svg);
  }

  function styleInstruction(heading, instruction, className) {
    const u = env.util;
    heading.className = className;
    heading.textContent = '';
    const m = /^(.*?)(\s+to\s+)(-?\d[\d.,]*\s*[^\s(]*(?:\s*\(±[^)]*\))?\.?)$/i.exec(instruction || '');
    if (m) {
      heading.append(document.createTextNode(m[1]));
      const line = u.el('span', 'instruction-value', heading, 'to ');
      u.el('span', 'hl', line, m[3]);
    } else {
      const value = /(-?\d[\d.,]*\s*[^\s(.]*(?:\s*\(±[^)]*\))?\.?)$/.exec(instruction || '');
      if (value) {
        heading.append(document.createTextNode(instruction.slice(0, value.index)));
        u.el('span', 'hl', heading, value[1]);
      } else heading.textContent = instruction;
    }
  }

  function drawOverlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'tour-bubble overlay-' + ctx.kind + (ctx.initial ? ' reference-initial' : ''), document.body);
      el.setAttribute('role', 'dialog');
      const content = {
        chat: ['A new version is available', 'FocusLab 2.4 includes performance improvements and bug fixes.', 'Update now', 'Remind me later'],
        cookie: ['Your privacy', 'Allow optional cookies for this practice workspace?', 'Accept optional', 'Reject optional'],
        toast: ['Practice saved', 'Your current workspace is ready to continue.', null, 'Dismiss'],
        promo: ['Discover more practice', 'Explore more exercises after completing this task.', 'Show details', 'Not now'],
        banner: ['Workspace notice', 'This practice session works offline.', null, 'Dismiss'],
      }[ctx.kind];
      u.el('div', 'warn-icon', el, '!');
      u.el('h2', '', el, content[0]);
      const close = u.el('button', 'bubble-close', el);
      close.type = 'button'; close.setAttribute('aria-label', 'Close notice'); icon(close);
      close.onclick = () => ctx.dismiss('close');
      const message = u.el('p', '', el, content[1]);
      const actions = u.el('div', 'tour-actions', el);
      if (content[2]) {
        const primary = u.el('button', 'tour-primary', actions, content[2]); primary.type = 'button';
        primary.onclick = () => {
          ctx.dismiss('accept');
        };
      }
      const dismiss = u.el('button', 'tour-dismiss', actions, content[3]); dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('skip');
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  const parts = {
    'frame.layout': (base) => function (_c) {
      base(_c);
      // All four instruction modes fit the fixed two-pane frame, even at 1024px.
      _c.display = _c.ctx.display;
      document.body.className = `focuslab instruction-${_c.display}`;
    },
    'frame.placement': (base) => function (_c) {
      base(_c);
      // The design always has a footer; the template still chooses controls and labels.
      _c.wantFooter = true;
    },
    'frame.header': () => function (_c) {
      const { util: u } = _c;
      const header = u.el('header', 'topbar', document.body);
      const logo = u.el('span', 'logo-mark', header); u.el('i', '', logo);
      u.el('b', 'brand', header, 'FocusLab');
      u.el('span', 'tagline', header, 'Tools for a calmer day');
      const status = u.el('div', 'status', header);
      u.el('i', 'status-dot', status); u.el('span', '', status, 'Session Paused');
      u.el('i', 'status-bar', status); u.el('span', '', status, '10:24 AM');

      const left = u.el('section', 'pane-left', document.body);
      u.el('div', 'eyebrow', left, 'TIMER TASK');
      Object.assign(_c, { header, left });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => function (_c) {
      base({ ..._c, header: _c.left });
      const heading = _c.left.querySelector('.ref-instruction');
      if (heading) styleInstruction(heading, _c.ctx.instruction, 'instruction');
    },
    'frame.body': () => function (_c) {
      const { util: u, left } = _c;
      const steps = u.el('ol', 'steps', left);
      ['Click and drag the knob to rotate it.', 'The scale shows the available values.', 'The current value appears below the dial.']
        .forEach((t, i) => { const li = u.el('li', '', steps); u.el('b', '', li, String(i + 1)); u.el('span', '', li, t); });
      const tg = u.el('div', 'target-card', left);
      const bull = u.svg('svg', { viewBox: '0 0 100 100', class: 'bull', 'aria-hidden': 'true' }, tg);
      [[44, 8], [29, 8], [14, 8]].forEach(([r, w]) => u.svg('circle', { cx: 50, cy: 50, r, fill: 'none', stroke: '#c9201d', 'stroke-width': w }, bull));
      u.svg('circle', { cx: 50, cy: 50, r: 8, fill: '#c9201d' }, bull);
      const tt = u.el('div', 'target-text', tg);
      u.el('div', 'tl', tt, 'Dial control');
      u.el('div', 'tv', tt, 'Adjust freely');
      u.el('div', 'tr', tt, 'Drag the knob to change its value.');
      const body = u.el('section', 'pane-right ref-body', document.body);
      Object.assign(_c, { body, steps });
    },
    'frame.panel': (base) => function (_c) {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.className = 'instruction-panel-shell';
        panel.querySelector('.ref-panel-title').hidden = true;
        styleInstruction(panel.querySelector('.ref-panel-text'), _c.ctx.instruction,
          'instruction instruction-panel');
        _c.steps.before(panel);
      }
    },
    'frame.stage': () => function (_c) {
      const stage = _c.util.el('main', 'cube-stage', _c.body);
      stage.dataset.role = 'stage';
      _c.stage = stage;
    },
    'frame.toast': (base) => function (_c) {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (note) {
        note.className = 'instruction-toast-shell';
        const heading = note.querySelector('.ref-note-text');
        styleInstruction(heading, _c.ctx.instruction, 'instruction instruction-toast');
        const close = note.querySelector('.ref-note-x');
        close.className = 'instruction-dismiss';
        close.textContent = 'Close';
        heading.append(close);
        _c.steps.before(note);
      }
    },
    'frame.footer': (base) => function (_c) {
      base(_c);
      const foot = document.querySelector('.ref-foot');
      foot.className = 'footbar';
      foot.querySelector('.ref-foot-text').remove();
      const brand = _c.util.el('b', '', foot, 'FocusLab');
      foot.prepend(brand);
      const links = _c.util.el('nav', '', foot);
      ['Help', 'Terms', 'Privacy'].forEach((t) => _c.util.el('span', '', links, t));
    },
    overlay: () => drawOverlay,
  };

  env.site({
    name: 'design-rotate-object-dial-11',
    template: 'site/base',
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'chat' },
    design: {
      LANGS: ['en'],
      THEMES: { focuslab: { bg: '#f6f0e8', panel: '#fff9f1', fg: '#111', muted: '#444', line: '#aaa' } },
      LOW_THEME: { bg: '#f6f0e8', panel: '#fff9f1', fg: '#111', muted: '#444', line: '#aaa' },
      ACCENTS: ['#d92b25'], LOW_ACCENTS: ['#d92b25'],
      parts,
    },
  });
})();
