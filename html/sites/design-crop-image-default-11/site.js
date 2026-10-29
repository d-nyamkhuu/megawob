// Memphis crop workspace: visual sections on the shared site frame.
(function () {
  'use strict';

  function instructionNote(_c, instruction) {
    const { ctx, note, util: u } = _c;
    note.hidden = false;
    instruction.className = 'instruction';
    note.append(instruction);
    instruction.replaceChildren();
    const secondary = ctx.instruction.match(/\s+Finish by[^]*$/);
    const headline = secondary ? ctx.instruction.slice(0, secondary.index) : ctx.instruction;
    const target = headline.match(/the (?:blue|red|green|yellow|orange|purple|pink|cyan|teal|violet|coral) [a-z]+/i);
    if (target) {
      const at = target.index;
      const lead = headline.slice(0, at);
      for (const token of lead.split(/(around)/i)) {
        if (/^around$/i.test(token)) u.el('span', 'around-accent', instruction, token);
        else instruction.append(document.createTextNode(token));
      }
      u.el('mark', 'target-highlight', instruction, target[0]);
      instruction.append(document.createTextNode(headline.slice(at + target[0].length)));
    } else instruction.textContent = headline;
    if (secondary) u.el('span', 'instruction-secondary', instruction, secondary[0]);
    instruction.classList.toggle('long-copy', ctx.instruction.length > 95);
    u.el(
      'p',
      'crop-help',
      note,
      'Drag the handles to adjust the crop rectangle. Use the corner and side handles to resize the selection.',
    );
  }

  function cropDock(u, fc) {
    const g1 = u.el('div', 'dk-group', fc);
    u.el('div', 'dk-label', g1, 'Crop size (px)');
    const r1 = u.el('div', 'dk-row', g1);
    for (const k of ['W', 'H']) {
      const f = u.el('div', 'dk-field', r1);
      u.el('i', '', f, k);
      u.el('span', '', f, '320');
    }
    const g2 = u.el('div', 'dk-group', fc);
    u.el('div', 'dk-label', g2, 'Aspect ratio');
    const s = u.el('div', 'dk-field dk-select', g2);
    u.el('span', '', s, 'Free');
    const cv = u.svg(
      'svg',
      { width: 18, height: 12, viewBox: '0 0 18 12', fill: 'none', stroke: '#0d1330', 'stroke-width': 2.5 },
      s,
    );
    u.svg('path', { d: 'M2 2L9 9L16 2' }, cv);
    const g3 = u.el('div', 'dk-group dk-hand', fc);
    const hs = u.svg(
      'svg',
      { width: 100, height: 100, viewBox: '0 0 100 100', fill: '#fff', stroke: '#0d1330', 'stroke-width': 3 },
      g3,
    );
    u.svg('rect', { x: 10, y: 10, width: 80, height: 80, fill: 'none' }, hs);
    for (const [x, y] of [
      [10, 10],
      [50, 10],
      [90, 10],
      [10, 50],
      [90, 50],
      [10, 90],
      [50, 90],
      [90, 90],
    ])
      u.svg('rect', { x: x - 8, y: y - 8, width: 16, height: 16 }, hs);
    const t3 = u.el('div', '', g3);
    u.el('b', '', t3, '8 handles:');
    u.el('span', '', t3, '4 corners + 4 side midpoints');
    g3.style.borderRight = '2px solid #8f86c9';
  }

  // The reference's notification stack is the only overlay with a custom design.
  function notificationsOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('section', 'obstruction obstruction-cookie', document.body);
    el.dataset.role = 'overlay';
    const box = u.el('div', 'obstruction-box', el);
    const notificationTitle = u.el('h3', '', box, 'Notifications (4)');
    const notifications = u.el('div', 'notifications', box);
    for (const [name, body] of [
      ['New message', 'You have a new message\nfrom Alex.'],
      ['Weekly digest', 'Your summary is ready\nto view.'],
      ['Product update', 'Check out what’s new\nthis week.'],
      ['Event reminder', 'Design sync starts\nin 1 hour.'],
    ]) {
      const card = u.el('div', 'notification-card', notifications);
      const paths = {
        'New message': 'M7 28H33L29 23V15C29 3 11 3 11 15V23ZM17 31Q20 36 23 31M20 3V7',
        'Weekly digest': 'M5 9H35V32H5ZM5 9L20 22L35 9',
        'Product update': 'M7 17H16L30 9V31L16 23H7Q3 20 7 17ZM12 23L14 34H19L17 24M33 16Q39 20 33 24',
        'Event reminder': 'M7 9H33V34H7ZM7 17H33M13 5V13M27 5V13M20 22V28',
      };
      const icon = u.svg(
        'svg',
        {
          class: 'notification-icon',
          viewBox: '0 0 40 40',
          fill: 'none',
          stroke: '#0d1330',
          'stroke-width': 2.5,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        },
        card,
      );
      u.svg('path', { d: paths[name] }, icon);
      u.el('strong', '', card, name);
      u.el('p', '', card, body);
      const x = u.el('button', 'notification-x', card);
      x.type = 'button';
      x.setAttribute('aria-label', 'Dismiss ' + name);
      const cross = u.svg(
        'svg',
        {
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': 2,
          'stroke-linecap': 'round',
        },
        x,
      );
      u.svg('path', { d: 'M5 5L19 19M19 5L5 19' }, cross);
      x.onclick = () => {
        card.remove();
        const count = notifications.children.length;
        notificationTitle.textContent = 'Notifications (' + count + ')';
        if (!count) {
          ctx.dismiss('close');
        }
      };
    }
    const dismiss = u.el('button', 'dismiss', box, 'Dismiss all');
    dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('close');
    return { el, dismiss, ttlSteps: 0 };
  }

  const parts = {
    'frame.theme': (base) => (_c) => {
      base(_c);
      document.body.className = 'design memphis-crop layout-crop-dock' +
        (_c.ctx.display === 'toast' ? ' has-instruction-toast' : '');
      _c.root.style.setProperty('--font', 'Arial, sans-serif');
    },
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This design has room in the left column for every instruction mode.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      // Keep the shared placement draws within the two regions in this design.
      if (_c.placement === 'icon') _c.placement = 'header';
      if (_c.placement === 'floating') _c.placement = 'footer';
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const { util: u } = _c;
      const shell = u.el('div', 'shell', document.body);
      const header = u.el('header', 'head', shell);
      const content = u.el('div', 'content ref-body', shell);
      const note = u.el('section', 'task-note', content);
      note.hidden = true;
      Object.assign(_c, { shell, header, content, note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base({ ..._c, header: _c.note });
      const instruction = _c.note.querySelector('.ref-instruction');
      if (instruction) instructionNote(_c, instruction);
      _c.note.querySelector('.ref-spacer')?.remove();
    },
    'frame.controls': (base) => (_c) => {
      base(_c);
      const { endBtn, decoyBtn, header } = _c;
      _c.endBtn = (parent, cls, text) => {
        const button = endBtn(parent, cls, text);
        button.classList.add('submit', header.contains(parent) ? 'toolbar-end' : 'dock-end');
        if (cls === 'ref-endlink') button.classList.add('dock-end-link');
        return button;
      };
      _c.decoyBtn = (parent, text, collides) => {
        decoyBtn(parent, text, collides);
        parent.lastElementChild.classList.add('chrome-xtra');
      };
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      if (!_c.headerTools.hasChildNodes()) _c.headerTools.remove();
    },
    'frame.body': () => (_c) => { _c.body = _c.content; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.content.querySelector('.ref-panel');
      if (panel) {
        _c.note.classList.add('instruction-panel');
        instructionNote(_c, panel.querySelector('.ref-panel-text'));
        panel.remove();
      }
    },
    'frame.stage': () => (_c) => {
      const { content, util: u } = _c;
      const stage = u.el('main', 'stage', content);
      stage.dataset.role = 'stage';
      const aside = u.el('aside', 'aside', content);
      u.el('h3', '', aside, 'Notifications (4)');
      Object.assign(_c, { stage, aside });
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const toast = document.querySelector('.ref-note');
      if (toast) {
        _c.note.classList.add('instruction-toast');
        instructionNote(_c, toast.querySelector('.ref-note-text'));
        const close = toast.querySelector('.ref-note-x');
        close.className = 'note-close';
        _c.note.append(close);
        const dismiss = close.onclick;
        close.onclick = (event) => {
          dismiss?.(event);
          _c.note.style.visibility = 'hidden';
        };
        toast.remove();
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const footer = document.querySelector('.ref-foot');
      footer.className = 'footer';
      footer.querySelector('.ref-foot-text').remove();
      const fc = _c.util.el('div', 'footer-copy');
      footer.prepend(fc);
      cropDock(_c.util, fc);
      const tools = footer.querySelector('.ref-tools');
      footer.append(...tools.childNodes);
      tools.remove();
      _c.shell.append(footer);
    },
    'frame.floating': () => () => {},
    overlay: (base) => (ctx) => ctx.kind === 'cookie' ? notificationsOverlay(ctx) : base(ctx),
  };

  env.site({
    name: 'design-crop-image-default-11',
    template: 'site/base',
    styles: ['site.css', 'site2.css', 'templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css'],
    langs: ['en'],
    initialOverlay: { kind: 'cookie' },
    design: {
      THEMES: { light: {
        bg: '#fcf7e9', panel: '#f3f5f7', fg: '#111820', muted: '#657080', line: '#c9cfd5',
      } },
      LOW_THEME: { bg: '#fcf7e9', panel: '#f3f5f7', fg: '#111820', muted: '#657080', line: '#c9cfd5' },
      ACCENTS: ['#2c76ff'],
      LOW_ACCENTS: ['#2c76ff'],
      parts,
    },
  });
})();
