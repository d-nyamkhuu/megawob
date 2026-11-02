// Full-bleed color board on the shared frame; retain the legacy styling hooks.
(function () {
  'use strict';
  const palette = { bg: '#faf9f4', panel: '#faf9f4', fg: '#111', muted: '#444', line: '#444' };

  function instructionStyle(el) {
    el.classList.add('brief');
    const text = el.querySelector('.ref-panel-text, .ref-note-text') || el;
    if (text === el) {
      const span = document.createElement('span');
      span.textContent = el.textContent;
      el.replaceChildren(span);
      span.className = 'instruction-text';
    } else text.classList.add('instruction-text');
    if (text.textContent.length > 42) el.classList.add('long-instruction');
  }

  env.site({
    name: 'design-read-figure-color-04',
    template: 'site/base',
    styles: ['site.css', 'frame-support.css', 'override.css'],
    design: {
      THEMES: { board: palette },
      LOW_THEME: palette,
      ACCENTS: ['#a8fa50'],
      LOW_ACCENTS: ['#a8fa50'],
      parts: {
        'frame.layout': (base) => (_c) => {
          document.body.className = 'mint utility';
          base(_c);
          document.body.classList.add('instruction-' + _c.display);
        },
        'frame.placement': (base) => (_c) => {
          base(_c);
          // This board always has a question footer and no navigation/sidebar.
          Object.assign(_c, { nav: false, sidebar: false, wantFooter: true });
        },
        'frame.header': () => (_c) => {
          const { ctx, placement, util } = _c;
          const app = util.el('main', 'app end-' + placement, document.body);
          if (ctx.finish) app.classList.add('finish-mode');
          const header = util.el('header', 'top', app);
          util.el('nav', 'menu', header, 'Color identification task');
          const body = util.el('div', 'center ref-body', app);
          Object.assign(_c, { app, header, body });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => (_c) => {
          base(_c);
          const brief = _c.header.querySelector('.ref-instruction');
          if (brief) {
            instructionStyle(brief);
            _c.body.append(brief);
          }
        },
        'frame.tools': (base) => (_c) => {
          base(_c);
          // The existing header styles address its controls directly.
          _c.headerTools.replaceWith(..._c.headerTools.childNodes);
        },
        'frame.body': () => () => {},
        'frame.panel': (base) => (_c) => {
          base(_c);
          const panel = _c.body.querySelector('.ref-panel');
          if (panel) instructionStyle(panel);
        },
        'frame.stage': () => (_c) => {
          _c.stage = _c.util.el('section', 'stage ref-stage', _c.body);
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          const note = document.querySelector('.ref-note');
          if (note) {
            instructionStyle(note);
            _c.body.append(note);
          }
        },
        'frame.footer': (base) => (_c) => {
          base(_c);
          const footer = document.querySelector('.ref-foot');
          footer.classList.add('bottom');
          const tools = footer.querySelector('.ref-tools');
          tools.replaceWith(...tools.childNodes);
          _c.app.append(footer);
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          const dock = document.querySelector('.ref-float-dock');
          if (dock) _c.app.append(dock);
        },
        'frame.end': (base) => (_c) => {
          if (_c.submit) {
            _c.submit.classList.add('submit');
            if (_c.placement === 'link') _c.submit.classList.add('end-link');
          }
          for (const decoy of _c.app.querySelectorAll('.ref-xtra')) decoy.classList.add('end-xtra');
          return base(_c);
        },
      },
    },
  });
})();
