// Shipping-board design on the shared frame; controls and perturbations belong to site/base.
(function () {
  'use strict';

  const palette = { bg: '#d9e8fa', panel: '#dbe8f8', fg: '#081d40', muted: '#4a5f80', line: '#6b8fc4' };

  function instructionStyle(el, mode, util) {
    el.classList.add('ds-instruction', 'ds-instruction-' + mode);
    const chunks = el.textContent.split(/("[^"]*"|“[^”]*”)/g);
    el.textContent = '';
    chunks.forEach((chunk, i) => {
      if (i % 2) util.el('strong', '', el, chunk);
      else if (i === 0 && /[.:]/.test(chunk)) {
        const end = chunk.indexOf(chunk.includes('.') ? '.' : ':') + 1;
        util.el('strong', '', el, chunk.slice(0, end));
        el.append(document.createTextNode(chunk.slice(end)));
      } else el.append(document.createTextNode(chunk));
    });
  }

  env.site({
    name: 'design-type-text-multi-03',
    template: 'site/base',
    styles: ['templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { shipping: palette },
      LOW_THEME: palette,
      ACCENTS: ['#1d4a85'],
      LOW_ACCENTS: ['#1d4a85'],
      parts: {
        'frame.layout': (base) => (_c) => {
          base(_c);
          // This full-width strip has room for every instruction mode at every viewport.
          _c.display = _c.ctx.display || 'header';
        },
        'frame.header': () => (_c) => {
          const { display, util } = _c;
          if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
          const selection = window.getSelection();
          if (selection) selection.removeAllRanges();
          const header = util.el('header', 'ds-top ds-top-' + display, document.body);
          util.el('span', 'ds-tri', header);
          Object.assign(_c, { header });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => (_c) => {
          base(_c);
          const instruction = _c.header.querySelector('.ref-instruction');
          if (instruction) instructionStyle(instruction, 'header', _c.util);
          const spacer = _c.header.querySelector('.ref-spacer');
          if (spacer) spacer.remove();
        },
        'frame.body': () => (_c) => {
          const { util } = _c;
          const board = util.el('div', 'ds-board', document.body);
          const head = util.el('div', 'ds-head', board);
          util.el('div', 'ds-title', head, 'Shipping Details');
          util.el('div', 'ds-tab', head, 'New Delivery Address');
          const body = util.el('div', 'ds-panel ref-body', board);
          Object.assign(_c, { body });
        },
        'frame.panel': (base) => (_c) => {
          base(_c);
          const panel = _c.body.querySelector('.ref-panel');
          if (panel) {
            panel.querySelector('.ref-panel-title').remove();
            panel.classList.add('ds-instruction-panel');
            instructionStyle(panel.querySelector('.ref-panel-text'), 'panel', _c.util);
            _c.header.append(panel);
          }
        },
        'frame.stage': () => (_c) => {
          const { body, headerTools, submit, util } = _c;
          const stage = util.el('main', 'ds-stage', body);
          const btns = util.el('div', 'ds-btns', body);
          const clear = util.el('button', 'ds-clear', btns, 'Clear');
          clear.type = 'button';
          clear.addEventListener('click', () => {
            if (env.widgetDef.clear) env.widgetDef.clear();
          });
          if (submit) {
            submit.classList.add('ds-submit');
            btns.append(submit);
          }
          // The template's inert tools belong in this design's footer.
          headerTools.remove();
          Object.assign(_c, { stage, btns });
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          const note = document.querySelector('.ref-note');
          if (note) {
            note.classList.add('ds-instruction-toast');
            instructionStyle(note.querySelector('.ref-note-text'), 'toast', _c.util);
            _c.header.append(note);
          }
        },
        'frame.footer': (base) => (_c) => {
          base(_c);
          const { decoyBtn, headerTools, submit, util, word } = _c;
          const foot = document.querySelector('.ref-foot') || util.el('footer', 'ref-foot', document.body);
          foot.classList.add('ds-footer');
          const text = foot.querySelector('.ref-foot-text');
          if (text) text.remove();
          const crumbs = util.el('div', 'ds-crumbs', foot);
          foot.prepend(crumbs);
          util.el('span', '', crumbs, 'Delivery');
          util.el('i', '', crumbs, '›');
          util.el('b', '', crumbs, 'Address');
          util.el('i', '', crumbs, '›');
          util.el('span', '', crumbs, 'Confirm');
          const tools = foot.querySelector('.ref-tools') || util.el('div', 'ref-tools', foot);
          tools.classList.add('ds-footer-tools');
          tools.prepend(...headerTools.children);
          tools.querySelectorAll('.ref-xtra').forEach((el) => el.classList.add('ds-xtra'));
          if (submit) submit.classList.add(submit.matches('.ref-endlink') ? 'ds-endlink' : 'ds-submit');
          const links = util.el('div', 'ds-links', foot);
          decoyBtn(links, word ? word('help') : 'Help');
          util.el('i', '', links, '|');
          decoyBtn(links, word ? word('cancel') : 'Cancel');
          links.querySelectorAll('button').forEach((el) => el.classList.add('ds-xtra'));
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          const dock = document.querySelector('.ref-float-dock');
          if (dock) {
            _c.submit.classList.add('ds-submit');
            _c.btns.append(_c.submit);
            dock.remove();
          }
        },
      },
    },
  });
})();
