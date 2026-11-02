// Academic hypertext shell on the shared site frame; task mechanics live in the widget.
(function () {
  'use strict';

  const PAPER = { bg: '#fff', panel: '#fff', fg: '#000', muted: '#000', line: '#999' };

  function link(util, parent, text) {
    const b = util.el('button', 'link', parent, text);
    b.type = 'button';
    b.onclick = () => env.log('link', { label: text });
    return b;
  }

  function subscripts(util, el) {
    const text = el.textContent;
    if (!/ΔE(?:00|₀₀)/.test(text)) return;
    el.textContent = '';
    for (const part of text.split(/(ΔE(?:00|₀₀))/)) {
      if (/^ΔE(?:00|₀₀)$/.test(part)) {
        el.append('ΔE');
        util.el('sub', '', el, '00');
      } else el.append(part);
    }
  }

  function briefingNote(_c, note, text, mode) {
    const { aside, briefingText, util } = _c;
    note.classList.add('task-note');
    if (mode) note.classList.add('instruction-' + mode);
    text.classList.add('instruction');
    subscripts(util, text);
    aside.insertBefore(note, briefingText);
    const rule = util.el('hr', 'rule');
    note.after(rule);
  }

  function styleControls(parent) {
    for (const b of parent.querySelectorAll('.ref-xtra')) b.classList.add('nav-xtra');
    for (const b of parent.querySelectorAll('[data-role="submit"]')) {
      if (b.classList.contains('ref-endlink')) b.classList.add('end-link');
      else if (parent.classList.contains('actions')) b.classList.add('btn', 'submit');
      else b.classList.add('nav-end');
    }
  }

  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The permanent briefing column fits all modes, including small viewports.
      _c.display = _c.ctx.display || 'header';
      document.body.className = 'design academic';
    },
    'frame.header': () => (_c) => {
      const { ctx, util } = _c;
      const shell = util.el('div', 'shell', document.body);
      const aside = util.el('aside', 'briefing', shell);
      const head = util.el('h1', 'doc-title', aside);
      link(util, head, 'Color Matching Task');
      util.el('hr', 'rule', aside);
      const briefingText = util.el('div', 'briefing-text', aside);
      if (ctx.display !== 'hidden') {
        util.el('p', '', briefingText, 'Use the color picker on the right to adjust the color. Drag the hue slider or move the handle within the square to explore the available colors.');
        util.el('p', '', briefingText, 'The Current swatch shows the color from your picker. The numeric display shows its hue, saturation, value and RGB components.');
      }
      const links = util.el('div', 'briefing-links', aside);
      for (const text of ['What is ΔE₀₀?', 'Color vision help', 'Use this task', 'Accessibility']) {
        subscripts(util, link(util, links, text));
      }
      const body = util.el('div', 'workspace ref-body', shell);
      const header = util.el('nav', 'nav', body);
      Object.assign(_c, { aside, body, briefingText, header, links });
    },
    'frame.nav': () => (_c) => {
      const { header, util } = _c;
      const left = util.el('div', 'nav-left', header);
      ['Home', 'Tasks', 'Help'].forEach((text, i) => {
        if (i) util.el('span', 'sep', left, '|');
        link(util, left, text);
      });
      link(util, header, 'Sign in');
    },
    'frame.instruction': (base) => (_c) => {
      base({ ..._c, header: _c.aside });
      const text = _c.aside.querySelector('.ref-instruction');
      if (text) {
        const note = _c.util.el('section', '', _c.aside);
        note.append(text);
        briefingNote(_c, note, text);
      }
      _c.aside.querySelector('.ref-spacer')?.remove();
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      styleControls(_c.header);
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.aside });
      const panel = _c.aside.querySelector('.ref-panel');
      if (panel) {
        panel.querySelector('.ref-panel-title').remove();
        briefingNote(_c, panel, panel.querySelector('.ref-panel-text'), 'panel');
      }
    },
    'frame.stage': () => (_c) => {
      const { body, util } = _c;
      const stage = util.el('main', 'stage', body);
      stage.dataset.role = 'stage';
      const actions = util.el('div', 'actions', body);
      for (const text of ['Reset', 'Random Color']) {
        const b = util.el('button', 'btn', actions, text);
        b.type = 'button';
        b.dataset.action = text === 'Reset' ? 'reset' : 'random-color';
        b.onclick = () => env.log('action', { label: text });
      }
      Object.assign(_c, { actions, stage });
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (note) {
        note.setAttribute('role', 'status');
        note.querySelector('.ref-note-x').classList.add('note-close');
        briefingNote(_c, note, note.querySelector('.ref-note-text'), 'toast');
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.querySelector('.ref-foot');
      if (foot) {
        // Only the control row belongs in this design's footer.
        _c.actions.append(foot.querySelector('.ref-tools'));
        foot.remove();
        if (_c.placement === 'link') _c.links.append(_c.submit);
        styleControls(_c.actions);
        styleControls(_c.links);
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) {
        _c.actions.append(_c.submit);
        dock.remove();
        styleControls(_c.actions);
      }
    },
  };

  env.site({
    name: 'design-pick-color-swatch-06',
    template: 'site/base',
    styles: ['templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { academic: PAPER }, LOW_THEME: PAPER,
      ACCENTS: ['#0000ee'], LOW_ACCENTS: ['#0000ee'], LANGS: ['en'],
      parts,
    },
  });
})();
