// Bauhaus frame on site/base: the template owns controls, instructions and interruptions.
(function () {
  'use strict';

  const palette = {
    bg: '#f4f1ea', panel: '#f8f5ee', fg: '#141414', line: '#cfcac0', muted: '#5d5a55',
    font: "'Century Gothic','Avenir Next','Segoe UI',Helvetica,Arial,sans-serif",
  };

  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      if (_c.W <= 1100 || _c.H <= 740) {
        if (_c.display === 'panel' || _c.display === 'toast') _c.display = 'header';
      }
      document.body.className = 'bottom instruction-' + _c.display;
    },
    'frame.header': () => (_c) => {
      const { util } = _c;
      const shell = util.el('div', 'site-shell', document.body);
      const top = util.el('div', 'bz-top', shell);
      const note = util.el('section', 'task-note', top);
      note.dataset.role = 'instruction';
      const brand = util.el('div', 'bz-brand', top);
      util.el('h1', '', brand, 'Micro Tasks');
      util.el('div', 'bz-sub', brand, 'Small actions. Real progress.');
      const dots = util.el('div', 'bz-dots', brand);
      util.el('i', 'bz-circle', dots);
      const square = util.el('button', 'bz-square', dots);
      square.type = 'button';
      square.title = 'Clear';
      square.setAttribute('aria-label', 'Clear');
      square.addEventListener('click', () => env.log('decoy', { what: 'Clear' }));
      const title = util.el('div', 'bz-heading', shell);
      util.el('h2', 'bz-title', title, 'All Posts');
      Object.assign(_c, { shell, top, note, brand, title, header: brand });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const { display, note, util } = _c;
      note.hidden = display !== 'header';
      if (display === 'header') util.el('div', 'bz-kicker', note, 'YOUR TASK');
      base({ ..._c, header: note });
    },
    'frame.body': () => (_c) => {
      const { shell, util } = _c;
      const side = util.el('aside', 'bz-side', shell);
      Object.assign(_c, { side, body: side });
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const { side, util } = _c;
      const panel = side.querySelector('.ref-panel');
      if (panel) panel.classList.add('task-panel');
      const prog = util.el('div', 'bz-prog', side);
      util.el('b', '', prog, 'Activity');
      util.el('span', '', prog, '0');
      util.el('div', 'bz-bar', side);
      for (const [label, value] of [['Feed', 'All posts'], ['Posts', '0'], ['Actions', '0']]) {
        const field = util.el('div', 'bz-field', side);
        util.el('span', '', field, label);
        util.el('strong', '', field, value);
      }
      util.el('div', 'bz-rule', side);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.shell);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const toast = document.querySelector('.ref-note');
      if (toast) {
        toast.classList.add('task-toast');
        _c.brand.append(toast);
      }
    },
    'frame.end': (base) => (_c) => {
      const { brand, ctx, placement, shell, side, submit, title } = _c;
      // Dock the template's controls in this design's three available chrome regions.
      const where = placement === 'header' ? 'brand' : placement === 'icon' ? 'title' : 'side';
      shell.dataset.endPlacement = ctx.finish ? 'none' : where;
      if (submit) {
        submit.className = 'end-control' + (where === 'brand' ? ' end-brand' : where === 'title' ? ' end-title' : '');
        (where === 'brand' ? brand : where === 'title' ? title : side).append(submit);
      }
      for (const decoy of document.querySelectorAll('.ref-xtra')) {
        decoy.classList.add('chrome-xtra');
        title.append(decoy);
      }
      document.querySelectorAll('.ref-tools, .ref-foot, .ref-float-dock').forEach((node) => node.remove());
      return base(_c);
    },
  };

  env.site({
    name: 'design-use-social-feed-all-08',
    template: 'site/base',
    styles: ['frame-support.css', 'site.css'],
    design: {
      THEMES: { bauhaus: palette }, LOW_THEME: palette,
      ACCENTS: ['#d92d27'], LOW_ACCENTS: ['#d92d27'], LANGS: ['en'],
      parts,
    },
  });
})();
