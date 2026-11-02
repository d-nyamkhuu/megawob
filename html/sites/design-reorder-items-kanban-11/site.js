(function () {
  'use strict';
  function icon(u, parent, kind, cls) {
    const shapes = {
      document: '<path fill="#fff" d="M7 3h15l5 5v22H7z"/><path d="M22 3v6h5M10 12h13M10 15h13M10 18h13M10 21h13M10 24h13M10 27h13"/><path fill="#ddd" d="M3 7h4v23h16v2H3z"/>',
      folder: '<path fill="#eee" d="M3 9V6h10l4 4h11v17H3z"/><path fill="#ddd" d="M3 27l5-14h22l-5 14z"/><path d="M7 5h6l4 3h10"/>',
      help: '<path fill="#eee" d="M9 2h16v22h-7v7h-6v-7H7V6z"/><path d="M12 10c0-6 10-6 10 0 0 4-6 3-6 8M16 20v2" stroke-width="3"/>',
      printer: '<path fill="#fff" d="M9 2h14v9H9z"/><path fill="#ddd" d="M4 11h24v17H4z"/><path fill="#fff" d="M9 18h14v13H9z"/><path d="M11 5h10M11 8h10M11 22h10M11 25h10M11 28h10M7 14h3"/>',
      clock: '<path fill="#ddd" d="M3 2h27v29H3z"/><rect x="7" y="6" width="19" height="20" fill="#fff"/><circle cx="16" cy="16" r="7"/><path d="M16 10v6l4 2"/>',
      bulb: '<path fill="#ffe640" d="M16 2C4 2 2 16 10 23l2 7h8l2-7C30 16 28 2 16 2z"/><path fill="#00b1ed" d="M12 29h8v9h-8z"/><path d="M13 32h6M13 35h6M14 38h4M15 29l-3-13 4 4 4-4-3 13"/><path stroke="#fff" d="M9 9l3-3h5"/>',
      workplace: '<path fill="#eee" d="M2 2h22v24H2z"/><path fill="#00bdd2" d="M4 4h18v14H4z"/><path fill="#fff" d="M14 9h14v22H14z"/><path d="M17 13h8M17 16h8M17 19h8M17 22h8M17 25h8"/><path fill="#fff" d="M6 9h4l3 12H4z"/><path d="M5 24h7M5 27h7"/>',
      app: '<path fill="#fff" d="M3 2h24v28H3z"/><path fill="#00c4dc" d="M5 4h20v10H5z"/><path d="M7 6v6M10 6v6M13 7l3 4M20 6v6M6 17h17M6 20h7M16 20h7M6 23h17M6 26h17"/><path fill="#ddd" d="M25 3h4v28H7v-2h20V5z"/>'
    };
    const el = u.el('span', 'pixel-icon ' + (cls || ''), parent);
    el.innerHTML = '<svg viewBox="0 0 32 ' + (kind === 'bulb' ? '40' : '32') + '" aria-hidden="true" fill="none" stroke="#151515" stroke-width="1.6" stroke-linejoin="miter">' + shapes[kind] + '</svg>';
    return el;
  }
  const palette = { bg: '#dddddd', panel: '#d0d0d0', fg: '#000000', muted: '#777777', line: '#888888' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The desktop has dedicated space to the left for every instruction mode.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('design', 'os2');
      const shell = u.el('div', 'shell', document.body);
      const top = u.el('div', 'topbar', shell);
      icon(u, top, 'workplace', 'ico');
      u.el('span', 'tb-name', top, 'OS/2   Workplace Shell');
      u.el('span', 'tb-clock', top, 'Mon  Apr 4, 1994   10:24 AM');
      icon(u, top, 'clock', 'system-clock');
      const win = u.el('div', 'win', shell);
      const tbar = u.el('div', 'wtitle', win);
      icon(u, tbar, 'app', 'ico');
      u.el('span', 'wt-name', tbar, 'Card Sort - Workplace');
      const controls = u.el('span', 'wt-btns', tbar);
      for (const glyph of ['▴', '□', '×']) u.el('span', 'window-control', controls, glyph);
      const menu = u.el('div', 'wmenu', win);
      for (const m of ['File', 'Edit', 'View', 'Help']) u.el('span', '', menu, m);
      const tabs = u.el('nav', 'wtabs', win);
      for (const name of ['Sort Cards', 'Notes', 'About']) {
        const tab = u.el('button', 'wtab' + (name === 'Sort Cards' ? ' active' : ''), tabs, name);
        tab.type = 'button';
        tab.onclick = () => env.log('notebook-tab', { name });
      }
      const tools = u.el('div', 'wtools', win);
      for (const g of ['document', 'folder', 'help']) icon(u, u.el('span', 'wtool', tools), g);
      const task = u.el('div', 'taskbar', shell);
      const first = u.el('span', 'tk', task);
      icon(u, first, 'workplace'); u.el('span', '', first, 'Workplace Shell');
      const second = u.el('span', 'tk tk2', task);
      icon(u, second, 'app'); u.el('span', '', second, 'Card Sort - Workplace');
      const taskTools = u.el('span', 'task-tools', task);
      for (const g of ['printer', 'document']) icon(u, u.el('span', 'task-tool', taskTools), g);
      u.el('span', 'tk-clock', task, '10:24 AM');
      const note = u.el('header', 'task-note', shell);
      note.hidden = _c.display === 'hidden';
      note.classList.toggle('instruction-panel', _c.display === 'panel');
      note.classList.toggle('instruction-toast', _c.display === 'toast');
      Object.assign(_c, { shell, win, menu, header: note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'page', _c.win);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.header.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.body.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'obstruction obstruction-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const titles = { cookie: 'Privacy notice', toast: 'Changes saved', chat: 'Help', promo: 'Notebook news', banner: 'Notice' };
      const th = u.el('h3', '', box, 'Tip of the day');
      icon(u, th, 'app', 'tip-icon');
      const x = u.el('span', 'tip-x', th, '✕');
      const body = u.el('div', 'tip-body', box);
      icon(u, body, 'bulb', 'tip-bulb');
      const advice = u.el('p', '', body);
      u.el('span', 'tip-line', advice, 'You can drag cards with the mouse');
      u.el('span', 'tip-line', advice, 'and drop them into the correct column.');
      const cb = u.el('label', 'tip-cb', box);
      const inp = u.el('input', '', cb); inp.type = 'checkbox';
      u.el('span', '', cb, 'Do not show again');
      const dismiss = u.el('button', 'dismiss', box, 'Close');
      x.onclick = () => ctx.dismiss('close');
      dismiss.type = 'button'; dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
    }
  };
  env.site({
    name: 'design-reorder-items-kanban-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#00c4dc'], LOW_ACCENTS: ['#00c4dc'], parts,
    },
  });
})();
