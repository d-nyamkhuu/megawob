// Newspaper design on site/base; shared episode behavior stays in the template.
(function () {
  'use strict';

  const palette = {
    bg: '#fbfaf6', panel: '#fdfcf9', fg: '#161412',
    accent: '#b3191e', line: '#c9c6bf', muted: '#6b6762',
  };

  function newspaperNote(note, text, util) {
    note.classList.add('task-note');
    note.dataset.role = 'instruction';
    text.textContent = '';
    const p = util.el('p', '', text);
    const instruction = note.dataset.instruction;
    if (instruction.length > 90) p.className = 'long-instruction';
    for (const part of instruction.split(/(@[\w]+)/g)) {
      util.el('span', part.startsWith('@') ? 'instruction-handle' : '', p, part);
    }
    delete note.dataset.instruction;
  }

  env.site({
    name: 'design-use-social-feed-one-03',
    template: 'site/base',
    styles: ['templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { light: palette, dark: palette, warm: palette },
      LOW_THEME: palette,
      ACCENTS: [palette.accent],
      LOW_ACCENTS: [palette.accent],
      parts: {
        'frame.layout': (base) => (_c) => {
          base(_c);
          document.body.className = 'bottom instruction-' + _c.display;
        },
        'frame.header': () => (_c) => {
          const { util } = _c;
          const shell = util.el('div', 'site-shell', document.body);
          const header = util.el('header', 'design-header', shell);
          const brand = util.el('div', 'design-brand', header);
          util.el('span', 'mast', brand, 'The Daily Chronicle');
          const tag = util.el('div', 'mast-tag', brand);
          for (const text of ['NEWS', 'PEOPLE', 'A BRIGHTER TOMORROW']) util.el('div', '', tag, text);
          const right = util.el('div', 'mast-right', header);
          const dateLine = util.el('div', 'mast-date-line', right);
          util.el('div', 'mast-date', dateLine, 'Monday, May 16, 2011');
          Object.assign(_c, { shell, header, right, dateLine });
        },
        'frame.nav': () => (_c) => {
          const { util, right } = _c;
          const nav = util.el('nav', 'design-nav', right);
          ['Home', 'World', 'Business', 'Lifestyle', 'Opinion'].forEach((label, i) => {
            if (i) util.el('span', 'sep', nav, '|');
            const a = util.el('a', '', nav, label);
            a.dataset.role = 'nav';
            a.addEventListener('click', () => env.log('decoy', { what: label }));
          });
        },
        'frame.controls': (base) => (_c) => {
          base(_c);
          const { endBtn, decoyBtn } = _c;
          _c.endBtn = (parent, cls, text) => {
            const control = endBtn(parent, cls, text);
            control.classList.add('end-control');
            if (cls === 'ref-endlink') control.classList.add('end-link');
            if (parent.closest('.design-header')) control.classList.add('end-header');
            return control;
          };
          _c.decoyBtn = (parent, text, collides) => {
            decoyBtn(parent, text, collides);
            parent.lastElementChild.classList.add('chrome-xtra');
          };
        },
        'frame.tools': (base) => (_c) => {
          base(_c);
          _c.dateLine.append(_c.headerTools);
        },
        frameSidebar: () => () => {},
        'frame.body': (base) => (_c) => {
          base(_c);
          const { body, ctx, header, shell, util } = _c;
          body.classList.add('design-body');
          shell.append(body);
          const note = header.querySelector('.ref-instruction');
          if (note) {
            body.append(note);
            note.dataset.instruction = ctx.instruction;
            newspaperNote(note, note, util);
          }
          header.querySelector('.ref-spacer')?.remove();
          // The widget updates this status even though this design hides the detail block.
          const hidden = util.el('div', '', body);
          hidden.hidden = true;
          const fields = util.el('dl', 'task-detail-fields', hidden);
          for (const [label, value] of [
            ['Action:', 'Use the requested post action.'], ['Target Author:', ''],
            ['Post Starts With:', ''], ['Status:', 'Not completed'],
          ]) {
            util.el('dt', '', fields, label);
            util.el('dd', 'detail-' + label.split(':')[0].replaceAll(' ', '-').toLowerCase(), fields, value);
          }
        },
        'frame.panel': (base) => (_c) => {
          base(_c);
          const note = _c.body.querySelector('.ref-panel');
          if (note) {
            note.querySelector('.ref-panel-title').classList.add('note-heading');
            note.dataset.instruction = _c.ctx.instruction;
            newspaperNote(note, note.querySelector('.ref-panel-text'), _c.util);
          }
        },
        'frame.stage': (base) => (_c) => {
          base(_c);
          _c.stage.classList.add('stage');
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          const note = document.querySelector('.ref-note');
          if (note) {
            _c.body.append(note);
            note.dataset.instruction = _c.ctx.instruction;
            newspaperNote(note, note.querySelector('.ref-note-text'), _c.util);
            const heading = _c.util.el('h2', 'note-heading', note, 'News desk notification');
            note.prepend(heading);
          }
        },
        'frame.footer': (base) => (_c) => {
          base(_c);
          const { shell, util } = _c;
          const footer = document.querySelector('.ref-foot') || util.el('footer', 'ref-foot');
          footer.classList.add('design-footer');
          footer.querySelector('.ref-foot-text')?.remove();
          const links = util.el('nav', 'foot-links', footer);
          ['Help', 'Terms', 'Privacy', 'Contact'].forEach((label, i) => {
            if (i) util.el('span', 'sep', links, '|');
            util.el('span', '', links, label);
          });
          footer.prepend(links);
          const tools = footer.querySelector('.ref-tools') || util.el('div', 'ref-tools', footer);
          tools.classList.add('footer-tools');
          shell.append(footer);
          Object.assign(_c, { footerTools: tools });
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          const dock = document.querySelector('.ref-float-dock');
          if (dock) _c.footerTools.append(dock);
        },
      },
    },
  });
})();
