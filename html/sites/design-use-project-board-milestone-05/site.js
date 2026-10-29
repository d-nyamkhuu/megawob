// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  function icon(util, parent, name) {
    const svg = util.svg('svg', {viewBox:'0 0 52 52', 'aria-hidden':'true', fill:'none', stroke:'#111', 'stroke-width':'2.6', 'stroke-linejoin':'round', 'stroke-linecap':'round'}, parent);
    const paths = {
      overview: ['M10 3H33L43 14V49H10Z','M33 3V15H43','M17 15H25M17 23H35M17 31H35M17 39H31'],
      timeline: ['M6 6H46V46H6Z','M12 12H26M12 18H22','M12 31H18V40H12ZM25 24H31V40H25ZM37 15H42V40H37Z'],
      board: ['M5 7H47V45H5Z','M5 16H47','M12 24H21V37H12Z','M28 24H40M28 30H40M28 36H38','M15 28H18M15 33H18'],
      team: ['M20 13a7 7 0 1 0 14 0a7 7 0 1 0-14 0','M6 18a5 5 0 1 0 10 0a5 5 0 1 0-10 0','M38 18a5 5 0 1 0 10 0a5 5 0 1 0-10 0','M15 45V35C15 21 38 21 38 35V45Z','M11 28C3 27 2 35 2 43H12M42 28C50 27 51 35 51 43H41'],
      reports: ['M8 5H44V47H8Z','M15 14H37M15 21H37M15 28H37M15 35H29','M34 39L41 46']
    };
    for (const d of paths[name]) util.svg('path', {d}, svg);
  }

  const parts = {
    overlay: (base, S) => function(ctx) {
      const result = base(ctx);
      if (ctx.kind === 'banner') result.el.style.top = `${document.querySelector('.ref-task').getBoundingClientRect().bottom}px`;
      return result;
    },
    'frame.instruction': (base, S) => function (_c) {
      if (_c.display === 'header') {
        const note = _c.util.el('div', 'lisa-instruction', _c.titlebar, _c.ctx.instruction);
        _c.titlebar.insertBefore(note, _c.titlebar.querySelector('.lisa-title-corner:last-of-type'));
      }
    },
    'frame.tools': (base, S) => function (_c) {
      base(_c);
      _c.titlebar.style.setProperty('--lisa-controls-width', `${_c.headerTools.offsetWidth + 16}px`);
    },
    'frame.placement': (base, S) => function (_c) {
      base(_c);
      if (_c.ctx.finish) return;
      const r = _c.ctx.rng.fork('lisa/end');
      if (r.bool(0.52)) {
        _c.placement = 'footer';
        _c.wantFooter = true;
        _c.label = 'Save';
        if (_c.collide && _c.collide.text.trim().toLowerCase() === 'save') _c.collide.text = 'Continue';
      }
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const menu = util.el('div', 'lisa-menu', header);
      const apple = util.el('span', 'lisa-apple', menu);
      const mark = util.svg('svg', {viewBox:'0 0 28 32', 'aria-hidden':'true'}, apple);
      util.svg('path', {fill:'#111', d:'M18 8C18 4 21 1 24 1C24 5 21 8 18 8ZM14 10C10 7 4 9 3 15C1 22 7 31 11 31C13 31 14 29 17 29C20 29 20 31 23 30C25 28 27 24 28 22C22 20 21 14 26 11C23 8 19 8 16 10Z'}, mark);
      for (const t of ['File', 'Edit', 'View', 'Project', 'Team', 'Window', 'Help']) util.el('span', '', menu, t);
      const win = util.el('div', 'lisa-window-buttons', menu);
      for (const t of ['−', '□', '×']) util.el('span', '', win, t);
      const titlebar = util.el('div', 'lisa-titlebar', header);
      util.el('span', 'lisa-title-corner', titlebar, '▣');
      const brand = util.el('div', 'ref-brand', titlebar, 'Product Release');
      brand.dataset.role = 'brand';
      util.el('span', 'lisa-title-corner', titlebar, '□');
      const toolbar = titlebar;
      Object.assign(_c, { brand, header, menu, titlebar, toolbar, win });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const dock = util.el('nav', 'lisa-rail', body);
      for (const [icon, text] of [['▤', 'Overview'], ['▣', 'Timeline'], ['▤', 'Board'], ['♧', 'Team'], ['▤', 'Reports']]) {
        const item = util.el('span', 'lisa-rail-item', dock);
        const drawing = util.el('b', `lisa-rail-icon lisa-icon-${text.toLowerCase()}`, item);
        drawRailIcon(util, drawing, text.toLowerCase());
        util.el('span', '', item, text);
      }
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      Object.assign(_c, { dock, stage });
    },
  };

  const drawRailIcon = icon;

  env.site({
    name: 'design-use-project-board-milestone-05',
    template: 'site/base',
    design: { parts },
  });
})();
