(function () {
  'use strict';
  const palette = { bg: '#0c2d58', panel: '#efe3c8', fg: '#2a1a08', muted: '#5a4a30', line: '#b9a77c' };
  const artwork = (u, parent, cls, viewBox) => {
    const svg = u.svg('svg', { class: cls, viewBox, preserveAspectRatio: 'none', 'aria-hidden': 'true' }, parent);
    u.svg('image', { href: 'sites/design-reorder-items-list-09/assets/reference-art.webp', width: 1672, height: 941 }, svg);
    return svg;
  };
  const fitInstruction = (container) => {
    const instruction = container.querySelector('.ref-instruction');
    if (instruction && instruction.scrollWidth > instruction.clientWidth) {
      const font = parseFloat(getComputedStyle(instruction).fontSize);
      instruction.style.fontSize = ((font * instruction.clientWidth) / instruction.scrollWidth) * 0.98 + 'px';
    }
  };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('design', 'memphis', 'cdrom');
      document.body.classList.toggle('has-instruction-toast', _c.display === 'toast');
      document.documentElement.style.setProperty('--font', "Georgia, 'Times New Roman', serif");
      const shell = u.el('div', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      artwork(u, head, 'cd-logo', '30 16 140 92');
      const texture = u.svg('svg', { class: 'cd-texture', viewBox: '0 0 1672 941', preserveAspectRatio: 'none', 'aria-hidden': 'true' }, shell);
      const defs = u.svg('defs', {}, texture);
      const pattern = u.svg('pattern', { id: 'cd-paper', width: 300, height: 600, patternUnits: 'userSpaceOnUse' }, defs);
      const tile = u.svg('svg', { id: 'cd-grain', width: 150, height: 300, viewBox: '30 550 150 300', preserveAspectRatio: 'none' }, defs);
      u.svg('image', { href: 'sites/design-reorder-items-list-09/assets/reference-art.webp', width: 1672, height: 941 }, tile);
      for (const transform of ['', 'translate(300 0) scale(-1 1)', 'translate(0 600) scale(1 -1)', 'translate(300 600) scale(-1 -1)'])
        u.svg('use', { href: '#cd-grain', transform }, pattern);
      u.svg('rect', { width: 1672, height: 941, fill: 'url(#cd-paper)' }, texture);
      u.el('div', 'cd-stage-frame', shell);
      const ttl = u.el('div', 'cd-title', head);
      u.el('span', 'cd-the', ttl, 'The');
      u.el('span', 'cd-name', ttl, 'Learning Library');
      const tag = u.el('div', 'cd-tag', head);
      for (const [i, w] of ['Explore', 'Learn', 'Grow'].entries()) {
        if (i) u.el('i', 'dia', tag, '✦');
        u.el('em', '', tag, w);
      }
      Object.assign(_c, { shell, head });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const nav = u.el('nav', 'cd-nav', _c.shell);
      for (const [i, name] of ['Home', 'Topics', 'Activities', 'Settings'].entries()) {
        const b = u.el('button', 'cd-navbtn' + (name === 'Activities' ? ' on' : ''), nav);
        b.type = 'button';
        artwork(u, b, 'cd-ico', `34 ${[181, 268, 357, 449][i]} 46 46`);
        u.el('span', '', b, name);
        b.onclick = () => {
          nav.querySelectorAll('.cd-navbtn').forEach((x) => x.classList.remove('on'));
          b.classList.add('on');
        };
      }
      const tabs = u.el('div', 'cd-tabs', _c.shell);
      for (const [i, t] of ['Practice', 'Reference', 'Quiz'].entries()) {
        const b = u.el('button', 'cd-tab' + (i === 0 ? ' on' : ''), tabs, t);
        b.type = 'button';
        b.onclick = () => {
          tabs.querySelectorAll('.cd-tab').forEach((x) => x.classList.remove('on'));
          b.classList.add('on');
        };
      }
      const sheet = u.el('section', 'cd-sheet', _c.shell);
      const note = u.el('section', 'task-note', sheet);
      note.hidden = _c.display === 'hidden' || _c.display === 'toast';
      note.classList.toggle('instruction-panel', _c.display === 'panel');
      const art = u.el('div', 'cd-art', _c.shell);
      artwork(u, art, 'cd-pic', '1450 140 204 350');
      const cap = u.el('div', 'cd-cap', art);
      u.el('span', '', cap, 'Knowledge Opens New Worlds');
      const tools = u.el('div', 'cd-tools', _c.shell);
      u.el('h3', '', tools, 'Tools');
      const reset = u.el('button', 'cd-tool', tools);
      reset.type = 'button';
      artwork(u, reset, 'cd-tic', '1471 591 40 43');
      u.el('span', '', reset, 'Reset List');
      reset.onclick = () => { env.widgetDef.clear?.(); };
      const hint = u.el('button', 'cd-tool', tools);
      hint.type = 'button';
      artwork(u, hint, 'cd-tic q', '1471 676 36 36');
      u.el('span', '', hint, 'Show Hint');
      hint.onclick = () => env.log('hint', {});
      Object.assign(_c, { sheet, header: note, toolbar: tools });
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        fitInstruction(_c.header);
        _c.util.el('p', 'cd-sub', _c.header, 'Drag the items into the correct order.');
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.shell; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const text = _c.header.querySelector('.ref-panel-text');
      if (text) {
        text.classList.add('instruction');
        _c.util.el('p', 'cd-sub', _c.header, 'Drag the items into the correct order.');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.shell);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note', 'instruction-toast');
        note.querySelector('.ref-note-text').classList.add('instruction');
        note.querySelector('.ref-note-x').classList.add('note-close');
        _c.shell.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        _c.shell.appendChild(foot);
        _c.foot = foot;
      }
    },
    'frame.floating': (base) => (_c) => { base(_c); },
    overlay: () => (ctx) => {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const title = {
        cookie: 'Your privacy',
        toast: 'Changes saved',
        chat: 'Support',
        promo: 'Workspace update',
        banner: 'Service notice',
      }[kind];
      const text = {
        cookie: 'This application stores optional cookies.',
        toast: 'Your changes have been saved.',
        chat: 'Need a hand with this workspace?',
        promo: 'Explore the latest workspace features.',
        banner: 'You are viewing a shared workspace.',
      }[kind];
      const label = kind === 'cookie' ? 'Reject optional' : 'Close';
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, label);
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      if (kind === 'cookie') {
        const accept = u.el('button', 'dismiss', box, 'Accept optional');
        accept.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  };
  env.site({
    name: 'design-reorder-items-list-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'cdrom.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#d9a93a'], LOW_ACCENTS: ['#d9a93a'], parts,
    },
  });
})();
