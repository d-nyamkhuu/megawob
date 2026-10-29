// VisionLab workbench: the site/base frame with a fixed task inspector.
(function () {
  'use strict';

  const theme = { bg: '#0f1419', panel: '#141a20', fg: '#f0f2f4', muted: '#aab4c0', line: '#303940' };
  let shortcuts;

  function bindShortcuts(stage, clear, submit) {
    if (shortcuts) document.removeEventListener('keydown', shortcuts);
    shortcuts = (e) => {
      if (e.target.matches('input,textarea')) return;
      const boxes = stage.querySelectorAll('.swatch');
      if (/^[0-9]$/.test(e.key)) {
        const i = e.key === '0' ? 9 : Number(e.key) - 1;
        if (boxes[i]) boxes[i].click();
      } else if (e.key === 'Escape') clear.click();
      else if (e.key === 'Enter' && submit && e.target !== submit) {
        e.preventDefault();
        submit.click();
      }
    };
    document.addEventListener('keydown', shortcuts);
  }

  env.site({
    name: 'design-read-figure-color-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['site.css', 'frame-support.css', 'dev.css'],
    design: {
      THEMES: { dark: theme },
      LOW_THEME: theme,
      ACCENTS: ['#70ed65'],
      LOW_ACCENTS: ['#70ed65'],
      parts: {
        'frame.layout': (base) => (_c) => {
          base(_c);
          // The design always has an inspector, including at the smallest viewport.
          _c.display = _c.ctx.display || 'header';
          document.body.className = 'devdark utility instruction-' + _c.display;
        },
        'frame.header': () => (_c) => {
          const { util } = _c;
          const app = util.el('main', 'app', document.body);
          const header = util.el('header', 'top', app);
          util.el('span', '', header, 'VisionLab');
          util.el('nav', 'menu', header, 'Labeling Tasks');
          const center = util.el('div', 'center ref-body', app);
          Object.assign(_c, { app, header, center });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => (_c) => {
          base({ ..._c, header: _c.center });
          const brief = _c.center.querySelector('.ref-instruction');
          if (brief) {
            brief.classList.add('brief');
            brief.classList.toggle('long-instruction', brief.textContent.length > 32);
          }
        },
        'frame.body': () => (_c) => { _c.body = _c.center; },
        'frame.panel': (base) => (_c) => {
          const { ctx, display, util } = _c;
          const aside = util.el('aside', 'aside', document.body);
          util.el('b', '', aside, 'Task Details');
          const kv = util.el('div', 'kv', aside);
          for (const [key, value] of [['Task ID', 'VL-2847'], ['Task Type', 'Visual Perception']]) {
            util.el('span', '', kv, key);
            util.el('span', '', kv, value);
          }
          base({ ..._c, body: kv });
          const panelTitle = kv.querySelector('.ref-panel-title');
          if (panelTitle) panelTitle.textContent = 'Instructions';
          if (display !== 'panel') {
            util.el('span', 'controls-label', kv, 'Controls');
            util.el('span', 'controls-value', kv, 'Pointer / keyboard');
          }
          util.el('span', '', kv, 'Total Boxes');
          util.el('span', '', kv, '—');
          util.el('b', 'h2', aside, 'Color Reference');
          util.el('b', 'h3', aside, ctx.finish ? 'Selection' : 'Actions');
          util.el('b', 'h4', aside, 'Keyboard Shortcuts');
          const ks = util.el('div', 'ks', aside);
          const range = util.el('div', 'key-range', ks);
          util.el('kbd', '', range, '1');
          util.el('span', '', range, '−');
          util.el('kbd', '', range, '0');
          util.el('span', '', ks, 'Select a box');
          if (!ctx.finish) {
            util.el('kbd', '', ks, 'Enter');
            util.el('span', '', ks, _c.label);
          }
          util.el('kbd', '', ks, 'Esc');
          util.el('span', '', ks, 'Clear selection');
          const clear = util.el('button', 'clearbtn', aside, 'Clear Selection');
          clear.type = 'button';
          clear.addEventListener('click', () => {
            const undo = _c.stage.querySelector('.recover button');
            if (undo && !undo.disabled) undo.click();
          });
          Object.assign(_c, { aside, clear });
        },
        'frame.stage': () => (_c) => {
          _c.stage = _c.util.el('section', 'stage', _c.body);
        },
        'frame.end': (base) => (_c) => {
          const { stage, clear, submit } = _c;
          document.body.classList.toggle('end-away', !submit || submit.closest('.ref-tools') === _c.headerTools);
          if (submit) {
            submit.classList.add('submit');
            if (submit.closest('.ref-foot, .ref-float-dock')) {
              submit.closest('.ref-foot, .ref-float-dock').classList.add('bottom');
            } else submit.classList.add('end-header');
          }
          bindShortcuts(stage, clear, submit);
          return base(_c);
        },
      },
    },
  });
})();
