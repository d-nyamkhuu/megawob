// Full-bleed word board: visual sections on the shared site frame.
(function () {
  'use strict';

  function headline(_c, parent) {
    const { ctx, util: u } = _c;
    const hd = u.el('div', 'ds-hl', parent);
    u.el('div', 'ds-eyebrow', hd, 'TEXT ANALYSIS');
    const h = u.el('div', 'ds-big', hd);
    const svg = u.svg('svg', {
      viewBox: '0 0 1440 260', preserveAspectRatio: 'none', 'aria-label': 'FIND THE RIGHT WORD',
    }, h);
    u.svg('text', { x: 0, y: 232, textLength: 600, lengthAdjust: 'spacingAndGlyphs' }, svg).textContent = 'FIND THE';
    u.svg('text', {
      x: 650, y: 232, textLength: 775, lengthAdjust: 'spacingAndGlyphs', class: 'ds-blue',
    }, svg).textContent = 'RIGHT WORD';
    const side = u.el('div', 'ds-side', hd);
    ['READ', 'COUNT', ctx.spec.answerBy === 'reply' ? 'REPLY' : 'TYPE', 'SUBMIT'].forEach((t, i) =>
      u.el('div', i === 2 ? 'on' : '', side, t));
  }

  function quickAction(_c, foot) {
    const qa = _c.util.el('button', 'ds-quick', foot);
    qa.type = 'button';
    qa.disabled = true;
    qa.innerHTML = '<svg width="26" height="30" viewBox="0 0 24 28" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M14 2 3 16h8l-2 10 12-15h-8z"/></svg><span><b>Quick action</b><i>Temporarily unavailable</i></span>';
  }

  const palette = { bg: '#0e203c', panel: '#f1f4f9', fg: '#0c1e3e', muted: '#6b7690', line: '#7f9cdc' };
  const parts = {
    'frame.header': () => (_c) => {
      const { util: u } = _c;
      const header = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', header, 'WORD TASK');
      const topMid = u.el('div', 'ds-topmid', header);
      u.el('span', 'ds-topr', header, 'FOCUS × FIND × SUBMIT');
      Object.assign(_c, { header, topMid });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base({ ..._c, header: _c.topMid });
      const instruction = _c.topMid.querySelector('.ref-instruction');
      if (instruction) {
        _c.topMid.classList.add('ds-header-note');
        instruction.classList.add('ds-instruction');
      }
    },
    'frame.body': () => (_c) => {
      const { util: u, display } = _c;
      const body = u.el('div', 'ds-body ref-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const main = u.el('div', `ds-main${display === 'panel' ? ' ds-panel' : ''}`, content);
      headline(_c, main);
      Object.assign(_c, { body, content, main });
    },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.main });
      const panel = _c.main.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note, _c.main);
      }
    },
    'frame.footer': (base) => (_c) => {
      const { ctx, content, util: u } = _c;
      const foot = u.el('footer', 'ds-footer', content);
      if (!ctx.finish) quickAction(_c, foot);
      const bar = u.el('div', 'ds-bar', content);
      u.el('span', '', bar, 'WORD UTILITY');
      u.el('span', '', bar, 'STAY FOCUSED  —  1 TASK');
      base(_c);
      const inherited = document.querySelector('.ref-foot');
      if (inherited) {
        const tools = inherited.querySelector('.ref-tools');
        (_c.placement === 'link' ? bar : foot).append(tools);
        inherited.remove();
      }
      Object.assign(_c, { foot, bar });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) _c.foot.append(dock);
    },
    'frame.end': (base) => (_c) => {
      for (const b of document.querySelectorAll('.ref-xtra')) b.classList.add('ds-xtra');
      const { submit, placement, util: u } = _c;
      if (submit) {
        const large = placement === 'footer' || placement === 'floating';
        submit.classList.add(large ? 'ds-submit' : placement === 'link' ? 'ds-end-link' : 'ds-end-header');
        if (large) {
          submit.textContent = '';
          u.el('span', '', submit, _c.label);
          u.el('span', 'ds-arrow', submit, '→');
        }
      }
      return base(_c);
    },
  };

  env.site({
    name: 'design-find-fact-find-word-12',
    template: 'site/base',
    styles: ['templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'site.css'],
    design: {
      LANGS: ['en'],
      THEMES: { board: palette }, LOW_THEME: palette,
      ACCENTS: ['#287bff'], LOW_ACCENTS: ['#287bff'],
      parts,
    },
  });
})();
