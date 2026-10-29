(function () {
  'use strict';
  // Static display lettering for the three section wordmarks. Task text stays native text.
  function displayHeading(u, tag, cls, parent, label) {
    const letters = {
      A: [32, 'M8 0H24L32 100H20L18.5 80H12.5L11 100H0ZM14 66H18L16 25Z'],
      C: [
        30,
        'M30 13V36H18V15Q18 12 15 12Q12 12 12 15V85Q12 88 15 88Q18 88 18 85V61H30V87Q30 100 15 100Q0 100 0 87V13Q0 0 15 0Q30 0 30 13Z',
      ],
      D: [31, 'M0 0H17Q31 0 31 14V86Q31 100 17 100H0ZM12 12V88H15Q19 88 19 84V16Q19 12 15 12Z'],
      E: [26, 'M0 0H26V12H12V39H23V51H12V88H26V100H0Z'],
      F: [26, 'M0 0H26V12H12V40H23V52H12V100H0Z'],
      I: [12, 'M0 0H12V100H0Z'],
      K: [32, 'M0 0H12V40L20 0H32L21 49L32 100H20L12 57V100H0Z'],
      L: [25, 'M0 0H12V88H25V100H0Z'],
      N: [31, 'M0 0H12L21 58L19 0H31V100H19L10 40L12 100H0Z'],
      O: [
        30,
        'M15 0Q30 0 30 13V87Q30 100 15 100Q0 100 0 87V13Q0 0 15 0ZM15 12Q13 12 13 15V85Q13 88 15 88Q17 88 17 85V15Q17 12 15 12Z',
      ],
      P: [30, 'M0 0H17Q30 0 30 14V44Q30 58 17 58H12V100H0ZM12 12V46H15Q18 46 18 42V16Q18 12 15 12Z'],
      R: [
        31,
        'M0 0H17Q31 0 31 14V44Q31 53 25 56Q31 58 31 70V93L32 100H19Q18 96 18 91V68Q18 62 12 62V100H0ZM13 12V46H15Q17 46 17 42V16Q17 12 15 12Z',
      ],
      S: [
        30,
        'M30 13V40H18V15Q18 12 15 12Q12 12 12 15V30Q12 38 16 42L24 51Q30 58 30 69V87Q30 100 15 100Q0 100 0 87V60H12V85Q12 88 15 88Q18 88 18 85V73Q18 66 14 62L6 53Q0 46 0 33V13Q0 0 15 0Q30 0 30 13Z',
      ],
      T: [32, 'M0 0H32V12H22V100H10V12H0Z'],
      U: [30, 'M0 0H13V85Q13 88 15 88Q17 88 17 85V0H30V87Q30 100 15 100Q0 100 0 87Z'],
      Y: [32, 'M0 0H12L16 39L20 0H32L23 64V100H9V64Z'],
    };
    const node = u.el(tag, cls, parent);
    node.setAttribute('aria-label', label);
    let x = 0;
    const shapes = [];
    for (const ch of label) {
      if (ch === ' ') {
        x += 14;
        continue;
      }
      const [w, d] = letters[ch];
      shapes.push('<path transform="translate(' + x + ' 0)" d="' + d + '"/>');
      x += w + 2.2;
    }
    node.innerHTML =
      '<svg aria-hidden="true" focusable="false" viewBox="0 0 ' +
      (x - 2.2) +
      ' 100" preserveAspectRatio="none" fill="currentColor" fill-rule="evenodd">' +
      shapes.join('') +
      '</svg>';
    return node;
  }
  const palette = {
    bg: '#f6f8fd', panel: '#ffffff', fg: '#0b1f44', accent: '#0b57e3',
    font: "Roboto,'Helvetica Neue',Arial,sans-serif", line: '#dfe5f0', muted: '#5d6b82',
  };

  env.site({
    name: 'design-use-shop-search-03',
    template: 'site/base',
    langs: ['en'],
    design: {
      THEMES: { kinetic: palette },
      LOW_THEME: palette,
      ACCENTS: [palette.accent],
      LOW_ACCENTS: [palette.accent],
      parts: {
        'frame.layout': (base) => (_c) => {
          base(_c);
          document.body.className = 'kinetic instruction-' + _c.display;
        },
        'frame.header': () => (_c) => {
          const { util: u } = _c;
          const shell = u.el('div', 'site-shell', document.body);
          const body = u.el('div', 'design-body ref-body', shell);
          const brief = u.el('aside', 'brief', body);
          const top = u.el('div', 'brief-top', brief);
          u.el('span', 'eyebrow', top, 'TASK BRIEF');
          u.el('span', 'brief-count', top, '1 / 1');
          displayHeading(u, 'h1', 'display blue', brief, 'YOUR TASK');
          u.el('div', 'brief-bar', brief);
          const header = u.el('div', 'work', body);
          u.el('div', 'eyebrow work-eyebrow', header, 'PEOPLE SEARCH');
          displayHeading(u, 'h1', 'display navy', header, 'FIND PEOPLE');
          u.el('span', 'result-count', header, '0 RESULTS');
          const footer = u.el('footer', 'design-footer', shell);
          displayHeading(u, 'div', 'display actions-title', footer, 'ACTIONS');
          u.el('div', 'actions-rule', footer);
          const mid = u.el('div', 'actions-text', footer);
          Object.assign(_c, { shell, body, brief, header, footer, mid });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => (_c) => {
          if (_c.display !== 'header') return;
          const note = _c.util.el('section', 'task-note', _c.brief);
          note.dataset.role = 'instruction';
          base({ ..._c, header: note });
          note.firstElementChild.classList.add('food-task');
        },
        'frame.tools': (base) => (_c) => {
          base(_c);
          // Header end controls keep the original compact position beside the wordmark.
          if (_c.submit) _c.submit.classList.add('end-control', 'end-header');
          // Decorative tools belong in the action bar, away from search controls.
          for (const decoy of _c.headerTools.querySelectorAll('.ref-xtra')) {
            decoy.classList.add('end-xtra');
            _c.footer.append(decoy);
          }
        },
        'frame.body': () => () => {},
        'frame.panel': (base) => (_c) => {
          const { util: u, brief, display } = _c;
          base({ ..._c, body: brief });
          const panel = brief.querySelector('.ref-panel');
          if (panel) {
            panel.classList.add('task-note');
            panel.dataset.role = 'instruction';
            panel.querySelector('.ref-panel-title').classList.add('panel-caption');
            panel.querySelector('.ref-panel-text').classList.add('food-task');
          }
          if (display !== 'toast') {
            const steps = u.el('ol', 'brief-steps', brief);
            for (const text of [
              'Use the search box on the right.',
              'Find the correct person in the results.',
              'Open a result to view more details.',
            ]) u.el('span', '', u.el('li', '', steps), text);
          }
        },
        'frame.stage': () => (_c) => {
          _c.stage = _c.util.el('main', 'stage', _c.header);
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          const note = document.querySelector('.ref-note');
          if (!note) return;
          note.classList.add('task-note');
          note.dataset.role = 'instruction';
          const text = note.querySelector('.ref-note-text');
          text.classList.add('food-task');
          const caption = _c.util.el('div', 'toast-caption', null, 'TASK NOTIFICATION');
          text.prepend(caption);
          _c.mid.append(note);
        },
        'frame.footer': (base) => (_c) => {
          const { ctx, util: u, footer, mid, label, display, decoyBtn } = _c;
          if (display !== 'toast') {
            u.el('span', '', mid, 'Complete the task above');
            u.el('br', '', mid);
            const line = u.el('span', '', mid, ctx.finish ? 'and finish when ready' : 'and click ');
            if (!ctx.finish) u.el('b', '', line, label);
            line.append('.');
          }
          decoyBtn(footer, 'Clear');
          footer.lastElementChild.classList.add('clear-btn');
          base(_c);
          const foot = document.querySelector('.ref-foot');
          if (foot) {
            for (const control of foot.querySelector('.ref-tools').children) {
              control.classList.add(control.dataset.role === 'submit' ? 'end-control' : 'end-xtra');
            }
            footer.append(...foot.querySelector('.ref-tools').children);
            foot.remove();
          }
          if (_c.submit && _c.placement === 'link') _c.submit.classList.add('end-link');
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          const dock = document.querySelector('.ref-float-dock');
          if (dock) {
            _c.footer.append(dock);
            _c.submit.classList.add('end-control');
          }
        },
      },
    },
  });
})();
