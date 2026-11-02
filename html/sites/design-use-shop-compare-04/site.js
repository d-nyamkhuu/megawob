// The comparison workspace's frame, styled on the shared site template.
(function () {
  'use strict';

  const palette = { bg: '#e8f0fa', panel: '#f7faff', fg: '#101e3b', line: '#d6e1f0', muted: '#53698d' };

  // Keep the existing CSS hooks while the template owns instruction behavior.
  function styleInstruction(_c, selector) {
    const note = document.querySelector(selector);
    if (!note) return;
    note.classList.add('task-note');
    note.dataset.role = 'instruction';
    if (selector === '.ref-instruction') note.classList.add('food-task');
    else note.querySelector('.ref-panel-text, .ref-note-text').classList.add('food-task');
    _c.shell.appendChild(note);
  }

  function shoppingTips(util, stage) {
    const tips = util.el('aside', 'shopping-tips', stage);
    util.el('div', 'tip-bulb', tips, '💡');
    const copy = util.el('div', 'tip-copy', tips);
    util.el('b', '', copy, 'Shopping tips');
    const cols = util.el('div', 'tip-cols', copy);
    for (const text of [
      'Use the filters to narrow results to what fits your needs.',
      'Compare capacity, weight, price and warranty side by side.',
      'Click View for more details, photos and reviews.',
      'Add qualifying items to your bag, then check out when you’re ready.',
    ]) util.el('span', '', cols, text);
  }

  env.site({
    name: 'design-use-shop-compare-04',
    template: 'site/base',
    styles: ['templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'frame-support.css', 'site.css'],
    design: {
      THEMES: { light: palette },
      LOW_THEME: palette,
      ACCENTS: ['#2879ed'],
      LOW_ACCENTS: ['#2879ed'],
      parts: {
        'frame.layout': (base) => function (_c) {
          base(_c);
          document.body.className = 'shop-neumo instruction-' + _c.display;
          _c.shell = _c.util.el('div', 'site-shell', document.body);
        },
        'frame.header': () => function (_c) {
          _c.header = _c.util.el('header', 'design-header', _c.shell);
          _c.util.el('div', 'site-wordmark', _c.header);
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => function (_c) {
          base(_c);
          styleInstruction(_c, '.ref-instruction');
        },
        'frame.tools': (base) => function (_c) {
          base(_c);
          _c.headerTools.classList.add('header-tools');
        },
        'frame.body': () => function (_c) {
          _c.body = _c.util.el('div', 'design-body ref-body', _c.shell);
        },
        'frame.panel': (base) => function (_c) {
          base(_c);
          styleInstruction(_c, '.ref-panel');
        },
        'frame.stage': () => function (_c) {
          _c.stage = _c.util.el('main', 'stage', _c.body);
          shoppingTips(_c.util, _c.stage);
        },
        'frame.toast': (base) => function (_c) {
          base(_c);
          styleInstruction(_c, '.ref-note');
        },
        'frame.footer': (base) => function (_c) {
          base(_c);
          const footer = document.querySelector('.ref-foot') || _c.util.el('footer', '', _c.shell);
          footer.classList.add('design-footer');
          _c.shell.appendChild(footer);
          const nav = _c.util.el('nav', 'bottom-nav', footer);
          for (const [i, [icon, label]] of [
            ['⌂', 'Home'], ['♧', 'Shop'], ['♡', 'Favorites'], ['🛒', 'Bag'], ['♙', 'Account'],
          ].entries()) {
            const item = _c.util.el('div', 'dock-item' + (i === 1 ? ' active' : ''), nav);
            _c.util.el('span', 'dock-icon', item, icon);
            _c.util.el('span', '', item, label);
          }
        },
        'frame.end': (base) => function (_c) {
          for (const decoy of document.querySelectorAll('.ref-xtra')) decoy.classList.add('dock-xtra');
          if (_c.submit) {
            _c.submit.classList.add('end-control', _c.placement === 'header' || _c.placement === 'icon' ? 'head-end' : 'dock-end');
            if (_c.placement === 'icon') _c.submit.classList.add('icon-end');
          }
          return base(_c);
        },
      },
    },
  });
})();
