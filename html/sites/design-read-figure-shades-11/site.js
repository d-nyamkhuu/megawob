(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-shades-11',
    'title': 'Color Training',
    'menu': ['File', 'Edit', 'View', 'Help'],
    'apps': ['Applications', 'Places', 'System'],
    'clock': 'Mon Apr 17, 2006    10:24 AM',
  };
  const icons = {
    bulb: '<defs><radialGradient id="bulb"><stop stop-color="#fffde1"/><stop offset=".7" stop-color="#ffe580"/><stop offset="1" stop-color="#d9a634"/></radialGradient></defs><path d="M13 38C13 28 4 27 4 17a15 15 0 0 1 30 0c0 10-9 11-9 21" fill="url(#bulb)" stroke="#8c641e" stroke-width="2"/><path d="M13 36h12v12q-6 6-12 0z" fill="#b8b9af" stroke="#575b58" stroke-width="2"/><path d="M13 39h12m-12 5h12m-11 4h10M16 36l-3-19 6 3 6-3-4 19" fill="none" stroke="#8c7d53" stroke-width="1.5"/><path d="M8 15q1-9 10-9" fill="none" stroke="white" stroke-width="3"/>',
    palette:
      '<path d="M7 25C-2 20 5 6 15 3 26-1 35 6 29 15c-3 4-10 2-11 5-2 4 3 8-3 9z" fill="#edc95b" stroke="#5e4c2a" stroke-width="1.6"/><ellipse cx="10" cy="18" rx="3" ry="3.5" fill="#4d80ac"/><circle cx="12" cy="9" r="3" fill="#9e3434"/><circle cx="21" cy="7" r="3" fill="#bb7218"/><circle cx="24" cy="13" r="2.5" fill="#64843b"/><ellipse cx="10" cy="25" rx="2" ry="3" fill="#e9e5d7"/>',
    fox: '<circle cx="16" cy="16" r="13" fill="#2c80b6" stroke="#343b3f"/><path d="M5 4l7 5 11-4-2 8 8-3c2 15-13 22-23 13C1 18 2 12 5 4z" fill="#e98516" stroke="#91501c"/><path d="M7 6l5 7-3 4c3 7 12 6 15 1-1 9-14 12-19 3-3-5-1-11 2-15z" fill="#ffba32"/><path d="M14 10l7-2-2 6-6 1" fill="#f2e5b7"/>',
    logo: '<path d="M14 2l3 4 5-1 2 5 5 2-1 6-4 3-1 6-6-1-4 4-4-5-6-1 1-6-3-4 5-4 1-6z" fill="#e9e5d9" stroke="#504638"/><circle cx="15" cy="15" r="8" fill="#9e5d30" stroke="#67503b"/><circle cx="15" cy="15" r="5" fill="#eee6d8"/>',
    sound:
      '<path d="M2 12h5l7-6v21l-7-6H2z" fill="#e5e0d3" stroke="#3d3026"/><path d="M18 10q7 6 0 13m4-17q11 10 0 21" fill="none" stroke="#e5e0d3" stroke-width="2"/>',
  };
  const draw = (el, name, box = '0 0 32 32') => {
    el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + box + '">' + icons[name] + '</svg>';
    return el;
  };
  const palette = { bg: '#955b30', panel: '#ede8df', fg: '#202020', muted: '#756b5e', line: '#c2beb5' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const { ctx } = _c;
      document.body.className = 'gnome instruction-' + ctx.display;
      const u = ctx.util;
      const panel = u.el('header', 'g-panel', document.body);
      draw(u.el('i', 'g-logo', panel), 'logo');
      for (const a of C.apps) u.el('span', 'g-app', panel, a);
      draw(u.el('i', 'g-fox', panel), 'fox');
      u.el('i', 'g-help', panel, '?');
      draw(u.el('i', 'g-sound', panel), 'sound');
      u.el('span', 'g-clock', panel, C.clock);
      const win = u.el('main', 'g-win', document.body),
        tb = u.el('div', 'g-title', win);
      draw(u.el('i', 'g-wicon', tb), 'bulb', '0 0 38 54');
      u.el('span', '', tb, C.title);
      const wc = u.el('div', 'g-wc', tb);
      for (const k of ['min', 'max', 'close']) {
        const b = u.el('i', 'g-wb ' + k, wc);
        b.innerHTML = k === 'min' ? '<s></s>' : k === 'max' ? '<s class="sq"></s>' : '×';
      }
      const mb = u.el('nav', 'g-menu', win);
      for (const m of C.menu) u.el('span', '', mb, m);
      const client = u.el('div', 'g-client', win);
      Object.assign(_c, { win, menu: mb, client, header: client });
      const pal = u.el('aside', 'g-pal', document.body),
        pt = u.el('div', 'g-ptitle', pal);
      draw(u.el('i', 'g-picon', pt), 'palette');
      u.el('span', '', pt, 'Color Picker');
      const px = u.el('i', 'g-wb close', pt);
      px.textContent = '×';
      const pb = u.el('div', 'g-pbody', pal);
      u.el('i', 'g-sw', pb);
      const tx = u.el('div', 'g-pt', pb);
      u.el('div', '', tx, 'RGB: 181, 56, 56');
      u.el('div', '', tx, 'Hex:  #B53838');
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.client; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) panel.classList.add('g-instr-panel');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.client);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('g-instr-toast');
        _c.client.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('bottom');
      _c.client.appendChild(foot);
      const text = foot.querySelector('.ref-foot-text');
      text.textContent = _c.ctx.finish ? 'Ready' : '';
      text.classList.add('g-finish-status');
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('div', 'overlay g-tour', document.body);
      draw(u.el('i', 'g-bulb', el), 'bulb', '0 0 38 54');
      u.el('b', '', el, 'Welcome to Color Training!');
      u.el('p', '', el, 'You can select tiles by clicking on them. Try to complete the exercise.');
      const x = u.el('i', 'g-x', el);
      x.textContent = '×';
      const dismiss = u.el('button', 'g-skip', el, 'Skip tour');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      u.el('span', 'g-next', el, 'Next tip ›');
      return { el, dismiss };
    },
  };
  env.site({
    name: C.site,
    template: 'site/base',
    langs: ['en'],
    initialOverlay: { kind: 'promo' },
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'gnome.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#e8731f'],
      LOW_ACCENTS: ['#e8731f'],
      parts,
    },
  });
})();
