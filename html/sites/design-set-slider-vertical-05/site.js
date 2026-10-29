/* SGI IRIX 1997 "Image Adjust" task sheet with a thin numbered side index. */
(function () {
  'use strict';
  const MENUS = ['Workstation', 'File', 'Edit', 'Image', 'Options', 'Help'];
  const TOOLS = ['Select', 'Adjust', 'Filters', 'Crop', 'Annotate', 'Prefs'];
  function toolIcon(u, kind, parent) {
    const s = u.svg('svg', { viewBox: '0 0 40 40', class: 'tool-icon', 'aria-hidden': 'true' }, parent);
    s.dataset.icon = kind;
    const defs = u.svg('defs', {}, s);
    const grad = u.svg('radialGradient', { id: 'shade-' + kind, cx: '28%', cy: '22%', r: '76%' }, defs);
    for (const [offset, color] of [
      [0, kind === 'Adjust' ? '#eee2ff' : '#eeeeef'],
      [0.35, kind === 'Adjust' ? '#b4a1e6' : '#a9adb1'],
      [1, kind === 'Adjust' ? '#34225c' : '#30333a'],
    ])
      u.svg('stop', { offset, 'stop-color': color }, grad);
    const metal = u.svg('linearGradient', { id: 'metal-' + kind }, defs);
    for (const [offset, color] of [
      [0, '#f4f3f5'],
      [0.25, '#c5c7cb'],
      [0.65, '#747880'],
      [1, '#24282e'],
    ])
      u.svg('stop', { offset, 'stop-color': color }, metal);
    if (kind === 'Select')
      u.svg(
        'path',
        {
          d: 'M10 4 L10 32 L17 25 L22 36 L26 34 L21 24 L31 24 Z',
          fill: '#d9d9e6',
          stroke: '#1e2230',
          'stroke-width': 1.5,
        },
        s,
      );
    else if (kind === 'Adjust') {
      u.svg('circle', { cx: 20, cy: 20, r: 15, fill: '#7d66d8', stroke: '#2a2350', 'stroke-width': 1.5 }, s);
      u.svg('ellipse', { cx: 15, cy: 13, rx: 6, ry: 4, fill: '#cfc6ff' }, s);
    } else if (kind === 'Filters') {
      u.svg(
        'path',
        { d: 'M20 4 L35 12 L35 28 L20 36 L5 28 L5 12 Z', fill: '#8d8f9a', stroke: '#1e2230', 'stroke-width': 1.5 },
        s,
      );
      u.svg('path', { d: 'M5 12L20 20L20 36L5 28Z', fill: '#a4a7aa' }, s);
      u.svg('path', { d: 'M20 20L35 12L35 28L20 36Z', fill: '#343840' }, s);
      u.svg(
        'path',
        { d: 'M5 12 L20 20 L35 12 M20 20 L20 36', fill: 'none', stroke: '#1e2230', 'stroke-width': 1.2 },
        s,
      );
    } else if (kind === 'Crop')
      u.svg('path', { d: 'M20 3 L34 34 Q20 40 6 34 Z', fill: '#8d8f9a', stroke: '#1e2230', 'stroke-width': 1.5 }, s);
    else if (kind === 'Annotate') {
      u.svg('ellipse', { cx: 20, cy: 22, rx: 18, ry: 13, fill: '#8d8f9a', stroke: '#1e2230', 'stroke-width': 1.5 }, s);
      u.svg('ellipse', { cx: 20, cy: 18, rx: 10, ry: 6, fill: '#343840', stroke: '#bdc0c6', 'stroke-width': 2 }, s);
      u.svg('path', { d: 'M11 20 Q20 15 29 20', fill: 'none', stroke: '#14191e', 'stroke-width': 2 }, s);
    } else {
      u.svg('rect', { x: 5, y: 5, width: 30, height: 30, fill: '#8d8f9a', stroke: '#1e2230', 'stroke-width': 1.5 }, s);
      u.svg('path', { d: 'M20 5 V35 M5 20 H35', stroke: '#1e2230', 'stroke-width': 1.5 }, s);
    }
    if (kind !== 'Filters') {
      const shape = s.querySelector('path, circle, ellipse, rect');
      if (shape) shape.setAttribute('fill', 'url(#shade-' + kind + ')');
      if (shape && (kind === 'Crop' || kind === 'Select')) shape.setAttribute('fill', 'url(#metal-' + kind + ')');
    }
    if (kind === 'Prefs')
      for (const x of [8, 22])
        for (const y of [8, 22])
          u.svg(
            'rect',
            { x, y, width: 10, height: 10, rx: 1, fill: 'url(#shade-Prefs)', stroke: '#c1c3ca', 'stroke-width': 1 },
            s,
          );
  }
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('aside', 'irix-dialog overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const title = {
      chat: 'Feedback',
      cookie: 'Preferences',
      toast: 'Notice',
      promo: 'Upgrade Available',
      banner: 'System Notice',
    }[ctx.kind];
    const bar = u.el('div', 'dlg-title', el, title);
    const x = u.el('button', 'dlg-x', bar, '×');
    x.type = 'button';
    x.setAttribute('aria-label', 'Close notice');
    x.onclick = () => ctx.dismiss('close');
    u.el(
      'p',
      'dlg-text',
      el,
      {
        chat: 'Rate this tool window.',
        cookie: 'Remember window layout between sessions?',
        toast: 'Image settings saved to the session.',
        promo: 'Install the Image Tools 2.0 patch set.',
        banner: 'The workstation will be rebooted tonight.',
      }[ctx.kind],
    );
    const dismiss = u.el('button', 'primary', el, ctx.kind === 'cookie' ? 'Reject optional' : 'Dismiss');
    dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('dismiss');
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  const palette = { bg: '#737780', panel: '#7d8088', fg: '#08090b', muted: '#1d202c', line: '#35373e' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.className = `irix instruction-${_c.display}`;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const bar = u.el('header', 'menubar', document.body);
      const logo = u.svg('svg', { viewBox: '0 0 30 30', class: 'logo', 'aria-hidden': 'true' }, bar);
      u.svg('path', {
        d: 'M15 3 L26 9 L26 21 L15 27 L4 21 L4 9 Z M4 9 L15 15 L26 9 M15 15 V27',
        fill: 'none', stroke: '#b9b4ec', 'stroke-width': 1.8,
      }, logo);
      u.el('span', 'irix-word', bar, 'IRIX');
      const menus = u.el('nav', 'menus', bar);
      MENUS.forEach((m) => u.el('span', '', menus, m));
      u.el('span', 'clock', bar, 'Mon Apr 14  10:27 AM');
      const index = u.el('nav', 'side-index', document.body);
      for (let i = 1; i <= 20; i++) u.el('span', i === 1 ? 'on' : '', index, String(i));
      const win = u.el('div', 'window', document.body);
      const header = u.el('div', 'titlebar', win);
      const titleIcon = u.el('span', 'title-icon', header);
      u.el('span', '', titleIcon, '▱');
      u.el('span', 'title-text', header, 'Image Adjust');
      const wb = u.el('span', 'title-btns', header);
      u.el('i', 'wb-min', wb);
      u.el('i', 'wb-max', wb);
      u.el('i', 'wb-close', wb);
      // Create the sheet here so the template's instruction section can fill it.
      const body = u.el('div', 'win-body ref-body', win);
      Object.assign(_c, { win, header, wb, body });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      if (_c.display !== 'header') return;
      const note = _c.util.el('div', 'task-note', _c.body);
      base({ ..._c, header: note });
      note.querySelector('.ref-instruction').classList.add('instruction');
      let fontSize = parseFloat(getComputedStyle(note).fontSize);
      while (note.scrollHeight > note.clientHeight + 1 && fontSize > 14) note.style.fontSize = --fontSize + 'px';
    },
    'frame.controls': (base) => (_c) => {
      base(_c);
      const endBtn = _c.endBtn;
      _c.endBtn = (parent, cls, text) => {
        const button = endBtn(parent, cls, text);
        button.classList.add(cls === 'ref-endlink' ? 'end-link' : 'primary');
        return button;
      };
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.header.insertBefore(_c.headerTools, _c.wb);
      if (_c.headerTools.children.length) _c.header.classList.add('has-end');
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) {
        note.classList.add('task-note');
        note.querySelector('.ref-panel-title').classList.add('note-caption');
        note.querySelector('.ref-panel-text').classList.add('instruction');
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const panel = u.el('div', 'panel', _c.body);
      u.el('div', 'photo', panel);
      const stage = u.el('main', 'record-stage', panel);
      stage.dataset.role = 'stage';
      const side = u.el('aside', 'tools', _c.body);
      u.el('div', 'tools-head', side, 'Tools');
      TOOLS.forEach((t) => {
        if (t === 'Prefs') u.el('hr', '', side);
        const b = u.el('div', 'tool' + (t === 'Adjust' ? ' on' : ''), side);
        toolIcon(u, t, b);
        u.el('span', '', b, t);
      });
      Object.assign(_c, { stage });
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (note) {
        _c.body.append(note);
        note.classList.add('task-note');
        note.querySelector('.ref-note-text').classList.add('instruction');
        note.querySelector('.ref-note-x').classList.add('instruction-close');
        _c.util.el('div', 'note-caption', note, 'Image Adjust — Task');
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const footer = document.querySelector('.ref-foot') || u.el('footer', '', _c.win);
      _c.win.append(footer);
      footer.className = 'win-footer';
      const text = footer.querySelector('.ref-foot-text');
      if (text) text.remove();
      const footerTools = footer.querySelector('.ref-tools') || u.el('div', 'ref-tools', footer);
      _c.decoyBtn(footer, 'Reset');
      const reset = footer.lastElementChild;
      reset.classList.add('reset');
      reset.dataset.action = 'reset';
      footer.prepend(reset);
      _c.decoyBtn(footer, 'Cancel');
      const cancel = footer.lastElementChild;
      cancel.classList.add('cancel');
      cancel.setAttribute('aria-disabled', 'true');
      footer.append(footerTools);
      Object.assign(_c, { footerTools });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) _c.footerTools.append(dock);
    },
    // Keep the local, beveled IRIX dialogs; other hooks come from site/base.
    overlay: () => drawOverlay,
  };
  env.site({
    name: 'design-set-slider-vertical-05',
    template: 'site/base',
    langs: ['en'],
    design: {
      THEMES: { irix: palette },
      LOW_THEME: palette,
      ACCENTS: ['#7d66d8'],
      LOW_ACCENTS: ['#7d66d8'],
      parts,
    },
  });
})();
