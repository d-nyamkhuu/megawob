// The dark date-range frame, using the base template's controls and perturbations.
(function () {
  'use strict';

  const palette = {
    bg: '#10151a', panel: '#161c22', fg: '#e6eaf0',
    accent: '#a9f576', muted: '#818a9b', line: '#2a323b',
  };

  function instructionStyle(el, util) {
    el.classList.add('ds-instruction');
    const text = el.textContent;
    el.textContent = '';
    text.split(/(date range)/i).forEach((part, i) => {
      if (i % 2) util.el('em', '', el, part);
      else el.append(document.createTextNode(part));
    });
  }

  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This frame stacks its briefing above the calendars even in panel mode.
      _c.display = _c.ctx.display;
    },
    'frame.header': () => (_c) => {
      const { util } = _c;
      const header = util.el('header', 'ds-top', document.body);
      util.el('span', 'ds-brand', header, 'Date Range Selection');
      _c.header = header;
    },
    'frame.nav': () => () => {},
    'frame.controls': (base) => (_c) => {
      base(_c);
      const { endBtn, decoyBtn } = _c;
      _c.endBtn = (parent, cls, text) => {
        const button = endBtn(parent, cls, text);
        button.classList.add(cls === 'ref-endlink' ? 'ds-endlink' : 'ds-submit');
        return button;
      };
      _c.decoyBtn = (parent, text, collides) => {
        decoyBtn(parent, text, collides);
        parent.lastElementChild.classList.add('ds-xtra');
      };
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      const { headerTools: tools, util, submit } = _c;
      tools.classList.add('ds-tools');
      const tz = util.el('span', 'ds-tz', null, 'UTC');
      tz.insertAdjacentHTML('beforeend',
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>');
      const moon = util.el('span', 'ds-moon');
      moon.insertAdjacentHTML('beforeend',
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/></svg>');
      tools.prepend(tz, moon);
      if (submit) submit.classList.add('ds-header-submit');
    },
    'frame.body': () => (_c) => {
      const { util, header } = _c;
      const shell = util.el('div', 'ds-body', document.body);
      const rail = util.el('aside', 'ds-rail', shell);
      ['Dates', 'Details', 'Review', 'Submit'].forEach((label, i) => {
        const item = util.el('div', 'ds-ri' + (i === 0 ? ' on' : ''), rail);
        util.el('span', 'ds-rn', item, '0' + (i + 1));
        util.el('span', 'ds-rl', item, label);
      });
      const content = util.el('div', 'ds-content', shell);
      const instruction = header.querySelector('.ref-instruction');
      if (instruction) {
        const note = util.el('aside', 'ds-header-note', content);
        instructionStyle(instruction, util);
        note.append(instruction);
      }
      const body = util.el('div', 'ds-main', content);
      Object.assign(_c, { body, contentEl: content });
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        instructionStyle(panel.querySelector('.ref-panel-text'), _c.util);
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display !== 'toast') return;
      const note = document.querySelector('.ref-note');
      note.classList.add('ds-toast');
      instructionStyle(note.querySelector('.ref-note-text'), _c.util);
      _c.contentEl.insertBefore(note, _c.body);
    },
    'frame.footer': (base) => (_c) => {
      const { util, contentEl } = _c;
      const info = util.el('div', 'ds-info', contentEl);
      info.insertAdjacentHTML('beforeend',
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="9.5"/><path d="M12 11v6M12 7.5v.5"/></svg>');
      util.el('span', 'ds-helper', info, 'Choose a start date, then an end date, from the calendars.');
      // Keep the Clear action's footer even when the end control is elsewhere.
      _c.wantFooter = true;
      base(_c);
      const foot = document.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      foot.querySelector('.ref-foot-text').remove();
      const clear = util.el('button', 'ds-clear', null, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => {
        if (env.widgetDef.clear) env.widgetDef.clear();
      });
      foot.prepend(clear);
      contentEl.append(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) _c.foot.append(dock);
    },
  };

  env.site({
    name: 'design-set-date-range-04',
    template: 'site/base',
    langs: ['en'],
    design: {
      THEMES: { dark: palette },
      LOW_THEME: palette,
      ACCENTS: [palette.accent],
      LOW_ACCENTS: [palette.accent],
      parts,
    },
  });
})();
