(function () {
  'use strict';
  function gadgets(parent, u) {
    const g = u.el('span', 'gad-r', parent);
    const paths = [
      '<path d="M5 5h10v12H4V6h3V3h7v4H7V5m2 3h5v6H8V9"/>',
      '<path d="M3 5h11v10H3zm4-3h10v11h-3M7 8h7v7H7z"/>',
    ];
    paths.forEach((p) => {
      const i = u.el('i', '', g);
      i.innerHTML = '<svg viewBox="0 0 20 20" fill="#ddd" stroke="#111" stroke-width="1.7" shape-rendering="crispEdges">' + p + '</svg>';
    });
    return g;
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original toast sits in the task pane even at short viewports.
      _c.display = _c.ctx.display === 'panel' && !_c.roomy ? 'header' : (_c.ctx.display || 'header');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'amiga');
      const shell = u.el('main', 'shell', document.body);
      const bar = u.el('header', 'screenbar', shell);
      u.el('span', 'sb-t', bar, 'Amiga Workbench');
      u.el('span', 'sb-m', bar, '1,948,032 graphics mem');
      u.el('span', 'sb-m', bar, '7,864,320 other mem');
      u.el('span', 'sb-clock', bar, 'Mon Apr 22 10:24');
      u.el('span', 'sb-front', bar);
      const work = u.el('div', 'work', shell);
      const win = u.el('section', 'win main-win', work);
      const tb = u.el('div', 'wtitle', win);
      const reset = u.el('span', 'gad gad-l reset-task', tb);
      reset.innerHTML = '<svg viewBox="0 0 20 20" fill="#eee" stroke="#111" stroke-width="1.6" shape-rendering="crispEdges"><path d="m8 3 5 4-2 3v6H7v-6L5 8z"/><path d="M9 6v5"/></svg>';
      u.el('span', 'wt', tb, 'Pointer Task');
      const gs = gadgets(tb, u);
      const body = u.el('div', 'wbody', win);
      const center = u.el('div', 'center', body);
      u.el('div', 'wsize', win);
      const aside = u.el('aside', 'win insp-win', work);
      const tb2 = u.el('div', 'wtitle', aside);
      const inspectorIcon = u.el('span', 'gad gad-l', tb2);
      inspectorIcon.innerHTML = reset.innerHTML;
      u.el('span', 'wt', tb2, 'Task Inspector');
      gadgets(tb2, u);
      const ib = u.el('div', 'wbody ibody', aside);
      const grp = (t) => {
        const g = u.el('fieldset', 'grp', ib);
        u.el('legend', '', g, t);
        return g;
      };
      u.el('p', '', grp('Status'), 'In progress');
      const tg = grp('Target');
      const trow = u.el('div', 'trow', tg);
      u.el('span', 'swatch', trow);
      u.el('span', '', trow, 'Moving square');
      u.el('p', '', tg, 'Moves to a new position during the task.');
      const goal = grp('Goal');
      goal.classList.toggle('panel-goal', _c.display === 'panel');
      if (_c.display !== 'panel') u.el('p', '', goal, 'Follow the assigned task. Progress is shown below the movement area.');
      u.el('p', '', grp('Area'), 'The square can move anywhere inside the outlined area on the left.');
      const ul = u.el('ul', '', grp('Tips'));
      ['The square moves automatically.', 'Your time only counts while the mouse is over it.', 'You can move the mouse freely.'].forEach((t) => u.el('li', '', ul, t));
      Object.assign(_c, { shell, work, win, tb, gs, center, body, goal, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.tb;
      base(_c);
      _c.header = header;
      _c.tb.insertBefore(_c.headerTools, _c.gs);
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.goal });
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = _c.display;
        _c.center.insertBefore(note, _c.stage);
      }
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
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el('strong', '', el, {
        cookie: 'Cookie preferences', toast: 'Notification', chat: 'Support',
        promo: 'A special offer', banner: 'Service notice',
      }[ctx.kind]);
      ctx.util.el('p', '', el, {
        cookie: 'Choose your preferences to continue.', toast: 'Your workspace is ready.',
        chat: 'How can we help?', promo: 'Explore the latest tools.', banner: 'A new update is available.',
      }[ctx.kind]);
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  const palette = { bg: '#a0a0a0', panel: '#aaaaaa', fg: '#000000', muted: '#000000', line: '#000000' };
  env.site({
    name: 'design-click-control-hover-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-control-hover-05': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0000e0'],
      LOW_ACCENTS: ['#0000e0'],
      parts,
    },
  });
})();
