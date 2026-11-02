(function () {
  'use strict';
  const palette = {
    bg: '#ffffff', panel: '#ffffff', fg: '#222a30',
    muted: '#5d666d', line: '#e3e7ea',
    font: "'Noto Sans','Segoe UI','Source Sans Pro','Helvetica Neue',Arial,sans-serif",
  };
  const railItems = [
    ['Search', 'M10.5 3a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15M16 16l5 5'],
    ['Library', 'M6 2h11l3 4v16H4V4Q4 2 6 2zM15 2v5h5M8 9h3M8 13h8M8 17h6'],
    ['Saved', 'M5 3h14v18l-7-4.5L5 21z'],
    ['History', 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 7v5.5l3.5 2'],
    ['Settings', 'M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zM10.5 2.5h3l.5 2.4 1.9.8 2.1-1.3 2.1 2.1-1.3 2.1.8 1.9 2.4.5v3l-2.4.5-.8 1.9 1.3 2.1-2.1 2.1-2.1-1.3-1.9.8-.5 2.4h-3l-.5-2.4-1.9-.8-2.1 1.3-2.1-2.1 1.3-2.1-.8-1.9-2.4-.5v-3l2.4-.5.8-1.9-1.3-2.1 2.1-2.1 2.1 1.3 1.9-.8z'],
  ];
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = _c.placement === 'footer' || _c.placement === 'link';
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('instruction-' + _c.display);
      const shell = u.el('div', 'site-shell', document.body);
      const rail = u.el('nav', 'command-rail', shell);
      railItems.forEach(([label, path], i) => {
        const it = u.el('div', 'rail-item' + (i === 0 ? ' on' : '') + (i === railItems.length - 1 ? ' last' : ''), rail);
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p.setAttribute('d', path);
        svg.append(p);
        it.append(svg);
        u.el('span', '', it, label);
      });
      const main = u.el('div', 'main-col', shell);
      const header = u.el('section', 'task-note', main);
      Object.assign(_c, { shell, main, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.dataset.role = 'instruction';
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      // With no header note or header end control, keep incidental tools
      // in the bottom strip so the original stage origin stays unchanged.
      if (_c.display !== 'header' && _c.placement !== 'header' && _c.placement !== 'icon') {
        _c.headerTools.remove();
        _c.bottomTools = _c.headerTools;
      }
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'stage-region', _c.main);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.querySelector('.ref-panel-title').textContent = 'Your task';
        panel.querySelector('.ref-panel-text').dataset.role = 'instruction';
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
      _c.body.prepend(_c.stage);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.querySelector('.ref-note-text').dataset.role = 'instruction';
        _c.main.append(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.querySelector('.ref-foot-text').remove();
        if (_c.bottomTools) foot.prepend(_c.bottomTools);
        _c.main.append(foot);
        _c.foot = foot;
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        if (_c.bottomTools && !_c.foot) dock.prepend(_c.bottomTools);
        _c.main.append(dock);
      } else if (_c.bottomTools && !_c.foot) {
        const strip = _c.util.el('div', 'bottom-tools', _c.main);
        strip.append(_c.bottomTools);
      }
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
      };
      let [title, copy, label] = texts[ctx.kind];
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', title);
      u.el('h2', '', el, title);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      if (ctx.kind === 'cookie') {
        const accept = u.el('button', '', actions, 'Accept all');
        accept.addEventListener('click', () => ctx.dismiss());
      }
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-use-shop-search-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-use-shop-search-07': palette },
      LOW_THEME: palette,
      ACCENTS: ['#26936f'],
      LOW_ACCENTS: ['#26936f'],
      parts,
    },
  });
})();
