(function () {
  'use strict';
  const palette = { bg: '#e8dfc8', panel: '#f4efe0', fg: '#101040', muted: '#777777', line: '#999999' };
  const picture = (u, p, cls, name) => {
    const img = u.el('img', cls, p);
    img.src = 'sites/design-draw-shape-trace-10/assets/' + name + '.webp';
    img.alt = '';
    img.draggable = false;
    return img;
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original has room for its inline note at every viewport.
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
      document.body.classList.add('design', 'mg');
      const page = u.el('div', 'mg-page', document.body);
      const mast = u.el('header', 'mg-mast', page);
      picture(u, mast, 'mg-leaf l1', 'leaf');
      const mt = u.el('div', 'mg-mtxt', mast);
      u.el('h1', '', mt, 'Maple Grove Community');
      u.el('div', 'mg-tag', mt, 'Good Neighbors  •  Brighter Tomorrows');
      picture(u, mast, 'mg-leaf l2', 'leaf');
      const est = u.el('div', 'mg-est', mast);
      u.el('div', '', est, 'Est. 1996');
      picture(u, est, 'mg-badge', 'badge');
      u.el('div', 'mg-ot', est, 'Our Town Online');
      const frame = u.el('div', 'mg-frame', page);
      Object.assign(_c, { page, frame });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const nav = u.el('nav', 'mg-nav', _c.frame);
      const iconNames = ['home', 'residents', 'events', 'album', 'board', 'contact'];
      for (const [j, t] of ['Home', 'Residents', 'Events', 'Photo Album', 'Community Board', 'Contact'].entries()) {
        const a = u.el('a', '', nav);
        picture(u, a, 'mg-nav-icon mg-icon-' + iconNames[j], iconNames[j]);
        u.el('span', '', a, t);
        a.href = '#';
        a.onclick = (e) => e.preventDefault();
      }
      const inner = u.el('div', 'mg-inner', _c.frame);
      const sub = u.el('div', 'mg-sub', inner);
      picture(u, sub, 'mg-tree', 'tree');
      u.el('h2', '', sub, 'Mouse Skills Corner');
      picture(u, sub, 'mg-tree', 'tree');
      const sm = u.el('div', 'mg-small', sub);
      sm.append('Small Town', document.createElement('br'), 'Big Connections');
      const content = u.el('div', 'mg-content', inner);
      const slot = u.el('section', 'mg-note', content);
      slot.hidden = _c.display === 'hidden' || _c.display === 'toast';
      slot.classList.toggle('instruction-panel', _c.display === 'panel');
      const actions = u.el('div', 'mg-actions', null);
      const clr = u.el('button', 'clear mg-clear', actions, 'Clear Path');
      clr.type = 'button';
      clr.onclick = () => { env.widgetDef.clear?.(); };
      Object.assign(_c, { inner, content, header: slot, actions });
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const text = _c.header.querySelector('.ref-instruction');
      if (text) text.style.fontSize = `clamp(20px, ${Math.min(2.85, 170 / _c.ctx.instruction.length)}vw, 48px)`;
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.actions;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.content; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      const panel = _c.header.querySelector('.ref-panel');
      if (panel) panel.style.fontSize = `clamp(20px, ${Math.min(2.85, 170 / _c.ctx.instruction.length)}vw, 48px)`;
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage mg-stage', _c.content);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('mg-note', 'instruction-toast');
        note.querySelector('.ref-note-text').style.fontSize = `clamp(20px, ${Math.min(2.85, 170 / _c.ctx.instruction.length)}vw, 48px)`;
        _c.content.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.querySelector('.ref-foot-text').remove();
      _c.actions.appendChild(foot);
      _c.content.appendChild(_c.actions);
      const ft = _c.util.el('div', 'mg-foot', _c.inner);
      picture(_c.util, ft, 'mg-fl', 'leaf');
      _c.util.el('span', '', ft, 'Maps to People ~ People to a Stronger Maple Grove');
      picture(_c.util, ft, 'mg-fl', 'leaf');
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.actions.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      u.el('h3', '', box, 'Product Updates Newsletter');
      u.el('p', '', box, 'Get occasional updates about new features and tips.');
      u.el('div', 'nl-input', box, 'Your email address (optional)');
      const cb = u.el('div', 'nl-check', box);
      u.el('span', 'nl-box', cb);
      u.el('span', '', cb, 'Send me product updates');
      const dismiss = u.el('button', 'dismiss', box, 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      const x = u.el('button', 'nl-x', box, '✕');
      x.type = 'button';
      x.onclick = () => dismiss.click();
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  };
  env.site({
    name: 'design-draw-shape-trace-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-draw-shape-trace-10': palette },
      LOW_THEME: palette,
      ACCENTS: ['#c0392b'],
      LOW_ACCENTS: ['#c0392b'],
      parts,
    },
  });
})();
