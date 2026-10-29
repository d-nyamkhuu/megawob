// Swiss editorial frame on the shared site template.
(function () {
  'use strict';

  function instructionBand(el, text, util) {
    el.classList.add('instruction');
    el.textContent = '';
    const sentences = String(text).match(/^(.*?\.)\s+(.+)$/s);
    util.el('b', '', el, sentences ? sentences[1] : text);
    if (sentences) util.el('span', '', el, sentences[2]);
  }

  env.site({
    name: 'design-set-slider-log-01',
    template: 'site/base',
    styles: ['templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'frame-support.css', 'site.css'],
    design: {
      THEMES: { swiss: { bg: '#fff', panel: '#fff', fg: '#0b0b0b', muted: '#555', line: '#c9cacc' } },
      LOW_THEME: { bg: '#fff', panel: '#fff', fg: '#0b0b0b', muted: '#555', line: '#c9cacc' },
      ACCENTS: ['#f20e16'],
      LOW_ACCENTS: ['#f20e16'],
      parts: {
        'frame.layout': (base) => function (_c) {
          base(_c);
          _c.display = _c.ctx.display || 'header';
          document.body.className = `swiss instruction-${_c.display}`;
        },
        'frame.header': () => function (_c) {
          const { util } = _c;
          const rail = util.el('nav', 'rail', document.body);
          const logo = util.el('div', 'logo', rail);
          util.el('span', '', logo, 'A');
          util.el('i', '', logo);
          const items = util.el('ul', '', rail);
          ['Task', 'Data', 'Tools', 'Settings', 'Help'].forEach((text, i) => {
            util.el('li', i === 0 ? 'on' : '', items, text);
          });
          const content = util.el('div', 'content', document.body);
          const header = util.el('header', 'page-head', content);
          util.el('div', 'kicker', header, 'CONTROL');
          const sys = util.el('div', 'sys', header);
          util.el('span', '', sys, 'SYSTEM');
          util.el('span', 'sl', sys, '/');
          util.el('span', 'cur', sys, 'MOTION');
          const title = util.el('div', 'title', header);
          util.el('div', 'num', title, '02');
          util.el('div', 'vr', title);
          util.el('h1', '', title, 'Adjust Speed');
          Object.assign(_c, { content, header });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => function (_c) {
          // The reference puts the header instruction below its title, across the content column.
          base({ ..._c, header: _c.content });
          const el = _c.content.querySelector('.ref-instruction');
          if (el) instructionBand(el, _c.ctx.instruction, _c.util);
        },
        'frame.body': () => function (_c) {
          _c.body = _c.util.el('div', 'ref-body', _c.content);
        },
        'frame.panel': (base) => function (_c) {
          base(_c);
          const panel = _c.body.querySelector('.ref-panel');
          if (panel) instructionBand(panel, _c.ctx.instruction, _c.util);
        },
        'frame.stage': () => function (_c) {
          _c.stage = _c.util.el('main', 'record-stage', _c.body);
          _c.stage.dataset.role = 'stage';
        },
        'frame.footer': (base) => function (_c) {
          base(_c);
          const footer = document.querySelector('.ref-foot') || _c.util.el('footer', 'ref-foot', _c.content);
          footer.classList.add('page-foot');
          _c.content.appendChild(footer);
          _c.footer = footer;
        },
        'frame.floating': (base) => function (_c) {
          base(_c);
          const dock = document.querySelector('.ref-float-dock');
          if (dock) _c.footer.appendChild(dock);
        },
      },
    },
  });
})();
