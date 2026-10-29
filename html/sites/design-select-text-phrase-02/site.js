// White and mint reading frame on the shared site template.
(function () {
  'use strict';

  const PALETTE = {
    bg: '#ffffff', panel: '#ffffff', fg: '#111820', muted: '#657080', line: '#c9cfd5',
  };

  function drawHeader(u, head) {
    const ic = u.svg('svg', { class: 'app-icon', width: 46, height: 54, viewBox: '6 4 36 47', fill: 'none' }, head);
    u.svg('path', { d: 'M6 4H28L42 18V48Q42 51 39 51H9Q6 51 6 48Z', fill: '#bfe8d0' }, ic);
    u.svg('path', { d: 'M28 4V18H42Z', fill: '#8fd3b0' }, ic);
    u.svg('path', { d: 'M6 48L35 44V11L42 18V48Q42 51 39 51H9Q6 51 6 48Z', fill: '#76cda6', opacity: 0.7 }, ic);
    for (const y of [26, 33, 40])
      u.svg('rect', { x: 13, y, width: y === 33 ? 14 : 20, height: 3, rx: 1.5, fill: '#5fb78c' }, ic);
    const tt = u.el('div', 'titles', head);
    u.el('div', 'title', tt, 'Text Selection Task');
    u.el('div', 'subtitle', tt, 'Read the passage below and follow the instruction.');
    const help = u.el('button', 'help', head);
    help.type = 'button';
    const hs = u.svg(
      'svg',
      { width: 26, height: 26, viewBox: '0 0 26 26', fill: 'none', stroke: '#667', 'stroke-width': 1.5 },
      help,
    );
    u.svg('circle', { cx: 13, cy: 13, r: 11 }, hs);
    u.svg(
      'path',
      { d: 'M9.8 10.5Q10 7.5 13 7.5Q16 7.5 16 10.2Q16 12 13.5 13.2V15', 'stroke-linecap': 'round' },
      hs,
    );
    u.svg('circle', { cx: 13.3, cy: 18.2, r: 0.9, fill: '#667', stroke: 'none' }, hs);
    u.el('span', '', help, 'Help');
    help.onclick = () => env.log('decoy', { label: 'Help' });
  }

  function decorateInstruction(u, note, instruction) {
    instruction.className = 'instruction';
    const text = instruction.textContent;
    const pieces = text.split(/["“”]/);
    if (pieces.length === 3) {
      instruction.replaceChildren(pieces[0]);
      u.el('strong', '', instruction, pieces[1]);
      instruction.append(pieces[2]);
    }
    const badge = u.el('div', 'cursor-badge');
    note.prepend(badge);
    const icon = u.svg('svg', { width: 30, height: 30, viewBox: '0 0 30 30' }, badge);
    u.svg('path', {
      d: 'M8 3L8 24L13 19.5L16.5 27L20 25.5L16.6 18.3L23 17.5Z',
      fill: '#1f8a5b', stroke: '#1f8a5b', 'stroke-linejoin': 'round', 'stroke-width': 1.5,
    }, icon);
  }

  env.site({
    name: 'design-select-text-phrase-02',
    template: 'site/base',
    styles: ['frame-support.css', 'ref.css'],
    design: {
      THEMES: { light: PALETTE },
      LOW_THEME: PALETTE,
      ACCENTS: ['#5fc196'],
      LOW_ACCENTS: ['#5fc196'],
      parts: {
        'frame.theme': (base) => (_c) => {
          base(_c);
          document.body.className = 'design strip layout-three';
          _c.root.style.setProperty('--font', 'Helvetica Neue, Helvetica, Arial, sans-serif');
        },
        'frame.layout': (base) => (_c) => {
          base(_c);
          // This frame has an in-flow instruction toast even at the smallest viewport.
          if (_c.ctx.display === 'toast') _c.display = 'toast';
          document.body.classList.toggle('has-instruction-toast', _c.display === 'toast');
        },
        'frame.placement': (base) => (_c) => {
          base(_c);
          // The design always reserves its bottom action strip.
          _c.wantFooter = true;
        },
        'frame.header': () => (_c) => {
          const shell = _c.util.el('div', 'shell', document.body);
          const header = _c.util.el('header', 'head', shell);
          drawHeader(_c.util, header);
          const body = _c.util.el('div', 'content ref-body', shell);
          Object.assign(_c, { shell, header, body });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => (_c) => {
          base({ ..._c, header: _c.body });
          _c.body.querySelector('.ref-spacer')?.remove();
          const instruction = _c.body.querySelector('.ref-instruction');
          if (instruction) {
            const note = _c.util.el('section', 'task-note', _c.body);
            note.append(instruction);
            decorateInstruction(_c.util, note, instruction);
          }
        },
        'frame.controls': (base) => (_c) => {
          base(_c);
          const { decoyBtn, endBtn } = _c;
          _c.decoyBtn = (parent, text, collides) => {
            decoyBtn(parent, text, collides);
            parent.lastElementChild.className = 'end-xtra';
          };
          _c.endBtn = (parent, cls, text) => {
            const button = endBtn(parent, cls, text);
            button.className = 'submit end-' + (
              _c.header.contains(parent) ? 'header' : cls === 'ref-endlink' ? 'footer-link' : 'footer'
            );
            if (cls.includes('ref-icon')) button.classList.add('end-icon');
            // A text link must keep the passage's native selection when pressed.
            if (button.tagName === 'A') button.addEventListener('pointerdown', (e) => {
              if (e.button === 0) e.preventDefault();
            });
            return button;
          };
        },
        'frame.body': () => () => {},
        'frame.panel': (base) => (_c) => {
          base(_c);
          const panel = _c.body.querySelector('.ref-panel');
          if (panel) {
            _c.body.classList.remove('ref-panel-right');
            _c.body.classList.add('instruction-panel');
            panel.className = 'task-note panel-note';
            panel.querySelector('.ref-panel-title').remove();
            decorateInstruction(_c.util, panel, panel.querySelector('.ref-panel-text'));
          }
        },
        'frame.stage': () => (_c) => {
          _c.stage = _c.util.el('main', 'stage', _c.body);
          _c.stage.dataset.role = 'stage';
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          const note = document.querySelector('.ref-note');
          if (note) {
            note.className = 'task-note instruction-toast';
            note.querySelector('.ref-note-x').className = 'note-close';
            decorateInstruction(_c.util, note, note.querySelector('.ref-note-text'));
            _c.body.append(note);
          }
        },
        'frame.footer': (base) => (_c) => {
          base(_c);
          const footer = document.querySelector('.ref-foot');
          footer.className = 'footer';
          footer.querySelector('.ref-foot-text').remove();
          _c.shell.append(footer);
          const clear = _c.util.el('button', 'cancel-btn', null, 'Clear Selection');
          clear.type = 'button';
          clear.onclick = () => env.widgetDef.clear?.();
          footer.prepend(clear);
          _c.footer = footer;
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          // Use the reserved action strip so a floating control cannot cover selected text.
          const dock = document.querySelector('.ref-float-dock');
          if (dock) _c.footer.append(dock);
        },
      },
    },
  });
})();
