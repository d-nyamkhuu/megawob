/* Spatial Lab reference frame: kinetic type, framed focus surface, folded command strip. Task state belongs to the rotate task. */
(function () {
  'use strict';
  function drawFoldedStatus(u, parent, onExpand) {
    const strip = u.el('section', 'strip initial-strip', parent);
    const art = u.svg(
      'svg',
      { viewBox: '0 0 1616 260', preserveAspectRatio: 'none', 'aria-hidden': 'true', class: 'strip-art' },
      strip,
    );
    u.svg(
      'path',
      {
        d: 'M0 130H475V0H548V77Q548 137 475 132H0ZM242 260L318 147Q381 205 438 133Q491 209 556 103Q650 -67 711 49Q767 123 806 260ZM865 0H1047V260H806L778 111H865ZM1047 0H1149Q1110 77 1047 86ZM1080 260L1305 0H1409L1238 192V260ZM1306 0L1382 91L1333 145L1268 81ZM1430 0H1518L1604 103L1583 124Z',
        fill: '#071835',
        opacity: '.42',
      },
      art,
    );
    u.svg('path', { d: 'M1404 176H1488V260H1404ZM0 106H10V146H0Z', fill: '#2251c3', opacity: '.52' }, art);
    const status = u.el('div', 'strip-status', strip);
    const left = u.el('div', 'strip-left', status);
    const lab = u.el('div', 'strip-label', left);
    u.el('i', '', lab);
    u.el('span', '', lab, 'TOOLS HIDDEN');
    u.el('div', 'strip-big', left, 'FOCUS ON\nTHE SOLUTION');
    const right = u.el('div', 'strip-right', status);
    u.el('p', '', right, 'Rotation controls and other tools\nare hidden to keep the challenge fair.');
    const expand = u.el('button', 'expand-btn', right);
    expand.type = 'button';
    u.svg('svg', { viewBox: '0 0 20 20', width: 20, height: 20, 'aria-hidden': 'true' }, expand);
    expand.firstChild.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'path'));
    expand.firstChild.firstChild.setAttribute('d', 'M3 7L10 14L17 7');
    u.el('span', '', expand, 'Expand tools');
    expand.onclick = onExpand;
    return { strip, expand };
  }
  function drawOverlay(ctx) {
    const u = ctx.util;
    if (ctx.initial) {
      const { strip, expand } = drawFoldedStatus(u, document.body, () => {
        const tools = document.querySelector('.strip-tools');
        if (tools) tools.hidden = false;
        ctx.dismiss('expand');
      });
      return { el: strip, dismiss: expand };
    }
    const el = u.el('section', 'tour-bubble overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const content = {
      chat: [
        'Welcome to Cube Practice!',
        'Take a quick tour to learn the controls and features.',
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
    const close = u.el('button', 'bubble-close', el, '×');
    close.type = 'button';
    close.setAttribute('aria-label', 'Close notice');
    close.onclick = () => ctx.dismiss('close');
    const message = u.el('p', '', el, content[1]);
    const actions = u.el('div', 'tour-actions', el);
    if (content[2]) {
      const primary = u.el('button', 'tour-primary', actions, content[2]);
      primary.type = 'button';
      primary.onclick = () => {
        if (ctx.kind === 'cookie') ctx.dismiss('accept');
        else {
          message.textContent =
            'Click and drag the cube. Use the task instruction to choose which face should point toward you.';
          primary.hidden = true;
        }
      };
    }
    const dismiss = u.el('button', 'tour-dismiss', actions, content[3]);
    dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('skip');
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  const palette = { bg: '#0b1722', panel: '#162430', fg: '#e6ecf7', muted: '#b5bfd3', line: '#354651' };
  const parts = {
    'frame.layout': (base) => function (_c) {
      base(_c);
      // Both instruction locations fit this frame even at the smallest viewport.
      _c.display = _c.ctx.display || 'header';
      document.body.className = `spatial-cube instruction-${_c.display}`;
    },
    'frame.header': () => function (_c) {
      const { util: u } = _c;
      const head = u.el('header', 'lab-head', document.body);
      const brand = u.el('div', 'brand', head);
      const logo = u.el('span', 'logo', brand, 'SPATIAL ');
      u.el('b', '', logo, 'LAB');
      u.el('span', 'tagline', brand, 'ROTATE OBJECTS.\nSOLVE VISUALLY.\nKEEP GOING.');
      const nav = u.el('nav', 'lab-nav', head);
      ['PUZZLES', 'TRAINING', 'PROGRESS'].forEach((t, i) => {
        if (i) u.el('i', '', nav, '/');
        u.el('span', '', nav, t);
      });
      const page = u.el('section', 'frame ref-body', document.body);
      Object.assign(_c, { header: head, page });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => function (_c) {
      const { ctx, page, util: u } = _c;
      base({ ..._c, header: page });
      const heading = page.querySelector('.ref-instruction');
      if (!heading) return;
      heading.classList.add('instruction');
      heading.textContent = '';
      const headingText = u.el('span', 'instruction-text', heading);
      const parts = ctx.instruction.split(/\b(teal|purple|red|blue|green|yellow|orange|white|black)\b/i);
      parts.forEach((part, i) => {
        const word = u.el('span', i % 2 ? 'instruction-color' : '', headingText, part);
        if (i % 2)
          word.style.color = {
            teal: '#17d5cd',
            purple: '#a28aff',
            red: '#ff657d',
            blue: '#5795ff',
            green: '#39d8a3',
            yellow: '#ffe252',
            orange: '#ffad53',
            white: '#fff',
            black: '#aebdce',
          }[part.toLowerCase()];
      });
    },
    'frame.body': () => function (_c) {
      _c.body = _c.page;
    },
    'frame.panel': (base) => function (_c) {
      const { display, page, util: u } = _c;
      const target = u.el('aside', 'card target-card', page);
      u.el('h2', '', target, 'CUBE');
      u.el('div', 'target-swatch', target, '3D');
      u.el('p', 'task-helper', target, 'Click and drag the cube to rotate it.');
      const tip = u.el('aside', 'card tip-card', page);
      if (display === 'panel') {
        tip.classList.add('instruction-panel');
        base({ ..._c, body: tip });
      } else {
        u.el('h2', '', tip, 'TIP');
        u.el('p', '', tip, 'Click and drag\nto rotate the cube.');
        const mouse = u.svg('svg', { viewBox: '0 0 160 100', 'aria-hidden': 'true' }, tip);
        u.svg(
          'path',
          { d: 'M40 50H12M24 38L12 50L24 62', fill: 'none', stroke: '#e6ecf7', 'stroke-width': 2.5 },
          mouse,
        );
        u.svg(
          'path',
          { d: 'M120 50H148M136 38L148 50L136 62', fill: 'none', stroke: '#e6ecf7', 'stroke-width': 2.5 },
          mouse,
        );
        u.svg(
          'rect',
          { x: 55, y: 4, width: 50, height: 92, rx: 25, fill: 'none', stroke: '#e6ecf7', 'stroke-width': 2.5 },
          mouse,
        );
        u.svg('path', { d: 'M80 4V17M80 32V40M79 78H81', stroke: '#e6ecf7', 'stroke-width': 1.5, fill: 'none' }, mouse);
        u.svg(
          'rect',
          { x: 78, y: 18, width: 4, height: 13, rx: 2, fill: 'none', stroke: '#e6ecf7', 'stroke-width': 1.2 },
          mouse,
        );
      }
    },
    'frame.stage': () => function (_c) {
      const { page, util: u } = _c;
      const stage = u.el('main', 'cube-stage', page);
      stage.dataset.role = 'stage';
      const strip = u.el('section', 'strip', page);
      const tools = u.el('div', 'strip-tools', strip);
      tools.hidden = true;
      u.el('span', 'tools-title', tools, 'TOOLS');
      u.el('span', 'tools-text', tools, 'Drag the cube to rotate it. Reset restores the starting orientation.');
      const reset = u.el('button', 'tool-btn', tools, 'Reset');
      reset.type = 'button';
      reset.dataset.action = 'reset';

      _c.stage = stage;
    },
    'frame.footer': (base) => function (_c) {
      // The design always has a caption/footer, including finish-by-message episodes.
      _c.wantFooter = true;
      base(_c);
      const foot = document.querySelector('.ref-foot');
      foot.classList.add('lab-foot');
      const caption = foot.querySelector('.ref-foot-text');
      caption.classList.add('caption');
      caption.textContent = 'Cube Orientation Challenge';
    },
    overlay: () => drawOverlay,
  };

  env.site({
    name: 'design-rotate-object-cube-12',
    template: 'site/base',
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'banner' },
    design: {
      // Fixed Spatial Lab palette for the shared frame and perturbation surfaces.
      THEMES: { dark: palette }, LOW_THEME: palette,
      ACCENTS: ['#2f6bff'], LOW_ACCENTS: ['#2f6bff'],
      parts,
    },
  });
})();
